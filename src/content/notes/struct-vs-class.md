---
title: struct vs class
tags:
  - cpp
  - oop
updated: '2026-09-16T00:42:17.224Z'
source: struct vs class
---

Functionally almost identical in C++ — the only real difference is the default access level.

```cpp
struct Point { int x, y; };        // members default to public
class Point  { int x, y; };        // members default to private
```

## Convention, not a hard rule
- `struct` — a plain bundle of data, no invariants to protect, all fields meant to be poked at directly (`vec3`, a POD settings struct).
- `class` — has behavior, hides its internals, enforces rules about how it can be used.

Nothing stops you from writing a `struct` with private members and methods, or a `class` with everything public — the compiler doesn't care. This is purely a readability convention everyone agreed to follow.

## Related
[Members and access control](/notes/members-and-access-control)
