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

// ─── Three.js Film Sphere ─────────────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('sphere-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

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
  ];

  const SIZE = canvas.offsetWidth || 480;
  const DPR  = Math.min(window.devicePixelRatio || 1, 2);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(DPR);
  renderer.setSize(SIZE, SIZE);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 3.8;

  // ── Lighting ──
  scene.add(new THREE.AmbientLight(0xffffff, 1.4));
  const keyLight = new THREE.DirectionalLight(0xfff5e8, 2.2);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xd0e8ff, 0.9);
  fillLight.position.set(-4, 1, 2);
  scene.add(fillLight);
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
  rimLight.position.set(0, -3, -4);
  scene.add(rimLight);

  // ── Central light-grey sphere ──
  const sphereMat = new THREE.MeshStandardMaterial({
    color:     0xf2f2f4,
    roughness: 0.25,
    metalness: 0.05,
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(0.98, 64, 64), sphereMat));

  // ── masterGroup receives mouse tilt ──
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // ── Film strip texture (single roll, all photos) ──
  const N_FRAMES = photoIds.length;   // 20
  const TEX_H    = 256;
  const FRAME_W  = TEX_H;             // square cells, full height
  const TEX_W    = FRAME_W * N_FRAMES;

  // "Cover" draw: scale image to fill dest rect without distortion
  function drawCover(ctx, img, dx, dy, dw, dh) {
    const iw = img.naturalWidth  || dw;
    const ih = img.naturalHeight || dh;
    const scale = Math.max(dw / iw, dh / ih);
    const sw = dw / scale;
    const sh = dh / scale;
    const sx = (iw - sw) / 2;
    const sy = (ih - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  function filmRRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y,     x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x,     y + h, r);
    ctx.arcTo(x,     y + h, x,     y,     r);
    ctx.arcTo(x,     y,     x + w, y,     r);
    ctx.closePath();
  }

  function drawFilmStrip(ctx, imgs) {
    ctx.clearRect(0, 0, TEX_W, TEX_H);

    const GAP = 10;   // px gap between photos
    const R   = 20;   // corner radius

    const fw = FRAME_W - GAP * 2;
    const fh = TEX_H  - GAP * 2;

    for (let i = 0; i < N_FRAMES; i++) {
      const fx = i * FRAME_W + GAP;
      const fy = GAP;

      ctx.save();
      filmRRect(ctx, fx, fy, fw, fh, R);
      ctx.clip();

      if (imgs[i] && imgs[i].complete && imgs[i].naturalWidth > 0) {
        drawCover(ctx, imgs[i], fx, fy, fw, fh);
      } else {
        ctx.fillStyle = 'rgba(200,200,210,0.35)';
        ctx.fillRect(fx, fy, fw, fh);
      }
      ctx.restore();
    }
  }

  // ── Offscreen canvas + texture ──
  const fc   = document.createElement('canvas');
  fc.width   = TEX_W;
  fc.height  = TEX_H;
  const fctx = fc.getContext('2d');
  const tex  = new THREE.CanvasTexture(fc);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const imgs = [];
  photoIds.forEach((id) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    // Request square crops so cover-scaling is trivial
    img.src = `https://images.unsplash.com/photo-${id}?w=240&h=240&fit=crop&auto=format&q=75`;
    img.onload = () => { drawFilmStrip(fctx, imgs); tex.needsUpdate = true; };
    imgs.push(img);
  });
  drawFilmStrip(fctx, imgs); // initial placeholder draw

  // ── Ring ribbon geometry (XZ plane) ──
  // ── Helix geometry: film ribbon wound around the sphere surface ──
  // Uses spherical coordinates so the strip stays flush with the sphere.
  // t goes 0→1 along the helix; phi = azimuth, theta = latitude elevation.
  // At each point the ribbon is offset ±halfWidth along the binormal
  // (Normal × Tangent), keeping the strip tangent to the sphere.
  function createHelixGeo(radius, nTurns, elevMax, stripWidth, segsPerTurn, uScale) {
    const N     = Math.round(segsPerTurn * nTurns);
    const verts = [], uvs = [], idxs = [];

    for (let i = 0; i <= N; i++) {
      const t     = i / N;
      const phi   = t * nTurns * Math.PI * 2;
      const theta = (t * 2 - 1) * elevMax;   // -elevMax → +elevMax

      const cosT = Math.cos(theta), sinT = Math.sin(theta);
      const cosP = Math.cos(phi),   sinP = Math.sin(phi);

      // Centre point on sphere
      const px = radius * cosT * cosP;
      const py = radius * sinT;
      const pz = radius * cosT * sinP;

      // Outward sphere normal
      const nx = cosT * cosP, ny = sinT, nz = cosT * sinP;

      // Helix tangent (derivative w.r.t. t, unnormalised)
      const DP = nTurns * Math.PI * 2, DT = 2 * elevMax;
      const tx = -sinT * cosP * DT - cosT * sinP * DP;
      const ty =  cosT * DT;
      const tz = -sinT * sinP * DT + cosT * cosP * DP;
      const tl = Math.sqrt(tx*tx + ty*ty + tz*tz);
      const tax = tx/tl, tay = ty/tl, taz = tz/tl;

      // Binormal = Normal × Tangent  (ribbon-width direction on sphere surface)
      let bx = ny*taz - nz*tay;
      let by = nz*tax - nx*taz;
      let bz = nx*tay - ny*tax;
      const bl = Math.sqrt(bx*bx + by*by + bz*bz);
      bx /= bl; by /= bl; bz /= bl;

      const hw = stripWidth / 2;
      verts.push(px - bx*hw, py - by*hw, pz - bz*hw);   // edge A (world-up)
      verts.push(px + bx*hw, py + by*hw, pz + bz*hw);   // edge B (world-down)
      // v=1 on edge A (canvas top = sprocket top) → images upright
      const u = t * uScale;
      uvs.push(u, 1, u, 0);
    }

    for (let i = 0; i < N; i++) {
      const b = i * 2;
      idxs.push(b, b+1, b+2,  b+1, b+3, b+2);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs,   2));
    geo.setIndex(idxs);
    geo.computeVertexNormals();
    return geo;
  }

  // ── Film helix: 2.5 turns, covers ±55° latitude, narrow ribbon ──
  const N_TURNS  = 2.5;
  const ELEV_MAX = THREE.MathUtils.degToRad(55);
  const STRIP_W  = 0.52;

  // How many times the texture repeats along U so pixels appear square in world space:
  // uScale = (arcLength / stripWidth) / (TEX_W / TEX_H)
  const approxArcLen = N_TURNS * Math.PI * 2 * 1.04;
  const uScale       = (approxArcLen / STRIP_W) / (TEX_W / TEX_H);
  tex.wrapS = THREE.RepeatWrapping;

  const ringMat  = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true });
  const ringMesh = new THREE.Mesh(createHelixGeo(1.04, N_TURNS, ELEV_MAX, STRIP_W, 80, uScale), ringMat);
  masterGroup.add(ringMesh);

  // ── Mouse tilt ──
  let targetTiltX = 0, targetTiltY = 0;
  let currentTiltX = 0, currentTiltY = 0;
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    targetTiltY =  (e.clientX - cx) / cx * 0.30;
    targetTiltX = -(e.clientY - cy) / cy * 0.20;
  });

  // ── Animation loop ──
  let autoRotY = 0;
  function animate() {
    requestAnimationFrame(animate);

    autoRotY += 0.0022;

    currentTiltX += (targetTiltX - currentTiltX) * 0.05;
    currentTiltY += (targetTiltY - currentTiltY) * 0.05;

    masterGroup.rotation.x = currentTiltX;
    masterGroup.rotation.y = autoRotY + currentTiltY;

    renderer.render(scene, camera);
  }
  animate();

  // ── Resize ──
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
