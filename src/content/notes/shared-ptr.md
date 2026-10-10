---
title: shared_ptr
tags:
  - cpp
  - memory
updated: '2026-09-16T00:16:51.792Z'
source: shared_ptr
---

Reference-counted ownership. The object dies when the last `shared_ptr` pointing at it does — not before, not after.

## Create it
```cpp
auto tex = std::make_shared<Texture>("brick.png");
auto tex2 = tex;   // refcount: 2, both point at the same Texture
```
Prefer `make_shared` over `new` + wrapping it — one allocation instead of two (the object and its control block get allocated together).

## The control block
Every `shared_ptr` group shares a small heap-allocated block holding the refcount. Copying a `shared_ptr` bumps it; destroying one decrements it. Hits zero → deleted.

```cpp
{
    auto a = std::make_shared<Texture>("brick.png");   // refcount: 1
    auto b = a;                                         // refcount: 2
}   // a and b both go out of scope here                // refcount: 0, deleted
```

## Cost
Copying isn't free like `unique_ptr`. The refcount increment/decrement is atomic — thread-safe, but not free. Don't reach for `shared_ptr` by default; reach for it when ownership genuinely has more than one legitimate holder.

## Gotcha: cyclic references leak
```cpp
struct Node {
    shared_ptr<Node> next;
    shared_ptr<Node> prev;   // A holds B, B holds A -> neither refcount hits 0
};
```
Two `shared_ptr`s pointing at each other keep each other alive forever, even with nothing else referencing either one. Break the cycle with a [weak_ptr](/notes/weak-ptr) on one side.

## Related
[Smart pointers](/notes/smart-pointers)
[weak_ptr](/notes/weak-ptr)
[unique_ptr](/notes/unique-ptr)
