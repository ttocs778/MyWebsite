---
title: this pointer
tags:
  - cpp
  - oop
updated: '2026-09-16T00:42:20.105Z'
source: this pointer
---

Inside any non-static member function, `this` is a pointer to the object the function was called on.

```cpp
class Node {
public:
    Node& operator=(const Node& other) {
        if (this == &other) return *this;   // self-assignment check
        // ...
        return *this;    // *this = the actual object, lets callers chain
    }
};
```

## Why operator= checks this == &other
```cpp
node = node;   // legal, if weird, C++
```
Without the check, some implementations of `operator=` would clear/free `this`'s data before realizing `other` *was* `this` all along — destroying the very data it was about to copy from.

## Related
[Constructors and destructors](/notes/constructors-and-destructors)
