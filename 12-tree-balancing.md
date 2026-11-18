---
layout: field-notes
title: "Chapter 12: Tree Balancing"
description: "Implement AVL tree rotations and self-balancing binary search trees in Swift"
---
# Tree Balancing

In [Chapter 11](11-binary-search-trees.md), we built binary search trees whose operations cost time proportional to the tree's height. That performance depends on the shape of the tree. A well-distributed insertion sequence produces a balanced structure where each comparison eliminates roughly half the remaining nodes. But not every sequence is well-distributed. In this chapter we examine what happens when insertion order works against us, and introduce `height` tracking and rotations to restore balance automatically.

## Unbalanced trees

To start, let's revisit the original example from the previous chapter. Array values from `numberList` (`[8, 2, 10, 9, 11, 1, 7]`) built a tree with 8 at the `root`, 2 and 10 below it, and the four remaining values as leaves. Every level is full, so the tree's height is 2 for seven nodes, the smallest height possible. This is a balanced binary search tree — one where each comparison eliminates roughly half the remaining nodes, giving us `O(log n)` performance.

The tree achieved balance not only through the BST append algorithm, but also through the way values were inserted. In practice, there are many ways to populate a tree. Without considering insertion order, this can produce unexpected results. A tree where all nodes chain left, all nodes chain right, or a mix of both imbalances degrades search performance from `O(log n)` toward `O(n)`.

Consider building a tree from sorted data — timestamps arriving in order, auto-incrementing database IDs, or alphabetized names. Inserting `[1, 2, 3, 4, 5]` into a BST creates a worst case where every node has only a `right` child, forming a linked list. Searching for 5 requires examining all 5 nodes — `O(n)` — rather than the 3 comparisons a balanced tree of height 2 would need. This scenario is not rare. Without balancing, BSTs become unreliable in real systems.

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

## The balancing model

The recursive `BSNode` from [Chapter 11](11-binary-search-trees.md) inserts values by calling `append` on each subtree. To balance the tree, we need a place to keep track of the path an insertion takes, so the balancing code lives in a separate class named `BSModel`. Its nodes add a `height` property to the familiar structure, and the model itself holds the `root` along with a [Stack](10-stacks-and-queues.md) that we'll put to work shortly:

```swift
// Binary search tree node with a stored height
public class BSNode<T> {
    var tvalue: T?
    var left: BSNode?
    var right: BSNode?
    var height: Int

    // Creates an empty leaf node with a height of zero
    public init() {
        self.height = 0
    }
}

// Self-balancing binary search tree
public class BSModel<T: Comparable> {
    var root = BSNode<T>()
    private var stack = Stack<BSNode<T>>()

    // Creates an empty tree
    public init() {}
}
```

Insertion walks down from the `root` iteratively rather than recursively. Each node it passes is pushed onto the stack, and once the new leaf is attached, `rebalance` processes the stacked path from the bottom up. Unlike the recursive version in Chapter 11, `BSModel` ignores a value that's already in the tree, so every stored value is unique:

```swift
// Insert a value, then rebalance along the insertion path - O(log n)
public func append(_ item: T) {

    // An empty tree stores the value at the root
    guard root.tvalue != nil else {
        root.tvalue = item
        return
    }

    var current: BSNode<T> = root

    let childToUse = BSNode<T>()
    childToUse.tvalue = item

    // Start a fresh insertion path
    stack = Stack<BSNode<T>>()

    while current.tvalue != nil {

        // Remember each node along the path
        self.push(element: &current)

        if let tvalue = current.tvalue {

            // Ignore duplicates
            if tvalue == item {
                return
            }

            // Check left side
            if item < tvalue {
                if let lnode = current.left {
                    current = lnode
                } else {
                    current.left = childToUse
                    break
                }
            }

            // Check right side
            if item > tvalue {
                if let rnode = current.right {
                    current = rnode
                } else {
                    current.right = childToUse
                    break
                }
            }
        }
    }

    // Recompute heights and restore balance
    self.rebalance()
}
```

## Measuring balance

With the `root` element established, we proceed to add the next value. Standard BST logic positions `26` as the `left` child. As a new node, its `height` is also 0. Since the tree is a hierarchy, we traverse upward to recalculate the parent's `height`. The `root` now has a `left` child with `height` 0 and no `right` child (-1), so its `height` becomes `max(0, -1) + 1 = 1`.

