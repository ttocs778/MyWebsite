---
title: std::vector
tags:
  - cpp
  - containers
updated: '2026-09-16T00:42:14.215Z'
source: std_vector
---

A dynamically resizeable array. The default container to reach for when unsure what you need.

```cpp
std::vector<int> v;
v.push_back(5);       // add to the end
v.push_back(10);
v[0];                  // 5, no bounds check
v.at(0);               // 5, throws if out of range
v.size();              // 2
for (int x : v) { ... }  // range-based iteration
```

## Under the hood
Backed by a contiguous heap array, like a C-array, but it tracks its own size and grows itself. When it outgrows its current allocation, it allocates a bigger block, copies (or moves) everything over, and frees the old one.

## push_back vs emplace_back
```cpp
Node obj(1.0f, 2.0f);   // construct the object first...
v.push_back(obj);        // ...then copy (or move, if obj is an rvalue) it in

v.emplace_back(1.0f, 2.0f);   // constructs the Node directly inside the vector's
                                // storage - no separate object, no copy/move at all
```
`push_back` needs a fully-formed object handed to it — building one always costs a construction, then a copy or move into place. `emplace_back` forwards its arguments straight to the object's constructor, building it in-place in the vector's already-allocated memory.

For a cheap type (an `int`), the difference is noise. For an expensive-to-copy/move type, skipping that extra step is a real, measurable win — the same spirit as [move semantics](/notes/unique-ptr), just automated one step further.

## Gotcha: emplace_back isn't automatically faster
```cpp
Node existing = getNode();
v.push_back(std::move(existing));   // one move, cheap if Node has a move ctor
v.emplace_back(existing);            // re-runs the FULL constructor from scratch -
                                       // might be more work than a move
```
Already have a constructed, move-friendly object? `push_back(std::move(...))` can beat `emplace_back` — emplace only wins when building the object fresh from its constructor arguments.

## Gotcha: reallocation invalidates pointers/iterators
```cpp
int* p = &v[0];
v.push_back(100);   // might reallocate!
*p;                  // p may now be dangling - UB
```
Never hold a raw pointer/iterator into a vector across a `push_back`/`insert`/`erase` unless you're certain no reallocation happened.

## Related
[C-style arrays](/notes/c-style-arrays)
[std::string](/notes/std-string)
