---
layout: chapter
title: "Chapter 17: Shortest Paths"
description: "Find optimal routes with Dijkstra's algorithm and priority queue optimization"
---
# Shortest Paths

When we explored [graphs](https://en.wikipedia.org/wiki/Graph_(abstract_data_type)) in [Chapter 13](13-graphs), we learned how breadth-first search finds the shortest path measured by the number of edges traversed. While useful for unweighted graphs, this approach falls short when edges carry different weights or costs. The question shifts from "what is the quickest route" to "what is the cheapest, fastest, or shortest route"—a problem that appears everywhere from GPS navigation to network packet routing to flight path optimization.

[Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm), developed by Edsger W. Dijkstra in 1956, solves this weighted shortest path problem with elegant efficiency. The algorithm employs a [greedy strategy](https://en.wikipedia.org/wiki/Greedy_algorithm)—always choosing the locally optimal path—which surprisingly guarantees the globally optimal solution. While originally designed for routing in communications networks, Dijkstra's algorithm now powers the GPS systems in our cars, optimizes data flow across the internet, and helps delivery services minimize fuel costs. Every time we ask for directions to the nearest coffee shop, we benefit from Dijkstra's six-decade-old insight.

## The shortest path problem

The shortest path problem asks us to find the minimum total weight path between two vertices in a weighted graph. Unlike breadth-first search, which treats all edges equally, Dijkstra's algorithm considers these weights to find truly optimal routes. A path with more edges might have a lower total weight than a path with fewer edges, making the problem substantially more complex than unweighted traversal.

## Understanding the frontier

The `frontier` is the key concept that makes Dijkstra's algorithm work. Think of it as the edge of exploration—the set of paths we're currently considering but haven't fully explored yet. As we discover new vertices and potential routes, the frontier expands. As we select and fully explore paths, they leave the frontier and become part of our known solution space.

Consider exploring a cave system with multiple tunnels branching in different directions. You start at the entrance and can see several tunnels leading deeper into the cave. This initial view represents your frontier—the paths you know about but haven't yet explored. You choose the shortest tunnel to investigate first, following it until you reach a junction. At this junction, you discover new tunnels, expanding your frontier with additional options. You always choose the shortest unexplored path from your current options, keeping track of where you've been to avoid circular exploration.

## The Path class

To maintain the `frontier` effectively, we need more than just vertices. We must track how we reached each vertex, the total cost accumulated along the way, and which vertex the path terminates at. The `Path` class encapsulates this information:

```swift
// Path class maintains objects that comprise the frontier
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

Each `Path` represents a potential route through the graph. The destination property identifies which vertex this path reaches. The `total` accumulates the sum of edge weights from the source to this destination. The previous property forms a linked list structure, allowing us to reconstruct the complete path by following these references backward from destination to source.

Without the `Path` class, we would only track which vertices we've visited. But optimal pathfinding requires knowing how we got there and what it cost us. The previous pointer enables path reconstruction after finding the optimal route. The total `weight` enables comparison between alternative routes to the same destination. This structure transforms Dijkstra's algorithm from a simple traversal into an optimization engine.

## Array-based implementation

The foundational implementation uses an array to maintain the `frontier`. This approach clearly demonstrates the algorithm's mechanics before we optimize with more sophisticated data structures:

```swift
// Dijkstra's shortest path using array-based frontier - O(V²)
extension Graph {
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

The algorithm begins by initializing the `frontier` with `Path` objects for all neighbors of the source `vertex`. Each initial path has the source as its implicit starting point, a `neighbor` as its destination, and the edge `weight` as its total cost. This seeding process establishes the starting `frontier` from which exploration proceeds.

The main loop repeatedly selects the path with the minimum total cost from the frontier. This greedy selection requires scanning all `frontier` paths, comparing their totals, and tracking both the best path and its index position. Once identified, the algorithm expands from this path's destination `vertex`, creating new `Path` objects for each of that vertex's neighbors. These new paths link back to the current best path via the previous pointer, building the chain that will eventually represent the complete route.

After exploring all paths from the best path's destination, we move it from the frontier to finalPaths. This transfer represents our confidence that we've found the optimal route to this particular vertex. The frontier removal completes the iteration, and the process repeats until the `frontier` empties. Finally, we search `finalPaths` for all routes reaching our target destination and return the one with minimum total cost.

## Performance analysis

The array-based implementation achieves `O(V²)` [time complexity](https://en.wikipedia.org/wiki/Time_complexity) in the worst case. Each iteration requires scanning the entire frontier to find the minimum, an `O(V)` operation. We perform this scan once for each vertex we visit, yielding `O(V)` iterations. Together, these nested operations produce quadratic complexity. The space complexity is `O(V + E)` to store the `frontier` and the `finalPaths` collection.

For sparse graphs where the number of edges is much smaller than `V²`, this performance is acceptable. However, as graphs grow denser or larger in scale, the quadratic time complexity becomes prohibitive. Finding the minimum path in the frontier dominates the runtime, consuming the majority of computational resources. This bottleneck suggests an optimization opportunity—if we could find the **minimum path** more efficiently, we could dramatically improve overall performance.

## Heap-optimized implementation

[Chapter 16](16-heaps) introduced heaps as priority queues with `O(log n)` insertion and `O(1)` minimum element access. By replacing the array-based frontier with a `heap`, we transform the expensive minimum-finding operation into a constant-time O(1) `peek` followed by a logarithmic `dequeue`:

```swift
// Dijkstra's shortest path using heap-based frontier - O((V + E) log V)
extension Graph {
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

The heap-based version eliminates the explicit minimum-finding loop. Instead of scanning all `frontier` paths, we simply `peek` at the heap's root to access the path with minimum total cost. The heap property guarantees this element is the minimum, removing the need for comparison. Enqueuing new paths and dequeuing the minimum both operate in `O(log V)` time, dramatically reducing the per-iteration cost.

This optimization changes the overall time complexity to `O((V + E) log V)`. We visit each `vertex` once (V iterations) and examine each edge once (E edge examinations). Each `frontier` operation (enqueue or dequeue) costs `O(log V)`. For graphs with many edges, this improvement is substantial. A graph with 1,000 vertices and 5,000 edges would require roughly 1,000,000 operations with the array-based approach but only 65,000 operations with the heap-based approach—a **15× speedup**.

## Performance comparison

The choice between array-based and heap-based implementations depends on graph characteristics and performance requirements:

| Implementation | Find Min | Insert | Time Complexity | Best For |
|---------------|----------|--------|-----------------|----------|
| Array-based | O(V) scan | O(1) | O(V²) | Dense graphs, small graphs |
| Heap-based | O(1) peek | O(log V) | O((V + E) log V) | Sparse graphs, large graphs |

For small graphs with fewer than 100 vertices, the array-based implementation suffices and its simplicity aids understanding. For large graphs or production systems handling thousands of vertices, the heap-based optimization becomes essential. The logarithmic factor remains manageable even as graphs scale to millions of edges, making heap-based Dijkstra's practical for real-world applications like mapping services and network routing.

## Reversing the path

Once we've found the shortest path, we must reverse it to obtain the sequence from source to destination. The Path objects form a linked list through their previous pointers, but this list runs backward—from destination to source. Reversing the path uses the same three-pointer technique from [Chapter 9](09-linked-lists)'s linked list reversal:

```swift
// Reverse path sequence using linked-list reversal technique - O(n)
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

The reversal maintains three pointers as it traverses the path chain. The current pointer tracks our position in the original list. The prev pointer remembers the node we just processed. The next pointer preserves the link to the next node before we modify the current node's previous pointer. By systematically flipping each previous pointer to point forward instead of backward, we transform the path into the desired source-to-destination ordering.

## Practical example

Consider a graph representing cities and flight routes with distances as edge weights:

```swift
// Build graph representing cities and find shortest route
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

This example demonstrates Dijkstra's greedy approach in action. The direct route from San Francisco to Chicago (2,100 miles) plus Chicago to New York (800 miles) totals 2,900 miles. The algorithm discovers the better route through Denver: San Francisco to Denver (1,000 miles), Denver to Chicago (900 miles), and Chicago to New York (800 miles) for a total of 2,700 miles. By always choosing the shortest known path at each step, the algorithm builds up the globally optimal solution.

## Real-world applications

- Modern navigation systems rely on variations of Dijkstra's algorithm to compute optimal routes. GPS devices model road networks as weighted graphs where edge weights represent travel time, incorporating real-time traffic data to avoid congestion. The algorithm runs continuously, recomputing routes as conditions change. When we request directions, the system applies Dijkstra's algorithm to find the fastest route given current traffic patterns.

- Network routing protocols use Dijkstra's algorithm to direct data packets across the internet. Routers maintain graphs representing network topology, with edge weights based on latency, bandwidth, or cost. When forwarding packets, routers consult routing tables precomputed using shortest path algorithms. The Border Gateway Protocol, which routes traffic between autonomous systems on the internet, employs path vector algorithms derived from Dijkstra's work.

- Flight booking systems and logistics companies apply shortest path algorithms to optimize routes and minimize costs. Delivery services like UPS and FedEx use sophisticated variants to plan daily routes for thousands of vehicles. The algorithm considers multiple constraints simultaneously—distance, time, fuel efficiency, and delivery windows—by encoding these factors as edge weights in the graph representation.
