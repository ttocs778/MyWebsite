---
title: OpenGL API naming and call order
tags:
  - graphics
  - opengl
updated: '2026-10-13T03:12:24.757Z'
source: OpenGL API naming and call order
---

gl function names are verb + object, with a type suffix. Call order only matters where one call reads state another call sets.

## Reading a function name
| Piece | Meaning | Example |
| --- | --- | --- |
| `glGen*` | Allocate several, handles written through a pointer | `glGenBuffers(1, &buf)` |
| `glCreate*` | Allocate one, handle returned | `glCreateShader(GL_VERTEX_SHADER)` |
| `glBind*` | Put an object into a slot | `glBindBuffer` |
| `gl*Data` | Upload into the bound object | `glBufferData` |
| `glGet*Location` | Find a shader variable's index by name | `glGetUniformLocation` |
| `glUniform*` | Set a uniform on the current program | `glUniform1f` |
| `glUse*` | Pick the active program | `glUseProgram` |
| `glDraw*` | Run the pipeline | `glDrawElements` |
| Suffix | Count + type; `v` = pass a pointer | `2i` two ints, `Matrix3fv` |

## Order: what must come first
| First | Then | Why |
| --- | --- | --- |
| `glUseProgram` | `glUniform*` | Uniforms belong to the current program |
| `glBindBuffer(ARRAY)` | `glVertexAttribPointer` | Pointer wires the buffer bound at that moment |
| `glBindBuffer(ELEMENT_ARRAY)` | `glDrawElements` | Draw reads indices from that slot |
| All setup | `glDrawElements` | The draw uses whatever state exists right then |
| `glDrawElements` | `glDisableVertexAttribArray` | Close the input after use |

Calls with no dependency can swap freely (Enable vs Pointer, uniforms vs vertex wiring).

Each draw sets up its own state instead of relying on what init left behind, since other code and other objects change bindings in between.

## The three counts
```cpp
glBufferData(
    target,
    BYTES,                  // total bytes: count * sizeof(element)
    ptr,
    usage);

glVertexAttribPointer(
    loc,
    COMPONENTS_PER_VERTEX,  // 3 for vec3
    GL_FLOAT,
    GL_FALSE,
    STRIDE_BYTES,           // 0 = tightly packed
    OFFSET);                // nullptr = start of buffer

glDrawElements(
    GL_TRIANGLES,
    INDEX_COUNT,            // total indices, 3 per triangle
    GL_UNSIGNED_INT,
    nullptr);
```

`glEnableVertexAttribArray` is off by default. When off, every vertex reads one constant value instead of the buffer.

## Matrix uniform
```cpp
glUniformMatrix3fv(loc, 1, GL_FALSE, glm::value_ptr(model)); // or &model[0][0]
```
- `1`: number of matrices (arrays of `mat3` can take more).
- `GL_FALSE`: no transpose. glm and GL are both column-major.
- Pointer: GL reads 9 contiguous floats from there.
- T, R, S are multiplied into one matrix on the CPU; the shader multiplies once per vertex.

## Related
[OpenGL Hub](/notes/opengl-hub) · [OpenGL handles and state machine](/notes/opengl-handles-and-state-machine) · [Matrix composition order (SRT)](/notes/matrix-composition-order-srt)
