# Vector Mathematics and Linear Algebra

Vector mathematics and linear algebra form the mathematical foundation for countless modern applications—from computer graphics and game development to machine learning and data analysis.

While these topics might sound intimidating, they're surprisingly approachable when you understand that they're really about organizing and manipulating collections of numbers in mathematically meaningful ways. In this chapter, we'll explore fundamental mathematical concepts of vectors and matrices, using Swift code to make these abstract ideas concrete and practical.

## Linear algebra for programmers

Linear algebra isn't just academic mathematics—it's the engine behind many technologies you use daily:

- **Computer Graphics**: 3D rotations, scaling, and transformations
- **Game Development**: Physics simulations, collision detection, pathfinding
- **Machine Learning**: Feature vectors, similarity calculations, neural networks
- **Data Analysis**: Statistical operations, dimensionality reduction
- **Image Processing**: Filters, color transformations, computer vision
- **iOS Development**: Core Animation transforms, spatial audio, AR/VR

The beauty of linear algebra is that complex operations can be expressed elegantly through simple mathematical operations on arrays of numbers.

## Getting started with Quiver

To explore vector mathematics and linear algebra concepts practically, we'll use the Quiver framework throughout this chapter. Quiver is a Swift-first linear algebra library designed specifically for learning and applying mathematical concepts in real Swift applications.

### What is Quiver?

Quiver is a lightweight, educational framework that extends Swift's native `Array` type with mathematical operations. Rather than creating custom vector or matrix types that require conversion and learning new APIs, Quiver enhances the arrays you already know with advanced mathematical functionality.

You can clone or fork the framework at: 

https://github.com/waynewbishop/bishop-algorithms-quiver-package

**Key Design Principles:**
- **Swift-first approach**: Built specifically for Swift, not ported from other languages
- **Zero conversion overhead**: Work directly with Swift arrays—no special types required
- **Educational focus**: Clear, readable implementations that teach mathematical concepts
- **Progressive disclosure**: Simple operations remain simple, complex operations become possible

### Learning path with Quiver

As you progress through this chapter, you'll see how Quiver enables you to:

1. **Start Simple**: Basic vector operations feel natural and familiar
2. **Build Understanding**: Mathematical concepts translate directly to code
3. **Scale Complexity**: Advanced operations remain readable and intuitive
4. **Apply Practically**: Real-world applications use the same mathematical principles

### Import and basic usage

Throughout this chapter, we'll assume you have Quiver imported:

```swift
import Quiver

// Now Swift arrays have mathematical superpowers
let vector = [3.0, 4.0]
print(vector.magnitude)    // 5.0
print(vector.normalized)   // [0.6, 0.8]
```

## Understanding vectors

### The mathematical concept of vectors

In programming, we use arrays to store collections of related values:

```swift
let playerPosition = [42.5, 67.3]     // x, y coordinates
let rgbColor = [0.8, 0.5, 0.2]        // red, green, blue values
let sensorReadings = [98.6, 99.1, 98.9, 99.3]  // temperature measurements
```

In mathematics, these same arrays become **vectors**—quantities that have both **magnitude** (size) and **direction**. This isn't just a name change; it's a fundamental shift in how we think about and manipulate data.

#### Understanding magnitude and direction

**Magnitude** represents the "size" or "length" of a vector—how far it reaches from the origin:
- For a position vector [3, 4], the magnitude is 5 units (using Pythagorean theorem: √(3² + 4²))
- For a force vector [10, 0], the magnitude is 10 Newtons
- For an RGB color [0.8, 0.6, 0.4], the magnitude represents color intensity

**Direction** represents which way the vector points in space:
- A vector [1, 0] points purely rightward
- A vector [0, 1] points purely upward
- A vector [1, 1] points diagonally up-right at 45°

This magnitude-direction perspective unlocks operations that don't make sense for regular arrays:
- **Normalization**: Creating a unit vector (magnitude = 1) that preserves direction
- **Projection**: Finding how much one vector points in the direction of another
- **Rotation**: Changing direction while preserving magnitude
- **Similarity**: Measuring how "parallel" two vectors are

```swift
import Quiver

let velocity = [3.0, 4.0]  // Movement vector

// Magnitude: How fast are we moving?
let speed = velocity.magnitude  // 5.0 units per second

// Direction: Which way as a unit vector?
let direction = velocity.normalized  // [0.6, 0.8] - same direction, magnitude 1

// These concepts don't apply to regular data arrays:
let temperatures = [68.0, 72.0, 71.0]  // Magnitude doesn't mean anything here!
```

