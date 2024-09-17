# Basic Sorting

Sorting is a fundamental operation in computer science, used to arrange data in a specific order. This chapter introduces three basic sorting algorithms: Insertion Sort, Bubble Sort, and Selection Sort. We'll explore their implementations, analyze their performance, and discuss their practical applications.

## Insertion sort

Insertion sort is a simple sorting algorithm that builds the final sorted array one item at a time. It's much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.

### Algorithm description

1. Iterate through the array from the second element.
2. Compare the current element with the previous elements.
3. If the current element is smaller, swap it with the previous element.
4. Repeat step 3 until the element is in its correct position.
5. Move to the next element and repeat steps 2-4.

### Swift implementation

```swift
extension Array where Element: Comparable {
    func insertionSort() -> Array<Element> {
        guard self.count > 1 else { return self }
        
        var output = self
        for primaryIndex in 1..<output.count {
            let key = output[primaryIndex]
            var secondaryIndex = primaryIndex - 1
            
            while secondaryIndex >= 0 && output[secondaryIndex] > key {
                output[secondaryIndex + 1] = output[secondaryIndex]
                secondaryIndex -= 1
            }
            
            output[secondaryIndex + 1] = key
        }
        
        return output
    }
}
```

### Time and space complexity

- Time Complexity: 
  - Best Case: O(n) - when the array is already sorted
  - Average Case: O(n&#178;)
  - Worst Case: O(n&#178;) - when the array is in reverse order
- Space Complexity: O(1) - in-place sorting algorithm

### Characteristics

- Stable: Yes
- Adaptive: Yes
- In-place: Yes
- Online: Yes (can sort a list as it receives it)

## Bubble sort

Bubble sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.

### Algorithm description

1. Start from the first element of the array.
2. Compare the current element with the next element.
3. If the current element is greater than the next element, swap them.
4. Move to the next element and repeat steps 2-3.
5. Repeat steps 1-4 for each pass through the array until no swaps are needed.

### Swift implementation

```swift
extension Array where Element: Comparable {
    func bubbleSort() -> Array<Element> {
        guard self.count > 1 else { return self }
        
        var output = self
        for primaryIndex in 0..<output.count {
            let passes = (output.count - 1) - primaryIndex
            for secondaryIndex in 0..<passes {
                if output[secondaryIndex] > output[secondaryIndex + 1] {
                    output.swapAt(secondaryIndex, secondaryIndex + 1)
                }
            }
        }
        
        return output
    }
}
```

### Time and space complexity

- Time Complexity: 
  - Best Case: O(n) - when the array is already sorted
  - Average Case: O(n&#178;)
  - Worst Case: O(n&#178;) - when the array is in reverse order
- Space Complexity: O(1) - in-place sorting algorithm

### Characteristics

- Stable: Yes
- Adaptive: Yes
- In-place: Yes
- Online: No

## Selection sort

Selection sort is an in-place comparison sorting algorithm. It divides the input list into two parts: a sorted portion at the left end and an unsorted portion at the right end. Initially, the sorted portion is empty and the unsorted portion is the entire list.

### Algorithm description

1. Find the minimum element in the unsorted portion of the array.
2. Swap it with the first element of the unsorted portion.
3. Move the boundary between the sorted and unsorted portions one element to the right.
4. Repeat steps 1-3 until the entire array is sorted.

### Swift implementation

```swift
extension Array where Element: Comparable {
    func selectionSort() -> Array<Element> {
        guard self.count > 1 else { return self }
        
        var output = self
        for primaryIndex in 0..<output.count - 1 {
            var minimum = primaryIndex
            for secondaryIndex in (primaryIndex + 1)..<output.count {
                if output[minimum] > output[secondaryIndex] {
                    minimum = secondaryIndex
                }
            }
            if primaryIndex != minimum {
                output.swapAt(primaryIndex, minimum)
            }
        }
        
        return output
    }
}
```

### Time and space complexity

- Time Complexity: 
  - Best Case: O(n&#178;)
  - Average Case: O(n&#178;)
  - Worst Case: O(n&#178;)
- Space Complexity: O(1) - in-place sorting algorithm

### Characteristics

- Stable: No
- Adaptive: No
- In-place: Yes
- Online: No

## When to use basic sorting algorithms

While these algorithms are not as efficient as advanced sorting algorithms for large datasets, they have their uses:

1. Small datasets: For small arrays (usually less than 50 elements), these algorithms can be faster due to their simplicity and low overhead.

2. Nearly sorted data: Insertion sort and bubble sort perform well on nearly sorted data.

3. Limited memory: These algorithms are in-place, requiring minimal extra memory.

4. Educational purposes: These algorithms are excellent for teaching sorting concepts due to their simplicity.

5. Embedded systems: In systems with limited resources, these simple algorithms can be preferred.

## Historical context

- Bubble Sort: One of the simplest sorting algorithms, bubble sort was analyzed as early as 1956 by O. J. Podsypanin.

- Insertion Sort: While its origins are unclear, insertion sort has been used practically since the invention of computers and even before in card sorting.

- Selection Sort: Developed by Tony Hoare in 1961, selection sort was part of his work on Quicksort, one of the most efficient sorting algorithms.

## Conclusion

Basic sorting algorithms provide a foundation for understanding more complex sorting methods. While they may not be the most efficient for large datasets, their simplicity makes them valuable in certain scenarios and as learning tools. In the next chapter, we'll explore advanced sorting algorithms that offer improved performance for larger datasets.