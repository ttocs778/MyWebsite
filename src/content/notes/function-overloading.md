---
title: Function overloading
tags:
  - cpp
  - functions
updated: '2026-09-16T00:40:59.621Z'
source: Function overloading
---

Same function name, different parameter lists. The compiler picks which one you meant based on the arguments you pass.

```cpp
void print(int x);
void print(float x);
void print(const std::string& x);

print(5);       // calls print(int)
print(5.0f);    // calls print(float)
print("hi");    // calls print(const string&)
```

## What doesn't count as "different"
```cpp
int getValue();
float getValue();   // error - return type alone isn't enough to overload on
```
Overload resolution looks at parameters, not return type. There's no way to know which one you wanted from `auto x = getValue();` alone.

## Gotcha: ambiguous calls
```cpp
void f(int a);
void f(float a);
f(5.0);   // error: ambiguous - 5.0 is a double, an equally bad implicit
          // conversion to either int or float
```

## Related
[Default arguments](/notes/default-arguments)
[Function templates, overload resolution and specialization](/notes/function-templates-overload-resolution-and-specialization)
