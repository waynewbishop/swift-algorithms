---
layout: chapter
title: "Chapter 10: Binary Search Trees"
description: "Build and traverse binary search trees"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


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

[diagram: Balanced binary search tree with 7 elements showing O(log n) structure]

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

## Understanding BST performance: When O(log n) becomes O(n)

Binary search trees provide excellent O(log n) performance for search, insertion, and deletion—but only when balanced. Let's understand what this means and why it matters.

### The problem: Unbalanced trees

Consider inserting values in sorted order:

```swift
let bst = BSTree<Int>()
for value in [1, 2, 3, 4, 5, 6, 7] {
    bst.append(element: value)
}
```

**This creates a degenerate tree:**

[diagram: Unbalanced BST resembling a linked list - all nodes in a straight line from 1 to 7]

This is essentially a linked list! Searching for 7 now requires 7 comparisons instead of 3.

**Balanced tree (O(log n)):**

[diagram: Balanced BST with 4 at root, showing proper tree structure]

Search for 7: 3 comparisons (4 → 6 → 7)

**Unbalanced tree (O(n)):**

[diagram: Linear chain of nodes 1 through 7]

Search for 7: 7 comparisons

### Why balance matters

| Tree State | Search | Insert | Delete | Why |
|------------|--------|--------|--------|-----|
| Balanced | O(log n) | O(log n) | O(log n) | Height is log₂(n) |
| Unbalanced | O(n) | O(n) | O(n) | Height is n |

**Performance comparison (1000 nodes):**
- Balanced tree: ~10 comparisons (log₂1000 ≈ 10)
- Unbalanced tree: ~1000 comparisons (worst case)

### Self-balancing trees: The solution

The solution is **self-balancing binary search trees**, which automatically maintain balance:

**Common self-balancing BST types:**

1. **AVL Trees**
   - Strictly balanced (height difference ≤ 1)
   - Faster searches than Red-Black trees
   - More rotations during insertion/deletion
   - Best when: reads >> writes

2. **Red-Black Trees**
   - Looser balance guarantees
   - Fewer rotations than AVL
   - Used in: Swift's standard library internals, Java's TreeMap
   - Best when: writes are frequent

3. **Splay Trees**
   - Recently accessed items move to root
   - Best when: access patterns have locality

### The balancing concept

Self-balancing trees use **rotations** to restructure themselves:

**Right rotation:**

[diagram: BST right rotation showing before and after states]

**Left rotation:**

[diagram: BST left rotation showing before and after states]

These rotations preserve the BST property (left < parent < right) while reducing height.

### Should you implement balancing?

**For learning and interviews:** Understanding the concept is essential

**For production code:**
- **Use Swift's built-in collections** (Dictionary, Set) - they handle balancing internally
- **Don't implement AVL/Red-Black trees yourself** unless you have a very specific need
- Swift's standard library is highly optimized and battle-tested

### When basic BST is sufficient

Basic BST without balancing works well when:
- Data is inserted in random order (naturally balanced)
- Tree is built once and read many times
- Dataset is small (< 100 elements)
- You're learning the fundamentals

**Example: Configuration tree built once:**
```swift
let settings = BSTree<String>()
// Insert settings in random order - naturally balanced
settings.append(element: "theme")
settings.append(element: "notifications")
settings.append(element: "autosave")
// Tree is read-only after construction
```

## Advanced topic: Implementing AVL tree rotations

*Note: This section covers advanced material. Understanding the concept is more important than implementing it yourself.*

If you're interested in how self-balancing works, here's a conceptual overview:

**Key components:**

1. **Height tracking:** Each node stores its height
   ```swift
   class AVLNode<T> {
       var key: T?
       var left: AVLNode?
       var right: AVLNode?
       var height: Int = 0  // Track height for balance
   }
   ```

2. **Balance factor:** Difference between left and right heights
   ```swift
   func balanceFactor(of node: AVLNode<T>?) -> Int {
       let leftHeight = node?.left?.height ?? -1
       let rightHeight = node?.right?.height ?? -1
       return leftHeight - rightHeight
   }
   ```

3. **Rebalancing:** After insertion, check balance and rotate if needed
   ```swift
   func rebalance(_ node: AVLNode<T>) {
       let balance = balanceFactor(of: node)

       if balance > 1 {
           // Left-heavy - may need right rotation
       } else if balance < -1 {
           // Right-heavy - may need left rotation
       }
   }
   ```

For production implementations, libraries like C++'s `std::map` and Java's `TreeMap` use Red-Black trees because they're simpler to implement correctly and perform well in practice.

## Summary

Binary search trees organize data hierarchically, providing efficient search, insertion, and deletion:

**Core concepts:**
- **BST property**: Left child < parent < right child
- **Recursive structure**: Each subtree is itself a BST
- **Generic implementation**: Works with any `Comparable` type

**Operations:**
- Insert: O(log n) when balanced, O(n) worst case
- Search: O(log n) when balanced, O(n) worst case
- Traversals: In-order (sorted), pre-order, post-order, level-order

**Tree traversals:**
- **In-order**: Produces sorted output from BST
- **Pre-order**: Used for copying trees
- **Post-order**: Used for safe deletion
- **Level-order**: Shows tree structure

**Balance matters:**
- **Balanced tree**: Height is log₂(n) → O(log n) operations
- **Unbalanced tree**: Height is n → O(n) operations (like linked list)
- **Self-balancing trees** (AVL, Red-Black) automatically maintain balance

**When to use BST:**
- Need sorted data structure
- Frequent insertions and searches
- Range queries (find all values between x and y)
- Learning tree concepts

**When to use alternatives:**
- Array: Need random access, small dataset
- **Hash table**: Only need exact matches, not ranges
- **Swift Dictionary/Set**: Production code—optimized and balanced internally

**Real-world applications:**
- Database indexing
- File system directories
- Expression parsing
- Auto-complete systems
- Game AI decision trees

Understanding BSTs is fundamental to computer science and provides the foundation for more complex tree structures like heaps (Chapter 14) and tries (Chapter 12).


---

<div class="chapter-nav">
  <a href="09-stacks-and-queues" class="prev">Previous Chapter</a>
  <a href="index">Table of Contents</a>
  <a href="11-graphs" class="next">Next Chapter</a>
</div>
