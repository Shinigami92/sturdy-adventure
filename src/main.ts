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

let mousePressed = false;

function onMouseDown(): void {
  mousePressed = true;
}

container.addEventListener('mousedown', onMouseDown, false);

function onMouseUp(): void {
  mousePressed = false;
}

container.addEventListener('mouseup', onMouseUp, false);

const keyPressed = {
  w: false,
  a: false,
  s: false,
  d: false,
};

function onKeyDown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'w':
      keyPressed.w = true;
      break;
    case 'a':
      keyPressed.a = true;
      break;
    case 's':
      keyPressed.s = true;
      break;
    case 'd':
      keyPressed.d = true;
      break;
  }
}

window.addEventListener('keydown', onKeyDown, false);

function onKeyUp(event: KeyboardEvent): void {
  switch (event.key) {
    case 'w':
      keyPressed.w = false;
      break;
    case 'a':
      keyPressed.a = false;
      break;
    case 's':
      keyPressed.s = false;
      break;
    case 'd':
      keyPressed.d = false;
      break;
  }
}

window.addEventListener('keyup', onKeyUp, false);

const clock = new THREE.Clock();
let delta = 0;

const playerShootSpeed = 1;
let playerShootTimer = 0;

const bullets: THREE.Mesh[] = [];

function animate(): void {
  requestAnimationFrame(animate);

  delta = clock.getDelta();

  // TODO @Shinigami92 2022-09-19: Split animation into render and update function

  if (keyPressed.w) {
    player.position.y += 5 * delta;
  }
  if (keyPressed.a) {
    player.position.x -= 5 * delta;
  }
  if (keyPressed.s) {
    player.position.y -= 5 * delta;
  }
  if (keyPressed.d) {
    player.position.x += 5 * delta;
  }

  camera.position.set(
    player.position.x,
    player.position.y,
    player.position.z + 50,
  );

  if (playerShootTimer > 0) {
    playerShootTimer -= delta;
    if (playerShootTimer < 0) {
      playerShootTimer = 0;
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

  if (mousePressed && playerShootTimer === 0) {
    playerShootTimer = playerShootSpeed;

    // TODO @Shinigami92 2022-09-19: Spawn the bullet via a helper
    const bullet = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x7f00ff }),
    );
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
