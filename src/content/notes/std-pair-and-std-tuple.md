---
title: std::pair / std::tuple
tags:
  - cpp
  - containers
updated: '2026-09-16T00:42:07.927Z'
source: std_pair and std_tuple
---

Bundle a fixed number of values of possibly-different types together, without writing a whole struct for it.

```cpp
std::pair<std::string, int> entry = {"Alice", 100};
entry.first;    // "Alice"
entry.second;   // 100

std::tuple<std::string, int, bool> record = {"Bob", 42, true};
std::get<0>(record);   // "Bob"
std::get<2>(record);   // true
```
`pair` is exactly two elements, accessed by `.first`/`.second`. `tuple` is any number, accessed by index via `std::get<N>`.

## Structured bindings — unpack them readably
```cpp
auto [name, score] = entry;   // name = "Alice", score = 100
```
Much more readable than `.first`/`.second` or `std::get<0>` scattered through the code. Works with `pair`, `tuple`, arrays, and any struct with public members.

## Related
[using type alias](/notes/using-type-alias)
