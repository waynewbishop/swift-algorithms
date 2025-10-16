---
layout: chapter
title: "Chapter 17: Shortest Paths"
description: "Find optimal routes with Dijkstra's algorithm and priority queue optimization"
---
# Shortest Paths

Open Maps. Search for home. The app instantly draws a blue line showing our route. But Maps didn't just find a path—it found the optimal path, weighing distance, current traffic, road types, and turn complexity. That blue line represents Dijkstra's algorithm in action, solving a problem in milliseconds that would take humans hours to calculate.

The same algorithm powers AllTrails when we ask for the "shortest hike to the summit" or "easiest route avoiding steep climbs." Strava uses variants of Dijkstra's to suggest popular running routes, weighting segments by how many athletes have run them. Every time we navigate—whether driving, hiking, or planning a training route—we're using shortest path algorithms developed in 1956 but refined over decades to handle modern GPS data and real-time conditions.

When we explored graphs in [Chapter 13](13-graphs), we learned how breadth-first search finds paths by counting edges. But real-world problems aren't that simple. A 1-mile highway segment isn't equivalent to a 1-mile mountain trail with 500 feet of elevation gain. We need algorithms that consider weights—and that's where Dijkstra's algorithm transforms from academic exercise into the navigation system in our pocket.

## The shortest path problem

The shortest path problem asks us to find the minimum total weight path between two vertices in a weighted graph. Unlike breadth-first search, which treats all edges equally, Dijkstra's algorithm considers these weights to find truly optimal routes. A path with more edges might have a lower total weight than a path with fewer edges, making the problem substantially more complex than unweighted traversal.

Consider planning a hike on AllTrails. We're at a trail junction with three paths leading to the summit:
- Path A: 2 miles, 800 ft elevation gain
- Path B: 3 miles, 400 ft elevation gain
- Path C: 2.5 miles, 600 ft elevation gain

Which is "shortest"? Depends on our goal. Minimize distance: Path A (2 mi). Minimize elevation: Path B (400 ft). Balance both: Path C (middle ground). AllTrails lets us optimize for different weights. The graph structure stays the same; only edge weights change.

Strava's route planning works similarly. When planning a 10K run, we want popular segments where other athletes run. Edge weights represent 1 / (number of times run). Popular segments have low weights (short/preferred), unpopular segments have high weights (long/avoided). Dijkstra's finds the route maximizing segment popularity, which is equivalent to minimizing the weighted path.

## Understanding the frontier

The `frontier` is the key concept that makes Dijkstra's algorithm work. Think of it as the edge of exploration—the set of paths we're currently considering but haven't fully explored yet. As we discover new vertices and potential routes, the frontier expands. As we select and fully explore paths, they leave the frontier and become part of our known solution space.

Consider exploring a cave system with multiple tunnels branching in different directions. We start at the entrance and can see several tunnels leading deeper into the cave. This initial view represents our frontier—the paths we know about but haven't yet explored. We choose the shortest tunnel to investigate first, following it until we reach a junction. At this junction, we discover new tunnels, expanding our frontier with additional options. We always choose the shortest unexplored path from our current options, keeping track of where we've been to avoid circular exploration.

When Maps calculates our route home, the frontier works the same way. We're at the coffee shop. The frontier contains all roads leaving the parking lot. The algorithm picks the shortest promising road (Main St, 0.5 miles). The frontier now includes side streets off Main St (new options) plus the original alternatives not yet explored. Always picking the lowest-weight unexplored path from the frontier, the algorithm adds newly discovered roads and removes fully explored paths. When our destination appears at the top of the frontier, we've found the optimal route.

The frontier is why Maps can say "calculating route" and deliver answers in seconds for city-wide graphs with millions of road segments. By always exploring the most promising path first (greedy strategy), Dijkstra's guarantees we'll find the optimal route without exhaustively checking every possible combination—which would take years for complex graphs.

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

When Maps says "Turn left on Oak St in 0.5 miles," it's reading the Path object. The destination is Oak St intersection (the vertex), total is 2.3 miles from start (accumulated weight), and previous is the linked list back to the coffee shop (for turn-by-turn directions). Without tracking previous, Maps could tell us "the route is 5.2 miles" but couldn't give turn-by-turn directions. The previous pointer lets us reconstruct the entire path by following it backward from destination to source, then reversing the sequence. This is why Path is more than just metadata—it's the GPS turn-by-turn directions encoded as a data structure.

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

For sparse graphs where the number of edges is much smaller than `V²`, this performance is acceptable. However, as graphs grow denser or larger in scale, the quadratic time complexity becomes prohibitive. Finding the minimum path in the frontier dominates the runtime, consuming the majority of computational resources. This bottleneck suggests an optimization opportunity—if we could find the minimum path more efficiently, we could dramatically improve overall performance.

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

This optimization changes the overall time complexity to `O((V + E) log V)`. We visit each `vertex` once (V iterations) and examine each edge once (E edge examinations). Each `frontier` operation (enqueue or dequeue) costs `O(log V)`. For graphs with many edges, this improvement is substantial. A graph with 1,000 vertices and 5,000 edges would require roughly 1,000,000 operations with the array-based approach but only 65,000 operations with the heap-based approach—a 15× speedup.

## Performance comparison

The choice between array-based and heap-based implementations depends on graph characteristics and performance requirements:

| Implementation | Find Min | Insert | Time Complexity | Best For |
|---------------|----------|--------|-----------------|----------|
| Array-based | O(V) scan | O(1) | O(V²) | Dense graphs, small graphs |
| Heap-based | O(1) peek | O(log V) | O((V + E) log V) | Sparse graphs, large graphs |

For small graphs with fewer than 100 vertices, the array-based implementation suffices and its simplicity aids understanding. For large graphs or production systems handling thousands of vertices, the heap-based optimization becomes essential. The logarithmic factor remains manageable even as graphs scale to millions of edges, making heap-based Dijkstra's practical for real-world applications like mapping services and network routing.

## Shortest paths in fitness and navigation

Apps we use daily rely on shortest path algorithms. Maps uses Dijkstra's with weights representing time (traffic-aware routing). Alternative routes run Dijkstra with different weight functions. The "Avoid highways" option sets highway edge weights to infinity, forcing the algorithm to find alternate paths. This flexibility—same algorithm, different weights—powers all the routing options we see.

AllTrails demonstrates weight function versatility. Weights can represent distance, elevation, difficulty rating, or combinations. "Shortest hike" minimizes distance weights. "Easiest hike" minimizes elevation weights. Loop trails require finding cycles in the graph with minimal weight. Each feature uses the same Dijkstra's algorithm with customized weight functions.

Strava's route suggestions use Dijkstra's weighted by segment popularity. "Find new routes" avoids edges we've run before by setting their weights high. Training plans optimize weekly mileage using graphs of workout dependencies. Understanding shortest paths helps us implement "Find nearest X" or "Optimize route for Y" features in our own apps.

Even Apple Health uses path-finding concepts. The app builds correlation graphs—finding relationships between metrics like sleep, recovery, and performance. "What affects my heart rate?" becomes finding shortest paths in a causation graph. Understanding Dijkstra's lets us reason about these systems and build similar features.

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
