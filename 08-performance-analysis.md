---
layout: chapter
title: "Chapter 8: Performance Analysis & Big O Notation"
description: "Understanding algorithmic efficiency, complexity analysis, and real-world performance"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>

# Performance Analysis & Big O Notation

You've now explored five chapters of algorithms: searching techniques that locate values in collections, sorting methods that organize data, recursion that breaks problems into smaller pieces, and the power of generics to write flexible code. Along the way, you've noticed patterns—some algorithms feel faster than others, some scale better as data grows, and some trade simplicity for performance.

It's time to formalize these observations. In this chapter, we'll develop the tools to analyze algorithm efficiency systematically, understand how code behaves at scale, and make informed decisions about which approaches fit which problems. This isn't abstract theory—it's the foundation for building software that users love because it's fast, responsive, and handles real-world data gracefully.

## The performance problem

Think back to Chapter 3's linear search. You check each element sequentially until you find your target. For 10 items, this works instantly. For 1,000 items, it's still acceptable. But what about 1 million items? 100 million? At scale, linear search becomes unusable—not because it's implemented incorrectly, but because checking every element fundamentally doesn't scale.

Compare that to binary search from the same chapter. By eliminating half the remaining elements with each comparison, binary search finds values in 1 million items with only about 20 comparisons. Same goal, dramatically different performance at scale.

Or consider the sorting algorithms from Chapters 4 and 5. Bubble sort uses nested loops, checking and swapping repeatedly. Merge sort divides the problem recursively, processing pieces efficiently. Both produce sorted arrays, but merge sort handles large datasets in seconds where bubble sort takes hours.

These aren't isolated examples—they reveal fundamental patterns about how algorithms scale. Let's measure those patterns empirically before formalizing them.

### Measuring real performance

Here's a simple experiment comparing linear search to binary search:

```swift
import Foundation

// Linear search checks every element
func linearSearch(for target: Int, in array: [Int]) -> Int? {
    for (index, element) in array.enumerated() {
        if element == target {
            return index
        }
    }
    return nil
}

// Binary search eliminates half each step
func binarySearch(for target: Int, in array: [Int]) -> Int? {
    var left = 0
    var right = array.count - 1

    while left <= right {
        let mid = (left + right) / 2

        if array[mid] == target {
            return mid
        } else if array[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return nil
}

// Measure execution time
func measure(operation: () -> Void) -> TimeInterval {
    let start = Date()
    operation()
    return Date().timeIntervalSince(start)
}

// Test with different sizes
let sizes = [1_000, 10_000, 100_000, 1_000_000]

for size in sizes {
    let sorted = Array(0..<size)
    let target = size - 1  // Worst case: last element

    let linearTime = measure {
        _ = linearSearch(for: target, in: sorted)
    }

    let binaryTime = measure {
        _ = binarySearch(for: target, in: sorted)
    }

    print("Size: \(size)")
    print("  Linear: \(linearTime)s")
    print("  Binary: \(binaryTime)s")
    print("  Speedup: \(linearTime / binaryTime)x faster")
}
```

Run this code and you'll see binary search stays nearly constant while linear search grows proportionally with the data size. With 1 million items, binary search might be 50,000 times faster.

This is the power of algorithmic thinking. The difference between algorithms often outweighs the difference between programming languages, hardware, or optimization tricks.

## Introducing Big O Notation

When discussing performance, developers need a common language. Rather than saying "this algorithm checks every element," we say "this is O(n)." Rather than explaining "this eliminates half the data with each step," we write "O(log n)." This notation provides concise shorthand for describing how algorithms scale.

The "O" stands for "order of magnitude"—it tells us the scale of how an algorithm's performance grows as input size increases. The expression in parentheses describes the relationship between input size (usually called n) and the number of operations.

Big O Notation focuses on the dominant factor. As data grows large, constants and smaller terms become irrelevant. An algorithm that does 3n + 5 operations simplifies to O(n) because the n term dominates as n grows. An algorithm that does n² + 100n simplifies to O(n²) because n² overwhelms everything else at scale.

### The fundamental complexities

