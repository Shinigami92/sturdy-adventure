import * as THREE from 'three';

import type { Updatable } from '@/entities/updatable';

export class Bullet extends THREE.Mesh implements Updatable {
  public readonly isBullet = true;

  public speed = 15;
  public livetime = 1;

  public constructor() {
    super(
      new THREE.SphereGeometry(0.2, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x7f00ff }),
    );
  }

  public update(delta: number): void {
    this.livetime -= delta;
    if (this.livetime <= 0) {
      this.parent?.remove(this);
      return;
    }

    this.translateZ(delta * this.speed);
  }
}

export function isBullet(value: any): value is Bullet {
  return value?.isBullet === true;
}
