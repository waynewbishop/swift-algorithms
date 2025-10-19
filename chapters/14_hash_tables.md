# Hash Tables

A hash table is a data structure that groups values to an index. In some cases, built-in Swift data types (e.g dictionaries) also accomplish this goal. Because of their efficiency, hash tables should be regarded as an important tool for solving technical questions. In this chapter, we'll examine the advantages of hash tables and will build our own custom hash table model in Swift.

## Keys & Values

As noted, there are numerous data structures that group values to an index. By definition, linked lists provide a straightforward way to associate related items. While the advantage of a linked list is flexibility, their downside is performance. Since the primary way to search a list is to (sequentially) traverse a set, their efficiency is typically limited to linear time or O(n). To contrast, a dictionary associates a value to a user-defined key. This helps pinpoint operations to specific entries. As a result, a well designed hash table and/or dictionary operates in constant time - O(1).

## The Basics

As the name implies, a hash table consists of two parts - an index and value. However, unlike a Dictionary, the index (e.g. hash) is a computed sequence of numbers and /or characters. The process that creates a unique hash is known as a hash algorithm:

The above illustrates the components of a hash table. Using an Array, values are stored in non-contiguous slots called buckets. The position of each value is computed by the hash function. As we'll see, most algorithms use all or a portion of their input to create a unique hash. Also, unlike a Dictionary, the index is not stored with the buckets object.

## The Structures

Using generics, the recursive Node data structure previously introduced with Stacks/Queues can also be used for our hash table. In this case, our Node.key can maintain any combination of items, including custom objects:

```swift
//a generic hash element
class Node<T> {
    var key: T?
    var next: Node?
}
```

We can also establish a Result enum structure to monitor the hash table process:

```swift
//used for generic processing
enum Result {
    case Success
    case Collision
    case NotFound
    case NotSupported
    case Fail
}
```

## Type Conformance

An interesting question arises when building a generic hash table. Since table elements are arranged (stored) based on their specific hash index, how can our algorithm learn to interpret different data types? To help manage our data requirements, we'll establish a new protocol called Keyable:

### The Bucket

Before using our table, we must first define a bucket structure. If you recall, buckets are used to group Element items. Since items will be stored in a non-contiguous fashion, we must first define our collection size.

```swift
//generic table structure
class HashTable<T: Keyable> {
    private var buckets: Array<Node<T>?>

    init(capacity: Int) {
        self.buckets = Array<Node<T>?>(repeatElement(nil, count: capacity))
    }
}
```

```swift
//determine hash table compliance
protocol Keyable {
    //conforming types require property
    var keystring: String {get}
    func hashValue<T>(for key: String!, using buckets: Array<T>) -> Int
}
```

Keyable can now be applied as a type constraint for our hash table class. This will ensure table elements will conform to certain data rules. Seen above, the protocol consists of a single keystring property and a hashValue() method. With our protocol in place, let's see how different types conform to these requirements:

```swift
extension String: Keyable {
    //hash table requirement
    var keystring: String {
        return self
    }
}

class Vertex: Keyable {
    var key: String?
    var neighbors: Array<Edge>
    var visited: Bool = false

    init() {
        self.neighbors = Array<Edge>()
    }

    //hash table requirement
    var keystring: String {
        return self.key!
    }
}
```

The String and Vertex types comply with the keystring property, but what of the hashValue() method? Since the requirement to create a hashValue is specific to Keyable types, this action can be accessed through a protocol extension:

> **Protocol Extension**
>
> Exclusive to Swift programming, the process of managing program actions and functionality using protocols.

```swift
extension Keyable {
    //compute table index
    func hashValue<T>(for key: String!, using buckets: Array<T>) -> Int {
        var remainder: Int = 0
        var divisor: Int = 0

        //trivial case
        guard key != nil else {
            return -1
        }

        for item in key.unicodeScalars {
            divisor += Int(item.value)
        }

        remainder = divisor % buckets.count
        return remainder
    }
}
```

Effective hash tables rely on the performance of their hash algorithms. In this example, hashValue() is a straightforward algorithm that employs modular math.

## Adding Elements

With the components in place, we can define the method for adding items. The following snippet provides some important insights:

```swift
func insert(_ element: T) -> Result {
    let result: Result

    //compute hash
    let hashIndex = element.hashValue(for: element.keystring, using: buckets)

    if hashIndex != -1 {
        let childToUse = Node<T>()
        childToUse.key = element

        //check existing list
        if buckets[hashIndex] == nil {
            buckets[hashIndex] = childToUse
            results = Result.Success
        }
        ...
```

With any hash algorithm, the goal is to create enough complexity to eliminate collisions. By producing unique indexes, our corresponding table can provide constant time - O(1) operations for insertion, modification and lookup. Hash Table collisions occur when different inputs compute to the same hash. Based on the relatively straightforward design of our hashValue() algorithm, the inputs of "Albert Einstein" and "Andrew Collins" always produce the same hash result of "8".

The creation of hash algorithms is considered more art than science. As a result, there are many techniques to help reduce the potential of collisions. Beyond using modular math to compute a hash, we've applied a technique called separate chaining. By applying a process similar to building a linked list, this will allow multiple table elements to share the same index value:

```swift
// table separate chaining process
else {
    var head = buckets[hashIndex] as Node<T>?

    //append item
    childToUse.next = head
    head = childToUse

    //update chained list
    buckets[hashIndex] = head
    results = Result.Collision
}
```

## Finding Elements

The process for finding elements is similar to the append() process. However, since we are looking for specific items, we must ensure the element we are seeking can be matched to our input String. This conformance can also be managed through Keyable protocol:

```swift
//test for containing element
func contains<T: Keyable>(_ element: T) -> Bool {
    //obtain hash index
    let hashIndex = element.hashValue(for: element.keystring, using: buckets)

    guard hashIndex != -1 else {
        return false
    }

    if buckets[hashIndex] != nil {
        var current = buckets[hashIndex]

        //check chained list for match
        while current != nil {
            if let item: Keyable = current?.key {
                if item.keystring == element.keystring {
                    return true
                }
            }
            current = current?.next
        } //end while
    }

    return false
}
```

What makes this algorithm possible is treating our Keyable protocol as a type. Since the input parameter as well as the hash table contents both conform to the Keyable protocol, table elements can be interpreted as a Keyable type. This centralized conformance allows seemingly different objects to be compared equally (e.g. String vs Vertex).
