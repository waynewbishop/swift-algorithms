---
layout: field-notes
title: "Chapter 15: Hash Tables"
description: "Implement hash tables in Swift with chaining, load factors, and collision resolution strategies"
---
# Hash Tables

Hash tables solve a fundamental problem in computer science: how do we store and retrieve data in `O(1)` average time? The answer lies in using a hash function to transform keys into array indices, allowing direct access to stored values.

## Keys and values

Compared to other data structures, linked lists from [Chapter 9](09-linked-lists.md) are flexible but require `O(n)` search time due to sequential traversal, and arrays offer fast indexed access but require knowing the exact position. Hash tables combine the best of both — fast `O(1)` average operations with flexible key-based access. A well-designed hash table achieves constant average time for insertion, deletion, and lookup once a key's hash is computed, making it one of the most efficient data structures available.

iOS apps use hash tables extensively. [UserDefaults](https://developer.apple.com/documentation/foundation/userdefaults) stores app preferences as key-value pairs for instant lookup. HTTP headers in network requests use hash table lookups. Workout tracking apps retrieve today's stats by date using hash calculations instead of iterating through all entries.

## How hashing works

A hash table consists of two essential components: the **hash function**, which transforms keys into array indices, and the **bucket array**, which stores the actual values. The hash function is the heart of any hash table. It takes an input key and produces a numeric hash value that determines where to store the data.

Values are stored in slots called **buckets** within an array, and stored values usually occupy scattered buckets rather than a contiguous run. The hash function determines which bucket to use, enabling direct access without searching through the entire structure. The computed index isn't stored alongside the data — it can be recalculated at any time from the key itself. Swift's own `Dictionary` works the same way; it is a hash table, and the tables we build here are simplified versions of the same idea.

## The Indexable protocol

An interesting question arises when building a generic hash table. Since elements are arranged based on their hash index, how can our algorithm learn to interpret different data types? To manage these requirements, the `Structures` package defines a protocol called `Indexable`:

```swift
// Requires conforming types to provide a numeric hash representation
public protocol Indexable: Hashable {
    var asciiRepresentation: Int {get}
}
```

The `Indexable` protocol extends `Hashable` and requires a single computed property, `asciiRepresentation`, that converts the type's content into an integer for hash table indexing. Equal elements must produce the same integer. Our tables use this property to choose a bucket, so conforming to `Hashable` alone cannot enforce that requirement. Here's how `String` can meet the contract:

```swift
import Foundation

// Computes a hash value by summing canonically normalized Unicode scalar values
extension String: Indexable {
    public var asciiRepresentation: Int {
        var scalarSum: Int = 0
        for scalar in self.precomposedStringWithCanonicalMapping.unicodeScalars {
            scalarSum += Int(scalar.value)
        }
        return scalarSum
    }
}
```

Foundation's `precomposedStringWithCanonicalMapping` gives canonically equivalent strings the same normalized representation before we sum their Unicode scalars. Swift considers a precomposed “é” equal to “e” followed by a combining acute accent. Summing the original scalars would give 233 and 870, sending equal strings to different buckets. Normalizing first gives both strings a sum of 233.

We can check that equality and the hash representation agree:

```swift
let composed = "\u{00E9}"
let decomposed = "e\u{0301}"
composed == decomposed  // true
composed.asciiRepresentation  // 233
decomposed.asciiRepresentation  // 233
```

The string "Swift" is unchanged by normalization. Its scalar values sum to `83 + 119 + 105 + 102 + 116 = 525`. This numeric representation becomes the input to our hash function.

### Educational example

Our `asciiRepresentation` is an educational hash function designed to illustrate the core mechanics of hashing. Because it simply adds character values, any two strings containing the same characters in a different order, such as "ab" and "ba", produce the same sum. Production hash tables use functions that mix every bit of the input so similar keys land in unrelated buckets. Swift's standard library uses [SipHash](https://en.wikipedia.org/wiki/SipHash) with a per-process random seed, which also makes it hard for an attacker to craft keys that all collide. Cryptographic functions like [SHA-256](https://en.wikipedia.org/wiki/SHA-2) pursue a different goal, making it infeasible to find any two inputs with the same output, and they're too slow to be ordinary hash table choices. These algorithms are beyond the scope of this book, but the fundamental principle remains the same: transform input into a numeric index.

Note also that computing `asciiRepresentation` visits every character of the key. Hashing a key of length m therefore costs `O(m)`, and every "constant time" claim in this chapter means constant work after that hash is computed.

## Building a basic hash set

With the `Indexable` protocol in place, we can build our first hash table. `HashSet` is the simplest implementation — it stores elements directly in a fixed number of buckets with no collision handling. When two elements hash to the same index, insertion simply fails:

```swift
// Basic hash table storing unique elements without collision handling
public class HashSet<T: Indexable> {

    // Array of buckets for storing elements
    private var buckets: Array<T?>

    // Creates a new empty hash set with the specified number of buckets
    public init(capacity: Int = 20) {
        precondition(capacity > 0, "HashSet capacity must be greater than zero")
        self.buckets = Array<T?>(repeating: nil, count: capacity)
    }
}
```

The `buckets` array holds optional elements — each position is either `nil` (empty) or contains a single value. A table needs at least one bucket, since the hash function divides by the bucket count, so the initializer rejects a capacity of zero or less. The number of buckets stays fixed for the life of a `HashSet`; we'll see why growing a table takes more care once we handle collisions.

### The hash function

The hash function is where mathematics replaces searching. It takes an element's `asciiRepresentation` and uses the modulo operator to wrap it into a valid bucket index:

```swift
// Computes the hash index for an element using modulo-based hashing
private func hash(_ element: T) -> Int {
    let remainder = element.asciiRepresentation % buckets.count
    return remainder >= 0 ? remainder : remainder + buckets.count
}
```

The modulo operation keeps the result within range regardless of how large the ascii representation is. The string "Swift" with an ascii sum of 525 placed into a 20-bucket table would hash to index `525 % 20 = 5`. One subtlety: Swift's `%` operator keeps the sign of the number being divided, so `-3 % 20` is `-3`, not 17. Our `String` conformance always produces a positive sum, but `Indexable` permits any `Int`, so the second line shifts a negative remainder back into `0..<buckets.count`.

### Inserting elements

With the hash function defined, insertion computes the hash and places the element directly into the corresponding bucket:

```swift
// Inserts an element if its hash index is unoccupied
public func insert(_ element: T) -> Bool {

    //compute hash value
    let hvalue = self.hash(element)

    if buckets[hvalue] == nil {
        buckets[hvalue] = element
        return true
    }

    else {
        //separate chaining..
    }

    return false
}
```

When the bucket is empty, the element is stored. The `else` branch is where collision handling would go — but in `HashSet`, the method simply returns `false`, whether the bucket holds a colliding element or the same element inserted earlier. The comment hints at the solution we'll implement next.

### Finding elements

Looking up an element follows the same pattern — compute the hash and check the corresponding bucket. An occupied bucket isn't enough, though. After inserting "ab", the bucket for "ba" is occupied too, because both strings sum to 195. We must compare the stored element with the one we're looking for:

```swift
// Checks whether an element exists in the hash set
public func contains(_ element: T) -> Bool {

    //compute hash value
    let hvalue = self.hash(element)

    //compare the stored element, not just bucket occupancy
    return buckets[hvalue] == element
}
```

This is why hash tables achieve `O(1)` lookup once the hash is computed. Instead of iterating through every element like a linked list, we compute a single hash value, jump directly to one bucket, and perform a single comparison.

## Discovering collisions

The creation of hash algorithms is considered more art than science. With `HashSet`, our straightforward modulo-based hash function works well until two different inputs produce the same index. Consider what happens when we insert the names "Albert Einstein" and "Andrew Collins" into a table with 20 buckets.

Computing the ascii representation for "Albert Einstein" sums the unicode scalar values of each character to produce 1465. The modulo operation yields `1465 % 20 = 5`. Computing the same for "Andrew Collins" produces a different sum, 1365, but `% 20` also yields 5. Both names hash to the same bucket — a collision. Since `HashSet` stores only one element per bucket, the second insertion fails and returns `false`.

This limitation is not rare. As more elements fill the table, collisions become increasingly likely. We need a strategy that allows multiple elements to share the same bucket index.

## Separate chaining

To handle collisions, we introduce a supporting data structure: a singly-linked list called `Chain`. Each bucket will hold a chain instead of a single element, allowing multiple values at the same index:

```swift
// Singly-linked list for hash table collision resolution
public class Chain<T: Equatable> {

    // Reference to the first node in the chain
    private var head = LLNode<T>()

    // Cached value of the last element for O(1) tail access
    private var lastvalue: T?

    // Creates a new empty chain
    public init() {
        //package support
    }

    // Returns the last value in the chain without traversing
    var last: T? {
        return lastvalue
    }

    // Returns all values stored in the chain as an array
    public var values: Array<T> {
        var current: LLNode? = head
        var results = Array<T>()

        while let item = current {
            if let tvalue = item.tvalue {
                results.append(tvalue)
            }
            current = item.next
        }

        return results
    }
}
```

The `Chain` class uses `LLNode` from [Chapter 9](09-linked-lists.md) to build a forward-linked list. Each node holds a value and a reference to the next node in the chain; a chain only ever walks forward, so it leaves each node's `previous` link unused. The `values` property traverses the entire chain and collects all stored elements into an array.

### Adding and finding chain elements

The chain supports two essential operations — appending new values and checking whether a value exists:

```swift
// Appends a new value to the end of the chain
public func append(_ tvalue: T) {

    guard head.tvalue != nil else {
        head.tvalue = tvalue
        lastvalue = tvalue
        return
    }

    let childToUse = LLNode<T>()
    childToUse.tvalue = tvalue

    var current: LLNode<T> = head

    //find next position - O(n)
    while let item = current.next {
        current = item
    }

    //singly linked - only the forward link is needed
    current.next = childToUse

    lastvalue = tvalue
}

// Checks whether a specific value exists in the chain
public func contains(_ tvalue: T) -> Bool {

    var current: LLNode<T>? = head

    //find possible match - O(n)
    while current != nil {
        if let item = current {
            if let chainValue = item.tvalue {
                if chainValue == tvalue {
                    return true
                }
            }
            current = item.next
        }
    }

    return false
}
```

The `append` method traverses to the end of the chain and links a new node. The `contains` method walks the chain comparing each value until it finds a match or exhausts all nodes. Both operations are `O(k)` where k is the chain length — but when a hash function spreads keys evenly and the table has enough buckets, chains stay short and this remains fast in practice.

## Solving collisions with HashChain

With the `Chain` data structure in place, we can build `HashChain` — a hash table that handles collisions through separate chaining. The structure mirrors `HashSet`, but each bucket now holds an optional `Chain` instead of a single element. It also counts its elements so it can measure how full it is:

```swift
// Hash table with collision resolution via separate chaining
public class HashChain<T: Indexable> {

    // Number of elements stored in the hash table
    public private(set) var count: Int = 0

    // Array of bucket chains for storing colliding elements
    var buckets: Array<Chain<T>?>

    // Creates a new empty hash table with separate chaining
    public init(capacity: Int = 20) {
        precondition(capacity > 0, "HashChain capacity must be greater than zero")
        self.buckets = Array<Chain<T>?>(repeating: nil, count: capacity)
    }

    // Ratio of stored elements to buckets
    public var loadFactor: Double {
        return Double(count) / Double(buckets.count)
    }
}
```

### Inserting with collision handling

The `insert` method now handles both cases — empty buckets and collisions. It delegates the placement itself to a small helper, `store`, which we'll reuse in a moment:

```swift
// Inserts an element, handling collisions via separate chaining
public func insert(_ element: T) {

    //duplicates are ignored
    guard contains(element) == false else {
        return
    }

    if buckets[hash(element)] != nil {
        print("collision detected!")
    }

    store(element)
    count += 1

    //grow when chains would become too long
    if loadFactor > 0.75 {
        resize()
    }
}

// Places an element in the chain at its hash index, creating the chain if needed
private func store(_ element: T) {

    //compute hash value
    let hvalue = self.hash(element)

    if let chain = buckets[hvalue] {
        //use existing chain
        chain.append(element)
    }
    else {
        //new chain
        let chain = Chain<T>()
        chain.append(element)
        buckets[hvalue] = chain
    }
}
```

When a bucket is empty, `store` creates a new `Chain`, appends the element, and stores the chain at the computed index. When a collision occurs — the bucket already has a chain — the element is appended to the existing chain. Unlike `HashSet`, no element is rejected. Both "Albert Einstein" and "Andrew Collins" now coexist at bucket 5, linked together in a chain.

### Growing the table

As more elements arrive, chains grow longer and lookups slow down. The fix is to add buckets, but we can't simply append them. Every element's index was computed as `asciiRepresentation % buckets.count`, so changing the bucket count changes where each element *should* be. Suppose a three-bucket table holds "c" (99 % 3 = 0) and "a" (97 % 3 = 1). If we appended a fourth bucket and stopped there, a later search for "c" would compute 99 % 4 = 3 and look in an empty bucket, even though "c" is still sitting at index 0.

Growing therefore means building a new, larger bucket array and placing every existing element again using the new count, a process called **rehashing**:

```swift
// Doubles the bucket count and rehashes every stored element - expected O(n) for well-spread, fixed-length keys
private func resize() {

    let oldBuckets = buckets
    buckets = Array<Chain<T>?>(repeating: nil, count: oldBuckets.count * 2)

    //redistribute every element using the new bucket count
    for bucket in oldBuckets {
        if let chain = bucket {
            for element in chain.values {
                store(element)
            }
        }
    }
}
```

For fixed-length keys spread evenly across the buckets, a resize costs `O(n)` on average. That cost includes allocating the new bucket array and rebuilding the chains. Doubling the bucket count spreads this expected cost across many insertions, giving an expected amortized insertion cost of `O(1)`. For variable-length keys, we must also count the work of hashing every key again.

The worst case depends on how we rebuild each chain. Our `store` helper calls `Chain.append`, which walks to the end before adding an element. If all n keys collide, rebuilding their chain takes `0 + 1 + … + (n − 1)` link traversals, or `O(n²)` work. A tail pointer or insertion at the head would make each placement constant time during rehashing.

`HashSet` keeps a fixed bucket count because rehashing without collision handling could leave some elements with no available position.

### Collision-aware lookup

The `contains` method delegates to the chain's own `contains` method for collision-aware searching:

```swift
// Checks whether an element exists in the hash table
public func contains(_ element: T) -> Bool {

    //compute hash value
    let hvalue = self.hash(element)

    guard let chain = buckets[hvalue] else {
        return false
    }

    return chain.contains(element)
}
```

If the bucket is empty, the element cannot exist and we return `false` immediately. If a chain exists at the computed index, we search through it for the target value. The hash function narrows the search to a single bucket, and the chain handles the rest.

### The hash function

`HashChain` uses the same hash function as `HashSet` — the only difference is how collisions are handled after the hash is computed:

```swift
// Computes the hash index for an element using modulo-based hashing
private func hash(_ element: T) -> Int {
    let remainder = element.asciiRepresentation % buckets.count
    return remainder >= 0 ? remainder : remainder + buckets.count
}
```

## Performance analysis

Hash tables offer excellent performance characteristics when properly implemented, as analyzed using [Chapter 8](08-performance-analysis.md) principles. Every operation has two parts: computing the key's hash, which costs `O(m)` for a key of length m with our `asciiRepresentation`, and then working within one bucket. The ratio of stored elements to bucket count is called the **load factor**, written α. When the hash function spreads keys evenly across the buckets, the average chain holds about α elements, so the bucket work for insert, search, and delete averages `O(1 + α)`. The worst case degrades to `O(n)` when all keys hash to the same bucket, forming a single long chain, which is exactly what a poor hash function or deliberately chosen keys can cause. Space complexity is `O(n)` where n is the number of stored elements.

Because the expected cost depends on α rather than on n, keeping the load factor bounded keeps operations `O(1)` on average. There's nothing magic about any particular threshold. A fixed-size chained table with a load factor of 2 still averages about two comparisons per lookup; the cost grows gradually with α rather than collapsing at a cutoff. Our `HashChain` resizes when α passes 0.75, a common choice that keeps chains short without wasting too many buckets. Production hash tables like Swift's `Dictionary` follow the same strategy, automatically resizing past a design-specific threshold and rehashing all elements into a larger bucket array to restore short chains.

### Comparison with other data structures

| Operation | Array | Linked List (Ch 9) | Balanced BST (Ch 12) | Hash Table |
|-----------|-------|-------------|-----|------------|
| Search | `O(n)` | `O(n)` | `O(log n)` | `O(1)` avg |
| Insert | `O(1)` amortized at end | `O(1)` at head | `O(log n)` | `O(1)` avg |
| Delete | `O(n)` | `O(n)` | `O(log n)` | `O(1)` avg |
| Preserves insertion order | Yes | Yes | No | No |
| Sorted traversal | Only if kept sorted | Only if kept sorted | Yes | No |
| Memory Overhead | Low | Medium | Medium | Medium-High |

The hash table figures assume a well-spread hash and a bounded load factor, and like the BST figures, they count operations after a key's hash or comparison cost. An unbalanced BST from [Chapter 11](11-binary-search-trees.md) offers `O(log n)` only on average; [Chapter 12](12-tree-balancing.md) is what makes it a guarantee.

## Hash tables in iOS development

Every iOS app uses hash tables. Swift's `Dictionary` is a hash table, providing the same `O(1)` average key-value operations we built in this chapter. Data caching provides one of the most common use cases — rather than repeatedly formatting the same distance value, cache the result:

```swift
// Cache formatted strings to avoid repeated computation
var formattedDistances = [Double: String]()

if let cached = formattedDistances[5.2] {
    return cached  // O(1) lookup
} else {
    let formatted = formatDistance(5.2)
    formattedDistances[5.2] = formatted  // O(1) store
    return formatted
}
```

Grouping data by category is another natural fit. Workout aggregation by month becomes trivial with hash table semantics:

```swift
// Group workouts by month using hash table
var workoutsByMonth = [String: [Workout]]()
workoutsByMonth["2026-01"] = [...]  // Instant grouping
```

With arrays, finding a workout by name requires checking every element — `O(n)` time. With `Dictionary`, hashing directly to the value takes `O(1)` average time. For 10 workouts, the difference is negligible. For 10,000 workouts, `Dictionary` wins by orders of magnitude.

## Building algorithmic intuition

Hash tables achieve `O(1)` average-case performance through clever use of hashing and array indexing, provided the hash spreads keys evenly and the table grows before its chains get long. The progression from `HashSet` to `HashChain` reveals a fundamental design pattern — start with the simplest possible solution, identify its limitations through concrete examples, then layer on complexity only where needed. Collision handling through separate chaining demonstrates how combining data structures (arrays and linked lists) creates solutions more powerful than either alone.

Hash tables complement other data structures throughout this book. Binary search trees from [Chapter 11](11-binary-search-trees.md) maintain sorted order but require `O(log n)` operations, tries from [Chapter 14](14-tries.md) excel at prefix searches, and hash tables sacrifice ordering for `O(1)` lookups. Recognizing when constant-time access matters more than ordering is a practical skill that extends to shortest path algorithms in [Chapter 16](16-shortest-paths.md) and dynamic programming in [Chapter 18](18-dynamic-programming.md).
