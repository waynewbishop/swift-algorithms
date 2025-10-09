---
layout: chapter
title: "Chapter 19: Linear Algebra"
description: "Vector mathematics and numerical computing"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Linear Algebra

In [Chapter 17](17-dynamic-programming.md), we saw how breaking problems into smaller subproblems leads to elegant solutions. In [Chapter 18](18-pagerank-algorithm.md), we encountered PageRank's matrix operations for ranking web pages. Now we'll explore the mathematical foundation that powers these algorithms: linear algebra. While dynamic programming optimizes recursive computations and PageRank analyzes networks, linear algebra provides the mathematical language for spatial relationships, transformations, and data analysis.

Understanding vectors and matrices is essential for the algorithms we've seen and those ahead. Chapter 18 demonstrated how PageRank uses matrix operations to compute page importance across web graphs. In Chapter 20, semantic search will rely on vector mathematics to find similar documents by treating text as high-dimensional vectors. Beyond these applications, linear algebra underpins computer graphics, machine learning, physics simulations, and data analysis across modern computing.

## What are vectors?

A vector is a mathematical object that represents both magnitude and direction. Unlike a scalar value, which represents only size (like temperature or weight), a vector captures directional information alongside its size. This dual nature makes vectors ideally suited for representing anything that has both how much and which way properties.

Consider everyday examples. Wind isn't just "20 miles per hour" - it's "20 miles per hour from the northwest." That's a vector: magnitude (20 mph) and direction (northwest). When a character moves in a video game, we need both how fast they're moving and in which direction. When analyzing customer preferences across multiple product features, each preference profile can be represented as a vector in multidimensional space.

Mathematically, vectors are represented as ordered lists of numbers. A two-dimensional vector might be written as `[3, 4]`, representing movement 3 units in one direction and 4 units in another. Three-dimensional vectors add a third component `[x, y, z]`, and we can extend this to any number of dimensions.

[diagram: 2D vector `[3, 4]` shown as arrow from origin to point (3,4)]

Vectors can represent many real-world concepts. In physics simulations and game development, they represent positions in space, forces acting on objects, and velocities of moving entities. In machine learning, feature vectors capture multiple attributes of data points—a song might be represented as `[tempo, energy, danceability, loudness]`. Even RGB color values are vectors, with each component representing intensity on a scale from 0 to 1.

## Magnitude and direction

Every vector has two fundamental properties: magnitude and direction.

### Magnitude

Magnitude represents a vector's length or size - how much of something we have, independent of direction. For a velocity vector, magnitude is speed. For a force vector, magnitude is strength.

Magnitude is calculated using the Pythagorean theorem extended to any dimension. For a 2D vector `[x, y]`, magnitude equals `√(x² + y²)`. For a 3D vector `[x, y, z]`, it's `√(x² + y² + z²)`. This pattern extends to any number of dimensions.

For vector `[3, 4]`, imagine an arrow from the origin to point `(3, 4)`. This forms a right triangle's hypotenuse with sides 3 and 4. The Pythagorean theorem gives us `√(3² + 4²) = √25 = 5`.

[diagram: Right triangle showing vector `[3, 4]` as hypotenuse with legs 3 and 4]

This extends to higher dimensions. A vector `[1, 2, 3, 4]` has magnitude `√(1² + 2² + 3² + 4²) = √30 ≈ 5.48`.

### Direction and normalization

Direction is expressed as a unit vector - a vector with magnitude 1 that points in the same direction as the original. This process is called normalization.

To normalize, divide each component by the vector's magnitude. Vector `[3, 4]` with magnitude 5 becomes `[3/5, 4/5] = [0.6, 0.8]`. Verify: `√(0.6² + 0.8²) = 1`.

[diagram: Original vector `[3, 4]` and its normalized version `[0.6, 0.8]` showing same direction, different lengths]

Unit vectors separate how much from which way. A game character moving northeast `[0.7, 0.7]` at 5 units per second: normalize the direction, then multiply by speed to get the exact velocity needed.

The zero vector `[0, 0]` cannot be normalized because it has no direction - it represents no movement or no force.

## Vector operations

Linear algebra defines several operations on vectors that have geometric meaning.

### Vector addition and subtraction