Let's examine the performance categories you'll encounter throughout computer science, each illustrated with examples from the algorithms you've already seen.

#### Constant time: O(1)

Some operations take the same time regardless of data size. Accessing a specific array index is O(1)—whether your array has 10 items or 10 million items, getting `array[5]` is instant because the computer knows exactly where that position lives in memory.

```swift
// Constant time operations - O(1)
func getFirst(from list: [Int]) -> Int? {
    return list.first  // Direct memory access
}

func getLast(from list: [Int]) -> Int? {
    return list.last  // Direct memory access
}

func addToEnd(_ value: Int, to list: inout [Int]) {
    list.append(value)  // Usually O(1), occasionally O(n) when resizing
}
```

Think of it like using a bookmark in a book. Finding the bookmarked page takes the same amount of time whether the book has 100 pages or 1,000 pages—you just open to the bookmark.

Hash table lookups (Chapter 14) work this way in the average case. They compute a hash value that points directly to the answer without searching.

#### Logarithmic time: O(log n)

Binary search demonstrates logarithmic performance. Each comparison eliminates half the remaining possibilities. For 1,000 items, you need about 10 comparisons. For 1 million items, only about 20 comparisons. Doubling the data size only adds one more step.

```swift
// Binary search - O(log n)
func binarySearch(for target: Int, in array: [Int]) -> Int? {
    var left = 0
    var right = array.count - 1

    while left <= right {
        let mid = (left + right) / 2

        if array[mid] == target {
            return mid
        } else if array[mid] < target {
            left = mid + 1  // Eliminate left half
        } else {
            right = mid - 1  // Eliminate right half
        }
    }
    return nil
}
```

This "halving" pattern appears throughout computer science. Balanced binary search trees (Chapter 11) maintain O(log n) operations by keeping data organized so you can eliminate half the tree with each comparison.

The logarithm reflects a simple question: "How many times can I cut this in half before reaching one item?" For 1,000 items: 2^10 = 1,024, so about 10 cuts. For 1 million items: 2^20 = 1,048,576, so about 20 cuts.

#### Linear time: O(n)

When an algorithm must examine each element once, we call it linear time or O(n). Linear search from Chapter 3 works this way—in the worst case, you check every element. The time grows in direct proportion to the input size: twice the data means roughly twice the time.

```swift
// Linear search - O(n)
func linearSearch(for target: Int, in array: [Int]) -> Int? {
    for (index, element) in array.enumerated() {
        if element == target {
            return index
        }
    }
    return nil  // Checked all n elements
}

// Finding maximum value - O(n)
func findMax(in array: [Int]) -> Int? {
    guard var max = array.first else { return nil }

    for element in array {
        if element > max {
            max = element
        }
    }
    return max  // Must check every element
}
```

Linear time operations are sometimes called "brute force" because they make no assumptions about data organization. You simply check everything. For many problems, this is optimal—finding the maximum value requires examining every element at least once.

#### Linearithmic time: O(n log n)

This pattern combines linear and logarithmic behavior. Merge sort and quicksort from Chapter 5 demonstrate O(n log n) performance. They divide data recursively (the log n part) and process each piece (the n part).

```swift
// Merge sort - O(n log n)
extension Array where Element: Comparable {
    func mergeSort() -> [Element] {
        guard count > 1 else { return self }

        let mid = count / 2
        let left = Array(self[0..<mid]).mergeSort()  // Divide
        let right = Array(self[mid..<count]).mergeSort()  // Divide

        return merge(left, right)  // Conquer (linear merge)
    }

    private func merge(_ left: [Element], _ right: [Element]) -> [Element] {
        var result: [Element] = []
        var leftIndex = 0
        var rightIndex = 0

        // Linear merge of two sorted halves
        while leftIndex < left.count && rightIndex < right.count {
            if left[leftIndex] <= right[rightIndex] {
                result.append(left[leftIndex])
                leftIndex += 1
            } else {
                result.append(right[rightIndex])
                rightIndex += 1
            }
        }

        result.append(contentsOf: left[leftIndex...])
        result.append(contentsOf: right[rightIndex...])

        return result
    }
}
```