#### When arrays become vectors

Not every array should be treated as a vector. The mathematical transformation makes sense when:

**✅ Good vector candidates:**
- Positions and coordinates (x, y, z)
- Velocities and forces (physics)
- RGB/HSV color values
- Feature vectors (machine learning)
- Direction and orientation data

**❌ Poor vector candidates:**
- Time series data (temperature over days)
- Categorical data (user IDs, product names)
- Ordered sequences (Fibonacci numbers)
- Independent measurements (age, height, weight as separate concepts)

The key question: Does the relationship between elements represent a position or direction in some space?

### Vector properties

A vector's most fundamental properties are its magnitude and direction:

```swift
import Quiver

// A 2D vector representing displacement
let displacement = [3.0, 4.0]

// Magnitude: the "length" of the vector
let distance = displacement.magnitude  // 5.0

// Direction: expressed as a unit vector (length = 1)
let direction = displacement.normalized  // [0.6, 0.8]

// Verify the unit vector has magnitude 1
print(direction.magnitude)  // 1.0
```

The magnitude calculation uses the Pythagorean theorem: √(3² + 4²) = √(9 + 16) = √25 = 5.

### Real-world vector examples

Vectors represent many physical and abstract quantities:

#### Position and movement
```swift
// Player position in a 2D game
let playerPos = [150.0, 200.0]

// Movement vector (velocity)
let velocity = [5.0, -3.0]  // moving right and slightly down

// New position after one time step
let newPos = playerPos + velocity  // [155.0, 197.0]
```

#### Forces in physics
```swift
// Force vectors in 3D space
let gravity = [0.0, -9.8, 0.0]      // downward force
let wind = [2.0, 0.0, 1.5]          // force from wind
let thrust = [0.0, 15.0, 0.0]       // upward rocket thrust

// Total force is the sum of all forces
let totalForce = gravity + wind + thrust  // [2.0, 5.2, 1.5]
```

#### Color and features
```swift
// RGB color as a vector
let sunsetOrange = [1.0, 0.5, 0.0]

// Brightness adjustment (scaling)
let dimmerOrange = sunsetOrange * 0.7  // [0.7, 0.35, 0.0]

// Feature vector for machine learning
let houseFeatures = [2000.0, 3.0, 2.5, 1995.0]  // sqft, bedrooms, baths, year
```

## Vector operations

### Element-wise operations: The foundation of vector arithmetic

Vector arithmetic operates on corresponding elements across vectors:

```swift
let v1 = [1.0, 2.0, 3.0]
let v2 = [4.0, 5.0, 6.0]

// Element-wise operations: v1[i] ⊕ v2[i] for each position i
let sum = v1 + v2           // [1+4, 2+5, 3+6] = [5.0, 7.0, 9.0]
let difference = v2 - v1    // [4-1, 5-2, 6-3] = [3.0, 3.0, 3.0]
let product = v1 * v2       // [1×4, 2×5, 3×6] = [4.0, 10.0, 18.0]
let quotient = v2 / v1      // [4÷1, 5÷2, 6÷3] = [4.0, 2.5, 2.0]
```

#### Understanding broadcasting

**Broadcasting** is a powerful mathematical concept that extends operations between arrays of different shapes. It's **not** the same as Swift's `.map()` function, though they may look similar in simple cases.

**What `.map()` does:**
```swift
// map() transforms each element individually
let scaled = [1.0, 2.0, 3.0].map { $0 * 2.0 }  // [2.0, 4.0, 6.0]
```

**What broadcasting does:**
```swift
// Broadcasting applies mathematical rules for operating with different shapes
let vector = [1.0, 2.0, 3.0]
let scalar = 2.0

// Broadcasting extends the scalar to match the vector's shape conceptually
let scaled = vector * scalar  // [2.0, 4.0, 6.0]

// This is equivalent to: vector * [2.0, 2.0, 2.0]
// But no temporary array is created
```

#### Broadcasting rules and shapes

Broadcasting follows specific mathematical rules for combining arrays of different dimensions:

