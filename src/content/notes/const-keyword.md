---
title: Const keyword
tags:
  - cpp
  - keywords
updated: '2026-09-16T00:40:22.055Z'
source: Const keyword
---

`const` binds to whatever is immediately to its left; if there's nothing
to its left, it binds to what's on its right.

## Code
```cpp
const int* p;       // pointee is const, p itself can be reassigned
int* const p;       // p itself is const, pointee can be modified
const int* const p; // both are const

void draw(const Polygon2D& p);   // p can't be modified through this ref

class Node {
    void computeTransform() const;  // trailing const: can't modify
};                                   // members; only kind callable
                                      // through a const Node&
```

## const objects — can only call const member functions
```cpp
class Node {
public:
    void setColor(glm::vec3 c) { color = c; }        // NOT const
    glm::vec3 getColor() const { return color; }      // const
private:
    glm::vec3 color;
};

const Node n;
n.getColor();          // fine - const object calling a const function
n.setColor({1,0,0});   // error - can't call a non-const function on a const object
```
The compiler doesn't check what `setColor` actually *does* — it just sees the function isn't marked `const` and refuses, even if `setColor` happened to do nothing at all. This is exactly why marking every function that doesn't modify state as `const` matters: it's the only thing that decides what a const object is allowed to call.

## mutable — the deliberate escape hatch
```cpp
class Node {
public:
    int getAccessCount() const {
        accessCount++;   // would normally be illegal in a const function...
        return accessCount;
    }
private:
    mutable int accessCount = 0;   // ...but mutable makes this one member exempt
};
```
`mutable` marks one member as modifiable even through a `const` object or `const` member function. Reserve it for bookkeeping that doesn't change the object's *logical* state — a cache, a lazily-computed value, an access counter — never for something that actually changes what the object represents.

So basically, people will use const when they don't want something to be modified. For safety or something else.
## Gotchas
- `std::move` can't strip `const` - you can't move out of a const
  parameter.

## Related
[unique_ptr](/notes/unique-ptr)
