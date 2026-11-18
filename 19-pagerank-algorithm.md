---
layout: field-notes
title: "Chapter 19: PageRank Algorithm"
description: "Compute PageRank in Swift using adjacency lists, sink node handling, and iterative rank updates."
---
# PageRank

The **PageRank** algorithm stands as one of the most influential algorithms in modern computing, powering the original Google search engine and fundamentally changing how we navigate information. Conceived at Stanford University in 1996 by Larry Page and Sergey Brin, PageRank introduced a revolutionary approach to determining web page importance through mathematical modeling of human browsing behavior.

PageRank synthesizes concepts from throughout this book. It builds on graph structures from [Chapter 13](13-graphs.md), using vertices and edges to model web pages and links. Its computation is iterative: each round produces a new estimate of every page's importance from the previous round's estimates, and the rounds repeat until the values stop changing. Mathematicians call this a fixed-point iteration. It resembles the bottom-up tables of dynamic programming ([Chapter 18](18-dynamic-programming.md)) in that each round builds on stored results, but unlike Fibonacci, no answer is ever final after a single computation; every value keeps being refined. Generic types from [Chapter 7](07-generics.md) allow PageRank to work with any vertex data, while performance analysis from [Chapter 8](08-performance-analysis.md) reveals `O(V + E)` complexity per iteration. The definition itself is self-referential, too, echoing the recursive thinking of [Chapter 6](06-recursion.md): a page is important when important pages link to it.

In this chapter, we'll explore how PageRank works, implement an educational version in Swift, and understand its broader applications beyond search engines.

## Understanding PageRank

PageRank solves a fundamental problem: how do we measure the importance or authority of a web page in a vast network of interconnected documents? The solution lies in modeling human browsing behavior through mathematical probability.

### The random surfer model

The core insight behind PageRank is the concept of the **random surfer**—an imaginary web user who clicks on links completely at random. This mathematical model asks a simple question: if someone browsed the web by randomly clicking links, what's the probability they would land on any specific page?

```swift
// Conceptual model: What's the probability of landing on page A?
// This depends on:
// 1. How many pages link to A (incoming links)
// 2. The importance of those linking pages
// 3. How many outgoing links those pages have
```

This probabilistic approach captures something profound about web browsing: important pages are those that people are likely to encounter during random exploration of the web's link structure.

### From web pages to graph theory

