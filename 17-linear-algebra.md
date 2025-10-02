---
layout: chapter
title: "Chapter 17: Linear Algebra"
description: "Vector mathematics and numerical computing"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Linear Algebra

Linear algebra forms the mathematical foundation for many fields including computer graphics, machine learning, data analysis, and physics simulations. At its core, linear algebra deals with vectors, matrices, and the operations we can perform on them. In this chapter, we'll explore these fundamental concepts and demonstrate how to apply them in Swift using Quiver.

## What are vectors?

A vector is a mathematical object that represents both magnitude and direction. Unlike a scalar value, which represents only size (like temperature or weight), a vector captures directional information alongside its size. This dual nature makes vectors ideally suited for representing anything that has both "how much" and "which way" properties.

Consider everyday examples. Wind isn't just "20 miles per hour" - it's "20 miles per hour from the northwest." That's a vector: magnitude (20 mph) and direction (northwest). When a character moves in a video game, we need both how fast they're moving and in which direction. When analyzing customer preferences across multiple product features, each preference profile can be represented as a vector in multidimensional space.

Mathematically, vectors are represented as ordered lists of numbers. A two-dimensional vector might be written as [3, 4], representing movement 3 units in one direction and 4 units in another. Three-dimensional vectors add a third component [x, y, z], and we can extend this to any number of dimensions.

[diagram: 2D vector [3, 4] shown as arrow from origin to point (3,4)]

Vectors can represent many real-world concepts:
- Positions in space
- Forces or velocities in physics
- Features in machine learning
- RGB color values

## Magnitude and direction

Every vector has two fundamental properties: magnitude and direction.

### Magnitude

Magnitude represents a vector's length or size - how "much" of something we have, independent of direction. For a velocity vector, magnitude is speed. For a force vector, magnitude is strength.

Magnitude is calculated using the Pythagorean theorem extended to any dimension:
- 2D vector [x, y]: magnitude = √(x² + y²)
- 3D vector [x, y, z]: magnitude = √(x² + y² + z²)

For vector [3, 4], imagine an arrow from the origin to point (3, 4). This forms a right triangle's hypotenuse with sides 3 and 4. The Pythagorean theorem gives us √(3² + 4²) = √25 = 5.

[diagram: Right triangle showing vector [3, 4] as hypotenuse with legs 3 and 4]

This extends to higher dimensions. A vector [1, 2, 3, 4] has magnitude √(1² + 2² + 3² + 4²) = √30 ≈ 5.48.

### Direction and normalization

Direction is expressed as a unit vector - a vector with magnitude 1 that points in the same direction as the original. This process is called normalization.

To normalize, divide each component by the vector's magnitude. Vector [3, 4] with magnitude 5 becomes [3/5, 4/5] = [0.6, 0.8]. Verify: √(0.6² + 0.8²) = 1.

[diagram: Original vector [3, 4] and its normalized version [0.6, 0.8] showing same direction, different lengths]

Unit vectors separate "how much" from "which way." A game character moving northeast [0.7, 0.7] at 5 units per second: normalize the direction, then multiply by speed to get the exact velocity needed.

The zero vector [0, 0] cannot be normalized because it has no direction - it represents "no movement" or "no force."

## Vector operations

Linear algebra defines several operations on vectors that have geometric meaning.

### Vector addition and subtraction

Vector addition combines vectors by adding corresponding components. [a₁, a₂] + [b₁, b₂] = [a₁ + b₁, a₂ + b₂]. Geometrically, place vectors head-to-tail; their sum is the vector from the start of the first to the end of the second.

A boat with velocity [3, 0] (3 units east) in a current with velocity [0, 2] (2 units north) has actual velocity [3, 0] + [0, 2] = [3, 2].

[diagram: Vector addition shown geometrically with two vectors placed head-to-tail]

Vector subtraction: [a₁, a₂] - [b₁, b₂] = [a₁ - b₁, a₂ - b₂]. This gives displacement between points. Enemy at [130, 170], player at [100, 200]: displacement is [100, 200] - [130, 170] = [-30, 30].

### Scalar multiplication

Multiplying a vector by a scalar scales magnitude without changing direction (negative scalars reverse direction). k × [v₁, v₂] = [k × v₁, k × v₂].

