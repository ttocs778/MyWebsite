---
title: Variables and basic types
tags:
  - cpp
  - fundamentals
updated: '2026-09-16T00:42:33.516Z'
source: Variables and basic types
---

A variable is a name attached to a chunk of memory of a known size. The type decides that size and how the bits get interpreted.

## Code
```cpp
int a = 5;        // 4 bytes, signed integer
float b = 3.14f;  // 4 bytes, floating point
double c = 3.14;  // 8 bytes, more precision
char d = 'x';     // 1 byte
bool e = true;    // 1 byte (usually)
```
Same number of bits, different meaning depending on type — the bit pattern for `int 5` and `float 5.0f` look nothing alike.

## Initialization matters
```cpp
int x;        // uninitialized - garbage, whatever was in memory before
int y = 0;    // explicitly zero
int z{};      // brace-init, also zero, and warns on narrowing conversions
```
An uninitialized local variable is not zero. It's whatever garbage happened to be sitting at that address. Always initialize.

## Related
[Const keyword](/notes/const-keyword)
[Operators and expressions](/notes/operators-and-expressions)
