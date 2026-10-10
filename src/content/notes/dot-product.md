---
title: Dot product
tags:
  - math
  - graphics
updated: '2026-09-17T19:03:15.657Z'
source: Dot product
---

`a·b = |a||b|cos(theta)`. Measures how aligned two vectors are, not distance, not area.

## Math

$$
\vec{a} \cdot \vec{b} = |\vec{a}||\vec{b}|\cos\theta = a_x b_x + a_y b_y + a_z b_z
$$


**Geometric meaning**: $\vec{a} \cdot \vec{b}$ is $|\vec{a}|$ times the signed length of $\vec{b}$'s projection onto $\vec{a}$'s direction (or symmetrically the other way). If $\vec{a}$ is a unit vector, $\vec{a} \cdot \vec{b}$ IS that signed projection length directly.

**What the result means**:
- Sign only, direction-agnostic magnitude aside: $\vec{a} \cdot \vec{b} > 0 \Rightarrow \theta < 90°$, $= 0 \Rightarrow$ perpendicular, $< 0 \Rightarrow \theta > 90°$
- Full angle if you need it (expensive, avoid unless necessary): $\theta = \arccos\left(\frac{\vec{a}\cdot\vec{b}}{|\vec{a}||\vec{b}|}\right)$
- If both vectors are unit length, the dot product is bounded to $[-1, 1]$ and directly equals $\cos\theta$

## Code
```cpp
float dot = glm::dot(a, b);
float projLength = glm::dot(a, glm::normalize(b));  // scalar projection of a onto b
```

## Uses in graphics
- [Back-face culling](/notes/back-face-culling) — sign of N·V
- Diffuse (Lambertian) lighting: intensity ∝ max(0, N·L)
- Specular highlights (Blinn-Phong): N·H term
- Which side of a plane a point is on: sign of `planeNormal · (point - planePoint)`
- Camera frustum / visibility checks: `dot(cameraForward, dirToObject)` to reject anything behind the camera
- Closest point on a line/ray to another point (scalar projection)

## Gotchas
- Dot product alone can't tell you the exact angle, only which side of 90° you're on — use the sign, don't reach for `acos` unless you actually need the number.
- Only equals `cos(theta)` directly when both vectors are normalized; otherwise it's scaled by both magnitudes, don't forget to divide if you need the pure angle relationship.

## Related
- [Cross product](/notes/cross-product)
- [Back-face culling](/notes/back-face-culling)
