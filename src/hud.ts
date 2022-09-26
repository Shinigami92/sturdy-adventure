import * as THREE from 'three';

import type { Player } from '@/entities/player';
import type { Updatable } from '@/utilities/updatable';

export interface HudOptions {
  readonly player: Readonly<Player>;
}

export class Hud extends THREE.Mesh implements Updatable {
  public readonly isUpdatable = true;

  private readonly canvas: HTMLCanvasElement;

  private readonly bitmap: CanvasRenderingContext2D;

  private readonly texture: THREE.CanvasTexture;

  private readonly playerRef: Readonly<Player>;

  public readonly camera: THREE.OrthographicCamera;

  constructor({ player }: HudOptions) {
    super();

    this.playerRef = player;

    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.camera = new THREE.OrthographicCamera(
      -window.innerWidth / 2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      -window.innerHeight / 2,
      0,
      1,
    );

    const bitmap = this.canvas.getContext('2d');
    if (!bitmap) {
      throw new Error('Could not create HUD bitmap');
    }
    bitmap.font = 'Normal 40px Arial';
    bitmap.textAlign = 'left';
    bitmap.fillStyle = 'rgba(245, 245, 245, 0.75)';
    bitmap.fillText(
      'Loading...',
      window.innerWidth / 2,
      window.innerHeight / 2,
    );
    this.bitmap = bitmap;

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.needsUpdate = true;

    this.material = new THREE.MeshBasicMaterial({ map: this.texture });
    this.material.transparent = true;

    this.geometry = new THREE.PlaneGeometry(
      window.innerWidth,
      window.innerHeight,
    );
  }

  update(delta: number): void {
    this.bitmap.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.bitmap.fillText(
      `Ammo: ${this.playerRef.weapon.ammunition
        .toString()
        .padStart(3, '0')}/${this.playerRef.weapon.maxAmmunition
        .toString()
        .padStart(3, '0')}`,
      30,
      window.innerHeight - 30,
    );

    const ammoReloadProgress =
      this.playerRef.weapon.reloadTimer / this.playerRef.weapon.reloadSpeed;

    this.bitmap.beginPath();
    this.bitmap.arc(
      334,
      window.innerHeight - 44,
      14,
      270 * (Math.PI / 180),
      Math.PI * 2 * ammoReloadProgress - 90 * (Math.PI / 180),
    );
    this.bitmap.strokeStyle = 'rgba(245, 245, 245, 0.75)';
    this.bitmap.stroke();
    this.bitmap.closePath();

    this.texture.needsUpdate = true;
  }
}
