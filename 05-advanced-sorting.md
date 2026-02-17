---
layout: chapter
title: "Chapter 5: Advanced Sorting"
description: "Master the Quicksort algorithm and divide & conquer strategy"
---
# Advanced Sorting

In [Chapter 4](04-basic-sorting.md), we explored insertion sort, bubble sort, and selection sort—all performing with a time complexity of `O(n²)`. While valuable for understanding sorting fundamentals and useful for small datasets like this week's workouts, these algorithms are seldom used in production code when dealing with larger collections like years of fitness history.

The Quicksort algorithm, however, has broad practical application and usage. This commonly used algorithm appears in code libraries, production systems, and even forms part of many standard library sorting implementations. Quicksort features a time complexity of `O(n log n)` in average cases and applies a divide & conquer strategy that results in superior performance.

## How Quicksort works

Quicksort applies a series of rules to swap pairs of values. Swap events are performed in place so no additional structures are needed to process data. In our implementation, special variables named wall and pivot will help manage the swapping process.

At the start of the sorting process, the algorithm begins by comparing each index value to a comparison value called the pivot. The wall represents the position of values that have been swapped or evaluated. Since we've just started the sorting process, the current and wall indices are shown as the same value.

### Making comparisons

The next step compares the current and pivot values. Since the current value (such as 7) is greater than the pivot (such as 4), no swap occurs. However, the current index advances to the next position.

In this step, the current value (such as 2) is again compared with the pivot. Since 2 is less than 4, the wall is swapped with the current index value. Once complete, the wall advances to the next index position.

### Conquering the divide

The process of comparing and swapping occurs until the current index meets the pivot. Once complete, the pivot is swapped with the wall index value. Interestingly, once the pivot is swapped, it's considered sorted. Even though most values remain unsorted at this phase, all values less than 4 are now positioned to the left. Conversely, all values greater than 4 are positioned to the right.

The initial pivot value of 4 has been used to show how Quicksort can divide a collection into relatively equal segments. This process is called partitioning. To sort the remaining values, each value left or right of the initial pivot is also treated as a pivot and the process is repeated.

## Implementing Quicksort in Swift

In Swift, the complete algorithm is expressed as two functions. The main quickSort function manages the overall execution, specifically the selection of each pivot value. Similar to our other sorting algorithms, the quickSort implementation is written as an Array extension. However, the nested function applies [recursion](https://en.wikipedia.org/wiki/Recursion_(computer_science)) as its main control structure:

```swift
extension Array where Element: Comparable {

    // Sort array using quicksort with in-place partitioning
    mutating func quickSort() -> Array<Element> {

        // Recursively partition array segments around pivot values
        func qSort(start startIndex: Int, _ pivot: Int) {

            if (startIndex < pivot) {
                let iPivot = qPartition(start: startIndex, pivot)
                qSort(start: startIndex, iPivot - 1)
                qSort(start: iPivot + 1, pivot)
            }
        }

        qSort(start: 0, self.endIndex - 1)
        return self

    }
}

//execute sort
var sequence: Array<Int> = [7, 2, 1, 6, 8, 5, 3, 4]
let results = sequence.quickSort()
```

Finally, the `qPartition` process sorts a selected pivot value to its correct index position:

```swift
// Partition array segment around pivot, returning final pivot position
mutating func qPartition(start startIndex: Int, _ pivot: Int) -> Int {

    var wallIndex: Int = startIndex

    //compare range with pivot
    for currentIndex in wallIndex..<pivot {

        if self[currentIndex] <= self[pivot] {
            if wallIndex != currentIndex {
                self.swapAt(currentIndex, wallIndex)
            }

            //advance wall
            wallIndex += 1
        }
    }

    //move pivot to final position
    if wallIndex != pivot {
        self.swapAt(wallIndex, pivot)
    }

    return wallIndex
}
```

## Performance characteristics

Quicksort achieves `O(n log n)` time complexity in its average case through the power of partitioning. Each partitioning operation divides the array into two segments, ideally of roughly equal size. This creates a recursion tree with log n levels, where each level halves the problem size. At each level, the algorithm examines every element once during partitioning, resulting in n operations per level. The total complexity is therefore log n levels multiplied by n operations per level, yielding `O(n log n)`.

However, Quicksort can degrade to `O(n²)` in its worst case when the pivot selection consistently creates unbalanced partitions. This occurs when the array is already sorted or contains all identical values, causing each partition to contain only one element. Modern implementations use techniques like random pivot selection or median-of-three to mitigate this risk.

## Practical applications

Quicksort excels in situations where memory is limited, since it uses minimal additional space through its in-place partitioning strategy. On iOS devices where memory management matters, this in-place sorting is particularly valuable. When a fitness app sorts thousands of workouts by duration, Quicksort modifies the array directly rather than creating copies, conserving precious memory.

Many programming languages use Quicksort or hybrid algorithms based on it. Swift's standard library uses Introsort, which begins with Quicksort and switches to heapsort if recursion depth exceeds a threshold. This approach guarantees `O(n log n)` worst-case performance while maintaining Quicksort's excellent average-case speed. When you call `.sorted()` on an array in Swift, you're likely using a Quicksort-based algorithm. The algorithm's widespread adoption in production systems—from the Health app to Strava to AllTrails—demonstrates its practical value despite the theoretical possibility of worst-case behavior.

## Building algorithmic intuition

Quicksort demonstrates the power of divide-and-conquer thinking—breaking problems into smaller subproblems appears throughout computer science, from binary search ([Chapter 3](03-basic-searching.md)) to graph algorithms. The in-place partitioning strategy shows how algorithms can optimize both space and time complexity simultaneously. Understanding quicksort provides context for recursion ([Chapter 6](06-recursion.md)) and performance trade-offs, illustrating why real-world algorithms often balance average-case performance against worst-case guarantees.
