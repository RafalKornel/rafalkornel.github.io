---
title: "Advent of Code 2024 - Day 2"
summary: "Safe and unsafe levels: searching for O(n) solution"
date: "Aug 11 2025"
draft: false
tags:
- Advent of Code
- Algorithms
- Data Structures
- Python
---

## Input - Levels 
In this puzzle, we are presented with a level — a simple concept that basically means an array of numbers.
We also have two rules that determine if the level is safe:
- All numbers in a level are either *increasing* or *decreasing* (i.e., the level is monotonic).
- Two numbers in a level must differ by *at least one* and *at most three*.

This is how the example input looks:
```
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
```

As we see, the first level is safe, but the second is not (the jump between 2 and 7 is 5, which is greater than 3—failing the second rule).

## Level Validation
We can write these rules in simple code:
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

This function, in addition to checking if the level is safe, also returns the index of the first number that does not follow the rules (this will come in handy for the second part of the puzzle).

This approach is simple, and we can see that it traverses the list only once — resulting in O(n * m) time complexity, where n is the number of levels and m is the average level length, and O(1) memory complexity (only a few helper variables are created).

## Part One
The first part of the puzzle is straightforward — we have to iterate over each level and determine if it is valid.
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

In this code, we also calculate which levels are safe. Focusing only on the number of safe levels gives O(1) memory complexity and O(n) time complexity. Neat!

## Part Two - The Twist
Now, our goal is also to count the number of valid levels, but this time we have an additional rule for validation:
- If by removing one number from an unsafe level it becomes safe, we consider that level safe.

The first idea is to remove each number one by one and check if the unsafe level becomes safe.
This approach, however, increases our time complexity.

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

Now, the issue is that our function is O(n * m^2)! 
In the worst-case scenario, we perform m squared operations!

This is not the best we can do, so let's utilize the returned index of the failed value.
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

It seems to be more verbose, but it's actually less computationally heavy.
In this solution, when we evaluate a level as unsafe, we also grab the index of the value that broke the rules.
Then, we try to remove three values — one to the left of the faulty element, the faulty element itself, and one to the right. This is because the rule applies to pairs of numbers, so when a number fails, we can be sure that its closest neighbors are involved.

This solution works and is less computation heavy—now we have O(n * 3 * m) time complexity in the worst-case scenario (when we have to remove the left, center, and right elements). But we don't have to perform an additional m-times loop!

## Extra - More (Time) Optimised Solution
I was satisfied with this solution, but I had a gut feeling that it could be simpler. I knew that some properties of the system could be derived from the actual differences between numbers—without having to manually check cases.

Let's look at the example:
```
Level: [6, 6, 4, 2, 1]
Diff: [0, 2, 2, 1]
```

We can immediately spot that 0 is a violation of our rules.

Now, consider this case:
```
Level: [1, 2, 7, 3, 4]
Diff: [-1, -5, 4, -1]
```

We see that one of the differences has a different sign, which violates our rules. But remember, the diff consists of two numbers. So, which one should we remove?

We decide that by adding the "bad" difference to one of its neighbors.

We have two options:
- -5 + 4 = -1
- 4 + -1 = 3

So, if we collapse it to -1, it's still incorrect, but if we decide to collapse it to the left (-5), we obtain the correct differences:
```
-1, -1, -1
```

So, which number should we remove?
Consider:
- -5 = 2 - 7 (second element minus third element)
- 4 = 7 - 3 (third element minus fourth element)
- -5 + 4 = (2 - 7) + (7 - 3) = 2 - 3

Thus, we naturally arrive at the solution—we should remove 7!

In this solution, we perform O(n * m) calculations, so we still have the same time complexity for the first puzzle. Memory complexity, however, grew from O(1) to O(m) because we now have to store the differences.

So, this problem has two optimal solutions (that I have found):
- First (mine) is O(n * 3 * m) (linear time and constant memory, O(1)).
- Second ([found by this Reddit user](https://reddit.com/user/FriendshipSweet792)) is O(n * m) (linear time and slightly faster) with O(m) memory (linear).

