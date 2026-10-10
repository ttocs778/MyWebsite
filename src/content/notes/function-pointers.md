---
title: Function pointers
tags:
  - cpp
  - pointers
  - functional
updated: '2026-09-16T00:43:19.813Z'
source: Function pointers
---

A variable that holds the address of a function, and can be called through.

```cpp
int add(int a, int b) { return a + b; }

int (*fp)(int, int) = add;   // fp points at add
fp(2, 3);                     // 5 - calls through the pointer
```
The declaration syntax is famously ugly — `int (*fp)(int, int)` reads as "fp is a pointer to a function taking two ints and returning int." [using](/notes/using-type-alias) makes this readable:
```cpp
using BinaryOp = int(*)(int, int);
BinaryOp fp = add;
```

## Why you'd reach for a lambda or std::function instead today
```cpp
void sortWith(int (*cmp)(int, int));   // can ONLY take a real function - no
                                        // capturing lambda, no member function
void sortWith(std::function<int(int,int)> cmp);   // takes anything callable
```
A raw function pointer can't hold a lambda that captures anything, or a bound member function. [Lambdas](/notes/lambda-expressions) and `std::function` are the modern default; function pointers mostly show up now when interfacing with C APIs, which don't know what a lambda is.

## Related
[Lambda expressions](/notes/lambda-expressions)
[Callback functions](/notes/callback-functions)
