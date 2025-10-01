# PageRank algorithm

The PageRank algorithm stands as one of the most influential algorithms in modern computing, powering the original Google search engine and fundamentally changing how we navigate information. Conceived at Stanford University in 1996 by Larry Page and Sergey Brin, PageRank introduced a revolutionary approach to determining web page importance through mathematical modeling of human browsing behavior. In this chapter, we'll explore how PageRank works, implement an educational version in Swift, and understand its broader applications beyond search engines.

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

The beauty of PageRank lies in how it transforms the abstract concept of web importance into concrete graph theory:

**Web Structure as a Directed Graph:**
- **Vertices**: Web pages
- **Edges**: Hyperlinks between pages
- **Direction**: Links point from source page to destination page

```swift
// Example web structure:
// Page A links to pages B and C
// Page B links to page C
// Page C links to page A
```

[diagram: Graph showing page link structure between A, B, and C]

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

**Convergence** in PageRank means the algorithm has reached a stable state where further iterations produce negligible changes in PageRank values. This happens because the iterative process eventually balances authority flow throughout the network.

Think of it like water flowing through a network of pipes—initially there might be turbulence and fluctuation, but eventually the flow reaches a steady state where the amount entering each junction equals the amount leaving. In PageRank, convergence occurs when the authority flowing into each page roughly equals the authority flowing out, creating stable PageRank values.

**Why convergence matters:**
- **Stability**: Ensures PageRank values represent true long-term probabilities of the random surfer model
- **Accuracy**: Prevents premature stopping that could yield incorrect rankings
- **Efficiency**: Avoids unnecessary computation once the stable state is reached
- **Reliability**: Provides consistent results regardless of the starting conditions

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

Our implementation builds on the graph structures from Chapter 11, extending vertices to support PageRank calculations:

```swift
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

### Enhanced algorithm with damping factor

Here's an enhanced version of your PageRank algorithm that includes the damping factor for more accurate and stable results:

```swift
extension Graph {
    /// Enhanced PageRank with damping factor and convergence detection
    /// - Parameters:
    ///   - dampingFactor: Probability of following links vs random jump (default: 0.85)
    ///   - maxIterations: Maximum iterations before stopping (default: 100)
    ///   - convergenceThreshold: Minimum change required to continue (default: 0.0001)
    ///     This threshold represents the maximum change in any page's rank between iterations.
    ///     Common values: 0.001 (faster, less precise), 0.0001 (balanced), 0.00001 (slower, high precision)
    public func processPageRankWithDamping(dampingFactor: Float = 0.85,
                                         maxIterations: Int = 100,
                                         convergenceThreshold: Float = 0.0001) {

        // Use mathematical PageRank scale (0.0 to 1.0)
        let startingRank: Float = 1.0 / Float(self.canvas.count)
        let randomJumpProbability = (1.0 - dampingFactor) / Float(self.canvas.count)

        var iteration: Int = 0
        var hasConverged = false

        // Initialize all vertices with equal starting rank
        for vertex in self.canvas {
            vertex.rank = [startingRank, 0, 0]  // Only use first two slots
        }

        while iteration < maxIterations && !hasConverged {

            // Reset next iteration ranks to random jump baseline
            for vertex in self.canvas {
                vertex.rank[1] = randomJumpProbability
            }

            // Calculate authority distribution for this iteration
            for vertex in self.canvas {
                let currentRank = vertex.rank[0]

                // Standard case: Distribute rank to neighbors
                if vertex.neighbors.count > 0 {
                    let linkContribution = (dampingFactor * currentRank) / Float(vertex.neighbors.count)

                    for edge in vertex.neighbors {
                        edge.neighbor.rank[1] += linkContribution
                    }
                }
                // Sink node case: Distribute to all other vertices
                else {
                    if self.canvas.count > 1 {
                        let sinkContribution = (dampingFactor * currentRank) / Float(self.canvas.count - 1)

                        for otherVertex in self.canvas {
                            if vertex != otherVertex {
                                otherVertex.rank[1] += sinkContribution
                            }
                        }
                    }
                }
            }

            // Check for convergence
            var maxChange: Float = 0
            for vertex in self.canvas {
                let change = abs(vertex.rank[1] - vertex.rank[0])
                maxChange = max(maxChange, change)

                // Move new rank to current rank for next iteration
                vertex.rank[0] = vertex.rank[1]
            }

            hasConverged = maxChange < convergenceThreshold
            iteration += 1
        }

        // Store final results in the last slot for compatibility
        for vertex in self.canvas {
            vertex.rank[2] = vertex.rank[0] * 100  // Scale back to your educational format
        }

        print("PageRank converged after \(iteration) iterations")
    }
}
```

**Key improvements in the enhanced version:**

1. **Damping factor integration**: Each page gets baseline authority `(1-d)/N` plus link-based authority `d * (incoming contributions)`
2. **Mathematical accuracy**: Uses 1.0 probability scale internally, converts to your 100-scale for output
3. **Convergence detection**: Stops when changes become negligible, avoiding unnecessary computation
4. **Stability**: Damping factor prevents rank accumulation issues and ensures convergence
5. **Backward compatibility**: Still populates your three-slot rank array format

### Choosing the right convergence threshold

The convergence threshold (default: 0.0001) represents the maximum change in any page's PageRank value between iterations. This choice balances computational efficiency with result accuracy:

**Threshold selection guidelines:**

- **0.001 (1e-3)**: Fast convergence, suitable for real-time applications or large graphs where approximate results are acceptable. Typical convergence in 10-20 iterations.

- **0.0001 (1e-4)**: Balanced approach, recommended for most applications. Provides good accuracy while maintaining reasonable computation time. Typical convergence in 20-50 iterations.

- **0.00001 (1e-5)**: High precision, suitable for academic research or applications requiring very stable rankings. May require 50-100+ iterations.

**Factors affecting threshold choice:**

1. **Graph size**: Larger graphs may need looser thresholds to avoid excessive computation
2. **Application requirements**: Search engines prioritize speed; research applications prioritize precision
3. **Update frequency**: Frequently updated graphs benefit from faster convergence
4. **Resource constraints**: Limited computational resources favor higher thresholds

**Proposed changes to your Vertex class:**

No changes needed to your existing `Vertex<T>` class—the enhanced algorithm works with your current structure while providing more accurate results.

### Educational vs. production considerations

Our original implementation prioritizes learning over optimization:

**Educational Features:**
- Fixed iteration count for predictable results
- Rank history preservation for analysis
- Simplified probability calculations
- Clear separation of concerns

**Production Differences:**
```swift
// Production PageRank includes additional factors:

// 1. Damping factor (Google uses 0.85)
let dampingFactor: Float = 0.85
let pageRank = (1 - dampingFactor) + dampingFactor * (sumOfIncomingRanks)

// 2. Convergence testing
func hasConverged() -> Bool {
    return maxRankChange < convergenceThreshold
}

// 3. Sparse matrix optimizations for billions of pages
// 4. Distributed computation across multiple machines
// 5. Personalization factors for user-specific rankings
```

**The Damping Factor:** Google's original PageRank includes a damping factor (typically 0.85) that models the probability that a random surfer continues clicking links versus starting fresh at a random page. This improves stability and reflects more realistic browsing behavior.

## Real-world applications

PageRank's influence extends far beyond search engines, providing a general framework for measuring importance in networked systems.

### Search engines and ranking

```swift
// Simplified search ranking integration
struct SearchResult {
    let page: Vertex<String>
    let contentScore: Float      // Based on keyword relevance
    let pageRankScore: Float     // Based on link authority

    var totalScore: Float {
        // Combine content relevance with link authority
        return contentScore * 0.6 + pageRankScore * 0.4
    }
}

func rankSearchResults(_ results: [SearchResult]) -> [SearchResult] {
    return results.sorted { $0.totalScore > $1.totalScore }
}
```

Modern search engines use PageRank as one signal among hundreds, but it remains fundamental to understanding web page authority.

### Social network analysis

PageRank adapts naturally to social networks for influence measurement:

```swift
// Social network PageRank application
class SocialInfluenceAnalyzer {
    private var socialGraph = Graph<String>()

