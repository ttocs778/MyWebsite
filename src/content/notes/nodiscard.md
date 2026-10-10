---
title: nodiscard
tags:
  - cpp
  - keywords
updated: '2026-09-16T00:41:19.134Z'
source: nodiscard
---

Warns the caller if they throw away a return value they probably needed.

```cpp
[[nodiscard]] bool loadFile(const std::string& path);

loadFile("data.txt");   // warning: ignoring return value marked nodiscard
if (!loadFile("data.txt")) { /* handle failure */ }   // fine
```

## When to use it
Anything where ignoring the result is almost always a bug — a success/failure flag, an error code, a lock you need to actually hold onto (`std::lock_guard`). Not every return value needs this; only the ones where forgetting to check is a real, common mistake.

## Related
[API design guidelines](/notes/api-design-guidelines)
