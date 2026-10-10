---
title: noexcept
tags:
  - cpp
  - keywords
updated: '2026-09-16T00:41:22.216Z'
source: noexcept
---

A promise: "this function will never throw an exception."

```cpp
void resetCounter() noexcept { count = 0; }
```

## Why containers care
```cpp
Node(Node&& other) noexcept { ... }   // move constructor
```
`std::vector` needs to move its elements when it grows. If the move constructor might throw partway through, a failed move could leave the vector in a corrupted, half-moved state — so vector plays it safe and *copies* instead. Mark the move constructor `noexcept` and vector actually uses it, getting the performance it was written for in the first place.

## Break the promise, and the program terminates
If a `noexcept` function throws anyway, `std::terminate()` is called immediately — no stack unwinding, no catch block gets a chance. Only mark something `noexcept` if certain.

## Related
[Rule of Five and deep copy](/notes/rule-of-five-and-deep-copy)
