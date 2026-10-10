---
title: Preprocessor directives
tags:
  - cpp
  - compilation
updated: '2026-09-16T00:41:51.113Z'
source: Preprocessor directives
---

Runs *before* the compiler ever sees real C++. Pure text substitution — the preprocessor doesn't know what a type is, what scope is, or what a function is.

## #define — text substitution, not a constant
```cpp
#define MAX_HEALTH 100
#define SQUARE(x) x * x

int a = SQUARE(2 + 3);   // expands to 2 + 3 * 2 + 3 = 11, NOT 25
```
Function-like macros paste their arguments in verbatim, no precedence protection. Wrap every parameter (and the whole expression) in parens: `#define SQUARE(x) ((x) * (x))`. Better yet, use a [constexpr](/notes/constexpr) function instead and skip macros for this entirely.

## Include guards
```cpp
#ifndef NODE_H
#define NODE_H
// ... contents ...
#endif
```
Stops a header from being pasted into the same file twice, which would redefine every class/function in it and fail to compile. `NODE_H` is just a name you pick — convention is `<FILENAME>_H`.

```cpp
#pragma once
```
Same job, one line, nothing to name or accidentally collide with. Not technically standard C++, but every compiler you'll actually use supports it. Prefer this for new code.

## Conditional compilation
```cpp
#ifdef _DEBUG
    logDetailedState();
#endif

#if VERSION >= 2
    newFeature();
#else
    oldFeature();
#endif
```
Code inside a false branch isn't just skipped at runtime — it's never even compiled. Useful for platform-specific paths or stripping debug-only logic from release builds entirely.

## Predefined macros
`__FILE__`, `__LINE__`, `__DATE__`, `__TIME__`, `__cplusplus` (tells you which standard is active) — the compiler fills these in for you. Handy for assert messages and version checks.

## Gotchas
- Macros ignore scope and namespaces — a dumb find-and-replace across the whole file. A macro named `min` will silently wreck any function or variable also named `min`.
- No type checking, no debugger stepping into them, and a function-like macro can evaluate an argument more than once (`SQUARE(x++)` increments `x` twice).

## Related
[constexpr](/notes/constexpr)
[Compilation process](/notes/compilation-process)