Vector addition combines vectors by adding corresponding components: `[a₁, a₂] + [b₁, b₂] = [a₁ + b₁, a₂ + b₂]`. Geometrically, place vectors head-to-tail; their sum is the vector from the start of the first to the end of the second.

A boat with velocity `[3, 0]` (3 units east) in a current with velocity `[0, 2]` (2 units north) has actual velocity `[3, 0] + [0, 2] = [3, 2]`.

[diagram: Vector addition shown geometrically with two vectors placed head-to-tail]

Vector subtraction: `[a₁, a₂] - [b₁, b₂] = [a₁ - b₁, a₂ - b₂]`. This gives displacement between points. Enemy at `[130, 170]`, player at `[100, 200]`: displacement is `[100, 200] - [130, 170] = [-30, 30]`.

### Scalar multiplication

Multiplying a vector by a scalar scales magnitude without changing direction (negative scalars reverse direction): `k × [v₁, v₂] = [k × v₁, k × v₂]`.

Multiplying `[3, 4]` by 2 gives `[6, 8]` - same direction, doubled length. Multiplying by 0.5 gives `[1.5, 2]` - same direction, half length. Multiplying by -1 gives `[-3, -4]` - opposite direction.

### The dot product

The dot product takes two vectors and produces a single number. For `a = [a₁, a₂]` and `b = [b₁, b₂]`, the dot product is `a · b = a₁ × b₁ + a₂ × b₂`.

The dot product measures how much vectors agree - how much they point in the same direction. Mathematically: `a · b = |a| × |b| × cos(θ)`, where `θ` is the angle between vectors.

[diagram: Three pairs of vectors showing positive (parallel), zero (perpendicular), and negative (opposite) dot products]

The dot product reveals relationships between vectors. When the dot product equals zero, vectors are perpendicular (`cos(90°) = 0`). When the dot product is positive, vectors point in similar directions. When the dot product is negative, vectors point in opposite directions.

Applications span multiple domains. In physics, the dot product calculates work done by computing force · distance. In graphics, it determines if surfaces face light sources, controlling brightness and shadows. In machine learning, measuring similarity between feature vectors through cosine similarity enables recommendation systems to find related items. The dot product transforms geometric intuition into practical computation.

## Matrices

Matrices are rectangular arrays of numbers. A `2×3` matrix has 2 rows and 3 columns:

```
[1  2  3]
[4  5  6]
```

Matrices serve two primary purposes in computational work. First, they organize data efficiently, with rows typically representing samples and columns representing features. A dataset of 1000 customers with 5 attributes becomes a `1000×5` matrix. Second, matrices represent transformations—mathematical operations that change vectors in specific ways, such as rotations, scaling, reflections, and shearing.

### Matrix-vector multiplication

One of the most powerful applications is transforming vectors with matrices. A `2×2` rotation matrix that rotates vectors 90° counterclockwise:

```
[0  -1]
[1   0]
```

When this matrix transforms vector `[1, 0]` (pointing right), the result is `[0, 1]` (pointing up).

[diagram: Vector transformation showing rotation from right-pointing `[1,0]` to up-pointing `[0,1]`]

For a matrix to transform a vector, the matrix width must match the vector length.

Common transformations demonstrate matrices' power. Rotation matrices change direction while preserving magnitude. Scaling matrices change magnitude along specific axes. Reflection matrices mirror vectors across an axis. Shear matrices shift components proportionally, creating skewed transformations. Each transformation has practical applications in graphics, physics, and data manipulation.

## Statistics and data analysis

Linear algebra extends beyond geometry into statistical analysis. Understanding distributions, central tendencies, and variations in data requires mathematical operations on vectors and matrices.

Measures of central tendency describe where data clusters. The mean (average) provides the central value, calculated by summing all elements and dividing by count. The median identifies the middle value when data is sorted, being less sensitive to outliers than the mean.

Measures of spread quantify data variability. Standard deviation measures how far values typically deviate from the mean. Variance, the square of standard deviation, provides a mathematically convenient form for many calculations. Range simply captures the difference between maximum and minimum values.

These statistical operations treat data as vectors, applying mathematical transformations to extract insights. A vector of test scores `[85, 92, 78, 88, 95, 82, 90]` can be analyzed for mean performance, consistency through standard deviation, and outliers through range analysis. This mathematical approach to data forms the foundation for more advanced techniques in machine learning and data science.

