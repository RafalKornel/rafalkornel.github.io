---
title: "Advent of Code 2024 - Day 3"
summary: "Parsing code with state machines"
date: "Aug 12 2025"
draft: false
tags:
- Advent of Code
- Algorithms
- Data Structures
- Python
---

## Did the AoC team invent a new language?

Not really. The input for today's puzzle (Day 3 of AoC, i.e., 03.12.2024 🤣) looks a lot like primitive, minified code — but it has only one syntax token defined (so far). We get something like this:

```
xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))
```

In this code, we are interested in **mul(X,Y)** phrases. These represent multiplication operations between X and Y. Our goal is to parse this code and calculate the sum of all multiplication results.

## State machines FTW

State machines are a great fit for this kind of problem. But what is a state machine?

A state machine is a structure with states and behavior that models state changes. Most commonly, states are represented by an `enum` or by string values.

We will parse each character of the input and change the state of the machine based on predefined rules.

Here are the states we'll use:

```python
class ParserState(Enum):
    IDLE = "idle"
    OPERATION = "operation"
    PARAMETERS = "parameters"
    READY = "ready"
    FAILED = "failed"
```

- **IDLE**: The default state; we haven't started parsing an operation.
- **OPERATION**: We've encountered a valid operation keyword and are parsing it.
- **PARAMETERS**: We're parsing the operation's arguments.
- **READY**: The operation has been successfully parsed.
- **FAILED**: Parsing failed.

These states will be used in two independent classes: `Parser` (for identifying operations) and `Operation` (for parsing parameters). For now, we only have one operation: `mul`.

### Operation class

```python
class Operation(ABC):
    type: str = NotImplemented
    state: ParserState = ParserState.PARAMETERS
    args: list[int] = []

    def __init__(self):
        self.args = []

    def __repr__(self):
        return f"[{self.type}] {self.state}"

    def consume(self, char: str) -> Operation | None:
        if self.state == ParserState.PARAMETERS and char == ")":
            self.state = ParserState.READY
            return self
```

This basic structure holds the parsing state, the operation type, and any parsed arguments.

## Parser

Here's our abstract `Parser` class:

```python
class Parser:
    stack: list[str] = []
    operation: Operation | None = None
    state: ParserState = ParserState.IDLE
    debug: bool = False
    operations: list[Operation] = []

    def __init__(self, operations: list[Operation], debug=False):
        self.operations = operations
        self.debug = debug

    def restart(self):
        if self.debug:
            print()
        self.state = ParserState.IDLE
        self.stack.clear()
        self.operation = None
        return self

    def __repr__(self):
        return f"State {self.state} | Operation ({self.operation}) | Stack {self.stack}"

    def consume(self, char: str) -> MultOperation | None:
        if self.debug:
            print(char, self)

        if self.state == ParserState.IDLE:
            self.stack.append(char)
            if char != "(":
                return

            for operation in self.operations:
                length = len(operation.type)
                phrase = "".join(self.stack[-length - 1 : -1 :])
                if phrase == operation.type:
                    self.restart()
                    self.state = ParserState.OPERATION
                    self.operation = operation()
                    return

        elif self.state == ParserState.OPERATION:
            if not self.operation:
                return
            res = self.operation.consume(char)
            if not res:
                return
            self.restart()
            if res.state == ParserState.READY:
                return res
```

Example usage:
``` python
class MyOperation(Operation):
    type: 'smth'

    def consume(self, char: str):
        pass

my_parser = Parser([MyOperation])

inp = "smth(1,2,3)and_other?"

for c in inp:
    res = my_parser.consume(c)

    if res and res.state == ParserState.READY:
        # we have successfully parsed the operation!
        pass
```

This structure lets us define operations independently and control how their arguments are parsed.

The important note here is that we start parsing operation, when we encounter operation keyword, followed by the open parenthesis sign `(`. 
Because of that, we have to perform slicing `[-length - 1 : -1 :]` on the current character stack.
We start parsing `mul`, when we have `[..., m, u, l, (]` and go straight to the parameters parsing. This is arbitrary rule, that makes parsing our puzzle a bit simpler.


