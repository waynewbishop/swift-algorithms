# Advanced complexity analysis

Throughout this series, we've encountered various algorithmic complexities as we explored different data structures and algorithms. Now that you've seen Big O Notation in action across searching, sorting, recursion, and data structures, it's time to develop a more sophisticated understanding of algorithmic analysis.

This chapter builds upon the foundation we established in Chapter 2 (Big O Notation) and the real-world examples you've encountered throughout the previous chapters. We'll explore the nuances of algorithmic analysis that can help you make better design decisions and understand the true performance characteristics of your solutions.

## Beyond simple Big O

While Big O Notation provides a powerful tool for comparing algorithms, real-world performance is often more nuanced than a simple O(n) or O(log n) classification suggests.

### Best case, average case, and worst case

Most algorithms don't perform the same way in every situation. Consider the linear search we implemented in Chapter 3:

```swift
func detailedLinearSearch<T: Equatable>(for target: T, in array: [T]) -> (found: Bool, comparisons: Int, scenario: String) {
    var comparisons = 0

    for (index, element) in array.enumerated() {
        comparisons += 1
        if element == target {
            let scenario = index == 0 ? "best case" :
                          index < array.count / 2 ? "better than average" :
                          index == array.count - 1 ? "worst case" : "average case"
            return (true, comparisons, scenario)
        }
    }

    return (false, comparisons, "worst case - not found")
}

let numbers = [5, 2, 8, 6, 1, 9, 4, 0, 3, 7]

//demonstrate different scenarios
let scenarios = [
    (5, "first element"),
    (1, "middle element"),
    (7, "last element"),
    (15, "not present")
]

for (target, description) in scenarios {
    let result = detailedLinearSearch(for: target, in: numbers)
    print("\(description): \(result.comparisons) comparisons (\(result.scenario))")
}
```

This analysis reveals that while linear search is O(n) in the worst case, its real-world performance varies significantly:
- **Best case**: O(1) - target is the first element
- **Average case**: O(n/2) - which is still O(n), but performs twice as fast on average
- **Worst case**: O(n) - target is the last element or not present

### When average case matters

For algorithms you run frequently, average-case performance often matters more than worst-case performance. Hash tables, which we explored in Chapter 13, provide an excellent example:

```swift
//simplified hash table analysis
class AnalyzedHashTable<Key: Hashable, Value> {
    private var buckets: [[KeyValuePair<Key, Value>]] = []
    private var capacity: Int
    private var collisionCount = 0

    struct KeyValuePair<K, V> {
        let key: K
        let value: V
    }

    init(capacity: Int = 16) {
        self.capacity = capacity
        self.buckets = Array(repeating: [], count: capacity)
    }

    func set(_ key: Key, value: Value) {
        let index = abs(key.hashValue) % capacity
        let pair = KeyValuePair(key: key, value: value)

        if buckets[index].isEmpty {
            buckets[index].append(pair)
        } else {
            //collision occurred
            collisionCount += 1
            buckets[index].append(pair)
        }
    }

    func get(_ key: Key) -> (value: Value?, comparisons: Int)? {
        let index = abs(key.hashValue) % capacity
        var comparisons = 0

        for pair in buckets[index] {
            comparisons += 1
            if pair.key == key {
                return (pair.value, comparisons)
            }
        }

        return (nil, comparisons)
    }

    func analysisReport() {
        let totalEntries = buckets.flatMap { $0 }.count
        let usedBuckets = buckets.filter { !$0.isEmpty }.count
        let averageBucketSize = usedBuckets > 0 ? Double(totalEntries) / Double(usedBuckets) : 0

        print("Hash Table Analysis:")
        print("- Total entries: \(totalEntries)")
        print("- Used buckets: \(usedBuckets)/\(capacity)")
        print("- Collision count: \(collisionCount)")
        print("- Average bucket size: \(String(format: "%.2f", averageBucketSize))")
    }
}
```

