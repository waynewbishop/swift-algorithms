---
layout: chapter
title: "Chapter 17: Heaps"
description: "Enhance Dijkstra's algorithm with binary heaps and priority queues"
---
# Heaps

In [Chapter 16](16-shortest-paths.md), we reviewed Dijkstra's algorithm for searching a graph. Originally published in 1959, this popular technique for finding the shortest path is an elegant solution to a complex problem. The design involved many parts including graph traversal, custom data structures and the greedy approach.

When designing programs, it's great to see them work. With Dijkstra, the algorithm did allow us to find the shortest path between a source `vertex` and destination. However, our approach could be refined to be more efficient. In this chapter, we'll enhance the algorithm with the addition of binary heaps.

## How it works

In its basic form, a heap is just an array. However, unlike an array, we visualize it as a tree. The term "visualize" implies we use processing techniques normally associated with recursive data structures. This shift in thinking has numerous advantages. Consider the following:

```swift
// A simple array of unsorted integers
let numberList: Array<Int> = [8, 2, 10, 9, 11, 7]
```

As shown, `numberList` can be easily represented as a heap. Starting at index 0, items fill a corresponding spot as a parent or child node. Each parent also has two children with the exception of index 2.

Since the arrangement of values is sequential, a simple pattern emerges. For any element at index `i`, we can accurately predict its position using these formulas:

- **Parent**: `(i - 1) / 2`
- **Left child**: `2 * i + 1`
- **Right child**: `2 * i + 2`

## Sorting heaps

An interesting feature of heaps is their ability to sort data. As we've seen, many algorithms are designed to sort entire datasets. When sorting heaps, nodes can be arranged so each parent contains a lesser value than its children. In computer science, this is called a min-heap.

## Exploring the frontier

With Dijkstra, we used a concept called the `frontier`. Coded as a simple array, we compared the total `weight` of each path to find the shortest path:

```swift
// Construct the best path
var bestPath: Path<T> = Path<T>()

while frontier.count != 0 {
    // Support path changes using the greedy approach
    bestPath = Path<T>()
    var pathIndex: Int = 0

    for x in 0..<frontier.count {
        let itemPath: Path<T> = frontier[x]

        if (bestPath.total == 0) || (itemPath.total < bestPath.total) {
            bestPath = itemPath
            pathIndex = x
        }
    }
```

While it accomplished our goal, we applied a brute force technique. In other words, we examined every potential `Path` to find the shortest path. This code segment executes in linear time or `O(n)`. If the `frontier` contained a million rows, how would this impact the algorithm's overall performance?

## The heap structure

Let's create a more efficient `frontier`. Named `PathHeap`, the data structure will extend the functionality of an array:

```swift
// Specialized min-heap for managing shortest paths in Dijkstra's algorithm
public class PathHeap<T> {

    // Array storing paths in min-heap order
    private var heap: Array<Path<T>>

    // Creates a new empty path heap
    public init() {
        heap = Array<Path<T>>()
    }

    // The number of frontier items
    public var count: Int {
        return self.heap.count
    }
}
```

The `PathHeap` class includes two properties. To support good design, `heap` has been declared a private property. To track the number of items, `count` is declared as a computed property.

## Building the queue

Searching the `frontier` more efficiently than `O(n)` will require a new way of thinking. We can improve our performance to `O(1)` with a heap. Using heapsort formulas, our new approach will involve arranging index values so the smallest item is positioned at the root:

```swift
// Sort shortest paths into a min-heap via bottom-up heapification - O(log n)
public func enQueue(_ key: Path<T>) {

    heap.append(key)

    var childIndex: Float = Float(heap.count) - 1
    var parentIndex: Int = 0

    // Calculate parent index
    if childIndex != 0 {
        parentIndex = Int(floorf((childIndex - 1) / 2))
    }

    var childToUse: Path<T>
    var parentToUse: Path<T>

    // Use the bottom-up approach
    while childIndex != 0 {

        childToUse = heap[Int(childIndex)]
        parentToUse = heap[parentIndex]

        // Swap child and parent positions
        if childToUse.total < parentToUse.total {
            heap.swapAt(parentIndex, Int(childIndex))
        }
        else {
            break
        }

        // Reset indices
        childIndex = Float(parentIndex)

        if childIndex != 0 {
            parentIndex = Int(floorf((childIndex - 1) / 2))
        }
    }
}
```

The `enQueue` method accepts a single `Path` as a parameter. Unlike other sorting algorithms, our primary goal isn't to sort each item, but to find the smallest value. This means we can increase our efficiency by comparing a subset of values.

