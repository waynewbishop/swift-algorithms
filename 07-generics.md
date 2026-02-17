---
layout: chapter
title: "Chapter 7: Generics"
description: "Build type-safe, reusable code with Swift generics"
---
# Generics

In the previous chapters, you implemented search algorithms that work with any comparable type and sorting algorithms that handle integers, strings, and custom objects equally well. These implementations use **generics** to create type-safe code that works with any type. Now let's review how they work and how you'll use them to build data structures.

## The code duplication problem

Consider a linked list node structure. Without generics, you'd need separate implementations for each type:

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

This custom type works for integers. But when we need to create a linked list of strings, we'll have to duplicate the entire class:

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

Generics eliminate duplication by using type parameters—placeholders for actual types specified when you create an instance. Consider the following:

```swift
// Single generic implementation works with any type
class ListNode<T> {
    var tvalue: T  // 'tvalue' means 'typed value' (matches production)
    var next: ListNode<T>?

    init(tvalue: T, next: ListNode<T>? = nil) {
        self.tvalue = tvalue
        self.next = next
    }
}

// Same implementation, different types
let intNode = ListNode(tvalue: 42)
let stringNode = ListNode(tvalue: "Hello")
```

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

Notice the `<T: Equatable>` syntax—this constrains `T` to types that support equality comparison. We'll explore what this means shortly.

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

The `where Element: Comparable` clause constrains the generic type to types that support comparison operators like `>` or `<`. These constraints are called protocol constraints.

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
| T | Single generic parameter | class ListNode<T> |
| Element | Collection types | Array<Element> |
| Key, Value | Dictionary-like types | Dictionary<Key, Value> |

For the data structures we'll build in upcoming chapters, use `Element` for collections and `T` for simple generic types.

## Understanding Swift protocols

Before we explore how protocols constrain generic types, we need to understand what a Swift protocol is. A protocol in Swift defines a contract—a set of methods, properties, or other requirements that a type must implement. Think of it as a blueprint that says "any type that conforms to me must provide these capabilities." Unlike classes, protocols don't provide implementation—they specify what must be implemented.

The key insight is that protocols enable polymorphism without inheritance. A type can conform to multiple protocols, gaining capabilities without the constraints of single inheritance. When we write `T: Equatable`, we're saying "T can be any type, as long as it promises to implement equality comparison." The protocol is the contract, and the constraint ensures the type honors that contract.

### Creating a custom protocol

Let's see how to define a simple protocol and use it as a generic constraint:

```swift
// Define a protocol requiring an identifier
protocol Identifiable {
    var id: String { get }
}

// Conform to the protocol
struct User: Identifiable {
    let id: String
    let name: String
}

// Use protocol as a generic constraint
func findById<T: Identifiable>(_ items: [T], id: String) -> T? {
    return items.first { $0.id == id }
}

let users = [User(id: "1", name: "Alice"), User(id: "2", name: "Bob")]
findById(users, id: "2")  // Returns Bob
```

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

[Equatable](https://developer.apple.com/documentation/Swift/Equatable) enables equality comparison with `==` and `!=`. Recall the linear search from [Chapter 3](03-basic-searching.md) we saw earlier—it requires `<T: Equatable>` because the algorithm must compare elements with the `==` operator. Without the Equatable constraint, the compiler can't guarantee that `T` supports equality comparison.

Most Swift built-in types (Int, Double, String, Bool) conform to Equatable automatically.

### Comparable protocol

[Comparable](https://developer.apple.com/documentation/Swift/Comparable) enables ordering operations using `<`, `>`, `<=`, and `>=`. All sorting algorithms require Comparable:

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

## Combining protocol constraints

Many algorithms require multiple capabilities. Quicksort from [Chapter 5](05-advanced-sorting.md) needs elements that can be compared:

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

## Building algorithmic intuition

Generic types enable writing algorithms once and applying them to any appropriate data—one generic queue implementation serves integers, strings, and custom types instead of requiring separate implementations for each. Protocol constraints provide the key to flexible generic code: `Equatable` enables comparison, `Comparable` enables ordering, `Hashable` enables dictionary storage. Understanding these protocols reveals which operations each data structure supports.
