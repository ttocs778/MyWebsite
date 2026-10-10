---
title: Function templates, overload resolution and specialization
tags:
  - cpp
  - templates
updated: '2026-09-16T00:18:28.921Z'
source: Function templates, overload resolution and specialization
---

Write one function that works for many types. The compiler generates a real, concrete version for each type you actually use it with.

```cpp
template <typename T>
T maxOf(T a, T b) {
    return (a > b) ? a : b;
}

maxOf(3, 5);        // T deduced as int
maxOf(3.5f, 2.1f);  // T deduced as float
```

## Deduction happens before overload resolution finishes
```cpp
void print(int x);
template <typename T> void print(T x);

print(5);   // calls the non-template - an exact, real match wins over a
            // template that would also fit
```
The compiler figures out what `T` *would* be for every candidate template, then picks the best match among everything — templates and regular overloads together. An exact non-template match usually wins.

## Specialization: a custom version for one specific type
```cpp
template <> const char* maxOf<const char*>(const char* a, const char* b) {
    return (strcmp(a, b) > 0) ? a : b;   // pointer comparison would be wrong here
}
```
The generic template's logic (`a > b`) doesn't make sense for every type — a full specialization overrides the behavior for one specific type without touching the general case.

## Related
[Type traits and SFINAE](/notes/type-traits-and-sfinae)
