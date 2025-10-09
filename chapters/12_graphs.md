# Graphs

A graph is a data structure that shows a relationship (e.g., connection) between two or more objects. Because of their flexibility, graphs are one of the most widely used structures in modern computing. Popular tools and services like online maps, social networks, and even the Internet as a whole are based on how objects relate to one another. In this chapter, we'll highlight the key features of graphs and will demonstrate how to create a basic graph with Swift.

## The Basics

As discussed, a graph is a model that shows how objects relate to one another. Graph objects are usually referred to as nodes or vertices. While it would be possible to build a graph with a single node, models that contain multiple vertices better represent real-world applications.

Graph objects relate to one another through connections called edges. Depending on your requirements, a vertex could be linked to one or more objects through a series of edges. It's also possible to create a vertex without edges. Here are some basic graph configurations:

[diagram: An undirected graph with two vertices and one edge]

[diagram: An undirected graph with three vertices and three edges]

[diagram: An undirected graph with four vertices and three edges]

## Directed vs. Undirected

As shown above, there are many ways to configure a graph. An additional option is to set the model to be either directed or undirected. The examples above represent undirected graphs. In other words, the connection between vertices A and B is equivalent to the connection between vertices B and A. Social networks are a great example of undirected graphs. Once a request is accepted, both parties (e.g. the sender and recipient) share a mutual connection.

A service like Google Maps is a great example of a directed graph. Unlike an undirected graph, directed graphs only support a one-way connection between source vertices and their destinations. So, for example, vertex A could be connected to B, but A wouldn't necessarily be reachable through B. To show the varying relationship between vertices, directed graphs are drawn with lines and arrows.

## Edges & Weights

Regardless of graph type, it's common to represent the level of connectedness between vertices. Normally associated with an edge, the weight is a numerical value tracked for this purpose. As we'll see, modeling of graphs with edge weights can be used to solve a variety of problems.

[diagram: A directed graph with three vertices and three weighted edges]

## The Vertex

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

### Adjacency Lists

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

## Building the Graph

> A graph canvas could also be implemented with a Swift "Set" collection type.

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
    func addVertex(key key: String) -> Vertex {
        //set the key
        let childVertex: Vertex = Vertex()
        childVertex.key = key

        //add the vertex to the graph canvas
        canvas.append(childVertex)

        return childVertex
    }
}
```

The function `addVertex` accepts a string which is used to create a new vertex. The SwiftGraph class also has a private property named canvas which is used to manage all vertices. While not required, the canvas can be used to track and manage vertices with or without edges.

## Making Connections

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

The function `addEdge` receives two vertices, identifying them as source and neighbor. Since our model defaults to a directed graph, a new Edge is created and is added to the adjacency list of the source Vertex. For an undirected graph, an additional Edge is created and added to the neighbor Vertex.

As we've seen, there are many components to graph theory. In the next section, we'll examine a popular problem (and solution) with graphs known as shortest paths.

---

# Shortest Paths

In the previous chapter, we saw how graphs show the relationship between two or more objects. Because of their flexibility, graphs are used in a wide range of applications including map-based services, networking and social media. Popular models may include roads, traffic, people and locations. In this chapter, we'll review how to search a graph and will implement a popular algorithm called Dijkstra's shortest path.

## Making Connections

The challenge with graphs is knowing how a vertex relates to other objects. Consider the social networking website, LinkedIn. With LinkedIn, each profile can be thought of as a single vertex that may be connected with other vertices.

One feature of LinkedIn is the ability to introduce yourself to new people. Under this scenario, LinkedIn will suggest routing your message through a shared connection. In graph theory, the most efficient way to deliver your message is called the shortest path.

[diagram: The shortest path from vertex A to C is through vertex B]

## Finding Your Way

Shortest paths can also be seen with map-based services like Google Maps. Users frequently use Google Maps to ascertain driving directions between two points. As we know, there are often multiple ways to get to any destination. The shortest route will often depend on various factors such traffic, road conditions, accidents and time of day. In graph theory, these external factors represent edge weights.

[diagram: The shortest path from vertex A to C is through vertex A]

This example illustrates some key points we'll see in Dijkstra's algorithm. In addition to there being multiple ways to arrive at vertex C from A, the shortest path is assumed to be through vertex B. It's only when we arrive to vertex C from B, we adjust our interpretation of the shortest path and change direction (e.g. 4 < (1 + 5)). This change in direction is known as the greedy approach and is used in similar problems like the traveling salesman.

## Introducing Dijkstra

Edsger Dijkstra's algorithm was published in 1959 and is designed to find the shortest path between two vertices in a directed graph with non-negative edge weights. Let's review how to implement this in Swift.

Even though our model is labeled with key values and edge weights, our algorithm can only see a subset of this information. Starting at the source vertex, our goal will be to traverse the graph.

## Using Paths

Throughout our journey, we'll track each node visit in a custom data structure called Path. The total will manage the cumulative edge weight to reach a particular destination. The previous property will represent the Path taken to reach that vertex.

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
```

## Deconstructing Dijkstra

With all the graph components in place, let's see how it works. The method `processDijkstra` accepts the vertices source and destination as parameters. It also returns a Path. Since it may not be possible to find the destination, the return value is declared as a Swift optional.

```swift
//process Dijkstra's shortest path algorithm
func processDijkstra(source: Vertex, destination: Vertex) -> Path? {
    ...
}
```

## Building the Frontier

As discussed, the key to understanding Dijkstra's algorithm is knowing how to traverse the graph. To help, we'll introduce a few rules and a new concept called the frontier.

```swift
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
```

The algorithm starts by examining the source vertex and iterating through its list of neighbors. Recall from the previous chapter, each neighbor is represented as an edge. For each iteration, information about the neighboring edge is used to construct a new Path. Finally, each Path is added to the frontier.

[diagram: The frontier visualized as a list]

With our frontier established, the next step involves traversing the Path with the smallest total weight (e.g., B). Identifying the bestPath is accomplished using this linear approach:

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

An important section to note is the while loop condition. As we traverse the graph, Path objects will be added and removed from the frontier. Once a Path is removed, we assume the shortest path to that destination as been found. As a result, we know we've traversed all possible paths when the frontier reaches zero.

```swift
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
```

As shown, we've used the bestPath to build a new series of Paths. We've also preserved our visit history with each new object. With this section completed, let's review our changes to the frontier:

[diagram: The frontier after visiting two additional vertices]

At this point, we've learned a little more about our graph. There are now two possible paths to vertex D. The shortest path has also changed to arrive at vertex C. Finally, the Path through route A-B has been removed and has been added to a new structure named finalPaths.

## A Single Source

Dijkstra's algorithm can be described as "single source" because it calculates the path to every vertex. In our example, we've preserved this information in the finalPaths array.

[diagram: The finalPaths once the frontier reaches zero. As shown, every permutation from vertex A is calculated]

Based on this data, we can see the shortest path to vertex E from A is A-D-E. The bonus is that in addition to obtaining information for a single route, we've also calculated the shortest path to each node in the graph.

## Asymptotics

Dijkstra's algorithm is an elegant solution to a complex problem. Even though we've used it effectively, we can improve its performance by making a few adjustments. We'll analyze those details in the next chapter.
