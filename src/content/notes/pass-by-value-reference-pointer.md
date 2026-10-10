---
title: Pass by value, reference, pointer
tags:
  - cpp
  - fundamentals
  - pointers
updated: '2026-09-16T00:41:41.349Z'
source: Pass by value, reference, pointer
---

Three ways to hand a function an argument — each answers "can the function change my variable, and does it copy anything?" differently.

```cpp
void byValue(Node n);            // copies n. Changes inside don't touch the caller's copy.
void byRef(Node& n);             // no copy. Changes inside DO affect the caller's variable.
void byConstRef(const Node& n);  // no copy, can't modify - the default for big objects
void byPointer(Node* n);         // no copy, can modify, can be nullptr (which & can't be)
```

## Default rule of thumb
- Small, cheap-to-copy types (`int`, `float`, `bool`) → pass by value, don't overthink it.
- Big objects you're only reading → `const&`, skip the copy.
- Need to modify the caller's variable → `&` (or `*` if "no value at all" is a valid case).

## Related
[Const keyword](/notes/const-keyword)
[References vs pointers](/notes/references-vs-pointers)
[Pointer basics](/notes/pointer-basics)
