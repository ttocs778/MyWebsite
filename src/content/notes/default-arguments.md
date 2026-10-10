---
title: Default arguments
tags:
  - cpp
  - functions
updated: '2026-09-16T00:40:38.831Z'
source: Default arguments
---

Let a caller skip trailing parameters and get a sensible default instead.

```cpp
void spawnEnemy(std::string type, int level = 1, bool elite = false);

spawnEnemy("goblin");             // level = 1, elite = false
spawnEnemy("goblin", 5);          // elite = false
spawnEnemy("goblin", 5, true);
```

## Rule: defaults only trail
```cpp
void f(int a = 1, int b);   // error - can't have a default before a non-default
```
Once one parameter has a default, every parameter after it needs one too — the compiler has to know where the caller stopped supplying arguments.

## Gotcha: don't repeat the default
```cpp
// header
void spawnEnemy(std::string type, int level = 1);
// .cpp
void spawnEnemy(std::string type, int level) { ... }   // no "= 1" here - already set
```

## Related
[Function declaration vs definition](/notes/function-declaration-vs-definition)
