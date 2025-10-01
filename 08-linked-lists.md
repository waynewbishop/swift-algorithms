# Linked lists

A linked list is a basic data structure that provides a way to associate related content. At a basic level, linked lists provide the same functionality as an Array. That is, the ability to insert, retrieve, update and remove related items. However, if properly implemented, linked lists can provide enhanced flexibility. Since objects are managed independently (instead of contiguously - as with an array), lists can prove useful when dealing with large datasets and complex algorithms.

## How it works

In its basic form, a linked list is comprised of a key and indicator. The key represents the data you would like to store such as a String or scalar value. Typically represented by a pointer, the indicator stores the location (e.g. memory address) of where the next item can be found. Using this technique, you can chain seemingly independent objects together.

*A linked list with three keys and three indicators.*

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

