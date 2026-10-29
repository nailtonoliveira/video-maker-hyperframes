// Episódio 001 — Ariane 5 (voo 501, 1996): o que é só deste episódio.
// Relógio V = segundos do vídeo (locução). Relógio F = segundos de voo (T+), mapeado por plano.
import { THREE, createStage, createEpisode, SKIES, makeTerrain, solid, floorLabel, hash, seg, E, shake, rng, follow, pulses, dip } from "../motor/core.js";
import { M, makeChip, chipState, makeRegister, registerState, makeBitBlock, float64Bits, bitBlockState, makePulses, makeBus, makeCodeLine, makeBug, bugState, bugWalk } from "../kit/props.js";
import { BOARD_SKY, makeBoard } from "../kit/placa.js";
import { makeLaunchPad, makeRocket } from "../kit/exteriores.js";
import { makeTrail, makeGroundCloud, makeExplosion } from "../kit/efeitos.js";

const LOOP = 48.28;
const FB = 37.0; // T+ da desintegração ("em apenas 37 segundos")
const I = new THREE.Vector3(0, -5000, 0); // origem da placa (bem abaixo da Terra, fora de quadro)

export function build(canvas) {
  const S = createStage(canvas);
  const { scene } = S;

  // ==================== EXTERIOR: base ELA-3, foguete, fumaça, explosão ====================
  const ext = new THREE.Group();
  scene.add(ext);
  ext.add(makeTerrain({}).group, makeLaunchPad());
  const rocket = makeRocket();
  ext.add(rocket.group);

  // ---- trajetória por F: sobe acelerando, inclina para o mar, vira de lado depois da falha ----
  const angleAt = (F) => {
    let a = -0.32 * E.p2io(seg(F, 7, 34));
    a += -1.25 * E.p2in(seg(F, 36.25, FB));
    return a;
  };
  const F0 = -14;
  const DF = 1 / 240;
  const PATH = [];
  for (let F = F0, p = new THREE.Vector3(0, 7.8, 0); F <= 46; F += DF) {
    const a = angleAt(Math.min(F, FB));
    PATH.push([p.x, p.y, p.z, a]);
    if (F >= 0 && F < FB) {
      const v = 0.6 * F;
      p.x += -Math.sin(a) * v * DF;
      p.y += Math.cos(a) * v * DF;
    }
  }
  const flight = (F) => {
    const f = Math.max(0, Math.min(PATH.length - 1.001, (F - F0) / DF));
    const i = Math.floor(f);
    const k = f - i;
    const a = PATH[i];
    const b = PATH[i + 1];
    return { p: new THREE.Vector3(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k), a: a[3] + (b[3] - a[3]) * k };
  };
  const BP = flight(FB).p; // ponto da desintegração
  const tail = (a) => new THREE.Vector3(Math.sin(a) * 6.4, -Math.cos(a) * 6.4, 0);

  const trail = makeTrail({ until: FB });
  const cloud = makeGroundCloud();
  const boom = makeExplosion({ at: BP });
  ext.add(trail.group, cloud.group, boom.group);

  function updateExterior(F, V) {
    // foguete inteiro até FB; depois cada parte voa por conta própria
    const fl = flight(F);
    rocket.pose(fl.p, fl.a);
    rocket.nozzle(E.expoOut(seg(F, 36.25, 36.45)));
    rocket.burn(E.expoOut(seg(F, -0.4, 0.2)), V, F > -0.4 && F < FB);
    const dt = Math.max(0, F - FB);
    rocket.breakup(dt);
    // raio-x da coifa (satélites) no trecho "carregando quatro satélites"; depois a escotilha do SRI
    rocket.xray(V >= 15.02 && V < 17.96, V, 15.02);
    rocket.hatch(E.p2io(seg(V, 20.3, 20.75)), E.p2io(seg(V, 20.55, 21.0)));
    trail.update(F, flight, tail);
    cloud.update(F);
    boom.update(dt);
  }

  // ==================== INTERIOR: a placa do SRI ====================
  const inside = new THREE.Group();
  inside.position.copy(I);
  scene.add(inside);
  const board = makeBoard({ keepOut: [[-17, -23, 13, 21]], loop: LOOP });
  inside.add(board.group);
  const P = 0.5;
  // barramento: 8 trilhas até o registrador
  inside.add(makeBus(8, { x0: 0.5, z: -8.15, length: 14.5 }));
  const dataPulses = makePulses(8, 3);
  dataPulses.forEach((p) => inside.add(p));
  const reg = makeRegister({ text: "int16 · máx 32 767" });
  inside.add(reg);
  const BITS = float64Bits(32768.5);
  const cells = makeBitBlock(BITS);
  cells.forEach((c) => inside.add(c));
  const numLbl = floorLabel("float64 · 64 bits", "#e6edf3", 120, 0.36);
  inside.add(numLbl);
  // processadores
  const CPU = [new THREE.Vector3(0, 0, 16), new THREE.Vector3(4.4, 0, 16)];
  const chips = [makeChip({ name: "PRIMÁRIO", sub: "SRI 2 · ativo" }), makeChip({ name: "BACKUP", sub: "SRI 1 · reserva" })];
  chips.forEach((c, n) => {
    c.position.copy(CPU[n]);
    inside.add(c);
    const tr = solid(new THREE.BoxGeometry(0.16, 0.035, 13.4), M.bus, null, false);
    tr.position.set(CPU[n].x, 0.018, 7.8);
    inside.add(tr);
  });
  // a função inútil e a linha de código
  const ALIGN = new THREE.Vector3(-11, 0, -14);
  const align = makeChip({ name: "Align_SRI()", sub: "herdado do Ariane 4", w: 4.6, d: 3.2, nameH: 0.4, leds: 4 });
  align.position.copy(ALIGN);
  inside.add(align);
  for (const [w, x, z] of [[11, -5.5, -14], [0.16, -0.5, -9]]) {
    const tr = solid(new THREE.BoxGeometry(w, 0.035, w > 1 ? 0.16 : 10), M.bus, null, false);
    tr.position.set(x, 0.018, z);
    inside.add(tr);
  }
  const line = makeCodeLine({ code: "bh := int16(horizontal_bias);", comment: "-- Align_SRI · herdado do Ariane 4", x0: -14, z: -19.6 });
  inside.add(line.group);
  // peças de primeiro plano dentro da zona de ação (dão profundidade quando a câmera passa)
  const rf = rng(41);
  for (const [x, z] of [[-3.5, -6], [11.5, -9], [-5.5, 9], [10.5, 9.5], [-15.5, -9], [12, 19], [-4, 21], [-8, 3], [-16, -16.5], [-6.5, -17.5]]) {
    const rad = 0.35 + rf() * 0.45;
    const h = 1.4 + rf() * 2.2;
    const c = solid(new THREE.CylinderGeometry(rad, rad, h, 14), M.compLight, M.eSoft);
    c.position.set(x, h / 2, z);
    inside.add(c);
  }
  // o bug
  const bug = makeBug();
  inside.add(bug);

  const vv = (x, y, z) => new THREE.Vector3(x, y, z);
  const BUG_A0 = vv(-14.35, 0.012, -19.45);
  const BUG_A1 = vv(-12.55, 0.012, -19.45);
  function bugPose(V) {
    if (V < 2.0) return bugWalk(V, 0, 2.0, BUG_A0, BUG_A1, "p2io");
    if (V < 25.64) return bugWalk(V, 24.66, 25.4, vv(9.6, 0, 1.8), vv(7.1, 0, 0.95), "p2out");
    if (V < 28.24) {
      const k = E.p2io(seg(V, 25.64, 25.95));
      const pos = vv(7.1, 0.58 * k + 0.0, 0.95 - 0.59 * k);
      pos.y += 0.25 * Math.sin(Math.PI * k);
      pos.x += shake(V, 27.84, 0.06, 0.4);
      return { pos, yaw: Math.PI, gait: 0 };
    }
    if (V < 30.22) {
      const d = V - 28.24;
      const tl = 0.62;
      const dd = Math.min(d, tl);
      const pos = vv(7.1 + 1.1 * dd, 0.58 + 2.4 * dd - 5 * dd * dd, 0.36 + 2.6 * dd);
      pos.y = Math.max(0.012, pos.y);
      if (d > tl + 0.25) return bugWalk(V, 28.24 + tl + 0.25, 30.22, vv(7.1 + 1.1 * tl, 0.012, 0.36 + 2.6 * tl), vv(6.4, 0.012, 6.5), "p2in");
      return { pos, yaw: Math.PI + 3 * dd, gait: 0 };
    }
    if (V < 33.38) return bugWalk(V, 30.22, 33.3, vv(-1.6, 0.012, 18.9), vv(6.2, 0.012, 18.9), "lin");
    if (V < 40.86) return { pos: vv(0.6, 0.612, 15.7), yaw: 0.4, gait: 0 };
    if (V < 45.98) {
      const a = vv(ALIGN.x + 1.4, 0.612, ALIGN.z + 0.9);
      const b = vv(ALIGN.x - 0.6, 0.612, ALIGN.z + 0.5);
      return bugWalk(V, 41.3, 44.6, a, b, "p2io");
    }
    // volta para o começo da linha: termina exatamente na pose do quadro 0
    const a = vv(ALIGN.x - 2.0, 0.012, ALIGN.z - 2.0);
    const w = bugWalk(V, 45.98, LOOP, a, BUG_A0, "p2io");
    const dist = a.distanceTo(BUG_A0);
    w.gait -= dist / 0.22;
    const turn = E.p2io(seg(V, LOOP - 0.45, LOOP));
    w.yaw = w.yaw + (Math.PI / 2 - w.yaw) * turn;
    return w;
  }

  function updateInterior(V) {
    // pulsos de dados descendo o barramento logo depois do mergulho
    dataPulses.forEach((pz) => {
      const { lane, q } = pz.userData;
      const t0 = 21.45 + q * 0.3 + hash(lane, q) * 0.25;
      const k = seg(V, t0, t0 + 0.75);
      pz.visible = V >= t0 && k < 1;
      pz.position.set(0.5 + lane, 0.06, -15.4 + 14.2 * E.p2in(k));
    });
    const front = bitBlockState(cells, BITS, V, { bornAt: 22.22, slideA: 26.6, slideB: 27.84, jamAt: 27.84, ejectAt: 29.38, redAt: 28.24 });
    numLbl.visible = V >= 22.72 && V < 28.24;
    numLbl.position.set(4, 0.06, front - 4 * P - 1.5);
    registerState(reg, V, { riseAt: 25.64, jamAt: 27.84, crackAt: 28.24 });
    chips.forEach((c, n) => {
      const st = chipState(c, V, n ? 32.82 : 31.42, LOOP / 60);
      c.position.set(CPU[n].x + st.dx, st.y, CPU[n].z);
      c.rotation.z = (n ? -1 : 1) * st.rz;
    });
    chipState(align, V, Infinity, LOOP / 60);
    line.underline.material = V >= 1.62 && V < 45.98 ? M.ledAlert : M.ledOff;
    bugState(bug, bugPose(V));
  }

  // ==================== PLANOS ====================
  // exterior: relógio de voo F = f0 + (V − a)·rate; o resto do plano pode depender de F (o foguete naquele instante)
  const X = (a, b, f0, rate, o) => {
    const F = (V) => f0 + (V - a) * rate;
    const at = (V) => flight(F(V));
    return { a, b, env: "ext", F, ...(typeof o === "function" ? o(at) : o) };
  };
  const B = () => BP.clone();
  const IN = () => I.clone();
  const SH = [
    // gancho: a linha de código (loop: o último quadro é este primeiro)
    { a: 0, b: 2.0, env: "int", base: IN, p0: [-13.6, 4.6, -15.2], p1: [-12.2, 4.2, -15.6], l0: [-13.0, 0, -19.6], l1: [-11.6, 0, -19.6], ap: 11, hand: 0.004 },
    X(2.0, 5.34, 36.85, 0.6, { base: B, p0: [70, -18, 95], p1: [62, -14, 84], l0: [0, -6, 0], l1: [0, -4, 0], ap: 1.5 }),
    X(5.34, 8.28, 39.2, 0.8, { p0: [230, 3.5, 300], p1: [222, 4.5, 290], aim: () => new THREE.Vector3(BP.x * 0.5, BP.y * 0.47, 0), ap: 0.5 }),
    // contexto: base, decolagem, satélites
    X(8.28, 11.06, -3.9, 1, { p0: [26, 2.5, 34], p1: [20, 12, 28], l0: [0, 8, 0], l1: [0, 10, 0], ap: 3 }),
    X(11.06, 12.8, -1.12, 1, { p0: [13, 1.8, 17], p1: [12.5, 2.2, 16], l0: [0, 9, 0], l1: [0, 10.5, 0], ap: 2, shake: [12.18, 0.12, 1.2, 55] }),
    X(12.8, 14.66, 0.62, 1, (at) => ({ p0: [-24, 3, 28], p1: [-22, 5, 26], aim: (V) => at(V).p.add(new THREE.Vector3(0, -1, 0)), ap: 2 })),
    X(14.66, 16.1, 2.48, 1, (at) => ({ ...follow(at), p0: [7, -3, 9], p1: [4.2, 3.2, 6], l0: [0, 0.5, 0], l1: [0, 3.2, 0], ap: 4 })),
    X(16.1, 17.96, 3.92, 1, (at) => ({ ...follow(at), p0: [4.2, 3.6, 5.2], p1: [-3.6, 3.9, 5.4], l0: [0, 3.1, 0], l1: [0, 3.1, 0], ap: 6 })),
    // T+36: voo, mergulho no SRI
    X(17.96, 20.24, 35.6, 0.15, (at) => ({ ...follow(at), p0: [-45, 22, 75], p1: [-38, 18, 64], l0: [0, -2, 0], l1: [0, 0, 0], ap: 1 })),
    X(20.24, 21.5, 35.95, 0.04, (at) => ({ ...follow(at), p0: [4.5, 3.0, 9.5], p1: [0.02, 1.6, 1.12], l0: [0, 1.62, 0.4], l1: [0, 1.6, 0.9], ap: 6, ease: "p2in" })),
    { a: 21.5, b: 22.22, env: "int", base: IN, p0: [4, 30, 4], p1: [-3.5, 7.5, 7], l0: [4, 0, -6], l1: [4, 0.2, -3], ap: 6, ease: "p2out" },
    { a: 22.22, b: 24.66, env: "int", base: IN, p0: [-6, 7.5, 8], p1: [11, 6.5, 6.5], l0: [4, 0.2, -2], l1: [4, 0.2, -1.6], ap: 10 },
    { a: 24.66, b: 26.6, env: "int", base: IN, p0: [9.5, 2.2, 5.6], p1: [8.2, 1.7, 4.4], l0: [5, 0.3, -0.8], l1: [4.5, 0.3, -0.6], ap: 12 },
    { a: 26.6, b: 28.24, env: "int", base: IN, p0: [-3, 1.4, 2.6], p1: [-2, 1.2, 2.1], l0: [4, 0.3, -0.6], l1: [4, 0.3, -0.6], ap: 12 },
    { a: 28.24, b: 30.22, env: "int", base: IN, p0: [-1.5, 3.4, 5.4], p1: [-6, 9, 12], l0: [4, 0.3, -0.2], l1: [4, 0, -2], ap: 7 },
    { a: 30.22, b: 33.38, env: "int", base: IN, p0: [-1.2, 8.5, 23], p1: [5.6, 8.5, 23], l0: [-1.2, 0.3, 16.5], l1: [5.6, 0.3, 16.5], ap: 8, ease: "lin" },
    { a: 33.38, b: 35.94, env: "int", base: IN, p0: [2, 6, 24], p1: [3, 22, 26], l0: [2.2, 0, 15], l1: [2, 0, 6], ap: 4 },
    // colapso: câmera presa ao corpo do foguete enquanto ele vira
    X(35.94, 38.48, 36.1, 0.315, (at) => ({ ...follow(at, { rotate: true }), p0: [5, -6.5, 7], p1: [4.3, -5.6, 6], l0: [0, -4.4, 0], l1: [0, -4.8, 0], ap: 5 })),
    X(38.48, 40.86, 36.57, 0.7, { base: B, p0: [-55, -14, 80], p1: [-48, -12, 70], l0: [0, -2, 0], l1: [0, -2, 0], ap: 1 }),
    // a função inútil e a volta para a linha
    { a: 40.86, b: 43.02, env: "int", base: IN, p0: [-6.5, 3.4, -8.5], p1: [-8, 2.8, -10], l0: [-11, 0.4, -14], l1: [-11, 0.4, -14], ap: 12 },
    { a: 43.02, b: 45.98, env: "int", base: IN, p0: [-14.5, 3, -9.5], p1: [-15.5, 3.6, -11.5], l0: [-11, 0.4, -14], l1: [-11.5, 0.3, -15], ap: 10 },
    { a: 45.98, b: LOOP + 0.01, env: "int", base: IN, p0: [-14.5, 3.8, -12], p1: [-13.6, 4.6, -15.2], l0: [-11.5, 0.3, -15], l1: [-13.0, 0, -19.6], ap: 11, hand: 0.004 },
  ];

  // o motor escolhe o plano, põe céu e câmera; aqui fica só a cena e o pós deste episódio
  function update(V, sh, c) {
    const isExt = sh.env === "ext";
    ext.visible = isExt;
    inside.visible = !isExt;
    if (isExt) updateExterior(sh.F(V), V);
    else {
      updateInterior(V);
      const alarm = Math.max(V >= 28.24 && V < 30.22 ? 1 - seg(V, 28.24, 30.0) : 0, V >= 31.42 && V < 35.94 ? 0.6 : 0);
      board.update(V, { focus: c.look.clone().sub(I), alarm });
    }
  }
  function post(V, sh, c) {
    // exposição: clarão nas explosões, mergulho no escuro ao entrar no SRI; aberração nos impactos
    const exposure = (1 + pulses(V, [2.25, 39.09], 0.55, 0.3)) * dip(V, 21.5, 0.07, 0.92);
    const ca = pulses(V, [2.25, 28.24, 31.42, 32.82, 39.09], 0.008, 0.35);
    return { focus: c.dist, aperture: sh.ap * (sh.env === "ext" ? 1 : 0.6), exposure, ca };
  }
  return createEpisode(S, { loop: LOOP, shots: SH, skies: { ext: SKIES.day, int: BOARD_SKY }, update, post });
}
