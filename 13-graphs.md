---
layout: field-notes
title: "Chapter 13: Graphs"
description: "Model graphs in Swift with adjacency lists, breadth-first search, and depth-first search"
---
# Graphs

Graphs generalize the tree structures from [Chapters 11-12](11-binary-search-trees.md). While trees enforce a strict parent-child hierarchy, graphs allow any vertex to connect to any other vertex, creating relationships and multiple paths between nodes. This flexibility makes graphs perfect for modeling real-world networks.

In this chapter, we'll highlight the key features of graphs and demonstrate how to create graph structures with Swift. We'll explore how to represent vertices and edges, build graph data structures, and implement graph traversal algorithms that enable applications to navigate complex networks of connected data.

## The basics

As discussed, a graph is a model that shows how objects relate to one another. Graph objects are usually referred to as nodes or [vertices](https://en.wikipedia.org/wiki/Vertex_(graph_theory)). While it would be possible to build and graph a single node, models that contain multiple vertices better represent real-world applications.

Graph objects relate to one another through connections called [edges](https://en.wikipedia.org/wiki/Glossary_of_graph_theory#edge). Depending on the requirements, a vertex could be linked to one or more objects through a series of edges. It's also possible to create a vertex without edges. A few basic configurations illustrate the range. Two vertices A and B joined by a single edge form the simplest connected graph. Three vertices A, B, and C joined in a line (A to B, B to C) form a path, where A reaches C only by passing through B. Adding an edge from C back to A closes the path into a cycle, so every vertex can now be reached two ways. And a fourth vertex D with no edges at all is still part of the graph, just unreachable from the others.

## Directed vs undirected

As we've seen, there are many ways to configure a graph. An additional option is to set the model to be either directed or undirected. The configurations we just described are undirected graphs. In other words, the connection between vertices A and B is equivalent to the connection between vertices B and A. Social networks are a great example of undirected graphs. Once a request is accepted, both parties (e.g. the sender and recipient) share a mutual connection.

A service like Google Maps is a great example of a directed graph. Unlike an undirected graph, directed graphs only support a one-way connection between source vertices and their destinations. So, for example, vertex A could be connected to B, but A wouldn't necessarily be reachable through B. To show the varying relationship between vertices, directed graphs are drawn with lines and arrows.

## Edges and weights

Regardless of graph type, it's common to represent the level of connectedness between vertices. Normally associated with an edge, the `weight` is a numerical value tracked for this purpose. As we'll see, modeling of graphs with edge weights can be used to solve a variety of problems.

## The vertex

With our understanding of graphs in place, let's build a graph using [generics](https://en.wikipedia.org/wiki/Generic_programming) from [Chapter 7](07-generics.md). This allows the graph to work with any data type. Here's the data structure for a vertex:

```swift
import Foundation

// Generic vertex with neighbors array and a unique identity
public class Vertex<T>: Equatable {

    var tvalue: T?
    var neighbors = Array<Edge<T>>()
    let uuid = UUID()

    // Creates a vertex with no value
    public init() {
        // Default initialization
    }

    // Creates a vertex holding the specified value
    public init(with name: T) {
        self.tvalue = name
    }

    // Equatable conformance
    public static func == (lhs: Vertex, rhs: Vertex) -> Bool {
        return lhs.uuid == rhs.uuid
    }
}
```

The `Vertex` class stores a generic value in `tvalue` and maintains an array of `Edge` connections in `neighbors`. Each vertex receives a unique `uuid` for identity comparison; `UUID` comes from Foundation, which is why the listing begins with `import Foundation`. The `Equatable` conformance allows us to compare vertices using `==` — two vertices are equal if they have the same UUID, even if their values differ.

## Adjacency lists

The `neighbors` property is an array that represents connections a vertex may have with other vertices. As discussed, a vertex can be associated with one or more items. This list of neighboring items is sometimes called an adjacency list and can be used to solve a variety of problems. Here's a basic data structure that represents an edge:

```swift
// Edge connecting vertex to neighbor with weighted cost
public class Edge<T> {

    var neighbor: Vertex<T>
    var weight: Int

    // Creates an edge with zero weight and a placeholder neighbor
    init() {
        weight = 0
        self.neighbor = Vertex<T>()
    }
}
```

Each edge contains a reference to a neighboring vertex through `neighbor` and a `weight` representing the cost of the connection.

## Building the graph

With our vertex and edge objects built, we can use these structures to construct a graph:

```swift
// Graph structure with canvas holding all vertices
public class Graph<T> {
    var canvas: Array<Vertex<T>>

    // Creates an empty graph
    public init() {
        canvas = Array<Vertex>()
    }

    // Add vertex to graph canvas
    public func addVertex(element: Vertex<T>) {
        canvas.append(element)
    }

    // Create a directed connection from source to neighbor
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

The `Graph` class maintains all vertices in a `canvas` array. The `addVertex` method registers a vertex with the graph, while `addEdge` creates a directed, weighted connection from a source vertex to a `neighbor`.

## Graph traversals

Graph traversal is the process of visiting every vertex reachable from a starting point exactly once. Unlike trees from [Chapters 11](11-binary-search-trees.md)-[12](12-tree-balancing.md), graphs can contain cycles and multiple paths to the same vertex, so we need to track which vertices we've already discovered to avoid repeated work and infinite loops. We'll keep that record in a `Set` of vertex identifiers that belongs to each traversal, so every call starts fresh and the vertices themselves carry no leftover state.

### Breadth-first search

Breadth-First Search explores all vertices at the current depth before moving to vertices at the next depth level. It uses a **queue** data structure from [Chapter 10](10-stacks-and-queues.md). Recall that queues maintain first-in, first-out (FIFO) ordering, which ensures we process vertices level by level:

```swift
// BFS traversal using queue for level-by-level exploration - O(V + E)
extension Graph {
    public func traverse(_ startingv: Vertex<T>) {

        // Establish a new queue
        let graphQueue: Queue<Vertex<T>> = Queue<Vertex<T>>()

        // Vertices already queued - local to this traversal
        var discovered = Set<UUID>([startingv.uuid])

        // Queue a starting vertex
        graphQueue.enQueue(startingv)

        while !graphQueue.isEmpty() {
            // Traverse the next queued vertex
            guard let vitem = graphQueue.deQueue() else {
                break
            }

            // Queue each neighbor the first time it's discovered
            for e in vitem.neighbors {
                if discovered.contains(e.neighbor.uuid) == false {
                    discovered.insert(e.neighbor.uuid)
                    graphQueue.enQueue(e.neighbor)
                }
            }

            if let tvalue = vitem.tvalue {
                print("traversed vertex: \(tvalue)..")
            }
        }

        print("graph traversal complete..")
    }
}
```

The key detail is when a vertex is marked. Each vertex is added to `discovered` the moment it's queued, not later when it's processed. Consider a diamond-shaped graph where A links to B and C, and both B and C link to D. If we waited to mark D until it was processed, both B and C would see it as new and D would be queued twice. Marking at discovery guarantees that every vertex enters the queue at most once.

### BFS with closure support

A more flexible version allows us to execute custom logic on each vertex using a closure with an `inout` parameter:

```swift
// BFS traversal with custom closure logic on each vertex - O(V + E)
extension Graph {
    public func traverse(_ startingv: Vertex<T>, formula: (_ node: inout Vertex<T>) -> ()) {
        // Establish a new queue
        let graphQueue: Queue<Vertex<T>> = Queue<Vertex<T>>()

        // Vertices already queued - local to this traversal
        var discovered = Set<UUID>([startingv.uuid])

        // Queue a starting vertex
        graphQueue.enQueue(startingv)

        while !graphQueue.isEmpty() {
            // Traverse the next queued vertex
            guard var vitem = graphQueue.deQueue() else {
                break
            }

            // Queue each neighbor the first time it's discovered
            for e in vitem.neighbors {
                if discovered.contains(e.neighbor.uuid) == false {
                    discovered.insert(e.neighbor.uuid)
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
```

Because the traversal tracks discovery itself, the closure is free to focus on its own work. It doesn't need to mark anything, and a closure that only prints or accumulates values still terminates on a cyclic graph. Example usage showing custom traversal logic:

```swift
// Build sample graph and traverse with custom logic
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
    if let tvalue = vertex.tvalue {
        print("Processing vertex: \(tvalue)")
    }
}
```

### Understanding traversal complexity

BFS runs in `O(V + E)` time where V is the number of vertices and E is the number of edges reachable from the start. Each vertex is queued and dequeued once, and each vertex's edges are examined once when it's processed. Two supporting operations make this bound hold: the `Set` answers `contains` and `insert` in `O(1)` on average, and the queue from [Chapter 10](10-stacks-and-queues.md) adds to its back in `O(1)` thanks to its `tail` pointer. A queue that walked to its last node on every insertion would turn the same traversal into `O(V²)`. The space complexity is `O(V)` for the `discovered` set and the queue. These complexity characteristics connect to the performance analysis techniques from [Chapter 8](08-performance-analysis.md).

## Topological sort

Topological sorting orders vertices in a directed graph so prerequisites come **before** the items that depend on them. Consider college course dependencies: we need Algebra 101 before Math 500, and Math 500 before Physics. We model each requirement as an edge pointing from the prerequisite to the course that requires it, so Algebra 101 links to Math 500 and Math 500 links to Physics. Topological sort finds a valid ordering automatically.

Recall from [Chapter 11](11-binary-search-trees.md) that post-order traversal processes children before parents. Topological sort uses this exact same pattern — finish all of a vertex's `neighbors` (the courses that depend on it) before recording the vertex itself. That post-order places every course after everything that depends on it, so reversing the result puts each prerequisite first. The algorithm also detects cycles, since topological ordering is only possible on directed acyclic graphs (DAGs). If a cycle exists — say Course A requires Course B, which requires Course C, which requires Course A — no valid ordering exists and the method returns `nil`:

```swift
// Topological sort with cycle detection - O(V + E)
extension Graph {
    // Return vertices ordered so every edge points forward, or nil if a cycle exists
    public func topologicalSort() -> [Vertex<T>]? {
        var result: [Vertex<T>] = []
        var visiting = Set<UUID>()
        var visited = Set<UUID>()

        // Process all vertices (handles disconnected components)
        for vertex in canvas {
            if !visited.contains(vertex.uuid) {
                if !topologicalDFS(vertex, result: &result,
                                   visiting: &visiting, visited: &visited) {
                    return nil
                }
            }
        }

        return result.reversed()
    }

    // Recursively visit vertex using post-order traversal pattern
    private func topologicalDFS(_ vertex: Vertex<T>,
                                result: inout [Vertex<T>],
                                visiting: inout Set<UUID>,
                                visited: inout Set<UUID>) -> Bool {

        // Cycle detection: vertex is currently in the recursion stack
        if visiting.contains(vertex.uuid) {
            return false
        }

        // Already fully processed
        if visited.contains(vertex.uuid) {
            return true
        }

        visiting.insert(vertex.uuid)

        // Visit all neighbors recursively
        for edge in vertex.neighbors {
            if !topologicalDFS(edge.neighbor, result: &result,
                               visiting: &visiting, visited: &visited) {
                return false
            }
        }

        visiting.remove(vertex.uuid)
        visited.insert(vertex.uuid)

        // Post-order: add after all neighbors are processed
        result.append(vertex)

        return true
    }
}
```

The `visiting` set tracks vertices currently in the recursion stack. If we encounter a vertex that's already in `visiting`, we've found a back edge — proof that a cycle exists. The `visited` set tracks fully processed vertices to avoid redundant work. This two-set approach gives us cycle detection with `O(1)` lookups while keeping the core post-order pattern intact. The algorithm runs in `O(V + E)` time, visiting each vertex once and examining each edge once.

## Building algorithmic intuition

Graphs model relationships between entities, making them fundamental to countless applications — social networks, maps, web pages, and recommendation systems all express relationships through graph structures. Traversal algorithms reveal different exploration strategies: depth-first search explores deeply before backtracking (useful for path finding and cycle detection), while breadth-first search explores by distance (ideal for level-order processing and for shortest paths when every edge counts equally).

Graph representations demonstrate trade-offs between space and operation efficiency. Adjacency lists optimize for sparse graphs, adjacency matrices for dense graphs. Understanding these trade-offs connects to advanced graph algorithms like shortest paths ([Chapter 16](16-shortest-paths.md)) and PageRank ([Chapter 19](19-pagerank-algorithm.md)). Mastering basic graph operations provides the foundation for complex network algorithms.
