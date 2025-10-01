# Graphs

A graph is a data structure that shows a relationship (e.g., connection) between two or more objects. Because of their flexibility, graphs are one of the most widely used structures in modern computing. Popular tools and services like online maps, social networks, and even the Internet as a whole are based on how objects relate to one another. In this chapter, we'll highlight the key features of graphs and will demonstrate how to create a basic graph with Swift.

## The basics

As discussed, a graph is a model that shows how objects relate to one another. Graph objects are usually referred to as nodes or vertices. While it would be possible to build and graph a single node, models that contain multiple vertices better represent real-world applications.

Graph objects relate to one another through connections called edges. Depending on your requirements, a vertex could be linked to one or more objects through a series of edges. It's also possible to create a vertex without edges. Here are some basic graph configurations:

- An undirected graph with two vertices and one edge.
- An undirected graph with three vertices and three edges.
- An undirected graph with four vertices and three edges.

## Directed vs. undirected

As shown above, there are many ways to configure a graph. An additional option is to set the model to be either directed or undirected. The examples above represent undirected graphs. In other words, the connection between vertices A and B is equivalent to the connection between vertices B and A. Social networks are a great example of undirected graphs. Once a request is accepted, both parties (e.g. the sender and recipient) share a mutual connection.

A service like Google Maps is a great example of a directed graph. Unlike an undirected graph, directed graphs only support a one-way connection between source vertices and their destinations. So, for example, vertex A could be connected to B, but A wouldn't necessarily be reachable through B. To show the varying relationship between vertices, directed graphs are drawn with lines and arrows.

## Edges & weights

Regardless of graph type, it's common to represent the level of connectedness between vertices. Normally associated with an edge, the weight is a numerical value tracked for this purpose. As we'll see, modeling of graphs with edge weights can be used to solve a variety of problems.

*A directed graph with three vertices and three weighted edges.*

## The vertex

With our understanding of graphs in place, let's build a basic directed graph with edge weights. To start, here's a data structure that represents a vertex:

```swift
public class Vertex {
    var key: String?
    var neighbors: Array<Edge>

    init() {
        self.neighbors = Array<Edge>()
    }
}
```

As we've seen with other structures, the key represents the data to be associated with a class instance. To keep things straightforward, our key is declared as a string. In a production app, the key type would be replaced with a generic placeholder, `<T>`. This would allow the key to store any object like an integer, account or profile.

## Adjacency lists

The neighbors property is an array that represents connections a vertex may have with other vertices. As discussed, a vertex can be associated with one or more items. This list of neighboring items is sometimes called an adjacency list and can be used to solve a variety of problems. Here's a basic data structure that represents an edge:

```swift
public class Edge {
    var neighbor: Vertex
    var weight: Int

    init() {
        weight = 0
        self.neighbor = Vertex()
    }
}
```

## Building the graph

With our vertex and edge objects built, we can use these structures to construct a graph. To keep things straightforward, we'll focus on the essential operations of adding and configuring vertices.

```swift
public class SwiftGraph {
    //declare graph canvas
    private var canvas: Array<Vertex>
    public var isDirected: Bool

    init() {
        canvas = Array<Vertex>()
        isDirected = true
    }

    //create a new vertex
    func addVertex(key: String) -> Vertex {
        //set the key
        let childVertex: Vertex = Vertex()
        childVertex.key = key

        //add the vertex to the graph canvas
        canvas.append(childVertex)

        return childVertex
    }
}
```

The function addVertex accepts a string which is used to create a new vertex. The SwiftGraph class also has a private property named canvas which is used to manage all vertices. While not required, the canvas can be used to track and manage vertices with or without edges.

## Making connections

Once a vertex is added, it can be connected to other vertices. Here's the process of establishing an edge:

```swift
//add edge to source vertex
func addEdge(source: Vertex, neighbor: Vertex, weight: Int) {
    //new edge
    let newEdge = Edge()

    //establish default properties
    newEdge.neighbor = neighbor
    newEdge.weight = weight
    source.neighbors.append(newEdge)

    //check condition for an undirected graph
    if isDirected == false {
        //create a new reversed edge
        let reverseEdge = Edge()

        //establish the reversed properties
        reverseEdge.neighbor = source
        reverseEdge.weight = weight
        neighbor.neighbors.append(reverseEdge)
    }
}
```

The function addEdge receives two vertices, identifying them as source and neighbor. Since our model defaults to a directed graph, a new Edge is created and is added to the adjacency list of the source Vertex. For an undirected graph, an additional Edge is created and added to the neighbor Vertex.

