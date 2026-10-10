---
title: Smart pointers
tags:
  - cpp
  - memory
updated: '2026-09-16T00:16:51.787Z'
source: Smart pointers
---

Three flavors, three ownership models. Picking the wrong one is how you get either a leak or a needless performance hit.

| | Owner count | Cost | Use when |
|---|---|---|---|
| [unique_ptr](/notes/unique-ptr) | exactly one | free (just a pointer) | default choice - single, clear owner |
| [shared_ptr](/notes/shared-ptr) | many, ref-counted | atomic refcount on copy/destroy | ownership genuinely shared |
| [weak_ptr](/notes/weak-ptr) | zero (observer only) | cheap to check | peek at a shared_ptr without keeping it alive |

Default to `unique_ptr`. Reach for `shared_ptr` only when you genuinely can't name one owner. `weak_ptr` almost always shows up paired with a `shared_ptr` it's watching.

## Related
[RAII](/notes/raii)
