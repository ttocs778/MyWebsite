---
title: unique_ptr
tags:
  - cpp
  - memory
updated: '2026-09-16T00:10:15.559Z'
source: unique_ptr
---

Exactly one owner, always. Copy constructor and copy assignment are deleted — only move works.

## Create it
```cpp
auto node = std::make_unique<TranslateNode>(1.0f, 0.0f);
```
Prefer `make_unique` over raw `new`. One call, no chance of leaking if something throws mid-expression.

## Passing it to a function: by value, not by reference
```cpp
Node& addChild(unique_ptr<Node> child);   // correct
```

| signature | accepts rvalue? | can move-from inside? |
|---|:---:|:---:|
| `unique_ptr<T>&` | no | - |
| `const unique_ptr<T>&` | yes | no |
| `unique_ptr<T>` | yes | yes |

Only pass-by-value satisfies both "accepts a temporary directly" and "can actually take ownership out of it."

## std::move
```cpp
unique_ptr<Node> temp = std::make_unique<TranslateNode>(1, 0);
root->addChild(std::move(temp));   // temp is null from here on
```
Needed only for a named variable — a temporary is already an rvalue and skips this. After the move, `temp` is null; its destructor still runs at scope end, but deletes nothing.

## Gotcha: get() before move()
```cpp
Node* raw = child.get();
children.push_back(std::move(child));   // child is null now
return *raw;                             // still valid - raw pointed at
                                          // the object, not the wrapper
```
Grab the raw pointer first. Once moved, the `unique_ptr` variable is empty — calling `.get()` on it afterward just hands you `nullptr`.

## Related
[Smart pointers](/notes/smart-pointers)
[shared_ptr](/notes/shared-ptr)
[Const keyword](/notes/const-keyword)
