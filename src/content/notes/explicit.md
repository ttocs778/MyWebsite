---
title: explicit
tags:
  - cpp
  - keywords
updated: '2026-09-16T00:40:49.024Z'
source: explicit
---

Blocks a single-argument constructor from being used for an implicit conversion.

```cpp
class Meters {
public:
    Meters(float value) : value(value) {}   // NOT explicit
};

void travel(Meters distance);
travel(5.0f);   // compiles! 5.0f silently becomes a Meters - probably not intended
```

```cpp
class Meters {
public:
    explicit Meters(float value) : value(value) {}
};

travel(5.0f);           // error now - forces you to be explicit about it
travel(Meters(5.0f));   // this is what you actually meant
```

## Default assumption: use it
Unless a type is specifically meant to be implicitly convertible from another (rare — usually only a lightweight wrapper meant to feel transparent), mark single-argument constructors `explicit`. Costs nothing, blocks an entire category of "wait, how did that convert?" bugs.

## Related
[API design guidelines](/notes/api-design-guidelines)
