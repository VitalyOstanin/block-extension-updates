# 0001 - Shadow `updatesSupported` on the manager instance

Status: Accepted

## Context

GNOME Shell updates user-installed extensions without asking: it checks
extensions.gnome.org at login and once a day, downloads newer versions into
`extension-updates/` and installs them on the next login. There is no setting
to turn this off. `allow-extension-installation = false` also excludes the
user extension directory from loading, so it cannot be used.

All three steps (check, download, install of pending updates) return early
when `ExtensionManager.updatesSupported` is false. It is a getter on the
`ExtensionManager` prototype, read at call time through the single instance
`Main.extensionManager`.

## Decision

On `enable()`, define a configurable own property `updatesSupported` on
`Main.extensionManager` whose getter always returns `false`. It shadows the
prototype getter for every reader. On `disable()`, remove it.

No patching of functions, no timers, no files.

## Consequences

- The whole mechanism is one property; nothing to clean up besides it.
- The prototype is left intact, so removing the own property restores the
  original behaviour exactly.
- Depends on GNOME Shell keeping a single gate and reading it at call time
  (see ADR 0004).
- Updates downloaded before the extension was enabled are still installed on
  the next login, because that happens before extensions are enabled.
