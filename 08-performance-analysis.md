---
layout: chapter
title: "Chapter 8: Analyzing Algorithms"
description: "Understanding algorithmic efficiency, complexity analysis, and real-world performance"
---
# Analyzing Algorithms

Your fitness app has 10,000 workouts. Finding your fastest 5K time with linear search: check all 10,000. With binary search on sorted data: check 14. Same result, vastly different performance. Why? Algorithm choice.

We've now explored searching techniques that locate values in collections, sorting methods that organize data, [recursion](https://en.wikipedia.org/wiki/Recursion_(computer_science)) that breaks problems into smaller pieces, and generics that enable flexible code. Along the way, we've noticed patterns—binary search feels faster than linear search, quicksort handles large datasets better than bubble sort, and some recursive solutions run exponentially slow.

It's time to formalize these observations. In [Chapter 2](02-measuring-performance.md), we learned the vocabulary of performance—[Big O Notation](https://en.wikipedia.org/wiki/Big_O_notation) provides a common language for discussing how [algorithms](https://en.wikipedia.org/wiki/Algorithm) scale. This chapter builds on that foundation, teaching you to analyze the algorithms we've written and make informed decisions about which approaches fit which problems.

## Applying Big O to algorithms you know

In Chapter 2, we learned that O(n) means linear time, O(log n) means logarithmic time, and O(n²) means quadratic time. Now let's apply this knowledge to every algorithm we've implemented.

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

**Linear search:** Single loop through array = O(n) time, O(1) space

**Binary search:** Halving pattern (log₂ n comparisons) = O(log n) time, O(1) space

**Impact at scale:**

| Workouts | Linear Search | Binary Search | Real-World Example |
|----------|---------------|---------------|-------------------|
| 1,000 | 1,000 comparisons | 10 comparisons | ~3 years of training |
| 10,000 | 10,000 comparisons | 14 comparisons | Decade of data |
| 1,000,000 | 1,000,000 comparisons | 20 comparisons | Professional athlete's career + team |

### Sorting algorithms from Chapters 4-5

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

**Bubble sort:** Outer loop (n) × inner loop (n) = O(n²) time, O(1) space

**Insertion sort:** O(n²) average, but O(n) best case when already sorted, O(1) space

**Quicksort:** Good pivot splits array in half (log n levels × n work per level) = O(n log n) average. Poor pivot creates unbalanced splits = O(n²) worst case. Space: O(log n) for recursion stack.

### Recursive algorithms from Chapter 6

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

**Naive Fibonacci:** Each call spawns two more calls, creating 2^n operations = O(2^n) time, O(n) space

**Memoized Fibonacci:** Each value computed once = O(n) time, O(n) space

**Performance for fib(40):** Naive takes billions of operations (2-3 seconds), memoized takes 40 operations (< 1 millisecond). Understanding complexity transforms unusable algorithms into instant ones.

## Recognizing common patterns

You can often determine complexity by recognizing code patterns.

**Single loop: O(n)**
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

**Nested loops: O(n²)**
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

**Halving pattern: O(log n)**
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
| Insertion Sort | O(n²) | O(1) | Small datasets, limited memory |
| Quicksort | O(n log n) avg | O(log n) | General purpose, in-place sorting |

Understanding space complexity helps you choose algorithms based on memory constraints. Mobile devices with limited RAM might prefer in-place algorithms even if they're slightly slower.

## Best case, average case, and worst case

Most algorithms don't perform the same way in every situation.

**Linear search:**
- Best case: target is first element = O(1)
- Average case: target in middle = O(n)
- Worst case: target is last or not present = O(n)

When we say "linear search is O(n)", we typically refer to [worst case](https://en.wikipedia.org/wiki/Best,_worst_and_average_case) unless specified otherwise. Big O provides an upper bound—performance won't get worse than this.

**Quicksort's varying performance:**
- **Best/Average: O(n log n)** - Good pivot selection, balanced partitions, typical with random data
- **Worst: O(n²)** - Poor pivot selection (always smallest/largest), happens with sorted/reverse-sorted data

Production implementations use random pivot selection or median-of-three to avoid worst case while maintaining fast average performance.

## When to optimize

Not every algorithm needs optimization. Optimize when you meet ALL these criteria:

- Code runs frequently (in a loop, per frame, per request)
- Handles large data (thousands to millions of items)
- Users notice slowness (lag, stuttering, delays)
- Profiling confirms it's a bottleneck

**Don't optimize:**
```swift
// Runs once at app launch with ~100 users
func displayWelcomeMessage(for users: [String]) {
    for user in users { print("Welcome, \(user)!") }
}

// Displays this week's 7 workouts on summary screen
func displayWeeklyWorkouts(_ workouts: [Workout]) {
    for workout in workouts.sorted(by: { $0.date > $1.date }) {
        print("\(workout.title): \(workout.duration) min")
    }
}
```

**Do optimize:**
```swift
// Runs 60 times per second with millions of pixels
func updateVideoFrame() {
    for row in 0..<videoHeight {
        for col in 0..<videoWidth {
            processPixel(row, col)
        }
    }
}

// Processes real-time GPS data every second during outdoor run
func updateRunningPace(from locationUpdates: [GPSPoint]) {
    for point in locationUpdates {
        calculatePace(from: point)
        updateMapDisplay()
        checkPaceAlerts()
    }
}
```

Use Xcode's Time Profiler (Product → Profile → Time Profiler) to find actual bottlenecks. Profile, optimize the slowest part, measure improvement, and stop when performance is acceptable. Don't guess—measure.

## Looking back at the algorithms we've learned

**Chapter 3: Searching**
- Linear search: O(n), binary search: O(log n)
- Key insight: Sorted data enables logarithmic search

**Chapter 4: Basic Sorting**
- Bubble, insertion, selection sort: O(n²)
- Key insight: Nested loops create quadratic complexity

**Chapter 5: Advanced Sorting**
- Quicksort: O(n log n) average
- Key insight: Divide and conquer achieves linearithmic time

**Chapter 6: Recursion**
- Naive Fibonacci: O(2^n), memoized: O(n)
- Key insight: Caching eliminates exponential duplicate work

**Chapter 7: Generics**
- Generics provide flexibility with zero runtime cost

**Upcoming chapters:**

**Data Structures (Chapters 9-15):**
- Linked Lists: O(n) access, O(1) insert/delete at position
- Stacks & Queues: O(1) push/pop
- Binary Search Trees: O(log n) average
- Graphs: O(V + E) for traversal
- Tries: O(m) where m is string length
- Hash Tables: O(1) average
- Heaps: O(log n) insert/delete

**Advanced Topics (Chapters 16-19):**
- Dynamic Programming: O(2^n) → O(n) with memoization
- Vector operations: O(n) element-wise
- PageRank: Iterative convergence
- Semantic search: O(n) vector search

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
| Array (unsorted) | O(n) | O(1) | Small datasets |
| Hash Table | O(1) avg | O(1) avg | Fast lookup, dynamic data |
| Binary Search Tree | O(log n) | O(log n) | Need sorted iteration |

Answer: Hash table—O(1) average for lookups, dynamic add/remove.
