---
title: Cross product
tags:
  - math
  - graphics
updated: '2026-09-21T19:04:04.055Z'
source: Cross product
---

`a×b` gives a vector perpendicular to both a and b. Its length equals the area of the parallelogram they span, twice the triangle area.

## Math
**Geometric definition** (coordinate-free — direction + magnitude):

$$
\vec{a} \times \vec{b} = |\vec{a}||\vec{b}|\sin\theta\ \hat{n}
$$

where $\hat{n}$ is the unit vector perpendicular to both a and b, direction given by the right-hand rule. This form makes the area fact obvious for free: $|\vec{a}||\vec{b}|\sin\theta$ is exactly the parallelogram-area formula (two sides times the sine of the angle between them).

**Why $\hat{n}$ isn't circular**: $\hat{n}$ is not solved for from this equation, it's determined independently, straight from the right-hand rule applied to a and b (point fingers along a, curl toward b, thumb gives $\hat{n}$) before the equation is ever evaluated. This works because "perpendicular to a" alone is a whole plane of directions, but "perpendicular to both a AND b" (assuming they're not parallel) narrows that down to a single line through the origin, i.e. exactly two opposite unit vectors. The right-hand rule is just the convention that picks one of those two — there's no unknown left to solve, $\hat{n}$ is fixed before you plug numbers in.

**Component form** (equivalent, no angle needed — what you actually compute with):

$$
\vec{a} \times \vec{b} = (a_y b_z - a_z b_y,\ a_z b_x - a_x b_z,\ a_x b_y - a_y b_x)
$$


Same definition, two views: the geometric form is for reasoning about what the result *means* (perpendicular vector, area); the component form is for *computing* it directly from coordinates without ever solving for θ.

**Geometric meaning**: the result is the unique (up to sign) vector perpendicular to both inputs, direction given by the right-hand rule (curl fingers from a to b, thumb points along a×b).

**What the result means**:
- Direction → the surface normal of the plane a and b lie in
- Length → area of the parallelogram spanned by a and b ($= 2 \times$ the triangle area if a,b are two edges of a triangle)
- Length = 0 → a and b are parallel or antiparallel (or one is the zero vector) — degenerate, no unique perpendicular direction exists
- For 2D vectors ($a_z = b_z = 0$), only the z-component survives:

$$
\text{cross}_z = a_x b_y - a_y b_x
$$

its sign tells you whether rotating from a to b (short way) is CCW ($> 0$) or CW ($< 0$)

Anticommutative: $\vec{a} \times \vec{b} = -(\vec{b} \times \vec{a})$ — swap the operand order, the sign flips.

## Code
```cpp
glm::vec3 edge1 = v1 - v0;
glm::vec3 edge2 = v2 - v0;
glm::vec3 faceNormal = glm::normalize(glm::cross(edge1, edge2));
float triArea = glm::length(glm::cross(edge1, edge2)) * 0.5f;
```

## Uses in graphics
- Computing a triangle/face normal from two of its edges (above)
- [Back-face culling](/notes/back-face-culling) — sign of the 2D cross product (winding order test)
- Point-in-triangle test: a point is inside if the cross product of each edge with (point - vertex) has consistent sign for all three edges
- Building an orthonormal basis / tangent space (TBN matrix) for normal mapping: bitangent = cross(normal, tangent)
- Physics: torque = r × F, angular momentum, angular velocity direction

## Gotchas
- Order matters: $(B-A) \times (C-A) \neq (C-A) \times (B-A)$ — swapping two vertices in a winding-order or normal calculation flips the sign/direction.
- Length tells you area/degeneracy, not orientation — a zero-length result says the inputs are collinear, it doesn't tell you anything about front/back-facing or CW/CCW.

## Related
- [Dot product](/notes/dot-product)
- [Back-face culling](/notes/back-face-culling)
