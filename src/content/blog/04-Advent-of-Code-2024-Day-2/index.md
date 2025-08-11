---
title: "Advent of Code 2024 - Day 2"
summary: "Safe and unsafe levels:  searching for O(n) solution"
date: "Aug 11 2025"
draft: false
tags:
- Advent of Code
- Algorithms
- Data Structures
- Python
---

## Input - levels 
So in this puzzle we are presented with a level - simple concept, that basically mean an array of numbers.
We also get two rules, that determine if the level is safe or not.
Level is safe, if it follows both of those rules:
- all numbers in a level are either *increasing* or *decreasing* (level is monothonic)
- two numbers in a level has to differ by *at least one*, and *at most three*

This is how the example input looks like:
```
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
```

As we see, the first level is safe, but the second is not (we have jump between 2 and 7 differ by 5, which is greater than 3 - failing the second rule).


## Level validation
We can write this rules in simple code:
``` python
def validate_level(level: list[int]) -> bool:
    first = level[0]
    second = level[1]

    if not first or not second:
        return True, None

    initial_direction = 1 if second > first else -1

    for index in range(len(level) - 1):
        first = level[index]
        second = level[index + 1]

        current_dir = 1 if second > first else -1

        if current_dir is not initial_direction:
            return False, index

        jump = abs(first - second)

        if (jump < 1) or (jump > 3):
            return False, index

    return True, None
```

This function, besides of checking if the level is safe, also returns the index of (first) number, that is not following the rules (this will come in handy for the second part of the puzzle).

This approach is simple, and we can also see only one loop. We only have to traverse the list once - this produces O(n * m) time complexity, where n is the number of levels, and m is average level length, and O(1) memory complexity (only few helper variables created).

## Part one
So the first part of the puzzle is pretty straightforward - we have to iterate over each level, and determine if it's valid or not.

``` python
def solution_1(levels: list[list[int]]) -> tuple[list[bool], bool]:
    safe_count = len(levels)
    report_result = [True for _ in levels]

    for i, level in enumerate(levels):
        is_safe, idx = validate_level(level)

        report_result[i] = is_safe

        if is_safe is False:
            safe_count -= 1

    return report_result, safe_count
```

In this code, we also calculate which levels are safe. If we only focus on the number of safe levels, we achieve O(1) memory complexity, and O(n) time complexity. Neat!

## Part two - the twist
Now our goal is also to count the number of valid levels, but this time, we have additional rule, for level validation:
- if by removing one number from the unsafe level it becomes safe - we consider it as safe

So the first idea that can come to mind is to remove each number one by one, and look if the unsafe level can be considered as safe.
This approach would however increase our time complexity.

Consider this solution:
``` python
def solution_2_bad(levels: list[list[int]]) -> tuple[list[bool], bool]:
    safe_count = len(levels)
    report_result = [True for _ in levels]

    for i, level in enumerate(levels):
        is_safe = validate_level(level)

        if not is_safe:
            for j in level:
                new_level remove_element(level, j)
                is_sublevel_safe = validate_level(new_level)

                if is_sublevel_safe:
                    break
                    
            if not report_result[i]:
                safe_count -= 1

    return report_result, safe_count
```

Now the issue is that our function is O(n * m^2)! 
We have to do (in worst case scenarion) m square operations!

This is not the best we can do, so let's utilise the returned index of failed value.

``` python
def solution_2(levels: list[list[int]]) -> tuple[list[bool], bool]:
    safe_count = len(levels)
    report_result = [True for _ in levels]

    for i, level in enumerate(levels):
        is_safe, idx = validate_level(level)

        if is_safe is True:
            report_result[i] = is_safe

            continue

        left = level.copy()
        left.pop(idx - 1)

        left_is_safe, _idx = validate_level(left)

        if left_is_safe is True:
            report_result[i] = left_is_safe

            continue

        center = level.copy()
        center.pop(idx)

        center_is_safe, _idx = validate_level(center)

        if center_is_safe is True:
            report_result[i] = center_is_safe

            continue

        right = level.copy()
        right.pop(idx + 1)

        right_is_safe, _idx = validate_level(right)

        if right_is_safe is True:
            report_result[i] = right_is_safe

            continue

        report_result[i] = False
        safe_count -= 1

    return report_result, safe_count
```

It seems to be more verbose, but it's actually less computation heavy.
In this solution, when we evaluate level as unsafe (initially), we also grab the index of value that has broken the rules.
Then, we try to remove 3 values - one on the left of the fauly one, the actual faulty one, and one on the right. This is due to the fact, that the rule is applied to the pair of numbers, so when the number fails, we are certain, that it's closest neighbourhood is faulty.

This solution works, and is less computation heavy - now we have O(n * 3 * m) time complexity worst case scenario - that is when we have to remove left, center and the right element. But we don't have to perform second m-times loop!

## Extra - more (time) optimised solution
I was satisfied with this solution, but I had gut feeling that it could be simpler. I knew that some properties of the system could be derived from the actuall difference of the two numbers - without having to manually check cases. 

Let's now look at the example:
```
Level: [6, 6, 4, 2, 1]
Diff: [0, 2, 2, 1]
```

We can spot immediately, that 0 is a violation of our rules.

Not let's consider this case:
```
Level: [1, 2, 7, 3, 4]
Diff: [-1, -5, 4, -1]
```

We see that one of the elements has different sign, which violates our rules. But remember, the diff consists of two numbers. So which one should we remove?

We decide that by adding "bad" difference to one of it's neighbours.

We have two options:
- -5 + 4 = -1
- 4 + -1 = 3

so if we go with collapsing it to -1, it's still wrong, but if we decide to collapse it to the left (-5) we land in the correct differences:
```
-1, -1, -1
```

So which number should we remove?
Look at this:
- -5 = 2 - 7 (second element minus third element)
- 4 = 7 - 3 (third element minus fourth element)
- -5 + 4 = (2 - 7) + (7 - 3) = 2 - 3

So we naturally achieve the solution - we should remove 7!

So in this solution, we perform O(n * m) calculations, so we still have the same time complexity for the first puzzle. Memory complexity however, grew from O(1) to O(m) because now we have to store the differences.

So this problem has two optimal solutions (that I have found):
- first (mine) is the time O(n * 3 * m) -> linear, and memory O(1) -> constant
- second ([found by this reddit user](https://reddit.com/user/FriendshipSweet792)) is time O(n * m) -> linear and sligtly faster, memory O(m) -> linear

