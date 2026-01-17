---
layout: chapter
title: "Chapter 23: Semantic Search"
description: "Understanding meaning through vector similarity"
---
# Semantic Search

Traditional keyword search looks for exact word matches. Searching for "comfortable running shoes" won't find descriptions using "athletic footwear" or "jogging sneakers," even when these products match perfectly. This limitation becomes problematic when queries use different terminology to describe the same concepts.

Tags and categories address this by manually organizing content into predefined groups. For example, e-commerce sites enable searches to find items regardless of exact wording. This works well for broad categorization, but requires significant manual effort to tag every item and maintain the taxonomy as language evolves. Tags also use fixed vocabularies that can't capture semantic nuance—whether "cushioned" relates to "padded" or "breathable" connects to "mesh upper" requires human judgment and explicit tag relationships.

**Semantic search** takes a different approach by representing text as numerical vectors in high-dimensional space. Words with similar meanings have similar vector representations, enabling mathematical measurement of semantic similarity without manual tagging or predefined categories. This chapter explores the algorithms that convert text to vectors and find the most similar documents in a collection.

## Introducing word embeddings

**Word embeddings** transform words from symbolic representations into numerical vectors that capture semantic meaning. Rather than treating "king" and "queen" as arbitrary symbols, embeddings represent them as points in high-dimensional space where their proximity reflects semantic similarity.

The key insight is **distributional semantics**: words appearing in similar contexts have similar meanings. Training algorithms analyze large text collections to identify co-occurrence patterns—words like "running" and "jogging" that frequently appear near "exercise," "fitness," and "cardio" develop similar vector representations. Here's a simplified illustration using 4-dimensional vectors (real embeddings use 50-300 dimensions):

```swift
import Quiver 

// Word embeddings represent semantic relationships numerically
let embeddings = [
    "running":  [0.8, 0.7, 0.9, 0.2],  // Athletic activity
    "jogging":  [0.8, 0.7, 0.8, 0.2],  // Similar to running
    "shoes":    [0.1, 0.9, 0.2, 0.1],  // Footwear
    "sneakers": [0.1, 0.9, 0.3, 0.1]   // Similar to shoes
]

// Similar words have similar vectors
// "running" ≈ "jogging", "shoes" ≈ "sneakers"
```

In a footwear search system, "running" and "jogging" share athletic activity properties, while "shoes" and "sneakers" share footwear properties. The vector "running shoes" combines both aspects, enabling matches for "comfortable jogging sneakers" even when exact words differ.

Once words are vectors, we can use mathematical operations to reason about meaning: measure similarity with `cosine similarity`, find analogies through vector arithmetic, and cluster related concepts using geometric algorithms.

## GloVe embeddings

GloVe (Global Vectors for Word Representation) provides pre-trained word embeddings based on word co-occurrence statistics from large text collections. Developed by Stanford researchers in 2014, GloVe analyzes how often words appear together to learn vector representations that capture semantic relationships.

Unlike modern transformer models requiring significant computational resources, GloVe embeddings come pre-trained and ready to use. The training analyzed Wikipedia and web crawl data (6 billion tokens, 400,000 words), encoding each word's semantic properties based on co-occurrence patterns.

The GloVe data uses simple text format—each line contains a word followed by its vector components:

```
running 0.2345 -0.1234 0.5678 0.3456 -0.9012 ... (50 numbers)
jogging 0.2156 -0.1089 0.5234 0.3789 -0.8734 ... (50 numbers)
athletic 0.2234 -0.1156 0.5456 0.3623 -0.8891 ... (50 numbers)
cushioned 0.2410 -0.1201 0.5312 0.3702 -0.8623 ... (50 numbers)
computer 0.8734 0.5621 -0.3421 0.1289 0.4512 ... (50 numbers)
```

Notice how athletic/fitness terms have similar numbers, while "computer" differs significantly. This emerges from co-occurrence—words appearing in similar contexts develop similar vectors.

GloVe offers multiple dimensions: 50d, 100d, 200d, and 300d. The 50-dimensional version uses 50 numbers per word (171 MB for 400,000 words). Higher dimensions provide more expressiveness at the cost of larger files and increased computation. For many applications, 50d provides effective balance.

### Using GloVe embeddings

Loading GloVe embeddings requires parsing the text format into a `dictionary` mapping words to their vector representations:

```swift
// Parse GloVe text file into word-to-vector dictionary
func loadGloVe(from filePath: String) throws -> [String: [Double]] {
    let content = try String(contentsOfFile: filePath)
    var embeddings: [String: [Double]] = [:]

    for line in content.components(separatedBy: .newlines) {
        let parts = line.split(separator: " ")
        guard parts.count > 1 else { continue }

        let word = String(parts[0])
        let vector = parts.dropFirst().compactMap { Double($0) }

        // Verify vector has expected dimensionality
        guard vector.count == parts.count - 1 else { continue }

        embeddings[word] = vector
    }

    return embeddings
}
```

