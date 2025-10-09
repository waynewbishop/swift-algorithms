---
layout: chapter
title: "Glossary"
description: "Comprehensive reference of algorithms, data structures, and performance concepts"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>

# Glossary

A comprehensive reference of algorithms, data structures, and performance terminology used throughout the Swift Algorithms & Data Structures book. Terms link to Wikipedia articles for additional context and deeper exploration.

## A

**Algorithm** - [Wikipedia](https://en.wikipedia.org/wiki/Algorithm)
A step-by-step procedure for solving a problem or completing a task. Algorithms are the fundamental building blocks of computer science and software development.

**Amortized Analysis** - [Wikipedia](https://en.wikipedia.org/wiki/Amortized_analysis)
A method for analyzing the average performance of operations over a sequence of executions. Used to show that while some operations may be expensive, the average cost remains low (e.g., dynamic array resizing).

**Array** - [Wikipedia](https://en.wikipedia.org/wiki/Array_data_structure)
A contiguous collection of elements stored sequentially in memory. Arrays provide O(1) random access by index but O(n) insertion and deletion in the middle.

**Asymptotic Analysis** - [Wikipedia](https://en.wikipedia.org/wiki/Asymptotic_analysis)
The study of how algorithm performance scales as input size approaches infinity. Big O notation expresses asymptotic behavior by focusing on dominant terms.

**AVL Tree** - [Wikipedia](https://en.wikipedia.org/wiki/AVL_tree)
A self-balancing binary search tree where the height difference between left and right subtrees is at most one. Named after inventors Adelson-Velsky and Landis.

## B

**Balanced Tree** - [Wikipedia](https://en.wikipedia.org/wiki/Self-balancing_binary_search_tree)
A tree data structure where the heights of subtrees differ by at most a constant factor. Balanced trees maintain O(log n) operations by preventing degeneration into linked lists.

**Best Case** - [Wikipedia](https://en.wikipedia.org/wiki/Best,_worst_and_average_case)
The minimum number of operations an algorithm performs for the most favorable input. Best case analysis shows optimal performance but may not represent typical behavior.

**Big O Notation** - [Wikipedia](https://en.wikipedia.org/wiki/Big_O_notation)
A mathematical notation that describes the upper bound of an algorithm's growth rate. Big O classifies algorithms by how their performance scales with input size (e.g., O(n), O(log n), O(n²)).

**Binary Search** - [Wikipedia](https://en.wikipedia.org/wiki/Binary_search_algorithm)
A search algorithm that repeatedly divides a sorted collection in half, eliminating half the remaining elements with each comparison. Achieves O(log n) performance on sorted data.

**Binary Search Tree (BST)** - [Wikipedia](https://en.wikipedia.org/wiki/Binary_search_tree)
A tree data structure where each node has at most two children, with left children smaller than the parent and right children larger. Supports O(log n) search, insertion, and deletion in balanced cases.

**Binary Tree** - [Wikipedia](https://en.wikipedia.org/wiki/Binary_tree)
A tree data structure where each node has at most two children, typically called left and right. Binary trees form the foundation for many efficient data structures.

**Breadth-First Search (BFS)** - [Wikipedia](https://en.wikipedia.org/wiki/Breadth-first_search)
A graph traversal algorithm that explores all nodes at the current depth before moving to the next level. Uses a queue and is ideal for finding shortest paths in unweighted graphs.

**Bubble Sort** - [Wikipedia](https://en.wikipedia.org/wiki/Bubble_sort)
A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they're in the wrong order. Has O(n²) time complexity but is easy to implement.

## C

**Cache** - [Wikipedia](https://en.wikipedia.org/wiki/CPU_cache)
Fast memory that stores frequently accessed data close to the processor. Cache-friendly algorithms that access memory sequentially often outperform theoretically faster algorithms with poor cache locality.

**Chaining** - [Wikipedia](https://en.wikipedia.org/wiki/Hash_table#Separate_chaining)
A collision resolution technique in hash tables where each bucket contains a linked list of all entries that hash to the same index. Allows unlimited entries but degrades to O(n) lookup in worst case.

**Collision** - [Wikipedia](https://en.wikipedia.org/wiki/Hash_collision)
When two different keys hash to the same index in a hash table. Collision resolution strategies include chaining and open addressing.

**Comparable** - [Wikipedia](https://en.wikipedia.org/wiki/Relational_operator)
A Swift protocol requiring types to implement comparison operators (<, <=, >, >=). Binary search trees and sorting algorithms require Comparable types to order elements.

**Complexity** - [Wikipedia](https://en.wikipedia.org/wiki/Computational_complexity)
A measure of how algorithm performance grows with input size. Includes time complexity (operations) and space complexity (memory usage).

**Constant Time - O(1)** - [Wikipedia](https://en.wikipedia.org/wiki/Time_complexity#Constant_time)
An operation that takes the same amount of time regardless of input size. Examples include array access by index and hash table lookup (average case).

## D

**Depth-First Search (DFS)** - [Wikipedia](https://en.wikipedia.org/wiki/Depth-first_search)
A graph traversal algorithm that explores as far down each branch as possible before backtracking. Uses a stack (or recursion) and is useful for detecting cycles and topological sorting.

**Dictionary** - [Wikipedia](https://en.wikipedia.org/wiki/Associative_array)
Swift's implementation of a hash table, storing key-value pairs with average O(1) lookup, insertion, and deletion. Also called hash map or associative array.

**Dijkstra's Algorithm** - [Wikipedia](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)
A shortest-path algorithm that finds the minimum distance from a source vertex to all other vertices in a weighted graph with non-negative edge weights. Array-based implementation is O(V²), heap-based is O((V + E) log V).

**Divide and Conquer** - [Wikipedia](https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm)
An algorithm design paradigm that breaks problems into smaller subproblems, solves them recursively, and combines results. Merge sort and quicksort use divide-and-conquer strategies.

**Doubly Linked List** - [Wikipedia](https://en.wikipedia.org/wiki/Doubly_linked_list)
A linked list where each node contains references to both the next and previous nodes. Allows bidirectional traversal but uses more memory than singly linked lists.

**Dynamic Programming** - [Wikipedia](https://en.wikipedia.org/wiki/Dynamic_programming)
An optimization technique that solves complex problems by breaking them into overlapping subproblems and storing solutions to avoid redundant calculations. Reduces exponential algorithms to polynomial time.

## E

**Edge** - [Wikipedia](https://en.wikipedia.org/wiki/Glossary_of_graph_theory#edge)
A connection between two vertices in a graph, potentially with a weight representing distance or cost. Edges can be directed (one-way) or undirected (two-way).

**Equatable** - [Wikipedia](https://en.wikipedia.org/wiki/Relational_operator)
A Swift protocol requiring types to implement the equality operator (==). Required for many data structures and algorithms that need to compare elements.

**Exponential Time - O(2^n)** - [Wikipedia](https://en.wikipedia.org/wiki/Time_complexity#Exponential_time)
Algorithm performance that doubles with each additional input element. Naive recursive Fibonacci demonstrates exponential time and becomes unusable for n > 40.

## F

**Fibonacci Sequence** - [Wikipedia](https://en.wikipedia.org/wiki/Fibonacci_number)
A sequence where each number is the sum of the two preceding ones (0, 1, 1, 2, 3, 5, 8, 13...). Used to demonstrate recursive algorithms and dynamic programming optimization.

**FIFO (First-In-First-Out)** - [Wikipedia](https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics))
A data structure discipline where the first element added is the first one removed. Queues implement FIFO ordering.

**Frontier** - [Wikipedia](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Description)
In graph algorithms, the set of nodes currently being explored or considered for exploration. Dijkstra's algorithm maintains a frontier of shortest known paths.

## G

**Generic** - [Wikipedia](https://en.wikipedia.org/wiki/Generic_programming)
A programming feature allowing code to work with any type that meets specified constraints. Swift's generic system enables type-safe, reusable data structures and algorithms.

**Graph** - [Wikipedia](https://en.wikipedia.org/wiki/Graph_(abstract_data_type))
A data structure consisting of vertices (nodes) connected by edges. Graphs model relationships between entities and support algorithms like BFS, DFS, and shortest path finding.

**Greedy Algorithm** - [Wikipedia](https://en.wikipedia.org/wiki/Greedy_algorithm)
An approach that makes locally optimal choices at each step, hoping to find a global optimum. Dijkstra's algorithm uses a greedy strategy to find shortest paths.

**Growth Rate** - [Wikipedia](https://en.wikipedia.org/wiki/Time_complexity#Table_of_common_time_complexities)
How quickly an algorithm's resource requirements increase as input size grows. Common growth rates include constant, logarithmic, linear, linearithmic, quadratic, and exponential.

## H

**Hash Function** - [Wikipedia](https://en.wikipedia.org/wiki/Hash_function)
A function that converts input data into a fixed-size integer (hash value) used as an index in a hash table. Good hash functions distribute values uniformly to minimize collisions.

**Hash Table** - [Wikipedia](https://en.wikipedia.org/wiki/Hash_table)
A data structure that maps keys to values using a hash function, providing average O(1) lookup, insertion, and deletion. Swift's Dictionary is a hash table implementation.

**Hashable** - [Wikipedia](https://en.wikipedia.org/wiki/Hash_function)
A Swift protocol requiring types to provide a hash value for use in hash-based collections like Dictionary and Set. Conforming types must also be Equatable.

**Heap** - [Wikipedia](https://en.wikipedia.org/wiki/Heap_(data_structure))
A complete binary tree where parent nodes are either greater than (max heap) or less than (min heap) their children. Heaps support O(log n) insertion and O(1) peek at the extreme value.

**Height (Tree)** - [Wikipedia](https://en.wikipedia.org/wiki/Tree_(data_structure)#Terminology)
The length of the longest path from the root to a leaf node. Balanced trees maintain O(log n) height to ensure efficient operations.

## I

**In-order Traversal** - [Wikipedia](https://en.wikipedia.org/wiki/Tree_traversal#In-order_(LNR))
A binary tree traversal that visits left subtree, current node, then right subtree. For binary search trees, in-order traversal produces values in sorted order.

**Insertion Sort** - [Wikipedia](https://en.wikipedia.org/wiki/Insertion_sort)
A sorting algorithm that builds the sorted array one element at a time by repeatedly inserting elements into their correct position. O(n²) average case but O(n) for nearly sorted data.

**Iterator** - [Wikipedia](https://en.wikipedia.org/wiki/Iterator)
An object that provides sequential access to elements in a collection without exposing the underlying structure. Swift's for-in loops use iterators internally.

## K

**k-Nearest Neighbors (k-NN)** - [Wikipedia](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm)
An algorithm that finds the k most similar items to a query item based on a distance metric. Used in semantic search to find documents with similar meaning.

## L

**LIFO (Last-In-First-Out)** - [Wikipedia](https://en.wikipedia.org/wiki/Stack_(abstract_data_type))
A data structure discipline where the last element added is the first one removed. Stacks implement LIFO ordering.

**Linear Search** - [Wikipedia](https://en.wikipedia.org/wiki/Linear_search)
A search algorithm that checks each element sequentially until finding the target or reaching the end. O(n) time complexity but works on unsorted data.

**Linear Time - O(n)** - [Wikipedia](https://en.wikipedia.org/wiki/Time_complexity#Linear_time)
Algorithm performance that grows in direct proportion to input size. Linear search and single-pass array operations demonstrate linear time.

**Linearithmic Time - O(n log n)** - [Wikipedia](https://en.wikipedia.org/wiki/Time_complexity#Linearithmic_time)
Algorithm performance combining linear and logarithmic components. Efficient sorting algorithms like merge sort and quicksort achieve O(n log n) time.

**Linked List** - [Wikipedia](https://en.wikipedia.org/wiki/Linked_list)
A data structure where elements (nodes) are linked together by references rather than stored contiguously. Provides O(1) insertion/deletion at known positions but O(n) access by index.

**Logarithmic Time - O(log n)** - [Wikipedia](https://en.wikipedia.org/wiki/Time_complexity#Logarithmic_time)
Algorithm performance that grows slowly as input size increases, doubling input size only adds one operation. Binary search demonstrates logarithmic time.

## M

**Max Heap** - [Wikipedia](https://en.wikipedia.org/wiki/Heap_(data_structure)#Comparison)
A heap where parent nodes are greater than or equal to their children. The root contains the maximum value, supporting O(1) access and O(log n) insertion/deletion.

**Memoization** - [Wikipedia](https://en.wikipedia.org/wiki/Memoization)
A dynamic programming technique that stores computed results to avoid redundant calculations. Transforms exponential recursive algorithms into linear-time solutions.

**Merge Sort** - [Wikipedia](https://en.wikipedia.org/wiki/Merge_sort)
A divide-and-conquer sorting algorithm that recursively divides arrays, sorts subarrays, and merges them back together. Guarantees O(n log n) time but uses O(n) extra space.

**Min Heap** - [Wikipedia](https://en.wikipedia.org/wiki/Heap_(data_structure)#Comparison)
A heap where parent nodes are less than or equal to their children. The root contains the minimum value, useful for priority queues and shortest-path algorithms.

## N

**Node** - [Wikipedia](https://en.wikipedia.org/wiki/Node_(computer_science))
A fundamental unit in linked data structures containing data and references to other nodes. Used in linked lists, trees, and graphs.

**NP-Complete** - [Wikipedia](https://en.wikipedia.org/wiki/NP-completeness)
A class of computational problems for which no known polynomial-time algorithm exists. Many NP-complete problems require exponential time solutions or approximation algorithms.

## O

**Open Addressing** - [Wikipedia](https://en.wikipedia.org/wiki/Open_addressing)
A collision resolution technique in hash tables where collisions are resolved by probing for the next available slot. Includes linear probing, quadratic probing, and double hashing.

**Optimization** - [Wikipedia](https://en.wikipedia.org/wiki/Program_optimization)
The process of improving algorithm performance by reducing time complexity, space usage, or both. Optimization should be guided by profiling rather than guessing.

## P

**PageRank** - [Wikipedia](https://en.wikipedia.org/wiki/PageRank)
Google's algorithm for ranking web pages based on link structure. Models the probability that a random surfer visits each page, using iterative computation on a graph.

**Path** - [Wikipedia](https://en.wikipedia.org/wiki/Path_(graph_theory))
A sequence of vertices connected by edges in a graph. Shortest path algorithms find paths with minimum total weight.

**Pivot** - [Wikipedia](https://en.wikipedia.org/wiki/Quicksort#Algorithm)
In quicksort, the element used to partition the array into elements smaller and larger than the pivot. Pivot selection strategy affects quicksort performance.

**Post-order Traversal** - [Wikipedia](https://en.wikipedia.org/wiki/Tree_traversal#Post-order_(LRN))
A binary tree traversal that visits left subtree, right subtree, then current node. Used for deleting trees and evaluating expression trees.

**Pre-order Traversal** - [Wikipedia](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order_(NLR))
A binary tree traversal that visits the current node before its subtrees. Used for copying trees and prefix notation expression evaluation.

**Priority Queue** - [Wikipedia](https://en.wikipedia.org/wiki/Priority_queue)
An abstract data type where elements are dequeued in priority order rather than insertion order. Typically implemented with heaps for O(log n) operations.

**Profiling** - [Wikipedia](https://en.wikipedia.org/wiki/Profiling_(computer_programming))
Measuring actual program performance to identify bottlenecks. Xcode's Time Profiler helps determine which code sections consume the most time.

## Q

**Quadratic Time - O(n²)** - [Wikipedia](https://en.wikipedia.org/wiki/Time_complexity#Quadratic_time)
Algorithm performance where doubling input size roughly quadruples runtime. Nested loops and basic sorting algorithms demonstrate quadratic time.

**Queue** - [Wikipedia](https://en.wikipedia.org/wiki/Queue_(abstract_data_type))
A FIFO data structure supporting enqueue (add to back) and dequeue (remove from front) operations. Used in BFS, task scheduling, and buffering.

**Quicksort** - [Wikipedia](https://en.wikipedia.org/wiki/Quicksort)
A divide-and-conquer sorting algorithm that partitions arrays around a pivot and recursively sorts partitions. Average case O(n log n) but worst case O(n²).

## R

**Recursion** - [Wikipedia](https://en.wikipedia.org/wiki/Recursion_(computer_science))
A programming technique where functions call themselves to solve problems by breaking them into smaller instances. Requires a base case to prevent infinite recursion.

**Red-Black Tree** - [Wikipedia](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree)
A self-balancing binary search tree with additional color properties ensuring O(log n) operations. Used in many standard library implementations.

**Reference Type** - [Wikipedia](https://en.wikipedia.org/wiki/Reference_(computer_science))
A type where variables hold references to shared instances rather than copies. Swift classes are reference types, while structs and enums are value types.

## S

**Selection Sort** - [Wikipedia](https://en.wikipedia.org/wiki/Selection_sort)
A sorting algorithm that repeatedly finds the minimum element and places it at the beginning. O(n²) time complexity but minimizes the number of swaps.

**Semantic Search** - [Wikipedia](https://en.wikipedia.org/wiki/Semantic_search)
Search based on meaning rather than keyword matching. Uses word embeddings and cosine similarity to find semantically related documents.

**Set** - [Wikipedia](https://en.wikipedia.org/wiki/Set_(abstract_data_type))
An unordered collection of unique elements. Swift's Set provides average O(1) membership testing using hash table implementation.

**Shortest Path** - [Wikipedia](https://en.wikipedia.org/wiki/Shortest_path_problem)
The path between two vertices with minimum total edge weight. Dijkstra's algorithm finds shortest paths from a source to all vertices.

**Singly Linked List** - [Wikipedia](https://en.wikipedia.org/wiki/Linked_list#Singly_linked_list)
A linked list where each node contains data and a reference to the next node. Provides O(1) insertion/deletion at known positions but only forward traversal.

**Space Complexity** - [Wikipedia](https://en.wikipedia.org/wiki/Space_complexity)
A measure of how much memory an algorithm uses relative to input size. Algorithms may trade space for time (or vice versa) to optimize performance.

**Stack** - [Wikipedia](https://en.wikipedia.org/wiki/Stack_(abstract_data_type))
A LIFO data structure supporting push (add to top) and pop (remove from top) operations. Used in function call management, undo systems, and DFS.

**Stable Sort** - [Wikipedia](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability)
A sorting algorithm that preserves the relative order of equal elements. Merge sort is stable; quicksort typically is not.

## T

**Time Complexity** - [Wikipedia](https://en.wikipedia.org/wiki/Time_complexity)
A measure of how many operations an algorithm performs relative to input size. Expressed using Big O notation (O(1), O(n), O(log n), etc.).

**Topological Sort** - [Wikipedia](https://en.wikipedia.org/wiki/Topological_sorting)
An ordering of directed graph vertices where each vertex appears before its successors. Used in build systems and dependency resolution.

**Tree** - [Wikipedia](https://en.wikipedia.org/wiki/Tree_(data_structure))
A hierarchical data structure with a root node and child nodes forming a parent-child relationship. Trees have no cycles and each node (except root) has exactly one parent.

**Trie** - [Wikipedia](https://en.wikipedia.org/wiki/Trie)
A tree-like data structure for storing strings where each path from root to node represents a prefix. Efficient for autocomplete and prefix matching with O(m) operations where m is string length.

## V

**Value Type** - [Wikipedia](https://en.wikipedia.org/wiki/Value_type_and_reference_type)
A type where variables hold independent copies rather than references to shared instances. Swift structs and enums are value types, while classes are reference types.

**Vector** - [Wikipedia](https://en.wikipedia.org/wiki/Euclidean_vector)
In linear algebra, an ordered list of numbers representing magnitude and direction. Used in machine learning, graphics, and semantic search for representing data in multi-dimensional space.

**Vertex** - [Wikipedia](https://en.wikipedia.org/wiki/Vertex_(graph_theory))
A node in a graph that may be connected to other vertices by edges. Vertices represent entities while edges represent relationships.

## W

**Weight** - [Wikipedia](https://en.wikipedia.org/wiki/Glossary_of_graph_theory#weighted_graph)
A numeric value associated with a graph edge representing cost, distance, or capacity. Weighted graphs require algorithms like Dijkstra's for shortest paths.

**Word Embedding** - [Wikipedia](https://en.wikipedia.org/wiki/Word_embedding)
A vector representation of a word that captures semantic meaning through position in multi-dimensional space. Words with similar meanings have similar embeddings.

**Worst Case** - [Wikipedia](https://en.wikipedia.org/wiki/Best,_worst_and_average_case)
The maximum number of operations an algorithm performs for the least favorable input. Big O notation typically describes worst-case performance.

## Additional Resources

For more information on specific topics, refer to the relevant chapters:

- **Searching**: Chapter 3 (Basic Searching)
- **Sorting**: Chapters 4-5 (Basic and Advanced Sorting)
- **Recursion**: Chapter 6
- **Performance**: Chapters 2, 8 (Measuring Performance, Analyzing Algorithms)
- **Data Structures**: Chapters 9-15 (Linked Lists through Heaps)
- **Graphs**: Chapter 12
- **Dynamic Programming**: Chapter 16
- **Advanced Topics**: Chapters 17-19 (Linear Algebra, PageRank, Semantic Search)
