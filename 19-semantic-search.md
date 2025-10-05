---
layout: chapter
title: "Chapter 19: Semantic Search"
description: "Understanding meaning through vector similarity"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Semantic Search

Traditional search systems rely on exact keyword matching. When you search for "comfortable running shoes," these systems look for documents containing those exact words. This approach works well when queries and documents use identical terminology, but it fails to capture meaning. A product description using "athletic footwear" or "jogging sneakers" might be exactly what you're looking for, yet keyword matching would miss it entirely.

Semantic search solves this problem by understanding the meaning behind words rather than matching their literal characters. Instead of asking "do these words appear in the document," semantic search asks "does this document mean something similar to what I'm looking for." This shift from syntax to semantics enables search systems to find relevant content even when the exact words differ.

The foundation of semantic search rests on a mathematical representation of meaning: vectors. By converting text into high-dimensional numerical arrays, we can use mathematical operations to measure how similar two pieces of text are in meaning. This chapter explores the algorithms that power semantic search, from converting text to vectors through finding the most similar documents in a collection.

## Understanding word embeddings

Word embeddings transform words from symbolic representations into numerical vectors that capture semantic meaning. Rather than treating "king" and "queen" as arbitrary symbols with no mathematical relationship, embeddings represent them as points in a high-dimensional space where their proximity reflects their semantic similarity.

The key insight behind embeddings is distributional semantics: words that appear in similar contexts tend to have similar meanings. If "king" and "queen" both frequently appear near words like "throne," "crown," and "reign," their vector representations will be similar. This principle, often summarized as "you shall know a word by the company it keeps," forms the mathematical foundation for capturing meaning in numbers.

Consider three words and their relationships. "King" and "queen" share semantic properties related to royalty and leadership. "Man" and "woman" share properties related to gender. In a well-trained embedding space, these relationships manifest as geometric patterns. The vector difference between "king" and "queen" points in roughly the same direction as the difference between "man" and "woman." This geometric consistency enables mathematical operations that preserve semantic relationships.

A word embedding maps each word to a fixed-length array of numbers. A 50-dimensional embedding might represent "apple" as `[0.2345, -0.1234, 0.5678, ...]` with 50 total values. Each dimension captures some aspect of the word's meaning, though individual dimensions are not directly interpretable. The embedding for "banana" might be `[0.2156, -0.1089, 0.5234, ...]`, similar to "apple" because both are fruits. Meanwhile "computer" would have a very different vector because it appears in entirely different contexts.

The power of embeddings comes from this numerical representation. Once words are vectors, we can use standard mathematical operations to reason about meaning. We can measure similarity with cosine distance, find analogies through vector arithmetic, and cluster related concepts using geometric algorithms. Semantic search builds on these fundamental operations.

## GloVe embeddings

GloVe (Global Vectors for Word Representation) provides pre-trained word embeddings based on word co-occurrence statistics from large text corpora. Developed by researchers at Stanford in 2014, GloVe analyzes how often words appear together across billions of sentences to learn vector representations that capture semantic relationships.

Unlike modern transformer-based models that require significant computational resources to train, GloVe embeddings come pre-trained and ready to use. The training process analyzed massive text corpora including Wikipedia and web crawl data, processing 6 billion tokens to build a vocabulary of 400,000 words. For each word, GloVe learned a vector that encodes its semantic properties based on which other words appeared nearby throughout the corpus.

The GloVe data comes in a simple text format where each line contains a word followed by its vector components:

```
apple 0.2345 -0.1234 0.5678 0.3456 -0.9012 ... (50 numbers)
banana 0.2156 -0.1089 0.5234 0.3789 -0.8734 ... (50 numbers)
fruit 0.2234 -0.1156 0.5456 0.3623 -0.8891 ... (50 numbers)
computer 0.8734 0.5621 -0.3421 0.1289 0.4512 ... (50 numbers)
```

Notice how the first three words (fruits) have somewhat similar numbers, while "computer" differs significantly. This similarity emerges from co-occurrence patterns in the training data. Sentences about "apples" and "bananas" share common words like "fruit," "eat," "sweet," and "grocery," leading to similar vector representations.

GloVe offers embeddings in multiple dimensions. The 50-dimensional version (50d) uses 50 numbers per word and occupies roughly 171 MB for 400,000 words. Higher-dimensional versions (100d, 200d, 300d) provide more expressive power at the cost of larger file sizes and increased computational requirements. For many applications, 50-dimensional embeddings provide an effective balance between semantic expressiveness and practical efficiency.

