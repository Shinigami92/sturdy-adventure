import * as THREE from 'three';

import type { Disposable } from '@/entities/disposable';
import type { Updatable } from '@/entities/updatable';

export interface EnemyOptions {
  /**
   * @default 1
   */
  health?: number;

  /**
   * @default 4
   */
  movementSpeed?: number;
}

export class Enemy extends THREE.Mesh implements Updatable, Disposable {
  public readonly isUpdatable = true;
  public readonly isDisposable = true;
  public readonly isEnemy = true;

  public markForDisposal = false;

  public target = new THREE.Vector3();

  public health: number;

  public movementSpeed: number;

  public constructor(options: EnemyOptions = {}) {
    const color = new THREE.Color(0xffff00);
    color.convertSRGBToLinear();
    super(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color }),
    );

    const { health = 1, movementSpeed = 4 } = options;
    this.health = health;
    this.movementSpeed = movementSpeed;
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

export function isEnemy(value: any): value is Enemy {
  return value?.isEnemy === true;
}
