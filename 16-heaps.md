---
layout: chapter
title: "Chapter 16: Heaps"
description: "Implement priority queues with heap data structures"
---
# Heaps

Your iPhone is juggling dozens of tasks right now—downloading email, syncing Health data, updating apps in the background, processing your latest workout. Which task runs next? That's a priority queue, and iOS uses heap algorithms to decide. High-priority tasks (user taps screen) jump to the front. Low-priority tasks (background sync) wait. Heaps maintain this ordering instantly, ensuring your phone stays responsive.

Beyond iOS itself, heaps power the algorithms that optimize your fitness data. Finding your top 10 fastest runs from thousands of workouts? Heap algorithm. Processing GPS points in time-stamped order during a run? Priority queue. Scheduling interval training alerts? Heap manages the timer queue. These operations need to maintain sorted order while constantly adding and removing items—exactly what heaps excel at.

Heaps combine concepts from throughout this book. They use generic types ([Chapter 7](07-generics.md)) with Comparable constraints, achieve `O(log n)` operations ([Chapter 8](08-performance-analysis.md)), can be implemented as specialized queues ([Chapter 10](10-stacks-and-queues.md)), and dramatically optimize graph algorithms like Dijkstra's ([Chapter 13](13-graphs.md)). The heap property—parent nodes are always more extreme than their children—creates a complete binary tree that's both simple to implement and remarkably efficient.

In this chapter, we'll explore heap fundamentals and build a complete heap implementation in Swift.

## Understanding heaps

A heap is a complete [binary tree](https://en.wikipedia.org/wiki/Binary_tree) that satisfies the heap property:
- **Min-Heap**: Every parent node is smaller than or equal to its children
- **Max-Heap**: Every parent node is greater than or equal to its children

This ordering ensures that the minimum (or maximum) element is always at the root, enabling `O(1)` access to the most important element.

### Heap vs binary search tree

| Property | Binary Search Tree | Heap |
|----------|-------------------|------|
| Ordering | Left < Parent < Right | Parent ≤/≥ Children |
| Shape | Can be unbalanced | Always complete |
| Root Property | No guarantees | Min/Max element |
| Search Time | `O(log n)` for specific values | `O(n)` for specific values |
| Extract Min/Max | `O(log n)` | `O(log n)` |

Consider tracking your workout times with heaps. A min-heap keeps your fastest 5K time at the root, always accessible in `O(1)`. Adding a new workout? `O(log n)` to maintain sorted order. Extracting your personal record? `O(log n)` to get and remove the best time. A max-heap for calorie burns keeps your highest calorie workout at the root, perfect for a "top 10 workouts" feature that maintains sorted order as you log new sessions.

Why not use a sorted array instead? Inserting into a sorted array requires shifting everything—`O(n)` operations. Heap insert only bubbles up one path—`O(log n)`. For 10,000 workouts, that's 10,000 operations versus ~14 operations. This performance difference makes heaps the right choice when you need to maintain sorted order while frequently adding and removing items.

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

Consider storing your top workout times in an array-based min-heap:

```swift
// Min-heap: fastest times (smallest numbers at top)
// Array: [18.5, 19.2, 19.8, 20.1, 21.3, 22.0, 20.5]
//
// Visualized as tree:
//              18.5 (index 0) - PR time
//             /    \
//         19.2      19.8     (indices 1, 2)
//        /   \     /   \
//     20.1  21.3 22.0 20.5   (indices 3-6)

// Parent of index 3: (3-1)/2 = 1 → value 19.2
// Left child of index 1: 2*1+1 = 3 → value 20.1
```

No pointers needed. The array indices encode the tree structure through math. This makes heaps cache-friendly—the data sits in contiguous memory, unlike pointer-based trees that scatter across RAM.


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

Heaps enable an efficient `O(n log n)` sorting algorithm:

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

## Heaps in iOS frameworks

While you can't directly access Apple's heap implementations, iOS uses priority queues throughout. DispatchQueue manages task scheduling with priority levels:

```swift
// High-priority task (user interaction)
DispatchQueue.main.async {  // Jumps to front of queue
    updateUI()
}

// Low-priority background work
DispatchQueue.global(qos: .background).async {  // Waits its turn
    syncHealthData()
}
```

Behind the scenes, iOS uses heap structures to manage these priority levels. High-priority items bubble to the top, low-priority items sink down.

When you set multiple workout interval timers, iOS maintains them in a priority queue (likely heap-based). Consider timers for 30-second warm-up, 2-minute high-intensity, and 1-minute recovery intervals. The heap ensures the earliest timer fires first, regardless of the order you created them.

Processing GPS points during a run requires handling them in time-stamped order. A min-heap sorted by timestamp ensures you always process the next chronological point, even if GPS signals arrive out of order due to satellite delays.

Finding your top 10 best workouts demonstrates a classic heap problem. Maintain a max-heap of size 10. For each new workout, if it's better than the worst in the heap, replace it in `O(log 10)` time. The heap automatically maintains your top 10. This approach achieves `O(n log k)` time where k=10, better than sorting all n workouts which would take `O(n log n)`.

## Performance analysis

### Time complexity
- Insert: `O(log n)` - bubble up at most log n levels (worst case when element belongs at root)
- **Extract Root**: `O(log n)` - bubble down at most log n levels (worst case when replacement element belongs at leaf)
- Peek: `O(1)` - root is always at index 0, no traversal needed
- **Build Heap**: `O(n)` - heapify is linear time due to mathematical properties of complete binary trees
- Search: `O(n)` - no ordering for arbitrary elements, must check all nodes in worst case

**Important edge cases for extraction complexity:**
- **Best case**: `O(1)` when the heap has only one element
- **Average case**: `O(log n)` as the replacement element typically settles near the middle levels
- **Worst case**: `O(log n)` when the replacement element (last element) has the worst priority and must sink to the bottom

### Space complexity
- Storage: `O(n)` - just the array
- Operations: `O(1)` - in-place modifications

### Comparison with other data structures

| Operation | Array | Linked List | BST | Heap | Hash Table |
|-----------|-------|-------------|-----|------|------------|
| Find Min/Max | `O(n)` | `O(n)` | `O(log n)` | `O(1)` | `O(n)` |
| Insert | `O(n)` | `O(1)` | `O(log n)` | `O(log n)` | `O(1)` avg |
| Delete Min/Max | `O(n)` | `O(n)` | `O(log n)` | `O(log n)` | `O(n)` |
| Build from Array | `O(1)` | `O(n)` | `O(n log n)` | `O(n)` | `O(n)` |

## Building algorithmic intuition

Heaps provide `O(log n)` priority operations through array-based tree storage, demonstrating how mathematical properties—completeness, heap order—enable efficient implementations without pointer overhead. The bubble-up and bubble-down operations maintain heap order through local comparisons, preserving global structure while keeping operations logarithmic. This pattern of local operations maintaining global invariants appears in self-balancing trees and other dynamically maintained structures.

Priority queues built on heaps appear throughout algorithm design. Dijkstra's shortest path algorithm ([Chapter 17](17-shortest-paths.md)) uses priority queues to select minimum-distance vertices, event-driven simulations process events by timestamp priority, and heap sort provides `O(n log n)` sorting with `O(1)` space. Understanding heaps unlocks these applications and reveals when priority-based processing optimizes algorithm performance.
