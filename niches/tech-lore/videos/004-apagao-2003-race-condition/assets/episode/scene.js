// Episódio 004 — Apagão de 2003 (FirstEnergy, GE XA/21): 44,73 s, 20 planos.
// 1 data center + sala de controle + linha de 345 kV (tarde) → 2 gaveta do servidor SCADA abre e a câmera mergulha →
// 3 placa: duas tarefas no mesmo buffer, o bug para em push(event) → 4 a fila racha, o chip entra em loop; a linha de
// Ohio encosta nas árvores, o pulso vermelho derruba torres, cidade e racks → 5 sala de controle muda e volta ao quadro 0.
import { THREE, createStage, createEpisode, makeTerrain, seg, E, shake, pulses, dip, loopPeriod, hash, rng, COL, solid, fill, edge, glowless, label, floorLabel, setLook } from "../motor/core.js";
import { M, makeChip, chipState, makeRegister, registerState, makeBitBlock, intBits, makeBus, makePulses, makeCodeLine, makeBug, bugState, bugWalk } from "../kit/props.js";
import { BOARD_SKY, makeBoard } from "../kit/placa.js";
import { makeDataCenter } from "../kit/exteriores.js";

const LOOP = 44.73;
// inícios das palavras-âncora (assets/voice.json)
const T = { serv: 2.04, mw: 3.84, date: 5.64, ctrl: 8.04, sw: 10.14, board: 11.84, rede: 14.66, h1414: 15.92, tasks: 17.26, duas: 18.16,
  gravar: 19.26, buf: 21.26, mutex: 22.5, fila: 23.82, corr: 24.2, loop: 26.24, cabos: 27.12, cairam: 29.12, console: 29.54,
  aviso: 32.3, usinas: 34.04, bi: 35.9, tela: 38.76, estat: 40.52, hora: 41.58, volta: 42.54 };
const I = new THREE.Vector3(0, -500, 0); // origem da placa (os mundos se alternam por visible)
const EXT_SKY = { top: 0x2a3443, mid: 0x8c8679, bottom: 0x3d4146, fog: 0x7f7b72, fogNear: 160, fogFar: 2400 }; // tarde de agosto, nublada
const DARK_SKY = { top: 0x0b0f15, mid: 0x3b3833, bottom: 0x16191d, fog: 0x2b2c2e, fogNear: 120, fogFar: 1600 }; // apagão
const G = new THREE.Vector3(-12, 0, -14); // pórtico da subestação; a linha de 345 kV sai daqui na direção D
const D = new THREE.Vector3(-0.619, 0, -0.785);
const N = new THREE.Vector3(0.785, 0, -0.619); // perpendicular à linha (fases em ±4,5 m)

