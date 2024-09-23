# Advanced Sorting

The sorting functions reviewed in the previous chapter each performed with a time complexity of O(n&#178;). While good for interview situations and general academic knowledge, algorithms like InsertionSort and BubbleSort are seldom used in production code. The Quicksort algorithm, however, has broader practical application and usage. This commonly used algorithm is found in both code libraries and real-life projects. Quicksort features a time complexity of O(n log n) and applies a divide & conquer strategy. This combination results in advanced algorithmic performance.

## How quicksort works

Quicksort applies a series of rules to swap pairs of values. Swap events are performed in place so no additional structures are needed to process data. In our implementation, special variables named wall and pivot will help manage the swapping process.

### Making comparisons

The algorithm starts by examining the source element and iterating through its list of neighbors. The process of comparing and swapping occurs until the current index meets the pivot. Once complete, the pivot is swapped with the wall index value.

### Conquering the divide

Interestingly, once the pivot is swapped, it's considered sorted. Even though most values remain unsorted (at this phase), all values less than the pivot are now positioned to the left. Conversely, all values greater than the pivot are positioned to the right. This process is called partitioning.

To sort the remaining values, each value left or right of the initial pivot is also treated as a pivot and the process is repeated.

## The code

The entire algorithm is expressed as two functions. The main `quickSort` function manages the overall execution - specifically, the selection of each pivot value. The implementation is written as an Array extension:

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

// Execute sort
var sequence: Array<Int> = [7, 2, 1, 6, 8, 5, 3, 4]
let results = sequence.quickSort()
```

The `qPartition` process sorts a selected pivot value to its correct index position:

```swift
mutating func qPartition(start startIndex: Int, _ pivot: Int) -> Int {
    var wallIndex: Int = startIndex
    
    for currentIndex in wallIndex..<pivot {
        if self[currentIndex] <= self[pivot] {
            if wallIndex != currentIndex {
                self.swapAt(currentIndex, wallIndex)
            }
            wallIndex += 1
        }
    }
    
    if wallIndex != pivot {
        self.swapAt(wallIndex, pivot)
    }
    return wallIndex
}
```

## Time and space complexity analysis

Quicksort has an average-case time complexity of O(n log n), making it one of the most efficient sorting algorithms. In the best case, it can achieve O(n log n) time, while in the worst case, it degrades to O(n&#178;). The space complexity is O(log n) due to the recursive call stack.

### Best, average, and worst-case scenarios

- Best case: O(n log n) - when the pivot chosen always divides the array into two equal halves.
- Average case: O(n log n) - occurs with random data and good pivot selection.
- Worst case: O(n&#178;) - happens when the pivot is always the smallest or largest element, leading to unbalanced partitions.

## Variations of quicksort

The choice of pivot can significantly impact Quicksort's performance. Common pivot selection strategies include:

1. First element
2. Last element
3. Random element
4. Median-of-three (first, middle, last elements)

The median-of-three method often provides good performance across various input distributions.

## Optimization techniques

Several techniques can improve Quicksort's performance:

1. Switching to insertion sort for small sub-arrays (typically less than 10-20 elements)
2. Using a three-way partitioning scheme for arrays with many duplicate elements
3. Tail call optimization to reduce stack space usage

## Stability

Quicksort is not a stable sorting algorithm. Stable sorting algorithms maintain the relative order of equal elements, which Quicksort does not guarantee.

## Practical Considerations

Quicksort is an excellent general-purpose sorting algorithm, especially when:

- In-place sorting is required (to save memory)
- Average-case performance is more important than worst-case guarantees
- The input is expected to be randomly distributed

However, other algorithms might be preferable when:

- Stable sorting is required (use Mergesort)
- Guaranteed O(n log n) performance is needed for all inputs (use Heapsort or Mergesort)
- Sorting linked lists (Mergesort may be more efficient)

## Code optimizations

The Swift implementation can be optimized by:

1. Using in-place sorting to reduce memory usage
2. Implementing the median-of-three pivot selection
3. Using insertion sort for small sub-arrays

Here's an optimized version of the partition function:

```swift
mutating func optimizedPartition(_ low: Int, _ high: Int) -> Int {
    let pivot = medianOfThree(low, high)
    swap(&self[pivot], &self[high])
    
    var i = low
    for j in low..<high {
        if self[j] <= self[high] {
            swap(&self[i], &self[j])
            i += 1
        }
    }
    swap(&self[i], &self[high])
    return i
}

func medianOfThree(_ low: Int, _ high: Int) -> Int {
    let mid = (low + high) / 2
    if self[low] > self[mid] { swap(&self[low], &self[mid]) }
    if self[low] > self[high] { swap(&self[low], &self[high]) }
    if self[mid] > self[high] { swap(&self[mid], &self[high]) }
    return mid
}
```

By understanding these aspects of Quicksort, developers can make informed decisions about when and how to use this powerful sorting algorithm in their projects.