import * as THREE from 'three';

import { Revolver } from '@/entities/weapons/revolver';
import type { Weapon } from '@/entities/weapons/weapon';
import type { Resettable } from '@/utilities/resettable';

export interface PlayerOptions {
  /**
   * The player's default movement speed.
   *
   * Measures in units per second.
   *
   * @default 5
   */
  movementSpeed?: number;

  /**
   * The initial weapon the player should hold.
   */
  weapon: Weapon;

  /**
   * The player's initial health.
   *
   * @default 3
   */
  maxHealth?: number;
}

/**
 * The player entity.
 *
 * Controlled by the user with keyboard and mouse inputs.
 */
export class Player extends THREE.Mesh implements Resettable {
  public readonly isResettable = true;

  /**
   * Always `true`.
   *
   * @see {@link isPlayer}
   */
  public readonly isPlayer = true;

  /**
   * The player's movement speed.
   */
  public movementSpeed: number;

  #weapon!: Weapon;

  /**
   * The player's max health.
   */
  public maxHealth: number;

  /**
   * The player's current health.
   */
  public health: number;

  public constructor(options: PlayerOptions) {
    const color = new THREE.Color(0xff0000);
    color.convertSRGBToLinear();
    super(
      new THREE.PlaneGeometry(1, 2),
      new THREE.MeshBasicMaterial({ color }),
    );

    const { movementSpeed = 5, weapon, maxHealth = 3 } = options;
    this.movementSpeed = movementSpeed;

    this.maxHealth = maxHealth;
    this.health = maxHealth;

    this.weapon = weapon;
  }

  /**
   * The current weapon the player is holding.
   */
  public get weapon(): Weapon {
    return this.#weapon;
  }

  /**
   * Set the current weapon the player should hold.
   *
   * _will automatically dispose the previous weapon the player was holding_
   */
  public set weapon(weapon) {
    this.weapon?.dispose();

    this.#weapon = weapon;
    this.add(weapon);
  }

  public reset(): void {
    this.position.set(0, 0, 0);
    this.health = this.maxHealth;

    this.weapon = new Revolver();
  }
}

/**
 * Check if an object is {@link Player}.
 *
 * @param value The value to check.
 * @returns `true` if the value is {@link Player}, `false` otherwise.
 */
export function isPlayer(value: any): value is Player {
  return value?.isPlayer === true;
}
