import * as THREE from 'three';

export const BULLETS: Bullet[] = [];

export class Bullet extends THREE.Mesh {
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
      BULLETS.splice(BULLETS.indexOf(this), 1);
      return;
    }

    this.translateZ(delta * this.speed);
  }
}
