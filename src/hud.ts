import * as THREE from 'three';

import type { Player } from '@/entities/player';
import type { Score } from '@/score';
import type { PlayerControls } from '@/utilities/controls';
import type { Updatable } from '@/utilities/updatable';

export interface HudOptions {
  readonly player: Readonly<Player>;
  readonly controls: Readonly<PlayerControls>;
  /** @deprecated */
  readonly score: Readonly<Score>;
}

export class Hud extends THREE.Mesh implements Updatable {
  public readonly isUpdatable = true;

  private readonly canvas: HTMLCanvasElement;

  private bitmap: CanvasRenderingContext2D | undefined;

  private texture: THREE.CanvasTexture | undefined;

  private readonly playerRef: Readonly<Player>;

  private readonly controlsRef: Readonly<PlayerControls>;

  /** @deprecated */
  private readonly scoreRef: Readonly<Score>;

  public readonly camera: THREE.OrthographicCamera;

  public constructor({ player, controls, score }: HudOptions) {
    super();

    this.playerRef = player;
    this.controlsRef = controls;
    this.scoreRef = score;

    this.camera = new THREE.OrthographicCamera(
      -window.innerWidth / 2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      -window.innerHeight / 2,
      0,
      1,
    );

    this.canvas = document.createElement('canvas');

    this.resize();
  }

  public resize(): void {
    this.camera.left = -window.innerWidth / 2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = -window.innerHeight / 2;
    this.camera.updateProjectionMatrix();

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    const bitmap = this.canvas.getContext('2d');
    if (!bitmap) {
      throw new Error('Could not create HUD bitmap');
    }
    this.bitmap = bitmap;

    this.texture?.dispose();
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.needsUpdate = true;

    if (Array.isArray(this.material)) {
      this.material.forEach((material) => material.dispose());
    } else {
      this.material?.dispose();
    }
    this.material = new THREE.MeshBasicMaterial({ map: this.texture });
    this.material.transparent = true;

    if (Array.isArray(this.geometry)) {
      this.geometry.forEach((geometry) => geometry.dispose());
    } else {
      this.geometry?.dispose();
    }
    this.geometry = new THREE.PlaneGeometry(
      window.innerWidth,
      window.innerHeight,
    );
  }

  public update(delta: number): void {
    if (!this.bitmap || !this.texture) {
      return;
    }

    this.bitmap.clearRect(0, 0, window.innerWidth, window.innerHeight);

    this.bitmap.font = 'Normal 40px Arial';
    this.bitmap.fillStyle = 'rgba(245, 245, 245, 0.75)';

    this.bitmap.textAlign = 'left';

    if (this.controlsRef.gameState.pause > 0) {
      this.bitmap.textAlign = 'center';

      this.bitmap.fillStyle = 'rgba(0, 0, 0, 0.75)';
      this.bitmap.fillRect(0, 0, window.innerWidth, window.innerHeight);

      this.bitmap.fillStyle = 'rgba(245, 245, 245, 0.75)';
      this.bitmap.fillText(
        'PAUSED',
        window.innerWidth / 2,
        window.innerHeight / 2 + 15,
      );
    } else {
      // Ammo
      this.bitmap.fillText(
        `Ammo: ${this.playerRef.weapon.ammunition
          .toString()
          .padStart(3, '0')}/${this.playerRef.weapon.maxAmmunition
          .toString()
          .padStart(3, '0')}`,
        30,
        window.innerHeight - 30,
      );

      // Reload-Indicator
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

      // Health
      this.bitmap.fillText(
        `Health: ${this.playerRef.health
          .toString()
          .padStart(3, '0')}/${this.playerRef.maxHealth
          .toString()
          .padStart(3, '0')}`,
        30,
        window.innerHeight - 90,
      );

      this.bitmap.textAlign = 'right';

      // Score
      this.bitmap.fillText(
        `Score: ${this.scoreRef.score.toString().padStart(6, '0')}`,
        window.innerWidth - 30,
        window.innerHeight - 90,
      );

      // Highscore
      this.bitmap.fillText(
        `Highscore: ${this.scoreRef.highScore.toString().padStart(6, '0')}`,
        window.innerWidth - 30,
        window.innerHeight - 30,
      );
    }

    this.texture.needsUpdate = true;
  }
}
