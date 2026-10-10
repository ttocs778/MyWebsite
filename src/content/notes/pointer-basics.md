---
title: Pointer basics
tags:
  - cpp
  - pointers
updated: '2026-09-16T00:41:47.829Z'
source: Pointer basics
---

A pointer is a variable that stores a memory address instead of a value.

```cpp
int x = 5;
int* p = &x;    // &  = "address of" -> p now holds x's address
*p = 10;        // *  = "dereference" -> follow the address, x is now 10
std::cout << p;   // prints the address itself
std::cout << *p;  // prints 10
```

## nullptr — a pointer that points nowhere
```cpp
int* p = nullptr;
*p = 5;   // crash - dereferencing null is undefined behavior
```
Always check before dereferencing a pointer you're not sure about.

## Related
[References vs pointers](/notes/references-vs-pointers)
[nullptr](/notes/nullptr)
