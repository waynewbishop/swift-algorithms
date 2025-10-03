---
layout: chapter
title: "Chapter 1: Introduction"
description: "Understanding algorithms and their importance in Swift development"
---

<div class="top-nav">
  <a href="index">Table of Contents</a>
</div>


# Introduction

For iOS developers at any level, learning something new can be a time-consuming and challenging process. When discussing career goals of students in my iOS Interview Program, most individuals possess a good understanding of Swift/iOS coding syntax and commonly used design patterns. However, roadblocks are encountered when understanding the ideas behind basic computer science and algorithms. If this describes you, here are four things to consider when learning this new area of development.

## Your approach

As an iOS developer, it's almost certain that you have experience writing Swift/Objective-C code and can implement design patterns that use object-orientation, model-view-controller (MVC), asynchronous functionality, or delegation. As we see in software development, there's usually a single best way to present and organize code. Much of this comes down to applying specific syntax or using components from the iOS SDK correctly. It's these "best practices" we look up in documentation or search for through (incredibly useful) websites like StackOverflow.

However, when it comes to learning computer science, you should consider putting aside the "single-best-way" technique and instead focus on proving your approach. The idea behind proving your approach is empowering but can also be confusing. Instead of thinking of a single way to solve a problem, assume there are many ways to reach a desired outcome. In the book, I cover concepts such as divide & conquer, the greedy approach, dynamic programming, and the brute-force method. When considering the brute-force technique, this implies that we're coding a solution with no concern for algorithmic efficiency. Even though a brute-force technique could be used to build an entire app, ask if that approach would be the most optimal. How would you redesign your function, app, or framework if it had to process one million rows of data? If we consider world class websites like Google, "optimal" often translates to speed and efficiency. As a result, many algorithms are merely recipes to increase performance, solve seemingly unsolvable questions or to improve data storage.

### A simple example: Finding a book

Consider an everyday scenario where you must locate "Thinking in Algorithms" within a list of 1,000 book titles written on paper. The approach you select fundamentally affects the efficiency of your search.

The first approach involves starting from the beginning and examining each title sequentially. You read the first title and ask whether it matches "Thinking in Algorithms." If not, you proceed to the second title and repeat this process. While this linear search method is straightforward and guaranteed to work, it potentially requires examining all 1,000 titles in the worst case scenario.

The second approach assumes the list is sorted alphabetically. You begin by opening to the middle of the list. If you encounter titles beginning with M, you immediately know that "Thinking in Algorithms"—starting with T—must be located in the second half of the list. With this single check, you have eliminated 500 titles from consideration. By repeatedly applying this halving process, you can locate the target title in approximately 10 checks rather than potentially 1,000.

Both approaches successfully locate the book when it exists in the list. However, the second approach exemplifies algorithmic thinking: recognizing that multiple valid solutions exist, while some demonstrate fundamentally superior efficiency. This represents the essential mindset shift required when studying algorithms—understanding that the choice of approach can transform computational complexity from linear to logarithmic performance.

## What to exclude

One of the most powerful concepts in algorithmic thinking is learning to exclude data rather than examine it. Instead of asking "how can I search through all the data to find the answer," the question gets reversed to "what data can I exclude to narrow down to the logical result."

### The number guessing game

Consider the classic number guessing game where someone thinks of a number between 1 and 100, and you attempt to identify it. After each guess, you receive feedback indicating whether your guess is too high or too low.

An inefficient approach would be to start with 1 and increment sequentially—guessing 1, then 2, then 3, and continuing this pattern until reaching the target number. In the worst case scenario, this linear strategy could require up to 100 guesses to identify the correct number.

Exclusion thinking offers a dramatically more efficient alternative. By guessing 50 first, you immediately eliminate half of the possible numbers with a single guess. If the feedback indicates "too high," you've eliminated all numbers from 51 to 100. Your next guess of 25 might be "too low," eliminating numbers 1 through 25. Continuing this pattern—guessing 37 eliminates 38-50, guessing 31 eliminates 26-31—you systematically narrow the range of possibilities. With this binary search approach, any number between 1 and 100 can be identified in at most 7 guesses.

This fundamental principle of exclusion thinking pervades algorithmic design throughout this book. When confronting searching problems, sorting challenges, or data organization questions, the most efficient solutions often emerge from asking "What can I eliminate?" rather than "What do I need to check?" This shift in perspective—from examination to exclusion—represents a cornerstone of computational efficiency.

## Thought experiments

I first heard the term thought experiment while watching a documentary on the work of Albert Einstein. While you certainly don't need to possess a genius-level understanding of STEM subjects to write code, the idea of reworking problems based on limited information is something that as developers, we will undoubtedly recognize. Again, the concept of thought experiments reinforces solving hard questions by applying an unorthodox approach. As you brainstorm, change things up and work on planning solutions on paper before committing them to code (note: this is where having a solid grasp of Big O Notation helps).

What's nice about stepping away from the computer is that your primary effort is put toward problem-solving without added consideration of perfecting code. While you work, assume the code to prove your point is possible, even if you're unable to recall the exact syntax immediately.

## Bells and whistles

The advice of bells and whistles goes hand-in-hand with conducting good thought experiments. Even though I work with many students learning Swift, iOS and interview preparation, tools like Xcode, CocoaPods and Git should be seen as secondary tools to maintain and document ideas, not as the primary way to generate new concepts. By seeing your software development tools in this context, you'll be well-positioned if, for some reason, you're asked to express the same ideas in a different programming language, tool or upgraded environment.