This function reads the entire file, splits it into lines, and parses each line into a word and its corresponding vector. The validation step ensures that all numeric components converted successfully before storing the embedding. For the 50-dimensional version, this produces a dictionary with 400,000 entries, each mapping a word to a 50-element array.

## Exploring word relationships

Once loaded, we can explore the semantic relationships captured by the embeddings using Quiver's vector operations. Words with similar meanings have vectors that point in similar directions:

```swift
import Quiver

// Explore semantic relationships between words using cosine similarity
let embeddings = try loadGloVe(from: "glove.6B.50d.txt")

guard let running = embeddings["running"],
      let jogging = embeddings["jogging"],
      let shoes = embeddings["shoes"],
      let sneakers = embeddings["sneakers"],
      let computer = embeddings["computer"] else {
    fatalError("Required words not found in GloVe embeddings")
}

// Measure similarity using Quiver's cosineOfAngle (from Chapter 20: Vectors)
running.cosineOfAngle(with: jogging)     // ~0.78 (both athletic activities)
shoes.cosineOfAngle(with: sneakers)      // ~0.82 (both footwear)
running.cosineOfAngle(with: shoes)       // ~0.45 (related: running shoes)
jogging.cosineOfAngle(with: sneakers)    // ~0.43 (related: jogging sneakers)

// Unrelated words have low similarity
running.cosineOfAngle(with: computer)    // ~0.08 (unrelated)
```

The cosine similarity values range from -1 to 1, where 1 indicates identical direction (same meaning), 0 indicates orthogonality (unrelated), and -1 indicates opposite direction (antonyms). Most real similarities fall between 0 and 1, with higher values indicating stronger semantic relationships.

These pre-trained embeddings require no machine learning expertise to use. You simply load the vectors and begin computing similarity, performing analogies, or building semantic search systems. This accessibility makes GloVe an excellent foundation for exploring vector-based semantic algorithms.

The 400,000-word GloVe vocabulary covers common English but may miss domain-specific terms. Production systems often combine GloVe embeddings with custom vocabularies or handle out-of-vocabulary words through subword tokenization.

## From words to documents

Word embeddings represent individual words, but semantic search operates on documents. We need an algorithm to convert multi-word text into a single vector capturing overall meaning.

The simplest effective approach averages the word vectors:

```
document_vector = (`v₁` + `v₂` + ... + `vₙ`) / `n`
```

If a document contains "lightweight," "cushioned," "running," and "athletic," the averaged vector points toward "athletic footwear" in embedding space. Individual words contribute semantic information; the average represents combined meaning.

Note that averaging word vectors loses word order and grammatical structure. More sophisticated approaches like weighted averaging or transformer models preserve these nuances, but simple averaging provides a strong baseline for many applications.

The implementation tokenizes text, looks up embeddings, and computes the element-wise average:

```swift
import Quiver

// Convert text to vector by averaging word embeddings
func embedText(_ text: String, embeddings: [String: [Double]]) -> [Double]? {
    let words = text.tokenize()
    let vectors = words.embed(using: embeddings)
    return vectors.averaged()
}
```

The `.tokenize()` method splits text into lowercase words. The `.embed(using:)` method looks up each word in the embeddings dictionary, automatically filtering words not found. Quiver's `.averaged()` method computes the element-wise mean, returning `nil` if no words are found in the vocabulary or if vectors have mismatched dimensions.

Example with simplified 3-dimensional embeddings:

```swift
let embeddings = [
    "lightweight": [0.8, 0.2, 0.1],
    "running": [0.7, 0.3, 0.2],
    "shoes": [0.6, 0.4, 0.3]
]

let doc1 = embedText("lightweight running shoes", embeddings: embeddings)!
// doc1 = [(0.8+0.7+0.6)/3, (0.2+0.3+0.4)/3, (0.1+0.2+0.3)/3]
//      = [0.70, 0.30, 0.20]
```

Documents with semantically related words have similar vectors, enabling semantic search to find related content.

## Measuring semantic similarity

Once documents are vectors, measuring semantic similarity reduces to computing geometric similarity between vector representations. The **cosine similarity** metric from [Chapter 20](20-vectors.md) provides this measurement. It computes the `cosine` of the angle between two vectors, where similar directions indicate similar meaning.

