# Linked Lists

A linked list is a basic data structure that provides a way to associate related content. At a basic level, linked lists provide the same functionality as an array. That is, the ability to insert, retrieve, update and remove related items. However, if properly implemented, linked lists can provide additional flexibility. Since objects are managed independently (instead of contiguously - as with an array), lists can prove useful when dealing with large datasets.

## How It Works

In its basic form, a linked list is comprised of a key and an indicator. The key represents the data you would like to store such as a string or scalar value. Typically represented by a pointer, the indicator stores the location (also called the address) of where the next item can be found. Using this technique, you can chain seemingly independent objects together.

[diagram: A linked list with three keys and three indicators]

## The Data Structure

Here's an example of a "doubly" linked list structure written in Swift. In addition to storing a key, the structure also provides pointers to the next and previous items. Using generics, the structure can also store any type of object and supports nil values. The concept of combining keys and pointers to create structures not only applies to linked lists, but to other types like tries, queues and graphs.

```swift
// Linked list structure
class LLNode<T> {
    var key: T?
    var next: LLNode?
    var previous: LLNode?
}
```

## Using Optionals

When creating algorithms its good practice to set your class properties to nil before they are used. Like with app development, nil can be used to determine missing values or to predict the end of a list. Swift helps enforce this best-practice at compile time through a paradigm called optionals. For example, the function printAllKeys employs an optional (e.g., current) to iterate through linked list items.

> **OPTIONAL TYPE**: Exclusive to Swift, optionals identify a variable being able to hold a nil value. Swift variables that are permitted to hold a nil value are identified with a ? or ! character.

```swift
// Print keys for the class
func printAllKeys() {
    var current: LLNode? = head

    while current != nil {
        print("link item is: \(String(describing: current?.key!))")
        current = current?.next
    }
}
```

## Adding Links

Here's a function that builds a doubly linked list. The method append creates a new item and adds it to the list. The Swift generic type constraint `<T: Equatable>` is also defined to ensure link instances conform to a specific protocol.

```swift
class LinkedList<T: Equatable> {
    // New instance
    private var head = LLNode<T>()

    // Add item
    func append(element key: T) {
        guard head.key != nil else {
            head.key = key
            return
        }

        var current: LLNode? = head

        // Position node
        while current != nil {
            if current?.next == nil {
                let childToUse = LLNode<T>()
                childToUse.key = key
                childToUse.previous = current
                if let linkCurrent = current {
                    linkCurrent.next = childToUse
                }
                break
            }
            else {
                current = current?.next
            }
        } // end while
    }
} // end class
```

## Removing Links

Conversely, here's an example of removing items from a list. Removing links not only involves reclaiming memory (for the deleted item), but also reassigning links so the chain remains unbroken.

```swift
// Remove at specific index
func remove(at index: Int) {
    // Check empty conditions
    if ((index < 0) || (index > (self.count - 1)) || (head.key == nil)) {
        print("link index does not exist..")
        return
    }

    var current: LLNode<T>? = head
    var trailer: LLNode<T>?
    var listIndex: Int = 0

    // Determine if the removal is at the head
    if (index == 0) {
        current = current?.next
        if let headitem = current {
            head = headitem
            counter -= 1
        }
        return
    }

    // Iterate through remaining items
    while current != nil {
        if listIndex == index {
            // Redirect the trailer and next pointers
            if let tnode = trailer {
                tnode.next = current?.next
            }
            current = nil
            break
        }

        // Update assignments
        trailer = current
        current = current?.next
        listIndex += 1
    }
}
```

## Counting Links

It can also be convenient to count link items. In Swift, this can be expressed as a computed property. For example, the following technique will allow the class instance to use a dot notation and is calculated in constant time - O(1).

```swift
// The number of items - O(1)
var count: Int {
    return counter
}

// Empty list check
func isEmpty() -> Bool {
    return counter == 0 || head.key == nil
}

// Add link item
func append(element key: T) {
    // ...
    counter += 1
}

// Insert at specific index
func insert(_ key: T, at index: Int) {
    // ...
    counter += 1
}

// Remove at specific index
func remove(at index: Int) {
    // ...
    counter -= 1
}
```

## Finding Links

Finding links works similar to appending elements. To identify a found object, the algorithm must cycle through the entire collection. This occurs as a linear-time based operation. To ensure the function can return a nil result if no elements are found, the LLNode return value is declared as an optional.

```swift
// Obtain link at a specific index
func find(at index: Int) -> LLNode<T>? {
    // Check empty conditions
    if ((index < 0) || (index > (self.count - 1)) || (head.key == nil)) {
        return nil
    }
    else {
        var current: LLNode<T> = head
        var x: Int = 0

        // Cycle through elements
        while (index != x) {
            guard let nextNode = current.next else {
                return nil
            }
            current = nextNode
            x += 1
        }

        return current
    } // end else
}
```

To enhance the linked list class, retrieving elements can also be obtained by subscript:

```swift
// Find subscript shortcut
subscript(index: Int) -> LLNode<T>? {
    get {
        return find(at: index)
    }
}

// Test find operation
var list = LinkedList<Int>()
// ...
let newnode: LLNode<Int>? = list[8]
```
