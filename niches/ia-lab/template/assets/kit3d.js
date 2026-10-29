/**
 * IA-Lab 3D Kit (Three.js r184+)
 * Suporta múltiplos temas de cenário (STAGE_THEMES):
 * - "amber": Grafite & Âmbar Quente (concreto/grafite escuro + detalhes âmbar/dourado)
 * - "clean-lab": Laboratório Clean Claro / Branco & Titânio (estilo Apple / Aperture Science)
 * - "olive-copper": Bunker Industrial Verde-Oliva & Cobre (carvão oliva + cobre/bronze)
 * - "obsidian-mint": Estúdio Dark Neutro Obsidiana & Verde-Esmeralda (preto puro + verde menta)
 *
 * REGRAS:
 * - Zero Math.random() sem seed.
 * - Tudo no render(t) é função pura de t (segundos).
 */

export const PALETTE = {
  nightTop: 0x121214,
  nightMid: 0x1c1a18,
  nightBot: 0x0c0b0a,
  steel: 0x27272a,
  steelLight: 0x3f3f46,
  steelDark: 0x18181b,
  wood: 0x27272a,
  woodDark: 0x18181b,
  woodPlank: 0x302e2b,
  claude: 0x38bdf8, // Ciano do Droide Coder (destaca forte em cenários não-azuis)
  claudeDark: 0x0284c7,
  orange: 0xf97316,
  paper: 0x18181b,
  ink: 0xf8fafc,
  slate: 0x27272a,
  screenBg: 0x0d0d10,
  green: 0x22c55e,
  red: 0xef4444,
  amber: 0xf59e0b,
  cyan: 0x38bdf8,
  purple: 0xa855f7,
  white: 0xf8fafc,
};

