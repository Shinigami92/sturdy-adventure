import * as THREE from 'three';

import type { Disposable } from '@/utilities/disposable';
import type { Updatable } from '@/utilities/updatable';

export interface BulletOptions {
  /**
   * The bullet's speed.
   *
   * Measured in units per second.
   *
   * @default 15
   */
  speed?: number;

  /**
   * The bullet's lifetime.
   *
   * Measured in seconds.
   *
   * @default 1
   */
  lifetime?: number;

  /**
   * The bullet's damage dealt by hitting an enemy.
   *
   * @default 1
   */
  damage?: number;

  /**
   * How many times the bullet can pierce through enemies.
   *
   * @default 1
   */
  maxHits?: number;
}

/**
 * The bullet entity.
 */
export class Bullet extends THREE.Mesh implements Updatable, Disposable {
  public readonly isUpdatable = true;
  public readonly isDisposable = true;

  /**
   * Always `true`.
   *
   * This is used to check if an object implements {@link Bullet}.
   *
   * @see {@link isBullet}
   */
  public readonly isBullet = true;

  public markForDisposal = false;

  /**
   * The bullet's speed.
   *
   * Measured in units per second.
   */
  public speed: number;

  /**
   * The bullet's lifetime.
   *
   * Measured in seconds.
   */
  public lifetime: number;

  /**
   * The bullet's damage dealt by hitting an enemy.
   */
  public damage: number;

  /**
   * How many times the bullet can pierce through enemies.
   */
  public maxHits: number;

  /**
   * The number of times the bullet has hit an enemy.
   */
  public hits: number;

  public constructor(options: BulletOptions = {}) {
    const color = new THREE.Color(0xff6ec7);
    color.convertSRGBToLinear();
    super(
      new THREE.SphereGeometry(0.2, 8, 8),
      new THREE.MeshBasicMaterial({ color }),
    );

    const { speed = 15, lifetime = 1, damage = 1, maxHits = 1 } = options;
    this.speed = speed;
    this.lifetime = lifetime;
    this.damage = damage;
    this.maxHits = maxHits;
    this.hits = 0;
  }

  public update(delta: number): void {
    this.lifetime -= delta;
    if (this.lifetime <= 0) {
      this.markForDisposal = true;
      return;
    }

    if (this.hits === this.maxHits) {
      this.markForDisposal = true;
      return;
    }

    this.translateZ(delta * this.speed);
  }

  public dispose(): void {
    this.geometry.dispose();

    if (Array.isArray(this.material)) {
      this.material.forEach((material) => material.dispose());
    } else {
      this.material.dispose();
    }

    this.parent?.remove(this);
  }
}

/**
 * Checks if an object implements {@link Bullet}.
 *
 * @param value The value to check.
 * @returns `true` if the value implements {@link Bullet}, `false` otherwise.
 */
export function isBullet(value: any): value is Bullet {
  return value?.isBullet === true;
}
