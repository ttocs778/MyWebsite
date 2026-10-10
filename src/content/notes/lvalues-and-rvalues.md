---
title: Lvalues and rvalues
tags:
  - cpp
  - memory
updated: '2026-09-28T04:12:11.806Z'
source: Lvalues and rvalues
---

Value category is a property of an *expression*, not of the object behind it. That is why an object with a name can still be handed over as an rvalue.

## lvalue vs rvalue
```cpp
Node d;
d;         // lvalue expression: has a name, has an address, still usable afterwards
Node();    // rvalue expression: a temporary, gone at the end of the statement
```
Rule of thumb: if you can take its address with `&`, it is an lvalue.

## What std::move does
```cpp
Node d;
Node& r1 = d;              // OK: d is an lvalue
Node&& r3 = d;             // error: an rvalue reference can't bind to an lvalue
Node&& r2 = std::move(d);  // OK: std::move(d) is an rvalue expression
```
`std::move` is a cast and nothing else. Roughly:
```cpp
static_cast<Node&&>(d)
```
It does not move any data, does not empty `d`, and does not modify `d` at all. `r2` is the same object as `d`. The only thing that changes is the label on the expression, from "lvalue" to "rvalue" (specifically an xvalue, an "expiring" value).

## Why the label matters
Overload resolution reads the label. A `Node&&` parameter accepts only rvalues, so `c = std::move(d)` picks the move assignment operator instead of the copy one. The actual stealing happens inside that function body. See [Rule of Five and deep copy](/notes/rule-of-five-and-deep-copy).

Roughly what the standard library writes:
```cpp
template <typename T>
std::remove_reference_t<T>&& move(T&& t) noexcept {
    return static_cast<std::remove_reference_t<T>&&>(t);
}
```
Pass an lvalue `Node` and `T` deduces as `Node&`. `remove_reference_t` strips the `&`, so the return type is `Node&&`.

## Gotchas
- After a move function has consumed `d`, it is valid but unspecified. Destroy it or assign to it. Don't read from it.
- A bare `std::move(d);` statement does nothing. `d` is untouched until a move constructor or move assignment actually runs.
- A named rvalue reference parameter is still an lvalue inside the function. Use `std::move` again to pass it along.

## Related
[Rule of Five and deep copy](/notes/rule-of-five-and-deep-copy)
[unique_ptr](/notes/unique-ptr)
