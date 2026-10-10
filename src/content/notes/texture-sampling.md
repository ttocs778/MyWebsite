---
title: Texture sampling
tags:
  - graphics
updated: '2026-09-21T18:47:06.987Z'
source: Texture sampling
---

Two different orders for getting a color onto a triangle: sample-then-interpolate, or interpolate-then-sample. Only one of them is actually correct for anything but the simplest textures.

## Method 1: Sample colors at vertices, then blend (WRONG for texturing)
1. Sample the texture only at the 3 vertices (3 samples total, regardless of triangle size)
2. Blend those 3 already-sampled colors across the triangle using barycentric weights

## Method 2: Blend UVs per-fragment, then sample (what GPUs actually do)
1. Interpolate the UV coordinate itself to get each pixel's own precise UV (via [Perspective-correct interpolation](/notes/perspective-correct-interpolation))
2. Sample the texture once per pixel, using that pixel's own UV

## Why order matters
Interpolation (a linear operation, `w0*V0 + w1*V1 + w2*V2`) can only ever produce a smooth, monotonic blend between its inputs — it is mathematically incapable of inventing a value that isn't implied by the inputs. A texture is an arbitrary function `color = f(u,v)` that can contain sharp, localized, non-linear detail anywhere (a highlight, an edge, text) — detail that has no reason to sit exactly on a vertex.

**Method 1 fails** because it only samples 3 points total; any detail that doesn't happen to land on a vertex is never sampled and gets silently erased, replaced by a flat interpolated blend of whatever the 3 vertices happened to be. Gets worse as the triangle gets larger (more area for detail to hide in) or the texture gets more complex — but even with similar vertex colors, hidden non-linear detail is lost.

**Method 2 works** because interpolation is only ever applied to UV coordinates, which genuinely are linear across a flat triangle — no information is lost interpolating them. The non-linear part (the texture's actual content) is handled by sampling — a real lookup into real data — once per pixel, so every pixel gets its own faithful answer regardless of triangle size.

## Cost
Method 2 costs one texture sample per pixel instead of per vertex — strictly more expensive, but non-negotiable: the alternative is textures that go blurry/lose all detail past a handful of triangles. No production renderer uses Method 1 for actual texture mapping.

## Related
[UV mapping](/notes/uv-mapping)
[Perspective-correct interpolation](/notes/perspective-correct-interpolation)
[Rasterization](/notes/rasterization)