export function build(canvas) {
  const S = createStage(canvas);
  const { scene } = S;
  const box = (w, h, d, f, e, x, y, z, par, sh = true) => {
    const b = solid(new THREE.BoxGeometry(w, h, d), f, e, sh);
    b.position.set(x, y, z);
    par.add(b);
    return b;
  };

  // ==================== EXTERIOR: Ohio, data center da FirstEnergy, subestação, linha e cidade ====================
  const terrain = makeTerrain({ seed: 2003, coast: () => 6000, flatR: 340, jungle: 0x34452f, jungle2: 0x3b4c35, pad: 0x3d4b35 });
  const hemi = terrain.group.children.find((o) => o.isHemisphereLight);
  const ext = new THREE.Group();
  const site = new THREE.Group();
  site.position.y = 0.5; // chão plano do terreno
  ext.add(terrain.group, site);
  scene.add(ext);
  const concrete = fill(0x3b424b);
  const eC = edge(COL.gray, 0.35);
  const metal = fill(0x56616f, 0.6);
  const eM = edge(COL.gray, 0.55);
  box(26, 0.12, 22, concrete, eC, -4, 0.06, -6, site, false);
  const dc = makeDataCenter({ racks: 8 });
  site.add(dc.group);

  // a porta do mergulho: gaveta do servidor SCADA (rack da ponta, fileira −z); tampa articulada + chassi em trilhos
  const chassis = new THREE.Group();
  const Z0 = -0.9;
  chassis.position.set(2.1, 1.5, Z0);
  site.add(chassis);
  box(0.5, 0.012, 0.7, M.board, M.eGray, 0, -0.054, 0, chassis, false);
  for (const s of [-1, 1]) box(0.012, 0.11, 0.7, M.slate, M.eGray, s * 0.244, 0, 0, chassis);
  box(0.5, 0.11, 0.012, M.slate, M.eGray, 0, 0, -0.344, chassis);
  box(0.12, 0.02, 0.12, M.chip, M.eMint, 0, -0.038, 0.05, chassis);
  const mini = label("GE XA/21", "#e6edf3", 96, 0.022);
  mini.rotation.x = -Math.PI / 2;
  mini.position.set(0, -0.027, 0.05);
  chassis.add(mini);
  for (let k = 0; k < 3; k++) box(0.3, 0.035, 0.012, M.compLight, M.eSoft, 0, -0.03, -0.1 - k * 0.045, chassis);
  for (const x of [-0.15, 0.15]) box(0.012, 0.004, 0.5, M.trace, null, x, -0.046, 0.02, chassis, false);
  const hinge = new THREE.Group();
  hinge.position.set(-0.25, 0, 0.35);
  chassis.add(hinge);
  box(0.5, 0.12, 0.02, M.slate, M.eCyan, 0.25, 0, 0.01, hinge);
  const bez = label("GE XA/21 · SCADA", "#00ff9d", 96, 0.03);
  bez.position.set(0.22, 0.02, 0.021);
  hinge.add(bez);
  box(0.03, 0.02, 0.006, M.ledMint, null, 0.44, -0.03, 0.022, hinge, false);
  // carimbo de tempo na lateral do chassi (tampa da ponta da fileira, voltada para +x)
  box(0.012, 0.3, 0.94, fill(0x0f141a), M.eGray, 2.44, 1.55, -1.1, site, false);
  for (const [txt, cor, y, h] of [["FIRSTENERGY · SCADA", "#e6edf3", 1.62, 0.08], ["2003-08-14 14:14:00 EDT", "#7d8590", 1.49, 0.075]]) {
    const l = label(txt, cor, 96, h, 700);
    l.rotation.y = Math.PI / 2;
    l.position.set(2.448, y, -1.1);
    site.add(l);
  }

  // sala de controle (paredes cortadas a 0,9 m, vidraça em z = −8,6), console com 3 monitores voltados para a vidraça
  const wallM = fill(0x4b535d);
  box(4.8, 0.3, 4, fill(0x1a2029), eM, 0, 0.15, -6.6, site);
  box(4.8, 0.9, 0.2, wallM, eC, 0, 0.75, -4.6, site);
  for (const x of [-2.4, 2.4]) box(0.2, 0.9, 4, wallM, eC, x, 0.75, -6.6, site);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 2.5), new THREE.MeshStandardMaterial({ color: 0x9fb4c8, transparent: true, opacity: 0.12, depthWrite: false, roughness: 0.1 }));
  glass.position.set(0, 1.55, -8.6);
  site.add(glass);
  for (const x of [-2.4, -1.25, 1.25, 2.4]) box(0.08, 2.5, 0.08, M.slate, M.eGray, x, 1.55, -8.6, site);
  for (const y of [0.32, 2.82]) box(4.9, 0.1, 0.1, M.slate, M.eGray, 0, y, -8.6, site);
  box(2.8, 0.75, 0.7, fill(0x27313e), eM, 0, 0.675, -6.3, site);
  box(0.14, 0.14, 0.14, fill(0x3a2228), M.eSoft, 1.25, 1.12, -6.45, site); // lâmpada de alarme: nunca acende
  for (const x of [-0.6, 0.6]) {
    box(0.5, 0.08, 0.5, M.comp, M.eSoft, x, 0.75, -7.2, site);
    box(0.5, 0.55, 0.06, M.comp, M.eSoft, x, 1.05, -7.45, site);
  }
  const screenTxt = (txt, cor, x, y, h) => {
    const l = label(txt, cor, 120, h, 700);
    l.rotation.y = Math.PI;
    l.position.set(x, y, -6.126);
    site.add(l);
    return l;
  };
  for (const [x, a, b, cb] of [[0.78, "ALARM LIST", "sem eventos", "#e6edf3"], [0, "EDT", null], [-0.78, "SCADA · XA/21", "on-line", "#00ff9d"]]) {
    box(0.7, 0.44, 0.04, M.chip, M.eGray, x, 1.35, -6.1, site);
    box(0.06, 0.12, 0.06, M.chip, null, x, 1.1, -6.08, site);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.38), glowless(0x0b1420));
    scr.rotation.y = Math.PI;
    scr.position.set(x, 1.35, -6.123);
    site.add(scr);
    screenTxt(a, "#7d8590", x, 1.48, 0.055);
    if (b) screenTxt(b, cb, x, 1.31, 0.085);
  }
  const clocks = new Map(); // relógio do console: um rótulo por minuto, criado quando aparece
  const clockAt = (m) => {
    if (!clocks.has(m)) clocks.set(m, screenTxt(`${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`, "#38bdf8", 0, 1.3, 0.16));
    return clocks.get(m);
  };

  // subestação: pátio, 2 transformadores, barramentos até a entrada de energia do data center
  box(9, 0.2, 7, concrete, eC, -11, 0.1, -9.5, site, false);
  for (const [x, z] of [[-14, -7], [-7.5, -12]]) {
    box(2, 2.2, 1.6, fill(0x4b5560), eM, x, 1.3, z, site);
    for (let f = 0; f < 4; f++) box(0.5, 1.6, 0.06, metal, M.eSoft, x + 1.25, 1.2, z - 0.45 + f * 0.3, site);
    for (const dx of [-0.6, 0, 0.6]) box(0.16, 0.9, 0.16, fill(0x8a929c), M.eSoft, x + dx, 2.85, z, site);
  }
  const busA = new THREE.Vector3(-8.6, 1.4, -7.6);
  const busB = new THREE.Vector3(-3.95, 1.4, -2.4);
  const busDir = busB.clone().sub(busA);
  const busN = new THREE.Vector3(-busDir.z, 0, busDir.x).normalize();
  for (const o of [-0.4, 0, 0.4]) {
    const b = box(0.14, 0.14, busDir.length(), fill(0x8a929c, 0.5), eM, 0, 0, 0, site);
    b.position.copy(busA).add(busB).multiplyScalar(0.5).addScaledVector(busN, o);
    b.rotation.y = Math.atan2(busDir.x, busDir.z);
  }
  for (const u of [0.1, 0.5, 0.9]) box(0.12, 1.4, 0.12, metal, M.eSoft, busA.x + busDir.x * u, 0.7, busA.z + busDir.z * u, site);
  box(0.4, 1.6, 1.2, M.comp, eM, -3.85, 0.8, -1.9, site);

  // linha de 345 kV: pórtico + 6 torres; cabos em parábola (a flecha do vão 1 aumenta até tocar a árvore)
  const YAW = Math.atan2(-N.z, N.x);
  const nodes = [0, 16, 58, 100, 142, 184, 226].map((s) => G.clone().addScaledVector(D, s));
  const towers = nodes.map((p, i) => {
    const g = new THREE.Group();
    g.position.copy(p);
    g.rotation.y = YAW;
    site.add(g);
    const h = i ? 22 : 10;
    const parts = [];
    if (!i) {
      for (const s of [-5.5, 5.5]) parts.push(box(0.5, h, 0.5, metal, eM, s, h / 2, 0, g));
      parts.push(box(12, 0.5, 0.5, metal, eM, 0, h - 0.3, 0, g));
    } else {
      const body = solid(new THREE.CylinderGeometry(0.45, 2.0, h, 4, 1), metal, eM);
      body.rotation.y = Math.PI / 4;
      body.position.y = h / 2;
      g.add(body);
      parts.push(body, box(10, 0.35, 0.45, metal, eM, 0, h - 2.5, 0, g), box(6, 0.3, 0.4, metal, eM, 0, h - 0.6, 0, g));
    }
    const lamp = box(0.5, 0.5, 0.5, M.ledMint, null, 0, h + 0.3, 0, g, false);
    return { parts, lamp };
  });
  const attach = (i, k) => nodes[i].clone().addScaledVector(N, 4.5 * k).setY(i ? 19.3 : 9.4);
  const cablePoint = (j, k, u, sag) => attach(j, k).lerp(attach(j + 1, k), u).add(new THREE.Vector3(0, -4 * sag * u * (1 - u), 0));
  const cableM = new THREE.LineBasicMaterial({ color: 0x1b2129 });
  const cableRed = new THREE.LineBasicMaterial({ color: COL.alert });
  const NP = 24;
  const spans = nodes.slice(1).map(() =>
    [-1, 0, 1].map(() => {
      const ln = new THREE.Line(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(NP * 3), 3)), cableM);
      ln.frustumCulled = false;
      site.add(ln);
      return ln;
    }),
  );
  const setCable = (ln, j, k, sag) => {
    const a = ln.geometry.attributes.position;
    for (let q = 0; q < NP; q++) {
      const p = cablePoint(j, k, q / (NP - 1), sag);
      a.setXYZ(q, p.x, p.y, p.z);
    }
    a.needsUpdate = true;
  };
  // árvores geométricas no corredor; 3 delas crescidas embaixo do vão 1 (a da fase +N encosta no cabo)
  const treeM = fill(0x2f4532);
  const eTree = edge(COL.gray, 0.3);
  const trunkM = fill(0x3a3128);
  const tree = (p, top) => {
    const trunk = solid(new THREE.CylinderGeometry(0.22, 0.3, 2.5, 6), trunkM, null);
    trunk.position.set(p.x, 1.25, p.z);
    const crown = solid(new THREE.ConeGeometry(1.7, top - 2.3, 7), treeM, eTree);
    crown.position.set(p.x, 2.3 + (top - 2.3) / 2, p.z);
    site.add(trunk, crown);
    return crown;
  };
  const along = (s, lat) => G.clone().addScaledVector(D, s).addScaledVector(N, lat);
  const r = rng(77);
  for (let i = 0; i < 44; i++) tree(along(25 + r() * 200, (r() < 0.5 ? -1 : 1) * (9 + r() * 6)), 6.5 + r() * 3);
  tree(along(33, 3.6), 7.6);
  tree(along(41, 5.4), 7.8);
  const culprit = tree(along(37, 4.5), 8.5);
  const CONTACT = along(37, 4.5);
  const arc = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([9.3, 9.12, 8.95, 8.8, 8.65, 8.5].map((y, q) => CONTACT.clone().addScaledVector(N, q % 2 ? 0.28 : -0.2).setY(y))),
    new THREE.LineBasicMaterial({ color: COL.ink }),
  );
  const arcLight = new THREE.PointLight(COL.cyan, 0, 40, 1.5);
  arcLight.position.copy(CONTACT).setY(9);
  const spark = box(0.5, 0.5, 0.5, glowless(COL.ink), null, CONTACT.x, 9.0, CONTACT.z, site, false);
  site.add(arc, arcLight);
  const pulse = new THREE.Mesh(new THREE.SphereGeometry(1.0, 10, 6), M.ledAlert);
  site.add(pulse);
  const passAt = (i) => T.aviso + 0.06 + (i * 1.54) / 6;

  // cidade no fim da linha: 25 quadras com janelas acesas; apagam em dominó e voltam antes do quadro 0
  const litM = glowless(0xc2cad3);
  const town = [];
  const TC = G.clone().addScaledVector(D, 262);
  for (let i = 0; i < 25; i++) {
    const x = TC.x - 18 + (i % 5) * 9;
    const z = TC.z - 18 + Math.floor(i / 5) * 9;
    const w = 5 + 2 * hash(i, 1);
    const d = 5 + 2 * hash(i, 2);
    const h = 6 + 18 * hash(i, 3);
    box(w, h, d, fill(0x2a313a), edge(COL.gray, 0.4), x, h / 2, z, site);
    const win = [];
    for (let y = 2.5; y < h - 1; y += 3) win.push(box(w + 0.06, 0.6, d + 0.06, litM, null, x, y, z, site, false));
    const far = Math.hypot(x - TC.x, z - TC.z) / 26; // onda do centro para fora
    town.push({ win, off: T.usinas + 0.15 + 1.1 * far + 0.12 * hash(i, 4), on: T.volta + 0.06 + 0.5 * hash(i, 5) });
  }
  // LEDs do data center: apagam em dominó no plano do prejuízo (fundo → câmera), voltam em onda no último plano
  const ledP = loopPeriod(LOOP, 1.6);
  dc.leds(0, ledP);
  scene.updateMatrixWorld(true);
  const dcLeds = [];
  const wp = new THREE.Vector3();
  dc.group.traverse((o) => {
    if (o.isMesh && [M.ledOff, M.ledMint, M.ledCyan].includes(o.material)) {
      const u = (o.getWorldPosition(wp).x + wp.z + 4.2) / 8.4; // do fundo (−x −z) para a câmera
      dcLeds.push({ m: o, off: T.bi + 0.15 + 0.9 * u, on: T.volta + 0.1 + 0.6 * u });
    }
  });

  // ==================== INTERIOR: a placa do XA/21 (chip → barramento → fila → linha de código → mutex) ====================
  const inside = new THREE.Group();
  inside.position.copy(I);
  scene.add(inside);
  const board = makeBoard({ seed: 14, keepOut: [[-5.5, -13, 4.5, 4.2]], loop: LOOP });
  const chip = makeChip({ name: "GE XA/21", sub: "EMS · alarmes" });
  const CHIP = new THREE.Vector3(0, 0, -10.5);
  const ringG = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.06, 6, 64, Math.PI * 1.4), M.ledAlert);
  ring.rotation.x = -Math.PI / 2;
  ringG.add(ring);
  ringG.position.set(CHIP.x, 0.9, CHIP.z);
  const data = makePulses(4, 2);
  const regG = new THREE.Group();
  regG.position.set(-2, 0, -2.6);
  const reg = makeRegister({ n: 8, P: 0.5, text: "alarm_queue" });
  regG.add(reg);
  const tasks = ["A", "B"].map((n) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.3, 0.36), M.ledCyan);
    const l = label(n, "#080a0f", 96, 0.24);
    l.rotation.x = -Math.PI / 2;
    l.position.y = 0.152;
    m.add(l);
    return m;
  });
  const line = makeCodeLine({ code: "alarm_queue.push(event);", comment: "// race condition · sem mutex", x0: -3.2, z: 0.8 });
  line.group.scale.setScalar(0.82); // 24 caracteres cabem no quadro vertical
  const cells = makeBitBlock(intBits(0, 8)); // MUTEX_LOCK = 0x00
  cells.forEach((c, i) => c.position.set(-1.75 + i * 0.5, 0.21, 2.3));
  const mutexLbl = floorLabel("MUTEX_LOCK = 0x00", "#38bdf8", 120, 0.4, 700);
  mutexLbl.position.set(0, 0.012, 3.0);
  const corrupt = floorLabel("QUEUE_CORRUPT", "#ff3366", 120, 0.42, 800);
  corrupt.position.set(0, 0.012, -1.25);
  const bug = makeBug();
  inside.add(board.group, chip, ringG, makeBus(4, { x0: -1.5, z: -6.1, length: 4.6, text: "ALARM EVENTS" }), ...data, regG, ...tasks, line.group, ...cells, mutexLbl, corrupt, bug);
  // o bug anda pela linha e para em push(event) (centro do trecho: x0 + 17,5 caracteres de 0,254 u, × 0,82)
  const BUG_A = new THREE.Vector3(-4.2, 0.012, 1.25);
  const FAULT = new THREE.Vector3(0.99, 0.012, 1.25);
  const blinkP = loopPeriod(LOOP, 0.8);
  const dataP = loopPeriod(LOOP, 1.2);
  const ringP = loopPeriod(LOOP, 1.4);

  // ==================== PLANOS (1,7–3 s, câmera sempre em movimento) ====================
  const IN = () => I.clone();
  const bugAt = (t) => bugWalk(t, T.gravar + 0.2, T.mutex, BUG_A, FAULT).pos.add(I);
  const P0 = [13, 11, 16];
  const L0 = [-0.5, 1.2, -1.5];
  const SH = [
    // 1 gancho: o quadro 0 (título); o plano 20 termina exatamente em P0/L0
    { a: 0, b: T.serv, env: "ext", p0: P0, p1: [11.8, 10, 14.4], l0: L0, l1: [-0.5, 1.4, -1.5], ap: 1.5 },
    { a: T.serv, b: T.mw, env: "ext", p0: [-10, 4.2, 3], p1: [-7.6, 3.4, 1.8], l0: [-0.5, 1.6, 0], l1: [-0.3, 1.7, -0.2], ap: 5 },
    { a: T.mw, b: T.date, env: "ext", p0: [-12.8, 2.4, -11.8], p1: [-10.6, 2.6, -9.3], l0: [-1.5, 1.4, -1.2], l1: [-1.5, 1.5, -1.6], ap: 8 },
    // 2 contexto: carimbo na lateral → a gaveta destrava e desliza → mergulho
    { a: T.date, b: T.ctrl, env: "ext", p0: [6.2, 2.9, 1.6], p1: [5.0, 2.5, 0.6], l0: [2.4, 2.0, -0.9], l1: [2.4, 2.05, -1.0], ap: 7 },
    { a: T.ctrl, b: T.sw, env: "ext", p0: [4.8, 2.7, 0.45], p1: [3.5, 2.45, 0.3], l0: [2.1, 2.0, -0.5], l1: [2.1, 2.0, -0.25], ap: 9 },
    { a: T.sw, b: T.board, env: "ext", p0: [3.3, 2.5, 0.35], p1: [2.13, 2.24, -0.08], l0: [2.1, 2.0, -0.2], l1: [2.1, 1.98, -0.3], ap: 6, ease: "p2in" },
    { a: T.board, b: T.rede, env: "int", base: IN, p0: [0.6, 15, -2.5], p1: [0.3, 9.5, -4.6], l0: [0, 0, -10.2], l1: [0, 0.3, -10.3], ap: 9, ease: "p2out" },
    { a: T.rede, b: T.tasks, env: "int", base: IN, p0: [7.5, 2.6, -12.5], p1: [7.0, 3.2, -3.5], l0: [0, 0.4, -9.5], l1: [0, 0.4, -4.6], ap: 8 },
    // 3 a falha: duas tarefas no mesmo slot → o bug anda → para em push(event) e a fila racha
    { a: T.tasks, b: T.gravar, env: "int", base: IN, p0: [0.8, 12.5, 4.0], p1: [0.5, 10.5, 2.4], l0: [0, 0, -3.6], l1: [0, 0, -3.2], ap: 8 },
    { a: T.gravar, b: T.buf, env: "int", base: bugAt, p0: [2.2, 3.4, 3.2], p1: [1.6, 3.0, 2.6], l0: [0.6, 0, -0.4], l1: [0.6, 0, -0.5], ap: 10 },
    { a: T.buf, b: T.corr, env: "int", base: IN, p0: [-0.3, 12.5, 7.4], p1: [-0.1, 11, 6.6], l0: [-0.1, 0, 1.6], l1: [-0.1, 0, 1.8], ap: 8, shake: [T.fila, 0.06, 0.5, 55] },
    { a: T.corr, b: T.cabos, env: "int", base: IN, p0: [-8.5, 8.2, -1.5], p1: [-7.5, 7.5, -4], l0: [0, 0.4, -8], l1: [0, 0.6, -9.6], ap: 7, shake: [T.loop, 0.05, 0.5, 55] },
    // 4 colapso: o cabo de Ohio encosta na árvore → console mudo → pulso vermelho → cidade e racks apagam → prejuízo
    { a: T.cabos, b: T.console, env: "ext", p0: [-8.9, 6.5, -56], p1: [-11.5, 8.5, -53.5], l0: [-31.4, 11, -45.8], l1: [-31.4, 9.5, -45.8], ap: 2 },
    { a: T.console, b: T.aviso, env: "ext", p0: [-1.9, 1.75, -8.25], p1: [-1.2, 1.7, -8.05], l0: [0.3, 1.88, -6], l1: [0.4, 1.88, -6], ap: 9 },
    { a: T.aviso, b: T.usinas, env: "apagao", p0: [6, 13, -24], p1: [2, 15, -30], l0: [-60, 12, -82], l1: [-110, 10, -140], ap: 0.8, ease: "lin" },
    { a: T.usinas, b: T.bi, env: "apagao", p0: [-75.5, 45, -151], p1: [-89.6, 40, -152.8], l0: [-174, 4, -220], l1: [-174, 6, -220], ap: 1 },
    { a: T.bi, b: T.tela, env: "apagao", p0: [-5.5, 3.6, 8], p1: [-8, 8.5, 12.5], l0: [0, 1.4, -1.5], l1: [-3, 0.8, -7], ap: 1.5 },
    // 5 loop: pela vidraça → o relógio corre sem alarme → a câmera volta ao quadro 0
    { a: T.tela, b: T.estat, env: "apagao", p0: [-2.4, 2.4, -12.8], p1: [-1.4, 2.25, -11.8], l0: [0, 1.85, -6.2], l1: [0, 1.85, -6.1], ap: 4 },
    { a: T.estat, b: T.volta, env: "apagao", p0: [0.75, 1.95, -8.4], p1: [0.35, 1.9, -7.9], l0: [0, 1.85, -6.1], l1: [0, 1.85, -6.1], ap: 10 },
    { a: T.volta, b: LOOP + 0.01, env: "ext", p0: [-3.5, 6.5, 13.5], p1: P0, l0: [-0.5, 1.6, -1.5], l1: L0, ap: 1.5 },
  ];

  function update(V, sh, c) {
    const isExt = sh.env !== "int";
    ext.visible = isExt;
    inside.visible = !isExt;
    const dark = sh.env === "apagao";
    terrain.sun.intensity = dark ? 0.8 : 2.6;
    if (hemi) hemi.intensity = dark ? 0.45 : 1.2;
    // gaveta: só abre no plano dela e no mergulho
    const open = V >= T.ctrl && V < T.board;
    hinge.rotation.y = open ? -1.9 * E.p2io(seg(V, T.ctrl + 0.3, T.ctrl + 0.9)) : 0;
    chassis.position.z = Z0 + (open ? 0.6 * E.p2io(seg(V, T.ctrl + 1.0, T.ctrl + 1.9)) : 0);
    // os alarmes nunca disparam; LEDs, cidade, torres e cabos caem em cascata e voltam com o quadro 0
    dc.leds(V, ledP);
    dc.alarme(0);
    for (const l of dcLeds) if (V >= l.off && V < l.on) l.m.material = M.ledOff;
    for (const b of town) for (const w of b.win) w.userData.mesh.material = V >= b.off && V < b.on ? M.ledOff : litM;
    const back = 1 - E.p2io(seg(V, T.volta, T.volta + 0.9));
    const sag1 = 4 + 6 * E.p2in(seg(V, T.cabos + 0.2, T.cairam)) * back;
    const red = (i) => V >= passAt(i) && V < T.volta + 0.3;
    towers.forEach((tw, i) => {
      for (const p of tw.parts) setLook(p, metal, i && red(i) ? M.eAlert : eM);
      tw.lamp.userData.mesh.material = i && red(i) ? M.ledOff : M.ledMint;
    });
    spans.forEach((sp, j) =>
      sp.forEach((ln, k) => {
        setCable(ln, j, k - 1, j === 1 ? sag1 : j ? 4 : 1.2);
        ln.material = red(j) ? cableRed : cableM;
      }),
    );
    const g = seg(V, passAt(0), passAt(6)) * 6;
    const j = Math.min(5, Math.floor(g));
    pulse.visible = V >= passAt(0) && V < passAt(6);
    pulse.position.copy(cablePoint(j, 0, g - j, j === 1 ? sag1 : j ? 4 : 1.2));
    const arcOn = V >= T.cairam && V < T.cairam + 1.3 && hash(Math.floor(V * 30), 3) > 0.3;
    arc.visible = arcOn;
    spark.visible = arcOn;
    arcLight.intensity = arcOn ? 45 : 0;
    setLook(culprit, V >= T.cairam && V < T.volta + 0.3 ? M.dead : treeM, V >= T.cairam && V < T.volta + 0.3 ? M.eAlert : eTree);
    const mins = V < T.hora ? 854 : 854 + Math.round(91 * seg(V, T.hora, T.hora + 0.86)); // 14:14 → 15:45
    const clk = clockAt(mins);
    for (const l of clocks.values()) l.visible = l === clk;

    // placa: tarefas A e B descem o barramento e caem no mesmo slot; pulsos de eventos param na colisão
    const tk = E.p2in(seg(V, T.tasks + 0.2, T.duas));
    tasks.forEach((m, i) => {
      const lane = i ? 0.5 : -0.5;
      m.visible = V >= T.tasks + 0.2;
      const hitK = i * E.expoOut(seg(V, T.duas, T.duas + 0.15)); // B bate em cima de A no mesmo slot
      m.position.set(lane + (-0.25 - lane) * E.p2io(seg(tk, 0.7, 1)) + shake(V, T.duas, 0.05, 0.3), 0.2 + 0.2 * hitK, -8.2 + (5.45 + i * 0.3) * tk);
      m.rotation.set(0, 0, 0.35 * hitK);
      m.material = V >= T.duas ? M.ledAlert : M.ledCyan;
    });
    for (const m of data) {
      const { lane, q } = m.userData;
      m.visible = V < T.duas;
      m.position.set(-1.5 + lane, 0.06, -8.4 + 4.6 * ((((V / dataP + q / 2 + lane * 0.27) % 1) + 1) % 1));
    }
    registerState(reg, V, { riseAt: T.h1414, jamAt: T.duas, crackAt: T.fila });
    corrupt.visible = V >= T.fila;
    bug.visible = V >= T.gravar;
    const pose = bugWalk(V, T.gravar + 0.2, T.mutex, BUG_A, FAULT);
    pose.pos.x += shake(V, T.fila, 0.05, 0.4);
    bugState(bug, pose);
    line.underline.material = V >= T.mutex ? M.ledAlert : M.ledOff;
    for (const cell of cells) setLook(cell, M.slate, V >= T.mutex ? M.eAlert : M.eInk);
    const st = chipState(chip, V, T.loop, blinkP);
    chip.position.set(CHIP.x + st.dx, st.y, CHIP.z);
    chip.rotation.z = st.rz;
    ringG.visible = V >= T.loop;
    ringG.rotation.y = (-2 * Math.PI * V) / ringP;
    ringG.scale.setScalar(Math.max(0.001, E.expoOut(seg(V, T.loop, T.loop + 0.3))));
    board.update(V, { focus: c.look.clone().sub(I), alarm: E.expoOut(seg(V, T.fila, T.fila + 0.4)) });
  }
  function post(V, sh, c) {
    const exposure = dip(V, T.board, 0.07, 0.92);
    const ca = pulses(V, [T.fila, T.loop, T.bi], 0.008, 0.35);
    return { focus: c.dist, aperture: sh.ap * (sh.env === "int" ? 0.6 : 1), exposure, ca };
  }
  return createEpisode(S, { loop: LOOP, shots: SH, skies: { ext: EXT_SKY, apagao: DARK_SKY, int: BOARD_SKY }, update, post });
}
