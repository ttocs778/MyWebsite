---
title: final
tags:
  - cpp
  - oop
  - keywords
updated: '2026-09-16T00:40:53.692Z'
source: final
---

Stops further overriding or inheriting.

```cpp
class Base {
    virtual void update() final;   // no derived class can override this
};

class Sealed final : public Base { };  // nothing can inherit from Sealed at all
```

## What happens if you try anyway
```cpp
class Derived : public Base {
    void update() override;   // compile error: overriding final function 'update'
};

class Illegal : public Sealed { };   // compile error: base 'Sealed' is marked 'final'
```
Both fail at compile time, with the compiler pointing at the exact violation — not a runtime surprise, not a silent no-op.

## Why bother
Communicates intent to readers ("this is the end of the line for this behavior"), and gives the compiler a guarantee it can sometimes optimize around — a `final` virtual call might get devirtualized (turned back into a direct call) since there's no possible override left to dispatch to.

## Related
[Virtual functions and polymorphism](/notes/virtual-functions-and-polymorphism)