## Introducing Quiver

With mathematical foundations established, we need practical tools for working with vectors and matrices in Swift. Quiver is a lightweight Swift package that provides vector mathematics, numerical computing, and statistical operations.

### Why Quiver?

Quiver provides Swift-native vector mathematics and numerical computing by extending the standard Array type rather than creating custom containers. This design eliminates conversion overhead—arrays are vectors without boxing or unboxing. Operations integrate seamlessly with Swift's standard library, maintaining familiar syntax while adding mathematical capabilities. Generic constraints ensure type safety, with operations like division available only for floating-point types. The implementation prioritizes readability, making it easy to translate mathematical formulas directly to code.

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

## Vector arithmetic

Quiver provides natural operators for vector operations.

```swift
// Combine vectors using standard arithmetic operators
import Quiver

// Vector addition (combine forces)
let force1 = [3.0, 4.0]
let force2 = [1.0, 2.0]
let totalForce = force1 + force2  // [4.0, 6.0]

// Vector subtraction (find displacement)
let playerPos = [100.0, 200.0]
let enemyPos = [130.0, 170.0]
let displacement = playerPos - enemyPos  // [-30.0, 30.0]

// Scalar multiplication
let velocity = [5.0, 3.0]
let doubled = velocity * 2.0      // [10.0, 6.0]
let halved = velocity * 0.5       // [2.5, 1.5]
let opposite = velocity * -1.0    // [-5.0, -3.0]
```

## Broadcasting and array operations

Broadcasting applies a scalar operation to every element in an array, eliminating explicit loops.

```swift
// Apply scalar operations to all vector elements
import Quiver

let vector = [1.0, 2.0, 3.0, 4.0]

// Add a scalar to each element
let increased = vector.broadcast(adding: 5.0)  // [6.0, 7.0, 8.0, 9.0]

// Multiply each element by a scalar
let scaled = vector.broadcast(multiplyingBy: 2.0)  // [2.0, 4.0, 6.0, 8.0]

// Subtract a scalar from each element
let decreased = vector.broadcast(subtracting: 1.0)  // [0.0, 1.0, 2.0, 3.0]

// Divide each element by a scalar
let divided = vector.broadcast(dividingBy: 2.0)  // [0.5, 1.0, 1.5, 2.0]
```

Data normalization is essential for machine learning:

```swift
// Normalize data to standard range for machine learning preprocessing
import Quiver

// Normalize age data to [0, 1] range
let ages = [25.0, 32.0, 47.0, 19.0, 56.0, 38.0]

let minAge = ages.min()!  // 19.0
let maxAge = ages.max()!  // 56.0

let shifted = ages.broadcast(subtracting: minAge)
let normalized = shifted.broadcast(dividingBy: maxAge - minAge)
// [0.16, 0.35, 0.76, 0.0, 1.0, 0.51]
```

## Statistical functions

Beyond vector mathematics, Quiver provides statistical functions for data analysis.

```swift
// Analyze data distributions using statistical measures
import Quiver

let scores = [85.0, 92.0, 78.0, 88.0, 95.0, 82.0, 90.0]

// Measures of central tendency
print(scores.mean()!)     // 87.14
print(scores.median()!)   // 88.0

// Measures of spread
print(scores.std()!)      // 5.85 (standard deviation)
print(scores.variance()!) // 34.27

// Range
print(scores.min()!)      // 78.0
print(scores.max()!)      // 95.0
```

Performance analysis demonstrates practical statistical application:

```swift
// Monitor system performance using statistical analysis
import Quiver

let responseTimes = [120.0, 145.0, 132.0, 118.0, 150.0, 125.0]

let avgTime = responseTimes.mean()!     // 131.67ms
let stdDev = responseTimes.std()!       // 12.41ms

if avgTime < 150.0 {
    print("✓ Average response time acceptable")
}

if stdDev > 20.0 {
    print("⚠️ High variability - investigate outliers")
}
```

## Array generation

Quiver provides utilities for creating arrays for scientific computing.

