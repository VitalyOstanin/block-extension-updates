# 0005 - Leave a non-configurable foreign override in place

Status: Accepted

## Context

`enable()` defines its own `updatesSupported` on `Main.extensionManager`
(ADR 0001) and remembers a previous own property (ADR 0003). If another
extension has already defined that property without `configurable: true`,
`Object.defineProperty` throws `TypeError`: GNOME Shell marks the extension as
failed and the error does not explain the cause. Such a property cannot be
replaced or removed by anyone until GNOME Shell restarts.

## Decision

When the existing own property is non-configurable, `enable()` logs a warning
with `console.warn` and returns without changing anything. `disable()` acts
only if this extension's getter is installed, so it leaves the foreign
property alone as well.

## Consequences

- The extension stays enabled without an error; whether updates are blocked
  depends on the foreign property.
- The README Limitations section mentions this case.
- Checked with a stand-in object in Node: a non-configurable foreign getter
  is left untouched by both `enable()` and `disable()`.
