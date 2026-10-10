---
title: Type casting
tags:
  - cpp
  - casting
updated: '2026-09-16T00:42:23.668Z'
source: Type casting
---

Four different casts, each making a different promise about what you're doing and how much the compiler should check.

## static_cast — the everyday, compiler-checked cast
```cpp
float f = 3.7f;
int i = static_cast<int>(f);   // truncates to 3, compiler verifies this conversion makes sense

Base* b = new Derived();
Derived* d = static_cast<Derived*>(b);   // no runtime check - trusts you
```
Use for ordinary numeric conversions and upcasts/downcasts you're already certain about. Unlike dynamic_cast, it does zero runtime verification — a wrong downcast compiles fine and misbehaves at runtime instead.

## dynamic_cast — the runtime-checked downcast
Covered in [Virtual functions and polymorphism](/notes/virtual-functions-and-polymorphism). Checks the actual object type at runtime, returns `nullptr` on failure instead of garbage.

## const_cast — strips or adds const
```cpp
void legacyApi(char* str);   // doesn't modify str, just poorly written
const char* s = "hello";
legacyApi(const_cast<char*>(s));   // dangerous if legacyApi lies about not modifying it
```
The only cast that touches const/volatile and nothing else. Almost always a code smell — see [Const keyword](/notes/const-keyword)'s note on why `std::move` can't (and shouldn't) do this implicitly.

## reinterpret_cast — reinterpret the raw bits, no safety net
```cpp
int i = 65;
char* p = reinterpret_cast<char*>(&i);   // treats the int's raw memory as a char*
```
Makes no attempt to convert sensibly — just tells the compiler "trust me, treat these bits as this other type." The most dangerous of the four; mostly shows up in low-level networking/serialization code.

## Which one to reach for
| Need | Cast |
|---|---|
| Normal numeric conversion, safe up/downcast | `static_cast` |
| Downcast where you're not sure of the real type | `dynamic_cast` |
| Add/remove const (rare, usually a red flag) | `const_cast` |
| Reinterpret raw bits (rare, low-level only) | `reinterpret_cast` |

## Related
[Virtual functions and polymorphism](/notes/virtual-functions-and-polymorphism)
[Const keyword](/notes/const-keyword)