Why O(n log n)? At each level of recursion (log n levels total), you process all n elements. Each element gets touched once per level. Total operations: n × log n.

This is often the best we can achieve for comparison-based sorting. No comparison-based sort can do better than O(n log n) in the worst case—it's a mathematical limit.

#### Quadratic time: O(n²)

Nested loops often produce quadratic time complexity. Bubble sort, insertion sort, and selection sort from Chapter 4 all exhibit O(n²) behavior because they use nested iterations over the data.

```swift
// Bubble sort - O(n²)
extension Array where Element: Comparable {
    mutating func bubbleSort() {
        for i in 0..<count {  // Outer loop: n iterations
            for j in 0..<(count - i - 1) {  // Inner loop: n iterations
                if self[j] > self[j + 1] {
                    swapAt(j, j + 1)
                }
            }
        }
    }
}

// Checking for duplicates - O(n²)
func hasDuplicates(in numbers: [Int]) -> Bool {
    for i in 0..<numbers.count {
        for j in (i + 1)..<numbers.count {
            if numbers[i] == numbers[j] {
                return true
            }
        }
    }
    return false
}
```

The performance degrades dramatically: doubling the data size roughly quadruples the time. For 100 items, you might do 10,000 operations. For 1,000 items, about 1,000,000 operations.

Quadratic algorithms work fine for small datasets but become impractical as data grows. Understanding why they're O(n²) helps you recognize when to choose a different approach.

#### Exponential time: O(2^n)

Some algorithms' performance explodes exponentially. The naive recursive Fibonacci calculation from Chapter 6 demonstrates this—calculating fib(40) requires over a billion operations because the recursion tree duplicates work exponentially.

```swift
// Naive Fibonacci - O(2^n)
func fibonacciNaive(_ n: Int) -> Int {
    if n <= 1 { return n }
    return fibonacciNaive(n - 1) + fibonacciNaive(n - 2)
}

// Each call spawns two more calls, creating exponential growth
// fib(5) calls fib(4) and fib(3)
// fib(4) calls fib(3) and fib(2)
// fib(3) is calculated TWICE (and many times as n grows)
```

These algorithms are typically unusable for n larger than about 30-40. A problem requiring 2^50 operations would take thousands of years on modern hardware.

Fortunately, techniques like memoization (Chapter 16) can often reduce exponential algorithms to polynomial time by caching repeated work.

### Visualizing the difference

Let's see how these complexities compare with actual operation counts:

| Input Size | O(1) | O(log n) | O(n) | O(n log n) | O(n²) | O(2^n) |
|------------|------|----------|------|------------|-------|--------|
| 10         | 1    | 3        | 10   | 30         | 100   | 1,024  |
| 100        | 1    | 7        | 100  | 700        | 10,000| ~10^30 |
| 1,000      | 1    | 10       | 1,000| 10,000     | 1,000,000| ~10^301 |
| 10,000     | 1    | 13       | 10,000| 130,000   | 100,000,000| ~10^3010 |
| 1,000,000  | 1    | 20       | 1,000,000| 20,000,000 | 1,000,000,000,000| — |

This table reveals why algorithmic efficiency matters. An O(n²) algorithm that works fine with 100 elements becomes painfully slow with 10,000 elements. But an O(log n) algorithm barely notices the difference between 1,000 and 1,000,000 elements.

## Analyzing Swift code

Understanding Big O notation means being able to look at code and determine its complexity. Let's develop this skill systematically.

### Step 1: Identify the basic operation

Find what your algorithm does most frequently:

- **Searching**: Comparisons (`if element == target`)
- **Sorting**: Comparisons and swaps
- **Tree operations**: Visiting nodes
- **Graph algorithms**: Traversing edges

### Step 2: Count executions as a function of n

How many times does the basic operation execute for an input of size n?

