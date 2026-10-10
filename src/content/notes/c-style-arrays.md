---
title: C-style arrays
tags:
  - cpp
  - pointers
updated: '2026-09-16T00:40:15.796Z'
source: C-style arrays
---

A fixed-size, contiguous block of the same type. No bounds checking, no built-in size tracking.

```cpp
int arr[5] = {1, 2, 3, 4, 5};
arr[0];                        // 1
sizeof(arr) / sizeof(arr[0]);  // 5 - the only built-in way to get its length
```

## Decays to a pointer almost everywhere
```cpp
void printSize(int arr[]) {
    sizeof(arr);   // this is sizeof(int*), NOT the original array's size!
}
```
Pass a C-array to a function and it decays into a plain pointer — the function has no idea how big the original array was. This is exactly the problem `std::vector` and `std::array` exist to fix.

## Related
[std::vector basics](/notes/std-vector)
[Pointer arithmetic](/notes/pointer-arithmetic)
