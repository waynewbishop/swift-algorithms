---
layout: chapter
title: "Chapter 14: Tries"
description: "Implement prefix trees for efficient string operations"
---
# Tries

[Tries](https://en.wikipedia.org/wiki/Trie) are [tree](https://en.wikipedia.org/wiki/Tree_(data_structure))-based data structures that organize information in a hierarchy. Often pronounced "try", the term comes from the English language verb to retrieve. While most [algorithms](https://en.wikipedia.org/wiki/Algorithm) are designed to manipulate generic data, tries are commonly used with Strings.

Tries specialize the tree structures from [Chapters 11-12](11-binary-search-trees.md) for string operations. While binary search trees store values in nodes and have two children (left/right), tries store characters in nodes and can have many children (one per character in the alphabet). This makes tries exceptionally efficient for prefix-based operations like autocomplete—a task that would require `O(n)` time with other data structures but takes only `O(p)` time with tries, where p is the prefix length.

Like graphs from [Chapter 13](13-graphs.md), tries demonstrate how combining algorithmic techniques creates specialized solutions. Our implementation uses breadth-first search ([Chapter 13](13-graphs.md)) with Queue structures ([Chapter 10](10-stacks-and-queues.md)) to efficiently traverse the trie hierarchy and collect all words matching a prefix.

In this chapter, we'll review trie structures and implement autocomplete functionality in Swift using the production Structures package.

## How it works

As discussed, tries organize data in a hierarchy. To see how they work, let's build a Dictionary that contains the following words:

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

Here's the trie data structure from the production Structures package. Unlike our earlier data structures, TrieNode uses array-based children storage. This approach prioritizes simplicity and memory efficiency over individual lookup speed:

```swift
// Trie node with array-based children storage
public class TrieNode {
    var tvalue: String?          // The accumulated string value at this node
    var children: Array<TrieNode>  // Array of child nodes
    var isFinal: Bool             // True if this node represents a complete word
    var level: Int                // Depth in the tree (0 for root)

    public init() {
        self.children = Array<TrieNode>()
        self.isFinal = false
        self.level = 0
    }
}

// Trie structure for efficient prefix-based string operations
public class Trie {
    private var root = TrieNode()

    public init() {}
}
```

The array-based children approach trades `O(1)` dictionary lookup for `O(k)` array iteration (where k is the number of children), but gains simplicity and reduces memory overhead. For typical use cases with small branching factors, this trade-off is reasonable.

## Adding words

Using the TrieNode data structure, we can add words to our trie using the `append(word:)` method. This implementation builds the tree character by character, creating nodes as needed:

```swift
// Builds a tree hierarchy of dictionary content - `O(m)` where m is word length
func append(word keyword: String) {
    // Trivial case
    guard keyword.count > 0 else {
        return
    }

    var current: TrieNode = root

    while keyword.count != current.level {
        var childToUse = TrieNode()
        let searchKey = keyword.prefix(current.level + 1)

        // Iterate through child nodes to find matching prefix
        for child in current.children {
            if child.tvalue == String(searchKey) {
                childToUse = child
                break
            }
        }

        // Create new node if prefix doesn't exist
        if childToUse.tvalue == nil {
            childToUse.tvalue = String(searchKey)
            childToUse.level = current.level + 1
            current.children.append(childToUse)
        }

        current = childToUse
    }

    // Final end of word check
    if keyword.count == current.level {
        current.isFinal = true
        print("end of word reached!")
        return
    }
}

// Example: Build trie from word list
let trie = Trie()
let words = ["ball", "balls", "ballard", "bat", "bar", "cat", "dog"]

for word in words {
    trie.append(word: word)
}
```

Insertion is `O(m)` where m is the word length. The algorithm navigates through existing nodes for shared prefixes, only creating new nodes when necessary. This prefix-sharing is what makes tries memory-efficient despite storing many words.

## Searching with breadth-first traversal

The primary advantage of tries is efficient prefix-based searching. Our production implementation uses breadth-first search (BFS) from [Chapter 13](13-graphs.md) to find all words matching a prefix. This demonstrates how graph traversal algorithms apply to tree structures:

```swift
// Employs Breadth-First Search to find values based on a keyword prefix
func traverse(using keyword: String) -> Array<String>? {
    // Trivial case
    guard keyword.count > 0 else {
        return nil
    }

    var current: TrieNode = root
    var wordList = Array<String>()

    // Navigate to the prefix node
    while keyword.count != current.level {
        let searchKey = keyword.prefix(current.level + 1)
        var isFound: Bool = false

        // Iterate through any child nodes
        for child in current.children {
            if child.tvalue == String(searchKey) {
                current = child
                isFound = true
                break
            }
        }

        if isFound == false {
            return nil  // Prefix not found
        }
    }

    // Initiate BFS process from the prefix node
    let trieQueue: Queue<TrieNode> = Queue<TrieNode>()

    // Queue the starting node (represents the prefix)
    trieQueue.enQueue(current)

    while !trieQueue.isEmpty() {
        // Traverse the next queued node
        guard let leaf = trieQueue.deQueue() else {
            break
        }

        // Add all child nodes to the queue
        for child in leaf.children {
            let leafValue = child.tvalue ?? "nil"
            print("adding leaf: \(leafValue) to queue..")
            trieQueue.enQueue(child)
        }

        // If this node represents a complete word, add it to results
        if leaf.isFinal == true {
            if let tvalue = leaf.tvalue {
                wordList.append(tvalue)
            }
        }

        let leafValue = leaf.tvalue ?? "nil"
        print("traversed substring: \(leafValue)..")
    }

    print("trie traversal complete..")

    return wordList
}

// Example: Get autocomplete suggestions
if let suggestions = trie.traverse(using: "ba") {
    print("Autocomplete for 'ba': \(suggestions)")
    // Outputs: ["ball", "balls", "ballard", "bar", "bat"]
} else {
    print("No matches found")
}
```

The traverse method combines two phases. First, it navigates to the node representing the prefix (`O(p)` where p is prefix length). Second, it uses BFS to visit all descendants, collecting complete words (`O(n)` where n is the number of matching words). Total complexity is `O(p + n)`.

## Why breadth-first search?

The BFS approach offers several advantages for trie traversal:

1. **Level-order results**: BFS naturally returns words in order of length, which is often desirable for autocomplete
2. **Memory efficiency**: Queue-based iteration uses less stack space than recursive approaches
3. **Familiar pattern**: Reuses the Queue structure from [Chapter 10](10-stacks-and-queues.md) and BFS from [Chapter 13](13-graphs.md)
4. **Iterative control**: Easy to add limits on number of results or maximum word length

The Queue acts as a "to-visit" list, ensuring we explore all nodes at level N before moving to level N+1. This systematic exploration guarantees we find all words with the given prefix.

## Using the subscript shortcut

The production Trie includes a convenient subscript operator that calls `traverse` internally:

```swift
// Subscript shortcut for traverse method
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

This subscript syntax provides a cleaner interface while maintaining the same functionality as the explicit `traverse(using:)` method.

## Filtering by start and end characters

The [Structures package](https://github.com/waynewbishop/bishop-algorithms-swift-package) includes an additional `filter` method that demonstrates a more complex BFS application. It finds whether any word exists starting with one character and ending with another:

```swift
// Determines if the trie contains at least one word with specified start and end characters
func filter(_ start: String, _ end: String) -> Bool {
    let current: TrieNode = root
    var isFirst: Bool = false

    // Check if any word starts with the specified character
    for child in current.children {
        if let tvalue = child.tvalue {
            if tvalue == start {
                isFirst = true
                break
            }
        }
    }

    guard isFirst == true else {
        return false
    }

    // Initiate BFS to find word ending with specified character
    let trieQueue: Queue<TrieNode> = Queue<TrieNode>()
    trieQueue.enQueue(current)

    while !trieQueue.isEmpty() {
        guard let leaf = trieQueue.deQueue() else {
            break
        }

        // Add unvisited trie nodes to the queue
        for child in leaf.children {
            let leafValue = child.tvalue ?? "nil"
            print("adding leaf: \(leafValue) to queue..")
            trieQueue.enQueue(child)
        }

        // Check for qualifying value
        if leaf.isFinal == true {
            if let tvalue = leaf.tvalue {
                if tvalue.last == Character(end) {
                    return true
                }
            }
        }

        let leafValue = leaf.tvalue ?? "nil"
        print("traversed leaf: \(leafValue)..")
    }

    print("traversal complete..")
    return false
}

// Example: Check if any word starts with "b" and ends with "t"
if trie.filter("b", "t") {
    print("Found word starting with 'b' and ending with 't'")
    // True: "bat" matches this pattern
}
```

This demonstrates how BFS naturally handles complex filtering conditions during tree traversal.

## Real-world applications

Tries excel in several practical scenarios where prefix operations dominate:

### 1. Search autocomplete systems

```swift
// Simplified search suggestion system using tries
class SearchEngine {
    private let trie = Trie()

    func indexSearchTerms(_ terms: [String]) {
        for term in terms {
            trie.append(word: term)
        }
    }

    func getSuggestions(for query: String) -> [String] {
        return trie.traverse(using: query) ?? []
    }
}

let searchEngine = SearchEngine()
searchEngine.indexSearchTerms(["swift", "swiftui", "swift programming", "swift algorithms"])
if let suggestions = searchEngine.getSuggestions(for: "swift") {
    print("Suggestions: \(suggestions)")
}
```

### 2. Dictionary and spell checking

```swift
// Spell checker using trie for word validation
class SpellChecker {
    private let dictionary = Trie()

    init(words: [String]) {
        for word in words {
            dictionary.append(word: word.lowercased())
        }
    }

    func isValidWord(_ word: String) -> Bool {
        // Word is valid if traverse returns array containing exact match
        guard let matches = dictionary.traverse(using: word.lowercased()) else {
            return false
        }
        return matches.contains(word.lowercased())
    }

    func suggestCorrections(for word: String) -> [String] {
        // Suggest words with similar prefixes
        let prefix = String(word.dropLast())  // Remove last character
        return dictionary.traverse(using: prefix) ?? []
    }
}
```

### 3. Network routing tables

IP routing tables use tries (called "radix trees") to match network prefixes efficiently. When a router receives a packet, it needs to find the most specific matching route, which is naturally expressed as a prefix search.

## Performance analysis

Tries offer excellent performance characteristics for string operations, with complexity independent of dictionary size (from [Chapter 8](08-performance-analysis.md) analysis):

### Time complexity

- **Insert** (append): `O(m)` where m is the length of the word
- **Search** (traverse prefix phase): `O(p)` where p is prefix length
- **Autocomplete** (full traverse): `O(p + n)` where p is prefix length, n is number of matching results
- **BFS traversal**: `O(k)` where k is the number of nodes in the subtree

### Space complexity

- **Overall**: `O(N × M)` on average, where N is number of words and M is average word length
- **Worst case**: `O(ALPHABET_SIZE × N × M)` if no prefixes are shared
- **Best case**: `O(M)` if all words share a single long prefix

### Compared to other data structures

| Operation | Hash Table (Ch 15) | Binary Search Tree (Ch 11) | Trie |
|-----------|------------|-------------------|------|
| Search exact word | `O(1)` average | `O(log n)` | `O(m)` |
| Insert | `O(1)` average | `O(log n)` | `O(m)` |
| Prefix search | `O(n)` | `O(n)` | `O(p)` |
| Autocomplete | `O(n)` | `O(n)` | `O(p + k)` |

Where m = word length, p = prefix length, k = number of results, n = total words

**Key insight**: Tries are the only structure with `O(p)` prefix search. Hash tables and BSTs must examine all n entries to find prefix matches, making tries dramatically faster for autocomplete operations.

### Array vs Dictionary children trade-off

Our production implementation uses arrays for children storage rather than dictionaries. This choice has specific performance implications:

**Array-based approach** (production code):
- Child lookup: `O(k)` where k is number of children per node
- Memory per node: `O(k)` only for actual children
- Cache-friendly: Array elements stored contiguously
- Best when: Branching factor is small (typical in many tries)

**Dictionary-based approach** (alternative):
- Child lookup: `O(1)` average case
- Memory per node: Hash table overhead even for few children
- Less cache-friendly: Hash table uses scattered memory
- Best when: Large branching factor or sparse children

For typical autocomplete with lowercase letters, each node averages 2-3 children, making array iteration fast enough while saving memory.

## Building algorithmic intuition

Tries demonstrate several important algorithmic concepts:

1. **Space-Time Trade-offs**: Uses more memory to achieve faster prefix operations than linear search
2. **Shared Structure**: Common prefixes are stored only once, reducing total space compared to storing full strings
3. **BFS Application**: Shows how graph traversal ([Chapter 13](13-graphs.md)) generalizes to trees
4. **Queue Usage**: Leverages Queue structures ([Chapter 10](10-stacks-and-queues.md)) for level-order traversal
5. **Design Choices**: Array vs dictionary children shows how implementation details affect performance

When to choose tries:
- **Autocomplete systems** - Natural fit for prefix-based searches
- **Spell checkers** - Efficient word validation and suggestion
- **IP routing tables** - Network prefix matching
- **Text processing** - When prefix operations are frequent

When to avoid tries:
- **Simple word lookup** - Hash tables are simpler and faster (`O(1)` vs `O(m)`)
- **No prefix operations** - Memory overhead not justified
- **Very large alphabet** - Space complexity grows with alphabet size (Unicode text)
- **Infrequent updates** - Sorted array with binary search may be simpler