```swift
// Single loop: O(n)
func example1(_ array: [Int]) {
    for element in array {  // Runs n times
        print(element)
    }
}

// Two sequential loops: O(n + n) = O(n)
func example2(_ array: [Int]) {
    for element in array {  // Runs n times
        print(element)
    }
    for element in array {  // Runs n times
        print(element)
    }
}
// Total: 2n operations, simplifies to O(n)

// Nested loops: O(n²)
func example3(_ array: [Int]) {
    for i in array {  // Runs n times
        for j in array {  // Runs n times for each i
            print(i, j)
        }
    }
}
// Total: n × n = n² operations

// Loop that halves: O(log n)
func example4(_ n: Int) {
    var value = n
    while value > 1 {
        value = value / 2  // Halves each iteration
        print(value)
    }
}
// Runs log₂(n) times

// Divide and conquer: O(n log n)
func mergeSort(_ array: [Int]) -> [Int] {
    guard array.count > 1 else { return array }

    let mid = array.count / 2
    let left = mergeSort(Array(array[0..<mid]))  // log n levels
    let right = mergeSort(Array(array[mid..<array.count]))

    return merge(left, right)  // n work per level
}
// Total: n work × log n levels = O(n log n)
```

### Step 3: Drop constants and lower-order terms

Big O describes growth rate, not exact operation count. Constants and smaller terms vanish at scale:

```swift
// 3n + 5 operations → O(n)
func example5(_ array: [Int]) {
    print("Starting")  // 1 operation
    print("Processing")  // 1 operation

    for element in array {  // n operations
        print(element)
        print(element)
        print(element)
    }

    print("Done")  // 1 operation
    print("Finished")  // 1 operation
    print("Complete")  // 1 operation
}
// Total: 3n + 5 → O(n)

// n² + 100n + 500 operations → O(n²)
func example6(_ array: [Int]) {
    // Nested loops: n² operations
    for i in array {
        for j in array {
            compare(i, j)
        }
    }

    // Single loops: 100n operations
    for _ in 0..<100 {
        for element in array {
            process(element)
        }
    }

    // Constants: 500 operations
    for _ in 0..<500 {
        doSomething()
    }
}
// Total: n² + 100n + 500 → O(n²) because n² dominates
```

Why drop constants? When n = 1,000,000:
- 3n + 5 = 3,000,005 (the 5 is 0.0002% of total)
- n² + 100n = 1,000,100,000,000 (the 100n is 0.01% of total)

The dominant term overwhelms everything else at scale.

### Step 4: Analyze different cases

Many algorithms perform differently depending on input characteristics.

```swift
// Insertion sort analysis
extension Array where Element: Comparable {
    mutating func insertionSort() {
        for i in 1..<count {
            let key = self[i]
            var j = i - 1

            while j >= 0 && self[j] > key {
                self[j + 1] = self[j]
                j -= 1
            }
            self[j + 1] = key
        }
    }
}
```

**Best case: O(n)** - Array already sorted
- Inner while loop never executes
- Just one pass through the array

**Average case: O(n²)** - Random order
- Inner loop runs about n/2 times on average
- Total: n × (n/2) = O(n²)

**Worst case: O(n²)** - Array reverse-sorted
- Inner loop runs i times for each position i
- Total: 1 + 2 + 3 + ... + n = n(n+1)/2 = O(n²)

When we say "insertion sort is O(n²)", we typically refer to the worst case unless specified otherwise.

### Step 5: Consider space complexity

Time complexity measures operations. Space complexity measures memory usage.

```swift
// Insertion sort: O(1) space
extension Array where Element: Comparable {
    mutating func insertionSort() {
        // Only uses a few variables (key, i, j)
        // No additional arrays created
        // Sorts in-place
    }
}

// Merge sort: O(n) space
extension Array where Element: Comparable {
    func mergeSort() -> [Element] {
        // Creates new arrays for left, right, result
        // At deepest recursion: O(n) space for all arrays
        // Plus O(log n) space for recursion call stack
        // Total: O(n) auxiliary space
    }
}
```

**Space analysis considerations:**
- **In-place algorithms**: O(1) space (modify input directly)
- **Recursive algorithms**: O(depth) space for call stack
- **Algorithms creating copies**: O(size of copies) space

Sometimes you must trade space for time (or vice versa):

