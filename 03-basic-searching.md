---
layout: chapter
title: "Chapter 3: Basic Searching"
description: "Learn linear and binary search algorithms in Swift"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>

# Basic searching

In our exploration of Big O Notation, we introduced the concept of linear search to demonstrate O(n) complexity. Now that you understand how algorithmic efficiency scales with input size, we can dive deeper into the fundamental problem of searching for data. Whether you're building a contact app, a music library, or any system that manages information, search functionality is essential.

The art of searching efficiently is one of the most important skills in computer science.

In this chapter, we'll explore two fundamental approaches to finding data and understand when each method is most appropriate.

## The search problem

At its core, searching involves answering a simple question: "Is this item in my collection?" However, the method you choose to answer this question can mean the difference between a lightning-fast response and a painfully slow operation.

Consider these real-world scenarios:
- Finding a contact in your phone's address book
- Locating a book in a library catalog
- Searching for a word in a dictionary
- Looking up a player's statistics in a sports database

Each scenario involves the same fundamental challenge, but the optimal approach depends on how the data is organized.

## Linear search - The brute force approach

We've already encountered linear search in our Big O chapter, but let's examine it more thoroughly. Linear search represents the most straightforward approach to finding data: check every item until you find what you're looking for.

```swift
extension Array where Element: Equatable {
    func linearSearch(for target: Element) -> Int? {

        for (index, element) in enumerated() {
            if element == target {
                return index
            }
        }

        return nil
    }
}

//test with unsorted data
let numbers = [64, 34, 25, 12, 22, 11, 90, 5]
if let index = numbers.linearSearch(for: 22) {
    print("Found 22 at index \(index)")
} else {
    print("22 not found")
}
```

### When linear search shines

Linear search has several advantages that make it valuable in certain situations:

1. **Works with any data** - Sorted or unsorted, it doesn't matter
2. **Simple to implement** - Minimal chance of bugs
3. **Consistent performance** - No best or worst case surprises
4. **Memory efficient** - Uses no additional storage

### Linear search performance analysis

As we learned in the Big O chapter, linear search operates in O(n) time. But let's break down what this means in practice:

```swift
func analyzedLinearSearch<T: Equatable>(for target: T, in array: [T]) -> (index: Int?, comparisons: Int) {
    var comparisons = 0

    for (index, element) in array.enumerated() {
        comparisons += 1
        if element == target {
            return (index, comparisons)
        }
    }

    return (nil, comparisons)
}

let testData = [5, 2, 8, 6, 1, 9, 4, 0, 3, 7]

//best case: target is first element
let (_, bestCase) = analyzedLinearSearch(for: 5, in: testData)
print("Best case: \(bestCase) comparisons")

//average case: target in middle
let (_, avgCase) = analyzedLinearSearch(for: 1, in: testData)
print("Average case: \(avgCase) comparisons")

//worst case: target not found
let (_, worstCase) = analyzedLinearSearch(for: 15, in: testData)
print("Worst case: \(worstCase) comparisons")
```

This analysis reveals that while linear search is O(n) in the worst case, real-world performance varies significantly based on where the target is located.

## Binary search - The divide and conquer strategy

When the data is sorted, you can employ a much more efficient strategy. Binary search uses the divide and conquer approach, eliminating half of the remaining possibilities with each comparison.

### The phone book analogy

Imagine you're looking for "Smith" in a physical phone book. You wouldn't start from page 1 and flip through every page. Instead, you'd:

1. Open to the middle of the book
2. See if "Smith" comes before or after the names on that page
3. Eliminate half the book and repeat the process
4. Continue until you find "Smith" or determine it's not there

This intuitive process is exactly how binary search works.

### Binary search implementation

```swift
extension Array where Element: Comparable {
    func binarySearch(for target: Element) -> Int? {
        var leftIndex = 0
        var rightIndex = count - 1

        while leftIndex <= rightIndex {
            let middleIndex = (leftIndex + rightIndex) / 2
            let middleValue = self[middleIndex]

            if middleValue == target {
                return middleIndex
            } else if middleValue < target {
                //target is in right half
                leftIndex = middleIndex + 1
            } else {
                //target is in left half
                rightIndex = middleIndex - 1
            }
        }

        return nil
    }
}

//test with sorted data
let sortedNumbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]
if let index = sortedNumbers.binarySearch(for: 17) {
    print("Found 17 at index \(index)")
} else {
    print("17 not found")
}
```

### Understanding binary search performance

Binary search achieves O(log n) time complexity. This logarithmic performance means that doubling the data size only adds one more step to the search process.

```swift
func analyzedBinarySearch<T: Comparable>(for target: T, in array: [T]) -> (index: Int?, comparisons: Int) {
    var comparisons = 0
    var leftIndex = 0
    var rightIndex = array.count - 1

    while leftIndex <= rightIndex {
        comparisons += 1
        let middleIndex = (leftIndex + rightIndex) / 2
        let middleValue = array[middleIndex]

        print("Step \(comparisons): Checking index \(middleIndex) (value: \(middleValue))")

        if middleValue == target {
            return (middleIndex, comparisons)
        } else if middleValue < target {
            leftIndex = middleIndex + 1
        } else {
            rightIndex = middleIndex - 1
        }
    }

    return (nil, comparisons)
}

let largeSortedArray = Array(1...1000)
let (foundIndex, steps) = analyzedBinarySearch(for: 750, in: largeSortedArray)
print("Found 750 at index \(foundIndex ?? -1) in \(steps) steps")
```

