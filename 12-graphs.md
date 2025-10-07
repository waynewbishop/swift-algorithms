---
layout: chapter
title: "Chapter 12: Graphs"
description: "Explore graph data structures and algorithms"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Graphs

A graph is a data structure that shows a relationship (e.g., connection) between two or more objects. Because of their flexibility, graphs are one of the most widely used structures in modern computing. Popular tools and services like online maps, social networks, and even the Internet as a whole are based on how objects relate to one another. In this chapter, we'll highlight the key features of graphs and will demonstrate how to create a basic graph with Swift.

## The basics

As discussed, a graph is a model that shows how objects relate to one another. Graph objects are usually referred to as nodes or vertices. While it would be possible to build and graph a single node, models that contain multiple vertices better represent real-world applications.

Graph objects relate to one another through connections called edges. Depending on your requirements, a vertex could be linked to one or more objects through a series of edges. It's also possible to create a vertex without edges. Here are some basic graph configurations:

[diagram: Examples of undirected graphs with varying vertices and edges]

## Directed vs. undirected

As shown above, there are many ways to configure a graph. An additional option is to set the model to be either directed or undirected. The examples above represent undirected graphs. In other words, the connection between vertices A and B is equivalent to the connection between vertices B and A. Social networks are a great example of undirected graphs. Once a request is accepted, both parties (e.g. the sender and recipient) share a mutual connection.

A service like Google Maps is a great example of a directed graph. Unlike an undirected graph, directed graphs only support a one-way connection between source vertices and their destinations. So, for example, vertex A could be connected to B, but A wouldn't necessarily be reachable through B. To show the varying relationship between vertices, directed graphs are drawn with lines and arrows.

## Edges & weights

Regardless of graph type, it's common to represent the level of connectedness between vertices. Normally associated with an edge, the weight is a numerical value tracked for this purpose. As we'll see, modeling of graphs with edge weights can be used to solve a variety of problems.

[diagram: A directed graph with three vertices showing weighted edges]

## The vertex

With our understanding of graphs in place, let's build a graph using generics. This allows the graph to work with any data type. Here's the data structure for a vertex:

```swift
public class Vertex<T>: Equatable {
    var tvalue: T?
    var neighbors = Array<Edge<T>>()
    var visited: Bool = false
    let uuid = UUID()

    public init() {
        // Default initialization
    }

    public init(with name: T) {
        self.tvalue = name
    }

    // Equatable conformance
    public static func == (lhs: Vertex, rhs: Vertex) -> Bool {
        return lhs.uuid == rhs.uuid
    }
}
```

**Key properties:**

- **tvalue**: The value stored in this vertex (generic type T)
- **neighbors**: Array of edges connecting to other vertices
- **visited**: Tracks whether we've visited this vertex during traversal
- **uuid**: Unique identifier for comparing vertices

The `Equatable` conformance allows us to compare vertices using `==`. Two vertices are equal if they have the same UUID, even if their values differ.

## Adjacency lists

The neighbors property is an array that represents connections a vertex may have with other vertices. As discussed, a vertex can be associated with one or more items. This list of neighboring items is sometimes called an adjacency list and can be used to solve a variety of problems. Here's a basic data structure that represents an edge:

```swift
public class Edge<T> {
    var neighbor: Vertex<T>
    var weight: Int

    init() {
        weight = 0
        self.neighbor = Vertex<T>()
    }
}
```

Each edge contains a reference to a neighboring vertex and a weight representing the "cost" of the connection.

## Building the graph

With our vertex and edge objects built, we can use these structures to construct a graph:

```swift
public class Graph<T> {
    var canvas: Array<Vertex<T>>

    public init() {
        canvas = Array<Vertex>()
    }

    // Add vertex to graph canvas
    public func addVertex(element: Vertex<T>) {
        canvas.append(element)
    }

    // Represents a relationship between neighboring vertices
    public func addEdge(source: Vertex<T>, neighbor: Vertex<T>, weight: Int) {
        // Create a new edge
        let newEdge = Edge<T>()

        // Connect source vertex with the neighboring edge
        newEdge.neighbor = neighbor
        newEdge.weight = weight

        source.neighbors.append(newEdge)
    }
}
```

**Key components:**

- **canvas**: Array holding all vertices in the graph
- **addVertex**: Adds a new vertex to the graph
- **addEdge**: Creates a directed connection from source to neighbor with a given weight