| Algorithm | Time | Space | Trade-off |
|-----------|------|-------|-----------|
| Insertion Sort | O(n²) | O(1) | Slow but memory-efficient |
| Merge Sort | O(n log n) | O(n) | Fast but uses extra memory |
| Hash Table | O(1) avg | O(n) | Instant lookup, needs space |

## Best case, average case, and worst case

Most algorithms don't perform the same way in every situation. Understanding the different cases helps you choose algorithms based on expected input.

### Linear search revisited

```swift
func linearSearch<T: Equatable>(for target: T, in array: [T]) -> Int? {
    for (index, element) in array.enumerated() {
        if element == target {
            return index
        }
    }
    return nil
}

let numbers = [5, 2, 8, 6, 1, 9, 4, 0, 3, 7]

// Best case: target is first element
linearSearch(for: 5, in: numbers)  // 1 comparison → O(1)

// Average case: target is somewhere in middle
linearSearch(for: 1, in: numbers)  // 5 comparisons → O(n/2) = O(n)

// Worst case: target is last or not present
linearSearch(for: 7, in: numbers)  // 10 comparisons → O(n)
linearSearch(for: 15, in: numbers) // 10 comparisons → O(n)
```

**When average case matters more:**

If you're searching a contact list where people often search for common names (near the beginning), the average case might be much better than worst case in practice. But Big O typically describes worst case unless specified otherwise, because it guarantees performance won't get worse than that bound.

### Quicksort's behavior

Quicksort from Chapter 5 provides another excellent example:

```swift
extension Array where Element: Comparable {
    mutating func quickSort() {
        quickSortHelper(0, count - 1)
    }

    private mutating func quickSortHelper(_ low: Int, _ high: Int) {
        guard low < high else { return }

        let pivot = partition(low, high)
        quickSortHelper(low, pivot - 1)
        quickSortHelper(pivot + 1, high)
    }

    private mutating func partition(_ low: Int, _ high: Int) -> Int {
        let pivot = self[high]
        var i = low

        for j in low..<high {
            if self[j] <= pivot {
                swapAt(i, j)
                i += 1
            }
        }
        swapAt(i, high)
        return i
    }
}
```

**Best/Average case: O(n log n)**
- Pivot splits array roughly in half each time
- log n levels of recursion
- n work per level
- Total: O(n log n)

**Worst case: O(n²)**
- Pivot is always smallest or largest element
- Array splits into 1 element and n-1 elements
- n levels of recursion instead of log n
- Total: 1 + 2 + 3 + ... + n = O(n²)

This is why production quicksort implementations use strategies like:
- Random pivot selection
- Median-of-three pivot selection
- Switching to insertion sort for small subarrays

These strategies make worst case extremely unlikely while keeping average case fast.

## Space-time trade-offs

You can often trade memory for speed or vice versa. The fibonacci examples from Chapter 6 demonstrate this beautifully:

```swift
// Version 1: Minimal space, exponentially slow
func fibonacciNaive(_ n: Int) -> Int {
    if n <= 1 { return n }
    return fibonacciNaive(n - 1) + fibonacciNaive(n - 2)
}
// Time: O(2^n) - recalculates same values exponentially many times
// Space: O(n) - recursion call stack depth
// Unusable for n > 40

// Version 2: More space, much faster
func fibonacciMemoized(_ n: Int, cache: inout [Int: Int]) -> Int {
    if let cached = cache[n] { return cached }
    if n <= 1 { return n }

    let result = fibonacciMemoized(n - 1, cache: &cache) +
                 fibonacciMemoized(n - 2, cache: &cache)
    cache[n] = result
    return result
}
// Time: O(n) - each value calculated once
// Space: O(n) - cache stores n values plus O(n) call stack
// Huge speedup by using memory

// Version 3: Minimal space, fast
func fibonacciIterative(_ n: Int) -> Int {
    if n <= 1 { return n }

    var prev = 0
    var current = 1

    for _ in 2...n {
        let next = prev + current
        prev = current
        current = next
    }

    return current
}
// Time: O(n) - single loop
// Space: O(1) - just two variables
// Best of both worlds
```

**Performance comparison:**

