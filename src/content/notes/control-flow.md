---
title: Control flow
tags:
  - cpp
  - fundamentals
updated: '2026-09-16T00:40:33.171Z'
source: Control flow
---

Decides which statements actually run, and how many times.

## Branching
```cpp
if (hp <= 0) {
    die();
} else if (hp < 20) {
    lowHealthWarning();
} else {
    // fine
}
```

## switch — falls through by default
```cpp
switch (state) {
    case Idle:
        playIdleAnim();
        break;        // without this, execution falls into the next case!
    case Walking:
        playWalkAnim();
        break;
    default:
        break;
}
```
Forgetting `break` is one of the most common silent bugs in C++ — the case still compiles, it just also runs the next one's code.

## Loops
```cpp
for (int i = 0; i < 10; i++) { ... }     // known iteration count
while (isRunning) { ... }                 // condition checked before each pass
do { ... } while (retry);  // body runs at least once
for (auto& a : something) { ... } // range-based for loop, avoid big chunk copy and
									// access easily
```

## Related
[Operators and expressions](/notes/operators-and-expressions)
