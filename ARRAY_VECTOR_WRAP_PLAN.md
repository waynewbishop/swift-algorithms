# Array and Vector Inline Code Block Wrapping - Complete Plan

**Date:** October 8, 2025
**Chapter:** 19-linear-algebra.md
**Status:** Planning - NOT YET APPLIED

---

## Overview

Wrap ALL inline arrays and vectors in code blocks (backticks) for consistency with math formula standard.

**Rule:** Any array/vector notation `[...]` appearing in prose text (not in code blocks or diagrams) must be wrapped.

---

## Changes to Make

### Line 24: Vector notation in prose

**Current:**
```markdown
Mathematically, vectors are represented as ordered lists of numbers. A two-dimensional vector might be written as [3, 4], representing movement 3 units in one direction and 4 units in another. Three-dimensional vectors add a third component [x, y, z], and we can extend this to any number of dimensions.
```

**Fixed:**
```markdown
Mathematically, vectors are represented as ordered lists of numbers. A two-dimensional vector might be written as `[3, 4]`, representing movement 3 units in one direction and 4 units in another. Three-dimensional vectors add a third component `[x, y, z]`, and we can extend this to any number of dimensions.
```

**Changes:** 2 arrays wrapped

---

### Line 26: Diagram description arrays

**Current:**
```markdown
[diagram: 2D vector [3, 4] shown as arrow from origin to point (3,4)]
```

**Fixed:**
```markdown
[diagram: 2D vector `[3, 4]` shown as arrow from origin to point (3,4)]
```

**Changes:** 1 array wrapped

---

### Line 28: Feature vector example

**Current:**
```markdown
Vectors can represent many real-world concepts. In physics simulations and game development, they represent positions in space, forces acting on objects, and velocities of moving entities. In machine learning, feature vectors capture multiple attributes of data points—a song might be represented as [tempo, energy, danceability, loudness]. Even RGB color values are vectors, with each component representing intensity on a scale from 0 to 1.
```

**Fixed:**
```markdown
Vectors can represent many real-world concepts. In physics simulations and game development, they represent positions in space, forces acting on objects, and velocities of moving entities. In machine learning, feature vectors capture multiple attributes of data points—a song might be represented as `[tempo, energy, danceability, loudness]`. Even RGB color values are vectors, with each component representing intensity on a scale from 0 to 1.
```

**Changes:** 1 array wrapped

---

### Line 42: Diagram description

**Current:**
```markdown
[diagram: Right triangle showing vector [3, 4] as hypotenuse with legs 3 and 4]
```

**Fixed:**
```markdown
[diagram: Right triangle showing vector `[3, 4]` as hypotenuse with legs 3 and 4]
```

**Changes:** 1 array wrapped

---

### Line 52: Diagram description (multiple arrays)

**Current:**
```markdown
[diagram: Original vector [3, 4] and its normalized version [0.6, 0.8] showing same direction, different lengths]
```

**Fixed:**
```markdown
[diagram: Original vector `[3, 4]` and its normalized version `[0.6, 0.8]` showing same direction, different lengths]
```

**Changes:** 2 arrays wrapped

---

### Line 54: Unit vector example

**Current:**
```markdown
Unit vectors separate how much from which way. A game character moving northeast [0.7, 0.7] at 5 units per second: normalize the direction, then multiply by speed to get the exact velocity needed.
```

**Fixed:**
```markdown
Unit vectors separate how much from which way. A game character moving northeast `[0.7, 0.7]` at 5 units per second: normalize the direction, then multiply by speed to get the exact velocity needed.
```

**Changes:** 1 array wrapped

---

### Line 56: Zero vector

**Current:**
```markdown
The zero vector [0, 0] cannot be normalized because it has no direction - it represents no movement or no force.
```

**Fixed:**
```markdown
The zero vector `[0, 0]` cannot be normalized because it has no direction - it represents no movement or no force.
```

**Changes:** 1 array wrapped

---

### Line 112: Diagram description (multiple arrays)

**Current:**
```markdown
[diagram: Vector transformation showing rotation from right-pointing [1,0] to up-pointing [0,1]]
```

**Fixed:**
```markdown
[diagram: Vector transformation showing rotation from right-pointing `[1,0]` to up-pointing `[0,1]`]
```

**Changes:** 2 arrays wrapped

---

### Line 126: Test scores example

**Current:**
```markdown
These statistical operations treat data as vectors, applying mathematical transformations to extract insights. A vector of test scores [85, 92, 78, 88, 95, 82, 90] can be analyzed for mean performance, consistency through standard deviation, and outliers through range analysis. This mathematical approach to data forms the foundation for more advanced techniques in machine learning and data science.
```

**Fixed:**
```markdown
These statistical operations treat data as vectors, applying mathematical transformations to extract insights. A vector of test scores `[85, 92, 78, 88, 95, 82, 90]` can be analyzed for mean performance, consistency through standard deviation, and outliers through range analysis. This mathematical approach to data forms the foundation for more advanced techniques in machine learning and data science.
```

**Changes:** 1 array wrapped

---

## Summary of Changes

**Total locations:** 9
**Total arrays/vectors wrapped:** 12

### By line number:
1. **Line 24:** 2 arrays (`[3, 4]`, `[x, y, z]`)
2. **Line 26:** 1 array in diagram (`[3, 4]`)
3. **Line 28:** 1 array (`[tempo, energy, danceability, loudness]`)
4. **Line 42:** 1 array in diagram (`[3, 4]`)
5. **Line 52:** 2 arrays in diagram (`[3, 4]`, `[0.6, 0.8]`)
6. **Line 54:** 1 array (`[0.7, 0.7]`)
7. **Line 56:** 1 array (`[0, 0]`)
8. **Line 112:** 2 arrays in diagram (`[1,0]`, `[0,1]`)
9. **Line 126:** 1 array (`[85, 92, 78, 88, 95, 82, 90]`)

---

## Verification Checklist

After applying changes, verify:
- [ ] All arrays in prose text wrapped (not in code blocks)
- [ ] Diagram descriptions have arrays wrapped
- [ ] No arrays missed in explanatory text
- [ ] Code block examples unchanged (already formatted)
- [ ] Consistent with math formula standard

---

## Benefits

**Consistency:**
- All mathematical notation (formulas, vectors, arrays) uses same inline code style
- Readers recognize vectors/arrays at a glance
- Matches technical book standards

**Readability:**
- Vectors stand out visually
- Clear distinction between prose and mathematical objects
- Professional appearance

**Maintainability:**
- Single standard for all mathematical content
- Easy to apply to future chapters
- Clear rule: "If it's a mathematical object, wrap it"

---

## Files Affected

**Modified:**
- `19-linear-algebra.md` - 12 arrays wrapped across 9 locations

**Documentation:**
- `ARRAY_VECTOR_WRAP_PLAN.md` - This file (pre-change documentation)

---

## Ready for Review

All changes identified and documented. Awaiting approval before applying.
