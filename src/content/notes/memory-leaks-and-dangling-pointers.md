---
title: Memory leaks and dangling pointers
tags:
  - cpp
  - memory
updated: '2026-09-16T00:17:35.251Z'
source: Memory leaks and dangling pointers
---

Two different failure modes, easy to mix up.

## Leak: forgot to free something
```cpp
void f() {
    int* p = new int(5);
    // ... no delete, function returns, p is gone but the int isn't freed
}
```
The memory is still allocated, but nothing points at it anymore — the only reference is lost and it can never be freed. Memory usage just quietly grows over time.

## Dangling pointer: freed, but still using it
```cpp
int* p = new int(5);
delete p;
*p = 10;   // p still holds the old address - reading/writing freed memory
```
That memory might get reused by something else entirely by the time you touch it again. Reads garbage, writes corrupt someone else's data — and it might "work" in testing and fail randomly in production.

## Fix for both
Don't manage raw `new`/`delete` by hand — use [Smart pointers](/notes/smart-pointers). They free exactly once, automatically, when the owner goes out of scope.

## Related
[new and delete](/notes/new-and-delete)
[Smart pointers](/notes/smart-pointers)
