---
title: Namespaces
tags:
  - cpp
  - fundamentals
updated: '2026-09-16T00:41:16.274Z'
source: Namespaces
---

Groups names together so two libraries can both have a function called `render()` without colliding.

```cpp
namespace physics {
    void update();
}
namespace graphics {
    void update();
}

physics::update();    // no ambiguity - fully qualified
graphics::update();
```

## using namespace — convenient, and a known risk
```cpp
using namespace std;   // now cout, string, vector, etc. are all unqualified

string s = "hi";   // works, but so does anything else's "string" - if two
                    // namespaces both have one, this becomes ambiguous or
                    // silently picks the wrong one
```
Fine in a small `.cpp` file. Never do this in a header — it forces the pollution onto every file that includes it, with no way to opt out.

## Anonymous namespace — the modern static
```cpp
namespace {
    void helperOnlyUsedHere() { ... }
}
```
Same effect as marking something `static` at file scope (see [static](/notes/static)) — internal linkage, invisible outside this translation unit. Preferred for non-function things (classes, variables) since `static` doesn't apply to those the same way.

## Related
[static](/notes/static)
