import * as THREE from 'three';

import { KeyboardInputManager } from '@/managers/inputs/keyboard';
import { MouseInputManager } from '@/managers/inputs/mouse';
import type { KeybindAction } from '@/managers/keybinds/action';

export interface KeybindingManagerOptions {
  /**
   * The element to listen to input events on.
   *
   * @default window
   */
  readonly domElement?: HTMLElement | typeof window;
}

/**
 * The keybinding manager.
 */
export class KeybindingManager extends THREE.EventDispatcher {
  private readonly keybinds: KeybindAction[] = [];

  private readonly keyboardInputManager;
  private readonly mouseInputManager;

  public constructor(
    options: KeybindingManagerOptions = { domElement: window },
  ) {
    super();

    this.keyboardInputManager = new KeyboardInputManager({
      domElement: window,
    });

    this.mouseInputManager = new MouseInputManager({
      domElement: options.domElement ?? window,
    });
  }

  /**
   * Register a keybind.
   *
   * @param keybind The keybind to register.
   */
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
          });
          break;

        case 'down':
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

        case 'move':
          this.mouseInputManager.register({
            button: 0,
            mousemove: ({ x, y }) => {
              keybind.value = { x, y };
              this.dispatchEvent({
                type: keybind.action,
                target: this,
                value: keybind.value,
                reset: () => {
                  keybind.value = { x: 0, y: 0 };
                },
              });
            },
          });
          break;
      }
    }
  }

  // TODO @Shinigami92 2022-09-30: Implement unregister

  // TODO @Shinigami92 2022-09-30: Implement dispose
}
