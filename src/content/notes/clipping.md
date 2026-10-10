---
title: Clipping
tags:
  - graphics
updated: '2026-09-21T18:56:36.181Z'
source: Clipping
---

Cutting triangles against the view frustum's boundaries in clip space, before the perspective divide — not an optional cleanup step, a mathematical necessity.

## Why it must happen in clip space, before the divide

The view frustum test in clip space is a set of **linear** inequalities on the homogeneous coordinates:

$$
-w_c \le x_c \le w_c, \quad -w_c \le y_c \le w_c, \quad -w_c \le z_c \le w_c
$$


Because these are linear, a triangle edge crossing one of these boundary planes can be clipped with a simple linear interpolation — find the parameter $t$ where the edge crosses the plane, and every attribute (including $w$ itself) can be linearly interpolated to that $t$ and still be correct, because nothing has been divided yet.

**If you divided by w first** (going to NDC before clipping), the mapping $(x,y,z) \to (x/w, y/w, z/w)$ is non-linear. A straight 3D edge does not stay straight under this mapping in general — clipping against straight-line boundaries in already-divided space would require intersecting with curves, not lines. Clipping is done in clip space specifically to keep the intersection math linear and simple.

## Why it must happen at all (not just "for cleanliness")
Points at or behind the camera have $w_c \le 0$. Dividing by a zero or negative $w$ either blows up (division by zero) or flips the sign of every coordinate (a point behind the camera would get mapped to seemingly-valid NDC coordinates on the *opposite* side of the screen instead of being correctly recognized as off-screen). Near-plane clipping specifically exists to guarantee every vertex that survives to the perspective divide has $w_c > 0$.

## Where $w_c$ actually comes from
For a typical perspective projection matrix (OpenGL-style, right-handed view space where the camera looks down $-z$):

$$
P = \begin{bmatrix} a&0&0&0 \\ 0&b&0&0 \\ 0&0&A&B \\ 0&0&-1&0 \end{bmatrix}
$$

Multiplying by a view-space vertex $(x_v, y_v, z_v, 1)$ gives $w_c = -z_v$. Since visible points have $z_v < 0$ in this convention, $w_c$ comes out positive — this is why the negation is there, purely to keep $w$ positive for points in front of the camera. (See [Coordinate spaces (rendering pipeline)](/notes/coordinate-spaces-rendering-pipeline) for the sign-convention note on $w_k$ vs $z_c$ — depends on how your source defines $z_c$.)

## Pipeline placement
```
Camera Space --Proj_Mat--> Clip Space --[CLIPPING HAPPENS HERE]--> perspective divide --> Screen Space (NDC)
```

## Related
[Coordinate spaces (rendering pipeline)](/notes/coordinate-spaces-rendering-pipeline)
[Perspective-correct interpolation](/notes/perspective-correct-interpolation)
[Back-face culling](/notes/back-face-culling)
