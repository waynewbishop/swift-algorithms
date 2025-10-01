# Swift Algorithms & Data Structures

A comprehensive guide to algorithms and data structures in Swift, designed for iOS developers who want to master computer science fundamentals while building practical, type-safe implementations.

## Overview

Swift, first introduced by Apple in 2014, has become the cornerstone of development across iOS, macOS, watchOS, and tvOS. This book provides complete implementations of essential algorithms and data structures in modern Swift, going beyond pseudocode to show you how these concepts work in production code.

Whether you're preparing for technical interviews, building performance-critical applications, or simply want to deepen your understanding of computer science, this book offers clear explanations, practical examples, and real-world Swift implementations.

## What You'll Learn

- **Algorithm Analysis**: Master Big O notation and learn to evaluate algorithmic efficiency
- **Search & Sort**: Implement linear search, binary search, and sorting algorithms from bubble sort to quicksort
- **Generics**: Build type-safe, reusable code using Swift's powerful generic system
- **Data Structures**: Create linked lists, stacks, queues, trees, graphs, and hash tables from scratch
- **Advanced Topics**: Explore tries, heaps, dynamic programming, and graph algorithms like PageRank

## Table of Contents

1. [Introduction](01-introduction.md)
2. [Big O Notation](02-big-o-notation.md)
3. [Basic Searching](03-basic-searching.md)
4. [Basic Sorting](04-basic-sorting.md)
5. [Advanced Sorting](05-advanced-sorting.md)
6. [Recursion](06-recursion.md)
7. [Generics](07-generics.md)
8. [Linked Lists](08-linked-lists.md)
9. [Stacks and Queues](09-stacks-and-queues.md)
10. [Binary Search Trees](10-binary-search-trees.md)
11. [Graphs](11-graphs.md)
12. [Tries](12-tries.md)
13. [Hash Tables](13-hash-tables.md)
14. [Heaps](14-heaps.md)
15. [Dynamic Programming](15-dynamic-programming.md)
16. [Advanced Complexity Analysis](16-advanced-complexity-analysis.md)
17. [Vector Mathematics](17-vector-mathematics.md)
18. [PageRank Algorithm](18-pagerank-algorithm.md)

## Example: Generic Binary Search

One of the book's strengths is showing how Swift's generics enable type-safe, reusable algorithms. Here's a complete implementation of binary search that works with any `Comparable` type:

```swift
extension Array where Element: Comparable {
    func binarySearch(for target: Element) -> Int? {
        var leftIndex = 0
        var rightIndex = count - 1

        while leftIndex <= rightIndex {
            let middleIndex = (leftIndex + rightIndex) / 2
            let middleValue = self[middleIndex]

            if middleValue == target {
                return middleIndex
            } else if middleValue < target {
                leftIndex = middleIndex + 1
            } else {
                rightIndex = middleIndex - 1
            }
        }

        return nil
    }
}

// Works with any Comparable type
let numbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
numbers.binarySearch(for: 13)  // returns 6

let names = ["Alice", "Bob", "Charlie", "David", "Eve"]
names.binarySearch(for: "Charlie")  // returns 2
```

This example demonstrates several key concepts covered in the book:
- **Generic constraints** (`Element: Comparable`) enable type-safe operations
- **Protocol-oriented design** extends built-in types with new functionality
- **Algorithmic efficiency** - O(log n) vs O(n) for linear search
- **Practical Swift** - code you can use in production applications

## Who This Book Is For

This book is designed for:

- **iOS/Swift developers** looking to strengthen their computer science fundamentals
- **Students** learning algorithms and data structures with a modern language
- **Interview candidates** preparing for technical coding interviews
- **Experienced developers** wanting to see how classic algorithms translate to Swift

You should be comfortable with Swift basics (variables, functions, classes, structs) and familiar with common design patterns. No prior algorithms experience required.

## Related Projects

- [bishop-algorithms-swift-package](https://github.com/waynewbishop/bishop-algorithms-swift-package) - Swift Package with reusable algorithm implementations
- [Swift Algorithms Book](https://github.com/waynewbishop/bishop-algorithms-book) - Complete book with illustrations and examples
- [bishop-app-runbuddy-swift](https://github.com/waynewbishop/bishop-app-runbuddy-swift) - Practical Swift application using AI

## Usage

This code is available for both commercial and open-source projects. As a courtesy, please provide attribution to [waynewbishop.com](http://www.waynewbishop.com). See the LICENSE file for complete details.

## Contributing

Contributions, feedback, and corrections are welcome! Please feel free to:
- Open issues for bugs or unclear explanations
- Submit pull requests for improvements
- Suggest new topics or examples

## Questions?

Have questions or feedback? Feel free to [contact me on LinkedIn](https://www.linkedin.com/in/waynebishop/).

---

© Wayne Bishop | [waynewbishop.com](http://www.waynewbishop.com)
