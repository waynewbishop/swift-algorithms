---
layout: chapter
title: "Chapter 12: Tree Balancing"
description: "Implement AVL tree rotations and self-balancing binary search trees in Swift"
---
# Tree Balancing

In [Chapter 11](11-binary-search-trees.md), we built binary search trees that organize data for `O(log n)` searching. That performance, however, depends on the shape of the tree. A well-distributed insertion sequence produces a balanced structure where each comparison eliminates half the remaining nodes. But not every sequence is well-distributed. In this chapter we examine what happens when insertion order works against us, and introduce `height` tracking and rotations to restore balance automatically.

## Unbalanced trees

To start, let's revisit the original example from the previous chapter. Array values from `numberList` were used to build a tree where all elements had either one or two children. This is a balanced binary search tree — one where each comparison eliminates roughly half the remaining nodes, giving us `O(log n)` performance.

The tree achieved balance not only through the BST append algorithm, but also through the way values were inserted. In practice, there are many ways to populate a tree. Without considering insertion order, this can produce unexpected results. A tree where all nodes chain left, all nodes chain right, or a mix of both imbalances degrades search performance from `O(log n)` toward `O(n)`.

Consider building a tree from sorted data — timestamps arriving in order, auto-incrementing database IDs, or alphabetized names. Inserting `[1, 2, 3, 4, 5]` into a BST creates a worst case where every node has only a `right` child, forming a linked list. Searching for 5 requires examining all 5 nodes — `O(n)` — not the 3 comparisons `O(log 5) ≈ 2.3` a balanced tree would need. This scenario is not rare. Without balancing, BSTs become unreliable in real systems.

## Tracking height

To compensate for these imbalances, we need to expand the scope of the algorithm. In addition to `left` and `right` logic, we add a new property called `height`. Coupled with specific rules, we can use `height` to detect tree imbalances. To see how this works, let's create a new BST from a sample array:

```swift
// A simple array of unsorted integers
let balanceList: [Int] = [29, 26, 23]
```

We'll start by adding the `root` element (29). As the first item, `left` and `right` children don't yet exist, so they are initialized to `nil`. For the `height` calculation, non-existent children are assigned a `height` of -1. We calculate a node's `height` by comparing the `height` of each child, finding the larger value, then increasing it by 1. For the `root` element, this equates to `max(-1, -1) + 1 = 0`.

In Swift, these rules translate to two helper methods on `BSModel`:

```swift
// Return the height of a node, or -1 for nil
private func getHeight(of node: BSNode<T>?) -> Int {
    guard let bsNode = node else {
        return -1
    }
    return bsNode.height
}

// Recalculate and store a node's height from its children
private func setHeight(for node: BSNode<T>) {
    node.height = max(getHeight(of: node.left), getHeight(of: node.right)) + 1
}
```

## Measuring balance

With the `root` element established, we proceed to add the next value. Standard BST logic positions `26` as the `left` child. As a new node, its `height` is also 0. Since the tree is a hierarchy, we traverse upward to recalculate the parent's `height`. The `root` now has a `left` child with `height` 0 and no `right` child (-1), so its `height` becomes `max(0, -1) + 1 = 1`.

With multiple elements present, we run an additional check to see if the tree is balanced. A tree is considered balanced if the `height` difference between its `left` and `right` subtrees is less than 2. Even though no right-side elements exist yet, the model is still valid:

```swift
// Balance check for each node after inserting 26
let leafVal = abs((-1) - (-1))  // equals 0 — balanced
let rootVal = abs((0) - (-1))   // equals 1 — balanced
```

In Swift, this check is encapsulated in the `isTreeBalanced` method:

```swift
// Check whether a node satisfies the balance property
public func isTreeBalanced(for element: BSNode<T>) -> Bool {
    return abs(getHeight(of: element.left) - getHeight(of: element.right)) <= 1
}
```

## Detecting imbalance

With 29 and 26 added, we proceed to insert the final value (23). Like before, BST logic places it on the `left` side. However, upon insertion the math reveals that node 29 violates the balance property — its subtree is no longer balanced.

```swift
// Balance check for the root after inserting 23
let rootVal = abs((1) - (-1))  // equals 2 — unbalanced
```

The tree has become `left`-heavy. To restore `O(log n)` performance, we need to restructure the tree through a process called rotation.

## Right rotation

Since the tree has too many nodes on the `left`, we balance it by performing a `right` rotation. The idea is to promote the `left` child to `root` and demote the current `root` to the `right`. Rather than rewiring parent pointers, the implementation copies values between nodes — the `root` node object stays in place, but its contents change:

```swift
// Right rotation to fix left-heavy imbalance — O(1) time
private func rotateRight(for element: BSNode<T>) {

    // Preserve the current root's value in a new right child
    let rightChild = BSNode<T>()
    rightChild.tvalue = element.tvalue

    if let leftChild = element.left {
        // Promote the left child's value to root
        element.tvalue = leftChild.tvalue
        element.height = self.getHeight(of: leftChild)

        // The left child's left subtree becomes the new left
        element.left = leftChild.left
    }

    // The original root value is now the right child
    element.right = rightChild
}
```

