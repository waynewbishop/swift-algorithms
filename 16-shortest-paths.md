---
layout: chapter
title: "Chapter 16: Shortest Paths"
description: "Implement Dijkstra's shortest path algorithm in Swift with weighted graphs and priority queues"
---
# Shortest Paths

In [Chapter 13](13-graphs.md), we saw how graphs show the relationship between two or more objects. Because of their flexibility, graphs are used in a wide range of applications including map-based services, networking and social media. Popular models may include roads, traffic, people and locations. In this chapter, we'll review how to search a graph and will implement a popular algorithm called Dijkstra's shortest path.

## Making connections

The challenge with graphs is knowing how a `vertex` relates to other objects. Consider the social networking website, LinkedIn. With LinkedIn, each profile can be thought of as a single `vertex` that may be connected with other `vertices`.

One feature of LinkedIn is the ability to introduce ourselves to new people. Under this scenario, LinkedIn will suggest routing a message through a shared connection. In graph theory, the most efficient way to deliver a message is called the shortest path.

## Finding our way

Shortest paths can also be seen with map-based services like Google Maps. We frequently use Google Maps to ascertain driving directions between two points. As we know, there are often multiple ways to get to any destination. The shortest route will often depend on various factors such as traffic, road conditions, accidents and time of day. In graph theory, these external factors represent edge `weights`.

To make these ideas concrete, we'll work with a small directed graph of five locations, A through E. Each edge is a one-way road labeled with its travel cost:

```swift
// Weighted directed graph used throughout this chapter
let graph = Graph<String>()

let vertexA = Vertex(with: "A")
let vertexB = Vertex(with: "B")
let vertexC = Vertex(with: "C")
let vertexD = Vertex(with: "D")
let vertexE = Vertex(with: "E")

for vertex in [vertexA, vertexB, vertexC, vertexD, vertexE] {
    graph.addVertex(element: vertex)
}

graph.addEdge(source: vertexA, neighbor: vertexB, weight: 1)
graph.addEdge(source: vertexA, neighbor: vertexC, weight: 4)
graph.addEdge(source: vertexA, neighbor: vertexD, weight: 5)
graph.addEdge(source: vertexB, neighbor: vertexC, weight: 5)
graph.addEdge(source: vertexB, neighbor: vertexD, weight: 2)
graph.addEdge(source: vertexC, neighbor: vertexE, weight: 4)
graph.addEdge(source: vertexD, neighbor: vertexE, weight: 3)
```

This graph illustrates some key points we'll see in Dijkstra's algorithm. There are two ways to arrive at `vertex` C from A: directly for a cost of 4, or through B for `1 + 5 = 6`. Even though B is the closest neighbor of A, the cheapest route to C doesn't pass through it. The opposite happens with D. The direct road costs 5, but traveling through B costs only `1 + 2 = 3`, so the cheaper route arrives by way of B. The algorithm must recognize both situations: keep a route when a newly discovered alternative is worse, and replace it when the alternative is better. Always extending the cheapest route found so far is known as the **greedy approach**, and Dijkstra's algorithm shows that for non-negative weights this greedy choice always leads to the true shortest paths.

## Introducing Dijkstra

Edsger Dijkstra's algorithm was published in 1959 and is designed to find the shortest path between two `vertices` in a directed graph with non-negative edge `weights`. Let's review how to implement this in Swift.

Even though our model is labeled with key values and edge `weights`, our algorithm can only see a subset of this information. Starting at the source `vertex`, our goal will be to traverse the graph.

## Using paths

Throughout our journey, we'll track each route in a custom data structure called `Path`. The `total` will manage the cumulative edge `weight` to reach a particular destination. The `previous` property will represent the `Path` taken to reach the vertex before it:

```swift
// The Path class maintains objects that comprise the frontier
public class Path<T> {

    // Cumulative cost from source to this destination
    var total: Int

    // The vertex reached by following this path
    var destination: Vertex<T>

    // Reference to previous path segment, forming a linked chain
    var previous: Path?

    // Creates a new empty path with zero cost
    public init() {
        destination = Vertex<T>()
        total = 0
    }
}
```

Each `Path` records only its final step, and its `previous` reference leads back toward the source. Following `previous` from the destination reconstructs the entire route in reverse, much like walking a linked list from [Chapter 9](09-linked-lists.md).

## Deconstructing Dijkstra

With all the graph components in place, let's see how it works. The method `processDijkstra` accepts the vertices source and destination as parameters. It also returns a `Path`. Since it may not be possible to find the destination, the return value is declared as an optional:

```swift
// Process Dijkstra's shortest path algorithm
public func processDijkstra(_ source: Vertex<T>, destination: Vertex<T>) -> Path<T>? {
    ...
}
```

