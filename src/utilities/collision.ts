import * as THREE from 'three';

export function collision(mesh1: THREE.Mesh, mesh2: THREE.Mesh): boolean {
  const box1 = new THREE.Box3().setFromObject(mesh1);
  const box2 = new THREE.Box3().setFromObject(mesh2);
  return box1.intersectsBox(box2);
}
