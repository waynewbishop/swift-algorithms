---
layout: default
title: "Chapter 8: Linked Lists"
description: "Implement singly and doubly linked lists"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Linked lists

A linked list is a basic data structure that provides a way to associate related content. At a basic level, linked lists provide the same functionality as an Array. That is, the ability to insert, retrieve, update and remove related items. However, if properly implemented, linked lists can provide enhanced flexibility. Since objects are managed independently (instead of contiguously - as with an array), lists can prove useful when dealing with large datasets and complex algorithms.

## Arrays vs linked lists: Understanding the trade-offs

Before diving into implementation, it's important to understand when you'd choose a linked list over Swift's built-in Array, and vice versa.

### Memory organization

**Arrays: Contiguous memory**

[diagram: Array memory layout showing contiguous blocks]

- Elements are stored in a single continuous block
- Fast random access (just calculate: base address + index × size)
- Requires resizing when full (copy entire array to larger space)

**Linked lists: Non-contiguous memory**

[diagram: Linked list showing nodes scattered in memory with pointer connections]

- Elements can be anywhere in memory
- Each element points to the next (and previous, in doubly linked lists)
- No resizing needed—just allocate new nodes as needed

### Performance comparison

| Operation | Array | Linked List | Winner |
|-----------|-------|-------------|--------|
| Access by index | O(1) | O(n) | Array |
| Insert at beginning | O(n) | O(1) | Linked List |
| Insert at end | O(1)* | O(1)** | Tie |
| Insert in middle | O(n) | O(1)*** | Linked List |
| Remove from beginning | O(n) | O(1) | Linked List |
| Remove from end | O(1) | O(1)** | Tie |
| Remove from middle | O(n) | O(1)*** | Linked List |
| Search for value | O(n) | O(n) | Tie |
| Memory overhead | Low | High | Array |

\* Amortized O(1) with capacity doubling
\** If you maintain a tail pointer
\*** Once you've found the position (finding is still O(n))

### When to use linked lists

**Choose linked lists when:**

1. **Frequent insertions/deletions at the beginning**
   ```swift
   // Implementing an undo/redo stack where items are added at the front
   class UndoManager {
       private var actions = LinkedList<Action>()

       func recordAction(_ action: Action) {
           actions.insert(action, at: 0)  // O(1) with linked list
       }
   }
   ```

2. **Unknown or dynamic size with frequent modifications**
   ```swift
   // Real-time data stream processing
   class MessageQueue {
       private var messages = LinkedList<Message>()

       func enqueue(_ message: Message) {
           messages.append(element: message)  // No resizing needed
       }
   }
   ```

3. **You never need random access**
   ```swift
   // Processing items sequentially
   var current = list.head
   while current != nil {
       process(current!.key!)
       current = current?.next
   }
   ```

4. **Building other data structures**
   - Implementing your own Stack or Queue
   - Creating a Hash Table with chaining for collisions
   - Building a Graph with adjacency lists

### When to use arrays

**Choose arrays when:**

1. **Frequent random access by index**
   ```swift
   // Accessing student records by ID
   let student = students[42]  // O(1) with array
   ```

2. **Mostly reading data, few modifications**
   ```swift
   // Configuration settings loaded once
   let settings = ["theme": "dark", "notifications": true]
   ```

3. **Memory efficiency matters**
   - Arrays: Just store the elements
   - Linked lists: Store elements + 1-2 pointers per element (8-16 extra bytes)

4. **Working with Swift collections ecosystem**
   ```swift
   // Arrays work seamlessly with Swift's functional methods
   let doubled = numbers.map { $0 * 2 }
   let evens = numbers.filter { $0 % 2 == 0 }
   ```

5. **Small datasets**
   - For < 100 elements, array overhead is negligible
   - Modern CPUs are optimized for contiguous memory access

### Real-world iOS examples

**Linked lists in iOS:**
- **UIKit responder chain**: Each view has a `next` pointer forming a linked list
- **Core Data fault handling**: Lazy loading of related objects
- **Custom navigation history**: Browser-like back/forward functionality

**Arrays in iOS:**
- **UITableView/UICollectionView data sources**: Fast random access by index path
- **UserDefaults**: Storing configuration arrays
- **Most app data models**: Contact lists, photo galleries, etc.

### Swift's native support

**Important:** Swift's standard library doesn't include a built-in LinkedList type because:
1. Arrays are faster for most use cases
2. Modern CPU cache optimization favors contiguous memory
3. Arrays cover 95% of use cases efficiently

