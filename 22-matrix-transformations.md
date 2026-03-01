---
layout: chapter
title: "Chapter 22: Matrix Transformations"
description: "Understanding coordinate system transformations"
---
# Matrix Transformations

In [Chapter 21](21-matrices.md), we explored matrices as rectangular arrays that organize multi-dimensional data efficiently. In this section we'll learn more about how matrices **transform** vector spaces.

## Understanding basis vectors

From [Chapter 20](20-vectors.md), we know vectors represent magnitude and direction. Although a vector can possess any number of dimensions, two special unit vectors define the standard 2D coordinate system—the **basis vectors** usually called `i-hat` and `j-hat`:

```swift
let iHat = [1.0, 0.0]  // Points right (x-axis)
let jHat = [0.0, 1.0]  // Points up (y-axis)
```

```
        ↑ j-hat [0, 1]
        |
        |
        └──→ i-hat [1, 0]
```

Any vector can be expressed as a combination of these basis vectors. This can be presented mathematically using a technique known as **matrix multiplication**. For example, the vector `[3, 4]` is oriented based on the position of `i-hat` and `j-hat`. Although the math shows the resulting vector unchanged, we can still see the application of the matrix to the vector.

```
[3, 4] = 3 × [1, 0] + 4 × [0, 1]
       = [3, 0] + [0, 4]
       = [3, 4]
```

The basis vectors form the canvas. As a result, every vector is built from them. When matrices transform vectors, the matrix columns show **where** the basis vectors end up after transformation.

```swift
import Quiver 

let identity = [
    [1.0, 0.0],  // Column 1: i-hat
    [0.0, 1.0]   // Column 2: j-hat
]

// Creates a diagonal matrix - scales vector space
let scaleUp = [Double].diag([2.0, 3.0])

// Original basis vectors now scaled
let transform = identity.multiplyMatrix(scaleUp)  //identity scaled by [2.0, 3.0]
```

## The identity matrix

The **identity matrix** is simply the basis vectors expressed in matrix notation. As a result, `i-hat` and `j-hat` arranged as columns:

```swift
let identity = [
    [1.0, 0.0],  // Column 1: i-hat
    [0.0, 1.0]   // Column 2: j-hat
]
```

This represents the standard coordinate system before any transformation.

## Matrix multiplication

How do matrices transform vectors? As previously discussed, **matrix multiplication** is a specific calculation that applies transformations by combining the input vector's components in precise ways. When we multiply a matrix by a vector, each row of the matrix defines how to compute one component of the output. The calculation uses dot products:

```
[a  b]   [x]   [a×x + b×y]
[c  d] × [y] = [c×x + d×y]
```

Each output component is a **weighted combination** of the input components. The matrix rows contain the weights. This mixing of components is what enables transformations—scaling, rotation, and other geometric operations all work by recombining the input values.

## Scaling transformations

Scaling transformations stretch or compress space along the coordinate axes. The basis vectors stay pointing in their original directions—they just get longer or shorter. This creates the characteristic diagonal pattern of scaling matrices.

Consider the previous matrix that scales x by 2× and y by 3×:

```
[2  0]
[0  3]
```

The diagonal values (2 and 3) are the scale factors. Zero values in the off-diagonal positions mean no mixing between dimensions—x stays as x, y stays as y. 

```swift
import Quiver

let scaleUp = [
    [2.0, 0.0],   // Column 1: i-hat stretched to [2, 0] (2× longer, still points right)
    [0.0, 3.0]    // Column 2: j-hat stretched to [0, 3] (3× longer, still points up)
]
```

Visual transformation:

```
Before:          After:
    ↑ j              ↑ j (3× longer)
    |                |
    |                |
    └──→ i           └────→ i (2× longer)
```

The coordinate system's axes keep pointing in the same directions—right and up—but the measuring sticks got longer. Applying this transformation to a point scales each component by its corresponding diagonal value:

```swift
import Quiver

let vector = [4.0, 5.0]
let scaled = scaleUp.transform(vector)  // [8.0, 15.0]

// Verify the transform:
// 4 × [2, 0] + 5 × [0, 3] = [8, 0] + [0, 15] = [8, 15] ✓
```

