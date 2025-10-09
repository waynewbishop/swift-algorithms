# Generics

The introduction of Swift brings a new series of tools that make coding more friendly and expressive. Along with its simplified syntax, Swift borrows from the success of other languages to prevent common programming errors like null pointer exceptions and memory leaks.

To contrast, Objective-C has often been referred to as 'the wild west' of code. While extensive and powerful, many errors in Objective-C apps are discovered at runtime. This delay in error discovery is usually due to programming mistakes with memory management and type cast operations. For this essay, we'll review a new design technique called generics and will explore how this allows code to be more useful and type-safe.

## Building frameworks

As we've seen, data structures are the building blocks for organizing data. For example, linked lists, binary trees and queues provide a blueprint for data processing and analysis. Just like any well-designed program, data structures should also be designed for extensibility and reuse.

To illustrate, assume you're building a simple service that lists a group of students. The data could be easily organized with a linked list and represented in the following manner:

```swift
//basic structure
class StudentNode {
    var key: Student?
    var next: StudentNode?
}
```

> **NULL POINTER EXCEPTION**: In programming, null pointer exceptions occur when a portion of deallocated memory is referenced in a program or application - usually at runtime. Null exceptions are common in other non-Swift languages such as Objective-C, but can still occur in Swift-based programs through the use of implicit unwrapped optionals.

> **MEMORY LEAK**: When programming, a memory leak occurs when an application fails to reclaim the portion of a memory used by a variable. In development terms, we often say that portion of memory is unrecoverable or has "leaked". Prior to the concept of automatic reference counting (ARC), memory leaks were common in Objective-C based applications.

## The challenge

While this structure is descriptive and organized, it's not reusable. In other words, the structure is valid for listing students but is unable to manage any other type of data (e.g. teachers). The property Student is a class that may include specific properties such as name, schedule and grades. If you attempted to reuse the same StudentNode class to manage Teachers, this would cause a complier type mismatch.

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

We see several important changes with this revised structure. The class name StudentNode has been changed to something more general (e.g., Person). The syntax `<T>` seen after the class name is called a **placeholder**. With generics, values seen inside angled brackets (e.g., T) are declared variables. Once the placeholder T is established, it can be reused anywhere a class reference would be expected. In this example, we've replaced the class type Student with the generic placeholder T.

> **\<T\>**: When working with generic placeholders, note the variable T isn't a special reserved word in Swift but works as a regular declared variable. As a result, the value of T could easily be replaced with any letter of choice, including U, W or Y.

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
let results: Array<Int> = numberList.insertionSort()
```

## Generic extensions

Generics can also be applied to protocols. Similar to regular type extensions, their implementation can often been seen with protocol extensions. As seen in other languages, protocols help define rules (e.g. conformance) with particular objects. In Swift, these rules can be extended with their own implementation. Consider the following:

```swift
//sample protocol with extension
protocol Sortable {
    func isSorted<T: Comparable>(_ sequence: Array<T>) -> Bool
}

extension Sortable {
    func isSorted<T: Comparable>(_ sequence: Array<T>) -> Bool {
        //check trivial cases
        guard sequence.count <= 1 else {
            return true
        }

        var index = sequence.startIndex

        //compare sequence values
        while index < sequence.endIndex - 1 {
            if sequence[index] > sequence[sequence.index(after: index)] {
                return false
            }
            index = sequence.index(after: index)
        }

        return true
    }
}
```
