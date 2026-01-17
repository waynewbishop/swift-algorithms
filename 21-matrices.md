---
layout: chapter
title: "Chapter 21: Matrices"
description: "Matrix fundamentals, operations, and data organization"
---
# Matrices

In [Chapter 20](20-vectors.md), we explored vectors as mathematical objects representing magnitude and direction. We saw how vectors model positions, velocities, forces, and high-dimensional data points. While vectors represent individual points or directions in space, **matrices** provide the mathematical framework for organizing collections of data and performing operations on multiple vectors simultaneously. 

## What are matrices?

A **matrix** is a rectangular grid of numbers arranged in rows and columns. While a `vector` is a single list of numbers representing a point or direction in space, a matrix is a collection of multiple vectors organized together. We can think of a matrix as a **table** where each row or column is itself a vector.

The dimensions of a matrix tell us its shape. A `2×3` matrix means 2 rows and 3 columns:

```
[1  2  3]
[4  5  6]
```

Can a matrix have just a single vector? Yes. A matrix can be a single row or a single column. A `1×3` matrix (one row, three columns) looks like this:

```
[1  2  3]
```

This is mathematically identical to the vector `[1, 2, 3]`. A `3×1` matrix (three rows, one column) represents the same data oriented vertically:

```
[1]
[2]
[3]
```

Both are valid matrices because they have the rectangular row-and-column structure, even though one dimension equals 1. In formal linear algebra, vectors are often represented as single-row or single-column matrices. This representation makes some operations work consistently, since object dimensions must align properly. When we write `[1, 2, 3]` in code, we're thinking "vector" conceptually, but mathematically it can be treated as either a `1×3` or `3×1` matrix depending on the context.

### Vectors as matrices: a practical perspective

In [Chapter 20](20-vectors.md), we worked with vectors as one-dimensional arrays like `[3.0, 4.0]`. Mathematically, this can also be viewed as a single-column matrix (a `2×1` matrix):

```swift
import Quiver

// Three equivalent representations of the same data
let vector = [3.0, 4.0]                // As vector (Quiver's approach)
let columnVector = [[3.0], [4.0]]      // As 2×1 matrix (column)
let rowVector = [[3.0, 4.0]]           // As 1×2 matrix (row)
```

This dual perspective bridges the gap between the vectors from Chapter 20 and the matrices we're exploring here. A vector is simply a special case of a matrix where one dimension equals `1`.

### What matrices represent

What do these numbers represent? That depends entirely on the application. In a dataset, each row might represent a different person, and each column a different measurement. The first row `[1, 2, 3]` could represent Person A's age (1), height (2), and weight (3). The second row `[4, 5, 6]` represents Person B's measurements. Now we have organized data for 2 people across 3 attributes.

In computer graphics, these same numbers might represent a transformation. The matrix describes how to move, rotate, or scale objects in space. Each number specifies how much one dimension affects another during the transformation. The matrix `[[0, -1], [1, 0]]` doesn't represent data about objects—it represents an operation that rotates any vector by 90 degrees.

Consider a real-world example: tracking three athletes across two fitness metrics (running speed and jump height). Each athlete is a row, each metric is a column:

```
          Speed  Jump
Athlete A   8.5   2.1
Athlete B   7.2   2.4
Athlete C   9.1   1.9
```

This is a `3×2` matrix. The numbers represent measured values. We could extract Athlete B's performance as a vector `[7.2, 2.4]`, or compare all athletes' speeds by looking at the first column `[8.5, 7.2, 9.1]`.

## Matrix representation in Quiver

Quiver extends Swift's array syntax to work with matrices naturally. Since Quiver treats arrays as vectors and arrays of arrays as matrices, we can work with mathematical structures using familiar Swift syntax.

### Creating matrices

In Quiver, matrices are simply nested arrays:

```swift
import Quiver

// Create a 2×3 matrix
let matrix = [
    [1.0, 2.0, 3.0],  // Row 1
    [4.0, 5.0, 6.0]   // Row 2
]

// Access individual elements
let value = matrix[0][1]  // 2.0 (row 0, column 1)

// Access entire rows
let firstRow = matrix[0]  // [1.0, 2.0, 3.0]
```

### Accessing columns

While rows are natural array elements, extracting columns requires Quiver's `.column(at:)` method:

```swift
import Quiver

let data = [
    [1.0, 2.0, 3.0],
    [4.0, 5.0, 6.0]
]

// Extract the second column (index 1)
let column = data.column(at: 1)  // [2.0, 5.0]
```

This becomes essential when working with data matrices where each column represents a different feature or variable.

## Basic matrix operations

Matrices support several fundamental operations that enable data manipulation and mathematical computations. Matrix addition combines two matrices by adding corresponding elements. Both matrices must have the same dimensions:

```
[1  2]   [5  6]   [6   8]
[3  4] + [7  8] = [10  12]
```

The result is computed element-wise: `result[i][j] = A[i][j] + B[i][j]`. Matrix subtraction works identically, but with subtraction instead of addition.

This operation is useful when combining datasets or merging information. For example, if two sensors collect measurements in matrix form, adding their matrices combines their readings. In machine learning, gradient matrices are often added when updating model parameters.

```swift
import Quiver

let readings1 = [
    [1.0, 2.0],
    [3.0, 4.0]
]

let readings2 = [
    [0.5, 0.3],
    [0.7, 0.2]
]

// Combine sensor readings using element-wise addition
let combined = readings1 + readings2
// Result: [[1.5, 2.3], [3.7, 4.2]]
```

Quiver extends Swift's arithmetic operators to work naturally with matrices, making matrix operations as simple as scalar arithmetic.

### Scalar broadcasting

Scalar broadcasting applies a single value to every element of a matrix. This operation appears constantly in data science and machine learning—standardizing data, applying scaling factors, or adding biases.

```swift
import Quiver

let matrix = [[100.0, 200.0], [300.0, 400.0]]

// Standardize data: subtract mean, divide by standard deviation (z-score)
let standardized = (matrix - 250.0) / 150.0
// Result: [[-1.0, -0.33], [0.33, 1.0]]

// Scale all values
let scaled = matrix * 0.5
// Result: [[50.0, 100.0], [150.0, 200.0]]

// Add offset
let offset = matrix + 10.0
// Result: [[110.0, 210.0], [310.0, 410.0]]
```

Quiver broadcasts scalars across matrices automatically, matching NumPy's behavior. This makes data transformations concise and readable. 

## Practical matrix applications

Matrices naturally represent tabular data. Consider organizing game scores for multiple players:

```swift
import Quiver

// Organize game scores as matrix (rows = players, columns = games)
let gameScores = [
    [95.0, 88.0, 92.0, 91.0],  // Player A: 4 game scores
    [87.0, 90.0, 89.0, 93.0],  // Player B: 4 game scores
    [92.0, 94.0, 88.0, 96.0]   // Player C: 4 game scores
]

// Extract all scores from game 3 using column extraction
let game3Scores = gameScores.column(at: 2)  // [92.0, 89.0, 88.0]

// Calculate average score for Player B
let playerBScores = gameScores[1]
let average = playerBScores.mean() ?? 0.0  // 89.75
```

This pattern extends to any tabular data: sensor readings over time, feature values across samples, or measurements across different conditions. The matrix structure makes it easy to analyze data by row (individual samples) or by column (individual variables).

### Document-term matrices

In text analysis and [semantic search](23-semantic-search.md), matrices organize documents and words efficiently. Each row represents a document, and each column represents a word in the vocabulary:

```swift
import Quiver 

// Document-term matrix: 3 documents, 4 words
// Words: ["algorithm", "data", "search", "structure"]
let documentMatrix = [
    [2.0, 3.0, 1.0, 2.0],  // Document 1 word counts
    [1.0, 2.0, 3.0, 1.0],  // Document 2 word counts
    [3.0, 1.0, 2.0, 3.0]   // Document 3 word counts
]

// Extract how often "data" appears across all documents
let dataColumn = documentMatrix.column(at: 1)  // [3.0, 2.0, 1.0]
```

This matrix representation enables mathematical operations on text. We can compare documents by examining their rows, or analyze word usage patterns by examining columns. 

## Building algorithmic intuition

Matrices provide a powerful framework for organizing multi-dimensional data into structured rectangular arrays. The row-column format naturally represents relationships—whether sensor readings over time, feature values across samples, or word counts across documents. This organization enables systematic operations on entire datasets rather than processing individual values one at a time.
