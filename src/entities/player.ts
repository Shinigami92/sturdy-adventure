import * as THREE from 'three';

import { isMiner, Miner } from '@/entities/minerals/miner';
import type { Mineral } from '@/entities/minerals/mineral';
import { isMineral } from '@/entities/minerals/mineral';
import { Revolver } from '@/entities/weapons/revolver';
import type { Weapon } from '@/entities/weapons/weapon';
import type { Resettable } from '@/utilities/resettable';
import type { Updatable } from '@/utilities/updatable';

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

  /**
   * The player's initial mineral collect speed.
   *
   * Measured in how long to wait between collecting minerals in seconds.
   *
   * @default 0.5
   */
  mineralCollectSpeed?: number;

  /**
   * The player's initial mineral collect rate.
   *
   * Measured in how many minerals to collect per collect.
   *
   * @default 1
   */
  mineralCollectRate?: number;
}

/**
 * The player entity.
 *
 * Controlled by the user with keyboard and mouse inputs.
 */
export class Player extends THREE.Mesh implements Updatable, Resettable {
  public readonly isUpdatable = true;
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

  /**
   * The player's current minerals amount.
   */
  public amountOfMinerals = 0;

  /**
   * The cooldown timer for collect minerals.
   *
   * Measured in seconds.
   */
  public mineralCollectTimer = 0;

  /**
   * The player's current minerals collection speed.
   *
   * Measures in collect per second.
   */
  public mineralCollectSpeed: number;

  /**
   * The player's current minerals collection rate.
   *
   * Measures in how many minerals the player collects per {@link Player.mineralCollectSpeed}.
   */
  public mineralCollectRate: number;

  public constructor(options: PlayerOptions) {
    const color = new THREE.Color(0xff0000);
    color.convertSRGBToLinear();
    super(
      new THREE.PlaneGeometry(1, 2),
      new THREE.MeshBasicMaterial({ color }),
    );

    const {
      movementSpeed = 5,
      weapon,
      maxHealth = 3,
      maxMiners = 2,
      mineralCollectSpeed = 0.5,
      mineralCollectRate = 1,
    } = options;
    this.movementSpeed = movementSpeed;

    this.maxHealth = maxHealth;
    this.health = maxHealth;

    this.maxMiners = maxMiners;
    this.miners = maxMiners;

    this.mineralCollectSpeed = mineralCollectSpeed;
    this.mineralCollectRate = mineralCollectRate;

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
      // No minerals found in scene
      return false;
    }

    if (closestDistance > 2) {
      // No minerals close enough to player
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

  public update(delta: number): void {
    this.mineralCollectTimer = Math.max(0, this.mineralCollectTimer - delta);

    if (this.mineralCollectTimer === 0) {
      // Find the closest mineral to the player that has a miner placed on it.
      const miners = this.parent?.children.filter(isMiner) ?? [];
      let closestMiner: Miner | undefined;
      let closestDistance: number = Number.POSITIVE_INFINITY;

      for (const miner of miners) {
        const distance = this.position.distanceTo(miner.position);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestMiner = miner;
        }
      }

      if (!closestMiner) {
        // No miners found in scene
        return;
      }

      if (closestDistance > 5) {
        // No miners close enough to player
        return;
      }

      const amount = closestMiner.collect(this.mineralCollectRate);

      console.log(
        'Collected',
        amount,
        'minerals from miner',
        closestMiner.position,
      );

      this.amountOfMinerals += amount;
      this.mineralCollectTimer = this.mineralCollectSpeed;
    }
  }

  public reset(): void {
    this.position.set(0, 0, 0);
    this.health = this.maxHealth;
    this.miners = this.maxMiners;

    this.amountOfMinerals = 0;
    this.mineralCollectTimer = 0;

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
