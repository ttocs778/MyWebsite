---
title: OpenGL Hub
tags:
  - graphics
  - opengl
updated: '2026-10-13T03:11:14.921Z'
source: OpenGL Hub
---

**Hub card** for OpenGL (3.2 Core, Qt). Holds the core idea and the map to the atomic cards.

## Core
- CPU builds data, then uploads it. GPU objects live in GPU memory; the CPU only holds a `GLuint` **handle**, a door number for the real object.
- Every `glXXX()` call asks the driver to act on some object N.
- OpenGL is a big **state machine**. `glBindBuffer()` / `glUseProgram()` select an object; later calls that read that slot use the selected object.
- Variable names like `vao` or `bufferPosition` are project examples, not OpenGL names.

## 1. Workflow
- [OpenGL frame workflow](/notes/opengl-frame-workflow): context → init once → every frame → cleanup, and what one draw call runs
- [Qt OpenGL widget lifecycle](/notes/qt-opengl-widget-lifecycle): `initializeGL` / `resizeGL` / `paintGL`, `update()` vs `paintGL()`

## 2. Objects and data
- [OpenGL handles and state machine](/notes/opengl-handles-and-state-machine): handles, context, binding, Gen → Bind → Operate
- [OpenGL buffers and targets](/notes/opengl-buffers-and-targets): targets, positions vs indices, upload by bytes
- [VAO and VBO](/notes/vao-and-vbo): VBO holds data, VAO saves the wiring; what moves to init
- [NDC and aspect ratio correction](/notes/ndc-and-aspect-ratio-correction): the [-1, 1] box, 2D homogeneous `z = 1`

## 3. API
- [OpenGL API naming and call order](/notes/opengl-api-naming-and-call-order): decode names, which call must come first, the three counts

## 4. Shaders
- [GLSL in, out and uniform](/notes/glsl-in-out-and-uniform): per-vertex vs shared data, how each gets sent
- [GLSL shader conventions](/notes/glsl-shader-conventions): files, prefixes, built-ins, read-only `in`
- [GLSL sin patterns](/notes/glsl-sin-patterns): `A·sin(F·x+P)+C`, what to feed `x`, isolines, `mix`

## 5. Debugging
- [OpenGL debugging](/notes/opengl-debugging): `glGetError` strategy, symptom → cause table

## Not yet carded
Interleaved vertex layouts (stride/offset), textures and samplers, framebuffers, depth test and blending in GL.

## Related
[Graphics Pipeline Hub](/notes/graphics-pipeline-hub) · [Matrix composition order (SRT)](/notes/matrix-composition-order-srt)
