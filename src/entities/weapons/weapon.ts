import * as THREE from 'three';

import type { Disposable } from '@/utilities/disposable';
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

export abstract class Weapon
  extends THREE.Mesh
  implements Updatable, Disposable
{
  public readonly isUpdatable = true;
  public readonly isDisposable = true;
  public readonly isWeapon = true;

  public markForDisposal = false;

  public shootTimer = 0;

  public shootSpeed: number;

  public maxAmmunition: number;

  public ammunition: number;

  public reloadTimer = Number.POSITIVE_INFINITY;

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

  public reload(): void {
    if (this.ammunition === this.maxAmmunition) {
      return;
    }

    this.reloadTimer = this.reloadSpeed;
  }

  public update(delta: number): void {
    this.shootTimer = Math.max(0, this.shootTimer - delta);
    this.reloadTimer = Math.max(0, this.reloadTimer - delta);

    if (this.reloadTimer === 0) {
      this.ammunition = this.maxAmmunition;
      this.reloadTimer = Number.POSITIVE_INFINITY;
    }
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

export function isWeapon(value: any): value is Weapon {
  return value?.isWeapon === true;
}