You can download GloVe embeddings from the Stanford NLP website at `https://nlp.stanford.edu/projects/glove/`. The download file `glove.6B.zip` contains four versions trained on Wikipedia 2014 and Gigaword 5 (6 billion tokens total). Extract `glove.6B.50d.txt` to begin working with 50-dimensional embeddings.

Loading GloVe embeddings requires parsing the text format into a dictionary mapping words to their vector representations:

```swift
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

Once loaded, you can explore the semantic relationships captured by the embeddings using Quiver's vector operations. Words with similar meanings have vectors that point in similar directions:

```swift
import Quiver

let embeddings = try loadGloVe(from: "glove.6B.50d.txt")

let king = embeddings["king"]!
let queen = embeddings["queen"]!
let man = embeddings["man"]!
let woman = embeddings["woman"]!

// Measure similarity using Quiver's cosineOfAngle (from Chapter 17)
king.cosineOfAngle(with: queen)     // ~0.75 (both royalty)
man.cosineOfAngle(with: woman)      // ~0.72 (both people)
king.cosineOfAngle(with: man)       // ~0.61 (both male)
queen.cosineOfAngle(with: woman)    // ~0.59 (both female)

// Unrelated words have low similarity
let pizza = embeddings["pizza"]!
king.cosineOfAngle(with: pizza)     // ~0.12 (unrelated)
```

The cosine similarity values range from -1 to 1, where 1 indicates identical direction (same meaning), 0 indicates orthogonality (unrelated), and -1 indicates opposite direction (antonyms). Most real similarities fall between 0 and 1, with higher values indicating stronger semantic relationships.

These pre-trained embeddings require no machine learning expertise to use. The training has already happened on massive corpora using specialized algorithms. You simply load the vectors and begin computing similarity, performing analogies, or building semantic search systems. This accessibility makes GloVe an excellent foundation for exploring vector-based semantic algorithms.

## From words to documents

Word embeddings provide vector representations for individual words, but semantic search operates on documents: sentences, paragraphs, or full articles. We need an algorithm to convert a multi-word document into a single vector that captures its overall meaning.

The simplest effective approach averages the word vectors. Given a document with words w₁, w₂, ..., wₙ and their corresponding embeddings v₁, v₂, ..., vₙ, the document embedding is the element-wise average:

```
document_vector = (v₁ + v₂ + ... + vₙ) / n
```

This averaging preserves semantic properties. If a document contains words like "chocolate," "baking," "dessert," and "sweet," the averaged vector will point toward the general region of "baked goods" in the embedding space. The individual words contribute their semantic information, and the average represents their combined meaning.

The implementation requires tokenizing text into words, looking up each word's embedding, and computing the element-wise average:

```swift
func embedText(_ text: String, embeddings: [String: [Double]]) -> [Double] {
    // Tokenize: split text into lowercase words
    let words = text.lowercased()
        .components(separatedBy: .whitespacesAndNewlines)
        .filter { !$0.isEmpty }

    // Look up embedding for each word
    let vectors = words.compactMap { embeddings[$0] }

    // Handle case where no words have embeddings
    guard !vectors.isEmpty else {
        return Array(repeating: 0.0, count: 50)
    }

    // Compute element-wise average
    return averageVectors(vectors)
}

func averageVectors(_ vectors: [[Double]]) -> [Double] {
    guard !vectors.isEmpty else { return [] }

    let dimensions = vectors[0].count
    return (0..<dimensions).map { dimension in
        let sum = vectors.reduce(0.0) { total, vector in
            total + vector[dimension]
        }
        return sum / Double(vectors.count)
    }
}
```

The `embedText` function handles the full pipeline from text to vector. Tokenization splits on whitespace and converts to lowercase to match the GloVe vocabulary format. The `compactMap` operation looks up each word and filters out any words not in the embedding dictionary (like typos or rare words). The averaging function computes the mean for each dimension independently, producing a vector with the same dimensionality as the individual word embeddings.

Consider a concrete example with three-word documents and simplified 3-dimensional embeddings:

```swift
// Simplified embeddings for illustration
let embeddings = [
    "chocolate": [0.8, 0.2, 0.1],
    "chip": [0.6, 0.3, 0.2],
    "cookies": [0.7, 0.4, 0.3],
    "baking": [0.6, 0.5, 0.4],
    "desserts": [0.7, 0.3, 0.2]
]

