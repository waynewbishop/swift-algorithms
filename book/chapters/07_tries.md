# Tries

A trie, pronounced "try" and derived from the word "retrieval," is a tree-based data structure that organizes information in a hierarchy. While most algorithms are designed to manipulate generic data, tries are commonly used with strings. In this chapter, we'll explore trie structures in depth and implement our own model with Swift.

## How it works

As discussed, a trie is a model that shows how strings relate to one another in a hierarchical structure. The fundamental components of a trie are `nodes`, with each node typically representing a single character of a string. The root node of a trie is usually empty and serves as the starting point for all strings in the structure.

Let's build a trie that contains the following words:
- Ball
- Balls
- Ballard
- Bat
- Bar
- Cat
- Dog

At first glance, we see words prefixed with the phrase "Ba", while entries like "Ballard" combine words and phrases (e.g., "Ball" & "Ballard"). Even though our dictionary contains a limited quantity of words, a thousand-item list would have the same properties.

## Trie structure and properties

1. `Root Node`: The root of a trie is typically an empty node that serves as the starting point for all strings.
2. `Nodes`: Each node in a trie represents a single character of a string.
3. `Edges`: Edges connect nodes and represent the progression of characters in strings.
4. `Leaf Nodes`: These are nodes at the end of a string, often marked to indicate a complete word.
5. `Prefixes`: Common prefixes among words share the same initial nodes in the trie.

It's important to note that nodes themselves don't typically store complete words, but rather a single character. The structure of the trie implicitly represents the strings.

## The data structure

Here's an example of a trie data structure written in Swift:

```swift
public class TrieNode {
    var key: Character?
    var children: [Character: TrieNode]
    var isEndOfWord: Bool
    
    init() {
        self.children = [:]
        self.isEndOfWord = false
    }
}

public class Trie {
    private let root: TrieNode
    
    init() {
        root = TrieNode()
    }
    
    // Methods for insertion, search, etc. will be added here
}
```

## Adding words

****Here's an algorithm that adds words to a trie:

```swift
func insert(_ word: String) {
    var current = root
    for char in word {
        if let child = current.children[char] {
            current = child
        } else {
            let newNode = TrieNode()
            newNode.key = char
            current.children[char] = newNode
            current = newNode
        }
    }
    current.isEndOfWord = true
}
```

Certainly! I'll add a detailed code explanation for the "Adding words" section, catering to users from beginner to advanced levels. Here's the addition in markdown format:

## Adding words

Here's an algorithm that adds words to a trie:

```swift
func insert(_ word: String) {
    var current = root
    for char in word {
        if let child = current.children[char] {
            current = child
        } else {
            let newNode = TrieNode()
            newNode.key = char
            current.children[char] = newNode
            current = newNode
        }
    }
    current.isEndOfWord = true
}
```

### Code Explanation:

1. We start by setting `current` to the root node of our trie. This is our starting point for insertion.

2. We then iterate through each character (`char`) in the input `word`:

   - For beginners: Think of this like walking through each letter of the word one by one.
   - For advanced users: This `for` loop allows us to examine each character in `O(m)` time, where m is the length of the word.

3. For each character, we check if a child node for this character already exists:
   ```swift
   if let child = current.children[char] {
       current = child
   }
   ```
   - If it does exist, we simply move our `current` pointer to this existing child node.
   - This handles the case where we're inserting a word that shares a prefix with an existing word in the trie.

4. If the child node doesn't exist, we create a new one:
   ```swift
   else {
       let newNode = TrieNode()
       newNode.key = char
       current.children[char] = newNode
       current = newNode
   }
   ```
   - We create a new `TrieNode`.
   - We set its `key` to the current character.
   - We add this new node to the `children` dictionary of the current node.
   - We move our `current` pointer to this new node.

5. After we've processed all characters, we mark the last node as the end of a word:
   ```swift
   current.isEndOfWord = true
   ```
   - This is crucial because it allows us to distinguish between prefixes and complete words in our trie.

This insertion process ensures that each prefix is stored only once, providing space efficiency. The time complexity is `O(m)`, where m is the length of the word, as we process each character once. The space complexity in the worst case (no shared prefixes) is also `O(m)`.

## Finding words

The process of finding words in a trie closely mirrors the method used for adding new words, with a few key differences. Like insertion, we start at the root and traverse the trie character by character. However, instead of creating new nodes, we simply check if each character exists in the current node's children. If at any point we can't find a matching child node, we know the word doesn't exist in our trie and can return false immediately. If we successfully traverse all characters of the word, we then check if the final node is marked as the end of a word. This final check is crucial because it allows us to distinguish between complete words and mere prefixes in our trie. This search operation, like insertion, has a time complexity of `O(m)`, where m is the length of the word being searched.

