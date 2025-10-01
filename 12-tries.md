---
layout: default
title: "Chapter 12: Tries"
description: "Implement prefix trees for efficient string operations"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Tries

Tries are tree-based data structures that organize information in an hierarchy. Often pronounced "try", the term comes from the English language verb to retrieve. While most algorithms are designed to manipulate generic data, tries are commonly used with Strings. In this essay, we'll review trie structures and will implement our own model with Swift.

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

Tries involve building hierarchies, storing phrases along the way until a word is created (seen in yellow). With so many permutations, it's important to know what qualifies as an actual word. For example, even though we've stored the phrase "Ba", it's not identified as a word.

## The data structure

Here's an example of a trie data structure written in Swift. In addition to storing a key, the structure also includes an array for identifying its children. Unlike a binary search tree, a trie can store an unlimited number of leaf nodes. The boolean value isFinal will allow us to distinguish words and phrases. Finally, the level will indicate the node's level in the tree hierarchy.

```swift
//enhanced trie data structure
public class TrieNode {
    var key: String?
    var children: [Character: TrieNode]  //dictionary for O(1) child access
    var isEndOfWord: Bool
    var level: Int

    public init() {
        self.children = [:]
        self.isEndOfWord = false
        self.level = 0
    }
}

public class Trie {
    private let root = TrieNode()

    public init() {}
}
```

## Adding words

Using the enhanced TrieNode data structure, we can efficiently add words to our trie. The improved implementation uses a dictionary for children, providing O(1) access time rather than O(k) where k is the number of children.

```swift
extension Trie {
    public func insert(_ word: String) {
        guard !word.isEmpty else { return }

        var current = root
        var level = 0

        for character in word.lowercased() {
            level += 1

            //create new node if character doesn't exist
            if current.children[character] == nil {
                let newNode = TrieNode()
                newNode.key = String(character)
                newNode.level = level
                current.children[character] = newNode
            }

            current = current.children[character]!
        }

        //mark the end of a complete word
        current.isEndOfWord = true
    }
}

//example usage
let trie = Trie()
let words = ["ball", "balls", "ballard", "bat", "bar", "cat", "dog"]

for word in words {
    trie.insert(word)
}
```

## Searching for words

The primary advantage of tries is efficient prefix-based searching. We can search for complete words or find all words with a given prefix:

```swift
extension Trie {
    public func search(_ word: String) -> Bool {
        guard !word.isEmpty else { return false }

        var current = root

        for character in word.lowercased() {
            guard let nextNode = current.children[character] else {
                return false  //character not found
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
                return false  //prefix not found
            }
            current = nextNode
        }

        return true  //prefix exists in trie
    }
}

//example usage
print(trie.search("ball"))      //true
print(trie.search("bal"))       //false (not a complete word)
print(trie.startsWith("bal"))   //true (prefix exists)
print(trie.startsWith("cat"))   //true
print(trie.startsWith("car"))   //false
```

## Autocomplete with tries

One of the most practical applications of tries is autocomplete functionality. Here's how to implement word suggestions:

```swift
extension Trie {
    public func autocomplete(prefix: String, maxSuggestions: Int = 10) -> [String] {
        guard !prefix.isEmpty else { return [] }

        //find the node representing the prefix
        var current = root
        for character in prefix.lowercased() {
            guard let nextNode = current.children[character] else {
                return []  //prefix not found
            }
            current = nextNode
        }

        //collect all words with this prefix
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
        //stop if we have enough suggestions
        guard suggestions.count < maxCount else { return }

        //if this node represents a complete word, add it
        if node.isEndOfWord {
            suggestions.append(currentWord)
        }

        //recursively explore all children
        for (character, childNode) in node.children {
            collectWords(from: childNode,
                        currentWord: currentWord + String(character),
                        suggestions: &suggestions,
                        maxCount: maxCount)
        }
    }
}

//example autocomplete usage
let suggestions = trie.autocomplete(prefix: "ba")
print("Autocomplete for 'ba': \(suggestions)")
//outputs: ["ball", "balls", "ballard", "bar", "bat"] (order may vary)
```

## Real-world applications

Tries excel in several practical scenarios:

### 1. Search engines
```swift
//simplified search suggestion system
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
//basic spell checking functionality
extension Trie {
    func isValidWord(_ word: String) -> Bool {
        return search(word)
    }

    func suggestCorrections(for word: String) -> [String] {
        //simple approach: find words with similar prefixes
        let prefixes = [
            String(word.dropLast()),           //remove last character
            String(word.dropFirst())           //remove first character
        ]

        var suggestions: [String] = []
        for prefix in prefixes {
            suggestions.append(contentsOf: autocomplete(prefix: prefix, maxSuggestions: 3))
        }

        return Array(Set(suggestions))  //remove duplicates
    }
}
```

## Performance analysis

Tries offer excellent performance characteristics for string operations:

### Time complexity:
- **Insert**: O(m) where m is the length of the word
- **Search**: O(m) where m is the length of the word
- **Autocomplete**: O(p + n) where p is prefix length and n is number of results
- **Delete**: O(m) where m is the length of the word

### Space complexity:
- **Overall**: O(ALPHABET_SIZE × N × M) in worst case
- **Practical**: Much better due to shared prefixes

### Compared to other data structures:

| Operation | Hash Table | Binary Search Tree | Trie |
|-----------|------------|-------------------|------|
| Search | O(1) average | O(log n) | O(m) |
| Insert | O(1) average | O(log n) | O(m) |
| Prefix Search | O(n) | O(n) | O(p) |
| Autocomplete | O(n) | O(n) | O(p + k) |

Where m = word length, p = prefix length, k = number of results, n = total words

## Building algorithmic intuition

Tries demonstrate several important algorithmic concepts:

1. **Space-Time Trade-offs**: Uses more memory to achieve faster prefix operations
2. **Shared Structure**: Common prefixes are stored only once
3. **Recursive Patterns**: Tree traversal follows recursive patterns from Chapter 6
4. **Hash Table Integration**: Modern implementation uses hash tables for child storage

When to choose tries:
- **Autocomplete systems** - Natural fit for prefix-based searches
- **Spell checkers** - Efficient word validation and suggestion
- **IP routing tables** - Network prefix matching
- **Text processing** - When prefix operations are frequent


---

<div class="chapter-nav">
  <a href="11-graphs" class="prev">Previous Chapter</a>
  <a href="index">Table of Contents</a>
  <a href="13-hash-tables" class="next">Next Chapter</a>
</div>
