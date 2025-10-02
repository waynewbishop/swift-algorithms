---
layout: chapter
title: "Chapter 17: Vector Mathematics"
description: "Linear algebra fundamentals for Swift"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Vector Mathematics

Vector mathematics forms the mathematical foundation for countless computing applications, from game physics and computer graphics to machine learning and data analysis. In this chapter, we'll explore vector fundamentals and demonstrate how to apply these powerful mathematical tools in Swift programming.

## What are vectors?

A vector is a mathematical object that represents both magnitude and direction. Unlike a scalar value, which represents only size (like temperature or weight), a vector captures directional information alongside its size.

Consider everyday examples. Wind isn't just "20 miles per hour" - it's "20 miles per hour from the northwest." That's a vector: magnitude (20 mph) and direction (northwest). When a character moves in a video game, we need both speed and direction of movement.

Mathematically, vectors are represented as ordered lists of numbers. A two-dimensional vector [3, 4] represents movement 3 units in one direction and 4 units in another. Three-dimensional vectors add a third component [x, y, z], extending to any number of dimensions needed.

[diagram: 2D vector [3, 4] shown as arrow on coordinate grid, with components illustrated]

## Vectors vs arrays

Arrays are containers for data. The numbers [68, 72, 71] representing daily temperatures are just measurements with no inherent relationship. A vector represents a point or direction in space. The numbers [3, 4] have geometric properties like length and angle.

Adding temperature arrays [68, 72] + [70, 74] produces [138, 146], which has no practical meaning. Adding velocity vectors [3, 4] + [1, 2] produces [4, 6], representing the combined effect of two movements - a geometrically meaningful operation.

The key insight: arrays are general-purpose containers, while vectors are specialized mathematical objects with geometric interpretation.

## Vector magnitude

Magnitude represents a vector's length or size - how "much" of something we have, independent of direction. For velocity, magnitude is speed. For force, magnitude is strength.

Magnitude is calculated using the Pythagorean theorem extended to any dimension:
- 2D vector [x, y]: magnitude = √(x² + y²)
- 3D vector [x, y, z]: magnitude = √(x² + y² + z²)

For vector [3, 4], imagine an arrow from the origin to point (3, 4). This forms a right triangle's hypotenuse with sides 3 and 4. The Pythagorean theorem gives us √(3² + 4²) = √25 = 5.

[diagram: Right triangle showing vector [3, 4] as hypotenuse, with legs 3 and 4, illustrating Pythagorean theorem]

This extends to higher dimensions. A vector [1, 2, 3, 4] has magnitude √(1² + 2² + 3² + 4²) = √30 ≈ 5.48.

## Unit vectors and normalization

Direction is expressed as a unit vector - a vector with magnitude 1 pointing in the same direction as the original. This process is called normalization.

To normalize, divide each component by the vector's magnitude. Vector [3, 4] with magnitude 5 becomes [3/5, 4/5] = [0.6, 0.8]. Verify: √(0.6² + 0.8²) = 1.

Unit vectors separate "how much" from "which way." A game character moving northeast [0.7, 0.7] at 5 units per second: normalize the direction, then multiply by speed: [0.7, 0.7].normalized × 5.

The zero vector [0, 0] cannot be normalized - it has no direction.

[diagram: Vector and its normalized version side by side, showing same direction but different magnitudes]

## Vector addition and subtraction

Vector addition combines vectors by adding corresponding components. [a₁, a₂] + [b₁, b₂] = [a₁ + b₁, a₂ + b₂]. Geometrically, place vectors head-to-tail; their sum is the vector from the start of the first to the end of the second.

A boat with velocity [3, 0] (3 units east) in a current with velocity [0, 2] (2 units north) has actual velocity [3, 0] + [0, 2] = [3, 2].

[diagram: Vector addition shown geometrically - two vectors placed head-to-tail, with resultant sum vector]

Vector subtraction: [a₁, a₂] - [b₁, b₂] = [a₁ - b₁, a₂ - b₂]. This gives displacement between points. Enemy at [130, 170], player at [100, 200]: displacement is [100, 200] - [130, 170] = [-30, 30]. The enemy moves left and up.

## Scalar multiplication

Multiplying a vector by a scalar scales magnitude without changing direction (negative scalars reverse direction). k × [v₁, v₂] = [k × v₁, k × v₂].

Multiplying [3, 4] by 2 gives [6, 8] - same direction, doubled length. Multiplying by 0.5 gives [1.5, 2] - same direction, half length. Multiplying by -1 gives [-3, -4] - opposite direction.

