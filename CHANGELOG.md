# Changelog

All notable changes to this extension are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0] - Unreleased

### Added

- Shadow `ExtensionManager.updatesSupported` so that GNOME Shell does not
  check for, download or install extension updates.
- Stay enabled on the lock screen (`unlock-dialog` session mode).
- Restore a previous own property on disable; leave a non-configurable one
  in place with a warning.
- Support for GNOME Shell 45-51.
