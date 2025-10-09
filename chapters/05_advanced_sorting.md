# Advanced Sorting

The sorting functions reviewed in the previous chapter each performed with a time complexity of O(n²). While good for interview situations and general academic knowledge, algorithms like insertionSort and bubbleSort are seldom used in production code. The Quicksort algorithm, however, has broader practical application and usage. The commonly used algorithm is found in both code libraries and real-life projects. Quicksort also features a time complexity of O(n log n) and applies a divide & conquer strategy. This combination results in advanced algorithmic performance.

## How it works

Quicksort applies a series of rules to "swap" pairs of values. Swap events are performed "in place" so no additional structures are needed to process data. In our implementation, special variables named wall and pivot will help manage the swapping process.

The above illustration shows the algorithm at the start of its sorting process. The function begins by comparing each index value to a "comparison" value (e.g., pivot). The wall represents the position of values that have been swapped or evaluated. Since we've just started the sorting process, the current and wall indices are shown as the same value (eg., 7).

> **DIVIDE & CONQUER**: The process of deconstructing a single, complex system into a series of sub-systems. In computer science, divide & conquer strategies can be found in search/sorting algorithms, graphs and dynamic programming.

## Making comparisons

The next step compares the current and pivot values. Since the current value (e.g., 7) is greater than the pivot (e.g., 4), no swap occurs. However, the current index advances to the next position.

In this step, the current value (e.g., 2) is again compared with the pivot. Since 2 is less than 4, the wall is swapped with the current index value. Once complete, the wall advances to the next index position.

## Conquering the divide

The process of comparing and swapping occurs until the current index meets the pivot.

Once complete, the pivot is swapped with the wall index value. Interestingly, once the pivot is swapped, it's considered sorted. Even though most values remain unsorted (at this phase), all values less than 4 are now positioned to the left. Conversely, all values greater than 4 are positioned to the right.

The initial pivot value of 4 has been used to show how Quicksort can divide a collection into relatively equal segments. This process is called **partitioning**. To sort the remaining values, each value left or right of the initial pivot is also treated as a pivot and the process is repeated.

## The code

In code, the entire algorithm is expressed as two functions. The main quickSort function manages the overall execution - specifically, the selection of each pivot value. Similar to our other sorting algorithms, the quickSort implementation is written as an Array extension. However, the nested function applies recursion as its main control structure:

```swift
extension Array where Element: Comparable {
    mutating func quickSort() -> Array<Element> {
        func qSort(start startIndex: Int, _ pivot: Int) {
            if (startIndex < pivot) {
                let iPivot = qPartition(start: startIndex, pivot)
                qSort(start: startIndex, iPivot - 1)
                qSort(start: iPivot + 1, pivot)
            }
        }

        qSort(start: 0, self.endIndex - 1)
        return self
    }
}

//execute sort
var sequence: Array<Int> = [7, 2, 1, 6, 8, 5, 3, 4]
let results = sequence.quickSort()
```

Finally, the qPartition process sorts a selected pivot value to its correct index position:

```swift
//sorts selected pivot
mutating func qPartition(start startIndex: Int, _ pivot: Int) -> Int {
    var wallIndex: Int = startIndex

    //compare range with pivot
    for currentIndex in wallIndex..<pivot {
        print("current is: \(self[currentIndex]). pivot is \(self[pivot])")

        if self[currentIndex] <= self[pivot] {
            if wallIndex != currentIndex {
                self.swapAt(currentIndex, wallIndex)
            }

            //advance wall
            wallIndex += 1
        }
    }

    //move pivot to final position
    if wallIndex != pivot {
        self.swapAt(wallIndex, pivot)
    }

    return wallIndex
}
```
