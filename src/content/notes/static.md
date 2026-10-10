---
title: static
tags:
  - cpp
  - keywords
updated: '2026-09-16T00:41:57.577Z'
source: static
---

One keyword, three unrelated meanings depending on where you put it.

## Static member variable — shared across every instance
```cpp
class Enemy {
    static int count;   // one shared copy, not one per Enemy
};
int Enemy::count = 0;   // must be defined once, outside the class

Enemy::count++;   // accessed via the class, not an instance
```

## Static member function — no this, callable without an instance
```cpp
class MathUtils {
    static float clamp(float v, float lo, float hi);
};
MathUtils::clamp(5, 0, 1);   // no object needed at all
```
Can't touch non-static members — there's no `this` to find them on.

## Static local variable — persists across calls
```cpp
int nextId() {
    static int id = 0;   // initialized ONCE, on the first call ever
    return id++;
}
```
Keeps its value between calls, unlike an ordinary local which resets every time.

## Static local object — lazy, thread-safe construction
```cpp
class Logger {
public:
    Logger() { std::cout << "Logger created\n"; }
};

void doSomething() {
    static Logger logger;   // constructed ONCE, the first time this line runs
}
```
Not just for primitives — a static local can be a full class instance. It's constructed the first time execution reaches its declaration, and C++11 guarantees this is thread-safe even if multiple threads hit `doSomething()` for the first time simultaneously — no manual locking needed. This exact pattern (a static local instance, returned by reference) is how a lazy, thread-safe [Singleton](/notes/design-patterns) gets implemented in modern C++.

## Static global object — the initialization order fiasco
```cpp
// file1.cpp
Config globalConfig;                     // static storage duration, built before main()

// file2.cpp
Logger globalLogger(globalConfig);       // uses globalConfig - is it ready yet?
```
Static objects at global/namespace scope are constructed before `main()` runs. Within one `.cpp` file, top-to-bottom order is guaranteed. **Across different `.cpp` files, the order is undefined** — `globalLogger` might construct before or after `globalConfig`, and that order can silently change between builds or compilers.

This is the "static initialization order fiasco." The fix is the function-local static from above: wrap the global in a function returning a reference to a local static, so it only constructs the first time it's actually needed — never before something it depends on.

## Destruction order — reverse of construction, at program exit
```cpp
static Logger logger;         // constructed 1st
static Database db(logger);   // constructed 2nd, depends on logger

// at exit: db destroyed first (logger still alive, safe to use)
//          logger destroyed second
```
Statics are torn down in the reverse of their construction order when the program exits. Get the construction order wrong and there's a mirror-image teardown bug waiting too: using an already-destroyed static during shutdown.

## Static at file scope — invisible outside this file
```cpp
static void helperOnlyUsedHere() { ... }
```
Gives internal linkage — this symbol can't be seen or linked against from any other `.cpp` file, even if it was accidentally declared in a shared header.

## Related
[Design patterns](/notes/design-patterns)
