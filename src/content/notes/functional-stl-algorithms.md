---
title: Functional STL algorithms
tags:
  - cpp
  - functional
updated: '2026-09-16T00:18:48.258Z'
source: Functional STL algorithms
---

Instead of hand-writing loops, hand the STL a lambda and let it do the iterating.

## transform — map a function over a range
```cpp
std::vector<float> squared;
std::transform(v.begin(), v.end(), std::back_inserter(squared),
    [](float x) { return x * x; });
```

## copy_if — filter
```cpp
std::vector<int> evens;
std::copy_if(v.begin(), v.end(), std::back_inserter(evens),
    [](int x) { return x % 2 == 0; });
```

## accumulate — reduce to a single value
```cpp
int sum = std::accumulate(v.begin(), v.end(), 0,
    [](int a, int b) { return a + b; });
```

## generate — fill a range with computed values
```cpp
std::vector<int> v(10);
std::generate(v.begin(), v.end(), []() { return rand(); });
```

## Why bother
Same result as a hand-rolled `for` loop, but the intent (map/filter/reduce) is right there in the function name instead of buried in loop logic you have to read line-by-line to understand.

## Related
[Lambda expressions](/notes/lambda-expressions)
