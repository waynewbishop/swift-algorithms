---
layout: chapter
title: "Chapter 4: Basic Sorting"
description: "Master bubble sort, insertion sort, and selection sort"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Basic sorting

Sorting is an essential task when managing data. As we saw in [Chapter 2](02-measuring-performance.md), sorted data allows us to implement efficient [algorithms](https://en.wikipedia.org/wiki/Algorithm). Our goal with sorting is to move from disarray to order. This is done by arranging data in a logical sequence so we'll know where to find information.

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

Now that we've seen the three algorithms in action, let's analyze what makes them similar and different.

### Why O(n²)

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

### When to use basic sorting algorithms

Despite their `O(n²)` complexity, these algorithms have legitimate use cases. Understanding when to apply each algorithm requires considering the characteristics of your data and the constraints of your environment.

Insertion sort excels when working with small datasets of fewer than 10-20 elements, particularly when the data is already nearly sorted. In such cases, it achieves its [best-case](https://en.wikipedia.org/wiki/Best,_worst_and_average_case) performance of `O(n)` time complexity. The algorithm is also valuable when we need a simple, stable sort or when memory is extremely limited, since it sorts in-place. Perhaps surprisingly, Swift's standard sort implementation uses insertion sort for small subarrays as part of its hybrid Introsort algorithm, demonstrating that even basic algorithms have a place in production code.

Bubble sort, while pedagogically valuable for teaching sorting concepts due to its intuitive operation, has limited practical applications. Its primary advantage lies in the ability to detect if data is already sorted and exit early. However, its use should generally be restricted to very small datasets or educational contexts where understanding the algorithm's mechanics is more important than performance.

Selection sort offers a unique advantage when minimizing the number of swap operations is critical. The algorithm performs at most n-1 swaps regardless of the initial arrangement of data, making it valuable in situations where memory writes are expensive. Like insertion sort, selection sort is best suited for small datasets where its `O(n²)` time complexity remains acceptable.

These algorithms become inappropriate when dealing with large datasets, when performance is critical, or when we have more than 50-100 elements to sort. In such cases, advanced algorithms like merge sort and quick sort, or Swift's built-in `sorted()` method, provide dramatically better performance through their `O(n log n)` time complexity.

### Comparison table

| Algorithm | Best Case | Average Case | Worst Case | Swaps | Stable? | Space |
|-----------|-----------|--------------|------------|-------|---------|-------|
| Insertion | `O(n)` | `O(n²)` | `O(n²)` | `O(n²)` | Yes | `O(1)` |
| Bubble | `O(n)` | `O(n²)` | `O(n²)` | `O(n²)` | Yes | `O(1)` |
| Selection | `O(n²)` | `O(n²)` | `O(n²)` | `O(n)` | No | `O(1)` |

Stability means equal elements maintain their relative order after sorting. This matters when sorting complex objects.

**Real-world performance:**
```swift
// Demonstrate how dataset size affects basic O(n²) sorting algorithms
let small = [5, 2, 8, 1, 9]        // All three work fine
let medium = Array(1...100).shuffled()  // Noticeable slowdown
let large = Array(1...10000).shuffled()  // Too slow - use merge/quick sort
```

## Summary

This chapter introduces three fundamental sorting algorithms—insertion sort, bubble sort, and selection sort—that demonstrate the practical implications of `O(n²)` time complexity from Chapter 2. While these algorithms are simpler to understand and implement than advanced sorting techniques, their quadratic performance limits their applicability to small datasets. Understanding when and why to use basic sorting algorithms provides essential context for appreciating the more efficient algorithms in Chapter 5.

**Insertion sort characteristics:**
Insertion sort divides the collection into sorted and unsorted halves, iterating through elements and positioning each in the correct location within the sorted portion. The algorithm exhibits `O(n²)` average and worst-case time complexity due to nested loops, but achieves `O(n)` best-case performance when data is nearly sorted. Insertion sort is stable (maintains relative order of equal elements), sorts in-place with `O(1)` space complexity, and performs well on small datasets of 10-20 elements. Swift's standard sort implementation uses insertion sort for small subarrays as part of its hybrid Introsort algorithm, demonstrating practical value.

**Bubble sort characteristics:**
Bubble sort evaluates pairs of adjacent values and swaps them if out of order, with larger values "bubbling" toward the end through repeated passes. The algorithm exhibits `O(n²)` average and worst-case complexity but can achieve `O(n)` best-case performance with early termination when data is already sorted. Bubble sort is stable and sorts in-place with `O(1)` space. Despite its intuitive operation making it valuable for teaching sorting concepts, bubble sort has limited practical applications beyond very small datasets or educational contexts.

**Selection sort characteristics:**
Selection sort divides the collection into sorted and unsorted portions, finding the minimum element in the unsorted region and swapping it to the end of the sorted region. The algorithm exhibits `O(n²)` complexity in all cases—best, average, and worst—because it always scans the entire unsorted portion regardless of data arrangement. Selection sort performs at most n-1 swaps, making it valuable when memory writes are expensive. However, selection sort is not stable—equal elements may not maintain their relative order.

**Why O(n²) happens:**
The quadratic time complexity results from nested loops: the outer loop iterates through all n elements, and the inner loop processes up to n elements for each outer iteration, yielding n × n = n² total operations. For 4 elements, this produces approximately 10 comparisons; for 8 elements, approximately 40 comparisons—quadrupling the work when doubling the data. This exponential growth makes `O(n²)` algorithms impractical for large datasets.

**When to use basic sorting algorithms:**
Use insertion sort for small datasets (fewer than 10-20 elements), nearly-sorted data (best case `O(n)`), when stability is required, or when memory is extremely limited. Use bubble sort only for very small datasets or educational purposes where understanding mechanics matters more than performance. Use selection sort when minimizing swap operations is critical (memory writes are expensive) or for small datasets. All three become inappropriate beyond 50-100 elements, where `O(n log n)` algorithms like merge sort and quicksort from Chapter 5 provide dramatically better performance.

**Comparison table insights:**
The comparison table reveals key differences: insertion and bubble sort achieve `O(n)` best-case performance on nearly-sorted data, while selection sort remains `O(n²)` regardless of initial arrangement. Selection sort minimizes swaps to `O(n)` while insertion and bubble perform `O(n²)` swaps. Insertion and bubble sort are stable; selection sort is not. All three sort in-place with `O(1)` space complexity, unlike merge sort's `O(n)` space requirement.

**Real-world performance demonstration:**
The performance example shows practical thresholds: 5-element arrays work fine with any basic algorithm, 100-element arrays show noticeable slowdown, and 10,000-element arrays are too slow for `O(n²)` algorithms. This hands-on demonstration reinforces why algorithm choice matters and when to switch to advanced techniques.

**Stability implications:**
Stability—maintaining relative order of equal elements—matters when sorting complex objects with multiple fields. For example, sorting contacts first by city then by name requires stable algorithms to preserve the city ordering when sorting by name. Insertion and bubble sort are stable; selection sort is not.

**Space complexity advantage:**
All three algorithms sort in-place with `O(1)` space complexity, modifying the input array without requiring additional memory proportional to input size. This contrasts with merge sort's `O(n)` space requirement from Chapter 5, making basic algorithms valuable when memory is severely constrained.

**Connections to future chapters:**
Chapter 2 introduced the `O(n²)` complexity category these algorithms demonstrate. Chapter 3's binary search requires sorted data, which these algorithms provide. Chapter 5 introduces merge sort and quicksort with `O(n log n)` performance, dramatically faster for large datasets. Chapter 7 demonstrates generics enabling these sort implementations to work with any Comparable type. Chapter 8 provides comprehensive performance analysis including best/average/worst case considerations relevant to understanding when insertion sort's `O(n)` best case applies.

**Practical implications:**
Understanding basic sorting algorithms means recognizing their limitations and knowing when to switch to advanced techniques. For data structures maintaining sorted order (like binary search trees from Chapter 11), insertion sort's efficiency on nearly-sorted data becomes relevant. For production code sorting large datasets, Swift's built-in `sorted()` method (Introsort combining quicksort, heapsort, and insertion sort) provides optimal performance while using insertion sort for small subarrays—demonstrating that even "basic" algorithms have practical value when applied appropriately.

<div class="bottom-nav">
  <div class="nav-container">
    <a href="03-basic-searching" class="nav-link prev">← Chapter 3: Basic Searching</a>
    <a href="index" class="nav-link toc">Table of Contents</a>
    <a href="05-advanced-sorting" class="nav-link next">Chapter 5: Advanced Sorting →</a>
  </div>
</div>
