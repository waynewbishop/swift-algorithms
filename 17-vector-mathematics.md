---
layout: chapter
title: "Chapter 17: Vector Mathematics"
description: "Linear algebra fundamentals for Swift"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Vector Mathematics

Linear algebra forms the mathematical foundation for many fields including computer graphics, machine learning, data analysis, and physics simulations. This chapter introduces key concepts through practical Swift code examples using Quiver.

You don't need advanced mathematical knowledge to get started. If you can work with Swift arrays, you can begin applying linear algebra concepts in your code.

## Introducing Quiver

Quiver is a lightweight Swift package that provides vector mathematics, numerical computing, and statistical operations. As Swift continues to expand beyond app development into domains like server-side computing, machine learning, and data analysis, the need for robust mathematical tools becomes increasingly important.

### Why Quiver?

Quiver expands the Swift ecosystem with a native, Swift-first approach to numerical computing. Unlike libraries ported from other languages, Quiver was designed from the ground up for Swift, extending the standard `Array` type rather than creating custom container types.

This design offers several key advantages:

**No conversion overhead**: Work directly with Swift arrays without converting between specialized data types. Arrays are vectors - there's no boxing or unboxing of values.

**Seamless integration**: Quiver operations integrate into existing codebases that already use Swift arrays. You can chain native Swift operations with Quiver's mathematical capabilities:

```swift
// Combine Swift's filter with Quiver's vector operations
let filtered = someArray.filter { $0 > 0 }.normalized
```

**Familiar syntax**: By extending the native Array type, Quiver maintains the syntax and behavior Swift developers already know, with full access to the standard library.

**Educational focus**: The code is written to be readable and understandable. Operations closely match mathematical concepts, making it easy to translate formulas into code.

**Type safety**: Quiver embraces Swift's strong type system with generic constraints, protocol-based design, and compile-time guarantees. Division operations, for example, are only available for floating-point arrays.

While Quiver takes inspiration from NumPy's powerful API - adopting similar concepts like broadcasting, element-wise operations, and statistical functions - it remains true to Swift's syntax and type system. This helps bridge the gap for developers moving between Python and Swift for numerical computing tasks.

### Installing Quiver

Add Quiver to your project via Swift Package Manager:

```
https://github.com/waynewbishop/bishop-algorithms-quiver-package
```

In Xcode: **File → Add Package Dependencies** → paste the URL above.

## Vectors: More than just arrays

In programming, we often use arrays to store collections of values. In linear algebra, these become vectors which represent quantities with both magnitude (size) and direction.

```swift
import Quiver

// A 2D vector representing a point or direction
let v = [3.0, 4.0]

// Find the magnitude (length) of the vector
let magnitude = v.magnitude  // 5.0

// Create a unit vector (same direction, length of 1)
let unitVector = v.normalized  // [0.6, 0.8]
```

[diagram: 2D vector [3, 4] shown as arrow from origin to point (3,4) with magnitude 5]

The Pythagorean theorem is used to calculate vector magnitude: √(3² + 4²) = 5.

Vectors can represent many real-world concepts:
- Positions in space
- Forces or velocities in physics
- Features in machine learning
- RGB color values

## Understanding magnitude

Magnitude represents a vector's length, independent of direction. For a velocity vector, magnitude is speed. For a force vector, magnitude is strength.

```swift
import Quiver

// 2D position vector
let position = [3.0, 4.0]
print(position.magnitude)  // 5.0

// 3D velocity vector
let velocity = [1.0, 2.0, 3.0]
print(velocity.magnitude)  // √(1² + 2² + 3²) = 3.74

// Feature vector (any dimension)
let features = [0.5, 0.3, 0.8, 0.2]
print(features.magnitude)  // 1.02
```

[diagram: Right triangle showing vector [3, 4] as hypotenuse with legs 3 and 4]

## Normalization: Isolating direction

Normalization creates a unit vector (magnitude of 1) that points in the same direction as the original. This separates "how much" from "which way."

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

[diagram: Original vector [3, 4] and its normalized version [0.6, 0.8] showing same direction, different lengths]

### When to normalize

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

Important: The zero vector [0, 0] cannot be normalized because it has no direction.

```swift
let zeroVector = [0.0, 0.0]

if zeroVector.magnitude > 0 {
    let normalized = zeroVector.normalized
} else {
    print("Cannot normalize zero vector")
}
```

## Dot product: Measuring alignment

The dot product measures how parallel two vectors are. It produces a single number from two vectors.

```swift
import Quiver

let v1 = [1.0, 0.0]  // Points right
let v2 = [0.0, 1.0]  // Points up

// Perpendicular vectors have dot product of zero
v1.dot(v2)  // 0.0

// Parallel vectors
let v3 = [2.0, 0.0]  // Also points right
v1.dot(v3)  // 2.0
```

