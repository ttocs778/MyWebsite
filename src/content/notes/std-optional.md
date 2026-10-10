---
title: std::optional
tags:
  - cpp
  - containers
updated: '2026-09-16T00:42:05.038Z'
source: std_optional
---

A value that might or might not be there — without reaching for a null pointer or a magic sentinel value to mean "nothing."

```cpp
std::optional<int> findIndex(const std::vector<int>& v, int target) {
    for (size_t i = 0; i < v.size(); i++)
        if (v[i] == target) return i;
    return std::nullopt;   // explicitly "no value"
}

auto result = findIndex(v, 5);
if (result) {
    std::cout << *result;   // dereference like a pointer to get the value
}
```

## Why this beats a sentinel value
```cpp
int findIndex(const std::vector<int>& v, int target);   // returns -1 if not found?
```
A sentinel like `-1` only works if it can never be a legitimate result — and it's easy to forget to check for it. `optional` makes "might not have a value" part of the type itself, and forces a check before you can get at the value at all.

## Related
[API design guidelines](/notes/api-design-guidelines)