## Graph traversals

Graph traversal is the process of visiting every vertex in a graph exactly once. Unlike trees, graphs can contain cycles, so we need to track which vertices we've already visited to avoid infinite loops.

### Breadth-first search (BFS)

Breadth-First Search explores all vertices at the current depth before moving to vertices at the next depth level. It uses a queue data structure:

```swift
extension Graph {
    // BFS traversal
    public func traverse(_ startingv: Vertex<T>) {
        // Establish a new queue
        let graphQueue: Queue<Vertex<T>> = Queue<Vertex<T>>()

        // Queue a starting vertex
        graphQueue.enQueue(startingv)

        while !graphQueue.isEmpty() {
            // Traverse the next queued vertex
            guard let vitem = graphQueue.deQueue() else {
                break
            }

            // Add unvisited vertices to the queue
            for e in vitem.neighbors {
                if e.neighbor.visited == false {
                    graphQueue.enQueue(e.neighbor)
                }
            }

            vitem.visited = true
            print("traversed vertex: \(vitem.tvalue!)..")
        }

        print("graph traversal complete..")
    }
}
```

### BFS with closure support

A more flexible version allows you to execute custom logic on each vertex using a closure with an `inout` parameter:

```swift
extension Graph {
    // BFS traversal with inout closure function
    public func traverse(_ startingv: Vertex<T>, formula: (_ node: inout Vertex<T>) -> ()) {
        // Establish a new queue
        let graphQueue: Queue<Vertex<T>> = Queue<Vertex<T>>()

        // Queue a starting vertex
        graphQueue.enQueue(startingv)

        while !graphQueue.isEmpty() {
            // Traverse the next queued vertex
            guard var vitem = graphQueue.deQueue() else {
                break
            }

            // Add unvisited vertices to the queue
            for e in vitem.neighbors {
                if e.neighbor.visited == false {
                    print("adding vertex: \(e.neighbor.tvalue!) to queue..")
                    graphQueue.enQueue(e.neighbor)
                }
            }

            /*
            Notes: this demonstrates how to invoke a closure with an inout parameter.
            By passing by reference no return value is required.
            */

            // Invoke formula
            formula(&vitem)
        }

        print("graph traversal complete..")
    }
}

// Example usage
let graph = Graph<String>()
let vertexA = Vertex(with: "A")
let vertexB = Vertex(with: "B")
let vertexC = Vertex(with: "C")

graph.addVertex(element: vertexA)
graph.addVertex(element: vertexB)
graph.addVertex(element: vertexC)

graph.addEdge(source: vertexA, neighbor: vertexB, weight: 1)
graph.addEdge(source: vertexB, neighbor: vertexC, weight: 1)

// Traverse with custom logic
graph.traverse(vertexA) { vertex in
    vertex.visited = true
    print("Processing vertex: \(vertex.tvalue!)")
}
```

### Understanding traversal complexity

BFS has the following complexity:
- **Time Complexity**: O(V + E) where V is the number of vertices and E is the number of edges
- **Space Complexity**: O(V) for storing visited vertices and the queue

## Finding shortest paths with Dijkstra's algorithm

While BFS finds the shortest path in terms of the number of edges (hops), many real-world problems require finding the shortest path when edges have different weights or costs. This is where Dijkstra's algorithm becomes essential.

### The shortest path problem

Consider these real-world scenarios where edge weights matter:

- **GPS Navigation**: Roads have different lengths and travel times
- **Network Routing**: Network links have different latencies
- **Flight Planning**: Routes have different costs and durations
- **Social Networks**: Connections have different "strengths" or relationship levels

### Understanding the frontier concept

The **frontier** is the key concept that makes Dijkstra's algorithm work. Think of it as the "edge of exploration" – the set of paths you're currently considering but haven't fully explored yet.

**Analogy: Exploring a cave system**

Imagine you're exploring a cave with multiple tunnels:
- You start at the entrance
- You can see several tunnels leading out (this is your **frontier**)
- You pick the shortest tunnel to explore first
- When you reach its end, you discover new tunnels (you **expand the frontier**)
- You always choose the shortest unexplored path from your current options
- You keep track of where you've been to avoid going in circles

**How the frontier works in Dijkstra's:**

