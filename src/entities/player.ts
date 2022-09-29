import * as THREE from 'three';

import { Revolver } from '@/entities/weapons/revolver';
import type { Weapon } from '@/entities/weapons/weapon';
import type { Resettable } from '@/utilities/resettable';

export interface PlayerOptions {
  /**
   * @default 5
   */
  movementSpeed?: number;

  /**
   *
   */
  weapon: Weapon;

  /**
   * @default 3
   */
  maxHealth?: number;
}

export class Player extends THREE.Mesh implements Resettable {
  public readonly isResettable = true;
  public readonly isPlayer = true;

  public movementSpeed: number;

  #weapon!: Weapon;

  public maxHealth: number;

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

  public get weapon(): Weapon {
    return this.#weapon;
  }

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

export function isPlayer(value: any): value is Player {
  return value?.isPlayer === true;
}
