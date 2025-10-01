# Binary search trees

A binary search tree stores and sorts information in a tree-based hierarchy. As discussed in the Big O notation chapter, algorithms provide the best efficiency with sorted data. Binary search tree (BST) models are built using specific rules. They should not be mistaken for a binary tree or trie. Those structures also store information in a hierarchy, but employ different rules.

## How it works

A BST is comprised of a key and two indicators. The key represents data you would like to store, such as a string or scalar value. Typically represented with pointers, the indicators store the location (e.g., memory address) of its two children.

The left child contains a value that is smaller than its parent. Conversely, the right child contains a value greater than its parent. To keep track of multiple BSNode references, our data structure is also recursive:

```swift
//generic binary search tree node
class BSNode<T> {
    var key: T?
    var left: BSNode?
    var right: BSNode?
}
```

## The logic

Consider this basic array written in Swift. We'll use this unsorted data to build our binary search tree:

```swift
//simple array of unsorted integers
let numberList: Array<Int> = [8, 2, 10, 9, 11, 1, 7]
```

Here's the same list visualized as a balanced binary search tree. It does not matter that the array values are unsorted at the time of insertion. As shown, the rules governing the BST will place each node in its correct position accordingly:

*Balanced binary search tree - O (log n)*

## Adding elements

With the BSNode structure established, we can now use it to create a BST hierarchy. Along with our class declaration, the type constraint `<T: Comparable>` is also included to ensure generic data can be stored and compared:

```swift
class BSTree<T: Comparable> {
    var root = BSNode<T>()

    func append(element key: T) {
        //initialize root
        guard root.key != nil else {
            root.key = key
            root.height = 0
            return
        }

        //set initial indicator
        var current: BSNode<T> = root

        while current.key != nil {
            //check left side
            if key < current.key! {
                if current.left != nil {
                    current = current.left!
                } else {
                    //create new element
                    let childToAdd = BSNode<T>()
                    childToAdd.key = key
                    current.left = childToAdd
                    break
                }
            }

            //check right side
            if key > current.key! {
                if current.right != nil {
                    current = current.right!
                } else {
                    //create new element
                    let childToAdd = BSNode<T>()
                    childToAdd.key = key
                    current.right = childToAdd
                    break
                }
            }
        } //end while
    }
}
```

As shown, our append() method employs an iterative coding technique to store recursive BSNode instances. As a result, inserting data becomes a straightforward process:

```swift
let numberList: Array<Int> = [8, 2, 10, 9, 11, 1, 7]

//create a new BST instance
var bstree = BSTree<Int>()

//sort each item in the list
for number in numberList {
    bstree.append(number)
}
```

## Finding elements

Similar to the native Swift Array.contains() method, our BST model can also identify specific BSNodes:

```swift
//equality test - O(log n)
func contains(_ key: T) -> Bool {
    var current: BSNode<T>? = root

    while current != nil {
        guard let testkey = current?.key else {
            return false
        }

        //test match
        if testkey == key {
            return true
        }

        //check left side
        if key < testkey {
            if current?.left != nil {
                current = current?.left
                continue
            } else {
                return false
            }
        }

        //check right side
        if key > testkey {
            if current?.right != nil {
                current = current?.right
                continue
            } else {
                return false
            }
        }
    } //end while

    return false
}
```

## Efficiency

BST's are powerful due to their consistent rules. However, their greatest advantage is speed. Since data is organized at the time of insertion, a clear pattern emerges. Values less than the root node (e.g 8) will naturally filter to the left. Conversely, all values greater than the root will filter to the right.

As a result, our understanding of the data allows us to create an effective algorithm. So, for example, if we were searching for the value 7, it's only required that we traverse the left side of the BST. This is due to our search value being smaller than our root node (e.g 8). Binary Search Trees typically provide O(log n) for insertion and lookup. Algorithms with an efficiency of O(log n) are said to run in logarithmic time.

## Tree traversals

One of the most powerful features of binary search trees is the ability to traverse them in different orders. Tree traversal allows us to visit every node in the tree systematically, which is essential for operations like printing all values, copying the tree, or performing computations on all elements.

