---
layout: chapter
title: "Chapter 6: Recursion"
description: "Understanding recursive algorithms and techniques"
---
# Recursion

In [Chapter 5](05-advanced-sorting.md), we saw how Quicksort uses recursion to partition and sort arrays. Now it's time to explore recursion more deeply as a fundamental programming technique. Understanding recursion is crucial as we move forward to more complex data structures like trees and graphs, where recursive thinking becomes essential.

Recursion is a coding technique where a function calls itself to solve smaller versions of the same problem. While this might seem circular at first, recursion provides an elegant way to solve problems that have a naturally recursive structure. In this chapter, we'll explore how to think recursively and implement recursive solutions in Swift.

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

## Why recursive data structures matter

Recursive data structures shine when representing relationships where each element connects to similar elements. Consider a linked list, where each node points to another node of the same type. Or a binary tree, where each node has left and right children that are also nodes. These structures naturally express "this thing contains more things like itself," which mirrors how many real-world systems work.

The elegance of recursive structures becomes clear when you pair them with recursive algorithms. When you traverse a binary tree, you process the current node, then recursively traverse the left subtree, then recursively traverse the right subtree. The structure and the algorithm have the same shape—both are recursive. This symmetry makes the code remarkably concise and intuitive.

Let's see this with a simple linked list node:

```swift
// Node that links to another node of the same type
class ListNode<T> {
    var tvalue: T  // 'tvalue' means 'typed value' (matches production LLNode)
    var next: ListNode<T>?

    init(tvalue: T, next: ListNode<T>? = nil) {
        self.tvalue = tvalue
        self.next = next
    }
}

// Print all values in the list using recursion
func printList<T>(_ node: ListNode<T>?) {
    //base case: empty list
    guard let currentNode = node else { return }

    //process current node
    print(currentNode.tvalue)

    //recursive case: process rest of list
    printList(currentNode.next)
}

//create a simple linked list: 1 -> 2 -> 3
let node3 = ListNode(tvalue: 3)
let node2 = ListNode(tvalue: 2, next: node3)
let node1 = ListNode(tvalue: 1, next: node2)

printList(node1)  //prints: 1, 2, 3
```

The key insight is that recursive structures don't just solve a technical problem—they provide a natural way to model hierarchical relationships and enable algorithms that mirror the structure itself. When we see `node.left` and `node.right` in a binary tree, we're not just seeing pointers—we're seeing a recursive definition that says "a tree is a node plus two smaller trees." This recursive thinking transforms complex problems into elegant solutions.

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

## When to use recursion

Recursion is particularly well-suited for problems with naturally recursive structure. Tree traversals and graph searches become elegant when expressed recursively, as do divide and conquer algorithms like the quicksort we explored in [Chapter 5](05-advanced-sorting.md). Mathematical sequences such as Fibonacci numbers, factorials, and combinatorics problems often have simple recursive definitions that mirror their mathematical formulas. Finally, recursion excels at processing nested data, whether parsing JSON, traversing file systems, or navigating nested arrays and dictionaries. The key is recognizing when a problem can be naturally decomposed into smaller instances of itself.

## Building algorithmic intuition

Recursion provides an elegant way to solve problems by breaking them into smaller instances of the same problem. This pattern—defining solutions in terms of simpler versions—appears throughout computer science, from tree traversals to divide-and-conquer algorithms. Recursive solutions often mirror the natural structure of problems: tree operations are inherently recursive because trees are recursively defined structures, and graph traversal naturally expresses depth-first exploration as recursive function calls.
