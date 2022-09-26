import '@/main.css';

import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

import { isBullet } from '@/entities/bullets/bullet';
import { Enemy, isEnemy } from '@/entities/enemies/enemy';
import { Player } from '@/entities/player';
import { Revolver } from '@/entities/weapons/revolver';
import { collision } from '@/utilities/collision';
import { PlayerControls } from '@/utilities/controls';
import type { Disposable } from '@/utilities/disposable';
import { isDisposable } from '@/utilities/disposable';
import { isUpdatable } from '@/utilities/updatable';

const container = document.getElementById('container');

if (!container) {
  throw new Error('Container not found');
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
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

const player = new Player({ weapon: new Revolver() });
player.position.set(0, 0, 0);
scene.add(player);

const controls = new PlayerControls(camera, renderer.domElement, player);

const crosshairColor = new THREE.Color(0x0000ff);
crosshairColor.convertSRGBToLinear();
const crosshair = new THREE.Mesh(
  new THREE.RingGeometry(0.4, 0.5, 12),
  new THREE.MeshBasicMaterial({ color: crosshairColor }),
);
crosshair.position.set(0, 0, 0);
scene.add(crosshair);

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

const clock = new THREE.Clock();
let delta = 0;

// TODO @Shinigami92 2022-09-21: Maybe build an EnemySpawner
let enemySpawnTimer = 3;

function animate(): void {
  requestAnimationFrame(animate);

  delta = clock.getDelta();

  // TODO @Shinigami92 2022-09-19: Split animation into render and update function

  // #######################
  // # Update the controls #
  // #######################
  controls.update(delta);

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
  enemySpawnTimer = Math.max(0, enemySpawnTimer - delta);

  if (enemySpawnTimer === 0) {
    enemySpawnTimer = 3;

    const enemy = new Enemy();
    const angle = Math.random() * Math.PI * 2;
    const distance = 20;
    enemy.position.set(
      player.position.x + Math.sin(angle) * distance,
      player.position.y + Math.cos(angle) * distance,
      0,
    );
    scene.add(enemy);
  }

  if (controls.mouseState.primary > 0) {
    player.weapon.shoot(scene, player.position, crosshair.position);
  }

  // ################################
  // # Update all updatable objects #
  // ################################
  // TODO @Shinigami92 2022-09-21: Filtering the enemies in each render cycle is a performance issue
  const enemies = scene.children.filter(isEnemy);

  // TODO @Shinigami92 2022-09-21: Maybe go back to normal loops so all bullets and enemies can be updated/moved before collisions are detected
  const disposeObjects: Disposable[] = [];
  scene.traverse((object) => {
    if (isUpdatable(object)) {
      if (isEnemy(object)) {
        object.target.copy(player.position);
      }

      object.update(delta);

      if (isBullet(object)) {
        for (const enemy of enemies) {
          if (collision(enemy, object)) {
            enemy.health -= object.damage;
            object.hits += 1;

            if (object.hits >= object.maxHits) {
              // No more detections are needed if piercing has reached its limit
              break;
            }
          }
        }
      }
    }

    if (isDisposable(object) && object.markForDisposal) {
      disposeObjects.push(object);
    }
  });

  disposeObjects.forEach((object) => object.dispose());

  renderer.render(scene, camera);

  stats?.update();
}

animate();