## Building the frontier

As discussed, the key to understanding Dijkstra's algorithm is knowing how to traverse the graph. To help, we'll introduce a few rules and two new concepts. The `frontier` holds the best route found so far to each vertex we've discovered but not yet finished. A vertex becomes **settled** once we're certain no cheaper route to it exists. The search begins with a single, zero-cost path that starts and ends at the source:

```swift
// Best known path to each unsettled vertex, keyed by vertex
var frontier = Dictionary<UUID, Path<T>>()

// Vertices whose shortest path is final
var settled = Set<UUID>()

// The source is reachable at zero cost
let sourcePath = Path<T>()
sourcePath.destination = source
frontier[source.uuid] = sourcePath
```

The `frontier` is a dictionary from [Chapter 15](15-hash-tables.md) keyed by each vertex's `uuid`, so it holds at most one path per vertex. When we find a cheaper route to a vertex already in the `frontier`, we simply replace its entry. Starting from a zero-cost source path also means that asking for the route from a vertex to itself returns immediately with a total of 0.

With our `frontier` established, each round of the algorithm selects the path with the smallest total `weight`. Identifying this `bestPath` is accomplished using a linear scan:

```swift
while frontier.count != 0 {

    // Find the cheapest frontier path using the greedy approach - O(V)
    var bestPath: Path<T>? = nil

    for itemPath in frontier.values {
        if let currentBest = bestPath, currentBest.total <= itemPath.total {
            continue
        }
        bestPath = itemPath
    }

    guard let shortest = bestPath else {
        break
    }
```

The cheapest path in the `frontier` is final. Every other route to its vertex would have to leave the `frontier` through some path that already costs at least as much, and with non-negative weights, adding more edges can't make that route cheaper. So we settle the vertex, and if it's our destination, we're done:

```swift
    // Settle the vertex - its shortest path is now final
    let vertex = shortest.destination
    frontier[vertex.uuid] = nil
    settled.insert(vertex.uuid)

    if vertex == destination {
        return shortest
    }
```

## Relaxing edges

Otherwise, we examine each edge leaving the newly settled vertex. For every neighbor that isn't yet settled, we compute the cost of reaching it through this vertex. If the neighbor has no `frontier` entry yet, or this route is cheaper than the entry it has, we record the new path. Otherwise, we leave the existing entry alone. This step is called **relaxing** an edge:

```swift
    // Relax each edge, keeping only improvements
    for e in vertex.neighbors {

        if settled.contains(e.neighbor.uuid) {
            continue
        }

        let newTotal = shortest.total + e.weight

        if let known = frontier[e.neighbor.uuid], known.total <= newTotal {
            continue
        }

        let newPath = Path<T>()
        newPath.destination = e.neighbor
        newPath.previous = shortest
        newPath.total = newTotal

        frontier[e.neighbor.uuid] = newPath
    }

} //end while

// The destination is unreachable from the source
return nil
```

The `settled` check is what makes the algorithm safe on graphs with cycles. Without it, a road from B back to A would let the search wander around the loop forever, creating ever more expensive paths. Because a settled vertex never re-enters the `frontier`, each vertex is settled exactly once and the loop is guaranteed to end. If the `frontier` empties without reaching the destination, no route exists and the method returns `nil`.

## Tracing the search

Let's follow the algorithm from A to E in our sample graph. The first round settles A at a cost of 0 and relaxes its three edges, placing B (1), C (4), and D (5) in the `frontier`.

The second round settles B, the cheapest entry. Relaxing B's edges reveals both situations from earlier. The route to C through B would cost 6, which is worse than the 4 already recorded, so the entry for C is unchanged. The route to D through B costs 3, which beats the 5 recorded for the direct road, so D's entry is replaced with the path A-B-D.

The third round settles D at a cost of 3 and records E at `3 + 3 = 6`. The fourth round settles C at 4; its road to E would cost 8, so E keeps its entry of 6. Finally, the fifth round selects E itself. Since E is our destination, the method returns its path. Following `previous` from E back to the source reveals the shortest route, A-B-D-E, with a total cost of 6.

## A single source

Dijkstra's algorithm can be described as "single source" because, left to run until the `frontier` empties, it settles the shortest path from the source to every reachable `vertex`. Our version stops as soon as the destination is settled, because that's all we asked for. Notice that by the time we reached E, we had also learned the shortest routes to B, C, and D. Removing the early `return` and recording each settled path would give us the shortest route to every location in one pass.

## Optimizing with heaps

Dijkstra's algorithm is an elegant solution to a complex problem. Even though we've used it effectively, our approach has a performance bottleneck. Finding the `bestPath` requires scanning every entry in the `frontier` — an `O(V)` operation that executes once for each of the V vertices we settle. Together with relaxing each of the E edges once, the array-based version runs in `O(V² + E)`, which simplifies to `O(V²)` since a simple graph has at most V² edges.

