# Chapter Reordering and Math Formula Standard - Summary

**Date:** October 8, 2025
**Status:** Complete - Ready for review (NOT PUSHED)

---

## Changes Made

### 1. Chapter Reordering

**Previous order:**
- Chapter 17: Dynamic Programming
- Chapter 18: Linear Algebra
- Chapter 19: PageRank
- Chapter 20: Semantic Search

**New order:**
- Chapter 17: Dynamic Programming
- Chapter 18: PageRank Algorithm ← **MOVED UP**
- Chapter 19: Linear Algebra ← **MOVED DOWN**
- Chapter 20: Semantic Search

**Rationale:**
PageRank motivates WHY linear algebra matters (ranking web pages with matrices), then students learn the mathematical foundation, then apply it to semantic search. Better pedagogical flow: problem → foundation → application.

---

### 2. File Changes

**Renamed:**
- `19-pagerank-algorithm.md` → `18-pagerank-algorithm.md`
- `18-linear-algebra.md` → `19-linear-algebra.md`

**Deleted:**
- `18-linear-algebra-OLD.md` (backup from previous work)
- Original `18-linear-algebra.md` (replaced by renamed file)
- Original `19-pagerank-algorithm.md` (replaced by renamed file)

**Navigation Updated:**
- `_config.yml`: Left sidebar navigation reordered (PageRank now before Linear Algebra in "Advanced Topics" section)

---

### 3. Updated Chapter 18 (PageRank)

**Front matter updated:**
```yaml
title: "Chapter 18: PageRank Algorithm"  # Was: Chapter 19
```

**No content changes** - PageRank chapter unchanged except chapter number.

---

### 4. Updated Chapter 19 (Linear Algebra)

#### Front matter
```yaml
title: "Chapter 19: Linear Algebra"  # Was: Chapter 18
```

#### Opening paragraph - MAJOR REWRITE

**Before:**
```markdown
In [Chapter 17](17-dynamic-programming.md), we saw how breaking problems into
smaller subproblems leads to elegant solutions. Now we shift to a different but
equally powerful mathematical foundation: linear algebra. While dynamic programming
helps us optimize recursive computations, linear algebra provides the mathematical
language for spatial relationships, transformations, and data analysis.

Linear algebra forms the foundation for advanced algorithms we'll explore in
upcoming chapters. In Chapter 19, you'll see how PageRank uses matrix operations
to rank web pages. In Chapter 20, semantic search relies on vector mathematics
to find similar documents by treating text as high-dimensional vectors.
```

**After:**
```markdown
In [Chapter 17](17-dynamic-programming.md), we saw how breaking problems into
smaller subproblems leads to elegant solutions. In [Chapter 18](18-pagerank-algorithm.md),
we encountered PageRank's matrix operations for ranking web pages. Now we'll explore
the mathematical foundation that powers these algorithms: linear algebra. While
dynamic programming optimizes recursive computations and PageRank analyzes networks,
linear algebra provides the mathematical language for spatial relationships,
transformations, and data analysis.

Understanding vectors and matrices is essential for the algorithms we've seen and
those ahead. Chapter 18 demonstrated how PageRank uses matrix operations to compute
page importance across web graphs. In Chapter 20, semantic search will rely on
vector mathematics to find similar documents by treating text as high-dimensional
vectors.
```

**Key changes:**
- References Ch 18 PageRank in **past tense** ("we encountered", "demonstrated")
- Ch 20 Semantic Search in **future tense** ("will rely")
- Linear algebra now positioned as foundation for what students already saw

#### Building algorithmic intuition section

**Updated chapter references:**
- "Chapter 19 explores PageRank" → "Chapter 18 explored PageRank" (past tense)

#### Summary section

**Updated chapter reference:**
- "PageRank's matrix computations in Chapter 19" → "Chapter 18"

---

### 5. New Standard: Math Formulas in Code Blocks

**Rule:** ALL vector and math formulas wrapped in inline code blocks using backticks.

#### Examples of changes:

**Before:**
```markdown
magnitude equals √(x² + y²)
```

**After:**
```markdown
magnitude equals `√(x² + y²)`
```

**Before:**
```markdown
For vector [3, 4] with magnitude 5 becomes [3/5, 4/5] = [0.6, 0.8]
```

**After:**
```markdown
For vector `[3, 4]` with magnitude 5 becomes `[3/5, 4/5] = [0.6, 0.8]`
```

**Before:**
```markdown
A 2×3 matrix has 2 rows and 3 columns
```

**After:**
```markdown
A `2×3` matrix has 2 rows and 3 columns
```

---

### 6. Complete List of Math Formula Updates

Applied inline code blocks to ALL mathematical expressions:

1. **Line 38:** `√(x² + y²)`, `√(x² + y² + z²)`
2. **Line 40:** `[3, 4]`, `(3, 4)`, `√(3² + 4²) = √25 = 5`
3. **Line 44:** `[1, 2, 3, 4]`, `√(1² + 2² + 3² + 4²) = √30 ≈ 5.48`
4. **Line 50:** `[3, 4]`, `[3/5, 4/5] = [0.6, 0.8]`, `√(0.6² + 0.8²) = 1`
5. **Line 64:** `[a₁, a₂] + [b₁, b₂] = [a₁ + b₁, a₂ + b₂]`
6. **Line 66:** `[3, 0]`, `[0, 2]`, `[3, 0] + [0, 2] = [3, 2]`
7. **Line 70:** `[a₁, a₂] - [b₁, b₂] = [a₁ - b₁, a₂ - b₂]`, `[130, 170]`, `[100, 200]`, `[100, 200] - [130, 170] = [-30, 30]`
8. **Line 74:** `k × [v₁, v₂] = [k × v₁, k × v₂]`
9. **Line 76:** `[3, 4]`, `[6, 8]`, `[1.5, 2]`, `[-3, -4]`
10. **Line 80:** `a = [a₁, a₂]`, `b = [b₁, b₂]`, `a · b = a₁ × b₁ + a₂ × b₂`
11. **Line 82:** `a · b = |a| × |b| × cos(θ)`, `θ`
12. **Line 86:** `cos(90°) = 0`
13. **Line 92:** `2×3` matrix
14. **Line 99:** `1000×5` matrix
15. **Line 103:** `2×2` rotation matrix
16. **Line 110:** `[1, 0]`, `[0, 1]`
17. **Line 162:** Code comment: `√14 ≈ 3.74`
18. **Line 221:** Code comment: `(3×1) + (4×2) = 11`
19. **Line 363:** Code comment: `2×3` matrix

**Total:** 19+ locations updated with inline code formatting

---

## Verification

### Chapter References
- ✅ Chapter 18: PageRank (renamed from 19)
- ✅ Chapter 19: Linear Algebra (renamed from 18)
- ✅ All cross-references updated (Ch 18 PageRank in past tense, Ch 20 in future)

### Math Formula Standard
- ✅ All vector notations in code blocks: `[x, y]`
- ✅ All mathematical expressions in code blocks: `√(x² + y²)`
- ✅ All matrix dimensions in code blocks: `2×3`
- ✅ All formulas in code blocks: `a · b = |a| × |b| × cos(θ)`

### Consistency
- ✅ PageRank intro unchanged (no content edits needed)
- ✅ Linear Algebra intro rewritten for new chapter order
- ✅ All chapter numbers consistent throughout
- ✅ Past/future tense correct for chapter references

---

## Files Status

**Modified:**
- `18-pagerank-algorithm.md` - Chapter number updated in front matter
- `19-linear-algebra.md` - Chapter number updated, intro rewritten, all math formulas wrapped, cross-references updated
- `_config.yml` - Left sidebar navigation reordered (PageRank before Linear Algebra)

**Deleted:**
- `18-linear-algebra-OLD.md` - Old backup no longer needed
- `18-linear-algebra.md` - Replaced by renamed `19-linear-algebra.md`
- `19-pagerank-algorithm.md` - Replaced by renamed `18-pagerank-algorithm.md`

**Created:**
- `CHAPTER_REORDER_SUMMARY.md` - This file

---

## New Documentation Standard

**Going forward, ALL chapters must follow:**

### Math Formula Rule
ALL mathematical expressions wrapped in inline code blocks:
- Vectors: `[x, y]`, `[a₁, a₂]`
- Formulas: `√(x² + y²)`, `a · b = |a| × |b| × cos(θ)`
- Matrix dimensions: `2×3`, `1000×5`
- Angles: `θ`, `cos(90°)`
- Approximations: `≈`, `√30 ≈ 5.48`

**Examples:**
```markdown
✅ CORRECT: The magnitude is `√(x² + y²)` for 2D vectors.
✅ CORRECT: A `2×3` matrix has 2 rows and 3 columns.
✅ CORRECT: The dot product formula is `a · b = a₁ × b₁ + a₂ × b₂`.

❌ INCORRECT: The magnitude is √(x² + y²) for 2D vectors.
❌ INCORRECT: A 2×3 matrix has 2 rows and 3 columns.
❌ INCORRECT: The dot product formula is a · b = a₁ × b₁ + a₂ × b₂.
```

### Benefits
1. **Consistent formatting** - Math looks like code throughout book
2. **Better readability** - Formulas stand out visually
3. **Markdown rendering** - Works better in GitHub Pages
4. **Professional appearance** - Matches technical book standards

---

## Impact Summary

**Files affected:** 3 (PageRank chapter, Linear Algebra chapter, _config.yml navigation)
**Chapters affected:** 2 (PageRank, Linear Algebra)
**Lines modified:** ~30 (intro rewrites + formula wrapping + nav config)
**Chapter numbers changed:** 2 (18↔19 swap)
**Cross-references updated:** 5 (intro x2, building intuition, summary x2)
**Math formulas wrapped:** 19+ locations

**Quality improvement:** Pedagogical flow enhanced, formatting standardized, navigation updated

---

## Ready for Review

All changes complete. Files ready to push once approved.

**Review checklist:**
- [ ] Chapter order makes pedagogical sense (PageRank → Linear Algebra)
- [ ] Left sidebar navigation updated in _config.yml
- [ ] Intro flows well (references Ch 18 PageRank in past tense)
- [ ] Math formulas look good in code blocks
- [ ] No broken cross-references
- [ ] Standard is clear for future chapters
