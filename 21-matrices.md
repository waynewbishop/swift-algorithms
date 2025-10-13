---
layout: chapter
title: "Chapter 21: Matrices"
description: "Matrix operations, transformations, and data organization"
---
# Matrices

In [Chapter 20](20-vectors), we explored vectors as mathematical objects representing magnitude and direction. We saw how vectors model positions, velocities, forces, and high-dimensional data points. While vectors represent individual points or directions in space, matrices provide the mathematical framework for organizing collections of data and transforming vectors systematically. Understanding matrices is essential for the semantic search algorithms in [Chapter 22](22-semantic-search), where document-term matrices and embedding transformations enable finding similar content through mathematical operations. Matrices bridge the gap between individual vectors and the complex data structures that power modern algorithms.

## What are matrices?

A matrix is a rectangular grid of numbers arranged in rows and columns. While a vector is a single list of numbers representing a point or direction in space, a matrix is a collection of multiple vectors organized together. You can think of a matrix as a table where each row or column is itself a vector.

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

Both are valid matrices because they have the rectangular row-and-column structure, even though one dimension equals 1. In formal linear algebra, vectors are often represented as single-row or single-column matrices. This representation makes operations like matrix multiplication work consistently, since the dimensions must align properly. When we write `[1, 2, 3]` in code, we're thinking "vector" conceptually, but mathematically it can be treated as either a `1×3` or `3×1` matrix depending on the context.

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

Matrices serve two primary purposes in computational work. First, they organize data efficiently, with rows typically representing samples and columns representing features. A dataset of 1000 customers with 5 attributes becomes a `1000×5` matrix. Second, matrices represent transformations—mathematical operations that change vectors in specific ways, such as rotations, scaling, reflections, and shearing.

## Understanding transformations

### Matrix-vector multiplication

One of the most powerful applications is transforming vectors with matrices. When we multiply a matrix by a vector, each element of the result comes from taking the dot product of a matrix row with the vector. For a 2D transformation, the calculation follows this pattern:

```
[a  b]   [x]   [a×x + b×y]
[c  d] × [y] = [c×x + d×y]
```

Consider a `2×2` rotation matrix that rotates vectors 90° counterclockwise:

```
[0  -1]
[1   0]
```

When this matrix transforms vector `[1, 0]` (pointing right), we calculate each component:

```
[0  -1]   [1]   [0×1 + (-1)×0]   [0]
[1   0] × [0] = [1×1 +   0×0 ] = [1]
```

The result `[0, 1]` points up, exactly 90° counterclockwise from the original direction. Each component of the output vector is computed by multiplying corresponding elements from a matrix row and the input vector, then summing those products. This is why matrix multiplication is defined as the dot product of rows with the vector.

We can verify this definition using Quiver's `.dot()` method to compute each component explicitly:

```swift
// Demonstrate matrix-vector multiplication as row-by-row dot products
import Quiver

let rotationMatrix = [
    [0.0, -1.0],
    [1.0,  0.0]
]

let vector = [1.0, 0.0]

// Calculate each component as dot product of matrix row with vector
let component1 = rotationMatrix[0].dot(vector)  // 0×1 + (-1)×0 = 0.0
let component2 = rotationMatrix[1].dot(vector)  // 1×1 + 0×0 = 1.0

let result = [component1, component2]  // [0.0, 1.0]

// Verify: this matches Quiver's built-in transform method
let quickResult = rotationMatrix.transform(vector)  // [0.0, 1.0]
```

This explicit calculation reveals what happens during matrix-vector multiplication: each row of the matrix produces one component of the output through its dot product with the input vector. Quiver's `.transform()` method performs this calculation efficiently, but understanding the underlying dot product operation builds intuition for why matrix transformations work as they do.

### Identifying transformation types

Different transformations have distinct mathematical patterns in their matrix structure. You can identify what a matrix does by examining where its non-zero values appear.

A scaling matrix has non-zero values only on the diagonal (top-left to bottom-right), with zeros everywhere else. The diagonal values are the scale factors:

```
[2  0]  Scales x by 2, y by 3
[0  3]
```

When you multiply this matrix by any vector, each component is simply multiplied by its corresponding diagonal value. The vector `[4, 5]` becomes `[8, 15]`. The direction stays the same, only the magnitude changes.

A rotation matrix has non-zero values in off-diagonal positions. The specific pattern depends on the rotation angle, following the formula `[[cos θ, -sin θ], [sin θ, cos θ]]`:

```
[0  -1]  90° counterclockwise rotation
[1   0]  (cos 90° = 0, sin 90° = 1)
```