```swift
// Rule 1: Scalar broadcasts to any vector
let vector = [1.0, 2.0, 3.0]
let result1 = vector + 10.0  // [11.0, 12.0, 13.0]

// Rule 2: Vector broadcasts to compatible matrices
let matrix = [[1.0, 2.0], [3.0, 4.0]]  // 2×2 matrix
let rowVector = [10.0, 20.0]           // 1×2 vector

// Broadcasting adds the row vector to each row of the matrix
let result2 = matrix.broadcast(addingToEachRow: rowVector)
// [[11.0, 22.0], [13.0, 24.0]]
```

#### Why broadcasting matters mathematically

Broadcasting isn't just a programming convenience—it reflects important mathematical concepts:

**1. Scalar Multiplication**: A fundamental operation in linear algebra
```swift
// Mathematically: 3 × [1, 2, 3] = [3, 6, 9]
let vector = [1.0, 2.0, 3.0]
let scaled = vector * 3.0  // Broadcasting handles this naturally
```

**2. Affine Transformations**: Translation and scaling operations
```swift
// Mathematical transformation: y = ax + b
let data = [1.0, 2.0, 3.0, 4.0]
let slope = 2.0
let intercept = 5.0

let transformed = (data * slope) + intercept  // [7.0, 9.0, 11.0, 13.0]
```

**3. Normalization**: Converting data to standard scales
```swift
// Z-score normalization: (x - mean) / std
let scores = [85.0, 92.0, 78.0, 88.0, 95.0]
let mean = scores.mean()!     // 87.6
let std = scores.std()!       // 6.58

let normalized = (scores - mean) / std  // Broadcasting handles the math
// [-0.395, 0.668, -1.459, 0.061, 1.125]
```

#### Broadcasting vs. map: When to use which

**Use broadcasting when:**
- Applying mathematical operations (scaling, translation)
- Working with vectors/matrices conceptually
- Operations follow mathematical rules (commutativity, associativity)
- You want mathematical clarity in your code

**Use `.map()` when:**
- Transforming data with arbitrary functions
- Operations don't follow mathematical patterns
- Working with non-numeric data
- Complex transformations that aren't mathematical operations

```swift
// Broadcasting: Mathematical operations
let temperatures = [20.0, 25.0, 30.0]
let celsius = (temperatures * 9.0/5.0) + 32.0  // Mathematical formula

// Map: Arbitrary transformations
let formatted = temperatures.map { "\($0)°C" }  // String formatting
let categories = temperatures.map { $0 > 25 ? "Hot" : "Cool" }  // Conditional logic
```

These operations happen element-by-element, which makes intuitive sense for many applications:

```swift
// Combining RGB colors using vector arithmetic
let color1 = [0.8, 0.2, 0.1]  // Red-ish
let color2 = [0.1, 0.3, 0.9]  // Blue-ish
let blended = (color1 + color2) / 2.0  // [0.45, 0.25, 0.5] Purple-ish
```

### The dot product: Measuring relationships

The dot product is one of the most important vector operations. It measures how much two vectors "align" with each other:

```swift
let v1 = [3.0, 4.0]
let v2 = [1.0, 2.0]

let dotProduct = v1.dot(v2)  // 3*1 + 4*2 = 11.0
```

#### Understanding dot product results

```swift
// Parallel vectors: dot product = magnitude product
let rightward = [1.0, 0.0]
let moreRight = [3.0, 0.0]
print(rightward.dot(moreRight))  // 3.0 (positive)

// Perpendicular vectors: dot product = 0
let upward = [0.0, 1.0]
print(rightward.dot(upward))     // 0.0

// Opposite vectors: dot product = negative
let leftward = [-1.0, 0.0]
print(rightward.dot(leftward))   // -1.0 (negative)
```

#### Angle between vectors

The dot product reveals the angle between vectors:

```swift
extension Array where Element: FloatingPoint {
    func angle(with other: [Element]) -> Element {
        return acos(self.cosineOfAngle(with: other))
    }

    func angleInDegrees(with other: [Element]) -> Element {
        return angle(with: other) * 180.0 / .pi
    }
}

let v1 = [1.0, 0.0]  // Points right
let v2 = [0.0, 1.0]  // Points up

print(v1.angleInDegrees(with: v2))  // 90.0 degrees
```

### Vector projections: Breaking down components

Vector projection decomposes one vector into components relative to another—think of it as finding the "shadow" of one vector onto another:

