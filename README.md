# Block extension updates

A GNOME Shell extension that stops GNOME Shell from checking for, downloading
and installing updates of user-installed extensions from
[extensions.gnome.org](https://extensions.gnome.org). Updating stays possible
manually.

## Table of Contents

- [What it does](#what-it-does)
- [Why](#why)
- [How it works](#how-it-works)
- [Compatibility](#compatibility)
- [Installation](#installation)
- [Updating extensions manually](#updating-extensions-manually)
- [Limitations](#limitations)
- [Development](#development)
- [License](#license)

## What it does

GNOME Shell checks extensions.gnome.org for updates of every extension in
`~/.local/share/gnome-shell/extensions` at login and then once a day. A newer
version is downloaded to `~/.local/share/gnome-shell/extension-updates/` and
replaces the installed one on the next login, without asking. While this
extension is enabled, none of that happens.

## Why

An unattended update can change or break an extension at an inconvenient
moment, and replaces a locally modified copy with the published one. GNOME
Shell has no setting that turns off only the updates:

- `org.gnome.shell allow-extension-installation` set to `false` also stops
  GNOME Shell from loading any user-installed extension;
- updates are also off when neither the Extensions app
  (`org.gnome.Extensions`) nor Extension Manager
  (`com.mattjakeman.ExtensionManager`) is installed, but then there is no
  app to manage extensions, and installing either of them, for example as a
  dependency, turns updates back on without notice.

## How it works

GNOME Shell gates the update check, the download and the install of pending
updates on a single getter, `ExtensionManager.updatesSupported`. The extension
defines an own property with the same name on the `Main.extensionManager`
instance that always returns `false`, which shadows the getter on the
prototype. `disable()` removes it again.

The extension stays enabled on the lock screen (`unlock-dialog` session mode):
the daily check also runs while the screen is locked.

## Compatibility

GNOME Shell 45-51.

## Installation

```sh
git clone --branch v1.0 https://github.com/VitalyOstanin/block-extension-updates.git \
  ~/.local/share/gnome-shell/extensions/block-extension-updates@VitalyOstanin
```

Log out and back in (on an X11 session of GNOME 45-49, restarting GNOME Shell
with Alt+F2, `r` is enough), then:

```sh
gnome-extensions enable block-extension-updates@VitalyOstanin
```

## Updating extensions manually

Download the zip of the wanted version from extensions.gnome.org and install
it over the current one, then log out and back in:

```sh
gnome-extensions install --force <uuid>.shell-extension.zip
```

## Limitations

- Pending updates that were downloaded before the extension was enabled are
  installed on the next login, before any extension is enabled. Check
  `~/.local/share/gnome-shell/extension-updates/` and remove its contents if
  you do not want them.
- On the first login after a major GNOME Shell upgrade (for example, 50 to
  51), GNOME Shell checks for, downloads and installs extension updates once,
  before any extension is enabled, so this extension cannot block it. To skip
  that run, create the marker file for the new version before upgrading, for
  example `touch ~/.local/share/gnome-shell/update-check-51`.
- Security fixes of extensions are not installed automatically either. Compare
  the installed versions (`gnome-extensions info <uuid>`) with
  extensions.gnome.org from time to time.
- Do not use together with other extensions that override the same property:
  disabling either of them may restore update checks until the next login.
  If another extension has already set the property as non-configurable, this
  extension leaves it as is and logs a warning.

## Development

Design decisions are recorded in [docs/ADR](docs/ADR/README.md); the
development notes, the list of GNOME Shell APIs used and the manual test
procedure are in [CLAUDE.md](CLAUDE.md). Changes are listed in
[CHANGELOG.md](CHANGELOG.md).

## License

Copyright (C) 2026 Vitaly Ostanin

GPL-2.0-or-later, see [LICENSE](LICENSE).