1. Initialize: Add all paths from the starting vertex to the frontier
2. Select: Pick the shortest path from the frontier (greedy choice)
3. Explore: From that path's destination, discover new possible paths
4. Expand: Add these new paths to the frontier
5. Remove: Take the explored path out of the frontier
6. Repeat: Continue until you've found the destination or explored everything

### The Path class: Tracking paths in the frontier

```swift
/**
 The `Path` class maintains objects that comprise the `frontier`.
 */
public class Path<T> {
    var total: Int
    var destination: Vertex<T>
    var previous: Path?

    // Object initialization
    public init() {
        destination = Vertex<T>()
        total = 0
    }
}
```

**Why we need Path objects:**

Without the `Path` class, we'd only track vertices. But we need to know:
- **How we got there** (`previous`) - to reconstruct the final path
- **What it cost us** (`total`) - to compare different routes
- **Where we are** (`destination`) - which vertex this path reaches

### Dijkstra's algorithm implementation

Here's the complete algorithm as it appears in the production code:

```swift
extension Graph {
    // Process Dijkstra's shortest path algorithm
    public func processDijkstra(_ source: Vertex<T>, destination: Vertex<T>) -> Path<T>? {

        var frontier: Array<Path<T>> = Array<Path<T>>()
        var finalPaths: Array<Path<T>> = Array<Path<T>>()

        // Use source edges to populate the frontier
        for e in source.neighbors {
            let newPath: Path = Path<T>()

            newPath.destination = e.neighbor
            newPath.previous = nil
            newPath.total = e.weight

            // Add the new path to the frontier
            frontier.append(newPath)
        }

        // Construct the best path
        var bestPath: Path = Path<T>()

        while frontier.count != 0 {
            bestPath = Path()

            // Support path changes using the greedy approach - O(n)
            var pathIndex: Int = 0

            for x in 0..<frontier.count {
                let itemPath: Path = frontier[x]

                if (bestPath.total == 0) || (itemPath.total < bestPath.total) {
                    bestPath = itemPath
                    pathIndex = x
                }
            }

            // Enumerate the bestPath edges
            for e in bestPath.destination.neighbors {
                let newPath: Path = Path<T>()

                newPath.destination = e.neighbor
                newPath.previous = bestPath
                newPath.total = bestPath.total + e.weight

                // Add the new path to the frontier
                frontier.append(newPath)
            }

            // Preserve the bestPath
            finalPaths.append(bestPath)

            // Remove the bestPath from the frontier
            frontier.remove(at: pathIndex)
        }

        // Establish the shortest path as an optional
        var shortestPath: Path! = Path<T>()

        for itemPath in finalPaths {
            if (itemPath.destination == destination) {
                if (shortestPath.total == 0) || (itemPath.total < shortestPath.total) {
                    shortestPath = itemPath
                }
            }
        }

        return shortestPath
    }
}
```

**Step-by-step explanation:**

1. **Initialize frontier** (lines 6-15): Create Path objects for all neighbors of the source vertex
2. **Greedy selection** (lines 22-30): Find the path in the frontier with the lowest total cost - this is O(n) per iteration
3. **Expand frontier** (lines 33-42): For the best path's destination, create new paths to its neighbors
4. **Update collections** (lines 45-48): Move the best path from frontier to finalPaths
5. **Find result** (lines 55-64): Search finalPaths for all paths reaching the destination, return the shortest

### Optimized Dijkstra with heap

The array-based frontier requires O(n) time to find the minimum path. Using a heap improves this to O(log n):

```swift
extension Graph {
    /// An optimized version of Dijkstra's shortest path algorithm
    public func processDijkstraWithHeap(_ source: Vertex<T>, destination: Vertex<T>) -> Path<T>? {

        let frontier: PathHeap = PathHeap<T>()
        let finalPaths: PathHeap = PathHeap<T>()

        // Use source edges to create the frontier
        for e in source.neighbors {
            let newPath: Path = Path<T>()

            newPath.destination = e.neighbor
            newPath.previous = nil
            newPath.total = e.weight

            // Add the new path to the frontier - O(log n)
            frontier.enQueue(newPath)
        }

        // Construct the best path
        while frontier.count != 0 {
            // Use the greedy approach to obtain the best path - O(1)
            guard let bestPath: Path = frontier.peek() else {
                break
            }

            // Enumerate the bestPath edges
            for e in bestPath.destination.neighbors {
                let newPath: Path = Path<T>()

                newPath.destination = e.neighbor
                newPath.previous = bestPath
                newPath.total = bestPath.total + e.weight

                // Add the new path to the frontier
                frontier.enQueue(newPath)
            }

            // Preserve the bestPaths that match destination
            if (bestPath.destination == destination) {
                finalPaths.enQueue(bestPath)
            }

            // Remove the bestPath from the frontier
            frontier.deQueue()
        }

        // Obtain the shortest path from the heap
        var shortestPath: Path? = Path<T>()
        shortestPath = finalPaths.peek()

        return shortestPath
    }
}
```