```swift
let force = [5.0, 5.0]        // Force at 45° angle
let direction = [1.0, 0.0]    // Horizontal direction

// How much force is applied horizontally?
let horizontalComponent = force.scalarProjection(onto: direction)  // 5.0

// What's the horizontal force vector?
let horizontalForce = force.vectorProjection(onto: direction)      // [5.0, 0.0]

// What's the perpendicular component?
let verticalForce = force.orthogonalComponent(to: direction)       // [0.0, 5.0]

// Verify: original = projection + orthogonal
print(horizontalForce + verticalForce)  // [5.0, 5.0] ✓
```

#### Practical projection example: Ramp physics

```swift
// A box sliding down a ramp
let gravity = [0.0, -10.0]           // Gravity points down
let rampDirection = [0.6, -0.8]      // Ramp surface (normalized)

// How much gravitational force pulls the box down the ramp?
let forceDownRamp = gravity.scalarProjection(onto: rampDirection)  // 8.0

// How much force presses the box against the ramp?
let forceIntoRamp = gravity.orthogonalComponent(to: rampDirection)
print(forceIntoRamp.magnitude)  // 6.0
```

### Distance calculations

Computing distances is straightforward with vector operations:

```swift
let player = [100.0, 200.0]
let enemy = [130.0, 170.0]

// Distance using vector subtraction
let displacement = enemy - player     // [30.0, -30.0]
let distance = displacement.magnitude // 42.43

// Or use the built-in distance method
let directDistance = player.distance(to: enemy)  // 42.43

// Check if enemy is within attack range
let attackRange = 50.0
if distance <= attackRange {
    print("Enemy in range!")
}
```

## Matrix operations

Matrices are rectangular arrays of numbers that serve two main purposes: organizing data and representing transformations. In Quiver, matrices are arrays of arrays:

```swift
// A 2×3 matrix (2 rows, 3 columns)
let matrix = [
    [1.0, 2.0, 3.0],
    [4.0, 5.0, 6.0]
]

print(matrix.shape)  // (2, 3) - 2 rows, 3 columns
```

### Creating matrices

Quiver provides convenient methods for creating common matrices:

```swift
// Identity matrix (ones on diagonal, zeros elsewhere)
let identity3x3 = [Double].identity(3)
// [[1.0, 0.0, 0.0],
//  [0.0, 1.0, 0.0],
//  [0.0, 0.0, 1.0]]

// Matrix of zeros
let zeros = [Double].zeros(2, 4)
// [[0.0, 0.0, 0.0, 0.0],
//  [0.0, 0.0, 0.0, 0.0]]

// Matrix of ones
let ones = [Double].ones(3, 2)
// [[1.0, 1.0],
//  [1.0, 1.0],
//  [1.0, 1.0]]

// Diagonal matrix from an array
let diagonal = [Double].diag([5.0, 3.0, 8.0])
// [[5.0, 0.0, 0.0],
//  [0.0, 3.0, 0.0],
//  [0.0, 0.0, 8.0]]
```

### Matrix transformations

Matrices excel at representing geometric transformations. Here's how to rotate, scale, and reflect vectors:

#### 2D rotation matrix

```swift
// Create a 90° counterclockwise rotation matrix
let angle = Double.pi / 2  // 90 degrees in radians
let rotationMatrix = [
    [cos(angle), -sin(angle)],
    [sin(angle),  cos(angle)]
]
// [[0.0, -1.0],
//  [1.0,  0.0]]

// Apply rotation to a vector
let vector = [3.0, 1.0]
let rotated = vector.transformedBy(rotationMatrix)  // [-1.0, 3.0]

print("Original: \(vector)")     // [3.0, 1.0]
print("Rotated: \(rotated)")     // [-1.0, 3.0]
```

#### Scaling matrix

```swift
// Scale by 2x horizontally, 3x vertically
let scalingMatrix = [
    [2.0, 0.0],
    [0.0, 3.0]
]

let scaled = vector.transformedBy(scalingMatrix)  // [6.0, 3.0]
```

#### Reflection matrix

```swift
// Reflect across the y-axis (flip horizontally)
let reflectionMatrix = [
    [-1.0, 0.0],
    [ 0.0, 1.0]
]

let reflected = vector.transformedBy(reflectionMatrix)  // [-3.0, 1.0]
```

