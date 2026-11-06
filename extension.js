// SPDX-License-Identifier: GPL-2.0-or-later

import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";

const PROPERTY = "updatesSupported";

export default class BlockExtensionUpdates extends Extension {
  enable() {
    const manager = Main.extensionManager;
    // An own property on the single ExtensionManager instance shadows the
    // getter on its prototype, which is the only gate for update checks,
    // downloads and installs. Keep any own property set by someone else so
    // that disable() can put it back.
    this._previous = Object.getOwnPropertyDescriptor(manager, PROPERTY);
    this._getter = () => false;
    Object.defineProperty(manager, PROPERTY, {
      configurable: true,
      get: this._getter,
    });
  }

  disable() {
    // This extension uses the unlock-dialog session mode: the daily update
    // check also runs while the screen is locked, and a download made then
    // would be installed on the next login before extensions are enabled.
    const manager = Main.extensionManager;
    const own = Object.getOwnPropertyDescriptor(manager, PROPERTY);
    if (own?.get === this._getter) {
      if (this._previous) Object.defineProperty(manager, PROPERTY, this._previous);
      else delete manager[PROPERTY];
    }
    this._previous = null;
    this._getter = null;
  }
}
