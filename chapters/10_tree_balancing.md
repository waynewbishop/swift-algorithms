# Tree Balancing

In the previous chapter, we saw how binary search trees (BST) are used to manage data. With basic logic, an algorithm can easily traverse a model, searching data in O(log n) time. However, there are occasions when navigating a tree becomes inefficient - in some cases working at O(n) time. In this essay, we will review those scenarios and introduce the concept of tree balancing.

## New Models

To start, let's revisit our original example. Array values from numberList were used to build a tree. As shown, all elements had either one or two children - otherwise called leaf elements. This is known as a balanced binary search tree.

[diagram: A balanced BST with 7 elements - O(log n)]

Our model achieved balance not only through usage of the BST append algorithm, but also by the way keys were inserted. In reality, there could be numerous ways to populate a tree. Without considering other factors, this can produce unexpected results:

[diagram: An unbalanced "left-heavy" BST with 3 elements - O(n)]

[diagram: An unbalanced "right-heavy" BST with 3 elements - O(n)]

[diagram: A 6-node BST with left and right imbalances - O(n)]

## New Heights

To compensate for these imbalances, we need to expand the scope of our algorithm. In addition to left / right logic, we'll add a new property called height. Coupled with specific rules, we can use height to detect tree imbalances. To see how this works, let's create a new BST:

```swift
// A simple array of unsorted integers
let balanceList: Array<Int> = [29, 26, 23]
```

To start, we add the root element. As the first item, left / right leaves don't yet exist so they are initialized to nil. Arrows point from the leaf element to the root because they are used to calculate its height. For math purposes, the height of non-existent leaves are set to -1.

With a model in place, we can calculate the element's height. This is done by comparing the height of each leaf, finding the largest value, then increasing that value by +1. For the root element this equates to 0. In Swift, these rules can be represented as follows:

```swift
private func findHeight(of element: BSNode<T>?) -> Int {
    // Check empty leaves
    guard let bsNode = element else {
        return -1
    }
    return bsNode.height
}

private func setHeight(for element: BSNode<T>) {
    // Set leaf variables
    var elementHeight: Int = 0

    // Do comparison and calculate height
    elementHeight = max(findHeight(of: element.left), findHeight(of: element.right)) + 1
    element.height = elementHeight
}
```

## Measuring Balance

With the root element established, we can proceed to add the next value. Upon implementing standard BST logic, item 26 is positioned as the left leaf node. As a new item, its height is also calculated (i.e., 0). However, since our model is a hierarchy, we traverse upwards to recalculate its parent height value:

[diagram: Step two: 26 is added to the BST]

With multiple elements present, we run an additional check to see if the BST is balanced. In most cases, a tree is considered balanced if the height difference between its leaf elements is less than 2. As shown below, even though no right-side items exist, our model is still valid.

```swift
// Example math for tree balance check
let rootVal: Int!
let leafVal: Int!

leafVal = abs((-1) - (-1))  // equals 0 (balanced)
rootVal = abs((0) - (-1))   // equals 1 (balanced)
```

In Swift, these elements can be checked with the isTreeBalanced method.

```swift
func isTreeBalanced(for element: BSNode<T>?) -> Bool {
    guard element?.key != nil else {
        print("no element provided..")
        return false
    }

    // Use absolute value to manage right and left imbalances
    if (abs(findHeight(of: element?.left) - findHeight(of: element?.right)) <= 1) {
        return true
    }
    else {
        return false
    }
}
```

## Adjusting the Model

With 29 and 26 added we can proceed to insert the final value (i.e., 23). Like before, we continue to traverse the left side of the tree. However, upon insertion, the math reveals node 29 violates the BST property. In other words, its subtree is no longer balanced.

[diagram: Step three: 23 is added to the BST]

```swift
// Example math for tree balance check
let rootVal: Int!
rootVal = abs((1) - (-1))  // equals 2 (unbalanced)
```

For the tree to maintain its BST property, we need to change its performance from O(n) to O(log n). This can be achieved through a process called rotation. Since the model has more nodes to the left, we'll balance it by performing a right rotation sequence. Once complete, the new model will appear as follows:

[diagram: Step four: right rotation on node 29]

As shown, we've been able to rebalance the BST by rotating the model to the right. Originally set as the root, node 29 is now positioned as the right leaf. In addition, node 26 has been moved to the root. In Swift, these changes can be achieved with the following:

```swift
// Perform left or right rotation
private func rotate(element: BSNode<T>) {
    // ...

    // Create new element
    let childToUse = BSNode<T>()
    childToUse.height = 0
    childToUse.key = element.key

    // ...

    // Determine side imbalance
    let rightSide = findHeight(of: element.left) - findHeight(of: element.right)
    let leftSide = findHeight(of: element.right) - findHeight(of: element.left)

    if rightSide > 1 {
        // Reset the root node
        element.key = element.left?.key
        element.height = findHeight(of: element.left)

        // Assign the new right node
        element.right = childToUse

        // Adjust the left node
        element.left = element.left?.left
        element.left?.height = 0
    }
    // ...
}
```

Even though we undergo a series of steps, the process occurs in O(1) time. Meaning, its performance is unaffected by other factors such as number of leaf nodes, descendants or tree height. In addition, even though we've completed a right rotation, similar steps could be implemented to resolve both left and right imbalances.

## Tree Navigation

> **MEMOIZATION**: A coding technique of applying storage and reuse to improve overall algorithmic efficiency.

You may have noticed that to successfully apply our node balancing algorithms, we also need to determine how to traverse upwards in our BSNode hierarchy. In other words, when a child element is added, all its antecedents must be recalculated (indicated in the diagrams as arrows pointing upwards). If our BSTree was a recursive structure, we could utilize the in-memory call stack to automatically navigate to parent nodes. To achieve the same results in our iterative design, we'll store BSNode references using a Stack data structure. This technique is known as memoization:

```swift
class BSTree<T: Comparable> {
    // ...
    private var elementStack = Stack<BSNode<T>>()
    // ...

    func append(element key: T) {
        // ...

        // Set initial indicator
        var current: BSNode<T> = root

        while current.key != nil {
            // Send reference of current item to stack
            self.push(element: &current)
            // ...
        }

        // Calculate height and balance of call stack
        self.rebalance()
    }

    // Stack elements for later processing - memoization
    private func push(element: inout BSNode<T>) {
        elementStack.push(withKey: element)
    }

    // Determine height and balance
    private func rebalance() {
        for _ in stride(from: elementStack.count, through: 1, by: -1) {
            // Obtain generic stack node - by reference
            let current = elementStack.peek()

            guard let bsNode: BSNode<T> = current.key else {
                print("element reference not found..")
                continue
            }

            setHeight(for: bsNode)
            rotate(element: bsNode)

            // Remove stacked item
            elementStack.pop()
        }
    }
}
```

In Swift, the memory address of variables can be shared as inout function parameters. As a result, when a BSNode reference is pushed to the Stack, the original variable can be updated without having to manage new copies of data.

## The Results

With tree balancing, it is important to note that techniques like rotations improve performance, but do not change tree output. For example, even though a right rotation changes the connections between nodes, the overall BST sort order is preserved. As a test, one can traverse a balanced and unbalanced BST (comparing the same values) and receive the same results. In our case, a simple depth-first search will produce the following:

```swift
// Sorted values from a traversal
23, 26, 29
```
