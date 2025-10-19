---
layout: chapter
title: "Chapter 15: Hash Tables"
description: "Build hash tables with collision handling"
---
# Hash Tables

A fitness app tracking hundreds of workouts across months needs to find this week's Monday run. Linear search through an unsorted list means checking every entry until finding the match—taking `O(n)` time. With 365 days of workouts, that's potentially 365 comparisons just to find one value.

Hash tables solve this problem with mathematics instead of searching. A hash function transforms a key like "Monday Run" into a number. That number becomes an array index, allowing instant `O(1)` access regardless of collection size. One calculation, direct retrieval—no iteration required.

In this chapter, we'll explore hash table design principles and implement a robust, modern hash table in Swift using generics from [Chapter 7](07-generics.md) and collision resolution via linked lists from [Chapter 9](09-linked-lists.md).

## Understanding hash tables

Hash tables solve a fundamental problem in computer science: how do we store and retrieve data in constant time? The answer lies in using a hash function to transform keys into array indices, allowing direct access to stored values.

### Keys & values

Compared to other data structures:
- Linked Lists: Flexible but require `O(n)` search time due to sequential traversal
- Arrays: Fast indexed access but require knowing the exact position
- Hash Tables: Combine the best of both worlds - fast `O(1)` average case operations with flexible key-based access

A well-designed hash table can achieve constant time `O(1)` for insertion, deletion, and lookup operations, making it one of the most efficient data structures available.

iOS apps use hash tables extensively. UserDefaults stores app preferences as key-value pairs for instant lookup. HTTP headers in network requests use hash table lookups. Workout tracking apps retrieve today's stats by date using hash calculations instead of iterating through all dates. Caching systems store expensive computations for instant retrieval.

The mechanics are elegant: hash the key to produce a number, use modulo to convert that number into an array index, jump directly to that position in `O(1)` time. No loops. No comparisons. Just mathematics. This is why key-value lookups feel instant even with thousands of entries.

## Hash function fundamentals

A hash table consists of two essential components:
1. Hash Function: Transforms keys into array indices
2. Bucket Array: Stores the actual key-value pairs

The hash function is the heart of any hash table. It takes an input key and produces a numeric hash value that determines where to store the data:

```swift
// Example: "Swift" → hash function → index 7
// The key "Swift" will always map to the same index
```

### Hash function properties

A good hash function should be:
- Deterministic: Same input always produces same output
- Fast: `O(1)` computation time
- Uniform: Distributes keys evenly across buckets
- Avalanche Effect: Small input changes create large output changes

### Bucket storage

Values are stored in non-contiguous "buckets" within an array. The hash function determines which bucket to use, enabling direct access without searching through the entire structure.

Consider hashing workout dates to bucket indices. Different keys hash to different buckets, avoiding collisions and maintaining `O(1)` lookup:

```
Key transformation example:
"2024-01-15" → hash() → 872349 → % 16 → bucket 13
"2024-01-16" → hash() → 103847 → % 16 → bucket 7
"2024-01-17" → hash() → 445092 → % 16 → bucket 4
```

The hash function transforms any string (workout date, exercise name, user ID) into an integer. The modulo operation wraps that integer into a valid bucket index (0 to capacity-1). This is why hash tables can store millions of workout records with instant lookups—calculating where data lives rather than searching for it.

## Modern hash table implementation