export const STAGE_THEMES = {
  amber: {
    skyTop: 0x111113,
    skyMid: 0x1f1c19,
    skyBot: 0x0b0a09,
    wallTop: "#141312",
    wallMid: "#211d18",
    wallBot: "#12100e",
    gridMinor: "rgba(245, 158, 11, 0.07)",
    gridMajor: "rgba(245, 158, 11, 0.20)",
    crosshair: "rgba(251, 191, 36, 0.42)",
    cadStroke: "rgba(245, 158, 11, 0.18)",
    wallText: "rgba(251, 191, 36, 0.38)",
    wallLabel: "WORKSHOP // GRAPHITE & AMBER",
    nodeColor1: 0xfbbf24,
    nodeColor2: 0xa8a29e,
    hemiSky: 0xfffbeb,
    hemiGround: 0x1c1917,
    keyColor: 0xfff7ed,
    rimColor: 0xf59e0b,
    slabs: [0x27272a, 0x2e2c29, 0x232220, 0x2b2927],
    seam: 0x121110,
    matBg: "#181614",
    matGrid: "rgba(245, 158, 11, 0.16)",
    matBorder: "rgba(245, 158, 11, 0.72)",
    bumper: 0x18181b,
    led: 0xfbbf24,
    bolt: 0xd6d3d1,
    screenFrame: 0x27272a,
    screenBg: "#11100f",
    screenHeader: "#29231c",
    screenLed: "#fbbf24",
  },
  "clean-lab": {
    skyTop: 0xcbd5e1,
    skyMid: 0xe2e8f0,
    skyBot: 0x94a3b8,
    wallTop: "#d8dee9",
    wallMid: "#eceff4",
    wallBot: "#cbd5e1",
    gridMinor: "rgba(30, 41, 59, 0.06)",
    gridMajor: "rgba(30, 41, 59, 0.16)",
    crosshair: "rgba(249, 115, 22, 0.55)",
    cadStroke: "rgba(30, 41, 59, 0.15)",
    wallText: "rgba(30, 41, 59, 0.48)",
    wallLabel: "CLEAN LAB // WHITE & TITANIUM",
    nodeColor1: 0xf97316,
    nodeColor2: 0x475569,
    hemiSky: 0xffffff,
    hemiGround: 0x94a3b8,
    keyColor: 0xffffff,
    rimColor: 0xf97316,
    slabs: [0xe2e8f0, 0xf1f5f9, 0xd8e0ea, 0xeef2f6],
    seam: 0x475569,
    matBg: "#1e293b",
    matGrid: "rgba(248, 250, 252, 0.12)",
    matBorder: "rgba(249, 115, 22, 0.85)",
    bumper: 0x1e293b,
    led: 0xf97316,
    bolt: 0x475569,
    screenFrame: 0x334155,
    screenBg: "#0f172a",
    screenHeader: "#1e293b",
    screenLed: "#f97316",
  },
  "olive-copper": {
    skyTop: 0x0f1410,
    skyMid: 0x1b241d,
    skyBot: 0x090d0a,
    wallTop: "#111713",
    wallMid: "#1b261e",
    wallBot: "#0e1310",
    gridMinor: "rgba(217, 119, 6, 0.08)",
    gridMajor: "rgba(217, 119, 6, 0.22)",
    crosshair: "rgba(245, 158, 11, 0.45)",
    cadStroke: "rgba(214, 211, 209, 0.15)",
    wallText: "rgba(245, 158, 11, 0.40)",
    wallLabel: "BUNKER // OLIVE & COPPER",
    nodeColor1: 0xd97706,
    nodeColor2: 0xa8a29e,
    hemiSky: 0xfef3c7,
    hemiGround: 0x141c16,
    keyColor: 0xffedd5,
    rimColor: 0xd97706,
    slabs: [0x242f27, 0x2b372e, 0x1f2922, 0x28342b],
    seam: 0x0f1411,
    matBg: "#131a15",
    matGrid: "rgba(217, 119, 6, 0.16)",
    matBorder: "rgba(217, 119, 6, 0.78)",
    bumper: 0x18201a,
    led: 0xd97706,
    bolt: 0xb45309,
    screenFrame: 0x28342b,
    screenBg: "#0d120e",
    screenHeader: "#232e25",
    screenLed: "#f59e0b",
  },
  "obsidian-mint": {
    skyTop: 0x0b0b0d,
    skyMid: 0x151519,
    skyBot: 0x060608,
    wallTop: "#0c0c0e",
    wallMid: "#16161a",
    wallBot: "#09090b",
    gridMinor: "rgba(16, 185, 129, 0.07)",
    gridMajor: "rgba(16, 185, 129, 0.20)",
    crosshair: "rgba(52, 211, 153, 0.42)",
    cadStroke: "rgba(161, 161, 170, 0.14)",
    wallText: "rgba(52, 211, 153, 0.38)",
    wallLabel: "STUDIO // OBSIDIAN & MINT",
    nodeColor1: 0x10b981,
    nodeColor2: 0x71717a,
    hemiSky: 0xecfdf5,
    hemiGround: 0x111113,
    keyColor: 0xfafafa,
    rimColor: 0x10b981,
    slabs: [0x1c1c21, 0x232329, 0x18181c, 0x202026],
    seam: 0x09090b,
    matBg: "#111114",
    matGrid: "rgba(16, 185, 129, 0.16)",
    matBorder: "rgba(16, 185, 129, 0.72)",
    bumper: 0x141418,
    led: 0x10b981,
    bolt: 0x71717a,
    screenFrame: 0x27272a,
    screenBg: "#0b0b0e",
    screenHeader: "#18181c",
    screenLed: "#10b981",
  },
};

// ==================== MATEMÁTICA & EASINGS DETERMINÍSTICOS ====================

export function rng(seed = 42) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const hash = (i, k = 1) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const seg = (t, t0, t1) => (t1 <= t0 ? (t >= t0 ? 1 : 0) : clamp((t - t0) / (t1 - t0)));

export const E = {
  lin: (k) => k,
  expoOut: (k) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k)),
  p2in: (k) => k * k,
  p2out: (k) => 1 - (1 - k) * (1 - k),
  p2io: (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2),
  p3io: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  backOut: (k) => 1 + 2.70158 * Math.pow(k - 1, 3) + 1.70158 * Math.pow(k - 1, 2),
};

export const shake = (t, t0, amp = 0.08, dur = 0.4) =>
  t < t0 || t > t0 + dur ? 0 : amp * (1 - (t - t0) / dur) * Math.sin((t - t0) * 72);

// ==================== PRIMITIVAS SÓLIDAS + BORDA ====================

export function createMaterials(THREE) {
  const fill = (c, r = 0.42, m = 0.35) =>
    new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
  const edge = (c = 0x18181b, o = 0.55) =>
    new THREE.LineBasicMaterial({ color: c, transparent: o < 1, opacity: o });
  return {
    fill,
    edge,
    claude: fill(PALETTE.claude),
    paper: fill(PALETTE.paper, 0.7),
    slate: fill(PALETTE.slate, 0.5),
    wood: fill(PALETTE.steel, 0.45, 0.55),
    green: fill(PALETTE.green, 0.4),
    red: fill(PALETTE.red, 0.4),
    amber: fill(PALETTE.amber, 0.4),
    cyan: fill(PALETTE.cyan, 0.4),
    darkEdge: edge(0x090d16, 0.65),
    lightEdge: edge(0xfbbf24, 0.45),
    redEdge: edge(PALETTE.red, 0.95),
    greenEdge: edge(PALETTE.green, 0.95),
  };
}

