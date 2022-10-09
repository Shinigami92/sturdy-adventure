import * as THREE from 'three';

import type { Disposable } from '@/utilities/disposable';
import type { Updatable } from '@/utilities/updatable';

export interface WeaponOptions {
  /**
   * The weapon's shoot speed.
   *
   * Measured in how long to wait between shots in seconds.
   */
  shootSpeed: number;

  /**
   * The weapon's ammo capacity.
   */
  ammunition: number;

  /**
   * The weapon's reload speed.
   *
   * Measured in how long to wait between reloads in seconds.
   */
  reloadSpeed: number;
}

/**
 * The weapon entity.
 */
export abstract class Weapon
  extends THREE.Mesh
  implements Updatable, Disposable
{
  public readonly isUpdatable = true;
  public readonly isDisposable = true;

  /**
   * Always `true`.
   *
   * This is used to check if an object implements {@link Weapon}.
   *
   * @see {@link isWeapon}
   */
  public readonly isWeapon = true;

  public markForDisposal = false;

  /**
   * The cooldown timer for shooting.
   *
   * Measured in seconds.
   */
  public shootTimer = 0;

  /**
   * The weapon's shoot speed.
   *
   * Measured in how long to wait between shots in seconds.
   */
  public shootSpeed: number;

  /**
   * The weapon's ammo capacity.
   */
  public maxAmmunition: number;

  /**
   * The weapon's current ammo.
   */
  public ammunition: number;

  /**
   * The cooldown timer for reloading.
   *
   * Measured in seconds.
   *
   * If the weapon is not reloading, this is set to `Number.POSITIVE_INFINITY`.
   *
   * @default `Number.POSITIVE_INFINITY`
   */
  public reloadTimer = Number.POSITIVE_INFINITY;

  /**
   * The weapon's reload speed.
   *
   * Measured in how long to wait between reloads in seconds.
   */
  public reloadSpeed: number;

  public constructor(options: WeaponOptions) {
    super();

    const { shootSpeed, ammunition, reloadSpeed } = options;
    this.shootSpeed = shootSpeed;
    this.maxAmmunition = ammunition;
    this.ammunition = ammunition;
    this.reloadSpeed = reloadSpeed;
  }

  /**
   * Whether the weapon is reloading.
   */
  public get isReloading(): boolean {
    return this.reloadTimer !== Number.POSITIVE_INFINITY;
  }

  /**
   * Shoots the weapon.
   *
   * @param scene The scene to add the bullet to.
   * @param shootFrom The position to shoot the bullet from.
   * @param shootAt The position to shoot the bullet at.
   */
  public abstract shoot(
    scene: THREE.Scene,
    shootFrom: THREE.Vector3,
    shootAt: THREE.Vector3,
  ): void;

  /**
   * Reloads the weapon. If the weapon is already reloading, this does nothing.
   *
   * @returns Whether the weapon was triggering a reload.
   */
  public reload(): boolean {
    if (this.ammunition === this.maxAmmunition) {
      return false;
    }

    if (this.isReloading) {
      return false;
    }

    this.reloadTimer = this.reloadSpeed;

    return true;
  }

  public update(delta: number): void {
    this.shootTimer = Math.max(0, this.shootTimer - delta);
    this.reloadTimer = Math.max(0, this.reloadTimer - delta);

    if (this.reloadTimer === 0) {
      this.ammunition = this.maxAmmunition;
      this.reloadTimer = Number.POSITIVE_INFINITY;

      this.dispatchEvent({ type: 'reloaded' });
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

/**
 * Check if an object implements {@link Weapon}.
 *
 * @param value The object to check.
 * @returns `true` if the object implements {@link Weapon}, `false` otherwise.
 */
export function isWeapon(value: any): value is Weapon {
  return value?.isWeapon === true;
}
