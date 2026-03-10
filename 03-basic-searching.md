---
layout: chapter
title: "Chapter 3: Basic Searching"
description: "Implement linear search and binary search in Swift, compare their Big O performance, and learn when to use each"
---
# Basic Searching

In this chapter, we'll explore two fundamental approaches to searching: linear search and binary search. We'll learn how each algorithm works, when to use it, and why the choice between `O(n)` and `O(log n)` makes such a dramatic difference as data grows.

## The search problem

At its core, searching involves answering a simple question: "Is this item in my collection?" However, the method you choose to answer this question can mean the difference between a lightning-fast response and a painfully slow operation. Consider the following:

- Finding a contact in your phone's address book
- Locating your personal record time for a specific distance in a running app
- Searching for a word in a dictionary
- Looking up which workout had the highest calorie burn in the Health app
- Finding a specific song in a playlist of thousands

## The brute force approach

We've mentioned linear search in [Chapter 2](02-measuring-performance.md), but let's examine it more thoroughly. Linear search represents the most straightforward approach to finding data: check every item until we find what we're looking for.

```swift
// Implement linear search as an Array extension using Equatable protocol
extension Array where Element: Equatable {
    // Search for an element using linear search, returning its index if found
    func linearSearch(for target: Element) -> Int? {

        for (index, element) in enumerated() {
            if element == target {
                return index
            }
        }

        return nil
    }
}

//test with unsorted data
let numbers = [64, 34, 25, 12, 22, 11, 90, 5]
if let index = numbers.linearSearch(for: 22) {
    print("Found 22 at index \(index)")
} else {
    print("22 not found")
}
```

## Divide and conquer

When the data is sorted, we can employ a much more efficient strategy. Binary search uses the divide and conquer approach, eliminating half of the remaining possibilities with each comparison. Imagine we're looking for "Smith" in a physical phone book. We wouldn't start from page 1 and flip through every page. Instead, we'd:

1. Open to the middle of the book
2. See if "Smith" comes before or after the names on that page
3. Eliminate half the book and repeat the process
4. Continue until we find "Smith" or determine it's not there

## Binary search implementation

```swift
// Implement binary search as an Array extension using Comparable protocol
extension Array where Element: Comparable {
    // Search for an element using binary search on a sorted array
    func binarySearch(for target: Element) -> Int? {
        var leftIndex = 0
        var rightIndex = count - 1

        while leftIndex <= rightIndex {
            let middleIndex = (leftIndex + rightIndex) / 2
            let middleValue = self[middleIndex]

            if middleValue == target {
                return middleIndex
            } else if middleValue < target {
                //target is in right half
                leftIndex = middleIndex + 1
            } else {
                //target is in left half
                rightIndex = middleIndex - 1
            }
        }

        return nil
    }
}

//test with sorted data
let sortedNumbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]
if let index = sortedNumbers.binarySearch(for: 17) {
    print("Found 17 at index \(index)")
} else {
    print("17 not found")
}
```

### The power of logarithmic time

The efficiency of binary search becomes notable with large datasets. Consider a fitness app storing years of workout history.

| Workout Count | Linear Search (worst) | Binary Search (worst) | Real-World Example |
|---------------|----------------------|----------------------|-------------------|
| 100 | 100 comparisons | 7 comparisons | 3 months of daily workouts |
| 1,000 | 1,000 comparisons | 10 comparisons | ~3 years of workouts |
| 10,000 | 10,000 comparisons | 14 comparisons | Decade of fitness data |
| 1,000,000 | 1,000,000 comparisons | 20 comparisons | Professional athlete's career |

This table demonstrates why binary search is preferred for large, sorted datasets. The logarithmic growth means that even massive collections—like Apple Health's database of every step you've taken for years—can be searched in a reasonable number of steps. A million entries require just 20 comparisons with binary search versus potentially a million with linear search.

## Sorted data

Binary search's efficiency comes with an important prerequisite: the data must be **sorted**. This requirement influences how we design our data management strategy.

```swift
//demonstrating the sorted data requirement
let unsortedData = [64, 34, 25, 12, 22, 11, 90, 5]
let sortedData = unsortedData.sorted()

//binary search on unsorted data may give incorrect results
print("Searching unsorted data for 22:")
if let index = unsortedData.binarySearch(for: 22) {
    print("Binary search claims 22 is at index \(index)")
    if let actualIndex = unsortedData.firstIndex(of: 22) {
        print("But actually 22 is at index \(actualIndex)")
    }
} else {
    print("Binary search couldn't find 22 in unsorted data")
}

//binary search on sorted data works correctly
print("\nSearching sorted data for 22:")
if let index = sortedData.binarySearch(for: 22) {
    print("Found 22 at index \(index) in sorted array")
}
```

## Building algorithmic intuition

Searching algorithms demonstrate a fundamental trade-off in computer science: simplicity versus efficiency. Linear search works on any data with minimal assumptions, while binary search requires sorted data but achieves logarithmic performance. This pattern—trading preparation cost for execution speed—appears throughout algorithm design. The divide-and-conquer strategy behind binary search generalizes to quicksort ([Chapter 5](05-advanced-sorting.md)), binary search trees ([Chapter 11](11-binary-search-trees.md)), and many efficient algorithms throughout this book.