However, understanding linked lists is crucial for:
- Implementing other data structures (stacks, queues, graphs)
- Technical interviews
- Situations where insertion/deletion performance is critical
- Understanding how other languages (like Java's LinkedList) work

## How it works

In its basic form, a linked list is comprised of a key and indicator. The key represents the data you would like to store such as a String or scalar value. Typically represented by a pointer, the indicator stores the location (e.g. memory address) of where the next item can be found. Using this technique, you can chain seemingly independent objects together.

[diagram: A linked list with three keys and three indicators]

## The data structure

Here's an example of a "doubly" linked list structure written in Swift. The term doubly refers to the idea that the structure contains two pointers that refer to the previous and next items. With generics applied, the structure can also store any type and also supports optional nil values. The concept of combining keys and pointers to create structures not only applies to linked lists, but to other types like tries, queues and graphs.

```swift
//linked list structure
class LLNode<T> {
    var key: T?
    var next: LLNode?
    var previous: LLNode?
}
```

## Using optionals

When creating algorithms its good practice to set your class properties to nil before they are used. Like with app development, nil can be used to determine missing values or to predict the end of a list. Swift helps enforce this best-practice at compile time through a paradigm called optionals. For example, the function printAllKeys employs an optional (e.g., current) to iterate through linked list items.

```swift
//print keys for the class
func printAllKeys() {
    var current: LLNode? = head

    while current != nil {
        print("link item is: \(String(describing: current?.key!))")
        current = current?.next
    }
}
```

## Adding links

Here's the algorithm that builds a doubly linked list. The append method creates a new item and adds it to the end of the list. The Swift generic type constraint `<T: Equatable>` is also defined to ensure instances conform to a specific protocol.

```swift
public class LinkedList<T: Equatable> {
    //new instance
    private var head = LLNode<T>()

    //add item
    func append(element key: T) {
        guard head.key != nil else {
            head.key = key
            return
        }

        var current: LLNode? = head

        //position node
        while current != nil {
            if current?.next == nil {
                let childToUse = LLNode<T>()

                childToUse.key = key
                childToUse.previous = current
                current!.next = childToUse
                break
            } else {
                current = current?.next
            }
        } //end while
    }
} //end class
```

## Removing links

Conversely, here's an example of removing items from a list. Removing links not only involves reclaiming memory (for the deleted item), but also reassigning links so the chain remains unbroken.

```swift
//remove at specific index
func remove(at index: Int) {
    //check empty conditions
    if ((index < 0) || (index > (self.count - 1)) || (head.key == nil)) {
        print("link index does not exist..")
        return
    }

    var current: LLNode<T>? = head
    var trailer: LLNode<T>?
    var listIndex: Int = 0

    //determine if the removal is at the head
    if index == 0 {
        current = current?.next
        head = current!
        return
    }

    //iterate through remaining items
    while current != nil {
        if listIndex == index {
            //redirect the trailer and next pointers
            trailer!.next = current?.next
            current = nil
            break
        }

        //update assignments
        trailer = current
        current = current?.next
        listIndex += 1
    }
}
```

## Counting links

It can also be convenient to count link items. In Swift, this can be expressed as a computed property. For example, the following technique will allow the class instance to use a dot notation and is calculated in constant time - O(1).

```swift
//the number of items - O(1)
var count: Int {
    return counter
}

//empty list check
func isEmpty() -> Bool {
    return counter == 0 || head.key == nil
}

//add link item
func append(element key: T) {
    // ...
    counter += 1
}

//insert at specific index
func insert(_ key: T, at index: Int) {
    // ...
    counter += 1
}

//remove at specific index
func remove(at index: Int) {
    // ...
    counter -= 1
}
```

## Finding links

Finding links works similar to appending elements. To identify a found object, the algorithm must cycle through the entire collection. This occurs as a linear-time based operation. To ensure the function can return a nil result if no elements are found, the LLNode return value is declared as an optional:

```swift
//obtain link at a specific index
func find(at index: Int) -> LLNode<T>? {
    //check empty conditions
    if ((index < 0) || (index > (self.count - 1)) || (head.key == nil)) {
        return nil
    } else {
        var current: LLNode<T> = head
        var x: Int = 0

        //cycle through elements
        while (index != x) {
            current = current.next!
            x += 1
        }

        return current
    }
}
```

To enhance the linked list class, retrieving elements can also be obtained by subscript:

```swift
//find subscript shortcut
subscript(index: Int) -> LLNode<T>? {
    get {
        return find(at: index)
    }
}

//test find operation
var list = LinkedList<Int>()
// ...
let newnode: LLNode<Int>? = list[8]
```

## Summary

Linked lists are fundamental data structures that trade random access speed for insertion/deletion flexibility:

**Key characteristics:**
- **Non-contiguous memory**: Elements scattered with pointers connecting them
- **O(1) insertion/deletion**: Once you're at the position
- **O(n) access by index**: Must traverse from the beginning
- **Higher memory overhead**: Extra pointer(s) per element

**When to use linked lists:**
- Frequent insertions/deletions at beginning or middle
- Building other data structures (stacks, queues, graphs)
- Dynamic size with constant modifications
- Sequential-only access patterns

**When to use arrays instead:**
- Need random access by index
- Small datasets (< 100 elements)
- Mostly reading data
- Working with Swift's functional methods
- Memory efficiency is critical

**Real-world applications:**
- UIKit responder chain
- Browser back/forward navigation
- Undo/redo functionality
- Music playlist management
- Hash table collision handling (chaining)

Understanding linked lists is essential not just for implementing them directly, but for building more complex data structures and understanding performance trade-offs in your Swift applications. In the next chapter, we'll see how linked lists serve as the foundation for stacks and queues.


---

<div class="chapter-nav">
  <a href="07-generics" class="prev">Previous Chapter</a>
  <a href="index">Table of Contents</a>
  <a href="09-stacks-and-queues" class="next">Next Chapter</a>
</div>
