---
title: OpenGL handles and state machine
tags:
  - graphics
  - opengl
updated: '2026-10-13T03:04:11.996Z'
source: OpenGL handles and state machine
---

GPU objects live in GPU memory. The CPU only holds a `GLuint` **handle** (an ID number) and asks the driver to act on "object N". Treat it as a int number.

## Handles
- A handle is just an integer, like a door number. The real object is on the GPU.
- Only gl calls hand out handles (`glGenBuffers`, `glCreateShader`). Never invent one.
- `0` means "no object".
- Assigning a new handle to the same variable loses the old one; that GPU object still exists but can no longer be reached.
- The type does not say what kind of object it is. A buffer handle and a shader handle are both `GLuint`.

| Type | Used for |
| --- | --- |
| `GLuint` | Object handles; index data (`std::vector<GLuint> idx`) |
| `GLint` | Shader variable locations; `-1` means not found |

## Common GPU objects
| Object | What it is |
| --- | --- |
| Buffer | Raw GPU memory (vertex data, indices) |
| Shader | One compiled stage (vertex or fragment) |
| Program | Vertex + fragment shader linked together |
| VAO | Remembers how buffers are wired to shader inputs |
| Texture | An image |
| Framebuffer | A canvas to draw into |

A single vertex is not an object. One buffer holds all vertices.

## State machine
- **Context** = the whole GL world: every object, every binding, the active program. One per window. No context, no gl calls.
- **Bind = select.** `glBind*` / `glUseProgram` put an object into a slot (target).
- Most calls take no "which object" argument. They act on whatever is bound to the slot they read, so binding the wrong object means the next call silently affects it.
- Each slot holds one object at a time. Different slots can be filled at once.
- Binding is CPU-side setup. One draw call still processes every vertex and pixel in parallel.

## Core pattern
```cpp
glGenBuffers(1, &buf);              // 1. allocate, get a handle
glBindBuffer(GL_ARRAY_BUFFER, buf); // 2. select it
glBufferData(GL_ARRAY_BUFFER, ...); // 3. operate on the selected object
```

## Related
[OpenGL Hub](/notes/opengl-hub) · [OpenGL buffers and targets](/notes/opengl-buffers-and-targets) · [OpenGL API naming and call order](/notes/opengl-api-naming-and-call-order)
