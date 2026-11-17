---
layout: chapter
title: "Chapter 4: Basic Sorting"
description: "Build bubble sort, insertion sort, and selection sort in Swift with step-by-step implementations and performance comparisons"
---
# Basic Sorting

Sorting is an essential task when managing data. As we saw in [Chapter 2](02-measuring-performance.md) and [Chapter 3](03-basic-searching.md), sorted data allows us to implement efficient [algorithms](https://en.wikipedia.org/wiki/Algorithm) like binary search. Our goal with sorting is to move from disarray to order. This is done by arranging data in a logical sequence so we'll know where to find information.

Sequences can be easily implemented with integers (workout durations in minutes, calorie burns, heart rates), but can also be achieved with characters (alphabetical exercise names), dates (workout timestamps), and other orderable data. In the examples below, we'll use various techniques to sort the following array:

```swift
//array of unsorted integers
let numberList : Array<Int> = [8, 2, 10, 9, 7, 5]
```

## Insertion sort

Insertion sort is one of the more basic sorting algorithms in computer science. The solution ranks elements by iterating through a collection and positions elements based on their value. The set is divided into sorted and unsorted portions. Each new element is compared against the sorted portion, and larger values shift one position to the right to open a gap where it belongs. Rather than swapping pairs, insertion sort moves values over and writes the new element once.

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

        for primaryindex in 1..<output.count {

            let key = output[primaryindex]
            var secondaryindex = primaryindex - 1

            //shift elements right until we find key's position
            while secondaryindex >= 0 && key < output[secondaryindex] {
                output[secondaryindex + 1] = output[secondaryindex]
                secondaryindex -= 1
            }

            //place key in its sorted position
            output[secondaryindex + 1] = key
        }

        return output

    }
}

//execute sort
let results: Array<Int> = numberList.insertionSort()
```

## Bubble sort

Bubble sort maintains a simple invariant: after each pass through the array, the largest unsorted element moves to its final position. The algorithm works by comparing adjacent pairs of values and swapping them if they're out of order. This process causes larger values to "bubble up" toward the end of the array. After at most n passes, all elements are sorted, and if a pass completes without a single swap, the array is already in order and we can stop early.

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
            var swapped = false

            //"half-open" range operator
            for sindex in 0..<range {

                //swap only when strictly out of order, so equal values keep their order
                if output[sindex] > output[sindex + 1] {
                    output.swapAt(sindex, sindex + 1)
                    swapped = true
                }
            }

            //a pass without swaps means the array is sorted
            if swapped == false {
                break
            }
        }

        return output
    }
}

//execute sort
let results: Array<Int> = numberList.bubbleSort()
```

## Selection sort

Similar to bubble sort, the selection sort algorithm ranks elements by iterating through a collection and swaps elements based on their value. The set is divided into sorted and unsorted portions. Each pass finds the smallest remaining value and swaps it into place, repeating until all elements are sorted.

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

## Using basic sorting algorithms

These algorithms decline when dealing with large datasets or when performance is critical. If a fitness app needs to sort a year's worth of daily step counts (365 entries) or a professional athlete's complete workout history (thousands of sessions), basic sorting algorithms will lag noticeably. In such cases, advanced algorithms like quicksort (covered in [Chapter 5](05-advanced-sorting.md)), or Swift's built-in `sorted()` method, provide dramatically better performance through their `O(n log n)` time complexity.

### Comparison table

| Algorithm | Best Case | Average Case | Worst Case | Moves | Stable? | Extra space |
|-----------|-----------|--------------|------------|-------|---------|-------|
| Insertion | `O(n)` | `O(n²)` | `O(n²)` | `O(n²)` shifts | Yes | `O(1)` |
| Bubble | `O(n)` | `O(n²)` | `O(n²)` | `O(n²)` swaps | Yes | `O(1)` |
| Selection | `O(n²)` | `O(n²)` | `O(n²)` | `O(n)` swaps | No | `O(1)` |

The best cases depend on details in the code. Insertion sort's inner loop stops immediately on sorted input, and bubble sort's `swapped` flag ends the work after one pass; without that flag, bubble sort would make every pass regardless and its best case would be `O(n²)`. Stability, meaning that equal values keep their original order, also comes from a single character. Bubble sort swaps only when one value is strictly greater (`>`); swapping on `>=` would reverse equal neighbors and make it unstable.

The space column describes the extra workspace each algorithm needs while sorting, a few index variables. Our Swift versions also return a new array rather than rearranging the original, so each call allocates `O(n)` storage for its result. An in-place version, written as a `mutating` method, would need only the `O(1)` workspace.

## Building algorithmic intuition

Sorting algorithms reveal how algorithm complexity impacts real-world performance. The `O(n²)` behavior of insertion, bubble, and selection sort works acceptably for small datasets but becomes impractical as data grows, demonstrating why understanding Big O notation ([Chapter 2](02-measuring-performance.md)) matters for practical development. Understanding basic sorting establishes the foundation for appreciating advanced algorithms—when quicksort ([Chapter 5](05-advanced-sorting.md)) achieves `O(n log n)` performance, the improvement becomes meaningful by comparison to these `O(n²)` alternatives.
