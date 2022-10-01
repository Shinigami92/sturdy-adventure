import * as THREE from 'three';

import type { Disposable } from '@/utilities/disposable';

export class Mineral extends THREE.Mesh implements Disposable {
  public readonly isDisposable = true;
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

export function isMineral(value: any): value is Mineral {
  return value?.isMineral === true;
}
