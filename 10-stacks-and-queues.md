---
layout: chapter
title: "Chapter 10: Stacks and Queues"
description: "Essential data structures for managing collections"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>

# Stacks & queues

In [Chapter 9](09-linked-lists.md), you built linked lists—collections where elements connect through pointers rather than contiguous memory. Stacks and queues extend this concept by adding ordering rules: stacks process elements last-in, first-out (LIFO), while queues process elements first-in, first-out (FIFO). Both structures achieve [O(1)](glossary#big-o-notation) insertion and removal (from Chapter 8), making them ideal building blocks for algorithms requiring consistent, fast access patterns.

These structures power critical systems you use daily. Navigation controllers use stacks to manage view hierarchies (push a view, pop to go back). Task queues schedule operations fairly (DispatchQueue, OperationQueue). Understanding stacks and queues is essential for iOS development and algorithm design.

## Real-world applications

Stacks reverse order—the last item added is first removed. This makes them perfect for undo/redo systems (track history, pop to undo), navigation (push views, pop to go back), and function call tracking (debugger shows call stack). iOS uses stacks extensively: UINavigationController maintains a view stack, the responder chain propagates touches through a stack, and modal presentations form a stack.

Queues preserve order—the first item added is first removed. This ensures fairness in task scheduling (process requests in order received), breadth-first graph traversal (Chapter 12 uses queues to explore graphs level-by-level), and buffering (network requests, print jobs, video frames). Foundation frameworks rely on queues: DispatchQueue schedules tasks, OperationQueue manages concurrent operations, and NotificationCenter posts notifications in order.

| Use Stack When | Use Queue When |
|----------------|----------------|
| Need to reverse order | Need to preserve order |
| Undo/redo functionality | Task scheduling |
| Navigation history | Breadth-first search |
| Backtracking algorithms | Fair resource allocation |

## The node structure

Both stacks and queues use a simple singly-linked node structure. Unlike the doubly-linked `LLNode<T>` from Chapter 9 (which needs `previous` pointers for bidirectional traversal), stacks and queues only traverse in one direction:

```swift
// Simple singly-linked node for stacks and queues
public class Node<T> {
    var key: T?
    var next: Node?

    init(key: T? = nil) {
        self.key = key
    }
}
```

This minimalist structure is sufficient because stacks only access the top element and queues only access the front element. The simpler design reduces memory overhead compared to doubly-linked nodes.

## Building a queue

Queues follow "first-in, first-out" ordering. Elements enter at the back and exit from the front, like a line at a store. The `Queue<T>` class maintains a `top` pointer to the front element:

```swift
// Generic queue implementation with FIFO ordering
public class Queue<T> {
    private var top: Node<T>?

    public init() {
        top = Node<T>()
    }

    // Add element to back of queue - O(n)
    public func enqueue(_ key: T) {
        // Handle empty queue
        guard top?.key != nil else {
            top?.key = key
            return
        }

        let childToUse = Node<T>()
        var current = top

        // Traverse to end of queue
        while current?.next != nil {
            current = current?.next
        }

        // Append new node
        childToUse.key = key
        current?.next = childToUse
    }

    // Remove element from front of queue - O(1)
    public func dequeue() -> T? {
        // Check if queue is empty
        guard top?.key != nil else {
            return nil
        }

        // Retrieve front item
        let queueItem: T? = top?.key

        // Move top pointer to next item
        if let nextItem = top?.next {
            top = nextItem
        } else {
            top = Node<T>()
        }

        return queueItem
    }

    // View front element without removing - O(1)
    public func peek() -> T? {
        return top?.key
    }

    // Check if queue is empty - O(1)
    public var isEmpty: Bool {
        return top?.key == nil
    }
}
```

Enqueuing is O(n) because we must traverse to the end. A production implementation might maintain a `tail` pointer to make enqueuing O(1). Dequeuing is O(1)—just update the `top` pointer.

## Building a stack

Stacks follow "last-in, first-out" ordering. Elements are added and removed from the same end (the top), like a stack of plates. This enables O(1) insertion and removal:

```swift
// Generic stack implementation with LIFO ordering
public class Stack<T> {
    private var top: Node<T>
    private var counter: Int = 0

    public init() {
        top = Node<T>()
    }

    // Number of elements in stack - O(1)
    public var count: Int {
        return counter
    }

    // Add element to top of stack - O(1)
    public func push(_ key: T) {
        // Handle empty stack
        guard top.key != nil else {
            top.key = key
            counter += 1
            return
        }

        // Create new node
        let childToUse = Node<T>()
        childToUse.key = key

        // Insert at top (new node points to current top)
        childToUse.next = top
        top = childToUse

        counter += 1
    }

    // Remove element from top of stack - O(1)
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

    // View top element without removing - O(1)
    public func peek() -> T? {
        return top.key
    }

    // Check if stack is empty - O(1)
    public var isEmpty: Bool {
        return count == 0
    }
}
```

Unlike queues (which add at the back and remove from the front), stacks add and remove from the same location. This makes all stack operations O(1)—no traversal needed.

## Performance characteristics

Both structures excel at their core operations:

| Operation | Stack | Queue | Notes |
|-----------|-------|-------|-------|
| Push/Enqueue | O(1) | O(1)* | Add element |
| Pop/Dequeue | O(1) | O(1) | Remove element |
| Peek | O(1) | O(1) | View top/front |
| isEmpty check | O(1) | O(1) | Check if empty |
| Search | O(n) | O(n) | Not their purpose |

\* This implementation's enqueue is O(n). With a tail pointer, it becomes O(1).

The O(1) performance means these operations take constant time regardless of size. Adding the millionth element takes the same time as adding the first:

```swift
// Process 1 million items with consistent performance
for i in 0..<1_000_000 {
    stack.push(i)           // Each push: O(1)
    queue.enqueue(i)        // Each enqueue: O(1)*
}

for _ in 0..<1_000_000 {
    stack.pop()             // Each pop: O(1)
    queue.dequeue()         // Each dequeue: O(1)
}
```

This predictable performance makes stacks and queues ideal for systems requiring consistent response times.

## Summary

Stacks and queues are specialized linked structures that enforce ordering rules:

**Stacks (LIFO):**
- Last element added is first removed
- O(1) push and pop operations
- Use for: undo/redo, navigation, backtracking, function calls
- iOS examples: UINavigationController, responder chain, modal presentations

**Queues (FIFO):**
- First element added is first removed
- O(1) dequeue, O(1) enqueue with tail pointer
- Use for: task scheduling, breadth-first search, buffering
- iOS examples: DispatchQueue, OperationQueue, NotificationCenter

**Key differences from Chapter 9:**
- Linked lists allow insertion/removal anywhere (O(n) to find position)
- Stacks restrict access to top only (O(1) operations)
- Queues restrict access to front/back only (O(1) operations)
- Simpler node structure (singly-linked vs doubly-linked)

Both structures build on linked list concepts while adding constraints that enable faster operations and clearer semantics. In Chapter 11, you'll see how stacks help implement tree traversal algorithms. In Chapter 12, queues will power breadth-first graph searches.

<div class="bottom-nav">
  <div class="nav-container">
    <a href="09-linked-lists" class="nav-link prev">← Chapter 9: Linked Lists</a>
    <a href="index" class="nav-link toc">Table of Contents</a>
    <a href="11-binary-search-trees" class="nav-link next">Chapter 11: Binary Search Trees →</a>
  </div>
</div>