export function solid(THREE, geom, mat, edgeMat = null, castShadow = true) {
  const g = new THREE.Group();
  const mesh = new THREE.Mesh(geom, mat);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  g.add(mesh);
  g.userData.mesh = mesh;
  if (edgeMat) {
    const line = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 24), edgeMat);
    g.add(line);
    g.userData.line = line;
  }
  return g;
}

// ==================== 1. PALCO CONFIGURÁVEL POR TEMA ====================

function createWallTexture(THREE, cfg) {
  const c = document.createElement("canvas");
  c.width = 1600;
  c.height = 1000;
  const ctx = c.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, 0, c.height);
  grad.addColorStop(0, cfg.wallTop);
  grad.addColorStop(0.55, cfg.wallMid);
  grad.addColorStop(1, cfg.wallBot);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, c.width, c.height);

  // Grade menor
  ctx.strokeStyle = cfg.gridMinor;
  ctx.lineWidth = 1;
  for (let x = 0; x <= c.width; x += 25) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, c.height);
    ctx.stroke();
  }
  for (let y = 0; y <= c.height; y += 25) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(c.width, y);
    ctx.stroke();
  }

  // Grade principal (100px)
  ctx.strokeStyle = cfg.gridMajor;
  ctx.lineWidth = 2;
  for (let x = 0; x <= c.width; x += 100) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, c.height);
    ctx.stroke();
  }
  for (let y = 0; y <= c.height; y += 100) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(c.width, y);
    ctx.stroke();
  }

  // Crosshairs '+'
  ctx.strokeStyle = cfg.crosshair;
  ctx.lineWidth = 2;
  for (let x = 100; x < c.width; x += 200) {
    for (let y = 100; y < c.height; y += 200) {
      ctx.beginPath();
      ctx.moveTo(x - 8, y);
      ctx.lineTo(x + 8, y);
      ctx.moveTo(x, y - 8);
      ctx.lineTo(x, y + 8);
      ctx.stroke();
    }
  }

  // Diagramas circulares técnicos sutis
  ctx.strokeStyle = cfg.cadStroke;
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 8]);
  [
    [320, 420, 170],
    [1280, 420, 190],
    [800, 360, 290],
  ].forEach(([cx, cy, r]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  ctx.fillStyle = cfg.wallText;
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillText(cfg.wallLabel, 60, 64);
  ctx.fillText("SCALE 1:10  |  SEC-01", 1260, 64);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createDioramaStage(THREE, canvasEl, themeName = "amber") {
  const cfg = STAGE_THEMES[themeName] || STAGE_THEMES.amber;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(1);
  renderer.setSize(1080, 1920, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(cfg.skyMid, 18, 52);

  const cam = new THREE.PerspectiveCamera(42, 1080 / 1920, 0.1, 200);

  // Domo de fundo
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      top: { value: new THREE.Color(cfg.skyTop) },
      mid: { value: new THREE.Color(cfg.skyMid) },
      bottom: { value: new THREE.Color(cfg.skyBot) },
    },
    vertexShader:
      "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader:
      "uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; varying vec3 vP;\nvoid main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(mid, top, pow(h, 0.6)) : mix(mid, bottom, pow(-h, 0.5)); gl_FragColor = vec4(c, 1.0);\n#include <colorspace_fragment>\n}",
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(90, 24, 16), skyMat);
  sky.renderOrder = -1;
  scene.add(sky);

  // Iluminação do tema
  const hemi = new THREE.HemisphereLight(cfg.hemiSky, cfg.hemiGround, 1.65);
  const key = new THREE.DirectionalLight(cfg.keyColor, 2.75);
  key.position.set(8, 16, 11);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 45 });
  key.shadow.bias = -0.0005;

  const rim = new THREE.DirectionalLight(cfg.rimColor, 1.45);
  rim.position.set(-10, 9, -10);
  scene.add(hemi, key, key.target, rim);

  // Bancada 3D (y = 0 é o topo da bancada)
  const desk = new THREE.Group();
  const seamMat = new THREE.MeshStandardMaterial({ color: cfg.seam, roughness: 0.8, metalness: 0.2 });

  for (let i = -8; i <= 8; i++) {
    const pMat = new THREE.MeshStandardMaterial({
      color: cfg.slabs[Math.abs(i) % cfg.slabs.length],
      roughness: 0.45,
      metalness: 0.48,
    });
    const plate = new THREE.Mesh(new THREE.BoxGeometry(28, 0.42, 1.14), pMat);
    plate.position.set(0, -0.21, i * 1.2);
    plate.receiveShadow = true;
    desk.add(plate);

    const seam = new THREE.Mesh(new THREE.BoxGeometry(28, 0.40, 0.06), seamMat);
    seam.position.set(0, -0.21, i * 1.2 + 0.6);
    desk.add(seam);
  }

  // Tapete técnico central na bancada
  const matCanvas = document.createElement("canvas");
  matCanvas.width = 1024;
  matCanvas.height = 640;
  const mctx = matCanvas.getContext("2d");
  mctx.fillStyle = cfg.matBg;
  mctx.fillRect(0, 0, 1024, 640);
  mctx.strokeStyle = cfg.matGrid;
  mctx.lineWidth = 2;
  for (let x = 0; x <= 1024; x += 64) {
    mctx.beginPath();
    mctx.moveTo(x, 0);
    mctx.lineTo(x, 640);
    mctx.stroke();
  }
  for (let y = 0; y <= 640; y += 64) {
    mctx.beginPath();
    mctx.moveTo(0, y);
    mctx.lineTo(1024, y);
    mctx.stroke();
  }
  mctx.strokeStyle = cfg.matBorder;
  mctx.lineWidth = 8;
  mctx.strokeRect(16, 16, 992, 608);

  const matTex = new THREE.CanvasTexture(matCanvas);
  matTex.colorSpace = THREE.SRGBColorSpace;
  const workMat = new THREE.Mesh(
    new THREE.PlaneGeometry(9.6, 5.4),
    new THREE.MeshStandardMaterial({ map: matTex, roughness: 0.65, metalness: 0.15 })
  );
  workMat.rotation.x = -Math.PI / 2;
  workMat.position.set(0, 0.005, 0.2);
  workMat.receiveShadow = true;
  desk.add(workMat);

  // Viga frontal + barra de LED de status
  const bumperMat = new THREE.MeshStandardMaterial({ color: cfg.bumper, roughness: 0.4, metalness: 0.65 });
  const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(16, 0.48, 0.36), bumperMat);
  frontBumper.position.set(0, -0.22, 3.15);
  desk.add(frontBumper);

  const deskLedMat = new THREE.MeshBasicMaterial({ color: cfg.led });
  const deskLed = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.07, 0.38), deskLedMat);
  deskLed.position.set(0, -0.12, 3.16);
  desk.add(deskLed);

  // Rebites / Parafusos sextavados na bancada
  const boltMat = new THREE.MeshStandardMaterial({ color: cfg.bolt, roughness: 0.3, metalness: 0.8 });
  const boltGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 6);
  for (let bx = -4.4; bx <= 4.4; bx += 2.2) {
    const b1 = new THREE.Mesh(boltGeom, boltMat);
    b1.position.set(bx, 0.02, 2.75);
    desk.add(b1);
  }
  scene.add(desk);

  // Parede de fundo + nós luminosos
  const bgWall = new THREE.Group();
  const bpPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(34, 21),
    new THREE.MeshBasicMaterial({ map: createWallTexture(THREE, cfg) })
  );
  bpPlane.position.set(0, 6.2, -10.8);
  bgWall.add(bpPlane);

  const r = rng(202);
  const nodeGeom = new THREE.RingGeometry(0.11, 0.18, 6);
  for (let x = -12; x <= 12; x += 2.4) {
    for (let y = 1.2; y <= 12; y += 1.8) {
      if (r() < 0.55) continue;
      const m = new THREE.MeshBasicMaterial({
        color: r() > 0.25 ? cfg.nodeColor1 : cfg.nodeColor2,
        transparent: true,
        opacity: 0.24 + r() * 0.35,
        side: THREE.DoubleSide,
      });
      const node = new THREE.Mesh(nodeGeom, m);
      node.position.set(x, y, -10.2);
      node.userData.baseOp = m.opacity;
      node.userData.phase = r() * Math.PI * 2;
      bgWall.add(node);
    }
  }
  scene.add(bgWall);

  function updateStage(t, alarmLevel = 0) {
    const al = clamp(alarmLevel);
    for (let i = 1; i < bgWall.children.length; i++) {
      const w = bgWall.children[i];
      w.material.opacity = w.userData.baseOp * (0.7 + 0.3 * Math.sin(t * 2.4 + w.userData.phase));
      w.material.color.setHex(al > 0.3 ? PALETTE.red : cfg.nodeColor1);
    }
    deskLedMat.color.setHex(al > 0.3 ? PALETTE.red : cfg.led);
    key.color.setHex(cfg.keyColor).lerp(new THREE.Color(PALETTE.red), al * 0.5);
  }

  return { renderer, scene, cam, sky, key, desk, bgWall, updateStage, themeConfig: cfg };
}

