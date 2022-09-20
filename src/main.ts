import '@/main.css';

import * as THREE from 'three';

import { PlayerControls } from '@/controls';
import { Bullet } from '@/entities/bullet';
import { Player } from '@/entities/player';

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

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshBasicMaterial({ color: 0xbfe3dd }),
);
scene.add(ground);

const player = new Player();
player.position.set(0, 0, 0);
scene.add(player);

const controls = new PlayerControls(camera, renderer.domElement, player);

const raycast = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const crosshair = new THREE.Mesh(
  new THREE.RingGeometry(0.4, 0.5, 12),
  new THREE.MeshBasicMaterial({ color: 0x0000ff }),
);
crosshair.position.set(0, 0, 0);
scene.add(crosshair);

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

function onMouseMove(event: MouseEvent): void {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycast.setFromCamera(mouse.clone(), camera);
}

container.addEventListener('mousemove', onMouseMove, false);

let mousePressed = false;

function onMouseDown(): void {
  mousePressed = true;
}

container.addEventListener('mousedown', onMouseDown, false);

function onMouseUp(): void {
  mousePressed = false;
}

container.addEventListener('mouseup', onMouseUp, false);

const clock = new THREE.Clock();
let delta = 0;

const bullets: THREE.Mesh[] = [];

function animate(): void {
  requestAnimationFrame(animate);

  delta = clock.getDelta();

  // TODO @Shinigami92 2022-09-19: Split animation into render and update function

  controls.update(delta);

  if (player.shootTimer > 0) {
    player.shootTimer -= delta;
    if (player.shootTimer < 0) {
      player.shootTimer = 0;
    }
  }

  // TODO @Shinigami92 2022-09-19: Maybe the scene.children can be filtered in beforehand
  const intersections = raycast.intersectObjects(
    scene.children.filter((a) => a.id === ground.id),
  );
  if (intersections.length > 0) {
    const intersection = intersections[0];
    crosshair.position.copy(intersection.point);
  }

  if (mousePressed && player.shootTimer === 0) {
    player.shootTimer = player.shootSpeed;

    // TODO @Shinigami92 2022-09-19: Spawn the bullet via a helper
    const bullet = new Bullet();
    scene.add(bullet);

    bullets.push(bullet);

    bullet.position.copy(player.position);

    bullet.lookAt(crosshair.position.x, crosshair.position.y, 0);
  }

  for (const bullet of bullets) {
    bullet.translateZ(10 * delta);
    // TODO @Shinigami92 2022-09-19: Let the bullet disappear after a while
  }

  renderer.render(scene, camera);
}

animate();
