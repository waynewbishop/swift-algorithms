---
layout: chapter
title: "Chapter 11: Binary Search Trees"
description: "Build and traverse binary search trees"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>

# Binary Search Trees

In [Chapter 10](10-stacks-and-queues.md), you built linear structures where elements connect in a single chain. Binary search trees (BST) extend this concept into hierarchical organization—each node can have up to two children, creating a tree structure. Like the recursive data structures from [Chapter 6](06-recursion.md), trees naturally enable recursive algorithms. But unlike linear structures, BSTs maintain sorted order that enables O(log n) search performance (from [Chapter 8](08-performance-analysis.md)), making them dramatically faster than linked lists for searching.

A [binary search tree](https://en.wikipedia.org/wiki/Binary_search_tree) stores information using a simple rule: values smaller than a node go left, values larger go right. This ordering property transforms an unsorted array into a searchable hierarchy where finding any element requires examining only a small fraction of the data.

## The BST structure

Here's the binary search tree structure. Using [generics](https://en.wikipedia.org/wiki/Generic_programming) from Chapter 7, it works with any comparable type:

```swift
// Binary search tree node with left and right children
public class BST<T: Comparable> {
    var key: T?
    var left: BST<T>?
    var right: BST<T>?
}
```

The `Comparable` constraint ensures elements can be compared using `<` and `>`, which is essential for determining left vs right placement. Each node contains a value (`key`) and optional pointers to left and right subtrees.

## Building a tree

Let's build a BST from an array. The insertion order doesn't matter—the BST rules place each value correctly:

```swift
// Example array to build BST
let numberList: [Int] = [8, 2, 10, 9, 11, 1, 7]
```


The tree organizes itself: 8 becomes the root, values less than 8 (2, 1, 7) filter left, values greater than 8 (10, 9, 11) filter right. This automatic organization enables fast searching.

## Inserting elements

The `append` method uses [recursion](https://en.wikipedia.org/wiki/Recursion_(computer_science)) to find the correct insertion point. Recall from Chapter 6 how recursion simplifies tree operations—each child is another BST, so we recursively call `append` on the appropriate subtree:

```swift
// Insert element into BST maintaining sort order - O(log n) average
public class BST<T: Comparable> {
    var key: T?
    var left: BST<T>?
    var right: BST<T>?

    func append(element: T) {
        if let key = self.key {
            if element < key {
                // Value is smaller - go left
                if let left = self.left {
                    left.append(element: element)
                } else {
                    let newNode = BST<T>()
                    newNode.key = element
                    self.left = newNode
                }
            } else {
                // Value is larger - go right
                if let right = self.right {
                    right.append(element: element)
                } else {
                    let newNode = BST<T>()
                    newNode.key = element
                    self.right = newNode
                }
            }
        } else {
            // Empty tree - this becomes root
            self.key = element
        }
    }
}
```

Building a tree is straightforward—iterate through the array and call `append`:

```swift
// Build BST from array
let root = BST<Int>()

for number in numberList {
    root.append(element: number)
}
```

The recursion in `append` mirrors the recursive structure of the tree itself. This is a key pattern you'll see throughout tree algorithms.

## Searching the tree

Searching exploits the BST property. If the target is smaller than the current node, search left. If larger, search right. If equal, you found it:

```swift
// Search for value in BST - O(log n) average
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

For a balanced tree with n elements, search examines only log₂(n) nodes. Searching 1,000 elements requires about 10 comparisons. This matches the binary search from Chapter 3, but BSTs maintain this efficiency even as elements are added and removed.

## Tree traversal

Building and searching trees is only half the story. Traversal algorithms visit every node in a specific order, enabling operations like printing sorted values, finding minimum/maximum, or calculating tree statistics.

### In-order traversal

In-order traversal visits nodes in sorted order: left subtree, current node, right subtree. This is the most common traversal for BSTs:

```swift
// In-order traversal produces sorted output - O(n)
func traverseInOrder(visit: (T) -> Void) {
    left?.traverseInOrder(visit: visit)
    if let key = key { visit(key) }
    right?.traverseInOrder(visit: visit)
}

// Print values in sorted order
root.traverseInOrder { value in
    print(value)
}
// Output: 1, 2, 7, 8, 9, 10, 11
```

The recursion pattern is elegant: process the left subtree, then the current node, then the right subtree. For our tree, this produces perfectly sorted output.

### Pre-order traversal

Pre-order traversal visits the current node first, then children: current node, left subtree, right subtree. This is useful for copying trees or serializing them:

```swift
// Pre-order traversal visits root first - O(n)
func traversePreOrder(visit: (T) -> Void) {
    if let key = key { visit(key) }
    left?.traversePreOrder(visit: visit)
    right?.traversePreOrder(visit: visit)
}

// Print values in pre-order
root.traversePreOrder { value in
    print(value)
}
// Output: 8, 2, 1, 7, 10, 9, 11
```

Pre-order gives you the root first, which is essential when you need to rebuild the tree structure.

### Post-order traversal

Post-order traversal visits children first, then the current node: left subtree, right subtree, current node. This is useful for deleting trees or performing calculations that depend on child results:

```swift
// Post-order traversal visits root last - O(n)
func traversePostOrder(visit: (T) -> Void) {
    left?.traversePostOrder(visit: visit)
    right?.traversePostOrder(visit: visit)
    if let key = key { visit(key) }
}

// Print values in post-order
root.traversePostOrder { value in
    print(value)
}
// Output: 1, 7, 2, 9, 11, 10, 8
```

Post-order ensures children are processed before parents, which is critical for operations like calculating tree height or safely deleting nodes.

## Finding minimum and maximum

The BST property makes finding extreme values trivial—minimum is the leftmost node, maximum is the rightmost:

```swift
// Find minimum value (leftmost node) - O(log n) average
func minimum() -> T? {
    if left == nil { return key }
    return left?.minimum()
}

// Find maximum value (rightmost node) - O(log n) average
func maximum() -> T? {
    if right == nil { return key }
    return right?.maximum()
}

// Usage
print("Min:", root.minimum()!)  // Output: 1
print("Max:", root.maximum()!)  // Output: 11
```

These operations traverse only one path from root to leaf, making them O(log n) for balanced trees.

## Performance analysis

BST performance depends on tree balance. A balanced tree has roughly equal numbers of nodes in left and right subtrees at each level:

| Operation | Balanced BST | Unbalanced BST |
|-----------|--------------|----------------|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |
| Traversal | O(n) | O(n) |
| Min/Max | O(log n) | O(n) |

**Why O(log n) for balanced trees?** Each comparison eliminates half the remaining nodes, just like binary search. A tree with 1,000 nodes has height ~10, requiring at most 10 comparisons.

**Why O(n) for unbalanced trees?** If you insert sorted data [1, 2, 3, 4, 5], the tree degenerates into a linked list—every node has only a right child. Searching becomes linear, no better than traversing a linked list from Chapter 9.

This is why tree balancing (Chapter 12) is critical for production use. Balanced trees guarantee O(log n) performance regardless of insertion order.

## Real-world applications

Binary search trees power systems requiring fast search with dynamic updates:

**Database indexing:** B-trees (a BST variant) index database tables, enabling fast queries while supporting inserts and deletes. Every SQL database uses tree-based indexes.

**File systems:** Directory structures are trees. The file system hierarchy on your computer is essentially a multi-way tree (each directory can have many children).

**Symbol tables:** Compilers use BSTs to store variables and their types during compilation. Fast lookup enables efficient semantic analysis.

**Autocomplete systems:** Tries (Chapter 13) extend the BST concept to efficiently store and search strings, powering autocomplete in search engines.

**When to use BSTs:**
- Need sorted data with dynamic inserts/deletes
- Want O(log n) search without array resizing costs
- Require ordered iteration (in-order traversal)
- Building more complex structures (tries, B-trees)

**When to avoid BSTs:**
- Need O(1) lookups (use hash tables from Chapter 14)
- Data rarely changes (use sorted array with binary search)
- Can't guarantee balanced insertions (need AVL/Red-Black trees from Chapter 12)

## Summary

Binary search trees organize data hierarchically using a simple rule: left children are smaller, right children are larger. This property enables fast searching while maintaining sorted order.

**Key characteristics:**
- Each node has at most two children (left and right)
- Left subtree contains values smaller than parent
- Right subtree contains values larger than parent
- Recursive structure enables elegant algorithms

**Core operations:**
- Insert: O(log n) average, places elements in correct position
- Search: O(log n) average, eliminates half the tree each comparison
- Traversal: O(n), visits all nodes in specific order
- Min/Max: O(log n) average, follows left/right edges

**Traversal types:**
- In-order: produces sorted output (left, root, right)
- Pre-order: root first (root, left, right)
- Post-order: root last (left, right, root)

**Performance depends on balance:**
- Balanced tree: O(log n) for search, insert, delete
- Unbalanced tree: O(n) worst case (degenerates to linked list)
- Sorted insertion creates worst case (all right children)

**Connections:**
- Builds on recursion (Chapter 6) for natural algorithm expression
- Achieves O(log n) performance discussed in Chapter 8
- Outperforms linked lists (Chapter 9) for searching
- Requires balancing (Chapter 12) to guarantee performance
- Foundation for tries (Chapter 13) and advanced data structures

Understanding BSTs is essential for recognizing when hierarchical organization beats linear structures. In Chapter 12, you'll see how AVL trees use rotations to maintain balance, ensuring O(log n) performance regardless of insertion order.

<div class="bottom-nav">
  <div class="nav-container">
    <a href="10-stacks-and-queues" class="nav-link prev">← Chapter 10: Stacks and Queues</a>
    <a href="index" class="nav-link toc">Table of Contents</a>
    <a href="12-tree-balancing" class="nav-link next">Chapter 12: Tree Balancing →</a>
  </div>
</div>