### The power of logarithmic time

The efficiency of binary search becomes remarkable with large datasets.

**Note:** These numbers represent the maximum comparisons needed in the worst-case scenario:

| Array Size | Linear Search (worst) | Binary Search (worst) |
|------------|----------------------|----------------------|
| 100 | 100 comparisons | 7 comparisons |
| 1,000 | 1,000 comparisons | 10 comparisons |
| 10,000 | 10,000 comparisons | 14 comparisons |
| 1,000,000 | 1,000,000 comparisons | 20 comparisons |

This table demonstrates why binary search is preferred for large, sorted datasets. The logarithmic growth means that even massive collections can be searched in a reasonable number of steps.

## The crucial requirement: Sorted data

Binary search's efficiency comes with an important prerequisite: the data must be sorted. This requirement influences how you design your data management strategy.

```swift
//demonstrating the sorted data requirement
let unsortedData = [64, 34, 25, 12, 22, 11, 90, 5]
let sortedData = unsortedData.sorted()

//binary search on unsorted data may give incorrect results
print("Searching unsorted data for 22:")
if let index = unsortedData.binarySearch(for: 22) {
    print("Binary search claims 22 is at index \(index)")
    print("But actually 22 is at index \(unsortedData.firstIndex(of: 22)!)")
} else {
    print("Binary search couldn't find 22 in unsorted data")
}

//binary search on sorted data works correctly
print("\nSearching sorted data for 22:")
if let index = sortedData.binarySearch(for: 22) {
    print("Found 22 at index \(index) in sorted array")
}
```

## Choosing the right search strategy

The decision between linear and binary search depends on several factors:

### Use linear search when:
- **Data is unsorted** and sorting is expensive
- **Small datasets** where the overhead of sorting isn't worth it
- **Frequently changing data** where maintaining sorted order is costly
- **Simple implementation** is more important than optimal performance

### Use binary search when:
- **Data is already sorted** or you can afford to sort it
- **Large datasets** where the logarithmic advantage is significant
- **Read-heavy operations** where searches are more frequent than modifications
- **Performance is critical** and you can maintain sorted order

## Practical considerations

### When sorting pays off

Consider a contact application where users frequently search for names but rarely add new contacts. Sorting the contacts once and using binary search for all subsequent lookups would be more efficient than using linear search repeatedly.

```swift
//simulation of contact searching
struct Contact {
    let name: String
    let phone: String
}

extension Contact: Comparable {
    static func < (lhs: Contact, rhs: Contact) -> Bool {
        return lhs.name < rhs.name
    }

    static func == (lhs: Contact, rhs: Contact) -> Bool {
        return lhs.name == rhs.name
    }
}

class ContactManager {
    private var contacts: [Contact] = []

    func addContact(_ contact: Contact) {
        contacts.append(contact)
        //keep contacts sorted for efficient searching
        contacts.sort { $0.name < $1.name }
    }

    func findContact(named name: String) -> Contact? {
        let searchContact = Contact(name: name, phone: "")

        if let index = contacts.binarySearch(for: searchContact) {
            return contacts[index]
        }

        return nil
    }
}
```

### Memory vs. time trade-offs

Sometimes you might maintain both sorted and unsorted versions of your data, trading memory for faster access patterns:

```swift
class OptimizedDataStore<T: Comparable> {
    private var insertionOrder: [T] = []  //for maintaining order of addition
    private var sortedData: [T] = []      //for fast searching

    func add(_ item: T) {
        insertionOrder.append(item)

        //insert into sorted position
        let insertIndex = sortedData.binarySearchInsertionPoint(for: item)
        sortedData.insert(item, at: insertIndex)
    }

    func search(for item: T) -> Bool {
        return sortedData.binarySearch(for: item) != nil
    }

    func itemsInOrder() -> [T] {
        return insertionOrder
    }
}

extension Array where Element: Comparable {
    func binarySearchInsertionPoint(for target: Element) -> Int {
        var leftIndex = 0
        var rightIndex = count

        while leftIndex < rightIndex {
            let middleIndex = (leftIndex + rightIndex) / 2

            if self[middleIndex] < target {
                leftIndex = middleIndex + 1
            } else {
                rightIndex = middleIndex
            }
        }

        return leftIndex
    }
}
```

## Looking ahead

Understanding linear and binary search provides the foundation for more advanced searching techniques. In upcoming chapters, we'll explore:

- **Hash tables** - Achieving average O(1) search time
- **Tree structures** - Combining the benefits of sorted data with efficient insertions
- **Graph algorithms** - Searching through connected data structures

The principles you've learned here - understanding the trade-offs between different approaches, analyzing performance characteristics, and choosing the right tool for the job - will guide you through these more complex topics.

## Building search intuition

As you encounter searching problems in your own projects, ask yourself:

1. **How often will I search compared to modify?** - Frequent searches favor sorted data
2. **How large is my dataset?** - Larger datasets benefit more from binary search
3. **Can I maintain sorted order efficiently?** - Consider the cost of keeping data sorted
4. **What are my performance requirements?** - Sometimes "good enough" is actually good enough

These questions will help you choose the most appropriate searching strategy for your specific use case.


