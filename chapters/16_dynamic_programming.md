# Dynamic Programming

In our exploration of algorithms, we've applied many techniques to produce results. Some concepts have used iOS-specific patterns while others have been more generalized. Although it hasn't been explicitly mentioned, some of our solutions have used a particular programming style called dynamic programming. While straightforward in theory, its application can sometimes be nuanced. When applied correctly, dynamic programming can have a powerful effect on how you to write code. In this essay, we'll introduce the concept and implementation of dynamic programming.

## Save For Later

If you've purchased something through Amazon.com, you'll be familiar with the site term - "Save For Later". As the phrase implies, shoppers are provided the option to add items to their cart or save them to a "Wish List" for later viewing. When writing algorithms, we often face a similar choice of completing actions (performing computations) as data is being interpreted or storing the results for later use. Examples include retrieving JSON data from a RESTful service or using the Core Data Framework:

In iOS, design patterns can help us time and coordinate how data is processed. Specific techniques include multi-threaded operations (e.g. Grand Central Dispatch), Notifications and Delegation. Dynamic programming (DP) on the other hand, isn't necessarily a single coding technique, but rather how to think about actions (e.g. sub problems) that occur as a function operates. The resulting DP solution could differ depending on the problem. In its simplest form, dynamic programming relies on data storage and reuse to increase algorithm efficiency. The process of data reuse is also called memoization and can take many forms. As we'll see, this style of programming provides numerous benefits.

## Fibonacci Revisited

In the essay on Recursion, we compared building the classic sequence of Array values using both iterative and recursive techniques. As discussed, these algorithms were designed to produce an Array sequence, not to calculate a particular result. Taking this into account, we can create a new version of Fibonacci to return a single Int value:

```swift
func fibRecursive(n: Int) -> Int {
    if n == 0 {
        return 0
    }

    if n <= 2 {
        return 1
    }

    return fibRecursive(n: n-1) + fibRecursive(n: n-2)
}
```

At first glance, it appears this seemingly small function would also be efficient. However, upon further analysis, we see numerous recursive calls must be made for it to calculate any result. As shown below, since fibRecursive cannot store previously calculated values, its recursive calls increase exponentially:

## Fibonacci Memoized

Let's try a different technique. Designed as a nested Swift function, fibMemoized captures the Array return value from its fibSequence sub-function to calculate a final value:

```swift
extension Int {
    //memoized version
    mutating func fibMemoized() -> Int {
        //builds array sequence
        func fibSequence(_ sequence: Array<Int> = [0, 1]) -> Array<Int> {
            var final = Array<Int>()

            //mutated copy
            var output = sequence
            let i: Int = output.count

            //set base condition - linear time O(n)
            if i == self {
                return output
            }

            let results: Int = output[i - 1] + output[i - 2]
            output.append(results)

            //set iteration
            final = fibSequence(output)

            return final
        }

        //calculate final product - constant time O(1)
        let results = fibSequence()
        let answer: Int = results[results.endIndex - 1] + results[results.endIndex - 2]

        return answer
    }
}
```

Even though fibSquence includes a recursive sequence, its base case is determined by the number of requested Array positions (n). In performance terms, we say fibSequence runs in linear time or O(n). This performance improvement is achieved by memoizing the Array sequence needed to calculate the final product. As a result, each sequence permutation is computed once. The benefit of this technique is seen when comparing the two algorithms, shown below:

## Shortest Paths

Code memoization can also improve a program's efficiency to the point of making seemingly difficult or nearly unsolvable questions answerable. An example of this can be seen with Dijkstra's Algorithm and Shortest Paths. To review, we created a unique data structure named Path with the goal of storing specific traversal metadata:

```swift
//the path class maintains objects that comprise the "frontier"
class Path {
    var total: Int
    var destination: Vertex
    var previous: Path?

    //object initialization
    init() {
        destination = Vertex()
        total = 0
    }
}
```

What makes Path useful is its ability to store data on nodes previously visited. Similar to our revised Fibonacci algorithm, Path stores the cumulative Edge weights all traversed vertices (total) as well as a complete history of each visited Vertex. Used effectively, this allows the programmer to answer questions such as the complexity of navigating to a particular destination Vertex, if the traversal was indeed successful (in finding the destination), as well as the list of nodes visited throughout. Depending on the Graph size and complexity, not having this information available could mean having the algorithm take so long to (re)compute data that it becomes too slow to be effective, or not being able to solve vital questions due to insufficient data.
