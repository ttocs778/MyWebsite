---
title: enum and enum class
tags:
  - cpp
  - keywords
updated: '2026-09-16T00:40:42.294Z'
source: enum and enum class
---

Named integer constants, grouped under one type.

## Plain enum — leaks its names, implicitly converts to int
```cpp
enum Color { Red, Green, Blue };
Color c = Red;
int x = c;          // implicit conversion to int - usually not what you want
```
`Red`, `Green`, `Blue` all leak into the surrounding scope — a second enum with a member also named `Red` in the same scope won't compile.

## enum class — scoped, no implicit conversion
```cpp
enum class Color { Red, Green, Blue };
Color c = Color::Red;   // must qualify with Color::
int x = c;               // error - no implicit conversion
int y = static_cast<int>(c);   // fine, if you actually want the int
```
Names are scoped under `Color::`, so two different enums can both have a `Red` with zero conflict. No accidental int conversion means no accidentally comparing a `Color` to an unrelated `int` and having it silently compile.

## Default: use enum class
Plain `enum` mostly exists for backward compatibility with C. New code should reach for `enum class` unless there's a specific reason to want the implicit int conversion.

## Related
[static](/notes/static)
