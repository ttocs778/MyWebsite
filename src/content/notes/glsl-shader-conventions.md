---
title: GLSL shader conventions
tags:
  - graphics
  - opengl
  - glsl
updated: '2026-10-13T03:14:32.322Z'
source: GLSL shader conventions
---

You write GLSL source by hand; `glCreateShader` only gives you an empty GPU container to load it into. One `.glsl` file = one shader object = one handle.

## Files
- `name.vert.glsl` / `name.frag.glsl`. The suffix is for humans, not the compiler.
- First line, nothing before it: `#version 330 core`
- In Qt projects loaded via `":/glsl/..."`, every shader file must be listed in the `.qrc`, or the loaded source is empty.

## Naming prefixes
| Prefix | Meaning | Example |
| --- | --- | --- |
| `vs_` | Vertex shader input from a buffer | `in vec3 vs_Pos;` |
| `fs_` | Vertex output → fragment input | `out vec2 fs_Pos;` / `in vec2 fs_Pos;` |
| `u_` | Uniform from CPU | `uniform float u_Time;` |
| `out_` | Final fragment output | `out vec4 out_Col;` |

## Built-ins
- `gl_Position` (vert): clip-space output. Must be written, or nothing shows.
- `gl_FragCoord` (frag): pixel coordinates, origin bottom-left, in pixels.

## Writing style
- Write logic for **one** vertex or **one** pixel. No loops over the mesh; invocations cannot talk to each other.
- `in` variables are read-only. Copy to a local to modify.
- `ivec.x / ivec.y` is integer division. Cast both sides to `float`.
- Float literals with a dot: `1.0`, not `1`.
- Swizzle freely: `v.xy`, `c.rgb`, `vec4(p.xy, 0.0, 1.0)`.
- Variables declared but unused are removed at compile time, so their location is `-1` until the shader uses them.

## Vertex shader template (2D, hw04 style)
```glsl
vec3 p = u_Model * vs_Pos;          // vs_Pos.z = 1 so mat3 translation works
p.x /= aspectRatio;                 // after the model transform
gl_Position = vec4(p.xy, 0.0, 1.0); // z = 0 keeps it inside NDC
fs_Pos = vs_Pos.xy;                 // pattern sticks to the object
```

## Multiple shaders
One program per vert + frag pair, switched with `glUseProgram` before each draw. One vertex shader can be attached to several programs. Each `glCreateShader` call makes exactly one shader object.

## Related
[OpenGL Hub](/notes/opengl-hub) · [GLSL in, out and uniform](/notes/glsl-in-out-and-uniform) · [NDC and aspect ratio correction](/notes/ndc-and-aspect-ratio-correction)
