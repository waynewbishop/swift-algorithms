# Recursion

In this series, we've examined object-oriented and functional programming techniques used to create algorithms and data structures. However another method to consider is recursion. In a nutshell, recursion is a specific technique that provides an indeterminate set of references to one's self. In this essay, we'll review the concept of recursion and will demonstrate how to write recursive code with Swift.

## How it works

Recursion is best understood when compared to traditional object-oriented programming. With most solutions, code is comprised of different objects that are often interchangeable. As such, programmers reference different objects (i.e., classes) to build a model. The recursive technique, however, builds a model with an object that refers to itself:

- **Traditional approach**: objects reference other objects
- **Recursive approach**: an objects refer to itself

## Class vs. struct

They are a few ways recursion can be expressed in Swift. If you are accustomed to C-based languages, an interesting differentiator is how Swift handles types. To date, many Swift objects are considered first-class citizens including structs and enums. As such, most operations normally reserved for a class can be replaced with a struct:

```swift
//simple struct example - methods & properties
struct Car {
    var color: String
    var make: String

    init(color: String, make: String) {
        self.color = color
        self.make = make
    }

    func buildCar() {
        print("a \(color) \(make) has been built..")
    }
}
```

Swift structs are lightweight components that act as value types. In contrast, classes in Swift are reference types. Because struct instances are copied (not referenced), they can't be used to build recursive data models:

```swift
//simple usable class
class LLNode<T> {
    var key: T?
    var previous: LLNode?
    var next: LLNode?
}

//gives compilation error
struct Tree<T> {
    var key: T?
    var left: Tree?
    var right: Tree?
}
```

## Functions

Recursion can also be seen with the popular Fibonacci sequence, the idea behind building a numerical sequence by adding the two preceding numbers. Let's compare a traditional and recursive technique:

```swift
//fibonacci sequence - traditional approach
extension Int {
    func fibNormal() -> Array<Int>! {
        //check trivial condition
        guard self > 2 else {
            return nil
        }

        //initialize the sequence
        var sequence: Array<Int> = [0, 1]
        var i: Int = sequence.count

        while i != self {
            let results: Int = sequence[i - 1] + sequence[i - 2]
            sequence.append(results)
            i += 1
        }

        return sequence
    }
}

//execute sequence
let positions: Int = 4
let results: Array<Int>! = positions.fibNormal()
```

```swift
//fibonacci sequence - recursive approach
extension Int {
    mutating func fibRecursive(_ sequence: Array<Int> = [0, 1]) -> Array<Int>! {
        var final = Array<Int>()

        //mutated copy
        var output = sequence

        //check trivial condition
        guard self > 2 else {
            return nil
        }

        let i: Int = output.count

        //set base condition
        if i == self {
            return output
        }

        let results: Int = output[i - 1] + output[i - 2]
        output.append(results)

        //set iteration
        final = self.fibRecursive(output)

        return final
    }
}

//execute sequence
var positions: Int = 4
let results: Array<Int>! = positions.fibRecursive()
```

Note the function differences. At first glance, we see fibRecursive employs a base-case and a call to one's self. To contrast, fibNormal maintains control logic in a while-loop. As shown, recursive logic often leads to increased complexity, as an entire class, function or method is often used as a control structure.

## Classes

While recursion tends to add complexity, consider the algorithm for depth-first search. As discussed in a previous essay, this code works in conjunction with the call stack to traverse a binary search tree. While it would be possible to refactor the algorithm to support an iterative technique, recursion provides an effective solution:

```swift
//recursive depth-first search
func traverse() {
    guard self.key != nil else {
        return
    }

    //process left side
    if self.left != nil {
        left?.traverse()
    }

    print("...node \(self.key!) visited..")

    //process the right side
    if self.right != nil {
        right?.traverse()
    }
}
```

## Enums

Like structs, many Swift objects act as first-class citizens, including enumerations. Like enums used in other languages, the enum type Algorithm is used to model behavior. The model will help manage four specific cases. The enum is said to be recursive because it contains associated values that are also of type Algorithm:

```swift
//recursive enumeration
indirect enum Algorithm<T> {
    case empty
    case elements(Array<T>)
    case insertionSort(Algorithm<T>)
    case bubbleSort(Algorithm<T>)
    case selectionSort(Algorithm<T>)
}
```

One goal of enums is to enhance code readability. In our case, we can use Algorithm to provide type-safety support for an implementation and can easily extend it to support additional scenarios:

```swift
//build an algorithm model
let numberList = Algorithm.elements([8, 2, 10, 9, 7, 5])
let model = Algorithm.insertionSort(numberList)
```
