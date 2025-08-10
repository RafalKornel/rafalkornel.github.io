---
title: "Advent of Code 2024 - Day 1"
summary: "Let's start this algorithmic challange from day one!"
date: "Aug 10 2025"
draft: false
tags:
- Advent of Code
- Algorithms
- Data Structures
- Python
---

## Ahh shit, here we go again

How many times have I tried doing AOC? in my 5 year proffesional career, I think at least 3 times. And unfortunately, I have never finished any. 

So I am trying again. This time I will be using plain old python, and I want to focus on problem solving, and not on language specifics. I will try finding the most optimal solution, and sometimes explore other's solutions.

## Day 1 - Warm up

As usually, day one is easy, it only has to start us up.

We have input data:
```
3   4
4   3
2   5
1   3
3   9
3   3
```
Two columns of numbers. Our goal is to find distance between two number, starting from lowest number on the left, and lowest on the right, etc...

TL;DR - we have to sort two lists, then calculate diff and sum it.

``` python
def solution_1(left: list[int], right: list[int]) -> int:
    left.sort()
    right.sort()

    total = 0

    for i in range(len(left)):
        total += abs(left[i] - right[i])

    return total
```

There is not much to say here. The memory complexity in is O(1), because we don't have to store any data other than total sum, and time complexity is:
- sorting takes O(n * logn), because that's what most common sorting algorithms are capable of
- iterating over the list take O(n)

Total combined time complexity is bound to sorting of the lists. If we had lists pre-sorted, we would have O(n).

## Part two
In the second our goal is to find the similarity score. We take number on the left, count how many times it occurs in the right list, and multiply them. That's the score of each entry in the left list, our goal is to sum it up.

``` python 
def solution_2(left: list[int], right: list[int]) -> int:
    right_occurances = {}

    # Create map of occurances - O(n)
    for r in right:
        if r in right_occurances:
            right_occurances[r] += 1
        else:
            right_occurances[r] = 1

    total = 0

    # calculate total score - O(n)
    for l in left:
        if l not in right_occurances:
            continue

        occurances = right_occurances[l]

        total += occurances * l

    return total
```

In this case we perform two loops. Firstly, we iterate over the right list, and we create map of the occurances. Operations on maps (dicts in python), are mostly constant time. So constructing `right_occurances` map has O(n) time complexity.

Then, we perform second iteration, over the left list. Since maps has O(1) retrieval complexity, our total complexity of this part is also O(n).

Our memory complexity is roughly O(n), because in the worst case, right array would have only unique elements, and we would have entry in map for each of it. In the averate case, it would be less than that.

## The end

So that's all for this puzzle. As said, first day is always easy, so we are not surprised at all.
See you in the next article!