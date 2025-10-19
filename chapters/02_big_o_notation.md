# Big O Notation

Building a service that finds information quickly could mean the difference between project success and failure. For example, much of Google's success comes from algorithms that allow people to search vast amounts of data with great efficiency.

There are numerous ways to search and sort data. As a result, computer experts have devised a way for us to compare the efficiency of software algorithms regardless of computing device, memory or hard disk space. Asymptotic analysis is the process of describing the efficiency of algorithms as their input size (n) grows. In computer science, asymptotics are usually expressed in a common format known as **Big O Notation**.

## Making comparisons

To understand Big O Notation, one only needs to start comparing algorithms. In this example, we compare two techniques for searching values in a sorted array:

```swift
//array of sorted integers
var numberList : Array<Int> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

## Linear time

Our first approach employs a common "brute force" technique that involves looping through the entire array until we find a match. In Swift, this can be achieved with the following:

```swift
extension Array where Element: Comparable {
    func linearSearch(forElement key: Element) -> Bool {
        //check all possible values
        for number in self {
            if number == key {
                return true
            }
        }
        return false
    }
}

//execute search
let isFound: Bool = numberList.linearSearch(forElement: 8)
```

While this approach achieves our goal, each item contained in the set must be evaluated. A function like this is said to run in **linear time** because its speed is dependent on its input size. In other words, the algorithm becomes less efficient as its input size (n) grows.

> **BRUTE FORCE**: A situation where a programmer writes a solution without consideration of its algorithmic efficiency. In some cases, brute force solutions lack sophistication and perform operations in "linear time" - O(n) or greater.

## Logarithmic time

Our next approach uses a technique called binary search. With this method, we apply our knowledge about the data to help reduce our search criteria.

```swift
extension Array where Element: Comparable {
    mutating func binarySearch(forElement key: Element) -> Bool {
        var result = false

        //establish indices
        let min = self.startIndex
        let max = self.endIndex - 1
        let mid = self.midIndex()

        //check bounds
        if key > self[max] || key < self[min] {
            print("search value \(key) not found..")
            return false
        }

        //evaluate chosen number
        let n = self[mid]
        print(String(describing: n) + "value attempted..")

        if n > key {
            var slice = Array(self[min...mid - 1])
            result = slice.binarySearch(forElement: key)
        }
        else if n < key {
            var slice = Array(self[mid + 1...max])
            result = slice.binarySearch(forElement: key)
        }
        else {
            print("search value \(key) found..")
            result = true
        }

        return result
    }

    //returns middle index
    func midIndex() -> Index {
        return startIndex + (count / 2)
    }
}

//execute search
let isFound: Bool = numberList.binarySearch(forElement: 8)
```

To recap, we know we're searching a sorted Array to find a specific value. By applying our understanding of data, we assume there is no need to search values less than the key. For example, to find the value at array index 8, it would be impossible to find that value at array index 0 - 7.

By applying this logic we substantially reduce the amount of times the Array is checked. This type of search is said to work in **logarithmic time** and is represented with the symbol O(log n). Overall, its complexity is minimized when the size of its inputs (n) grows.

## Performance comparison

Plotted on a graph, it's easy to compare the running time of popular search and sorting techniques. Here, we can see how most algorithms have relatively equal performance with small datasets. It's only when we apply large datasets that we're able to see clear differences.

Algorithms that perform at a constant rate (regardless of input size) are said to perform at **constant time - O(1)**. As we'll see, hash tables are often cited as an important data structure for managing constant time operations. Simple matching and/or comparison techniques often occur in polynomial time, or O(n²).

> **CONSTANT TIME**: A term used when evaluating algorithms that always perform a "constant" speed, regardless of their input size. Common algorithms that perform constant time operations include Stacks & Hash Tables.

## Algorithmic thinking

Algorithms, like design patterns, are based on their approach. As a result, almost any technique can be used to solve a problem. The real benefit is knowing **why** one technique is preferred over another.

Knowledge of Big-O Notation is the first step towards acquiring "algorithmic thinking". Since there are usually multiple ways to solve a problem, being able to analyze and ultimately refine an approach will allow one to create both efficient and effective solutions.