With multiple elements present, we run an additional check to see if the tree is balanced. A node is considered balanced if the `height` difference between its `left` and `right` subtrees is less than 2. A tree is balanced, in the sense the AVL algorithm uses, when every one of its nodes passes this test. Even though no right-side elements exist yet, the model is still valid:

```swift
// Balance check for each node after inserting 26
let leafVal = abs((-1) - (-1))  // equals 0 — balanced
let rootVal = abs((0) - (-1))   // equals 1 — balanced
```

In Swift, the check for a single node is encapsulated in the `isTreeBalanced` method. Because rebalancing visits every node on the insertion path, checking each node as we pass it is enough to keep the whole tree balanced:

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

Since the tree has too many nodes on the `left`, we balance it by performing a `right` rotation. The idea is to promote the `left` child to `root` and demote the current `root` to the `right`. In a larger tree, each of these nodes may already have subtrees of its own, and a rotation must carry every one of them to a valid position. Labeling the imbalanced node C, its `left` child B, and the subtrees x, y, and z, a right rotation reshapes the tree like this:

```
        C                B
       / \              / \
      B   z    ==>     x   C
     / \                  / \
    x   y                y   z
```

Subtree x holds values smaller than B, so it stays on B's `left`. Subtree z holds values larger than C, so it stays on C's `right`. Subtree y holds values between B and C, so it moves from B's `right` to C's `left`. In-order traversal produces x, B, y, C, z both before and after, which is why rotation never disturbs the sort order.

Rather than rewiring the parent's pointer, the implementation keeps the top node object in place and swaps values. The old `left` child object is reused to hold C, so every subtree is carried along and no values are lost:

```swift
// Right rotation to fix left-heavy imbalance — O(1) time
private func rotateRight(for element: BSNode<T>) {

    guard let leftChild = element.left else {
        return
    }

    // Reuse the left child node to hold the original root value
    element.left = leftChild.left        // x moves up
    leftChild.left = leftChild.right     // y moves across
    leftChild.right = element.right      // z stays on the right
    element.right = leftChild

    // Swap values so the promoted value sits at the top
    let rootValue = element.tvalue
    element.tvalue = leftChild.tvalue
    leftChild.tvalue = rootValue

    // Recompute heights from the lower node upward
    setHeight(for: leftChild)
    setHeight(for: element)
}
```

For our three-value example, 29 (originally the `root`) moves to the `right` child position, and 26 becomes the new `root`. The tree is balanced, and an in-order traversal still produces sorted output — `23, 26, 29`. The same code handles larger trees: inserting `[30, 20, 40, 10, 25, 5]` makes node 30 `left`-heavy, and the rotation promotes 20 while 25 moves across to become 30's `left` child and 40 stays on 30's `right`.

Even though we undergo a series of steps, the process occurs in `O(1)` time. Its performance is unaffected by the number of nodes, descendants, or tree `height`.

## Left rotation

`Right`-heavy trees require the mirror operation. A `left` rotation promotes the `right` child to `root` and demotes the current `root` to the `left`, moving the middle subtree from the promoted node's `left` to the demoted node's `right`:

```swift
// Left rotation to fix right-heavy imbalance — O(1) time
private func rotateLeft(for element: BSNode<T>) {

    guard let rightChild = element.right else {
        return
    }

    // Reuse the right child node to hold the original root value
    element.right = rightChild.right
    rightChild.right = rightChild.left
    rightChild.left = element.left
    element.left = rightChild

    // Swap values so the promoted value sits at the top
    let rootValue = element.tvalue
    element.tvalue = rightChild.tvalue
    rightChild.tvalue = rootValue

    // Recompute heights from the lower node upward
    setHeight(for: rightChild)
    setHeight(for: element)
}
```

If we had inserted `[23, 26, 29]` instead — a `right`-heavy sequence — a `left` rotation would produce the same balanced result. The two rotations are symmetric operations that handle opposite imbalances.

## Double rotations

A single rotation fixes an imbalance that runs in a straight line, where the extra height sits on the outside of the tree. Consider inserting `[29, 23, 26]`. Node 29 is `left`-heavy again, but this time its `left` child (23) is itself `right`-heavy, because 26 sits on 23's `right`. The extra height is on the inside. A right rotation at 29 would promote 23 and move 26 across to 29's `left`, producing a tree that is just as unbalanced in the opposite direction.

The fix is to straighten the bend first. A `left` rotation at 23 promotes 26, turning the zig-zag into the straight-line case we already know how to solve. A `right` rotation at 29 then finishes the job, leaving 26 at the `root` with 23 and 29 as its children. The mirror situation — a `right`-heavy node whose `right` child is `left`-heavy, such as `[23, 29, 26]` — calls for a `right` rotation on the child followed by a `left` rotation on the node.