Physics example: velocity [5, 3] meters per second multiplied by 0.1 seconds gives displacement [0.5, 0.3].

## The dot product

The dot product takes two vectors and produces a single number. For a = [a₁, a₂] and b = [b₁, b₂], the dot product is a · b = a₁ × b₁ + a₂ × b₂.

The dot product measures how much vectors "agree" - how much they point in the same direction. Mathematically: a · b = |a| × |b| × cos(θ), where θ is the angle between vectors.

[diagram: Three pairs of vectors showing positive (same direction), zero (perpendicular), and negative (opposite) dot products]

- Perpendicular vectors: dot product = 0 (cos(90°) = 0)
- Same direction: positive maximum (cos(0°) = 1)
- Opposite directions: negative (cos(180°) = -1)

Applications include similarity measurement in machine learning. Represent documents as word frequency vectors - the dot product (cosine similarity) identifies similar documents.

## Vector spaces and dimensionality

Vectors exist in vector spaces. Dimensionality is the number of components per vector. Two-dimensional vectors [x, y] represent screen positions or planar motion. Three-dimensional vectors [x, y, z] handle 3D graphics and spatial physics.

But dimensions extend beyond visualization. Four-dimensional vectors might represent spacetime. One-hundred-dimensional vectors might encode word meanings in natural language processing. The operations remain identical regardless of dimensionality.

## Introducing Quiver

With vector fundamentals established, we need practical tools for Swift. Quiver extends Swift's native Array type with vector operations, eliminating conversion overhead between arrays and custom vector types.

### Why Quiver?

Quiver adopts a Swift-first approach working directly with Swift arrays. This eliminates type conversion overhead while maintaining educational clarity. The package provides comprehensive coverage of vector mathematics, statistical functions, and linear algebra primitives with production-ready reliability.

### Installing Quiver

Add Quiver via Swift Package Manager:

```
https://github.com/waynewbishop/bishop-algorithms-quiver-package
```

In Xcode: **File → Add Package Dependencies** → paste the URL above.

## Vector operations with Quiver

Swift arrays automatically gain vector capabilities with Quiver imported.

### Magnitude and normalization

```swift
import Quiver

let position = [3.0, 4.0]
print(position.magnitude)  // 5.0

let velocity3D = [1.0, 2.0, 3.0]
print(velocity3D.magnitude)  // √14 ≈ 3.74

// Normalization
let vector = [3.0, 4.0]
let direction = vector.normalized  // [0.6, 0.8]
print(direction.magnitude)  // 1.0
```

### Vector arithmetic

```swift
import Quiver

// Addition
let force1 = [3.0, 4.0]
let force2 = [1.0, 2.0]
let totalForce = force1 + force2  // [4.0, 6.0]

// Subtraction
let playerPos = [100.0, 200.0]
let enemyPos = [130.0, 170.0]
let displacement = playerPos - enemyPos  // [-30.0, 30.0]

// Scalar multiplication
let velocity = [5.0, 3.0]
let doubled = velocity * 2.0      // [10.0, 6.0]

// Dot product
let v1 = [3.0, 4.0]
let v2 = [1.0, 2.0]
let dotProduct = v1.dot(v2)  // 11.0
```

## Practical applications

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
        let acceleration = force
        velocity = velocity + (acceleration * deltaTime)
    }
}

var ball = Ball(position: [0.0, 100.0], velocity: [20.0, 0.0])
let gravity = [0.0, -9.8]

ball.applyForce(gravity, deltaTime: 0.1)
ball.update(deltaTime: 0.1)
```

### Distance and direction in games

```swift
import Quiver

let playerPosition = [42.5, 67.3]
let targetPosition = [56.2, 89.7]

let displacement = targetPosition - playerPosition
let distance = displacement.magnitude

if distance < 30.0 {
    print("Target within range!")
}

// Enemy AI: move toward player
let enemyPos = [130.0, 170.0]
let playerPos = [100.0, 200.0]
let direction = (playerPos - enemyPos).normalized
let velocity = direction * 5.0  // 5 units/sec toward player
```

### Measuring similarity

```swift
import Quiver

struct Song {
    let name: String
    let features: [Double]  // [tempo, energy, danceability, loudness]

    func similarity(to other: Song) -> Double {
        let norm1 = features.normalized
        let norm2 = other.features.normalized
        return norm1.dot(norm2)
    }
}

