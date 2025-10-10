---
layout: chapter
title: "Chapter 2: Measuring Performance"
description: "Understanding algorithmic efficiency and the language of performance"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>

# Measuring Performance

When we write code we're creating instructions for the computer to follow. But have you ever wondered: how does your code behave when the amount of data changes? Does it slow down gracefully, or does it grind to a halt? Understanding this relationship between data size and performance is essential to building software users will love.

## Why performance matters

Consider Netflix. They serve over 200 million users worldwide. When someone searches for science fiction, the system must quickly find relevant titles among hundreds of thousands of options. An inefficient search [algorithm](https://en.wikipedia.org/wiki/Algorithm) that works fine with 100 movies becomes unusable with 100,000. This isn't a hypothetical problem—it's the reality of modern software development.

Or think about Instagram's photo feed. Every time you scroll, the app must determine which photos to show next, in what order, and load them seamlessly. With billions of photos and millions of active users, even small inefficiencies multiply into serious problems. The algorithms that power these decisions must scale efficiently.

The difference between a slow algorithm and a fast one isn't always obvious with small datasets. But as your data grows—from hundreds to thousands to millions of items—the choice of algorithm determines whether your application feels instant or becomes frustratingly slow.

## The language of performance

To discuss algorithm efficiency, developers use a common vocabulary: [Big O Notation](https://en.wikipedia.org/wiki/Big_O_notation). Rather than saying this algorithm checks every element, we say this is `O(n)`. Rather than explaining this eliminates half the data with each step, we write `O(log n)`. This notation provides a shorthand for describing how algorithms scale.

Consider Big O notation as a way to classify algorithms into performance categories. Just as we might describe a car as fuel-efficient or gas-guzzler without specifying exact miles per gallon, Big O notation categorizes algorithms by their growth patterns without getting lost in implementation details.

The `O` stands for order of magnitude—it tells us the scale of how an algorithm's performance grows as input size increases. The expression in parentheses describes the relationship between input size (usually called n) and the number of operations.

## Constant time

Some operations take the same amount of time regardless of data size. Accessing a specific array index is `O(1)`—whether your array has 10 items or 10 million items, getting `array[5]` is instant. The computer knows exactly where to find that position in memory.

Think of it like using a bookmark in a book. Finding the bookmarked page takes the same amount of time whether the book has 100 pages or 1,000 pages—you just open to the bookmark. [Hash table](https://en.wikipedia.org/wiki/Hash_table) lookups (Chapter 14) work this way: they jump directly to the answer without searching.

## Logarithmic time

[Binary search](https://en.wikipedia.org/wiki/Binary_search_algorithm) demonstrates logarithmic performance. Each comparison eliminates half the remaining possibilities. For 1,000 items, we need about 10 comparisons. For 1 million items, only about 20 comparisons. Doubling the data size only adds one more step.

This halving pattern appears throughout computer science. Balanced [binary search trees](https://en.wikipedia.org/wiki/Binary_search_tree) (Chapter 11) maintain `O(log n)` operations by keeping data organized in a way that allows cutting the search space in half repeatedly.

## Linear time

When an algorithm must examine each element once, we call it linear time or `O(n)`. Searching an unsorted list works this way—in the worst case, we check every element. The time grows in direct proportion to the input size: twice the data means roughly twice the time.

Linear time operations are sometimes called brute force because they make no assumptions about the data organization. They're often the simplest solution but not always the fastest. Chapter 3 explores searching, including when linear search is appropriate.

## Linearithmic time

This pattern combines linear and logarithmic behavior. [Merge sort](https://en.wikipedia.org/wiki/Merge_sort) and [quicksort](https://en.wikipedia.org/wiki/Quicksort) (Chapter 5) demonstrate `O(n log n)` performance. They divide data recursively (the log n part) and process each piece (the n part). This is often the best we can achieve for comparison-based sorting.

## Quadratic time

Nested loops often produce quadratic time complexity. Bubble sort, insertion sort, and selection sort (Chapter 4) all exhibit `O(n²)` behavior. The performance degrades dramatically: doubling the data size roughly quadruples the time. For 100 items, we might do 10,000 operations. For 1,000 items, about 1,000,000 operations.

Quadratic algorithms work fine for small datasets but become impractical as data grows. Understanding why they're `O(n²)` helps you recognize when to choose a different approach.

## Exponential time

Some algorithms' performance explodes exponentially. The naive recursive Fibonacci calculation (Chapter 16) demonstrates this—calculating fib(40) requires over a billion operations. These algorithms are typically unusable for n larger than about 30-40.

## Visualizing the difference

Let's see how these complexities compare with actual numbers. This table reveals why algorithmic efficiency matters. An `O(n²)` algorithm that works fine with 100 elements becomes painfully slow with 10,000 elements. But an `O(log n)` algorithm barely notices the difference:

| Input Size | `O(1)` | `O(log n)` | `O(n)` | `O(n log n)` | `O(n²)` |
|------------|--------|------------|--------|--------------|---------|
| 10         | 1      | 3          | 10     | 30           | 100     |
| 100        | 1      | 7          | 100    | 700          | 10,000  |
| 1,000      | 1      | 10         | 1,000  | 10,000       | 1,000,000|
| 10,000     | 1      | 13         | 10,000 | 130,000      | 100,000,000|


## Simplification rules

When determining Big O notation, we follow two essential rules that focus on how algorithms scale rather than their exact operation counts. Consider an algorithm that performs 3n operations. We express this as `O(n)`, not `O(3n)`. Why? Because Big O notation describes growth patterns, not precise timings. Whether your algorithm takes 3 steps per item or 300 steps per item, it still grows linearly with input size. The constant factor matters for real-world performance, but not for classifying the algorithm's scalability.

Similarly, an algorithm performing n + 5 operations is `O(n)`. The constant 5 becomes insignificant as n grows large. For n = 1,000,000, the difference between n and n + 5 is negligible.

### Keeping the dominant term

When an algorithm contains multiple components with different growth rates, we keep only the fastest-growing term. Consider an algorithm that performs `n² + 5n + 3` operations:

```swift
For n = 10: 100 + 50 + 3 = 153 operations
For n = 100: 10,000 + 500 + 3 = 10,503 operations
For n = 1,000: 1,000,000 + 5,000 + 3 = 1,005,003 operations
```

As n grows, the n² term dominates completely. The linear term (5n) and constant (3) become rounding errors. Therefore, we simplify n² + 5n + 3 to `O(n²)`.

This principle applies to any combination of terms. An algorithm with n log n + n² operations is `O(n²)` because quadratic growth eventually overwhelms linearithmic growth.

**Common simplifications:**
- 5n + 3 → `O(n)`
- n² + n → `O(n²)`
- 2n log n + n → `O(n log n)`
- n³ + n² + n → `O(n³)`
- log n + 5 → `O(log n)`

## A worked example

Let's analyze a real Swift function to determine its Big O complexity. This function finds the maximum value in an array:

```swift
// Find the maximum value in an array of integers
func findMaximum(in numbers: [Int]) -> Int? {
    // Handle empty array
    guard !numbers.isEmpty else {
        return nil
    }

    // Start with first element
    var maximum = numbers[0]

    // Compare with remaining elements
    for number in numbers {
        if number > maximum {
            maximum = number
        }
    }

    return maximum
}
```

**Step 1: Identify the input size**

The input size n is the number of elements in the array.

**Step 2: Count operations**

- The guard statement: 1 operation (constant time)
- Accessing `numbers[0]`: 1 operation (constant time)
- The for loop: executes n times
- Inside the loop: 2 operations (comparison and potential assignment)

Total operations: 1 + 1 + (n × 2) = 2n + 2

**Step 3: Apply simplification rules**

Starting with 2n + 2:
- Drop the constant 2: leaves us with 2n
- Drop the coefficient 2: leaves us with n

**Result:** This function is **`O(n)`**

The algorithm must examine each element once to find the maximum. Doubling the array size doubles the number of comparisons. This is the hallmark of linear time complexity.

## Summary

This chapter introduces the essential vocabulary for discussing algorithm performance: Big O notation. Understanding how algorithms scale with input size determines whether your application feels instant or becomes frustratingly slow with real-world data volumes. The difference between choosing an `O(n)` algorithm versus an `O(n²)` algorithm isn't academic—it's the difference between Netflix serving 200 million users effectively or grinding to a halt.

**Performance categories:**
- Constant time `O(1)`: Operations take the same time regardless of input size (array indexing, hash table lookups from Chapter 14)
- Logarithmic time `O(log n)`: Halving pattern where doubling data adds only one step (binary search from Chapter 3, balanced binary search trees from Chapter 11)
- Linear time `O(n)`: Must examine each element once, time grows proportionally with input (unsorted list search from Chapter 3)
- Linearithmic time `O(n log n)`: Combination of linear and logarithmic behavior (merge sort and quicksort from Chapter 5)
- Quadratic time `O(n²)`: Nested loops where doubling input roughly quadruples time (bubble sort, insertion sort, selection sort from Chapter 4)
- Exponential time `O(2^n)`: Performance explodes exponentially, unusable beyond n=30-40 (naive recursive Fibonacci from Chapter 16)

**Simplification rules focus on growth patterns:**
Big O notation classifies scalability, not exact operation counts. Drop constant coefficients (3n becomes `O(n)`) because whether an algorithm takes 3 steps or 300 steps per item, it still grows linearly. Drop constant terms (n + 5 becomes `O(n)`) because constants become insignificant as n grows large. Keep only the dominant term (n² + 5n + 3 becomes `O(n²)`) because the fastest-growing term eventually dominates completely.

**Growth comparison table:**
For 10,000 elements, `O(1)` requires 1 operation, `O(log n)` requires 13 operations, `O(n)` requires 10,000 operations, `O(n log n)` requires 130,000 operations, and `O(n²)` requires 100,000,000 operations. This dramatic difference explains why choosing the right algorithm matters—an `O(n²)` algorithm that works fine with 100 elements becomes unusable with 10,000 elements, while an `O(log n)` algorithm barely notices the difference.

**Analysis framework demonstrated:**
The worked example analyzing a findMaximum function shows the systematic approach: identify input size (n elements in array), count operations (guard check + array access + n iterations with 2 operations each = 2n + 2 total), apply simplification rules (drop constants and coefficients), yielding `O(n)` classification. This three-step process applies to any algorithm analysis.

**Practical implications:**
Big O notation enables informed algorithm selection before implementation. Knowing that hash tables offer `O(1)` lookups (Chapter 14) versus binary search trees' `O(log n)` operations (Chapter 11) guides architectural decisions. Understanding that quadratic sorting algorithms (Chapter 4) become impractical for large datasets explains why `O(n log n)` algorithms like merge sort and quicksort (Chapter 5) dominate production systems.

**Connections to future chapters:**
Chapter 3 demonstrates the dramatic performance difference between linear search `O(n)` and binary search `O(log n)` with actual implementations. Chapter 4 shows why bubble sort, insertion sort, and selection sort exhibit `O(n²)` behavior through nested loops. Chapter 5 introduces `O(n log n)` algorithms that work by dividing data recursively. Chapter 8 provides comprehensive performance analysis with real-world considerations beyond Big O. Chapter 11 explores balanced binary search trees maintaining `O(log n)` operations. Chapter 14 demonstrates hash tables achieving `O(1)` average-case lookups. Chapter 16 shows how dynamic programming transforms exponential `O(2^n)` algorithms into linear `O(n)` solutions through memoization.

**Real-world applications:**
Instagram's photo feed ranking, Netflix's content search, Google Maps route calculation, and Spotify's playlist generation all depend on efficient algorithms. Small inefficiencies multiply across millions of users and billions of data items. The algorithms you choose determine whether your application scales gracefully or collapses under real-world load. Understanding Big O notation means understanding why modern systems work the way they do and having the vocabulary to discuss performance trade-offs with other developers.

<div class="bottom-nav">
  <div class="nav-container">
    <a href="01-introduction" class="nav-link prev">← Chapter 1: Introduction</a>
    <a href="index" class="nav-link toc">Table of Contents</a>
    <a href="03-basic-searching" class="nav-link next">Chapter 3: Basic Searching →</a>
  </div>
</div>
