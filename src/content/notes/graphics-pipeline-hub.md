---
title: Graphics Pipeline Hub
tags:
  - graphics
updated: '2026-09-28T06:11:06.723Z'
source: Graphics Pipeline Hub
---

**Hub card** — maps each graphics pipeline stage to the atomic concept cards covering it. This card holds no derivations itself, just the map.

## Stage 1: Vertex Shading
Transform each vertex from object space to clip space.
- [Matrix composition order (SRT)](/notes/matrix-composition-order-srt) — how the Model matrix is built (T*R*S ordering)
- [Coordinate spaces (rendering pipeline)](/notes/coordinate-spaces-rendering-pipeline) — World → Camera (View_Mat) → Clip (Proj_Mat)

## Stage 2: Vertex Post-Processing
Clip space → screen space → pixel space.
- [Coordinate spaces (rendering pipeline)](/notes/coordinate-spaces-rendering-pipeline) — perspective divide (Clip→Screen) and viewport transform (Screen→Pixel)
- [Clipping](/notes/clipping) — cutting triangles against the frustum in clip space, before the divide

## Stage 3: Primitive Assembly / Culling
Vertices are grouped into triangles; triangles facing away from the camera are discarded before any per-pixel work happens.
- [Back-face culling](/notes/back-face-culling) — dot-product method and winding-order method

## Stage 4: Rasterization
Determine which pixels each surviving triangle covers, and interpolate per-pixel attributes.
- [Rasterization](/notes/rasterization) — scanline vs bounding-box/barycentric coverage tests
- [Barycentric interpolation](/notes/barycentric-interpolation) — the weights themselves: geometric meaning, coverage test, attribute interpolation
- [Perspective-correct interpolation](/notes/perspective-correct-interpolation) — why naive screen-space lerp of attributes is wrong, and the divide-by-w fix

## Stage 5: Fragment Shading
Per-pixel color computation: sampling textures, applying materials, computing lighting.
- [UV mapping](/notes/uv-mapping) — how surface points map to texture coordinates
- [Texture sampling](/notes/texture-sampling) — sample-then-interpolate vs interpolate-then-sample, and why order matters
- [Lighting](/notes/lighting) — Lambert diffuse, Phong/Blinn-Phong reflection, Gouraud vs Phong shading
- [Material properties](/notes/material-properties) — Base Color, Metallic, Roughness, Normal Map, Diffuse Lighting, and the rest of the PBR parameter set

## Stage 6: Per-Fragment Operations
After a fragment's color is computed, decide whether and how it actually reaches the framebuffer.
- [Depth testing (Z-buffer)](/notes/depth-testing-z-buffer) — occlusion via per-pixel depth comparison
- Stencil testing, alpha blending — not yet carded

## Cross-cutting math (used across multiple stages, not owned by one)
- [Dot product](/notes/dot-product)
- [Cross product](/notes/cross-product)
