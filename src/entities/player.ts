import * as THREE from 'three';

export class Player extends THREE.Mesh {
  movementSpeed = 5;

  // TODO @Shinigami92 2022-09-20: These values will be moved to weapon
  shootSpeed = 1;
  shootTimer = 0;

  constructor() {
    super(
      new THREE.PlaneGeometry(1, 2),
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    );
  }
}
