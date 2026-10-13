---
title: GLSL in, out and uniform
tags:
  - graphics
  - opengl
  - glsl
updated: '2026-10-13T02:54:11.322Z'
source: GLSL in, out and uniform
---

`in` changes per vertex (or per pixel); `uniform` is one value shared by the whole draw call. Ask: does each vertex own a copy, or does the whole object share one?

## One draw, six vertex shader runs
| Run | `vs_Pos` (in) | `u_Time` (uniform) |
| --- | --- | --- |
| 1 | (0.5, 0.0, 1) | 3.2 |
| 2 | (0.25, 0.43, 1) | 3.2 |
| ... | different every run | same every run |

C++ analogy: `in` is a function parameter, `uniform` is a global set before the calls.

## Comparison
| | `in` attribute | `uniform` |
| --- | --- | --- |
| Shape | Array, one element per vertex | Single value |
| CPU sends via | Buffer + `glVertexAttribPointer` | `glUniform*` |
| Send how often | Upload once if geometry is static | Every time the value changes |
| Lookup | `glGetAttribLocation` (vertex shader only) | `glGetUniformLocation` |
| Typical | Position, color, normal, UV | Time, screen size, matrices, mouse |

## Where each kind lives
- **Attribute `in`**: vertex shader only. Fed from buffers.
- **Uniform**: whole program. Declared in both vert and frag → merged into one at link; set once, both read it. Types must match.
- **vert `out` → frag `in`**: matched by name and type at link, interpolated by hardware. CPU never touches these.
- **frag `out`**: written to the framebuffer. One output = location 0, nothing to set.

## Location lookup
```cpp
// init, once per program
attribs["vs_Pos"]  = glGetAttribLocation(prog, "vs_Pos");
uniforms["u_Time"] = glGetUniformLocation(prog, "u_Time");

// draw
GLint loc = uniforms.at("u_Time");
```
- Lookup is scoped to the program in the first argument. Same name in another program may have another number.
- Locations are fixed after link. Query once, cache in a name → location map.
- `-1` means the name is wrong, or the variable is unused and the compiler removed it.
- Read with `.at()`: `map["name"]` inserts `0` when the key is missing, and `0` is a valid location.

## Where to set uniforms
| Changes when | Set in |
| --- | --- |
| Never | `initializeGL` |
| Window resize | `resizeGL` |
| Every frame | `paintGL` / draw function |

A uniform keeps its last value until set again.

## Related
<span class="wikilink-missing">OpenGL Center</span> · [GLSL shader conventions](/notes/glsl-shader-conventions) · [Barycentric interpolation](/notes/barycentric-interpolation) · [Associative containers](/notes/associative-containers)
