---
layout: chapter
title: "Chapter 2: Measuring Performance"
description: "Understanding algorithmic efficiency and the language of performance"
---
# Measuring Performance

When we write code we're creating instructions for the computer to follow. But how does our code behave when the amount of data changes? Does it slow down gracefully, or does it grind to a halt? Understanding this relationship between data size and performance is essential to building software users will love—whether we're building the next fitness tracker, managing patient records, or analyzing athletic performance data.

## Why performance matters

Consider **Netflix**. They serve over 200 million users worldwide. When someone searches for science fiction, the system must quickly find relevant titles among hundreds of thousands of options. A poorly designed search algorithm that works fine with 100 movies becomes unusable with 100,000. 

## The language of performance

To discuss algorithm efficiency, developers use a common vocabulary: [Big O Notation](https://en.wikipedia.org/wiki/Big_O_notation). Rather than saying this algorithm checks every element, we say `O(n)`. Rather than explaining this eliminates half the data with each step, we write `O(log n)`. This notation provides a shorthand for describing how algorithms scale.

Consider **Big O notation** as a way to classify algorithms into performance categories. Just as we might describe a car as fuel-efficient or gas-guzzler without specifying exact miles per gallon, Big O notation categorizes algorithms by their growth patterns without getting lost in implementation details.

The `O` stands for order of magnitude—it tells us the scale of how an algorithm's performance grows as input size increases. The expression in parentheses describes the relationship between input size (usually called `n`) and the number of operations.

## Constant time

Some operations take the same amount of time regardless of input size - this is known as **constant time**. Accessing a specific array index is `O(1)`— whether your array has 10 items or 10 million items, getting `array[5]` is instant. The computer knows exactly where to find that position in memory.

## Logarithmic time

[Binary search](03-basic-searching.md) demonstrates logarithmic performance. Each comparison eliminates half the remaining possibilities. For 1,000 items, we need about 10 comparisons. For 1 million items, only about 20 comparisons. Doubling the data size only adds one more step.

This halving pattern appears throughout computer science. When a running app finds your personal record 5K time from a sorted list of thousands of runs, it uses binary search—checking the middle record, then eliminating half the remaining data, repeatedly narrowing down to your best effort.

## Linear time

When an algorithm must examine each element once, we call it **linear time** or `O(n)`. Searching an unsorted list works this way—in the worst case, we check every element. The time grows in direct proportion to the input size: twice the data means roughly twice the time.

Linear time operations are sometimes called **brute force** because they make no assumptions about the data organization. They're often the simplest solution but not always the fastest. [Chapter 3](03-basic-searching.md) explores searching, including when linear search is appropriate.

## Linearithmic time

This pattern combines linear and logarithmic behavior. Quicksort ([Chapter 5](05-advanced-sorting.md)) demonstrates `O(n log n)` performance. It divides data recursively (the log n part) and processes each piece (the n part). This is often the best we can achieve for comparison-based sorting.

## Quadratic time

Nested loops often produce quadratic time complexity. Bubble sort, insertion sort, and selection sort ([Chapter 4](04-basic-sorting.md)) all exhibit `O(n²)` behavior. The performance degrades dramatically: doubling the data size roughly quadruples the time. For 100 items, we might do 10,000 operations. For 1,000 items, about 1,000,000 operations.

Quadratic algorithms work fine for small datasets but become impractical as data grows. Understanding why they're `O(n²)` helps you recognize when to choose a different approach.

## Exponential time

Some algorithms' performance degrades exponentially. The naive recursive Fibonacci calculation ([Chapter 18](18-dynamic-programming.md)) demonstrates this—calculating `fib(40)` requires over a billion operations. 

## Visualizing the difference

Let's see how these complexities compare with actual numbers. This table reveals why algorithmic efficiency matters. An `O(n²)` algorithm that works fine with 100 elements becomes noticeably slow with 10,000 elements. But an `O(log n)` algorithm barely notices the difference:

| Input Size | O(1) | O(log n) | O(n) | O(n log n) | O(n²) |
|------------|------|----------|------|------------|-------|
| 10         | 1      | 3          | 10     | 30           | 100     |
| 100        | 1      | 7          | 100    | 700          | 10,000  |
| 1,000      | 1      | 10         | 1,000  | 10,000       | 1,000,000|
| 10,000     | 1      | 13         | 10,000 | 130,000      | 100,000,000|


## Building algorithmic intuition

Big O notation provides a common language for discussing algorithm efficiency. Understanding growth patterns—constant, logarithmic, linear, quadratic—enables quick assessment of whether an algorithm scales. Pattern recognition becomes intuitive with practice: nested loops suggest `O(n²)`, halving data suggests `O(log n)`, examining every element suggests `O(n)`. This vocabulary appears throughout the book and, combined with the comprehensive analysis in [Chapter 8](08-performance-analysis.md), enables informed algorithmic choices throughout software development.
