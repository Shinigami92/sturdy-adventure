import * as THREE from 'three';

import type { Disposable } from '@/utilities/disposable';
import type { Updatable } from '@/utilities/updatable';

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

  /**
   * @default 1
   */
  maxHits?: number;
}

export class Bullet extends THREE.Mesh implements Updatable, Disposable {
  public readonly isUpdatable = true;
  public readonly isDisposable = true;
  public readonly isBullet = true;

  public markForDisposal = false;

  public speed: number;

  public lifetime: number;

  public damage: number;

  public maxHits: number;

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

export function isBullet(value: any): value is Bullet {
  return value?.isBullet === true;
}
