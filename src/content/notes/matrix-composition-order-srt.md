---
title: Matrix composition order (SRT)
tags:
  - math
  - graphics
updated: '2026-09-28T03:01:34.816Z'
source: Matrix composition order (SRT)
---

Matrices apply to a point right-to-left. `M = T * R * S` applied to a
point executes as: scale first, then rotate, then translate.

```
finalTransform  = T * R * S
worldTransform  = parentWorld * localTransform   // same rule, one level up
```

## Why this order
Scaling/rotating an object "in place" only makes sense before it has been
moved away from the origin - do translation last (written leftmost) and
you scale/rotate around wherever the object currently sits, distorting it
unpredictably.

## Gotcha: a scale drags along anything positioned after it in the chain
If a translation is applied *before* a scale in the same chain (i.e.
written to the scale's right), the scale also shrinks/grows that
translation's distance from the origin - not just the object's size.

```cpp
// wrong: the -0.5 offset gets pulled toward the origin by the scale
Rotate -> Scale -> Translate(0, -0.5)

// right: offset applied to the already-final-sized shape
Rotate -> Translate(0, -0.5) -> Scale
```

Rule of thumb: nothing should be a descendant of a Scale node except the
thing actually being drawn. Any "where does the next joint go" math
should branch off a point in the hierarchy *before* any scale has been
applied - otherwise the joint offset gets silently multiplied by the
scale factor.

<img src="/notes-img/pasted-image-20260927230133.webp" alt="" width="736" height="403" loading="lazy" decoding="async" />
## Related
[Rule of Five and deep copy](/notes/rule-of-five-and-deep-copy)
