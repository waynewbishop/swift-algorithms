---
layout: chapter
title: "Chapter 17: Heaps"
description: "Build a binary heap and priority queue in Swift for efficient minimum and maximum extraction"
---
# Heaps

In [Chapter 16](16-shortest-paths.md), we reviewed Dijkstra's algorithm for searching a graph. Originally published in 1959, this popular technique for finding the shortest path is an elegant solution to a complex problem. The design involved many parts including graph traversal, custom data structures and the greedy approach.

When designing programs, it's great to see them work. With Dijkstra, the algorithm did allow us to find the shortest path between a source `vertex` and destination. However, our scanned `frontier` could be refined to be more efficient, and Chapter 16 closed with a preview of how. In this chapter, we'll build the binary heap that makes that preview work.

## How it works

In its basic form, a heap is just an array. However, unlike an array, we visualize it as a tree. The term "visualize" implies we use processing techniques normally associated with recursive data structures. This shift in thinking has numerous advantages. Consider the following:

```swift
// A simple array of unsorted integers
let numberList: Array<Int> = [8, 2, 10, 9, 11, 7]
```

As shown, `numberList` can be easily represented as a heap. Starting at index 0, items fill a corresponding spot as a parent or child node. Each parent also has two children, with the exception of index 2.

Since the arrangement of values is sequential, a simple pattern emerges. For any element at index `i`, we can accurately predict its position using these formulas:

- **Parent**: `(i - 1) / 2`
- **Left child**: `2 * i + 1`
- **Right child**: `2 * i + 2`

## Sorting heaps

An interesting feature of heaps is their ability to order data. As we've seen, many algorithms are designed to sort entire datasets. A heap asks for much less: nodes are arranged so each parent contains a lesser value than its children. In computer science, this is called a min-heap. The rule says nothing about how siblings or cousins compare, so a heap isn't a sorted array. It guarantees only that the smallest value sits at the root, and that guarantee is exactly what a priority queue needs.

## Exploring the frontier

With Dijkstra, we used a concept called the `frontier`. Coded as a dictionary of paths, we compared the total `weight` of each path to find the shortest path:

```swift
// Find the cheapest frontier path using the greedy approach - O(n)
var bestPath: Path<T>? = nil

for itemPath in frontier.values {
    if let currentBest = bestPath, currentBest.total <= itemPath.total {
        continue
    }
    bestPath = itemPath
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

    // Use the bottom-up approach
    var childIndex = heap.count - 1

    while childIndex > 0 {

        // Integer division finds the parent position
        let parentIndex = (childIndex - 1) / 2

        // Swap child and parent positions
        if heap[childIndex].total < heap[parentIndex].total {
            heap.swapAt(parentIndex, childIndex)
            childIndex = parentIndex
        }
        else {
            break
        }
    }
}
```

The `enQueue` method accepts a single `Path` as a parameter. The new path starts at the end of the array and swaps upward as long as it costs less than its parent. Swift's integer division discards the remainder, so `(childIndex - 1) / 2` lands on the parent for both left and right children. Unlike other sorting algorithms, our primary goal isn't to sort each item, but to find the smallest value. This means we can increase our efficiency by comparing a subset of values: one per level, along a single path toward the root.

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

The `PathHeap` also provides a `deQueue` method to remove the shortest path from the `frontier` once it has been processed. It's tempting to simply call `heap.remove(at: 0)`, but that shifts every remaining element one position to the left, which costs `O(n)` and, worse, scrambles the parent-child relationships. Suppose the heap holds totals `[1, 4, 2, 5, 6, 3]`, a valid min-heap. Removing index 0 leaves `[4, 2, 5, 6, 3]`, and `peek` would now report 4 even though 2 is the smallest remaining total.

The correct approach mirrors `enQueue` in the opposite direction. We move the last path into the root position, then let it sink, swapping it with its smaller child until neither child costs less:

```swift
// Removes the shortest path and restores the min-heap property - O(log n)
public func deQueue() {

    guard heap.count > 0 else {
        return
    }

    // Move the last path into the root position
    heap.swapAt(0, heap.count - 1)
    heap.removeLast()

    // Sink the new root until the min-heap property holds
    var parentIndex = 0

    while true {
        let leftIndex = 2 * parentIndex + 1
        let rightIndex = leftIndex + 1
        var smallest = parentIndex

        if leftIndex < heap.count && heap[leftIndex].total < heap[smallest].total {
            smallest = leftIndex
        }
        if rightIndex < heap.count && heap[rightIndex].total < heap[smallest].total {
            smallest = rightIndex
        }

        // Both children cost at least as much as the parent
        if smallest == parentIndex {
            break
        }

        heap.swapAt(parentIndex, smallest)
        parentIndex = smallest
    }
}
```

