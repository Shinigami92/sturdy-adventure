import * as THREE from 'three';

import { KeyboardInputManager } from '@/managers/inputs/keyboard';
import type { KeybindAction } from '@/managers/keybinds/action';

export class KeybindingManager extends THREE.EventDispatcher {
  private readonly keybinds: KeybindAction[] = [];
  private readonly keyboardInputManager = new KeyboardInputManager();

  private readonly eventListeners: [
    'keydown' | 'keyup',
    (event: KeyboardEvent) => void,
  ][] = [];

  public register(keybind: KeybindAction): void {
    this.keybinds.push(keybind);

    if (keybind.type === 'keyboard') {
      this.keyboardInputManager.register({
        key: keybind.key,
        keydown: () =>
          this.dispatchEvent({ type: keybind.action, target: this, value: 1 }),
        keyup: () =>
          this.dispatchEvent({ type: keybind.action, target: this, value: 0 }),
      });
      // const keydownListener: ['keydown', (event: KeyboardEvent) => void] = [
      //   'keydown',
      //   (event) => {
      //     if (event.key === keybind.key) {
      //       this.dispatchEvent({
      //         type: keybind.action,
      //         target: this,
      //         value: 1,
      //       });
      //     }
      //   },
      // ];

      // window.addEventListener(keydownListener[0], keydownListener[1], false);

      // const keyupListener: ['keyup', (event: KeyboardEvent) => void] = [
      //   'keyup',
      //   (event) => {
      //     if (event.key === keybind.key) {
      //       this.dispatchEvent({
      //         type: keybind.action,
      //         target: this,
      //         value: 0,
      //       });
      //     }
      //   },
      // ];

      // window.addEventListener(keyupListener[0], keyupListener[1], false);
    }
  }

  public dispose(): void {
    this.eventListeners.forEach((listener) => {
      window.removeEventListener(listener[0], listener[1], false);
    });
  }
}