There are three fundamental ways to traverse a binary tree, each serving different purposes:

### In-order traversal

In-order traversal visits nodes in the following order: left subtree, current node, right subtree. For binary search trees, this produces values in sorted order.

```swift
extension BSTree {
    func inOrderTraversal() -> [T] {
        var result: [T] = []
        inOrderHelper(node: root, result: &result)
        return result
    }

    private func inOrderHelper(node: BSNode<T>?, result: inout [T]) {
        guard let node = node, node.key != nil else { return }

        //traverse left subtree
        inOrderHelper(node: node.left, result: &result)

        //visit current node
        if let key = node.key {
            result.append(key)
        }

        //traverse right subtree
        inOrderHelper(node: node.right, result: &result)
    }
}

//example usage
let bst = BSTree<Int>()
let numbers = [8, 3, 10, 1, 6, 14, 4, 7, 13]
for number in numbers {
    bst.append(element: number)
}

print("In-order traversal: \(bst.inOrderTraversal())")
//outputs: [1, 3, 4, 6, 7, 8, 10, 13, 14]
```

### Pre-order traversal

Pre-order traversal visits nodes in the order: current node, left subtree, right subtree. This is useful for creating a copy of the tree or generating a prefix expression.

```swift
extension BSTree {
    func preOrderTraversal() -> [T] {
        var result: [T] = []
        preOrderHelper(node: root, result: &result)
        return result
    }

    private func preOrderHelper(node: BSNode<T>?, result: inout [T]) {
        guard let node = node, node.key != nil else { return }

        //visit current node
        if let key = node.key {
            result.append(key)
        }

        //traverse left subtree
        preOrderHelper(node: node.left, result: &result)

        //traverse right subtree
        preOrderHelper(node: node.right, result: &result)
    }
}

print("Pre-order traversal: \(bst.preOrderTraversal())")
//outputs: [8, 3, 1, 6, 4, 7, 10, 14, 13]
```

### Post-order traversal

Post-order traversal visits nodes in the order: left subtree, right subtree, current node. This is useful for safely deleting all nodes in the tree or calculating directory sizes.

```swift
extension BSTree {
    func postOrderTraversal() -> [T] {
        var result: [T] = []
        postOrderHelper(node: root, result: &result)
        return result
    }

    private func postOrderHelper(node: BSNode<T>?, result: inout [T]) {
        guard let node = node, node.key != nil else { return }

        //traverse left subtree
        postOrderHelper(node: node.left, result: &result)

        //traverse right subtree
        postOrderHelper(node: node.right, result: &result)

        //visit current node
        if let key = node.key {
            result.append(key)
        }
    }
}

print("Post-order traversal: \(bst.postOrderTraversal())")
//outputs: [1, 4, 7, 6, 3, 13, 14, 10, 8]
```

### Level-order traversal (breadth-first)

Level-order traversal visits nodes level by level from top to bottom, left to right. This requires a queue data structure and is useful for printing the tree structure or finding the minimum depth.

```swift
extension BSTree {
    func levelOrderTraversal() -> [T] {
        guard root.key != nil else { return [] }

        var result: [T] = []
        var queue: [BSNode<T>] = [root]

        while !queue.isEmpty {
            let current = queue.removeFirst()

            if let key = current.key {
                result.append(key)
            }

            //add children to queue
            if let left = current.left, left.key != nil {
                queue.append(left)
            }
            if let right = current.right, right.key != nil {
                queue.append(right)
            }
        }

        return result
    }
}

print("Level-order traversal: \(bst.levelOrderTraversal())")
//outputs: [8, 3, 10, 1, 6, 14, 4, 7, 13]
```

### Understanding traversal applications

Each traversal method serves specific purposes:

- **In-order**: Perfect for getting sorted data from a BST
- **Pre-order**: Useful for copying trees or creating prefix expressions
- **Post-order**: Essential for safe deletion or calculating subtree properties
- **Level-order**: Ideal for understanding tree structure or finding shortest paths