The beauty of PageRank lies in how it transforms the abstract concept of web importance into concrete [graph](https://en.wikipedia.org/wiki/Graph_(abstract_data_type)) theory. The web structure becomes a directed graph where [vertices](https://en.wikipedia.org/wiki/Vertex_(graph_theory)) represent web pages and [edges](https://en.wikipedia.org/wiki/Glossary_of_graph_theory#edge) represent hyperlinks between pages. Direction matters because links point from source pages to destination pages, creating a flow of authority through the network.

```swift
// Example web structure:
// Page A links to pages B and C
// Page B links to page C
// Page C links to page A
```


This mathematical representation allows us to apply rigorous algorithms to measure page importance based on link structure.

### Markov chains in practice

PageRank is fundamentally based on **Markov chain** theory, where the future state (next page visited) depends only on the current state (current page) and not on the history of how we got there. Each page transition has a probability based on the number of outgoing links.

```swift
// Markov chain transition example:
// If current page has 3 outgoing links
// Probability of following any specific link = 1/3
// Future state depends only on current page, not browsing history
```

This mathematical foundation ensures that PageRank values represent long-term probabilities of page visits during infinite random browsing.

## Mathematical foundation

### Authority and probability transfer

PageRank operates on a simple principle: **pages transfer their authority to the pages they link to**. This creates a democratic system where every page votes for other pages through its outgoing links.

#### Starting rank: Equal opportunity

The random surfer model begins by assuming equal probability of starting at any page on the web:

```swift
// For n pages in the graph:
let startingRank: Float = 1.0 / Float(totalPages)

// Example with 4 pages: A, B, C, D
// Each page starts with PageRank = 0.25
// Total probability across all pages = 1.0
```

**Note:** Our educational implementation uses 100 as the base value instead of 1.0 for clearer visualization of changes during iteration, but the mathematical principles remain identical.

#### Authority distribution

Each page distributes its current PageRank equally among all pages it links to:

```swift
// Page with PageRank = 0.4 and 2 outgoing links
// Each linked page receives: 0.4 / 2 = 0.2 additional PageRank
let distributedAuthority = currentPageRank / Float(outgoingLinkCount)
```

This creates a flow of authority through the web's link structure, with important pages accumulating higher PageRank values over multiple iterations.

### The iterative process

PageRank calculation requires multiple iterations because page importance is interdependent. Every page begins with an equal starting rank. The first update distributes that starting rank along the links. The second update redistributes authority using the results of the first, allowing pages that receive links from highly ranked pages to accumulate more influence. Each further update refines the values again, moving them closer to rankings that reflect the authority structure of the network.

```swift
// Iterative dependency example:
// Page A's final PageRank depends on:
// - Pages that link to A (direct authority transfer)
// - The PageRank of those linking pages (recursive dependency)
// - How many other pages those linking pages also support
```

**Production Note:** Real PageRank implementations continue iterating until **convergence**—when PageRank values stop changing significantly between iterations. Our educational model stores the starting ranks plus two fixed updates, three columns of values in all, for simplicity.

### Understanding convergence

Convergence in PageRank means the algorithm has reached a stable state where further iterations produce negligible changes in PageRank values. This happens because the iterative process eventually balances authority flow throughout the network.

Think of it like water flowing through a network of pipes—initially there might be turbulence and fluctuation, but eventually the flow reaches a steady state where the amount entering each junction equals the amount leaving. In PageRank, convergence occurs when the authority flowing into each page roughly equals the authority flowing out, creating stable PageRank values. Convergence ensures stability by representing true long-term probabilities of the random surfer model, prevents premature stopping that could yield incorrect rankings, avoids unnecessary computation once the stable state is reached, and provides consistent results regardless of the starting conditions.

### Handling sink nodes

**Sink nodes** (also called dangling nodes) are pages with no outgoing links—they would theoretically trap the random surfer forever. The standard remedy assumes that a surfer who reaches a sink jumps to a page chosen uniformly at random, which may include the sink itself. In rank terms, every sink's authority is pooled each round and shared equally by every page in the network:

```swift
// Sink node logic:
// 1. Identify pages with zero outgoing links
// 2. Add their rank to a single pool for this round
// 3. Share the pool equally among all pages, sinks included
```

This mechanism keeps the total rank constant, which maintains the mathematical validity of the probability model, and it provides residual benefit to pages that might otherwise receive no incoming authority. Pooling the sink rank first also matters for performance. Distributing each sink's rank to every page individually would cost `O(V)` per sink, potentially `O(V²)` per round; adding up the pool once and then sharing it costs `O(V)` in total.

### The damping factor: Modeling realistic browsing

The **damping factor** (typically denoted as *d*) represents the probability that a random surfer will continue clicking links rather than jumping to a completely random page. Google's original PageRank uses a damping factor of 0.85, meaning there's an 85% chance the user follows a link from the current page and a 15% chance the user gets bored and jumps to a random page.

```swift
// Damping factor concept:
let dampingFactor: Float = 0.85

// For any page, its PageRank becomes:
// PR(page) = (1 - d) * (1/N) + d * (sum of incoming link contributions)
//
// Where:
// - (1 - d) * (1/N) = probability of random jump to this page
// - d * (sum of contributions) = probability of arriving via links
// - N = total number of pages, and ranks across all pages sum to 1
```

Damping lets the surfer leave closed components through random jumps. Without damping, probability can remain trapped in separate components, and periodic link patterns can prevent the rank values from converging. With `0 < d < 1`, uniform random jumps and the sink handling described above give a unique stationary distribution. Iteration converges to that distribution regardless of the starting ranks, provided those ranks have the same total probability.

**Mathematical impact:**
```swift
// Without damping factor (unstable):
// PageRank could oscillate, or concentrate in closed loops, in certain graph structures

// With damping factor (stable):
// Every page gets baseline authority: (1 - d) / N
// Plus proportional share of incoming link authority: d * (incoming contributions)
```

Choosing the damping factor value involves balancing competing concerns. Google's choice of 0.85 balances realism with mathematical stability. Higher values between 0.9 and 0.95 place more emphasis on link structure but slow convergence. Lower values between 0.7 and 0.8 introduce more random jumping, achieving faster convergence at the cost of reduced link influence.

## Implementation in Swift

Let's implement an educational PageRank algorithm that demonstrates core concepts while remaining accessible for learning.

### Graph structure design

Our implementation builds on the graph structures from [Chapter 13](13-graphs.md), extending vertices to support PageRank calculations:

```swift
import Foundation

// Generic vertex with PageRank history array - stores rank across iterations
public class Vertex<T>: Equatable {
    var tvalue: T?
    var neighbors = Array<Edge<T>>()
    var rank: Array<Float> = [0, 0, 0]  // Starting rank, then two updates
    let uuid = UUID()

    // Creates a vertex with no value
    public init() {}

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

The design choices reflect educational priorities. Array storage preserves PageRank history across iterations for debugging and analysis. Generic support allows the algorithm to work with any vertex type, whether String, Int, or custom objects. UUID-based equality ensures consistent vertex identification regardless of content changes, maintaining referential integrity throughout the computation.

### Core PageRank algorithm

Here's our educational PageRank implementation with sink node handling:

```swift
// Educational PageRank with sink node handling - two updates, O(V + E) each
extension Graph {
    public func processPageRankWithSink() {

        // An empty graph has no ranks to compute
        guard canvas.count > 0 else {
            return
        }

        // Starting rank: equal probability for all pages
        // Note: Using 100 instead of 1.0 for educational clarity
        let pageCount = Float(canvas.count)
        let startingRank: Float = 100.0 / pageCount

        // Reset rank history so repeated calls start fresh
        for vertex in canvas {
            vertex.rank = [startingRank, 0, 0]
        }

        // Compute rank[1] from rank[0], then rank[2] from rank[1]
        for round in 0..<2 {

            // Rank held by sink vertices this round
            var sinkRank: Float = 0

            for vertex in canvas {

                let currentRank = vertex.rank[round]

                // Standard case: Distribute rank to neighbors
                if vertex.neighbors.count > 0 {

                    let assignedRank = currentRank / Float(vertex.neighbors.count)

                    for edge in vertex.neighbors {
                        edge.neighbor.rank[round + 1] += assignedRank
                    }
                }

                // Sink node case: Pool the rank for every vertex to share
                else {
                    sinkRank += currentRank
                }
            }

            // Share the pooled sink rank once with every vertex - O(V)
            let sharedRank = sinkRank / pageCount

            for vertex in canvas {
                vertex.rank[round + 1] += sharedRank
            }
        }
    }
}
```

A few details keep the totals honest. The starting rank divides `100.0` by a `Float`, not `100` by an `Int`. Integer division would discard the remainder, so three pages would start with 33 each, a total of 99, and a graph with more than 100 pages would start every page at 0. Resetting `rank` at the top means calling the method twice produces the same values instead of adding a second run on top of the first. And the empty-graph guard prevents dividing by zero. Each update touches every vertex and every edge once, plus one pass to share the sink pool, so the method runs in `O(V + E)` per update.

### Adding damping factor (optional enhancement)

The core algorithm above demonstrates the fundamental PageRank concept. Production implementations like Google's add a damping factor for improved stability. The baseline from the recurrence, `(1 - d) / N`, belongs to each *page*, once per round, not to each link. A page with no incoming links still receives it, and a page with many incoming links receives it only once. Here's how we could modify each update, scaling the baseline by 100 to match our educational scale:

```swift
// Optional: Add damping factor to the core algorithm
let dampingFactor: Float = 0.85

// Every page begins the round with its random-jump baseline
let baseline = (1.0 - dampingFactor) * 100.0 / pageCount

for vertex in canvas {
    vertex.rank[round + 1] = baseline
}

// Links and sinks then pass along only the damped share of each rank
let assignedRank = dampingFactor * currentRank / Float(vertex.neighbors.count)
let sharedRank = dampingFactor * sinkRank / pageCount
```

With this change, each page receives the baseline `(1-d)/N` share of the total, plus the damped authority `d × (rank/neighbors)` from each page that links to it, plus its damped share of the sink pool. The three parts still add up to 100 every round. The damping factor prevents rank from collecting in closed loops and models realistic browsing where users occasionally jump to random pages rather than following links indefinitely. The [Structures package](https://github.com/waynewbishop/bishop-algorithms-swift-package) includes `processPageRankWithDamping`, which applies this update on the probability scale and repeats it until the ranks converge. Stanford's [CS 315B notes](https://web.stanford.edu/class/cs315b/assignment3.html) present the same recurrence.

## Practical example

Let's demonstrate PageRank with a graph that shows how a central vertex accumulates authority from multiple sources, and how a sink's authority is shared. The graph uses the `Vertex`, `addVertex(element:)`, and `addEdge(source:neighbor:weight:)` API from [Chapter 13](13-graphs.md):

```swift
// Web graph demonstrating authority accumulation and sink node handling
let graph = Graph<String>()

// Create vertices
let vertexA = Vertex(with: "A")  // Central hub
let vertexB = Vertex(with: "B")
let vertexC = Vertex(with: "C")  // Sink node
let vertexD = Vertex(with: "D")

for vertex in [vertexA, vertexB, vertexC, vertexD] {
    graph.addVertex(element: vertex)
}

// A links out to every other page
graph.addEdge(source: vertexA, neighbor: vertexB, weight: 1)
graph.addEdge(source: vertexA, neighbor: vertexC, weight: 1)
graph.addEdge(source: vertexA, neighbor: vertexD, weight: 1)

// B and D link back to A
graph.addEdge(source: vertexB, neighbor: vertexA, weight: 1)
graph.addEdge(source: vertexD, neighbor: vertexA, weight: 1)

// C is a sink node (no outgoing links)
// Its rank is pooled and shared by every vertex

// Calculate PageRank
graph.processPageRankWithSink()

// Display results
for vertex in graph.canvas {
    if let name = vertex.tvalue {
        print("\(name): \(vertex.rank[2])")
    }
}
```

The algorithm stores the starting ranks and two updates, redistributing authority based on link structure. Every column totals 100:

| Vertex | Starting rank | First update | Second update |
|--------|---------------|--------------|---------------|
| A | 25.00 | 56.25 | 32.81 |
| B | 25.00 | 14.58 | 22.40 |
| C | 25.00 | 14.58 | 22.40 |
| D | 25.00 | 14.58 | 22.40 |

Let's trace the first update. A splits its 25.00 three ways, sending 8.33 to each of B, C, and D. B and D each send their full 25.00 to A, their only link. C is a sink, so its 25.00 goes into the shared pool, and each of the four pages receives a quarter of it, 6.25. A therefore collects `25.00 + 25.00 + 6.25 = 56.25`, while B, C, and D each collect `8.33 + 6.25 = 14.58`.

The second update repeats the process with these new values. A now has 56.25 to split, sending 18.75 to each neighbor. B and D return their 14.58 each to A, and C's 14.58 is pooled again, giving every page 3.65. A ends at `14.58 + 14.58 + 3.65 = 32.81`, and the other three pages end at `18.75 + 3.65 = 22.40`.

Vertex A holds the highest rank after both updates because two pages link to it exclusively, concentrating authority. Notice, though, that A's value swings from 56.25 down to 32.81. A sends much of its authority back out to the pages that link to it, so the values seesaw between rounds before settling. Two rounds aren't enough to reach a stable answer, which is exactly why production implementations iterate until convergence. Vertex C shows the sink mechanism at work: it receives authority from A like the others, and the rank it can't pass along through links is returned to the whole network rather than lost. This demonstrates how PageRank measures authority: vertices that receive links from highly ranked pages accumulate high rank, while every page keeps a share through the redistribution of sink authority.

## Real-world applications

PageRank's influence extends far beyond web search. In academic research, the algorithm ranks scientific papers by citation networks—highly-cited papers by other highly-cited papers earn greater authority. Biological research applies PageRank to protein interaction networks, identifying key proteins in cellular processes. Social network analysis uses PageRank variants to identify influential users, measuring not just follower counts but the quality of connections. Recommendation systems employ PageRank to suggest products, articles, or connections by modeling user behavior as graph traversal. The algorithm's fundamental insight—that importance flows through network connections—applies wherever relationships matter more than isolated attributes.

## Building algorithmic intuition

PageRank demonstrates how complex algorithms emerge from combining simpler concepts. Graph traversal from [Chapter 13](13-graphs.md) provides the structure for modeling web links. Iterative refinement contrasts with the dynamic programming of [Chapter 18](18-dynamic-programming.md): rather than solving each subproblem once, PageRank revisits every value each round until the whole system converges. The random surfer model translates human behavior into mathematical probability, showing how algorithms can capture real-world phenomena through abstraction.

Understanding PageRank reveals broader patterns in algorithm design. The sink node problem demonstrates edge case handling—algorithms must account for boundary conditions that violate normal assumptions. Convergence detection shows the trade-off between accuracy and computational cost. Modern variations of PageRank appear throughout machine learning and network analysis, from recommendation systems to influence modeling in social networks. The mathematical foundation extends into linear algebra, where PageRank connects to eigenvector computation using matrices ([Chapter 21](21-matrices.md)) and vector operations ([Chapter 20](20-vectors.md)). Mastering PageRank means understanding not just how Google ranks pages, but how iterative algorithms model authority, influence, and importance across any networked system.
