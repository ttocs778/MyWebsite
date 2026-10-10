---
title: Program vs process vs thread
tags:
  - systems
updated: '2026-09-16T00:18:52.990Z'
source: Program vs process vs thread
---

Three different things people casually call "a program."

## Program
Instructions sitting on disk, not running. Just a file.

## Process
A program that's actually running. Has its own memory space, OS resource handles, security context, and CPU state — completely isolated from other processes by default.

## Thread
The smallest unit of execution *inside* a process. A process can have many threads, and they all share the same memory and resources — which is exactly what makes threading both useful (fast communication, shared state) and dangerous (data races, one thread's bug corrupting another's data).

## Related
[Design patterns](/notes/design-patterns)
