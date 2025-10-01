# Introduction

For iOS developers at any level, learning something new can be a time-consuming and challenging process. When discussing career goals of students in my iOS Interview Program, most individuals possess a good understanding of Swift/iOS coding syntax and commonly used design patterns. However, roadblocks are encountered when understanding the ideas behind basic computer science and algorithms. If this describes you, here are four things to consider when learning this new area of development.

## Your approach

As an iOS developer, it's almost certain that you have experience writing Swift/Objective-C code and can implement design patterns that use object-orientation, model-view-controller (MVC), asynchronous functionality, or delegation. As we see in software development, there's usually a single best way to present and organize code. Much of this comes down to applying specific syntax or using components from the iOS SDK correctly. It's these "best practices" we look up in documentation or search for through (incredibly useful) websites like StackOverflow.

However, when it comes to learning computer science, you should consider putting aside the "single-best-way" technique and instead focus on proving your approach. The idea behind proving your approach is empowering but can also be confusing. Instead of thinking of a single way to solve a problem, assume there are many ways to reach a desired outcome. In the book, I cover concepts such as divide & conquer, the greedy approach, dynamic programming, and the brute-force method. When considering the brute-force technique, this implies that we're coding a solution with no concern for algorithmic efficiency. Even though a brute-force technique could be used to build an entire app, ask if that approach would be the most optimal. How would you redesign your function, app, or framework if it had to process one million rows of data? If we consider world class websites like Google, "optimal" often translates to speed and efficiency. As a result, many algorithms are merely recipes to increase performance, solve seemingly unsolvable questions or to improve data storage.

### A simple example: Finding a name

Consider this everyday scenario: You have a list of 1,000 names written on paper, and you need to find "Sarah Martinez." How would you approach this?

**Approach 1: Start from the beginning**
Read the first name. Is it Sarah Martinez? No. Read the second name. Is it Sarah Martinez? No. Continue until you find it or reach the end. This is straightforward but potentially slow—you might check all 1,000 names.

**Approach 2: If the list is sorted alphabetically**
Open to the middle of the list. Are you looking at names starting with M? Since "Sarah" starts with S, you know Sarah must be in the second half. You've just eliminated 500 names with one check. Repeat this process, cutting the remaining names in half each time.

Both approaches work. Both will find Sarah Martinez if she's in the list. But Approach 2 demonstrates algorithmic thinking: it finds the answer in roughly 10 checks instead of potentially 1,000.

This is the mindset shift algorithms require—there are multiple valid solutions, but some are fundamentally more efficient than others.

## What to exclude

One of the most powerful concepts in algorithmic thinking is learning to exclude data rather than examine it. Instead of asking "how can I search through all the data to find the answer," the question gets reversed to "what data can I exclude to narrow down to the logical result."

### The number guessing game

Think about the classic number guessing game. I'm thinking of a number between 1 and 100, and you need to guess it. I'll tell you if your guess is too high or too low.

**Inefficient approach:**
- Guess 1. Too low.
- Guess 2. Too low.
- Guess 3. Too low.
- Continue incrementing...

You might need 100 guesses in the worst case.

**Exclusion thinking:**
- Guess 50. Too high.
  - You've just eliminated numbers 51-100 with one guess
- Guess 25. Too low.
  - You've eliminated numbers 1-25
- Guess 37. Too high.
  - You've eliminated numbers 38-50
- Guess 31. Too low.
  - You've eliminated numbers 26-31
- Continue narrowing...

With exclusion thinking, you can find any number between 1 and 100 in at most 7 guesses.

This principle applies to many algorithms you'll learn in this book. When you encounter searching problems, sorting challenges, or data organization questions, ask yourself: "What can I eliminate?" rather than "What do I need to check?"

## Thought experiments

I first heard the term thought experiment while watching a documentary on the work of Albert Einstein. While you certainly don't need to possess a genius-level understanding of STEM subjects to write code, the idea of reworking problems based on limited information is something that as developers, we will undoubtedly recognize. Again, the concept of thought experiments reinforces solving hard questions by applying an unorthodox approach. As you brainstorm, change things up and work on planning solutions on paper before committing them to code (note: this is where having a solid grasp of Big O Notation helps).

What's nice about stepping away from the computer is that your primary effort is put toward problem-solving without added consideration of perfecting code. While you work, assume the code to prove your point is possible, even if you're unable to recall the exact syntax immediately.

## Bells and whistles

The advice of bells and whistles goes hand-in-hand with conducting good thought experiments. Even though I work with many students learning Swift, iOS and interview preparation, tools like Xcode, CocoaPods and Git should be seen as secondary tools to maintain and document ideas, not as the primary way to generate new concepts. By seeing your software development tools in this context, you'll be well-positioned if, for some reason, you're asked to express the same ideas in a different programming language, tool or upgraded environment.

