import * as THREE from 'three';

import { Bullet } from '@/entities/bullet';
import type { Updatable } from '@/entities/updatable';

export interface WeaponOptions {
  /**
   * @default 1
   */
  shootSpeed?: number;
}

export abstract class Weapon extends THREE.Mesh implements Updatable {
  public readonly isUpdatable = true;
  public readonly isWeapon = true;

  public shootTimer = 0;

  public shootSpeed: number;

  public constructor(options: WeaponOptions = {}) {
    super();

    const { shootSpeed = 1 } = options;
    this.shootSpeed = shootSpeed;
  }

  public abstract shoot(
    scene: THREE.Scene,
    shootFrom: THREE.Vector3,
    shootAt: THREE.Vector3,
  ): void;

  public update(delta: number): void {
    if (this.shootTimer > 0) {
      this.shootTimer -= delta;
      if (this.shootTimer < 0) {
        this.shootTimer = 0;
      }
    }
  }
}

export function isWeapon(value: any): value is Weapon {
  return value?.isWeapon === true;
}

export class Revolver extends Weapon {
  public readonly isRevolver = true;

  public constructor() {
    super({ shootSpeed: 1 });
  }

  public shoot(
    scene: THREE.Scene,
    shootFrom: THREE.Vector3,
    shootAt: THREE.Vector3,
  ): void {
    if (this.shootTimer === 0) {
      this.shootTimer = this.shootSpeed;

      // TODO @Shinigami92 2022-09-19: Spawn the bullet via a helper
      const bullet = new Bullet();
      scene.add(bullet);

      bullet.position.copy(shootFrom);

      bullet.lookAt(shootAt.x, shootAt.y, 0);
    }
  }
}

export function isRevolver(value: any): value is Revolver {
  return value?.isRevolver === true;
}