**Performance comparison:**

| Implementation | Find Min | Time Complexity |
|---------------|----------|-----------------|
| Array-based | O(V) per iteration | O(V²) |
| Heap-based | O(1) peek, O(log V) enqueue | O((V + E) log V) |

The heap-based version is significantly faster for large graphs, as discussed in Chapter 15.

### Reversing the path

Once we have the shortest path, we can reverse it to get the sequence from source to destination:

```swift
extension Graph {
    /**
     Reverse the sequence of paths given the shortest path. Process analogous to reversing a linked list.

     - Parameter head: The source Vertex.
     - Parameter source: The connecting destination `Vertex`.
     - Returns: The reversed `Path`.
     */
    public func reversePath(_ head: Path<T>?, source: Vertex<T>) -> Path<T>? {

        guard head != nil else {
            return head
        }

        // Mutated copy
        var output = head

        var current: Path! = output
        var prev: Path<T>!
        var next: Path<T>!

        while (current != nil) {
            next = current.previous
            current.previous = prev
            prev = current
            current = next
        }

        // Append the source path to the sequence
        let sourcePath: Path = Path<T>()

        sourcePath.destination = source
        sourcePath.previous = prev
        sourcePath.total = 0

        output = sourcePath

        return output
    }
}
```

This reversal technique is analogous to reversing a linked list (Chapter 9), using the same three-pointer approach.

### Practical example: Finding shortest routes

```swift
// Build a graph representing cities and distances
let graph = Graph<String>()

let sanFrancisco = Vertex(with: "San Francisco")
let denver = Vertex(with: "Denver")
let chicago = Vertex(with: "Chicago")
let newYork = Vertex(with: "New York")

graph.addVertex(element: sanFrancisco)
graph.addVertex(element: denver)
graph.addVertex(element: chicago)
graph.addVertex(element: newYork)

// Add routes with distances (weights)
graph.addEdge(source: sanFrancisco, neighbor: denver, weight: 1000)
graph.addEdge(source: sanFrancisco, neighbor: chicago, weight: 2100)
graph.addEdge(source: denver, neighbor: chicago, weight: 900)
graph.addEdge(source: chicago, neighbor: newYork, weight: 800)
graph.addEdge(source: denver, neighbor: newYork, weight: 1800)

// Find shortest path from San Francisco to New York
if let shortestPath = graph.processDijkstra(sanFrancisco, destination: newYork) {
    print("Shortest distance: \(shortestPath.total) miles")

    // Reverse to get the route
    if let route = graph.reversePath(shortestPath, source: sanFrancisco) {
        var current = route
        while current != nil {
            print("→ \(current!.destination.tvalue!)")
            current = current!.previous
        }
    }
}
// Output: San Francisco → Denver → Chicago → New York (2700 miles)
```

## Summary

Graphs are fundamental data structures that model relationships between objects:

**Key concepts:**
- Vertices represent objects, contain values of generic type T
- Edges connect vertices and have weights representing cost/distance
- Canvas holds all vertices in the graph
- **Adjacency lists** store each vertex's neighbors

**Traversal algorithms:**
- **BFS** explores level-by-level using a queue
- **Closure support** allows custom logic during traversal
- Time complexity: O(V + E)

**Shortest path finding:**
- **Dijkstra's algorithm** finds minimum cost paths in weighted graphs
- **The frontier** maintains the set of paths being explored
- **Path objects** track route, cost, and previous steps
- **Array-based**: O(V²) time complexity
- **Heap-optimized**: O((V + E) log V) time complexity

**Real-world applications:**
- GPS navigation systems
- Network routing protocols
- Social network analysis
- Flight route optimization

Understanding graphs and Dijkstra's frontier concept is fundamental to many algorithms in computer science and powers countless real-world applications from Google Maps to Internet routing.