```swift
// Generate arrays for numerical computing and testing
import Quiver

// Arrays of zeros and ones
let zeros = [Double].zeros(count: 5)  // [0.0, 0.0, 0.0, 0.0, 0.0]
let ones = [Double].ones(count: 3)    // [1.0, 1.0, 1.0]

// Linearly spaced values
let range = [Double].linspace(0, 10, 5)  // [0.0, 2.5, 5.0, 7.5, 10.0]

// Random values
let random = [Double].random(count: 100, in: 0...1)

// Generating test data for plotting
let xValues = [Double].linspace(0, 2 * .pi, 100)
let yValues = xValues.map { sin($0) }
```

## Working with matrices

Matrices are represented as arrays of arrays in Quiver.

```swift
// Create and manipulate matrices for transformations and data organization
import Quiver

// A `2×3` matrix (2 rows, 3 columns)
let matrix = [
    [1.0, 2.0, 3.0],
    [4.0, 5.0, 6.0]
]

// Create identity matrix
let identity = [Double].identity(3)
// [[1.0, 0.0, 0.0],
//  [0.0, 1.0, 0.0],
//  [0.0, 0.0, 1.0]]
```

### Matrix transformations

```swift
// Transform vectors using matrix operations
import Quiver

// 2D rotation matrix (90° counterclockwise)
let rotation90 = [
    [0.0, -1.0],
    [1.0,  0.0]
]

let rightVector = [1.0, 0.0]  // Points right
let rotated = rotation90.transform(rightVector)  // [0.0, 1.0] - points up!

// Scaling transformation
let scaleMatrix = [
    [2.0, 0.0],
    [0.0, 2.0]
]

let point = [3.0, 4.0]
let scaled = scaleMatrix.transform(point)  // [6.0, 8.0]
```

## Practical applications by domain

### Game development

Game AI enemy movement demonstrates vector mathematics in action:

```swift
// Calculate enemy movement direction and velocity toward player
import Quiver

// Enemy moves toward player at fixed speed
let enemyPos = [10.0, 20.0]
let playerPos = [40.0, 60.0]

let toPlayer = playerPos - enemyPos  // [30.0, 40.0]
let direction = toPlayer.normalized   // [0.6, 0.8]
let enemySpeed = 3.0

let enemyVelocity = direction * enemySpeed  // [1.8, 2.4]
```

Field of view calculations determine if enemies can see the player:

```swift
// Determine if player is within enemy's field of view
import Quiver

let enemyForward = [1.0, 0.0]  // Enemy faces right
let toPlayer = [5.0, 2.0]       // Direction to player

let alignment = enemyForward.normalized.dot(toPlayer.normalized)

if alignment > 0 {
    print("Player is in front")  // alignment = 0.93
} else {
    print("Player is behind")
}
```

Physics simulations rely on vector operations for realistic movement:

```swift
// Simulate ball physics with gravity and velocity
import Quiver

struct Ball {
    var position: [Double]
    var velocity: [Double]

    mutating func update(deltaTime: Double) {
        position = position + (velocity * deltaTime)
    }

    mutating func applyForce(_ force: [Double], deltaTime: Double) {
        velocity = velocity + (force * deltaTime)
    }
}

var ball = Ball(position: [0.0, 100.0], velocity: [20.0, 0.0])
let gravity = [0.0, -9.8]

for _ in 0..<10 {
    ball.applyForce(gravity, deltaTime: 0.1)
    ball.update(deltaTime: 0.1)
}
```

Distance calculations enable range checking and collision detection:

```swift
// Check if game objects are within interaction range
import Quiver

let playerPos = [42.5, 67.3]
let targetPos = [56.2, 89.7]

let displacement = targetPos - playerPos  // [13.7, 22.4]
let distance = displacement.magnitude     // 26.24

if distance < 30.0 {
    print("Target within interaction range!")
}
```

### Machine learning

Cosine similarity measures how similar feature vectors are, powering recommendation systems:

```swift
// Calculate similarity between feature vectors for recommendations
import Quiver

// Feature vectors for two songs
let song1 = [140.0, 0.9, 0.7, 0.8]  // [tempo, energy, danceability, loudness]
let song2 = [120.0, 0.8, 0.9, 0.7]

// Normalize then dot product = cosine similarity
let similarity = song1.normalized.dot(song2.normalized)  // 0.98 (very similar)
```

