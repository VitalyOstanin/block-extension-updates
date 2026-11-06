# 0003 - Restore a previous own property on disable

Status: Accepted

## Context

Another extension may already have defined its own `updatesSupported` on the
same instance (for example during migration from such an extension). A plain
`delete` in `disable()` would remove that override too and re-enable updates.

## Decision

On `enable()`, remember the existing own property descriptor, if any. On
`disable()`, act only if the current own property is still the one this
extension installed: put the remembered descriptor back, or delete the
property when there was none.

## Consequences

- Disabling this extension leaves another blocker's override in place.
- The other extension may still remove this extension's override when it is
  disabled; the README advises not to run two blockers together.
- Checked on a running GNOME Shell 50 through `org.gnome.Shell.Eval`, with and
  without a previous override.
