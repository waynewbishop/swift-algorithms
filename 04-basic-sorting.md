---
layout: chapter
title: "Chapter 4: Basic Sorting"
description: "Master bubble sort, insertion sort, and selection sort"
---
# Basic Sorting

Sorting is an essential task when managing data. As we saw in [Chapter 2](02-measuring-performance.md) and [Chapter 3](03-basic-searching.md), sorted data allows us to implement efficient [algorithms](https://en.wikipedia.org/wiki/Algorithm) like binary search. Our goal with sorting is to move from disarray to order. This is done by arranging data in a logical sequence so we'll know where to find information.

Sequences can be easily implemented with integers (workout durations in minutes, calorie burns, heart rates), but can also be achieved with characters (alphabetical exercise names), dates (workout timestamps), and other orderable data. In the examples below, we'll use various techniques to sort the following array:

```swift
//array of unsorted integers
let numberList : Array<Int> = [8, 2, 10, 9, 7, 5]
```

## Insertion sort

Insertion sort is one of the more basic sorting algorithms in computer science. The solution ranks elements by iterating through a collection and positions elements based on their value.

The set is divided into sorted and unsorted halves and repeats until all elements are sorted.

```swift
extension Array where Element: Comparable {
    // Sort array using insertion sort - efficient for nearly-sorted data
    func insertionSort() -> Array<Element> {

        //check for trivial case
        guard self.count > 1 else {
            return self
        }

        //mutated copy
        var output: Array<Element> = self

        for primaryindex in 0..<output.count {

            let key = output[primaryindex]
            var secondaryindex = primaryindex

            while secondaryindex > -1 {
                if key < output[secondaryindex] {

                    //move to correct position
                    output.remove(at: secondaryindex + 1)
                    output.insert(key, at: secondaryindex)
                }

                secondaryindex -= 1
            }

        }

        return output

    }
}

//execute sort
let results: Array<Int> = numberList.insertionSort()
```

## Bubble sort

Bubble sort maintains a simple invariant: after each pass through the array, the largest unsorted element moves to its final position. The algorithm works by comparing adjacent pairs of values and swapping them if they're out of order. This process causes larger values to "bubble up" toward the end of the array. After n passes, all elements are sorted.

```swift
extension Array where Element: Comparable {
    // Sort array using bubble sort - repeatedly swaps adjacent elements
    func bubbleSort() -> Array<Element> {

        //check for trivial case
        guard self.count > 1 else {
            return self
        }

        //mutated copy
        var output: Array<Element> = self

        for pindex in 0..<output.count {

            let range = (output.count - 1) - pindex

            //"half-open" range operator
            for sindex in 0..<range {

                let key = output[sindex]

                //compare / swap positions
                if (key >= output[sindex + 1]) {
                    output.swapAt(sindex, sindex + 1)
                }
            }
        }

        return output
    }
}

//execute sort
let results: Array<Int> = numberList.bubbleSort()
```

## Selection sort

Similar to bubble sort, the selection sort algorithm ranks elements by iterating through a collection and swaps elements based on their value. The set is divided into sorted and unsorted halves and repeats until all elements are sorted.

```swift
extension Array where Element: Comparable {
    // Sort array using selection sort - minimizes swap operations
    func selectionSort() -> Array<Element> {

        //check for trivial case
        guard self.count > 1 else {
            return self
        }

        //mutated copy
        var output: Array<Element> = self

        for primaryindex in 0..<output.count {

            var minimum = primaryindex
            var secondaryindex = primaryindex + 1

            while secondaryindex < output.count {
                //store lowest value as minimum
                if output[minimum] > output[secondaryindex] {
                    minimum = secondaryindex
                }

                secondaryindex += 1
            }

            //swap minimum value with array iteration
            if primaryindex != minimum {
                output.swapAt(primaryindex, minimum)
            }

        }

        return output

    }
}

//execute sort
let results: Array<Int> = numberList.selectionSort()
```

## Comparing the three approaches

Now that we've seen the three algorithms in action, let's analyze what makes them similar and different.

## Why O(n²)

The three algorithms in this chapter—insertion sort, bubble sort, and selection sort—all have **`O(n²)` [time complexity](https://en.wikipedia.org/wiki/Time_complexity)** in their average and [worst cases](https://en.wikipedia.org/wiki/Best,_worst_and_average_case). This means that as your data doubles in size, the sorting time roughly quadruples.

**Why does this happen?**

Each algorithm uses nested loops:
- The **outer loop** goes through the entire array (n iterations)
- The **inner loop** also processes multiple elements (up to n iterations)
- Total operations: `n × n = n²`

**Visual example with 4 elements:**
```
Pass 1: Compare 4 pairs
Pass 2: Compare 3 pairs
Pass 3: Compare 2 pairs
Pass 4: Compare 1 pair
Total: 10 comparisons for 4 elements
```

For 8 elements, you'd need about 40 comparisons—quadrupling the work for double the data.

## When to use basic sorting algorithms

Despite their `O(n²)` complexity, these algorithms have legitimate use cases. Understanding when to apply each algorithm requires considering the characteristics of your data and the constraints of your environment.

Insertion sort excels when working with small datasets of fewer than 10-20 elements, particularly when the data is already nearly sorted. In such cases, it achieves its [best-case](https://en.wikipedia.org/wiki/Best,_worst_and_average_case) performance of `O(n)` time complexity. The algorithm is also valuable when we need a simple, stable sort or when memory is extremely limited, since it sorts in-place. Perhaps surprisingly, Swift's standard sort implementation uses insertion sort for small subarrays as part of its hybrid Introsort algorithm, demonstrating that even basic algorithms have a place in production code.

Bubble sort, while valuable for teaching sorting concepts due to its intuitive operation, has limited practical applications. Its primary advantage lies in the ability to detect if data is already sorted and exit early. However, its use should generally be restricted to very small datasets or educational contexts where understanding the algorithm's mechanics is more important than performance.

Selection sort offers a unique advantage when minimizing the number of swap operations is critical. The algorithm performs at most n-1 swaps regardless of the initial arrangement of data, making it valuable in situations where memory writes are expensive. Like insertion sort, selection sort is best suited for small datasets where its `O(n²)` time complexity remains acceptable.

These algorithms decline when dealing with large datasets or when performance is critical. If your fitness app needs to sort a year's worth of daily step counts (365 entries) or a professional athlete's complete workout history (thousands of sessions), basic sorting algorithms will lag noticeably. In such cases, advanced algorithms like quicksort (covered in [Chapter 5](05-advanced-sorting.md)), or Swift's built-in `sorted()` method, provide dramatically better performance through their `O(n log n)` time complexity.

### Comparison table

| Algorithm | Best Case | Average Case | Worst Case | Swaps | Stable? | Space |
|-----------|-----------|--------------|------------|-------|---------|-------|
| Insertion | `O(n)` | `O(n²)` | `O(n²)` | `O(n²)` | Yes | `O(1)` |
| Bubble | `O(n)` | `O(n²)` | `O(n²)` | `O(n²)` | Yes | `O(1)` |
| Selection | `O(n²)` | `O(n²)` | `O(n²)` | `O(n)` | No | `O(1)` |

## Building algorithmic intuition

Sorting algorithms reveal how algorithm complexity impacts real-world performance. The `O(n²)` behavior of insertion, bubble, and selection sort works acceptably for small datasets but becomes impractical as data grows, demonstrating why understanding Big O notation ([Chapter 2](02-measuring-performance.md)) matters for practical development. Understanding basic sorting establishes the foundation for appreciating advanced algorithms—when quicksort ([Chapter 5](05-advanced-sorting.md)) achieves `O(n log n)` performance, the improvement becomes meaningful by comparison to these `O(n²)` alternatives.
