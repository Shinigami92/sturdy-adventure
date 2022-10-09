import type * as THREE from 'three';

import { Enemy } from '@/entities/enemies/enemy';
import { isPlayer } from '@/entities/player';
import type { Disposable } from '@/utilities/disposable';
import type { Resettable } from '@/utilities/resettable';
import type { Updatable } from '@/utilities/updatable';

export class EnemyManager implements Updatable, Resettable, Disposable {
  public readonly isUpdatable = true;
  public readonly isResettable = true;
  public readonly isDisposable = true;

  public markForDisposal = false;

  /**
   * Collection of current enemies.
   */
  public enemies: Enemy[] = [];

  /**
   * The cooldown timer for spawning enemies.
   *
   * Measured in seconds.
   */
  public spawnTimer = 0;

  /**
   * The speed at which enemies spawn.
   *
   * Measured in how long to wait between spawns in seconds.
   */
  public spawnSpeed = 1.2;

  public constructor(private readonly scene: THREE.Scene) {}

  public spawn(): boolean {
    const player = this.scene.children.find(isPlayer);

    if (!player) {
      console.warn('No player found');
      return false;
    }

    const enemy = new Enemy({
      manager: this,
      movementSpeed: 4,
    });

    const angle = Math.random() * Math.PI * 2;
    const distance = 20;
    enemy.position.set(
      player.position.x + Math.sin(angle) * distance,
      player.position.y + Math.cos(angle) * distance,
      0,
    );

    this.enemies.push(enemy);
    this.scene.add(enemy);

    return true;
  }

  public despawn(enemy: Enemy): boolean {
    const index = this.enemies.indexOf(enemy);

    if (index === -1) {
      return false;
    }

    this.enemies.splice(index, 1);
    enemy.markForDisposal = true;

    return true;
  }

  public update(delta: number): void {
    this.spawnTimer = Math.max(0, this.spawnTimer - delta);

    if (this.spawnTimer === 0) {
      this.spawnTimer = this.spawnSpeed;
      this.spawn();
    }
  }

  public reset(): void {
    for (const enemy of this.enemies) {
      enemy.markForDisposal = true;
    }
    this.enemies = [];

    this.spawnTimer = 0;
    this.spawnSpeed = 1.2;
  }

  public dispose(): void {
    for (const enemy of this.enemies) {
      enemy.markForDisposal = true;
    }
  }
}