Multiplying [3, 4] by 2 gives [6, 8] - same direction, doubled length. Multiplying by 0.5 gives [1.5, 2] - same direction, half length. Multiplying by -1 gives [-3, -4] - opposite direction.

### The dot product

The dot product takes two vectors and produces a single number. For a = [a₁, a₂] and b = [b₁, b₂], the dot product is a · b = a₁ × b₁ + a₂ × b₂.

The dot product measures how much vectors "agree" - how much they point in the same direction. Mathematically: a · b = |a| × |b| × cos(θ), where θ is the angle between vectors.

[diagram: Three pairs of vectors showing positive (parallel), zero (perpendicular), and negative (opposite) dot products]

The dot product reveals relationships:
- Dot product = 0: vectors are perpendicular (cos(90°) = 0)
- Dot product > 0: vectors point in similar directions
- Dot product < 0: vectors point in opposite directions

Applications include:
- Physics: calculating work done (force · distance)
- Graphics: determining if surfaces face light sources
- Machine learning: measuring similarity between feature vectors (cosine similarity)

## Matrices

Matrices are rectangular arrays of numbers. A 2×3 matrix has 2 rows and 3 columns:

```
[1  2  3]
[4  5  6]
```

Matrices serve two primary purposes:
1. Organizing data (rows as samples, columns as features)
2. Representing transformations (rotations, scaling, reflections)

### Matrix-vector multiplication

One of the most powerful applications is transforming vectors with matrices. A 2×2 rotation matrix that rotates vectors 90° counterclockwise:

```
[0  -1]
[1   0]
```

When this matrix transforms vector [1, 0] (pointing right), the result is [0, 1] (pointing up).

[diagram: Vector transformation showing rotation from right-pointing [1,0] to up-pointing [0,1]]

For a matrix to transform a vector, the matrix width must match the vector length.

Common transformations include:
- Rotation (changes direction)
- Scaling (changes magnitude)
- Reflection (mirrors across an axis)
- Shear (shifts proportionally)

## Introducing Quiver

With mathematical foundations established, we need practical tools for working with vectors and matrices in Swift. Quiver is a lightweight Swift package that provides vector mathematics, numerical computing, and statistical operations.

### Why Quiver?

As Swift expands beyond app development into machine learning, data analysis, and scientific computing, robust mathematical tools become essential. Quiver provides a Swift-first approach to numerical computing.

Unlike libraries ported from other languages, Quiver was designed from the ground up for Swift. It extends the standard `Array` type rather than creating custom container types.

This design offers several advantages:

**No conversion overhead**: Work directly with Swift arrays without converting between specialized types. Arrays are vectors - there's no boxing or unboxing.

**Seamless integration**: Quiver operations integrate into existing codebases. You can chain native Swift operations with Quiver's mathematical capabilities:

```swift
// Combine Swift's filter with Quiver's vector operations
let filtered = someArray.filter { $0 > 0 }.normalized
```

**Familiar syntax**: By extending the native Array type, Quiver maintains Swift's syntax and behavior with full standard library access.

**Type safety**: Quiver embraces Swift's type system with generic constraints and compile-time guarantees. Division operations, for example, are only available for floating-point arrays.

**Educational focus**: The code is readable and maps closely to mathematical concepts, making it easy to translate formulas into code.

While Quiver takes inspiration from NumPy's powerful API - adopting concepts like broadcasting, element-wise operations, and statistical functions - it remains true to Swift's syntax and type system.

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
import Quiver

// 2D position vector
let position = [3.0, 4.0]
print(position.magnitude)  // 5.0

// 3D velocity vector
let velocity = [1.0, 2.0, 3.0]
print(velocity.magnitude)  // √14 ≈ 3.74

// Feature vector (any dimension)
let features = [0.5, 0.3, 0.8, 0.2]
print(features.magnitude)  // 1.02
```

### Normalization

```swift
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

**When to normalize**:

```swift
import Quiver

// Game AI: enemy moves toward player at fixed speed
let enemyPos = [10.0, 20.0]
let playerPos = [40.0, 60.0]

let toPlayer = playerPos - enemyPos  // [30.0, 40.0]
let direction = toPlayer.normalized   // [0.6, 0.8]
let enemySpeed = 3.0

let enemyVelocity = direction * enemySpeed  // [1.8, 2.4]
```

Important: Handle zero vectors properly:

