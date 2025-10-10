---
layout: chapter
title: "Chapter 16: Heaps"
description: "Implement priority queues with heap data structures"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Heaps

[Heaps](https://en.wikipedia.org/wiki/Heap_(data_structure)) are specialized [tree](https://en.wikipedia.org/wiki/Tree_(data_structure))-based data structures that maintain a specific ordering property, making them ideal for [priority queues](https://en.wikipedia.org/wiki/Priority_queue) and efficient sorting [algorithms](https://en.wikipedia.org/wiki/Algorithm). Unlike [binary search trees](https://en.wikipedia.org/wiki/Binary_search_tree) from Chapters 11-12 that maintain left-right ordering, heaps focus on parent-child relationships to ensure the most important element is always accessible in constant time.

Heaps combine concepts from throughout this book. They use generic types (Chapter 7) with Comparable constraints, achieve O(log n) operations (Chapter 8), can be implemented as specialized queues (Chapter 10), and dramatically optimize graph algorithms like Dijkstra's (Chapter 13). The heap property—parent nodes are always more extreme than their children—creates a complete binary tree that's both simple to implement and remarkably efficient.

In this chapter, we'll explore heap fundamentals and build a complete heap implementation in Swift.

## Understanding heaps

A heap is a complete [binary tree](https://en.wikipedia.org/wiki/Binary_tree) that satisfies the heap property:
- **Min-Heap**: Every parent node is smaller than or equal to its children
- **Max-Heap**: Every parent node is greater than or equal to its children

This ordering ensures that the minimum (or maximum) element is always at the root, enabling O(1) access to the most important element.

### Heap vs binary search tree

| Property | Binary Search Tree | Heap |
|----------|-------------------|------|
| Ordering | Left < Parent < Right | Parent ≤/≥ Children |
| Shape | Can be unbalanced | Always complete |
| Root Property | No guarantees | Min/Max element |
| Search Time | O(log n) for specific values | O(n) for specific values |
| Extract Min/Max | O(log n) | O(log n) |

## Array representation

Heaps are typically implemented using arrays, which provides several advantages:
- **Space Efficient**: No need to store parent/child pointers
- **Cache Friendly**: Better memory locality than pointer-based structures
- **Simple Navigation**: Mathematical relationships between indices

### Index relationships

For any element at index `i`:
- Parent: `(i - 1) / 2`
- **Left Child**: `2 * i + 1`
- **Right Child**: `2 * i + 2`


## Modern heap implementation

Our heap implementation focuses on performance, type safety, and Swift best practices:

```swift
// Generic heap structure using Comparable for flexible priority ordering - O(1) peek
public enum HeapType {
    case minHeap
    case maxHeap
}

public struct Heap<Element: Comparable> {
    private var elements: [Element] = []
    private let priorityFunction: (Element, Element) -> Bool

    public init(type: HeapType) {
        switch type {
        case .minHeap:
            priorityFunction = { $0 < $1 }
        case .maxHeap:
            priorityFunction = { $0 > $1 }
        }
    }

    public init(elements: [Element], type: HeapType) {
        self.init(type: type)
        self.elements = elements
        buildHeap()
    }

    public var isEmpty: Bool {
        return elements.isEmpty
    }

    public var count: Int {
        return elements.count
    }

    public var peek: Element? {
        return elements.first
    }
}
```

### Index helper methods

```swift
// Helper methods for navigating parent-child relationships in array - O(1) index calculations
extension Heap {
    private func parentIndex(of index: Int) -> Int {
        return (index - 1) / 2
    }

    private func leftChildIndex(of index: Int) -> Int {
        return 2 * index + 1
    }

    private func rightChildIndex(of index: Int) -> Int {
        return 2 * index + 2
    }

    private func isValidIndex(_ index: Int) -> Bool {
        return index >= 0 && index < elements.count
    }

    private func hasLeftChild(at index: Int) -> Bool {
        return isValidIndex(leftChildIndex(of: index))
    }

    private func hasRightChild(at index: Int) -> Bool {
        return isValidIndex(rightChildIndex(of: index))
    }

    private func hasParent(at index: Int) -> Bool {
        return index > 0
    }
}
```

## Core heap operations

### Insertion (bubble up)

When inserting a new element, we add it to the end of the array and "bubble up" to maintain the heap property:

```swift
// Insert element and bubble up to maintain heap property - O(log n)
extension Heap {
    public mutating func insert(_ element: Element) {
        elements.append(element)
        bubbleUp(from: elements.count - 1)
    }

    private mutating func bubbleUp(from index: Int) {
        var childIndex = index

        while hasParent(at: childIndex) {
            let parentIndex = self.parentIndex(of: childIndex)

            // Check if heap property is satisfied
            if priorityFunction(elements[childIndex], elements[parentIndex]) {
                elements.swapAt(childIndex, parentIndex)
                childIndex = parentIndex
            } else {
                break
            }
        }
    }
}
```

### Extraction (bubble down)

Removing the root element requires moving the last element to the root and "bubbling down":

```swift
// Extract root element and bubble down replacement to restore heap property - O(log n)
extension Heap {
    @discardableResult
    public mutating func extractRoot() -> Element? {
        guard !isEmpty else { return nil }

        if elements.count == 1 {
            return elements.removeFirst()
        }

        // Store root value
        let root = elements[0]

        // Move last element to root
        elements[0] = elements.removeLast()

        // Restore heap property
        bubbleDown(from: 0)

        return root
    }

    private mutating func bubbleDown(from index: Int) {
        var parentIndex = index

        while hasLeftChild(at: parentIndex) {
            // Find the child with higher priority
            var priorityChildIndex = leftChildIndex(of: parentIndex)

            if hasRightChild(at: parentIndex) {
                let rightChildIndex = self.rightChildIndex(of: parentIndex)
                if priorityFunction(elements[rightChildIndex], elements[priorityChildIndex]) {
                    priorityChildIndex = rightChildIndex
                }
            }

            // Check if heap property is satisfied
            if priorityFunction(elements[priorityChildIndex], elements[parentIndex]) {
                elements.swapAt(parentIndex, priorityChildIndex)
                parentIndex = priorityChildIndex
            } else {
                break
            }
        }
    }
}
```

### Heapify (build heap)

Converting an arbitrary array into a heap using bottom-up approach:

```swift
// Build heap from array using bottom-up heapify - O(n) linear time
extension Heap {
    private mutating func buildHeap() {
        // Start from last non-leaf node and bubble down
        for index in stride(from: elements.count / 2 - 1, through: 0, by: -1) {
            bubbleDown(from: index)
        }
    }

    public mutating func heapify(_ array: [Element]) {
        elements = array
        buildHeap()
    }
}
```

## Priority queue implementation

Heaps are perfect for implementing priority queues where elements are processed based on priority rather than insertion order:

```swift
// Priority queue wrapper using heap for O(log n) enqueue/dequeue operations
public struct PriorityQueue<Element: Comparable> {
    private var heap: Heap<Element>

    public init(type: HeapType = .minHeap) {
        heap = Heap<Element>(type: type)
    }

    public var isEmpty: Bool {
        return heap.isEmpty
    }

    public var count: Int {
        return heap.count
    }

    public var peek: Element? {
        return heap.peek
    }

    public mutating func enqueue(_ element: Element) {
        heap.insert(element)
    }

    @discardableResult
    public mutating func dequeue() -> Element? {
        return heap.extractRoot()
    }
}
```

### Custom priority elements

For complex priority logic, create custom comparable types:

```swift
// Custom Comparable type for complex priority logic with multiple criteria
struct Task: Comparable {
    let name: String
    let priority: Int
    let deadline: Date

    static func < (lhs: Task, rhs: Task) -> Bool {
        // Higher priority number = higher importance
        if lhs.priority != rhs.priority {
            return lhs.priority > rhs.priority
        }
        // If same priority, earlier deadline wins
        return lhs.deadline < rhs.deadline
    }

    static func == (lhs: Task, rhs: Task) -> Bool {
        return lhs.priority == rhs.priority && lhs.deadline == rhs.deadline
    }
}

// Usage
var taskQueue = PriorityQueue<Task>(type: .minHeap)
taskQueue.enqueue(Task(name: "Review code", priority: 2, deadline: Date()))
taskQueue.enqueue(Task(name: "Fix critical bug", priority: 5, deadline: Date()))
taskQueue.enqueue(Task(name: "Write tests", priority: 3, deadline: Date()))

while let nextTask = taskQueue.dequeue() {
    print("Processing: \(nextTask.name)")
}
// Output: Fix critical bug, Write tests, Review code
```

## Heap sort algorithm

Heaps enable an efficient O(n log n) sorting algorithm:

```swift
// Heap sort using max heap for ascending order - O(n log n) time, O(n) space
extension Array where Element: Comparable {
    public mutating func heapSort() {
        // Build max heap
        var heap = Heap<Element>(elements: self, type: .maxHeap)

        // Extract elements in sorted order
        self.removeAll()
        while let max = heap.extractRoot() {
            self.insert(max, at: 0) // Insert at beginning for ascending order
        }
    }

    public func heapSorted() -> [Element] {
        var copy = self
        copy.heapSort()
        return copy
    }
}

// Usage
var numbers = [64, 34, 25, 12, 22, 11, 90]
let sorted = numbers.heapSorted()
print(sorted) // [11, 12, 22, 25, 34, 64, 90]
```

## Real-world applications

### 1. Event scheduler
```swift
// Event scheduler using min-heap for chronological processing
struct Event: Comparable {
    let name: String
    let scheduledTime: Date

    static func < (lhs: Event, rhs: Event) -> Bool {
        return lhs.scheduledTime < rhs.scheduledTime
    }

    static func == (lhs: Event, rhs: Event) -> Bool {
        return lhs.scheduledTime == rhs.scheduledTime
    }
}

class EventScheduler {
    private var eventQueue = PriorityQueue<Event>(type: .minHeap)

    func scheduleEvent(_ event: Event) {
        eventQueue.enqueue(event)
    }

    func processNextEvent() -> Event? {
        return eventQueue.dequeue()
    }

    func upcomingEvent() -> Event? {
        return eventQueue.peek
    }
}
```

### 2. Dijkstra's algorithm enhancement

Using heaps dramatically improves pathfinding performance:

```swift
// Dijkstra's algorithm optimized with min-heap - reduces O(V²) to O((V + E) log V)
struct PathNode: Comparable {
    let vertex: String
    let distance: Int

    static func < (lhs: PathNode, rhs: PathNode) -> Bool {
        return lhs.distance < rhs.distance
    }

    static func == (lhs: PathNode, rhs: PathNode) -> Bool {
        return lhs.distance == rhs.distance
    }
}

func dijkstra(graph: [String: [(String, Int)]], start: String) -> [String: Int] {
    var distances: [String: Int] = [:]
    var visited: Set<String> = []
    var priorityQueue = PriorityQueue<PathNode>(type: .minHeap)

    // Initialize distances
    for vertex in graph.keys {
        distances[vertex] = Int.max
    }
    distances[start] = 0

    priorityQueue.enqueue(PathNode(vertex: start, distance: 0))

    while let current = priorityQueue.dequeue() {
        guard !visited.contains(current.vertex) else { continue }
        visited.insert(current.vertex)

        // Check neighbors
        if let neighbors = graph[current.vertex] {
            for (neighbor, weight) in neighbors {
                let newDistance = distances[current.vertex]! + weight
                if newDistance < distances[neighbor]! {
                    distances[neighbor] = newDistance
                    priorityQueue.enqueue(PathNode(vertex: neighbor, distance: newDistance))
                }
            }
        }
    }

    return distances
}
```

### 3. Top-K elements
```swift
// Find K largest elements using min-heap - O(n log k) time, O(k) space
extension Array where Element: Comparable {
    func topKLargest(_ k: Int) -> [Element] {
        guard k > 0 && k <= count else { return [] }

        // Use min-heap of size k
        var heap = Heap<Element>(type: .minHeap)

        for element in self {
            if heap.count < k {
                heap.insert(element)
            } else if let smallest = heap.peek, element > smallest {
                heap.extractRoot()
                heap.insert(element)
            }
        }

        var result: [Element] = []
        while let element = heap.extractRoot() {
            result.append(element)
        }

        return result.reversed() // Return in descending order
    }
}

// Usage
let numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5]
let top3 = numbers.topKLargest(3)
print(top3) // [9, 6, 5]
```

## Performance analysis

### Time complexity
- Insert: O(log n) - bubble up at most log n levels (worst case when element belongs at root)
- **Extract Root**: O(log n) - bubble down at most log n levels (worst case when replacement element belongs at leaf)
- Peek: O(1) - root is always at index 0, no traversal needed
- **Build Heap**: O(n) - heapify is linear time due to mathematical properties of complete binary trees
- Search: O(n) - no ordering for arbitrary elements, must check all nodes in worst case

**Important edge cases for extraction complexity:**
- **Best case**: O(1) when the heap has only one element
- **Average case**: O(log n) as the replacement element typically settles near the middle levels
- **Worst case**: O(log n) when the replacement element (last element) has the worst priority and must sink to the bottom

### Space complexity
- Storage: O(n) - just the array
- Operations: O(1) - in-place modifications

### Comparison with other data structures

| Operation | Array | Linked List | BST | Heap | Hash Table |
|-----------|-------|-------------|-----|------|------------|
| Find Min/Max | O(n) | O(n) | O(log n) | O(1) | O(n) |
| Insert | O(n) | O(1) | O(log n) | O(log n) | O(1) avg |
| Delete Min/Max | O(n) | O(n) | O(log n) | O(log n) | O(n) |
| Build from Array | O(1) | O(n) | O(n log n) | O(n) | O(n) |

## Summary

Heaps are specialized tree structures optimized for fast access to the minimum or maximum element, making them the foundation for priority queues and efficient sorting.

**Key characteristics:**
- Complete binary tree stored in an array (no pointer overhead)
- Heap property: parent nodes are always more extreme than children
- Min-heap: parent ≤ children, max-heap: parent ≥ children
- Root always contains the most important element (O(1) access)
- Array indices provide O(1) parent/child navigation
- Generic implementation with Comparable constraint (Chapter 7)

**Core operations:**
- Insert: O(log n) - append to array, bubble up to restore heap property
- Extract root: O(log n) - replace root with last element, bubble down
- Peek: O(1) - root is always at index 0
- Build heap: O(n) - surprisingly linear time despite O(log n) per element
- Search: O(n) - heaps are not optimized for arbitrary searches

**Implementation highlights:**
- Struct with value semantics (unlike tree classes from Chapters 11-12)
- Priority function enables flexible min-heap or max-heap behavior
- Index relationships: parent = (i-1)/2, left = 2i+1, right = 2i+2
- Bubble up: swap with parent until heap property satisfied
- Bubble down: swap with higher-priority child until heap property satisfied
- Bottom-up heapify: start from last non-leaf, work up to root

**Real-world applications:**
- Priority queues (task scheduling, event processing)
- Dijkstra's algorithm optimization (O(V²) → O((V+E) log V))
- Heap sort (O(n log n) comparison-based sorting)
- Top-K element problems (min-heap of size k)
- Operating system scheduling (process priorities)
- Network routing (shortest path calculations)
- Streaming algorithms (median maintenance)

**Performance advantages:**
- O(1) access to min/max vs O(n) for arrays, O(log n) for BSTs
- O(n) heap construction vs O(n log n) for BSTs
- Cache-friendly array layout vs pointer-chasing in trees
- Guaranteed complete tree shape (no balancing needed like Chapter 12)
- Space efficient: no parent/child pointers required

**When to use heaps:**
- Need repeated access to minimum or maximum element
- Implementing priority queues
- Want O(n) construction from arbitrary array
- Building heap sort (comparison-based, in-place possible)
- Optimizing algorithms that repeatedly find extremes

**When to avoid heaps:**
- Need to search for arbitrary elements (O(n) - use hash tables from Chapter 15)
- Need sorted traversal (use BSTs from Chapter 11)
- Need to maintain full ordering (use sorted array with binary search)
- Elements arrive pre-sorted (use stack/queue from Chapter 10)

**Connections:**
- Uses generics from Chapter 7 (Comparable protocol constraint)
- Achieves O(log n) performance analyzed in Chapter 8
- Specializes queue concept from Chapter 10 (priority queue)
- Related to BST concept from Chapters 11-12 (but different ordering)
- Optimizes Dijkstra's algorithm from Chapter 13
- Alternative to hash tables from Chapter 15 for priority-based access
- Provides O(n log n) sorting (compare to Chapter 5 algorithms)

Understanding heaps is essential for building efficient priority-based systems and optimizing algorithms that repeatedly access extreme elements. The heap property creates a sweet spot between simple arrays and complex trees—fast enough for most priority queue needs, simple enough to implement with just an array. In Chapter 17, you'll learn about dynamic programming, which sometimes uses heaps to efficiently track optimal subproblem solutions.

<div class="bottom-nav">
  <div class="nav-container">
    <a href="15-hash-tables" class="nav-link prev">← Chapter 15: Hash Tables</a>
    <a href="index" class="nav-link toc">Table of Contents</a>
    <a href="17-dynamic-programming" class="nav-link next">Chapter 17: Dynamic Programming →</a>
  </div>
</div>

