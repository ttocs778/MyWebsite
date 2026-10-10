---
title: std::initializer_list
tags:
  - cpp
  - containers
updated: '2026-09-16T00:42:02.162Z'
source: std_initializer_list
---

Lets a class accept a `{...}` braced list directly in its constructor.

```cpp
class DynArray {
public:
    DynArray(std::initializer_list<int> list) {
        mSize = list.size();
        mData = new int[mSize];
        int i = 0;
        for (int val : list) mData[i++] = val;
    }
};

DynArray a{1, 2, 3};   // calls the initializer_list constructor
```

## Gotcha: {} and () can call completely different constructors
```cpp
std::vector<int> v1{5};   // one element: {5}
std::vector<int> v2(5);   // five elements, all zero-initialized
```
If a class has both an `initializer_list` constructor and a regular one, brace-init `{}` prefers the `initializer_list` version whenever the braces could match it — even when that's clearly not what was meant.

## Related
[std::vector basics](/notes/std-vector)