```swift
// fib(40)
fibonacciNaive(40)      // ~2-3 seconds (billions of operations)
fibonacciMemoized(40)   // ~0.001 seconds (40 operations)
fibonacciIterative(40)  // ~0.001 seconds (40 operations)
```

The progression from naive → memoized → iterative shows how understanding trade-offs leads to better solutions. Sometimes you need memory to achieve speed (memoization). Sometimes clever iteration achieves both speed and minimal memory (iterative).

## Real-world performance considerations

Academic complexity analysis provides essential insight, but real-world performance involves additional factors.

### Constant factors matter for small inputs

Theory says quicksort (O(n log n)) beats insertion sort (O(n²)). But for small arrays, insertion sort often wins:

```swift
// For arrays with fewer than 10-20 elements
let small = [5, 2, 8, 1, 9, 3, 7, 4, 6]

// Insertion sort: Simple, cache-friendly, low overhead
small.insertionSort()  // Often faster for small n

// Quicksort: More complex, more overhead
small.quickSort()  // Overhead outweighs benefit for small n
```

This is why Swift's standard library and many production sorting algorithms use hybrid approaches:
- Quicksort for large subarrays
- Insertion sort for small subarrays (typically n < 10)
- Best of both worlds

### Memory access patterns matter

Modern CPUs are optimized for sequential memory access. Both these examples are O(n), but performance differs dramatically:

```swift
// Fast: Sequential access (cache-friendly)
for i in 0..<array.count {
    process(array[i])
}

// Slower: Random access (cache-unfriendly)
for index in randomIndices {
    process(array[index])
}
```

The first example can be 10x faster due to CPU cache hits, even though both are O(n). The CPU loads chunks of sequential memory into cache, making adjacent accesses nearly free.

This is why array-based data structures often outperform pointer-based structures (like linked lists) in practice, despite theoretical complexity being equal.

### Real-world data isn't random

- **Partially sorted data**: Insertion sort can approach O(n) performance
- **Small datasets**: Simple O(n²) algorithms often win due to low overhead
- **Repeated queries**: Caching previous results makes subsequent operations faster
- **Duplicate values**: Some algorithms handle duplicates more efficiently

### Amortized analysis

Some operations are occasionally expensive but maintain good performance averaged over many operations. Swift arrays demonstrate this:

```swift
var numbers: [Int] = []

// When array runs out of capacity, Swift doubles the size
numbers.append(1)    // Capacity 1, no resize
numbers.append(2)    // Resize to capacity 2, copy 1 element
numbers.append(3)    // Resize to capacity 4, copy 2 elements
numbers.append(4)    // No resize
numbers.append(5)    // Resize to capacity 8, copy 4 elements
numbers.append(6)    // No resize
numbers.append(7)    // No resize
numbers.append(8)    // No resize
numbers.append(9)    // Resize to capacity 16, copy 8 elements
// ... and so on
```

**Individual operation costs:**
- Most appends: O(1) - just add to the end
- Resize appends: O(n) - copy all existing elements

**Amortized cost:**
Even though some appends are expensive, the average cost per append is still O(1). Here's why:

```
Inserting 16 elements:
- Resizes at positions: 1, 2, 4, 8 (4 resizes)
- Total copies: 0 + 1 + 2 + 4 + 8 = 15
- Average: 15 / 16 ≈ 1 copy per insertion

Inserting 1,000 elements:
- About 10 resizes occur
- Total copies: ≈ 1,000 (each element copied about once)
- Average: still about 1 copy per insertion
```

The costly operations become rarer as the array grows, so the amortized cost remains constant.

**When to pre-allocate:**

```swift
// If you know you need 1,000 elements
var numbers = [Int]()
numbers.reserveCapacity(1,000)  // Pre-allocate space

// Now all 1,000 appends are truly O(1) with no resizing
for i in 0..<1_000 {
    numbers.append(i)
}
```

## When to optimize (and when not to)

### Don't optimize prematurely

```swift
// Is this worth optimizing?
func processUsernames(_ users: [String]) {
    for user in users {  // Runs once per app launch
        print(user)      // ~100 users maximum
    }
}
```

