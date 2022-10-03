import * as THREE from 'three';
import { describe, expect, it, vi } from 'vitest';
import { Weapon } from './weapon';

describe('entities:weapons', () => {
  const DELTA_TICK = 1 / 60;

  class WeaponImpl extends Weapon {
    public constructor() {
      super({ ammunition: 6, reloadSpeed: 2, shootSpeed: 1 });
    }

    public shoot(
      scene: THREE.Scene,
      shootFrom: THREE.Vector3,
      shootAt: THREE.Vector3,
    ): void {
      if (!this.isReloading && this.shootTimer === 0) {
        this.shootTimer = this.shootSpeed;

        this.ammunition -= 1;

        if (this.ammunition === 0) {
          this.reload();
        }
      }
    }
  }

  it('should not reload if ammo is full', () => {
    const weapon = new WeaponImpl();

    const reloadTriggered = weapon.reload();

    expect(reloadTriggered).toBe(false);
    expect(weapon.isReloading).toBe(false);
  });

  it('should decrease ammo on shoot', () => {
    const scene = new THREE.Scene();

    const weapon = new WeaponImpl();

    const shootFrom = new THREE.Vector3(0, 0, 0);
    const shootAt = new THREE.Vector3(1, 0, 0);

    expect(weapon.ammunition).toBe(6);

    weapon.shoot(scene, shootFrom, shootAt);

    expect(weapon.ammunition).toBe(5);
  });

  it('should reload if ammo depletes', () => {
    const scene = new THREE.Scene();

    const weapon = new WeaponImpl();

    const shootFrom = new THREE.Vector3(0, 0, 0);
    const shootAt = new THREE.Vector3(1, 0, 0);

    for (let i = 0; i < weapon.maxAmmunition - 1; i++) {
      weapon.shoot(scene, shootFrom, shootAt);
      weapon.update(weapon.shootSpeed + DELTA_TICK);
      expect(weapon.isReloading).toBe(false);
    }

    weapon.shoot(scene, shootFrom, shootAt);
    weapon.update(DELTA_TICK);
    expect(weapon.isReloading).toBe(true);
  });

  it('should dispatch a reloaded event', () => {
    const scene = new THREE.Scene();

    const weapon = new WeaponImpl();

    const spyWeaponDispatchEvent = vi.spyOn(weapon, 'dispatchEvent');

    const shootFrom = new THREE.Vector3(0, 0, 0);
    const shootAt = new THREE.Vector3(1, 0, 0);

    for (let i = 0; i < weapon.maxAmmunition; i++) {
      weapon.shoot(scene, shootFrom, shootAt);
      weapon.update(weapon.shootSpeed + DELTA_TICK);
    }

    expect(weapon.isReloading).toBe(true);

    weapon.update(weapon.reloadSpeed + DELTA_TICK);

    expect(spyWeaponDispatchEvent).toHaveBeenCalledWith({ type: 'reloaded' });
  });
});
