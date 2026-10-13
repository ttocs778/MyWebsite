---
title: VAO and VBO
tags:
  - graphics
  - opengl
updated: '2026-10-13T03:11:10.995Z'
source: VAO and VBO
---

A **VBO** holds vertex data. A **VAO** holds no data; it stores the wiring that connects VBOs to shader inputs, so one bind restores it all.

## VBO (Vertex Buffer Object)

A buffer bound to `GL_ARRAY_BUFFER` holding per-vertex data: positions, normals, UVs, colors.

A buffer holding indices is called an **IBO** or **EBO** (index / element buffer). Same kind of object, bound to `GL_ELEMENT_ARRAY_BUFFER` instead.

```cpp
glGenBuffers(1, &vbo);
glBindBuffer(GL_ARRAY_BUFFER, vbo);
glBufferData(GL_ARRAY_BUFFER, bytes, data, GL_STATIC_DRAW);
```

## VAO (Vertex Array Object)

While a VAO is bound, it records:

| Recorded state | Set by |
| --- | --- |
| Which shader inputs are enabled | `glEnableVertexAttribArray` |
| Which VBO each input reads, and how (components, type, stride, offset) | `glVertexAttribPointer` |
| Which index buffer to use | `glBindBuffer(GL_ELEMENT_ARRAY_BUFFER)` |

Analogy: VBOs are warehouses of material; the VAO is the wiring diagram saying which pipe runs from which warehouse to which input of the machine.

## Why it remembers after the binding changes

The `GL_ARRAY_BUFFER` slot is only a temporary cursor for setup. `glVertexAttribPointer` captures whatever VBO is in that slot **at that moment** and saves it into the VAO. Rebinding the slot afterwards does not change what the VAO saved.

Two objects, each with its own VAO:

```cpp
// init
glBindVertexArray(vaoSquare);
glBindBuffer(GL_ARRAY_BUFFER, vboSquare);
glEnableVertexAttribArray(posLoc);
glVertexAttribPointer(posLoc, 3, GL_FLOAT, GL_FALSE, 0, nullptr); // saves: posLoc ← vboSquare
glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, iboSquare);                 // saves: indices ← iboSquare

glBindVertexArray(vaoTri);
glBindBuffer(GL_ARRAY_BUFFER, vboTri);                            // slot now holds vboTri
glEnableVertexAttribArray(posLoc);
glVertexAttribPointer(posLoc, 3, GL_FLOAT, GL_FALSE, 0, nullptr); // saves: posLoc ← vboTri
glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, iboTri);

// every frame
glBindVertexArray(vaoSquare);
glDrawElements(GL_TRIANGLES, squareIndexCount, GL_UNSIGNED_INT, nullptr);
glBindVertexArray(vaoTri);
glDrawElements(GL_TRIANGLES, triIndexCount, GL_UNSIGNED_INT, nullptr);
```

`vaoSquare` still reads `vboSquare` even though the slot ended on `vboTri`.

## What goes where

| Operation | Where | Why |
| --- | --- | --- |
| Bind VBO + Enable + Pointer | Init | Wiring, saved in the VAO |
| Bind index buffer | Init | Saved in the VAO |
| `glUseProgram` | Every frame | VAO does not store the program |
| `glUniform*` | Every frame | VAO does not store uniforms |
| `glBindVertexArray` | Every frame | Select the object to draw |
| `glDrawElements` | Every frame | The draw |
| `glDisableVertexAttribArray` | Not used | Would overwrite the saved wiring |

Without VAOs every object redoes the full wiring before each draw. With 4 attributes and hundreds of objects that is thousands of calls per frame; with VAOs it is one bind per object.

## In hw04

OpenGL 3.2 Core requires a bound VAO to draw, so `initializeGL` creates one and binds it once. The assignment then redoes Enable / Pointer / Disable inside `drawGeometry` every frame, which rewrites the same wiring into that one VAO. It works and practices the calls, but does not use what a VAO is for.

## Related
[OpenGL Hub](/notes/opengl-hub) · [OpenGL buffers and targets](/notes/opengl-buffers-and-targets) · [OpenGL frame workflow](/notes/opengl-frame-workflow) · [OpenGL API naming and call order](/notes/opengl-api-naming-and-call-order)
