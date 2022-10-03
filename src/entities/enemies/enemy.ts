import * as THREE from 'three';

import type { Disposable } from '@/utilities/disposable';
import type { Updatable } from '@/utilities/updatable';

export interface EnemyOptions {
  /**
   * The enemy's initial health.
   *
   * @default 1
   */
  health?: number;

  /**
   * The enemy's initial movement speed.
   *
   * Measured in units per second.
   *
   * @default 4
   */
  movementSpeed?: number;

  /**
   * The enemy's initial damage dealt by hitting the player.
   *
   * @default 1
   */
  damage?: number;
}

export class Enemy extends THREE.Mesh implements Updatable, Disposable {
  public readonly isUpdatable = true;
  public readonly isDisposable = true;

  /**
   * Always `true`.
   *
   * This is used to check if an object implements {@link Enemy}.
   *
   * @see {@link isEnemy}
   */
  public readonly isEnemy = true;

  public markForDisposal = false;

  /**
   * The enemy's current target to move to.
   */
  public target = new THREE.Vector3();

  /**
   * The enemy's current health.
   */
  public health: number;

  /**
   * The enemy's movement speed.
   */
  public movementSpeed: number;

  /**
   * The enemy's damage dealt by hitting the player.
   */
  public damage: number;

  public constructor(options: EnemyOptions = {}) {
    const color = new THREE.Color(0xffff00);
    color.convertSRGBToLinear();
    super(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color }),
    );

    const { health = 1, movementSpeed = 4, damage = 1 } = options;
    this.health = health;
    this.movementSpeed = movementSpeed;
    this.damage = damage;
  }

  public update(delta: number): void {
    if (this.health <= 0) {
      this.markForDisposal = true;
      return;
    }

    // Move towards the target
    const direction = this.target.clone().sub(this.position);
    const distance = direction.length();
    const moveDistance = delta * this.movementSpeed;
    this.translateX((moveDistance * direction.x) / distance);
    this.translateY((moveDistance * direction.y) / distance);
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
 * Check if an object implements {@link Enemy}.
 *
 * @param value The object to check.
 * @returns `true` if the object implements {@link Enemy}, `false` otherwise.
 */
export function isEnemy(value: any): value is Enemy {
  return value?.isEnemy === true;
}
