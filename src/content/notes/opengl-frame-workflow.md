---
title: OpenGL frame workflow
tags:
  - graphics
  - opengl
updated: '2026-10-13T03:11:19.717Z'
source: OpenGL frame workflow
---

Drawing anything follows four phases - get a context, set up once, draw every frame, clean up. The pipeline itself only runs inside a draw call; uploading data happens before it. Basically we just control vertex and frag shader (write most code)

## The four phases

```
0. CONTEXT
   Created by Qt / GLFW / SDL

1. INIT (once)
   1.1 Write GLSL source
         .vert / .frag text files
   1.2 Compile shaders
         glCreateShader
         glShaderSource
         glCompileShader
   1.3 Link program
         glCreateProgram
         glAttachShader
         glLinkProgram
   1.4 Build CPU data
         std::vector pos, idx
   1.5 Create VAO
         glGenVertexArrays
         glBindVertexArray
   1.6 Upload to GPU
         glGenBuffers
         glBindBuffer
         glBufferData
   1.7 Query locations
         glGetAttribLocation
         glGetUniformLocation

2. EVERY FRAME
   2.1 Clear
         glClear
   2.2 Pick program
         glUseProgram
   2.3 Set uniforms
         glUniform*
   2.4 Wire vertex data
         glBindBuffer(GL_ARRAY_BUFFER)
         glEnableVertexAttribArray
         glVertexAttribPointer
   2.5 Pick indices
         glBindBuffer(GL_ELEMENT_ARRAY_BUFFER)
   2.6 Draw
         glDrawElements
   2.7 Present
         swap buffers (Qt does it)

3. CLEANUP
         glDeleteBuffers
         glDeleteVertexArrays
         glDeleteShader
         glDeleteProgram
```

In real engines 2.4 and 2.5 are recorded into the VAO once at init, and each frame only binds the VAO and draws. See [VAO and VBO](/notes/vao-and-vbo).

## What one draw call runs

| Stage | Who | Set up by |
| --- | --- | --- |
| Vertex fetch | Hardware | 2.4 (bind + pointer) |
| Vertex shader | You | `.vert.glsl`, once per vertex, in parallel |
| Primitive assembly | Hardware | 2.5 index buffer, `GL_TRIANGLES` |
| Rasterization + interpolation | Hardware | Nothing to write |
| Fragment shader | You | `.frag.glsl`, once per covered pixel, in parallel |
| Write to framebuffer | Hardware | Depth test if enabled |

Compared with a software rasterizer: the loops, coverage test, barycentric interpolation and z-buffer are done by hardware. You only write "one vertex" and "one pixel" logic.

## Multiple objects

Each object is its own draw call inside the same frame. Draw calls run in order; work inside one draw call runs in parallel.

## Related
[OpenGL Hub](/notes/opengl-hub) · [VAO and VBO](/notes/vao-and-vbo) · [Graphics Pipeline Hub](/notes/graphics-pipeline-hub) · [Rasterization](/notes/rasterization) · [Barycentric interpolation](/notes/barycentric-interpolation) · [Qt OpenGL widget lifecycle](/notes/qt-opengl-widget-lifecycle)
