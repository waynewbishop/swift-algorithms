---
layout: chapter
title: "Chapter 12: Tree Balancing"
description: "Maintain balanced binary search trees with AVL rotations"
---
# Tree Balancing

In [Chapter 11](11-binary-search-trees.md), you built binary search trees that achieve O(log n) search performance—but only when the tree remains balanced. When a tree becomes unbalanced, performance degrades to O(n), no better than searching a linked list. This chapter introduces AVL trees, a self-balancing BST variant that guarantees O(log n) performance regardless of insertion order.

The key insight: by tracking the height of each subtree and performing rotations when imbalances occur, we can maintain balance automatically. This transforms BSTs from good-on-average structures into guaranteed-efficient data structures suitable for production systems.

## The balance problem

Consider inserting sorted data into a BST from Chapter 11. Building a tree from `[1, 2, 3, 4, 5]` creates a degenerate case—every node has only a right child, forming a linked list. Searching for 5 requires examining all 5 nodes (O(n)), not the 3 comparisons (O(log 5) ≈ 2.3) a balanced tree would need.

This scenario isn't rare. Any monotonically increasing sequence (timestamps, auto-increment IDs, sorted imports) triggers worst-case behavior. Without balancing, BSTs become unreliable in real systems.

## AVL trees: Self-balancing BSTs

AVL trees extend BSTs with height tracking and automatic rebalancing. Named after inventors Adelson-Velsky and Landis (1962), AVL trees maintain a balance invariant: the height difference between left and right subtrees never exceeds 1.

To start, let's revisit our original example. Array values from `numberList` were used to build a tree. As shown, all elements had either one or two children - otherwise called leaf elements. This is known as a [balanced binary search tree](https://en.wikipedia.org/wiki/Self-balancing_binary_search_tree).

Our model achieved balance not only through usage of the BST append algorithm but also by the way keys were inserted. In reality, there could be numerous ways to populate a tree. Without considering other factors, this can produce unexpected results.

## Tracking height

To compensate for these imbalances, we need to expand the scope of our algorithm. In addition to left/right logic, we'll add a new property called `height`. Coupled with specific rules, we can use `height` to detect tree imbalances. To see how this works, let's create a new [AVL tree](https://en.wikipedia.org/wiki/AVL_tree):

```swift
// AVL tree node with height tracking for balance detection
class AVLTree<T: Comparable> {
    var key: T?
    var left: AVLTree?
    var right: AVLTree?
    var height: Int = 0

    // ... other properties and methods
}
```

To start, we add the root element. As the first item, left/right leaves don't yet exist, so they are initialized to `nil`. Arrows point from the leaf element to the root because they are used to calculate its height. For math purposes, the height of non-existent leaves are set to -1.

With a model in place, we can calculate the element's [height](https://en.wikipedia.org/wiki/Tree_(data_structure)#Terminology). This is done by comparing the height of each leaf, finding the largest value, then increasing that value by +1. For the root element, this equates to 0. In Swift, these rules can be represented as follows:

```swift
// Height calculation for AVL balance checking
extension AVLTree {
    // Retrieve height of a node (nil nodes have height -1)
    func getElementHeight(of element: AVLTree?) -> Int {
        element?.height ?? -1
    }

    // Calculate and set height based on children's heights
    mutating func setElementHeight() {
        guard key != nil else {
            print("No key provided.")
            return
        }

        height = max(getElementHeight(of: left), getElementHeight(of: right)) + 1
    }
}
```

## Measuring balance

With the root element established, we can proceed to add the next value. Upon implementing standard BST logic, item 26 is positioned as the left leaf node. As a new item, its height is also calculated (i.e., 0). However, since our model is a hierarchy, we traverse upwards to recalculate its parent height value.

With multiple elements present, we run an additional check to see if the BST is balanced. In most cases, a tree is considered balanced if the height difference between its leaf elements is less than 2. As shown below, even though no right-side items exist, our model is still valid.

```swift
// Example math for tree balance check
let rootVal = abs((0) - (-1)) // equals 1 (balanced)
let leafVal = abs((-1) - (-1)) // equals 0 (balanced)
```

In Swift, these elements can be checked with the `isTreeBalanced` method:

```swift
// Check if node maintains AVL balance property
extension AVLTree {
    func isTreeBalanced() -> Bool {
        guard key != nil else {
            print("No element provided.")
            return false
        }

        return abs(getElementHeight(of: left) - getElementHeight(of: right)) <= 1
    }
}
```

## Restoring balance through rotation

With 29 and 26 added, we can proceed to insert the final value (i.e., 23). Like before, we continue to traverse the left side of the tree. However, upon insertion, the math reveals node 29 violates the BST property. In other words, its subtree is no longer balanced.

```swift
// Example math for tree balance check
let rootVal = abs((1) - (-1)) // equals 2 (unbalanced)
```

For the tree to maintain its BST property, we need to change its performance from O(n) to O(log n). This can be achieved through a process called rotation. Since the model has more nodes to the left, we'll balance it by performing a right rotation sequence. Once complete, the new model will appear as follows.

As shown, we've been able to rebalance the BST by rotating the model to the right. Originally set as the root, node 29 is now positioned as the right leaf. In addition, node 26 has been moved to the root. In Swift, these changes can be achieved with the following:

```swift
// Right rotation to fix left-heavy imbalance - O(1) time
extension AVLTree {
    mutating func rightRotate() {
        guard let leftChild = left else { return }

        let newRoot = AVLTree(key: leftChild.key)
        newRoot.right = AVLTree(key: key)
        newRoot.left = leftChild.left

        newRoot.right?.right = right
        newRoot.right?.left = leftChild.right

        key = newRoot.key
        left = newRoot.left
        right = newRoot.right

        setElementHeight()
        right?.setElementHeight()
    }
}
```

Even though we undergo a series of steps, the process occurs in O(1) time. Meaning, its performance is unaffected by other factors such as number of leaf nodes, descendants, or tree height. In addition, even though we've completed a right rotation, similar steps could be implemented to resolve both left and right imbalances.

## Sort order preservation

With tree balancing, it is important to note that techniques like rotations improve performance but do not change tree output. For example, even though a right rotation changes the connections between nodes, the overall BST sort order is preserved. As a test, one can traverse a balanced and unbalanced BST comparing the same values and receive the same results. In our case, a simple depth-first search will produce the following:

```swift
// Sorted values from in-order traversal (same before and after rotation)
23, 26, 29
```

By implementing tree balancing techniques, we ensure that our binary search tree maintains its efficiency, providing consistent O(log n) [performance](https://en.wikipedia.org/wiki/Time_complexity#Logarithmic_time) for insertions, deletions, and searches, even as the tree grows and changes over time.
