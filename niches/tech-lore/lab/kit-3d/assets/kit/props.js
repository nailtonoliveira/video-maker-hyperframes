// Kit 3D do tech-lore — peças reutilizáveis: chip, registrador, bloco de bits, barramento, linha de código e o "bug".
import { THREE, COL, solid, setLook, fill, edge, glowless, label, floorLabel, E, seg, hash, blink, shake } from "../motor/core.js";
export { intBits, float64Bits } from "./bits.js";

export const M = {
  slate: fill(COL.slate),
  ink: fill(COL.ink),
  dead: fill(COL.dead),
  chip: fill(0x1f2833),
  board: fill(0x131a24, 0.95),
  trace: fill(0x2a3544, 0.6),
  bus: fill(0x334152, 0.5),
  comp: fill(0x232d3a),
  compLight: fill(0x354150),
  pin: fill(0x6b7684, 0.5),
  bugBody: fill(0x161b22, 0.6),
  eInk: edge(COL.ink, 0.9),
  eGray: edge(COL.gray, 0.6),
  eSoft: edge(COL.gray, 0.45),
  eMint: edge(COL.mint),
  eAlert: edge(COL.alert),
  eCyan: edge(COL.cyan),
  ledOff: glowless(0x1a2028),
  ledMint: glowless(COL.mint),
  ledCyan: glowless(COL.cyan),
  ledAlert: glowless(COL.alert),
  pulse: fill(COL.mint, 0.4),
};

// ---------- chip com pinos, serigrafia e LEDs de atividade ----------
export function makeChip({ name, sub = "", w = 3.4, d = 3.4, h = 0.5, pins = 9, leds = 3, nameH = 0.42 }) {
  const g = new THREE.Group();
  const body = solid(new THREE.BoxGeometry(w, h, d), M.chip, M.eMint);
  body.position.y = 0.1 + h / 2;
  g.add(body);
  const pinGeo = [new THREE.BoxGeometry(0.12, 0.08, 0.34), new THREE.BoxGeometry(0.34, 0.08, 0.12)];
  for (const side of [0, 1]) {
    const n = side ? Math.max(2, Math.round((pins * d) / w)) : pins;
    const span = (side ? d : w) - 0.6;
    for (let k = 0; k < n; k++) {
      const o = -span / 2 + (span * k) / (n - 1);
      for (const s of [-1, 1]) {
        const p = new THREE.Mesh(pinGeo[side], M.pin);
        p.castShadow = true;
        if (side) p.position.set(s * (w / 2 + 0.15), 0.1, o);
        else p.position.set(o, 0.1, s * (d / 2 + 0.15));
        g.add(p);
      }
    }
  }
  const top = 0.1 + h + 0.006;
  const l = label(name, "#e6edf3", 120, nameH);
  l.rotation.x = -Math.PI / 2;
  l.position.set(0, top, d * 0.12);
  g.add(l);
  if (sub) {
    const l2 = label(sub, "#7d8590", 120, nameH * 0.62);
    l2.rotation.x = -Math.PI / 2;
    l2.position.set(0, top, -d * 0.18);
    g.add(l2);
  }
  const ledList = [];
  for (let k = 0; k < leds; k++) {
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.1), M.ledOff);
    led.position.set(-w / 2 + 0.45 + k * 0.3, top, d / 2 - 0.25);
    g.add(led);
    ledList.push(led);
  }
  g.userData = { body, leds: ledList, w, d, h };
  return g;
}
// vivo: LEDs piscando em menta; morto: corpo vermelho, LEDs vermelhos fixos, afunda e inclina
export function chipState(chip, t, deadAt, period, tilt = 0.05) {
  const { body, leds } = chip.userData;
  const dead = t >= deadAt;
  setLook(body, dead ? M.dead : M.chip, dead ? M.eAlert : M.eMint);
  leds.forEach((led, k) => {
    led.material = dead ? M.ledAlert : blink(t, period, k * period * 0.37, 0.55) ? M.ledMint : M.ledOff;
  });
  const k = E.expoOut(seg(t, deadAt, deadAt + 0.3));
  return { y: -0.08 * k, rz: tilt * k, dx: shake(t, deadAt, 0.08, 0.45) };
}