Applied to our example, the last total (3) moves to the root, giving `[3, 4, 2, 5, 6]`. Its smaller child is 2, so they swap, giving `[2, 4, 3, 5, 6]`, and 3 now has no children. The heap is valid again and `peek` correctly reports 2. Because the sinking path runs from the root to at most one leaf, removal costs `O(log n)`.

## The results

With the `frontier` refactored, let's see the applied changes. As new paths are discovered, they are automatically sorted by the `frontier`. The `count` property forms the base case for our loop condition and the `bestPath` is retrieved using the `peek` method:

```swift
// Dijkstra's shortest path using heap-based frontier
let frontier: PathHeap = PathHeap<T>()

while frontier.count != 0 {
    // Use the greedy approach to obtain the best path - O(1)
    guard let bestPath: Path<T> = frontier.peek() else {
        break
    }

    // Remove it from the frontier - O(log n)
    frontier.deQueue()
    ...
```

The full method, including how it skips outdated entries for vertices that have already been settled, appears in [Chapter 16](16-shortest-paths.md).

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

    // Determines whether one element belongs above another for this heap type
    private func outranks(_ lhs: T, _ rhs: T) -> Bool {
        switch heapType {
        case .min:
            return lhs < rhs
        case .max:
            return lhs > rhs
        }
    }

    // Insert element and bubble up to maintain heap property - O(log n)
    public func enQueue(_ key: T) {

        items.append(key)

        // Use the bottom-up approach
        var childIndex = items.count - 1

        while childIndex > 0 {

            let parentIndex = (childIndex - 1) / 2

            // Stop once the child no longer outranks its parent
            guard outranks(items[childIndex], items[parentIndex]) else {
                break
            }

            items.swapAt(parentIndex, childIndex)
            childIndex = parentIndex
        }
    }

    // Remove and return the root element, then sink to restore order - O(log n)
    @discardableResult
    public func deQueue() -> T? {

        guard let root = items.first else {
            return nil
        }

        // Move the last element into the root position
        items.swapAt(0, items.count - 1)
        items.removeLast()

        // Use the top-down approach
        var parentIndex = 0

        while true {
            let leftIndex = 2 * parentIndex + 1
            let rightIndex = leftIndex + 1
            var candidate = parentIndex

            if leftIndex < items.count && outranks(items[leftIndex], items[candidate]) {
                candidate = leftIndex
            }
            if rightIndex < items.count && outranks(items[rightIndex], items[candidate]) {
                candidate = rightIndex
            }

            // Neither child outranks the parent
            if candidate == parentIndex {
                break
            }

            items.swapAt(parentIndex, candidate)
            parentIndex = candidate
        }

        return root
    }
}
```

The generic `Heap` mirrors the `PathHeap` design but adds flexibility through the `outranks` helper, which captures the only difference between the two orderings. For a min-heap, smaller values bubble toward the root. For a max-heap, larger values bubble up instead. With both `enQueue` and `deQueue` in place, the generic heap is a complete priority queue: each operation walks a single root-to-leaf path, comparing at most about `log n` elements, for `O(log n)` per operation.

## Building algorithmic intuition

Heaps demonstrate a powerful idea: by maintaining a simple invariant — every parent has higher priority than its children — we get `O(log n)` operations through local comparisons that preserve global structure. The bubble-up and sink-down processes only examine elements along a single root-to-leaf path, yet the entire heap stays ordered. This pattern of local operations maintaining global invariants appears throughout algorithm design, from self-balancing trees in [Chapter 12](12-tree-balancing.md) to the graph algorithms we explored in [Chapter 16](16-shortest-paths.md).

The real payoff is what we saw in [Chapter 16](16-shortest-paths.md), where the `PathHeap` replaces a brute-force `O(n)` scan with `O(1)` minimum access and `O(log n)` removal — a change that transforms Dijkstra from `O(V²)` to `O((V + E) log V)` on sparse graphs. Understanding heaps as the engine behind priority queues reveals why they appear wherever algorithms need to repeatedly answer the question: what's the most important element right now? The same question returns in [Chapter 23](23-similarity-operations.md), where selecting the few best matches from a large catalog is a natural job for a small heap.
