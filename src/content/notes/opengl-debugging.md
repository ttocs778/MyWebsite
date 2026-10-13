---
title: OpenGL debugging
tags:
  - graphics
  - opengl
  - debugging
updated: '2026-10-13T02:56:27.703Z'
source: OpenGL debugging
---

Most OpenGL mistakes fail silently: no crash, just a black or empty window. Errors have to be requested explicitly.

## How GL reports errors
- gl calls return nothing on failure. They set an internal error flag and keep going.
- `glGetError()` reads the flag and clears it. The flag sticks until read, so one check at the end can't tell which call failed.
- To locate a failure: check after every suspect call; the first check that fires sits right after the culprit. Put a breakpoint in the error branch and read the call stack.

```cpp
glBindBuffer(...);              printGLErrorLog();
glEnableVertexAttribArray(-1);  printGLErrorLog();  // stops here
```

hw04's `printGLErrorLog()` ends with a bare `throw;`, which terminates the program. Run under the debugger to stop there instead of exiting.

Remove per-frame checks once things work; they cost performance.

| Error | Usual cause |
| --- | --- |
| `GL_INVALID_VALUE` | Bad number, e.g. location `-1` |
| `GL_INVALID_OPERATION` | Not allowed in current state: uniform without `glUseProgram`, uniform type mismatch |
| `GL_INVALID_ENUM` | Wrong constant for that parameter |

## Symptom → cause
| Symptom | Check |
| --- | --- |
| Nothing drawn | Attribute enabled? bind before pointer? index count right? `glUseProgram`? |
| Shape is a dot or missing | `glVertexAttribPointer` component count, buffer byte size |
| Only one triangle | Hard-coded count in `glDrawElements` instead of the index count |
| Location `-1` | Name typo, or unused variable optimized out |
| Uniform does nothing | Set before `glUseProgram`, wrong setter type, location `-1` |
| Shape stretched | Missing aspect correction, or integer division |
| Shader pattern is an ellipse | Math done in the aspect-corrected space |
| Translation ignored | 2D vertex z = 0 instead of 1 |
| Rotation barely moves | This old glm `rotate(mat3, angle)` takes **degrees** unless `GLM_FORCE_RADIANS` |
| GLSL won't compile | Console log; file missing from `.qrc`; assigning to an `in` |
| Crash on first gl call | Before `initializeOpenGLFunctions()` or outside a current context |

## Related
[OpenGL Hub](/notes/opengl-hub) · [OpenGL API naming and call order](/notes/opengl-api-naming-and-call-order) · [Undefined behavior](/notes/undefined-behavior) · [Exception handling](/notes/exception-handling)