    func addConnection(from follower: String, to influencer: String) {
        let followerVertex = findOrCreateVertex(follower)
        let influencerVertex = findOrCreateVertex(influencer)

        // Social connections represent endorsement/attention flow
        socialGraph.addEdge(source: followerVertex,
                          neighbor: influencerVertex,
                          weight: 1)
    }

    func calculateInfluenceScores() {
        socialGraph.processPageRankWithSink()

        // Higher PageRank indicates greater social influence
        for vertex in socialGraph.canvas {
            if let finalRank = vertex.rank.last {
                print("\(vertex.tvalue!) influence score: \(finalRank)")
            }
        }
    }
}
```

### Recommendation systems

PageRank can power recommendation engines by modeling user interest flow:

```swift
// Product recommendation using PageRank
class ProductRecommendationEngine {
    private var productGraph = Graph<String>()

    func addPurchaseConnection(from product1: String, to product2: String) {
        // "Users who bought X also bought Y"
        let sourceProduct = findOrCreateVertex(product1)
        let targetProduct = findOrCreateVertex(product2)

        productGraph.addEdge(source: sourceProduct,
                           neighbor: targetProduct,
                           weight: 1)
    }

    func getRecommendations(for user: [String]) -> [String] {
        productGraph.processPageRankWithSink()

        // Rank all products by PageRank score
        let rankedProducts = productGraph.canvas
            .sorted { $0.rank.last! > $1.rank.last! }
            .compactMap { $0.tvalue }
            .filter { !user.contains($0) }  // Exclude already purchased

        return Array(rankedProducts.prefix(5))  // Top 5 recommendations
    }
}
```

### Academic citation networks

PageRank measures academic paper importance through citation analysis:

```swift
// Academic paper ranking
struct AcademicPaper {
    let title: String
    let authors: [String]
    let year: Int
    var citationScore: Float = 0.0
}

class CitationAnalyzer {
    private var citationGraph = Graph<AcademicPaper>()

    func addCitation(from citing: AcademicPaper, to cited: AcademicPaper) {
        let citingVertex = findOrCreateVertex(citing)
        let citedVertex = findOrCreateVertex(cited)

        // Citations flow authority from citing paper to cited paper
        citationGraph.addEdge(source: citingVertex,
                            neighbor: citedVertex,
                            weight: 1)
    }

    func calculatePaperImportance() {
        citationGraph.processPageRankWithSink()

        // Update paper importance scores
        for vertex in citationGraph.canvas {
            if let paper = vertex.tvalue,
               let importance = vertex.rank.last {
                vertex.tvalue?.citationScore = importance
                print("\(paper.title): \(importance)")
            }
        }
    }
}
```

## Performance analysis

### Time complexity

**Our Educational Implementation:**
- **Initialization**: O(V) where V is the number of vertices
- **Each iteration**: O(V + E) where E is the number of edges
- **Total time**: O(k × (V + E)) where k is the number of iterations
- **Fixed iterations**: O(V + E) since k = 3 is constant

**Production PageRank:**
- **Convergence-based**: O(i × (V + E)) where i is iterations until convergence
- **Large graphs**: i typically ranges from 50-100 iterations
- **Optimization**: Sparse matrix operations reduce effective complexity

### Space complexity

**Memory Requirements:**
- **Vertex storage**: O(V) for storing PageRank values
- **Edge storage**: O(E) for graph representation
- **Iteration history**: O(k × V) for debugging and analysis
- **Total space**: O(V + E + k × V) = O(V + E) for fixed k

**Optimization Opportunities:**
```swift
// Memory optimization for large graphs
class OptimizedPageRank {
    private var currentRanks: [Float]
    private var nextRanks: [Float]

