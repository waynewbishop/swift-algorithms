---
layout: chapter
title: "Chapter 6: Recursion"
description: "Understand recursion in Swift through factorial, Fibonacci, and recursive data structure traversal examples"
---
# Recursion

In [Chapter 5](05-advanced-sorting.md), we saw how Quicksort uses recursion to partition and sort arrays. Now it's time to explore recursion more deeply as a fundamental programming technique. Understanding recursion is crucial—we'll use it extensively when we build linked lists, trees, and graphs.

## The recursive mindset

Recursion is best understood when compared to the iterative approaches we've seen so far. With traditional loops, we explicitly manage the progression through our data. With recursion, we break down a problem into smaller, similar subproblems, solve each subproblem, and combine the results.

## Understanding recursive structure

Every recursive solution has two essential components. The base case provides the condition that stops the recursion—without it, your function would call itself indefinitely. The recursive case is where the function calls itself with a modified version of the original problem, gradually moving toward the base case.

Let's see this in action with a simple example - calculating factorial:

```swift
// Calculate factorial using recursion (n! = n × (n-1)!)
func factorial(_ n: Int) -> Int {
    //base case: factorial of 0 or 1 is 1
    if n <= 1 {
        return 1
    }

    //recursive case: n! = n × (n-1)!
    return n * factorial(n - 1)
}

//execute factorial
print("5! = \(factorial(5))")  //outputs: 5! = 120
```

## Visualizing recursive execution

Understanding how recursion executes requires seeing the call stack in action. When we call `factorial(5)`, here's what happens:

<figure>
  <img src="Images/06-recursion-stack.png" alt="Recursive function calling itself">
  <figcaption>Figure 6.1: A recursive function calls itself, stacking frames until the base case returns.</figcaption>
</figure>

<figure>
  <img src="Images/06-recursion-call-stack.png" alt="Recursive call stack unwinding">
  <figcaption>Figure 6.2: Each recursive call pushes a new frame; each return unwinds one back off the stack.</figcaption>
</figure>

```
factorial(5)
  → calls factorial(4)
    → calls factorial(3)
      → calls factorial(2)
        → calls factorial(1)
          → returns 1 (base case!)
        ← returns 2 × 1 = 2
      ← returns 3 × 2 = 6
    ← returns 4 × 6 = 24
  ← returns 5 × 24 = 120
```

Each function call waits for the next call to complete before it can calculate its own result. This is why the base case is critical—it stops the stack from growing indefinitely and allows the return values to propagate back up.

### infinite recursion

The most common recursion error is forgetting or incorrectly defining the base case:

```swift
// Infinite recursion - never stops!
func brokenFactorial(_ n: Int) -> Int {
    return n * brokenFactorial(n - 1)  // No base case!
}
```

This code will eventually crash due to stack overflow error—the function calls itself endlessly until memory runs out. Every recursive function must have a base case that eventually executes.

## The Fibonacci sequence

The Fibonacci sequence provides an excellent example for understanding recursive thinking. Each number in the sequence is the sum of the two preceding numbers: 0, 1, 1, 2, 3, 5, 8, 13, 21...

Let's compare iterative and recursive approaches:

### Iterative Fibonacci

```swift
// Generate first n Fibonacci numbers using iteration
func fibonacciIterative(_ n: Int) -> [Int] {
    guard n > 0 else { return [] }
    guard n > 1 else { return [0] }

    var sequence = [0, 1]

    for i in 2..<n {
        let nextValue = sequence[i - 1] + sequence[i - 2]
        sequence.append(nextValue)
    }

    return sequence
}

//generate first 8 fibonacci numbers
let iterativeResult = fibonacciIterative(8)
print("Iterative: \(iterativeResult)")
```

### Recursive Fibonacci (simple version)

```swift
// Calculate nth Fibonacci number using simple recursion - O(2^n)
func fibonacci(_ n: Int) -> Int {
    //base cases
    if n <= 1 {
        return n
    }

    //recursive case
    return fibonacci(n - 1) + fibonacci(n - 2)
}

// Generate sequence of Fibonacci numbers using recursive calculation
func fibonacciSequence(_ count: Int) -> [Int] {
    var sequence: [Int] = []
    for i in 0..<count {
        sequence.append(fibonacci(i))
    }
    return sequence
}

let recursiveResult = fibonacciSequence(8)
print("Recursive: \(recursiveResult)")
```

### Understanding recursive complexity

The simple recursive Fibonacci has a serious performance problem. Each call spawns two more calls, creating an exponential number of function calls with `O(2^n)` time complexity:

```swift
// Calculate Fibonacci while counting recursive calls to show exponential complexity - O(2^n)
func fibonacciWithCounting(_ n: Int, callCount: inout Int) -> Int {
    callCount += 1

    if n <= 1 {
        return n
    }

    return fibonacciWithCounting(n - 1, callCount: &callCount) +
           fibonacciWithCounting(n - 2, callCount: &callCount)
}

//count function calls for fibonacci(10)
var calls = 0
let result = fibonacciWithCounting(10, callCount: &calls)
print("fibonacci(10) = \(result) required \(calls) function calls")
```

## Optimizing recursion with memoization

We can dramatically improve recursive performance using memoization - storing previously computed results:

```swift
// Calculate Fibonacci using memoization to avoid redundant calculations - O(n)
func fibonacciMemoized(_ n: Int, memo: inout [Int: Int]) -> Int {
    //check if we've already computed this value
    if let cached = memo[n] {
        return cached
    }

    //base cases
    if n <= 1 {
        memo[n] = n
        return n
    }

    //compute and store result
    let result = fibonacciMemoized(n - 1, memo: &memo) +
                 fibonacciMemoized(n - 2, memo: &memo)
    memo[n] = result
    return result
}

//test memoized version
var memoCache: [Int: Int] = [:]
let memoResult = fibonacciMemoized(10, memo: &memoCache)
print("Memoized fibonacci(10) = \(memoResult)")
print("Cache contains: \(memoCache)")
```

## Building algorithmic intuition

Recursion is particularly well-suited for problems with naturally recursive structure. Tree traversals ([Chapter 11](11-binary-search-trees.md)) and graph searches ([Chapter 13](13-graphs.md)) become elegant when expressed recursively, as do divide and conquer algorithms like the quicksort we explored in [Chapter 5](05-advanced-sorting.md). Mathematical sequences such as Fibonacci numbers, factorials, and combinatorics problems often have simple recursive definitions that mirror their mathematical formulas. Finally, recursion excels at processing nested data, whether parsing JSON, traversing file systems, or navigating nested arrays and dictionaries. The key is recognizing when a problem can be naturally decomposed into smaller instances of itself.
