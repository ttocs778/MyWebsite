---
title: OpenGL buffers and targets
tags:
  - graphics
  - opengl
updated: '2026-10-13T03:11:22.106Z'
source: OpenGL buffers and targets
---

A buffer is raw GPU memory with no type. The **target** (slot) it is bound to decides its role at that moment. A buffer of vertex data is called a **VBO**; a buffer of indices an **IBO** / **EBO**. How VBOs get wired to shader inputs is in [VAO and VBO](/notes/vao-and-vbo).

## Targets
| Target | Holds | Read by |
| --- | --- | --- |
| `GL_ARRAY_BUFFER` | Per-vertex data: position, color, normal, UV | `glVertexAttribPointer` |
| `GL_ELEMENT_ARRAY_BUFFER` | Triangle indices | `glDrawElements` |
| `GL_UNIFORM_BUFFER` | A block of uniforms | Shader uniform blocks (later) |

Rule: "data per vertex" → ARRAY. "Which vertices form a triangle" → ELEMENT_ARRAY.

Other objects use the same slot idea with their own bind call: `glBindTexture(GL_TEXTURE_2D)`, `glBindFramebuffer(GL_FRAMEBUFFER)`.

## Positions and indices
`pos` and `idx` are ordinary CPU vectors. Each index is a position in `pos`. `glDrawElements(GL_TRIANGLES)` reads indices in groups of 3. Counter-clockwise order is the front face.

```
3 ───── 2
│    ╱  │     pos = {v0, v1, v2, v3}          4 vertices
│  ╱    │     idx = {0,1,2,  0,2,3}            2 triangles
0 ───── 1
```

Why indices: vertices are shared between triangles. Without them each shared vertex is stored again (6 here instead of 4), and real vertices also carry normals, colors and UVs.

Fan triangulation of an N-gon: `{0,i,i+1}` for i = 1..N-2 → N-2 triangles, 3(N-2) indices.

## Upload
```cpp
glGenBuffers(1, &bufferPosition);
glBindBuffer(GL_ARRAY_BUFFER, bufferPosition);
glBufferData(GL_ARRAY_BUFFER, pos.size() * sizeof(glm::vec3), pos.data(), GL_STATIC_DRAW);
```

- Size is in **bytes**: element count × bytes per element. Take it from the data being uploaded.
- `pos.data()` returns a pointer to the vector's first element. Works because `std::vector` storage is contiguous.
- `GL_STATIC_DRAW`: upload once, draw many times. `GL_DYNAMIC_DRAW` if the data changes every frame.
- After upload the CPU vector can be destroyed. The GPU keeps its own copy.
- Number of buffers tracks number of attribute kinds, not number of vertices.

## Related
[OpenGL Hub](/notes/opengl-hub) · [OpenGL handles and state machine](/notes/opengl-handles-and-state-machine) · [std::vector](/notes/std-vector) · [Back-face culling](/notes/back-face-culling)