These traversal methods demonstrate the recursive nature of trees and how the patterns we learned in Chapter 6 (Recursion) apply to real data structures.

## Tree balancing

Earlier in this chapter, we saw how binary search trees (BST's) are used to manage data. By applying basic logic, an algorithm can easily traverse a model, searching data in O(log n) time. However, there are occasions when navigating a tree becomes inefficient - in some cases working at O(n) time. In this essay, we will review those scenarios and introduce the concept of tree balancing.

### New models

To start, let's revisit our original example. Array values from numberList were used to build a tree. As shown, all nodes had either one or two children - otherwise called leaf elements. This is known as a balanced binary search tree.

*A balanced BST with 7 elements - O (log n)*

Our model achieved balance not only through usage of the BST append() algorithm, but also by the way keys were inserted. In reality, there could be numerous ways to populate a tree. Without considering other factors, this can produce unexpected results:

*An unbalanced "left-heavy" BST with 3 elements - O(n)*
*A 6-node BST with left and right imbalances - O(n)*

### New heights

To compensate for these imbalances, we need to expand the scope of our algorithm. In addition to "left and right" logic, we'll add a new property called height. Coupled with specific rules, we can use height to detect tree imbalances.

```swift
private func findHeight(of element: BSNode<T>?) -> Int {
    //check empty leaves
    guard let bsNode = element else {
        return -1
    }
    return bsNode.height
}

private func setHeight(for element: BSNode<T>) {
    //set leaf variables
    var elementHeight: Int = 0

    //do comparison and calculate height
    elementHeight = max(findHeight(of: element.left), findHeight(of: element.right)) + 1

    element.height = elementHeight
}
```

### Measuring balance

With the root element established, we can proceed to add the next value. Upon implementing standard BST logic, item 26 is positioned as the left leaf element. As a new item, its height is also calculated (i.e., 0). However, since our model is a hierarchy, we traverse upwards to recalculate its parent height value.

```swift
func isTreeBalanced(for element: BSNode<T>?) -> Bool {
    guard element?.key != nil else {
        print("no element provided..")
        return false
    }

    //use absolute value to manage right and left imbalances
    if (abs(findHeight(of: element?.left) - findHeight(of: element?.right)) <= 1) {
        return true
    } else {
        return false
    }
}
```

### Tree navigation

You may have noticed that to successfully apply our node balancing algorithms, we also need to determine how to traverse upwards in our BSNode hierarchy. If our BSTree was a recursive structure, we could utilize the in-memory call stack to automatically navigate to parent nodes. To achieve the same results in our iterative design, we'll store BSNode references using a Stack data structure. This technique is known as memoization:

```swift
class BSTree<T: Comparable> {
    private var elementStack = Stack<BSNode<T>>()

    func append(element key: T) {
        //set initial indicator
        var current: BSNode<T> = root

        while current.key != nil {
            //send reference of current item to stack
            self.push(element: &current)
            // ...
        }

        //calculate height and balance of call stack..
        self.rebalance()
    }

    //stack elements for later processing - memoization
    private func push(element: inout BSNode<T>) {
        elementStack.push(withKey: element)
    }

    //determine height and balance
    private func rebalance() {
        for _ in stride(from: elementStack.count, through: 1, by: -1) {
            //obtain generic stack node - by reference
            let current = elementStack.peek()

            guard let bsNode: BSNode<T> = current.key else {
                print("element reference not found..")
                continue
            }

            setHeight(for: bsNode)
            rotate(element: bsNode)

            //remove stacked item
            elementStack.pop()
        }
    }
}
```

In Swift, the memory address of variables can be shared as inout function parameters. As a result, when a BSNode reference is pushed to the Stack, the original variable can be updated without having to manage new copies of data.

### The results

With tree balancing, it is important to note that techniques like rotations improve performance, but do not change tree output. For example, even though a right rotation changes the connections between nodes, the overall BST sort order is preserved. As a test, one can traverse a balanced and unbalanced BST (comparing the same values) and receive the same results:

```swift
//sorted values from a traversal
23, 26, 29
```