To tell the four cases apart, we measure each node's balance factor, the `left` height minus the `right` height. Positive values lean `left` and negative values lean `right`:

```swift
// Height difference between a node's left and right subtrees
private func balanceFactor(of node: BSNode<T>) -> Int {
    return getHeight(of: node.left) - getHeight(of: node.right)
}
```

## Navigating back up the tree

To successfully apply the balancing algorithm, we need a way to traverse upward through the node hierarchy. When a child element is added, all of its ancestors must have their `height` values recalculated. If the BST used a recursive design, we could rely on the in-memory call stack to automatically return to parent nodes. To achieve the same result in the iterative `BSModel` design, we store node references using a [Stack](10-stacks-and-queues.md) data structure.

As we traverse down the tree during insertion, we push each visited node onto the stack. After the new element is placed, we pop nodes one by one — walking back up the insertion path — recalculating `height` values and performing rotations where needed. Without the stack, we would need to search from the `root` again to find the affected nodes. The stack gives us direct access to every ancestor along the insertion path, and because the tree stays balanced, that path holds only `O(log n)` nodes. Since rotations swap values rather than replacing node objects, the ancestors still waiting on the stack remain valid after a rotation below them:

```swift
// Store node references during downward traversal
private func push(element: inout BSNode<T>) {
    stack.push(element)
}

// Walk back up the insertion path, rebalancing as needed
private func rebalance() {

    while let bsNode = stack.peek() {

        // Recalculate height for this node
        setHeight(for: bsNode)

        // Positive values are left-heavy, negative values are right-heavy
        let balance = balanceFactor(of: bsNode)

        if balance > 1, let leftChild = bsNode.left {

            // Left-right case: straighten the left subtree first
            if balanceFactor(of: leftChild) < 0 {
                self.rotateLeft(for: leftChild)
            }

            self.rotateRight(for: bsNode)
        }

        else if balance < -1, let rightChild = bsNode.right {

            // Right-left case: straighten the right subtree first
            if balanceFactor(of: rightChild) > 0 {
                self.rotateRight(for: rightChild)
            }

            self.rotateLeft(for: bsNode)
        }

        stack.pop()
    }
}
```

## Preserving sort order

It is important to note that rotations improve performance but do not change tree output. Even though a `right` rotation changes the connections between nodes, the overall BST sort order is preserved. We can verify this by traversing a balanced and unbalanced version of the same tree — both produce identical results. The [Structures package](https://github.com/waynewbishop/bishop-algorithms-swift-package) version of `BSNode` includes `DFSTraverse()`, an in-order depth-first traversal that works like the `traverseInOrder` method from [Chapter 11](11-binary-search-trees.md), and it confirms the sorted sequence:

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

With automatic balancing, `BSModel` keeps every node's subtrees within one level of each other. An AVL tree with that property has a height of at most about 1.44 log₂ n, so performance no longer depends on insertion order:

| Operation | Unbalanced BST | BSModel (Balanced) |
|-----------|----------------|--------------------|
| Search | `O(n)` worst case | `O(log n)` guaranteed |
| Insert | `O(n)` worst case | `O(log n)` guaranteed |

The overhead of `height` tracking and rotation is minimal — rotations are `O(1)` operations, and we only perform them when an imbalance is detected. Walking the stacked path adds `O(log n)` work per insertion, which is absorbed into the insertion cost itself. Deletion can also be performed in `O(log n)` with the same rotations, but it requires rebalancing along the path to the removed node, and `BSModel` doesn't implement it.

## Building algorithmic intuition

Tree balancing addresses a fundamental challenge in data structures: maintaining guaranteed performance regardless of input order. The core idea is simple — after every insertion, walk back up the path we just traversed, check each ancestor for imbalance, and rotate if needed. Each rotation is a purely local change that moves subtrees without breaking their order, yet repeating it along one path preserves a global property, a pattern that appears throughout algorithm design.

The BSModel architecture also demonstrates how an iterative design can achieve the same bottom-up processing that recursion provides naturally, using a stack to remember the traversal path. That stack reappears in [Chapter 18](18-dynamic-programming.md), where we contrast remembering where we've been with reusing answers we've already computed. Understanding when guaranteed performance justifies this additional complexity is a practical skill that extends to choosing between data structures in [Chapter 13](13-graphs.md) and to the array-based trees of heaps in [Chapter 17](17-heaps.md).