// ==================== 2. ROBÔS CÁPSULA / DROIDES EXPRESSIVOS ====================

function drawDroidVisor(ctx, mode, blink, accentHex = "#38bdf8") {
  const W = 256;
  const H = 128;
  ctx.fillStyle = "#040811";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  for (let y = 0; y < H; y += 6) {
    ctx.fillRect(0, y, W, 2);
  }

  const isPanic = mode === "panic";
  const isHappy = mode === "celebrate" || mode === "stamp";
  const isPoint = mode === "point";
  const eyeColor = isPanic ? "#ff4d4d" : isHappy ? "#22c55e" : accentHex;

  ctx.strokeStyle = isPanic ? "rgba(255, 77, 77, 0.55)" : "rgba(255, 255, 255, 0.22)";
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, W - 12, H - 12);

  ctx.strokeStyle = eyeColor;
  ctx.fillStyle = eyeColor;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (isPanic) {
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(54, 38);
    ctx.lineTo(94, 64);
    ctx.lineTo(54, 90);
    ctx.moveTo(202, 38);
    ctx.lineTo(162, 64);
    ctx.lineTo(202, 90);
    ctx.stroke();
  } else if (isHappy) {
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.arc(76, 76, 26, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(180, 76, 26, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  } else if (isPoint) {
    ctx.fillRect(50, 56, 52, 16);
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(180, 64, 24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(180, 64, 8, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const eh = Math.max(6, Math.round(44 * blink));
    const ey = 64 - Math.round(eh / 2);
    ctx.beginPath();
    ctx.roundRect(54, ey, 42, eh, 18);
    ctx.roundRect(160, ey, 42, eh, 18);
    ctx.fill();

    if (blink > 0.5) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(68, ey + 12, 5, 0, Math.PI * 2);
      ctx.arc(174, ey + 12, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function createBlockAgent(THREE, opts = {}) {
  const {
    role = "coder", // "coder" | "hacker" | "senior" | "tester" | "boss" | "user"
    color = PALETTE.claude,
    scale = 1,
    labelText = "",
  } = opts;

  const root = new THREE.Group();
  root.scale.setScalar(scale);

  const roleColor =
    color !== PALETTE.claude
      ? color
      : role === "hacker"
      ? 0xa855f7
      : role === "senior"
      ? 0xf97316
      : role === "tester"
      ? 0xeab308
      : role === "boss"
      ? 0xef4444
      : 0x38bdf8;

  const bodyMat = new THREE.MeshStandardMaterial({
    color: roleColor,
    roughness: 0.32,
    metalness: 0.28,
  });
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.45,
    metalness: 0.55,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.25,
    metalness: 0.75,
  });
  const glowMat = new THREE.MeshBasicMaterial({ color: roleColor });

  const rig = new THREE.Group();
  root.add(rig);

  // 1. Anel propulsor de levitação na base
  const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.50, 0.12, 24), chassisMat);
  baseRing.position.set(0, 0.08, 0);
  baseRing.castShadow = true;
  rig.add(baseRing);

  const thrusterGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.04, 24), glowMat);
  thrusterGlow.position.set(0, 0.02, 0);
  rig.add(thrusterGlow);

  // 2. Torso Cápsula Arredondado
  const torso = new THREE.Group();
  torso.position.set(0, 0.72, 0);
  rig.add(torso);

  const capsuleBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.46, 0.42, 12, 24), bodyMat);
  capsuleBody.castShadow = true;
  capsuleBody.receiveShadow = true;
  torso.add(capsuleBody);

  const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.34, 0.14), chassisMat);
  chestPlate.position.set(0, 0.02, 0.40);
  torso.add(chestPlate);

  const coreLight = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.16, 16), glowMat);
  coreLight.rotation.x = Math.PI / 2;
  coreLight.position.set(0, 0.02, 0.41);
  torso.add(coreLight);

  const neckRing = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.10, 20), chassisMat);
  neckRing.position.set(0, 0.46, 0);
  torso.add(neckRing);

  // 3. Cabeça Domo + Visor Digital Curvo de LED
  const head = new THREE.Group();
  head.position.set(0, 0.86, 0);
  torso.add(head);

  const headDome = new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 18), bodyMat);
  headDome.scale.set(1.14, 0.90, 0.98);
  headDome.castShadow = true;
  head.add(headDome);

  const visorBezel = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.42, 0.18), chassisMat);
  visorBezel.position.set(0, 0.0, 0.38);
  head.add(visorBezel);

  const visorCanvas = document.createElement("canvas");
  visorCanvas.width = 256;
  visorCanvas.height = 128;
  const vctx = visorCanvas.getContext("2d");
  const visorTex = new THREE.CanvasTexture(visorCanvas);
  visorTex.colorSpace = THREE.SRGBColorSpace;

  const accentCss = "#" + new THREE.Color(roleColor).getHexString();
  drawDroidVisor(vctx, "idle", 1, accentCss);
  visorTex.needsUpdate = true;

  const visorScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.70, 0.35),
    new THREE.MeshBasicMaterial({ map: visorTex })
  );
  visorScreen.position.set(0, 0.0, 0.48);
  head.add(visorScreen);

  // 4. Braços Cápsula Flutuantes Articulados
  const armGeom = new THREE.CapsuleGeometry(0.12, 0.34, 8, 16);
  const armL = new THREE.Group();
  armL.position.set(-0.68, 0.92, 0);
  const armLMesh = new THREE.Mesh(armGeom, bodyMat);
  armLMesh.castShadow = true;
  armLMesh.position.y = -0.18;
  armL.add(armLMesh);

  const armR = new THREE.Group();
  armR.position.set(0.68, 0.92, 0);
  const armRMesh = new THREE.Mesh(armGeom, bodyMat);
  armRMesh.castShadow = true;
  armRMesh.position.y = -0.18;
  armR.add(armRMesh);
  rig.add(armL, armR);

  // 5. Acessórios por Papel (Role)
  if (role === "hacker") {
    const hoodBrow = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.14, 0.26), chassisMat);
    hoodBrow.position.set(0, 0.20, 0.38);
    head.add(hoodBrow);
    const antMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const antL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.32, 8), antMat);
    antL.position.set(-0.28, 0.48, 0);
    antL.rotation.z = 0.25;
    const antR = antL.clone();
    antR.position.x = 0.28;
    antR.rotation.z = -0.25;
    head.add(antL, antR);
  } else if (role === "senior") {
    const badgeMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.25, metalness: 0.8 });
    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.14), badgeMat);
    crest.position.set(0, 0.38, 0.22);
    head.add(crest);
    const earL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 16), chromeMat);
    earL.rotation.z = Math.PI / 2;
    earL.position.set(-0.54, 0.0, 0);
    const earR = earL.clone();
    earR.position.x = 0.54;
    head.add(earL, earR);
  } else if (role === "tester") {
    const helmMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.2 });
    const helm = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.44, 0.20, 20), helmMat);
    helm.position.set(0, 0.38, 0);
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    beacon.position.set(0, 0.50, 0);
    head.add(helm, beacon);
  } else if (role === "boss") {
    const crownMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.25, metalness: 0.85 });
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.24, 0.18, 6), crownMat);
    crown.position.set(0, 0.44, 0);
    head.add(crown);
  } else {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.24, 8), chromeMat);
    stem.position.set(0, 0.46, 0);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), glowMat);
    tip.position.set(0, 0.60, 0);
    head.add(stem, tip);
  }

  // Placa de identificação metálica acima do droide (sem sobrepor antena/capacete)
  if (labelText) {
    const badge = createFloatingLabel(THREE, labelText, {
      bg: "#18181b",
      fg: "#f8fafc",
      border: accentCss,
      worldH: 0.25,
    });
    badge.position.set(0, 2.38, 0);
    rig.add(badge);
  }

  let lastVisorKey = "";

  function act(t, mode = "idle", seedOffset = 0) {
    const ph = t * 4 + seedOffset;
    const blink = Math.sin(t * 1.85 + seedOffset) > 0.95 ? 0.12 : 1;
    const vKey = `${mode}:${blink < 0.5 ? 0 : 1}`;
    if (vKey !== lastVisorKey) {
      lastVisorKey = vKey;
      drawDroidVisor(vctx, mode, blink, accentCss);
      visorTex.needsUpdate = true;
    }

    rig.position.set(0, 0, 0);
    rig.rotation.set(0, 0, 0);
    head.rotation.set(0, 0, 0);
    armL.rotation.set(0, 0, 0);
    armR.rotation.set(0, 0, 0);

    if (mode === "idle") {
      rig.position.y = 0.06 + Math.sin(ph * 0.65) * 0.05;
      head.rotation.y = Math.sin(ph * 0.4) * 0.08;
      armL.rotation.x = Math.sin(ph * 0.65) * 0.12;
      armR.rotation.x = -Math.sin(ph * 0.65) * 0.12;
    } else if (mode === "type") {
      rig.position.y = 0.06 + Math.abs(Math.sin(ph * 2.0)) * 0.04;
      head.rotation.x = 0.08;
      armL.rotation.x = -0.95 + Math.sin(t * 28 + seedOffset) * 0.35;
      armR.rotation.x = -0.95 + Math.cos(t * 28 + seedOffset) * 0.35;
    } else if (mode === "panic") {
      rig.position.y = 0.08 + Math.abs(Math.sin(t * 18)) * 0.18;
      rig.rotation.z = Math.sin(t * 22) * 0.14;
      head.rotation.z = Math.sin(t * 26) * 0.18;
      armL.rotation.z = 2.45 + Math.sin(t * 30) * 0.3;
      armR.rotation.z = -2.45 - Math.sin(t * 30) * 0.3;
    } else if (mode === "point") {
      rig.position.y = 0.07 + Math.sin(ph * 0.8) * 0.04;
      rig.rotation.y = -0.22;
      head.rotation.y = -0.12;
      armR.rotation.x = -1.45;
      armR.rotation.z = -0.2 + Math.sin(t * 10) * 0.08;
    } else if (mode === "celebrate") {
      rig.position.y = 0.08 + Math.abs(Math.sin(t * 10 + seedOffset)) * 0.26;
      rig.rotation.y = Math.sin(t * 5) * 0.25;
      armL.rotation.z = 2.55;
      armR.rotation.z = -2.55;
    } else if (mode === "stamp") {
      const hit = Math.sin(t * 8);
      armR.rotation.x = hit > 0 ? -1.6 : -0.3;
      rig.position.y = hit > 0 ? 0.12 : 0.04;
    }
  }

  return { group: root, rig, torso, armL, armR, act };
}

