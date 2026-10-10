---
title: Lambda expressions
tags:
  - cpp
  - functional
updated: '2026-09-16T00:43:23.451Z'
source: Lambda expressions
---

An inline, anonymous function you can define right where you need it.

```cpp
auto isEven = [](int x) { return x % 2 == 0; };
isEven(4);   // true

std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });  // descending
```
`[]` is the capture clause, `()` the parameters — same as any normal function from there.

## Capturing outside variables
```cpp
int threshold = 10;
auto aboveThreshold = [threshold](int x) { return x > threshold; };  // by value, a snapshot
auto modifyOutside   = [&threshold](int x) { threshold = x; };        // by reference, live link
auto captureAll      = [=] { ... };   // everything by value (avoid - unclear what's used)
auto captureAllRef   = [&] { ... };   // everything by reference (avoid - same reason)
```
Want to call a member function or touch a member variable inside a lambda? Capture `this`.

## Storing one for later
```cpp
std::function<bool(int,int)> comparator = [](int a, int b) { return a > b; };
```
Every lambda has its own unique, compiler-generated, unnamable type — `auto` works for storing one immediately, but if you need to pass it around, return it, or store it as a class member, wrap it in `std::function` instead.

## Related
[Functional STL algorithms](/notes/functional-stl-algorithms)
[Callback functions](/notes/callback-functions)
