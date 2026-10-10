---
title: new and delete
tags:
  - cpp
  - memory
updated: '2026-09-16T00:17:29.641Z'
source: new and delete
---

`new` allocates on the heap and calls the constructor. `delete` calls the destructor and frees the memory. They must be paired — every `new` needs exactly one matching `delete`.

```cpp
Node* n = new Node();
delete n;

int* arr = new int[10];
delete[] arr;   // array new needs array delete - mixing these is undefined behavior
```

## Why nobody should write this directly
Forget the `delete` → leak. `delete` twice → crash or corrupted heap (see [Rule of Five and deep copy](/notes/rule-of-five-and-deep-copy)). `delete` and keep using the pointer → dangling pointer, reading/writing memory you no longer own. This entire category of bug is why [Smart pointers](/notes/smart-pointers) exist — they call `delete` for you, automatically, exactly once.

## Related
[Stack vs heap](/notes/stack-vs-heap)
[Smart pointers](/notes/smart-pointers)