[diagram: Three pairs of vectors showing positive (parallel), zero (perpendicular), and negative (opposite) dot products]

The dot product reveals relationships:
- Dot product = 0: vectors are perpendicular
- Dot product > 0: vectors point in similar directions
- Dot product < 0: vectors point in opposite directions

### Calculating the dot product

```swift
import Quiver

let a = [3.0, 4.0]
let b = [1.0, 2.0]

// Multiply corresponding components and sum
let result = a.dot(b)  // (3×1) + (4×2) = 3 + 8 = 11
```

### Practical applications

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

This technique is fundamental to recommendation systems, search engines, and machine learning.

## Vector arithmetic

Quiver provides natural operators for vector operations.

### Addition and subtraction

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
```

[diagram: Vector addition shown geometrically with two vectors placed head-to-tail]

### Scalar multiplication

```swift
import Quiver

let velocity = [5.0, 3.0]

// Scale up
let doubled = velocity * 2.0  // [10.0, 6.0]

// Scale down
let halved = velocity * 0.5  // [2.5, 1.5]

// Reverse direction
let opposite = velocity * -1.0  // [-5.0, -3.0]
```

## Broadcasting: Scalar operations

Broadcasting applies a scalar operation to every element in an array.

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

### Data normalization

Broadcasting is essential for preparing data for machine learning.

```swift
import Quiver

// Normalize age data to [0, 1] range
let ages = [25.0, 32.0, 47.0, 19.0, 56.0, 38.0]

let minAge = ages.min()!  // 19.0
let maxAge = ages.max()!  // 56.0

let shifted = ages.broadcast(subtracting: minAge)  // Shift to start at 0
let normalized = shifted.broadcast(dividingBy: maxAge - minAge)
// [0.16, 0.35, 0.76, 0.0, 1.0, 0.51]
```

### Feature scaling

```swift
import Quiver

// Apply weights to feature vector
let features = [0.8, 0.6, 0.4, 0.9]
let weights = [1.5, 2.0, 0.5, 3.0]

// Element-wise multiplication using custom broadcast
let weightedFeatures = zip(features, weights).map { $0 * $1 }
// [1.2, 1.2, 0.2, 2.7]
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

### Performance analysis

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
```

### Generating test data

```swift
import Quiver

// Create evenly spaced x values for plotting
let xValues = [Double].linspace(0, 2 * .pi, 100)

// Calculate corresponding y values
let yValues = xValues.map { sin($0) }

// Use with Swift Charts for visualization
```

## Matrices: Organizing data and transformations

Matrices are rectangular arrays of numbers. In Quiver, we represent them as arrays of arrays.

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

Matrices serve two primary purposes:
1. Organizing data (rows as samples, columns as features)
2. Representing transformations (rotations, scaling, etc.)

## Matrix transformations

One of the most powerful applications of matrices is transforming vectors.

```swift
import Quiver

// 2D rotation matrix (90° counterclockwise)
let rotation90 = [
    [0.0, -1.0],
    [1.0,  0.0]
]

let rightVector = [1.0, 0.0]  // Points right
let rotated = rotation90.transform(rightVector)  // [0.0, 1.0] - points up!
```

[diagram: Vector transformation showing rotation from right-pointing [1,0] to up-pointing [0,1]]

### Scaling transformation

```swift
import Quiver

// Scale matrix (doubles x and y)
let scaleMatrix = [
    [2.0, 0.0],
    [0.0, 2.0]
]

let point = [3.0, 4.0]
let scaled = scaleMatrix.transform(point)  // [6.0, 8.0]
```

For a matrix to transform a vector, the matrix width must match the vector length.

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
let darker = color.broadcast(multiplyingBy: 0.8)    // [0.64, 0.4, 0.16]

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

## When to use vectors

Vector mathematics excels with spatial, directional, or multidimensional data.

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

Vector mathematics connects to concepts throughout this book:

- **Arrays (Chapter 3)** - Vectors extend arrays with mathematical operations
- **Big O Notation (Chapter 2)** - Vector operations are O(n) in dimensionality
- **Generics (Chapter 7)** - Quiver uses generic constraints for type safety

The key insight: Vector mathematics provides a language for spatial relationships in games, graphics, data analysis, and machine learning.

## Summary

Linear algebra forms the foundation for spatial computing and scientific programming.

**Core concepts:**
- Vectors represent magnitude and direction
- Normalization isolates direction (unit vectors)
- Dot product measures alignment and similarity
- Broadcasting applies operations across arrays
- Matrices organize data and represent transformations

**Quiver capabilities:**
- Extends native Swift arrays
- Zero conversion overhead
- Comprehensive: vectors, statistics, linear algebra
- Production-ready with proper edge case handling

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
