---
layout: chapter
title: "Chapter 18: Dynamic Programming"
description: "Solve complex problems with memoization"
---
# Dynamic Programming

In our exploration of algorithms, we've applied many techniques to produce results. Some concepts have used iOS-specific patterns while others have been more generalized. Although it hasn't been explicitly mentioned, some of our solutions have used a particular programming style called dynamic programming. While straightforward in theory, its application can sometimes be nuanced. When applied correctly, dynamic programming can have a powerful effect on how you write code. In this chapter, we'll introduce the concept and implementation of dynamic programming.

## Save for later

If you've purchased something through Amazon.com, you'll be familiar with the site term "Save For Later." As the phrase implies, shoppers are provided the option to add items to their cart or save them to a "Wish List" for later viewing. When writing algorithms, we often face a similar choice of completing actions (performing computations) as data is being interpreted or storing the results for later use. Examples include retrieving JSON data from a RESTful service or using the Core Data Framework.

In iOS, design patterns can help us time and coordinate how data is processed. Specific techniques include multi-threaded operations (e.g. Grand Central Dispatch), Notifications and Delegation. Dynamic programming on the other hand, isn't necessarily a single coding technique, but rather how to think about actions (e.g. sub problems) that occur as a function operates. The resulting solution could differ depending on the problem. In its simplest form, dynamic programming relies on data storage and reuse to increase algorithm efficiency. The process of data reuse is also called memoization and can take many forms. As we'll see, this style of programming provides numerous benefits.