let doc1 = embedText("chocolate chip cookies", embeddings: embeddings)
// doc1 = [(0.8+0.6+0.7)/3, (0.2+0.3+0.4)/3, (0.1+0.2+0.3)/3]
//      = [0.70, 0.30, 0.20]

let doc2 = embedText("baking desserts", embeddings: embeddings)
// doc2 = [(0.6+0.7)/2, (0.5+0.3)/2, (0.4+0.2)/2]
//      = [0.65, 0.40, 0.30]
```

These two documents have similar vectors because they contain semantically related words. Computing their cosine similarity would yield a high value, indicating they discuss related topics. This is exactly the property semantic search exploits: documents about similar topics have similar vector representations.

The averaging approach has limitations. It treats all words equally, ignoring the fact that some words ("chocolate") carry more semantic weight than others ("the," "and"). It also loses word order information—"dog bites man" and "man bites dog" produce identical vectors. More sophisticated approaches like TF-IDF weighting or sequential models address these issues, but simple averaging provides a surprisingly effective baseline for many semantic search applications.

For unknown words not in the GloVe vocabulary, the `compactMap` operation silently drops them. If a document contains only unknown words, the function returns a zero vector. This graceful degradation ensures the algorithm always produces output, though the semantic quality degrades when too many words are missing from the vocabulary.

## Measuring semantic similarity

Once documents are represented as vectors, measuring their semantic similarity reduces to computing the geometric similarity between their vector representations. The cosine similarity metric, introduced in Chapter 17, provides exactly this measurement.

Cosine similarity computes the cosine of the angle between two vectors. Vectors pointing in the same direction (parallel) have cosine 1, vectors at right angles (orthogonal) have cosine 0, and vectors pointing in opposite directions have cosine -1. For document vectors, this translates to semantic similarity: documents about the same topic point in similar directions in the embedding space.

The formula for cosine similarity between vectors a and b is:

```
cosine_similarity = (a · b) / (||a|| × ||b||)
```

The numerator is the dot product: the sum of element-wise products. The denominator normalizes by the magnitudes of both vectors. This normalization makes cosine similarity independent of vector length—it measures direction, not magnitude.

The Quiver framework, introduced in Chapter 17, provides the complete implementation of cosine similarity and the underlying vector operations. Rather than implementing dot product, magnitude, and cosine calculations ourselves, we leverage Quiver's battle-tested implementations:

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

Quiver's `cosineOfAngle` method handles the complete calculation: computing the dot product of both vectors, calculating their magnitudes, and performing the final division. The implementation includes proper error handling for edge cases like zero vectors.

Using Quiver, comparing two document vectors becomes a single method call:

```swift
import Quiver

let doc1Vector = embedText("chocolate chip cookies", embeddings: embeddings)
let doc2Vector = embedText("baking desserts", embeddings: embeddings)
let doc3Vector = embedText("machine learning algorithms", embeddings: embeddings)

// Use Quiver's cosineOfAngle method for similarity
let similarity1 = doc1Vector.cosineOfAngle(with: doc2Vector)
// ~0.85 - high similarity, both about baking/sweets

let similarity2 = doc1Vector.cosineOfAngle(with: doc3Vector)
// ~0.15 - low similarity, different topics
```

The similarity scores provide a quantitative measure of semantic relatedness. Scores above 0.7 typically indicate strong topical similarity, scores between 0.3 and 0.7 suggest some relationship, and scores below 0.3 indicate largely unrelated content. These thresholds vary by application and domain, but they provide useful intuition for interpreting results.

Cosine similarity has several properties that make it ideal for semantic search. It is symmetric: the similarity of A to B equals the similarity of B to A. It is bounded between -1 and 1, providing a normalized scale. It handles high-dimensional vectors efficiently—the dot product and magnitude calculations scale linearly with dimensionality. For 50-dimensional GloVe vectors, computing one similarity requires 50 multiplications, 49 additions, one square root, and one division—fast enough to compare thousands of documents per second.

The geometric interpretation provides intuition for how semantic search works. Imagine a three-dimensional space where each axis represents a semantic dimension like "food-related," "sweet-related," and "baked-related." Documents about cookies cluster in one region of this space, documents about machine learning cluster in another region, and documents about pizza cluster in yet another region. Cosine similarity measures how close documents are within this semantic space, with nearby documents receiving high scores.

This geometric view extends to 50 dimensions, though we cannot visualize it directly. Each dimension captures some aspect of meaning learned from word co-occurrence patterns. Documents with similar meaning align along similar directions through this high-dimensional space, producing high cosine similarity scores.

## Similarity search algorithm

Semantic search requires finding the most similar documents to a query from a collection. Given a query vector and a database of document vectors, we need to identify the top k most similar documents. This is the k-nearest neighbors problem in high-dimensional space.

The brute-force algorithm compares the query vector against every document vector, computes cosine similarity for each, sorts by similarity, and returns the top k results:

```swift
import Quiver

