import '@/main.css';

import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

import { isBullet } from '@/entities/bullets/bullet';
import { isEnemy } from '@/entities/enemies/enemy';
import { isMineral, Mineral } from '@/entities/minerals/mineral';
import { isPlayer, Player } from '@/entities/player';
import { Revolver } from '@/entities/weapons/revolver';
import { Hud } from '@/hud';
import { EnemyManager } from '@/managers/enemy';
import { Score } from '@/score';
import { collision } from '@/utilities/collision';
import { PlayerControls } from '@/utilities/controls';
import type { Disposable } from '@/utilities/disposable';
import { isDisposable } from '@/utilities/disposable';
import { isUpdatable } from '@/utilities/updatable';

const container = document.getElementById('container');

if (!container) {
  throw new Error('Container not found');
}

// Prevent contextmenu
container.addEventListener('contextmenu', (event) => event.preventDefault());

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.autoClear = false;
container.appendChild(renderer.domElement);

let stats: Stats | undefined;
if (import.meta.env.DEV) {
  stats = Stats();
  document.body.appendChild(stats.dom);
}

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  1,
  50,
);
camera.position.set(0, 0, camera.far);

const backgroundColor = new THREE.Color(0x576d46);
backgroundColor.convertSRGBToLinear();
scene.background = backgroundColor;

const gridAxisColor = new THREE.Color(0xffffff);
gridAxisColor.convertSRGBToLinear();
const gridDivisionColor = new THREE.Color(0x8a9b6b);
gridDivisionColor.convertSRGBToLinear();
const GRID_SIZE = 20000;
const grid = new THREE.GridHelper(
  GRID_SIZE,
  GRID_SIZE / 2,
  gridAxisColor,
  gridDivisionColor,
);
grid.rotation.x = Math.PI / 2;
scene.add(grid);

const player = new Player({ weapon: new Revolver() });
player.position.set(0, 0, 0);
scene.add(player);

const controls = new PlayerControls(camera, renderer.domElement, player, scene);

const crosshairColor = new THREE.Color(0x0000ff);
crosshairColor.convertSRGBToLinear();
const crosshair = new THREE.Mesh(
  new THREE.RingGeometry(0.4, 0.5, 12),
  new THREE.MeshBasicMaterial({ color: crosshairColor }),
);
crosshair.position.set(0, 0, 0);
scene.add(crosshair);

/** @deprecated */
const score = new Score();

const hudScene = new THREE.Scene();
const hud = new Hud({ player, controls, score });
hudScene.add(hud);

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  hud.resize();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

const clock = new THREE.Clock();
let delta = 0;

const enemyManager = new EnemyManager(scene);

function resetGame(): void {
  enemyManager.reset();

  scene.traverse((object) => {
    if (isDisposable(object)) {
      object.markForDisposal = true;
    }
  });

  score.reset();
  player.reset();

  // Spawn minerals
  for (let i = 0; i < 16; i++) {
    const mineral = new Mineral();
    mineral.position.set(
      Math.ceil(Math.random() * 128) * 2 - 128,
      Math.ceil(Math.random() * 128) * 2 - 128,
      0,
    );
    scene.add(mineral);
  }
}

// Initialize game with default state
resetGame();

function animate(): void {
  requestAnimationFrame(animate);

  delta = clock.getDelta();

  // TODO @Shinigami92 2022-09-19: Split animation into render and update function

  // #######################
  // # Update the controls #
  // #######################
  controls.update(delta);

  if (delta > 1) {
    console.debug(
      'Frame rendering took more than 1 second, skipping game logic updates...',
    );
  } else if (controls.gameState.pause > 0) {
    // Game is paused, skipping game logic updates...
  } else {
    const newCrosshairPosition = new THREE.Vector3(
      controls.mouseHudCoordinates.x,
      controls.mouseHudCoordinates.y,
      1,
    );
    newCrosshairPosition.unproject(camera);
    newCrosshairPosition.setZ(0);

    crosshair.position.copy(newCrosshairPosition);

    // ###################
    // # Perform actions #
    // ###################
    enemyManager.update(delta);

    if (controls.mouseState.primary > 0) {
      player.weapon.shoot(scene, player.position, crosshair.position);
    }

    // ################################
    // # Update all updatable objects #
    // ################################
    // TODO @Shinigami92 2022-09-21: Filtering the enemies in each render cycle is a performance issue
    const enemies = enemyManager.enemies;
    const minerals = scene.children.filter(isMineral);

    // TODO @Shinigami92 2022-09-21: Maybe go back to normal loops so all bullets and enemies can be updated/moved before collisions are detected
    const disposeObjects: Disposable[] = [];
    scene.traverse((object) => {
      if (isUpdatable(object)) {
        if (isEnemy(object)) {
          object.target.copy(player.position);

          for (const enemy of enemies) {
            if (enemy.id !== object.id && collision(object, enemy)) {
              // push both objects in opposite directions
              const direction = new THREE.Vector3();
              direction.subVectors(enemy.position, object.position);
              direction.normalize();
              direction.multiplyScalar(0.05);
              enemy.position.add(direction);
              object.position.sub(direction);
            }
          }

          if (collision(object, player)) {
            player.health -= object.damage;

            // push all enemies away from the player
            for (const enemy of enemies) {
              const direction = new THREE.Vector3();
              direction.subVectors(enemy.position, player.position);
              direction.normalize();
              direction.multiplyScalar(3);
              enemy.position.add(direction);
            }
          }

          object.update(delta);
        } else if (isBullet(object)) {
          for (const enemy of enemies) {
            if (collision(enemy, object)) {
              enemy.health -= object.damage;
              object.hits += 1;
              score.score += 1;

              if (object.hits >= object.maxHits) {
                // No more detections are needed if piercing has reached its limit
                break;
              }
            }
          }

          object.update(delta);
        } else {
          object.update(delta);
        }
      }

      if (isPlayer(object)) {
        for (const mineral of minerals) {
          if (collision(object, mineral)) {
            // push player back
            const direction = new THREE.Vector3();
            direction.subVectors(mineral.position, object.position);
            direction.normalize();
            direction.multiplyScalar(0.1);
            object.position.sub(direction);
          }
        }
      }

      if (isDisposable(object) && object.markForDisposal) {
        disposeObjects.push(object);
      }
    });

    if (player.health <= 0) {
      resetGame();
    }

    disposeObjects.forEach((object) => object.dispose());
  }

  renderer.render(scene, camera);

  hud.update(delta);

  renderer.render(hudScene, hud.camera);

  stats?.update();
}

animate();
