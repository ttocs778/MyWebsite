---
title: Rasterization
tags:
  - graphics
updated: '2026-09-28T06:57:17.184Z'
source: Rasterization
---

Deciding which pixels a projected triangle covers, and what color/attributes each covered pixel gets. Runs at the very end of the pipeline, once vertices are already in pixel space (see [Coordinate spaces (rendering pipeline)](/notes/coordinate-spaces-rendering-pipeline)) — before that point there's no such thing as "a pixel" to test against.

Splits into two separate problems:
1. **Coverage test** — is this pixel inside the triangle? (the two methods below)
2. **Attribute interpolation** — for covered pixels, what color/UV/depth do they get? See [Perspective-correct interpolation](/notes/perspective-correct-interpolation).

## Method 1: Scanline (row bound checking)
For each pixel row, find where the triangle's two active edges intersect that row, then fill everything between the two intersection x-values directly — no per-pixel test needed for the interior.

**Row/edge overlap test**: an edge with endpoints at $y_0, y_1$ overlaps row $y$ if and only if

$$
\min(y_0, y_1) \le y \le \max(y_0, y_1)
$$

(the three configurations — row entirely above the edge, entirely below, or straddling it — all collapse into this one interval check).

Where it overlaps, the intersection x is a straight linear interpolation between the edge's two endpoints at that y.

**Cost profile**: cheap per-pixel (2 intersection calcs per row, then one batch fill), but inherently sequential row-by-row — awkward to parallelize across thousands of GPU cores.

## Method 2: Bounding box + point-in-triangle test (barycentric / edge function)
Build an axis-aligned bounding box around the triangle, then test every pixel inside that box independently.

Two equivalent framings of the same underlying math:
- **Edge function**: for each edge (say $A \to B$), compute $\text{cross}(B-A,\ P-A)$. If the sign agrees across all three edges, $P$ is inside.
- **Barycentric weights**: solve $(u,v,w)$ such that $P = uA + vB + wC$, $u+v+w=1$. $P$ is inside iff $u,v,w \ge 0$. See [Barycentric interpolation](/notes/barycentric-interpolation) for the full geometric derivation and how the same weights are reused for attribute interpolation, and [Cross product](/notes/cross-product) for how the weights are actually computed (sub-triangle area ratios via cross product).

These are not two different methods — barycentric weights are the *normalized* edge-function results. That normalization step is exactly what lets them double as interpolation weights, so the same computation both tests coverage and drives attribute interpolation.

**Cost profile**: tests every pixel in the bounding box, including ones outside the triangle — more raw per-pixel work than scanline. But every pixel's test is fully independent, so it parallelizes trivially across GPU cores, and the weights are reused for interpolation for free. That's why GPUs use this method despite it being less efficient per-pixel in isolation.

## Combining both methods in practice
The two methods aren't mutually exclusive. A common real implementation: use **scanline** to cheaply find the horizontal x-range covered on each row (the coverage test), then use **barycentric weights** for every pixel inside that range to interpolate color/depth correctly. You get scanline's cheap per-row bounds AND barycentric's reusable interpolation weights, without paying for a full bounding-box point-in-triangle test on every pixel.


## Related
[Cross product](/notes/cross-product)
[Perspective-correct interpolation](/notes/perspective-correct-interpolation)
[Coordinate spaces (rendering pipeline)](/notes/coordinate-spaces-rendering-pipeline)
[Depth testing (Z-buffer)](/notes/depth-testing-z-buffer)
[Barycentric interpolation](/notes/barycentric-interpolation)
