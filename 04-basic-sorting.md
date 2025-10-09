---
layout: chapter
title: "Chapter 4: Basic Sorting"
description: "Master bubble sort, insertion sort, and selection sort"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Basic sorting

Sorting is an essential task when managing data. As we saw in [Chapter 2](02-measuring-performance.md), sorted data allows us to implement efficient [algorithms](glossary#algorithm). Our goal with sorting is to move from disarray to order. This is done by arranging data in a logical sequence so we'll know where to find information.

Sequences can be easily implemented with integers, but can also be achieved with characters (e.g., alphabets), and other sets like binary and hexadecimal numbers. In the examples below, we'll use various techniques to sort the following array:

```swift
//array of unsorted integers
let numberList : Array<Int> = [8, 2, 10, 9, 7, 5]
```

## Insertion sort

Insertion sort is one of the more basic algorithms in computer science. The algorithm ranks elements by iterating through a collection and positions elements based on their value.

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

        for primaryIndex in 0..<output.count {

            let key = output[primaryIndex]
            var secondaryIndex = primaryIndex

            while secondaryIndex > -1 {
                if key < output[secondaryIndex] {

                    //move to correct position
                    output.remove(at: secondaryIndex + 1)
                    output.insert(key, at: secondaryIndex)
                }

                secondaryIndex -= 1
            }

        }

        return output

    }
}

//execute sort
let results: Array<Int> = numberList.insertionSort()
```

## Bubble sort

The bubble sort is another common sorting technique. Like insertion sort, the bubble sort algorithm combines a series of steps with an invariant. The function works by evaluating pairs of values. Once compared, the position of the largest value is swapped with the smaller value. Completed enough times, this "bubbling" effect eventually sorts all elements in the list.

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

        for primaryIndex in 0..<self.count {

            let passes = (output.count - 1) - primaryIndex

            //"half-open" range operator
            for secondaryIndex in 0..<passes {

                let key = output[secondaryIndex]

                //compare / swap positions
                if (key > output[secondaryIndex + 1]) {
                    output.swapAt(secondaryIndex, secondaryIndex + 1)
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

        for primaryIndex in 0..<output.count {

            var minimum = primaryIndex
            var secondaryIndex = primaryIndex + 1

            while secondaryIndex < output.count {
                //store lowest value as minimum
                if output[minimum] > output[secondaryIndex] {
                    minimum = secondaryIndex
                }

                secondaryIndex += 1
            }

            //swap minimum value with array iteration
            if primaryIndex != minimum {
                output.swapAt(primaryIndex, minimum)
            }

        }

        return output

    }
}

//execute sort
let results: Array<Int> = numberList.selectionSort()
```

## Comparing the three approaches

Now that you've seen the three algorithms in action, let's analyze what makes them similar and different.

### Why O(n²)

The three algorithms in this chapter—insertion sort, bubble sort, and selection sort—all have **`O(n²)` [time complexity](glossary#time-complexity)** in their average and [worst cases](glossary#worst-case). This means that as your data doubles in size, the sorting time roughly quadruples.

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

### When to use basic sorting algorithms

Despite their `O(n²)` complexity, these algorithms have legitimate use cases. Understanding when to apply each algorithm requires considering the characteristics of your data and the constraints of your environment.

Insertion sort excels when working with small datasets of fewer than 10-20 elements, particularly when the data is already nearly sorted. In such cases, it achieves its [best-case](glossary#best-case) performance of `O(n)` time complexity. The algorithm is also valuable when you need a simple, stable sort or when memory is extremely limited, since it sorts in-place. Perhaps surprisingly, Swift's standard sort implementation uses insertion sort for small subarrays as part of its hybrid Introsort algorithm, demonstrating that even basic algorithms have a place in production code.

Bubble sort, while pedagogically valuable for teaching sorting concepts due to its intuitive operation, has limited practical applications. Its primary advantage lies in the ability to detect if data is already sorted and exit early. However, its use should generally be restricted to very small datasets or educational contexts where understanding the algorithm's mechanics is more important than performance.

Selection sort offers a unique advantage when minimizing the number of swap operations is critical. The algorithm performs at most n-1 swaps regardless of the initial arrangement of data, making it valuable in situations where memory writes are expensive. Like insertion sort, selection sort is best suited for small datasets where its `O(n²)` time complexity remains acceptable.

These algorithms become inappropriate when dealing with large datasets, when performance is critical, or when you have more than 50-100 elements to sort. In such cases, advanced algorithms like merge sort and quick sort, or Swift's built-in `sorted()` method, provide dramatically better performance through their `O(n log n)` time complexity.

### Comparison table

| Algorithm | Best Case | Average Case | Worst Case | Swaps | Stable? | Space |
|-----------|-----------|--------------|------------|-------|---------|-------|
| Insertion | `O(n)` | `O(n²)` | `O(n²)` | `O(n²)` | Yes | `O(1)` |
| Bubble | `O(n)` | `O(n²)` | `O(n²)` | `O(n²)` | Yes | `O(1)` |
| Selection | `O(n²)` | `O(n²)` | `O(n²)` | `O(n)` | No | `O(1)` |

Stability means equal elements maintain their relative order after sorting. This matters when sorting complex objects.

**Real-world performance:**
```swift
let small = [5, 2, 8, 1, 9]        // All three work fine
let medium = Array(1...100).shuffled()  // Noticeable slowdown
let large = Array(1...10000).shuffled()  // Too slow - use merge/quick sort
```