### Matrix transpose

The transpose operation swaps rows and columns:

```swift
let matrix = [
    [1.0, 2.0, 3.0],
    [4.0, 5.0, 6.0]
]

let transposed = matrix.transpose()
// [[1.0, 4.0],
//  [2.0, 5.0],
//  [3.0, 6.0]]

print("Original shape: \(matrix.shape)")      // (2, 3)
print("Transposed shape: \(transposed.shape)") // (3, 2)
```

Transpose is essential for many linear algebra operations and data manipulations.

## Statistical analysis: Understanding data through mathematics

Statistical operations represent another powerful application of linear algebra concepts. When we apply mathematical operations to collections of data, we can extract meaningful insights about distributions, relationships, and patterns.

### Basic statistics

```swift
let temperatures = [68.5, 72.1, 69.8, 75.3, 71.2, 73.0, 70.5]

// Central tendency
let mean = temperatures.mean()!          // 71.49
let median = temperatures.median()!      // 71.2

// Spread
let variance = temperatures.variance()!  // 5.65
let stdDev = temperatures.std()!         // 2.38

// Extremes
let minimum = temperatures.min()!        // 68.5
let maximum = temperatures.max()!        // 75.3
let range = maximum - minimum            // 6.8

// Find positions of extremes
let minIndex = temperatures.argmin()!    // 0
let maxIndex = temperatures.argmax()!    // 3
```

### Sample vs. population statistics

Understanding the difference between sample and population statistics is crucial:

```swift
let sampleData = [85.0, 92.0, 78.0, 88.0, 91.0]

// Population statistics (ddof: 0) - assume this IS the entire population
let populationVar = sampleData.variance(ddof: 0)!  // 26.24
let populationStd = sampleData.std(ddof: 0)!       // 5.12

// Sample statistics (ddof: 1) - assume this represents a larger population
let sampleVar = sampleData.variance(ddof: 1)!      // 32.80
let sampleStd = sampleData.std(ddof: 1)!           // 5.73
```

Use `ddof: 1` (sample statistics) when your data represents a sample from a larger population, which is most common in real-world applications.

### Cumulative operations

Track running totals and growth:

```swift
let dailySales = [120.0, 150.0, 90.0, 200.0, 180.0]

// Running total of sales
let cumulativeSales = dailySales.cumulativeSum()
// [120.0, 270.0, 360.0, 560.0, 740.0]

// Growth multipliers
let growthFactors = [1.0, 1.05, 0.98, 1.12, 1.08]
let cumulativeGrowth = growthFactors.cumulativeProduct()
// [1.0, 1.05, 1.029, 1.153, 1.245]

print("Total sales: \(cumulativeSales.last!)")       // 740.0
print("Overall growth: \(cumulativeGrowth.last!)")   // 24.5% growth
```

### Data analysis with boolean operations

Quiver enables sophisticated data filtering and analysis:

```swift
let scores = [85.0, 92.0, 78.0, 95.0, 88.0, 73.0, 91.0]
let passingGrade = 80.0

// Create boolean mask for passing scores
let isPassing = scores.isGreaterThanOrEqual(passingGrade)
// [true, true, false, true, true, false, true]

// Extract passing scores
let passingScores = scores.masked(by: isPassing)
// [85.0, 92.0, 95.0, 88.0, 91.0]

// Calculate statistics for passing students only
let passingAverage = passingScores.mean()!  // 90.2

// Count students by category
let passingCount = isPassing.count { $0 }    // 5
let failingCount = scores.count - passingCount  // 2

print("\(passingCount) students passed with average \(passingAverage)")
print("\(failingCount) students need to retake the exam")
```

### Data generation and sequences

Create data for analysis, visualization, and simulation:

```swift
// Evenly spaced values for charts and analysis
let xValues = [Double].linspace(0, 10, num: 11)
// [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0]

// Generate sine wave data
let yValues = xValues.map { sin($0) }

// Random data for simulation
let randomSamples = [Double].random(100)  // 100 random values [0, 1)

// Range of values with step size
let countdownRange = [Double].arange(10, 0, step: -1)
// [10.0, 9.0, 8.0, 7.0, 6.0, 5.0, 4.0, 3.0, 2.0, 1.0]
```

## Real-world applications

### Game development: Movement and collision

Here's how vector mathematics powers game development:

```swift
import Quiver

struct Player {
    var position: [Double]
    var velocity: [Double]
    var health: Double

    mutating func update(deltaTime: Double) {
        // Update position based on velocity
        let movement = velocity * deltaTime
        position = position + movement
    }

    func distanceTo(_ other: Player) -> Double {
        return position.distance(to: other.position)
    }

    func isInRange(of other: Player, range: Double) -> Bool {
        return distanceTo(other) <= range
    }
}

// Game loop simulation
var player = Player(position: [100.0, 200.0], velocity: [50.0, -30.0], health: 100.0)
var enemy = Player(position: [300.0, 150.0], velocity: [-20.0, 10.0], health: 80.0)

let deltaTime = 1.0/60.0  // 60 FPS

// Update positions
player.update(deltaTime: deltaTime)
enemy.update(deltaTime: deltaTime)

// Check for interaction
let attackRange = 75.0
if player.isInRange(of: enemy, range: attackRange) {
    print("Player can attack enemy!")
    print("Distance: \(player.distanceTo(enemy))")
}
```

### Physics simulation: Force and motion

```swift
struct PhysicsObject {
    var position: [Double]
    var velocity: [Double]
    var mass: Double

    mutating func applyForce(_ force: [Double], deltaTime: Double) {
        // F = ma, so a = F/m
        let acceleration = force / mass

        // Update velocity: v = v₀ + at
        velocity = velocity + (acceleration * deltaTime)

        // Update position: x = x₀ + vt
        position = position + (velocity * deltaTime)
    }
}

// Simulate a projectile
var projectile = PhysicsObject(
    position: [0.0, 0.0],
    velocity: [20.0, 30.0],  // Initial velocity
    mass: 1.0
)

let gravity = [0.0, -9.8]  // Gravitational force
let deltaTime = 0.1

// Simulate 10 time steps
for step in 0..<10 {
    projectile.applyForce(gravity, deltaTime: deltaTime)
    print("Step \(step): position \(projectile.position), velocity \(projectile.velocity)")
}
```

### Computer graphics: Color transformations

```swift
// RGB color manipulation
struct Color {
    var rgb: [Double]

    init(red: Double, green: Double, blue: Double) {
        self.rgb = [red, green, blue]
    }

    // Adjust brightness
    func brightness(_ factor: Double) -> Color {
        return Color(rgb: rgb * factor)
    }

    // Convert to grayscale using luminance weights
    func grayscale() -> Color {
        let luminanceWeights = [0.299, 0.587, 0.114]
        let grayValue = rgb.dot(luminanceWeights)
        return Color(red: grayValue, green: grayValue, blue: grayValue)
    }

    // Blend with another color
    func blend(with other: Color, ratio: Double) -> Color {
        let blended = (rgb * (1.0 - ratio)) + (other.rgb * ratio)
        return Color(rgb: blended)
    }
}

// Usage
let sunsetOrange = Color(red: 1.0, green: 0.5, blue: 0.0)
let skyBlue = Color(red: 0.3, green: 0.7, blue: 1.0)

let dimmer = sunsetOrange.brightness(0.7)
let gray = sunsetOrange.grayscale()
let twilight = sunsetOrange.blend(with: skyBlue, ratio: 0.3)

print("Original: \(sunsetOrange.rgb)")    // [1.0, 0.5, 0.0]
print("Dimmed: \(dimmer.rgb)")            // [0.7, 0.35, 0.0]
print("Grayscale: \(gray.rgb)")           // [0.6565, 0.6565, 0.6565]
print("Twilight: \(twilight.rgb)")        // [0.79, 0.56, 0.3]
```

### Data analysis: Feature similarity

```swift
// Product recommendation using cosine similarity
struct Product {
    let name: String
    let features: [Double]  // [price, rating, popularity, quality]

    func similarity(to other: Product) -> Double {
        return features.cosineOfAngle(with: other.features)
    }
}

let products = [
    Product(name: "Budget Phone", features: [299.0, 3.5, 0.6, 0.7]),
    Product(name: "Premium Phone", features: [999.0, 4.8, 0.9, 0.95]),
    Product(name: "Gaming Phone", features: [699.0, 4.2, 0.75, 0.85]),
    Product(name: "Basic Phone", features: [199.0, 3.0, 0.4, 0.6])
]

let targetProduct = products[1]  // Premium Phone

// Find most similar products
let similarities = products.map { product in
    (product.name, targetProduct.similarity(to: product))
}

let sortedSimilarities = similarities.sorted { $0.1 > $1.1 }

print("Products similar to \(targetProduct.name):")
for (name, similarity) in sortedSimilarities.prefix(3) {
    print("\(name): \(String(format: "%.3f", similarity))")
}
```