After rotation, 29 (originally the `root`) moves to the `right` child position. Node 26 becomes the new `root`. The tree is balanced, and an in-order traversal still produces sorted output — `23, 26, 29`.

Even though we undergo a series of steps, the process occurs in `O(1)` time. Its performance is unaffected by the number of nodes, descendants, or tree `height`.

## Left rotation

`Right`-heavy trees require the mirror operation. A `left` rotation promotes the `right` child to `root` and demotes the current `root` to the `left`:

```swift
// Left rotation to fix right-heavy imbalance — O(1) time
private func rotateLeft(for element: BSNode<T>) {

    // Preserve the current root's value in a new left child
    let leftChild = BSNode<T>()
    leftChild.tvalue = element.tvalue

    if let rightChild = element.right {
        // Promote the right child's value to root
        element.tvalue = rightChild.tvalue
        element.height = self.getHeight(of: rightChild)

        // The right child's right subtree becomes the new right
        element.right = rightChild.right
    }

    // The original root value is now the left child
    element.left = leftChild
}
```

If we had inserted `[23, 26, 29]` instead — a `right`-heavy sequence — a `left` rotation would produce the same balanced result. The two rotations are symmetric operations that handle opposite imbalances.

## Navigating back up the tree

To successfully apply the balancing algorithm, we need a way to traverse upward through the node hierarchy. When a child element is added, all of its ancestors must have their `height` values recalculated. If the BST used a recursive design, we could rely on the in-memory call stack to automatically return to parent nodes. To achieve the same result in the iterative `BSModel` design, we store node references using a [Stack](06-recursion.md) data structure.

As we traverse down the tree during insertion, we push each visited node onto the stack. After the new element is placed, we pop nodes one by one — walking back up the insertion path — recalculating `height` values and performing rotations where needed. Without the stack, we would need to traverse from the `root` to find affected nodes after each insertion, an expensive `O(n)` operation. The stack reduces rebalancing to `O(log n)` by giving us direct access to every ancestor along the insertion path:

```swift
// Store node references during downward traversal
private func push(element: inout BSNode<T>) {
    stack.push(element)
}

// Walk back up the insertion path, rebalancing as needed
private func rebalance() {
    while stack.count > 0 {
        let current = stack.peek()

        guard let bsNode: BSNode<T> = current else {
            return
        }

        // Recalculate height for this node
        setHeight(for: bsNode)

        // Check balance and rotate if necessary
        if !self.isTreeBalanced(for: bsNode) {
        
            let rightHeavy = getHeight(of: bsNode.right) - getHeight(of: bsNode.left)
            let leftHeavy = getHeight(of: bsNode.left) - getHeight(of: bsNode.right)

            if leftHeavy > 1 {
                self.rotateRight(for: bsNode)
            }
            if rightHeavy > 1 {
                self.rotateLeft(for: bsNode)
            }
        }

        stack.pop()
    }
}
```

## Preserving sort order

It is important to note that rotations improve performance but do not change tree output. Even though a `right` rotation changes the connections between nodes, the overall BST sort order is preserved. We can verify this by traversing a balanced and unbalanced version of the same tree — both produce identical results. A simple depth-first search confirms the sorted sequence:

```swift
let bsTree = BSModel<Int>()

// Insert elements — tree automatically balances
for number in [29, 26, 23] {
    bsTree.append(number)
}

// In-order traversal still produces sorted output
bsTree.root.DFSTraverse()
// Output: 23, 26, 29
```

## Performance guarantees

With automatic balancing, BSModel provides guaranteed performance regardless of insertion order:

| Operation | Unbalanced BST | BSModel (Balanced) |
|-----------|----------------|--------------------|
| Search | `O(n)` worst case | `O(log n)` guaranteed |
| Insert | `O(n)` worst case | `O(log n)` guaranteed |
| Delete | `O(n)` worst case | `O(log n)` guaranteed |

The overhead of `height` tracking and rotation is minimal — rotations are `O(1)` operations, and we only perform them when an imbalance is detected. The stack-based traversal adds `O(log n)` work per insertion, which is absorbed into the insertion cost itself.

## Building algorithmic intuition

Tree balancing addresses a fundamental challenge in data structures: maintaining guaranteed performance regardless of input order. The core idea is simple — after every insertion, walk back up the path we just traversed, check each ancestor for imbalance, and rotate if needed. This local restructuring preserves a global property, a pattern that appears throughout algorithm design. The BSModel architecture demonstrates how an iterative design can achieve the same bottom-up processing that recursion provides naturally, using a stack to remember the traversal path. Understanding when guaranteed performance justifies this additional complexity is a practical skill that extends to choosing between data structures in [Chapter 13](13-graphs.md) and evaluating algorithm trade-offs in [Chapter 18](18-dynamic-programming.md).
