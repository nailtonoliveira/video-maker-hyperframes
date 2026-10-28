/**
 * IA-Lab 3D Diorama Kit (Three.js r184+)
 * Biblioteca determinística de alto nível para construir episódios do nicho ia-lab
 * (mescla de diorama quente estilo clubedasskills + engenharia em etapas estilo comoconstroi).
 *
 * REGRAS:
 * - Zero Math.random() sem seed.
 * - Tudo no render(t) é função pura de t (segundos).
 */

export const PALETTE = {
  nightTop: 0x0b0f1d,
  nightMid: 0x161f38,
  nightBot: 0x0a0d18,
  wood: 0x6e4726,
  woodDark: 0x4b2e16,
  woodPlank: 0x7d522d,
  claude: 0xd96b43,
  claudeDark: 0xa84b2a,
  paper: 0xf4efe6,
  ink: 0x18181b,
  slate: 0x1e2536,
  screenBg: 0x0d111a,
  green: 0x2ecc71,
  red: 0xe74c3c,
  amber: 0xf39c12,
  cyan: 0x38bdf8,
  purple: 0x9b59b6,
  white: 0xffffff,
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
  const fill = (c, r = 0.82, m = 0.05) =>
    new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m, flatShading: true });
  const edge = (c = 0x18181b, o = 0.55) =>
    new THREE.LineBasicMaterial({ color: c, transparent: o < 1, opacity: o });
  return {
    fill,
    edge,
    claude: fill(PALETTE.claude),
    paper: fill(PALETTE.paper, 0.9),
    slate: fill(PALETTE.slate, 0.75),
    wood: fill(PALETTE.wood, 0.88),
    green: fill(PALETTE.green, 0.65),
    red: fill(PALETTE.red, 0.65),
    amber: fill(PALETTE.amber, 0.65),
    cyan: fill(PALETTE.cyan, 0.65),
    darkEdge: edge(0x111111, 0.65),
    lightEdge: edge(0xffffff, 0.45),
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
    const line = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 22), edgeMat);
    g.add(line);
    g.userData.line = line;
  }
  return g;
}

// ==================== 1. PALCO DIORAMA (MESA DE MADEIRA + CIDADE NOTURNA) ====================

export function createDioramaStage(THREE, canvasEl) {
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
  scene.fog = new THREE.Fog(PALETTE.nightMid, 16, 48);

  const cam = new THREE.PerspectiveCamera(42, 1080 / 1920, 0.1, 200);

  // Domo de céu noturno
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      top: { value: new THREE.Color(PALETTE.nightTop) },
      mid: { value: new THREE.Color(PALETTE.nightMid) },
      bottom: { value: new THREE.Color(PALETTE.nightBot) },
    },
    vertexShader:
      "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader:
      "uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; varying vec3 vP;\nvoid main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(mid, top, pow(h, 0.6)) : mix(mid, bottom, pow(-h, 0.5)); gl_FragColor = vec4(c, 1.0);\n#include <colorspace_fragment>\n}",
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(90, 24, 16), skyMat);
  sky.renderOrder = -1;
  scene.add(sky);

  // Iluminação quente de bancada + rim azulado
  const hemi = new THREE.HemisphereLight(0xffeedd, 0x161f38, 1.55);
  const key = new THREE.DirectionalLight(0xfff0d6, 2.8);
  key.position.set(8, 16, 11);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 45 });
  key.shadow.bias = -0.0005;

  const rim = new THREE.DirectionalLight(0x5eaeff, 1.15);
  rim.position.set(-10, 8, -10);
  scene.add(hemi, key, key.target, rim);

  // Mesa de madeira em tábuas (y = 0 é o topo da mesa)
  const desk = new THREE.Group();
  const plankColors = [0x6e4726, 0x764c29, 0x654021, 0x7b502c];
  for (let i = -8; i <= 8; i++) {
    const pMat = new THREE.MeshStandardMaterial({
      color: plankColors[Math.abs(i) % plankColors.length],
      roughness: 0.88,
      metalness: 0.04,
      flatShading: true,
    });
    const plank = new THREE.Mesh(new THREE.BoxGeometry(28, 0.4, 1.16), pMat);
    plank.position.set(0, -0.2, i * 1.2);
    plank.receiveShadow = true;
    desk.add(plank);
  }
  scene.add(desk);

  // Parede de fundo com janelas/pixels luminosos (estilo clubedasskills)
  const bgWall = new THREE.Group();
  const r = rng(101);
  const winColors = [0xffd43b, 0x38bdf8, 0xe06c3e, 0x2ecc71, 0xf4efe6];
  const winGeom = new THREE.PlaneGeometry(0.46, 0.32);
  for (let x = -14; x <= 14; x += 1.1) {
    for (let y = 0.8; y <= 14; y += 0.75) {
      if (r() < 0.42) continue;
      const col = winColors[Math.floor(r() * winColors.length)];
      const m = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.25 + r() * 0.45,
      });
      const w = new THREE.Mesh(winGeom, m);
      w.position.set(x + (r() - 0.5) * 0.2, y, -9.5 - (r() - 0.5) * 1.5);
      w.userData.baseOp = m.opacity;
      w.userData.phase = r() * Math.PI * 2;
      bgWall.add(w);
    }
  }
  scene.add(bgWall);

  function updateStage(t, alarmLevel = 0) {
    // Pulso sutil nas luzes de fundo
    for (const w of bgWall.children) {
      w.material.opacity = w.userData.baseOp * (0.75 + 0.25 * Math.sin(t * 2.2 + w.userData.phase));
    }
    key.color.setHex(0xfff0d6).lerp(new THREE.Color(PALETTE.red), clamp(alarmLevel) * 0.55);
  }

  return { renderer, scene, cam, sky, key, desk, bgWall, updateStage };
}

