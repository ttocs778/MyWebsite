---
title: References vs pointers
tags:
  - cpp
  - pointers
updated: '2026-09-16T00:41:54.016Z'
source: References vs pointers
---

Both let you refer to another variable without copying it. A reference is the friendlier, more restricted cousin.

| | Pointer | Reference |
|---|---|---|
| Can be null | yes | no — must bind to something real at creation |
| Can be reassigned | yes | no — bound for life |
| Needs `*`/`->` to use | yes | no — looks like the object itself |
| Can do arithmetic | yes | no |

```cpp
int x = 5;
int& ref = x;   // ref IS x now, forever
int* ptr = &x;  // ptr points at x, but can later point elsewhere
ref = 10;       // x is now 10, no & or * needed
```

## When to use which
Default to a reference — cleaner syntax, and "can't be null" is one less thing to check. Reach for a pointer only when you genuinely need "might not point at anything" or "might point somewhere else later."

## Related
[Pointer basics](/notes/pointer-basics)
