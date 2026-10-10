---
title: std::string
tags:
  - cpp
  - containers
updated: '2026-09-16T00:42:10.969Z'
source: std_string
---

A dynamically-sized, owning string type — manages its own memory, unlike a raw `char*`.

```cpp
std::string s = "hello";
s += " world";              // grows automatically
s.length();                  // 11
s.substr(0, 5);               // "hello"
s.find("world");              // 6 (index), or std::string::npos if not found
s.c_str();                     // raw const char* for old C-style APIs
```

## Gotcha: comparing with ==
```cpp
if (s == "hello") { ... }   // works fine - std::string overloads ==
```
Unlike C-style strings, where `strA == strB` compares *addresses*, not contents (`strcmp` is what you'd need there instead).

## Related
[C-style arrays](/notes/c-style-arrays)
[std::vector basics](/notes/std-vector)
