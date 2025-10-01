# Vector Mathematics with Quiver

Vector mathematics might sound intimidating, but at its core, it's about working with lists of numbers in ways that make sense for real-world problems. Whether you're building games, working with physics simulations, or analyzing data, vectors provide a powerful way to represent and manipulate spatial information.

In this chapter, we'll explore vector mathematics using **Quiver** - a Swift package that extends native arrays with vector operations, statistical functions, and numerical computing capabilities.

## Introducing Quiver

**Quiver** is a Swift package designed to bring vector mathematics and numerical computing to Swift in a natural, Swift-first way. Instead of creating custom types that require conversion, Quiver extends Swift's native `Array` type, making it seamless to use in your existing Swift projects.

### Installing Quiver

Add Quiver to your project via Swift Package Manager:

```
https://github.com/waynewbishop/bishop-algorithms-quiver-package
```

In Xcode: **File → Add Package Dependencies** → paste the URL above.

### Why Quiver?

1. **Swift-first approach**: Works directly with Swift arrays - no type conversion needed
2. **Zero conversion overhead**: Native performance without boxing/unboxing
3. **Educational focus**: Clear implementations that map to mathematical concepts
4. **Comprehensive**: Vector ops, statistics, linear algebra, and more
5. **Production-ready**: Well-tested, handles edge cases properly

## Your first vector operations

Let's jump right in with a practical example:

```swift
import Quiver

// Calculate the distance between two points in a game
let playerPosition = [42.5, 67.3]
let targetPosition = [56.2, 89.7]

// Vector subtraction and magnitude calculation
let displacement = targetPosition - playerPosition  // [13.7, 22.4]
let distance = displacement.magnitude              // 26.24

// Is the target within interaction range?
if distance < 30.0 {
    print("Target within range!")
}
```

That's it! With Quiver, arrays automatically gain vector capabilities.

## What is a vector?

Before diving deeper, let's understand what vectors actually represent.

### Vectors vs regular arrays

Not every array is a vector. The difference is in what the numbers represent:

```swift
import Quiver

// These ARE vectors (spatial/directional meaning)
let position = [10.0, 20.0]           // x=10, y=20 on a grid
let velocity = [5.0, -3.0]            // moving 5 right, 3 down per second
let rgbColor = [0.8, 0.2, 0.1]        // red=0.8, green=0.2, blue=0.1
let coordinates = [37.7749, -122.4194] // latitude, longitude (San Francisco)

// These are NOT vectors (just collections of data)
let temperatures = [68.0, 72.0, 71.0]  // Daily temperatures (no spatial relationship)
let userIDs = [101, 205, 333]          // Just identifiers
let prices = [29.99, 49.99, 19.99]     // Product prices
```

**Key insight:** Vectors represent things with magnitude (size) and direction in some space.

## Understanding magnitude

The **magnitude** of a vector is its length or size. Quiver makes this trivial:

```swift
import Quiver

let position = [3.0, 4.0]
print(position.magnitude)  // 5.0
```

**What's happening behind the scenes?**

Quiver uses the Pythagorean theorem:

```
magnitude = √(x² + y²)
magnitude = √(3² + 4²)
magnitude = √(9 + 16)
magnitude = √25
magnitude = 5.0
```

**Practical applications:**

```swift
// Physics: How fast is something moving?
let velocity = [6.0, 8.0]
let speed = velocity.magnitude  // 10.0 units per second

// Graphics: How bright is a color?
let color = [0.9, 0.6, 0.3]
let brightness = color.magnitude  // 1.12

// Game dev: How far between two points?
let pointA = [100.0, 200.0]
let pointB = [130.0, 240.0]
let displacement = pointB - pointA
let distance = displacement.magnitude  // 50.0 pixels
```

## Understanding direction (normalization)

Direction is expressed as a **unit vector** - a vector with magnitude 1 that points the same way as the original.

```swift
import Quiver

let vector = [3.0, 4.0]
let direction = vector.normalized  // [0.6, 0.8]

print(direction.magnitude)  // 1.0 ✓ (unit vector)
```

**What happened?**
- Original: [3, 4] with magnitude 5
- Divide each component by 5: [3/5, 4/5] = [0.6, 0.8]
- Result: same direction, magnitude = 1

### Why unit vectors matter

Unit vectors let you separate "how much" from "which way":

```swift
let velocity = [6.0, 8.0]

// How fast?
let speed = velocity.magnitude  // 10.0 units per second

// Which direction?
let heading = velocity.normalized  // [0.6, 0.8]

// Reconstruct: direction × speed = original velocity
let reconstructed = heading * speed  // [6.0, 8.0] ✓
```

