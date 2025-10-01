---
layout: chapter
title: "Chapter 13: Hash Tables"
description: "Build hash tables with collision handling"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Hash tables

Hash tables are fundamental data structures that provide extremely fast insertion, deletion, and lookup operations through clever use of hash functions. While Swift's built-in `Dictionary` type implements hash table functionality, understanding how to build your own hash table from scratch is essential for mastering computer science fundamentals. In this chapter, we'll explore hash table design principles and implement a robust, modern hash table in Swift.

## Understanding hash tables

Hash tables solve a fundamental problem in computer science: how do we store and retrieve data in constant time? The answer lies in using a hash function to transform keys into array indices, allowing direct access to stored values.

### Keys & values

Compared to other data structures:
- **Linked Lists**: Flexible but require O(n) search time due to sequential traversal
- Arrays: Fast indexed access but require knowing the exact position
- **Hash Tables**: Combine the best of both worlds - fast O(1) average case operations with flexible key-based access

A well-designed hash table can achieve constant time O(1) for insertion, deletion, and lookup operations, making it one of the most efficient data structures available.

## Hash function fundamentals

A hash table consists of two essential components:
1. **Hash Function**: Transforms keys into array indices
2. **Bucket Array**: Stores the actual key-value pairs

The hash function is the heart of any hash table. It takes an input key and produces a numeric hash value that determines where to store the data:

```swift
// Example: "Swift" → hash function → index 7
// The key "Swift" will always map to the same index
```

### Hash function properties

A good hash function should be:
- Deterministic: Same input always produces same output
- Fast: O(1) computation time
- Uniform: Distributes keys evenly across buckets
- **Avalanche Effect**: Small input changes create large output changes

### Bucket storage

Values are stored in non-contiguous "buckets" within an array. The hash function determines which bucket to use, enabling direct access without searching through the entire structure.

## Modern hash table implementation

Our hash table implementation uses generics and modern Swift patterns for type safety and performance. We'll start with the supporting structures:

```swift
// Generic node for collision resolution via chaining
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

We'll use Swift's `Hashable` protocol which provides built-in hash functionality, making our implementation more robust and compatible with Swift's type system:

```swift
// All Hashable types automatically work with our hash table
// This includes String, Int, Double, and custom types that conform to Hashable
```

## Core hash table structure

Our modern hash table implementation focuses on performance, type safety, and Swift best practices:

```swift
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
// Example: Custom vertex type for graph algorithms
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

Our implementation uses Swift's robust hashing system which implements:
- **SipHash**: Cryptographically secure hash function
- **Seed Randomization**: Different hash values across program runs
- **Collision Resistance**: Minimizes hash collisions

## Collision resolution strategies

Even with excellent hash functions, collisions are inevitable. Collisions occur when different keys map to the same index. Our implementation uses **separate chaining** with linked lists to handle these situations:

```swift
extension HashTable {
    // Handle collisions by chaining nodes
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
- **Open Addressing**: Find next available slot
- **Robin Hood Hashing**: Minimize variance in probe distances
- **Cuckoo Hashing**: Guarantees O(1) worst-case lookup

## Complete CRUD operations

Our modern hash table provides full Create, Read, Update, Delete functionality with automatic resizing:

```swift
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

## Real-world applications

Hash tables are fundamental to many systems and algorithms:

### 1. Caching system
```swift
class LRUCache<Key: Hashable, Value> {
    private let capacity: Int
    private var cache = HashTable<Key, CacheNode<Value>>()
    private var head: CacheNode<Value>?
    private var tail: CacheNode<Value>?

    init(capacity: Int) {
        self.capacity = capacity
    }

    func get(_ key: Key) -> Value? {
        guard let node = cache.getValue(for: key) else {
            return nil
        }

        // Move to front (most recently used)
        moveToFront(node)
        return node.value
    }

    func put(_ key: Key, value: Value) {
        if let existingNode = cache.getValue(for: key) {
            existingNode.value = value
            moveToFront(existingNode)
        } else {
            let newNode = CacheNode(value: value)
            cache.insert(key, value: newNode)

            if cache.count > capacity {
                removeLRU()
            }
        }
    }
}
```

