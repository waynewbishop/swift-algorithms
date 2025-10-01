# Stacks & queues

Stacks and queues are structures that help organize data in a particular order. Their concept is based on the idea that information can be organized similarly to how things interact in the real world. For example, a stack of dinner plates can be represented by placing a single plate on a group of existing plates. Similarly, a queue can be easily understood by observing groups of people waiting in a line at a concert or grand opening.

These structures can be implemented in various ways. Any app that makes use of a shopping cart, waiting list or playlist makes use of a stack or queue. In software development, a call stack is often used as an essential debugging / analytics tool. For this essay, we'll discuss and implement a stack and queue data structures in Swift.

## How queues work

Queues are based on the concept of "first-in, first-out". As new elements are created, they are added to the back of the queue. Items are preserved in order until requested. When a new element is requested, the top level item is removed and is sent to the receiver.

Similar to a linked list, we'll create a generic Node class to manage stack and queue items:

```swift
//generic node structure
public class Node<T> {
    var key: T?
    var next: Node?

    init(key: T? = nil) {
        self.key = key
    }
}
```

## Enqueuing objects

The process of adding items is often referred to as "enqueuing". Here, we define the method used to enqueue objects and identify the property top that will serve as our starting point:

```swift
public class Queue<T> {
    private var top: Node<T>?

    public init() {
        top = Node<T>()
    }

    //enqueue the specified object
    public func enqueue(_ key: T) {
        //trivial case
        guard top?.key != nil else {
            top?.key = key
            return
        }

        let childToUse = Node<T>()
        var current = top

        //cycle through the list
        while current?.next != nil {
            current = current?.next
        }

        //append new item
        childToUse.key = key
        current?.next = childToUse
    }
}
```

The process to enqueue items is similar to building a generic linked list. However, since queued items can be removed as well as added, we must ensure that our structure supports the absence of values (e.g. nil). As a result, the class property top is defined as an optional.

To keep the queue generic, the enQueue method signature also has a parameter that is declared as type T. With Swift, generics usage not only preserves type information, but also ensures objects conform to various protocols.

## Dequeuing objects

Removing items from the queue is called dequeuing. As shown, dequeuing is a two-step process that involves returning the top-level item and reorganizing the queue.

```swift
//retrieve items - O(1) constant time
public func dequeue() -> T? {
    //determine key instance
    guard top?.key != nil else {
        return nil
    }

    //retrieve and queue the next item
    let queueItem: T? = top?.key

    //use optional binding
    if let nextItem = top?.next {
        top = nextItem
    } else {
        top = Node<T>()
    }

    return queueItem
}
```

When dequeuing, it is vital to know when values are absent. With deQueue, we account for the potential absence of a key in addition to an empty queue. In Swift, one must use specific techniques like optional chaining to check for nil values.

## Supporting functions

Along with adding and removing items, supporting functions also include checking for an empty queue as well as retrieving the top level item.

```swift
//retrieve the top most item
public func peek() -> T? {
    return top?.key
}

//check for the presence of a value
public var isEmpty: Bool {
    return top?.key == nil
}
```

## How stacks work

To contrast, Stack structures process elements on a "last-in, first-out" (e.g. LIFO) technique. This distinction allows it to perform basic operations such as element insertion and retrieval in constant time - O(1). As an iOS Developer, the concept of stacking two or more views to create a view hierarchy is common. As we'll see in Chapter 10 (Binary Search Trees), Stacks also come in handy when supporting other data structures and algorithms.

```swift
public class Stack<T> {
    private var top: Node<T>
    private var counter: Int = 0

    public init() {
        top = Node<T>()
    }

    //the number of items - O(1)
    public var count: Int {
        return counter
    }

    //add item to the stack - O(1)
    public func push(_ key: T) {
        //return trivial case
        guard top.key != nil else {
            top.key = key
            counter += 1
            return
        }

        //create new item
        let childToUse = Node<T>()
        childToUse.key = key

        //set new created item at top
        childToUse.next = top
        top = childToUse

        //set counter
        counter += 1
    }

    //remove item from the stack - O(1)
    @discardableResult
    public func pop() -> T? {
        guard let key = top.key else { return nil }

        if counter > 1 {
            top = top.next!
            counter -= 1
        } else {
            top.key = nil
            counter = 0
        }

        return key
    }

    //retrieve the top most item - O(1)
    public func peek() -> T? {
        return top.key
    }

    //check for value - O(1)
    public var isEmpty: Bool {
        return count == 0
    }
}
```