Why cosine? As explained in [Chapter 20](20-vectors.md), cosine similarity measures the angle between vectors, ranging from -1 (opposite) to 1 (identical). This focus on **direction** rather than magnitude makes it ideal for text comparison: "running shoes" and "lightweight cushioned running shoes" point in similar semantic directions even though one document is longer. Cosine ignores length differences and measures only how aligned the meanings are—exactly what we need for semantic search.

The Quiver framework provides cosine similarity operations:

```swift
import Quiver

// Quiver extends Array<Double> with vector operations
extension Array where Element == Double {
    // Dot product: sum of element-wise products
    func dot(_ other: [Double]) -> Double

    // Magnitude: length of the vector
    var magnitude: Double

    // Cosine similarity: measures angle between vectors
    func cosineOfAngle(with other: [Double]) -> Double
}
```

Quiver's `cosineOfAngle` method handles the complete calculation, including error handling for edge cases. Comparing document vectors becomes a single method call:

```swift
import Quiver

// Compare document vectors using Quiver's cosine similarity
let doc1Vector = embedText("lightweight running shoes", embeddings: embeddings)!
let doc2Vector = embedText("cushioned athletic sneakers", embeddings: embeddings)!
let doc3Vector = embedText("machine learning algorithms", embeddings: embeddings)!

// Use Quiver's cosineOfAngle method for similarity
let similarity1 = doc1Vector.cosineOfAngle(with: doc2Vector)
// ~0.87 - high similarity, both about athletic footwear

let similarity2 = doc1Vector.cosineOfAngle(with: doc3Vector)
// ~0.12 - low similarity, different topics
```

Cosine similarity has properties ideal for semantic search. It is symmetric (A to B equals B to A), bounded between -1 and 1, and handles high-dimensional vectors efficiently.

The geometric interpretation provides intuition: imagine a space where each axis represents a semantic dimension. Documents about running shoes cluster in one region, machine learning in another, dress shoes in yet another. Cosine similarity measures proximity within this semantic space. This extends to 50 dimensions—each dimension captures meaning from word co-occurrence patterns, and documents with similar meaning align along similar directions.

## Similarity search algorithm

Semantic search finds the most similar documents to a query from a collection. Given a query vector and document database, we identify the top `k` most similar documents—the [k-nearest neighbors](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm) problem in high-dimensional space.

The brute-force algorithm compares the query against every document, computes cosine similarity, sorts by score, and returns top `k` results:

```swift
import Quiver

// Find k most similar vectors using brute-force comparison
func findSimilar(query: [Double], database: [[Double]], topK: Int = 5) -> [(index: Int, score: Double)] {
    let similarities = database.cosineSimilarities(to: query)
    return similarities.topIndices(k: topK)
}
```

The algorithm computes similarity for all `n` documents using Quiver's batch operation, sorts scores in descending order, and selects the top `k` entries.

The time complexity is `O(n × d + n log n)`, where `n` is document count and `d` is vector dimensionality. The `(n × d)` term comes from computing `n` cosine similarities at `O(d)` each. The `(n log n)` term comes from sorting. For large databases with `d = 50`, similarity computation dominates.

Example with a document collection:

```swift
import Quiver

let embeddings = try loadGloVe(from: "glove.6B.50d.txt")

let documents = [
    "lightweight cushioned running shoes for marathons",
    "durable trail running sneakers with grip",
    "comfortable athletic footwear for jogging"
]

let database = documents.compactMap { embedText($0, embeddings: embeddings) }

let query = "best running shoes for training"
let queryVector = embedText(query, embeddings: embeddings)!
let results = findSimilar(query: queryVector, database: database, topK: 3)

// Returns documents ranked by semantic similarity to query
```

## Building a semantic search system

A complete semantic search system combines text embedding, vector storage, and similarity search. The core data structures:

```swift
// Data models for semantic search system
struct Document {
    let id: String
    let text: String
    let vector: [Double]
}

struct SearchResult {
    let id: String
    let text: String
    let similarity: Double
}
```

The complete implementation:

```swift
import Quiver

// Semantic search engine using GloVe embeddings and cosine similarity for k-NN retrieval
struct SemanticSearch {
    private var documents: [Document] = []
    private let embeddings: [String: [Double]]

    init(glovePath: String) throws {
        self.embeddings = try loadGloVe(from: glovePath)
    }

    mutating func add(id: String, text: String) {
        guard let vector = embedText(text, embeddings: embeddings) else { return }
        let document = Document(id: id, text: text, vector: vector)
        documents.append(document)
    }

    func search(_ query: String, topK: Int = 5) -> [SearchResult] {
        guard let queryVector = embedText(query, embeddings: embeddings) else { return [] }
        let documentVectors = documents.map { $0.vector }

        // Find top K most similar documents
        let similarities = documentVectors.cosineSimilarities(to: queryVector)
        let topResults = similarities.topIndices(k: topK)

        return topResults.map { result in
            let doc = documents[result.index]
            return SearchResult(id: doc.id, text: doc.text, similarity: result.score)
        }
    }
}
```

