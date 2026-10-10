---
title: Operator overloading
tags:
  - cpp
  - oop
updated: '2026-09-16T00:41:35.052Z'
source: Operator overloading
---

Give your own types the same `+`, `==`, `<<` syntax built-in types already have.

```cpp
struct Vec2 {
    float x, y;
    Vec2 operator+(const Vec2& other) const {
        return Vec2{x + other.x, y + other.y};
    }
};

Vec2 a{1, 2}, b{3, 4};
Vec2 c = a + b;   // {4, 6}
```

## Overloading << for printing
```cpp
std::ostream& operator<<(std::ostream& os, const Vec2& v) {
    os << "(" << v.x << ", " << v.y << ")";
    return os;
}
std::cout << a;   // "(1, 2)"
```
`<<` here has to be a free function, not a member — `std::cout << a` needs `ostream` on the left, and member operators always take `this` as the left-hand side.

## Gotcha: don't surprise people
```cpp
Vec2 operator+(const Vec2& other) const {
    return Vec2{x - other.x, y - other.y};   // subtracts?! technically legal, deeply evil
}
```
Nothing stops `+` from doing something totally unrelated to addition. Just don't — match what the symbol means everywhere else, or don't overload it at all.

## Related
[Const keyword](/notes/const-keyword)
