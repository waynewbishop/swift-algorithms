---
layout: chapter
title: "Chapter 5: Advanced Sorting"
description: "Implement merge sort and quicksort algorithms"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Advanced sorting

The functions introduced in basic sorting all performed with a time complexity of O(n²). While good for interview situations and general academic knowledge, algorithms like insertion sort and bubble sort are seldom used in production code. Advanced sorting algorithms, however, have broader practical application and usage. These algorithms can be found in both code libraries and real-life projects, featuring time complexity of O(n log n) and applying divide & conquer strategies for superior algorithmic performance.

In this chapter, we'll explore two fundamental advanced sorting algorithms that demonstrate different approaches to the divide & conquer strategy: Quicksort and Merge Sort.

## Quicksort - In-place partitioning

Quicksort applies a series of rules to "swap" pairs of values. Swap events are performed in place so no additional structures are needed to process data. In our implementation, special variables named wall and pivot will help manage the swapping process.

### How Quicksort works

The algorithm begins by comparing each index value to a "comparison" value (e.g., pivot). The wall represents the position of values that have been swapped or evaluated. Since we've just started the sorting process, the current and wall indices are shown as the same value.

### Making comparisons

The next step compares the current and pivot values. Since the current value (e.g., 7) is greater than the pivot (e.g., 4), no swap occurs. However, the current index advances to the next position.

In this step, the current value (e.g., 2) is again compared with the pivot. Since 2 is less than 4, the wall is swapped with the current index value. Once complete, the wall advances to the next index position.

### Conquering the divide

The process of comparing and swapping occurs until the current index meets the pivot. Once complete, the pivot is swapped with the wall index value. Interestingly, once the pivot is swapped, it's considered sorted. Even though most values remain unsorted (at this phase), all values less than 4 are now positioned to the left. Conversely, all values greater than 4 are positioned to the right.

The initial pivot value of 4 has been used to show how Quicksort can divide a collection into relatively equal segments. This process is called partitioning. To sort the remaining values, each value left or right of the initial pivot is also treated as a pivot and the process is repeated.

### The Quicksort code

In Swift, the complete algorithm is expressed as two functions. The main quickSort function manages the overall execution - specifically, the selection of each pivot value. Similar to our other sorting algorithms, the quickSort implementation is written as an Array extension. However, the nested function applies recursion as its main control structure:

```swift
extension Array where Element: Comparable {

  mutating func quickSort() -> Array<Element> {

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
```

Finally, the qPartition process sorts a selected pivot value to its correct index position:

```swift
//sorts selected pivot
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

Execute the quicksort:

```swift
//execute sort
var sequence: Array<Int> = [7, 2, 1, 6, 8, 5, 3, 4]
let results = sequence.quickSort()
```

## Merge sort - Divide and conquer

While Quicksort partitions data in-place, Merge Sort takes a different approach to the divide & conquer strategy. Instead of partitioning around a pivot, Merge Sort recursively divides the array into smaller pieces until each piece contains only one element, then merges these pieces back together in sorted order.

### Understanding the merge sort strategy

The beauty of Merge Sort lies in its systematic approach:

1. Divide: Split the array into two halves
2. Conquer: Recursively sort each half
3. Combine: Merge the two sorted halves into a single sorted array

This approach guarantees O(n log n) performance in all cases - best, average, and worst case.

### The merge sort implementation

```swift
extension Array where Element: Comparable {
    func mergeSort() -> [Element] {
        //base case: arrays with 0 or 1 element are already sorted
        guard count > 1 else { return self }

        //divide: split array into two halves
        let middleIndex = count / 2
        let leftArray = Array(self[0..<middleIndex]).mergeSort()
        let rightArray = Array(self[middleIndex..<count]).mergeSort()

        //combine: merge the sorted halves
        return merge(leftArray, rightArray)
    }

    private func merge(_ left: [Element], _ right: [Element]) -> [Element] {
        var leftIndex = 0
        var rightIndex = 0
        var mergedArray: [Element] = []

        //merge elements in sorted order
        while leftIndex < left.count && rightIndex < right.count {
            if left[leftIndex] <= right[rightIndex] {
                mergedArray.append(left[leftIndex])
                leftIndex += 1
            } else {
                mergedArray.append(right[rightIndex])
                rightIndex += 1
            }
        }

        //append any remaining elements
        mergedArray.append(contentsOf: left[leftIndex...])
        mergedArray.append(contentsOf: right[rightIndex...])

        return mergedArray
    }
}

