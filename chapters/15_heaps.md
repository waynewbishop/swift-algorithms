# Heaps

In the previous chapter, we reviewed Dijkstra's algorithm for searching a graph. Originally published in 1959, this popular technique for finding the shortest path is an elegant solution to a complex problem. The design involved many parts including graph traversal, custom data structures and the greedy approach.

When designing programs, it's great to see them work. With Dijkstra, the algorithm did allow us to find the shortest path between a source vertex and destination. However, our approach could be refined to be more efficient. In this essay, we'll enhance the algorithm with the addition of binary heaps.

## How It Works

In its basic form, a heap is just an Array. However, unlike an Array, we visualize it as a tree. The term "visualize" implies we use processing techniques normally associated with recursive data structures. This shift in thinking has numerous advantages. Consider the following:

```swift
//a simple array of unsorted integers
let numberList : Array<Int> = [8, 2, 10, 9, 11, 7]
```

As shown, numberList can be easily represented as a heap. Starting at index 0, items fill a corresponding spot as a parent or child node. Each parent also has two children with the exception of index 2.

An array visualized as a "nearly complete" tree

Since the arrangement of values is sequential, a simple pattern emerges. For any node, we can accurately predict its position using these formulas:

Formulas to calculate heap indices

## Sorting Heaps

An interesting feature of heaps is their ability to sort data. As we've seen, many algorithms are designed to sort entire datasets. When sorting heaps, nodes can be arranged so each parent contains a lesser value than its children. In computer science, this is called a min-heap.

A heap structure that maintains the min-heap property

## Exploring the Frontier

With Dijkstra, we used a concept called the frontier. Coded as a simple Array, we compared the total weight of each path to find the shortest path.

```swift
//construct the best path
var bestPath: Path = Path()

while frontier.count != 0 {
    //support path changes using the greedy approach
    bestPath = Path()
    var pathIndex: Int = 0

    for x in 0..<frontier.count {
        let itemPath: Path = frontier[x]

        if (bestPath.total == 0) || (itemPath.total < bestPath.total) {
            bestPath = itemPath
            pathIndex = x
        }
    }
```

While it accomplished our goal, we applied a brute force technique. In other words, we examined every potential Path to find the shortest path. This code segment executes in linear time or O(n). If the frontier contained a million rows, how would this impact the algorithm's overall performance?

## The Heap Structure

Let's create a more efficient frontier. Named PathHeap, the data structure will extend the functionality of an Array.

```swift
public class PathHeap {
    private var heap: Array<Path>

    init() {
        heap = Array<Path>()
    }

    //the number of frontier items
    var count: Int {
        return self.heap.count
    }
}
```

The PathHeap class includes two properties. To support good design, heap has been declared a private property. To track the number of items, count is declared as a computed property.

## Building the Queue

Searching the frontier more efficiently than O(n) will require a new way of thinking. We can improve our performance to O(1) with a heap. Using heapsort formulas, our new approach will involve arranging index values so the smallest item is positioned at the root.

```swift
//sort shortest paths into a min-heap (heapify)
func enQueue(key: Path) {
    heap.append(key)
    var childIndex: Float = Float(heap.count) - 1
    var parentIndex: Int! = 0

    //calculate parent index
    if childIndex != 0 {
        parentIndex = Int(floorf((childIndex - 1) / 2))
    }

    var childToUse: Path
    var parentToUse: Path

    //use the bottom-up approach
    while childIndex != 0 {
        childToUse = heap[Int(childIndex)]
        parentToUse = heap[parentIndex]

        //swap child and parent positions
        if childToUse.total < parentToUse.total {
            heap.swapAt(parentIndex, Int(childIndex))
        }

        //reset indices
        childIndex = Float(parentIndex)

        if (childIndex != 0) {
            parentIndex = Int(floorf((childIndex - 1) / 2))
        }
    }
}
```

The enQueue method accepts a single Path as a parameter. Unlike other sorting algorithms, our primary goal isn't to sort each item, but to find the smallest value. This means we can increase our efficiency by comparing a subset of values.

The enQueue process compares a newly added value

The process continues until the smallest value is positioned at the root

Since the enQueue method maintains the min-heap property, we eliminate the task of finding the shortest path. In other words, we increase the algorithm's efficiency to O(1). Here, we implement a basic peek method to retrieve the root-level item.

```swift
//obtain the minimum path
func peek() -> Path? {
    if heap.count > 0 {
        return heap[0] //the shortest path
    }
    else {
        return nil
    }
}
```

## The Results

With the frontier refactored, let's see the applied changes. As new Paths are discovered, they are automatically sorted by the frontier. The count property forms the base case for our loop condition and the bestPath is retrieved using the peek method.

```swift
let frontier: PathHeap = PathHeap()

//construct the best path
while frontier.count != 0 {
    //use the greedy approach to obtain the best path
    guard let bestPath: Path = frontier.peek() else {
        break
    }
    ...
```

## Heaps & Generics

It's great seeing how a heap can be used to improve the time complexity of a solution. To extend our model for general use, we can also create a more generalized algorithm:

> **Time Complexity (Big O Notation)**
>
> When evaluating algorithmic performance, functions are often analyzed based on their speed of operation (e.g. time) as well as how much storage "space" they may occupy.

```swift
//a generic heap structure
class Heap<T: Comparable> {
    private var items: Array<T>
    private var heapType: HeapType

    //min-heap default initialization
    init(type: HeapType = .min) {
        items = Array<T>()
        heapType = type
    }

    //the min or max value
    func peek() -> T? {
        if items.count > 0 {
            return items[0] //the min or max value
        }
        else {
            return nil
        }
    }

    //addition of new items
    func enQueue(_ key: T) {
        items.append(key)
        var childIndex: Float = Float(items.count) - 1
        var parentIndex: Int = 0

        //calculate parent index
        if childIndex != 0 {
            parentIndex = Int(floorf((childIndex - 1) / 2))
        }

        var childToUse: T
        var parentToUse: T

        //use the bottom-up approach
        while childIndex != 0 {
            childToUse = items[Int(childIndex)]
            parentToUse = items[parentIndex]

            //heapify depending on type
            switch heapType {
            case .min:
                //swap child and parent positions
                if childToUse <= parentToUse {
                    items.swapAt(parentIndex, Int(childIndex))
                }
            case .max:
                //swap child and parent positions
                if childToUse >= parentToUse {
                    items.swapAt(parentIndex, Int(childIndex))
                }
            }

            //reset indices
            childIndex = Float(parentIndex)

            if childIndex != 0 {
                parentIndex = Int(floorf((childIndex - 1) / 2))
            }
        }
    }
}

//used for generic heap data structure processing
enum HeapType {
    case min
    case max
}
```

## Traversals

Throughout this series we've explored various data structures such as binary search trees and graphs. Once established, these objects work like a database - managing data in a structured format. Like most databases, their contents can also be explored through a process called traversal. In this chapter, we'll review traversing data structures and will examine the popular techniques of Depth-First and Breadth-First search.

### Depth-First Search

Traversals are based on the idea of visiting each node in a data structure. In practical terms, traversals can be seen through everyday activities like network administration. To meet security requirements, administrators will often deploy software updates to an entire network as a single task. To see how traversal works, let's introduce the concept of Depth-First Search (DFS).

As shown with this binary search tree, our goal will be to explore the left side of the model, visit the root node, then visit the right side.

The yellow nodes represent the first and last nodes in the traversal. The algorithm requires little code, but introduces some interesting concepts.

```swift
class BSNode<T>{
    var key: T?
    var left: BSNode?
    var right: BSNode?

    //depth-first traversal
    func traverse() {
        guard self.key != nil else {
            print("no key provided..")
            return
        }

        //process the left side
        if self.left != nil {
            left?.traverse()
        }

        //process the right side
        if self.right != nil {
            right?.traverse()
        }
    }
}
```

At first glance, we note the algorithm makes use of recursion. The AVLTree node (e.g. self), contains a key, as well as pointer references to its left and right nodes. For each side, (e.g., left and right) the base case consists of a straightforward check for nil. This process allows us to traverse the entire structure starting at the lowest value. When applied, the algorithm produces the following output:

3, 5, 6, 8, 9, 10, 12

### Breadth-First Search

Breadth-First Search (BFS) is another technique used for traversing data structures. This algorithm is designed for open-ended data models and is typically used with graphs.

Our BFS algorithm combines techniques previously discussed including stacks, queues and shortest paths. With BFS, our goal is to visit all neighbors before visiting our neighbor's neighbor. Unlike Depth-First Search, the algorithm is based on logical discovery.

We've chosen vertex A as the starting point. Unlike Dijkstra, BFS has no concept of a destination or frontier. The algorithm is complete when all connected nodes have been visited. As a result, the starting point could have been any node in our graph.

Vertex A is marked as visited once its neighbors have been added to the queue.

As discussed, BFS works by exploring neighboring vertices. Since our data structure is an undirected graph, we need to ensure each node is visited only once. To account for this requirement we can use a generic queue:

```swift
//breadth first search
func traverse(_ startingv: Vertex) {
    //establish a new queue
    let graphQueue = Queue<Vertex>()

    //queue a starting vertex
    graphQueue.enQueue(startingv)

    while !graphQueue.isEmpty() {
        //traverse the next queued vertex
        let vitem = graphQueue.deQueue() as Vertex!

        guard vitem != nil else {
            return
        }

        //add unvisited vertices to the queue
        for e in vitem!.neighbors {
            if e.neighbor.visited == false {
                graphQueue.enQueue(e.neighbor)
            }
        }

        vitem!.visited = true
        print("traversed vertex: \(vitem!.key!)..")
    } //end while

    print("graph traversal complete..")
} //end function
```

The process starts by adding a single vertex to the queue. As nodes are dequeued, their neighbors are also added to the queue. The process is complete when all vertices are visited. To ensure nodes are not visited more than once, each vertex is marked with a boolean flag.