// ---------- registrador: bandeja de n vagas; entrada aberta em −z, parede do fundo em +z ----------
export function makeRegister({ n = 16, P = 0.5, text = "int16" }) {
  const g = new THREE.Group();
  const W = n * P + 0.2;
  const base = solid(new THREE.BoxGeometry(W, 0.08, 0.66), M.slate, M.eMint);
  base.position.set((n * P) / 2, 0.04, 0);
  const wall = solid(new THREE.BoxGeometry(W, 0.5, 0.1), M.slate, M.eMint);
  wall.position.set((n * P) / 2, 0.33, 0.36);
  const lbl = label(text, "#00ff9d", 120, 0.26);
  lbl.position.set(0, 0, 0.052);
  wall.add(lbl);
  g.add(base, wall);
  const dividers = [];
  for (let j = 0; j <= n; j++) {
    const d = solid(new THREE.BoxGeometry(j === 0 || j === n ? 0.1 : 0.04, 0.5, 0.62), M.slate, M.eMint);
    d.position.set(j * P, 0.33, 0);
    g.add(d);
    dividers.push(d);
  }
  g.userData = { base, wall, dividers, parts: [base, wall, ...dividers], n, P };
  return g;
}
// riseAt: sobe; jamAt: é empurrada; crackAt: racha (fica vermelha, parede tomba)
export function registerState(reg, t, { riseAt, jamAt, crackAt }) {
  const { base, wall, dividers, parts, n, P } = reg.userData;
  const red = t >= crackAt;
  for (const p of parts) setLook(p, red ? M.dead : M.slate, red ? M.eAlert : M.eMint);
  for (let j = 0; j <= n; j++) {
    const t0 = riseAt + j * 0.02;
    dividers[j].scale.y = Math.max(0.001, E.backOut(seg(t, t0, t0 + 0.22)));
    dividers[j].visible = t >= t0;
  }
  const on = E.expoOut(seg(t, riseAt, riseAt + 0.3));
  for (const w of [base, wall]) {
    w.visible = t >= riseAt;
    w.scale.x = Math.max(0.001, on);
    w.position.x = ((n * P) / 2) * on;
  }
  const crack = E.expoOut(seg(t, crackAt, crackAt + 0.3));
  wall.position.z = 0.36 + 0.1 * E.expoOut(seg(t, jamAt, jamAt + 0.2)) + 0.3 * crack;
  wall.rotation.x = 0.55 * crack;
  reg.position.x = shake(t, jamAt, 0.05, 0.35) + shake(t, crackAt, 0.08, 0.5);
}

// ---------- bloco de bits: uma célula por bit; 1 = célula clara ----------
// as colunas são de bitBlockState (cols), que posiciona cada célula pelo índice
export function makeBitBlock(bits) {
  const geo = new THREE.BoxGeometry(0.42, 0.42, 0.42);
  return bits.map((b) => solid(geo, b ? M.ink : M.slate, M.eInk));
}
// nasce em onda (bornAt), desliza até a bandeja (slideA→slideB), só a 1ª linha cabe; as outras são cuspidas em ejectAt
export function bitBlockState(cells, bits, t, { bornAt, slideA, slideB, jamAt, ejectAt, redAt, P = 0.5, start = -1.1, cols = 16 }) {
  let front = start;
  front += (0 - front) * E.p2in(seg(t, slideA, slideB));
  front += 0.1 * E.expoOut(seg(t, jamAt, jamAt + 0.2));
  const red = t >= redAt;
  cells.forEach((c, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const t0 = bornAt + i * 0.012;
    c.visible = t >= t0;
    c.scale.setScalar(Math.max(0.001, E.backOut(seg(t, t0, t0 + 0.18))));
    let x = col * P + P / 2;
    let y = 0.21;
    let z = front - row * P;
    c.rotation.set(0, 0, 0);
    const dt = t - ejectAt - (row - 1) * 0.06 - col * 0.004;
    if (row >= 1 && dt > 0) {
      const vy = 4 + 4 * hash(i, 1);
      const vz = -1.5 - 3 * hash(i, 2);
      const vx = (hash(i, 3) - 0.5) * 5;
      const d = Math.min(dt, vy / 9);
      x += vx * d;
      z += vz * d;
      y = 0.21 + vy * d - 9 * d * d;
      c.rotation.set((hash(i, 4) - 0.5) * 14 * d, (hash(i, 5) - 0.5) * 10 * d, (hash(i, 6) - 0.5) * 14 * d);
    }
    c.position.set(x, y, z);
    setLook(c, bits[i] ? M.ink : M.slate, red ? M.eAlert : M.eInk);
  });
  return front;
}

// ---------- barramento: `lanes` trilhas paralelas (passo 1 u, a partir de x0) centradas em z, com o rótulo ----------
export function makeBus(lanes, { x0, z, length, text = "BARRAMENTO" }) {
  const g = new THREE.Group();
  for (let j = 0; j < lanes; j++) {
    const b = solid(new THREE.BoxGeometry(0.16, 0.035, length), M.bus, null, false);
    b.position.set(x0 + j, 0.018, z);
    g.add(b);
  }
  const lbl = floorLabel(text, "#7d8590", 120, 0.34);
  lbl.rotation.z = Math.PI / 2;
  lbl.position.set(x0 - 1.1, 0.012, z - 1.35);
  g.add(lbl);
  return g;
}

