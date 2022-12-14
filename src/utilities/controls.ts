import * as THREE from 'three';

import type { Player } from '@/entities/player';
import { KeybindAction } from '@/managers/keybinds/action';
import { KeybindingManager } from '@/managers/keybinds/manager';

const EPS = 0.000001;

export class PlayerControls extends THREE.EventDispatcher {
  private readonly keybindingManager;

  /**
   * The current state of the move input by the user.
   *
   * Will be used to calculate the movement vector of the player.
   */
  public readonly moveState = {
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  };

  /**
   * The current state of the game.
   */
  public readonly gameState = {
    pause: 0,
  };

  /**
   * The current state of the mouse input by the user.
   *
   * Will be used to calculate whether the player is shooting or not.
   */
  public readonly mouseState = {
    primary: 0,
  };

  /**
   * The current mouse position on the HUD.
   */
  public readonly mouseHudCoordinates = new THREE.Vector2();

  /**
   * The current movement vector of the player.
   */
  public readonly moveVector = new THREE.Vector3(0, 0, 0);

  /**
   * The last position of the camera.
   *
   * Will be used to check if the camera has moved.
   */
  private readonly lastCameraPosition = new THREE.Vector3();

  public constructor(
    private readonly camera: THREE.Camera,
    private readonly domElement: HTMLCanvasElement,
    private readonly player: Player,
    private readonly scene: THREE.Scene,
  ) {
    super();

    this.keybindingManager = new KeybindingManager({
      domElement: this.domElement,
    });

    this.keybindingManager.register(
      new KeybindAction({
        action: 'player:moveup',
        label: 'Move Up',
        type: 'keyboard',
        key: 'w',
        state: 'pressed',
      }),
    );

    this.keybindingManager.addEventListener('player:moveup', (event) => {
      this.moveState.up = event.value;
      this.updateMovementVector();
    });

    this.keybindingManager.register(
      new KeybindAction({
        action: 'player:moveleft',
        label: 'Move Left',
        type: 'keyboard',
        key: 'a',
        state: 'pressed',
      }),
    );

    this.keybindingManager.addEventListener('player:moveleft', (event) => {
      this.moveState.left = event.value;
      this.updateMovementVector();
    });

    this.keybindingManager.register(
      new KeybindAction({
        action: 'player:movedown',
        label: 'Move Down',
        type: 'keyboard',
        key: 's',
        state: 'pressed',
      }),
    );

    this.keybindingManager.addEventListener('player:movedown', (event) => {
      this.moveState.down = event.value;
      this.updateMovementVector();
    });

    this.keybindingManager.register(
      new KeybindAction({
        action: 'player:moveright',
        label: 'Move Right',
        type: 'keyboard',
        key: 'd',
        state: 'pressed',
      }),
    );

    this.keybindingManager.addEventListener('player:moveright', (event) => {
      this.moveState.right = event.value;
      this.updateMovementVector();
    });

    this.keybindingManager.register(
      new KeybindAction({
        action: 'player:place-miner',
        label: 'Place Miner',
        type: 'keyboard',
        key: 'e',
        state: 'down',
      }),
    );

    this.keybindingManager.addEventListener('player:place-miner', (event) => {
      if (event.value === 1) {
        this.player.placeMiner(this.scene);
      }
    });

    this.keybindingManager.register(
      new KeybindAction({
        action: 'game:pause',
        label: 'Pause Game',
        type: 'keyboard',
        key: 'p',
        state: 'toggle',
      }),
    );

    this.keybindingManager.addEventListener('game:pause', (event) => {
      this.gameState.pause = event.value;
    });

    this.keybindingManager.register(
      new KeybindAction({
        action: 'weapon:reload',
        label: 'Reload Weapon',
        type: 'keyboard',
        key: 'r',
        state: 'down',
      }),
    );

    this.keybindingManager.addEventListener('weapon:reload', (event) => {
      // TODO @Shinigami92 2022-09-29: This needs to be moved out of the PlayerControls
      const reloadTriggered = this.player.weapon.reload();
      if (reloadTriggered) {
        const onReloaded = (): void => {
          event.reset();

          this.player.weapon.removeEventListener('reloaded', onReloaded);
        };

        this.player.weapon.addEventListener('reloaded', onReloaded);
      }
    });

    this.keybindingManager.register(
      new KeybindAction({
        action: 'shoot:primary',
        label: 'Shoot Primary',
        type: 'mouse',
        key: 'left',
        state: 'pressed',
      }),
    );

    this.keybindingManager.addEventListener('shoot:primary', (event) => {
      this.mouseState.primary = event.value;
    });

    this.keybindingManager.register(
      new KeybindAction({
        action: 'player:crosshair',
        label: 'Move Crosshair',
        type: 'mouse',
        key: 'move',
        state: 'move',
      }),
    );

    this.keybindingManager.addEventListener('player:crosshair', (event) => {
      this.mouseHudCoordinates.x = event.value.x;
      this.mouseHudCoordinates.y = event.value.y;
    });

    this.updateMovementVector();
  }

  public update(delta: number): void {
    if (this.gameState.pause === 1) {
      return;
    }

    const moveMultiplier = delta * this.player.movementSpeed;

    this.player.position.addScaledVector(this.moveVector, moveMultiplier);

    this.camera.position.set(
      this.player.position.x,
      this.player.position.y,
      this.player.position.z + 50,
    );

    if (this.lastCameraPosition.distanceToSquared(this.camera.position) > EPS) {
      this.dispatchEvent({ type: 'change' });
      this.lastCameraPosition.copy(this.camera.position);
    }
  }

  private updateMovementVector(): void {
    this.moveVector.x = -this.moveState.left + this.moveState.right;
    this.moveVector.y = -this.moveState.down + this.moveState.up;
    this.moveVector.z = 0;
    this.moveVector.normalize();
  }
}
