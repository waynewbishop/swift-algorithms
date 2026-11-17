---
layout: chapter
title: "Chapter 14: Tries"
description: "Build a trie data structure in Swift for autocomplete, prefix search, and dictionary lookups"
---
# Tries

Tries are data structures that organize information in a hierarchy. Often pronounced "try", the term comes from the English language verb to retrieve. While most algorithms are designed to manipulate generic data, tries are commonly used with `Strings`.

While binary search trees store values in nodes and have two children (`left` and `right`), tries organize strings by their characters, and each node can have many children (up to one per character in the alphabet). This makes tries exceptionally efficient for prefix-based operations like autocomplete. Finding where a prefix begins takes a number of steps tied to the prefix's length, not to the number of words stored—a sharp contrast with scanning a list of n words, or with a hash table, which can confirm an exact word but has no notion of words that merely begin alike.

Similar to graphs from [Chapter 13](13-graphs.md), tries demonstrate how combining algorithmic techniques creates specialized solutions. Our implementation uses breadth-first search ([Chapter 13](13-graphs.md)) with `Queue` structures ([Chapter 10](10-stacks-and-queues.md)) to efficiently traverse the trie hierarchy and collect all words matching a prefix.

## How it works

As discussed, tries organize data in a hierarchy. To see how they work, let's build a `Dictionary` that contains the following words:

- Ball
- Balls
- Ballard
- Bat
- Bar
- Cat
- Dog

At first glance, we see words prefixed with the phrase "Ba", while entries like "Ballard" combine words and phrases (e.g., "Ball" and "Ballard"). Even though our dictionary contains a limited quantity of words, a thousand-item list would have the same characteristics. As with any algorithm, we'll apply our knowledge to build an efficient model.

Tries involve building hierarchies, storing phrases along the way until a word is created. With so many permutations, it's important to know what qualifies as an actual word. For example, even though we've stored the phrase "Ba", it's not identified as a word until explicitly marked.

## The data structure

Here's our Trie data structure. Each node stores the complete prefix it represents (for example "b", "ba", and "bal"), which makes the structure easy to inspect while we learn. Note our TrieNode uses an array for storing related child records. This approach prioritizes simplicity over individual lookup speed:

```swift
// Trie node with array-based children storage
public class TrieNode {

    var tvalue: String?          // The accumulated string value at this node
    var children: Array<TrieNode>  // Array of child nodes
    var isFinal: Bool             // True if this node represents a complete word
    var level: Int                // Depth in the tree (0 for root)

    // Initializes an empty trie node at level 0
    public init() {
        self.children = Array<TrieNode>()
        self.isFinal = false
        self.level = 0
    }
}

// Trie structure for efficient prefix-based string operations
public class Trie {
    private var root = TrieNode()

    // Creates a new empty trie
    public init() {}
}
```

The array-based children approach trades `O(1)` dictionary lookup for `O(b)` array iteration (where b is the number of children at a node), but gains simplicity. For typical use cases with small branching factors, this trade-off is reasonable.

Finding the right child is simpler than it might first appear. Every child shares its parent's prefix and adds exactly one character, so the children of the "ba" node ("bal", "bar", and "bat") differ only in their final character. Comparing that last character is enough to tell siblings apart, which spares us from comparing whole prefix strings at every level:

```swift
// Find the child whose prefix ends with the specified character - O(b)
private func child(of node: TrieNode, endingWith character: Character) -> TrieNode? {
    for child in node.children {
        if child.tvalue?.last == character {
            return child
        }
    }
    return nil
}
```

## Adding words

Using the TrieNode data structure, we can add words to our trie using the `append(word:)` method. This implementation builds the tree character by character, extending a running prefix and creating nodes as needed:

```swift
// Inserts a word into the trie character by character
func append(word keyword: String) {
    // Trivial case
    guard keyword.isEmpty == false else {
        return
    }

    var current: TrieNode = root
    var prefix = ""

    // Walk one character per level
    for character in keyword {
        prefix.append(character)

        if let match = child(of: current, endingWith: character) {
            // Shared prefix - follow the existing node
            current = match
        } else {
            // Create new node if prefix doesn't exist
            let childToUse = TrieNode()
            childToUse.tvalue = prefix
            childToUse.level = current.level + 1
            current.children.append(childToUse)
            current = childToUse
        }
    }

    // Final end of word check
    current.isFinal = true
}

// Example: Build trie from word list
let trie = Trie()
let words = ["ball", "balls", "ballard", "bat", "bar", "cat", "dog"]

for word in words {
    trie.append(word: word)
}
```

Walking a word of length m takes m steps, and each step scans at most b children, so finding the insertion path costs `O(b × m)`. The algorithm navigates through existing nodes for shared prefixes, only creating new nodes when necessary. Prefix-sharing is what keeps a trie compact when many words begin alike: "ball", "balls", and "ballard" share the nodes for "b" through "ball". Because each node in our version stores its complete prefix, though, a new node costs storage proportional to its depth, a detail we'll return to in the performance analysis.

