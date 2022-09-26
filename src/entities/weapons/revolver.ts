import type * as THREE from 'three';

import { Bullet } from '@/entities/bullets/bullet';
import { Weapon } from '@/entities/weapons/weapon';

export class Revolver extends Weapon {
  public readonly isRevolver = true;

  public constructor() {
    super({ shootSpeed: 1, ammunition: 6, reloadSpeed: 2 });
  }

  public shoot(
    scene: THREE.Scene,
    shootFrom: THREE.Vector3,
    shootAt: THREE.Vector3,
  ): void {
    if (this.reloadTimer === 0 && this.shootTimer === 0) {
      this.shootTimer = this.shootSpeed;

      // TODO @Shinigami92 2022-09-19: Spawn the bullet via a helper
      const bullet = new Bullet({
        speed: 15,
        lifetime: 1,
        damage: 1,
        maxHits: 1,
      });
      scene.add(bullet);

      bullet.position.copy(shootFrom);

      bullet.lookAt(shootAt.x, shootAt.y, 0);

      this.ammunition -= 1;

      if (this.ammunition === 0) {
        this.reloadTimer = this.reloadSpeed;
      }
    }
  }
}

export function isRevolver(value: any): value is Revolver {
  return value?.isRevolver === true;
}
