---
layout: chapter
title: "Chapter 5: Advanced Sorting"
description: "Master the Quicksort algorithm and divide & conquer strategy"
---
# Advanced sorting

In [Chapter 4](04-basic-sorting.md), we explored insertion sort, bubble sort, and selection sort—all performing with a [time complexity](https://en.wikipedia.org/wiki/Time_complexity) of `O(n²)`. While valuable for understanding sorting fundamentals and useful for small datasets, these algorithms are seldom used in production code when dealing with larger collections.

The Quicksort [algorithm](https://en.wikipedia.org/wiki/Algorithm), however, has broad practical application and usage. This commonly used algorithm appears in code libraries, production systems, and even forms part of many standard library sorting implementations. Quicksort features a time complexity of `O(n log n)` in average cases and applies a divide & conquer strategy that results in superior performance.

## How Quicksort works

Quicksort applies a series of rules to swap pairs of values. Swap events are performed in place so no additional structures are needed to process data. In our implementation, special variables named wall and pivot will help manage the swapping process.

At the start of the sorting process, the algorithm begins by comparing each index value to a comparison value called the pivot. The wall represents the position of values that have been swapped or evaluated. Since we've just started the sorting process, the current and wall indices are shown as the same value.

### Making comparisons

The next step compares the current and pivot values. Since the current value (such as 7) is greater than the pivot (such as 4), no swap occurs. However, the current index advances to the next position.

In this step, the current value (such as 2) is again compared with the pivot. Since 2 is less than 4, the wall is swapped with the current index value. Once complete, the wall advances to the next index position.

### Conquering the divide

The process of comparing and swapping occurs until the current index meets the pivot. Once complete, the pivot is swapped with the wall index value. Interestingly, once the pivot is swapped, it's considered sorted. Even though most values remain unsorted at this phase, all values less than 4 are now positioned to the left. Conversely, all values greater than 4 are positioned to the right.

The initial pivot value of 4 has been used to show how Quicksort can divide a collection into relatively equal segments. This process is called partitioning. To sort the remaining values, each value left or right of the initial pivot is also treated as a pivot and the process is repeated.

> **[Divide and Conquer](https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm)**: The process of deconstructing a single, complex system into a series of sub-systems. In computer science, divide & conquer strategies can be found in search and sorting algorithms, graphs, and dynamic programming.

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

Finally, the qPartition process sorts a selected pivot value to its correct index position:

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

The [space complexity](https://en.wikipedia.org/wiki/Space_complexity) of Quicksort is `O(log n)` due to the recursion stack. Each recursive call stores information about the current partition being processed. In a balanced partition scenario, the maximum depth of recursion is log n, which determines the space required.

### Visualizing the performance difference

To understand why `O(n log n)` is dramatically better than `O(n²)`, consider sorting 10,000 elements:

- **Basic sorting** (`O(n²)`): ~100,000,000 operations
- **Quicksort** (`O(n log n)`): ~140,000 operations

This difference of over 700× explains why Quicksort dominates production code. The performance gap widens further as data grows—for 100,000 elements, the difference becomes approximately 7,500×.

### Best, average, and worst cases

**Best case:** `O(n log n)` occurs when each pivot divides the array into perfectly balanced halves. This produces the shallowest recursion tree possible.

**Average case:** `O(n log n)` still holds even with imperfect pivots, as long as partitions remain reasonably balanced. Random data typically produces this behavior.

**Worst case:** `O(n²)` happens when pivots consistently create maximally unbalanced partitions (e.g., always choosing the smallest or largest element as pivot). Sorted or reverse-sorted arrays trigger this behavior with naive pivot selection.

### Pivot selection strategies

The choice of pivot significantly impacts performance:

**Last element** (our implementation): Simple but vulnerable to worst-case behavior on sorted data.

**Random element**: Avoids worst-case patterns in pre-sorted data, achieving `O(n log n)` expected performance.

**Median-of-three**: Selects the median of first, middle, and last elements. Balances simplicity with improved pivot quality.

**True median**: Guarantees balanced partitions but requires extra computation to find, potentially negating the benefits.

## Practical applications

Quicksort excels in situations where memory is limited, since it uses minimal additional space through its in-place partitioning strategy. The algorithm typically runs faster than other `O(n log n)` algorithms in practice when average-case performance matters more than worst-case guarantees. Since Quicksort modifies the original array rather than creating copies, it's preferred when in-place sorting is required.

Many programming languages use Quicksort or hybrid algorithms based on it. Swift's standard library uses Introsort, which begins with Quicksort and switches to heapsort if recursion depth exceeds a threshold. This approach guarantees `O(n log n)` worst-case performance while maintaining Quicksort's excellent average-case speed. The algorithm's widespread adoption in production systems demonstrates its practical value despite the theoretical possibility of worst-case behavior.

The algorithm proves particularly effective for general-purpose sorting where the input data has no particular pattern. Random or pseudo-random data produces the balanced partitions that allow Quicksort to achieve its optimal performance. Database systems, operating system utilities, and application frameworks frequently rely on Quicksort or its variants for their sorting operations.

## Divide and conquer in action

Quicksort exemplifies the divide and conquer strategy by breaking the sorting problem into smaller subproblems. The partitioning phase divides the array around a pivot, creating two segments where all elements in the left segment are smaller than the pivot, and all elements in the right segment are larger. Each segment then becomes its own sorting problem, solved recursively using the same strategy.

Unlike some divide and conquer algorithms that require significant work to combine solutions, Quicksort's combination phase is trivial. Once both segments are sorted, the entire array is sorted with no additional work needed. This efficient combination is possible because the partitioning phase does the heavy lifting of positioning elements relative to the pivot.

The divide and conquer approach appears throughout computer science, from binary search to merge sort to the graph algorithms we'll explore later in this book. Understanding how Quicksort applies this strategy provides a foundation for recognizing the pattern in other contexts. The key insight is that many complex problems become tractable when broken into smaller instances of the same problem.

We'll explore recursion more deeply in [Chapter 6](06-recursion.md), where we'll see how functions that call themselves enable elegant solutions to complex problems. Quicksort serves as an excellent introduction to recursive thinking, demonstrating how a few lines of code can express a powerful algorithm through self-reference.

## Quicksort vs merge sort

Both Quicksort and merge sort achieve `O(n log n)` time complexity, but they differ in important ways:

| Characteristic | Quicksort | Merge Sort |
|----------------|-----------|------------|
| Average case | `O(n log n)` | `O(n log n)` |
| Worst case | `O(n²)` | `O(n log n)` |
| Space complexity | `O(log n)` | `O(n)` |
| In-place | Yes | No |
| Stable | No | Yes |
| Practical speed | Usually faster | Predictable |

**When to choose Quicksort:**
- Memory is limited (in-place sorting)
- Average-case performance matters more than worst-case guarantees
- Stability (preserving order of equal elements) is not required
- Data is random or unpredictable

**When to choose merge sort:**
- Worst-case guarantees are essential
- Stability is required (sorting objects with multiple fields)
- Extra memory is available
- Data is already partially sorted or has patterns

Swift's standard library uses Introsort, which starts with Quicksort and switches to heapsort if recursion depth becomes excessive. This hybrid approach combines Quicksort's speed with guaranteed `O(n log n)` worst-case performance.
