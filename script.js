// Nav shadow on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 8) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const isOpen = mobileMenu.classList.contains('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Merkle tree ELI5 popover
const merkleTrigger = document.querySelector('.merkle-trigger');
const merklePopover = document.getElementById('merkle-popover');
const merkleClose   = document.querySelector('.merkle-close');

if (merkleTrigger && merklePopover) {
  merkleTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = merklePopover.classList.toggle('open');
    merkleTrigger.setAttribute('aria-expanded', isOpen);
    merklePopover.setAttribute('aria-hidden', !isOpen);
  });

  merkleClose.addEventListener('click', (e) => {
    e.stopPropagation();
    merklePopover.classList.remove('open');
    merkleTrigger.setAttribute('aria-expanded', 'false');
    merklePopover.setAttribute('aria-hidden', 'true');
  });

  document.addEventListener('click', () => {
    merklePopover.classList.remove('open');
    merkleTrigger.setAttribute('aria-expanded', 'false');
    merklePopover.setAttribute('aria-hidden', 'true');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      merklePopover.classList.remove('open');
      merkleTrigger.setAttribute('aria-expanded', 'false');
      merklePopover.setAttribute('aria-hidden', 'true');
    }
  });
}

// Device popover
const deviceTrigger = document.querySelector('.device-trigger');
const devicePopover = document.getElementById('device-popover');
const deviceClose   = document.querySelector('.device-close');

if (deviceTrigger && devicePopover) {
  deviceTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = devicePopover.classList.toggle('open');
    deviceTrigger.setAttribute('aria-expanded', isOpen);
    devicePopover.setAttribute('aria-hidden', !isOpen);
  });

  deviceClose.addEventListener('click', (e) => {
    e.stopPropagation();
    devicePopover.classList.remove('open');
    deviceTrigger.setAttribute('aria-expanded', 'false');
    devicePopover.setAttribute('aria-hidden', 'true');
  });

  document.addEventListener('click', () => {
    devicePopover.classList.remove('open');
    deviceTrigger.setAttribute('aria-expanded', 'false');
    devicePopover.setAttribute('aria-hidden', 'true');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      devicePopover.classList.remove('open');
      deviceTrigger.setAttribute('aria-expanded', 'false');
      devicePopover.setAttribute('aria-hidden', 'true');
    }
  });
}

