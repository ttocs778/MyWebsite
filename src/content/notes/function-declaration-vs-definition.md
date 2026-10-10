---
title: Function declaration vs definition
tags:
  - cpp
  - functions
updated: '2026-09-16T00:40:56.674Z'
source: Function declaration vs definition
---

Declaration: "this function exists, here's its signature." Definition: "here's what it actually does."

```cpp
// Declaration (usually in a .h file) - a promise
float dotProduct(const vec3& a, const vec3& b);

// Definition (usually in a .cpp file) - the actual code
float dotProduct(const vec3& a, const vec3& b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}
```
A function can be declared many times — every file that includes the header sees it — but must be defined exactly once across the whole program. That's the One Definition Rule.

## Why bother splitting them
Other `.cpp` files only need the declaration to call your function; they don't need to see (or recompile against) the implementation. Change the body without touching the header, and only that one `.cpp` needs recompiling.

## Related
[Compilation process](/notes/compilation-process)
