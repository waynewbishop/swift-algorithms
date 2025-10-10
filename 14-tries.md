---
layout: chapter
title: "Chapter 14: Tries"
description: "Implement prefix trees for efficient string operations"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Tries

[Tries](https://en.wikipedia.org/wiki/Trie) are [tree](https://en.wikipedia.org/wiki/Tree_(data_structure))-based data structures that organize information in a hierarchy. Often pronounced "try", the term comes from the English language verb to retrieve. While most [algorithms](https://en.wikipedia.org/wiki/Algorithm) are designed to manipulate generic data, tries are commonly used with Strings.

Tries specialize the tree structures from [Chapters 11-12](11-binary-search-trees.md) for string operations. While binary search trees store values in nodes and have two children (left/right), tries store characters in nodes and can have many children (one per character in the alphabet). This makes tries exceptionally efficient for prefix-based operations like autocomplete—a task that would require O(n) time with other data structures but takes only O(p) time with tries, where p is the prefix length.

Like graphs from [Chapter 13](13-graphs.md), tries combine multiple data structures. Each node contains a dictionary (hash table) mapping characters to child nodes, providing O(1) child lookup. This hybrid approach—trees for hierarchy, hash tables for fast access—demonstrates how combining structures creates specialized solutions for specific problems.

In this chapter, we'll review trie structures and implement autocomplete functionality in Swift.

## How it works

As discussed, tries organize data in a hierarchy. To see how they work, let's build a Dictionary that contains the following words:

- Ball
- Balls
- Ballard
- Bat
- Bar
- Cat
- Dog

At first glance, we see words prefixed with the phrase "Ba", while entries like "Ballard" combine words and phrases (e.g., "Ball" and "Ballard"). Even though our dictionary contains a limited quantity of words, a thousand-item list would have the same characteristics. As with any algorithm, we'll apply our knowledge to build an efficient model. To start, let's create a new trie for the word "Ball":

[diagram: Trie structure showing hierarchical storage of "Ball" with shared prefix "Ba"]

Tries involve building hierarchies, storing phrases along the way until a word is created (seen in yellow). With so many permutations, it's important to know what qualifies as an actual word. For example, even though we've stored the phrase "Ba", it's not identified as a word.

## The data structure

Here's an example of a trie data structure written in Swift. In addition to storing a key, the structure also includes a dictionary for identifying its children. Unlike a [binary search tree](https://en.wikipedia.org/wiki/Binary_search_tree) from Chapters 11-12, a trie can store an unlimited number of leaf [nodes](https://en.wikipedia.org/wiki/Node_(computer_science)). The boolean value isEndOfWord will allow us to distinguish words and phrases. Finally, the level will indicate the node's level in the tree hierarchy.

```swift
// Trie node with dictionary-based children for O(1) character lookup
public class TrieNode {
    var key: String?
    var children: [Character: TrieNode]  // Hash table for O(1) child access
    var isEndOfWord: Bool
    var level: Int

    public init() {
        self.children = [:]
        self.isEndOfWord = false
        self.level = 0
    }
}

// Trie structure for efficient prefix-based string operations
public class Trie {
    private let root = TrieNode()

    public init() {}
}
```

The dictionary-based children provide O(1) access to child nodes, a significant improvement over array-based storage which would require O(k) time where k is the number of children.

## Adding words

Using the enhanced TrieNode data structure, we can efficiently add words to our trie. Recall from [Chapter 8](08-performance-analysis.md) how hash tables provide O(1) lookups—our trie leverages this for fast child access:

```swift
// Insert word into trie character by character - O(m) where m is word length
extension Trie {
    public func insert(_ word: String) {
        guard !word.isEmpty else { return }

        var current = root
        var level = 0

        for character in word.lowercased() {
            level += 1

            // Create new node if character doesn't exist
            if current.children[character] == nil {
                let newNode = TrieNode()
                newNode.key = String(character)
                newNode.level = level
                current.children[character] = newNode
            }

            current = current.children[character]!
        }

        // Mark the end of a complete word
        current.isEndOfWord = true
    }
}

// Example: Build trie from word list
let trie = Trie()
let words = ["ball", "balls", "ballard", "bat", "bar", "cat", "dog"]

for word in words {
    trie.insert(word)
}
```

Insertion is O(m) where m is the word length. Unlike binary search trees which compare entire values, tries process one character at a time, making performance independent of dictionary size.

## Searching for words

The primary advantage of tries is efficient prefix-based searching. We can search for complete words or find all words with a given prefix:

```swift
// Search for complete word or prefix - O(m) where m is query length
extension Trie {
    public func search(_ word: String) -> Bool {
        guard !word.isEmpty else { return false }

        var current = root

        for character in word.lowercased() {
            guard let nextNode = current.children[character] else {
                return false  // Character not found
            }
            current = nextNode
        }

        return current.isEndOfWord
    }

    public func startsWith(_ prefix: String) -> Bool {
        guard !prefix.isEmpty else { return true }

        var current = root

        for character in prefix.lowercased() {
            guard let nextNode = current.children[character] else {
                return false  // Prefix not found
            }
            current = nextNode
        }

        return true  // Prefix exists in trie
    }
}

// Example usage demonstrating word vs prefix distinction
print(trie.search("ball"))      // true (complete word)
print(trie.search("bal"))       // false (not a complete word)
print(trie.startsWith("bal"))   // true (prefix exists)
print(trie.startsWith("cat"))   // true
print(trie.startsWith("car"))   // false
```

## Autocomplete with tries

One of the most practical applications of tries is autocomplete functionality. Here's how to implement word suggestions:

```swift
// Autocomplete using recursive tree traversal - O(p + n) where p=prefix length, n=results
extension Trie {
    public func autocomplete(prefix: String, maxSuggestions: Int = 10) -> [String] {
        guard !prefix.isEmpty else { return [] }

        // Find the node representing the prefix
        var current = root
        for character in prefix.lowercased() {
            guard let nextNode = current.children[character] else {
                return []  // Prefix not found
            }
            current = nextNode
        }

        // Collect all words with this prefix
        var suggestions: [String] = []
        collectWords(from: current,
                    currentWord: prefix.lowercased(),
                    suggestions: &suggestions,
                    maxCount: maxSuggestions)

        return suggestions
    }

    private func collectWords(from node: TrieNode,
                            currentWord: String,
                            suggestions: inout [String],
                            maxCount: Int) {
        // Stop if we have enough suggestions
        guard suggestions.count < maxCount else { return }

        // If this node represents a complete word, add it
        if node.isEndOfWord {
            suggestions.append(currentWord)
        }

        // Recursively explore all children
        for (character, childNode) in node.children {
            collectWords(from: childNode,
                        currentWord: currentWord + String(character),
                        suggestions: &suggestions,
                        maxCount: maxCount)
        }
    }
}

// Example: Get autocomplete suggestions
let suggestions = trie.autocomplete(prefix: "ba")
print("Autocomplete for 'ba': \(suggestions)")
// Outputs: ["ball", "balls", "ballard", "bar", "bat"] (order may vary)
```

The `collectWords` helper uses recursion (from [Chapter 6](06-recursion.md)) to traverse the trie subtree, accumulating all complete words that share the given prefix.

## Real-world applications

Tries excel in several practical scenarios:

### 1. Search engines

```swift
// Simplified search suggestion system using tries
class SearchEngine {
    private let trie = Trie()

    func indexSearchTerms(_ terms: [String]) {
        for term in terms {
            trie.insert(term)
        }
    }

    func getSuggestions(for query: String) -> [String] {
        return trie.autocomplete(prefix: query, maxSuggestions: 5)
    }
}

let searchEngine = SearchEngine()
searchEngine.indexSearchTerms(["swift", "swiftui", "swift programming", "swift algorithms"])
print(searchEngine.getSuggestions(for: "swift"))
```

### 2. Spell checker

```swift
// Basic spell checking functionality with correction suggestions
extension Trie {
    func isValidWord(_ word: String) -> Bool {
        return search(word)
    }

    func suggestCorrections(for word: String) -> [String] {
        // Simple approach: find words with similar prefixes
        let prefixes = [
            String(word.dropLast()),           // Remove last character
            String(word.dropFirst())           // Remove first character
        ]

        var suggestions: [String] = []
        for prefix in prefixes {
            suggestions.append(contentsOf: autocomplete(prefix: prefix, maxSuggestions: 3))
        }

        return Array(Set(suggestions))  // Remove duplicates
    }
}
```

## Performance analysis

Tries offer excellent performance characteristics for string operations, with complexity independent of dictionary size (from [Chapter 8](08-performance-analysis.md) analysis):

### Time complexity:
- Insert: O(m) where m is the length of the word
- Search: O(m) where m is the length of the word
- Autocomplete: O(p + n) where p is prefix length and n is number of results
- Delete: O(m) where m is the length of the word

### Space complexity:
- Overall: O(ALPHABET_SIZE × N × M) in worst case
- Practical: Much better due to shared prefixes

### Compared to other data structures:

| Operation | Hash Table (Ch 15) | Binary Search Tree (Ch 11) | Trie |
|-----------|------------|-------------------|------|
| Search | O(1) average | O(log n) | O(m) |
| Insert | O(1) average | O(log n) | O(m) |
| Prefix Search | O(n) | O(n) | O(p) |
| Autocomplete | O(n) | O(n) | O(p + k) |

Where m = word length, p = prefix length, k = number of results, n = total words

**Key insight**: Tries are the only structure with O(p) prefix search. Hash tables and BSTs must examine all n entries to find prefix matches.

## Building algorithmic intuition

Tries demonstrate several important algorithmic concepts:

1. **Space-Time Trade-offs**: Uses more memory to achieve faster prefix operations
2. **Shared Structure**: Common prefixes are stored only once
3. **Recursive Patterns**: Tree traversal follows recursive patterns from Chapter 6
4. **Hash Table Integration**: Modern implementation uses hash tables (Chapter 15) for child storage

When to choose tries:
- **Autocomplete systems** - Natural fit for prefix-based searches
- **Spell checkers** - Efficient word validation and suggestion
- **IP routing tables** - Network prefix matching
- **Text processing** - When prefix operations are frequent

When to avoid tries:
- **Simple word lookup** - Hash tables are simpler and faster (O(1) vs O(m))
- **No prefix operations** - Memory overhead not justified
- **Very large alphabet** - Space complexity grows with alphabet size

## Summary

Tries are specialized tree structures optimized for string operations, particularly prefix-based searches and autocomplete functionality.

**Key characteristics:**
- Each node contains a character and dictionary of child nodes
- Words share common prefixes (space-efficient for related strings)
- isEndOfWord flag distinguishes complete words from prefixes
- Dictionary-based children provide O(1) character lookup
- Can have unlimited children per node (unlike binary trees)

**Core operations:**
- Insert: O(m) - traverse character by character
- Search: O(m) - independent of dictionary size
- Prefix search: O(p) - only structure with this complexity
- Autocomplete: O(p + n) - find prefix, then collect words

**Implementation highlights:**
- TrieNode uses dictionary for children (O(1) access)
- Recursive collectWords traversal (Chapter 6 patterns)
- Case-insensitive by converting to lowercase
- Level tracking for depth information

**Real-world applications:**
- Search engine suggestions (Google, Bing autocomplete)
- Spell checkers (Microsoft Word, IDE spelling)
- IP routing tables (network packet forwarding)
- Contact name search (phone autocomplete)

**Performance advantages:**
- O(p) prefix search vs O(n) for other structures
- Performance independent of dictionary size
- Shared prefixes reduce memory for related words
- Fast autocomplete without scanning entire dataset

**Connections:**
- Specializes tree structures (Chapters 11-12) for strings
- Uses hash tables (Chapter 15) for child node storage
- Applies recursion (Chapter 6) for tree traversal
- Combines multiple structures like graphs (Chapter 13)
- Analyzed using Big O notation from Chapter 8

Understanding tries is essential for implementing efficient string search and autocomplete systems. The combination of tree hierarchy and hash table lookups creates a specialized structure that excels at prefix operations—a task where general-purpose data structures struggle. In Chapter 15, you'll learn about hash tables, which provide the O(1) child lookups that make modern trie implementations so efficient.

<div class="bottom-nav">
  <div class="nav-container">
    <a href="13-graphs" class="nav-link prev">← Chapter 13: Graphs</a>
    <a href="index" class="nav-link toc">Table of Contents</a>
    <a href="15-hash-tables" class="nav-link next">Chapter 15: Hash Tables →</a>
  </div>
</div>