**Answer: No.** This runs once with small data. Even an O(n²) algorithm would be fine here. Optimizing this wastes time that could go toward features users actually care about.

### Do optimize when it matters

```swift
// This needs optimization!
func updateVideoFrame() {
    for row in 0..<videoHeight {       // Runs 60 times per second
        for col in 0..<videoWidth {    // Millions of pixels
            processPixel(row, col)     // Critical performance path
        }
    }
}
```

**Answer: Yes.** This runs constantly with large data. Even small improvements have huge impact. Every millisecond saved improves user experience.

### Optimization checklist

Optimize when code meets ALL these criteria:

- ✅ Runs frequently (in a loop, per frame, per request)
- ✅ Handles large data (thousands to millions of items)
- ✅ Users notice the slowness (lag, stuttering, delays)
- ✅ Profiling confirms it's a bottleneck

If you don't check all boxes, simpler code is often better than faster code.

### Use profiling, not guessing

```swift
// Wrong approach: Optimize everything
// "This seems slow, let me make it faster"
```

**Right approach: Profile first**

1. Run Xcode's Time Profiler (Product → Profile → Time Profiler)
2. Find what's actually slow (often surprising)
3. Optimize that specific bottleneck
4. Measure again to confirm improvement
5. Stop when performance is acceptable

**Example profiling workflow:**

```
Initial profile:
- Function A: 5% of time
- Function B: 85% of time ← Optimize this!
- Function C: 10% of time

After optimizing B:
- Function A: 15% of time
- Function B: 25% of time
- Function C: 60% of time ← Now C is the bottleneck

After optimizing C:
- Function A: 40% of time
- Function B: 35% of time
- Function C: 25% of time
Performance now acceptable → Stop optimizing
```

## Practical framework for analysis

When you encounter any algorithm, use this systematic framework:

### 1. What's the basic operation?

Identify what the algorithm does most frequently.

**Examples:**
- Linear search: Comparisons
- Bubble sort: Comparisons and swaps
- Binary tree traversal: Visiting nodes
- Dijkstra's algorithm: Edge relaxation

### 2. How many times does it execute?

Count operations as a function of input size n.

**Patterns to recognize:**
- Single loop over n items → O(n)
- Nested loops → O(n²)
- Halving each iteration → O(log n)
- Divide and conquer → O(n log n)
- Recursion spawning two calls → O(2^n)

### 3. Consider different scenarios

Ask these questions:
- **Best case**: What's the most favorable input?
- **Average case**: What happens with typical input?
- **Worst case**: What's the most challenging input?

### 4. Analyze space usage

Don't forget memory:
- Creating new arrays → O(n) space
- Using recursion → O(depth) space for call stack
- Modifying in-place → O(1) space
- Caching results → O(cached items) space

### 5. Is optimization worth it?

Apply the optimization checklist:
- Runs frequently?
- Large data?
- Users notice slowness?
- Profiling confirms bottleneck?

## Looking back at the algorithms you've learned

Throughout this book, you've encountered complexity analysis in action. Let's review what you've seen and what's coming:

**Chapter 3: Searching**
- Linear search: O(n) - must check every element
- Binary search: O(log n) - eliminates half each step

**Chapter 4: Basic Sorting**
- Bubble sort: O(n²) - nested loops, many swaps
- Insertion sort: O(n²) average, O(n) best case on sorted data
- Selection sort: O(n²) - always quadratic

**Chapter 5: Advanced Sorting**
- Merge sort: O(n log n) time, O(n) space
- Quicksort: O(n log n) average, O(n²) worst case
- Both use divide-and-conquer strategies

**Chapter 6: Recursion**
- Naive Fibonacci: O(2^n) - exponentially slow
- Memoized Fibonacci: O(n) - cache eliminates duplicate work

**Chapter 7: Generics**
- Generic constraints don't affect complexity
- Type system ensures correctness without runtime cost

**Upcoming Chapters:**

**Data Structures (Chapters 9-14):**
- Linked Lists: O(n) access, O(1) insert/delete at known position
- Stacks & Queues: O(1) push/pop operations
- Binary Search Trees: O(log n) average, O(n) worst case
- Tries: O(m) operations where m is string length
- Hash Tables: O(1) average, O(n) worst case
- Heaps: O(log n) insert/delete, O(1) peek at min/max

