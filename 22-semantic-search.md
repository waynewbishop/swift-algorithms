---
layout: chapter
title: "Chapter 22: Semantic Search"
description: "Understanding meaning through vector similarity"
---
# Semantic Search

Traditional search systems rely on exact keyword matching. When you search for "comfortable running shoes," these systems look for documents containing those exact words. This approach works well when queries and documents use identical terminology, but it fails to capture meaning. A product description using "athletic footwear" or "jogging sneakers" might be exactly what we're looking for, yet keyword matching would miss it entirely.

Semantic search solves this problem by understanding the meaning behind words rather than matching their literal characters. Instead of asking "do these words appear in the document," semantic search asks "does this document mean something similar to what I'm looking for." This shift from syntax to semantics enables search systems to find relevant content even when the exact words differ.

The foundation of semantic search rests on a mathematical representation of meaning: [vectors](https://en.wikipedia.org/wiki/Euclidean_vector). By converting text into high-dimensional numerical [arrays](https://en.wikipedia.org/wiki/Array_data_structure), we can use mathematical operations to measure how similar two pieces of text are in meaning.

This chapter explores the [algorithms](https://en.wikipedia.org/wiki/Algorithm) that power semantic search, from converting text to vectors through finding the most similar documents in a collection.

## Introducing word embeddings

Represented as a series of `Dictionary` values, **[word embeddings](https://en.wikipedia.org/wiki/Word_embedding)** transform words from symbolic representations into numerical vectors that capture semantic meaning. Rather than treating "king" and "queen" as arbitrary symbols with no mathematical relationship, embeddings represent them as points in a high-dimensional space where their proximity reflects their semantic similarity.

```swift
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

The key insight behind embeddings is distributional semantics: words that appear in similar contexts tend to have similar meanings. If running and jogging both frequently appear near words like exercise, fitness, and cardio, their vector representations will be similar. This principle, often summarized as "you shall know a word by the company it keeps," forms the mathematical foundation for capturing meaning in numbers.

Consider the relationships in a footwear search system. "Running" and "jogging" share semantic properties related to athletic activity. "Shoes" and "sneakers" share properties related to footwear. In a well-trained embedding space, these relationships manifest as geometric patterns. The vector representing "running shoes" combines aspects of both athletic activity and footwear, enabling the system to match queries like "comfortable jogging sneakers" even when the exact words differ.

The power of embeddings comes from this numerical representation. Once words are vectors, we can use standard mathematical operations to reason about meaning. We can measure similarity with cosine distance, find analogies through vector arithmetic, and cluster related concepts using geometric algorithms. Semantic search builds on these fundamental operations.

## GloVe embeddings

GloVe (Global Vectors for Word Representation) provides pre-trained word embeddings based on word co-occurrence statistics from large text corpora. Developed by researchers at Stanford in 2014, GloVe analyzes how often words appear together across billions of sentences to learn vector representations that capture semantic relationships.

Unlike modern transformer-based models that require significant computational resources to train, GloVe embeddings come pre-trained and ready to use. The training process analyzed massive text corpora including Wikipedia and web crawl data, processing 6 billion tokens to build a vocabulary of 400,000 words. For each word, GloVe learned a vector that encodes its semantic properties based on which other words appeared nearby throughout the corpus.

The GloVe data comes in a simple text format where each line contains a word followed by its vector components:

```
running 0.2345 -0.1234 0.5678 0.3456 -0.9012 ... (50 numbers)
jogging 0.2156 -0.1089 0.5234 0.3789 -0.8734 ... (50 numbers)
athletic 0.2234 -0.1156 0.5456 0.3623 -0.8891 ... (50 numbers)
cushioned 0.2410 -0.1201 0.5312 0.3702 -0.8623 ... (50 numbers)
computer 0.8734 0.5621 -0.3421 0.1289 0.4512 ... (50 numbers)
```

Notice how the first four words (athletic/fitness terms) have somewhat similar numbers, while "computer" differs significantly. This similarity emerges from co-occurrence patterns in the training data. Sentences about "running" and "jogging" share common words like "athletic," "exercise," "fitness," and "training," leading to similar vector representations.

GloVe offers embeddings in multiple dimensions. The 50-dimensional version (50d) uses 50 numbers per word and occupies roughly 171 MB for 400,000 words. Higher-dimensional versions (100d, 200d, 300d) provide more expressive power at the cost of larger file sizes and increased computational requirements. For many applications, 50-dimensional embeddings provide an effective balance between semantic expressiveness and practical efficiency.

You can download GloVe embeddings from the Stanford NLP website at `https://nlp.stanford.edu/projects/glove/`. The download file `glove.6B.zip` contains four versions trained on Wikipedia 2014 and Gigaword 5 (6 billion tokens total). Extract `glove.6B.50d.txt` to begin working with 50-dimensional embeddings.

Loading GloVe embeddings requires parsing the text format into a [dictionary](https://en.wikipedia.org/wiki/Associative_array) mapping words to their vector representations:

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

let running = embeddings["running"]!
let jogging = embeddings["jogging"]!
let shoes = embeddings["shoes"]!
let sneakers = embeddings["sneakers"]!

// Measure similarity using Quiver's cosineOfAngle (from Chapter 20: Vectors)
running.cosineOfAngle(with: jogging)     // ~0.78 (both athletic activities)
shoes.cosineOfAngle(with: sneakers)      // ~0.82 (both footwear)
running.cosineOfAngle(with: shoes)       // ~0.45 (related: running shoes)
jogging.cosineOfAngle(with: sneakers)    // ~0.43 (related: jogging sneakers)

// Unrelated words have low similarity
let computer = embeddings["computer"]!
running.cosineOfAngle(with: computer)    // ~0.08 (unrelated)
```

The cosine similarity values range from -1 to 1, where 1 indicates identical direction (same meaning), 0 indicates orthogonality (unrelated), and -1 indicates opposite direction (antonyms). Most real similarities fall between 0 and 1, with higher values indicating stronger semantic relationships.

These pre-trained embeddings require no machine learning expertise to use. The training has already happened on massive corpora using specialized algorithms. You simply load the vectors and begin computing similarity, performing analogies, or building semantic search systems. This accessibility makes GloVe an excellent foundation for exploring vector-based semantic algorithms.

## From words to documents

Word embeddings provide vector representations for individual words, but semantic search operates on documents: sentences, paragraphs, or full articles. We need an algorithm to convert a multi-word document into a single vector that captures its overall meaning.

The simplest effective approach averages the word vectors. Given a document with words `w₁`, `w₂`, ..., `wₙ` and their corresponding embeddings `v₁`, `v₂`, ..., `vₙ`, the document embedding is the element-wise average:

```
document_vector = (`v₁` + `v₂` + ... + `vₙ`) / `n`
```

This averaging preserves semantic properties. If a document contains words like "lightweight," "cushioned," "running," and "athletic," the averaged vector will point toward the general region of "athletic footwear" in the embedding space. The individual words contribute their semantic information, and the average represents their combined meaning.

The implementation requires tokenizing text into words, looking up each word's embedding, and computing the element-wise average:

```swift
// Convert text to vector by averaging word embeddings
func embedText(_ text: String, embeddings: [String: [Double]]) -> [Double] {
    // Tokenize: split text into lowercase words
    let words = text.lowercased()
        .components(separatedBy: .whitespacesAndNewlines)
        .filter { !$0.isEmpty }

    // Look up embedding for each word
    let vectors = words.compactMap { embeddings[$0] }

    // Compute element-wise average using Quiver's .averaged() method
    // Returns nil if vectors is empty or has mismatched dimensions
    return vectors.averaged() ?? Array(repeating: 0.0, count: 50)
}
```

The `embedText` function handles the full pipeline from text to vector. Tokenization splits on whitespace and converts to lowercase to match the GloVe vocabulary format. The `compactMap` operation looks up each word and filters out any words not in the embedding dictionary (like typos or rare words). Quiver's `.averaged()` method computes the element-wise mean, returning `nil` if the array is empty or dimensions are inconsistent. The nil-coalescing operator provides a zero vector fallback for documents with no known words.

Consider a concrete example with three-word documents and simplified 3-dimensional embeddings:

```swift
// Example: averaging word vectors to create document vectors
// Simplified embeddings for illustration
let embeddings = [
    "lightweight": [0.8, 0.2, 0.1],
    "running": [0.7, 0.3, 0.2],
    "shoes": [0.6, 0.4, 0.3],
    "cushioned": [0.7, 0.3, 0.2],
    "sneakers": [0.6, 0.5, 0.3]
]

let doc1 = embedText("lightweight running shoes", embeddings: embeddings)
// doc1 = [(0.8+0.7+0.6)/3, (0.2+0.3+0.4)/3, (0.1+0.2+0.3)/3]
//      = [0.70, 0.30, 0.20]

let doc2 = embedText("cushioned sneakers", embeddings: embeddings)
// doc2 = [(0.7+0.6)/2, (0.3+0.5)/2, (0.2+0.3)/2]
//      = [0.65, 0.40, 0.25]
```

These two documents have similar vectors because they contain semantically related words. Computing their cosine similarity would yield a high value, indicating they discuss related topics. This is exactly the property semantic search exploits: documents about similar topics have similar vector representations.

The averaging approach has limitations. It treats all words equally, ignoring the fact that some words ("cushioned") carry more semantic weight than others ("the," "and"). It also loses word order information—"shoes for running" and "running for shoes" produce identical vectors. More sophisticated approaches like TF-IDF weighting or sequential models address these issues, but simple averaging provides a surprisingly effective baseline for many semantic search applications.

For unknown words not in the GloVe vocabulary, the `compactMap` operation silently drops them. If a document contains only unknown words, the function returns a zero vector. This graceful degradation ensures the algorithm always produces output, though the semantic quality degrades when too many words are missing from the vocabulary.

## Measuring semantic similarity

Once documents are represented as vectors, measuring their semantic similarity reduces to computing the geometric similarity between their vector representations. The cosine similarity metric, introduced in [Chapter 20](20-vectors), provides exactly this measurement.

Cosine similarity computes the cosine of the angle between two vectors. Vectors pointing in the same direction (parallel) have cosine 1, vectors at right angles (orthogonal) have cosine 0, and vectors pointing in opposite directions have cosine -1. For document vectors, this translates to semantic similarity: documents about the same topic point in similar directions in the embedding space.

The formula for cosine similarity between vectors `a` and `b` is:

```
cosine_similarity = (`a` · `b`) / (||`a`|| × ||`b`||)
```

The numerator is the dot product: the sum of element-wise products. The denominator normalizes by the magnitudes of both vectors. This normalization makes cosine similarity independent of vector length—it measures direction, not magnitude.

The Quiver framework, introduced in [Chapter 20](20-vectors), provides the complete implementation of cosine similarity and the underlying vector operations:

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

// Compare document vectors using Quiver's cosine similarity
let doc1Vector = embedText("lightweight running shoes", embeddings: embeddings)
let doc2Vector = embedText("cushioned athletic sneakers", embeddings: embeddings)
let doc3Vector = embedText("machine learning algorithms", embeddings: embeddings)

// Use Quiver's cosineOfAngle method for similarity
let similarity1 = doc1Vector.cosineOfAngle(with: doc2Vector)
// ~0.87 - high similarity, both about athletic footwear

let similarity2 = doc1Vector.cosineOfAngle(with: doc3Vector)
// ~0.12 - low similarity, different topics
```

The similarity scores provide a quantitative measure of semantic relatedness. Scores above 0.7 typically indicate strong topical similarity, scores between 0.3 and 0.7 suggest some relationship, and scores below 0.3 indicate largely unrelated content. These thresholds vary by application and domain, but they provide useful intuition for interpreting results.

Cosine similarity has several properties that make it ideal for semantic search. It is symmetric: the similarity of A to B equals the similarity of B to A. It is bounded between -1 and 1, providing a normalized scale. It handles high-dimensional vectors efficiently—the dot product and magnitude calculations scale linearly with dimensionality. For 50-dimensional GloVe vectors, computing one similarity requires 50 multiplications, 49 additions, one square root, and one division—fast enough to compare thousands of documents per second.

The geometric interpretation provides intuition for how semantic search works. Imagine a three-dimensional space where each axis represents a semantic dimension like "athletic," "footwear," and "comfort." Documents about running shoes cluster in one region of this space, documents about machine learning cluster in another region, and documents about casual dress shoes cluster in yet another region. Cosine similarity measures how close documents are within this semantic space, with nearby documents receiving high scores.

This geometric view extends to 50 dimensions, though we cannot visualize it directly. Each dimension captures some aspect of meaning learned from word co-occurrence patterns. Documents with similar meaning align along similar directions through this high-dimensional space, producing high cosine similarity scores.

## Similarity score interpretation

The similarity scores provide a quantitative measure of semantic relatedness that enables ranking and filtering search results. Understanding what different score ranges mean helps calibrate expectations and set appropriate thresholds for different applications.

Scores above 0.7 typically indicate strong topical similarity. Documents in this range discuss the same subject matter, use related terminology, and likely satisfy the user's search intent. In a footwear search system, a query for "cushioned running shoes" might return "lightweight athletic sneakers" at 0.85 similarity and "comfortable jogging footwear" at 0.72—both clearly relevant results.

Scores between 0.3 and 0.7 suggest moderate relatedness. These documents share some semantic overlap but may address different aspects of a topic or use less directly related vocabulary. They might be useful as "related content" or secondary results. A query for "running shoes" might find "athletic training gear" at 0.55—related through the broader "athletic equipment" concept but not directly matching the query intent.

Scores below 0.3 generally indicate low semantic relevance. These documents use different terminology, discuss different topics, and rarely satisfy user intent. The "running shoes" query finding "machine learning algorithms" at 0.12 exemplifies this—the documents share no meaningful semantic connection despite both being technical content.

These thresholds vary by domain and application. Academic paper search might use stricter thresholds (0.8+) to ensure high relevance, while broad content discovery might accept lower scores (0.4+) to surface serendipitous connections. E-commerce product search often tunes thresholds based on user engagement metrics, finding the sweet spot between precision and recall for their specific catalog and user base.

## Similarity search algorithm

Semantic search requires finding the most similar documents to a query from a collection. Given a query vector and a database of document vectors, we need to identify the top `k` most similar documents. This is the [k-nearest neighbors](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm) problem in high-dimensional space.

The brute-force algorithm compares the query vector against every document vector, computes cosine similarity for each, sorts by similarity, and returns the top `k` results:

```swift
import Quiver

// Find k most similar vectors using brute-force comparison
func findSimilar(
    query: [Double],
    database: [[Double]],
    topK: Int = 5
) -> [(index: Int, score: Double)] {

    // Compute all similarities at once using Quiver's batch operation
    let similarities = database.cosineSimilarities(to: query)

    // Sort by similarity (highest first) and return top K
    return similarities.enumerated()
        .sorted { $0.1 > $1.1 }
        .prefix(topK)
        .map { $0 }
}
```

The algorithm has three phases. First, it computes cosine similarity between the query and all `n` documents in the database using Quiver's batch operation. This produces `n` similarity scores. Second, it sorts these scores in descending order. Third, it selects the top `k` entries and returns them.

The [time complexity](https://en.wikipedia.org/wiki/Time_complexity) is `O(n × d + n log n)`, where `n` is the number of documents and `d` is the vector dimensionality. The first term `(n × d)` comes from computing `n` cosine similarities, each requiring `O(d)` operations for the dot product and magnitude calculations. The second term `(n log n)` comes from sorting `n` scores. For typical values where `d` is 50 and `k` is much smaller than `n`, the sorting dominates when `n` is small, but the similarity computation dominates for large databases.

Consider a concrete example with a small document collection:

```swift
import Quiver

// Complete example: building and searching a document database
let embeddings = try loadGloVe(from: "glove.6B.50d.txt")

// Build document database
let documents = [
    "lightweight cushioned running shoes for marathons",
    "durable trail running sneakers with grip",
    "comfortable athletic footwear for jogging",
    "casual leather dress shoes for work",
    "machine learning classification algorithms"
]

let database = documents.map { embedText($0, embeddings: embeddings) }

// Search for similar documents using Quiver for similarity
let query = "best running shoes for training"
let queryVector = embedText(query, embeddings: embeddings)
let results = findSimilar(query: queryVector, database: database, topK: 3)

for (index, score) in results {
    print("\(score): \(documents[index])")
}

// Expected output (approximate scores):
// 0.89: lightweight cushioned running shoes for marathons
// 0.84: comfortable athletic footwear for jogging
// 0.76: durable trail running sneakers with grip
```

The first result has high similarity because it directly mentions running shoes and training-related attributes. The second result scores well due to shared athletic footwear vocabulary. The third result has good similarity through the running and athletic connection. The dress shoes and machine learning documents receive low scores and don't appear in the top 3.

## Building a semantic search system

A complete semantic search system combines text embedding, vector storage, and similarity search into a cohesive interface. The implementation requires data structures to store documents and their vectors, methods to add new documents, and methods to query for similar content.

The core data structures represent documents and search results:

```swift
// Data structures storing document text, vector embeddings, and search similarity scores
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

Each document stores its identifier, original text, and vector representation. Search results include the document identifier and text along with the similarity score that explains why this document matched.

The main search system encapsulates the embeddings and document collection:

```swift
import Quiver

// Semantic search engine using GloVe embeddings and cosine similarity for k-NN retrieval
// Complete semantic search implementation
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
        let documentVectors = documents.map { $0.vector }

        // Compute all similarities using Quiver's batch operation
        let similarities = documentVectors.cosineSimilarities(to: queryVector)

        return zip(documents, similarities)
            .sorted { $0.1 > $1.1 }
            .prefix(topK)
            .map { doc, score in
                SearchResult(id: doc.id, text: doc.text, similarity: score)
            }
    }
}
```

The initializer loads GloVe embeddings once at startup. The `add` method converts text to a vector and stores both. The `search` method converts the query to a vector, computes similarity with all documents using Quiver's batch `cosineSimilarities` operation, sorts by similarity, and returns the top `k` results.

This design separates concerns cleanly. Embedding logic stays in `embedText`, similarity computation leverages Quiver's vector operations, and the search system coordinates the overall workflow. Each component can be tested independently.

Using the search system requires only a few lines of code:

```swift
import Quiver

// Example: using the semantic search system
// Initialize with GloVe embeddings
var search = try SemanticSearch(glovePath: "glove.6B.50d.txt")

// Add documents
search.add(id: "shoe_001", text: "lightweight running shoes for marathons")
search.add(id: "shoe_002", text: "cushioned athletic sneakers for jogging")
search.add(id: "shoe_003", text: "trail running shoes with grip")
search.add(id: "shoe_004", text: "casual leather dress shoes")
search.add(id: "tech_001", text: "machine learning algorithms")

// Search for similar documents
let results = search.search("comfortable jogging footwear", topK: 3)

for result in results {
    print("\(result.id): \(result.similarity)")
    print("  \(result.text)")
}

// Output (approximate similarities):
// shoe_002: 0.91
//   cushioned athletic sneakers for jogging
// shoe_001: 0.86
//   lightweight running shoes for marathons
// shoe_003: 0.73
//   trail running shoes with grip
```

The system finds semantically related content even when exact keywords differ. The query mentions "comfortable jogging footwear," and the top result mentions "cushioned athletic sneakers"—related but not identical words. The second result about marathon running shoes shares semantic similarity through running and athletic activity. The trail shoes result ranks third through the running connection.

## Metadata filtering strategies

Adding metadata filtering extends the basic search with structured constraints. Many applications need to combine semantic similarity with categorical filters:

```swift
// Adding metadata to enable filtered search
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

        // Compute similarities on filtered set using Quiver's batch operation
        let filteredVectors = filtered.map { $0.vector }
        let similarities = filteredVectors.cosineSimilarities(to: queryVector)

        return zip(filtered, similarities)
            .sorted { $0.1 > $1.1 }
            .prefix(topK)
            .map { doc, score in
                SearchResult(id: doc.id, text: doc.text, similarity: score)
            }
    }
}
```

This allows queries like "running shoes" restricted to the "athletic" category, combining semantic understanding with structured filtering.

Batch operations improve efficiency when adding multiple documents:

```swift
// Batch add documents for better performance
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

## Semantic search applications

Semantic search applications span numerous domains, demonstrating the versatility of vector-based similarity. E-commerce platforms use semantic search to find products matching customer intent rather than exact keywords. When a shopper searches for "comfortable running shoes," the system surfaces results for "athletic footwear" and "jogging sneakers" that keyword matching would miss. This improves discovery and reduces zero-result searches.

Content recommendation systems leverage semantic similarity to find articles similar to what users recently read. News applications suggest related stories based on topic overlap rather than manual categorization. Educational platforms recommend learning materials that build on concepts a student just studied. These systems create personalized content journeys by understanding semantic relationships between documents.

Question-answering systems retrieve context relevant to user questions before generating responses. Given the question "What causes the seasons," the system retrieves paragraphs about Earth's axial tilt and orbital mechanics. This retrieved context guides the answer generation, grounding responses in factual sources rather than relying solely on model parameters.

The fundamental algorithmic pattern remains consistent across these applications: convert text to vectors using embeddings, store vectors alongside documents, compute query vectors, find nearest neighbors, return ranked results. Domain-specific variations add metadata filtering, different similarity thresholds, hybrid scoring combining semantic and keyword signals, or multi-stage retrieval pipelines. But the core semantic search algorithm provides the foundation.

## Building algorithmic intuition

Semantic search demonstrates how classical algorithms power modern AI applications. Word embeddings convert text into numerical vectors, enabling mathematical operations on meaning. The k-nearest neighbors search from the 1960s, combined with cosine similarity from linear algebra, solves the modern problem of finding related content. This connection between foundational computer science and current technology reveals that new applications often build on decades-old algorithmic insights.

Understanding semantic search requires integrating concepts from throughout this book. Vectors ([Chapter 20](20-vectors.md)) and matrices ([Chapter 21](21-matrices.md)) provide the mathematical foundation. Efficient search algorithms connect to binary search ([Chapter 3](03-basic-searching.md)) and hash tables ([Chapter 15](15-hash-tables.md)). The Quiver framework enables practical implementation in Swift. Mastering these fundamentals means understanding not just how modern AI works, but having the tools to build semantic search systems from scratch.