// ==================== 3. MONITORES INDUSTRIAIS / TELAS DE CÓDIGO 3D ====================

export function createCodeScreen(THREE, opts = {}) {
  const {
    title = "app.py",
    lines = ["import ia_lab", "res = agent.run()", "return res"],
    status = "normal", // "normal" | "error" | "ok"
    width = 3.6,
    height = 2.4,
    theme = "amber",
  } = opts;

  const cfg = STAGE_THEMES[theme] || STAGE_THEMES.amber;
  const group = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({ color: cfg.screenFrame, roughness: 0.4, metalness: 0.65 });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x09090b, transparent: true, opacity: 0.8 });
  const body = solid(THREE, new THREE.BoxGeometry(width + 0.28, height + 0.28, 0.18), frameMat, edgeMat);
  group.add(body);

  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 480;
  const ctx = canvas.getContext("2d");
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;

  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  screenMesh.position.z = 0.095;
  group.add(screenMesh);

  function draw(currStatus = status, highlightLine = -1, badgeText = "") {
    ctx.fillStyle = cfg.screenBg;
    ctx.fillRect(0, 0, 720, 480);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 720; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 60);
      ctx.lineTo(x, 480);
      ctx.stroke();
    }

    ctx.fillStyle = currStatus === "error" ? "#5c141b" : currStatus === "ok" ? "#0f4229" : cfg.screenHeader;
    ctx.fillRect(0, 0, 720, 58);

    ctx.fillStyle = currStatus === "error" ? "#ff4d4d" : currStatus === "ok" ? "#22c55e" : cfg.screenLed;
    ctx.fillRect(24, 18, 22, 22);

    ctx.fillStyle = "#f8fafc";
    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.fillText(title.toUpperCase(), 64, 37);

    lines.forEach((ln, idx) => {
      const y = 112 + idx * 54;
      if (idx === highlightLine) {
        ctx.fillStyle = currStatus === "error" ? "rgba(239, 68, 68, 0.28)" : "rgba(34, 197, 94, 0.25)";
        ctx.fillRect(16, y - 34, 688, 46);
      }
      ctx.fillStyle = "#71717a";
      ctx.font = '600 22px "JetBrains Mono", monospace';
      ctx.fillText(String(idx + 1).padStart(2, "0"), 28, y);

      ctx.fillStyle = idx === highlightLine ? (currStatus === "error" ? "#fca5a5" : "#86efac") : "#f4f4f5";
      ctx.font = '700 25px "JetBrains Mono", monospace';
      ctx.fillText(ln, 78, y);
    });

    if (badgeText) {
      const isErr = currStatus === "error";
      ctx.save();
      ctx.translate(510, 372);
      ctx.rotate(-0.08);
      ctx.fillStyle = isErr ? "#dc2626" : "#16a34a";
      ctx.fillRect(-155, -38, 310, 76);
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 5;
      ctx.strokeRect(-149, -32, 298, 64);
      ctx.fillStyle = "#ffffff";
      ctx.font = '900 31px "Inter", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText(badgeText, 0, 11);
      ctx.restore();
      ctx.textAlign = "left";
    }

    tex.needsUpdate = true;
  }

  draw(status, -1, "");
  return { group, draw };
}