let rock = Song(name: "Rock Anthem", features: [140.0, 0.9, 0.7, 0.8])
let pop = Song(name: "Pop Hit", features: [120.0, 0.8, 0.9, 0.7])
print(rock.similarity(to: pop))  // 0.98 (very similar!)
```

This cosine similarity technique is fundamental to recommendation systems and machine learning.

## Statistical operations

Beyond vector mathematics, Quiver provides statistical functions for data analysis.

```swift
import Quiver

let scores = [85.0, 92.0, 78.0, 88.0, 95.0, 82.0, 90.0]

print(scores.mean()!)     // 87.14
print(scores.median()!)   // 88.0
print(scores.std()!)      // 5.85 (standard deviation)

// Performance metrics analysis
let responseTimes = [120.0, 145.0, 132.0, 118.0, 150.0, 125.0]
let avgTime = responseTimes.mean()!        // 131.67ms
let deviation = responseTimes.std()!       // 12.41ms
```

## Array generation and manipulation

```swift
import Quiver

// Generate sequences
let zeros = [Double].zeros(count: 5)      // [0.0, 0.0, 0.0, 0.0, 0.0]
let range = [Double].linspace(0, 10, 5)   // [0.0, 2.5, 5.0, 7.5, 10.0]
let random = [Double].random(count: 100, in: 0...1)

// Data normalization for ML
let ages = [25.0, 32.0, 47.0, 19.0, 56.0, 38.0]
let minAge = ages.min()!
let maxAge = ages.max()!
let normalized = ages.map { ($0 - minAge) / (maxAge - minAge) }
```

## Matrix operations

Matrices extend vector concepts to two dimensions. Quiver supports basic matrix operations.

```swift
import Quiver

// Rotation matrix (90° counterclockwise)
let rotation90 = [
    [0.0, -1.0],
    [1.0,  0.0]
]

let rightVector = [1.0, 0.0]
let upVector = rotation90.transform(rightVector)  // [0.0, 1.0]
```

[diagram: Vector transformation showing rotation from right-pointing to up-pointing vector]

Matrices represent linear transformations - operations preserving vector addition and scalar multiplication. Rotation, scaling, reflection, and shearing are linear transformations.

## When to use vectors

Vector mathematics excels with spatial, directional, or multidimensional data.

**Ideal use cases:**
- Game development (positions, velocities, forces)
- Computer graphics (transformations, lighting)
- Physics simulations (kinematics, dynamics)
- Machine learning (feature vectors, similarity)
- Data analysis (multidimensional statistics)
- Spatial computing (GPS, mapping, navigation)

**Not needed for:**
- String processing
- File I/O operations
- Simple business logic
- Database queries

**Key question:** Does your data represent positions, directions, measurements, or relationships in space?

## Common patterns

### Check dimensions

```swift
let v1 = [1.0, 2.0, 3.0]
let v2 = [4.0, 5.0]

guard v1.count == v2.count else {
    print("Incompatible vector dimensions")
    return
}
```

### Handle zero vectors

```swift
let zeroVector = [0.0, 0.0]

if zeroVector.magnitude > 0 {
    let normalized = zeroVector.normalized
} else {
    print("Cannot normalize zero vector")
}
```

## Building algorithmic intuition

Vector mathematics connects to concepts throughout this book:

- **Arrays (Chapter 3)** - Vectors extend arrays with mathematical operations
- **Big O Notation (Chapter 2)** - Vector operations are O(n) in dimensionality
- **Generics (Chapter 7)** - Quiver uses generic constraints for type safety

The key insight: Vector mathematics provides a language for spatial relationships in games, graphics, data analysis, and machine learning.

## Summary

Vector mathematics forms the foundation for spatial computing and scientific programming.

**Core concepts:**
- Vectors represent magnitude and direction
- Magnitude measures size; normalization isolates direction
- Addition, subtraction, scalar multiplication have geometric interpretations
- The dot product quantifies similarity and measures angles
- Operations extend to arbitrary dimensions

**Quiver capabilities:**
- Extends native Swift arrays with vector operations
- Zero conversion overhead
- Comprehensive: vectors, statistics, linear algebra
- Production-ready with proper edge case handling

**Practical applications:**
- Game physics and AI behaviors
- Similarity measurement for recommendations
- Data normalization for machine learning
- Statistical analysis and visualization

Vector mathematics isn't merely academic theory - it's a practical toolkit for solving real problems across game development, graphics, data science, and scientific computing.


---

<div class="chapter-nav">
  <a href="16-advanced-complexity-analysis" class="prev">Previous Chapter</a>
  <a href="index">Table of Contents</a>
  <a href="18-pagerank-algorithm" class="next">Next Chapter</a>
</div>
