---
layout: chapter
title: "Chapter 9: Stacks and Queues"
description: "Essential data structures for managing collections"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Stacks & queues

Stacks and queues are structures that help organize data in a particular order. Their concept is based on the idea that information can be organized similarly to how things interact in the real world. For example, a stack of dinner plates can be represented by placing a single plate on a group of existing plates. Similarly, a queue can be easily understood by observing groups of people waiting in a line at a concert or grand opening.

These structures can be implemented in various ways. Any app that makes use of a shopping cart, waiting list or playlist makes use of a stack or queue. In software development, a call stack is often used as an essential debugging / analytics tool. For this essay, we'll discuss and implement a stack and queue data structures in Swift.

## Real-world applications: When to use stacks vs queues

Before diving into implementation, let's understand where you'll encounter these structures in real applications.

### Stack applications (LIFO - Last In, First Out)

**1. Undo/Redo functionality**
```swift
class TextEditor {
    private var undoStack = Stack<String>()
    private var redoStack = Stack<String>()

    func type(_ text: String) {
        undoStack.push(currentText)  // Save current state
        currentText += text
        redoStack = Stack<String>()  // Clear redo history
    }

    func undo() {
        guard let previousText = undoStack.pop() else { return }
        redoStack.push(currentText)  // Save for redo
        currentText = previousText
    }

    func redo() {
        guard let nextText = redoStack.pop() else { return }
        undoStack.push(currentText)
        currentText = nextText
    }
}
```

**2. iOS Navigation (UINavigationController)**
```swift
// UINavigationController internally uses a stack
navigationController.pushViewController(detailVC, animated: true)  // Push
navigationController.popViewController(animated: true)              // Pop

// View hierarchy: [RootVC] → [ListVC] → [DetailVC]
// Back button pops the stack
```

**3. Function call stack (debugging)**

[diagram: Thread call stack showing execution order]

**4. Browser history**
```swift
class BrowserHistory {
    private var backStack = Stack<URL>()
    private var forwardStack = Stack<URL>()

    func navigate(to url: URL) {
        backStack.push(currentURL)
        currentURL = url
        forwardStack = Stack<URL>()  // Clear forward history
    }

    func back() {
        guard let previousURL = backStack.pop() else { return }
        forwardStack.push(currentURL)
        currentURL = previousURL
    }
}
```

**5. Expression evaluation (parsing)**
```swift
// Evaluating: 3 + 4 * 2
// Stack handles operator precedence
func evaluate(_ expression: String) -> Int {
    let operands = Stack<Int>()
    let operators = Stack<Character>()
    // Process tokens, maintaining precedence via stack
}
```

### Queue applications (FIFO - First In, First Out)

**1. Task scheduling (OperationQueue, DispatchQueue)**
```swift
class TaskScheduler {
    private var tasks = Queue<Task>()

    func schedule(_ task: Task) {
        tasks.enqueue(task)  // Add to back
    }

    func executeNext() {
        guard let task = tasks.dequeue() else { return }  // Remove from front
        task.execute()
    }
}

// Real iOS example
DispatchQueue.main.async {
    // Tasks execute in order they're added
    updateUI()
}
```

**2. Print job spooling**
```swift
class PrintQueue {
    private var jobs = Queue<PrintJob>()

    func submitJob(_ job: PrintJob) {
        jobs.enqueue(job)
        print("Job queued. Position: \(jobs.count)")
    }

    func processNext() {
        guard let job = jobs.dequeue() else { return }
        print("Printing: \(job.document)")
    }
}
```

**3. Breadth-First Search (BFS) in graphs**
```swift
// From Chapter 11
func traverse(_ startingVertex: Vertex<T>) {
    let queue = Queue<Vertex<T>>()
    queue.enqueue(startingVertex)

    while !queue.isEmpty {
        let vertex = queue.dequeue()!
        // Process neighbors in order discovered
        for neighbor in vertex.neighbors {
            queue.enqueue(neighbor)
        }
    }
}
```

