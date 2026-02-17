---
layout: chapter
title: "Chapter 8: Analyzing Algorithms"
description: "Understanding algorithmic efficiency, complexity analysis, and real-world performance"
---
# Analyzing Algorithms

We've explored searching techniques that locate values in collections, sorting methods that organize data, [recursion](06-recursion.md) that breaks problems into smaller pieces, and generics that enable flexible code. Along the way, we've noticed patterns—binary search feels faster than linear search, quicksort handles large datasets better than bubble sort, and some recursive solutions run exponentially slow.

## Applying Big O to algorithms you know

In [Chapter 2](02-measuring-performance.md), we learned that `O(n)` means linear time, `O(log n)` means logarithmic time, and `O(n²)` means quadratic time. Now let's apply this knowledge to every algorithm we've implemented.

### Search algorithms from Chapter 3

```swift
// Linear search: O(n) - must check every element in worst case
func linearSearch<T: Equatable>(for target: T, in array: [T]) -> Int? {
    for (index, element) in array.enumerated() {
        if element == target {
            return index
        }
    }
    return nil
}

// Binary search: O(log n) - eliminates half each comparison
func binarySearch<T: Comparable>(for target: T, in array: [T]) -> Int? {
    var left = 0
    var right = array.count - 1

    while left <= right {
        let mid = (left + right) / 2

        if array[mid] == target {
            return mid
        } else if array[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return nil
}
```

Linear search checks each element sequentially with a single loop through the array, giving us `O(n)` time complexity. Since we only track the current index, space complexity remains constant at `O(1)`. Binary search demonstrates a halving pattern—each comparison eliminates half the remaining elements. This produces `log₂` n comparisons, resulting in `O(log n)` time complexity while maintaining `O(1)` space since we only store the left, right, and middle indices.

**Impact at scale:**

| Workouts | Linear Search | Binary Search | Real-World Example |
|----------|---------------|---------------|-------------------|
| 1,000 | 1,000 comparisons | 10 comparisons | ~3 years of training |
| 10,000 | 10,000 comparisons | 14 comparisons | Decade of data |
| 1,000,000 | 1,000,000 comparisons | 20 comparisons | Professional athlete's career + team |

### Sorting algorithms

```swift
// Bubble sort: O(n²) - nested loops over array
extension Array where Element: Comparable {
    func bubbleSort() -> Array<Element> {
        guard count > 1 else { return self }

        var output: Array<Element> = self

        for pindex in 0..<output.count {
            let range = (output.count - 1) - pindex

            for sindex in 0..<range {
                let key = output[sindex]

                if (key >= output[sindex + 1]) {
                    output.swapAt(sindex, sindex + 1)
                }
            }
        }

        return output
    }
}

// Quicksort: O(n log n) average, O(n²) worst case
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
}
```

Bubble sort demonstrates the classic nested loop pattern—an outer loop iterating n times, each containing an inner loop also iterating n times. This multiplication produces `O(n²)` time complexity. Since bubble sort swaps elements in place without requiring additional arrays, space complexity remains `O(1)`.

Insertion sort exhibits similar `O(n²)` average-case performance, but reveals an important optimization: when the array is already sorted, insertion sort achieves `O(n)` best-case performance by simply confirming each element is already in position. Like bubble sort, insertion sort operates in place with `O(1)` space complexity.

Quicksort achieves superior performance through divide-and-conquer strategy. When pivot selection splits the array roughly in half, we create log n recursive levels, with each level performing n comparisons and swaps. This produces `O(n log n)` average-case time complexity. However, poor pivot selection—always choosing the smallest or largest element—creates unbalanced partitions that degrade performance to `O(n²)` worst case. Unlike the previous algorithms, quicksort's recursive nature requires `O(log n)` space for the call stack.

### Recursive algorithms

```swift
// Naive Fibonacci: O(2^n) - exponentially slow
func fibonacciNaive(_ n: Int) -> Int {
    if n <= 1 { return n }
    return fibonacciNaive(n - 1) + fibonacciNaive(n - 2)
}

// Memoized Fibonacci: O(n) - cache eliminates duplicate work
func fibonacciMemoized(_ n: Int, cache: inout [Int: Int]) -> Int {
    if let cached = cache[n] { return cached }
    if n <= 1 { return n }
    let result = fibonacciMemoized(n - 1, cache: &cache) +
                 fibonacciMemoized(n - 2, cache: &cache)
    cache[n] = result
    return result
}
```