### 2. Database indexing
```swift
// Simplified database index using hash table
class DatabaseIndex<Key: Hashable> {
    private var index = HashTable<Key, [Int]>()

    func addRecord(key: Key, recordID: Int) {
        if var records = index.getValue(for: key) {
            records.append(recordID)
            index.insert(key, value: records)
        } else {
            index.insert(key, value: [recordID])
        }
    }

    func findRecords(for key: Key) -> [Int] {
        return index.getValue(for: key) ?? []
    }
}
```

### 3. Set implementation
```swift
// Efficient set implementation using hash table
public struct HashSet<Element: Hashable> {
    private var table = HashTable<Element, Bool>()

    public mutating func insert(_ element: Element) {
        table.insert(element, value: true)
    }

    public func contains(_ element: Element) -> Bool {
        return table.contains(element)
    }

    public mutating func remove(_ element: Element) {
        table.remove(element)
    }

    public var count: Int {
        return table.count
    }
}
```

### 4. Word frequency counter
```swift
func wordFrequency(in text: String) -> HashTable<String, Int> {
    let words = text.lowercased()
        .components(separatedBy: .whitespacesAndNewlines)
        .filter { !$0.isEmpty }

    let frequency = HashTable<String, Int>()

    for word in words {
        let currentCount = frequency.getValue(for: word) ?? 0
        frequency.insert(word, value: currentCount + 1)
    }

    return frequency
}

// Usage
let text = "Swift algorithms Swift programming algorithms"
let freq = wordFrequency(in: text)
print(freq.getValue(for: "swift"))  // Optional(2)
print(freq.getValue(for: "algorithms"))  // Optional(2)
```

## Performance analysis

Hash tables offer excellent performance characteristics when properly implemented:

### Time complexity
- **Average Case**: O(1) for insert, search, delete
- **Worst Case**: O(n) when all keys hash to same bucket
- Space: O(n) where n is the number of elements

### Load factor impact

| Load Factor | Average Chain Length | Performance |
|-------------|---------------------|-------------|
| 0.25 | 0.25 | Excellent (fast, memory wasteful) |
| 0.50 | 0.50 | Very Good (balanced) |
| 0.75 | 0.75 | Good (our resize threshold) |
| 1.00 | 1.00 | Fair (getting slower) |
| 2.00 | 2.00 | Poor (approaching O(n)) |

### Comparison with other data structures

| Operation | Array | Linked List | BST | Hash Table |
|-----------|-------|-------------|-----|------------|
| Search | O(n) | O(n) | O(log n) | O(1) avg |
| Insert | O(n) | O(1) | O(log n) | O(1) avg |
| Delete | O(n) | O(n) | O(log n) | O(1) avg |
| Ordered Traversal | ✓ | ✗ | ✓ | ✗ |
| Memory Overhead | Low | Medium | Medium | Medium-High |

## Advanced concepts

### Hash function quality metrics

```swift
extension HashTable {
    // Measure distribution quality
    public func analyzeDistribution() -> (Double, Int, Int) {
        var chainLengths: [Int] = []
        var maxChainLength = 0
        var nonEmptyBuckets = 0

        for bucket in buckets {
            var length = 0
            var current = bucket

            while current != nil {
                length += 1
                current = current?.next
            }

            chainLengths.append(length)
            if length > 0 {
                nonEmptyBuckets += 1
                maxChainLength = max(maxChainLength, length)
            }
        }

        let averageChainLength = Double(size) / Double(nonEmptyBuckets)
        return (averageChainLength, maxChainLength, nonEmptyBuckets)
    }
}
```

### When to use hash tables

**Ideal for:**
- Fast lookups by key
- Implementing caches
- Counting occurrences
- Detecting duplicates
- Set operations

**Avoid when:**
- Need ordered iteration
- Range queries required
- Memory is severely constrained
- Keys don't hash well

## Building algorithmic intuition

Hash tables demonstrate several key algorithmic concepts:

1. **Trade-offs**: Memory for speed - we use extra space to achieve faster operations
2. **Amortized Analysis**: Resize operations are expensive but occur infrequently
3. **Hash Function Design**: The quality of the hash function affects performance dramatically
4. **Load Factor Management**: We must balance between space and time efficiency


---

<div class="chapter-nav">
  <a href="12-tries" class="prev">Previous Chapter</a>
  <a href="index">Table of Contents</a>
  <a href="14-heaps" class="next">Next Chapter</a>
</div>
