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

Any vector can be expressed as a combination of these basis vectors. This can be presented mathematically using a technique known as **matrix multiplication**. For example, the vector `[3, 4]` is oriented based on the position of `i-hat` and `j-hat`. Although the math shows the resulting  vector unchanged, we still should still acknowlege the matrix multiplication process. 

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

//creates a diagonal matrix - scales vector space
let scale = [Double].diag([3.0, 2.0])

//original basis vectors now scaled
let transform = identity.multiplyMatrix(scale)    
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


```
///TODO
///The first example should be scaling up showing how matrix transforms the vector basis (matrixMultiply) and then 
//that transformed vector basis is applied to the resulting vector (transformedBy)

Then go into detail explaining that matrixMultiply with the indentity is analagious to scalar multiplication using a 1. 
```


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
let point = [3.0, 4.0]
let result = rotation90.transform(point)  // [-4.0, 3.0]
```

### Multiplying matrices

Matrix multiplication extends to transforming multiple vectors simultaneously. When multiplying matrix A (`m×n`) by matrix B (`n×p`), each element results from the dot product of a row from A with a column from B:

```swift
import Quiver

let m1 = [[1.0, 2.0], [3.0, 4.0]]
let m2 = [[5.0, 6.0], [7.0, 8.0]]

let result = m1.multiplyMatrix(m2)
// Result: [[19.0, 22.0], [43.0, 50.0]]
```

Calculation for element `[0][0]`: `1×5 + 2×7 = 19`

Multiplying rotation by scaling creates a single matrix that rotates then scales—one multiplication instead of two sequential transformations. In addition, order matters. For example, `A × B ≠ B × A`. Rotating then scaling produces different results than scaling then rotating.

## Scaling transformations

Scaling transformations stretch or compress space along the coordinate axes. The basis vectors stay pointing in their original directions—they just get longer or shorter. This creates the characteristic diagonal pattern of scaling matrices.

Consider a matrix that scales x by 2× and y by 3×:

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
let point = [4.0, 5.0]
let scaled = scaleUp.transform(point)  // [8.0, 15.0]

// Verify the transform:
// 4 × [2, 0] + 5 × [0, 3] = [8, 0] + [0, 15] = [8, 15] ✓
```

## Building algorithmic intuition

Understanding transformations means recognizing how coordinate systems change systematically. The identity matrix represents our reference frame. Scaling matrices stretch or compress along axes. Rotation matrices spin the coordinate system while preserving distances. More complex transformations combine these basic operations, but the fundamental insight remains: read the columns to see where the basis vectors go.
