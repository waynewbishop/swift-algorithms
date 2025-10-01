# Dynamic programming

Dynamic programming is a powerful algorithmic technique that solves complex problems by breaking them down into simpler subproblems and storing their solutions to avoid redundant calculations. It's particularly effective for optimization problems where the same subproblems appear repeatedly. In this chapter, we'll explore the principles of dynamic programming and implement classic algorithms in Swift.

## Understanding dynamic programming

Dynamic programming (DP) combines two key concepts:
1. **Optimal Substructure**: The optimal solution contains optimal solutions to subproblems
2. **Overlapping Subproblems**: The same subproblems are solved multiple times in a naive recursive approach

When both properties exist, dynamic programming can dramatically improve efficiency by using **memoization** (storing computed results) to avoid recalculating the same subproblems.

### Memoization vs tabulation

There are two main approaches to dynamic programming:

- **Top-Down (Memoization)**: Start with the original problem and recursively break it down, caching results
- **Bottom-Up (Tabulation)**: Start with the smallest subproblems and build up to the solution

## Classic example: Fibonacci numbers

Let's start with the classic Fibonacci sequence to illustrate the dramatic performance difference:

### Naive recursive approach (exponential time)

```swift
func fibonacciNaive(_ n: Int) -> Int {
    if n <= 1 {
        return n
    }
    return fibonacciNaive(n - 1) + fibonacciNaive(n - 2)
}

// Time Complexity: O(2^n) - exponential!
// Space Complexity: O(n) - recursion stack
```

This naive approach recalculates the same values many times. For `fibonacci(5)`, it calculates `fibonacci(3)` three times and `fibonacci(2)` five times!

### Top-down memoization

```swift
func fibonacciMemo(_ n: Int, memo: inout [Int: Int]) -> Int {
    // Check if we've already calculated this value
    if let cached = memo[n] {
        return cached
    }

    // Base cases
    if n <= 1 {
        memo[n] = n
        return n
    }

    // Calculate and store the result
    let result = fibonacciMemo(n - 1, memo: &memo) + fibonacciMemo(n - 2, memo: &memo)
    memo[n] = result
    return result
}

// Wrapper function
func fibonacci(_ n: Int) -> Int {
    var memo: [Int: Int] = [:]
    return fibonacciMemo(n, memo: &memo)
}

// Time Complexity: O(n)
// Space Complexity: O(n)
```

### Bottom-up tabulation

```swift
func fibonacciTabulation(_ n: Int) -> Int {
    guard n > 1 else { return n }

    var dp = Array(repeating: 0, count: n + 1)
    dp[0] = 0
    dp[1] = 1

    for i in 2...n {
        dp[i] = dp[i - 1] + dp[i - 2]
    }

    return dp[n]
}

// Time Complexity: O(n)
// Space Complexity: O(n)
```

### Space-optimized version

```swift
func fibonacciOptimized(_ n: Int) -> Int {
    guard n > 1 else { return n }

    var prev2 = 0  // f(n-2)
    var prev1 = 1  // f(n-1)

    for _ in 2...n {
        let current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    }

    return prev1
}

// Time Complexity: O(n)
// Space Complexity: O(1)
```

## The coin change problem

A classic DP problem: given coins of different denominations and a target amount, find the minimum number of coins needed.

### Problem setup

```swift
struct CoinChange {
    static func minCoins(amount: Int, coins: [Int]) -> Int {
        // dp[i] represents minimum coins needed for amount i
        var dp = Array(repeating: Int.max, count: amount + 1)
        dp[0] = 0  // Base case: 0 coins needed for amount 0

        // For each amount from 1 to target
        for currentAmount in 1...amount {
            // Try each coin
            for coin in coins {
                if coin <= currentAmount && dp[currentAmount - coin] != Int.max {
                    dp[currentAmount] = min(dp[currentAmount], dp[currentAmount - coin] + 1)
                }
            }
        }

        return dp[amount] == Int.max ? -1 : dp[amount]
    }

    // Return the actual coins used
    static func minCoinsWithPath(amount: Int, coins: [Int]) -> (count: Int, coins: [Int]) {
        var dp = Array(repeating: Int.max, count: amount + 1)
        var parent = Array(repeating: -1, count: amount + 1)
        dp[0] = 0

        for currentAmount in 1...amount {
            for coin in coins {
                if coin <= currentAmount && dp[currentAmount - coin] != Int.max {
                    if dp[currentAmount - coin] + 1 < dp[currentAmount] {
                        dp[currentAmount] = dp[currentAmount - coin] + 1
                        parent[currentAmount] = coin
                    }
                }
            }
        }

        if dp[amount] == Int.max {
            return (-1, [])
        }

        // Reconstruct path
        var result: [Int] = []
        var current = amount
        while current > 0 {
            let coin = parent[current]
            result.append(coin)
            current -= coin
        }

        return (dp[amount], result)
    }
}

// Usage
let result = CoinChange.minCoins(amount: 11, coins: [1, 4, 5])
print("Minimum coins needed: \(result)")  // 3 coins (5 + 5 + 1)

let detailed = CoinChange.minCoinsWithPath(amount: 11, coins: [1, 4, 5])
print("Coins used: \(detailed.coins)")  // [1, 5, 5]
```

