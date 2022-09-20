import * as THREE from 'three';

export class Bullet extends THREE.Mesh {
  constructor() {
    super(
      new THREE.SphereGeometry(0.2, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x7f00ff }),
    );
  }
}
