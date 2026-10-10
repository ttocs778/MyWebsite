---
title: weak_ptr
tags:
  - cpp
  - memory
updated: '2026-09-16T00:10:28.922Z'
source: weak_ptr
---

Points at something a `shared_ptr` owns, without counting as an owner. Doesn't keep the object alive, and doesn't know on its own whether it's still there.

## Create it
```cpp
shared_ptr<Texture> tex = std::make_shared<Texture>("brick.png");
weak_ptr<Texture> watcher = tex;   // refcount still 1 - watcher doesn't count
```

## Using it: you have to check first
```cpp
if (shared_ptr<Texture> locked = watcher.lock()) {
    locked->bind();   // safe - locked is a real shared_ptr, refcount bumped
} else {
    // the Texture is already gone
}
```
`lock()` tries to promote the `weak_ptr` into a real `shared_ptr`. Succeeds if the object's still alive; returns an empty `shared_ptr` if not. There's no safe way to dereference a `weak_ptr` directly — it has no `->` or `*`.

## Why it exists
Two jobs: break `shared_ptr` cycles (see [shared_ptr](/notes/shared-ptr)'s gotcha), and observe something you don't own without accidentally extending its lifetime — e.g. a UI element caching a pointer back to a model object that might get destroyed first.

## Related
[Smart pointers](/notes/smart-pointers)
[shared_ptr](/notes/shared-ptr)
