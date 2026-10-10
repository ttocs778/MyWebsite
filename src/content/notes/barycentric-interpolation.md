---
title: Barycentric interpolation
tags:
  - math
  - graphics
updated: '2026-09-22T04:20:37.494Z'
source: Barycentric interpolation
---

Express any point inside a triangle as a weighted blend of its three vertices. The same three weights double as a coverage test AND a way to interpolate any per-vertex attribute across the triangle.

## Math

$$
P = u \cdot A + v \cdot B + w \cdot C, \qquad u+v+w=1
$$


**Geometric meaning**: each weight is the ratio of a sub-triangle's area to the whole triangle's area — the weight for a vertex equals the area of the triangle formed by $P$ and the *other two* vertices, divided by the total:

$$
u = \frac{\text{Area}(P,B,C)}{\text{Area}(A,B,C)}, \quad v = \frac{\text{Area}(P,A,C)}{\text{Area}(A,B,C)}, \quad w = \frac{\text{Area}(P,A,B)}{\text{Area}(A,B,C)}
$$

Each area is computed via [Cross product](/notes/cross-product) (length of the 2D cross product of two edges = twice the triangle area — the sign matters here too, giving signed area, which is what makes negative weights possible for points outside the triangle).

$$

A = 0.5*length(cross(P1-P2, P3-P2))
    

$$

Intuition: as $P$ moves toward vertex $A$, the sub-triangle $(P,B,C)$ grows to fill the whole triangle, so $u \to 1$ while $v,w \to 0$ — the weights are literally a measure of "how close is $P$ to each vertex."

## Two uses of the same three numbers
1. **Coverage test**: all three weights $\ge 0$ $\Rightarrow$ $P$ is inside the triangle; any negative $\Rightarrow$ outside. See [Rasterization](/notes/rasterization) for the full edge-function framing of this.
2. **Attribute interpolation**: blend any per-vertex attribute (color, UV, normal, depth) the same way as position:

$$
\text{attrib}(P) = u \cdot \text{attrib}_A + v \cdot \text{attrib}_B + w \cdot \text{attrib}_C
$$


## Code
```cpp
glm::vec3 GetBarycentricWeights(std::array<glm::vec2,3> tri, glm::vec2 P) 
{ 
	float areaABC = EdgeFunction(tri[0], tri[1], tri[2]); 
	float u = EdgeFunction(tri[1], tri[2], P) / areaABC;
	float v = EdgeFunction(tri[2], tri[0], P) / areaABC; 
	float w = 1.0f - u - v; 
	return {u, v, w}; 
}
```

## Gotchas
- **This is screen-space interpolation only** — using these weights directly on attributes that came from 3D geometry (UV, depth, world position) gives the wrong result once perspective projection is involved, because the weights are computed from *projected* 2D positions, not the true 3D ones. See [Perspective-correct interpolation](/notes/perspective-correct-interpolation) for the divide-by-w fix this requires — barycentric interpolation and perspective-correct interpolation are not the same thing, the second builds on top of the first.
- Only two weights are independent since they must sum to 1 — compute two directly, get the third by subtraction (as in the code above), don't recompute all three from scratch.
- A weight of exactly 0 means $P$ sits exactly on the edge opposite that vertex — this is the boundary case that matters for the top-left fill rule (avoiding double-covering shared edges between adjacent triangles).

## Related
[Rasterization](/notes/rasterization)
[Cross product](/notes/cross-product)
[Perspective-correct interpolation](/notes/perspective-correct-interpolation)
