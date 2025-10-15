---
layout: chapter
title: "Chapter 13: Graphs"
description: "Explore graph data structures and algorithms"
---
# Graphs

Open Maps on your iPhone. Search for "nearest trail." Within seconds, the app shows every hiking trail near you, how they connect, and which route gets you there fastest. This is a graph in action—vertices (trail intersections) connected by edges (trail segments), with weights (distances or elevation gain). Every time you navigate, plan a route, or let AllTrails suggest a loop hike, you're using graph algorithms.

Graphs generalize the tree structures from [Chapters 11-12](11-binary-search-trees.md). While trees enforce a strict parent-child hierarchy, graphs allow any vertex to connect to any other vertex, creating cycles and multiple paths between nodes. This flexibility makes graphs perfect for modeling real-world networks—from trail systems to workout route planning to how iOS apps share data.

In this chapter, we'll highlight the key features of graphs and demonstrate how to create graph structures with Swift. You'll also learn Dijkstra's shortest path algorithm—one of the most important algorithms in computer science, powering everything from GPS navigation to Internet routing.

## The basics

As discussed, a graph is a model that shows how objects relate to one another. Graph objects are usually referred to as nodes or [vertices](https://en.wikipedia.org/wiki/Vertex_(graph_theory)). While it would be possible to build and graph a single node, models that contain multiple vertices better represent real-world applications.

Graph objects relate to one another through connections called [edges](https://en.wikipedia.org/wiki/Glossary_of_graph_theory#edge). Depending on your requirements, a vertex could be linked to one or more objects through a series of edges. It's also possible to create a vertex without edges. Here are some basic graph configurations:


## Directed vs. undirected

As shown above, there are many ways to configure a graph. An additional option is to set the model to be either directed or undirected. The examples above represent undirected graphs. In other words, the connection between vertices A and B is equivalent to the connection between vertices B and A. Social networks are a great example of undirected graphs. Once a request is accepted, both parties (e.g. the sender and recipient) share a mutual connection.

A service like Google Maps is a great example of a directed graph. Unlike an undirected graph, directed graphs only support a one-way connection between source vertices and their destinations. So, for example, vertex A could be connected to B, but A wouldn't necessarily be reachable through B. To show the varying relationship between vertices, directed graphs are drawn with lines and arrows.

Consider Strava's route builder. When you plan a run, some streets allow you to run in both directions (undirected edges), while others might be one-way roads or paths with gates that only open one direction (directed edges). The graph must model these constraints to provide valid routes. If you've ever had Strava suggest a route that includes a one-way street in the wrong direction, that's a directed graph problem—the algorithm failed to account for edge directionality.

## Edges & weights

Regardless of graph type, it's common to represent the level of connectedness between vertices. Normally associated with an edge, the weight is a numerical value tracked for this purpose. As we'll see, modeling of graphs with edge weights can be used to solve a variety of problems.

In AllTrails, edge weights represent different metrics depending on your goals. Planning the shortest hike? Weights are distances in miles. Want the easiest route? Weights represent elevation gain. Optimizing for time? Weights reflect estimated duration based on terrain difficulty. The same trail graph with different edge weights produces completely different "optimal" paths. This is why AllTrails can offer multiple route suggestions for the same destination—each optimizes a different weight function.

## Graphs in iOS and fitness apps

Every time you navigate in Maps, the app uses graph algorithms on road networks. Vertices represent intersections, edges represent road segments, and weights represent distance, time, or traffic conditions.

Fitness apps rely heavily on graph structures. AllTrails models trail systems as graphs where intersections are vertices and trail segments are edges. Strava uses graphs for route suggestions based on segment popularity and elevation profiles. Running apps find loops that return you to your starting point using cycle detection algorithms. Even the Health app tracks relationships between data types as graphs of correlations—sleep quality affects workout performance, workout intensity affects heart rate recovery. These causal relationships form a graph of health metrics.

iOS frameworks use graphs extensively. App dependencies form directed acyclic graphs. The [responder chain](https://developer.apple.com/documentation/uikit/using-responders-and-the-responder-chain-to-handle-events) uses graph traversal to pass events through the view hierarchy. Understanding graphs helps you reason about these systems and build better iOS applications.

## The vertex

With our understanding of graphs in place, let's build a graph using [generics](https://en.wikipedia.org/wiki/Generic_programming) from Chapter 7. This allows the graph to work with any data type. Here's the data structure for a vertex:

```swift
// Generic vertex with neighbors array and traversal tracking
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
// Edge connecting vertex to neighbor with weighted cost
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
// Graph structure with canvas holding all vertices
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

Graph traversal is the process of visiting every vertex in a graph exactly once. Unlike trees (Chapters 11-12), graphs can contain cycles, so we need to track which vertices we've already visited to avoid infinite loops. This is where the `visited` property becomes essential.

### Breadth-first search (BFS)

Breadth-First Search explores all vertices at the current depth before moving to vertices at the next depth level. It uses a [queue](https://en.wikipedia.org/wiki/Queue_(abstract_data_type)) data structure from Chapter 10. Recall that queues maintain first-in, first-out (FIFO) ordering, which ensures we process vertices level by level:

```swift
// BFS traversal using queue for level-by-level exploration - O(V + E)
extension Graph {
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
// BFS traversal with custom closure logic on each vertex - O(V + E)
extension Graph {
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
```

Example usage showing custom traversal logic:

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
    vertex.visited = true
    print("Processing vertex: \(vertex.tvalue!)")
}
```

### Understanding traversal complexity

BFS has the following complexity from [Chapter 8](08-performance-analysis.md):
- **Time Complexity**: O(V + E) where V is the number of vertices and E is the number of edges
- **Space Complexity**: O(V) for storing visited vertices and the queue

