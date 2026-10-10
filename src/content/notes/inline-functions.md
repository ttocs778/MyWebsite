---
title: inline functions
tags:
  - cpp
  - keywords
updated: '2026-09-16T00:41:06.585Z'
source: inline functions
---

A hint to the compiler: "paste this function's body directly at each call site instead of doing a real call."

```cpp
inline int square(int x) { return x * x; }
```

## Why
Skips the overhead of a real call — worth it for tiny, hot-path functions. Modern compilers usually inline small functions on their own anyway with optimizations on; `inline` matters less for speed today and more for its other job.

## The other job: getting around the One Definition Rule
A function defined in a header (and pasted into multiple `.cpp` files) would normally violate "defined exactly once" — `inline` tells the linker "these definitions are all identical, just pick one." This is why small member functions written directly inside a class body are implicitly `inline`.

## Related
[Compilation process](/notes/compilation-process)