Usage example:

```swift
import Quiver

// Initialize with GloVe embeddings
var search = try SemanticSearch(glovePath: "glove.6B.50d.txt")

// Add documents
search.add(id: "shoe_001", text: "lightweight running shoes for marathons")
search.add(id: "shoe_002", text: "cushioned athletic sneakers for jogging")

// Search for similar documents
let results = search.search("comfortable jogging footwear", topK: 3)

// Returns semantically related content even when keywords differ
```

## Matrix operations for semantic search

Semantic search often processes hundreds or thousands of documents. Rather than transforming each document vector individually, we use matrix operations to process entire collections efficiently.

When documents are organized as matrix columns, `.multiplyMatrix()` transforms all documents simultaneously:

```swift
import Quiver

// Document matrix: each column is a document vector
let documents = [
    [1.0, 2.0, 3.0],  // Three 50-dimensional
    [4.0, 5.0, 6.0],  // document vectors
    // ... 50 rows total
]

// Apply transformation to all documents at once
let transformed = embeddingMatrix.multiplyMatrix(documents)
```

This batch processing becomes essential when building search indexes for large document collections, where transforming thousands of documents individually would be impractically slow. The matrix operations from [Chapter 22](22-matrix-transformations.md) enable these efficient batch transformations.

## Optimizing top-K selection with heaps

The `.topIndices(k:)` method uses a brute-force approach: compute all similarities, sort the entire array, and take the top `k` results. This works well for small to medium datasets, but the `O(n log n)` sorting becomes expensive when searching millions of documents for just 5-10 results.

Heaps provide a more efficient solution. Instead of sorting all `n` documents, we maintain a min-heap of size `k` containing the current top results. As we process each document, we compare its similarity to the smallest value in the heap. If the new similarity is larger, we remove the minimum and insert the new value. This approach achieves `O(n log k)` complexity—we process `n` documents, each requiring `O(log k)` heap operations.

The performance difference becomes significant with large datasets:

| Documents | k | Brute-force (sort all) | Heap (maintain top k) | Speedup |
|-----------|---|------------------------|----------------------|---------|
| 1,000 | 5 | `O(1000 log 1000)` ≈ 10,000 | `O(1000 log 5)` ≈ 2,300 | 4.3× |
| 10,000 | 10 | `O(10000 log 10000)` ≈ 133,000 | `O(10000 log 10)` ≈ 33,000 | 4.0× |
| 100,000 | 10 | `O(100000 log 100000)` ≈ 1,660,000 | `O(100000 log 10)` ≈ 330,000 | 5.0× |
| 1,000,000 | 5 | `O(1000000 log 1000000)` ≈ 20,000,000 | `O(1000000 log 5)` ≈ 2,300,000 | 8.7× |

Using the `Heap<T>` structure from [Chapter 11](11-heaps.md) as the storage mechanism streamlines the search algorithm. Instead of collecting all similarities in an array and sorting, we maintain a min-heap of the top `k` results as we compute each similarity. When a new similarity score exceeds the current minimum in the heap, we replace it. The heap automatically maintains the `k` highest scores in `O(log k)` time per update, eliminating the expensive `O(n log n)` sorting step entirely. After processing all documents, the heap contains exactly the top `k` results.

Here's the basic approach:

```swift
import Quiver
import Structures  

// Heap-optimized top-K selection - O(n log k)
extension Array where Element == Double {
    func topIndicesHeap(k: Int) -> [(index: Int, score: Double)] {
        // Wrapper to make (index, score) work with Heap<T: Comparable>
        struct Result: Comparable {
            let index: Int
            let score: Double
            static func < (lhs: Result, rhs: Result) -> Bool {
                lhs.score < rhs.score
            }
        }

        var heap = Heap<Result>(type: .min)

        for (index, score) in self.enumerated() {
            let result = Result(index: index, score: score)

            if heap.count < k {
                heap.enQueue(result)
            } else if score > heap.peek()!.score {
                // Replace minimum with better score (requires extending Heap<T>):
                // heap.deQueue()         // Remove minimum: O(log k)
                // heap.enQueue(result)   // Insert new result: O(log k)
            }
        }

        return heap.sequence
            .map { (index: $0.index, score: $0.score) }
            .sorted { $0.score > $1.score }
    }
}
```

The heap optimization becomes worthwhile when searching large document collections (100,000+ documents) for small result sets (smaller than 20), where the performance increase justifies the additional complexity. 