In [Chapter 17](17-heaps.md), we'll build a `PathHeap`, a priority queue that keeps the minimum-cost path at its root. Here's a preview of how it changes our algorithm. By replacing the dictionary-based `frontier` with a `PathHeap`, we transform the `O(V)` scan into an `O(1)` peek, with `O(log n)` cost to add or remove a path.

A heap has one limitation the dictionary didn't: it can't cheaply find and replace an existing entry. So when we discover a cheaper route to a vertex, we add the new path and leave the old one where it is. A separate dictionary remembers the best total found for each vertex, and the `settled` set lets us discard any outdated entry when it eventually reaches the top of the heap:

```swift
// Dijkstra's shortest path using heap-based frontier - O((V + E) log V)
public func processDijkstraWithHeap(_ source: Vertex<T>, destination: Vertex<T>) -> Path<T>? {

    let frontier: PathHeap = PathHeap<T>()

    // Vertices whose shortest path is final
    var settled = Set<UUID>()

    // Best known total to each discovered vertex
    var bestTotals = Dictionary<UUID, Int>()

    // The source is reachable at zero cost
    let sourcePath = Path<T>()
    sourcePath.destination = source
    frontier.enQueue(sourcePath)
    bestTotals[source.uuid] = 0

    while frontier.count != 0 {

        // Use the greedy approach to obtain the best path - O(1)
        guard let bestPath: Path = frontier.peek() else {
            break
        }

        // Remove the best path from the frontier - O(log n)
        frontier.deQueue()

        // Skip outdated entries for vertices already settled
        let vertex = bestPath.destination

        if settled.contains(vertex.uuid) {
            continue
        }

        settled.insert(vertex.uuid)

        if vertex == destination {
            return bestPath
        }

        // Relax each edge, keeping only improvements
        for e in vertex.neighbors {

            if settled.contains(e.neighbor.uuid) {
                continue
            }

            let newTotal = bestPath.total + e.weight

            if let known = bestTotals[e.neighbor.uuid], known <= newTotal {
                continue
            }

            bestTotals[e.neighbor.uuid] = newTotal

            let newPath = Path<T>()
            newPath.destination = e.neighbor
            newPath.previous = bestPath
            newPath.total = newTotal

            // Add the improved path to the frontier - O(log n)
            frontier.enQueue(newPath)
        }
    }

    // The destination is unreachable from the source
    return nil
}
```

In our sample graph, the heap briefly holds two paths to D: the direct route costing 5 and the improved route through B costing 3. The cheaper one surfaces first and settles D. When the older entry reaches the top later, D is already settled, so it's skipped.

The structure mirrors our dictionary-based version, but the performance characteristics change. Each improvement adds one path to the heap, and since every edge can produce at most one improvement, the heap handles at most E + 1 insertions and removals. Each costs `O(log n)` for a heap of n paths, and because n is at most E + 1, which is less than V², log n is `O(log V)`. The overall time complexity becomes `O((V + E) log V)`.

| Implementation | Find min | Insert or update | Time complexity | Best for |
|---------------|----------|--------|-----------------|----------|
| Scanned frontier | `O(V)` scan | `O(1)` average (dictionary) | `O(V²)` | Dense graphs |
| Heap-based | `O(1)` peek, `O(log V)` removal | `O(log V)` | `O((V + E) log V)` | Sparse graphs |

The heap isn't automatically the winner. In a dense graph, where E approaches V², the heap version's `O(V² log V)` is actually slower than the scan's `O(V²)`. Road networks and social graphs are sparse, with each vertex connected to only a handful of others, which is where the heap shines.

## Building algorithmic intuition

Dijkstra's algorithm demonstrates greedy problem-solving: making locally optimal choices at each step leads to globally optimal solutions, provided no edge has a negative weight. The `frontier` concept — maintaining paths at the boundary of explored territory — appears throughout graph algorithms and search problems. By always settling the cheapest known path and relaxing only genuine improvements, the algorithm builds up optimal routes without exhaustively checking every combination, and settling each vertex once keeps it from looping on cycles.

The progression from a scanned frontier to a heap-based one reveals a pattern we'll see throughout algorithm design: choosing the right data structure can transform an algorithm's scalability. The same greedy logic powers both versions, but replacing a linear scan with the priority queue from [Chapter 17](17-heaps.md) changes `O(V²)` into `O((V + E) log V)` for sparse graphs. The idea that a shortest route extends a shortest route to an earlier vertex also reappears in [Chapter 18](18-dynamic-programming.md), where reusing solved subproblems is the central theme.