## Longest common subsequence (LCS)

Find the longest subsequence common to two sequences.

```swift
struct LongestCommonSubsequence {
    static func lengthLCS(_ text1: String, _ text2: String) -> Int {
        let chars1 = Array(text1)
        let chars2 = Array(text2)
        let m = chars1.count
        let n = chars2.count

        // dp[i][j] = LCS length of first i chars of text1 and first j chars of text2
        var dp = Array(repeating: Array(repeating: 0, count: n + 1), count: m + 1)

        for i in 1...m {
            for j in 1...n {
                if chars1[i - 1] == chars2[j - 1] {
                    dp[i][j] = dp[i - 1][j - 1] + 1
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                }
            }
        }

        return dp[m][n]
    }

    static func findLCS(_ text1: String, _ text2: String) -> String {
        let chars1 = Array(text1)
        let chars2 = Array(text2)
        let m = chars1.count
        let n = chars2.count

        var dp = Array(repeating: Array(repeating: 0, count: n + 1), count: m + 1)

        // Fill the DP table
        for i in 1...m {
            for j in 1...n {
                if chars1[i - 1] == chars2[j - 1] {
                    dp[i][j] = dp[i - 1][j - 1] + 1
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                }
            }
        }

        // Reconstruct the LCS
        var result: [Character] = []
        var i = m, j = n

        while i > 0 && j > 0 {
            if chars1[i - 1] == chars2[j - 1] {
                result.append(chars1[i - 1])
                i -= 1
                j -= 1
            } else if dp[i - 1][j] > dp[i][j - 1] {
                i -= 1
            } else {
                j -= 1
            }
        }

        return String(result.reversed())
    }
}

// Usage
let lcsLength = LongestCommonSubsequence.lengthLCS("ABCDGH", "AEDFHR")
print("LCS Length: \(lcsLength)")  // 3

let lcs = LongestCommonSubsequence.findLCS("ABCDGH", "AEDFHR")
print("LCS: \(lcs)")  // "ADH"
```

## 0/1 knapsack problem

Given items with weights and values, and a knapsack with weight capacity, maximize the value.

```swift
struct Item {
    let weight: Int
    let value: Int
    let name: String
}

struct Knapsack {
    static func maxValue(items: [Item], capacity: Int) -> Int {
        let n = items.count

        // dp[i][w] = maximum value using first i items with weight limit w
        var dp = Array(repeating: Array(repeating: 0, count: capacity + 1), count: n + 1)

        for i in 1...n {
            let item = items[i - 1]
            for w in 0...capacity {
                // Don't include current item
                dp[i][w] = dp[i - 1][w]

                // Include current item if possible and beneficial
                if item.weight <= w {
                    let valueWithItem = dp[i - 1][w - item.weight] + item.value
                    dp[i][w] = max(dp[i][w], valueWithItem)
                }
            }
        }

        return dp[n][capacity]
    }

    static func optimalSolution(items: [Item], capacity: Int) -> (value: Int, items: [Item]) {
        let n = items.count
        var dp = Array(repeating: Array(repeating: 0, count: capacity + 1), count: n + 1)

        // Fill DP table
        for i in 1...n {
            let item = items[i - 1]
            for w in 0...capacity {
                dp[i][w] = dp[i - 1][w]
                if item.weight <= w {
                    let valueWithItem = dp[i - 1][w - item.weight] + item.value
                    dp[i][w] = max(dp[i][w], valueWithItem)
                }
            }
        }

        // Backtrack to find which items were selected
        var selectedItems: [Item] = []
        var i = n
        var w = capacity

        while i > 0 && w > 0 {
            // If value comes from including current item
            if dp[i][w] != dp[i - 1][w] {
                selectedItems.append(items[i - 1])
                w -= items[i - 1].weight
            }
            i -= 1
        }

        return (dp[n][capacity], selectedItems.reversed())
    }
}

// Usage
let items = [
    Item(weight: 10, value: 60, name: "Item 1"),
    Item(weight: 20, value: 100, name: "Item 2"),
    Item(weight: 30, value: 120, name: "Item 3")
]

let maxVal = Knapsack.maxValue(items: items, capacity: 50)
print("Maximum value: \(maxVal)")  // 220

let solution = Knapsack.optimalSolution(items: items, capacity: 50)
print("Optimal value: \(solution.value)")
print("Items selected: \(solution.items.map { $0.name })")
```

