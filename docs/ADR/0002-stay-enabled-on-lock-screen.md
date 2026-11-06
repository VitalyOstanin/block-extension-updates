# 0002 - Stay enabled in the `unlock-dialog` session mode

Status: Accepted

## Context

GNOME Shell disables extensions that do not list `unlock-dialog` in
`session-modes` while the screen is locked. The daily update check is a timer
of `ExtensionManager` and keeps running on the lock screen. If it fires then,
the update is downloaded, and on the next login it is installed before any
extension is enabled.

This gap was observed with an earlier extension that used the same approach
without `unlock-dialog`: an extension was updated from extensions.gnome.org
although update blocking was enabled.

## Decision

Declare `"session-modes": ["user", "unlock-dialog"]` in `metadata.json`, and
keep the reason as a comment above `disable()`, as required by the
extensions.gnome.org review guidelines.

## Consequences

- Update blocking has no gap during screen lock.
- The extension creates no UI, so being active on the lock screen exposes
  nothing there.
