---
layout: chapter
title: "Chapter 7: Generics"
description: "Build type-safe, reusable code with Swift generics"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Generics

Swift brings a powerful series of tools that make coding more expressive and safe. Along with its simplified syntax, Swift borrows from the success of other languages to prevent common programming errors like null pointer exceptions and memory leaks.

One of Swift's most powerful features is generics—a design technique that allows you to write flexible, reusable code while maintaining complete type safety.

In this chapter, we'll explore how generics enable the data structures you'll build throughout this book. Without generics, you'd need to write separate implementations of linked lists for integers, strings, custom objects, and every other type. Generics solve this problem elegantly.

## The code reuse problem

As developers building data structures and algorithms, we face a fundamental challenge: how do we create components that work with any type while maintaining type safety? Let's examine this problem through a concrete example.

Imagine you're building a simple queue system to manage different types of data in your application. You might start with a queue for processing user names:

```swift
//queue for strings
class StringQueue {
    private var items: [String] = []

    func enqueue(_ item: String) {
        items.append(item)
    }

    func dequeue() -> String? {
        return items.isEmpty ? nil : items.removeFirst()
    }
}
```

This works perfectly for strings. But what happens when you need to queue integers for processing tasks?

```swift
//queue for integers
class IntQueue {
    private var items: [Int] = []

    func enqueue(_ item: Int) {
        items.append(item)
    }

    func dequeue() -> Int? {
        return items.isEmpty ? nil : items.removeFirst()
    }
}
```

The code is nearly identical—only the type changes. Now imagine needing queues for custom types, doubles, booleans, and more. You'd have dozens of nearly identical implementations, each duplicating the same logic.

**The problems with code duplication:**
- **Maintenance nightmare** - Bug fixes must be applied to every version
- **Inconsistency risk** - Easy to update one implementation but forget others
- **Testing burden** - Each implementation needs separate test coverage
- **Wasted effort** - Writing the same logic repeatedly is inefficient

This is exactly the problem generics solve.

## What are generics?

Generics allow you to write code that works with any type while preserving type safety. Instead of writing separate implementations for each type, you write one implementation that works with a type parameter—a placeholder for any actual type.

Here's the same queue implemented with generics:

```swift
//generic queue - works with any type
class Queue<Element> {
    private var items: [Element] = []

    func enqueue(_ item: Element) {
        items.append(item)
    }

    func dequeue() -> Element? {
        return items.isEmpty ? nil : items.removeFirst()
    }
}

//usage - one implementation, multiple types
let stringQueue = Queue<String>()
stringQueue.enqueue("Alice")
stringQueue.enqueue("Bob")

let intQueue = Queue<Int>()
intQueue.enqueue(1)
intQueue.enqueue(2)
```

**Benefits of this approach:**
- **Single implementation** - One version of the code to maintain
- **Type safety** - Swift ensures you can't mix types incorrectly
- Reusability - Works with any type, including types you haven't written yet
- **No runtime overhead** - Generic types are resolved at compile time

This is the foundation that makes data structures in Swift so powerful and flexible.

## Generic type parameters

Generic types use angle brackets (`<>`) to define type parameters—placeholders for actual types that will be specified later.

### Basic syntax

```swift
//generic struct
struct Container<T> {
    var item: T
}

//generic class
class Box<T> {
    var contents: T
    init(_ contents: T) {
        self.contents = contents
    }
}

//generic enum
enum Result<T> {
    case success(T)
    case failure(Error)
}
```

### Understanding type parameter names

A common misconception is that `T` is a reserved keyword in Swift. It's not! `T` is simply a naming convention, like using `i` for loop counters or `url` for URL variables.

```swift
//all of these are equivalent
struct Container<T> { var item: T }
struct Container<Element> { var item: Element }
struct Container<Item> { var item: Item }
struct Container<Value> { var item: Value }
```

**Common naming conventions:**

| Convention | Usage | Example |
|------------|-------|---------|
| `T` | Single generic parameter, general purpose | `class Stack<T>` |
| `Element` | Collection types | `struct LinkedList<Element>` |
| `Key`, `Value` | Dictionary-like types | `struct Cache<Key, Value>` |
| `Input`, `Output` | Transformations | `func convert<Input, Output>()` |
| Descriptive names | Domain-specific clarity | `struct Sensor<ReadingType>` |

