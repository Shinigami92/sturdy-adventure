import * as THREE from 'three';

/**
 * Check if two objects are colliding.
 *
 * @param mesh1 The first object.
 * @param mesh2 The second object.
 * @returns `true` if the objects are colliding, `false` otherwise.
 */
export function collision(mesh1: THREE.Mesh, mesh2: THREE.Mesh): boolean {
  const box1 = new THREE.Box3().setFromObject(mesh1);
  const box2 = new THREE.Box3().setFromObject(mesh2);
  return box1.intersectsBox(box2);
}