**Practical example: Moving at a specific speed**

```swift
// Player wants to move toward target at exactly 5 units/second
let playerPos = [0.0, 0.0]
let targetPos = [30.0, 40.0]

let direction = (targetPos - playerPos).normalized  // [0.6, 0.8]
let desiredSpeed = 5.0

let velocity = direction * desiredSpeed  // [3.0, 4.0]
// Player now moves at exactly 5 units/second toward target
```

## Basic vector operations

Quiver provides natural operator overloads for vector math:

### Vector addition

```swift
import Quiver

// Physics: Combine forces
let gravity = [0.0, -9.8]      // Downward force
let thrust = [0.0, 15.0]       // Upward thrust
let wind = [2.0, 0.0]          // Sideways wind

let totalForce = gravity + thrust + wind  // [2.0, 5.2]
// Net force is 2 units right, 5.2 units up
```

### Vector subtraction

```swift
// Game dev: Find direction from enemy to player
let player = [100.0, 200.0]
let enemy = [130.0, 170.0]

let displacement = player - enemy  // [-30.0, 30.0]
// Enemy is 30 units left and 30 units up from player
```

### Scalar multiplication

```swift
// Scale a vector
let force = [3.0, 4.0]
let doubledForce = force * 2.0  // [6.0, 8.0]

// Move at half speed
let velocity = [10.0, 6.0]
let halfSpeed = velocity * 0.5  // [5.0, 3.0]
```

## The dot product: Measuring similarity

The **dot product** tells you how much two vectors "agree" with each other:

```swift
import Quiver

let v1 = [3.0, 4.0]
let v2 = [1.0, 2.0]

let dotProduct = v1.dot(v2)  // 11.0
// Calculation: (3×1) + (4×2) = 3 + 8 = 11
```

### What the dot product reveals

```swift
// Vectors pointing the same direction: positive
let right = [1.0, 0.0]
let moreRight = [3.0, 0.0]
print(right.dot(moreRight))  // 3.0 (positive)

// Perpendicular vectors: zero
let up = [0.0, 1.0]
print(right.dot(up))  // 0.0 (90° angle)

// Opposite directions: negative
let left = [-1.0, 0.0]
print(right.dot(left))  // -1.0 (180° angle)
```

**Rule of thumb:**
- **Positive** = vectors point in similar directions
- **Zero** = vectors are perpendicular
- **Negative** = vectors point in opposite directions

### Practical use: Finding similar items

```swift
import Quiver

struct Song {
    let name: String
    let features: [Double]  // [tempo, energy, danceability, loudness]

    func similarity(to other: Song) -> Double {
        // Normalize to unit vectors, then dot product
        let norm1 = features.normalized
        let norm2 = other.features.normalized
        return norm1.dot(norm2)
    }
}

let rockSong = Song(name: "Rock Anthem", features: [140.0, 0.9, 0.7, 0.8])
let popSong = Song(name: "Pop Hit", features: [120.0, 0.8, 0.9, 0.7])
let ballad = Song(name: "Slow Ballad", features: [70.0, 0.3, 0.4, 0.3])

print(rockSong.similarity(to: popSong))  // 0.98 (very similar!)
print(rockSong.similarity(to: ballad))   // 0.76 (less similar)
```

This technique (cosine similarity) is used in recommendation systems, search engines, and machine learning!

## Statistical operations

Quiver extends arrays with statistical functions:

```swift
import Quiver

let testScores = [85.0, 92.0, 78.0, 88.0, 95.0, 82.0, 90.0]

// Basic statistics
print(testScores.mean()!)     // 87.14 (average)
print(testScores.median()!)   // 88.0 (middle value)
print(testScores.min()!)      // 78.0 (lowest)
print(testScores.max()!)      // 95.0 (highest)

// Variability
print(testScores.std()!)      // 5.85 (standard deviation)
print(testScores.variance()!) // 34.27

// Cumulative operations
print(testScores.sum())       // 610.0
print(testScores.product())   // 45,682,886,400
```

### Real-world data analysis

```swift
// Analyze app performance metrics
let responseTime = [120.0, 145.0, 132.0, 118.0, 150.0, 125.0]

let avgTime = responseTimes.mean()!        // 131.67ms
let deviation = responseTimes.std()!       // 12.41ms

if avgTime < 150.0 {
    print("✓ Average response time acceptable")
}

if deviation > 20.0 {
    print("⚠️ High variability - investigate outliers")
}
```

## Array generation and manipulation

Quiver provides utilities for creating and manipulating arrays:

```swift
import Quiver

// Generate sequences
let zeros = [Double].zeros(count: 5)      // [0.0, 0.0, 0.0, 0.0, 0.0]
let ones = [Double].ones(count: 3)        // [1.0, 1.0, 1.0]
let range = [Double].linspace(0, 10, 5)   // [0.0, 2.5, 5.0, 7.5, 10.0]

// Random data
let random = [Double].random(count: 100, in: 0...1)  // 100 random values

// Boolean filtering
let numbers = [1.0, 5.0, 3.0, 8.0, 2.0, 9.0]
let largeNumbers = numbers.filter { $0 > 5.0 }  // [8.0, 9.0]
```

## Matrix operations

While we're working with vectors, Quiver also supports basic matrix operations:

```swift
import Quiver

// 2×2 rotation matrix (90° counterclockwise)
let rotation90 = [
    [0.0, -1.0],
    [1.0,  0.0]
]

// Transform a vector
let rightVector = [1.0, 0.0]  // Points right
let upVector = rotation90.transform(rightVector)  // [0.0, 1.0] - now points up!

// Scale matrix
let scaleMatrix = [
    [2.0, 0.0],
    [0.0, 2.0]
]

let point = [3.0, 4.0]
let scaled = scaleMatrix.transform(point)  // [6.0, 8.0] - doubled in size
```

## Practical examples with Quiver

### Example 1: Physics simulation

```swift
import Quiver

struct Ball {
    var position: [Double]
    var velocity: [Double]
    let mass: Double = 1.0

    mutating func update(deltaTime: Double) {
        // new_position = position + velocity * time
        position = position + (velocity * deltaTime)
    }

    mutating func applyForce(_ force: [Double], deltaTime: Double) {
        // F = ma, so a = F/m
        let acceleration = force / mass

        // new_velocity = velocity + acceleration * time
        velocity = velocity + (acceleration * deltaTime)
    }
}

// Simulate a ball with gravity
var ball = Ball(position: [0.0, 100.0], velocity: [20.0, 0.0])
let gravity = [0.0, -9.8]

for step in 0..<10 {
    ball.applyForce(gravity, deltaTime: 0.1)
    ball.update(deltaTime: 0.1)
    print("Step \(step): position = \(ball.position)")
}
```

### Example 2: Color manipulation

```swift
import Quiver

struct Color {
    var rgb: [Double]

    init(red: Double, green: Double, blue: Double) {
        self.rgb = [red, green, blue]
    }

    func darken(by factor: Double) -> Color {
        let darker = rgb * (1.0 - factor)
        return Color(rgb: darker)
    }

    func lighten(by factor: Double) -> Color {
        let lighter = rgb + ([1.0, 1.0, 1.0] * factor)
        let clamped = lighter.map { min(1.0, $0) }
        return Color(rgb: clamped)
    }

    func blend(with other: Color, ratio: Double) -> Color {
        let blended = (rgb * (1.0 - ratio)) + (other.rgb * ratio)
        return Color(rgb: blended)
    }
}

let red = Color(red: 1.0, green: 0.0, blue: 0.0)
let blue = Color(red: 0.0, green: 0.0, blue: 1.0)

let purple = red.blend(with: blue, ratio: 0.5)  // [0.5, 0.0, 0.5]
let darkRed = red.darken(by: 0.3)               // [0.7, 0.0, 0.0]
```

### Example 3: Game AI - Steering behavior

```swift
import Quiver

struct Agent {
    var position: [Double]
    var velocity: [Double]
    let maxSpeed: Double

    // Steer toward a target
    mutating func seekTarget(_ target: [Double]) {
        let displacement = target - position
        let distance = displacement.magnitude

        if distance > 0 {
            // Direction to target at max speed
            let desiredVelocity = displacement.normalized * maxSpeed

            // Smoothly adjust velocity toward desired
            velocity = desiredVelocity
        }
    }

    mutating func update(deltaTime: Double) {
        position = position + (velocity * deltaTime)
    }
}

var enemy = Agent(position: [0.0, 0.0], velocity: [0.0, 0.0], maxSpeed: 5.0)
let playerPosition = [100.0, 50.0]

// Enemy seeks player
enemy.seekTarget(playerPosition)
enemy.update(deltaTime: 0.1)

print("Enemy position: \(enemy.position)")  // Moving toward player
```

### Example 4: Data normalization for machine learning

