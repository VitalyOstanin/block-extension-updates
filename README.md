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
- [License](#license)

## What it does

GNOME Shell checks extensions.gnome.org for updates of every extension in
`~/.local/share/gnome-shell/extensions` at login and then once a day. A newer
version is downloaded to `~/.local/share/gnome-shell/extension-updates/` and
replaces the installed one on the next login, without asking. While this
extension is enabled, none of that happens.

## Why

An unattended update can change or break an extension at an inconvenient
moment, and replaces a locally modified copy with the published one. There is
no setting for this in GNOME Shell:
`org.gnome.shell allow-extension-installation` set to `false` also stops GNOME
Shell from loading any user-installed extension.

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
git clone https://github.com/VitalyOstanin/block-extension-updates.git \
  ~/.local/share/gnome-shell/extensions/block-extension-updates@VitalyOstanin
```

Log out and back in (Wayland) or restart GNOME Shell (X11), then:

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
- Do not use together with other extensions that override the same property:
  disabling either of them may restore update checks until the next login.

## License

GPL-2.0-or-later, see [LICENSE](LICENSE).
