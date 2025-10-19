# Stacks & Queues

Stacks and queues are structures that help organize data in a particular order. Their concept is based on the idea that information can be organized similar to how things interact in the real world. For example, a stack of dinner plates can be represented by placing a single plate on a group of existing plates. Similarly, a queue can be easily understood by observing groups of people waiting in a line at a concert or grand opening.

These structures can be implemented in various ways. Any app that makes use of a shopping cart, waiting list or playlist makes use of a stack or queue. In software development, a call stack is often used as an essential debugging / analytics tool. For this essay, we'll discuss and implement a stack and queue data structures in Swift.

> **CALL STACK**: Managed by the code compiler, the call stack tracks functions executed by a program.

```swift
// Generic node structure
class Node<T> {
    var key: T?
    var next: Node?
}
```

## How Queues Work

As new Queue elements are created they are added to the back of its structure. Items are preserved in order until requested. When a new element is requested, the top level item is removed and is sent to the receiver:

```
Item 4
Item 3
Item 2
Item 1
```

Similar to a linked list, we'll create a Node class to manage generic stack and queue items.

## Enqueuing Objects

The process of adding items is often referred to as "enqueuing". Here, we define the method used to enqueue objects and identify the property top that will serve as our starting point:

```swift
class Queue<T> {
    private var top: Node<T>?

    init() {
        top = Node<T>()
    }

    // Enqueue the specified object
    func enQueue(_ key: T) {
        // Trivial case
        guard top?.key != nil else {
            top?.key = key
            return
        }

        let childToUse = Node<T>()
        var current = top

        // Cycle through the list
        while current?.next != nil {
            current = current?.next
        }

        // Append new item
        childToUse.key = key
        current?.next = childToUse
    }
} // end class
```

The process to enqueue items is similar to building a generic linked list. However, since queued items can be removed as well as added, we must ensure that our structure supports the absence of values (e.g. nil). As a result, the class property top is defined as an optional.

To keep the queue generic, the enQueue method signature also has a parameter that is declared as type T. With Swift, generics usage not only preserves type information, but also ensures objects conform to various protocols.

## Dequeuing Objects

Removing items from the queue is called dequeuing. As shown, dequeuing is a two-step process that involves returning the top-level item and reorganizing the queue:

```swift
// Retrieve items - O(1) constant time
func deQueue() -> T? {
    // Trivial case
    guard top.key != nil else {
        return nil
    }

    // Queue the next item
    let queueitem: T? = top.key!

    // Use optional binding
    if let nextitem = top.next {
        top = nextitem
    }
    else {
        top = nil
    }

    return queueitem
}
```

## Supporting Functions

Along with adding and removing items, supporting functions also include checking for an empty queue as well as retrieving the top level item.

```swift
// Retrieve the top most item
func peek() -> T? {
    return top?.key
}

// Check for the presence of a value
func isEmpty() -> Bool {
    guard top?.key != nil else {
        return true
    }
    return false
}
```

## How Stacks Work

To contrast, a Stack positions new elements on top and retrieve items on a "first-out" basis. This distinction allows it to perform basic operations such as insertion and retrieval in constant time - O(1). As an iOS Developer, the concept of stacking two or more views to create a view hierarchy is common. As we'll see with Binary Search Trees, Stacks also come in handy when supporting other algorithms.

```swift
class Stack<T> {
    private var top: Node<T>
    private var counter: Int = 0

    init() {
        top = Node<T>()
    }

    // The number of items - O(1)
    var count: Int {
        return counter
    }

    // Add item to the stack - O(1)
    func push(withKey key: T) {
        // Return trivial case
        guard top.key != nil else {
            top.key = key
            counter += 1
            return
        }

        // Create new item
        let childToUse = Node<T>()
        childToUse.key = key

        // Set new created item at top
        childToUse.next = top
        top = childToUse

        // Set counter
        counter += 1
    }

    // Remove item from the stack - O(1)
    func pop() {
        if self.count > 1 {
            top = top.next!

            // Set counter
            counter -= 1
        }
        else {
            top.key = nil
            counter = 0
        }
    }

    // Retrieve the top most item - O(1)
    func peek() -> Node<T> {
        return top
    }

    // Check for value - O(1)
    func isEmpty() -> Bool {
        if self.count == 0 {
            return true
        }
        else {
            return false
        }
    }
}
```
