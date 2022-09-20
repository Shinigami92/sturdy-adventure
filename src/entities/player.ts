import * as THREE from 'three';

import type { Weapon } from '@/entities/weapon';

export class Player extends THREE.Mesh {
  public movementSpeed = 5;

  public weapon: Weapon;

  public constructor({ weapon }: { weapon: Weapon }) {
    super(
      new THREE.PlaneGeometry(1, 2),
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    );

    this.weapon = weapon;
  }
}
