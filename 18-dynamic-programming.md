---
layout: chapter
title: "Chapter 18: Dynamic Programming"
description: "Use memoization and tabulation to eliminate redundant computation in recursive algorithms with dynamic programming in Swift"
---
# Dynamic Programming

In our exploration of algorithms, we've applied many techniques to produce results. Some concepts have used iOS-specific patterns while others have been more generalized. In [Chapter 6](06-recursion.md), we briefly met one of the most powerful of these ideas when we cached Fibonacci results in a dictionary. That technique belongs to a broader programming style called dynamic programming. While straightforward in theory, its application can sometimes be nuanced. When applied correctly, dynamic programming can have a powerful effect on how we write code. In this chapter, we'll define the concept precisely, implement it two ways, and distinguish it from simply storing data for later.

## Save for later

If we've purchased something through Amazon.com, we'll be familiar with the site term "Save For Later." As the phrase implies, shoppers are provided the option to add items to their cart or save them to a "Wish List" for later viewing. When writing algorithms, we often face a similar choice of completing actions (performing computations) as data is being interpreted or storing the results for later use. Examples include retrieving JSON data from a RESTful service or using the Core Data Framework.

Saving data for later is useful, but on its own it isn't dynamic programming. Dynamic programming is a way of solving a problem by breaking it into smaller subproblems of the same shape, where the same subproblems come up again and again. It rests on four ingredients. First, a **state** that names each subproblem, such as "the Fibonacci number at position i". Second, a **recurrence** that expresses a state's answer in terms of smaller states. Third, **base cases** that are answered directly. Fourth, **reuse**: because the subproblems overlap, each one is solved once and its answer is looked up thereafter. That reuse takes one of two forms. **Memoization** keeps the natural top-down recursion and stores each answer the first time it's computed. **Tabulation** works bottom-up, filling a table from the base cases toward the answer we want. As we'll see, this style of programming provides numerous benefits.

## Fibonacci revisited

In [Chapter 6](06-recursion.md), we built the Fibonacci sequence iteratively and recursively, and we watched the call count of the simple recursive version explode. Let's revisit that recursive version, written here with a slightly different set of base cases:

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

At first glance, this small function appears efficient. However, upon further analysis, we see numerous recursive calls must be made for it to calculate any result. Since `fibExponential` cannot store previously calculated values, it solves the same subproblems over and over. When we calculate `fibExponential(5)`, the function calculates `fibExponential(3)` two separate times and `fibExponential(2)` three separate times. The repetition compounds as n grows: `fibExponential(40)` makes 204,668,309 function calls. (The Chapter 6 version, whose base case stops at `n <= 1`, makes 331,160,281 calls for the same input, because it recurses one level deeper.) The number of calls grows exponentially — bounded above by `O(2^n)` — so for larger numbers, this approach becomes unusable.

## Fibonacci with tabulation

Fibonacci has all four dynamic programming ingredients. The state is `fib(i)`, the recurrence is `fib(i) = fib(i - 1) + fib(i - 2)`, the base cases are `fib(0) = 0` and `fib(1) = 1`, and the subproblems overlap heavily, as the call counts above show. Chapter 6 applied memoization, keeping the recursion and caching each result. Here we'll apply tabulation instead, filling a table from the base cases upward so every entry is computed exactly once:

```swift
extension Int {

    // Compute the nth Fibonacci number by filling a table from the base cases upward
    func fibTabulated() -> Int {

        precondition(self >= 0, "Fibonacci positions must be zero or greater")

        // Base cases
        if self < 2 {
            return self
        }

        // table[i] holds fib(i)
        var table = Array<Int>(repeating: 0, count: self + 1)
        table[1] = 1

        // Fill each entry from the two before it
        for i in 2...self {
            table[i] = table[i - 1] + table[i - 2]
        }

        return table[self]
    }
}
```

The base cases are handled before any table is built, so `0.fibTabulated()` returns 0 and `1.fibTabulated()` returns 1. Negative positions have no Fibonacci value, so the `precondition` stops the program with a clear message rather than producing a misleading answer. For every larger position, the loop visits each entry once, reading two earlier entries that are already filled in. The fill order is what makes tabulation work: by the time we compute `table[i]`, both of the states it depends on have been solved. Calculating `fib(40)` takes 39 additions, one for each entry from 2 through 40, and the function runs in linear time, `O(n)`, using `O(n)` space for the table.

Since each entry needs only the two before it, we could even discard the rest of the table and keep two variables, reducing the space to `O(1)`. Keeping the full table makes the subproblems visible, which is helpful while we learn. One practical limit applies to every version: Fibonacci numbers grow quickly, and position 92 is the largest whose value fits in Swift's 64-bit `Int`.

The benefit of this technique is seen when comparing the approaches:

| Approach | Time | Space | Work to compute fib(40) |
|----------|------|-------|-------------------------|
| Naive recursion | `O(2^n)` | `O(n)` call stack | 204,668,309 calls |
| Memoization (Chapter 6) | `O(n)` | `O(n)` cache and call stack | 41 distinct subproblems solved once each |
| Tabulation | `O(n)` | `O(n)` table | 39 additions |

## Shortest paths

Dynamic programming ideas also surface in algorithms that aren't usually labeled that way. An example can be seen with Dijkstra's Algorithm and Shortest Paths from [Chapter 16](16-shortest-paths.md). To review, we created a unique data structure named `Path` with the goal of storing specific traversal metadata:

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

Storing a `Path` and its history doesn't make an algorithm dynamic programming by itself; it's a convenient record of how we arrived somewhere. What connects Dijkstra to dynamic programming is the way the shortest totals are reused. Shortest paths have **optimal substructure**: if the cheapest route from A to E runs through D, then the part of it from A to D must itself be the cheapest route to D. The state is "the shortest distance from the source to vertex v", and the recurrence says that distance is the smallest of `distance(u) + weight(u, v)` over every edge leading into v. When Dijkstra settles a vertex, its total is final, and every later relaxation reuses that solved subproblem instead of recomputing it. Dijkstra's contribution is the greedy order, which settles subproblems from cheapest to most expensive so each one is solved before anything depends on it.

## Remembering the insertion path

Not every saved result is a subproblem, and the balancing model from [Chapter 12](12-tree-balancing.md) offers a useful contrast. `BSModel` tracks `height` and performs rotations after each insertion. The challenge is knowing which nodes to rebalance. After inserting a new leaf, all of its ancestors may need their `height` values recalculated. Our nodes have no parent pointers, so without help we would need to search from the `root` again to find them.

Instead, `BSModel` records the insertion path using a [Stack](10-stacks-and-queues.md). As the algorithm traverses downward to find the correct insertion position, each visited node is pushed onto the stack:

```swift
// Store node references during downward traversal
private var stack = Stack<BSNode<T>>()

// Remember each visited node during insertion
private func push(element: inout BSNode<T>) {
    stack.push(element)
}
```

After the new element is placed, the `rebalance` method pops nodes one by one — walking back up the insertion path — recalculating `height` values and performing rotations where needed:

```swift
// Walk back up the recorded insertion path, rebalancing as needed
private func rebalance() {

    while let bsNode = stack.peek() {

        // Recalculate height for this node
        setHeight(for: bsNode)

        // Positive values are left-heavy, negative values are right-heavy
        let balance = balanceFactor(of: bsNode)

        if balance > 1, let leftChild = bsNode.left {

            // Left-right case: straighten the left subtree first
            if balanceFactor(of: leftChild) < 0 {
                self.rotateLeft(for: leftChild)
            }

            self.rotateRight(for: bsNode)
        }

        else if balance < -1, let rightChild = bsNode.right {

            // Right-left case: straighten the right subtree first
            if balanceFactor(of: rightChild) > 0 {
                self.rotateRight(for: rightChild)
            }

            self.rotateLeft(for: bsNode)
        }

        stack.pop()
    }
}
```

The stack holds the `O(log n)` nodes along the insertion path of a balanced tree, giving us direct access to every ancestor without re-traversing the tree. This is valuable bookkeeping, but it isn't memoization. The stack stores *where we've been*, not *answers we've computed*, and no subproblem is ever looked up a second time. The stored `height` values come closer: each node's height is computed from its children's stored heights rather than by re-measuring the subtree, which is the same compute-once, reuse-later habit that dynamic programming formalizes. Recognizing that difference — between keeping state and reusing solved subproblems — is what lets us spot genuine dynamic programming opportunities.

## Building algorithmic intuition

Dynamic programming solves problems whose subproblems overlap. Once we define a state, a recurrence, and base cases, we can solve each subproblem once and reuse its answer, either top-down with memoization as in [Chapter 6](06-recursion.md) or bottom-up with tabulation as in this chapter. The payoff can be dramatic: computing `fib(40)` falls from more than 200 million recursive calls to 39 additions. The key is recognizing overlap. If a recursive solution computes the same values repeatedly, dynamic programming transforms an exponential algorithm into a linear one by trading space for speed.

The same lens helps us read other algorithms clearly. Dijkstra's algorithm in [Chapter 16](16-shortest-paths.md) reuses settled shortest distances, relying on the optimal substructure of shortest paths. The insertion-path stack from [Chapter 12](12-tree-balancing.md), by contrast, is careful bookkeeping rather than subproblem reuse. And the PageRank computation in [Chapter 19](19-pagerank-algorithm.md) refines its estimates by repeated iteration, a different strategy again. Distinguishing these patterns connects to the performance analysis of [Chapter 8](08-performance-analysis.md) and to choosing the right tool for each problem.