// ==================== 2. AGENTE EM BLOCOS (ESTILO CLAUDE / DEV VOXEL) ====================

export function createBlockAgent(THREE, opts = {}) {
  const {
    role = "coder", // "coder" | "hacker" | "senior" | "tester" | "boss" | "user"
    color = PALETTE.claude,
    scale = 1,
    labelText = "",
  } = opts;

  const root = new THREE.Group();
  root.scale.setScalar(scale);

  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.78, flatShading: true });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9, flatShading: true });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xfaf7f0, roughness: 0.85, flatShading: true });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x141414, transparent: true, opacity: 0.5 });

  const rig = new THREE.Group();
  root.add(rig);

  // Pernas / Pés
  const legGeom = new THREE.BoxGeometry(0.28, 0.36, 0.32);
  const legL = solid(THREE, legGeom, bodyMat, edgeMat);
  legL.position.set(-0.32, 0.18, 0);
  const legR = solid(THREE, legGeom, bodyMat, edgeMat);
  legR.position.set(0.32, 0.18, 0);
  rig.add(legL, legR);

  // Corpo cúbico principal
  const torso = solid(THREE, new THREE.BoxGeometry(1.25, 1.15, 0.95), bodyMat, edgeMat);
  torso.position.set(0, 0.92, 0);
  rig.add(torso);

  // Olhos pixelados
  const eyeGeom = new THREE.BoxGeometry(0.14, 0.24, 0.06);
  const eyeL = new THREE.Mesh(eyeGeom, darkMat);
  eyeL.position.set(-0.26, 0.1, 0.49);
  const eyeR = new THREE.Mesh(eyeGeom, darkMat);
  eyeR.position.set(0.26, 0.1, 0.49);
  torso.add(eyeL, eyeR);

  // Braços articulados
  const armGeom = new THREE.BoxGeometry(0.24, 0.62, 0.26);
  const armL = new THREE.Group();
  armL.position.set(-0.74, 1.12, 0);
  const armLMesh = solid(THREE, armGeom, bodyMat, edgeMat);
  armLMesh.position.y = -0.22;
  armL.add(armLMesh);

  const armR = new THREE.Group();
  armR.position.set(0.74, 1.12, 0);
  const armRMesh = solid(THREE, armGeom, bodyMat, edgeMat);
  armRMesh.position.y = -0.22;
  armR.add(armRMesh);
  rig.add(armL, armR);

  // Acessórios por papel (role)
  if (role === "hacker") {
    // Capuz escuro + óculos verde neon
    const hood = solid(THREE, new THREE.BoxGeometry(1.34, 0.45, 1.02), darkMat, edgeMat);
    hood.position.set(0, 0.42, 0);
    const glassMat = new THREE.MeshBasicMaterial({ color: 0x2ecc71 });
    const gL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.18, 0.08), glassMat);
    gL.position.set(-0.26, 0.1, 0.51);
    const gR = gL.clone();
    gR.position.x = 0.26;
    torso.add(hood, gL, gR);
  } else if (role === "senior") {
    // Óculos redondos/quadrados + barba branca + caneca de café
    const beard = solid(THREE, new THREE.BoxGeometry(1.27, 0.38, 0.98), whiteMat, edgeMat);
    beard.position.set(0, -0.36, 0.02);
    const rimG = new THREE.BoxGeometry(0.36, 0.28, 0.08);
    const gL = solid(THREE, rimG, whiteMat, edgeMat);
    gL.position.set(-0.26, 0.1, 0.5);
    const gR = solid(THREE, rimG, whiteMat, edgeMat);
    gR.position.set(0.26, 0.1, 0.5);
    torso.add(beard, gL, gR);
  } else if (role === "tester") {
    // Capacete amarelo de segurança / engenharia (estilo comoconstroi)
    const helmMat = new THREE.MeshStandardMaterial({ color: 0xffd43b, roughness: 0.6, flatShading: true });
    const helm = solid(THREE, new THREE.BoxGeometry(1.32, 0.34, 1.06), helmMat, edgeMat);
    helm.position.set(0, 0.64, 0.04);
    torso.add(helm);
  } else if (role === "boss") {
    // Gravata vermelha + sobrancelha séria
    const tieMat = new THREE.MeshStandardMaterial({ color: PALETTE.red, roughness: 0.7, flatShading: true });
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.48, 0.06), tieMat);
    tie.position.set(0, -0.25, 0.49);
    torso.add(tie);
  } else if (role === "user") {
    // Boné colorido de hélice
    const capMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.7, flatShading: true });
    const cap = solid(THREE, new THREE.BoxGeometry(1.28, 0.26, 0.98), capMat, edgeMat);
    cap.position.set(0, 0.62, 0);
    torso.add(cap);
  }

  if (labelText) {
    const badge = createFloatingLabel(THREE, labelText, { bg: "#18181b", fg: "#ffffff", worldH: 0.24 });
    badge.position.set(0, 1.82, 0);
    rig.add(badge);
  }

  /**
   * Anima o agente de forma determinística no tempo t
   * mode: "idle" | "type" | "panic" | "point" | "celebrate" | "stamp"
   */
  function act(t, mode = "idle", seedOffset = 0) {
    const ph = t * 4 + seedOffset;
    // Piscar determinístico a cada ~3.4s
    const blink = Math.sin(t * 1.85 + seedOffset) > 0.96 ? 0.12 : 1;
    eyeL.scale.y = blink;
    eyeR.scale.y = blink;

    rig.position.set(0, 0, 0);
    rig.rotation.set(0, 0, 0);
    armL.rotation.set(0, 0, 0);
    armR.rotation.set(0, 0, 0);

    if (mode === "idle") {
      rig.position.y = Math.abs(Math.sin(ph * 0.6)) * 0.04;
      armL.rotation.x = Math.sin(ph * 0.6) * 0.1;
      armR.rotation.x = -Math.sin(ph * 0.6) * 0.1;
    } else if (mode === "type") {
      rig.position.y = Math.abs(Math.sin(ph * 2.2)) * 0.05;
      armL.rotation.x = -0.9 + Math.sin(t * 28 + seedOffset) * 0.35;
      armR.rotation.x = -0.9 + Math.cos(t * 28 + seedOffset) * 0.35;
    } else if (mode === "panic") {
      rig.position.y = Math.abs(Math.sin(t * 18)) * 0.18;
      rig.rotation.z = Math.sin(t * 22) * 0.14;
      armL.rotation.z = 2.5 + Math.sin(t * 30) * 0.3;
      armR.rotation.z = -2.5 - Math.sin(t * 30) * 0.3;
    } else if (mode === "point") {
      rig.rotation.y = -0.25;
      armR.rotation.x = -1.45;
      armR.rotation.z = -0.2 + Math.sin(t * 10) * 0.08;
    } else if (mode === "celebrate") {
      rig.position.y = Math.abs(Math.sin(t * 10 + seedOffset)) * 0.28;
      rig.rotation.y = Math.sin(t * 5) * 0.25;
      armL.rotation.z = 2.6;
      armR.rotation.z = -2.6;
    } else if (mode === "stamp") {
      const hit = Math.sin(t * 8);
      armR.rotation.x = hit > 0 ? -1.6 : -0.3;
      rig.position.y = hit > 0 ? 0.08 : 0;
    }
  }

  return { group: root, rig, torso, armL, armR, act };
}

