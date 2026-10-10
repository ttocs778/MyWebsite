---
title: Inheritance basics
tags:
  - cpp
  - oop
updated: '2026-09-28T06:22:57.286Z'
source: Inheritance basics
---

A derived class gets everything a base class has, plus whatever new it adds.

```cpp
class Shape {
public:
    void printName() { std::cout << name; }
protected:
    std::string name;
};

class Circle : public Shape {
public:
    Circle() { name = "Circle"; }
    float radius;
};
```
`Circle` has `printName()` and `name` for free, without rewriting either.

## public / protected / private inheritance
```cpp
class A : public B { };      // B's public stays public, protected stays protected
class C : protected B { };   // B's public AND protected become protected in C
class D : private B { };     // B's public AND protected become private in D
```
`public` inheritance ("is-a") is what you want almost always. `protected`/`private` inheritance ("implemented-in-terms-of") shows up rarely and usually means composition would've been the cleaner choice.

## Related
[Members and access control](/notes/members-and-access-control)
