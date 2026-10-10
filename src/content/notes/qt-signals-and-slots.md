---
title: Qt signals and slots
tags:
  - qt
  - gui
updated: '2026-09-16T00:43:26.972Z'
source: Qt signals and slots
---

Signals are declared, never defined. Qt's moc auto-generates the
implementation at compile time - writing a function body for one yourself
causes a duplicate-definition link error.

```cpp
signals:
    void sig_somethingHappened(int value);    // no .cpp definition, ever

public slots:
    void slot_onSomethingHappened(int value); // this one you do implement
```

`emit sig_somethingHappened(5);` broadcasts to every slot connected via
`connect(...)` - the emitter doesn't know or care who (if anyone) is
listening. This is what decouples, e.g., a rendering widget from the main
window that displays its data.

## Gotcha: string-based connect() fails silently
```cpp
connect(ui->button, SIGNAL(clicked()), ui->widget, SLOT(slot_addNode()));
```
If `slot_addNode` doesn't exactly match a real slot's name (typo, or
renamed on one side and not the other), this is not a compile error - it
prints a runtime console warning ("No such slot...") and the connection
is simply never made. Verify by actually clicking the control and
watching for an effect, not just by a successful build.

## Related
[Virtual functions and polymorphism](/notes/virtual-functions-and-polymorphism)
[Callback functions](/notes/callback-functions)