```swift
import Quiver

// Normalize features to [0, 1] range for ML model
let ages = [25.0, 32.0, 47.0, 19.0, 56.0, 38.0]

let minAge = ages.min()!  // 19.0
let maxAge = ages.max()!  // 56.0

let normalized = ages.map { ($0 - minAge) / (maxAge - minAge) }
// [0.16, 0.35, 0.76, 0.0, 1.0, 0.51]

// Or standardize to mean=0, std=1
let mean = ages.mean()!
let std = ages.std()!

let standardized = ages.map { ($0 - mean) / std }
// Centered around 0 with std deviation of 1
```

## When to use Quiver

Quiver is particularly useful for:

**✅ Perfect use cases:**
- **iOS/macOS game development** - positions, velocities, physics
- **Data analysis and visualization** - statistics, trends, filtering
- **Computer graphics** - transformations, colors, animations
- **Machine learning** - feature vectors, similarity, normalization
- **Spatial calculations** - GPS, mapping, geometry
- **Scientific computing** - simulations, numerical methods

**❌ Not needed for:**
- String processing
- File I/O operations
- Simple business logic
- Database queries
- UI layout (though transformations can help)

**The key question:** Does your data represent positions, directions, measurements, or relationships in some space?

## Common patterns and best practices

### 1. Check vector dimensions

```swift
import Quiver

let v1 = [1.0, 2.0, 3.0]
let v2 = [4.0, 5.0]  // Different size!

// Quiver will assert/precondition on dimension mismatch
// Always ensure vectors have compatible dimensions
guard v1.count == v2.count else {
    print("Incompatible vector dimensions")
    return
}
```

### 2. Handle zero vectors

```swift
let zeroVector = [0.0, 0.0]

// Quiver protects against normalizing zero vectors
if zeroVector.magnitude > 0 {
    let normalized = zeroVector.normalized
} else {
    print("Cannot normalize zero vector")
}
```

### 3. Use appropriate numeric types

```swift
// Floating point for most vector operations
let positions: [Double] = [1.5, 2.7, 3.9]

// Integer vectors for discrete data
let gridPosition: [Int] = [10, 20]

// Quiver works with both!
```

## Swift Charts integration

Quiver seamlessly integrates with Swift Charts for data visualization:

```swift
import Quiver
import Charts

// Generate smooth curve data
let xValues = [Double].linspace(0, 10, 100)  // 100 points from 0 to 10
let yValues = xValues.map { sin($0) }        // Sine wave

// Create chart data
struct DataPoint: Identifiable {
    let id = UUID()
    let x: Double
    let y: Double
}

let chartData = zip(xValues, yValues).map { DataPoint(x: $0, y: $1) }

// Use in SwiftUI Chart view
Chart(chartData) {
    LineMark(
        x: .value("X", $0.x),
        y: .value("Y", $0.y)
    )
}
```

## Building intuition

Vector mathematics connects to concepts throughout this book:

- **Arrays** - Vectors extend array capabilities
- **Algorithms** - Distance-based sorting, nearest neighbor
- **Generics (Chapter 7)** - Quiver uses generic constraints
- **Performance (Chapter 2)** - Vector operations are O(n)

**The key insight:** Vector mathematics provides a language for spatial relationships, whether in 2D games, 3D graphics, data analysis, or machine learning.

## Summary

Quiver brings powerful vector mathematics to Swift in a natural, Swift-first way:

**Key capabilities:**

1. **Vector operations** - magnitude, normalization, dot product
2. **Arithmetic** - Add, subtract, multiply, divide vectors naturally
3. **Statistics** - mean, median, standard deviation, and more
4. **Array generation** - zeros, ones, linspace, random data
5. **Matrix operations** - transformations, rotations, scaling
6. **Data analysis** - filtering, normalization, comparison

**Why Quiver:**
- ✅ Extends native Swift arrays (zero conversion overhead)
- ✅ Natural syntax (`array.magnitude`, `v1 + v2`)
- ✅ Production-ready (well-tested, handles edge cases)
- ✅ Educational (clear, readable implementations)
- ✅ Comprehensive (covers vectors, statistics, linear algebra)

**Getting started:**

```swift
// Add to your project
// https://github.com/waynewbishop/bishop-algorithms-quiver-package

import Quiver

// Start using vectors immediately
let position = [10.0, 20.0]
let velocity = [5.0, -3.0]

let nextPosition = position + velocity
let distance = nextPosition.magnitude
```

Vector mathematics isn't just academic - it's a practical tool for solving real problems in game development, graphics, data analysis, and more. With Quiver, these powerful capabilities are just an import away.

---

**Learn more:**
- GitHub: https://github.com/waynewbishop/bishop-algorithms-quiver-package
- Documentation: Comprehensive guides and examples
- Author: Wayne Bishop - https://www.linkedin.com/in/waynebishop/
