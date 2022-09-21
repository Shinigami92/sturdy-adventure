import * as THREE from 'three';

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

export class Enemy extends THREE.Mesh implements Updatable {
  public readonly isUpdatable = true;
  public readonly isEnemy = true;

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
      this.parent?.remove(this);
      return;
    }

    // Move towards the target
    const direction = this.target.clone().sub(this.position);
    const distance = direction.length();
    const moveDistance = delta * this.movementSpeed;
    this.translateX((moveDistance * direction.x) / distance);
    this.translateY((moveDistance * direction.y) / distance);
  }
}

export function isEnemy(value: any): value is Enemy {
  return value?.isEnemy === true;
}