As we've seen, there are many components to graph theory. Before exploring advanced algorithms like shortest paths, we need to understand how to systematically visit all vertices in a graph. This process is called graph traversal.

## Graph traversals

Graph traversal is the process of visiting every vertex in a graph exactly once. Unlike trees, graphs can contain cycles, so we need to track which vertices we've already visited to avoid infinite loops. There are two fundamental approaches to graph traversal: Depth-First Search (DFS) and Breadth-First Search (BFS).

### Depth-first search (DFS)

Depth-First Search explores as far as possible along each branch before backtracking. It uses either recursion or a stack data structure to track the path. DFS is useful for detecting cycles, finding connected components, and solving maze-like problems.

```swift
extension SwiftGraph {
    func depthFirstSearch(from startVertex: Vertex) -> [String] {
        var visited: Set<String> = []
        var result: [String] = []

        dfsHelper(vertex: startVertex, visited: &visited, result: &result)
        return result
    }

    private func dfsHelper(vertex: Vertex, visited: inout Set<String>, result: inout [String]) {
        guard let key = vertex.key else { return }

        //mark current vertex as visited
        visited.insert(key)
        result.append(key)

        //recursively visit all unvisited neighbors
        for edge in vertex.neighbors {
            guard let neighborKey = edge.neighbor.key else { continue }

            if !visited.contains(neighborKey) {
                dfsHelper(vertex: edge.neighbor, visited: &visited, result: &result)
            }
        }
    }
}

//example usage
let graph = SwiftGraph()
let vertexA = graph.addVertex(key: "A")
let vertexB = graph.addVertex(key: "B")
let vertexC = graph.addVertex(key: "C")
let vertexD = graph.addVertex(key: "D")

graph.addEdge(source: vertexA, neighbor: vertexB, weight: 1)
graph.addEdge(source: vertexB, neighbor: vertexC, weight: 1)
graph.addEdge(source: vertexC, neighbor: vertexD, weight: 1)
graph.addEdge(source: vertexA, neighbor: vertexD, weight: 1)

print("DFS traversal: \(graph.depthFirstSearch(from: vertexA))")
//outputs: ["A", "B", "C", "D"] (order may vary based on implementation)
```

### Breadth-first search (BFS)

Breadth-First Search explores all vertices at the current depth before moving to vertices at the next depth level. It uses a queue data structure and is particularly useful for finding the shortest path in unweighted graphs and exploring graphs level by level.

```swift
extension SwiftGraph {
    func breadthFirstSearch(from startVertex: Vertex) -> [String] {
        var visited: Set<String> = []
        var result: [String] = []
        var queue: [Vertex] = [startVertex]

        guard let startKey = startVertex.key else { return result }
        visited.insert(startKey)

        while !queue.isEmpty {
            let currentVertex = queue.removeFirst()

            guard let currentKey = currentVertex.key else { continue }
            result.append(currentKey)

            //add all unvisited neighbors to queue
            for edge in currentVertex.neighbors {
                guard let neighborKey = edge.neighbor.key else { continue }

                if !visited.contains(neighborKey) {
                    visited.insert(neighborKey)
                    queue.append(edge.neighbor)
                }
            }
        }

        return result
    }
}

print("BFS traversal: \(graph.breadthFirstSearch(from: vertexA))")
//outputs: ["A", "B", "D", "C"] (explores level by level)
```

### Iterative depth-first search

For those who prefer an iterative approach or want to avoid potential stack overflow with deep recursion, here's an iterative version of DFS using an explicit stack:

```swift
extension SwiftGraph {
    func depthFirstSearchIterative(from startVertex: Vertex) -> [String] {
        var visited: Set<String> = []
        var result: [String] = []
        var stack: [Vertex] = [startVertex]

        while !stack.isEmpty {
            let currentVertex = stack.removeLast()

            guard let currentKey = currentVertex.key else { continue }

            if !visited.contains(currentKey) {
                visited.insert(currentKey)
                result.append(currentKey)

                //add neighbors to stack (in reverse order for consistent traversal)
                for edge in currentVertex.neighbors.reversed() {
                    guard let neighborKey = edge.neighbor.key else { continue }

                    if !visited.contains(neighborKey) {
                        stack.append(edge.neighbor)
                    }
                }
            }
        }

        return result
    }
}
```

### Path finding with BFS

One of the most useful applications of BFS is finding the shortest path between two vertices in an unweighted graph:

