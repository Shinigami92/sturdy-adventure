import * as THREE from 'three';

import type { Weapon } from '@/entities/weapon';

export interface PlayerOptions {
  /**
   * @default 5
   */
  movementSpeed?: number;

  /**
   *
   */
  weapon: Weapon;
}

export class Player extends THREE.Mesh {
  public readonly isPlayer = true;

  public movementSpeed: number;

  public weapon: Weapon;

  public constructor(options: PlayerOptions) {
    const color = new THREE.Color(0xff0000);
    color.convertSRGBToLinear();
    super(
      new THREE.PlaneGeometry(1, 2),
      new THREE.MeshBasicMaterial({ color }),
    );

    const { movementSpeed = 5, weapon } = options;
    this.movementSpeed = movementSpeed;

    this.weapon = weapon;
    this.add(this.weapon);
  }
}

export function isPlayer(value: any): value is Player {
  return value?.isPlayer === true;
}