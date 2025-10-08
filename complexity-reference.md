---
layout: chapter
title: "Complexity Reference"
description: "Quick reference guide for algorithm and data structure complexity analysis"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>

# Algorithm & Data Structure Complexity Reference

A comprehensive quick-reference guide for time and space complexity of algorithms and data structures covered in this book. Use this as a study aid for technical interviews, architecture decisions, or performance optimization.

## Searching Algorithms

| Algorithm | Best Case | Average Case | Worst Case | Space | When to Use |
|-----------|-----------|--------------|------------|-------|-------------|
| **Linear Search** | O(1) | O(n) | O(n) | O(1) | Unsorted data, small datasets, single search |
| **Binary Search** | O(1) | O(log n) | O(log n) | O(1) | Sorted data, repeated searches |

**Key Insight:** Binary search requires sorted data but reduces search time exponentially. For 1 million items, linear search averages 500,000 comparisons while binary search needs only 20.

## Sorting Algorithms

### Basic Sorts (Chapter 4)

| Algorithm | Best Case | Average Case | Worst Case | Space | Stable | When to Use |
|-----------|-----------|--------------|------------|-------|--------|-------------|
| **Bubble Sort** | O(n) | O(n²) | O(n²) | O(1) | Yes | Educational purposes, nearly sorted data |
| **Insertion Sort** | O(n) | O(n²) | O(n²) | O(1) | Yes | Small datasets (n < 50), nearly sorted data |
| **Selection Sort** | O(n²) | O(n²) | O(n²) | O(1) | No | Memory constrained (minimal writes) |

### Advanced Sorts (Chapter 5)

| Algorithm | Best Case | Average Case | Worst Case | Space | Stable | When to Use |
|-----------|-----------|--------------|------------|-------|--------|-------------|
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes | Guaranteed O(n log n), linked lists, external sorting |
| **Quicksort** | O(n log n) | O(n log n) | O(n²) | O(log n) | No | General purpose, in-place sorting, cache-friendly |
| **Heap Sort** | O(n log n) | O(n log n) | O(n log n) | O(1) | No | Guaranteed O(n log n) with O(1) space |