**4. Network request buffering**
```swift
class APIClient {
    private var requestQueue = Queue<URLRequest>()

    func fetch(_ request: URLRequest) {
        requestQueue.enqueue(request)
        processQueueIfNeeded()
    }

    private func processQueueIfNeeded() {
        guard !isProcessing, let request = requestQueue.dequeue() else { return }
        // Process oldest request first
        executeRequest(request)
    }
}
```

**5. Streaming data buffers**
```swift
class VideoStreamBuffer {
    private var frames = Queue<VideoFrame>()

    func receiveFrame(_ frame: VideoFrame) {
        frames.enqueue(frame)  // Buffer incoming frames
    }

    func nextFrameForPlayback() -> VideoFrame? {
        return frames.dequeue()  // Play frames in order received
    }
}
```

### Choosing between stack and queue

| Use Stack When | Use Queue When |
|----------------|----------------|
| Need to reverse order | Need to preserve order |
| Undo/redo functionality | Task scheduling |
| Navigation history | Print spooling |
| Parsing expressions | BFS traversal |
| Function call tracking | Request buffering |
| Matching parentheses | Fair resource allocation |

### iOS-specific examples

**UIKit uses stacks:**
- `UINavigationController` view stack
- Responder chain (touches propagate through stack)
- Modal presentation stack

**Foundation uses queues:**
- `OperationQueue` for concurrent tasks
- `DispatchQueue` for GCD
- `NotificationCenter` post order

**CoreData uses both:**
- Undo manager (stack)
- Save operation queuing (queue)

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

## Performance characteristics

Both stacks and queues offer excellent performance for their core operations:

| Operation | Stack | Queue | Notes |
|-----------|-------|-------|-------|
| Push/Enqueue | O(1) | O(1) | Add element |
| Pop/Dequeue | O(1) | O(1) | Remove element |
| Peek | O(1) | O(1) | View top/front |
| isEmpty check | O(1) | O(1) | Check if empty |
| Search | O(n) | O(n) | Not their purpose |

**Why O(1) is important:**

```swift
// Stack: Add 1 million items
for i in 0..<1_000_000 {
    stack.push(i)  // Each push is O(1) - consistently fast
}

// Queue: Process 1 million tasks
for i in 0..<1_000_000 {
    queue.enqueue(Task(i))  // Each enqueue is O(1)
    if shouldProcess {
        queue.dequeue()  // Also O(1)
    }
}
```

No matter how many items are in the structure, adding or removing takes the same amount of time.

## Summary

Stacks and queues are simple yet powerful data structures that maintain ordering through different strategies:

**Stacks (LIFO):**
- Last item added is first removed
- Perfect for reversing order or backtracking
- Real uses: undo/redo, navigation, function calls, expression parsing
- iOS examples: UINavigationController, responder chain

**Queues (FIFO):**
- First item added is first removed
- Perfect for preserving order and fair scheduling
- Real uses: task scheduling, BFS traversal, request buffering
- iOS examples: DispatchQueue, OperationQueue, NotificationCenter

**Key benefits:**
- All core operations are O(1)
- Simple to implement (built on linked lists)
- Fundamental building blocks for other algorithms
- Direct mapping to real-world concepts

**When to use:**
- Stack: When order reversal matters (navigation, undo, backtracking)
- Queue: When fairness and order preservation matter (scheduling, buffering)
- Array: When you need random access or bidirectional iteration

Understanding stacks and queues is essential for iOS development, as they power many of the frameworks you use daily. In Chapter 11, you'll see queues in action for graph traversal algorithms like Breadth-First Search.


---

<div class="chapter-nav">
  <a href="08-linked-lists" class="prev">Previous Chapter</a>
  <a href="index">Table of Contents</a>
  <a href="10-binary-search-trees" class="next">Next Chapter</a>
</div>