func findSimilar(
    query: [Double],
    database: [[Double]],
    topK: Int = 5
) -> [(index: Int, score: Double)] {

    var results: [(Int, Double)] = []

    // Compare query to every vector in database using Quiver
    for (index, vector) in database.enumerated() {
        let similarity = query.cosineOfAngle(with: vector)  // Quiver method
        results.append((index, similarity))
    }

    // Sort by similarity (highest first) and return top K
    return results
        .sorted { $0.1 > $1.1 }
        .prefix(topK)
        .map { $0 }
}
```

The algorithm has three phases. First, it iterates through all n documents in the database, computing cosine similarity between the query and each document. This produces n similarity scores. Second, it sorts these scores in descending order. Third, it selects the top k entries and returns them.

The time complexity is O(n × d + n log n), where n is the number of documents and d is the vector dimensionality. The first term (n × d) comes from computing n cosine similarities, each requiring O(d) operations for the dot product and magnitude calculations. The second term (n log n) comes from sorting n scores. For typical values where d is 50 and k is much smaller than n, the sorting dominates when n is small, but the similarity computation dominates for large databases.

Consider a concrete example with a small document collection:

```swift
import Quiver

let embeddings = try loadGloVe(from: "glove.6B.50d.txt")

// Build document database
let documents = [
    "chocolate chip cookie recipe with butter",
    "homemade fudge brownie baking instructions",
    "best pizza restaurants in san francisco",
    "machine learning classification algorithms",
    "vanilla ice cream dessert recipes"
]

let database = documents.map { embedText($0, embeddings: embeddings) }

// Search for similar documents using Quiver for similarity
let query = "cookie baking tips"
let queryVector = embedText(query, embeddings: embeddings)
let results = findSimilar(query: queryVector, database: database, topK: 3)

for (index, score) in results {
    print("\(score): \(documents[index])")
}

// Expected output (approximate scores):
// 0.87: chocolate chip cookie recipe with butter
// 0.72: homemade fudge brownie baking instructions
// 0.61: vanilla ice cream dessert recipes
```

The first result has high similarity because it directly mentions cookies and contains baking-related words. The second result scores well due to shared baking and dessert vocabulary. The third result has moderate similarity through the dessert connection. The pizza and machine learning documents receive low scores and don't appear in the top 3.

For larger databases, performance becomes a concern. Computing similarity for 10,000 documents with 50-dimensional vectors requires 10,000 × 50 = 500,000 multiplication operations plus sorting 10,000 scores. Modern CPUs handle this in tens of milliseconds. Scaling to 100,000 documents pushes into hundreds of milliseconds. At millions of documents, brute-force search becomes impractical.

Approximate nearest neighbor algorithms address this scaling challenge by trading some accuracy for dramatic speedup. Techniques like locality-sensitive hashing, hierarchical navigable small worlds (HNSW), and product quantization reduce search time from O(n × d) to O(log n × d) or even O(√n × d). These advanced methods enable semantic search over millions or billions of documents, though they introduce complexity beyond the scope of this chapter.

For many applications, brute-force search over moderately-sized collections (under 100,000 documents) provides acceptable performance while maintaining perfect accuracy and simple, understandable code. The algorithm is straightforward to implement, easy to debug, and produces exact results.

## Building a semantic search system

A complete semantic search system combines text embedding, vector storage, and similarity search into a cohesive interface. The implementation requires data structures to store documents and their vectors, methods to add new documents, and methods to query for similar content.

The core data structures represent documents and search results:

```swift
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

Each document stores its identifier, original text, and vector representation. Search results include the document identifier and text along with the similarity score that explains why this document matched.

The main search system encapsulates the embeddings and document collection:

```swift
import Quiver

struct SemanticSearch {
    private var documents: [Document] = []
    private let embeddings: [String: [Double]]

    init(glovePath: String) throws {
        self.embeddings = try loadGloVe(from: glovePath)
    }

    mutating func add(id: String, text: String) {
        let vector = embedText(text, embeddings: embeddings)
        let document = Document(id: id, text: text, vector: vector)
        documents.append(document)
    }

    func search(_ query: String, topK: Int = 5) -> [SearchResult] {
        let queryVector = embedText(query, embeddings: embeddings)
        var results: [(Document, Double)] = []

        // Use Quiver's cosineOfAngle for all similarity calculations
        for document in documents {
            let similarity = queryVector.cosineOfAngle(with: document.vector)
            results.append((document, similarity))
        }

        return results
            .sorted { $0.1 > $1.1 }
            .prefix(topK)
            .map { doc, score in
                SearchResult(id: doc.id, text: doc.text, similarity: score)
            }
    }
}
```

The initializer loads GloVe embeddings once at startup. The `add` method converts text to a vector and stores both. The `search` method converts the query to a vector, computes similarity with all documents using Quiver's `cosineOfAngle`, sorts by similarity, and returns the top k results.

This design separates concerns cleanly. Embedding logic stays in `embedText`, similarity computation leverages Quiver's vector operations, and the search system coordinates the overall workflow. Each component can be tested independently.

Using the search system requires only a few lines of code:

```swift
import Quiver

// Initialize with GloVe embeddings
var search = try SemanticSearch(glovePath: "glove.6B.50d.txt")

// Add documents
search.add(id: "recipe_001", text: "chocolate chip cookie recipe")
search.add(id: "recipe_002", text: "homemade brownie baking")
search.add(id: "recipe_003", text: "vanilla ice cream dessert")
search.add(id: "tech_001", text: "machine learning algorithms")
search.add(id: "travel_001", text: "best pizza restaurants")

// Search for similar documents
let results = search.search("cookie baking tips", topK: 3)

for result in results {
    print("\(result.id): \(result.similarity)")
    print("  \(result.text)")
}

// Output (approximate similarities):
// recipe_001: 0.89
//   chocolate chip cookie recipe
// recipe_002: 0.74
//   homemade brownie baking
// recipe_003: 0.62
//   vanilla ice cream dessert
```

The system finds semantically related content even when exact keywords differ. The query mentions "cookie baking," and the top result mentions "chocolate chip cookie recipe"—related but not identical words. The second result about brownies shares semantic similarity through baking and desserts. The ice cream result ranks lower but still relates through the dessert connection.

Adding metadata filtering extends the basic search with structured constraints. Many applications need to combine semantic similarity with categorical filters:

```swift
struct Document {
    let id: String
    let text: String
    let vector: [Double]
    let category: String  // Add metadata field
}

struct SemanticSearch {
    // ... existing code ...

    func search(
        _ query: String,
        topK: Int = 5,
        category: String? = nil
    ) -> [SearchResult] {
        let queryVector = embedText(query, embeddings: embeddings)

        // Filter by category before similarity search
        let filtered = category.map { cat in
            documents.filter { $0.category == cat }
        } ?? documents

        // Compute similarities on filtered set
        var results: [(Document, Double)] = []
        for document in filtered {
            let similarity = queryVector.cosineOfAngle(with: document.vector)
            results.append((document, similarity))
        }

        return results
            .sorted { $0.1 > $1.1 }
            .prefix(topK)
            .map { doc, score in
                SearchResult(id: doc.id, text: doc.text, similarity: score)
            }
    }
}
```

This allows queries like "cookie baking" restricted to the "desserts" category, combining semantic understanding with structured filtering.

Batch operations improve efficiency when adding multiple documents:

```swift
mutating func addBatch(_ items: [(id: String, text: String)]) {
    let newDocuments = items.map { id, text in
        let vector = embedText(text, embeddings: embeddings)
        return Document(id: id, text: text, vector: vector)
    }
    documents.append(contentsOf: newDocuments)
}
```

Processing documents in batches reduces overhead and enables optimizations like parallel vector computation, though the simple sequential version already performs well for moderate batch sizes.

The complete system demonstrates how simple algorithmic components combine to create useful functionality. Word embeddings capture meaning, vector averaging extends to documents, cosine similarity measures relatedness, k-nearest neighbors finds similar items, and clean abstractions tie everything together. This architecture scales from small experiments to production systems serving thousands of queries per second.

## Performance and practical considerations

The brute-force semantic search algorithm has predictable performance characteristics. Every search compares the query vector against n document vectors, where n is the collection size. Each comparison performs d multiplications and additions for the dot product, plus d multiplications and additions for the magnitudes, where d is the vector dimensionality. This gives O(n × d) time complexity for computing similarities.

