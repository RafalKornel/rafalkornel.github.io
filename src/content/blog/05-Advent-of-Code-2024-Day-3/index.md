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

## Did AOC team invent new language?
Not really. The input for today's puzzle (I mean day 3 of AOC, so like 03.12.2024 🤣) seems very similar to primitive, minified code - but it only have one syntaxt token defined (so far). 
We are presented with something like this:
```
xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))
```
In this code, we are interested in **mul(X,Y)** phrases. This represent the multiplication operation, between X and Y.
So our goal is to parse this type of code, and then calculate the sum of all operation results.

## State machines FTW
For this type of tasks, state machines are a quite good fit. But what is a state machine?
State machine is a structure, with states, and behaviour that models the state changes. Most commonly, the states are represented by the enum structure, sometimes by the string values.

We will parse each character of the input, and change the state of the machine, based on our predefined rules.

So let's define states, that we will use.

``` python
class ParserState(Enum):
    IDLE = "idle"
    OPERATION = "operation"
    PARAMETERS = "parameters"
    READY = "ready"
    FAILED = "failed"
```

**IDLE** is the default state, it means we did not start parsing the operation yet. **OPERATION** means we encountered the valid operation keyword, and are now parsing it. **PARAMETERS** means we are parsing the operation's arguments (or parameters). **READY** means we've parsed the operation, and **FAILED** means we did not succeed. This states will be used in two independent classes - `Parser` will be responsible for iterating over characters, and determining IDLE and OPERATION states, whereas PARAMTERS, READY and FAILED will be used in `Operation` parser - this is specific parser for the parameters of the operations. For now we only have one operation defined - `mul` (meaning multiplication).

We have to define some utilities. First, `Operation` abstract class:
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

This is basic data structure, that will hold information about the status of parsing operation's inputs (arguments / parameters), and also the operation type itself.

## Parser

Having that, we can define somewhat abstract `Parser` class:
``` python
class Parser:
    stack: list[str] = []
    operation: Operation | None = None
    state: ParserState = ParserState.IDLE

    debug: bool = False

    operations: list[Operation] = []

    def __init__(self, operations: list[Operation], debug=False):
        self.operations = operations
        self.debug = debug
        pass

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

This structure allow us to define operations independently, define how we parse it's arguments (we can implement parsing arbitrary parameters, numbers, strings, n, infinite etc.). This flexibility will come in handy in the second part of the puzzle (and maybe later in the AOC?)

The important note here is that we start parsing operation, when we encounter operation keyword, followed by the open parenthesis sign `(`. 
Because of that, we have to perform slicing `[-length - 1 : -1 :]` on the current character stack.
We start parsing `mul`, when we have `[..., m, u, l, (]` and go straight to the parameters parsing. This is arbitrary rule, that makes parsing our puzzle a bit simpler.

## Mult operation
So now let's focus on the `mul` operation.

``` python
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

The `MultOperation` class inherits (or actually implements) the `Operation` abstract class, by defining the rules of parsing input. We store `args` array, so right here we can parse arbitraty number of the arguments. When we find delimeter (`,`), we flush the operation's `stack` into the `args` array, and continue parsing. When we encounter closing parenthesis sign `)`, we finish parsing, check if we have exactly two arguments, and return operation object with the data, and READY status.

## Full solution
Here is full solution for part 1:
``` python
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

Our solution now looks like this:
``` python
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
The core algorithm didn't change actually. We still have to parse input (so iterate over each character individually), so time complexity stays at O(n).

The memory complexity of this approach is O(n), because in worst case scenario (only valid mul operations in a sequence), we would have n/8 operations (`mul` + `(` + X + `,` + Y + `)` -> that's 8 characters total).

## Conclusion
And that's it! We've successfully parsed the input (which in the puzzle terminology is called memory). This experience seems like parsing a programming language - very primitive one. We have c-like function invokations, and actually only handle three simple functions.
Nonetheless, it was very interesting puzzle. Maybe in the next days we have to create actuall AST (abstract syntaxt tree)? 

We'll see.

Thanks for reading, see you in the next article!