Rotation matrices preserve the magnitude of vectors while changing their direction. If you rotate `[3, 4]` (magnitude 5), the result still has magnitude 5, just pointing in a different direction.

The identity matrix is a special case of scaling where all diagonal values equal 1:

```
[1  0]  No transformation
[0  1]  (multiplying by identity returns the original vector)
```

### Understanding basis vectors and coordinate systems

The identity matrix represents more than just "no transformation." It represents the coordinate system itself. The columns of the identity matrix are the `basis vectors` that define how we measure position and direction.

In 2D, the standard basis consists of two unit vectors:
- `i-hat`: `[1, 0]` pointing along the x-axis
- `j-hat`: `[0, 1]` pointing along the y-axis

When you write the point `[3, 4]`, you're really saying "3 steps in the `i-hat` direction, plus 4 steps in the `j-hat` direction." The identity matrix `[[1, 0], [0, 1]]` is these basis vectors arranged as columns.

Every transformation matrix actually redefines the coordinate system. The columns of any transformation matrix tell you where the basis vectors move. Consider a rotation matrix that rotates 45 degrees:

```swift
let rotate45 = [
    [0.707, -0.707],
    [0.707,  0.707]
]
```

This matrix's columns `[0.707, 0.707]` and `[-0.707, 0.707]` represent the new `i-hat` and `j-hat` after rotation. You can verify this by transforming the standard basis vectors:

```swift
import Quiver

let rotate45 = [
    [0.707, -0.707],
    [0.707,  0.707]
]

// Where does i-hat go?
let newIHat = rotate45.transform([1.0, 0.0])  // [0.707, 0.707]

// Where does j-hat go?
let newJHat = rotate45.transform([0.0, 1.0])  // [-0.707, 0.707]

// These match the matrix columns exactly!
```

This reveals a fundamental insight: matrix transformations change the coordinate system. When you transform the vector `[3, 4]`, you're not just moving a point—you're expressing that point in a new coordinate system where the axes themselves have been transformed.

This concept, called `change of basis`, appears throughout computer science. In computer graphics, different coordinate systems (object space, world space, camera space) are related by transformation matrices. In machine learning, dimensionality reduction techniques like **PCA** find new basis vectors that better represent the data's structure. In robotics, transforming between a robot's coordinate system and the world's coordinate system enables navigation and manipulation.

## Matrix operations

Beyond transforming vectors, matrices support several operations that enable complex computations and data manipulations.

### Matrix addition and subtraction

Matrix addition combines two matrices by adding corresponding elements. Both matrices must have the same dimensions:

```
[1  2]   [5  6]   [6   8]
[3  4] + [7  8] = [10  12]
```

The result is computed element-wise: `result[i][j] = A[i][j] + B[i][j]`. Matrix subtraction works identically, but with subtraction instead of addition.

This operation is useful when combining datasets or merging transformations. For example, if two sensors collect measurements in matrix form, adding their matrices combines their readings. In machine learning, gradient matrices are often added when updating model parameters.

### Matrix-matrix multiplication

Matrix multiplication is more complex than addition. When multiplying matrix A (size `m×n`) by matrix B (size `n×p`), the result is a matrix of size `m×p`. The key requirement: the number of columns in A must equal the number of rows in B.

Each element in the result comes from the dot product of a row from A and a column from B:

```
[1  2]   [5  6]   [1×5+2×7  1×6+2×8]   [19  22]
[3  4] × [7  8] = [3×5+4×7  3×6+4×8] = [43  50]
```

Matrix multiplication is not commutative: `A × B ≠ B × A` in general. Order matters because you're composing transformations. Rotating then scaling produces a different result than scaling then rotating.

Consider composition of transformations. A rotation matrix `R` followed by a scaling matrix `S` can be combined into a single matrix `S × R`. Applying this combined matrix to a vector gives the same result as applying `R` first, then `S`, but requires only one matrix multiplication instead of two.

### Transpose operation

The transpose of a matrix flips it across its diagonal, converting rows to columns and columns to rows. If matrix A is `m×n`, its transpose A^T is `n×m`:

```
[1  2  3]^T   [1  4]
[4  5  6]   = [2  5]
              [3  6]
```

Transposition is useful for reorganizing data. If rows represent samples and columns represent features, transposing gives you features as rows and samples as columns. This reorganization appears frequently in data analysis, where algorithms expect data in specific orientations.

In machine learning, transposition enables efficient computation of matrix operations. The dot product of two vectors can be expressed as matrix multiplication: `a · b = a^T × b`, treating vectors as column matrices.

## Working with matrices in Quiver

Quiver extends Swift's array syntax to support matrix operations. Since Quiver treats arrays as vectors and arrays of arrays as matrices, you can work with mathematical structures using familiar Swift syntax.