**Choosing a Sort:**
- **Need stability?** → Merge Sort or Insertion Sort
- **Limited memory?** → Heap Sort or Quicksort
- **Guaranteed performance?** → Merge Sort or Heap Sort
- **General purpose?** → Quicksort (Swift's default sort uses variations of it)

## Data Structures

### Linear Structures

| Structure | Access | Search | Insert | Delete | Space | Chapter |
|-----------|--------|--------|--------|--------|-------|---------|
| **Array** | O(1) | O(n) | O(n) | O(n) | O(n) | Throughout |
| **Linked List** | O(n) | O(n) | O(1)* | O(1)* | O(n) | 8 |
| **Stack** | O(n) | O(n) | O(1) | O(1) | O(n) | 10 |
| **Queue** | O(n) | O(n) | O(1) | O(1) | O(n) | 10 |

*Insert/Delete O(1) when you have direct reference to the node

### Tree Structures

| Structure | Access | Search | Insert | Delete | Space | Chapter |
|-----------|--------|--------|--------|--------|-------|---------|
| **Binary Search Tree** | O(log n) avg<br>O(n) worst | O(log n) avg<br>O(n) worst | O(log n) avg<br>O(n) worst | O(log n) avg<br>O(n) worst | O(n) | 11 |
| **Balanced BST (AVL)** | O(log n) | O(log n) | O(log n) | O(log n) | O(n) | 11 |
| **Trie** | O(k)* | O(k)* | O(k)* | O(k)* | O(ALPHABET_SIZE × k × n) | 13 |
| **Heap (Binary)** | O(n)** | O(n) | O(log n) | O(log n)*** | O(n) | 15 |

*k = length of key/string
**Access to arbitrary elements; peek at min/max is O(1)
***Extract min/max is O(log n)

### Hash-Based Structures

| Structure | Access | Search | Insert | Delete | Space | Chapter |
|-----------|--------|--------|--------|--------|-------|---------|
| **Hash Table** | N/A | O(1) avg<br>O(n) worst | O(1) avg<br>O(n) worst | O(1) avg<br>O(n) worst | O(n) | 14 |

**Hash Table Performance Factors:**
- Load factor (elements/buckets) affects performance
- Good hash function crucial for O(1) average case
- Resize when load factor exceeds ~0.75

### Graph Structures

| Operation | Adjacency List | Adjacency Matrix | Chapter |
|-----------|---------------|------------------|---------|
| **Add Vertex** | O(1) | O(V²) | 12 |
| **Add Edge** | O(1) | O(1) | 12 |
| **Remove Vertex** | O(V + E) | O(V²) | 12 |
| **Remove Edge** | O(E) | O(1) | 12 |
| **Query Edge** | O(V) | O(1) | 12 |
| **Space** | O(V + E) | O(V²) | 12 |

**Choosing Graph Representation:**
- **Dense graphs (many edges)?** → Adjacency Matrix
- **Sparse graphs (few edges)?** → Adjacency List
- **Need fast edge queries?** → Adjacency Matrix
- **Memory constrained?** → Adjacency List

## Graph Algorithms

| Algorithm | Time Complexity | Space Complexity | Chapter |
|-----------|----------------|------------------|---------|
| **BFS Traversal** | O(V + E) | O(V) | 12 |
| **DFS Traversal** | O(V + E) | O(V) | 12 |
| **Dijkstra (Array)** | O(V²) | O(V) | 12 |
| **Dijkstra (Heap)** | O((V + E) log V) | O(V) | 12 |
| **PageRank** | O(V + E) per iteration | O(V) | 18 |

**BFS vs DFS:**
- **BFS:** Level-order, shortest path in unweighted graphs, uses Queue
- **DFS:** Explores deeply, cycle detection, uses Stack (or recursion)

## Advanced Algorithms

| Algorithm | Time Complexity | Space Complexity | Chapter |
|-----------|----------------|------------------|---------|
| **Dynamic Programming (Memoization)** | O(n) to O(n²)* | O(n) to O(n²)* | 16 |
| **Fibonacci (Naive)** | O(2^n) | O(n) | 16 |
| **Fibonacci (Memoized)** | O(n) | O(n) | 16 |
| **Coin Change** | O(n × m)** | O(n) | 16 |

*Depends on problem structure
**n = target amount, m = number of coin denominations

## Vector & Matrix Operations (Quiver)

| Operation | Time Complexity | Chapter |
|-----------|----------------|---------|
| **Vector Addition/Subtraction** | O(n) | 17 |
| **Scalar Multiplication** | O(n) | 17 |
| **Dot Product** | O(n) | 17 |
| **Vector Magnitude** | O(n) | 17 |
| **Normalization** | O(n) | 17 |
| **Cosine Similarity** | O(n) | 19 |
| **k-NN Search (Brute Force)** | O(n × d)* | 19 |

*n = number of vectors, d = dimension

## Common Complexity Patterns

### Recognize These in Code

**O(1) - Constant:**
- Array access by index: `array[i]`
- Hash table lookup (average): `dictionary[key]`
- Stack/Queue push/pop
- Basic arithmetic operations

**O(log n) - Logarithmic:**
- Binary search
- Balanced tree operations
- Finding number of digits: `while n > 0 { n /= 10 }`

**O(n) - Linear:**
- Single loop through array
- Linear search
- Finding min/max in unsorted array
- Sum/average of elements

**O(n log n) - Linearithmic:**
- Efficient sorting (merge sort, heap sort, quicksort average)
- Building a BST from unsorted array (balanced)

**O(n²) - Quadratic:**
- Nested loops over same dataset
- Bubble sort, insertion sort, selection sort
- Naive duplicate detection

**O(2^n) - Exponential:**
- Naive recursive Fibonacci
- Generating all subsets
- Solving Tower of Hanoi

**O(n!) - Factorial:**
- Generating all permutations
- Traveling salesman (brute force)

## Swift-Specific Performance Notes

### Collection Performance

| Collection Type | Access | Insert (End) | Insert (Middle) | Search | Best Use Case |
|----------------|--------|--------------|-----------------|--------|---------------|
| **Array** | O(1) | O(1) amortized | O(n) | O(n) | Ordered data, frequent access |
| **Set** | N/A | O(1) avg | N/A | O(1) avg | Unique elements, membership tests |
| **Dictionary** | O(1) avg | O(1) avg | N/A | O(1) avg | Key-value pairs, fast lookup |

### Copy-on-Write Optimization

Swift's copy-on-write means:
- Copying an Array/Dictionary/Set is O(1) until mutation
- Passing collections to functions is cheap
- Mutating shared collections triggers O(n) copy

### When to Use Which?

**Array:**
- Need ordered elements
- Frequent indexed access
- Building cache-friendly algorithms

**Set:**
- Need unique elements
- Fast membership testing
- No ordering required

**Dictionary:**
- Key-value associations
- Fast lookups by key
- Counting occurrences

## Decision Flowcharts

### Choosing a Sorting Algorithm

```
Start: What's your priority?

1. Stability required?
   Yes → Merge Sort or Insertion Sort (small n)
   No → Continue to 2

2. Memory constrained?
   Yes → Heap Sort or Quicksort
   No → Continue to 3

3. Need guaranteed O(n log n)?
   Yes → Merge Sort or Heap Sort
   No → Quicksort (fastest average case)
```

### Choosing a Data Structure

```
Start: What operation is most frequent?

1. Fast lookup by key?
   → Hash Table (Dictionary)

2. Fast lookup with ordering?
   → Balanced BST (or use Array + Binary Search if mostly read-only)

3. FIFO processing?
   → Queue

4. LIFO processing?
   → Stack

5. Priority-based processing?
   → Heap (Priority Queue)

6. Prefix/autocomplete operations?
   → Trie

7. Relationship/connection queries?
   → Graph (Adjacency List or Matrix)
```

## Common Interview Patterns

### Two Pointers
- **Complexity:** O(n)
- **Use:** Palindrome check, pair sum in sorted array
- **Chapter:** 3 (Binary Search uses this concept)

### Sliding Window
- **Complexity:** O(n)
- **Use:** Substring problems, array problems
- **Related:** Chapter 3 concepts

### Recursion with Memoization
- **Complexity:** Reduces O(2^n) to O(n) or O(n²)
- **Use:** DP problems, tree traversal
- **Chapter:** 16 (Dynamic Programming)

### BFS/DFS
- **Complexity:** O(V + E)
- **Use:** Tree/graph traversal, shortest path, connectivity
- **Chapter:** 11 (Trees), 12 (Graphs)

### Divide and Conquer
- **Complexity:** Often O(n log n)
- **Use:** Sorting, searching, optimization
- **Chapters:** 5 (Merge/Quicksort), 3 (Binary Search)

## Performance Optimization Tips

### 1. Choose the Right Data Structure
- Hash Table over Array for lookups: O(1) vs O(n)
- BST for ordered iteration: O(log n) operations
- Trie for prefix operations: O(k) where k = string length

### 2. Avoid Unnecessary Work
- Cache computed values (memoization)
- Break loops early when possible
- Use lazy evaluation when appropriate

### 3. Consider Swift Optimizations
- Use `reserveCapacity()` for Arrays when size is known
- Leverage copy-on-write for efficient passing
- Profile with Instruments before optimizing

### 4. Space-Time Tradeoffs
- Hash tables: Use O(n) space to achieve O(1) lookup
- Dynamic programming: Store O(n) results to reduce O(2^n) to O(n)
- Consider if extra space is worth the time savings

## Quick Complexity Comparison

### Searching 1,000,000 Items

| Method | Comparisons |
|--------|-------------|
| Linear Search (avg) | 500,000 |
| Binary Search (sorted) | 20 |
| Hash Table (avg) | 1 |

### Sorting 10,000 Items

| Algorithm | Operations (approx) |
|-----------|---------------------|
| Bubble Sort | 100,000,000 |
| Insertion Sort | 50,000,000 |
| Merge Sort | 130,000 |
| Quicksort (avg) | 130,000 |

### Graph Traversal (1000 vertices, 5000 edges)

| Method | Operations |
|--------|------------|
| BFS/DFS | 6,000 (V + E) |
| Dijkstra (array) | 1,000,000 (V²) |
| Dijkstra (heap) | ~45,000 ((V+E) log V) |

## References to Book Chapters

- **Searching:** Chapter 3
- **Basic Sorting:** Chapter 4
- **Advanced Sorting:** Chapter 5
- **Recursion:** Chapter 6
- **Generics:** Chapter 7
- **Linked Lists:** Chapter 8
- **Stacks & Queues:** Chapter 10
- **Binary Search Trees:** Chapter 11
- **Graphs:** Chapter 12
- **Tries:** Chapter 13
- **Hash Tables:** Chapter 14
- **Heaps:** Chapter 15
- **Dynamic Programming:** Chapter 16
- **Linear Algebra:** Chapter 17
- **PageRank:** Chapter 18
- **Semantic Search:** Chapter 19

---

**Pro Tip:** Bookmark this page for quick reference during coding interviews and technical discussions. When in doubt about which algorithm or data structure to use, start here.
