# CLAUDE.md

Guidance for AI agents and contributors working on this extension.

## Table of Contents

- [Project overview](#project-overview)
- [Hard constraint: GNOME 45-51](#hard-constraint-gnome-45-51)
- [API surface used](#api-surface-used)
- [Procedure: add support for a new GNOME version](#procedure-add-support-for-a-new-gnome-version)
- [Syntax check](#syntax-check)
- [Manual testing](#manual-testing)
- [Files](#files)

## Project overview

`block-extension-updates` disables GNOME Shell's automatic updates of
user-installed extensions by shadowing `ExtensionManager.updatesSupported`.
Design decisions are recorded in [docs/ADR](docs/ADR); read them before
changing `extension.js`.

## Hard constraint: GNOME 45-51

`metadata.json` declares `shell-version` 45 through 51. Every change must keep
the extension working on all of them. Verify every symbol against the source of
each declared version; do not rely on the locally installed one.

## API surface used

| Symbol                                    | Source      | Notes                                                    |
| ----------------------------------------- | ----------- | -------------------------------------------------------- |
| `Extension` (ESM base class)              | gnome-shell | `js/extensions/extension.js`, since 45                   |
| `Main.extensionManager`                   | gnome-shell | single `ExtensionManager` instance, `js/ui/main.js`      |
| `ExtensionManager.updatesSupported` getter | gnome-shell | `js/ui/extensionSystem.js`; prototype getter, 45-51      |
| readers of `updatesSupported`             | gnome-shell | `checkForUpdates()` and `downloadExtensionUpdate()` in `js/ui/extensionDownloader.js`, `_installExtensionUpdates()` in `js/ui/extensionSystem.js` |
| `session-modes` with `unlock-dialog`      | gnome-shell | `metadata.json`; see ADR 0002                            |

Verification used for 45-51 (tags 45.0 ... 51.1):

```sh
cd gnome-shell
for t in 45.0 46.0 47.0 48.0 49.0 50.1 51.1; do
  echo "== $t"
  git show $t:js/ui/extensionSystem.js | grep -n 'get updatesSupported'
  git grep -n 'updatesSupported' $t -- js
done
```

The extension depends on every reader going through `Main.extensionManager`
(or `this` inside `ExtensionManager`), not through a cached value. If a new
GNOME version reads the getter differently, the shadowing stops working.

## Procedure: add support for a new GNOME version

1. Run the verification above for the new tag.
2. Check that `updatesSupported` is still a prototype getter and that all
   update paths still read it at call time.
3. Add the version to `shell-version` and to the README compatibility section;
   record any change in a new ADR.

## Syntax check

```sh
node --check extension.js
jq . metadata.json
```

## Manual testing

The logic can be checked on a running shell through `org.gnome.Shell.Eval`
(requires `unsafe_mode`): after enabling, `Main.extensionManager.updatesSupported`
is `false`; after disabling, it is the prototype value again.

1. Symlink the repository into `~/.local/share/gnome-shell/extensions/`.
2. Re-login (Wayland) or restart GNOME Shell (X11).
3. `gnome-extensions enable block-extension-updates@VitalyOstanin`.
4. Lock and unlock the screen; `gnome-extensions info` must still show the
   extension as active.
5. Check `journalctl --user -b -o cat /usr/bin/gnome-shell` for errors.

## Files

- `extension.js` — the whole implementation.
- `metadata.json` — uuid, name, description, `shell-version`, `session-modes`.
- `docs/ADR/` — architecture decision records.