This cosine similarity technique is fundamental to recommendation systems, search engines, and machine learning. It appears again in Chapter 20, where semantic search uses vector similarity to find related documents.

### Graphics and visualization

Color manipulation treats RGB values as vectors:

```swift
// Manipulate colors using vector operations
import Quiver

// RGB color as a vector
let color = [0.8, 0.5, 0.2]  // Amber

// Brightness adjustment
let brighter = color.broadcast(multiplyingBy: 1.2)  // [0.96, 0.6, 0.24]

// Blend two colors
let red = [1.0, 0.0, 0.0]
let blue = [0.0, 0.0, 1.0]
let purple = (red * 0.5) + (blue * 0.5)  // [0.5, 0.0, 0.5]
```

### Physics calculations

Work calculation demonstrates dot product application:

```swift
// Calculate work done by force over distance
import Quiver

// Work = Force · Distance
let force = [5.0, 3.0, 2.0]
let distance = [10.0, 0.0, 0.0]

let work = force.dot(distance)  // 50.0
```

## When to use linear algebra

Linear algebra excels with spatial, directional, or multidimensional data. Game development benefits from vectors representing positions, velocities, and forces. Computer graphics relies on transformations, lighting calculations, and camera positioning. Physics simulations model kinematics, dynamics, and particle systems. Machine learning treats data as feature vectors, enabling similarity measures and dimensionality reduction. Data analysis uses statistical operations for normalization, trend detection, and pattern recognition.

Linear algebra is not needed for string processing, file I/O operations, simple business logic, or database queries. The key question: Does your data represent positions, directions, measurements, or relationships in space? If so, linear algebra provides the mathematical foundation.

## Building algorithmic intuition

Linear algebra connects to concepts throughout this book. In Chapter 3, we learned how arrays store sequential data—vectors extend arrays with mathematical operations like dot products and normalization. Chapter 7 introduced generics, and Quiver uses generic constraints to ensure type safety for mathematical operations, allowing division only on floating-point types. Chapter 8 taught us about Big O notation—vector operations run in `O(n)` time where n is dimensionality, while matrix multiplication is `O(n³)`.

The connections extend to advanced topics. Chapter 13 covered graphs, where adjacency matrices represent graph connections and eigenvectors reveal network structure. Chapter 18 explored PageRank, which uses matrix operations to compute page importance scores across the entire web graph through iterative linear algebra. Chapter 20 covers semantic search, where cosine similarity between document vectors enables intelligent text matching beyond keyword search.

The key insight: Linear algebra provides a mathematical language for spatial relationships, transformations, and similarity measures that power everything from game physics to modern AI systems. Understanding vectors and matrices isn't just about mathematical abstraction—it's about having the right tool for modeling spatial and relational data.

## Summary

Linear algebra provides the mathematical foundation for representing and manipulating spatial data, whether in two dimensions, three dimensions, or the high-dimensional spaces used in machine learning. At its core, linear algebra gives us vectors—mathematical objects that combine magnitude and direction—and matrices, which organize data and represent transformations.

Understanding magnitude and normalization separates how much from which way, enabling precise control over velocities, forces, and directions in games and simulations. The dot product measures alignment between vectors, powering everything from physics calculations to recommendation systems through cosine similarity. Matrices extend these concepts to transformations like rotations and scaling, as well as organizing multidimensional data.

The Quiver framework brings these mathematical concepts to Swift with zero conversion overhead. By extending native arrays rather than introducing custom types, Quiver integrates seamlessly into Swift codebases while providing comprehensive vector mathematics, statistical operations, and linear algebra capabilities. Broadcasting eliminates loops for element-wise operations, while built-in functions like magnitude, normalized, and dot() make mathematical formulas translate directly to code.

The practical applications span game development (physics, AI behaviors), computer graphics (transformations, lighting), machine learning (feature vectors, similarity measures), and data analysis (normalization, statistics). These same vector operations form the foundation for PageRank's matrix computations in Chapter 18 and semantic search's document similarity in Chapter 20.

Linear algebra isn't just abstract mathematics—it's the practical tool that makes spatial computing, intelligent systems, and data-driven applications possible. Start with small examples, build intuition through practice, and recognize when your data represents positions, directions, or relationships in space.

