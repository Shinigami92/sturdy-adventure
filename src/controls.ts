import * as THREE from 'three';

import type { Player } from '@/entities/player';

export class PlayerControls extends THREE.EventDispatcher {
  readonly moveState = {
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  };

  readonly moveVector = new THREE.Vector3(0, 0, 0);

  private readonly _keydown = this.keydown.bind(this);
  private readonly _keyup = this.keyup.bind(this);

  constructor(
    private readonly camera: THREE.Camera,
    private readonly domElement: HTMLCanvasElement,
    private readonly player: Player,
  ) {
    super();

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
  }

  private updateMovementVector(): void {
    this.moveVector.x = -this.moveState.left + this.moveState.right;
    this.moveVector.y = -this.moveState.down + this.moveState.up;
  }

  dispose(): void {
    window.removeEventListener('keydown', this._keydown, false);
    window.removeEventListener('keyup', this._keyup, false);
  }
}