The process continues until the smallest value is positioned at the root. Since the `enQueue` method maintains the min-heap property, we eliminate the task of finding the shortest path. In other words, we increase the algorithm's efficiency to `O(1)`. Here, we implement a basic `peek` method to retrieve the root-level item:

```swift
// Returns the shortest path without removing it - O(1)
public func peek() -> Path<T>? {
    if heap.count > 0 {
        return heap[0]
    }
    else {
        return nil
    }
}
```

The `PathHeap` also provides a `deQueue` method to remove the shortest path from the `frontier` once it has been processed:

```swift
// Removes the shortest path from the frontier
public func deQueue() {
    if heap.count > 0 {
        heap.remove(at: 0)
    }
}
```

## The results

With the `frontier` refactored, let's see the applied changes. As new paths are discovered, they are automatically sorted by the `frontier`. The `count` property forms the base case for our loop condition and the `bestPath` is retrieved using the `peek` method:

```swift
// Dijkstra's shortest path using heap-based frontier
let frontier: PathHeap = PathHeap<T>()

// Construct the best path
while frontier.count != 0 {
    // Use the greedy approach to obtain the best path
    guard let bestPath: Path<T> = frontier.peek() else {
        break
    }
    ...
```

## Heaps and generics

It's great seeing how a heap can be used to improve the time complexity of a solution. To extend our model for general use, we can also create a more generalized algorithm. The generic `Heap` class supports both min-heap and max-heap ordering through a `HeapType` enum:

```swift
// Heap ordering constraint for priority queue implementations
public enum HeapType {
    case min
    case max
}
```

The generic heap uses `Comparable` to support flexible priority ordering across different data types:

```swift
// Generic heap structure using Comparable for flexible priority ordering
public class Heap<T: Comparable> {

    // Array storing heap elements in level order
    var items: Array<T>

    // Determines min or max heap behavior
    private var heapType: HeapType

    // Creates a new empty heap, defaulting to min-heap
    public init(type: HeapType = .min) {
        items = Array<T>()
        heapType = type
    }

    // Returns the root element without removing it
    public func peek() -> T? {
        if items.count > 0 {
            return items[0]
        }
        else {
            return nil
        }
    }

    // Insert element and bubble up to maintain heap property - O(log n)
    public func enQueue(_ key: T) {

        items.append(key)

        var childIndex: Float = Float(items.count) - 1
        var parentIndex: Int = 0

        // Calculate parent index
        if childIndex != 0 {
            parentIndex = Int(floorf((childIndex - 1) / 2))
        }

        var childToUse: T
        var parentToUse: T

        // Use the bottom-up approach
        while childIndex != 0 {

            childToUse = items[Int(childIndex)]
            parentToUse = items[parentIndex]

            // Heapify depending on type
            switch heapType {
            case .min:
                // Swap child and parent positions
                if childToUse <= parentToUse {
                    items.swapAt(parentIndex, Int(childIndex))
                }
                else {
                    break
                }
            case .max:
                // Swap child and parent positions
                if childToUse >= parentToUse {
                    items.swapAt(parentIndex, Int(childIndex))
                }
                else {
                    break
                }
            }

            // Reset indices
            childIndex = Float(parentIndex)

            if childIndex != 0 {
                parentIndex = Int(floorf((childIndex - 1) / 2))
            }
        }
    }
}
```

The generic `Heap` mirrors the `PathHeap` design but adds flexibility through the `HeapType` switch. For a min-heap, smaller values bubble toward the root. For a max-heap, larger values bubble up instead. Both variations use the same `O(log n)` bottom-up heapification — comparing at most `log n` elements along a single root-to-leaf path.

## Building algorithmic intuition

Heaps demonstrate a powerful idea: by maintaining a simple invariant — every parent has higher priority than its children — we get `O(log n)` operations through local comparisons that preserve global structure. The bubble-up process only examines elements along a single root-to-leaf path, yet the entire heap stays ordered. This pattern of local operations maintaining global invariants appears throughout algorithm design, from self-balancing trees in [Chapter 12](12-tree-balancing.md) to the graph algorithms we explored in [Chapter 16](16-shortest-paths.md).

The real payoff is what we saw in [Chapter 16](16-shortest-paths.md), where the `PathHeap` replaces a brute-force `O(n)` scan with `O(1)` minimum access — a change that transforms Dijkstra from `O(V²)` to `O((V + E) log V)`. Understanding heaps as the engine behind priority queues reveals why they appear wherever algorithms need to repeatedly answer the question: what's the most important element right now? This concept extends to dynamic programming in [Chapter 18](18-dynamic-programming.md) and frequency-based analysis in [Chapter 23](23-similarity-operations.md).