// ==================== 4. SETAS DE FORÇA / FLUXO 3D ====================

export function createFlowArrow(THREE, opts = {}) {
  const { color = PALETTE.red, length = 1.8, thickness = 0.22 } = opts;
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.35,
    metalness: 0.3,
    emissive: color,
    emissiveIntensity: 0.25,
  });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x090d16, transparent: true, opacity: 0.65 });

  const shaftLen = Math.max(0.4, length - 0.55);
  const shaft = solid(THREE, new THREE.BoxGeometry(shaftLen, thickness, thickness), mat, edgeMat);
  shaft.position.x = shaftLen / 2;

  const headGeom = new THREE.ConeGeometry(thickness * 1.45, 0.58, 4);
  headGeom.rotateZ(-Math.PI / 2);
  const head = solid(THREE, headGeom, mat, edgeMat);
  head.position.x = shaftLen + 0.28;

  g.add(shaft, head);

  function setColor(hex) {
    mat.color.setHex(hex);
    mat.emissive.setHex(hex);
  }

  function pulse(t, speed = 8, amp = 0.14) {
    g.position.x = Math.sin(t * speed) * amp;
  }

  return { group: g, setColor, pulse };
}

// ==================== 5. PLACAS METÁLICAS 3D FLUTUANTES ====================

