import './main.css';

import * as THREE from 'three';

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

const player = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 2),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
);
player.position.set(0, 0, 0);
scene.add(player);

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

function animate(): void {
  requestAnimationFrame(animate);

  const intersections = raycast.intersectObjects(
    scene.children.filter((a) => a.id === ground.id),
  );
  if (intersections.length > 0) {
    const intersection = intersections[0];
    crosshair.position.copy(intersection.point);
  }

  renderer.render(scene, camera);
}

animate();
