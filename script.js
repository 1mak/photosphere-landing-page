// Nav shadow on scroll + scroll progress bar
const nav = document.getElementById('nav');
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (window.scrollY > 8) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Progress bar
  if (scrollProgress) {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (scrolled / total * 100) + '%';
  }
}, { passive: true });

// ─── Scroll fade-in sections ──────────────────────────────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-in-section').forEach(el => fadeObserver.observe(el));

// ─── Copy button ──────────────────────────────────────────────────────────────
const copyBtn   = document.getElementById('copy-btn');
const copyLabel = document.getElementById('copy-label');
if (copyBtn) {
  const commands = `git clone https://github.com/ashleydavis/photosphere\ncd photosphere\nbun install\nbun run dev`;
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(commands);
      copyLabel.textContent = 'Copied!';
      copyBtn.querySelector('svg').style.display = 'none';
      setTimeout(() => {
        copyLabel.textContent = 'Copy';
        copyBtn.querySelector('svg').style.display = '';
      }, 2000);
    } catch {
      copyLabel.textContent = 'Failed';
      setTimeout(() => { copyLabel.textContent = 'Copy'; }, 2000);
    }
  });
}

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

// ─── Floating code fragments ─────────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('code-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const FRAGMENTS = [
    'git commit', 'git push', 'git clone', 'git fork',
    'pull request', 'MIT License', 'open source', 'v0.0.7',
    'npm install', 'git merge', '// TODO', 'import', 'export default',
    'const', 'async/await', '{ }', '</>', '#!/bin/sh',
    'git log', 'git diff', 'fork()', '#photosphere', '★ star',
    'issues', 'releases', 'git stash', 'npm run dev',
  ];

  const COLORS = ['#6c25a7', '#818CF8', '#FB7185', '#FBBF24', '#34D399'];

  let particles = [];
  let w, h;

  function resize() {
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width  = w * (window.devicePixelRatio || 1);
    canvas.height = h * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  function spawn() {
    particles.push({
      text:    FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)],
      x:       Math.random() * w,
      y:       h + 10,
      speed:   0.3 + Math.random() * 0.5,
      size:    10 + Math.random() * 4,
      opacity: 0,
      maxOp:   0.22 + Math.random() * 0.18,
      color:   COLORS[Math.floor(Math.random() * COLORS.length)],
      drift:   (Math.random() - 0.5) * 0.3,
    });
  }

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, w, h);

    // Spawn a new fragment every ~40 frames
    frame++;
    if (frame % 40 === 0) spawn();

    ctx.textBaseline = 'middle';

    particles = particles.filter(p => p.y > -20);

    particles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift;

      // Fade in over bottom 15%, fade out over top 20%
      const progress = 1 - (p.y / h);
      if (progress < 0.15) {
        p.opacity = (progress / 0.15) * p.maxOp;
      } else if (progress > 0.80) {
        p.opacity = ((1 - progress) / 0.20) * p.maxOp;
      } else {
        p.opacity = p.maxOp;
      }

      ctx.font = `${p.size}px 'Courier New', monospace`;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fillText(p.text, p.x, p.y);
    });

    ctx.globalAlpha = 1;
  }

  resize();
  // Seed a handful of particles spread across the section height
  for (let i = 0; i < 12; i++) {
    spawn();
    particles[particles.length - 1].y = Math.random() * h;
  }

  animate();
  window.addEventListener('resize', resize);
})();

