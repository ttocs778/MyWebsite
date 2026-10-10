---
title: nullptr
tags:
  - cpp
  - keywords
  - pointers
updated: '2026-09-16T00:41:25.545Z'
source: nullptr
---

A pointer literal meaning "points at nothing." Introduced in C++11 to replace the older `NULL` and plain `0`.

```cpp
int* p = nullptr;

if (p == nullptr) { ... }   // explicit and clear
if (!p)            { ... }   // equivalent, more common in practice
```

## Why not just use 0 or NULL
```cpp
void f(int x);
void f(char* p);

f(NULL);     // ambiguous, or picks the wrong overload - NULL is often just `0`,
             // an int, not a pointer at all
f(nullptr);  // unambiguous - only matches the pointer overload
```
`nullptr` has its own type, `std::nullptr_t`, which converts to any pointer type but not to `int`. That's the entire fix.

## Related
[Pointer basics](/notes/pointer-basics)