## Breadth-first search for trie operations

The primary advantage of tries is efficient prefix-based searching. Our production implementation uses breadth-first search (BFS) from [Chapter 13](13-graphs.md) to traverse the trie hierarchy and collect matching words. This demonstrates how graph traversal algorithms apply to tree structures—the same BFS pattern that worked for graph exploration works equally well for tree operations.

### The breadth-first pattern

All trie search operations follow a consistent BFS pattern with two phases. In the first phase, we navigate to a starting node by finding the specific node where the search begins (such as a prefix node or the root), validating that the starting point exists, and returning early if the search is impossible.

In the second phase, we perform a level-order traversal. We initialize a Queue and enqueue the starting node, then process all nodes at level N before moving to level `N+1`. At each node we check a condition—collecting a word, matching a pattern, or performing some other operation—and enqueue the node's children for the next level. The Queue from [Chapter 10](10-stacks-and-queues.md) acts as a "to-visit" list, ensuring systematic exploration. This guarantees we find all matching words without missing any branches.

### Why breadth-first search

BFS is exploratory — it visits every reachable node without needing to know or program all possible search permutations in advance. Once we navigate to a prefix node, BFS fans out and discovers every descendant, which is exactly what autocomplete requires. We cannot predict how many words share a prefix or how deep they extend, but BFS handles this naturally by continuing until it runs out of nodes to explore. 

### Autocomplete with traverse

The `traverse(using:)` method demonstrates the BFS pattern for autocomplete suggestions:

```swift
// Finds the node representing a prefix, or nil if no word begins with it
private func node(matching prefix: String) -> TrieNode? {
    var current: TrieNode = root

    for character in prefix {
        guard let match = child(of: current, endingWith: character) else {
            return nil
        }
        current = match
    }

    return current
}

// Finds all complete words matching a keyword prefix using BFS
func traverse(using keyword: String) -> Array<String>? {
    // Trivial case
    guard keyword.isEmpty == false else {
        return nil
    }

    // Phase 1: Navigate to the prefix node
    guard let prefixNode = node(matching: keyword) else {
        return nil  // Prefix not found
    }

    var wordList = Array<String>()

    // Phase 2: BFS process from the prefix node
    let trieQueue: Queue<TrieNode> = Queue<TrieNode>()
    trieQueue.enQueue(prefixNode)

    while !trieQueue.isEmpty() {
        // Traverse the next queued node
        guard let leaf = trieQueue.deQueue() else {
            break
        }

        // Queue the node's children for the next level
        for e in leaf.children {
            trieQueue.enQueue(e)
        }

        // If this node represents a complete word, add it to results
        if leaf.isFinal == true {
            if let tvalue = leaf.tvalue {
                wordList.append(tvalue)
            }
        }
    }

    return wordList
}

// Example: Get autocomplete suggestions
if let suggestions = trie.traverse(using: "ba") {
    print("Autocomplete for 'ba': \(suggestions)")
    // Outputs: ["bat", "bar", "ball", "balls", "ballard"]
} else {
    print("No matches found")
}
```

Notice the order of the results. Breadth-first search reports words level by level, so the three-letter words "bat" and "bar" arrive before "ball", even though "ball" was inserted first. Within a level, nodes appear in the order they were created: the "bal" node came first (from "ball"), then "bat", then "bar".

The method combines both phases. Navigating to the prefix node takes p steps for a prefix of length p, each scanning at most b children, for `O(b × p)`. The BFS then visits every node below the prefix node, s nodes in all, for `O(s)`. Collecting a matching word costs nothing extra, because each final node already stores its complete word. Total complexity is `O(b × p + s)`. Note that s counts nodes, not results: the subtree below "ba" holds eight nodes but only five words.

### Pattern matching with filter

