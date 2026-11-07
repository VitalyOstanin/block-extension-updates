// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Vitaly Ostanin

import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";

const PROPERTY = "updatesSupported";

export default class BlockExtensionUpdates extends Extension {
  _previous = null;
  _getter = null;

  enable() {
    const manager = Main.extensionManager;
    // An own property shadows the prototype getter that gates every update
    // path (ADR 0001); keep a foreign one so that disable() can restore it.
    const previous = Object.getOwnPropertyDescriptor(manager, PROPERTY);
    if (previous?.configurable === false) {
      console.warn(
        `${this.metadata.uuid}: ${PROPERTY} is already overridden by a non-configurable property, leaving it as is`,
      );
      return;
    }
    this._previous = previous ?? null;
    this._getter = () => false;
    Object.defineProperty(manager, PROPERTY, {
      configurable: true,
      get: this._getter,
    });
  }

  // disable() is not called when the screen locks: the extension also runs in
  // the unlock-dialog session mode, because the daily update check runs there
  // too and a download made then would be installed on the next login before
  // extensions are enabled (ADR 0002).
  disable() {
    const manager = Main.extensionManager;
    const own = Object.getOwnPropertyDescriptor(manager, PROPERTY);
    if (this._getter && own?.get === this._getter) {
      if (this._previous) Object.defineProperty(manager, PROPERTY, this._previous);
      else delete manager[PROPERTY];
    }
    this._previous = null;
    this._getter = null;
  }
}
