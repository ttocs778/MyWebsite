---
title: Operators and expressions
tags:
  - cpp
  - fundamentals
updated: '2026-09-16T00:41:38.086Z'
source: Operators and expressions
---

An expression computes a value. A statement does something (often by evaluating an expression and discarding or assigning the result).

## Common operator groups
```cpp
a + b, a - b, a * b, a / b, a % b       // arithmetic
a == b, a != b, a < b, a >= b            // comparison, all return bool
a && b, a || b, !a                       // logical
a & b, a | b, a ^ b, ~a, a << 1, a >> 1  // bitwise
a = b, a += b, a *= b                    // assignment
```

## Gotcha: integer division truncates
```cpp
int result = 5 / 2;        // 2, not 2.5
float result2 = 5 / 2;     // still 2! division happens before the float conversion
float result3 = 5.0f / 2;  // 2.5 - now it's a real float division
```
The division happens based on the operand types, not the type you're storing into. Cast at least one operand if you want a real division.

## Gotcha: = vs ==
```cpp
if (x = 5) { ... }   // compiles! assigns 5, then checks if 5 is truthy
if (x == 5) { ... }  // what you probably meant
```

## Related
[Control flow](/notes/control-flow)