//execute merge sort
let numbers = [64, 34, 25, 12, 22, 11, 90, 5]
let sortedNumbers = numbers.mergeSort()
print("Sorted: \(sortedNumbers)")
```

### Understanding merge sort performance

Merge Sort demonstrates the elegant O(n log n) complexity:

- **Divide phase**: We split the array log n times (each split halves the problem)
- **Merge phase**: At each level, we examine every element once (n operations per level)
- Total: log n levels × n operations per level = O(n log n)

This analysis shows why Merge Sort is so reliable - its performance doesn't depend on the initial arrangement of data.

## Comparing advanced sorting algorithms

| Algorithm | Best Case | Average Case | Worst Case | Space Complexity | Stable? |
|-----------|-----------|--------------|------------|------------------|---------|
| Quicksort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |

### When to use Quicksort

Quicksort excels when:
- **Memory is limited** - Uses minimal additional space
- **Average case matters more** - Typically faster than merge sort in practice
- **In-place sorting is preferred** - Modifies the original array
- **Stability isn't required** - Doesn't preserve relative order of equal elements

### When to use merge sort

Merge Sort is preferred when:
- **Predictable performance is crucial** - Guaranteed O(n log n) in all cases
- **Stability is required** - Preserves relative order of equal elements
- **Working with large datasets** - Consistent performance regardless of input
- **External sorting** - Can sort data that doesn't fit in memory

## The divide & conquer insight

Both algorithms demonstrate the power of divide & conquer, but in different ways:

Quicksort: Divides the problem by partitioning around a pivot, solving recursively, then combining trivially (no work needed)

**Merge Sort**: Divides the problem trivially (just split in half), solves recursively, then combines intelligently (merge operation)

This insight shows that divide & conquer is not a single technique, but a family of approaches that can be applied differently depending on the problem structure.

## Practical performance considerations

While both algorithms are O(n log n), their real-world performance can vary:

```swift
//performance testing framework
func measureSortingTime<T: Comparable>(_ array: [T], algorithm: ([T]) -> [T], name: String) {
    let startTime = CFAbsoluteTimeGetCurrent()
    let _ = algorithm(array)
    let timeElapsed = CFAbsoluteTimeGetCurrent() - startTime
    print("\(name): \(String(format: "%.4f", timeElapsed)) seconds")
}

//test with different data patterns
let randomData = (1...10000).map { _ in Int.random(in: 1...1000) }
let sortedData = Array(1...10000)
let reversedData = Array(1...10000).reversed()

print("Random data:")
measureSortingTime(randomData, algorithm: { $0.mergeSort() }, name: "Merge Sort")

print("\nAlready sorted data:")
measureSortingTime(sortedData, algorithm: { $0.mergeSort() }, name: "Merge Sort")

print("\nReversed data:")
measureSortingTime(Array(reversedData), algorithm: { $0.mergeSort() }, name: "Merge Sort")
```

## Looking back and forward

These advanced sorting algorithms demonstrate several key computer science principles:

1. **Divide & Conquer** - Breaking problems into smaller, manageable pieces
2. Recursion - Using functions that call themselves (covered in Chapter 6)
3. **Trade-offs** - Space vs. time, stability vs. performance, worst-case vs. average-case
4. **Algorithm Analysis** - Understanding when different approaches excel

As you continue through this series, you'll see these same principles applied to data structures like binary search trees and graphs, where divide & conquer strategies enable efficient operations.

## Building sorting intuition

When choosing a sorting algorithm, consider:

1. **Data characteristics** - Size, initial order, duplicate values
2. **Performance requirements** - Best case, worst case, or average case priority
3. **Memory constraints** - In-place vs. additional space requirements
4. **Stability needs** - Whether relative order of equal elements matters

This analytical approach to algorithm selection will serve you well throughout your career in software development.


---

<div class="chapter-nav">
  <a href="04-basic-sorting" class="prev">Previous Chapter</a>
  <a href="index">Table of Contents</a>
  <a href="06-recursion" class="next">Next Chapter</a>
</div>