The naive Fibonacci implementation reveals exponential complexity—each function call spawns two additional calls, creating a branching tree of 2^n operations. The recursion depth reaches n levels, resulting in `O(2^n)` time complexity and `O(n)` space complexity for the call stack.

Memoization transforms this exponential behavior into linear performance. By caching previously computed values, we ensure each Fibonacci number is calculated exactly once. This optimization reduces time complexity to `O(n)` while maintaining `O(n)` space complexity for the cache storage.

The practical impact is dramatic: computing fib(40) with the naive approach requires billions of operations, taking 2-3 seconds. The memoized version performs just 40 operations, completing in under 1 millisecond. Understanding algorithmic complexity enables us to transform unusable algorithms into instant ones.

## Recognizing common patterns

You can often determine complexity by recognizing code patterns.

**Single loop: `O(n)`**
```swift
// Process each element once
func findMaximum(in numbers: [Int]) -> Int? {
    guard var max = numbers.first else { return nil }
    for number in numbers {
        if number > max { max = number }
    }
    return max
}
```

**Nested loops: `O(n²)`**
```swift
// Check all pairs
func hasDuplicates(in numbers: [Int]) -> Bool {
    for i in 0..<numbers.count {
        for j in (i + 1)..<numbers.count {
            if numbers[i] == numbers[j] { return true }
        }
    }
    return false
}
```

**Halving pattern: `O(log n)`**
```swift
// Each iteration processes half
func countHalvings(_ n: Int) -> Int {
    var value = n
    var count = 0
    while value > 1 {
        value = value / 2
        count += 1
    }
    return count
}
```


## Space complexity matters

[Time complexity](https://en.wikipedia.org/wiki/Time_complexity) measures operations. [Space complexity](https://en.wikipedia.org/wiki/Space_complexity) measures memory usage. Sometimes you must trade one for the other.

| Algorithm | Time | Space | When to use |
|-----------|------|-------|-------------|
| Insertion Sort | `O(n²)` | `O(1)` | Small datasets, limited memory |
| Quicksort | `O(n log n)` avg | `O(log n)` | General purpose, in-place sorting |

Understanding space complexity helps you choose algorithms based on memory constraints. Mobile devices with limited RAM might prefer in-place algorithms even if they're slightly slower.

## Best case, average case, and worst case

Most algorithms don't perform the same way in every situation.

**Linear search:**
- Best case: target is first element = `O(1)`
- Average case: target in middle = `O(n)`
- Worst case: target is last or not present = `O(n)`

When we say "linear search is `O(n)`", we typically refer to [worst case](https://en.wikipedia.org/wiki/Best,_worst_and_average_case) unless specified otherwise. Big O provides an upper bound—performance won't get worse than this.

## Building performance intuition

The goal isn't memorizing formulas—it's developing intuition about what makes code fast or slow.

**Pattern recognition:**
- Nested loops → "Quadratic—might slow down with large data"
- Single loop → "Linear—scales directly with input size"
- Halving/doubling → "Logarithmic—scales beautifully"
- Recursion spawning multiple calls → "Might be exponential"

**Making informed decisions:**

Problem: Store user sessions, need fast lookup by session ID

| Data Structure | Lookup | Insert | Best For |
|----------------|--------|--------|----------|
| Array (unsorted) | `O(n)` | `O(1)` | Small datasets |
| Hash Table | `O(1)` avg | `O(1)` avg | Fast lookup, dynamic data |
| Binary Search Tree | `O(log n)` | `O(log n)` | Need sorted iteration |

Answer: Hash table—`O(1)` average for lookups, dynamic add/remove.

## Building algorithmic intuition

Understanding performance analysis connects to practical decision-making. Choosing between `O(n)` linear search and `O(log n)` binary search means understanding when sorting overhead pays off. Selecting data structures based on operation frequency—frequent lookups favor hash tables, ordered iteration favors trees—requires performance-based reasoning. Combined with the introductory concepts from [Chapter 2](02-measuring-performance.md), this comprehensive analysis enables informed algorithmic choices throughout software development.
