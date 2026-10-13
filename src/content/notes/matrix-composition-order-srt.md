---
title: Matrix composition order (SRT)
tags:
  - math
  - graphics
updated: '2026-09-29T00:36:50.812Z'
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

## Two ways to read the same product (Euler and Fixed, Local and World)
Right-to-left is only half the rule. The same matrix product reads correctly in either direction; what changes is which axes each step rotates around.

- **Right to left:** each step rotates about the **fixed world** axes
- **Left to right:** each step rotates about the object's **local** axes, as moved by the previous steps

Both readings land on the same final orientation. The intermediate poses differ.

### Why
The matrix closest to the vector runs first, while the object is still in its own frame, so it acts on local axes. The matrix farthest from the vector runs last, after everything to its right has already placed the object in the world, so it acts on world axes.

So adding one more rotation $R$ to an existing orientation $M$:

```
M' = R * M    // premultiply: R turns about world axes
M' = M * R    // postmultiply: R turns about local axes
```

### Euler vs. fixed angles
| Type               | Rotate A, then B, then C | Matrix                                            |
| ------------------ | ------------------------ | ------------------------------------------------- |
| Fixed (world axes) | premultiply each step    | $R_C \cdot R_B \cdot R_A$, reversed from the name |
| Euler (local axes) | postmultiply each step   | $R_A \cdot R_B \cdot R_C$, same order as the name |

So **Euler XYZ = fixed ZYX = `Rx * Ry * Rz`**, and Euler ZYX = fixed XYZ. The matrix itself carries no label saying which one it is; that's only which direction you choose to read it. 这里从左读转坐标系，比如相机：TR（本地运动所以R乘在右边），虽然实际发生的时候先R再T，但local从左读是移动坐标系，先T再R，为什么不会发生sweep？因为我们先移动坐标系到T的位置再转（世界原点现在在相机需要移动到的位置），这就完全等于从右往左读的时候只移动物体先R再T。

The scene graph uses the local reading: `parentWorld * localTransform` postmultiplies, so a child moves in its parent's frame. Turn the shoulder, and the elbow's own rotation is relative to wherever the shoulder left it.

### Convention check
All of this assumes **column vectors**, `v' = M * v` with the vector on the right (glm, OpenGL, this course). Row-vector convention (`v' = v * M`, older DirectX) mirrors everything left to right. Check which side a source puts the vector on before trusting its order.
## Related
[Rule of Five and deep copy](/notes/rule-of-five-and-deep-copy)