    // Only store current and next iteration values
    // Reduces memory from O(k × V) to O(V)
    func optimizedPageRank() {
        while !hasConverged() {
            calculateNextIteration()
            swapRankArrays()  // Reuse memory
        }
    }
}
```

### Comparison with other centrality measures

| Algorithm | Time Complexity | Best Use Case | Implementation Complexity |
|-----------|-----------------|---------------|---------------------------|
| PageRank | O(k × (V + E)) | Web-scale networks | Medium |
| Betweenness Centrality | O(V³) | Social network analysis | High |
| Closeness Centrality | O(V²) | Small networks | Low |
| Degree Centrality | O(V + E) | Quick influence estimates | Very Low |

**PageRank Advantages:**
- Scales to massive networks (billions of pages)
- Considers global graph structure
- Robust against manipulation attempts
- Well-studied mathematical properties

## Building algorithmic intuition

### PageRank design patterns

Understanding when and how to apply PageRank concepts:

#### 1. Authority flow modeling
```swift
// Pattern: Model how influence/authority flows through networks
protocol AuthorityFlowNetwork {
    associatedtype Node

    func distributeAuthority(from source: Node,
                           to destinations: [Node],
                           amount: Float)
    func calculateFinalAuthority() -> [Node: Float]
}
```

#### 2. Importance through consensus
```swift
// Pattern: Measure importance through collective endorsement
func consensusBasedRanking<T>(_ graph: Graph<T>) -> [T: Float] {
    // Important items are those endorsed by other important items
    graph.processPageRankWithSink()
    return extractRankings(from: graph)
}
```

#### 3. Iterative refinement
```swift
// Pattern: Iteratively improve estimates until convergence
func iterativeRefinement(initialEstimate: [Float],
                        refinementFunction: ([Float]) -> [Float]) -> [Float] {
    var current = initialEstimate
    var iterations = 0

    repeat {
        let next = refinementFunction(current)
        if hasConverged(current, next) { break }
        current = next
        iterations += 1
    } while iterations < maxIterations

    return current
}
```

#### 4. Sink node normalization
```swift
// Pattern: Handle edge cases that break mathematical assumptions
func normalizeForSinkNodes(_ ranks: inout [Float],
                          sinkNodes: [Int],
                          totalNodes: Int) {
    for sinkIndex in sinkNodes {
        let redistributedRank = ranks[sinkIndex] / Float(totalNodes - 1)

        for i in 0..<totalNodes {
            if i != sinkIndex {
                ranks[i] += redistributedRank
            }
        }
        ranks[sinkIndex] = 0
    }
}
```

### Common pitfalls and solutions

#### Link manipulation resistance
```swift
// Problem: Attempts to game PageRank through artificial links
// Solution: PageRank's mathematical properties provide natural resistance

// Artificial link farms dilute authority rather than concentrating it
func demonstrateLinkDilution() {
    // Creating many low-quality links reduces per-link authority
    let artificialAuthority = totalAuthority / Float(artificialLinkCount)
    // As artificial links increase, per-link value decreases
}
```

#### Damping factor importance
```swift
// Problem: Without damping, PageRank can become trapped in link cycles
// Solution: Damping factor models realistic browsing behavior

extension Graph {
    func pageRankWithDamping(dampingFactor: Float = 0.85) -> [Float] {
        // (1 - d) represents probability of random jump to any page
        // d represents probability of following a link
        let randomJumpProbability = (1 - dampingFactor) / Float(canvas.count)

        // Modified PageRank formula:
        // PR(A) = (1-d)/N + d * Σ(PR(Ti)/C(Ti))
        return calculateWithDamping(randomJumpProbability, dampingFactor)
    }
}
```

#### Convergence considerations
```swift
// Problem: Determining when PageRank calculation is complete
// Solution: Monitor changes between iterations

