---
layout: chapter
title: "Chapter 9: Linked Lists"
description: "Implement singly and doubly linked lists"
---
# Linked Lists

Imagine a playlist in Apple Music. Songs aren't stored in one continuous block—they're scattered across your device with each song pointing to the next. Adding a song mid-playlist doesn't require shifting thousands of items. This is a linked list in action.

In [Chapter 6](06-recursion.md), you encountered linked list nodes as self-referential structures perfect for recursive algorithms. In [Chapter 8](08-performance-analysis.md), we learned that different data structures offer different performance trade-offs. Now it's time to build a complete [linked list](https://en.wikipedia.org/wiki/Linked_list) implementation—a fundamental data structure that trades random access speed for insertion and deletion flexibility.

A linked list provides similar functionality to an [array](https://en.wikipedia.org/wiki/Array_data_structure)—the ability to insert, retrieve, update, and remove elements. However, because elements are managed independently (scattered in memory) rather than contiguously (in a single block), linked lists excel when dealing with frequent modifications to large datasets.

## Arrays vs linked lists

Before implementing linked lists, understand when to choose them over Swift's built-in Array.

### Memory organization

**Arrays** store elements in contiguous memory—a single continuous block. This enables fast random access (base address + index × size = element location) but requires copying the entire array to a larger block when capacity is exceeded.

**Linked lists** store elements anywhere in memory, with each element pointing to the next (and optionally previous). No resizing needed—just allocate new nodes as needed. The cost is slower access by index since you must traverse from the beginning.

### Performance comparison

| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access by index | O(1) | O(n) |
| Insert at beginning | O(n) | O(1) |
| Insert at end | O(1)* | O(1)** |
| Remove from beginning | O(n) | O(1) |
| Search for value | O(n) | O(n) |

\* Amortized O(1) with capacity doubling
\** If maintaining a tail pointer

### When to use each

**Use linked lists when:**
- Frequent insertions/deletions at beginning or middle
- Unknown or highly dynamic size
- Sequential-only access patterns
- Building other data structures ([Stack](https://en.wikipedia.org/wiki/Stack_(abstract_data_type)), [Queue](https://en.wikipedia.org/wiki/Queue_(abstract_data_type)), [Hash Table](https://en.wikipedia.org/wiki/Hash_table) with chaining)

**Use arrays when:**
- Frequent random access by index
- Mostly reading data, few modifications
- Small datasets (< 100 elements)
- Memory efficiency critical (arrays have lower overhead)
- Working with Swift's functional methods (map, filter, reduce)

**Real-world examples:**
- Linked lists: UIKit responder chain, browser navigation history, undo/redo systems, music playlists (add/remove songs), workout interval training (modify exercises mid-workout)
- Arrays: UITableView data sources, configuration settings, most app data models, weekly workout summaries, step count history

## The node structure

The production implementation uses `LLNode<T>` to represent individual nodes in a doubly-linked list:

```swift
// Generic linked list node - doubly-linked with previous and next pointers
public class LLNode<T> {
    var tvalue: T?
    var next: LLNode?
    var previous: LLNode?

    public init() {}
}
```

This structure supports both singly-linked lists (using only `next`) and doubly-linked lists (using both `next` and `previous`). The generic type `T` allows storing any type, and optional values enable representing empty nodes and list boundaries.

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

The `head` node represents the beginning of the list. The `counter` tracks the number of elements for O(1) count operations.

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

This operation is O(n) because we must traverse the entire list to find the end. A production implementation might maintain a `tail` pointer to make appending O(1).

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

Insertion at a specific position involves adjusting pointer references:

```swift
// Insert element at specific index - O(n)
public func insert(_ tvalue: T, at index: Int) {
    // Validate and handle empty list
    guard index >= 0 && index <= count - 1 else {
        print("Index out of bounds")
        return
    }

    guard head.tvalue != nil else {
        head.tvalue = tvalue
        counter += 1
        return
    }

    var current: LLNode<T>? = head
    var trailer: LLNode<T>?
    var listIndex: Int = 0

    // Find insertion point
    while current != nil {
        if index == listIndex {
            let childToUse = LLNode<T>()
            childToUse.tvalue = tvalue

            // Link new node into chain
            childToUse.next = current
            childToUse.previous = trailer

            if let linktrailer = trailer {
                linktrailer.next = childToUse
            }

            if let linkCurrent = current {
                linkCurrent.previous = childToUse
            }

            // Update head if inserting at beginning
            if index == 0 {
                head = childToUse
            }

            break
        }

        trailer = current
        current = current?.next
        listIndex += 1
    }

    counter += 1
}
```

Once at the correct position, insertion is O(1)—just adjust a few pointers. The O(n) cost comes from finding the position.

## Removing elements

Removal requires relinking nodes to skip the deleted element:

```swift
// Remove element at specific index - O(n)
public func remove(at index: Int) {
    guard head.tvalue != nil else { return }

    // Handle removing first element
    if index == 0 {
        if let item = head.next {
            head = item
            counter -= 1
        } else {
            head.tvalue = nil
            counter = 0
        }
        return
    }

    var current: LLNode<T>? = head
    var trailer: LLNode<T>?
    var nodeindex: Int = 0

    // Find node to remove
    while let item = current {
        if nodeindex == index {
            // Bypass removed node in chain
            if let tnode = trailer, let cnode = current {
                tnode.next = cnode.next
            }
            current = nil
            break
        }

        trailer = current
        current = item.next
        nodeindex += 1
    }

    counter -= 1
}
```

Removing from the beginning is O(1), but removing from elsewhere requires O(n) traversal to find the node.

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
