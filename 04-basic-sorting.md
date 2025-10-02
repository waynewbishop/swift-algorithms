---
layout: chapter
title: "Chapter 4: Basic Sorting"
description: "Master bubble sort, insertion sort, and selection sort"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Basic sorting

Sorting is an essential task when managing data. As we saw with Big O notation, sorted data allows us to implement efficient algorithms. Our goal with sorting is to move from disarray to order. This is done by arranging data in a logical sequence so we'll know where to find information.

Sequences can be easily implemented with integers, but can also be achieved with characters (e.g., alphabets), and other sets like binary and hexadecimal numbers. In the examples below, we'll use various techniques to sort the following array:

```swift
//array of unsorted integers
let numberList : Array<Int> = [8, 2, 10, 9, 7, 5]
```

## Understanding basic sorting algorithms

Before diving into the implementations, let's understand what makes these algorithms "basic" and when you might use them.

### Why O(n²)?

The three algorithms in this chapter—insertion sort, bubble sort, and selection sort—all have **O(n²) time complexity** in their average and worst cases. This means that as your data doubles in size, the sorting time roughly quadruples.

**Why does this happen?**

Each algorithm uses nested loops:
- The **outer loop** goes through the entire array (n iterations)
- The **inner loop** also processes multiple elements (up to n iterations)
- Total operations: n × n = n²

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

Despite their O(n²) complexity, these algorithms have legitimate use cases:

**Choose insertion sort when:**
- Working with small datasets (< 10-20 elements)
- Data is already nearly sorted (best case: O(n))
- You need a simple, stable sort
- Memory is extremely limited (sorts in-place)
- You're building Swift's standard sort (it uses insertion sort for small subarrays!)

**Choose bubble sort when:**
- Teaching sorting concepts (very intuitive)
- You need to detect if data is already sorted (can exit early)
- Working with very small datasets

**Choose selection sort when:**
- Minimizing the number of swaps is important (only n-1 swaps maximum)
- Memory writes are expensive
- Working with small datasets

**Don't use these when:**
- Sorting large datasets (use merge sort, quick sort, or Swift's built-in `sorted()`)
- Performance is critical
- You have more than 50-100 elements

### Comparison of the three algorithms

| Algorithm | Best Case | Average Case | Worst Case | Swaps | Stable? | Space |
|-----------|-----------|--------------|------------|-------|---------|-------|
| Insertion | O(n) | O(n²) | O(n²) | O(n²) | Yes | O(1) |
| Bubble | O(n) | O(n²) | O(n²) | O(n²) | Yes | O(1) |
| Selection | O(n²) | O(n²) | O(n²) | O(n) | No | O(1) |

Stability means equal elements maintain their relative order after sorting. This matters when sorting complex objects.

**Real-world performance:**
```swift
let small = [5, 2, 8, 1, 9]        // All three work fine
let medium = Array(1...100).shuffled()  // Noticeable slowdown
let large = Array(1...10000).shuffled()  // Too slow - use merge/quick sort
```

### Visualizing how they work

**Insertion sort:** Like sorting playing cards in your hand
- Pick each card one by one
- Insert it into its correct position among already-sorted cards
- Shift other cards to make room

**Bubble sort:** Largest values "bubble" to the end
- Compare adjacent pairs
- Swap if they're in wrong order
- After each pass, the largest unsorted element reaches its final position

**Selection sort:** Find the minimum, move it to the front
- Find the smallest element in the unsorted portion
- Swap it with the first unsorted position
- Repeat for the rest of the array

With this understanding, let's explore each algorithm in detail.

## Insertion sort

Insertion sort is one of the more basic algorithms in computer science. The algorithm ranks elements by iterating through a collection and positions elements based on their value.

The set is divided into sorted and unsorted halves and repeats until all elements are sorted.

```swift
extension Array where Element: Comparable {
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

The bubble sort is another common sorting technique. Like insertion sort, the bubble sort algorithm combines a series of steps with an invariant. The function works by evaluating pairs of values. Once compared, the position of the largest value is swapped with the smaller value.

Completed enough times, this "bubbling" effect eventually sorts all elements in the list.

```swift
extension Array where Element: Comparable {
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

## Practical considerations

### When basic sorting is actually used

You might wonder, "If these are O(n²), why learn them?" Here's why they matter:

**In production code:**
- Swift's `sort()` uses Introsort, which switches to insertion sort for small subarrays (< 20 elements)
- Many optimized algorithms use insertion sort as a final "polish" step
- Database systems use them for small result sets

**In interviews:**
- Common warm-up questions
- Test your understanding of loops and invariants
- Foundation for understanding advanced sorts

**In practice:**
```swift
// Bad: Sorting large dataset with basic sort
let thousandItems = Array(1...1000).shuffled()
let sorted = thousandItems.bubbleSort()  // Slow! ~500,000 comparisons

// Good: Use Swift's built-in sort
let sorted = thousandItems.sorted()  // Fast! Uses Introsort

// Good: Basic sort for small data
let fewItems = [5, 2, 8, 1]
let sorted = fewItems.insertionSort()  // Fine! Only 10 comparisons
```

### Performance in context

**Sorting 10 elements:**
- Insertion/Bubble/Selection: ~50 comparisons ⚡ Instant
- All perform similarly

**Sorting 100 elements:**
- Basic sorts: ~5,000 comparisons ⏱️ Noticeable
- Still acceptable for one-time sorts

**Sorting 1,000 elements:**
- Basic sorts: ~500,000 comparisons 🐌 Slow
- Use merge sort or quick sort instead

**Sorting 10,000 elements:**
- Basic sorts: ~50,000,000 comparisons 💀 Unusably slow
- Advanced sorts: ~130,000 comparisons ⚡ Fast

## Summary

Basic sorting algorithms provide a foundation for understanding how sorting works:

**Key takeaways:**

1. **All three are O(n²)** due to nested loops
2. **Insertion sort** is best for nearly-sorted data (O(n) best case)
3. **Selection sort** minimizes swaps (good for expensive writes)
4. **Bubble sort** is most intuitive for teaching
5. **Use them for small datasets** (< 20 elements) or teaching
6. **Switch to advanced sorts** for large datasets

**When you need to sort in production:**
- **Small data (< 20 items)**: Insertion sort or Swift's `sorted()`
- **Large data**: Always use Swift's built-in `sorted()` (uses Introsort)
- **Custom comparison**: Use `sorted(by:)` with your closure

**Looking ahead:**

In Chapter 5, we'll explore advanced sorting algorithms like merge sort and quick sort that achieve **O(n log n)** complexity—dramatically faster for large datasets. But understanding these basic sorts provides the foundation for appreciating why those advanced algorithms matter.

Besides insertion, selection and bubble sort, there are many other sorting algorithms. As we'll see, data structures such as Binary Search Trees, Tries and Heaps also aid in sorting elements, but do so as part of their insertion process.
---

<div class="chapter-nav">
  <a href="03-basic-searching" class="prev">Previous Chapter</a>
  <a href="index">Table of Contents</a>
  <a href="05-advanced-sorting" class="next">Next Chapter</a>
</div>
