---
title: Exception handling
tags:
  - cpp
  - exceptions
updated: '2026-09-16T00:40:45.186Z'
source: Exception handling
---

A way to signal "something went wrong" that unwinds the call stack until something catches it, instead of forcing every caller to check a return code.

```cpp
void loadFile(const std::string& path) {
    if (!fileExists(path)) {
        throw std::runtime_error("file not found: " + path);
    }
}

try {
    loadFile("data.txt");
} catch (const std::runtime_error& e) {
    std::cout << "Failed: " << e.what() << "\n";
} catch (const std::exception& e) {
    std::cout << "Something else went wrong: " << e.what() << "\n";
}
```

## Stack unwinding — the destructors still run
```cpp
void f() {
    FileHandle f("data.txt");   // has a destructor that closes the file
    throw std::runtime_error("oops");
}   // f's destructor STILL runs here, even though we're leaving via an exception
```
This is exactly why [RAII](/notes/raii) and exceptions are designed to work together — as the exception propagates up through each function's scope, every local object's destructor runs normally on the way out. Nothing leaks just because the exit was via `throw` instead of `return`.

## The exception hierarchy
`std::exception` is the base class almost everything derives from — `std::runtime_error`, `std::logic_error`, `std::out_of_range`, etc. Catching `const std::exception&` (by reference, to avoid [slicing](/notes/virtual-functions-and-polymorphism)) catches anything derived from it.

## Gotcha: a noexcept function that throws terminates immediately
See [noexcept](/notes/noexcept) — there's no catching your way out of that one.

## Related
[RAII](/notes/raii)
[noexcept](/notes/noexcept)