## Rotation transformations

Consider rotating `[3, 4]` by 90° counterclockwise. The rotation matrix is:

```
[0  -1]
[1   0]
```

Applying the multiplication:

```
[0  -1]   [3]   [0×3 + (-1)×4]   [-4]
[1   0] × [4] = [1×3 +   0×4 ] = [ 3]
```

Quiver's `.transform()` method performs this matrix-vector multiplication:

```swift
import Quiver

let rotation90 = [[0.0, -1.0], [1.0, 0.0]]
let vector = [3.0, 4.0]
let result = rotation90.transform(vector)  // [-4.0, 3.0]
```

Note the `vector` now points in the **second quadrant** (x is negative, y positive) from the origin.

## Multiplying matrices

Matrix multiplication extends to transforming multiple vectors simultaneously. When multiplying matrix A (`m×n`) by matrix B (`n×p`), each element results from the dot product of a row from A with a column from B.

Multiplying rotation by scaling creates a single matrix that performs both transformations—one multiplication instead of two sequential operations. Using the rotation and scaling matrices from earlier in this chapter:

```swift
import Quiver

// 90° counterclockwise rotation
let rotation = [[0.0, -1.0], [1.0, 0.0]]

// Scale x by 2, y by 3
let scaling = [[2.0, 0.0], [0.0, 3.0]]

// Combine: scale first, then rotate
let combined = rotation.multiplyMatrix(scaling)
// Result: [[0.0, -3.0], [2.0, 0.0]]
```

Calculation for element `[0][1]`: `0×0 + (-1)×3 = -3`

We can verify by applying the combined matrix to a vector and comparing with the sequential approach:

```swift
import Quiver

// Apply combined transformation
let vector = [1.0, 1.0]
let result = combined.transform(vector)  // [-3.0, 2.0]

// Equivalent to: scale [1, 1] → [2, 3], then rotate [2, 3] → [-3, 2]
```

Order matters—`A × B ≠ B × A`. Scaling then rotating produces different results than rotating then scaling. Since the identity is also a matrix, `multiplyMatrix` applies to it as well. However, multiplying any matrix by the identity returns the original matrix unchanged—analogous to multiplying a number by 1.

## Determinants and area

Every square matrix has a single number associated with it called the determinant. This value answers a geometric question: when the matrix transforms space, how much does the area (or volume) change? The determinant tells us whether a transformation is reversible and how it scales the space it acts on.

Consider the scaling matrix from earlier in this chapter. It stretches x by 2 and y by 3, so a unit square becomes a 2×3 rectangle with area 6. The determinant confirms this:

```swift
import Quiver

// Scaling matrix: x by 2, y by 3
let scaleUp = [[2.0, 0.0], [0.0, 3.0]]
scaleUp.determinant  // 6.0 — area scales by 6×
```

Rotation matrices preserve distances and angles, so they preserve area as well. The determinant of any rotation matrix equals 1:

```swift
// 90° counterclockwise rotation
let rotation90 = [[0.0, -1.0], [1.0, 0.0]]
rotation90.determinant  // 1.0 — area preserved
```

A determinant of zero means the transformation collapses space into a lower dimension—flattening a 2D plane into a line or a point. These **singular** matrices cannot be inverted because the collapse loses information. There is no way to reconstruct the original space from a line. Quiver computes the determinant for square matrices of any size using the `.determinant` property.

## Building algorithmic intuition

Understanding transformations means recognizing how coordinate systems change systematically. The identity matrix represents our reference frame. Scaling matrices stretch or compress along axes. Rotation matrices spin the coordinate system while preserving distances. More complex transformations combine these basic operations through matrix multiplication, but the fundamental insight remains: read the columns to see where the basis vectors go.

These geometric operations, combined with the matrix fundamentals from [Chapter 21](21-matrices.md), provide the mathematical foundation for advanced applications across graphics, physics, and machine learning. In [Chapter 23](23-similarity-operations.md), we apply these vector and matrix concepts to measure similarity between high-dimensional data—the core computation behind recommendation engines, clustering, and modern AI systems.
