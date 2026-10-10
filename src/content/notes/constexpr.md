---
title: constexpr
tags:
  - cpp
  - keywords
updated: '2026-09-16T00:40:26.915Z'
source: constexpr
---

Tells the compiler "compute this at compile time, if at all possible."

```cpp
constexpr int square(int x) { return x * x; }

int arr[square(4)];             // 16 - computed at compile time, valid array size
constexpr int val = square(5);  // 25, baked into the binary, zero runtime cost
```

## vs #define
```cpp
#define MAX_HEALTH 100          // dumb text substitution, no type, no scope
constexpr int MAX_HEALTH = 100; // an actual typed constant, respects scope,
                                  // shows up properly in a debugger
```
`constexpr` gets everything a macro constant gives, plus type safety, without any of [the macro pitfalls](/notes/preprocessor-directives).

## Doesn't force compile-time — it allows it
```cpp
int x = getUserInput();
int y = square(x);   // still works fine, just computed at runtime instead
```
A `constexpr` function can still be called with a value only known at runtime — it just falls back to running normally, like any other function.

## Related
[Preprocessor directives](/notes/preprocessor-directives)
