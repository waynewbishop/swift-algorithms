---
layout: chapter
title: "Chapter 20: Vectors"
description: "Mathematical foundations of vector operations and numerical computing"
---
# Vectors

  Throughout this book, we've worked with algorithms that process data—sorting arrays, traversing graphs, searching trees. Many modern applications also require mathematical operations on numerical data: measuring similarity between items, transforming coordinates, or representing features in machine learning models. **Vectors** provide the mathematical foundation for these operations.

## What are vectors?

A vector is a mathematical object that represents both magnitude and direction. Unlike a scalar value, which represents only size (like temperature or weight), a vector captures directional information alongside its size. This dual nature makes vectors ideally suited for representing anything that has both how much and which way properties.

Consider everyday examples. Wind isn't just "20 miles per hour" - it's "20 miles per hour from the northwest." That's a vector: magnitude (20 mph) and direction (northwest). When a character moves in a video game, we need both how fast they're moving and in which direction. When analyzing customer preferences across multiple product features, each preference profile can be represented as a vector in multidimensional space.

Mathematically, vectors are represented as ordered lists of numbers. A two-dimensional vector might be written as `[3, 4]`, representing movement 3 units in one direction and 4 units in another. Three-dimensional vectors add a third component `[x, y, z]`, and we can extend this to any number of dimensions.

Vectors can represent many real-world concepts. In physics simulations and game development, they represent positions in space, forces acting on objects, and velocities of moving entities. In machine learning, feature vectors capture multiple attributes of data points—a song might be represented as `[tempo, energy, danceability, loudness]`. Even RGB color values are vectors, with each component representing intensity on a scale from 0 to 1.

## Magnitude and direction

Every vector has two fundamental properties: `magnitude` and `direction`.

### Magnitude

Magnitude represents a vector's length or size - how much of something we have, independent of direction. For a velocity vector, magnitude is speed. For a force vector, magnitude is strength. It is calculated using the Pythagorean theorem extended to any dimension. For a 2D vector `[x, y]`, magnitude equals `√(x² + y²)`. For a 3D vector `[x, y, z]`, it's `√(x² + y² + z²)`. This pattern extends to any number of dimensions.

For vector `[3, 4]`, imagine an arrow from the origin to point `(3, 4)`. This forms a right triangle's hypotenuse with sides 3 and 4. The Pythagorean theorem gives us `√(3² + 4²) = √25 = 5`. This extends to higher dimensions. A vector `[1, 2, 3, 4]` has magnitude `√(1² + 2² + 3² + 4²) = √30 ≈ 5.48`.

### Direction and normalization

Direction is expressed as a unit vector - a `vector` with `magnitude` 1 that points in the same direction as the original. This process is called **normalization**. To normalize, divide each component by the vector's `magnitude`. Vector `[3, 4]` with magnitude 5 becomes `[3/5, 4/5] = [0.6, 0.8]`. Verify: `√(0.6² + 0.8²) = 1`.

Unit vectors separate how much from which way. A game character moving northeast `[0.7, 0.7]` at 5 units per second: normalize the direction, then multiply by speed to get the exact velocity needed. The zero vector `[0, 0]` cannot be normalized because it has no direction - it represents no movement or no force.

## Vector operations

Linear algebra defines several operations on vectors that have geometric meaning.

### Vector addition and subtraction

Vector addition combines vectors by adding corresponding components: `[a₁, a₂] + [b₁, b₂] = [a₁ + b₁, a₂ + b₂]`. Geometrically, place vectors head-to-tail; their sum is the vector from the start of the first to the end of the second.

A boat with velocity `[3, 0]` (3 units east) in a current with velocity `[0, 2]` (2 units north) has actual velocity `[3, 0] + [0, 2] = [3, 2]`.

Vector subtraction: `[a₁, a₂] - [b₁, b₂] = [a₁ - b₁, a₂ - b₂]`. This gives displacement between points. Enemy at `[130, 170]`, player at `[100, 200]`: displacement is `[100, 200] - [130, 170] = [-30, 30]`.

