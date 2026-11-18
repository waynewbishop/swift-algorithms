---
layout: field-notes
title: "Chapter 22: Matrix Transformations"
description: "Apply scaling, rotation, and shear transformations to vectors and matrices in Swift"
---
# Matrix Transformations

In [Chapter 21](21-matrices.md), we treated a matrix as a way to organize data, with athletes in rows and measurements in columns. We ended with a different kind of matrix, `[[0, -1], [1, 0]]`, and noted that it does not describe data at all. It describes an operation that rotates any vector by ninety degrees. This chapter takes up that second role. A matrix can *move* space, and the key to reading one is to stop thinking of a vector as a fixed point and start thinking of it as an instruction, a recipe for how far to travel along each axis. When the matrix moves the axes, the instruction rides along, and the vector lands somewhere new.

That is the single idea this chapter returns to again and again: **a matrix moves the basis vectors, and every vector rides along.** Read the columns of a matrix to see where the basis vectors land, and we know everything the matrix does.

## Vectors as instructions

From [Chapter 20](20-vectors.md), we know a vector like `[3, 4]` is really an instruction: three steps along one basis vector, four along the other. Those two basis vectors, usually called `i-hat` and `j-hat`, point one step along each axis:

```swift
let iHat = [1.0, 0.0]  // points one step along the x-axis
let jHat = [0.0, 1.0]  // points one step up the y-axis
```

```
        ↑ j-hat [0, 1]
        |
        └──→ i-hat [1, 0]
```

The coordinates of a vector are the amounts of each basis vector. So `[3, 4]` reads as three of `i-hat` plus four of `j-hat`:

```
[3, 4] = 3 × [1, 0] + 4 × [0, 1]
       = [3, 0] + [0, 4]
       = [3, 4]
```

Written as a matrix, those two basis vectors in their resting position form the **identity matrix**. It is the do-nothing transformation, the default position of the axes before anything moves them:

```swift
let identity = [Double].identity(2)  // [[1, 0], [0, 1]]
```

The columns of the identity are `i-hat` and `j-hat` exactly where they started. Every other matrix in this chapter is a departure from it.

## How a matrix moves the basis vectors

A matrix transforms the basis vectors to new positions. Because a vector is just an instruction written in terms of those basis vectors, the instruction never changes. The vector simply rides along to wherever the basis vectors now point.

The columns of a matrix are where the basis vectors land. This is the geometry: read column one to see where `i-hat` goes, column two to see where `j-hat` goes.

The actual computation reads the matrix a different way, across the rows. Each coordinate of the output is a dot product of a row with the input, the same calculation from [Chapter 20](20-vectors.md):

```
[a  b]   [x]   [a×x + b×y]
[c  d] × [y] = [c×x + d×y]
```

These are two readings of the same matrix. The columns tell us *where the basis vectors land*, the geometry. The rows tell us *how to compute each output coordinate*, the arithmetic. They look identical for the identity and for the diagonal matrices in the next section only because those matrices are symmetric. They diverge the moment a transformation mixes the axes, as shear will show.

## Scaling transformations

The simplest transformation stretches space along the axes. The basis vectors keep pointing the same way, right and up, but grow longer or shorter. A diagonal matrix does this, with the diagonal entries as the scale factors:

```swift
import Quiver

// i-hat stretches to [2, 0], j-hat stretches to [0, 3]
let scaleUp = [[2.0, 0.0], [0.0, 3.0]]
```

The zeros off the diagonal mean no mixing: x stays as x, y stays as y. Reading the columns, `i-hat` lands at `[2, 0]` and `j-hat` at `[0, 3]`. Applying the transformation to a vector scales each coordinate by its axis's factor:

```swift
let vector = [4.0, 5.0]
let scaled = scaleUp.transform(vector)  // [8.0, 15.0]

// the instruction rides along: 4 × [2, 0] + 5 × [0, 3] = [8, 15]
```

## Rotation transformations

A rotation spins the basis vectors to new positions while preserving their length. Consider a ninety-degree counterclockwise rotation:

```swift
let rotation90 = [[0.0, -1.0], [1.0, 0.0]]
```

Read the columns first, before any arithmetic. Column one is `[0, 1]`, so `i-hat` swings from pointing right to pointing up. Column two is `[-1, 0]`, so `j-hat` swings from pointing up to pointing left. Now predict where `[3, 4]` lands: three of the new `i-hat` plus four of the new `j-hat`. The computation confirms it:

```swift
let vector = [3.0, 4.0]
let result = rotation90.transform(vector)  // [-4.0, 3.0]
```

The vector started in the first quadrant and now points into the second quadrant, x negative and y positive, rotated a quarter turn.

## Shear transformations

Scaling and rotation both keep the basis vectors independent. A **shear** mixes them: it slides one axis in proportion to the other, so squares lean into parallelograms. A horizontal shear leaves `i-hat` alone and tilts `j-hat` sideways:

```swift
let shear = [[1.0, 0.5], [0.0, 1.0]]

let vector = [2.0, 4.0]
let sheared = shear.transform(vector)  // [4.0, 4.0]
```