The same BFS pattern applies to more complex queries. The [Structures package](https://github.com/waynewbishop/bishop-algorithms-swift-package) includes a `filter` method that checks whether a single word both begins with one string AND ends with another:

```swift
// Checks if the trie contains a word with the specified beginning and ending
func filter(_ start: String, _ end: String) -> Bool {
    // An empty ending matches nothing meaningful
    guard end.isEmpty == false else {
        return false
    }

    // Phase 1: Navigate to the node for the starting prefix
    guard let prefixNode = node(matching: start) else {
        return false
    }

    // Phase 2: BFS to find a word ending with the specified suffix
    let trieQueue: Queue<TrieNode> = Queue<TrieNode>()
    trieQueue.enQueue(prefixNode)

    while !trieQueue.isEmpty() {
        // Traverse the next queued node
        guard let leaf = trieQueue.deQueue() else {
            break
        }

        // Queue the node's children for the next level
        for e in leaf.children {
            trieQueue.enQueue(e)
        }

        // Check for qualifying value
        if leaf.isFinal == true {
            if let tvalue = leaf.tvalue, tvalue.hasSuffix(end) {
                return true
            }
        }
    }

    return false
}

// Example: Check if any word starts with "b" and ends with "t"
if trie.filter("b", "t") {
    print("Found word starting with 'b' and ending with 't'")
    // True: "bat" matches this pattern
}
```

Starting the search at the prefix node is what ties both conditions to the same word. Every word below that node begins with `start`, so the only remaining question is how it ends. Had we confirmed the prefix and then searched from the `root` instead, a trie holding only "ball" and "cat" would wrongly report a match for `filter("b", "t")`: "ball" supplies the starting "b" and "cat" supplies the ending "t". Using `hasSuffix` also lets `end` be any length, so `filter("ba", "ard")` finds "ballard".

Both methods use identical BFS structure—the while loop, Queue operations, and child iteration are the same. Only the processing logic differs. The `traverse` method collects all `isFinal` nodes and returns `Array<String>?`, while `filter` checks if any `isFinal` node has the requested ending and returns `Bool`. This demonstrates how BFS provides a flexible, reusable pattern for trie operations. Once we understand the BFS template, we can apply it to any trie traversal problem by changing just the node processing logic.

## Using the subscript shortcut

The production Trie includes a convenient subscript operator that calls `traverse` internally:

```swift
// Provides array-like syntax for prefix searches
subscript(word: String) -> Array<String>? {
    get {
        return traverse(using: word)
    }
}

// Example: Cleaner syntax for autocomplete
if let suggestions = trie["ba"] {
    print("Words starting with 'ba': \(suggestions)")
}

// Check if prefix exists
if trie["cat"] != nil {
    print("Found words starting with 'cat'")
}
```

## Performance analysis

Tries offer strong performance characteristics for string operations, and the costs below depend on word and prefix lengths rather than on the number of words stored (using the analysis from [Chapter 8](08-performance-analysis.md)). We'll use four symbols: m for a word's length, p for a prefix's length, b for the largest number of children at any node, and s for the number of nodes below a prefix node.

### Time complexity

Finding where a word belongs with `append` takes `O(b × m)`: one step per character, each scanning at most b children. Searching with `traverse` has two phases. Navigating to the prefix node takes `O(b × p)`, and the BFS that collects results visits s nodes, so autocomplete costs `O(b × p + s)` in total. For a fixed alphabet, b is bounded by the alphabet size, which is why textbooks often simplify these to `O(m)` and `O(p + s)`.

### Space complexity

Our representation stores each node's complete prefix, so a node at depth d holds d characters. Inserting a word of length m that shares no prefix with existing words creates m new nodes holding 1 + 2 + … + m characters, which grows as `O(m²)`. Shared prefixes are stored once, so words that begin alike add only the nodes for their differing endings. A production trie usually stores a single character per node, often with a dictionary of children keyed by character. That version stores `O(1)` characters per node, so its total storage is proportional to the number of nodes, which is at most the total length of all words and much less when prefixes are shared, and each child lookup drops from `O(b)` to `O(1)` on average.

### Compared to other data structures

| Operation | Hash Table (Ch 15) | Sorted array or balanced BST | Trie |
|-----------|------------|-------------------|------|
| Search exact word | `O(m)` average | `O(m × log n)` | `O(b × m)` |
| Insert | `O(m)` average | `O(m × log n)` for a balanced BST | `O(b × m)` |
| Find a prefix's matches | `O(n × p)` (scan every word) | `O(p × log n + r)` | `O(b × p + s)` |

Where m = word length, p = prefix length, n = total words, r = number of matching words, b = children per node, and s = nodes below the prefix node. The m and p factors account for the cost of hashing or comparing strings, which the Chapter 15 hash functions compute character by character.

Tries aren't the only structure that answers prefix queries efficiently. Because all words sharing a prefix sit next to one another in sorted order, a sorted array or balanced BST can locate the first match with a binary search and then read the matching range. What sets the trie apart is that its navigation cost doesn't grow with n at all, and that its shape mirrors the prefixes themselves, which makes operations like "list every word below this node" a natural traversal. A hash table, by contrast, scatters similar words across unrelated buckets, so finding prefix matches requires examining every entry.

## Building algorithmic intuition

Tries provide two essential capabilities: prefix-based searching whose cost depends on the prefix rather than the dictionary size, and shared storage of common prefixes. The hierarchical structure naturally represents string relationships—autocomplete suggestions, spell checking, and network routing all benefit from navigating character-by-character rather than comparing entire strings. The BFS pattern demonstrated here generalizes beyond tries: the same breadth-first search from [Chapter 13](13-graphs.md) works identically on trees and graphs, and the Queue structure from [Chapter 10](10-stacks-and-queues.md) provides level-order traversal whether exploring social networks or collecting word suggestions.
