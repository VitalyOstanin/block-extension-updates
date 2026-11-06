# 0004 - Declare and verify support for GNOME 45-51

Status: Accepted

## Context

The approach relies on GNOME Shell internals: `ExtensionManager.updatesSupported`
being a prototype getter and every update path reading it at call time.

## Decision

Declare `shell-version` 45-51 after checking the gnome-shell tags 45.0, 46.0,
47.0, 48.0, 49.0, 50.1 and 51.1:

- `js/ui/extensionSystem.js` defines `get updatesSupported()` on
  `ExtensionManager` in every tag;
- it is read in `checkForUpdates()` and `downloadExtensionUpdate()`
  (`js/ui/extensionDownloader.js`, through `Main.extensionManager`) and in
  `_installExtensionUpdates()` (`js/ui/extensionSystem.js`, through `this`),
  and nowhere else.

GNOME 51 replaced `unzip` with GnomeAutoar when extracting updates, which does
not affect the gate.

## Consequences

- Every new GNOME version must be re-checked the same way before it is added
  (procedure in CLAUDE.md).
