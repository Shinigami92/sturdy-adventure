import * as THREE from 'three';

import type { Player } from '@/entities/player';

const EPS = 0.000001;

export class PlayerControls extends THREE.EventDispatcher {
  readonly moveState = {
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  };

  readonly mouseState = {
    primary: 0,
    secondary: 0,
  };

  readonly moveVector = new THREE.Vector3(0, 0, 0);

  private readonly lastCameraPosition = new THREE.Vector3();

  private readonly _keydown = this.keydown.bind(this);
  private readonly _keyup = this.keyup.bind(this);
  private readonly _mousedown = this.mousedown.bind(this);
  private readonly _mouseup = this.mouseup.bind(this);

  constructor(
    private readonly camera: THREE.Camera,
    private readonly domElement: HTMLCanvasElement,
    private readonly player: Player,
  ) {
    super();

    this.domElement.addEventListener('mousedown', this._mousedown, false);
    this.domElement.addEventListener('mouseup', this._mouseup, false);
    window.addEventListener('keydown', this._keydown, false);
    window.addEventListener('keyup', this._keyup, false);

    this.updateMovementVector();
  }

  private keydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'w':
        this.moveState.up = 1;
        break;

      case 'a':
        this.moveState.left = 1;
        break;

      case 's':
        this.moveState.down = 1;
        break;

      case 'd':
        this.moveState.right = 1;
        break;
    }

    this.updateMovementVector();
  }

  private keyup(event: KeyboardEvent): void {
    switch (event.key) {
      case 'w':
        this.moveState.up = 0;
        break;

      case 'a':
        this.moveState.left = 0;
        break;

      case 's':
        this.moveState.down = 0;
        break;

      case 'd':
        this.moveState.right = 0;
        break;
    }

    this.updateMovementVector();
  }

  private mousedown(event: MouseEvent): void {
    switch (event.button) {
      case 0:
        this.mouseState.primary = 1;
        break;

      case 2:
        this.mouseState.secondary = 1;
        break;
    }
  }

  private mouseup(event: MouseEvent): void {
    switch (event.button) {
      case 0:
        this.mouseState.primary = 0;
        break;

      case 2:
        this.mouseState.secondary = 0;
        break;
    }
  }

  update(delta: number): void {
    const movementSpeed = 5;
    const moveMultiplier = delta * movementSpeed;

    this.player.position.x += this.moveVector.x * moveMultiplier;
    this.player.position.y += this.moveVector.y * moveMultiplier;

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
  }

  dispose(): void {
    this.domElement.removeEventListener('mousedown', this._mousedown, false);
    this.domElement.removeEventListener('mouseup', this._mouseup, false);
    window.removeEventListener('keydown', this._keydown, false);
    window.removeEventListener('keyup', this._keyup, false);
  }
}
