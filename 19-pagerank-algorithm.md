---
layout: chapter
title: "Chapter 19: PageRank Algorithm"
description: "Implement Google's PageRank in Swift"
---
# PageRank

The [PageRank](https://en.wikipedia.org/wiki/PageRank) algorithm stands as one of the most influential algorithms in modern computing, powering the original Google search engine and fundamentally changing how we navigate information. Conceived at Stanford University in 1996 by Larry Page and Sergey Brin, PageRank introduced a revolutionary approach to determining web page importance through mathematical modeling of human browsing behavior.

PageRank synthesizes concepts from throughout this book. It builds on graph structures from [Chapter 13](13-graphs), using vertices and edges to model web pages and links. The iterative computation mirrors the tabulation approach from dynamic programming ([Chapter 18](18-dynamic-programming)), repeatedly refining estimates until convergence. Generic types from [Chapter 7](07-generics) allow PageRank to work with any vertex data, while performance analysis from [Chapter 8](08-performance-analysis) reveals `O(V + E)` complexity per iteration. Hash table lookups from [Chapter 15](15-hash-tables) enable efficient vertex finding in the canvas array. Even recursion patterns from [Chapter 6](06-recursion) appear in the authority distribution calculations that flow through the graph.

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

The beauty of PageRank lies in how it transforms the abstract concept of web importance into concrete [graph](https://en.wikipedia.org/wiki/Graph_(abstract_data_type)) theory:

**Web Structure as a Directed Graph:**
- [Vertices](https://en.wikipedia.org/wiki/Vertex_(graph_theory)): Web pages
- [Edges](https://en.wikipedia.org/wiki/Glossary_of_graph_theory#edge): Hyperlinks between pages
- Direction: Links point from source page to destination page

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

PageRank calculation requires multiple iterations because page importance is interdependent:

1. **Round 1**: Calculate initial authority distribution
2. **Round 2**: Redistribute authority based on Round 1 results
3. **Round 3**: Final redistribution incorporating all previous calculations

```swift
// Iterative dependency example:
// Page A's final PageRank depends on:
// - Pages that link to A (direct authority transfer)
// - The PageRank of those linking pages (recursive dependency)
// - How many other pages those linking pages also support
```

**Production Note:** Real PageRank implementations continue iterating until **convergence**—when PageRank values stop changing significantly between iterations. Our educational model uses 3 fixed rounds for simplicity.

### Understanding convergence

Convergence in PageRank means the algorithm has reached a stable state where further iterations produce negligible changes in PageRank values. This happens because the iterative process eventually balances authority flow throughout the network.

Think of it like water flowing through a network of pipes—initially there might be turbulence and fluctuation, but eventually the flow reaches a steady state where the amount entering each junction equals the amount leaving. In PageRank, convergence occurs when the authority flowing into each page roughly equals the authority flowing out, creating stable PageRank values.

**Why convergence matters:**
- Stability: Ensures PageRank values represent true long-term probabilities of the random surfer model
- Accuracy: Prevents premature stopping that could yield incorrect rankings
- Efficiency: Avoids unnecessary computation once the stable state is reached
- Reliability: Provides consistent results regardless of the starting conditions

### Handling sink nodes

**Sink nodes** are pages with no outgoing links—they would theoretically trap the random surfer forever. PageRank handles this by redistributing sink node authority to all other pages in the network:

```swift
// Sink node logic:
// 1. Identify pages with zero outgoing links
// 2. Distribute their accumulated PageRank to all other pages
// 3. This ensures the random surfer can continue browsing
```

This mechanism serves dual purposes:
- Maintains mathematical validity of the probability model
- Provides residual benefit to pages that might otherwise receive no incoming authority

### The damping factor: Modeling realistic browsing

The **damping factor** (typically denoted as *d*) represents the probability that a random surfer will continue clicking links rather than jumping to a completely random page. Google's original PageRank uses a damping factor of 0.85, meaning:

- **85% chance**: User follows a link from the current page
- **15% chance**: User gets bored and jumps to a random page

```swift
// Damping factor concept:
let dampingFactor: Float = 0.85

// For any page, its PageRank becomes:
// PR(page) = (1 - d) * (1/N) + d * (sum of incoming link contributions)
//
// Where:
// - (1 - d) * (1/N) = probability of random jump to this page
// - d * (sum of contributions) = probability of arriving via links
```

**Why the damping factor is crucial:**

1. **Prevents rank sinks**: Without it, pages could accumulate infinite authority in closed loops
2. **Models real behavior**: People don't click links forever—they eventually start fresh
3. **Ensures convergence**: Guarantees the iterative algorithm will reach a stable solution
4. **Balances authority**: Prevents any single page from capturing all PageRank

**Mathematical impact:**
```swift
// Without damping factor (unstable):
// PageRank could oscillate or grow without bound in certain graph structures

// With damping factor (stable):
// Every page gets baseline authority: (1 - d) / N
// Plus proportional share of incoming link authority: d * (incoming contributions)
```

**Choosing the damping factor value:**
- **0.85 (Google's choice)**: Balances realism with mathematical stability
- **Higher values (0.9-0.95)**: More emphasis on link structure, slower convergence
- **Lower values (0.7-0.8)**: More random jumping, faster convergence, less link influence

## Implementation in Swift

Let's implement an educational PageRank algorithm that demonstrates core concepts while remaining accessible for learning.

### Graph structure design

Our implementation builds on the graph structures from [Chapter 13](13-graphs), extending vertices to support PageRank calculations:

```swift
// Generic vertex with PageRank history array - stores rank across iterations
// Enhanced Vertex class for PageRank
public class Vertex<T>: Equatable {
    var tvalue: T?
    var neighbors = Array<Edge<T>>()
    var rank: Array<Float> = [0, 0, 0]  // Stores PageRank for each iteration
    var visited: Bool = false
    let uuid = UUID()

    public init() {}

    public init(with name: T) {
        self.tvalue = name
    }

    // Equatable conformance
    public static func == (lhs: Vertex, rhs: Vertex) -> Bool {
        return lhs.uuid == rhs.uuid
    }
}
```

**Design Rationale:**
- **Array storage**: Preserves PageRank history across iterations for debugging and analysis
- **Generic support**: Works with any vertex type (String, Int, custom objects)
- **UUID equality**: Ensures consistent vertex identification regardless of content changes

### Core PageRank algorithm

Here's our educational PageRank implementation with sink node handling:

```swift
// Educational PageRank with sink node handling - 3 fixed iterations O(V + E)
extension Graph {
    public func processPageRankWithSink() {
        // Starting rank: equal probability for all pages
        // Note: Using 100 instead of 1.0 for educational clarity
        let startingRank: Float = Float(100 / self.canvas.count)
        var round: Int = 0

        while round < 2 {  // Educational: 3 total rounds (0, 1, 2)

            for vertex in self.canvas {

                // Round 0: Initialize with equal starting rank
                if round == 0 {
                    vertex.rank[round] = startingRank
                }

                let currentRank = vertex.rank[round]

                // Standard case: Distribute rank to neighbors
                if vertex.neighbors.count > 0 {

                    let assignedRank = currentRank / Float(vertex.neighbors.count)

                    // Distribute authority to each neighbor
                    for edge in vertex.neighbors {
                        edge.neighbor.rank[round + 1] += assignedRank
                    }
                }

                // Sink node case: Distribute rank to all other vertices
                else {
                    if self.canvas.count > 1 {

                        let sinkRank = currentRank / Float(self.canvas.count - 1)

                        for otherVertex in self.canvas {
                            if vertex != otherVertex {
                                otherVertex.rank[round + 1] += sinkRank
                            }
                        }
                    }
                }
            }

            // Advance to next iteration
            round += 1
        }
    }
}
```

### Adding damping factor (optional enhancement)

The core algorithm above demonstrates the fundamental PageRank concept. Production implementations like Google's add a damping factor for improved stability. Here's how you could optionally modify the authority distribution:

```swift
// Optional: Add damping factor to the core algorithm
let dampingFactor: Float = 0.85

// Instead of: assignedRank = currentRank / Float(vertex.neighbors.count)
// Use: assignedRank with baseline probability
let baselineProbability = (1.0 - dampingFactor) / Float(canvas.count)
let linkContribution = (dampingFactor * currentRank) / Float(vertex.neighbors.count)
let assignedRank = baselineProbability + linkContribution
```

This modification gives each page a small baseline probability `(1-d)/N` of being visited randomly, plus the link-based authority transfer `d × (rank/neighbors)`. The damping factor prevents rank accumulation in closed loops and models realistic browsing where users occasionally jump to random pages rather than following links indefinitely.

## Practical example

Let's see the PageRank algorithm in action with a simple web graph:

```swift
// Create a small web graph demonstrating PageRank
let graph = Graph<String>()

// Create pages
let pageA = graph.addVertex(with: "Page A")
let pageB = graph.addVertex(with: "Page B")
let pageC = graph.addVertex(with: "Page C")

// Create link structure
graph.addEdge(from: pageA, to: pageB, weight: 1)
graph.addEdge(from: pageA, to: pageC, weight: 1)
graph.addEdge(from: pageB, to: pageC, weight: 1)
graph.addEdge(from: pageC, to: pageA, weight: 1)

// Calculate PageRank
graph.processPageRankWithSink()

// Display results
for vertex in graph.canvas {
    print("\(vertex.tvalue!): \(vertex.rank[2])")
}
```

The algorithm iterates through three rounds, redistributing authority based on link structure:

| Page | Round 0 | Round 1 | Round 2 (Final) |
|------|---------|---------|-----------------|
| A    | 33.33   | 33.33   | 50.00 |
| B    | 33.33   | 16.67   | 16.67 |
| C    | 33.33   | 50.00   | 33.33 |

**Round 0**: All pages start with equal rank (100 ÷ 3 pages = 33.33 each)

**Round 1**: Authority flows through links:
- A distributes 33.33 equally to B and C (16.67 each)
- B distributes 33.33 entirely to C
- C distributes 33.33 entirely to A
- Result: A=33.33, B=16.67, C=50.00

**Round 2**: Second redistribution stabilizes ranks:
- A distributes 33.33 to B (16.67) and C (16.67)
- B distributes 16.67 to C
- C distributes 50.00 to A
- Final result: A=50.00, B=16.67, C=33.33

Page C's initial spike to 50.00 results from receiving links from both A and B. In the final iteration, Page A gains authority by receiving C's accumulated rank, demonstrating how authority flows through the network over multiple iterations.

## Real-world applications

PageRank's influence extends far beyond web search. In academic research, the algorithm ranks scientific papers by citation networks—highly-cited papers by other highly-cited papers earn greater authority. Biological research applies PageRank to protein interaction networks, identifying key proteins in cellular processes. Social network analysis uses PageRank variants to identify influential users, measuring not just follower counts but the quality of connections. Recommendation systems employ PageRank to suggest products, articles, or connections by modeling user behavior as graph traversal. The algorithm's fundamental insight—that importance flows through network connections—applies wherever relationships matter more than isolated attributes.