// ─── Sync photo animation ─────────────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('sync-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  // Reuse the sphere photo IDs — pick a spread across the array
  const SYNC_IDS = [
    '1506905925346-21bda4d32df4','1465146344425-f00d5f5c8f07',
    '1501854140801-50d01698950b','1472214103451-9374bd1c798e',
    '1476514525535-07fb3b4ae5f1','1474511320723-9a56873867b5',
    '1438761681033-6461ffad8d80','1447752875215-b2761acb3c5d',
    '1514888286974-6c03e2ca1dba','1531306728370-e2ebd9d7bb99',
    '1513635269975-59663e0ac1ad','1534528741775-53994a69daeb',
  ];
  const IMGS = SYNC_IDS.map(id => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = `https://images.unsplash.com/photo-${id}?w=80&h=80&fit=crop&auto=format&q=70`;
    return img;
  });
  const FALLBACK_COLORS = [
    '#FDA4AF','#86EFAC','#93C5FD','#FCD34D',
    '#C4B5FD','#6EE7B7','#FCA5A5','#A5F3FC',
  ];

  let W, H, dpr;
  let p1 = [], p2 = [];
  let frameCount = 0;
  let lapPos, cloudPos, destPos;

  function resize() {
    const wrap = document.getElementById('sync-diagram-wrap');
    if (!wrap) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = wrap.offsetWidth;
    H = wrap.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lapPos = cloudPos = destPos = null;
  }

  function center(id) {
    const el = document.getElementById(id);
    const wrap = document.getElementById('sync-diagram-wrap');
    if (!el || !wrap) return null;
    const er = el.getBoundingClientRect();
    const wr = wrap.getBoundingClientRect();
    return { x: er.left + er.width/2 - wr.left, y: er.top + er.height/2 - wr.top };
  }

  function ensurePos() {
    lapPos   = lapPos   || center('sync-device-laptop');
    cloudPos = cloudPos || center('sync-device-cloud');
    destPos  = destPos  || center('sync-device-dest');
    return lapPos && cloudPos && destPos;
  }

  function ctrl(a, b) {
    const vertical = Math.abs(b.y - a.y) > Math.abs(b.x - a.x);
    return vertical
      ? { x: Math.max(a.x, b.x) + 48, y: (a.y + b.y) / 2 }
      : { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - 48 };
  }

  function ease(t) { return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t; }

  function bezier(a, c, b, t) {
    const m = 1 - t;
    return { x: m*m*a.x + 2*m*t*c.x + t*t*b.x, y: m*m*a.y + 2*m*t*c.y + t*t*b.y };
  }

  function fadeAlpha(t) {
    if (t < 0.12) return t / 0.12;
    if (t > 0.88) return (1 - t) / 0.12;
    return 1;
  }

  function rrect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y); ctx.arcTo(x+w, y, x+w, y+r, r);
    ctx.lineTo(x+w, y+h-r); ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
    ctx.lineTo(x+r, y+h); ctx.arcTo(x, y+h, x, y+h-r, r);
    ctx.lineTo(x, y+r); ctx.arcTo(x, y, x+r, y, r);
    ctx.closePath();
  }

  function drawPhoto(x, y, sz, imgIdx, fallback, alpha, angle) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(angle);
    const pad = 3, tot = sz + pad*2;
    // Drop shadow on the white frame
    ctx.shadowColor = 'rgba(0,0,0,0.20)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = 'rgba(255,255,255,0.97)';
    rrect(-tot/2, -tot/2, tot, tot, 3);
    ctx.fill();
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    // Clip to inner photo area and draw image (or fallback colour)
    rrect(-sz/2, -sz/2, sz, sz, 2);
    ctx.clip();
    const img = IMGS[imgIdx];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, -sz/2, -sz/2, sz, sz);
    } else {
      ctx.fillStyle = fallback;
      ctx.fillRect(-sz/2, -sz/2, sz, sz);
    }
    ctx.restore();
  }

  function spawn(arr, from, to) {
    if (!from || !to) return;
    const imgIdx = Math.floor(Math.random() * IMGS.length);
    arr.push({
      t: 0,
      speed: 0.003 + Math.random() * 0.002,
      imgIdx,
      fallback: FALLBACK_COLORS[imgIdx % FALLBACK_COLORS.length],
      sz: 24 + Math.floor(Math.random() * 10),
      angle: (Math.random() - 0.5) * 0.45,
      ctrl: ctrl(from, to)
    });
  }

  // Draws a pixelated version of the photo (simulating encryption)
  // pixelLevel 0 = clear, 1 = fully pixelated
  function drawPixelatedPhoto(x, y, sz, imgIdx, fallback, alpha, angle, pixelLevel) {
    const blockSize = Math.max(2, Math.round(pixelLevel * (sz / 3)));
    if (blockSize <= 2) {
      drawPhoto(x, y, sz, imgIdx, fallback, alpha, angle);
      return;
    }
    // Render to an offscreen canvas at low resolution then scale up
    const off = document.createElement('canvas');
    const lowRes = Math.max(2, Math.round(sz / blockSize));
    off.width  = lowRes;
    off.height = lowRes;
    const offCtx = off.getContext('2d');
    offCtx.imageSmoothingEnabled = false;
    const img = IMGS[imgIdx];
    if (img && img.complete && img.naturalWidth > 0) {
      offCtx.drawImage(img, 0, 0, lowRes, lowRes);
    } else {
      offCtx.fillStyle = fallback;
      offCtx.fillRect(0, 0, lowRes, lowRes);
    }
    // Draw scaled-up pixelated result clipped to rounded rect
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(angle);
    const pad = 3, tot = sz + pad * 2;
    ctx.shadowColor = 'rgba(0,0,0,0.20)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = 'rgba(255,255,255,0.97)';
    rrect(-tot/2, -tot/2, tot, tot, 3);
    ctx.fill();
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    rrect(-sz/2, -sz/2, sz, sz, 2);
    ctx.clip();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, -sz/2, -sz/2, sz, sz);
    ctx.restore();
  }

  function animateParticles(arr, from, to, encrypted) {
    for (let i = arr.length - 1; i >= 0; i--) {
      const p = arr[i];
      p.t = Math.min(p.t + p.speed, 1.01);
      if (p.t > 1) { arr.splice(i, 1); continue; }
      const pt = bezier(from, p.ctrl, to, ease(p.t));
      if (encrypted) {
        // Starts fully pixelated at cloud, clears as it reaches the destination
        const pixelLevel = Math.max(0, 1 - p.t / 0.75);
        drawPixelatedPhoto(pt.x, pt.y, p.sz, p.imgIdx, p.fallback, fadeAlpha(p.t), p.angle, pixelLevel);
      } else {
        drawPhoto(pt.x, pt.y, p.sz, p.imgIdx, p.fallback, fadeAlpha(p.t), p.angle);
      }
    }
  }

  function drawCloudEffect() {
    if (!cloudPos) return;

    // Activity level: photos arriving (p1 near end) or departing (p2 near start)
    let activity = 0;
    p1.forEach(p => { if (p.t > 0.55) activity = Math.max(activity, (p.t - 0.55) / 0.45); });
    p2.forEach(p => { if (p.t < 0.45) activity = Math.max(activity, (0.45 - p.t) / 0.45); });

    const rot   = frameCount * 0.022;
    const base  = 0.12;
    const boost = activity * 0.40;

    // Soft radial glow
    const grd = ctx.createRadialGradient(cloudPos.x, cloudPos.y, 6, cloudPos.x, cloudPos.y, 62);
    grd.addColorStop(0, `rgba(167,139,250,${(base + boost) * 0.9})`);
    grd.addColorStop(1,  'rgba(167,139,250,0)');
    ctx.beginPath();
    ctx.arc(cloudPos.x, cloudPos.y, 62, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Expanding pulse rings when photos are near
    if (activity > 0.15) {
      [0, 30].forEach(offset => {
        const pulseT = ((frameCount + offset) % 60) / 60;
        ctx.save();
        ctx.globalAlpha = activity * (1 - pulseT) * 0.45;
        ctx.strokeStyle = '#A78BFA';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cloudPos.x, cloudPos.y, 42 + pulseT * 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
    }

    // Orbiting dots — always subtly present, brighten with activity
    const numDots = 6;
    const dotR    = 50;
    for (let i = 0; i < numDots; i++) {
      const angle = rot + (i / numDots) * Math.PI * 2;
      const x = cloudPos.x + Math.cos(angle) * dotR;
      const y = cloudPos.y + Math.sin(angle) * dotR;
      const dotA = (base + activity * 0.55) * (0.45 + 0.55 * Math.sin(rot * 2.5 + i * 1.05));
      ctx.save();
      ctx.globalAlpha = Math.min(dotA, 1);
      ctx.fillStyle = '#A78BFA';
      ctx.beginPath();
      ctx.arc(x, y, 2.5 + activity * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    if (!ensurePos()) return;
    ctx.clearRect(0, 0, W, H);
    frameCount++;
    if (frameCount % 58 === 0)  spawn(p1, lapPos, cloudPos);
    if (frameCount % 58 === 29) spawn(p2, cloudPos, destPos);
    // Cloud effect drawn first so it sits behind the photos
    drawCloudEffect();
    animateParticles(p1, lapPos, cloudPos, false);  // arriving clear
    animateParticles(p2, cloudPos, destPos, true);  // leaving encrypted → decrypts on arrival
  }

  resize();
  window.addEventListener('resize', () => { resize(); lapPos = cloudPos = destPos = null; });
  setTimeout(() => { ensurePos(); animate(); }, 500);
})();

// ─── Download cards: OS detection + dynamic GitHub release links ─────────────
(function () {
  const ua = navigator.userAgent;
  const isWindows = /Win/i.test(ua);
  const isMac     = /Mac/i.test(ua) && !/iPhone|iPad/.test(ua);

  // Highlight the card(s) that match the detected OS
  if (isWindows) {
    document.getElementById('dl-card-windows')?.classList.add('dl-card--active');
  } else if (isMac) {
    document.getElementById('dl-card-mac-arm')?.classList.add('dl-card--active');
    document.getElementById('dl-card-mac-x64')?.classList.add('dl-card--active');
  }

  // Fetch the latest nightly release from GitHub API and wire up download links
  fetch('https://api.github.com/repos/ashleydavis/photosphere/releases')
    .then(r => r.json())
    .then(releases => {
      const nightly = releases.find(r => r.tag_name === 'nightly') || releases[0];
      if (!nightly || !nightly.assets) return;

      for (const asset of nightly.assets) {
        const name = asset.name;
        const url  = asset.browser_download_url;
        if (name.endsWith('-win-x64.exe')) {
          const el = document.getElementById('dl-link-windows');
          if (el) el.href = url;
        } else if (name.endsWith('-mac-arm64.dmg')) {
          const el = document.getElementById('dl-link-mac-arm');
          if (el) el.href = url;
        } else if (name.endsWith('-mac-x64.dmg')) {
          const el = document.getElementById('dl-link-mac-x64');
          if (el) el.href = url;
        }
      }
    })
    .catch(() => {
      // Silently fall back to the releases page URL already set in the HTML
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
