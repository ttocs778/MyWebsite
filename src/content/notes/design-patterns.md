---
title: Design patterns
tags:
  - cpp
  - design-patterns
updated: '2026-09-16T00:43:30.113Z'
source: Design patterns
---

Common, reusable solutions to recurring design problems. Not laws — guidelines that stop you from reinventing a worse version of something already solved.

## Singleton
One instance, globally accessible.
```cpp
template <class T>
class Singleton {
protected:
    Singleton() {}
public:
    static T& get() {
        static std::unique_ptr<T> instance;
        if (!instance) instance = std::make_unique<T>();
        return *instance;
    }
};
```
Popular, and often a mistake. Hides dependencies (any function can silently reach into global state) and makes testing painful (can't swap in a fake). Prefer passing the dependency explicitly instead:
```cpp
class MyAwesomeClass {
public:
    MyAwesomeClass(FileSystem& fs);   // the dependency is right there in the signature
};
```

## Abstract Factory
Group related object creation behind one interface, instead of scattering `new` calls everywhere.
```cpp
// instead of: new AmericanBurger(); new AmericanDrink(); new AmericanFries();
MealFactory* f = new AmericanFactory();
f->CreateBurger();
f->CreateDrink();
f->CreateFries();
```
Swap `AmericanFactory` for `ItalianFactory` and the whole meal changes together, consistently — no risk of accidentally mixing an American burger with Italian fries.

## Adapter
You have a MacBook (USB-C). You have an old drive (USB-A). They don't fit.
You buy a USB-C → USB-A adapter. Now they work together.
That's the whole pattern — a class that wraps an incompatible interface so it looks like the one your code already expects.

## Flyweight
Many nearly-identical objects? Don't store full data for each one.
Printing 10,000 flyers — the text and background image are identical every time (store once, shared). Only the serial number differs per flyer (store separately, per instance).

## Proxy
You want to talk to a celebrity. You don't — you talk to their agent.
The agent can deny access, schedule things, filter what gets through, while still giving you the *effect* of talking to the celebrity directly. Agent = proxy, celebrity = real object.

## Mediator
A central controller that coordinates interactions between objects, so they don't all hold direct references to each other and turn into a tangled mess of cross-dependencies.

## Observer
The callback/delegate pattern by another name. Objects subscribe to an event; the subject notifies every subscriber when something happens, without knowing or caring who they are.

## Related
[unique_ptr](/notes/unique-ptr)
[Callback functions](/notes/callback-functions)
