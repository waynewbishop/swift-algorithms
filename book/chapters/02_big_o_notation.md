# BIG O NOTATION

Congratulations! As someone reading this series, you're probably familiar with the basics of Swift/iOS Development and may be in the process of writing your next app. When building software, a question we often ask ourselves is what should be our definition of done. As an individual contributor working on a large project, features in your application may be determined by business stakeholders or a project lead. However, it takes more than requirements to build software users will love. Great systems combine detailed analysis, stellar features and performance.

As we start our journey understanding algorithms and data structures, an idea that unites each concept is the theme of Asymptotic Analysis. Often viewed as a complex topic, asymptotics is the process of describing the efficiency of algorithms as their input size grows. The notion of tracking algorithmic performance can reveal much about a solution's effectiveness. Ironically, this area of study was primarily developed before the introduction of modern computing. Today, this provides an advantage when testing new ideas and communicating with other developers. In computer science, asymptotics is expressed in a standard format known as Big O Notation.

## Understanding Time Complexity

### Linear Time - O(n)

Even though we sometimes think of algorithms as complex systems, in essence, they are merely recipes for completing a series of operations. For example, a simple algorithm shared across all programming languages is a loop. In Swift, this can be written using a straightforward technique called fast enumeration. As such, we can write a simple algorithm to find a specific number in a sequence:

```swift
let sequence : Array<Int> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

//linear time - O(n)
func linearSearch(for value: Int, list: Array<Int>) -> Bool {
    //check all possible values
    for number in list {
        if number == value {
            return true
        }
    }
    return false
}

//execute search
let isFound: Bool = linearSearch(for: 8, list: sequence)
```

When evaluating this function we say that it works in linear time - O(n) because the effectiveness of its main action (e.g., search) is directly related to the size of its input (e.g., sequence). As a result, we can conclude that it would take longer for the function to find the value of 10 than 2 or 3. To summarize, the algorithm will have to iterate through the complete set of values when searching for a non-present value like 16. In most cases, linear time operations are referred to as being "brute force" because little effort goes into how they could run more efficiently. However, linear-based activities still provide value when prototyping complex systems in a technical interview or real-world setting.

### Constant Time - O(1)

When evaluating algorithms, it's often ideal to code a solution where the size of the data input has no direct relationship on performance. Consider successful search algorithms like Google, or machine learning solutions used on websites like Netflix and Amazon. These systems run in constant time and are represented with the symbol O(1). A significant difference between a linear and constant operation is logic. In the case of Google, many hardware and software complexities are put into place to ensure things work as quickly as possible. However, not all constant time operations need to be complicated. Consider the following:

```swift
//constant time operations - O(1)
class Stack<T> {
    var store : [T] = []

    func peek() -> T? {
        return store.last
    }

    func push(_ value: T) {
        store.append(value)
    }

    func pop() -> T? {
        return store.isEmpty ? nil : store.removeLast()
    }
}
```

Known as a Stack data structure, this implementation is a favorite among hiring managers when conducting technical interviews. The reason? A Stack combines ideas found in native iOS Development (e.g., UINavigationController) along with specific language syntax (e.g., collections and generics) coupled with knowledge of Big O Notation. As shown, what makes a Stack useful is how it performs. For example, all actions can be executed without having to search through or analyze previously added items.

## Common Time Complexities

Here's a brief overview of other commonly seen time complexities:

1. O(log n) - Logarithmic time: Often seen in divide-and-conquer algorithms like binary search.
2. O(n log n) - Often called "log-linear" time: Common in efficient sorting algorithms like mergesort and quicksort.
3. O(n²) - Quadratic time: Often seen in nested loops, like simple sorting algorithms (bubble sort, insertion sort).
4. O(2^n) - Exponential time: Often seen in recursive algorithms solving complex problems.

## Space Complexity

While time complexity measures how long an algorithm takes to run, space complexity measures how much memory an algorithm uses. Space complexity is also expressed using Big O notation. For example:

- O(1) space: The algorithm uses a constant amount of space regardless of input size.
- O(n) space: The space used grows linearly with the input size.

## Best, Average, and Worst Case Scenarios

When analyzing algorithms, we often consider three scenarios:

1. Best Case: The most favorable input for the algorithm.
2. Average Case: The expected performance for a typical input.
3. Worst Case: The least favorable input for the algorithm.

Big O notation typically represents the worst-case scenario, as it provides an upper bound on the algorithm's performance.

## Big O Simplification Rules

When calculating Big O, we follow these simplification rules:

1. Drop constants: O(2n) becomes O(n)
2. Drop non-dominant terms: O(n² + n) becomes O(n²)
3. Consider the worst-case scenario

## Amortized Analysis

Amortized analysis is a method of analyzing the time complexity of algorithms that occasionally perform expensive operations, but on average perform well. A classic example is the dynamic array (like Swift's Array), where most append operations are O(1), but occasional resizing operations are O(n). The amortized time for appending to a dynamic array is O(1).

## Limitations of Big O Notation

While Big O notation is extremely useful, it has some limitations:

1. It doesn't account for constant factors, which can be significant for small inputs.
2. It describes asymptotic behavior, which may not reflect performance on small inputs.
3. It doesn't account for factors like cache performance or hardware specifics.

## Other Asymptotic Notations

While Big O provides an upper bound, there are other notations:

- Omega (Ω) notation provides a lower bound
- Theta (Θ) notation provides both upper and lower bounds

## Big O and Scalability

Understanding Big O is crucial for building scalable systems. As your data grows:

- O(1) and O(log n) algorithms scale very well
- O(n) algorithms scale linearly
- O(n²) and higher complexity algorithms can become problematic for large inputs

## Common Misconceptions

1. Big O always represents the exact running time: It represents the upper bound of growth rate.
2. Constant time (O(1)) means instantaneous: It means the time doesn't grow with input size.
3. O(n) is always worse than O(log n): For small n, O(n) might be faster due to simpler operations.

## Exercises

1. What is the time complexity of the following code?

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

2. Improve the time complexity of this function:

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

## Conclusion 

Understanding Big O notation is crucial for analyzing and improving algorithm efficiency. As you progress through this book, you'll see how this concept applies to various data structures and algorithms, helping you make informed decisions in your software development journey.