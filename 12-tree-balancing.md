---
layout: chapter
title: "Chapter 12: Tree Balancing"
description: "Maintain balanced binary search trees with AVL rotations"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>

# Tree Balancing

In the previous chapter, we saw how [binary search trees](glossary#binary-search-tree-bst) (BST) are used to manage data. With basic logic, an [algorithm](glossary#algorithm) can easily traverse a model, searching data in O(log n) [time](glossary#time-complexity). However, there are occasions when navigating a tree becomes inefficient, in some cases working at O(n) time. In this chapter, we will review those scenarios and introduce the concept of tree balancing.

## New models

To start, let's revisit our original example. Array values from `numberList` were used to build a tree. As shown, all elements had either one or two children - otherwise called leaf elements. This is known as a [balanced binary search tree](glossary#balanced-tree).

Our model achieved balance not only through usage of the BST append algorithm but also by the way keys were inserted. In reality, there could be numerous ways to populate a tree. Without considering other factors, this can produce unexpected results.

## New heights

To compensate for these imbalances, we need to expand the scope of our algorithm. In addition to left/right logic, we'll add a new property called `height`. Coupled with specific rules, we can use `height` to detect tree imbalances. To see how this works, let's create a new [AVL tree](glossary#avl-tree):

```swift
class AVLTree<T: Comparable> {
    var key: T?
    var left: AVLTree?
    var right: AVLTree?
    var height: Int = 0

    // ... other properties and methods
}
```

To start, we add the root element. As the first item, left/right leaves don't yet exist, so they are initialized to `nil`. Arrows point from the leaf element to the root because they are used to calculate its height. For math purposes, the height of non-existent leaves are set to -1.

With a model in place, we can calculate the element's [height](glossary#height-tree). This is done by comparing the height of each leaf, finding the largest value, then increasing that value by +1. For the root element, this equates to 0. In Swift, these rules can be represented as follows:

```swift
extension AVLTree {
    // Retrieve height
    func getElementHeight(of element: AVLTree?) -> Int {
        element?.height ?? -1
    }

    // Calculate height
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

## Adjusting the model

With 29 and 26 added, we can proceed to insert the final value (i.e., 23). Like before, we continue to traverse the left side of the tree. However, upon insertion, the math reveals node 29 violates the BST property. In other words, its subtree is no longer balanced.

```swift
// Example math for tree balance check
let rootVal = abs((1) - (-1)) // equals 2 (unbalanced)
```

For the tree to maintain its BST property, we need to change its performance from O(n) to O(log n). This can be achieved through a process called rotation. Since the model has more nodes to the left, we'll balance it by performing a right rotation sequence. Once complete, the new model will appear as follows.

As shown, we've been able to rebalance the BST by rotating the model to the right. Originally set as the root, node 29 is now positioned as the right leaf. In addition, node 26 has been moved to the root. In Swift, these changes can be achieved with the following:

```swift
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

## The results

With tree balancing, it is important to note that techniques like rotations improve performance but do not change tree output. For example, even though a right rotation changes the connections between nodes, the overall BST sort order is preserved. As a test, one can traverse a balanced and unbalanced BST comparing the same values and receive the same results. In our case, a simple depth-first search will produce the following:

```swift
// Sorted values from a traversal
23, 26, 29
```

By implementing tree balancing techniques, we ensure that our binary search tree maintains its efficiency, providing consistent O(log n) [performance](glossary#logarithmic-time-o-log-n) for insertions, deletions, and searches, even as the tree grows and changes over time.
