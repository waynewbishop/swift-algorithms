---
layout: chapter
title: "Chapter 23: Similarity Operations"
description: "Compute cosine similarity, Euclidean distance, and semantic search rankings in Swift with Quiver"
---
# Similarity Operations

In [Chapter 20](20-vectors.md), we introduced the dot product and cosine similarity as operations on vectors. In [Chapter 22](22-matrix-transformations.md), we explored how matrices transform entire coordinate systems. This chapter builds on both foundations to examine the algorithms that measure relationships between vectors in high-dimensional space—the core computation powering recommendation engines, clustering, duplicate detection, and modern AI systems like large language models.

## The similarity problem

Many computational problems reduce to finding the closest match. Given a user's preferences represented as a vector, which items in a catalog are most similar? Given a search query, which documents are most relevant? Given a data point, which cluster does it belong to?

These are all instances of the same algorithmic challenge: measuring distance or similarity between vectors. The choice of metric determines what "similar" means, and different metrics suit different problems. We need algorithms that work efficiently across tens, hundreds, or even thousands of dimensions—far beyond the 2D and 3D spaces we can visualize.

## The dot product as a similarity measure

The dot product is the fundamental building block for measuring similarity. It computes the sum of element-wise products between two vectors, producing a single number that reflects how much the vectors agree:

```swift
import Quiver

// Compute dot product to measure vector agreement
let v1 = [3.0, 4.0]
let v2 = [5.0, 12.0]

let dot = v1.dot(v2)  // 63.0 = (3×5) + (4×12)
```

Mathematically, the dot product equals `‖v‖ × ‖w‖ × cos(θ)`, where `θ` is the angle between vectors. When vectors point in the same direction, the dot product is large and positive. When perpendicular, it equals zero. When opposite, it is negative. 

### The magnitude challenge

While the dot product does provide us with a general signal of similarity, its formula also includes `magnitude`. Two vectors pointing in identical directions but with different lengths produce vastly different dot products:

```swift
import Quiver

// Same direction, different magnitudes
let v1 = [3.0, 4.0]
let v2 = [6.0, 8.0]  // Same direction, 2x longer

v1.dot(v2)  // 50.0

// Scale both by 10x
let v3 = [30.0, 40.0]
let v4 = [60.0, 80.0]

v3.dot(v4)  // 5000.0 (100x larger, same direction!)
```

The direction hasn't changed, but the dot product jumped from 50 to 5,000. This happens because the dot product formula includes both vectors' magnitudes. To understand why normalization fixes this, we need to distinguish between two related but different measurements.

### Magnitude vs distance

Both magnitude and Euclidean distance use the Pythagorean theorem, but they measure different things. Magnitude answers "how far am I from home?"—it measures a single vector's length from the origin. Euclidean distance answers "how far is the coffee shop from the library?"—it measures the gap between any two points.

```swift
import Quiver

// Magnitude: distance from origin
let v = [3.0, 4.0]
v.magnitude  // 5.0 = √(3² + 4²)

// Euclidean distance: distance between any two points
let v1 = [1.0, 2.0]
let v2 = [4.0, 6.0]
v1.distance(to: v2)  // 5.0 = √((4-1)² + (6-2)²)

// Magnitude is the special case — distance from origin
let origin = [0.0, 0.0]
origin.distance(to: v)  // 5.0 (same as v.magnitude)
```

This distinction matters directly for similarity. Cosine similarity normalizes the dot product by dividing by the product of both magnitudes (`‖v‖ × ‖w‖`). That division cancels out "how far from home" each vector is, leaving only the angular relationship between them. Without understanding that magnitude measures distance from the origin, the normalization step in cosine similarity appears arbitrary—but it is precisely the operation that removes length bias and isolates direction.

## Cosine similarity

Cosine similarity divides the dot product by both vectors' magnitudes, canceling out length and measuring only the angle between them:

```
cosine(v, w) = (v · w) / (‖v‖ × ‖w‖)
```

The formula combines three operations we built in [Chapter 20](20-vectors.md). Consider two vectors `v = [3, 4]` and `w = [5, 12]`:

Step 1 — Dot product:

```
v · w = (3 × 5) + (4 × 12)
      = 15 + 48
      = 63
```

Step 2 — Magnitudes:

```
‖v‖ = √(3² + 4²) = √(9 + 16) = √25 = 5
‖w‖ = √(5² + 12²) = √(25 + 144) = √169 = 13
```

Step 3 — Normalize:

```
cosine(v, w) = 63 / (5 × 13)
             = 63 / 65
             = 0.969
```

The result 0.969 (close to 1.0) tells us these vectors point in nearly the same direction. Each step runs in `O(d)` time where `d` is the vector dimensionality—one pass computes the dot product, one pass computes each magnitude, and the final division is `O(1)`. For 50-dimensional GloVe embeddings, each comparison requires just 50 multiply-add operations.

The result ranges from -1 (opposite directions) through 0 (perpendicular) to 1 (identical direction). Quiver's `.cosineOfAngle(with:)` method encapsulates this same calculation:

```swift
import Quiver

// Cosine similarity is unaffected by magnitude
let v1 = [3.0, 4.0]
let v2 = [6.0, 8.0]  // Same direction, 2x longer

v1.cosineOfAngle(with: v2)  // 1.0 (identical direction)

// Scale has no effect
let v3 = [30.0, 40.0]
let v4 = [60.0, 80.0]

v3.cosineOfAngle(with: v4)  // 1.0 (still identical)
```

Where the raw dot product gave us 50 and 5,000 for the same directional relationship, [cosine similarity](https://waynewbishop.github.io/quiver/documentation/quiver/similarity-operations) returns 1.0 in both cases. This consistency is why cosine similarity dominates text analysis, recommendation systems, and embedding comparisons—it measures meaning rather than magnitude.

When we pre-normalize vectors to unit length using Quiver's `.normalized` property, the dot product and cosine similarity become identical. Both magnitudes equal 1, so the denominator disappears. Many production systems normalize vectors once at indexing time, then use the simpler dot product for all subsequent comparisons.

## Batch similarity and top results

Comparing a single query against an entire collection is the fundamental operation behind search and recommendation systems. Quiver provides batch operations that compute cosine similarity across an entire collection:

```swift
import Quiver

let query = [0.9, 0.8, 0.7]

let catalog = [
    [0.8, 0.9, 0.6],  // Item A
    [0.1, 0.2, 0.9],  // Item B
    [0.9, 0.7, 0.8]   // Item C
]

// Compute similarity against all items at once
let scores = catalog.cosineSimilarities(to: query)
// [0.99, 0.68, 0.99] — Items A and C are strong matches
```

Most applications need only the best matches, not all scores. Finding the top `k` results from `n` scores is the **selection problem**—a classic challenge connecting to sorting ([Chapter 4](04-basic-sorting.md)) and heaps ([Chapter 17](17-heaps.md)). Quiver's `.topIndices(k:)` method returns the highest-scoring elements with their original positions:

```swift
import Quiver

let scores = [0.42, 0.99, 0.15, 0.98, 0.67]

// Return the indices of the top 3 highest scores
let top3 = scores.topIndices(k: 3)
// [(index: 1, score: 0.99),
//  (index: 3, score: 0.98),
//  (index: 4, score: 0.67)]
```

The current implementation sorts all scores in `O(n log n)` time. For large collections where `k` is much smaller than `n`, a heap-based approach achieves `O(n log k)` by maintaining a min-heap of size `k` and replacing the minimum only when a better score appears. This optimization, using the heap structure from [Chapter 17](17-heaps.md), becomes significant at scale:

| Collection size | k | Sort all | Heap top-K | Speedup |
|-----------------|---|----------|------------|---------|
| 10,000 | 10 | `O(n log n)` ≈ 133K | `O(n log k)` ≈ 33K | 4× |
| 1,000,000 | 10 | `O(n log n)` ≈ 20M | `O(n log k)` ≈ 3.3M | 6× |

When results need associated labels, the `.topIndices(k:labels:)` variant maps scores to their identifiers directly:

```swift
import Quiver

let scores = [0.92, 0.45, 0.87, 0.33]
let items = ["running shoes", "desk lamp", "trail sneakers", "keyboard"]

// Return the top 2 scores with their associated item labels
let results = scores.topIndices(k: 2, labels: items)
// [(label: "running shoes", score: 0.92),
//  (label: "trail sneakers", score: 0.87)]
```

## Cluster analysis

Beyond pairwise comparison, similarity operations reveal structure within groups of vectors. Cluster cohesion measures how tightly related a group is by computing the average pairwise cosine similarity:

```swift
import Quiver

let techDocs = [[0.8, 0.3, 0.9], [0.7, 0.4, 0.8], [0.9, 0.2, 0.9]]
let sportsDocs = [[0.2, 0.9, 0.1], [0.3, 0.8, 0.2], [0.1, 0.7, 0.3]]

// Compute average pairwise cosine similarity within each cluster
techDocs.clusterCohesion()    // ~0.98 (tight cluster)
sportsDocs.clusterCohesion()  // ~0.97 (tight cluster)
```

Duplicate detection extends this idea to find near-identical vectors. Quiver's `.findDuplicates(threshold:)` method computes pairwise similarities and returns pairs exceeding the threshold:

```swift
import Quiver

let documents = [
    [0.8, 0.7, 0.9],
    [0.8, 0.7, 0.9],  // Duplicate of document 0
    [0.1, 0.2, 0.1]
]

// Find all vector pairs with cosine similarity above the threshold
let duplicates = documents.findDuplicates(threshold: 0.95)
// Documents 0 and 1 flagged as near-duplicates
```

## Performance analysis

Similarity operations compose multiple sub-operations, each with distinct complexity characteristics. Understanding the cost of each component reveals where optimization effort has the greatest impact.

### Pairwise similarity

Computing cosine similarity between two vectors requires one pass through both vectors to accumulate the dot product and both squared magnitudes, followed by two square root operations and one division. The dominant cost is the element-wise loop:

| Operation | Time | Space |
|-----------|------|-------|
| Dot product | `O(d)` | `O(1)` |
| Magnitude (each vector) | `O(d)` | `O(1)` |
| Cosine similarity | `O(d)` | `O(1)` |

The single-pass implementation computes all three in one `O(d)` traversal. For 50-dimensional GloVe embeddings, each comparison requires 50 multiply-add operations—trivial for modern hardware.

### Batch similarity

Comparing one query against `n` vectors multiplies the pairwise cost by the collection size:

| Operation | Time | Space |
|-----------|------|-------|
| Batch cosine similarity | `O(n × d)` | `O(n)` |
| Sort all scores | `O(n log n)` | `O(n)` |
| Full pipeline (similarity + sort) | `O(n × d + n log n)` | `O(n)` |

For collections with high-dimensional vectors (d = 300), the similarity computation dominates. For lower dimensions (d = 50), sorting becomes the bottleneck at large collection sizes.

### Selecting top results

The sort-then-slice approach processes all `n` scores even when we need only `k` results. A heap-based approach maintains a min-heap of size `k`, processing each score with an `O(log k)` heap operation instead of an `O(n log n)` sort:

| Approach | Time | Space |
|----------|------|-------|
| Sort all + slice | `O(n log n)` | `O(n)` |
| Min-heap of size k | `O(n log k)` | `O(k)` |

The heap approach also improves space complexity from `O(n)` to `O(k)`, since we only store the current top results rather than all sorted scores. For a collection of 1,000,000 vectors with k = 10, the heap reduces both time (from ~20M to ~3.3M operations) and memory (from storing 1M scores to storing 10).

### Cluster cohesion

Computing cluster cohesion requires comparing every pair of vectors within a group. For a cluster of `m` vectors, this involves `m × (m - 1) / 2` pairwise comparisons, each costing `O(d)`:

| Operation | Time | Space |
|-----------|------|-------|
| Cluster cohesion | `O(m² × d)` | `O(1)` |
| Duplicate detection (full collection) | `O(n² × d)` | `O(n²)` |

The quadratic growth means cohesion is practical for small to medium clusters (hundreds of vectors) but expensive for large collections. Duplicate detection across an entire dataset faces the same quadratic cost, which is why production systems use approximate methods for collections exceeding tens of thousands of vectors.

## Word embeddings and vector arithmetic

The operations in this chapter become particularly powerful when vectors carry semantic meaning. **Word embeddings** are vectors trained on large text collections where words appearing in similar contexts develop similar representations. "Running" and "jogging" end up as nearby vectors because they co-occur with words like "exercise," "fitness," and "cardio."

Pre-trained embeddings like GloVe (Global Vectors for Word Representation) encode each word as a 50 to 300-dimensional vector. Once loaded, our [similarity operations](https://waynewbishop.github.io/quiver/documentation/quiver/semantic-search) apply directly:

```swift
import Quiver

// Pre-trained word vectors (simplified to 4 dimensions)
let running  = [0.8, 0.7, 0.9, 0.2]
let jogging  = [0.8, 0.7, 0.8, 0.2]
let computer = [0.1, 0.3, 0.2, 0.9]

// Measure directional similarity between word embeddings
running.cosineOfAngle(with: jogging)   // ~0.99 (near-synonyms)
running.cosineOfAngle(with: computer)  // ~0.47 (unrelated)
```

What makes embeddings remarkable is that vector arithmetic captures semantic relationships. The most famous example demonstrates that gender relationships are encoded as consistent vector directions. If we take the vector for "king," subtract "man," and add "woman," the resulting vector lands nearest to "queen":

```swift
import Quiver

// Simplified 4D embeddings illustrating semantic relationships
let king   = [0.9, 0.2, 0.8, 0.7]   // Male royalty
let man    = [0.8, 0.1, 0.2, 0.6]   // Male concept
let woman  = [0.2, 0.8, 0.2, 0.6]   // Female concept
let queen  = [0.3, 0.9, 0.8, 0.7]   // Female royalty

// Vector arithmetic: king - man + woman ≈ queen
let result = king.subtract(man).add(woman)
// result = [0.3, 0.9, 0.8, 0.7]

// Confirm the result vector aligns with the expected word embedding
result.cosineOfAngle(with: queen)  // ~1.0
result.cosineOfAngle(with: king)   // ~0.79
```

The subtraction `king.subtract(man)` isolates the "royalty" component by removing the "male" direction. Adding `woman` reintroduces a gender direction, landing at "female royalty"—queen. This works because embeddings encode semantic properties as geometric directions. The "male-to-female" direction is consistent across the vocabulary, so adding it to any male concept shifts toward the female equivalent.

## Building algorithmic intuition

Similarity operations transform the abstract mathematics of vectors and matrices into practical tools for measuring relationships between data. The progression from dot product through normalization to cosine similarity reflects a fundamental design pattern: raw computation, then refinement to isolate the signal we care about. Understanding this progression equips us to evaluate the algorithms behind recommendation systems, search engines, and AI models—not as black boxes, but as applications of the linear algebra foundations from [Chapter 20](20-vectors.md), [Chapter 21](21-matrices.md), and [Chapter 22](22-matrix-transformations.md).
