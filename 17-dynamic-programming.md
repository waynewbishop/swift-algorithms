---
layout: chapter
title: "Chapter 17: Dynamic Programming"
description: "Solve complex problems with memoization"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Dynamic Programming

[Dynamic programming](https://en.wikipedia.org/wiki/Dynamic_programming) is a technique for solving problems by breaking them into smaller, overlapping subproblems and storing the results to avoid repeating work. It's one of the most powerful optimization techniques in computer science, and while the name sounds intimidating, the core concept is straightforward: remember what we've already calculated so you don't have to calculate it again.

Dynamic programming builds on recursion from Chapter 6, but adds memoization—storing results in a cache (typically a Dictionary from Chapter 15 or an Array) to avoid redundant calculations. This transforms exponential O(2^n) algorithms into linear O(n) solutions, demonstrating the dramatic space-time tradeoffs analyzed in Chapter 8. Where naive recursion uses the call stack (Chapter 10's stack concept), dynamic programming uses explicit arrays to track subproblem solutions. Some advanced DP problems even use heaps (Chapter 16) to efficiently track optimal values.

In this chapter, we'll explore dynamic programming through practical examples that demonstrate why this technique matters and how to apply it in Swift.

## The problem with naive [recursion](https://en.wikipedia.org/wiki/Recursion_(computer_science))

Let's start with a simple question: what's wrong with this Fibonacci implementation?

```swift
// Naive Fibonacci with exponential time complexity - O(2^n) due to repeated calculations
func fibonacci(_ n: Int) -> Int {
    if n <= 1 {
        return n
    }
    return fibonacci(n - 1) + fibonacci(n - 2)
}
```

This code is elegant and matches the mathematical definition perfectly. But there's a serious problem: it's incredibly slow.

**Why it's slow:**

When you calculate `fibonacci(5)`, the function calculates `fibonacci(3)` three separate times and `fibonacci(2)` five separate times. For `fibonacci(40)`, the function makes over 330 million function calls!


The time complexity is O(2^n)—exponential. For larger numbers, this approach becomes unusable.

## What is dynamic programming?

Dynamic programming solves this problem with a simple insight: **store the results of subproblems so you can reuse them instead of recalculating**.

The technique we'll focus on is called **[memoization](https://en.wikipedia.org/wiki/Memoization)**: start with the big problem and recursively break it down, storing (or memoizing) results along the way so you can reuse them.

**Note:** There's another approach called tabulation (bottom-up) that builds solutions iteratively from base cases, but memoization is often more intuitive because it follows the natural recursive structure of problems.

## Dynamic programming with memoization

Memoization means storing computed results in a cache (usually a dictionary or array). Before calculating a value, check if we've already computed it.

```swift
// Fibonacci with memoization reduces O(2^n) to O(n) by caching results in dictionary
func fibonacciMemo(_ n: Int, cache: inout [Int: Int]) -> Int {
    // Check if we've already calculated this
    if let cached = cache[n] {
        return cached
    }

    // Base cases
    if n <= 1 {
        return n
    }

    // Calculate and store the result
    let result = fibonacciMemo(n - 1, cache: &cache) +
                 fibonacciMemo(n - 2, cache: &cache)
    cache[n] = result
    return result
}

// Wrapper function for clean usage
func fibonacci(_ n: Int) -> Int {
    var cache: [Int: Int] = [:]
    return fibonacciMemo(n, cache: &cache)
}

// Usage
print(fibonacci(40))  // Completes instantly!
```

**How it works:**

1. Before calculating `fibonacci(n)`, check if it's in the cache
2. If yes, return the cached value immediately
3. If no, calculate it, store it in the cache, then return it

Now `fibonacci(5)` makes only 9 function calls instead of 15, and each value is calculated exactly once.

**[Time Complexity](https://en.wikipedia.org/wiki/Time_complexity):** O(n) - we calculate each value from 0 to n exactly once
**[Space Complexity](https://en.wikipedia.org/wiki/Space_complexity):** O(n) - we store n values in the cache plus the recursion stack

This simple change transforms an exponential algorithm into a linear one—a massive improvement!

## A practical problem: Making change

Here's a real-world problem where dynamic programming shines: given coins of different denominations and a target amount, what's the minimum number of coins needed?

**Example:** Make 11 cents using coins of [1, 4, 5]

- Naive approach: 11 pennies = 11 coins
- Better: 5 + 5 + 1 = 3 coins ✓

### The approach

For each amount from 1 to our target, we calculate the minimum coins needed by trying each coin denomination.

```swift
// Find minimum coins needed using dynamic programming array - O(amount × coins.count)
func minCoins(amount: Int, coins: [Int]) -> Int {
    // dp[i] represents minimum coins needed for amount i
    var dp = Array(repeating: Int.max, count: amount + 1)

    // Base case: 0 coins needed for amount 0
    dp[0] = 0

    // For each amount from 1 to target
    for currentAmount in 1...amount {
        // Try each coin
        for coin in coins {
            // Can we use this coin?
            if coin <= currentAmount {
                let remaining = currentAmount - coin

                // If we can make the remaining amount
                if dp[remaining] != Int.max {
                    dp[currentAmount] = min(dp[currentAmount],
                                           dp[remaining] + 1)
                }
            }
        }
    }

    // If we couldn't make the amount, return -1
    return dp[amount] == Int.max ? -1 : dp[amount]
}

// Usage
let result = minCoins(amount: 11, coins: [1, 4, 5])
print("Minimum coins needed: \(result)")  // 3
```

**How it works:**

1. Create array where `dp[i]` = minimum coins for amount `i`
2. Start with `dp[0] = 0` (no coins needed for $0)
3. For each amount, try using each coin
4. If we use a coin, we need `1 + dp[remaining amount]` coins total
5. Take the minimum across all coin choices

**Example walkthrough for amount = 11, coins = [1, 4, 5]:**

```
dp[0] = 0  // base case
dp[1] = 1  // one 1-cent coin
dp[2] = 2  // two 1-cent coins
dp[3] = 3  // three 1-cent coins
dp[4] = 1  // one 4-cent coin
dp[5] = 1  // one 5-cent coin
dp[6] = 2  // 5 + 1
dp[7] = 3  // 5 + 1 + 1
dp[8] = 2  // 4 + 4
dp[9] = 2  // 5 + 4
dp[10] = 2 // 5 + 5
dp[11] = 3 // 5 + 5 + 1 ✓
```

### Tracking which coins were used

If we need to know which coins to use (not just the count), track the parent coins:

```swift
// Track which coins were used by storing parent choices during DP computation
func minCoinsWithPath(amount: Int, coins: [Int]) -> (count: Int, coins: [Int]) {
    var dp = Array(repeating: Int.max, count: amount + 1)
    var usedCoin = Array(repeating: -1, count: amount + 1)

    dp[0] = 0

    for currentAmount in 1...amount {
        for coin in coins {
            if coin <= currentAmount && dp[currentAmount - coin] != Int.max {
                if dp[currentAmount - coin] + 1 < dp[currentAmount] {
                    dp[currentAmount] = dp[currentAmount - coin] + 1
                    usedCoin[currentAmount] = coin
                }
            }
        }
    }

    // Reconstruct the coins used
    var result: [Int] = []
    var current = amount

    while current > 0 && usedCoin[current] != -1 {
        let coin = usedCoin[current]
        result.append(coin)
        current -= coin
    }

    if dp[amount] == Int.max {
        return (-1, [])
    }

    return (dp[amount], result)
}

// Usage
let solution = minCoinsWithPath(amount: 11, coins: [1, 4, 5])
print("Minimum coins: \(solution.count)")     // 3
print("Coins to use: \(solution.coins)")      // [5, 5, 1]
```

## Comparing approaches

Let's compare naive recursion vs memoization:

| Approach | Time | Space | Fibonacci(40) | Function Calls |
|----------|------|-------|---------------|----------------|
| Naive recursion | O(2^n) | O(n) | ~5 seconds | 331,160,281 |
| Memoization | O(n) | O(n) | Instant | 79 |

The performance difference is dramatic. Exponential algorithms quickly become unusable, while dynamic programming with memoization remains fast even for large inputs.

## When to use dynamic programming

Dynamic programming works well when a problem has these characteristics:

1. **Optimal substructure** - The optimal solution contains optimal solutions to subproblems
2. **Overlapping subproblems** - The same subproblems are solved multiple times

**Common patterns that suggest DP:**

- "Find the minimum/maximum way to..."
- "Count the number of ways to..."
- "What's the longest/shortest..."
- The problem can be broken into similar smaller problems

**Examples of DP problems:**
- Fibonacci numbers (as we've seen)
- Making change with coins
- Finding shortest paths in graphs
- Text comparison and spell-checking
- Game strategy optimization

## Why memoization works so well

Memoization is effective because:

1. **Natural recursion** - The solution follows the problem's recursive structure
2. **Lazy evaluation** - Only calculates values you actually need
3. **Easy to implement** - Add caching to existing recursive code
4. **Clear logic** - Mirrors the mathematical definition of the problem

The trade-off is simple: use O(n) extra memory to reduce time complexity from O(2^n) to O(n). That's a bargain!

## Common pitfalls

**1. Forgetting base cases**
```swift
// Common pitfall: missing base case causes infinite recursion and stack overflow
// Bad - what if n is 0 or 1?
func fib(_ n: Int) -> Int {
    return fib(n - 1) + fib(n - 2)  // Infinite recursion!
}

// Good
func fib(_ n: Int) -> Int {
    if n <= 1 { return n }
    return fib(n - 1) + fib(n - 2)
}
```

**2. Off-by-one errors in array sizes**
```swift
// Common pitfall: array too small causes index out of bounds crash
// Bad - crashes when accessing dp[n]
var dp = Array(repeating: 0, count: n)

// Good - array indices go from 0 to n
var dp = Array(repeating: 0, count: n + 1)
```

**3. Not checking if a solution exists**
```swift
// Common pitfall: returning sentinel value instead of indicating no solution exists
// Bad - returns Int.max when no solution
return dp[amount]

// Good - returns -1 when impossible
return dp[amount] == Int.max ? -1 : dp[amount]
```

## Building algorithmic intuition

Dynamic programming combines several techniques we've learned:

- **Recursion (Chapter 6)**: Breaking problems into smaller versions of themselves
- **Arrays (throughout the book)**: Storing intermediate results
- **Big O analysis (Chapter 8)**: Understanding why DP is faster

The key insight is trading space for time. By using O(n) memory to store results, we reduce time complexity from exponential to linear—a massive improvement.

Think of dynamic programming like taking notes in a meeting. Instead of trying to remember everything (naive recursion), we write things down (memoization) so you can look them up later without having to reconstruct your thoughts.
