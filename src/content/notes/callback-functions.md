---
title: Callback functions
tags:
  - cpp
  - functional
updated: '2026-09-16T00:43:15.353Z'
source: Callback functions
---

A function passed as an argument to another function, to be called later — usually in response to something happening (a click, a finished computation, a sort comparison) rather than called directly by the code that received it.

## Three ways to pass one, all valid
```cpp
// 1. Function pointer - the original mechanism
void onComplete(int result) { std::cout << result; }
void doWork(void (*callback)(int));
doWork(onComplete);

// 2. Lambda - most common today
doWork([](int result) { std::cout << result; });

// 3. std::function - when the callback needs to be stored, not just passed through
std::function<void(int)> savedCallback = [](int result) { std::cout << result; };
```
See [Function pointers](/notes/function-pointers) and [Lambda expressions](/notes/lambda-expressions) for the mechanics of each — a callback isn't a fourth language feature, it's a *role* any of these three can play.

## The defining pattern: called by someone else, later
```cpp
void doWork(std::function<void(int)> onDone) {
    int result = expensiveComputation();
    onDone(result);   // the caller's code runs HERE, inside doWork - not
                       // where doWork itself was originally called from
}
```
The caller hands over *what* to do; `doWork` decides *when* to actually do it. `doWork` never needs to know or care what the callback actually does — that's the whole point.

## Where this shows up across the vault
- `std::sort`'s comparator (see [Lambda expressions](/notes/lambda-expressions)) is a callback — `sort` calls it repeatedly; you never call it yourself.
- [Qt signals and slots](/notes/qt-signals-and-slots) is a callback mechanism with extra infrastructure bolted on (multiple listeners, loose coupling between sender and receiver).
- The [Observer pattern](/notes/design-patterns) is what a callback looks like once "many listeners" gets formalized into its own class structure.

## Related
[Function pointers](/notes/function-pointers)
[Lambda expressions](/notes/lambda-expressions)
[Qt signals and slots](/notes/qt-signals-and-slots)
[Design patterns](/notes/design-patterns)