// ---------- linha de código no chão: código, comentário embaixo e o sublinhado que acende ----------
// x0 = começo do texto; z = linha de base do código
export function makeCodeLine({ code, comment, x0, z }) {
  const group = new THREE.Group();
  const codeLbl = floorLabel(code, "#e6edf3", 120, 0.55, 700);
  const w = codeLbl.userData.w;
  codeLbl.position.set(x0 + w / 2 - 0.12, 0.012, z);
  const commentLbl = floorLabel(comment, "#7d8590", 120, 0.36, 700);
  commentLbl.position.set(x0 + commentLbl.userData.w / 2 - 0.08, 0.012, z - 0.85);
  const underline = new THREE.Mesh(new THREE.BoxGeometry(w - 0.3, 0.02, 0.06), M.ledOff);
  underline.position.set(x0 + w / 2 - 0.12, 0.012, z + 0.4);
  group.add(codeLbl, commentLbl, underline);
  return { group, underline };
}

// ---------- pulsos de dados correndo pelas trilhas ----------
export function makePulses(lanes, perLane) {
  const geo = new THREE.BoxGeometry(0.2, 0.06, 0.55);
  const list = [];
  for (let j = 0; j < lanes; j++)
    for (let q = 0; q < perLane; q++) {
      const m = new THREE.Mesh(geo, M.pulse);
      m.userData = { lane: j, q };
      list.push(m);
    }
  return list;
}

// ---------- o bug: besouro da série, aparece onde está a falha ----------
// ~0.55 u de comprimento (uma célula de bit), corpo escuro com aresta vermelha, olhos menta
export function makeBug() {
  const g = new THREE.Group();
  const body = solid(new THREE.SphereGeometry(0.5, 8, 5), M.bugBody, M.eAlert);
  body.scale.set(0.34, 0.2, 0.5);
  body.position.y = 0.17;
  const head = solid(new THREE.SphereGeometry(0.5, 7, 4), M.bugBody, M.eAlert);
  head.scale.set(0.2, 0.14, 0.16);
  head.position.set(0, 0.15, 0.29);
  // sulco entre os élitros
  const seam = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.42), M.ledAlert);
  seam.position.set(0, 0.272, -0.02);
  g.add(body, head, seam);
  for (const s of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.03), M.ledMint);
    eye.position.set(s * 0.06, 0.18, 0.37);
    g.add(eye);
    const ant = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.2), M.ledAlert);
    ant.position.set(s * 0.05, 0.2, 0.45);
    ant.rotation.set(-0.5, s * 0.35, 0);
    g.add(ant);
  }
  const legs = [];
  const legGeo = new THREE.BoxGeometry(0.2, 0.025, 0.025);
  for (const s of [-1, 1])
    for (const k of [-1, 0, 1]) {
      const hip = new THREE.Group();
      hip.position.set(s * 0.13, 0.13, k * 0.13);
      const upper = new THREE.Mesh(legGeo, M.bugBody);
      upper.position.x = s * 0.09;
      upper.rotation.z = s * 0.45;
      const lower = new THREE.Mesh(legGeo, M.bugBody);
      lower.position.set(s * 0.2, -0.07, 0);
      lower.rotation.z = -s * 0.9;
      hip.add(upper, lower);
      hip.userData = { s, k };
      g.add(hip);
      legs.push(hip);
    }
  g.userData = { legs };
  g.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });
  return g;
}
// pose: { pos, yaw, gait } — gait = fase da caminhada (passos acumulados)
export function bugState(bug, pose) {
  bug.position.copy(pose.pos);
  bug.rotation.set(0, pose.yaw, 0);
  for (const hip of bug.userData.legs) {
    const { s, k } = hip.userData;
    const tri = (k === 0 ? -s : s) > 0 ? 0 : Math.PI; // marcha em trípode
    hip.rotation.y = 0.45 * Math.sin(pose.gait * Math.PI * 2 + tri) * s;
    hip.rotation.z = 0.18 * Math.max(0, Math.sin(pose.gait * Math.PI * 2 + tri + Math.PI / 2)) * s;
  }
}
// caminho em linha reta de A a B entre t0 e t1: pose com passo proporcional à distância
export function bugWalk(t, t0, t1, a, b, ease = "p2io") {
  const k = E[ease](seg(t, t0, t1));
  const pos = new THREE.Vector3().lerpVectors(a, b, k);
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const yaw = Math.atan2(dx, dz);
  const gait = (a.distanceTo(b) * k) / 0.22;
  return { pos, yaw, gait };
}