### Transformation examples

```swift
// Create and apply matrix transformations
import Quiver

// 2D rotation matrix (90° counterclockwise)
let rotation90 = [
    [0.0, -1.0],
    [1.0,  0.0]
]

// Apply the rotation transformation
let rightVector = [1.0, 0.0]  // Points right
let rotated = rotation90.transform(rightVector)  // [0.0, 1.0] - points up

// Create and apply a scaling transformation
let scaleMatrix = [
    [2.0, 0.0],
    [0.0, 2.0]
]

let point = [3.0, 4.0]
let scaled = scaleMatrix.transform(point)  // [6.0, 8.0]
```

### Data organization

Matrices naturally represent tabular data. Consider organizing game scores for multiple players:

```swift
// Organize game scores as matrix (rows = players, columns = games)
import Quiver

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

### Composing transformations

Multiple transformations can be combined into a single matrix through multiplication:

```swift
// Combine rotation and scaling into single transformation
import Quiver

let rotate45 = [
    [0.707, -0.707],
    [0.707,  0.707]
]

let scale2x = [
    [2.0, 0.0],
    [0.0, 2.0]
]

// Compose: scale then rotate
// Note: Order matters! scale2x × rotate45 ≠ rotate45 × scale2x
let combined = scale2x.multiplyMatrix(rotate45)

// Apply combined transformation
let vector = [1.0, 0.0]
let result = combined.transform(vector)  // Rotated 45° and scaled 2×
```

## Applications across algorithms

Matrices appear throughout computer science, providing both data organization and computational tools.

### Computer graphics

In graphics, matrices power transformation pipelines. 3D engines use `4×4` matrices to combine translation, rotation, scaling, and projection into single operations. Each vertex in a 3D model is a vector that gets transformed by a series of matrices: model matrix (object space → world space), view matrix (world space → camera space), and projection matrix (camera space → screen space). Combining these into a single matrix enables efficient GPU processing.

Camera matrices define viewpoint and perspective. A camera's position, orientation, and field of view are encoded in transformation matrices that convert 3D coordinates to 2D screen positions. Game engines and rendering software rely on matrix operations to display millions of triangles per frame at interactive rates.

### Machine learning

Neural networks are fundamentally matrix operations. A dataset with 1000 samples and 50 features becomes a `1000×50` matrix. Each layer in a neural network multiplies this input matrix by a weight matrix, transforming the data. The formula for a fully connected layer is `output = input × weights + bias`, where matrices represent entire batches of data flowing through the network.

Training algorithms like gradient descent compute matrices of partial derivatives. Backpropagation updates weight matrices by multiplying gradient matrices. Matrix operations enable processing thousands of examples simultaneously through vectorization, making training feasible on modern hardware.

### Graph algorithms

Adjacency matrices represent graph connections. A graph with `n` vertices becomes an `n×n` matrix where `A[i][j] = 1` if an edge exists from vertex `i` to vertex `j`, and 0 otherwise. This representation appears in [Chapter 13](13-graphs), enabling matrix-based graph algorithms.

PageRank ([Chapter 19](19-pagerank-algorithm)) uses matrix operations to compute page importance. The algorithm iteratively multiplies a vector of page ranks by a transition matrix representing link structure. This matrix formulation reveals PageRank's connection to eigenvector computation, a fundamental linear algebra concept.

### Semantic search foundation

In [Chapter 22](22-semantic-search), matrices organize word embeddings and document representations. A vocabulary of 10,000 words with 100-dimensional embeddings becomes a `10,000×100` matrix. Each row is a word vector, enabling efficient lookup and computation.

Document-term matrices track which words appear in which documents. For a collection of 500 documents and 5,000 unique words, the `500×5,000` matrix has `matrix[i][j] = frequency of word j in document i`. These matrices enable computing document similarity through matrix operations, forming the foundation of modern search and recommendation systems.

## Building algorithmic intuition

Matrices provide two essential capabilities: organizing multi-dimensional data and transforming it systematically. The row-column structure naturally represents relationships—whether sensor readings over time, feature values across samples, or transformation coefficients for geometric operations.

Matrix operations compose. Combining transformations, chaining computations, and building complex algorithms from simpler matrix operations creates powerful abstractions. This composability appears in graphics pipelines, neural networks, graph algorithms, and data analysis.

Understanding matrices completes the linear algebra foundation needed for modern algorithms. Combined with vector operations from [Chapter 20](20-vectors), you now have the mathematical tools to understand semantic search ([Chapter 22](22-semantic-search)), where vectors and matrices work together to find similar documents, power recommendation systems, and enable machine learning applications across computer science.