For 50-dimensional GloVe vectors, each similarity computation requires approximately 200 floating-point operations. Modern processors execute billions of floating-point operations per second, making individual similarities very fast. The bottleneck emerges from the n factor—the number of documents searched.

Performance scales linearly with collection size. Searching 1,000 documents requires roughly 200,000 operations, completing in 1-2 milliseconds on typical hardware. Searching 10,000 documents requires 2,000,000 operations, taking 10-20 milliseconds. Searching 100,000 documents requires 20,000,000 operations, taking 100-200 milliseconds. This linear scaling means performance degrades predictably as collections grow.

The sorting phase adds O(n log n) complexity, but for practical values this rarely dominates. Sorting 100,000 scores requires roughly 1.7 million comparisons, less than the 20 million operations for similarity computation. Only for very small collections or very high-dimensional vectors does sorting become the bottleneck.

Memory requirements depend on the document collection size and vector dimensionality. Each 50-dimensional vector requires 400 bytes (50 doubles × 8 bytes per double). Storing 100,000 documents requires roughly 40 MB for vectors alone, plus memory for the original text. The GloVe embeddings themselves occupy about 160 MB for 400,000 words × 50 dimensions. Total memory footprint for a 100,000 document collection stays under 250 MB, easily fitting in modern RAM.

Several optimizations improve performance without changing the fundamental algorithm. Pre-computing and caching document vector magnitudes eliminates redundant square root operations during similarity computation. Storing vectors in contiguous memory improves cache locality. Using SIMD instructions parallelizes the dot product computation across vector elements. These optimizations provide 2-5× speedups while maintaining exact results.

For collections exceeding 100,000 documents, approximate nearest neighbor algorithms become attractive. Techniques like HNSW (Hierarchical Navigable Small Worlds) reduce search time from O(n × d) to O(log n × d) by building graph-based indexes that allow navigating to similar documents without examining every vector. These methods trade small amounts of accuracy (missing the true top k in perhaps 1-5% of queries) for dramatic speedups, enabling billion-document collections.

The choice between exact and approximate search depends on application requirements. E-commerce product search might tolerate 95% accuracy for 100× speedup. Academic paper search might require exact results to ensure important related work isn't missed. Customer support systems might prefer exact search on smaller, curated document sets. Understanding these tradeoffs informs architectural decisions.

Semantic search applications span numerous domains. E-commerce platforms use it to find products matching customer intent rather than exact keywords. Content recommendation systems find articles similar to what users recently read. Customer support systems route questions to relevant documentation. Research tools find related papers. Code search finds similar functions across large codebases. Question-answering systems retrieve context relevant to user questions.

The fundamental algorithmic pattern remains consistent across these applications: convert text to vectors using embeddings, store vectors alongside documents, compute query vectors, find nearest neighbors, return ranked results. Domain-specific variations add metadata filtering, different similarity thresholds, hybrid scoring combining semantic and keyword signals, or multi-stage retrieval pipelines. But the core semantic search algorithm provides the foundation.

Modern production systems build on these fundamentals with additional sophistication. They might combine GloVe or similar static embeddings with contextualized embeddings from transformer models. They might use learned re-ranking models to refine initial similarity scores. They might incorporate user interaction signals to personalize results. Yet the basic principles—vectors capture meaning, similarity measures relatedness, nearest neighbors find matches—remain central.

For interview preparation, semantic search problems test multiple skills. You might be asked to implement cosine similarity, design a document retrieval system, optimize search latency, or explain tradeoffs between exact and approximate methods. Understanding the complete pipeline from embeddings through similarity search provides the foundation to reason about these problems and their variations.

The algorithms in this chapter demonstrate how vector mathematics from Chapter 17 enables practical AI applications. Cosine similarity, originally an abstract geometric concept, becomes a semantic relatedness measure. k-nearest neighbors, originally a classification algorithm, becomes a semantic search engine. Pre-trained embeddings eliminate machine learning complexity while still capturing semantic meaning. Together, these pieces create systems that understand text meaning rather than just matching characters.


<div class="chapter-nav">
  <div class="chapter-nav-left">
    <a href="18-pagerank-algorithm">← Chapter 18: PageRank</a>
  </div>
  <div class="chapter-nav-center">
    <a href="index">Table of Contents</a>
  </div>
  <div class="chapter-nav-right">
  </div>
</div>