### Data visualization with Swift Charts

Combine Quiver with Swift Charts for powerful data visualization:

```swift
import SwiftUI
import Charts
import Quiver

struct SineWaveChart: View {
    let dataPoints: [(x: Double, y: Double)]

    init() {
        // Generate smooth sine wave using Quiver
        let xValues = [Double].linspace(0, 2 * .pi, num: 50)
        let yValues = xValues.map { sin($0) }
        self.dataPoints = zip(xValues, yValues).map { (x: $0, y: $1) }
    }

    var body: some View {
        Chart(dataPoints, id: \.x) { point in
            LineMark(
                x: .value("X", point.x),
                y: .value("Sine", point.y)
            )
            .foregroundStyle(.blue)
        }
        .frame(height: 200)
        .chartYScale(domain: -1.1...1.1)
    }
}

struct TemperatureChart: View {
    let temperatures = [68.5, 72.1, 69.8, 75.3, 71.2, 73.0, 70.5]
    let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    var body: some View {
        VStack {
            Chart {
                ForEach(Array(zip(days, temperatures)), id: \.0) { day, temp in
                    BarMark(
                        x: .value("Day", day),
                        y: .value("Temperature", temp)
                    )
                }

                // Add average line using Quiver
                if let avgTemp = temperatures.mean() {
                    RuleMark(y: .value("Average", avgTemp))
                        .foregroundStyle(.red)
                        .lineStyle(StrokeStyle(lineWidth: 2, dash: [5, 5]))
                }
            }
            .frame(height: 200)

            // Display statistics using Quiver
            VStack(alignment: .leading) {
                Text("Average: \(String(format: "%.1f", temperatures.mean()!))°F")
                Text("Range: \(String(format: "%.1f", temperatures.min()!))°F - \(String(format: "%.1f", temperatures.max()!))°F")
                Text("Std Dev: \(String(format: "%.1f", temperatures.std()!))°F")
            }
            .font(.caption)
        }
    }
}
```

## Mathematical intuition and performance

### Understanding computational complexity in linear algebra

Linear algebra operations have predictable computational costs that help you choose appropriate approaches:

**Vector Operations:**
- Element-wise operations: O(n) where n is vector length
- Dot product: O(n) - single pass through both vectors
- Normalization: O(n) - magnitude calculation plus division

**Matrix Operations:**
- Matrix-vector multiplication: O(mn) where m×n is matrix size
- Matrix transpose: O(mn) - rearranging elements
- Matrix-matrix multiplication: O(mnp) for m×n and n×p matrices

**Statistical Operations:**
- Mean, sum: O(n) - single pass
- Variance, standard deviation: O(n) - typically two passes
- Sorting-based operations (median): O(n log n)

### Optimizing mathematical operations

```swift
// Efficient: Reuse expensive computations
let magnitude = vector.magnitude
let normalized = vector / magnitude  // Broadcasting division

// Less efficient: Redundant calculations
let normalized = vector.normalized   // Computes magnitude internally

// Efficient: Mathematical operations use broadcasting
let scaled = vector * 2.0            // O(n) vector-scalar operation

// Less efficient: General transformations
let scaled = vector.map { $0 * 2.0 } // O(n) but with function call overhead
```

### When mathematical approaches excel

**Use vector/matrix operations when:**
- Working with spatial or geometric data
- Implementing transformations (graphics, physics)
- Analyzing relationships between data points
- Mathematical clarity improves code understanding

**Use traditional approaches when:**
- Working with categorical or symbolic data
- Complex conditional logic
- Operations that don't follow mathematical patterns
- Maximum performance is critical (use Accelerate framework)

### Memory management

```swift
// Quiver extends native Swift arrays, so normal Swift memory rules apply
var largeDataset = [Double].random(1_000_000)

// Operations create new arrays - be mindful of memory usage
let processed = largeDataset
    .filter { $0 > 0.5 }
    .map { $0 * 2.0 }

// For very large datasets, consider processing in chunks
let chunkSize = 10_000
for i in stride(from: 0, to: largeDataset.count, by: chunkSize) {
    let endIndex = min(i + chunkSize, largeDataset.count)
    let chunk = Array(largeDataset[i..<endIndex])
    // Process chunk...
}
```

