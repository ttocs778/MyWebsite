---
title: Pointer arithmetic
tags:
  - cpp
  - pointers
updated: '2026-09-16T00:41:44.678Z'
source: Pointer arithmetic
---

Adding to a pointer moves it by *elements*, not bytes — the compiler scales by `sizeof(T)` automatically.

```cpp
int arr[5] = {10, 20, 30, 40, 50};
int* p = arr;       // points at arr[0]
p++;                 // now points at arr[1], moved 4 bytes (sizeof(int))
std::cout << *p;     // 20

int* p2 = arr + 3;   // points at arr[3]
```

## Array indexing IS pointer arithmetic
```cpp
arr[2]   // literally means *(arr + 2)
```
That's why array indexing never checks bounds — it's just address math, and the compiler trusts you not to walk off the end.

## Gotcha
Pointer arithmetic across two unrelated allocations (subtracting pointers into different arrays, walking past the end of one array into whatever memory follows) is undefined behavior. It might "work" — you're not owed anything.

## Related
[Pointer basics](/notes/pointer-basics)
[C-style arrays](/notes/c-style-arrays)