export function createFloatingLabel(THREE, text, opts = {}) {
  const { bg = "#18181b", fg = "#f8fafc", border = "#fbbf24", worldH = 0.48 } = opts;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  const px = 70;
  ctx.font = `900 ${px}px "Inter", sans-serif`;
  const tw = Math.ceil(ctx.measureText(text).width);
  c.width = tw + 88;
  c.height = 120;

  ctx.fillStyle = bg;
  ctx.fillRect(6, 6, c.width - 12, c.height - 12);
  ctx.lineWidth = 8;
  ctx.strokeStyle = border;
  ctx.strokeRect(6, 6, c.width - 12, c.height - 12);

  ctx.fillStyle = fg;
  ctx.font = `900 ${px}px "Inter", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, c.width / 2, c.height / 2 + 3);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const w = (worldH * c.width) / c.height;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(w, worldH),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true })
  );
}

// ==================== 6. SISTEMA DE CÂMERA (SHOTS + HANDHELD + SHAKE) ====================

export function applyCameraShot(THREE, cam, sky, shots, t, extraShake = 0) {
  const s = shots.find((q) => t >= q.a && t < q.b) || shots[shots.length - 1];
  const easeFn = E[s.ease || "p2io"] || E.p2io;
  const k = easeFn(seg(t, s.a, s.b));

  const p0 = new THREE.Vector3(...s.p0);
  const p1 = new THREE.Vector3(...s.p1);
  const l0 = new THREE.Vector3(...s.l0);
  const l1 = new THREE.Vector3(...s.l1);

  const pos = p0.lerp(p1, k);
  const look = l0.lerp(l1, k);

  const dist = pos.distanceTo(look);
  const hand = 0.0045 * dist;
  pos.x += hand * Math.sin(t * 1.6) + extraShake;
  pos.y += hand * Math.cos(t * 2.1);

  cam.position.copy(pos);
  cam.up.set(0, 1, 0);
  cam.lookAt(look);
  if (sky) sky.position.copy(cam.position);
}
