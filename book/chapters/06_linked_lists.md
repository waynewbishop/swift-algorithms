# Linked Lists

A linked list is a fundamental data structure that provides a way to store and organize data elements in a linear sequence. Unlike arrays, linked lists do not store elements in contiguous memory locations, instead using pointers to connect nodes containing data.

## Basic structure

In its simplest form, a linked list consists of nodes, where each node contains:
1. The data we want to store
2. A reference to the next node in the sequence

Here's a basic implementation of a singly linked list node in Swift:

```swift
class Node<T> {
    var data: T
    var next: Node?
    
    init(data: T) {
        self.data = data
    }
}
```

## Singly linked list implementation

Let's implement a basic singly linked list:

```swift
class LinkedList<T> {
    private var head: Node<T>?
    
    var isEmpty: Bool {
        return head == nil
    }
    
    func append(_ data: T) {
        let newNode = Node(data: data)
        if let lastNode = last {
            lastNode.next = newNode
        } else {
            head = newNode
        }
    }
    
    var last: Node<T>? {
        var current = head
        while let next = current?.next {
            current = next
        }
        return current
    }
}
```

## Time complexity analysis

Understanding the time complexity of linked list operations is crucial. Here's a comparison with arrays:

| Operation        | Linked List | Array           |
|:-----------------|:------------|:----------------|
| Access           | O(n)        | O(1)            |
| Insertion (end)  | O(n)        | O(1) amortized  |
| Insertion (start)| O(1)        | O(n)            |
| Deletion (end)   | O(n)        | O(1) amortized  |
| Deletion (start) | O(1)        | O(n)            |
| Search           | O(n)        | O(n)            |

As we can see, linked lists excel at insertions and deletions at the beginning, while arrays are better for random access and operations at the end.

## Doubly linked lists

A doubly linked list maintains links in both directions, allowing for more flexible operations. Note the addition of the `previous` node in the `DoublyNode` structure which serves as the previous reference. 

```swift
class DoublyNode<T> {
    var data: T
    var next: DoublyNode?
    var previous: DoublyNode?
    
    init(data: T) {
        self.data = data
    }
}

class DoublyLinkedList<T> {
    private var head: DoublyNode<T>?
    private var tail: DoublyNode<T>?
    
    func append(_ data: T) {
        let newNode = DoublyNode(data: data)
        if let tailNode = tail {
            tailNode.next = newNode
            newNode.previous = tailNode
            tail = newNode
        } else {
            head = newNode
            tail = newNode
        }
    }
    
    // Other methods...
}
```

Doubly linked lists allow for easier backward traversal and slightly faster deletion operations when the node to be deleted is given.

## Circular Linked Lists

In a circular linked list, the last node points back to the first node, creating a circle:

```swift
class CircularLinkedList<T> {
    private var head: Node<T>?
    
    func append(_ data: T) {
        let newNode = Node(data: data)
        if let headNode = head {
            var current = headNode
            while current.next != head {
                current = current.next ?? headNode
            }
            current.next = newNode
            newNode.next = headNode
        } else {
            head = newNode
            newNode.next = newNode
        }
    }
    
    // Other methods...
}
```

Circular linked lists are useful in applications where you need to repeatedly cycle through a list of elements.

## Sentinel nodes

Sentinel nodes are dummy nodes placed at the beginning and/or end of a linked list. They simplify edge cases and can make code cleaner:

```swift
class SentinelLinkedList<T> {
    private let sentinel: Node<T>
    
    init() {
        sentinel = Node<T>(data: nil as! T)
        sentinel.next = sentinel
    }
    
    func append(_ data: T) {
        let newNode = Node(data: data)
        newNode.next = sentinel.next
        sentinel.next = newNode
    }
    
    // Other methods...
}
```

## Memory management

In Swift, memory management for linked lists is handled automatically through ARC (Automatic Reference Counting). However, it's important to be aware of potential retain cycles, especially in doubly linked lists. Using weak references for backward links can prevent memory leaks:

```swift
class DoublyNode<T> {
    var data: T
    var next: DoublyNode?
    weak var previous: DoublyNode?
    
    init(data: T) {
        self.data = data
    }
}
```

## Common interview questions

Here are some popular linked list interview questions:

1. Reverse a linked list
2. Detect a cycle in a linked list
3. Find the middle element of a linked list
4. Merge two sorted linked lists

Here's an example of reversing a singly linked list:

```swift
func reverse() {
    var prev: Node<T>? = nil
    var current = head
    while let currentNode = current {
        let next = currentNode.next
        currentNode.next = prev
        prev = currentNode
        current = next
    }
    head = prev
}
```

## Real-world Applications

Linked lists are used in various real-world applications:

1. Implementation of stacks and queues
2. Undo functionality in applications
3. Music playlists
4. Browser's forward and backward navigation

## Comparison with other data structures

While linked lists offer flexibility in insertions and deletions, they have some drawbacks compared to arrays:

- Random access is slower (O(n) vs O(1))
- They use more memory due to storage of link fields
- They have poor cache locality, which can affect performance

However, linked lists shine in scenarios where frequent insertions and deletions are required, especially at the beginning of the list.

## Practice Problems 

1. Implement a method to remove duplicates from an unsorted linked list.
2. Write a method to find the kth to last element of a singly linked list.
