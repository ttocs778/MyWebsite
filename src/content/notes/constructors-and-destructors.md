---
title: Constructors and destructors
tags:
  - cpp
  - oop
updated: '2026-09-28T04:17:37.017Z'
source: Constructors and destructors
---

Constructor runs when an object is born, sets up its initial state. Destructor runs when it dies, cleans up whatever it acquired.

```cpp
class Node {
public:
    Node() : geometry(nullptr), color(1, 1, 1) {}   // constructor, initializer list
    ~Node() {}                                        // destructor
private:
    Polygon2D* geometry;
    glm::vec3 color;
};
```

## Initializer list vs assignment in the body
```cpp
Node() : color(1, 1, 1) {}            // constructs color directly with (1,1,1)
Node() { color = glm::vec3(1,1,1); }  // constructs color with its DEFAULT
                                        // ctor first, THEN assigns over it - wasted work
```
The initializer list constructs each member directly with the given value. Anything left out of the list still gets default-constructed before the body runs — the body can only assign, never truly initialize.

## Destructors run in reverse order of construction
Local variables, and a class's members, are torn down in the reverse of the order they were built — last-created, first-destroyed.

## Delegating vs base-class initialization
Two different things that both look like "a constructor calling a constructor".
```cpp
class RotateNode : public Node {
public:
    RotateNode() : RotateNode(0.0f) {}          // delegating: calls ANOTHER ctor of the SAME class
    RotateNode(float a) : Node(), angle(a) {}   // base-class initialization: calls the parent's ctor
    RotateNode(const RotateNode& other)
        : Node(other), angle(other.angle) {}    // base init and member init in one list
private:
    float angle;
};
```
A delegating constructor names its own class in the initializer list, and it must be the only entry there. `: Node(other)` names the parent, so it is base-class initialization, and it can sit next to member initializers.

## Related
[this pointer](/notes/this-pointer)
[Rule of Five and deep copy](/notes/rule-of-five-and-deep-copy)
