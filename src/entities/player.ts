import * as THREE from 'three';

import type { Weapon } from '@/entities/weapon';

export class Player extends THREE.Mesh {
  public readonly isPlayer = true;

  public movementSpeed = 5;

  public weapon: Weapon;

  public constructor({ weapon }: { weapon: Weapon }) {
    const color = new THREE.Color(0xff0000);
    color.convertSRGBToLinear();
    super(
      new THREE.PlaneGeometry(1, 2),
      new THREE.MeshBasicMaterial({ color }),
    );

    this.weapon = weapon;
    this.add(this.weapon);
  }
}

export function isPlayer(value: any): value is Player {
  return value?.isPlayer === true;
}