Hash tables demonstrate why average-case analysis matters:
- **Average case**: O(1) - most lookups find the value immediately
- **Worst case**: O(n) - all values hash to the same bucket

In practice, a well-designed hash table provides near-constant time performance, making the average case more relevant than the worst case.

## Amortized analysis

Some algorithms have occasional expensive operations but maintain good performance over time. We touched on this concept when discussing dynamic arrays, but let's explore it more thoroughly.

### Dynamic array growth strategy

```swift
class AnalyzedDynamicArray<T> {
    private var storage: [T?]
    private var count = 0
    private var totalCopies = 0
    private var resizeOperations = 0

    init() {
        storage = Array(repeating: nil, count: 1)
    }

    func append(_ element: T) {
        //if we're out of space, double the capacity
        if count >= storage.count {
            resizeOperations += 1
            let oldCapacity = storage.count
            var newStorage = Array<T?>(repeating: nil, count: oldCapacity * 2)

            //copy existing elements
            for i in 0..<count {
                newStorage[i] = storage[i]
                totalCopies += 1
            }

            storage = newStorage
            print("Resized from \(oldCapacity) to \(storage.count) - copied \(count) elements")
        }

        storage[count] = element
        count += 1
    }

    func amortizedAnalysis() {
        let averageCopiesPerInsert = count > 0 ? Double(totalCopies) / Double(count) : 0
        print("Amortized Analysis:")
        print("- Total insertions: \(count)")
        print("- Resize operations: \(resizeOperations)")
        print("- Total element copies: \(totalCopies)")
        print("- Average copies per insert: \(String(format: "%.2f", averageCopiesPerInsert))")
    }
}

//demonstrate amortized behavior
let dynamicArray = AnalyzedDynamicArray<Int>()
for i in 1...20 {
    dynamicArray.append(i)
}
dynamicArray.amortizedAnalysis()
```

This analysis shows that while individual insertions might be expensive (when resizing occurs), the average cost per insertion remains constant over time. This is the essence of amortized analysis - understanding the average performance over a sequence of operations.

## Space complexity

Throughout this series, we've primarily focused on time complexity, but space complexity is equally important, especially in mobile development where memory is constrained.

### Analyzing space usage

```swift
//space complexity examples from our previous chapters

//O(1) space - insertion sort (in-place)
extension Array where Element: Comparable {
    mutating func insertionSortInPlace() {
        for i in 1..<count {
            let key = self[i]
            var j = i - 1

            while j >= 0 && self[j] > key {
                self[j + 1] = self[j]
                j -= 1
            }
            self[j + 1] = key
        }
    }
}

//O(n) space - merge sort (requires additional arrays)
extension Array where Element: Comparable {
    func mergeSortWithSpaceAnalysis() -> (sorted: [Element], auxiliarySpace: Int) {
        guard count > 1 else { return (self, 0) }

        let middleIndex = count / 2
        let leftResult = Array(self[0..<middleIndex]).mergeSortWithSpaceAnalysis()
        let rightResult = Array(self[middleIndex..<count]).mergeSortWithSpaceAnalysis()

        let merged = merge(leftResult.sorted, rightResult.sorted)
        let totalAuxiliarySpace = leftResult.auxiliarySpace + rightResult.auxiliarySpace + merged.count

        return (merged, totalAuxiliarySpace)
    }

    private func merge(_ left: [Element], _ right: [Element]) -> [Element] {
        var leftIndex = 0
        var rightIndex = 0
        var mergedArray: [Element] = []

        while leftIndex < left.count && rightIndex < right.count {
            if left[leftIndex] <= right[rightIndex] {
                mergedArray.append(left[leftIndex])
                leftIndex += 1
            } else {
                mergedArray.append(right[rightIndex])
                rightIndex += 1
            }
        }

        mergedArray.append(contentsOf: left[leftIndex...])
        mergedArray.append(contentsOf: right[rightIndex...])

        return mergedArray
    }
}
```

