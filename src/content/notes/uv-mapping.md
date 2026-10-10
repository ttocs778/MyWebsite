---
title: UV mapping
tags:
  - graphics
updated: '2026-09-21T18:50:20.984Z'
source: UV mapping
---

The mapping from points on a 3D mesh surface to 2D coordinates $(u,v) \in [0,1]^2$ on a texture image, an "address" telling the renderer where on the texture each surface point should sample from.

## How it's made
Not computed at runtime — it's authored data, stored per-vertex alongside position and normal. An artist "unwraps" the mesh (cuts it along seams, flattens it into 2D UV shells) in a modeling tool, then either paints the texture directly onto that unwrapped layout, or manually aligns the UV shells onto an existing texture image.

## Is it injective (one-to-one)?
**Not required, and often deliberately broken** for efficiency:
- **Mirrored UV**: symmetric parts (left/right eye, left/right arm) share the same UV shell — halves the texture resolution needed, edits sync automatically. Two different 3D points, same UV.
- **Tiling/repeating UV**: a wall or floor repeats one small texture across a large surface via UV values outside $[0,1]$ combined with texture wrap mode. Many 3D points, same small UV region.
- **Texture atlas reuse**: multiple mesh parts sharing one region of a shared texture sheet.

**When injectivity IS required**: lightmap baking, baked AO, or any per-point baked data needs a **separate, non-overlapping UV channel** (e.g. Unreal's Lightmap UV / UV1) — every surface point needs its own unique storage texel, or two different points' baked data corrupt each other. This is kept as a second UV channel, independent from the main (possibly non-injective) texture UV channel (UV0).

## Gotchas
- Handing UV mapping "any image" always works mechanically — sampling is a deterministic lookup, it never fails or produces an undefined result. Looking wrong isn't the mechanism failing; it's either a content mismatch (the image wasn't authored for that UV layout) or a UV parameterization quality problem (uneven area/angle preservation causing visible stretching), not a "precision" issue.
- V-axis direction is a common cross-API gotcha: OpenGL and DirectX/Unreal disagree on which corner is the UV origin — textures can come in flipped vertically when porting between engines.

## Related
[Texture sampling](/notes/texture-sampling)
[Material properties](/notes/material-properties)
[Perspective-correct interpolation](/notes/perspective-correct-interpolation)
