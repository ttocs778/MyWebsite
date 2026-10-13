---
title: Qt OpenGL widget lifecycle
tags:
  - graphics
  - opengl
  - qt
updated: '2026-10-13T03:03:53.520Z'
source: Qt OpenGL widget lifecycle
---

`QOpenGLWidget` calls three virtual overrides for you. You never call them; you call `update()` to ask for a repaint. Same idea as UE's `BeginPlay` / `Tick`.

## Who calls what
```
main()
 └─ MainWindow w → setupUi → new MyGL(parent)   constructor: no GL context yet
 └─ w.show()
 └─ a.exec()                                    event loop; Qt calls the rest
     ├─ initializeGL()   once, context now exists
     ├─ resizeGL(w, h)   first show + every resize
     └─ paintGL()        every repaint request
```
The widget is created by the `.ui` file (custom widget), so no `new MyGL` appears in project code.

| Function | Put here |
| --- | --- |
| Constructor | Non-GL setup only (timer, mouse tracking) |
| `initializeGL` | `initializeOpenGLFunctions()` first, then shaders, locations, buffers |
| `resizeGL` | Screen-size uniforms |
| `paintGL` | `glClear` + every draw call for one frame |

## update() vs paintGL()
```
update():  mark dirty, return immediately
           ... event loop ...
           makeCurrent → bind widget FBO → viewport → paintGL() → composite to screen
paintGL(): just your code, none of the above
```
Calling `paintGL()` directly skips the context and framebuffer setup and nothing gets presented. Multiple `update()` calls merge into one repaint.

## Frame loop
`QTimer` every 16 ms (~60 fps) → `tick()` → `update()` → Qt → `paintGL()`.
One `paintGL` per frame. Different shaders = several `glUseProgram` + draw pairs inside it.

## Where gl calls are allowed
The context is only guaranteed current inside `initializeGL`, `resizeGL` and `paintGL`. Slots like `tick()` and `mouseMoveEvent()` should only update C++ values; the matching `glUniform*` goes in the draw path. The alternative is wrapping gl calls there in `makeCurrent()` / `doneCurrent()`.

## Related
[OpenGL Hub](/notes/opengl-hub)· [OpenGL frame workflow](/notes/opengl-frame-workflow) · [Qt signals and slots](/notes/qt-signals-and-slots) · [Callback functions](/notes/callback-functions)
