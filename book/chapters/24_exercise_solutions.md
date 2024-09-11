# Exercise Answers and Explanations

## Big O Notation 

### Exercise 1

What is the time complexity of the following code?

```swift
func mystery(_ n: Int) -> Int {
    var result = 0
    for i in 1...n {
        for j in 1...n {
            result += i * j
        }
    }
    return result
}
```

**Answer: O(n²)**

**Explanation:** 
This function has two nested loops, both iterating from 1 to n. The outer loop runs n times, and for each iteration of the outer loop, the inner loop also runs n times. This results in n * n = n² operations. The time complexity is therefore O(n²), or quadratic time.

### Exercise 2

Improve the time complexity of this function:

```swift
func hasDuplicates(_ array: [Int]) -> Bool {
    for i in 0..<array.count {
        for j in i+1..<array.count {
            if array[i] == array[j] {
                return true
            }
        }
    }
    return false
}
```

**Answer:** We can improve this to O(n) time complexity. Here's an improved version:

```swift
func hasDuplicates(_ array: [Int]) -> Bool {
    var seen = Set<Int>()
    for num in array {
        if seen.contains(num) {
            return true
        }
        seen.insert(num)
    }
    return false
}
```

**Explanation:** 
The original function has a time complexity of O(n²) due to the nested loops. In the worst case, it compares each element with every other element in the array.

The improved version uses a Set to keep track of numbers we've seen. We iterate through the array once, checking if each number is in the Set. If it is, we've found a duplicate and return true. If not, we add the number to the Set and continue.

This approach has a time complexity of O(n) because we only loop through the array once, and Set operations (contains and insert) have an average time complexity of O(1).

The trade-off is that we use O(n) extra space for the Set, but we've significantly improved the time complexity from O(n²) to O(n).

These examples demonstrate how to analyze time complexity and how to improve an algorithm's efficiency, reinforcing the concepts introduced in the chapter.