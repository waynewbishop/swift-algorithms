---
layout: chapter
title: "Chapter 18: Dynamic Programming"
description: "Use memoization to eliminate redundant computation in recursive algorithms with dynamic programming in Swift"
---
# Dynamic Programming

In our exploration of algorithms, we've applied many techniques to produce results. Some concepts have used iOS-specific patterns while others have been more generalized. Although it hasn't been explicitly mentioned, some of our solutions have used a particular programming style called dynamic programming. While straightforward in theory, its application can sometimes be nuanced. When applied correctly, dynamic programming can have a powerful effect on how we write code. In this chapter, we'll introduce the concept and implementation of dynamic programming.

## Save for later

If we've purchased something through Amazon.com, we'll be familiar with the site term "Save For Later." As the phrase implies, shoppers are provided the option to add items to their cart or save them to a "Wish List" for later viewing. When writing algorithms, we often face a similar choice of completing actions (performing computations) as data is being interpreted or storing the results for later use. Examples include retrieving JSON data from a RESTful service or using the Core Data Framework.

In iOS, design patterns can help us time and coordinate how data is processed. Specific techniques include multi-threaded operations (e.g. Grand Central Dispatch), Notifications and Delegation. Dynamic programming on the other hand, isn't necessarily a single coding technique, but rather how to think about actions (e.g. sub problems) that occur as a function operates. The resulting solution could differ depending on the problem. In its simplest form, dynamic programming relies on data storage and reuse to increase algorithm efficiency. The process of data reuse is also called memoization and can take many forms. As we'll see, this style of programming provides numerous benefits.

## Fibonacci revisited

In [Chapter 6](06-recursion.md), we compared building the classic sequence of array values using both iterative and recursive techniques. As discussed, these algorithms were designed to produce an array sequence, not to calculate a particular result. Taking this into account, we can create a new version of Fibonacci to return a single `Int` value:

```swift
// Naive recursive Fibonacci - O(2^n) due to repeated calculations
func fibExponential(n: Int) -> Int {
    if n == 0 {
        return 0
    }

    if n <= 2 {
        return 1
    }

    return fibExponential(n: n-1) + fibExponential(n: n-2)
}
```

At first glance, it appears this seemingly small function would also be efficient. However, upon further analysis, we see numerous recursive calls must be made for it to calculate any result. Since `fibExponential` cannot store previously calculated values, its recursive calls increase exponentially. When we calculate `fibExponential(5)`, the function calculates `fibExponential(3)` three separate times and `fibExponential(2)` five separate times. For `fibExponential(40)`, the function makes over 330 million function calls. The time complexity is `O(2^n)` — exponential. For larger numbers, this approach becomes unusable.

## Fibonacci memoized

Let's try a different technique. Designed as a nested Swift function, `fibMemoized` captures the array return value from its `fibSequence` sub-function to calculate a final value:

```swift
extension Int {

    // Compute the nth Fibonacci number using memoization with nested helper function
    func fibMemoized() -> Int {

        // Recursively build the complete Fibonacci sequence up to position n
        func fibSequence(_ sequence: Array<Int> = [0, 1]) -> Array<Int> {
            var final = Array<Int>()

            // Mutated copy
            var output = sequence

            let i: Int = output.count

            // Set base condition - linear time O(n)
            if i == self {
                return output
            }

            let results: Int = output[i - 1] + output[i - 2]
            output.append(results)

            // Set iteration
            final = fibSequence(output)

            return final
        }

        // Calculate final product - constant time O(1)
        let results = fibSequence()
        let answer: Int = results[results.endIndex - 1] + results[results.endIndex - 2]

        return answer
    }
}
```

Even though `fibSequence` includes a recursive sequence, its base case is determined by the number of requested array positions (n). In performance terms, we say `fibSequence` runs in linear time or `O(n)`. This performance improvement is achieved by memoizing the array sequence needed to calculate the final product. As a result, each sequence permutation is computed once. The benefit of this technique is seen when comparing the two algorithms:

| Approach | Time | Space | Fibonacci(40) | Function calls |
|----------|------|-------|---------------|----------------|
| Naive recursion | `O(2^n)` | `O(n)` | ~5 seconds | 331,160,281 |
| Memoization | `O(n)` | `O(n)` | Instant | 79 |

## Shortest paths

