---
title: Iterators
tags:
  - cpp
  - containers
updated: '2026-09-16T00:41:09.824Z'
source: Iterators
---

An object that knows how to point at an element in a container and move to the next one — a generalized pointer that works the same way regardless of the container's actual layout.

```cpp
std::vector<int> v = {1, 2, 3};
std::vector<int>::iterator it = v.begin();
*it;        // 1 - dereference, just like a pointer
++it;       // move to the next element
it == v.end();   // end() is one-past-the-last-element, not the last one
```

## What range-based for actually compiles to
```cpp
for (int x : v) { ... }

// is really shorthand for:
for (auto it = v.begin(); it != v.end(); ++it) {
    int x = *it;
    ...
}
```
Any type with `.begin()`/`.end()` can be used in a range-based for loop — this is exactly the property [the "does U::iterator exist" trick](/notes/type-traits-and-sfinae) checks for at compile time.

## Gotcha: end() is not a valid element to dereference
```cpp
auto it = v.end();
*it;   // undefined behavior - end() is a sentinel, not a real element
```

## Related
[std::vector basics](/notes/std-vector)
[Type traits and SFINAE](/notes/type-traits-and-sfinae)
