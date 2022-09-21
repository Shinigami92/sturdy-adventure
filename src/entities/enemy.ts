import * as THREE from 'three';

import type { Updatable } from '@/entities/updatable';

export class Enemy extends THREE.Mesh implements Updatable {
  public readonly isUpdatable = true;
  public readonly isEnemy = true;

  public health: number;

  public movementSpeed = 4;
  public target = new THREE.Vector3();

  public constructor({ health = 1 }: { health: number } = { health: 1 }) {
    const color = new THREE.Color(0xffff00);
    color.convertSRGBToLinear();
    super(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color }),
    );

    this.health = health;
  }

  public update(delta: number): void {
    if (this.health <= 0) {
      this.parent?.remove(this);
      return;
    }

    // Move towards the target
    const direction = this.target.clone().sub(this.position);
    const distance = direction.length();
    const moveDistance = delta * this.movementSpeed;
    this.translateX((moveDistance * direction.x) / distance);
    this.translateY((moveDistance * direction.y) / distance);
  }
}

export function isEnemy(value: any): value is Enemy {
  return value?.isEnemy === true;
}
