---
layout: chapter
title: "Chapter 12: Tree Balancing"
description: "Maintaining balanced binary search trees through height tracking and rotations"
---
# Tree Balancing

In [Chapter 11](11-binary-search-trees.md), we explored binary search trees and how they enable `O(log n)` search performance through efficient data organization. However, BST performance depends entirely on tree structure. When trees become unbalanced, search performance degrades to `O(n)`, no better than a linear scan. This chapter introduces tree balancing techniques that maintain `O(log n)` performance regardless of insertion order by tracking subtree heights and performing rotations when imbalances occur.

## The degenerate case

Consider inserting sorted data into a BST. Building a tree from `[1, 2, 3, 4, 5]` creates a degenerate case—every node has only a right child, forming a linked list. Searching for 5 requires examining all 5 nodes `(O(n))`, not the 3 comparisons `(O(log 5) ≈ 2.3)` a balanced tree would need.

This scenario isn't rare. Any monotonically increasing sequence (timestamps, auto-increment IDs, sorted imports) triggers worst-case behavior. Without balancing, BSTs become unreliable in real systems.

## The BSModel architecture

The production BST implementation uses a two-class design that separates node storage from tree management:

**BSNode** - Individual tree nodes with height tracking:
```swift
public class BSNode<T> {
    var tvalue: T?
    var left: BSNode?
    var right: BSNode?
    var height: Int

    public init() {
        self.height = 0
    }
}
```

**BSModel** - Self-balancing tree container:
```swift
public class BSModel<T: Comparable> {
    var root = BSNode<T>()
    private var stack = Stack<BSNode<T>>()

    public init() {}

    public func append(_ item: T) {
        // Insert and automatically rebalance
    }

    public func contains(_ item: T) -> Bool {
        // Search for element
    }

    public func isTreeBalanced(for element: BSNode<T>) -> Bool {
        // Check if subtree is balanced
    }

    private func rebalance() {
        // Recalculate heights and perform rotations
    }

    private func rotateLeft(for element: BSNode<T>) { }
    private func rotateRight(for element: BSNode<T>) { }
}
```

This separation of concerns provides clear responsibilities: `BSNode` stores data and tracks height, while `BSModel` manages insertion, balancing, and rotation operations.

## Height tracking

To detect imbalances, we add a `height` property to each node. Height represents the node's distance from leaf nodes. The height calculation traverses from leaf elements to the root, with non-existent leaves set to -1.

We calculate a node's height by comparing the height of each child, finding the largest value, then increasing that value by +1:

```swift
// Height calculation methods in BSModel
extension BSModel {
    private func getHeight(of node: BSNode<T>?) -> Int {
        // Check empty leaves
        guard let bsNode = node else {
            return -1
        }
        return bsNode.height
    }

    private func setHeight(for node: BSNode<T>) {
        var nodeHeight: Int = 0

        // Compare to calculate height
        nodeHeight = max(getHeight(of: node.left), getHeight(of: node.right)) + 1
        node.height = nodeHeight
    }
}
```

Let's demonstrate with a simple example:

```swift
// Example array for demonstrating tree balancing
let balanceList: [Int] = [29, 26, 23]
```

When we add the root element (29), both left and right children are `nil`, so their heights are -1. The root's height becomes `max(-1, -1) + 1 = 0`.

After adding 26 as the left child, we recalculate: the left child (26) has height 0, right child is `nil` (-1), so root becomes `max(0, -1) + 1 = 1`.

## Measuring balance

A tree is balanced if the height difference between left and right subtrees is less than 2. The `isTreeBalanced` method checks this:

```swift
// Check if node maintains balance property
public func isTreeBalanced(for element: BSNode<T>) -> Bool {
    // Use absolute value to measure imbalance
    if (abs(getHeight(of: element.left) - getHeight(of: element.right)) <= 1) {
        return true
    }
    else {
        return false
    }
}
```

With nodes 29 and 26 added:
```swift
let rootVal = abs((0) - (-1)) // equals 1 (balanced)
let leafVal = abs((-1) - (-1)) // equals 0 (balanced)
```

## Detecting imbalance

When we insert the final value (23), the math reveals node 29 violates the balance property:

```swift
let rootVal = abs((1) - (-1)) // equals 2 (unbalanced!)
```

The tree has become left-heavy—more nodes on the left than the right. To maintain `O(log n)` performance, we need to rebalance through rotation.

## Right rotation

Since the tree has too many nodes on the left, we balance it by performing a right rotation:

```swift
// Right rotation to fix left-heavy imbalance - O(1) time
private func rotateRight(for element: BSNode<T>) {
    // New element
    let rightChild = BSNode<T>()
    rightChild.tvalue = element.tvalue

    if let leftChild = element.left {
        // Reset the root node
        element.tvalue = leftChild.tvalue
        element.height = self.getHeight(of: leftChild)

        // Adjust left
        element.left = leftChild.left
    }

    // Assign new right node
    element.right = rightChild

    print("tree rotated right..")
}
```

After rotation, node 29 (originally the root) moves to the right child position. Node 26 becomes the new root. The tree is now balanced, and in-order traversal still produces sorted output: `23, 26, 29`.

