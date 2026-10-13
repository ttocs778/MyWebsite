---
title: NDC and aspect ratio correction
tags:
  - graphics
  - opengl
  - math
updated: '2026-10-13T03:14:32.353Z'
source: NDC and aspect ratio correction
---

NDC is the box x, y, z ∈ [-1, 1] that the GPU maps onto the window. Because the window is not square, one NDC unit is a different number of pixels in x and y, so geometry must be pre-squashed.

## NDC
```
(-1, 1) ──────── (1, 1)
   │      (0,0)     │      center is the origin
(-1,-1) ──────── (1,-1)
```
Anything outside is clipped. z also has to be in [-1, 1].

`(cos θ, sin θ)` lies on the unit circle and touches the edges; multiply by a radius (e.g. 0.5) for margin.

## Aspect ratio correction
640×480 window: one NDC unit in x = 320 px, in y = 240 px.
Divide x by `aspect = width / height` so the GPU's stretch cancels it out.

| | `vs_Pos` | after `x /= 1.333` | on screen |
| --- | --- | --- | --- |
| right point | (0.5, 0) | (0.375, 0) | 0.375 × 320 = 120 px |
| top point | (0, 0.5) | (0, 0.5) | 0.5 × 240 = 120 px |

Same distance on screen → a true circle.

## Which space to do math in
The corrected position is **deliberately distorted** so the screen stretch cancels it. Only `gl_Position` gets that stretch.

Shader math like `length` for a ring pattern is not stretched by anything, so it must use a space where x and y units are equal: the original `vs_Pos`, or `gl_FragCoord / screenSize` with `uv.x *= aspect`. Using the corrected position turns circles into ellipses.

## 2D homogeneous coordinates
- Store 2D vertices as `vec3(x, y, 1)` so a `mat3` can translate as well as rotate and scale.
- Shader order: `u_Model * vs_Pos` first, aspect correction second, output z = 0.
- Transforming after the correction would rotate in the squashed space and deform the shape.

## Related
[OpenGL Hub](/notes/opengl-hub) · [Coordinate spaces (rendering pipeline)](/notes/coordinate-spaces-rendering-pipeline) · [Clipping](/notes/clipping) · [Matrix composition order (SRT)](/notes/matrix-composition-order-srt)
