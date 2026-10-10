---
title: using type alias
tags:
  - cpp
  - keywords
updated: '2026-09-16T00:42:29.882Z'
source: using type alias
---

Modern replacement for `typedef` — gives an existing type a new name.

```cpp
using uPtr = std::unique_ptr<Node>;      // instead of: typedef std::unique_ptr<Node> uPtr;
using Vec = std::vector<int>;

uPtr node = std::make_unique<TranslateNode>(1, 0);
```

## Where using actually wins over typedef: templates
```cpp
template <typename T>
using Vec2 = std::pair<T, T>;   // a template alias

Vec2<float> point;   // works
```
`typedef` can't do this — there's no such thing as a "templated typedef." `using` also reads left-to-right like a normal declaration, staying readable even for gnarly function-pointer types that `typedef` makes nearly unreadable.

## Related
[unique_ptr](/notes/unique-ptr)