## Left rotation

Similarly, right-heavy trees require left rotation:

```swift
// Left rotation to fix right-heavy imbalance - O(1) time
private func rotateLeft(for element: BSNode<T>) {
    // New element
    let leftChild = BSNode<T>()
    leftChild.tvalue = element.tvalue

    if let rightChild = element.right {
        // Reset the root node
        element.tvalue = rightChild.tvalue
        element.height = self.getHeight(of: rightChild)

        // Adjust right
        element.right = rightChild.right
    }

    // Assign new left node
    element.left = leftChild

    print("tree rotated left..")
}
```

Even though we undergo a series of steps, the process occurs in `O(1)` time—its performance is unaffected by the number of nodes or tree height.

## Stack-based memoization

The BSModel uses a stack-based approach for automatic rebalancing. This technique stores node references during insertion traversal, similar to how dynamic programming ([Chapter 16](16-dynamic-programming.md)) stores computed results to avoid redundant calculations.

As we traverse down the tree during insertion, we push each visited node onto a stack. This memoization allows us to efficiently walk back up the tree after insertion, recalculating heights and performing rotations only where needed. Without the stack, we'd need to traverse from the root to find affected nodes after each insertion—an expensive `O(n)` operation. The stack reduces rebalancing to `O(log n)` by giving us direct access to the insertion path.

## Automatic rebalancing

After insertion, we pop nodes from the stack and check balance, performing rotations as needed:

```swift
// Memoization process for tracking nodes during insertion
private func push(element: inout BSNode<T>) {
    stack.push(element)
}

// Rebalance tree after insertion
private func rebalance() {
    while stack.count > 0 {
        // Obtain reference
        let current = stack.peek()

        guard let bsNode: BSNode<T> = current else {
            return
        }

        // Recalculate height
        setHeight(for: bsNode)

        if self.isTreeBalanced(for: bsNode) == true {
            print("tree balanced..")
        }
        else {
            // Determine side imbalance
            let right = getHeight(of: bsNode.left) - getHeight(of: bsNode.right)
            let left = getHeight(of: bsNode.right) - getHeight(of: bsNode.left)

            if right > 1 {
                self.rotateRight(for: bsNode)
            }

            if left > 1 {
                self.rotateLeft(for: bsNode)
            }
        }

        stack.pop()
    }
}
```

## Complete insertion workflow

The append method combines insertion with automatic balancing:

```swift
public func append(_ item: T) {
    // Initial check
    guard root.tvalue != nil else {
        root.tvalue = item
        return
    }

    var current: BSNode<T> = root

    // Set child to be added
    let childToUse = BSNode<T>()
    childToUse.tvalue = item

    while current.tvalue != nil {
        // Push reference to stack for later rebalancing
        self.push(element: &current)

        if let tvalue = current.tvalue {
            if tvalue == item {
                return
            }

            // Check left side
            if item < tvalue {
                if let lnode = current.left {
                    current = lnode
                }
                else {
                    current.left = childToUse
                    break
                }
            }

            // Check right side
            if item > tvalue {
                if let rnode = current.right {
                    current = rnode
                }
                else {
                    current.right = childToUse
                    break
                }
            }
        }
    }

    // Recompute tree structure
    self.rebalance()
}
```

## Using BSModel

Building a self-balancing tree is straightforward:

```swift
let bsTree = BSModel<Int>()

// Insert elements in any order - tree automatically balances
for number in [29, 26, 23] {
    bsTree.append(number)
}

// Check if tree is balanced
if bsTree.isTreeBalanced(for: bsTree.root) {
    print("Tree is balanced")
}

// Traverse to verify sorted order
bsTree.root.DFSTraverse()
// Output: 23, 26, 29
```

The BSModel handles all balancing automatically. Whether you insert sorted data, reverse-sorted data, or random data, the tree maintains `O(log n)` performance.

## Performance guarantees

With automatic balancing, BSModel provides guaranteed performance:

| Operation | Unbalanced BST | BSModel (Balanced) |
|-----------|----------------|--------------------|
| Search | `O(n)` worst case | `O(log n)` guaranteed |
| Insert | `O(n)` worst case | `O(log n)` guaranteed |
| Delete | `O(n)` worst case | `O(log n)` guaranteed |

The overhead of height tracking and rotation is minimal—rotations are `O(1)` operations, and we only perform them when necessary.

## Building algorithmic intuition

Tree balancing addresses a fundamental challenge in data structures: maintaining guaranteed performance regardless of input order. Self-balancing trees use rotation operations to prevent degradation from `O(log n)` to `O(n)`, demonstrating how local restructuring preserves global properties. The BSModel architecture shows proper separation of concerns—nodes store data and track state (height), while the container manages operations and ensures invariants (balance). Understanding balancing reveals trade-offs between simplicity and guarantees—basic BSTs ([Chapter 11](11-binary-search-trees.md)) offer simpler implementation but no worst-case guarantees, while balanced variants add complexity but ensure `O(log n)` performance. Recognizing when guaranteed performance justifies implementation complexity guides practical data structure choices.