### Scalar multiplication

Multiplying a vector by a scalar scales magnitude without changing direction (negative scalars reverse direction): `k × [v₁, v₂] = [k × v₁, k × v₂]`.

Multiplying `[3, 4]` by 2 gives `[6, 8]` - same direction, doubled length. Multiplying by 0.5 gives `[1.5, 2]` - same direction, half length. Multiplying by -1 gives `[-3, -4]` - opposite direction.

### The dot product

The dot product takes two vectors and produces a single number. For `a = [a₁, a₂]` and `b = [b₁, b₂]`, the dot product is `a · b = a₁ × b₁ + a₂ × b₂`. It measures how much vectors agree - how much they point in the **same direction**. Mathematically: `a · b = |a| × |b| × cos(θ)`, where `θ` is the angle between vectors.

The dot product reveals relationships between vectors. When the dot product equals zero, vectors are perpendicular (`cos(90°) = 0`). When the dot product is positive, vectors point in similar directions. When the dot product is negative, vectors point in opposite directions.

Applications span multiple domains. In physics, the dot product calculates work done by computing force · distance. In graphics, it determines if surfaces face light sources, controlling brightness and shadows. In machine learning, measuring similarity between feature vectors through cosine similarity enables recommendation systems to find related items. The dot product transforms geometric intuition into practical computation.

> **Note:** The dot product formula `a · b = |a| × |b| × cos(θ)` reveals why normalized vectors measure similarity: when both have magnitude 1, the dot product *is* the cosine of the angle between them. This geometric insight powers the semantic search in [Chapter 23](23-semantic-search.md).

## Introducing Quiver

With mathematical foundations established, we need practical tools for working with vectors in Swift. Quiver is a lightweight Swift package that provides vector mathematics, numerical computing, and statistical operations.

### Why Quiver?

Quiver provides Swift-native vector mathematics and numerical computing by extending the standard `Array` type rather than creating custom containers. This design eliminates conversion overhead—arrays are vectors without boxing or unboxing. Operations integrate seamlessly with Swift's standard library, maintaining familiar syntax while adding mathematical capabilities. Generic constraints ensure type safety, with operations like division available only for floating-point types. The implementation prioritizes readability, making it easy to translate mathematical formulas directly to code.

### Installing Quiver

Add Quiver to your project via Swift Package Manager:

```
https://github.com/waynewbishop/bishop-algorithms-quiver-package
```

In Xcode: **File → Add Package Dependencies** → paste the URL above.

## Working with vectors

With Quiver imported, Swift arrays gain vector capabilities. Let's explore the mathematical concepts we've discussed through code.

### Magnitude

```swift
// Calculate magnitude (length) of vectors using Pythagorean theorem
import Quiver

// 2D position vector
let position = [3.0, 4.0]
print(position.magnitude)  // 5.0

// 3D velocity vector
let velocity = [1.0, 2.0, 3.0]
print(velocity.magnitude)  // `√14 ≈ 3.74`

// Feature vector (any dimension)
let features = [0.5, 0.3, 0.8, 0.2]
print(features.magnitude)  // 1.02
```

### Normalization

```swift
// Normalize vectors to unit length for direction-only representation
import Quiver

let vector = [3.0, 4.0]
let normalized = vector.normalized  // [0.6, 0.8]

// Verify it's a unit vector
print(normalized.magnitude)  // 1.0

// Practical use: moving at a specific speed
let direction = [30.0, 40.0].normalized  // [0.6, 0.8]
let speed = 5.0
let velocity = direction * speed  // [3.0, 4.0] - exactly 5 units/sec
```

Normalization separates direction from magnitude, enabling precise control over movement speeds, force magnitudes, and other directional quantities. Always handle zero vectors properly:

```swift
// Handle zero vectors to avoid normalization errors
import Quiver

let zeroVector = [0.0, 0.0]

if zeroVector.magnitude > 0 {
    let normalized = zeroVector.normalized
} else {
    print("Cannot normalize zero vector")
}
```

