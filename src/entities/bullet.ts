import * as THREE from 'three';

import type { Updatable } from '@/entities/updatable';

export interface BulletOptions {
  /**
   * @default 15
   */
  speed?: number;

  /**
   * @default 1
   */
  lifetime?: number;

  /**
   * @default 1
   */
  damage?: number;
}

export class Bullet extends THREE.Mesh implements Updatable {
  public readonly isUpdatable = true;
  public readonly isBullet = true;

  public speed: number;

  public lifetime: number;

  public damage: number;

  public constructor(options: BulletOptions = {}) {
    const color = new THREE.Color(0xff6ec7);
    color.convertSRGBToLinear();
    super(
      new THREE.SphereGeometry(0.2, 8, 8),
      new THREE.MeshBasicMaterial({ color }),
    );

    const { speed = 15, lifetime = 1, damage = 1 } = options;
    this.speed = speed;
    this.lifetime = lifetime;
    this.damage = damage;
  }

  public update(delta: number): void {
    this.lifetime -= delta;
    if (this.lifetime <= 0) {
      this.parent?.remove(this);
      return;
    }

    this.translateZ(delta * this.speed);
  }
}

export function isBullet(value: any): value is Bullet {
  return value?.isBullet === true;
}
