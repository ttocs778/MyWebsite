---
title: CMake basics
tags:
  - build-tools
  - cpp
updated: '2026-09-21T19:04:20.423Z'
source: CMake basics
---

CMake doesn't build your code. It *generates* project files (Makefiles, Ninja, Xcode projects) for whatever build system you actually have — then that tool does the compiling.

```bash
cmake -B build       # generate the build system into ./build
cmake --build build  # compile, using whatever got generated
```

## A minimal CMakeLists.txt
```cmake
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(MyApp Main.cpp Node.cpp)
```

## Libraries and linking
```cmake
add_library(SceneLib Node.cpp Polygon.cpp)

add_executable(MyApp Main.cpp)
target_link_libraries(MyApp SceneLib)
```

## Pulling in external code
```cmake
find_package(ZLIB REQUIRED)
target_link_libraries(MyApp PRIVATE ZLIB::ZLIB)

include(FetchContent)
FetchContent_Declare(catch GIT_REPOSITORY https://github.com/catchorg/Catch2.git GIT_TAG v2.13.3)
FetchContent_MakeAvailable(catch)
```
`FetchContent` downloads and configures a dependency automatically at configure time — no manual cloning or installing.

## Gotcha: GLOB is convenient but flaky
```cmake
file(GLOB source_files CONFIGURE_DEPENDS "*.cpp")
```
Auto-collects source files instead of listing them by hand — but it's not fully reliable across every generator, and adding a new file sometimes needs a manual re-run of `cmake` to be noticed.

## Related
[Compilation process](/notes/compilation-process)