### Dot product

```swift
// Calculate dot product to measure vector alignment
import Quiver

let v1 = [1.0, 0.0]  // Points right
let v2 = [0.0, 1.0]  // Points up

// Perpendicular vectors have dot product of zero
v1.dot(v2)  // 0.0

// Parallel vectors
let v3 = [2.0, 0.0]  // Also points right
v1.dot(v3)  // 2.0

// Calculating the dot product
let a = [3.0, 4.0]
let b = [1.0, 2.0]
let result = a.dot(b)  // `(3×1) + (4×2) = 11`
```

### Cosine similarity

The most important operation for semantic search is cosine similarity, which measures how similar two vectors are regardless of their magnitude. Quiver provides `cosineOfAngle(with:)` for this calculation:

```swift
// Measure similarity between vectors using cosine of angle
import Quiver

// Word embedding vectors (simplified for illustration)
let word1 = [0.2, 0.8, 0.5]  // "running"
let word2 = [0.3, 0.7, 0.6]  // "jogging"

// Cosine similarity ranges from -1 (opposite) to 1 (identical)
let similarity = word1.cosineOfAngle(with: word2)  // ~0.98 (very similar)

// Feature vectors for songs
let song1 = [140.0, 0.9, 0.7, 0.8]  // [tempo, energy, danceability, loudness]
let song2 = [120.0, 0.8, 0.9, 0.7]
let songSimilarity = song1.cosineOfAngle(with: song2)  // 0.98
```

This cosine similarity technique is fundamental to recommendation systems, search engines, and machine learning. It appears throughout [Chapter 23](23-semantic-search.md), where semantic search uses vector similarity to find related documents.

## Vector averaging

Word embeddings represent individual words as vectors, but semantic search operates on documents: sentences, paragraphs, or full articles. We need to convert multi-word text into a single vector that captures the entire document's meaning. The solution is to average the word vectors element-wise, creating a document embedding.

This averaging preserves semantic properties. If a document contains words like "lightweight," "cushioned," "running," and "athletic," the averaged vector points toward the general region of "athletic footwear" in the embedding space. Individual words contribute their semantic information, and the average represents their combined meaning. Documents with similar words produce similar average vectors, which is exactly the property semantic search exploits.

Quiver provides the `.averaged()` method for computing the element-wise average of a collection of vectors:

```swift
// Average multiple word vectors to create document representation
import Quiver

let wordVectors = [
    [0.2, 0.8, 0.5],  // "running"
    [0.3, 0.7, 0.6],  // "shoes"
    [0.1, 0.6, 0.4]   // "comfortable"
]

// Compute element-wise average
guard let documentVector = wordVectors.averaged() else {
    fatalError("Cannot average empty or mismatched vectors")
}

// Result: [0.2, 0.7, 0.5] - points toward "athletic footwear" region
```

The `.averaged()` method validates that all vectors have the same dimensionality and returns `nil` for empty arrays or inconsistent dimensions. This pattern appears throughout [Chapter 23](23-semantic-search.md), where the `embedText()` function uses vector averaging to convert search queries and documents into comparable vectors for similarity computation.

## Building algorithmic intuition

Vectors provide the mathematical language for representing multi-dimensional data and measuring relationships between points in space. The operations covered—magnitude, normalization, dot product, and cosine similarity—form the foundation for semantic search, recommendation systems, and machine learning applications. Understanding vectors means recognizing how position, direction, and similarity translate into numerical operations.

The Quiver framework bridges classical algorithms and modern AI. Vectors can be organized and transformed systematically using matrices ([Chapter 21](21-matrices.md)), enabling efficient batch operations. Together, vectors and matrices power semantic search ([Chapter 23](23-semantic-search.md)), where word embeddings and cosine similarity find related documents. This connection between geometric concepts and algorithmic applications reveals why linear algebra underpins modern data science and machine learning.