Shear is where the two readings of a matrix visibly split apart. Column two, `[0.5, 1]`, is where `j-hat` lands: right and up, tilted. But row two, `[0, 1]`, is the recipe for the output's y coordinate. These are different vectors. For the identity and the diagonal scaling matrix, columns and rows matched only because those matrices are symmetric. A shear breaks that coincidence: the columns are where the basis vectors go, the rows are how the output is computed.

## Composing transformations

Multiplying two matrices produces a single matrix that performs both transformations in one step. Reading the product's columns tells us where the basis vectors end up after *both*:

```swift
import Quiver

let rotation = [[0.0, -1.0], [1.0, 0.0]]  // 90° counterclockwise
let scaling = [[2.0, 0.0], [0.0, 3.0]]    // scale x by 2, y by 3

// scale first, then rotate
let combined = rotation.multiplyMatrix(scaling)  // [[0.0, -3.0], [2.0, 0.0]]
```

Transforming a vector and composing two transformations are the same kind of multiplication, applied to different shapes. We can verify the composed matrix against applying the two steps in sequence:

```swift
let vector = [1.0, 1.0]
let result = combined.transform(vector)  // [-3.0, 2.0]

// same as: scale [1, 1] → [2, 3], then rotate [2, 3] → [-3, 2]
```

Order matters. Rotating then scaling is a different matrix from scaling then rotating:

```swift
let reversed = scaling.multiplyMatrix(rotation)  // [[0.0, -2.0], [3.0, 0.0]]
```

The identity is the exception. Composing any matrix with the identity returns that matrix unchanged, the same way multiplying a number by one leaves it alone.

## Determinants and invertibility

Every square matrix carries a single number called the **determinant**, and it answers a geometric question: when the matrix transforms space, how does the size of a region change? For the 2×2 matrices in this chapter, that size is area. Read the columns as the two sides of a box, and the determinant is that box's area. For a 3×3 matrix, the same number measures how volume changes, and in higher dimensions it measures the corresponding higher-dimensional volume.

More precisely, the size of the determinant is the factor by which area is scaled, and its sign records whether orientation is preserved or flipped. The scaling matrix turns the unit square into a two-by-three rectangle:

```swift
import Quiver

let scaleUp = [[2.0, 0.0], [0.0, 3.0]]
let area = scaleUp.determinant  // 6.0 — area scales by 6×
```

A rotation moves the box without resizing it, so its determinant is one:

```swift
let rotation90 = [[0.0, -1.0], [1.0, 0.0]]
let rotationArea = rotation90.determinant  // 1.0 — area preserved
```

A shear is more surprising. It distorts the square into a slanted parallelogram, yet the parallelogram has the same base and height as the square, so its area is unchanged and its determinant is one. The determinant measures area, not shape.

When the determinant is zero, the transformation squashes space into a lower dimension, a plane onto a line or a line onto a point. Area collapses to zero and information is lost: different inputs map to the same output, so the transformation cannot be undone. Such a matrix is called **singular** and has no inverse. This happens whenever one basis vector is a multiple of another:

```swift
// second column is twice the first — both land on the same line
let collapsed = [[1.0, 2.0], [2.0, 4.0]]
let collapsedArea = collapsed.determinant  // 0.0 — space collapsed
```

This is not an abstraction reserved for graphics. When a model is fit to data, as linear regression is, one textbook route solves the normal equations, which involve a matrix built from the data, often written XᵀX. If two features carry the same information, where one is a copy or a rescaling of another, that matrix becomes singular and its determinant is zero. The fit doesn't become impossible: many sets of coefficients now explain the data equally well, so the coefficients are no longer unique, even though the predictions those coefficients make can still be perfectly sensible.

Exactly zero is easy to recognize, but "near zero" is a poor warning sign on its own, because the determinant depends on scale. The matrix `[[0.001, 0.0], [0.0, 0.001]]` has a determinant of 0.000001, yet it simply shrinks every vector by the same amount and is perfectly easy to undo. What matters in practice is a matrix's **rank** (how many independent directions survive the transformation) and its **conditioning** (how much small changes in the input can be magnified in the output). Numerical libraries measure conditioning directly, and they rarely invert XᵀX at all. Methods such as QR decomposition, singular value decomposition (SVD), and iterative solvers fit the same model more stably, and regularization adds a small penalty that restores a unique answer when features overlap. Stanford's [CS229 notes](https://cs229.stanford.edu/notes2022fall/main_notes.pdf) develop the normal equations in full.

## Building algorithmic intuition

Every transformation in this chapter is the same move seen from a different angle. Scaling stretches the basis vectors, rotation spins them, shear tilts them, and composition chains them together, but in each case the columns of the matrix tell us where the basis vectors land, and the vector's instruction rides along to meet them. The determinant then measures what that move did to area, and an exact zero tells us a transformation has collapsed space so far that it can never be undone.

That last idea is the bridge to the rest of this book. The same singularity that makes a transformation irreversible is what makes the coefficients of some data systems ambiguous, and recognizing rank and conditioning early saves us from trusting a precise-looking answer that the data can't actually support. In [Chapter 23](23-similarity-operations.md), we turn from moving vectors to comparing them, applying these matrix concepts to measure similarity between high-dimensional data, the computation behind recommendation engines, clustering, and modern AI systems.
