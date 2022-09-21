import '@/main.css';

import * as THREE from 'three';

import { PlayerControls } from '@/controls';
import { isBullet } from '@/entities/bullet';
import { Enemy, isEnemy } from '@/entities/enemy';
import { Player } from '@/entities/player';
import { isUpdatable } from '@/entities/updatable';
import { Revolver } from '@/entities/weapon';

const container = document.getElementById('container');

if (!container) {
  throw new Error('Container not found');
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  1,
  100,
);
camera.position.set(0, 0, 50);

const groundColor = new THREE.Color(0x576d46);
groundColor.convertSRGBToLinear();
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshBasicMaterial({ color: groundColor }),
);
scene.add(ground);

const player = new Player({ weapon: new Revolver() });
player.position.set(0, 0, 0);
scene.add(player);

const controls = new PlayerControls(camera, renderer.domElement, player);

const raycast = new THREE.Raycaster();

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

  // ##########################
  // # Test for intersections #
  // ##########################
  raycast.setFromCamera(controls.mouseHudCoordinates.clone(), camera);

  // TODO @Shinigami92 2022-09-19: Maybe the scene.children can be filtered in beforehand
  const intersections = raycast.intersectObjects(
    scene.children.filter((a) => a.id === ground.id),
  );
  if (intersections.length > 0) {
    const intersection = intersections[0];
    crosshair.position.copy(intersection.point);
  }

  // ###################
  // # Perform actions #
  // ###################
  if (enemySpawnTimer > 0) {
    enemySpawnTimer -= delta;
    if (enemySpawnTimer < 0) {
      enemySpawnTimer = 0;
    }
  }

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
  scene.traverse((object) => {
    if (isUpdatable(object)) {
      if (isEnemy(object)) {
        object.target.copy(player.position);
      }

      object.update(delta);

      if (isBullet(object)) {
        for (const enemy of enemies) {
          // TODO @Shinigami92 2022-09-21: Enhance collision detection
          if (enemy.position.distanceTo(object.position) < 0.5) {
            enemy.health -= object.damage;
            // TODO @Shinigami92 2022-09-21: Maybe the bullet has a piercing effect
            break;
          }
        }
      }
    }
  });

  renderer.render(scene, camera);
}

animate();
