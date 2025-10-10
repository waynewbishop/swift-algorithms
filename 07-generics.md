---
layout: chapter
title: "Chapter 7: Generics"
description: "Build type-safe, reusable code with Swift generics"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>

# Generics

In the previous chapters, you implemented search algorithms that work with any comparable type and sorting algorithms that handle integers, strings, and custom objects equally well. In [Chapter 6](06-recursion.md), you created `ListNode<T>` and `TreeNode<T>` structures that work with any type. We've been using Swift's most powerful feature all along—[generics](https://en.wikipedia.org/wiki/Generic_programming). Now it's time to understand how they work.

Without generics, you'd need separate implementations of every data structure for every type. A linked list for integers. Another for strings. Another for custom objects. Generics solve this problem by allowing you to write one implementation that works with any type while maintaining complete type safety.

## The code duplication problem

In Chapter 6, you saw `ListNode<T>` as a generic structure. But what if Swift didn't have generics? You'd need separate implementations for each type.

Here's a linked list node for integers:

```swift
// Linked list node for integers only
class IntListNode {
    var value: Int
    var next: IntListNode?

    init(value: Int, next: IntListNode? = nil) {
        self.value = value
        self.next = next
    }
}
```

This works for integers. But when we need to create a linked list of strings, you'd have to duplicate the entire class:

```swift
// Duplicate implementation for strings
class StringListNode {
    var value: String
    var next: StringListNode?

    init(value: String, next: StringListNode? = nil) {
        self.value = value
        self.next = next
    }
}
```

The code is nearly identical—only the type differs. This duplication creates maintenance problems. Bug fixes must be applied to every version. Updates to one implementation might be forgotten in others. Every new type requires copying the same logic.

## Generic types solve duplication

Generics eliminate duplication by using type parameters—placeholders for actual types specified when you create an instance. Here's the generic version from Chapter 6:

```swift
// Single generic implementation works with any type
class ListNode<T> {
    var value: T
    var next: ListNode<T>?

    init(value: T, next: ListNode<T>? = nil) {
        self.value = value
        self.next = next
    }
}

// Same implementation, different types
let intNode = ListNode(value: 42)
let stringNode = ListNode(value: "Hello")
```

One implementation maintains type safety across all uses. Swift ensures you can't accidentally mix types—trying to set an integer node's `next` to a string node produces a compile-time error. You maintain type safety while eliminating duplication.

The `<T>` syntax defines a type parameter—a placeholder that gets replaced with an actual type when you create an instance. When we write `ListNode<Int>`, Swift replaces every `T` with `Int`. When we write `ListNode<String>`, it replaces every `T` with `String`.

## We've already used generics

Every search and sorting algorithm from previous chapters uses generics. Let's examine what we've been writing.

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

The `<T: Equatable>` syntax defines a generic type parameter `T` that must conform to [Equatable](https://en.wikipedia.org/wiki/Relational_operator). This allows comparison with `==` while working with any type that supports equality.

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

The `where Element: Comparable` clause constrains the generic `Element` type to types that support comparison operators. This allows using `>` in the sorting logic.

## Type parameter naming

Generic types use angle brackets to define type parameters. While `T` is common, the name is just a convention:

```swift
// All equivalent - T is not a keyword
class ListNode<T> { var value: T }
class ListNode<Element> { var value: Element }
class ListNode<Value> { var value: Value }
```

Swift's standard library uses descriptive names:
- `Array<Element>` - collections use Element
- `Dictionary<Key, Value>` - key-value pairs use descriptive names
- `Optional<Wrapped>` - the wrapped value inside an Optional

**Common naming conventions:**

| Convention | Usage | Example |
|------------|-------|---------|
| `T` | Single generic parameter | `class ListNode<T>` |
| `Element` | Collection types | `Array<Element>` |
| `Key`, `Value` | Dictionary-like types | `Dictionary<Key, Value>` |

For the data structures we'll build in upcoming chapters, use `Element` for collections and `T` for simple generic types.

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

The constraint `T: Equatable` means "T can be any type, as long as it conforms to the Equatable protocol."

### Equatable protocol

[Equatable](https://en.wikipedia.org/wiki/Relational_operator) enables equality comparison with `==` and `!=`. Linear search from Chapter 3 requires Equatable because it must compare elements:

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

[Comparable](https://en.wikipedia.org/wiki/Relational_operator) enables ordering operations using `<`, `>`, `<=`, and `>=`. All sorting algorithms require Comparable:

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

[Hashable](https://en.wikipedia.org/wiki/Hash_function) enables types to be used in Sets and as Dictionary keys. While we haven't built hash tables yet, we can use Swift's built-in Set and Dictionary types:

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

Types conforming to Hashable automatically conform to Equatable. We'll learn how hash tables work in Chapter 14.

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

You can specify multiple constraints using the `&` operator:

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

## Understanding recursive generic types

In Chapter 6, we learned why recursive data structures require classes rather than structs. Let's examine how generics work with recursive types:

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
```

Notice how the generic parameter flows through the entire structure. `ListNode<T>` contains a property of type `ListNode<T>?`. When you create `ListNode<Int>`, Swift generates specialized code where both `value` is `Int` and `next` is `ListNode<Int>?`. The type safety extends through the entire recursive structure.

### Generic tree nodes

The same principle applies to tree structures from Chapter 6:

```swift
// Generic binary tree node from Chapter 6
class TreeNode<T> {
    var value: T?
    var left: TreeNode<T>?
    var right: TreeNode<T>?

    init(value: T?) {
        self.value = value
    }
}

// Recursive traversal works with any type
func printTree<T>(_ node: TreeNode<T>?) {
    guard let node = node, let value = node.value else { return }

    printTree(node.left)
    print(value)
    printTree(node.right)
}
```

The generic parameter `T` appears throughout the structure. Each `TreeNode<T>` has left and right children of the same type—`TreeNode<T>?`. This maintains type consistency through the entire tree.

## Combining protocol constraints

Many algorithms require multiple capabilities. Quicksort from Chapter 5 needs elements that can be compared:

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
            if self[currentIndex] <= self[pivot] {  // Requires Comparable
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

Generics in Swift have zero runtime overhead. The compiler generates specialized code for each concrete type you use—a process called monomorphization. When we write:

```swift
let intNode = ListNode<Int>(value: 42)
let stringNode = ListNode<String>(value: "Hello")
```

The compiler generates two separate, optimized implementations—one for Int, one for String. Your generic code runs as fast as if you had written type-specific versions manually, but you only maintain one implementation.

## Looking ahead

Understanding generics prepares you for the data structures in upcoming chapters. Each uses generics to provide type-safe, reusable implementations:

**Chapter 9: Linked Lists** - Build complete linked list structures using the `ListNode<T>` pattern from Chapter 6

**Chapter 10: Stacks and Queues** - Generic collections with constrained element types

**Chapter 11: Binary Search Trees** - Extend the `TreeNode<T>` structure with search and insertion algorithms

**Chapter 12: Graphs** - Generic vertices and edges working with any type

**Chapter 13: Tries** - Generic prefix trees for efficient string operations

**Chapter 14: Hash Tables** - Generic key-value storage requiring Hashable elements

**Chapter 15: Heaps** - Generic priority queues with comparable elements

Every data structure in this book uses the same generic patterns we've learned here. The search and sorting algorithms from Chapters 3-5 demonstrated generics in action. The recursive structures from Chapter 6 showed how generics work with self-referential types. Now you understand the mechanism—type parameters, protocol constraints, and where clauses working together to enable reusable, type-safe code with zero performance penalty.
