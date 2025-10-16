---
layout: chapter
title: "Chapter 6: Recursion"
description: "Understanding recursive algorithms and techniques"
---
# Recursion

Your fitness app needs to calculate total calories burned across all workouts this month. You could write a loop. Or you could think recursively: "Total calories = this workout's calories + total calories from remaining workouts." This self-referential thinking is recursion, and it powers some of the most elegant algorithms in computer science.

In [Chapter 5](05-advanced-sorting.md), we saw how Quicksort uses [recursion](https://en.wikipedia.org/wiki/Recursion_(computer_science)) to partition and sort arrays. Now it's time to explore recursion more deeply as a fundamental programming technique. Understanding recursion is crucial as we move forward to more complex data structures like trees and graphs, where recursive thinking becomes essential.

Recursion is a coding technique where a function calls itself to solve smaller versions of the same problem. While this might seem circular at first, recursion provides an elegant way to solve problems that have a naturally recursive structure. In this chapter, we'll explore how to think recursively and implement recursive solutions in Swift.

## The recursive mindset

Recursion is best understood when compared to the iterative approaches we've seen so far. With traditional loops, we explicitly manage the progression through our data. With recursion, we break down a problem into smaller, similar subproblems, solve each subproblem, and combine the results.

Consider how we might explain your family tree to someone. An iterative approach would require listing every person, generation by generation. A recursive approach, however, is more elegant: "My family tree consists of me, plus my parents' family trees." This recursive definition is both more concise and mirrors how family trees naturally work.

## Understanding recursive structure

Every recursive solution has two essential components. The [base case](https://en.wikipedia.org/wiki/Recursion_(computer_science)#Base_case) provides the condition that stops the recursion—without it, your function would call itself indefinitely. The recursive case is where the function calls itself with a modified version of the original problem, gradually moving toward the base case.

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

// Struct version fails - Swift can't determine size of struct containing itself
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

## Why recursive data structures matter

Now that we understand the technical requirement for using classes, let's explore why recursive data structures are so powerful in software design. The TreeNode example above isn't just a quirk of Swift's type system—it represents a fundamental pattern for modeling hierarchical and sequential data.

Recursive data structures shine when representing relationships where each element connects to similar elements. Consider a [linked list](https://en.wikipedia.org/wiki/Linked_list), where each [node](https://en.wikipedia.org/wiki/Node_(computer_science)) points to another node of the same type. Or a binary [tree](https://en.wikipedia.org/wiki/Tree_(data_structure)), where each node has left and right children that are also nodes. These structures naturally express "this thing contains more things like itself," which mirrors how many real-world systems work.

The elegance of recursive structures becomes clear when you pair them with recursive algorithms. When you traverse a binary tree, you process the current node, then recursively traverse the left subtree, then recursively traverse the right subtree. The structure and the algorithm have the same shape—both are recursive. This symmetry makes the code remarkably concise and intuitive.

Let's see this with a simple linked list node:

```swift
// Node that links to another node of the same type
class ListNode<T> {
    var value: T
    var next: ListNode<T>?

    init(value: T, next: ListNode<T>? = nil) {
        self.value = value
        self.next = next
    }
}

// Print all values in the list using recursion
func printList<T>(_ node: ListNode<T>?) {
    //base case: empty list
    guard let currentNode = node else { return }

    //process current node
    print(currentNode.value)

    //recursive case: process rest of list
    printList(currentNode.next)
}

//create a simple linked list: 1 -> 2 -> 3
let node3 = ListNode(value: 3)
let node2 = ListNode(value: 2, next: node3)
let node1 = ListNode(value: 1, next: node2)

printList(node1)  //prints: 1, 2, 3
```

Notice how the structure (node pointing to node) perfectly matches the algorithm (process node, recurse on next node). This isn't coincidence—it's by design. The recursive structure enables recursive algorithms, which are often simpler than their iterative equivalents.

This pattern appears throughout the data structures we'll build in upcoming chapters. In Chapter 9, we'll see how linked lists use this exact node-to-node pattern for insertion and deletion. Chapter 11 introduces binary search trees, where each node has two recursive references (left and right children), enabling elegant search, insertion, and traversal algorithms. Chapter 13 explores graphs, where vertices connect to other vertices through edges, creating networks that require recursive traversal algorithms like depth-first search. Chapter 14 covers tries, where each node contains a dictionary of child nodes, forming a tree structure optimized for string operations.

The key insight is that recursive structures don't just solve a technical problem—they provide a natural way to model hierarchical relationships and enable algorithms that mirror the structure itself. When we see `node.left` and `node.right` in a binary tree, we're not just seeing pointers—we're seeing a recursive definition that says "a tree is a node plus two smaller trees." This recursive thinking transforms complex problems into elegant solutions.

Understanding this connection between recursive structures and recursive algorithms will make the advanced data structures in upcoming chapters much more intuitive. You'll recognize the pattern: define the structure recursively, then write algorithms that follow the same recursive shape.

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
// Calculate nth Fibonacci number using simple recursion
func fibonacci(_ n: Int) -> Int {
    //base cases
    if n <= 1 {
        return n
    }

    //recursive case
    return fibonacci(n - 1) + fibonacci(n - 2)
}

//generate sequence using recursive function
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
// Calculate Fibonacci while counting recursive calls to show exponential complexity
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

This demonstrates why understanding algorithm complexity (from Chapter 2) is crucial when designing recursive solutions. The naive recursive approach runs in `O(2^n)` time, while the memoized version improves to `O(n)`.

## Optimizing recursion with memoization

We can dramatically improve recursive performance using memoization - storing previously computed results:

```swift
// Calculate Fibonacci using memoization to avoid redundant calculations
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

Recursion shines when processing arrays and other collections. Here are some common patterns that are particularly useful in fitness and health applications:

### Recursive sum

```swift
// Calculate sum of array elements using recursion
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

//fitness example: total calories burned across all workouts
let workoutCalories = [450, 320, 580, 410, 395]
let totalCalories = recursiveSum(workoutCalories)
print("Total calories burned: \(totalCalories)")  //2,155 calories
```

### Recursive maximum

```swift
// Find maximum value in array using recursion
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

//fitness example: find peak heart rate across all workouts
let heartRates = [145, 168, 152, 180, 139]
if let peakHeartRate = recursiveMax(heartRates) {
    print("Peak heart rate: \(peakHeartRate) bpm")  //180 bpm
}
```

## Tail recursion

A special form of recursion where the recursive call is the last operation in the function. While Swift doesn't automatically optimize tail recursion, understanding it is important:

```swift
// Calculate factorial - not tail recursive (multiplication after recursive call)
//not tail recursive - multiplication happens after recursive call
func factorial(_ n: Int) -> Int {
    if n <= 1 { return 1 }
    return n * factorial(n - 1)  //multiplication after recursive call
}

// Calculate factorial using tail recursion with accumulator pattern
//tail recursive version - accumulator pattern
func factorialTailRecursive(_ n: Int, accumulator: Int = 1) -> Int {
    if n <= 1 {
        return accumulator
    }
    return factorialTailRecursive(n - 1, accumulator: n * accumulator)
}
```

## When to use recursion

Recursion is particularly well-suited for problems with naturally recursive structure. Tree traversals and graph searches become elegant when expressed recursively, as do divide and conquer algorithms like the quicksort we explored in Chapter 5. Mathematical sequences such as Fibonacci numbers, factorials, and combinatorics problems often have simple recursive definitions that mirror their mathematical formulas. Finally, recursion excels at processing nested data, whether parsing JSON, traversing file systems, or navigating nested arrays and dictionaries. The key is recognizing when a problem can be naturally decomposed into smaller instances of itself.

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

Understanding recursion is essential for the data structures we'll explore next. In Chapter 9, we'll see how linked lists use recursive insertion and deletion. Chapter 11 introduces binary search trees, where recursive tree operations become fundamental. Chapter 13 explores graphs with recursive traversal algorithms. Finally, Chapter 18 covers dynamic programming, which relies on recursive problem decomposition combined with memoization techniques. The recursive thinking patterns you learn here will make these advanced topics much more approachable.

## Building recursive intuition

When approaching a problem recursively, start by identifying the simplest version of the problem—this becomes your base case. Then consider how to break the problem into smaller, similar subproblems that move toward that base case. Next, determine how to combine the results from these subproblems into your final answer. Finally, analyze whether this recursive approach is efficient enough, or if you need optimizations like memoization to avoid redundant calculations. This framework will guide you toward elegant recursive solutions.
