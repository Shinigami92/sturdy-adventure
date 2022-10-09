import * as THREE from 'three';

import { Miner } from '@/entities/minerals/miner';
import type { Mineral } from '@/entities/minerals/mineral';
import { isMineral } from '@/entities/minerals/mineral';
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

  /**
   * The player's initial amount of miners.
   *
   * @default 2
   */
  maxMiners?: number;
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

  /**
   * The player's max miners.
   */
  public maxMiners: number;

  /**
   * The player's current amount of miners.
   */
  public miners: number;

  public constructor(options: PlayerOptions) {
    const color = new THREE.Color(0xff0000);
    color.convertSRGBToLinear();
    super(
      new THREE.PlaneGeometry(1, 2),
      new THREE.MeshBasicMaterial({ color }),
    );

    const { movementSpeed = 5, weapon, maxHealth = 3, maxMiners = 2 } = options;
    this.movementSpeed = movementSpeed;

    this.maxHealth = maxHealth;
    this.health = maxHealth;

    this.maxMiners = maxMiners;
    this.miners = maxMiners;

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

  public placeMiner(scene: THREE.Scene): boolean {
    if (this.miners <= 0) {
      return false;
    }

    // Find the closest mineral to the player that has not miner placed on it.
    const minerals = scene.children
      .filter(isMineral)
      .filter((mineral) => !mineral.placedMiner);

    let closestMineral: Mineral | undefined;
    let closestDistance: number = Number.POSITIVE_INFINITY;

    for (const mineral of minerals) {
      const distance = this.position.distanceTo(mineral.position);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestMineral = mineral;
      }
    }

    if (!closestMineral) {
      console.warn('No minerals found in scene');
      return false;
    }

    if (closestDistance > 2) {
      console.debug('No minerals close enough to player');
      return false;
    }

    this.miners -= 1;

    // TODO @Shinigami92 2022-10-09: Maybe the miner could be placed via an event?
    const miner = new Miner({ placedOn: closestMineral });
    closestMineral.placedMiner = miner;
    miner.position.copy(closestMineral.position);
    scene.add(miner);

    console.log('Placed miner on mineral', closestMineral.position);

    return true;
  }

  public reset(): void {
    this.position.set(0, 0, 0);
    this.health = this.maxHealth;
    this.miners = this.maxMiners;

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
