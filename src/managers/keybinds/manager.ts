import * as THREE from 'three';

import { KeyboardInputManager } from '@/managers/inputs/keyboard';
import { MouseInputManager } from '@/managers/inputs/mouse';
import type { KeybindAction } from '@/managers/keybinds/action';

export class KeybindingManager extends THREE.EventDispatcher {
  private readonly keybinds: KeybindAction[] = [];

  private readonly keyboardInputManager = new KeyboardInputManager();
  private readonly mouseInputManager = new MouseInputManager();

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
                reset: () => {
                  keybind.value = 0;
                },
              });
            },
            keyup: () => {
              keybind.value = 0;
              this.dispatchEvent({
                type: keybind.action,
                target: this,
                value: keybind.value,
                reset: () => {
                  keybind.value = 0;
                },
              });
            },
          });
          break;

        case 'up':
          this.keyboardInputManager.register({
            key: keybind.key,
            keyup: () => {
              if (keybind.value === 0) {
                keybind.value = 1;
                this.dispatchEvent({
                  type: keybind.action,
                  target: this,
                  value: keybind.value,
                  reset: () => {
                    keybind.value = 0;
                  },
                });
              }
            },
          });
          break;

        case 'down':
          this.keyboardInputManager.register({
            key: keybind.key,
            keydown: () => {
              if (keybind.value === 0) {
                keybind.value = 1;
                this.dispatchEvent({
                  type: keybind.action,
                  target: this,
                  value: keybind.value,
                  reset: () => {
                    keybind.value = 0;
                  },
                });
              }
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
                reset: () => {
                  keybind.value = 0;
                },
              });
            },
          });
          break;
      }
    } else if (keybind.type === 'mouse') {
      switch (keybind.state) {
        case 'pressed':
          this.mouseInputManager.register({
            button: this.mouseInputManager.getButton(keybind.key),
            mousedown: () => {
              keybind.value = 1;
              this.dispatchEvent({
                type: keybind.action,
                target: this,
                value: keybind.value,
                reset: () => {
                  keybind.value = 0;
                },
              });
            },
            mouseup: () => {
              keybind.value = 0;
              this.dispatchEvent({
                type: keybind.action,
                target: this,
                value: keybind.value,
                reset: () => {
                  keybind.value = 0;
                },
              });
            },
          });
          break;
      }
    }
  }
}
