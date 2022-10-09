import * as THREE from 'three';

import type { Disposable } from '@/utilities/disposable';

/**
 * A mineral is a resource that can be mined by a miner.
 */
export class Mineral extends THREE.Mesh implements Disposable {
  public readonly isDisposable = true;
  /**
   * Always `true`.
   *
   * This is used to check if an object implements {@link Mineral}.
   *
   * @see {@link isMineral}
   */
  public readonly isMineral = true;

  public markForDisposal = false;

  public constructor() {
    const color = new THREE.Color(0x00ff00);
    color.convertSRGBToLinear();
    super(
      new THREE.PlaneGeometry(0.8, 0.8),
      new THREE.MeshBasicMaterial({ color }),
    );
  }

  public dispose(): void {
    this.geometry.dispose();

    if (Array.isArray(this.material)) {
      this.material.forEach((material) => material.dispose());
    } else {
      this.material.dispose();
    }

    this.parent?.remove(this);
  }
}

/**
 * Check if an object implements {@link Mineral}.
 *
 * @param value The object to check.
 * @returns `true` if the object implements {@link Mineral}, `false` otherwise.
 */
export function isMineral(value: any): value is Mineral {
  return value?.isMineral === true;
}
