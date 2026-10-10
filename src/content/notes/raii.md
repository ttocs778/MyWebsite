---
title: RAII
tags:
  - cpp
  - memory
updated: '2026-09-16T00:19:12.243Z'
source: RAII
---

Resource Acquisition Is Initialization: tie a resource's lifetime to an object's constructor and destructor.

```cpp
class FileHandle {
public:
    FileHandle(const char* path) { file = fopen(path, "r"); }   // acquire
    ~FileHandle() { if (file) fclose(file); }                    // release, guaranteed
private:
    FILE* file;
};

{
    FileHandle f("data.txt");
    // ... use it ...
}   // file is closed here, no matter how this scope is exited
```

## Why "no matter how" matters
Even if an exception is thrown mid-scope, or a function returns early from three branches up, the destructor still runs when the object goes out of scope. There's no separate "cleanup" step to forget.

## A resource isn't just memory
Anything with an acquire/release pair fits: file handles, mutex locks, network sockets, database connections. [Smart pointers](/notes/smart-pointers) are just RAII applied specifically to heap memory.

## Related
[Smart pointers](/notes/smart-pointers)
