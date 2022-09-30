import * as THREE from 'three';

import { KeyboardInputManager } from '@/managers/inputs/keyboard';
import type { KeybindAction } from '@/managers/keybinds/action';

export class KeybindingManager extends THREE.EventDispatcher {
  private readonly keybinds: KeybindAction[] = [];

  private readonly keyboardInputManager = new KeyboardInputManager();

  public register(keybind: KeybindAction): void {
    this.keybinds.push(keybind);

    if (keybind.type === 'keyboard') {
      switch (keybind.state) {
        case 'pressed':
          this.keyboardInputManager.register({
            key: keybind.key,
            keydown: () => {
              keybind.value = 1;
              this.dispatchEvent({
                type: keybind.action,
                target: this,
                value: keybind.value,
              });
            },
            keyup: () => {
              keybind.value = 0;
              this.dispatchEvent({
                type: keybind.action,
                target: this,
                value: keybind.value,
              });
            },
          });
          break;
        case 'toggle':
          this.keyboardInputManager.register({
            key: keybind.key,
            keydown: () => {
              keybind.value = keybind.value === 0 ? 1 : 0;
              this.dispatchEvent({
                type: keybind.action,
                target: this,
                value: keybind.value,
              });
            },
          });
          break;
      }
    }
  }
}
