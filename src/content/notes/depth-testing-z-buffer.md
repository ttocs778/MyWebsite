---
title: Depth testing (Z-buffer)
tags:
  - graphics
updated: '2026-09-21T18:56:51.947Z'
source: Depth testing (Z-buffer)
---

Per-fragment test deciding which of several triangles covering the same pixel is actually visible, by comparing stored depth values — the standard alternative to sorting triangles by distance.

## How it works
A depth buffer (Z-buffer) stores one depth value per pixel, same resolution as the color buffer. Initialized to the farthest possible value. For every fragment produced by rasterization:
```
if (fragment.depth < depthBuffer[pixel]) {   // closer than what's stored
    depthBuffer[pixel] = fragment.depth;
    colorBuffer[pixel] = fragment.color;
}
// else: fragment is occluded, discarded
```
This makes rendering order mostly irrelevant for opaque geometry — draw triangles in any order, the closest one always wins per pixel.

## What "depth" actually is
The value stored is NDC/screen-space z (often remapped to $[0,1]$), not raw view-space distance. One useful, non-obvious hardware fact: even though other attributes (UV, color) need [Perspective-correct interpolation](/notes/perspective-correct-interpolation) to interpolate correctly across a triangle, **NDC z can be interpolated linearly in screen space directly** — a consequence of how the projection matrix is structured. GPUs exploit this; it's not an approximation.

## Gotchas
- **Non-linear precision distribution**: NDC z is a non-linear (roughly $1/z$-shaped) function of view-space depth. Precision clusters heavily near the camera and gets very coarse far away — this is the direct cause of z-fighting between distant, nearly-coplanar surfaces. Mitigations: push the near plane out (the single biggest lever — precision loss is much more sensitive to near-plane distance than far-plane distance), a logarithmic depth buffer, or reversed-Z (map near→1, far→0; combined with floating-point's higher density near zero, this significantly improves the precision distribution — a standard technique in modern engines).
- **Transparency breaks the simple model**: alpha-blended objects generally can't just run the normal test-and-write — see [Material properties](/notes/material-properties)'s Opacity/Alpha gotcha. Typically: sort back-to-front, and keep depth *testing* on but turn depth *writing* off for the transparent pass, otherwise a transparent fragment drawn first would incorrectly occlude one behind it that should show through.
- **Early-Z as a performance optimization**: if a fragment shader has no `discard`/alpha-test and doesn't write depth itself, the GPU can run the depth test *before* the (potentially expensive) fragment shader runs, skipping the shader entirely for occluded fragments. Writing to depth or using `discard` in the fragment shader disables this optimization for that draw.

## Related
[Rasterization](/notes/rasterization)
[Coordinate spaces (rendering pipeline)](/notes/coordinate-spaces-rendering-pipeline)
[Material properties](/notes/material-properties)
