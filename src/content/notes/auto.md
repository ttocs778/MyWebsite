---
title: auto
tags:
  - cpp
  - keywords
updated: '2026-09-16T00:54:09.329Z'
source: auto
---

Lets the compiler figure out a variable's type from its initializer, instead of you spelling it out.

```cpp
auto x = 5;              // int
auto y = 5.0f;            // float
auto node = std::make_unique<TranslateNode>(1, 0);   // unique_ptr<TranslateNode> - nobody wants to type that twice
```

## auto strips references and const by default
```cpp
const int& getRef();

auto a = getRef();        // int - const and & both dropped!
auto& b = getRef();       // const int& - add & back yourself to keep it
const auto& c = getRef(); // const int& - the usual safe default for big types
```
Plain `auto` copies the value. Want the reference (and to skip the copy)? Ask for it explicitly with `auto&` or `const auto&`.

## decltype — the type-only version
```cpp
int x = 5;
decltype(x) y = 10;   // y is int, same type as x, no value needed
```
Gets you a type without an actual initializer — useful in templates and macros, less common in everyday code than `auto`.

## Gotcha: auto isn't lazy, it's still a real type
```cpp
auto v = std::vector<int>{1, 2, 3};   // v really is a std::vector<int>, fixed at compile time
```
`auto` doesn't mean "figure it out later" or "any type" — the type is fixed at compile time, exactly as if written by hand. Purely a readability/typing shortcut, not dynamic typing.

## Related
[unique_ptr](/notes/unique-ptr)