Code memoization can also improve a program's efficiency to the point of making seemingly difficult or nearly unsolvable questions answerable. An example of this can be seen with Dijkstra's Algorithm and Shortest Paths from [Chapter 16](16-shortest-paths.md). To review, we created a unique data structure named `Path` with the goal of storing specific traversal metadata:

```swift
// The Path class maintains objects that comprise the frontier
public class Path<T> {

    // Cumulative cost from source to this destination
    var total: Int

    // The vertex reached by following this path
    var destination: Vertex<T>

    // Reference to previous path segment, forming a linked chain
    var previous: Path?

    // Creates a new empty path with zero cost
    public init() {
        destination = Vertex<T>()
        total = 0
    }
}
```

What makes `Path` useful is its ability to store data on nodes previously visited. Similar to our revised Fibonacci algorithm, `Path` stores the cumulative edge `weights` of all traversed vertices (`total`) as well as a complete history of each visited `vertex`. Used effectively, this allows the programmer to answer questions such as the complexity of navigating to a particular destination `vertex`, if the traversal was indeed successful (in finding the destination), as well as the list of nodes visited throughout. Depending on the graph size and complexity, not having this information available could mean having the algorithm take so long to recompute data that it becomes too slow to be effective, or not being able to solve vital questions due to insufficient data.

## Stack memoization

Memoization isn't limited to arrays and sequences. In [Chapter 12](12-tree-balancing.md), we built `BSModel` — a self-balancing binary search tree that tracks `height` and performs rotations after each insertion. The challenge is knowing which nodes to rebalance. After inserting a new leaf, all of its ancestors may need their `height` values recalculated. Without memoization, we would need to traverse from the `root` to find affected nodes — an expensive `O(n)` operation.

Instead, `BSModel` memoizes the insertion path using a [Stack](10-stacks-and-queues.md). As the algorithm traverses downward to find the correct insertion position, each visited node is pushed onto the stack:

```swift
// Store node references during downward traversal
private var stack = Stack<BSNode<T>>()

// Memoize each visited node during insertion
private func push(element: inout BSNode<T>) {
    stack.push(element)
}
```

After the new element is placed, the `rebalance` method pops nodes one by one — walking back up the insertion path — recalculating `height` values and performing rotations where needed:

```swift
// Walk back up the memoized insertion path, rebalancing as needed
private func rebalance() {

    while stack.count > 0 {

        // Obtain reference
        let current = stack.peek()

        guard let bsNode: BSNode<T> = current else {
            return
        }

        // Recalculate height
        setHeight(for: bsNode)

        if self.isTreeBalanced(for: bsNode) == true {
            //tree balanced
        }
        else {
            // Determine side imbalance
            let right = getHeight(of: bsNode.left) - getHeight(of: bsNode.right)
            let left = getHeight(of: bsNode.right) - getHeight(of: bsNode.left)

            if right > 1 {
                self.rotateRight(for: bsNode)
            }

            if left > 1 {
                self.rotateLeft(for: bsNode)
            }
        }

        stack.pop()
    }
}
```

This technique trades `O(log n)` space (the stack depth) for `O(log n)` time rebalancing. The stack gives us direct access to every ancestor along the insertion path, eliminating the need to re-traverse the tree. Like the Fibonacci array and Dijkstra's `Path`, the stack stores intermediate results as they are computed, allowing the algorithm to reuse them later without redundant work.

## Building algorithmic intuition

Dynamic programming solves problems by combining recursion ([Chapter 6](06-recursion.md)) with caching to avoid redundant computation. The memoization pattern — storing previously computed results — transforms exponential algorithms into linear time by trading space for speed. Recognizing overlapping subproblems is the key: if a recursive solution computes the same values repeatedly, memoization provides dramatic performance improvements. We saw this with Fibonacci, where naive recursion makes over 330 million calls for a single calculation that memoization handles in 79.

The same principle extends beyond numerical sequences. In [Chapter 16](16-shortest-paths.md), the `Path` data structure memoizes traversal metadata — cumulative `weights` and visit history — enabling Dijkstra's algorithm to build optimal routes without recomputing paths from scratch. In [Chapter 12](12-tree-balancing.md), a stack memoizes the insertion path so rebalancing can walk upward without re-traversing the tree. Whether we use arrays, stacks from [Chapter 10](10-stacks-and-queues.md), or custom data structures, the principle remains the same: calculate once, use many times. This concept connects to performance analysis in [Chapter 8](08-performance-analysis.md) and the heap optimizations we explored in [Chapter 17](17-heaps.md).