// ==================== 3. TELAS DE CÓDIGO / TERMINAL / CHECKLIST 3D ====================

export function createCodeScreen(THREE, opts = {}) {
  const {
    title = "app.py",
    lines = ["import claude", "res = agent.run()", "return res"],
    status = "normal", // "normal" | "error" | "ok"
    width = 3.6,
    height = 2.4,
  } = opts;

  const group = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x222734, roughness: 0.7, flatShading: true });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.7 });
  const body = solid(THREE, new THREE.BoxGeometry(width + 0.22, height + 0.22, 0.16), frameMat, edgeMat);
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
  screenMesh.position.z = 0.085;
  group.add(screenMesh);

  function draw(currStatus = status, highlightLine = -1, badgeText = "") {
    ctx.fillStyle = "#0e131f";
    ctx.fillRect(0, 0, 720, 480);

    // Barra superior de janela
    ctx.fillStyle = currStatus === "error" ? "#4a151b" : currStatus === "ok" ? "#113d29" : "#1a2234";
    ctx.fillRect(0, 0, 720, 58);

    const dots = ["#ff5f56", "#ffbd2e", "#27c93f"];
    dots.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(32 + i * 26, 29, 9, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = "#e6edf3";
    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.fillText(title, 120, 37);

    // Linhas de código
    lines.forEach((ln, idx) => {
      const y = 110 + idx * 54;
      if (idx === highlightLine) {
        ctx.fillStyle = currStatus === "error" ? "rgba(231, 76, 60, 0.28)" : "rgba(46, 204, 113, 0.25)";
        ctx.fillRect(16, y - 34, 688, 46);
      }
      ctx.fillStyle = "#636e7b";
      ctx.font = '500 22px "JetBrains Mono", monospace';
      ctx.fillText(String(idx + 1).padStart(2, "0"), 28, y);

      ctx.fillStyle = idx === highlightLine ? (currStatus === "error" ? "#ff7b72" : "#56d364") : "#e6edf3";
      ctx.font = '700 25px "JetBrains Mono", monospace';
      ctx.fillText(ln, 78, y);
    });

    // Selo/Carimbo se houver badgeText
    if (badgeText) {
      const isErr = currStatus === "error";
      ctx.save();
      ctx.translate(520, 370);
      ctx.rotate(-0.12);
      ctx.fillStyle = isErr ? "#e74c3c" : "#2ecc71";
      ctx.fillRect(-150, -38, 300, 76);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 5;
      ctx.strokeRect(-144, -32, 288, 64);
      ctx.fillStyle = "#ffffff";
      ctx.font = '900 32px "Inter", sans-serif';
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

// ==================== 4. SETAS DE FORÇA / FLUXO 3D (ESTILO COMOCONSTROI) ====================

export function createFlowArrow(THREE, opts = {}) {
  const { color = PALETTE.red, length = 1.8, thickness = 0.22 } = opts;
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.45,
    emissive: color,
    emissiveIntensity: 0.2,
    flatShading: true,
  });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.65 });

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

// ==================== 5. RÓTULOS E PLACAS 3D ====================

export function createFloatingLabel(THREE, text, opts = {}) {
  const { bg = "#f4efe6", fg = "#141414", border = "#141414", worldH = 0.48 } = opts;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  const px = 72;
  ctx.font = `900 ${px}px "Inter", sans-serif`;
  const tw = Math.ceil(ctx.measureText(text).width);
  c.width = tw + 80;
  c.height = 120;

  ctx.fillStyle = bg;
  ctx.fillRect(6, 6, c.width - 12, c.height - 12);
  ctx.lineWidth = 10;
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

  // Movimento sutil de câmera na mão (handheld orgânico)
  const dist = pos.distanceTo(look);
  const hand = 0.0045 * dist;
  pos.x += hand * Math.sin(t * 1.6) + extraShake;
  pos.y += hand * Math.cos(t * 2.1);

  cam.position.copy(pos);
  cam.up.set(0, 1, 0);
  cam.lookAt(look);
  if (sky) sky.position.copy(cam.position);
}
