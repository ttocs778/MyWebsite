---
title: Rule of Five and deep copy
tags:
  - cpp
  - memory
updated: '2026-09-28T04:35:22.795Z'
source: Rule of Five and deep copy
---

Five special member functions. Hand-write any one of them, and you should seriously consider the other four.

- Destructor
- Copy constructor
- Copy assignment
- Move constructor
- Move assignment

if your class object won't be manually assigned, or you don't have any member variable required manual resource management. **APPLY RULE OF ZERO** (don't need to write anything)

## Why you need this at all
The compiler-generated versions do a shallow, member-by-member copy. Fine for plain values. Not fine for owning pointers or polymorphic children — you get two owners pointing at the same memory, and a double-free waiting to happen.

## Copy: deep, per member
```cpp
Node::Node(const Node& other)
    : geometry(other.geometry),   // shallow - shared, non-owning
      color(other.color)          // plain value, no deep/shallow distinction
{
    for (const auto& child : other.children)
        children.push_back(child->clone());   // deep, polymorphic
}
```
Not every member gets the same treatment. Ask "who owns this" per member, not once for the whole class.

```cpp
Node& Node::operator=(const Node& other) {
    if (this == &other) return *this;
    geometry = other.geometry;
    color = other.color;
    children.clear();                        // `this` already has a past.
    for (const auto& child : other.children) // The constructor never
        children.push_back(child->clone());  // has this problem.
    return *this;
}
```
`operator=` overwrites a living object. The constructor starts from nothing, so it skips this step entirely.

## Move: steal, don't copy
```cpp
Node::Node(Node&& other) noexcept
    : geometry(other.geometry),
      color(other.color),
      children(std::move(other.children))   // steal the vector's guts
{
    other.geometry = nullptr;   // leave the source harmless
}

Node& Node::operator=(Node&& other) noexcept {
    if (this == &other) return *this;
    geometry = other.geometry;
    color = other.color;
    children = std::move(other.children);
    other.geometry = nullptr;
    return *this;
}
```
Move steals the other object's guts instead of duplicating them. `noexcept` matters — containers like `std::vector` only move (instead of copy) when they're sure it can't throw halfway through.

## When each one gets called
Two questions decide it.

1. Is the left-hand object being *created* on this line? Yes: constructor. No, it already exists: assignment.
2. Is the right-hand side an lvalue (has a name, still needed later) or an rvalue (a temporary, or wrapped in `std::move`)? Lvalue: copy. Rvalue: move.

| Left object    | Right side | Called           |
| -------------- | ---------- | ---------------- |
| created here   | lvalue     | copy constructor |
| already exists | lvalue     | copy assignment  |
| created here   | rvalue     | move constructor |
| already exists | rvalue     | move assignment  |

```cpp
Node a, b, c;

Node d(a);                // copy ctor: d is born here, a is an lvalue
Node e = a;               // copy ctor too. This "=" is initialization, not assignment
b = a;                    // copy assign: b already exists

Node f(std::move(a));     // move ctor
Node g = std::move(b);    // move ctor
c = std::move(d);         // move assign: c already exists
c = Node();               // move assign: right side is a temporary
```
The `=` sign alone tells you nothing. `Node e = a;` copy-constructs, `b = a;` copy-assigns.

Function calls and containers follow the same two questions.
```cpp
void take(Node n);        // a by-value parameter is a brand new object

Node x, y;
take(x);                  // copy ctor builds n from x
take(std::move(y));       // move ctor builds n from y

std::vector<Node> v;
v.push_back(x);           // copy ctor builds the new element
v.push_back(Node());      // move ctor builds the new element
```
When a vector outgrows its buffer, it relocates the existing elements. It moves them if the move constructor is `noexcept`, otherwise it copies them.

## = default and = delete
```cpp
Derived(const Derived&) = default;              // ask the compiler to generate its usual version
Derived& operator=(const Derived&) = default;
virtual ~Derived() = default;

Derived(const Derived&) = delete;               // forbid copying: using it is a compile error
```
`= default` behaves exactly like not writing the function, but states the intent out loud. It still counts as user-declared, so the compiler still won't generate the move operations for you. `= delete` is how `unique_ptr` blocks copying, to disable this object's copy or assignment, must explicitly write it.

A deleted function still takes part in **overload resolution**, so calling it is a compile error instead of quietly falling through to another overload. That also makes it a tool for blocking unwanted conversions:
```cpp
void setAngle(float degrees);
void setAngle(double) = delete;   // setAngle(3.14) no longer compiles, setAngle(3.14f) does
```
The compiler deletes functions on its own too: a class with a `unique_ptr` member gets an implicitly deleted copy constructor.

## Derived classes
A subclass that owns nothing new can skip all five (Rule of Zero). The generated versions call the base class's versions for the base part, then copy the new members one by one. A virtual destructor in the base makes every derived destructor virtual automatically.

Write them by hand and you have to call the base yourself:
```cpp
Derived::Derived(const Derived& other)
    : Base(other),               // forget this and Base is default-constructed instead
      extra(other.extra) {}

Derived& Derived::operator=(const Derived& other) {
    if (this == &other) return *this;
    Base::operator=(other);      // forget this and the base part is left untouched
    extra = other.extra;
    return *this;
}
```
Both mistakes compile without a warning. The base half of the copy is just quietly wrong.

## Gotchas
- Declare a copy ctor, copy assignment, or destructor, and the compiler quietly stops auto-generating moves. Nothing fails to compile — it just falls back to copying where you expected a move.
- Add a new member later? Go check both copy and move. Forgetting isn't a compile error, just a silently-wrong object.
- A virtual "clone" can't be named `clone()` if the base already inherits an unrelated `clone()` with a different return type. Looking at you, `QTreeWidgetItem`.
- Copy elision: initializing from a temporary (`Node x = makeNode();`) calls neither one in C++17, the object is built in place. Returning a named local may also skip both, and falls back to a move if it doesn't.
- A named rvalue reference is still an lvalue. Inside `void f(Node&& n)`, `Node m = n;` copies. Write `Node m = std::move(n);` to move.
- `std::move` on a `const` object produces a const rvalue, which can't bind to `Node&&`, so the copy runs instead. No warning.

## Related
[Virtual functions and polymorphism](/notes/virtual-functions-and-polymorphism)
[unique_ptr](/notes/unique-ptr)
[Lvalues and rvalues](/notes/lvalues-and-rvalues)
