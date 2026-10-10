---
title: API design guidelines
tags:
  - cpp
  - api-design
updated: '2026-09-16T00:24:19.621Z'
source: API design guidelines
---

Make the API hard to use *wrong*, not just possible to use right.

## Concrete rules
- Name things so the call site reads clearly, without needing to check the header.
- Mark return values [nodiscard](/notes/nodiscard) when ignoring them is almost always a bug (an error code, a lock guard).
- Mark functions [noexcept](/notes/noexcept) when they genuinely can't throw — lets callers and containers optimize around that guarantee.
- Never return a raw owning pointer — the caller has no idea who's responsible for freeing it. Return a [smart pointer](/notes/smart-pointers) instead, or a reference/value if ownership isn't even in question.
- Pick one error-handling strategy (exceptions, or error-return objects) and stick to it — mixing the two forces every caller to remember which functions do which.
- Use [explicit](/notes/explicit) on single-argument constructors to block accidental implicit conversions.

## Why this matters more than it sounds
A well-designed API makes the *wrong* usage not compile, rather than compiling fine and blowing up at runtime three call sites away from the actual mistake. Every rule above is really the same rule: push a mistake from "runtime bug" to "compile error," as early as possible.

## Related
[nodiscard](/notes/nodiscard)
[noexcept](/notes/noexcept)
[explicit](/notes/explicit)
