---
title: Undefined behavior
tags:
  - cpp
  - fundamentals
updated: '2026-09-16T00:42:26.665Z'
source: Undefined behavior
---

Code the C++ standard places zero requirements on. Not "probably crashes" — the compiler is legally allowed to do *anything*, including appearing to work perfectly.

```cpp
int arr[5];
arr[10] = 1;   // UB - no bounds check, no guaranteed crash
int* p = nullptr;
*p;             // UB - might crash, might not
int x;
x + 1;          // UB - reading an uninitialized variable
```
This shows up constantly across this vault: [Pointer arithmetic](/notes/pointer-arithmetic), [Memory leaks and dangling pointers](/notes/memory-leaks-and-dangling-pointers), and `std_vector`'s reallocation gotcha are all specific instances of undefined behavior.

## Why "might work fine" is the scary part
A UB bug can pass every test, ship to production, and only misbehave months later when a compiler upgrade or a different machine changes what the "undefined" behavior happens to do. No guarantee it breaks the same way twice — far harder to reproduce than a guaranteed crash.

## Related
[Pointer arithmetic](/notes/pointer-arithmetic)
[Memory leaks and dangling pointers](/notes/memory-leaks-and-dangling-pointers)
