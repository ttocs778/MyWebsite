---
title: Type traits and SFINAE
tags:
  - cpp
  - templates
updated: '2026-09-16T00:18:35.586Z'
source: Type traits and SFINAE
---

Compile-time introspection: asking "what kind of type is this?" and getting the answer before the program even runs.

## Type traits — tiny structs that answer yes/no
```cpp
std::is_integral<int>::value;      // true
std::is_integral<float>::value;    // false
std::is_same<int, int>::value;     // true
```
Each is really just a struct that inherits from `std::true_type` or `std::false_type` depending on the type it was given.

## SFINAE — Substitution Failure Is Not An Error
```cpp
template <typename T>
typename std::enable_if<std::is_integral<T>::value>::type
printKind(T t) { std::cout << "integer: " << t; }

template <typename T>
typename std::enable_if<!std::is_integral<T>::value>::type
printKind(T t) { std::cout << "not an integer: " << t; }
```
If substituting a type into a template causes an error, the compiler doesn't stop — it quietly drops that overload from consideration and tries the others. `std::enable_if` deliberately triggers a substitution failure to knock out overloads that shouldn't apply, giving you "conditional overloads" based on a type's properties.

## The "does this type have X" trick
```cpp
template <typename U> static std::true_type  check(typename U::iterator*);
template <typename U> static std::false_type check(...);

static const bool value = decltype(check<T>(nullptr))::value;
```
If `U::iterator` exists, the first overload compiles and wins. If not, it silently fails and falls back to the `...` catch-all. The classic pre-C++20 way to ask "does this type have a nested `iterator`?"

## Related
[Function templates, overload resolution and specialization](/notes/function-templates-overload-resolution-and-specialization)
