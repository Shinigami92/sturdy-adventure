import * as THREE from 'three';

import type { Disposable } from '@/utilities/disposable';
import type { Updatable } from '@/utilities/updatable';

export interface MinerOptions {
  /**
   * The miner's mining speed.
   *
   * Measured in how long to wait between mining the next mineral in milliseconds.
   *
   * @default 3000
   */
  miningSpeed?: number;

  /**
   * The miner's capacity.
   *
   * Measured in how many minerals the miner can carry at once.
   *
   * @default 20
   */
  maxAmount?: number;

  /**
   * The miner's current amount.
   *
   * @default 0
   */
  amount?: number;
}

/**
 * A miner is an entity that will mine minerals.
 */
export class Miner extends THREE.Mesh implements Updatable, Disposable {
  public readonly isUpdatable = true;
  public readonly isDisposable = true;
  /**
   * Always `true`.
   *
   * This is used to check if an object implements {@link Miner}.
   *
   * @see {@link isMiner}
   */
  public readonly isMiner = true;

  public markForDisposal = false;

  /**
   * The cooldown timer for mining.
   *
   * Measured in milliseconds.
   */
  public miningTimer = 0;

  /**
   * The miner's mining speed.
   *
   * Measured in how long to wait between mining the next mineral in milliseconds.
   */
  public miningSpeed: number;

  /**
   * The miner's capacity.
   *
   * Measured in how many minerals the miner can carry at once.
   */
  public maxAmount: number;

  /**
   * The miner's current amount.
   */
  public amount: number;

  public constructor(options: MinerOptions = {}) {
    const color = new THREE.Color(0x00fff0);
    color.convertSRGBToLinear();
    super(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color }),
    );

    const { miningSpeed = 3000, maxAmount = 20, amount = 0 } = options;
    this.miningSpeed = miningSpeed;
    this.maxAmount = maxAmount;
    this.amount = amount;
  }

  public update(delta: number): void {
    this.miningTimer += delta;

    if (this.miningTimer >= this.miningSpeed) {
      this.miningTimer = 0;
      this.amount += 1;
    }
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
 * Check if an object implements {@link Miner}.
 *
 * @param value The object to check.
 * @returns `true` if the object implements {@link Miner}, `false` otherwise.
 */
export function isMiner(value: any): value is Miner {
  return value?.isMiner === true;
}
