---
title: Compilation process
tags:
  - cpp
  - compilation
updated: '2026-09-16T00:40:19.112Z'
source: Compilation process
---

Source code doesn't become a program in one step. Four stages, each handing off to the next.

```
foo.cpp --[preprocessor]--> expanded source --[compiler]--> foo.o --[linker]--> foo.exe
```

## Preprocessor
Text substitution only — `#include`, `#define`, `#ifdef`. See [Preprocessor directives](/notes/preprocessor-directives). Doesn't know C++ syntax exists yet.

## Compiler
Turns one `.cpp` (plus whatever got pasted into it) into one object file — machine code, but with placeholders for anything defined elsewhere.

## Linker
Stitches every object file together, resolves those placeholders, pulls in external libraries. "Undefined reference" errors live here — the compiler was happy, the linker just couldn't find the actual definition anywhere.

## Gotcha
A compile error means one file's syntax/types are wrong. A link error means every file was individually fine — they just don't fit together.

## Related
[Preprocessor directives](/notes/preprocessor-directives)
