# Generics

The popularity of Swift is mainly due to the many language features that make coding more friendly. Along with its simplified syntax, Swift borrows from the success of other languages to prevent common programming errors like null pointer exceptions and memory leaks. To contrast, its Objective-C predecessor has often been referred to as the wild west of code. Swift stands out from Objective-C as well as many other languages due to its extensive support for Generics. This chapter reviews the reasoning for this powerful design tool and provides concrete examples for its implementation.

## Building frameworks

As we've seen, data structures are the building blocks for organizing data. For example, linked lists, binary trees and queues provide a blueprint for data processing and analysis. Just like any well-designed program, data structures should also be designed for extensibility and reuse. To illustrate, assume you're building a simple service that lists a group of students. The data could be easily organized with a linked list and represented in the following manner:

```swift
//basic structure
class StudentNode {
    var key: Student?
    var next: StudentNode?
}
```

## The challenge

While this structure is descriptive and organized, it's not reusable. In other words, the structure is valid for listing students but is unable to manage any other type of data (e.g. teachers). The property Student is a class that may include specific properties such as name, schedule and grades. If you attempted to reuse the same StudentNode class to manage Teachers, this would cause a compiler type mismatch.

The problem could be solved through inheritance, but it still wouldn't meet our primary goal of class reuse. This is where generics helps. Generics allows us to build generic versions of data structures so they can be used in different ways.

## Applying generics

If you've reviewed the other topics in this series, you've already seen generics in action. In addition to data structures and algorithms, core Swift functions like arrays and dictionaries also make use of generics. Let's refactor the StudentNode to be reusable:

```swift
//refactored structure
class Person<T> {
    var key: T?
    var next: Person<T>?
}
```

We see several important changes with this revised structure. The class name StudentNode has been changed to something more general (e.g., Person). The syntax <T> seen after the class name is called a placeholder. With generics, values seen inside angled brackets (e.g., T) are declared variables. Once the placeholder T is established, it can be reused anywhere a class reference would be expected. In this example, we've replaced the class type Student with the generic placeholder T.

## The implementation

The power of generics can be now be seen through its implementation. With the class refactored, Person can now manage lists of Students, Teachers, or any other type we decide.

```swift
//a new student
var studentNode = Person<Student>()

//a new teacher
var teacherNode = Person<Teacher>()
```

## Generic functions

In addition to classes, generic functions can also be developed. As we saw in the previous sorting chapter, algorithms like insertionSort and bubbleSort rank sets of random numbers. Using a generic Array Element, these algorithms can support any type that conforms to the Comparable protocol. This includes Swift-based characters as well as numbers.

```swift 
extension Array where Element: Comparable {
    func insertionSort() -> Array<Element> {
        //check for trivial case
        guard self.count > 1 else {
            return self
        }
        
        //mutated copy
        var output: Array<Element> = self
        
        for primaryIndex in 0..<output.count {
            let key = output[primaryIndex]
            var secondaryIndex = primaryIndex
            
            while secondaryIndex > -1 {
                if key < output[secondaryIndex] {
                    //move to correct position
                    output.remove(at: secondaryIndex + 1)
                    output.insert(key, at: secondaryIndex)
                }
                secondaryIndex -= 1
            }
        }
        
        return output
    }
}

//execute sort
let letterList: Array<Character> = ["d", "b", "a", "c", "f", "e"]
let sortedLetters: Array<Character> = letterList.insertionSort()
print(sortedLetters) // Prints: ["a", "b", "c", "d", "e", "f"]
```

## Type constraints

While generics provide great flexibility, sometimes we need to place constraints on the types that can be used. Swift allows us to specify type constraints that limit the types that can be used with generics. Here's an example:

```swift
func findIndex<T: Equatable>(of valueToFind: T, in array:[T]) -> Int? {
    for (index, value) in array.enumerated() {
        if value == valueToFind {
            return index
        }
    }
    return nil
}
```

In this example, `T: Equatable` is a type constraint that requires `T` to conform to the `Equatable` protocol. This ensures that we can use the `==` operator to compare values of type `T`.

We can also use multiple constraints and where clauses for more complex requirements:

```swift
func processItems<T, U>(items: [T], with processor: U) where T: Codable, U: ItemProcessor {
    // Implementation here
}
```

## Generics with enums and structs

Generics aren't limited to classes and functions. They can also be used with enums and structs:

```swift
enum Result<T> {
    case success(T)
    case failure(Error)
}

struct Stack<Element> {
    private var items = [Element]()
    
    mutating func push(_ item: Element) {
        items.append(item)
    }
    
    mutating func pop() -> Element? {
        return items.popLast()
    }
}
```

