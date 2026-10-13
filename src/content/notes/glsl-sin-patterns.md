---
title: GLSL sin patterns
tags:
  - graphics
  - glsl
  - math
updated: '2026-10-13T02:57:39.155Z'
source: GLSL sin patterns
---

Most procedural shader effects are one formula with different inputs. Learn the formula and what to feed it, not individual effects.

## The formula

`A · sin(F · x + P) + C`

| Param | Controls | Bigger means |
| --- | --- | --- |
| `F` frequency | How fast / how dense | Faster, denser stripes |
| `P` phase | Starting offset | Shifts the pattern |
| `A` amplitude | Swing size | Stronger contrast |
| `C` offset | Center value | Brighter overall |

Standard remap to color range: `0.5 + 0.5 * sin(...)` turns [-1, 1] into [0, 1].

Time belongs in the phase (added), which moves the pattern. Multiplying time into the frequency makes the pattern denser forever until it turns into noise.

## What you put in x decides the effect

| x | Result |
| --- | --- |
| `u_Time` | Whole shape pulses, all pixels in sync |
| `fs_Pos.x` | Static vertical stripes |
| `fs_Pos.x + u_Time` | Moving stripes |
| `length(fs_Pos)` | Concentric rings |
| `length(fs_Pos) - u_Time` | Rings expanding outward |
| `atan(fs_Pos.y, fs_Pos.x)` | Spokes by angle |
| `atan(...) + u_Time` | Rotating spokes |

Time = animation. Position = pattern. Both = moving pattern.

## Why a shape appears (isolines)

`sin` only adds repetition. The shape comes from **which points produce the same value**.

- Same `x` → vertical line → stripes
- Same `length` → circle → rings (needs equal x/y units, see [NDC and aspect ratio correction](/notes/ndc-and-aspect-ratio-correction))
- Same angle → ray from center → spokes

To get a shape, find a quantity whose equal-value lines have that shape.

## Turning a value into color

```glsl
const vec3 COLOR_A = vec3(0.1, 0.2, 0.6);
const vec3 COLOR_B = vec3(1.0, 0.8, 0.2);
float t = 0.5 + 0.5 * sin(length(fs_Pos) * RING_FREQUENCY - u_Time * RING_SPEED);
out_Col = vec4(mix(COLOR_A, COLOR_B, t), 1.0);
```

Options: grayscale `vec4(t, t, t, 1)`, one channel, or `mix` between two colors. Color channels clip to [0, 1].

## Other building blocks

| Function | Use |
| --- | --- |
| `fract(x)` | Repeat (sawtooth) |
| `step(edge, x)` | Hard edge, 0 or 1 |
| `smoothstep(a, b, x)` | Soft edge |
| `mix(a, b, t)` | Blend: `a·(1-t) + b·t` |

## Related
[OpenGL Hub](/notes/opengl-hub) · [GLSL shader conventions](/notes/glsl-shader-conventions) · Practice: graphtoy.com, The Book of Shaders, Shadertoy
