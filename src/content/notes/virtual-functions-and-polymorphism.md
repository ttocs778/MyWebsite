---
title: Virtual functions and polymorphism
tags:
  - cpp
  - oop
updated: '2026-09-28T00:57:01.851Z'
source: Virtual functions and polymorphism
---

Same function name, different behavior — depending on the *actual* type of the object, not the type of the pointer you're holding it through.

## Static vs dynamic binding
```cpp
class Base    { void greet() { std::cout << "Base"; } };
class Derived : public Base { void greet() { std::cout << "Derived"; } };

Base* b = new Derived();
b->greet();   // prints "Base"
```
No `virtual` → resolved at compile time, based on the pointer's declared type. No vtable lookup happens. The compiler just picks `Base::greet` and moves on with its life.

```cpp
class Base    { virtual void greet() { std::cout << "Base"; } };
class Derived : public Base { void greet() override { std::cout << "Derived"; } };

Base* b = new Derived();
b->greet();   // prints "Derived"
```
`virtual` → resolved at runtime, based on what the object *actually* is. This is the whole point of polymorphism.

## Pure virtual & abstract classes
```cpp
class Node {
    virtual glm::mat3 computeTransform() const = 0;
};
```
`= 0` means "no default implementation, and you can't instantiate `Node` directly." Every concrete subclass must supply one, or it stays abstract too.

## Virtual destructors
```cpp
class Node {
    virtual ~Node() = default;   // do this if you have ANY virtual function
};
```
Delete a `Derived*` through a `Base*` with no virtual destructor, and only `~Base()` runs. `~Derived()` gets silently skipped — a resource leak with zero error messages to point you at it.

## override — a safety net, not decoration
```cpp
void computeTransform() override;         // matches base? great.
void computeTransform() const override;   // forgot the const above? boom.
```
Mismatch the signature (missing `const` is the classic one) and skip `override`, and the compiler assumes you meant to write a brand-new, unrelated function. No error — until your class fails to implement the pure virtual and becomes abstract itself, surfacing as a confusing "cannot instantiate" error somewhere else entirely. `override` turns that into an error on the exact line you actually got wrong.

## Slicing
```cpp
Derived d;
Base b = d;   // slice! b is just a Base now
```
Assigning a derived object into a base-by-value variable chops off everything the base doesn't know about. `Derived`'s extra data quietly disappears. Pass and store by pointer or reference to dodge this entirely. Only happens in pass by copy.

## dynamic_cast
```cpp
Base* b = getSomeNode();
if (Derived* d = dynamic_cast<Derived*>(b)) {
    // safe: b really was pointing at a Derived
}
```
Checks the *actual* runtime type before letting you treat something as a more specific subclass. Fails → returns `nullptr` instead of garbage. Always check it. `static_cast` skips this check and just trusts you — which is how you end up reading memory that was never yours to read.

## Related
[Rule of Five and deep copy](/notes/rule-of-five-and-deep-copy)