### Space-time trade-offs

Often, you can trade space for time or vice versa. Consider memoization in recursive algorithms:

```swift
//fibonacci without memoization - O(2^n) time, O(n) space (call stack)
func fibonacciNaive(_ n: Int) -> Int {
    if n <= 1 { return n }
    return fibonacciNaive(n - 1) + fibonacciNaive(n - 2)
}

//fibonacci with memoization - O(n) time, O(n) space (cache + call stack)
func fibonacciMemoized(_ n: Int, cache: inout [Int: Int]) -> Int {
    if let cached = cache[n] {
        return cached
    }

    if n <= 1 {
        cache[n] = n
        return n
    }

    let result = fibonacciMemoized(n - 1, cache: &cache) + fibonacciMemoized(n - 2, cache: &cache)
    cache[n] = result
    return result
}

//fibonacci iterative - O(n) time, O(1) space
func fibonacciIterative(_ n: Int) -> Int {
    if n <= 1 { return n }

    var prev = 0
    var current = 1

    for _ in 2...n {
        let next = prev + current
        prev = current
        current = next
    }

    return current
}
```

This progression shows how we can optimize for different constraints:
1. **Naive**: Simple but exponential time
2. **Memoized**: Fast but uses extra memory
3. **Iterative**: Fast and memory-efficient

## Complexity analysis framework

After exploring algorithms throughout this series, here's a practical framework for analyzing any algorithm:

### Step 1: Identify the basic operations
What operation does your algorithm perform most frequently?
- **Searching**: Comparisons
- **Sorting**: Comparisons and swaps
- **Tree operations**: Node visits
- **Graph algorithms**: Edge traversals

### Step 2: Count the operations
How many times does the basic operation execute?
- **Single loops**: Usually O(n)
- **Nested loops**: Often O(n²), but analyze the actual bounds
- **Recursive algorithms**: Set up recurrence relations
- **Divide and conquer**: Often O(n log n)

### Step 3: Consider all cases
- **Best case**: What's the most favorable input?
- **Average case**: What happens with typical input?
- **Worst case**: What's the most challenging input?

### Step 4: Analyze space usage
- **Input space**: Space required to store the input (usually not counted)
- **Auxiliary space**: Extra space your algorithm uses
- **Output space**: Space for the result (sometimes counted)

## Real-world performance considerations

Academic complexity analysis doesn't always predict real-world performance. Consider these factors:

### Constant factors matter
An O(n log n) algorithm with a large constant factor might be slower than an O(n²) algorithm for small inputs.

### Memory access patterns
Modern processors have complex memory hierarchies. Algorithms that access memory sequentially often outperform those with random access patterns, even if they have the same Big O complexity.

### Implementation details
The way you implement an algorithm can significantly affect its performance, even if the complexity remains the same.

## Looking back and moving forward

Throughout this series, we've seen complexity analysis in action:

- **Chapter 2**: Foundation with O(1), O(n), O(n²)
- **Chapter 3**: O(log n) with binary search
- **Chapter 4-5**: Sorting algorithm complexities
- **Chapter 6**: Recursive complexity analysis
- **Chapters 8-14**: Data structure operation complexities

This advanced understanding of complexity analysis will help you:
1. **Make informed algorithm choices**
2. **Identify performance bottlenecks**
3. **Communicate effectively about performance**
4. **Optimize critical code paths**

## Building performance intuition

The goal isn't to memorize complexity formulas, but to develop intuition about algorithmic efficiency. When you encounter a new problem, ask:

1. **What's the inherent complexity?** Some problems require examining every element
2. **Can I reduce redundant work?** Look for repeated calculations
3. **What are my constraints?** Time, space, simplicity, maintainability
4. **Is optimization worth it?** Sometimes O(n²) is fine for small datasets

This intuition, built through understanding real algorithms and their trade-offs, will serve you well in designing efficient solutions to new problems.