// ─── Three.js Photo Sphere ───────────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('sphere-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Photo IDs (Unsplash)
  const photoIds = [
    '1772975657496-1e7107beed75', '1774246714923-0375b6f1e0e9',
    '1506905925346-21bda4d32df4', '1465146344425-f00d5f5c8f07',
    '1501854140801-50d01698950b', '1469474968028-56623f02e42e',
    '1472214103451-9374bd1c798e', '1507003211169-0a1dd7228f2d',
    '1476514525535-07fb3b4ae5f1', '1519741497674-611481863552',
    '1761839271800-f44070ff0eb9', '1757549248794-2b2b9db92439',
    '1474511320723-9a56873867b5', '1438761681033-6461ffad8d80',
    '1447752875215-b2761acb3c5d', '1546069901-ba9599a7e63c',
    '1514888286974-6c03e2ca1dba', '1543466835-00a7907e9de1',
    '1531306728370-e2ebd9d7bb99', '1488426862026-3ee34a7d66df',
    '1513635269975-59663e0ac1ad', '1529156069898-49953e39b3ac',
    '1522202176988-66273c2fd55f', '1524863479829-916d8e77f114',
    '1534528741775-53994a69daeb', '1500648767791-00dcc994a43e',
    '1441974231531-c6227db76b6e', '1529626455594-4ff0802cfb7e',
    '1504700610630-ac6aba3536d3', '1774333406492-2806c117fe59'
  ];

  const SIZE = canvas.offsetWidth || 480;
  const DPR  = Math.min(window.devicePixelRatio || 1, 2);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(DPR);
  renderer.setSize(SIZE, SIZE);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 3.5;

  // Build circular alpha-mask texture on a small offscreen canvas
  function makeCircleMask(res) {
    const c = document.createElement('canvas');
    c.width = c.height = res;
    const ctx = c.getContext('2d');
    const r   = res / 2;
    const grad = ctx.createRadialGradient(r, r, r * 0.72, r, r, r);
    grad.addColorStop(0,    'rgba(255,255,255,1)');
    grad.addColorStop(0.82, 'rgba(255,255,255,1)');
    grad.addColorStop(1,    'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(c);
  }
  const alphaMask = makeCircleMask(256);

  // Build white border ring texture
  function makeRingTex(res) {
    const c = document.createElement('canvas');
    c.width = c.height = res;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, res, res);
    const r = res / 2;
    ctx.beginPath();
    ctx.arc(r, r, r - 2, 0, Math.PI * 2);
    ctx.lineWidth = Math.round(res * 0.06);
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.stroke();
    return new THREE.CanvasTexture(c);
  }

  // Fibonacci sphere distribution
  const N      = photoIds.length;
  const PHI    = Math.PI * (3 - Math.sqrt(5));
  const RADIUS = 1.25;
  const group  = new THREE.Group();
  scene.add(group);

  const loader = new THREE.TextureLoader();
  loader.crossOrigin = 'anonymous';

  const meshes = [];

  photoIds.forEach((id, i) => {
    const y     = 1 - (i / (N - 1)) * 2;
    const rHoriz = Math.sqrt(1 - y * y);
    const theta  = PHI * i;
    const x = Math.cos(theta) * rHoriz;
    const z = Math.sin(theta) * rHoriz;

    const pos = new THREE.Vector3(x, y, z).multiplyScalar(RADIUS);

    // Photo plane
    const geo  = new THREE.PlaneGeometry(0.74, 0.74);
    const mat  = new THREE.MeshBasicMaterial({
      transparent: true,
      depthTest:   false,
      alphaMap:    alphaMask,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    mesh.lookAt(new THREE.Vector3(0, 0, 0));
    mesh.rotateY(Math.PI); // face outward
    group.add(mesh);
    meshes.push(mesh);

    // Load texture
    loader.load(
      `https://images.unsplash.com/photo-${id}?w=200&h=200&fit=crop&auto=format&q=70`,
      (tex) => { mat.map = tex; mat.needsUpdate = true; }
    );
  });

  // Mouse tilt
  let targetTiltX = 0, targetTiltY = 0;
  let currentTiltX = 0, currentTiltY = 0;
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    targetTiltY =  (e.clientX - cx) / cx * 0.25;
    targetTiltX = -(e.clientY - cy) / cy * 0.18;
  });

  // Animation loop
  let autoRotY = 0;
  function animate() {
    requestAnimationFrame(animate);

    autoRotY += 0.0035;

    currentTiltX += (targetTiltX - currentTiltX) * 0.06;
    currentTiltY += (targetTiltY - currentTiltY) * 0.06;

    group.rotation.y = autoRotY + currentTiltY;
    group.rotation.x = currentTiltX;

    // Depth-based opacity: front = full opacity, back hemisphere = faded
    meshes.forEach(mesh => {
      // World-space z of each photo after group rotation
      const worldPos = new THREE.Vector3();
      mesh.getWorldPosition(worldPos);
      worldPos.project(camera);

      // z in NDC: -1 = far back, +1 = front
      // map to opacity: 0.15 (back) → 1.0 (front)
      const t   = (worldPos.z + 1) / 2; // 0..1
      const opacity = 0.12 + t * 0.88;
      mesh.material.opacity = opacity;
      if (mesh.userData.ring) {
        mesh.userData.ring.material.opacity = opacity * 0.9;
      }
    });

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    const s = canvas.offsetWidth;
    renderer.setSize(s, s);
  });
})();

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('text-ink', 'font-semibold');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('text-ink', 'font-semibold');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => observer.observe(section));