**Graph Algorithms (Chapter 12):**
- BFS/DFS: O(V + E) where V = vertices, E = edges
- Dijkstra with array: O(V²)
- Dijkstra with heap: O((V + E) log V)

**Advanced Topics (Chapters 15-19):**
- Dynamic Programming: Convert O(2^n) to O(n) with memoization
- Vector operations: O(n) for element-wise, O(n²) for matrix multiplication
- PageRank: Iterative convergence
- Semantic search: O(n) for k-NN search

## Building performance intuition

The goal isn't to memorize complexity formulas but to develop intuitive understanding of what makes code fast or slow.

### Pattern recognition

**When you see nested loops, think:**
- "Quadratic—this might slow down quickly with large data"
- "Can I eliminate the inner loop?"
- "Is there a hash table or set that could help?"

**When you see a single loop, think:**
- "Linear—performance scales directly with size"
- "This might be optimal if I must examine every element"

**When you see halving or doubling, think:**
- "Logarithmic—scales beautifully even with massive data"
- "Binary search, balanced trees, divide-and-conquer"

**When you see recursion spawning multiple calls, think:**
- "Might be exponential—check if work is duplicated"
- "Could memoization help?"

### Ask the right questions

**Before writing code:**
1. What's the inherent complexity of this problem?
2. Am I doing redundant work?
3. What are my constraints (time, space, simplicity)?
4. Is there a data structure that optimizes this operation?

**After writing code:**
1. What's the basic operation?
2. How many times does it execute?
3. What's the worst-case behavior?
4. Does space usage matter?
5. Is this fast enough for my use case?

### Example: Choosing a data structure

**Problem**: Store user sessions, need fast lookup by session ID.

**Options:**

| Data Structure | Lookup | Insert | Space | Best For |
|----------------|--------|--------|-------|----------|
| Array (unsorted) | O(n) | O(1) | O(n) | Small datasets |
| Array (sorted) | O(log n) | O(n) | O(n) | Mostly static data |
| Hash Table | O(1) avg | O(1) avg | O(n) | Fast lookup, dynamic |
| Binary Search Tree | O(log n) avg | O(log n) avg | O(n) | Sorted iteration needed |

**For session lookup**: Hash table wins—O(1) average case for the common operation (lookup), and sessions are added/removed dynamically.

This is the kind of informed decision-making that performance analysis enables.

## Summary

Performance analysis gives you the tools to understand, predict, and optimize algorithm behavior:

**Big O Notation provides the language:**
- O(1): Constant time—instant regardless of size
- O(log n): Logarithmic—halving each step
- O(n): Linear—proportional to input size
- O(n log n): Linearithmic—divide and conquer
- O(n²): Quadratic—nested iteration
- O(2^n): Exponential—unusable for large n

**Analysis framework:**
1. Identify basic operations
2. Count executions as f(n)
3. Drop constants and lower-order terms
4. Consider best, average, worst cases
5. Analyze space complexity
6. Recognize trade-offs

**Real-world considerations:**
- Constants matter for small inputs
- Memory access patterns affect actual performance
- Average case often matters more than worst case
- Profile before optimizing
- Optimize only when it matters

**Most important lesson:**

Understanding complexity helps you choose the right algorithm and recognize when optimization matters. But always remember: correct, maintainable code is better than prematurely optimized code. Optimize strategically when profiling shows real need.

This intuition—built through understanding the algorithms in this book and their trade-offs—will serve you well in designing efficient solutions to new problems. As you continue through the data structures and algorithms ahead, you now have the vocabulary and framework to evaluate their performance systematically.

<div class="bottom-nav">
  <div class="nav-container">
    <a href="07-generics" class="nav-link prev">← Chapter 7: Generics</a>
    <a href="index" class="nav-link toc">Table of Contents</a>
    <a href="09-linked-lists" class="nav-link next">Chapter 9: Linked Lists →</a>
  </div>
</div>
