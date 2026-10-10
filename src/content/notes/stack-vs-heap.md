---
title: Stack vs heap
tags:
  - cpp
  - memory
updated: '2026-09-16T00:40:02.882Z'
source: Stack vs heap
---

Two places a variable's memory can live, with very different rules for how long it sticks around.

## Stack
```cpp
void f() {
    int x = 5;       // lives on the stack
}   // x is automatically destroyed here, no action needed
```
Fast (just moving a pointer), automatically cleaned up when the scope ends. Limited size — deep recursion or a huge local array can overflow it.

## Heap
```cpp
int* p = new int(5);   // lives on the heap, outlives this function
delete p;                // YOU must say when it's done
```
Slower to allocate, much bigger capacity, and lives until explicitly freed — or until whatever owns it (a [smart pointer](/notes/smart-pointers), a container) decides to.

## Rule of thumb
Default to the stack — automatic and fast. Reach for the heap when something needs to outlive the function that created it, or when its size isn't known until runtime.

## Related
[new and delete](/notes/new-and-delete)
