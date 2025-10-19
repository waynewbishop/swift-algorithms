# Tries

Tries are tree-based data structures that organize information in an hierarchy. Often pronounced "try", the term comes from the English language verb to retrieve. While most algorithms are designed to manipulate generic data, tries are commonly used with Strings. In this essay, we'll review trie structures and will implement our own model with Swift.

## How It Works

As discussed, tries organize data in a hierarchy. To see how they work, let's build a dictionary that contains the following words:

- Ball
- Balls
- Ballard
- Bat
- Bar
- Cat
- Dog

At first glance, we see words prefixed with the phrase "Ba", while entries like "Ballard" combine words and phrases (e.g., "Ball" and "Ballard"). Even though our dictionary contains a limited quantity of words, a thousand-item list would have the same properties. As with any algorithm, we'll apply our knowledge to build an efficient model. To start, let's create a new trie for the word "Ball":

[diagram: Trie structure showing hierarchical breakdown of the word "Ball"]

Tries involve building hierarchies, storing phrases along the way until a word is created (seen in yellow). With so many permutations, it's important to know what qualifies as an actual word. For example, even though we've stored the phrase "Ba", it's not identified as a word. To see the significance, consider the next example:

[diagram: Extended trie structure showing multiple words]

## The Data Structure

Here's an example of a trie data structure written in Swift. In addition to storing a key, the structure also includes an Array for identifying its children. Unlike a binary search tree, a trie can store an unlimited number of leaf nodes. The boolean value isFinal will allow us to distinguish words and phrases. Finally, the level will indicate the node's level in a hierarchy.

```swift
// Basic trie data structure
public class TrieNode {
    var key: String?
    var children: Array<TrieNode>
    var isFinal: Bool
    var level: Int

    init() {
        self.children = Array<TrieNode>()
        self.isFinal = false
        self.level = 0
    }
}
```

## Adding Words

> **ITERATIVE CODING DESIGN**: A common programming technique where logic is applied by "looping" or iterating through a list or collection.

Here's an algorithm that adds words to a trie. Although most tries are recursive structures, our example employs an iterative technique. The while loop compares the keyword length with the current node's level. If no match occurs, it indicates additional keyword phases remain to be added.

```swift
// Builds a tree hierarchy of dictionary content
func append(word keyword: String) {
    guard keyword.length > 0 else {
        return
    }

    var current: TrieNode = root

    while keyword.length != current.level {
        var childToUse: TrieNode!
        let searchKey: String = keyword.substring(to: current.level + 1)

        // Iterate through the node children
        for child in current.children {
            if child.key == searchKey {
                childToUse = child
                break
            }
        }

        // Create a new node
        if childToUse == nil {
            childToUse = TrieNode()
            childToUse.key = searchKey
            childToUse.level = current.level + 1
            current.children.append(childToUse)
        }

        current = childToUse
    } // end while

    // Add final end of word check
    if keyword.length == current.level {
        current.isFinal = true
        print("end of word reached!")
        return
    }
} // end function
```

A final check confirms our keyword after completing the while loop. As part of this final check, we update the current node with the isFinal indicator. As mentioned, this step will allow us to distinguish words from phrases.

## Finding Words

The algorithm for finding words is similar to adding content. Again, we establish a while loop to navigate the trie hierarchy. Since the goal will be to return a list of possible words, these will be tracked using an Array.

```swift
// Find words based on the prefix
func find(_ keyword: String) -> Array<String>? {
    // Trivial case
    guard keyword.length > 0 else {
        return nil
    }

    var current: TrieNode = root
    var wordList = Array<String>()

    while keyword.length != current.level {
        var childToUse: TrieNode!
        let searchKey = keyword.substring(to: current.level + 1)

        // Iterate through any child nodes
        for child in current.children {
            if (child.key == searchKey) {
                childToUse = child
                current = childToUse
                break
            }
        }

        if childToUse == nil {
            return nil
        }
    } // end while

    // Retrieve the keyword and any descendants
    if ((current.key == keyword) && (current.isFinal)) {
        if let key = current.key {
            wordList.append(key)
        }
    }

    // Include only children that are words
    for child in current.children {
        if (child.isFinal == true) {
            if let key = child.key {
                wordList.append(key)
            }
        }
    }

    return wordList
} // end function
```

The search function checks to ensure keyword phrase permutations are found. Once the entire keyword is identified, we start the process of building our word list. In addition to returning keys identified as words (e.g., "Bat", "Ball"), we account for the possibility of returning nil by returning an implicit unwrapped optional.

## Extending Swift

Even though we've written our trie in Swift, we've extended some language features to make things work. Commonly known as categories in Objective-C, our algorithms employ two additional Swift extensions. The following class extends the functionality of the native String class:

```swift
extension String {
    // Compute the length
    var length: Int {
        return self.count
    }

    // Returns characters up to a specified integer
    func substring(to: Int) -> String {
        // Define the range
        let range = self.index(self.startIndex, offsetBy: to)
        return String(self[..<range])
    }
}
```