Our hash table implementation uses [generics](https://en.wikipedia.org/wiki/Generic_programming) from [Chapter 7](07-generics.md) and modern Swift patterns for type safety and performance. We'll start with the supporting structures:

```swift
// Generic node for collision resolution via chaining (linked list from Chapter 9)
public class HashNode<Key: Hashable, Value> {
    public let key: Key
    public var value: Value
    public var next: HashNode<Key, Value>?

    public init(key: Key, value: Value) {
        self.key = key
        self.value = value
    }
}

// Result types for hash table operations
public enum HashTableResult {
    case success
    case collision
    case notFound
    case updated
}
```

### Protocol-based design

We'll use Swift's [`Hashable`](https://en.wikipedia.org/wiki/Hash_function) protocol which provides built-in hash functionality, making our implementation more robust and compatible with Swift's type system:

```swift
// All Hashable types automatically work with our hash table
// This includes String, Int, Double, and custom types that conform to Hashable
```

## Core hash table structure

Our modern hash table implementation focuses on performance, type safety, and Swift best practices:

```swift
// Hash table with dynamic resizing and load factor management - O(1) average operations
public class HashTable<Key: Hashable, Value> {
    private var buckets: [HashNode<Key, Value>?]
    private var capacity: Int
    private var size: Int = 0

    // Load factor threshold for resizing
    private let maxLoadFactor: Double = 0.75

    public init(capacity: Int = 16) {
        self.capacity = capacity
        self.buckets = Array(repeating: nil, count: capacity)
    }

    public var count: Int {
        return size
    }

    public var isEmpty: Bool {
        return size == 0
    }

    // Current load factor for performance monitoring
    public var loadFactor: Double {
        return Double(size) / Double(capacity)
    }
}
```

### Dynamic resizing

Unlike our earlier simple implementation, this hash table automatically resizes when the load factor becomes too high, maintaining optimal performance:

```swift
// Resize and rehash all elements when load factor exceeds threshold - O(n)
extension HashTable {
    private func shouldResize() -> Bool {
        return loadFactor > maxLoadFactor
    }

    private func resize() {
        let oldBuckets = buckets
        capacity *= 2
        size = 0
        buckets = Array(repeating: nil, count: capacity)

        // Rehash all existing elements
        for head in oldBuckets {
            var current = head
            while let node = current {
                insert(node.key, value: node.value)
                current = node.next
            }
        }
    }
}
```

## Advanced hash function implementation

Instead of creating a custom protocol, we leverage Swift's built-in `Hashable` protocol, which provides robust hashing for all standard types and allows custom types to easily conform:

```swift
// Modern hash function using Swift's built-in Hasher for uniform distribution
extension HashTable {
    // Modern hash function using Swift's built-in hasher
    private func hashIndex(for key: Key) -> Int {
        return abs(key.hashValue) % capacity
    }

    // Alternative hash function for better distribution
    private func betterHashIndex(for key: Key) -> Int {
        var hasher = Hasher()
        hasher.combine(key)
        return abs(hasher.finalize()) % capacity
    }
}
```

### Custom type support

Any type can be used as a key by conforming to `Hashable`:

```swift
// Example: Custom vertex type for graph algorithms (Chapter 13)
struct Vertex: Hashable {
    let id: String
    let coordinates: (x: Int, y: Int)

    // Hashable conformance
    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
        hasher.combine(coordinates.x)
        hasher.combine(coordinates.y)
    }

    static func == (lhs: Vertex, rhs: Vertex) -> Bool {
        return lhs.id == rhs.id &&
               lhs.coordinates.x == rhs.coordinates.x &&
               lhs.coordinates.y == rhs.coordinates.y
    }
}

// Usage
let vertexTable = HashTable<Vertex, String>()
```

### Hash function quality

Our implementation uses Swift's robust hashing system which implements SipHash (a cryptographically secure hash function), seed randomization (producing different hash values across program runs), and collision resistance to minimize hash collisions.

## Collision resolution strategies

Even with excellent hash functions, collisions are inevitable. [Collisions](https://en.wikipedia.org/wiki/Hash_collision) occur when different keys map to the same index. Our implementation uses separate chaining with linked lists ([Chapter 9](09-linked-lists.md)) to handle these situations.

Consider what happens when two different workout names hash to the same bucket:

```swift
// Two workouts colliding at the same bucket
"Morning Run" → hash() → 582934 → % 16 → bucket 6
"Evening Walk" → hash() → 647766 → % 16 → bucket 6  // Collision!

// Solution: Chain them in a linked list at bucket 6
Bucket 6: [("Morning Run", 450)] → [("Evening Walk", 320)] → nil
```

Even with collisions, lookups remain fast. Instead of checking all workouts, lookups only check the 2-3 items that happened to hash to the same bucket. This is why Dictionary maintains `O(1)` average case even with millions of entries—collisions are rare and shallow.

Here's how our implementation handles collisions:

```swift
// Handle collisions by chaining nodes in linked list - O(1) insertion, O(k) search where k=chain length
extension HashTable {
    private func insertInChain(key: Key, value: Value, at index: Int) -> HashTableResult {
        if buckets[index] == nil {
            // No collision - direct insertion
            buckets[index] = HashNode(key: key, value: value)
            size += 1
            return .success
        }

        // Handle collision via chaining
        var current = buckets[index]
        while let node = current {
            if node.key == key {
                // Update existing key
                node.value = value
                return .updated
            }

            if node.next == nil {
                // Add to end of chain
                node.next = HashNode(key: key, value: value)
                size += 1
                return .collision
            }
            current = node.next
        }

        return .success
    }
}
```

### Alternative collision resolution

While we use chaining, other strategies include:
- Open Addressing: Find next available slot
- Robin Hood Hashing: Minimize variance in probe distances
- Cuckoo Hashing: Guarantees `O(1)` worst-case lookup

## Complete CRUD operations

Our modern hash table provides full Create, Read, Update, Delete functionality with automatic resizing:

```swift
// Complete CRUD operations with automatic resizing - O(1) average case
extension HashTable {
    // Insert or update a key-value pair
    @discardableResult
    public func insert(_ key: Key, value: Value) -> HashTableResult {
        let index = hashIndex(for: key)
        let result = insertInChain(key: key, value: value, at: index)

        // Resize if load factor is too high
        if shouldResize() {
            resize()
        }

        return result
    }

    // Retrieve value for a given key
    public func getValue(for key: Key) -> Value? {
        let index = hashIndex(for: key)
        var current = buckets[index]

        while let node = current {
            if node.key == key {
                return node.value
            }
            current = node.next
        }

        return nil
    }

    // Remove a key-value pair
    @discardableResult
    public func remove(_ key: Key) -> Value? {
        let index = hashIndex(for: key)

        guard let head = buckets[index] else {
            return nil
        }

        // Handle removal of first node
        if head.key == key {
            let removedValue = head.value
            buckets[index] = head.next
            size -= 1
            return removedValue
        }

        // Search through chain
        var current = head
        while let next = current.next {
            if next.key == key {
                let removedValue = next.value
                current.next = next.next
                size -= 1
                return removedValue
            }
            current = next
        }

        return nil
    }

    // Check if key exists
    public func contains(_ key: Key) -> Bool {
        return getValue(for: key) != nil
    }
}
```

### Subscript support

Make our hash table feel like a native Swift collection:

```swift
// Subscript support for Dictionary-like syntax - O(1) average
extension HashTable {
    public subscript(key: Key) -> Value? {
        get {
            return getValue(for: key)
        }
        set {
            if let value = newValue {
                insert(key, value: value)
            } else {
                remove(key)
            }
        }
    }
}
```

## Performance analysis

Hash tables offer excellent performance characteristics when properly implemented, as analyzed using [Chapter 8](08-performance-analysis.md) principles:

### Time complexity
- Average Case: `O(1)` for insert, search, delete
- Worst Case: `O(n)` when all keys hash to same bucket
- Space: `O(n)` where n is the number of elements

### Load factor impact

| Load Factor | Average Chain Length | Performance |
|-------------|---------------------|-------------|
| 0.25 | 0.25 | Excellent (fast, memory wasteful) |
| 0.50 | 0.50 | Very Good (balanced) |
| 0.75 | 0.75 | Good (our resize threshold) |
| 1.00 | 1.00 | Fair (getting slower) |
| 2.00 | 2.00 | Poor (approaching O(n)) |

### Comparison with other data structures

| Operation | Array | Linked List (Ch 9) | BST (Ch 11) | Hash Table |
|-----------|-------|-------------|-----|------------|
| Search | O(n) | O(n) | O(log n) | O(1) avg |
| Insert | O(n) | O(1) | O(log n) | O(1) avg |
| Delete | O(n) | O(n) | O(log n) | O(1) avg |
| Ordered Traversal | ✓ | ✗ | ✓ | ✗ |
| Memory Overhead | Low | Medium | Medium | Medium-High |

## Hash tables in iOS development

Every iOS app uses hash tables. Data caching provides one of the most common use cases. Rather than repeatedly formatting the same distance value, cache the result in a Dictionary:

```swift
// Cache formatted strings to avoid repeated work
var formattedDistances = [Double: String]()

if let cached = formattedDistances[5.2] {
    return cached  // O(1) lookup
} else {
    let formatted = formatDistance(5.2)
    formattedDistances[5.2] = formatted  // O(1) store
    return formatted
}
```

Session management in web applications relies on hash tables to map session IDs to user data. With one billion users, hash tables still deliver `O(1)` lookup performance. Workout aggregation benefits from hash tables too. Grouping workouts by month becomes trivial:

```swift
// Group workouts by month using hash table
var workoutsByMonth = [String: [Workout]]()
workoutsByMonth["2024-01"] = [...]  // Instant grouping
```

Why does Dictionary beat arrays for lookups? With arrays, finding a workout by name requires checking every element—`O(n)` time. With Dictionary, hashing directly to the workout takes `O(1)` time. For 10 workouts, the difference doesn't matter. For 10,000 workouts, Dictionary wins by 10,000× in the worst case.

## Building algorithmic intuition

Hash tables demonstrate several key algorithmic concepts. Trade-offs between memory and speed show how we use extra space to achieve faster operations. Amortized analysis explains why expensive resize operations don't hurt average performance when they occur infrequently. Hash function design proves critical, as the quality of the hash function affects performance dramatically. Load factor management requires balancing space and time efficiency—too low wastes memory, too high degrades performance.