```swift
func search(_ word: String) -> Bool {
    var current = root
    for char in word {
        if let child = current.children[char] {
            current = child
        } else {
            return false
        }
    }
    return current.isEndOfWord
}
```

## Deletion operation

Deleting a word from a trie is more complex than insertion or search operations. This complexity arises from several factors that are inherent to the structure and purpose of tries. 

In a trie, multiple words often share common prefixes. This sharing of prefixes is one of the key advantages of tries, allowing for efficient storage and quick prefix-based searches. However, it also complicates the deletion process. When deleting a word, we need to be careful not to remove nodes that are part of other words. This means we may need to remove only part of a path in the trie, not the entire path from root to leaf.

Another factor is the need to maintain the trie's structural integrity after deletion. We must ensure that all remaining words are still accessible and that the trie continues to function correctly for future operations. This often requires a careful, step-by-step approach to deletion.

The deletion process typically involves several stages. First, we need to locate the word in the trie, similar to a search operation. If the word exists, we then need to unmark the last node as the end of a word. However, this is just the beginning. We then need to determine which nodes, if any, can be safely removed without affecting other words in the trie.

This decision-making process often requires a recursive approach, where we traverse the trie from the leaf node back up towards the root, making decisions at each node. We can only remove a node if it has no children and is not marked as the end of another word. As we work our way back up the trie, we may potentially remove parent nodes if they now have no children and are not word endings.

The situation becomes even more intricate when dealing with prefixes. If the word to be deleted is a prefix of a longer word, we need to keep all the nodes but just unmark the end of the word. For example, if our trie contains both `car` and `cart`, and we want to delete `car`, we can't remove any nodes. We simply need to unmark "car" as a complete word while leaving the path intact for "cart".

All these considerations make the deletion operation in tries more complex than other basic operations like insertion or search. The algorithm needs to handle various cases efficiently, balancing the need to remove unnecessary nodes with the requirement to preserve the integrity of the trie structure for remaining words. 

```swift
func delete(_ word: String) -> Bool {
    return delete(root, word, 0)
}

private func delete(_ node: TrieNode, _ word: String, _ index: Int) -> Bool {
    if index == word.count {
        if !node.isEndOfWord {
            return false
        }
        node.isEndOfWord = false
        return node.children.isEmpty
    }
    
    let char = word[word.index(word.startIndex, offsetBy: index)]
    guard let child = node.children[char] else {
        return false
    }
    
    let shouldDeleteChild = delete(child, word, index + 1)
    
    if shouldDeleteChild {
        node.children.removeValue(forKey: char)
        return node.children.isEmpty && !node.isEndOfWord
    }
    
    return false
}
```

## Space and time complexity analysis

Space Complexity:
- Worst case: O(m * n), where m is the length of the longest word and n is the number of words.
- Best case: O(n), where n is the total number of characters in all words (when there's maximum sharing of prefixes).

Time Complexity:
- Insertion: O(m), where m is the length of the word being inserted.
- Search: O(m), where m is the length of the word being searched.
- Deletion: O(m), where m is the length of the word being deleted.

## Advantages and disadvantages

Advantages:
1. Efficient prefix-based searching and auto-complete functionality.
2. Can be more space-efficient than storing each word separately, especially with common prefixes.

Disadvantages:
1. Can use more space than a hash table when storing many words with few common prefixes.
2. More complex to implement than simpler data structures.
3. Not as efficient as hash tables for single word lookup if prefixes are not a concern.

## Common applications and use cases

1. Autocomplete and predictive text: Tries excel at prefix-based searching, making them ideal for suggesting words as a user types.
2. Spell checkers: Tries can efficiently store a dictionary and check if a word exists or suggest corrections.
3. IP routing tables: Network routers use tries to store routing information, allowing for quick longest-prefix matching.
4. Dictionary implementations: Tries can be used to implement dictionaries with efficient prefix-based operations.

## Optimization techniques

1. Path Compression: Merge nodes with only one child to reduce the number of nodes and improve memory usage.
2. Lazy Expansion: Only create nodes as needed, rather than initializing all possible character nodes upfront.

## Comparison with other data structures

Tries vs. Hash Tables:
- Tries are better for prefix-based operations and finding all words with a common prefix.
- Hash tables are generally faster for single word lookup and use less memory when there are few common prefixes.

Tries vs. Binary Search Trees (BSTs):
- Tries provide faster prefix-based searching and insertion.
- BSTs can be more memory-efficient for storing strings with few common prefixes.

When to choose Tries:
- When prefix-based operations are frequent.
- When you need to store a large number of strings with common prefixes.
- When autocomplete or spell-check functionality is required.

## Practice problems

1. Implement a function to find all words in a trie with a given prefix.
2. Create a function that returns the longest common prefix of all words in the trie.
3. Implement a function to count the total number of words in a trie.
4. Design a system using a trie to implement an autocomplete feature for a search engine.