## Type inference with generics

Swift's type inference system works well with generics, often allowing you to omit explicit type annotations:

```swift
let numbers = [1, 2, 3, 4, 5]
let doubledNumbers = numbers.map { $0 * 2 } // Type is inferred as [Int]

let stringLengths = ["hello", "world"].map { $0.count } // Type is inferred as [Int]
```

## Real-world examples

Generics are extensively used in the Swift standard library and iOS frameworks. Some examples include:

1. `Array<Element>`, `Dictionary<Key, Value>`, and `Set<Element>`
2. `Optional<Wrapped>`
3. `Result<Success, Failure>`

Let's explore each of these with practical examples:

1. `Array<Element>`, `Dictionary<Key, Value>`, and `Set<Element>`

These are fundamental collection types in Swift, all implemented using generics.

```swift
// Array example
let numbers: Array<Int> = [1, 2, 3, 4, 5]
let names: Array<String> = ["Alice", "Bob", "Charlie"]

// Dictionary example
let ages: Dictionary<String, Int> = ["Alice": 30, "Bob": 25, "Charlie": 35]

// Set example
let uniqueNumbers: Set<Int> = [1, 2, 3, 4, 5]

// You can also use the shorthand syntax:
let shorthandNumbers: [Int] = [1, 2, 3, 4, 5]
let shorthandAges: [String: Int] = ["Alice": 30, "Bob": 25, "Charlie": 35]
```

2. `Optional<Wrapped>`

Optionals are implemented as an enum with generics:

```swift
let possibleNumber: Optional<Int> = Optional.some(42)
// or more commonly:
let anotherPossibleNumber: Int? = 42

// Using optionals
func printNumber(_ number: Int?) {
    if let unwrapped = number {
        print("The number is \(unwrapped)")
    } else {
        print("There is no number")
    }
}

printNumber(possibleNumber)      // Prints: The number is 42
printNumber(nil)                 // Prints: There is no number
```

3. `Result<Success, Failure>`

The `Result` type is used for handling errors in a more expressive way:

```swift
enum NetworkError: Error {
    case badURL
    case noData
}

func fetchData(from urlString: String) -> Result<Data, NetworkError> {
    guard let url = URL(string: urlString) else {
        return .failure(.badURL)
    }
    
    // Simulating a network request
    if urlString.contains("example.com") {
        return .success(Data())
    } else {
        return .failure(.noData)
    }
}

// Using Result
let result = fetchData(from: "https://example.com/data")

switch result {
case .success(let data):
    print("Received \(data.count) bytes of data")
case .failure(let error):
    print("Failed to fetch data: \(error)")
}
```

These examples demonstrate how generics are used throughout Swift to create flexible, type-safe APIs. By understanding these patterns, you can leverage similar designs in your own code to create reusable, generic components. The use of generics in these standard library types allows for type-safe operations across various data types, enhancing code reliability and reducing the need for type casting.

## Conditional conformance

Swift 4.2 introduced conditional conformance, allowing a generic type to conform to a protocol only when its type arguments meet certain requirements:

```swift
extension Array: Equatable where Element: Equatable {
    static func == (lhs: Array<Element>, rhs: Array<Element>) -> Bool {
        guard lhs.count == rhs.count else { return false }
        for (left, right) in zip(lhs, rhs) {
            guard left == right else { return false }
        }
        return true
    }
}
```

This powerful feature allows you to provide protocol conformance for your generic types under specific conditions.

## Common pitfalls and how to avoid them

1. Overuse of generics: While generics are powerful, they can make code harder to read and understand if overused. Use them judiciously.

2. Forgetting type constraints: Without proper constraints, you might find yourself unable to perform certain operations on generic types.

3. Performance issues with value types: Be cautious when using generics with value types in performance-critical code. Consider using protocols with associated types instead.

4. Difficulty with type inference: In complex generic code, type inference might fail. In such cases, provide explicit type annotations to help the compiler.

## Exercises 

1. Implement a generic `Pair` struct that can hold two values of different types. Add a method to swap the values.

2. Create a generic `Result` enum with cases for success and failure. The success case should hold a value of a generic type, while the failure case should hold an `Error`.

3. Write a generic function that can find the minimum and maximum values in any collection of `Comparable` elements.

4. Implement a generic `Cache` class that can store any type of value for any type of key.

5. Design a generic `SafeArray` class that provides bounds-checked access to its elements. It should throw an error if an index is out of bounds.

6. Create a generic `Counter` class that can keep track of occurrences of any `Hashable` type. Include methods to increment, decrement, and get the count for a given item.