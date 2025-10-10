---
layout: chapter
title: "Chapter 7: Generics"
description: "Build type-safe, reusable code with Swift generics"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>

# Generics

In the previous chapters, you implemented search algorithms that work with any comparable type and sorting algorithms that handle integers, strings, and custom objects equally well. You've been using Swift's most powerful feature all along—generics. Now it's time to understand how they work and why they enable the data structures you'll build throughout this book.

Without [generics](glossary#generic), you'd need separate implementations of every data structure for every type. A linked list for integers. Another for strings. Another for custom objects. Generics solve this problem by allowing you to write one implementation that works with any type while maintaining complete type safety.

## The code duplication problem

Consider building a queue system for your application. You might start with a queue for processing user names:

```swift
// Queue implementation for strings only
class StringQueue {
    private var items: [String] = []

    func enqueue(_ item: String) {
        items.append(item)
    }

    func dequeue() -> String? {
        return items.isEmpty ? nil : items.removeFirst()
    }
}
```

This works perfectly for strings. But when you need to queue integers for task processing, you face a choice: copy the entire class and change the type, or find a better solution.

```swift
// Duplicate implementation for integers
class IntQueue {
    private var items: [Int] = []

    func enqueue(_ item: Int) {
        items.append(item)
    }

    func dequeue() -> Int? {
        return items.isEmpty ? nil : items.removeFirst()
    }
}
```

The code is nearly identical—only the type differs. This duplication creates maintenance problems. Bug fixes must be applied to every version. Updates to one implementation might be forgotten in others. Every new type requires copying hundreds of lines of code.

## Generic types solve duplication

Generics eliminate duplication by using type parameters—placeholders for actual types specified when you create an instance:

```swift
// Single generic queue implementation works with any type
class Queue<Element> {
    private var items: [Element] = []

    func enqueue(_ item: Element) {
        items.append(item)
    }

    func dequeue() -> Element? {
        return items.isEmpty ? nil : items.removeFirst()
    }
}

// Same implementation, different types
let stringQueue = Queue<String>()
stringQueue.enqueue("Alice")

let intQueue = Queue<Int>()
intQueue.enqueue(42)
```

One implementation maintains type safety across all uses. Swift ensures you can't accidentally mix types—trying to enqueue an integer into a string queue produces a compile-time error. You maintain type safety while eliminating duplication.

## You've already used generics

Every search and sorting algorithm from previous chapters uses generics. Let's examine what you've been writing:

### Generic search from Chapter 3

```swift
// Linear search works with any Equatable type
func linearSearch<T: Equatable>(for target: T, in array: [T]) -> Int? {
    for (index, element) in array.enumerated() {
        if element == target {
            return index
        }
    }
    return nil
}

// Works with integers, strings, or any Equatable type
linearSearch(for: 42, in: [1, 2, 3, 42, 5])
linearSearch(for: "Bob", in: ["Alice", "Bob", "Charlie"])
```

The `<T: Equatable>` syntax defines a generic type parameter `T` that must conform to [Equatable](glossary#equatable). This allows comparison with `==` while working with any type that supports equality.

### Generic sorting from Chapter 4

```swift
// Bubble sort works with any Comparable type
extension Array where Element: Comparable {
    func bubbleSort() -> [Element] {
        guard count > 1 else { return self }

        var output = self
        for primaryIndex in 0..<count {
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

// Works with any Comparable type
[5, 2, 8, 1].bubbleSort()  // [1, 2, 5, 8]
["dog", "cat", "bird"].bubbleSort()  // ["bird", "cat", "dog"]
```

The `where Element: Comparable` clause constrains the generic `Element` type to types that support comparison operators. This allows using `>` and `<` in the sorting logic.

## Type parameter naming

Generic types use angle brackets to define type parameters. While `T` is common, the name is just a convention:

```swift
// All equivalent - T is not a keyword
struct Container<T> { var item: T }
struct Container<Element> { var item: Element }
struct Container<Value> { var item: Value }
```

Swift's standard library uses descriptive names:
- `Array<Element>` - collections use Element
- `Dictionary<Key, Value>` - key-value pairs use descriptive names
- `Optional<Wrapped>` - the wrapped value inside an Optional

For this book's data structures:
- Use `Element` for collections (linked lists, stacks, queues)
- Use `T` for simple generic types
- Use descriptive names when clarity matters (Key, Value)

## Protocol constraints

Type parameters often need constraints to ensure they support required operations. Without constraints, this fails to compile:

```swift
// Error: not all types support ==
func areEqual<T>(_ first: T, _ second: T) -> Bool {
    return first == second  // Compiler error!
}
```

The compiler can't guarantee every type `T` supports equality comparison. Protocol constraints solve this:

```swift
// Works: T must conform to Equatable
func areEqual<T: Equatable>(_ first: T, _ second: T) -> Bool {
    return first == second
}
```

### Equatable protocol

[Equatable](glossary#equatable) enables equality comparison with `==` and `!=`. Linear search from Chapter 3 requires Equatable because it must compare elements:

```swift
// Requires Equatable for == comparison
func linearSearch<T: Equatable>(for target: T, in array: [T]) -> Int? {
    for (index, element) in array.enumerated() {
        if element == target {  // Requires Equatable
            return index
        }
    }
    return nil
}
```

Most Swift built-in types (Int, Double, String, Bool) conform to Equatable automatically.

### Comparable protocol

[Comparable](glossary#comparable) enables ordering operations using `<`, `>`, `<=`, and `>=`. All sorting algorithms require Comparable:

```swift
// Binary search requires Comparable for < and > comparisons
extension Array where Element: Comparable {
    func binarySearch(for target: Element) -> Int? {
        var leftIndex = 0
        var rightIndex = count - 1

        while leftIndex <= rightIndex {
            let middleIndex = (leftIndex + rightIndex) / 2
            let middleValue = self[middleIndex]

            if middleValue == target {
                return middleIndex
            } else if middleValue < target {  // Requires Comparable
                leftIndex = middleIndex + 1
            } else {
                rightIndex = middleIndex - 1
            }
        }
        return nil
    }
}
```

Types conforming to Comparable automatically conform to Equatable, since ordering implies equality comparison.

### Hashable protocol

[Hashable](glossary#hashable) enables types to be used in Sets and as Dictionary keys. You'll use this extensively in Chapter 14 (Hash Tables) and Chapter 12 (Graphs):

```swift
// Generic function requiring Hashable for Set usage
func removeDuplicates<T: Hashable>(_ array: [T]) -> [T] {
    var seen = Set<T>()  // Requires Hashable
    var result: [T] = []

    for element in array {
        if !seen.contains(element) {
            seen.insert(element)
            result.append(element)
        }
    }
    return result
}

removeDuplicates([1, 2, 2, 3, 1, 4])  // [1, 2, 3, 4]
```

Types conforming to Hashable automatically conform to Equatable.

## Where clauses for conditional functionality

Where clauses allow adding functionality to generic types only when their elements meet specific requirements. This is how you extend Array to work differently based on element type:

```swift
// Extension only available when Element is Comparable
extension Array where Element: Comparable {
    func isSorted() -> Bool {
        guard count > 1 else { return true }

        for i in 0..<(count - 1) {
            if self[i] > self[i + 1] {
                return false
            }
        }
        return true
    }
}

// Available only for Comparable arrays
[1, 2, 3, 4].isSorted()  // true
[1, 3, 2, 4].isSorted()  // false
```

You can specify multiple constraints:

```swift
// Extension requiring both Comparable and Hashable
extension Array where Element: Comparable & Hashable {
    func sortedUnique() -> [Element] {
        let unique = Set(self)  // Requires Hashable
        return unique.sorted()  // Requires Comparable
    }
}

[3, 1, 2, 1, 3, 2].sortedUnique()  // [1, 2, 3]
```

## Building generic data structures

Generic types become essential when building recursive data structures. In Chapter 6, you saw why linked lists and trees require classes rather than structs:

```swift
// Generic linked list node from Chapter 6
class ListNode<T> {
    var value: T
    var next: ListNode<T>?

    init(value: T, next: ListNode<T>? = nil) {
        self.value = value
        self.next = next
    }
}

// Works with any type
let intList = ListNode(value: 1, next: ListNode(value: 2))
let stringList = ListNode(value: "first", next: ListNode(value: "second"))
```

The `<T>` parameter makes this node work with any type. When you create `ListNode<Int>`, Swift generates specialized code for integers. When you create `ListNode<String>`, it generates specialized code for strings—all from one generic definition.

### Generic tree nodes

```swift
// Generic binary tree node from Chapter 6
class TreeNode<T> {
    var value: T
    var left: TreeNode<T>?
    var right: TreeNode<T>?

    init(value: T) {
        self.value = value
    }
}

// Recursive traversal works with any type
func printTree<T>(_ node: TreeNode<T>?) {
    guard let node = node else { return }

    printTree(node.left)
    print(node.value)
    printTree(node.right)
}
```

Notice how the generic parameter flows through the entire structure. `TreeNode<T>` contains properties of type `TreeNode<T>?`, creating a type-safe recursive structure.

## Combining protocol constraints

Many algorithms require multiple capabilities. Quicksort from Chapter 5 needs elements that can be compared and swapped:

```swift
// Quicksort requires Comparable for comparisons
extension Array where Element: Comparable {
    mutating func quickSort() -> [Element] {
        func qSort(start startIndex: Int, _ pivot: Int) {
            if startIndex < pivot {
                let iPivot = qPartition(start: startIndex, pivot)
                qSort(start: startIndex, iPivot - 1)
                qSort(start: iPivot + 1, pivot)
            }
        }

        qSort(start: 0, self.endIndex - 1)
        return self
    }

    mutating func qPartition(start startIndex: Int, _ pivot: Int) -> Int {
        var wallIndex = startIndex

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

The `Comparable` constraint enables `<=` comparison in the partitioning logic. This single generic implementation works with integers, strings, doubles, or any comparable type.

## Generic performance

Generics in Swift have zero runtime overhead. The compiler generates specialized code for each concrete type you use—a process called monomorphization. When you write:

```swift
let intQueue = Queue<Int>()
let stringQueue = Queue<String>()
```

The compiler generates two separate, optimized implementations—one for Int, one for String. Your generic code runs as fast as if you had written type-specific versions manually, but you only maintain one implementation.

## Looking ahead

Understanding generics prepares you for the data structures in upcoming chapters. Each uses generics to provide type-safe, reusable implementations:

**Chapter 9: Linked Lists** - Generic nodes linking to nodes of the same type
**Chapter 10: Stacks and Queues** - Generic collections you explored in this chapter
**Chapter 11: Binary Search Trees** - Generic tree nodes with comparable elements
**Chapter 12: Graphs** - Generic vertices and edges working with any type
**Chapter 13: Tries** - Generic prefix trees for efficient string operations
**Chapter 14: Hash Tables** - Generic key-value storage requiring Hashable
**Chapter 15: Heaps** - Generic priority queues with comparable elements

Every data structure in this book uses the same generic patterns you've learned here. The search and sorting algorithms from Chapters 3-5 demonstrated generics in action. Now you understand the mechanism behind that flexibility—type parameters, protocol constraints, and where clauses working together to enable reusable, type-safe code.

When you implement a linked list in Chapter 9, you'll write `LinkedList<Element>` once and use it with any type. When you build a binary search tree in Chapter 11, `TreeNode<T: Comparable>` will work with integers, strings, or custom types. This is the power of generics—write once, use everywhere, with complete type safety and zero performance penalty.
