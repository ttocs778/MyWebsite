---
title: Members and access control
tags:
  - cpp
  - oop
updated: '2026-09-16T00:41:13.007Z'
source: Members and access control
---

Controls who can touch what.

```cpp
class Node {
public:
    void addChild(uPtr<Node> child);   // anyone can call this

protected:
    void internalHelper();             // this class and derived classes only

private:
    std::vector<uPtr<Node>> children;  // only this class's own code
};
```

## Why bother hiding anything
Once a member is `private`, you control every place it can change — there's exactly one door in (your own member functions). Make it `public` and *any* code anywhere can reach in and set it to something invalid, with no way to trace where that happened.

## Related
[struct vs class](/notes/struct-vs-class)
[Constructors and destructors](/notes/constructors-and-destructors)
[Inheritance basics](/notes/inheritance-basics)
