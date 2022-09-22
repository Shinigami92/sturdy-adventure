import * as THREE from 'three';

import type { Updatable } from '@/utilities/updatable';

export interface WeaponOptions {
  /**
   * @default 1
   */
  shootSpeed?: number;
}

export abstract class Weapon extends THREE.Mesh implements Updatable {
  public readonly isUpdatable = true;
  public readonly isWeapon = true;

  public shootTimer = 0;

  public shootSpeed: number;

  public constructor(options: WeaponOptions = {}) {
    super();

    const { shootSpeed = 1 } = options;
    this.shootSpeed = shootSpeed;
  }

  public abstract shoot(
    scene: THREE.Scene,
    shootFrom: THREE.Vector3,
    shootAt: THREE.Vector3,
  ): void;

  public update(delta: number): void {
    this.shootTimer = Math.max(0, this.shootTimer - delta);
  }
}

export function isWeapon(value: any): value is Weapon {
  return value?.isWeapon === true;
}