func checkConvergence(_ oldRanks: [Float], _ newRanks: [Float]) -> Bool {
    let maxChange = zip(oldRanks, newRanks)
        .map { abs($0 - $1) }
        .max() ?? 0

    return maxChange < convergenceThreshold  // Typically 0.0001
}
```

### Integration with other algorithms

PageRank enhances many algorithms covered in previous chapters:

#### Enhanced graph traversal (Chapter 11)
```swift
// Priority-guided traversal using PageRank
func pageRankGuidedTraversal(_ graph: Graph<String>) {
    graph.processPageRankWithSink()

    // Visit vertices in PageRank order
    let sortedVertices = graph.canvas.sorted {
        $0.rank.last! > $1.rank.last!
    }

    for vertex in sortedVertices {
        processHighImportanceVertex(vertex)
    }
}
```

#### Search optimization (Chapter 3)
```swift
// PageRank-weighted search results
func searchWithPageRank(_ query: String,
                       _ documents: [Document]) -> [Document] {
    let relevanceScores = calculateRelevance(query, documents)
    let pageRankScores = calculatePageRank(documents)

    return documents.sorted { doc1, doc2 in
        let score1 = relevanceScores[doc1]! * 0.7 + pageRankScores[doc1]! * 0.3
        let score2 = relevanceScores[doc2]! * 0.7 + pageRankScores[doc2]! * 0.3
        return score1 > score2
    }
}
```

## When to use PageRank

### Decision framework

**Use PageRank when:**
- Analyzing networks with directed relationships (links, citations, endorsements)
- Measuring importance through collective consensus
- Building recommendation systems based on user behavior
- Ranking elements in large-scale networked systems
- Need algorithm resistant to gaming/manipulation

**Consider alternatives when:**
- Working with undirected networks (use eigenvector centrality)
- Need real-time ranking updates (PageRank requires batch processing)
- Graph structure changes frequently (recalculation is expensive)
- Simple degree-based metrics suffice for the application
- Working with very small networks (overhead may not be worthwhile)

### Modern applications beyond search

**Content Discovery:**
- Social media feed ranking
- News article prioritization
- Video recommendation systems
- Podcast discovery algorithms

**Scientific Analysis:**
- Protein interaction networks
- Brain connectivity mapping
- Economic influence modeling
- Epidemic spread prediction

**Business Intelligence:**
- Customer influence scoring
- Product cross-selling optimization
- Supply chain risk assessment
- Market research analysis

## Advanced concepts

### Personalized PageRank

Standard PageRank can be personalized for individual users:

```swift
class PersonalizedPageRank<T> {
    private var graph: Graph<T>
    private var personalizedVector: [Float]  // User-specific preferences

    func calculatePersonalizedRank(for userPreferences: [T: Float]) -> [T: Float] {
        // Modify random jump distribution based on user preferences
        // Instead of uniform distribution, weight jumps toward preferred pages

        let totalPreference = userPreferences.values.reduce(0, +)
        let normalizedPreferences = userPreferences.mapValues { $0 / totalPreference }

        // Apply personalized PageRank algorithm
        return processPersonalizedPageRank(with: normalizedPreferences)
    }
}
```

### Topic-sensitive PageRank

PageRank can be calculated separately for different topics:

```swift
enum Topic {
    case technology, science, sports, entertainment
}

class TopicSensitivePageRank<T> {
    private var graphs: [Topic: Graph<T>] = [:]

    func calculateTopicRanks(for topic: Topic) -> [T: Float] {
        guard let topicGraph = graphs[topic] else { return [:] }

        // Calculate PageRank within topic-specific subgraph
        topicGraph.processPageRankWithSink()
        return extractRankings(from: topicGraph)
    }
}
```

### Distributed PageRank computation

For web-scale computation, PageRank is distributed across multiple machines:

```swift
// Simplified distributed PageRank concept
protocol DistributedPageRankNode {
    func calculateLocalPageRank(_ vertices: [Vertex<String>]) -> [Float]
    func exchangeRankUpdates(with neighbors: [DistributedPageRankNode])
    func synchronizeGlobalState() -> Bool
}

// Each machine processes a subset of the web graph
// Machines exchange rank updates after each iteration
// Process continues until global convergence
```


---

<div class="chapter-nav">
  <a href="17-vector-mathematics" class="prev">Previous Chapter</a>
  <a href="index">Table of Contents</a>
</div>