## Longest increasing subsequence (LIS)

Find the length of the longest increasing subsequence in an array.

```swift
struct LongestIncreasingSubsequence {
    // O(n²) Dynamic Programming Solution
    static func lengthLIS(_ nums: [Int]) -> Int {
        guard !nums.isEmpty else { return 0 }

        let n = nums.count
        var dp = Array(repeating: 1, count: n)  // dp[i] = LIS length ending at index i

        for i in 1..<n {
            for j in 0..<i {
                if nums[j] < nums[i] {
                    dp[i] = max(dp[i], dp[j] + 1)
                }
            }
        }

        return dp.max() ?? 0
    }

    // O(n log n) Binary Search Solution
    static func lengthLISOptimized(_ nums: [Int]) -> Int {
        guard !nums.isEmpty else { return 0 }

        var tails: [Int] = []  // tails[i] = smallest tail of increasing subsequence of length i+1

        for num in nums {
            // Binary search for the position to insert/replace
            var left = 0
            var right = tails.count

            while left < right {
                let mid = left + (right - left) / 2
                if tails[mid] < num {
                    left = mid + 1
                } else {
                    right = mid
                }
            }

            if left == tails.count {
                tails.append(num)
            } else {
                tails[left] = num
            }
        }

        return tails.count
    }

    // Return actual LIS
    static func findLIS(_ nums: [Int]) -> [Int] {
        guard !nums.isEmpty else { return [] }

        let n = nums.count
        var dp = Array(repeating: 1, count: n)
        var parent = Array(repeating: -1, count: n)

        for i in 1..<n {
            for j in 0..<i {
                if nums[j] < nums[i] && dp[j] + 1 > dp[i] {
                    dp[i] = dp[j] + 1
                    parent[i] = j
                }
            }
        }

        // Find index of maximum LIS length
        let maxLength = dp.max()!
        let maxIndex = dp.firstIndex(of: maxLength)!

        // Reconstruct LIS
        var result: [Int] = []
        var current = maxIndex

        while current != -1 {
            result.append(nums[current])
            current = parent[current]
        }

        return result.reversed()
    }
}

// Usage
let sequence = [10, 9, 2, 5, 3, 7, 101, 18]
let lisLength = LongestIncreasingSubsequence.lengthLIS(sequence)
print("LIS Length: \(lisLength)")  // 4

let lis = LongestIncreasingSubsequence.findLIS(sequence)
print("LIS: \(lis)")  // [2, 3, 7, 18] or [2, 3, 7, 101]
```

## Edit distance (Levenshtein distance)

Calculate the minimum number of operations to transform one string into another.

```swift
struct EditDistance {
    enum Operation: String {
        case insert = "Insert"
        case delete = "Delete"
        case replace = "Replace"
    }

    static func minDistance(_ word1: String, _ word2: String) -> Int {
        let chars1 = Array(word1)
        let chars2 = Array(word2)
        let m = chars1.count
        let n = chars2.count

        // dp[i][j] = min operations to transform first i chars of word1 to first j chars of word2
        var dp = Array(repeating: Array(repeating: 0, count: n + 1), count: m + 1)

        // Initialize base cases
        for i in 0...m {
            dp[i][0] = i  // Delete all characters
        }
        for j in 0...n {
            dp[0][j] = j  // Insert all characters
        }

        for i in 1...m {
            for j in 1...n {
                if chars1[i - 1] == chars2[j - 1] {
                    dp[i][j] = dp[i - 1][j - 1]  // No operation needed
                } else {
                    dp[i][j] = 1 + min(
                        dp[i - 1][j],      // Delete
                        dp[i][j - 1],      // Insert
                        dp[i - 1][j - 1]   // Replace
                    )
                }
            }
        }

        return dp[m][n]
    }

    static func getOperations(_ word1: String, _ word2: String) -> [Operation] {
        let chars1 = Array(word1)
        let chars2 = Array(word2)
        let m = chars1.count
        let n = chars2.count

        var dp = Array(repeating: Array(repeating: 0, count: n + 1), count: m + 1)

        // Fill DP table
        for i in 0...m {
            dp[i][0] = i
        }
        for j in 0...n {
            dp[0][j] = j
        }

        for i in 1...m {
            for j in 1...n {
                if chars1[i - 1] == chars2[j - 1] {
                    dp[i][j] = dp[i - 1][j - 1]
                } else {
                    dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
                }
            }
        }

        // Backtrack to find operations
        var operations: [Operation] = []
        var i = m, j = n

        while i > 0 || j > 0 {
            if i > 0 && j > 0 && chars1[i - 1] == chars2[j - 1] {
                i -= 1
                j -= 1
            } else if i > 0 && j > 0 && dp[i][j] == dp[i - 1][j - 1] + 1 {
                operations.append(.replace)
                i -= 1
                j -= 1
            } else if i > 0 && dp[i][j] == dp[i - 1][j] + 1 {
                operations.append(.delete)
                i -= 1
            } else {
                operations.append(.insert)
                j -= 1
            }
        }

        return operations.reversed()
    }
}

// Usage
let distance = EditDistance.minDistance("intention", "execution")
print("Edit distance: \(distance)")  // 5

let operations = EditDistance.getOperations("intention", "execution")
print("Operations: \(operations.map { $0.rawValue })")
```

