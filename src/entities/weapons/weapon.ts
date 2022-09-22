import * as THREE from 'three';

import type { Updatable } from '@/utilities/updatable';

export interface WeaponOptions {
  /**
   *
   */
  shootSpeed: number;

  /**
   *
   */
  ammunition: number;

  /**
   *
   */
  reloadSpeed: number;
}

export abstract class Weapon extends THREE.Mesh implements Updatable {
  public readonly isUpdatable = true;
  public readonly isWeapon = true;

  public shootTimer = 0;

  public shootSpeed: number;

  public maxAmmunition: number;

  public ammunition: number;

  public reloadTimer = 0;

  public reloadSpeed: number;

  public constructor(options: WeaponOptions) {
    super();

    const { shootSpeed, ammunition, reloadSpeed } = options;
    this.shootSpeed = shootSpeed;
    this.maxAmmunition = ammunition;
    this.ammunition = ammunition;
    this.reloadSpeed = reloadSpeed;
  }

  public abstract shoot(
    scene: THREE.Scene,
    shootFrom: THREE.Vector3,
    shootAt: THREE.Vector3,
  ): void;

  public update(delta: number): void {
    this.shootTimer = Math.max(0, this.shootTimer - delta);
    this.reloadTimer = Math.max(0, this.reloadTimer - delta);

    if (this.reloadTimer === 0 && this.ammunition === 0) {
      this.ammunition = this.maxAmmunition;
    }
  }
}

export function isWeapon(value: any): value is Weapon {
  return value?.isWeapon === true;
}