Dynamic programming builds on recursion from [Chapter 6](06-recursion), but adds memoization—storing results in a cache (typically an Array or a Dictionary from [Chapter 14](14-hash-tables)) to avoid redundant calculations. This transforms exponential O(2^n) algorithms into linear O(n) solutions, demonstrating the dramatic space-time tradeoffs analyzed in [Chapter 8](08-performance-analysis). Where naive recursion uses the call stack ([Chapter 10](10-stacks-and-queues)'s stack concept), dynamic programming uses explicit data structures to track subproblem solutions.

## Fibonacci revisited

In the chapter on Recursion, we compared building the classic sequence of Array values using both iterative and recursive techniques. As discussed, these algorithms were designed to produce an Array sequence, not to calculate a particular result. Taking this into account, we can create a new version of Fibonacci to return a single Int value:

```swift
// Naive Fibonacci with exponential time complexity - O(2^n) due to repeated calculations
func fibRecursive(n: Int) -> Int {
    if n == 0 {
        return 0
    }

    if n <= 2 {
        return 1
    }

    return fibRecursive(n: n-1) + fibRecursive(n: n-2)
}
```

At first glance, it appears this seemingly small function would also be efficient. However, upon further analysis, we see numerous recursive calls must be made for it to calculate any result. Since `fibRecursive` cannot store previously calculated values, its recursive calls increase exponentially. When you calculate `fibonacci(5)`, the function calculates `fibonacci(3)` three separate times and `fibonacci(2)` five separate times. For `fibonacci(40)`, the function makes over 330 million function calls. The time complexity is O(2^n)—exponential. For larger numbers, this approach becomes unusable.

## Fibonacci memoized

Let's try a different technique. Designed as a nested Swift function, `fibMemoized` captures the Array return value from its `fibSequence` sub-function to calculate a final value:

```swift
// Memoized Fibonacci using nested functions and Array-based caching - O(n) time
extension Int {
    mutating func fibMemoized() -> Int {
        // Builds array sequence
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

Even though `fibSequence` includes a recursive sequence, its base case is determined by the number of requested Array positions (n). In performance terms, we say `fibSequence` runs in linear time or O(n). This performance improvement is achieved by memoizing the Array sequence needed to calculate the final product. As a result, each sequence permutation is computed once.

## Comparing approaches

Let's compare naive recursion vs memoization:

| Approach | Time | Space | Fibonacci(40) | Function Calls |
|----------|------|-------|---------------|----------------|
| Naive recursion | O(2^n) | O(n) | ~5 seconds | 331,160,281 |
| Memoization | O(n) | O(n) | Instant | 79 |

The performance difference is dramatic. Exponential algorithms quickly become unusable, while dynamic programming with memoization remains fast even for large inputs.

## Climbing stairs

Consider another classic problem that demonstrates memoization using a Dictionary. You're climbing a staircase with n steps, and you can climb either 1 or 2 steps at a time. How many distinct ways can you reach the top?

For example, with 3 steps, there are 3 different ways:
- 1 step + 1 step + 1 step
- 1 step + 2 steps
- 2 steps + 1 step

This problem appears in iOS contexts more than you might think. Fitness apps that track step counts, animation systems that interpolate between states, or game mechanics involving movement patterns all encounter variations of this counting problem.

The naive recursive approach suffers from the same exponential explosion as Fibonacci:

```swift
// Naive recursive climbing - O(2^n) time complexity
func climbStairsNaive(_ n: Int) -> Int {
    if n <= 2 {
        return n
    }

    return climbStairsNaive(n - 1) + climbStairsNaive(n - 2)
}
```

Notice the pattern. To reach step n, we could arrive from step (n-1) by taking 1 step, or from step (n-2) by taking 2 steps. This gives us the same recursive structure as Fibonacci, but in a different problem domain.

Now let's apply memoization using a Dictionary—the most common pattern you'll encounter in practice:

```swift
// Memoized stair climbing using Dictionary cache - O(n) time
func climbStairs(_ n: Int) -> Int {
    var cache: [Int: Int] = [:]
    return climbHelper(n, cache: &cache)
}

func climbHelper(_ n: Int, cache: inout [Int: Int]) -> Int {
    // Check cache first
    if let cached = cache[n] {
        return cached
    }

    // Base cases
    if n <= 2 {
        return n
    }

    // Recursive calculation with memoization
    let result = climbHelper(n - 1, cache: &cache) + climbHelper(n - 2, cache: &cache)
    cache[n] = result

    return result
}

// Example usage
print(climbStairs(10))  // 89 distinct ways
print(climbStairs(30))  // 1346269 - computes instantly
```

This Dictionary-based approach is the canonical memoization pattern. Before calculating anything, we check if the result exists in our cache. If it does, we return it immediately. If not, we calculate it, store it, and then return it. This pattern works for any problem where subproblems overlap and solutions can be reused.

## Shortest paths

Code memoization can also improve a program's efficiency to the point of making seemingly difficult or nearly unsolvable questions answerable. An example of this can be seen with Dijkstra's Algorithm and Shortest Paths from [Chapter 12](12-graphs). To review, we created a unique data structure named Path with the goal of storing specific traversal metadata:

```swift
// Path class maintains objects that comprise the "frontier"
class Path {
    var total: Int
    var destination: Vertex
    var previous: Path?

    // Object initialization
    init() {
        destination = Vertex()
        total = 0
    }
}
```

What makes Path useful is its ability to store data on nodes previously visited. Similar to our revised Fibonacci algorithm, Path stores the cumulative Edge weights of all traversed vertices (total) as well as a complete history of each visited Vertex. Used effectively, this allows the programmer to answer questions such as the complexity of navigating to a particular destination Vertex, if the traversal was indeed successful (in finding the destination), as well as the list of nodes visited throughout. Depending on the Graph size and complexity, not having this information available could mean having the algorithm take so long to (re)compute data that it becomes too slow to be effective, or not being able to solve vital questions due to insufficient data.

## Why memoization works

Dynamic programming with memoization is effective because it trades a small amount of memory (storing previously computed results) for dramatic speed improvements. By remembering what we've already calculated, we avoid repeating expensive computations. This pattern appears throughout algorithm design—whether building Fibonacci sequences with Arrays, counting paths through problems like climbing stairs, or navigating graphs with Path objects.

The key insight is recognizing when your problem has overlapping subproblems that can be cached and reused. Once you spot this pattern, memoization transforms intractable exponential algorithms into practical linear-time solutions. Whether you use Arrays, Dictionaries, or custom data structures to store your results, the principle remains the same: calculate once, use many times. This is why dynamic programming remains one of the most powerful optimization techniques in computer science.
