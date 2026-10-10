---
title: Associative containers
tags:
  - cpp
  - containers
updated: '2026-09-16T00:40:09.859Z'
source: Associative containers
---

Key-value lookup, instead of index-based like [std::vector](/notes/std-vector).

## map / set — sorted, tree-based
```cpp
std::map<std::string, int> scores;
scores["Alice"] = 100;                  // insert or update
scores.insert({"Bob", 90});              // insert, does nothing if key exists
scores.at("Alice");                      // 100, throws if missing
scores.find("Alice") != scores.end();    // check existence without inserting
scores.erase("Alice");

for (const auto& [name, score] : scores) { ... }   // iterates in sorted key order
```
Backed by a red-black tree — O(log n) for lookup, insert, and erase. Iterating a `map` always visits keys in sorted order, for free.

## unordered_map — hash-based, faster average case, no ordering
```cpp
std::unordered_map<std::string, int> scores;
scores["Alice"] = 100;   // same interface as map
```
Backed by a hash table instead — O(1) average-case lookup/insert/erase, but O(n) worst case if many keys collide into the same bucket. Iteration order is unspecified and can change between runs — never rely on it.

## When to pick which
| | Order | Typical lookup |
|---|---|---|
| `map` / `set` | sorted by key | O(log n) |
| `unordered_map` / `unordered_set` | none | O(1) average |

Default to `unordered_map` for pure lookup speed. Reach for `map` when sorted iteration matters, or the key type doesn't have a convenient hash readily available.

## Gotcha: operator[] silently inserts
```cpp
if (scores["Charlie"] > 50) { ... }   // "Charlie" didn't exist - it just got
                                        // inserted with value 0!
```
`operator[]` default-constructs a new entry if the key isn't found — checking existence this way accidentally creates it. Use `.find()` or `.count()` to check without inserting.

## Related
[std::vector basics](/notes/std-vector)
