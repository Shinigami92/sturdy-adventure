import { Bullet, BULLETS } from '@/entities/bullet';

export abstract class Weapon {
  public shootTimer = 0;

  public constructor(public shootSpeed = 1) {}

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

export class Revolver extends Weapon {
  public constructor() {
    super(1);
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

      BULLETS.push(bullet);

      bullet.position.copy(shootFrom);

      bullet.lookAt(shootAt.x, shootAt.y, 0);
    }
  }
}