## Building algorithmic intuition

### Vector mathematics design patterns

Understanding when and how to apply vector operations:

#### 1. Position and movement
```swift
// Pattern: position = position + velocity * time
struct MovingObject {
    var position: [Double]
    var velocity: [Double]

    mutating func update(deltaTime: Double) {
        position = position + (velocity * deltaTime)
    }
}
```

#### 2. Force accumulation
```swift
// Pattern: total_force = sum of all forces
func calculateNetForce(forces: [[Double]]) -> [Double] {
    return forces.reduce([0.0, 0.0]) { sum, force in
        sum + force
    }
}
```

#### 3. Similarity and distance
```swift
// Pattern: similarity = dot(normalize(a), normalize(b))
func cosineSimilarity(_ a: [Double], _ b: [Double]) -> Double {
    return a.normalized.dot(b.normalized)
}
```

#### 4. Component extraction
```swift
// Pattern: component = project(vector, direction)
func extractComponent(_ vector: [Double], along direction: [Double]) -> Double {
    return vector.scalarProjection(onto: direction)
}
```

### Common pitfalls and solutions

#### Dimension mismatches
```swift
// Problem: Operations between incompatible vector sizes
let a = [1.0, 2.0, 3.0]
let b = [4.0, 5.0]        // Different size!
// let sum = a + b        // This will crash!

// Solution: Validate dimensions
func safeAdd(_ a: [Double], _ b: [Double]) -> [Double]? {
    guard a.count == b.count else { return nil }
    return a + b
}
```

#### Zero vector operations
```swift
// Problem: Normalizing or projecting with zero vectors
let zeroVector = [0.0, 0.0]
// let normalized = zeroVector.normalized  // This will crash!

// Solution: Check for zero vectors
extension Array where Element: FloatingPoint {
    var safeNormalized: [Element]? {
        let mag = magnitude
        guard mag > 0 else { return nil }
        return self / mag
    }
}
```

#### Floating point precision
```swift
// Problem: Comparing floating point results exactly
let result = someComplexCalculation()
// if result == 1.0 { ... }  // Might fail due to precision

// Solution: Use epsilon comparisons
func isApproximatelyEqual(_ a: Double, _ b: Double, epsilon: Double = 1e-10) -> Bool {
    return abs(a - b) < epsilon
}
```

### Integration with other algorithms

Vector mathematics enhances many algorithms covered in previous chapters:

#### Enhanced sorting (Chapter 5)
```swift
// Sort points by distance from origin
let points = [[3.0, 4.0], [1.0, 1.0], [5.0, 0.0]]
let sortedByDistance = points.sorted { $0.magnitude < $1.magnitude }
```

#### Graph algorithms (Chapter 11)
```swift
// Use vector distance for graph edge weights
struct GeographicGraph {
    func distance(from node1: [Double], to node2: [Double]) -> Double {
        return node1.distance(to: node2)
    }
}
```

#### Dynamic programming (Chapter 15)
```swift
// Vector similarity in sequence alignment
func vectorSimilarityScore(_ a: [Double], _ b: [Double]) -> Double {
    return a.cosineOfAngle(with: b)
}
```

## When to use vector mathematics

### Decision framework

**Use vector operations when:**
- Working with spatial data (positions, directions, forces)
- Analyzing relationships between data points
- Implementing transformations (rotations, scaling)
- Processing multi-dimensional data
- Building simulations or games

**Use statistical operations when:**
- Analyzing data distributions
- Calculating summary statistics
- Filtering and selecting data
- Preparing data for visualization
- Comparing datasets

**Use matrix operations when:**
- Applying geometric transformations
- Organizing multi-dimensional data
- Implementing machine learning algorithms
- Processing batch operations

### Performance vs. clarity trade-offs

Quiver prioritizes clarity and Swift integration over maximum performance. This makes it excellent for:
- Learning and education
- Prototyping and experimentation
- iOS/macOS app development
- Medium-scale data analysis

For applications requiring maximum performance, consider specialized libraries like Accelerate framework, but start with Quiver to build understanding and prototypes.