```swift
let zeroVector = [0.0, 0.0]

if zeroVector.magnitude > 0 {
    let normalized = zeroVector.normalized
} else {
    print("Cannot normalize zero vector")
}
```

### Dot product

```swift
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
let result = a.dot(b)  // (3×1) + (4×2) = 11
```

**Physics: Calculate work done**

```swift
import Quiver

// Work = Force · Distance
let force = [5.0, 3.0, 2.0]
let distance = [10.0, 0.0, 0.0]

let work = force.dot(distance)  // 50.0
```

**Game AI: Is player in front of enemy?**

```swift
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

**Machine learning: Cosine similarity**

```swift
import Quiver

// Feature vectors for two songs
let song1 = [140.0, 0.9, 0.7, 0.8]  // [tempo, energy, danceability, loudness]
let song2 = [120.0, 0.8, 0.9, 0.7]

// Normalize then dot product = cosine similarity
let similarity = song1.normalized.dot(song2.normalized)  // 0.98 (very similar)
```

This cosine similarity technique is fundamental to recommendation systems, search engines, and machine learning.

## Vector arithmetic

Quiver provides natural operators for vector operations.

```swift
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

## Broadcasting

Broadcasting applies a scalar operation to every element in an array, eliminating explicit loops.

```swift
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

**Data normalization** is essential for machine learning:

```swift
import Quiver

// Normalize age data to [0, 1] range
let ages = [25.0, 32.0, 47.0, 19.0, 56.0, 38.0]

let minAge = ages.min()!  // 19.0
let maxAge = ages.max()!  // 56.0

let shifted = ages.broadcast(subtracting: minAge)
let normalized = shifted.broadcast(dividingBy: maxAge - minAge)
// [0.16, 0.35, 0.76, 0.0, 1.0, 0.51]
```

## Statistics

Beyond vector mathematics, Quiver provides statistical functions for data analysis.

```swift
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

**Performance analysis**:

```swift
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
import Quiver

// A 2×3 matrix (2 rows, 3 columns)
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

## Practical examples

### Physics simulation

```swift
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

### Color manipulation

```swift
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

### Distance calculations

```swift
import Quiver

// Game: Check if target is within range
let playerPos = [42.5, 67.3]
let targetPos = [56.2, 89.7]

let displacement = targetPos - playerPos  // [13.7, 22.4]
let distance = displacement.magnitude     // 26.24

if distance < 30.0 {
    print("Target within interaction range!")
}
```

## When to use linear algebra

Linear algebra excels with spatial, directional, or multidimensional data.

**Ideal use cases:**
- Game development (positions, velocities, forces)
- Computer graphics (transformations, lighting)
- Physics simulations (kinematics, dynamics)
- Machine learning (feature vectors, similarity measures)
- Data analysis (statistics, normalization)

**Not needed for:**
- String processing
- File I/O operations
- Simple business logic
- Database queries

**Key question:** Does your data represent positions, directions, measurements, or relationships in space?

## Building algorithmic intuition

Linear algebra connects to concepts throughout this book:

- **Arrays (Chapter 3)** - Vectors extend arrays with mathematical operations
- **Big O Notation (Chapter 2)** - Vector operations are O(n) in dimensionality
- **Generics (Chapter 7)** - Quiver uses generic constraints for type safety

The key insight: Linear algebra provides a mathematical language for spatial relationships in games, graphics, data analysis, and machine learning.

## Summary

Linear algebra forms the foundation for spatial computing and scientific programming.

**Core concepts:**
- Vectors represent magnitude and direction
- Magnitude measures size; normalization isolates direction
- Dot product measures alignment and similarity
- Matrices organize data and represent transformations
- Broadcasting applies operations across arrays

**Quiver capabilities:**
- Extends native Swift arrays
- Zero conversion overhead
- Comprehensive: vectors, statistics, linear algebra
- Production-ready with type safety

**Practical applications:**
- Game physics and AI behaviors
- Similarity measurement for recommendations
- Data normalization for machine learning
- Statistical analysis

The best way to learn is by applying these concepts in real projects. Start small and build intuition through practice.


---

<div class="chapter-nav">
  <a href="16-advanced-complexity-analysis" class="prev">Previous Chapter</a>
  <a href="index">Table of Contents</a>
  <a href="18-pagerank-algorithm" class="next">Next Chapter</a>
</div>