```swift
extension SwiftGraph {
    func shortestPath(from start: Vertex, to destination: Vertex) -> [String]? {
        guard let startKey = start.key, let destKey = destination.key else { return nil }

        var visited: Set<String> = []
        var parent: [String: String] = [:]
        var queue: [Vertex] = [start]

        visited.insert(startKey)

        while !queue.isEmpty {
            let currentVertex = queue.removeFirst()
            guard let currentKey = currentVertex.key else { continue }

            //found destination
            if currentKey == destKey {
                return reconstructPath(from: startKey, to: destKey, parent: parent)
            }

            //explore neighbors
            for edge in currentVertex.neighbors {
                guard let neighborKey = edge.neighbor.key else { continue }

                if !visited.contains(neighborKey) {
                    visited.insert(neighborKey)
                    parent[neighborKey] = currentKey
                    queue.append(edge.neighbor)
                }
            }
        }

        return nil //no path found
    }

    private func reconstructPath(from start: String, to destination: String, parent: [String: String]) -> [String] {
        var path: [String] = []
        var current = destination

        while current != start {
            path.append(current)
            guard let prev = parent[current] else { break }
            current = prev
        }

        path.append(start)
        return path.reversed()
    }
}

//find shortest path
if let path = graph.shortestPath(from: vertexA, to: vertexC) {
    print("Shortest path from A to C: \(path)")
}
```

### Understanding traversal complexity

Both DFS and BFS have the same time complexity:
- **Time Complexity**: O(V + E) where V is the number of vertices and E is the number of edges
- **Space Complexity**: O(V) for storing visited vertices and the recursion stack/queue

### When to use each traversal

**Use DFS when:**
- Finding connected components
- Detecting cycles in graphs
- Solving maze problems
- Topological sorting
- Memory is limited (DFS typically uses less memory)

**Use BFS when:**
- Finding shortest paths in unweighted graphs
- Level-order exploration is needed
- Finding all vertices at a specific distance
- Web crawling applications

These traversal algorithms demonstrate how the recursive and queue-based patterns from earlier chapters apply to more complex data structures. Understanding these fundamentals is essential before exploring advanced algorithms like Dijkstra's shortest path.

## Shortest paths

As discussed earlier in this chapter, graphs show the relationship between two or more objects. Because of their flexibility, graphs are used in a wide range of applications including map-based services, networking and social media. Popular models may include roads, traffic, people and locations. In this chapter, we'll review how to search a graph and will implement a popular algorithm called Dijkstra's shortest path.

### Making connections

The challenge with graphs is knowing how a vertex relates to other objects. Consider the social networking website, LinkedIn. With LinkedIn, each profile can be thought of as a single vertex that may be connected with other vertices.

One feature of LinkedIn is the ability to introduce yourself to new people. Under this scenario, LinkedIn will suggest routing your message through a shared connection. In graph theory, the most efficient way to deliver your message is called the shortest path.

*The shortest path from vertex A to C is through vertex B*

### Dijkstra's algorithm

Edsger Dijkstra's algorithm was published in 1959 and is designed to find the shortest path between two vertices in a directed graph with non-negative edge weights.

```swift
//the path class maintains objects that comprise the "frontier"
class Path {
    var total: Int
    var destination: Vertex
    var previous: Path?

    //object initialization
    init() {
        destination = Vertex()
        total = 0
    }
}

//Dijkstra's shortest path algorithm
func processDijkstra(source: Vertex, destination: Vertex) -> Path? {
    var frontier = Array<Path>()
    var finalPaths = Array<Path>()

    //use source edges to create the frontier
    for e in source.neighbors {
        let newPath: Path = Path()

        newPath.destination = e.neighbor
        newPath.previous = nil
        newPath.total = e.weight

        //add the new path to the frontier
        frontier.append(newPath)
    }

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

        //enumerate the bestPath edges
        for e in bestPath.destination.neighbors {
            let newPath: Path = Path()

            newPath.destination = e.neighbor
            newPath.previous = bestPath
            newPath.total = bestPath.total + e.weight

            //add the new path to the frontier
            frontier.append(newPath)
        }

        //preserve the bestPath
        finalPaths.append(bestPath)

        //remove the bestPath from the frontier
        frontier.remove(at: pathIndex)
    } //end while

    // Return result...
    return nil
}
```

Dijkstra's algorithm is an elegant solution to a complex problem. It calculates the shortest path from a single source to all other vertices in the graph, making it a "single source" shortest path algorithm.