## Maximum subarray sum (Kadane's algorithm)

Find the contiguous subarray with the largest sum.

```swift
struct MaximumSubarray {
    static func maxSubarraySum(_ nums: [Int]) -> Int {
        guard !nums.isEmpty else { return 0 }

        var maxSoFar = nums[0]
        var maxEndingHere = nums[0]

        for i in 1..<nums.count {
            maxEndingHere = max(nums[i], maxEndingHere + nums[i])
            maxSoFar = max(maxSoFar, maxEndingHere)
        }

        return maxSoFar
    }

    static func maxSubarrayWithIndices(_ nums: [Int]) -> (sum: Int, start: Int, end: Int) {
        guard !nums.isEmpty else { return (0, 0, 0) }

        var maxSoFar = nums[0]
        var maxEndingHere = nums[0]
        var start = 0, end = 0, tempStart = 0

        for i in 1..<nums.count {
            if maxEndingHere < 0 {
                maxEndingHere = nums[i]
                tempStart = i
            } else {
                maxEndingHere += nums[i]
            }

            if maxEndingHere > maxSoFar {
                maxSoFar = maxEndingHere
                start = tempStart
                end = i
            }
        }

        return (maxSoFar, start, end)
    }
}

// Usage
let array = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
let maxSum = MaximumSubarray.maxSubarraySum(array)
print("Maximum subarray sum: \(maxSum)")  // 6

let result = MaximumSubarray.maxSubarrayWithIndices(array)
print("Sum: \(result.sum), from index \(result.start) to \(result.end)")
print("Subarray: \(Array(array[result.start...result.end]))")  // [4, -1, 2, 1]
```

## Performance analysis

### Time and space complexity

| Problem | Time Complexity | Space Complexity | Optimization Possible |
|---------|----------------|------------------|----------------------|
| Fibonacci | O(n) | O(n) → O(1) | Space optimization |
| Coin Change | O(amount × coins) | O(amount) | None |
| LCS | O(m × n) | O(m × n) → O(min(m,n)) | Space optimization |
| Knapsack | O(n × capacity) | O(n × capacity) → O(capacity) | Space optimization |
| LIS | O(n²) → O(n log n) | O(n) | Binary search |
| Edit Distance | O(m × n) | O(m × n) → O(min(m,n)) | Space optimization |
| Max Subarray | O(n) | O(1) | Already optimal |

### Space optimization technique

Many DP problems can be space-optimized when we only need the previous row/column:

```swift
// Space-optimized LCS
static func lengthLCSOptimized(_ text1: String, _ text2: String) -> Int {
    let chars1 = Array(text1)
    let chars2 = Array(text2)
    let m = chars1.count
    let n = chars2.count

    // Use only two rows instead of full table
    var prev = Array(repeating: 0, count: n + 1)
    var curr = Array(repeating: 0, count: n + 1)

    for i in 1...m {
        for j in 1...n {
            if chars1[i - 1] == chars2[j - 1] {
                curr[j] = prev[j - 1] + 1
            } else {
                curr[j] = max(prev[j], curr[j - 1])
            }
        }
        prev = curr
        curr = Array(repeating: 0, count: n + 1)
    }

    return prev[n]
}
```

## Building algorithmic intuition

Dynamic programming demonstrates several key concepts:

1. **Problem Decomposition**: We break complex problems into simpler subproblems
2. **Memoization**: We trade space for time to avoid redundant calculations
3. **Optimal Substructure**: We use optimal solutions to subproblems
4. **State Transition**: We define how to move from one state to another

### When to use dynamic programming

**Ideal for:**
- Optimization problems (min/max)
- Counting problems
- Decision problems with overlapping subproblems
- Problems with optimal substructure

**Recognition patterns:**
- "Find the optimal (minimum/maximum) way to..."
- "Count the number of ways to..."
- "Is it possible to reach..."
- The problem can be broken into similar subproblems

