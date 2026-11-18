---
layout: field-notes
title: "Chapter 9: Linked Lists"
description: "Build a linked list from scratch in Swift with insert, delete, and traversal operations"
---
# Linked Lists

In [Chapter 7](07-generics.md), we encountered **linked list** nodes as self-referential structures that generics make reusable across types. In [Chapter 8](08-performance-analysis.md), we learned that different data structures offer different performance trade-offs. Now it's time to build a complete linked list implementation—a fundamental data structure that trades random access speed for insertion and deletion flexibility.

## Arrays vs linked lists

A linked list provides similar functionality to an [array](https://en.wikipedia.org/wiki/Array_data_structure)—the ability to insert, retrieve, update, and remove elements. However, because elements are managed independently (scattered in memory) rather than contiguously (in a single block), linked lists excel when dealing with frequent modifications to large datasets.

### Memory organization

- Arrays store elements in contiguous memory—a single continuous block. This enables fast random access (base address + index × size = element location) but requires copying the entire array to a larger block when capacity is exceeded.

- Linked lists store elements anywhere in memory, with each element pointing to the next (and optionally previous). No resizing needed—just allocate new nodes as needed. The cost is slower access by index since we must traverse from the beginning.

### Performance comparison

| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access by index | `O(1)` | `O(n)` |
| Insert at beginning | `O(n)` | `O(1)` |
| Insert at end | `O(1)`* | `O(1)`** |
| Remove from beginning | `O(n)` | `O(1)` |
| Search for value | `O(n)` | `O(n)` |

\* Amortized `O(1)` with capacity doubling
\** If maintaining a tail pointer

### When to use each

Linked lists excel in scenarios requiring frequent insertions or deletions at the beginning or middle of the sequence, particularly when the data size is unknown or highly dynamic. They're ideal for sequential-only access patterns and often serve as building blocks for more complex data structures. Linked lists are the right choice when we need flexibility in modifying the sequence structure without the cost of shifting elements.

Arrays prove superior when an application requires frequent random access by index or primarily reads data with few modifications. For small datasets under 100 elements, arrays typically outperform linked lists despite their insertion overhead. Arrays also offer better memory efficiency due to lower per-element overhead and integrate seamlessly with Swift's functional methods like `map`, `filter`, and `reduce`.

## The node structure

Our implementation uses `LLNode` to represent individual nodes in a doubly-linked list. This structure supports both singly-linked lists (using only `next`) and doubly-linked lists (using both `next` and `previous`). The generic type `T` allows storing any type, and optional values enable representing empty nodes and list boundaries.

```swift
// Generic linked list node - doubly-linked with previous and next pointers
public class LLNode<T> {
    var tvalue: T?
    var next: LLNode?
    weak var previous: LLNode?

    // Creates an empty node with no value or links
    public init() {}
}
```

Notice that `previous` is declared `weak`. Swift manages class instances with [Automatic Reference Counting](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/) (ARC), which frees an object once nothing holds a strong reference to it. If both `next` and `previous` were strong, each pair of neighbors would keep the other alive, and the nodes would never be freed even after the list itself was released. With a weak backward link, each node is owned only by the node before it (or by the list's `head`), so releasing the list releases every node.

## Building the LinkedList class

The `LinkedList<T>` class manages a collection of nodes:

```swift
// Generic linked list implementation
public class LinkedList<T> {
    private var head = LLNode<T>()
    private var counter: Int = 0

    // Number of elements in list - O(1)
    var count: Int {
        return counter
    }

    // Check if list is empty - O(1)
    public func isEmpty() -> Bool {
        return counter == 0 || head.tvalue == nil
    }
}
```

The `head` node represents the beginning of the list. The `counter` tracks the number of elements for `O(1)` count operations.

## Appending elements

Adding elements to the end of a linked list requires traversing to the last node:

```swift
// Add element to end of list - O(n)
public func append(_ tvalue: T) {
    // Handle empty list
    guard head.tvalue != nil else {
        head.tvalue = tvalue
        counter += 1
        return
    }

    var current: LLNode = head

    // Traverse to end of list
    while let item = current.next {
        current = item
    }

    // Create and append new node
    let childToUse = LLNode<T>()
    childToUse.tvalue = tvalue
    childToUse.previous = current
    current.next = childToUse

    counter += 1
}
```

This operation is `O(n)` because we must traverse the entire list to find the end. A production implementation might maintain a `tail` pointer to make appending `O(1)`.

## Finding elements

Accessing elements by index requires linear traversal:

```swift
// Find element at specific index - O(n)
public func find(at index: Int) -> LLNode<T>? {
    // Validate index
    if index < 0 || index > (count - 1) || head.tvalue == nil {
        return nil
    }

    var current: LLNode<T> = head
    var x: Int = 0

    // Traverse to index
    while index != x {
        guard let nextNode = current.next else {
            return nil
        }
        current = nextNode
        x += 1
    }

    return current
}

// Subscript support for convenient access
public subscript(index: Int) -> LLNode<T>? {
    get {
        return find(at: index)
    }
}
```

Unlike arrays where `array[5]` is instant, linked lists must walk through nodes 0, 1, 2, 3, 4 to reach index 5. This makes random access inefficient.

## Inserting elements

Insertion at a specific position involves adjusting pointer references. Valid positions run from `0` (the head) through `count` (just past the last element), so inserting at `count` is the same as appending:

```swift
// Insert element at specific index - O(n)
public func insert(_ tvalue: T, at index: Int) {
    // Validate the position before changing anything
    guard index >= 0 && index <= count else {
        print("Index out of bounds")
        return
    }

    // An empty list or a position at the end is an append
    if head.tvalue == nil || index == count {
        append(tvalue)
        return
    }

    // The node currently at this index will follow the new node
    guard let current = find(at: index) else {
        return
    }

    let childToUse = LLNode<T>()
    childToUse.tvalue = tvalue

    // Link the new node in both directions
    childToUse.next = current
    childToUse.previous = current.previous
    current.previous?.next = childToUse
    current.previous = childToUse

    // Update head if inserting at beginning
    if index == 0 {
        head = childToUse
    }

    counter += 1
}
```

Once at the correct position, insertion is `O(1)`—just adjust four pointers. The `O(n)` cost comes from `find(at:)` walking to the position. Because the bounds check runs first, an invalid index leaves both the list and its `counter` untouched.

## Removing elements

Removal requires relinking nodes in both directions to skip the deleted element:

```swift
// Remove element at specific index - O(n)
public func remove(at index: Int) {
    // Validate the position before changing anything
    guard index >= 0 && index < count && head.tvalue != nil else {
        return
    }

    // Handle removing first element
    if index == 0 {
        if let item = head.next {
            item.previous = nil
            head = item
        } else {
            head.tvalue = nil
        }
        counter -= 1
        return
    }

    guard let node = find(at: index) else {
        return
    }

    // Link the neighbors around the removed node in both directions
    node.previous?.next = node.next
    node.next?.previous = node.previous
    node.next = nil
    node.previous = nil

    counter -= 1
}
```

Every pointer that referenced the removed node is redirected. The predecessor's `next` now skips ahead, and the successor's `previous` now points back past the gap. When the head is removed, the new head's `previous` is cleared so it no longer refers to a node outside the list. The `counter` changes only after a node is actually removed, so a request like `remove(at: -1)` leaves the count accurate.

Removing from the beginning is `O(1)`, but removing from elsewhere requires `O(n)` traversal to find the node.

## Traversing the list

Processing all elements uses iteration:

```swift
// Print all values in list - O(n)
public func printValues() {
    var current: LLNode? = head

    while current != nil {
        if let item = current, let tvalue = item.tvalue {
            print("link item is: \(tvalue)")
        }
        current = current?.next
    }
}
```

This pattern—using a `current` pointer that advances through the list—is fundamental to all linked list operations.

## Building algorithmic intuition

Linked lists demonstrate fundamental trade-offs between data structures: arrays provide fast index access but expensive insertions, while linked lists provide fast insertions but require linear traversal. Pointer manipulation—following `next` pointers, updating references, managing node connections—forms the foundation for more complex structures like stacks and queues ([Chapter 10](10-stacks-and-queues.md)), binary search trees ([Chapter 11](11-binary-search-trees.md)), and graphs ([Chapter 13](13-graphs.md)). Understanding when dynamic structure matters more than random access reveals when linked lists provide the optimal solution.