**Choosing parameter names:**

Use `T` when:
- You have a single generic parameter
- The type's purpose is obvious from context
- Following established patterns (like Swift's standard library)

Use descriptive names when:
- Multiple type parameters exist
- The parameter's role needs clarification
- Domain-specific context helps readability

```swift
//simple case - T is clear
struct Stack<T> {
    private var items: [T] = []
}

//multiple parameters - descriptive names help
struct Mapping<Key, Value> {
    private var storage: [Key: Value] = [:]
}

//domain-specific - descriptive name adds clarity
struct SensorReading<MeasurementType> {
    let timestamp: Date
    let value: MeasurementType
}
```

### Multiple type parameters

Generics support multiple type parameters, each serving a distinct role:

```swift
//dictionary-like structure with two type parameters
struct KeyValueStore<Key, Value> {
    private var storage: [Key: Value] = [:]

    mutating func set(_ value: Value, for key: Key) {
        storage[key] = value
    }

    func get(_ key: Key) -> Value? {
        return storage[key]
    }
}

//usage
var userScores = KeyValueStore<String, Int>()
userScores.set(100, for: "Alice")
userScores.set(95, for: "Bob")
```

## Generic functions

Functions can also be generic, allowing you to write operations that work with any type:

```swift
//generic swap function
func swap<T>(_ a: inout T, _ b: inout T) {
    let temp = a
    a = b
    b = temp
}

//works with any type
var x = 5
var y = 10
swap(&x, &y)  // x is now 10, y is now 5

var firstName = "Alice"
var lastName = "Smith"
swap(&firstName, &lastName)  // firstName is "Smith", lastName is "Alice"
```

Generic functions are particularly useful in algorithms:

```swift
//generic linear search
func linearSearch<T: Equatable>(for target: T, in array: [T]) -> Int? {
    for (index, element) in array.enumerated() {
        if element == target {
            return index
        }
    }
    return nil
}

//works with different types
let numbers = [1, 2, 3, 4, 5]
linearSearch(for: 3, in: numbers)  // returns 2

let names = ["Alice", "Bob", "Charlie"]
linearSearch(for: "Bob", in: names)  // returns 1
```

Notice the `<T: Equatable>` constraint in the search function. This brings us to an essential topic: type constraints.

## Type constraints

While generic types provide flexibility, you often need to ensure that type parameters support specific operations. Without constraints, this won't compile:

```swift
//error: not all types support ==
func areEqual<T>(_ first: T, _ second: T) -> Bool {
    return first == second  // Compiler error!
}
```

The compiler can't guarantee that every possible type `T` supports the `==` operator. This is where type constraints become essential.

### Protocol constraints

Type constraints specify that a generic type parameter must conform to a particular protocol:

```swift
//works: T must support equality comparison
func areEqual<T: Equatable>(_ first: T, _ second: T) -> Bool {
    return first == second  // Now this compiles
}
```

The constraint `T: Equatable` means "T can be any type, as long as that type conforms to the Equatable protocol."

## The essential protocols

Swift provides three fundamental protocols that enable the most common generic operations. Understanding these protocols is crucial for working with generics effectively.

### Equatable protocol

`Equatable` enables types to be compared for equality using `==` and `!=` operators.

```swift
//function requiring Equatable
func contains<T: Equatable>(_ target: T, in array: [T]) -> Bool {
    for element in array {
        if element == target {
            return true
        }
    }
    return false
}

//works with any Equatable type
let hasThree = contains(3, in: [1, 2, 3, 4])  // true
let hasAlice = contains("Alice", in: ["Bob", "Charlie"])  // false
```

**Making custom types Equatable:**

```swift
struct Point: Equatable {
    let x: Int
    let y: Int

    //Swift automatically generates == for simple structs
}

let p1 = Point(x: 0, y: 0)
let p2 = Point(x: 0, y: 0)
print(p1 == p2)  // true - uses synthesized ==
```

For more complex types, you can provide custom equality logic:

```swift
struct Person: Equatable {
    let name: String
    let age: Int

    //custom equality - only compare names
    static func == (lhs: Person, rhs: Person) -> Bool {
        return lhs.name == rhs.name
    }
}
```

### Comparable protocol

`Comparable` enables ordering operations using `<`, `>`, `<=`, and `>=`. Types conforming to `Comparable` automatically conform to `Equatable`.

```swift
//function requiring Comparable
func findMax<T: Comparable>(_ array: [T]) -> T? {
    guard !array.isEmpty else { return nil }

    var max = array[0]
    for element in array {
        if element > max {
            max = element
        }
    }
    return max
}

//works with any Comparable type
findMax([3, 1, 4, 1, 5])  // returns 5
findMax(["zebra", "apple", "mango"])  // returns "zebra"
```

**Making custom types Comparable:**

```swift
struct Temperature: Comparable {
    let celsius: Double

    static func < (lhs: Temperature, rhs: Temperature) -> Bool {
        return lhs.celsius < rhs.celsius
    }
}

let temps = [
    Temperature(celsius: 20),
    Temperature(celsius: 15),
    Temperature(celsius: 25)
]

//can now sort temperatures
let sorted = temps.sorted()  // [15°C, 20°C, 25°C]
```

This is exactly how sorting algorithms in Chapters 4 and 5 work with any comparable type:

```swift
extension Array where Element: Comparable {
    func bubbleSort() -> [Element] {
        guard count > 1 else { return self }

        var output = self
        for primaryIndex in 0..<output.count {
            for secondaryIndex in 0..<(output.count - 1) {
                if output[secondaryIndex] > output[secondaryIndex + 1] {
                    output.swapAt(secondaryIndex, secondaryIndex + 1)
                }
            }
        }
        return output
    }
}

//works with any Comparable type
[5, 2, 8, 1].bubbleSort()  // [1, 2, 5, 8]
["dog", "cat", "bird"].bubbleSort()  // ["bird", "cat", "dog"]
```

### Hashable protocol

`Hashable` enables types to be used as dictionary keys and in sets. Types conforming to `Hashable` automatically conform to `Equatable`.

```swift
//function using Hashable for uniqueness
func uniqueElements<T: Hashable>(_ array: [T]) -> [T] {
    var seen = Set<T>()
    var result: [T] = []

    for element in array {
        if !seen.contains(element) {
            seen.insert(element)
            result.append(element)
        }
    }

    return result
}

//usage
uniqueElements([1, 2, 2, 3, 1, 4])  // [1, 2, 3, 4]
```

**Making custom types Hashable:**

```swift
struct Coordinate: Hashable {
    let x: Int
    let y: Int

    //Swift automatically synthesizes hash(into:) for simple structs
}

//can now use in sets and as dictionary keys
var visited = Set<Coordinate>()
visited.insert(Coordinate(x: 0, y: 0))

var grid = [Coordinate: String]()
grid[Coordinate(x: 1, y: 1)] = "treasure"
```

**Protocol hierarchy:**

[diagram: Protocol hierarchy showing Hashable and Comparable both including Equatable]

Most Swift built-in types (`Int`, `Double`, `String`, `Bool`) conform to all three protocols automatically.

## Combining protocol constraints

You can require that a type parameter conforms to multiple protocols using the `&` operator:

```swift
//requires both Comparable and Hashable
func sortAndUnique<T: Comparable & Hashable>(_ array: [T]) -> [T] {
    let unique = Set(array)  // requires Hashable
    return unique.sorted()   // requires Comparable
}

//usage
sortAndUnique([3, 1, 2, 1, 3, 2])  // [1, 2, 3]
```

This pattern is common when you need multiple capabilities from a generic type.

## Custom type constraints

Beyond built-in protocols, you can create your own protocols to use as type constraints.

### Simple custom protocols

```swift
//protocol for types that can be validated
protocol Validatable {
    func isValid() -> Bool
}

//generic function using custom constraint
func filterValid<T: Validatable>(_ items: [T]) -> [T] {
    return items.filter { $0.isValid() }
}

//types conforming to custom protocol
struct Email: Validatable {
    let address: String

    func isValid() -> Bool {
        return address.contains("@")
    }
}

//usage
let emails = [
    Email(address: "alice@example.com"),
    Email(address: "invalid-email"),
    Email(address: "bob@example.com")
]

let valid = filterValid(emails)  // only valid emails
```

### Custom protocols extending built-in protocols

You can build custom protocols on top of standard library protocols:

```swift
//custom protocol extending Comparable
protocol Scoreable: Comparable {
    var score: Int { get }
}

//generic function using extended protocol
func topPerformer<T: Scoreable>(_ items: [T]) -> T? {
    return items.max()  // can use max() because Scoreable: Comparable
}

//implementation
struct Player: Scoreable {
    let name: String
    let score: Int

    static func < (lhs: Player, rhs: Player) -> Bool {
        return lhs.score < rhs.score
    }
}

//usage
let players = [
    Player(name: "Alice", score: 100),
    Player(name: "Bob", score: 95),
    Player(name: "Charlie", score: 110)
]

let winner = topPerformer(players)  // Charlie (score: 110)
```

### Class inheritance constraints

You can constrain generic type parameters to specific classes or their subclasses:

```swift
//base class
class Node {
    let id: String
    init(id: String) {
        self.id = id
    }
}

//generic function constrained to Node subclasses
func printNodeInfo<T: Node>(_ node: T) {
    print("Node ID: \(node.id)")
}

//subclass
class TreeNode: Node {
    var children: [TreeNode] = []
}

//usage
let node = TreeNode(id: "root")
printNodeInfo(node)  // works - TreeNode is a subclass of Node
```

This is particularly useful when you need reference semantics or shared base functionality across types.

## Where clauses

Where clauses provide additional flexibility for constraining generic types, especially when working with extensions and complex type relationships.

### Constraining extensions

Where clauses let you add functionality to generic types when their elements meet specific requirements:

```swift
//extension that only works when Array contains Doubles
extension Array where Element == Double {
    func average() -> Double {
        guard !isEmpty else { return 0 }
        return reduce(0, +) / Double(count)
    }

    func standardDeviation() -> Double {
        let avg = average()
        let squaredDiffs = map { pow($0 - avg, 2) }
        return sqrt(squaredDiffs.average())
    }
}

//these methods only available for [Double]
let temperatures = [72.5, 68.0, 71.2, 69.8]
let avg = temperatures.average()  // 70.375
let stdDev = temperatures.standardDeviation()  // ~1.89
```

You can also use protocol constraints in where clauses:

```swift
//extension for arrays of Comparable elements
extension Array where Element: Comparable {
    func isSorted() -> Bool {
        guard count > 1 else { return true }

        for i in 0..<(count - 1) {
            if self[i] > self[i + 1] {
                return false
            }
        }
        return true
    }
}

//usage
[1, 2, 3, 4].isSorted()  // true
[1, 3, 2, 4].isSorted()  // false
["a", "b", "c"].isSorted()  // true
```

### Multiple where conditions

You can specify multiple constraints in where clauses:

```swift
//extension for dictionaries where both Key and Value are Comparable
extension Dictionary where Key: Comparable, Value: Comparable {
    func sortedByKey() -> [(Key, Value)] {
        return sorted { $0.key < $1.key }
    }

    func sortedByValue() -> [(Key, Value)] {
        return sorted { $0.value < $1.value }
    }
}

//usage
let scores = ["Alice": 95, "Charlie": 88, "Bob": 92]
let byName = scores.sortedByKey()  // [("Alice", 95), ("Bob", 92), ("Charlie", 88)]
let byScore = scores.sortedByValue()  // [("Charlie", 88), ("Bob", 92), ("Alice", 95)]
```

## Associated types

Associated types allow you to define placeholder types within protocols, enabling even more flexible generic patterns.

### Protocols with associated types

```swift
//protocol with associated type
protocol Container {
    associatedtype Item

    var count: Int { get }
    mutating func append(_ item: Item)
    subscript(i: Int) -> Item { get }
}

//implementation for integers
struct IntStack: Container {
    //specify that Item is Int
    typealias Item = Int

    private var items: [Int] = []

    var count: Int {
        return items.count
    }

    mutating func append(_ item: Int) {
        items.append(item)
    }

    subscript(i: Int) -> Int {
        return items[i]
    }
}
```

Swift can often infer the associated type from your implementation:

```swift
//generic implementation - Swift infers Item from Element
struct Stack<Element>: Container {
    private var items: [Element] = []

    var count: Int {
        return items.count
    }

    mutating func append(_ item: Element) {
        items.append(item)
    }

    subscript(i: Int) -> Element {
        return items[i]
    }
}
```

### Generic functions with associated types

You can write functions that work with any type conforming to a protocol with associated types:

```swift
//function that works with any Container
func printAll<C: Container>(_ container: C) {
    for i in 0..<container.count {
        print(container[i])
    }
}

//works with any type conforming to Container
var stack = Stack<String>()
stack.append("First")
stack.append("Second")
printAll(stack)
```

## Generic enums

Enums can also be generic, providing type-safe alternatives and result handling:

### Optional - Swift's most famous generic enum

Swift's `Optional` type is actually a generic enum:

```swift
//simplified version of Swift's Optional
enum Optional<Wrapped> {
    case none
    case some(Wrapped)
}

//Swift provides syntactic sugar: T? is shorthand for Optional<T>
let maybeNumber: Int? = 42
//is equivalent to
let maybeNumber: Optional<Int> = .some(42)
```

### Result type for error handling

```swift
//generic Result enum for operations that can fail
enum Result<Success, Failure: Error> {
    case success(Success)
    case failure(Failure)
}

//example error type
enum NetworkError: Error {
    case timeout
    case notFound
}

//function returning Result
func fetchData() -> Result<String, NetworkError> {
    let success = Bool.random()

    if success {
        return .success("Data loaded")
    } else {
        return .failure(.timeout)
    }
}

//usage with pattern matching
switch fetchData() {
case .success(let data):
    print("Got data: \(data)")
case .failure(let error):
    print("Error: \(error)")
}
```

## Generics in data structures

Throughout this book, you'll see generics powering every data structure. Understanding generics is essential for implementing and using these structures effectively.

### Linked lists (Chapter 8)

```swift
//node in a linked list
class LinkedListNode<T> {
    var value: T
    var next: LinkedListNode<T>?

    init(_ value: T) {
        self.value = value
    }
}

//the linked list itself
class LinkedList<Element> {
    private var head: LinkedListNode<Element>?

    func append(_ value: Element) {
        let newNode = LinkedListNode(value)

        guard let head = head else {
            self.head = newNode
            return
        }

        var current = head
        while let next = current.next {
            current = next
        }
        current.next = newNode
    }
}

//works with any type
let numbers = LinkedList<Int>()
numbers.append(1)
numbers.append(2)

let names = LinkedList<String>()
names.append("Alice")
names.append("Bob")
```

### Binary search trees (Chapter 10)

```swift
//tree node
class TreeNode<T: Comparable> {
    var value: T
    var left: TreeNode<T>?
    var right: TreeNode<T>?

    init(_ value: T) {
        self.value = value
    }
}

//binary search tree
class BinarySearchTree<Element: Comparable> {
    private var root: TreeNode<Element>?

    func insert(_ value: Element) {
        root = insertHelper(root, value)
    }

    private func insertHelper(_ node: TreeNode<Element>?, _ value: Element) -> TreeNode<Element> {
        guard let node = node else {
            return TreeNode(value)
        }

        if value < node.value {
            node.left = insertHelper(node.left, value)
        } else {
            node.right = insertHelper(node.right, value)
        }

        return node
    }
}

//note the Comparable constraint - necessary for comparison operations
let tree = BinarySearchTree<Int>()
tree.insert(5)
tree.insert(3)
tree.insert(7)
```

### Graphs (Chapter 11)

```swift
//vertex in a graph
class Vertex<T> {
    var value: T
    var neighbors: [Vertex<T>] = []

    init(_ value: T) {
        self.value = value
    }
}

//the graph structure
class Graph<Element> {
    private var vertices: [Vertex<Element>] = []

    func addVertex(_ value: Element) -> Vertex<Element> {
        let vertex = Vertex(value)
        vertices.append(vertex)
        return vertex
    }

    func addEdge(from source: Vertex<Element>, to destination: Vertex<Element>) {
        source.neighbors.append(destination)
    }
}

//works with any type
let cityGraph = Graph<String>()
let sanFrancisco = cityGraph.addVertex("San Francisco")
let oakland = cityGraph.addVertex("Oakland")
cityGraph.addEdge(from: sanFrancisco, to: oakland)
```

### Stacks and queues (Chapter 9)

```swift
//generic stack using an array
struct Stack<Element> {
    private var items: [Element] = []

    var isEmpty: Bool {
        return items.isEmpty
    }

    mutating func push(_ item: Element) {
        items.append(item)
    }

    mutating func pop() -> Element? {
        return items.popLast()
    }

    func peek() -> Element? {
        return items.last
    }
}

//generic queue
struct Queue<Element> {
    private var items: [Element] = []

    var isEmpty: Bool {
        return items.isEmpty
    }

    mutating func enqueue(_ item: Element) {
        items.append(item)
    }

    mutating func dequeue() -> Element? {
        return items.isEmpty ? nil : items.removeFirst()
    }
}

//usage
var intStack = Stack<Int>()
intStack.push(1)
intStack.push(2)
intStack.pop()  // returns 2

var taskQueue = Queue<String>()
taskQueue.enqueue("Task 1")
taskQueue.enqueue("Task 2")
taskQueue.dequeue()  // returns "Task 1"
```

## Performance considerations

One of the most powerful aspects of Swift's generics is that they provide flexibility without sacrificing performance.

### Compile-time type resolution

Swift resolves generic types at compile time through a process called **monomorphization**. The compiler generates specialized versions of generic code for each concrete type you use:

```swift
//you write this once
func printValue<T>(_ value: T) {
    print(value)
}

//you call it with different types
printValue(42)        // Int
printValue("Hello")   // String
printValue(3.14)      // Double

//compiler generates specialized versions (conceptually)
func printValue_Int(_ value: Int) { print(value) }
func printValue_String(_ value: String) { print(value) }
func printValue_Double(_ value: Double) { print(value) }
```

**Benefits of compile-time resolution:**
- No runtime type checking overhead
- Same performance as hand-written type-specific code
- Compiler optimizations work on specialized versions
- No boxing or unboxing of value types

### Zero-cost abstractions

Swift's generics are "zero-cost abstractions"—they provide high-level abstractions without runtime overhead:

```swift
//generic version
func sum<T: Numeric>(_ array: [T]) -> T {
    return array.reduce(0, +)
}

//specialized version the compiler might generate
func sum_Int(_ array: [Int]) -> Int {
    return array.reduce(0, +)
}

//both have identical performance characteristics
```

### When generics add overhead

There are specific scenarios where generics can introduce overhead:

**Protocol witness tables:**

When using protocol constraints extensively, Swift may need to use "witness tables" to dispatch method calls:

```swift
//may use protocol witness table
func process<T: Collection>(_ collection: T) {
    for item in collection {
        print(item)
    }
}
```

**Existential types:**

Using protocols as types (rather than generic constraints) can introduce overhead:

```swift
//generic - no overhead
func generic<T: Equatable>(_ value: T) { }

//existential - potential overhead
func existential(_ value: any Equatable) { }
```

In practice, this overhead is minimal and rarely a concern for most applications.

## When to use generics

Understanding when to use generics versus concrete types is an important design skill.

### Use generics when:

**You need type-safe code reuse:**
```swift
//instead of multiple versions, write once
struct Pair<T, U> {
    let first: T
    let second: U
}
```

**Building collection types:**
```swift
//all collections should be generic
class LinkedList<Element> { }
struct Stack<Element> { }
```

**Writing algorithms that work with any type:**
```swift
//sorting works with any Comparable type
func quicksort<T: Comparable>(_ array: [T]) -> [T] {
    // implementation
}
```

**API flexibility is important:**
```swift
//framework code that needs to work with user types
protocol DataStore {
    associatedtype Item
    func save(_ item: Item)
    func load() -> Item?
}
```

### Use concrete types when:

**The type will never vary:**
```swift
//if it's always String, don't make it generic
struct UserID {
    let value: String
}
```

**You need specific type features:**
```swift
//specific to UIView hierarchy
class CustomButton: UIButton {
    // UIButton-specific functionality
}
```

**Simplicity is more important than flexibility:**
```swift
//for internal implementation details
private struct ConfigData {
    let timeout: Int
    let retries: Int
}
```

**Performance-critical code with dynamic dispatch concerns:**
```swift
//when you need guaranteed static dispatch
final class PerformanceCritical {
    func process(_ data: [Int]) { }
}
```

## Common pitfalls

### Overusing generics

Not everything needs to be generic:

```swift
//bad - unnecessarily generic
func printMessage<T>(_ message: T) {
    print(message)
}

//good - just use String
func printMessage(_ message: String) {
    print(message)
}
```

### Missing constraints

Without proper constraints, you can't do much with generic types:

```swift
//too generic - can't do anything useful
func process<T>(_ value: T) {
    // what can we do with T? Only assignment and type checking
}

//better - constrain to enable useful operations
func process<T: CustomStringConvertible>(_ value: T) {
    print(value.description)  // now we can use description
}
```

### Ignoring type inference

Swift can often infer generic types, making code cleaner:

```swift
//verbose
let numbers = Array<Int>([1, 2, 3])

//better - type inferred from literal
let numbers = [1, 2, 3]

//explicit when helpful for clarity
let numbers: [Int] = [1, 2, 3]
```

## Building algorithmic intuition

As you work through the remaining chapters of this book, you'll see generics everywhere. They're not just a language feature—they're fundamental to how we think about algorithms and data structures in Swift.

### Generic patterns to recognize

**Container pattern:**
```swift
//wraps a value of any type
struct Box<T> {
    let value: T
}
```

**Transformation pattern:**
```swift
//converts from one type to another
func map<Input, Output>(_ value: Input, transform: (Input) -> Output) -> Output {
    return transform(value)
}
```

**Accumulation pattern:**
```swift
//combines multiple values into one result
func reduce<Element, Result>(_ array: [Element], initial: Result, combine: (Result, Element) -> Result) -> Result {
    var result = initial
    for element in array {
        result = combine(result, element)
    }
    return result
}
```

**Filtering pattern:**
```swift
//selects elements matching criteria
func filter<T>(_ array: [T], matching: (T) -> Bool) -> [T] {
    var result: [T] = []
    for element in array {
        if matching(element) {
            result.append(element)
        }
    }
    return result
}
```

### Connecting to future chapters

As you progress through this book, notice how generics enable each data structure:

- **Chapter 8 (Linked Lists)**: Generic nodes store any type
- **Chapter 9 (Stacks & Queues)**: Generic containers enable flexible data management
- **Chapter 10 (Binary Search Trees)**: Comparable constraint enables ordering
- **Chapter 11 (Graphs)**: Generic vertices represent any domain
- **Chapter 12 (Tries)**: Generic character-based structures
- **Chapter 13 (Hash Tables)**: Hashable constraint enables fast lookups
- **Chapter 14 (Heaps)**: Comparable constraint enables priority ordering

Understanding generics now will make these advanced topics much more accessible.

## Summary

Generics are one of Swift's most powerful features, enabling you to write flexible, reusable code while maintaining complete type safety and zero runtime overhead.

**Key takeaways:**

1. **Generics eliminate code duplication** while preserving type safety
2. **Type parameters** act as placeholders for actual types specified later
3. **Type constraints** let you require specific capabilities from generic types
4. **Three essential protocols** enable most generic operations:
   - `Equatable` for equality comparison
   - `Comparable` for ordering
   - `Hashable` for dictionary keys and sets
5. **Where clauses** provide fine-grained control over generic constraints
6. **Associated types** enable flexible protocol designs
7. **Compile-time resolution** means generics have zero performance overhead
8. **Every data structure** in this book uses generics

As you continue through the remaining chapters, you'll see generics in action across every algorithm and data structure. The patterns you've learned here—type parameters, constraints, and protocol conformance—form the foundation for understanding how modern Swift code is designed and implemented.

The power of generics isn't just in writing less code—it's in writing code that's simultaneously more flexible and more safe. This is the essence of Swift's design philosophy, and it will serve you well as you build increasingly sophisticated algorithms and data structures.

---

<div class="chapter-nav">
  <a href="06-recursion" class="prev">Previous Chapter</a>
  <a href="index">Table of Contents</a>
  <a href="08-linked-lists" class="next">Next Chapter</a>
</div>
