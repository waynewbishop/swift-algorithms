---
layout: chapter
title: "Chapter 11: Binary Search Trees"
description: "Build and traverse binary search trees"
---
# Binary Search Trees

Your fitness app tracks 10,000 personal records across different distances. Finding your 5K PR from a linked list: traverse all 10,000. From a binary search tree: check ~14 nodes. Same data, 700× faster. This is the power of hierarchical organization.

In [Chapter 10](10-stacks-and-queues.md), you built linear structures where elements connect in a single chain. Binary search trees (BST) extend this concept into hierarchical organization—each node can have up to two children, creating a tree structure. Like the recursive data structures from [Chapter 6](06-recursion.md), trees naturally enable recursive algorithms. But unlike linear structures, BSTs maintain sorted order that enables O(log n) search performance (from [Chapter 8](08-performance-analysis.md)), making them dramatically faster than linked lists for searching.

A [binary search tree](https://en.wikipedia.org/wiki/Binary_search_tree) stores information using a simple rule: values smaller than a node go left, values larger go right. This ordering property transforms an unsorted collection into a searchable hierarchy where finding any element requires examining only a small fraction of the data.

## The BST structure

Here's the binary search tree structure. Using [generics](https://en.wikipedia.org/wiki/Generic_programming) from [Chapter 7](07-generics.md), it works with any comparable type:

```swift
// Binary search tree node with left and right children
public class BST<T: Comparable> {
    var tvalue: T?  // 'tvalue' means 'typed value' (matches production BSNode)
    var left: BST<T>?
    var right: BST<T>?
}
```

The `Comparable` constraint ensures elements can be compared using `<` and `>`, which is essential for determining left vs right placement. Each node contains a value (`tvalue`) and optional pointers to left and right subtrees.

## Building a tree

Let's build a BST from an array. The insertion order doesn't matter—the BST rules place each value correctly:

```swift
// Example array to build BST
let numberList: [Int] = [8, 2, 10, 9, 11, 1, 7]
```


The tree organizes itself: 8 becomes the root, values less than 8 (2, 1, 7) filter left, values greater than 8 (10, 9, 11) filter right. This automatic organization enables fast searching.

## Inserting elements

The `append` method uses [recursion](https://en.wikipedia.org/wiki/Recursion_(computer_science)) to find the correct insertion point. Recall from [Chapter 6](06-recursion.md) how recursion simplifies tree operations—each child is another BST, so we recursively call `append` on the appropriate subtree:

```swift
// Insert element into BST maintaining sort order - O(log n) average
public class BST<T: Comparable> {
    var tvalue: T?  // 'tvalue' means 'typed value'
    var left: BST<T>?
    var right: BST<T>?

    func append(element: T) {
        if let tvalue = self.tvalue {
            if element < tvalue {
                // Value is smaller - go left
                if let left = self.left {
                    left.append(element: element)
                } else {
                    let newNode = BST<T>()
                    newNode.tvalue = element
                    self.left = newNode
                }
            } else {
                // Value is larger - go right
                if let right = self.right {
                    right.append(element: element)
                } else {
                    let newNode = BST<T>()
                    newNode.tvalue = element
                    self.right = newNode
                }
            }
        } else {
            // Empty tree - this becomes root
            self.tvalue = element
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

The recursion in `append` mirrors the recursive structure of the tree itself. This is a key pattern we'll see throughout tree algorithms.

## Searching the tree

Searching exploits the BST property. If the target is smaller than the current node, search left. If larger, search right. If equal, we found it:

```swift
// Search for value in BST - O(log n) average
func search(for value: T) -> Bool {
    if let tvalue = self.tvalue {
        if value == tvalue {
            return true
        } else if value < tvalue {
            return left?.search(for: value) ?? false
        } else {
            return right?.search(for: value) ?? false
        }
    }
    return false
}
```

For a balanced tree with n elements, search examines only log₂(n) nodes. Searching 1,000 workout records requires about 10 comparisons. Searching 10,000 records requires about 14 comparisons. This matches the binary search from [Chapter 3](03-basic-searching.md), but BSTs maintain this efficiency even as elements are added and removed—perfect for fitness apps where users constantly log new workouts while querying historical data.

## Tree traversal

Building and searching trees is only half the story. Traversal algorithms visit every node in a specific order, enabling operations like printing sorted values, finding minimum/maximum, or calculating tree statistics.

### In-order traversal

In-order traversal visits nodes in sorted order: left subtree, current node, right subtree. This is the most common traversal for BSTs:

```swift
// In-order traversal produces sorted output - O(n)
func traverseInOrder(visit: (T) -> Void) {
    left?.traverseInOrder(visit: visit)
    if let tvalue = tvalue { visit(tvalue) }
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
    if let tvalue = tvalue { visit(tvalue) }
    left?.traversePreOrder(visit: visit)
    right?.traversePreOrder(visit: visit)
}

// Print values in pre-order
root.traversePreOrder { value in
    print(value)
}
// Output: 8, 2, 1, 7, 10, 9, 11
```

Pre-order gives you the root first, which is essential when we need to rebuild the tree structure.

### Post-order traversal

Post-order traversal visits children first, then the current node: left subtree, right subtree, current node. This is useful for deleting trees or performing calculations that depend on child results:

```swift
// Post-order traversal visits root last - O(n)
func traversePostOrder(visit: (T) -> Void) {
    left?.traversePostOrder(visit: visit)
    right?.traversePostOrder(visit: visit)
    if let tvalue = tvalue { visit(tvalue) }
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
    if left == nil { return tvalue }
    return left?.minimum()
}

// Find maximum value (rightmost node) - O(log n) average
func maximum() -> T? {
    if right == nil { return tvalue }
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

**Why O(n) for unbalanced trees?** If we insert sorted data [1, 2, 3, 4, 5], the tree degenerates into a linked list—every node has only a right child. Searching becomes linear, no better than traversing a linked list from [Chapter 9](09-linked-lists.md).

This is why tree balancing ([Chapter 12](12-tree-balancing.md)) is critical for production use. Balanced trees guarantee O(log n) performance regardless of insertion order.

## Real-world applications

Binary search trees power systems requiring fast search with dynamic updates:

**Database indexing:** B-trees (a BST variant) index database tables, enabling fast queries while supporting inserts and deletes. Every SQL database uses tree-based indexes.

**File systems:** Directory structures are trees. The file system hierarchy on your computer is essentially a multi-way tree (each directory can have many children).

**Symbol tables:** Compilers use BSTs to store variables and their types during compilation. Fast lookup enables efficient semantic analysis.

**Autocomplete systems:** Tries ([Chapter 14](14-tries.md)) extend the BST concept to efficiently store and search strings, powering autocomplete in search engines.

**When to use BSTs:**
- Need sorted data with dynamic inserts/deletes
- Want O(log n) search without array resizing costs
- Require ordered iteration (in-order traversal)
- Building more complex structures (tries, B-trees)

**When to avoid BSTs:**
- Need O(1) lookups (use hash tables from [Chapter 15](15-hash-tables.md))
- Data rarely changes (use sorted array with binary search)
- Can't guarantee balanced insertions (need AVL/Red-Black trees from [Chapter 12](12-tree-balancing.md))

## Building algorithmic intuition

Binary search trees combine the efficiency of binary search with the flexibility of linked structures. The tree property—left children smaller, right children larger—enables `O(log n)` operations when balanced. Recursive tree operations demonstrate natural problem decomposition: most operations reduce to handling the current node plus recursive calls on subtrees, a pattern that appears throughout tree traversal, graph algorithms, and divide-and-conquer strategies.

Understanding BSTs reveals the importance of balance. Unbalanced trees degrade to linked lists, destroying logarithmic guarantees. This motivates balanced tree variants ([Chapter 12](12-tree-balancing.md)) that maintain `O(log n)` operations regardless of insertion order. The fundamental BST concepts learned here—tree navigation, recursive operations, ordering properties—apply to all tree-based structures.
