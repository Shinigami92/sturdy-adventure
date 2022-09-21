import '@/main.css';

import * as THREE from 'three';

import { PlayerControls } from '@/controls';
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

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshBasicMaterial({ color: 0xbfe3dd }),
);
scene.add(ground);

const player = new Player({ weapon: new Revolver() });
player.position.set(0, 0, 0);
scene.add(player);

const controls = new PlayerControls(camera, renderer.domElement, player);

const raycast = new THREE.Raycaster();

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

const clock = new THREE.Clock();
let delta = 0;

function animate(): void {
  requestAnimationFrame(animate);

  delta = clock.getDelta();

  // TODO @Shinigami92 2022-09-19: Split animation into render and update function

  controls.update(delta);

  raycast.setFromCamera(controls.mouseHudCoordinates.clone(), camera);

  // TODO @Shinigami92 2022-09-19: Maybe the scene.children can be filtered in beforehand
  const intersections = raycast.intersectObjects(
    scene.children.filter((a) => a.id === ground.id),
  );
  if (intersections.length > 0) {
    const intersection = intersections[0];
    crosshair.position.copy(intersection.point);
  }

  if (controls.mouseState.primary > 0) {
    player.weapon.shoot(scene, player.position, crosshair.position);
  }

  scene.traverse((object) => {
    if (isUpdatable(object)) {
      object.update(delta);
    }
  });

  renderer.render(scene, camera);
}

animate();