## The `mul` operation

```python
class MultOperation(Operation):
    type = "mul"
    stack: list[str] = []
    state: ParserState = ParserState.PARAMETERS

    def __repr__(self):
        return f"MULT - State {self.state} | Args: {self.args}"

    def restart(self):
        self.stack.clear()
        self.state = ParserState.FAILED
        return self

    def consume(self, char: str) -> Operation | None:
        if self.state != ParserState.PARAMETERS:
            return

        if char.isdigit():
            self.stack.append(char)
        elif char == "," and len(self.stack) > 0:
            number_as_str = int("".join(self.stack))
            self.args.append(number_as_str)
            self.stack.clear()
        elif char == ")" and len(self.stack) > 0:
            number_as_str = int("".join(self.stack))
            self.args.append(number_as_str)
            self.stack.clear()
            if len(self.args) == 2:
                self.state = ParserState.READY
                return self
            else:
                return self.restart()
        else:
            return self.restart()
```

When we encounter a comma, we store the current number and continue parsing. When we see a closing parenthesis, we check if we have exactly two arguments; if so, the operation is ready.

## Full solution (Part 1)

```python
def solution_1(stream: str):
    total = 0
    parser = Parser(operations=[MultOperation], debug=False)

    for char in stream:
        res = parser.consume(char)

        if res is None:
            continue

        if res.state != ParserState.READY or len(res.args) != 2:
            continue

        total += res.args[0] * res.args[1]

    return total
```

We pass in a stream of characters, and parse each one by one. When we receive operation that was parsed successfully (READY state) and it has exactly two arguments, then we can perform the operation.

## Analysis of the complexity
So this solution works in O(n) time complexity. We only have to iterate over each character exactly once. We don't have to jump back and forth. That seems great!

The memory complexity is O(1), because we only store some minor helper arrays and values. After correctly parsing the operation, we can remove it from memory, and reset our parsing stack.

This solution seems quite efficient, considering also that we have the flexibility of extensive code, that allows us to implement other types of operations.


## Part 2 - additional operations
In the second part we receive two additional operations - `do` and `don't`.
Our test input looks like this:
```
xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
```

As we can se, we have:
- mul(2, 4)
- don't()
- mul(5, 5)
- mul(11, 8)
- do()
- mul(8, 5)

Those operations basically toggle, when we should use `mul` operations in our sum.

Because we've defined default behaviour in our abstract `Operation` class (default meaning parsing exactly zero arguments), we can now simply define new operations:
``` python
class DoOperation(Operation):
    type = "do"

class DontOperation(Operation):
    type = "don't"
```

Solution:

```python
def solution_2(stream: str):
    operations: list[Operation] = []
    parser = Parser(operations=[MultOperation, DoOperation, DontOperation], debug=False)

    for char in stream:
        res = parser.consume(char)
        if res is not None:
            operations.append(res)

    total = 0
    is_enabled = True

    for op in operations:
        if op.type == DoOperation.type:
            is_enabled = True
        elif op.type == DontOperation.type:
            is_enabled = False
        elif (
            op.type == MultOperation.type
            and op.state == ParserState.READY
            and is_enabled
        ):
            total += op.args[0] * op.args[1]

    return total, operations
```

Now we parse the input, and store operations on the side.
Then we iterate over the operations, and use `is_enabled` toggle, to correctly calculate the sum. If we encounter `do` operation, we enable summing, if we encounter `don't`, we disable it. 

## Analysis of complexity (part 2)
Time complexity remains **O(n)**, but memory usage is now **O(n)** since we store all parsed operations.

## Conclusion

We've successfully parsed the input (or "memory" in puzzle terms) using a flexible state machine approach. It feels like writing a parser for a tiny programming language with C-like function calls. Maybe in the coming days we'll build a full AST (Abstract Syntax Tree)?

We'll see.

Thanks for reading, and see you in the next article!
