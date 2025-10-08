---
layout: chapter
title: "Chapter 11: Binary Search Trees"
description: "Build and traverse binary search trees"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>

# Binary Search Trees

A binary search tree (BST) is a data structure that stores information in a logical hierarchy. As demonstrated with Big O Notation, algorithms provide the best results with sorted data. Binary Search Trees extend this idea by using specific rules. A binary search tree (BST) should not be mistaken for a binary tree or trie. Those structures also store information in a hierarchy but employ different rules.

## How it works

A binary search tree comprises a key and two indicators. The key represents the data you would like to store, such as a string or scalar value. Typically represented with pointers, the indicators store the location (also called the address) of its two children. The left child contains a value that is smaller than its parent. Conversely, the right child contains a value greater than its parent.

## The data structure

Here's an example of a BST written in Swift. Using generics, the structure also stores any type of object and supports optional values. The concept of combining keys and pointers to create hierarchies not only applies to binary search trees but to other structures like tries and binary trees.

```swift
public class BST<T: Comparable> {
    var key: T?
    var left: BST<T>?
    var right: BST<T>?
}
```

When creating algorithms, it is good practice to use optionals for properties that might not have a value. Swift helps to enforce this best-practice at compile time through optionals. Along with our class declaration, the generic type constraint `<T: Comparable>` is also defined to ensure instances conform to a specific protocol.

## The logic

Here's an example of a simple array written in Swift. We'll use this data to build our binary search tree:

```swift
let numberList: [Int] = [8, 2, 10, 9, 11, 1, 7]
```

Here's the same list visualized as a balanced binary search tree. It does not matter that the values are unsorted. Rules governing the BST will place each node in its correct position accordingly.

## The model

Here's the class used for creating the BST hierarchy:

```swift
public class BST<T: Comparable> {
    var key: T?
    var left: BST<T>?
    var right: BST<T>?

    func append(element: T) {
        if let key = self.key {
            if element < key {
                if let left = self.left {
                    left.append(element: element)
                } else {
                    let newNode = BST<T>()
                    newNode.key = element
                    self.left = newNode
                }
            } else {
                if let right = self.right {
                    right.append(element: element)
                } else {
                    let newNode = BST<T>()
                    newNode.key = element
                    self.right = newNode
                }
            }
        } else {
            self.key = element
        }
    }
}
```

The `append` method applies sorting logic using recursion. While not required, recursion is a powerful enabler as each child becomes another instance of a BST. As a result, inserting data becomes a straightforward process of iterating through the array.

```swift
let numberList: [Int] = [8, 2, 10, 9, 11, 1, 7]

let root = BST<Int>()

for number in numberList {
    root.append(element: number)
}
```

## Efficiency

BSTs are powerful due to their consistent rules. However, their greatest advantage is speed. Since data is organized at the time of insertion, a clear pattern emerges. Values less than the root node (e.g., 8) will naturally filter to the left. Conversely, all values greater than the root will filter to the right.

As we saw with Big O Notation, our understanding of the data allows us to create an effective algorithm. So, for example, if we were searching for the value 7, it's only required that we traverse the left side of the BST. This is due to our search value being smaller than our root node (e.g., 8). Binary Search Trees typically provide O(log n) for insertion and lookup. Algorithms with an efficiency of O(log n) are said to run in logarithmic time.

## Searching the BST

Here's an example of how we might implement a search function in our BST:

```swift
func search(for value: T) -> Bool {
    if let key = self.key {
        if value == key {
            return true
        } else if value < key {
            return left?.search(for: value) ?? false
        } else {
            return right?.search(for: value) ?? false
        }
    }
    return false
}
```

## Practice problems

1. Implement a `delete` method for the BST class:

   Write a method that removes a given value from the BST while maintaining the BST property. Consider three cases:
   - Deleting a `leaf` node
   - Deleting a `node` with one child
   - Deleting a `node` with two children

2. Find the Lowest Common Ancestor (LCA) of two nodes:

   Given two values, find the lowest common ancestor in the BST. The lowest common ancestor is defined as the deepest node in the tree that is an ancestor of both nodes.

3. Validate BST:

   Write a method to determine if a given binary tree is a valid binary search tree. Remember that a BST's left subtree contains only nodes with keys less than the node's `key`, the right subtree contains only nodes with keys greater than the node's key, and both the `left` and `right` subtrees must also be binary search trees.
