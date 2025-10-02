---
layout: chapter
title: "Chapter 2: Big O Notation"
description: "Learn to analyze algorithmic complexity and performance"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Big O Notation

As someone reading this series, you're probably familiar with the basics of Swift/iOS Development and may be in the process of writing your next app. When building software, a question we often ask ourselves is what should be our definition of done.

As an individual contributor working on a large project, features in your application may be determined by business stakeholders or a project lead. However, it takes more than requirements to build software users will love.

Great systems combine detailed analysis, stellar features and performance.

As we start our journey understanding algorithms and data structures, an idea that unites each concept is the theme of Asymptotic Analysis. Often viewed as a complex topic, asymptotics is the process of describing the efficiency of algorithms as their input size grows.

The notion of tracking algorithmic performance can reveal much about a solution's effectiveness. Ironically, this area of study was primarily developed before the introduction of modern computing. Today, this provides an advantage when testing new ideas and communicating with other developers.

In computer science, asymptotics is expressed in a standard format known as Big O Notation.

## The performance detective

Before we dive into mathematical symbols, let's think like detectives investigating algorithm performance. When you write a function, you're essentially creating a set of instructions. The question becomes: how does your function behave when the amount of data changes? Does it slow down gracefully, or does it grind to a halt?

Consider this everyday scenario: You're looking for a specific contact in your phone. If you have 10 contacts, finding someone is trivial. But what if you had 10,000 contacts? Or 100,000? The method you use to search makes all the difference between a quick result and a frustrating wait.

This is the essence of algorithmic thinking - understanding how our solutions scale with the size of the problem.

## Linear time - O(n)

Even though we sometimes think of algorithms as complex systems, in essence, they are merely recipes for completing a series of operations. For example, a simple algorithm shared across all programming languages is a loop.

In Swift, we can write a simple algorithm to find a specific number in a list:

```swift
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

//linear time - O(n)
func findNumber(_ target: Int, in list: [Int]) -> Bool {
    for number in list {
        if number == target {
            return true
        }
    }
    return false
}

//test it
let found = findNumber(8, in: numbers)  // true
```

When evaluating this function, we say that it works in linear time - O(n) because the effectiveness of its main action (searching) is directly related to the size of its input (the list). As a result, we can conclude that it would take longer for the function to find the value of 10 than 2 or 3.

To summarize, the algorithm will have to iterate through the complete set of values when searching for a non-present value like 16.

### Counting operations

Let's think about what actually happens when our function executes. In the worst-case scenario (searching for a value that doesn't exist), our function will:

- Check element 1: 1 comparison
- Check element 2: 1 comparison
- Check element 3: 1 comparison
- ... and so on

If we have n elements, we'll perform n comparisons in the worst case. This is why we call it O(n) - the number of operations grows linearly with the input size.

**Edge case consideration:** The actual performance can vary significantly. In the best case (target is the first element), we only perform one comparison - O(1). However, Big O notation describes the worst-case scenario, which helps us understand how the algorithm behaves as data grows large.

In most cases, linear time operations are referred to as being "brute force" because little effort goes into how they could run more efficiently. However, linear-based activities still provide value when prototyping complex systems in technical interviews or real-world settings.

## Constant time - O(1)

When evaluating algorithms, it's often ideal to code a solution where the size of the data input has no direct relationship to performance. Consider successful search algorithms like Google, or machine learning solutions used on websites like Netflix and Amazon.

These systems run in constant time and are represented with the symbol O(1).

A significant difference between a linear and constant operation is logic. In the case of Google, many hardware and software complexities are put into place to ensure things work as quickly as possible.

However, not all constant time operations need to be complicated. Consider these simple examples:

```swift
//constant time operations - O(1)

//getting the first element
func getFirst(from list: [Int]) -> Int? {
    return list.first
}

//getting the last element
func getLast(from list: [Int]) -> Int? {
    return list.last
}

//adding to the end
func addToEnd(_ value: Int, to list: inout [Int]) {
    list.append(value)
}
```

What makes these operations constant time? They don't need to look through the data. Whether your list contains 10 items or 10,000 items, accessing the first element, last element, or adding to the end takes the same amount of time.

The computer knows exactly where these positions are in memory, so it can jump directly to them.

Think of it like a bookmark in a physical book. Finding the bookmarked page takes the same amount of time whether the book has 100 pages or 1,000 pages—you just open to the bookmark.

## Quadratic time - O(n²)

Not all algorithms scale gracefully. Some become significantly slower as data grows. Quadratic time complexity occurs when an algorithm's performance is proportional to the square of the input size. This often happens with nested loops—a loop inside another loop.

```swift
//checking for duplicates - O(n²)
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

let myNumbers = [1, 2, 3, 4, 5, 2]
print("Has duplicates: \(hasDuplicates(in: myNumbers))")  // true
```

Why is this O(n²)? For each number in the outer loop, we check it against every remaining number in the inner loop. If we have 5 numbers, we might do roughly 5 × 5 = 25 comparisons in the worst case.

### Understanding the quadratic growth

With O(n²) algorithms, the performance degradation is dramatic:

- 10 elements: ~100 operations
- 100 elements: ~10,000 operations
- 1,000 elements: ~1,000,000 operations

This is why nested loops should make you pause and think: "Is there a better way?" In the upcoming sorting chapters, we'll see how some basic sorting algorithms exhibit this O(n²) behavior.

## Comparing growth rates

Let's visualize how these three complexities compare with actual numbers:

| Input Size | O(1) | O(n) | O(n²) |
|------------|------|------|-------|
| 10         | 1    | 10   | 100   |
| 100        | 1    | 100  | 10,000|
| 1,000      | 1    | 1,000| 1,000,000|
| 10,000     | 1    | 10,000| 100,000,000|

This table reveals why algorithmic efficiency matters. An O(n²) algorithm that works fine with 100 elements becomes painfully slow with 10,000 elements.

**Important edge cases to consider:**
- **Best case vs. worst case:** Some algorithms perform much better on already-sorted data
- **Average case behavior:** Real-world performance often falls between best and worst case
- **Space-time trade-offs:** Some algorithms trade memory usage for better time complexity

## Why this matters for sorting

In Chapter 4, we'll explore basic sorting algorithms. Some of these algorithms will demonstrate O(n²) behavior - they work fine for small datasets but become impractical for larger ones. Understanding Big O Notation will help you:

1. **Predict performance** - Will this work with 1,000 items? 100,000 items?
2. **Compare algorithms** - Which sorting method is fundamentally better?
3. **Make informed decisions** - When is "good enough" actually good enough?
4. **Communicate effectively** - Discuss performance with other developers

## Building algorithmic intuition

The goal of understanding Big O Notation isn't to memorize mathematical formulas, but to develop an intuitive sense for algorithm efficiency. When you see nested loops, think "quadratic." When you see a single loop through data, think "linear." When you see direct access to specific positions, think "constant."

This intuition will guide you toward better solutions and help you understand why certain algorithms are preferred over others.

---

<div class="chapter-nav">
  <a href="01-introduction" class="prev">Previous Chapter</a>
  <a href="index">Table of Contents</a>
  <a href="03-basic-searching" class="next">Next Chapter</a>
</div>
