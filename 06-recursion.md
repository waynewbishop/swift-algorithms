---
layout: chapter
title: "Chapter 6: Recursion"
description: "Understanding recursive algorithms and techniques"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Recursion

Now that we've explored algorithms and data structures through searching and sorting, it's time to introduce one of the most powerful and elegant programming techniques: recursion. Understanding recursion is crucial as we move forward to more complex data structures like trees and graphs, where recursive thinking becomes essential.

Recursion is a coding technique where a function calls itself to solve smaller versions of the same problem. While this might seem circular at first, recursion provides an elegant way to solve problems that have a naturally recursive structure. In this chapter, we'll explore how to think recursively and implement recursive solutions in Swift.

## The recursive mindset

Recursion is best understood when compared to the iterative approaches we've seen so far. With traditional loops, we explicitly manage the progression through our data. With recursion, we break down a problem into smaller, similar subproblems, solve each subproblem, and combine the results.

Consider how you might explain your family tree to someone:
- **Iterative approach**: List every person, generation by generation
- **Recursive approach**: "My family tree consists of me, plus my parents' family trees"

This recursive definition is both more concise and mirrors how family trees naturally work.

## Understanding recursive structure

Every recursive solution has two essential components:

### 1. Base case
The condition that stops the recursion. Without a base case, your function would call itself indefinitely.

### 2. Recursive case
The part where the function calls itself with a modified version of the original problem.

Let's see this in action with a simple example - calculating factorial:

```swift
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

Let's trace through `factorial(5)`:
- `factorial(5)` = 5 × `factorial(4)`
- `factorial(4)` = 4 × `factorial(3)`
- `factorial(3)` = 3 × `factorial(2)`
- `factorial(2)` = 2 × `factorial(1)`
- `factorial(1)` = 1 (base case)

Then the results combine back up:
- `factorial(2)` = 2 × 1 = 2
- `factorial(3)` = 3 × 2 = 6
- `factorial(4)` = 4 × 6 = 24
- `factorial(5)` = 5 × 24 = 120

## Classes vs. structs for recursive data

In Swift, understanding the difference between value types and reference types becomes crucial when building recursive data structures. Let's explore why:

```swift
//structs are value types - copied when assigned
struct Car {
    var color: String
    var make: String

    init(color: String, make: String) {
        self.color = color
        self.make = make
    }

    func describe() {
        print("A \(color) \(make)")
    }
}

//this won't work for recursive structures
struct TreeNode<T> {
    var value: T?
    var left: TreeNode?   //compilation error!
    var right: TreeNode?  //compilation error!
}
```

The struct version fails because Swift can't determine the size of a struct that contains itself. However, classes work because they use references:

```swift
//classes are reference types - this works!
class TreeNode<T> {
    var value: T?
    var left: TreeNode?
    var right: TreeNode?

    init(value: T?) {
        self.value = value
    }
}
```

## The Fibonacci sequence

The Fibonacci sequence provides an excellent example for understanding recursive thinking. Each number in the sequence is the sum of the two preceding numbers: 0, 1, 1, 2, 3, 5, 8, 13, 21...

Let's compare iterative and recursive approaches:

### Iterative Fibonacci

```swift
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
func fibonacci(_ n: Int) -> Int {
    //base cases
    if n <= 1 {
        return n
    }

    //recursive case
    return fibonacci(n - 1) + fibonacci(n - 2)
}

//generate sequence using recursive function
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

The simple recursive Fibonacci has a serious performance problem. Each call spawns two more calls, creating an exponential number of function calls:

```swift
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

This demonstrates why understanding algorithm complexity (from Chapter 2) is crucial when designing recursive solutions.

## Optimizing recursion with memoization

We can dramatically improve recursive performance using memoization - storing previously computed results:

```swift
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

## Recursive array processing

Recursion shines when processing arrays and other collections. Here are some common patterns:

### Recursive sum

```swift
func recursiveSum(_ array: [Int]) -> Int {
    //base case: empty array
    guard !array.isEmpty else { return 0 }

    //recursive case: first element + sum of rest
    let first = array[0]
    let rest = Array(array.dropFirst())
    return first + recursiveSum(rest)
}

let numbers = [1, 2, 3, 4, 5]
print("Sum: \(recursiveSum(numbers))")
```

### Recursive maximum

```swift
func recursiveMax(_ array: [Int]) -> Int? {
    //base case: empty array
    guard !array.isEmpty else { return nil }

    //base case: single element
    guard array.count > 1 else { return array[0] }

    //recursive case: max of first vs max of rest
    let first = array[0]
    let rest = Array(array.dropFirst())

    if let maxOfRest = recursiveMax(rest) {
        return max(first, maxOfRest)
    }

    return first
}

print("Maximum: \(recursiveMax(numbers) ?? 0)")
```

## Tail recursion

A special form of recursion where the recursive call is the last operation in the function. While Swift doesn't automatically optimize tail recursion, understanding it is important:

```swift
//not tail recursive - multiplication happens after recursive call
func factorial(_ n: Int) -> Int {
    if n <= 1 { return 1 }
    return n * factorial(n - 1)  //multiplication after recursive call
}

//tail recursive version - accumulator pattern
func factorialTailRecursive(_ n: Int, accumulator: Int = 1) -> Int {
    if n <= 1 {
        return accumulator
    }
    return factorialTailRecursive(n - 1, accumulator: n * accumulator)
}
```

## When to use recursion

Recursion is particularly well-suited for:

### 1. Problems with recursive structure
- Tree traversals
- Graph searches
- Divide and conquer algorithms

### 2. Mathematical sequences
- Fibonacci numbers
- Factorials
- Combinatorics

### 3. Processing nested data
- JSON parsing
- File system traversal
- Nested arrays or dictionaries

## Recursion pitfalls to avoid

### 1. Missing base case
```swift
//infinite recursion - will crash!
func badRecursion(_ n: Int) -> Int {
    return 1 + badRecursion(n - 1)  //no base case!
}
```

### 2. Exponential complexity
```swift
//inefficient - recalculates same values repeatedly
func inefficientFib(_ n: Int) -> Int {
    if n <= 1 { return n }
    return inefficientFib(n - 1) + inefficientFib(n - 2)
}
```

### 3. Stack overflow
Very deep recursion can exhaust the call stack. Consider iterative alternatives for problems with deep recursion.

## Looking ahead

Understanding recursion is essential for the data structures we'll explore next:

- **Chapter 8 (Linked Lists)**: Recursive insertion and deletion
- **Chapter 10 (Binary Search Trees)**: Recursive tree operations
- **Chapter 11 (Graphs)**: Recursive graph traversal algorithms
- **Chapter 15 (Dynamic Programming)**: Recursive problem decomposition

The recursive thinking patterns you learn here will make these advanced topics much more approachable.

## Building recursive intuition

When approaching a problem recursively, ask yourself:

1. **What's the simplest version of this problem?** (base case)
2. **How can I break the problem into smaller, similar problems?** (recursive case)
3. **How do I combine the results from subproblems?** (return value)
4. **Is this approach efficient enough?** (complexity analysis)

This framework will guide you toward elegant recursive solutions.

