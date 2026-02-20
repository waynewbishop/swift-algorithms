---
layout: chapter
title: "Chapter 11: Binary Search Trees"
description: "Build and traverse binary search trees"
---
# Binary Search Trees

In the previous chapter we built linear structures where elements connect in a single chain. Binary Search Trees (BST) extend this concept into hierarchical organization—each node can have up to two children, creating a tree structure. Like the recursive data structures from [Chapter 6](06-recursion.md), trees naturally enable recursive algorithms. But unlike linear structures, BSTs maintain sorted order that enables `O(log n)` search performance.

## The BST structure

Here's the binary search tree node structure. Using generics from [Chapter 7](07-generics.md), it works with any comparable type:

```swift
public class BSNode<T: Comparable> {
    var tvalue: T?  // typed value
    var left: BSNode<T>?
    var right: BSNode<T>?
}
```

The `Comparable` constraint ensures elements can be compared using `<` and `>`, which is essential for determining `left` vs `right` placement. Each node contains a value (`tvalue`) and optional pointers to left and right subtrees.

## Building a tree

Let's build a BST from an array. The insertion order doesn't matter—the BST rules place each value correctly:

```swift
// Example array to build BST
let numberList: [Int] = [8, 2, 10, 9, 11, 1, 7]
```

The tree organizes itself: 8 becomes the `root`, values less than 8 (2, 1, 7) filter `left`, values greater than 8 (10, 9, 11) filter `right`. This automatic organization enables fast searching.

## Inserting elements

The `append` method uses recursion to find the correct insertion point. Recall from [Chapter 6](06-recursion.md) how recursion simplifies tree operations—each child is another BST, so we recursively call `append` on the appropriate subtree:

```swift
// Insert element into BST maintaining sort order - O(log n) average
public class BSNode<T: Comparable> {
    var tvalue: T?  // 'tvalue' means 'typed value'
    var left: BSNode<T>?
    var right: BSNode<T>?

    func append(element: T) {
        if let tvalue = self.tvalue {
            if element < tvalue {
                // Value is smaller - go left
                if let left = self.left {
                    left.append(element: element)
                } else {
                    let newNode = BSNode<T>()
                    newNode.tvalue = element
                    self.left = newNode
                }
            } else {
                // Value is larger - go right
                if let right = self.right {
                    right.append(element: element)
                } else {
                    let newNode = BSNode<T>()
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
let root = BSNode<Int>()

for number in numberList {
    root.append(element: number)
}
```

The recursion in `append` mirrors the recursive structure of the tree itself. This is a key pattern we'll see throughout tree algorithms.

## Searching the tree

Searching makes use of the BST property. If the target is smaller than the current node, search left. If larger, search right. If equal, we found it:

```swift
// Search for value in BST - O(log n) average
func search(for value: T) -> Bool {
    if let tvalue = self.tvalue {
        if value == tvalue {
            return true
        } else if value < tvalue {
            if let left = left {
                return left.search(for: value)
            }
            return false
        } else {
            if let right = right {
                return right.search(for: value)
            }
            return false
        }
    }
    return false
}
```

## Traversal

Traversal is the process of visiting every node in a tree structure exactly once in a systematic order. Unlike linear data structures like arrays where iteration is straightforward, trees require specific strategies to navigate their hierarchical relationships. The practical value becomes clear when we need sorted data: instead of maintaining a separate sorted array and re-sorting after every insertion (`O(n log n)` each time), a balanced BST provides both `O(log n)` insertion and `O(n)` sorted traversal. This makes BSTs ideal for applications requiring frequent insertions.

In-order traversal visits nodes in sorted order: `left` subtree, `current` node then `right` subtree. This is the most common traversal pattern for BSTs:

```swift
// In-order traversal produces sorted output - O(n)
func traverseInOrder() {
    if let left = left {
        left.traverseInOrder()
    }
    if let tvalue = tvalue {
        print("value: \(tvalue)")
    }
    if let right = right {
        right.traverseInOrder()
    }
}

// Print values in sorted order
root.traverseInOrder()
// Output: 1, 2, 7, 8, 9, 10, 11
```

The recursion pattern is elegant: process the `left` subtree, then the `current` node, then the `right` subtree. For our tree, this produces perfectly sorted output.

### Pre-order traversal

Pre-order traversal visits the `current` node first, then children: `current` node, `left` subtree, `right` subtree. This is useful for copying trees or serializing them:

```swift
// Pre-order traversal visits root first - O(n)
func traversePreOrder() {
    if let tvalue = tvalue {
        print("value: \(tvalue)")
    }
    if let left = left {
        left.traversePreOrder()
    }
    if let right = right {
        right.traversePreOrder()
    }
}

// Print values in pre-order
root.traversePreOrder()
// Output: 8, 2, 1, 7, 10, 9, 11
```

Pre-order gives you the root first, which is essential when we need to rebuild the tree structure.

### Post-order traversal

Post-order traversal visits children first, then the current node: `left` subtree, `right` subtree, `current` node. This is useful for deleting trees or performing calculations that depend on child results:

```swift
// Post-order traversal visits root last - O(n)
func traversePostOrder() {
    if let left = left {
        left.traversePostOrder()
    }
    if let right = right {
        right.traversePostOrder()
    }
    if let tvalue = tvalue {
        print("value: \(tvalue)")
    }
}

// Print values in post-order
root.traversePostOrder()
// Output: 1, 7, 2, 9, 11, 10, 8
```

Post-order ensures children are processed before parents, which is critical for operations like calculating tree height or safely deleting nodes.

## Finding minimum and maximum

The BST property makes finding extreme values trivial—minimum is the leftmost node, maximum is the rightmost:

```swift
// Find minimum value (leftmost node) - O(log n) average
func minimum() -> T? {
    if let left = left {
        return left.minimum()
    }
    return tvalue
}

// Find maximum value (rightmost node) - O(log n) average
func maximum() -> T? {
    if let right = right {
        return right.maximum()
    }
    return tvalue
}

// Usage
print("Min:", root.minimum()!)  // Output: 1
print("Max:", root.maximum()!)  // Output: 11
```

These operations traverse only one path from root to leaf, making them `O(log n)` average-case operations.

### Why BST recursion is efficient

Unlike recursive algorithms that spawn multiple branches (like naive Fibonacci from [Chapter 6](06-recursion.md) which creates exponential `O(2^n)` complexity), BST methods follow a single recursive path. Each call processes either the `left` or `right` subtree, never both. This single-path recursion produces the same halving pattern as iterative binary search from [Chapter 3](03-basic-searching.md), achieving `O(log n)` average performance. Recursion itself isn't inherently slow—the branching pattern determines efficiency.

## Performance analysis

BST operations demonstrate efficient average-case performance:

| Operation | Average Case | Notes |
|-----------|--------------|-------|
| Search | `O(log n)` | Halving pattern like binary search |
| Insert | `O(log n)` | Traverse then add new node |
| Traversal | `O(n)` | Visit every node once |
| Min/Max | `O(log n)` | Single path to leftmost/rightmost |

## Building algorithmic intuition

Binary search trees combine the efficiency of binary search with the flexibility of linked structures. The tree property—left children smaller, right children larger—enables `O(log n)` average operations. Recursive tree operations demonstrate natural problem decomposition: most operations reduce to handling the current node plus recursive calls on subtrees, a pattern that appears throughout tree traversal, graph algorithms ([Chapter 13](13-graphs.md)), and divide-and-conquer strategies.
