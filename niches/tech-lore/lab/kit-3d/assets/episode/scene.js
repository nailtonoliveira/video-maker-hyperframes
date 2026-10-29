// Episódio 001 — Ariane 5 (voo 501, 1996): o que é só deste episódio.
// Relógio V = segundos do vídeo (locução). Relógio F = segundos de voo (T+), mapeado por plano.
import { THREE, COL, createStage, createEpisode, SKIES, makeTerrain, solid, setLook, fill, edge, glowless, label, floorLabel, hash, seg, E, shake, blink, rng } from "../motor/core.js";
import { M, makeChip, chipState, makeRegister, registerState, makeBitBlock, float64Bits, bitBlockState, makePulses, makeBug, bugState, bugWalk } from "../kit/props.js";
import { BOARD_SKY, makeBoard } from "../kit/placa.js";

const LOOP = 48.28;
const FB = 37.0; // T+ da desintegração ("em apenas 37 segundos")
const I = new THREE.Vector3(0, -5000, 0); // origem da placa (bem abaixo da Terra, fora de quadro)

export function build(canvas) {
  const S = createStage(canvas);
  const { scene } = S;

  // ==================== EXTERIOR ====================
  const ext = new THREE.Group();
  scene.add(ext);
  const earth = makeTerrain({});
  ext.add(earth.group);

  // base ELA-3: laje, mesa de lançamento, fosso das chamas, trilhos de transferência e 4 torres para-raios
  const concrete = fill(0x6c727a);
  const darkMetal = fill(0x3a414a);
  const pad = new THREE.Group();
  const slab = solid(new THREE.BoxGeometry(44, 0.6, 44), concrete, edge(COL.gray, 0.35));
  slab.position.y = 0.3;
  const trench = solid(new THREE.BoxGeometry(7, 0.62, 30), fill(0x1d2228), null, false);
  trench.position.set(0, 0.31, 12);
  const table = solid(new THREE.BoxGeometry(8, 2, 8), darkMetal, edge(COL.gray, 0.5));
  table.position.y = 1.6;
  pad.add(slab, trench, table);
  for (const [x, z] of [[-15, -15], [15, -15], [-15, 15], [15, 15]]) {
    const m = solid(new THREE.CylinderGeometry(0.22, 0.32, 19, 8), fill(0xb9c0c8), edge(COL.gray, 0.5));
    m.position.set(x, 9.8, z);
    const tip = solid(new THREE.CylinderGeometry(0.02, 0.08, 3, 6), darkMetal, null);
    tip.position.set(x, 20.8, z);
    pad.add(m, tip);
  }
  for (const z of [-1.6, 1.6]) {
    const rail = solid(new THREE.BoxGeometry(260, 0.25, 0.3), darkMetal, null, false);
    rail.position.set(-152, 0.62, z);
    pad.add(rail);
  }
  ext.add(pad);

  // Ariane 5 (1 u ≈ 5 m; origem do grupo = centro; base dos bocais em y = −5.2)
  const white = fill(0xe4e8ee, 0.7);
  const eWhite = edge(0x6b7684, 0.55);
  const bandMat = fill(0x2a323d);
  const nozMat = fill(0x3a4350, 0.5);
  const flameMat = glowless(0xfff1dc);
  const xray = new THREE.MeshStandardMaterial({ color: 0xe4e8ee, transparent: true, opacity: 0.1, depthWrite: false });
  const rocket = new THREE.Group();
  ext.add(rocket);
  const part = (name) => {
    const g = new THREE.Group();
    g.name = name;
    rocket.add(g);
    return g;
  };
  const pLower = part("coreLower");
  const pUpper = part("coreUpper");
  const pTop = part("top");
  const pBoostL = part("boosterL");
  const pBoostR = part("boosterR");
  const pEngine = part("engine");
  const cl = solid(new THREE.CylinderGeometry(0.54, 0.54, 3.4, 16), white, eWhite);
  cl.position.y = -2.9;
  pLower.add(cl);
  const cu = solid(new THREE.CylinderGeometry(0.54, 0.54, 2.6, 16), white, eWhite);
  cu.position.y = 0.1;
  const bay = solid(new THREE.CylinderGeometry(0.56, 0.56, 0.45, 16), bandMat, M.eCyan);
  bay.position.y = 1.625;
  pUpper.add(cu, bay);
  const fairing = solid(new THREE.CylinderGeometry(0.6, 0.6, 2.4, 16), white, eWhite);
  fairing.position.y = 3.05;
  const nose = solid(new THREE.ConeGeometry(0.6, 1.5, 16), white, eWhite);
  nose.position.y = 5.0;
  pTop.add(fairing, nose);
  // 4 satélites Cluster dentro da coifa (só aparecem no raio-x)
  const sats = [];
  for (const [x, y] of [[-0.26, 2.3], [0.26, 2.3], [-0.26, 3.05], [0.26, 3.05]]) {
    const s = solid(new THREE.CylinderGeometry(0.24, 0.24, 0.32, 12), fill(0x2a3d5e), M.eCyan);
    s.position.set(x, y, 0);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 12), M.ink);
    lid.position.y = 0.17;
    s.add(lid);
    s.visible = false;
    pTop.add(s);
    sats.push(s);
  }
  const flames = [];
  for (const [g, sx] of [[pBoostL, -1], [pBoostR, 1]]) {
    const b = solid(new THREE.CylinderGeometry(0.32, 0.32, 5.6, 12), white, eWhite);
    b.position.set(sx * 0.98, -1.8, 0);
    const bc = solid(new THREE.ConeGeometry(0.32, 0.9, 12), white, eWhite);
    bc.position.set(sx * 0.98, 1.45, 0);
    const bn = solid(new THREE.CylinderGeometry(0.2, 0.34, 0.6, 12, 1, true), nozMat, eWhite);
    bn.position.set(sx * 0.98, -4.9, 0);
    const bf = new THREE.Mesh(new THREE.ConeGeometry(0.34, 3.4, 12), flameMat);
    bf.rotation.x = Math.PI;
    bf.position.set(sx * 0.98, -6.9, 0);
    g.add(b, bc, bn, bf);
    flames.push(bf);
  }
  const nozzle = new THREE.Group();
  nozzle.position.y = -4.6;
  const nz = solid(new THREE.CylinderGeometry(0.16, 0.3, 0.55, 12, 1, true), nozMat, eWhite);
  nz.position.y = -0.28;
  const coreFlame = new THREE.Mesh(new THREE.ConeGeometry(0.28, 2.2, 12), flameMat);
  coreFlame.rotation.x = Math.PI;
  coreFlame.position.y = -1.6;
  nozzle.add(nz, coreFlame);
  pEngine.add(nozzle);
  flames.push(coreFlame);
  const engineLight = new THREE.PointLight(0xffc98f, 90, 40, 1.5);
  engineLight.position.set(0, -7, 0);
  pEngine.add(engineLight);
  // escotilha do compartimento de equipamentos + gaveta do SRI (com fendas de ventilação)
  const hinge = new THREE.Group();
  hinge.position.set(-0.25, 1.625, 0.57);
  const panel = solid(new THREE.BoxGeometry(0.5, 0.36, 0.04), bandMat, M.eCyan);
  panel.position.x = 0.25;
  hinge.add(panel);
  pUpper.add(hinge);
  const drawer = new THREE.Group();
  const sriBox = solid(new THREE.BoxGeometry(0.42, 0.3, 0.46), M.slate, M.eMint);
  drawer.add(sriBox);
  const sriLbl = label("SRI", "#00ff9d", 96, 0.1);
  sriLbl.position.set(0, 0.07, 0.232);
  drawer.add(sriLbl);
  for (let k = 0; k < 4; k++) {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.012, 0.01), M.ledOff);
    vent.position.set(0, -0.02 - k * 0.03, 0.232);
    drawer.add(vent);
  }
  pUpper.add(drawer);
  const PARTS = [pLower, pUpper, pTop, pBoostL, pBoostR, pEngine];
  const PART_V = PARTS.map((_, i) => new THREE.Vector3((hash(i, 1) - 0.5) * 16, 4 + hash(i, 2) * 10, (hash(i, 3) - 0.5) * 16));
  const PART_W = PARTS.map((_, i) => new THREE.Vector3((hash(i, 4) - 0.5) * 5, (hash(i, 5) - 0.5) * 5, (hash(i, 6) - 0.5) * 5));
  rocket.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });

  // ---- trajetória por F: sobe acelerando, inclina para o mar, vira de lado depois da falha ----
  const angleAt = (F) => {
    let a = -0.32 * E.p2io(seg(F, 7, 34));
    a += -1.25 * E.p2in(seg(F, 36.25, FB));
    return a;
  };
  const F0 = -14;
  const DF = 1 / 240;
  const PATH = [];
  {
    const p = new THREE.Vector3(0, 7.8, 0);
    for (let F = F0; F <= 46; F += DF) {
      const Fc = Math.min(F, FB);
      const a = angleAt(Fc);
      PATH.push([p.x, p.y, p.z, a]);
      if (F >= 0 && F < FB) {
        const v = 0.6 * F;
        p.x += -Math.sin(a) * v * DF;
        p.y += Math.cos(a) * v * DF;
      }
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
  const BA = flight(FB).a;
  const tail = (a) => new THREE.Vector3(Math.sin(a) * 6.4, -Math.cos(a) * 6.4, 0);

  // ---- rastro de fumaça (a cada 0.05 s de voo) e nuvem de chão da decolagem ----
  const puffGeo = new THREE.IcosahedronGeometry(1, 0);
  const TRAIL = Math.ceil(FB / 0.05);
  const trail = new THREE.InstancedMesh(puffGeo, new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true }), TRAIL);
  trail.frustumCulled = false;
  const GROUND = 150;
  const ground = new THREE.InstancedMesh(puffGeo, new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true }), GROUND);
  ground.frustumCulled = false;
  ext.add(trail, ground);
  // explosão: fogo (cor plena), fumaça escura e destroços
  const FIRE = 46;
  // fogo facetado: cor por bolha (amarelo → laranja → vermelho) com emissão parcial, para ter volume sem brilho
  const fireMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xff7a2a, emissiveIntensity: 0.45, roughness: 1, flatShading: true });
  const fire = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), fireMat, FIRE);
  const fireCore = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), glowless(0xfff0d0), FIRE);
  const SMOKE = 110;
  const smoke = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true }), SMOKE);
  const DEBRIS = 160;
  const debris = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ roughness: 0.8, flatShading: true }), DEBRIS);
  for (const m of [fire, fireCore, smoke, debris]) {
    m.frustumCulled = false;
    ext.add(m);
  }
  const _m = new THREE.Matrix4();
  const _q = new THREE.Quaternion();
  const _e = new THREE.Euler();
  const _s = new THREE.Vector3();
  const _p = new THREE.Vector3();
  const _c = new THREE.Color();
  const cYoung = new THREE.Color(0xf2f4f7);
  const cOld = new THREE.Color(0x9aa4b0);
  for (let i = 0; i < DEBRIS; i++) debris.setColorAt(i, _c.setHex(hash(i, 9) < 0.7 ? 0xd9dde3 : 0x3a414a));
  const FIRE_COLS = [0xffe2a0, 0xffb35c, 0xff7a3a, 0xe0482c];
  for (let i = 0; i < FIRE; i++) fire.setColorAt(i, _c.setHex(FIRE_COLS[Math.floor(hash(i, 31) * 4)]));
  for (let i = 0; i < SMOKE; i++) smoke.setColorAt(i, _c.setHex(0x8a8f96).multiplyScalar(0.7 + 0.5 * hash(i, 33)));
  const hide = (mesh, i) => mesh.setMatrixAt(i, _m.makeScale(0, 0, 0));

  function updateExterior(F, V) {
    // foguete inteiro até FB; depois cada parte voa por conta própria
    const fl = flight(F);
    rocket.position.copy(fl.p);
    rocket.rotation.set(0, 0, fl.a);
    nozzle.rotation.z = 0.45 * E.expoOut(seg(F, 36.25, 36.45));
    const burning = F > -0.4;
    const ign = E.expoOut(seg(F, -0.4, 0.2));
    flames.forEach((f, i) => {
      f.visible = burning && F < FB;
      f.scale.set(1, Math.max(0.01, ign * (1 + 0.08 * Math.sin(V * 41 + i) + 0.05 * Math.sin(V * 67 + i * 2))), 1);
    });
    engineLight.intensity = burning && F < FB ? 90 * ign + 10 * Math.sin(V * 29) : 0;
    const dt = Math.max(0, F - FB);
    PARTS.forEach((p, i) => {
      p.position.copy(PART_V[i]).multiplyScalar(dt);
      p.position.y -= 3 * dt * dt;
      p.rotation.set(PART_W[i].x * dt, PART_W[i].y * dt, PART_W[i].z * dt);
      p.visible = !(dt > 0 && i === 5 && dt > 0.3);
    });
    // raio-x da coifa (satélites) no trecho "carregando quatro satélites"
    const xr = V >= 15.02 && V < 17.96;
    for (const m of [fairing, nose]) setLook(m, xr ? xray : white, xr ? M.eCyan : eWhite);
    sats.forEach((s, i) => {
      s.visible = xr;
      setLook(s, s.userData.mesh.material, V >= 15.02 + i * 0.12 ? M.eMint : M.eCyan);
    });
    hinge.rotation.y = -1.95 * E.p2io(seg(V, 20.3, 20.75));
    drawer.position.set(0, 1.625, 0.33 + 0.5 * E.p2io(seg(V, 20.55, 21.0)));

    // rastro
    for (let k = 0; k < TRAIL; k++) {
      const fe = 0.3 + k * 0.05;
      const age = F - fe;
      if (age < 0.15 || fe > FB) {
        hide(trail, k);
        continue;
      }
      const at = flight(fe);
      const sz = 0.9 + 6.5 * (1 - Math.exp(-age * 0.3));
      _p.copy(at.p).add(tail(at.a));
      _p.x += 0.8 * age + (hash(k, 1) - 0.5) * age * 0.8;
      _p.y += -0.2 * age + (hash(k, 2) - 0.5) * age * 0.5;
      _p.z += (hash(k, 3) - 0.5) * age * 0.8;
      _e.set(hash(k, 4) * 6, hash(k, 5) * 6, hash(k, 6) * 6);
      _q.setFromEuler(_e);
      _s.set(sz * (0.8 + hash(k, 7) * 0.4), sz * (0.8 + hash(k, 8) * 0.4), sz * (0.8 + hash(k, 9) * 0.4));
      trail.setMatrixAt(k, _m.compose(_p, _q, _s));
      trail.setColorAt(k, _c.copy(cYoung).lerp(cOld, Math.min(1, age / 14)));
    }
    trail.instanceMatrix.needsUpdate = true;
    if (trail.instanceColor) trail.instanceColor.needsUpdate = true;
    // nuvem de chão
    for (let k = 0; k < GROUND; k++) {
      const fe = (k / GROUND) * 6;
      const age = F - fe;
      if (age < 0) {
        hide(ground, k);
        continue;
      }
      const ang = hash(k, 1) * Math.PI * 2;
      const r = 4 + (14 + 18 * hash(k, 2)) * (1 - Math.exp(-age * 0.5));
      _p.set(Math.cos(ang) * r, 1.2 + 3 * hash(k, 3) * (1 - Math.exp(-age)), Math.sin(ang) * r + 6);
      const sz = 2.5 + 6 * (1 - Math.exp(-age * 0.4)) * (0.7 + hash(k, 4) * 0.6);
      _e.set(hash(k, 5) * 6, hash(k, 6) * 6, 0);
      _q.setFromEuler(_e);
      ground.setMatrixAt(k, _m.compose(_p, _q, _s.setScalar(sz)));
      ground.setColorAt(k, _c.copy(cYoung).lerp(cOld, Math.min(1, age / 10)));
    }
    ground.instanceMatrix.needsUpdate = true;
    if (ground.instanceColor) ground.instanceColor.needsUpdate = true;
    // explosão
    for (let i = 0; i < FIRE; i++) {
      const age = dt - i * 0.012;
      const life = 1.1 + hash(i, 1) * 0.8;
      if (dt <= 0 || age < 0 || age > life) {
        hide(fire, i);
        hide(fireCore, i);
        continue;
      }
      const dir = new THREE.Vector3(hash(i, 2) - 0.5, hash(i, 3) - 0.3, hash(i, 4) - 0.5).normalize();
      _p.copy(BP).addScaledVector(dir, (4 + 14 * hash(i, 5)) * (1 - Math.exp(-age * 3)));
      const k = age / life;
      const sz = (1.5 + 5.5 * hash(i, 6)) * Math.sin(Math.PI * Math.min(1, k * 1.15));
      _e.set(hash(i, 34) * 6, hash(i, 35) * 6, 0);
      _q.setFromEuler(_e);
      fire.setMatrixAt(i, _m.compose(_p, _q, _s.setScalar(Math.max(0, sz))));
      fireCore.setMatrixAt(i, _m.compose(_p, _q, _s.setScalar(hash(i, 32) < 0.35 ? Math.max(0, sz * 0.5) : 0)));
    }
    for (let i = 0; i < SMOKE; i++) {
      const age = dt - 0.05 - i * 0.01;
      if (dt <= 0 || age < 0) {
        hide(smoke, i);
        continue;
      }
      const dir = new THREE.Vector3(hash(i, 12) - 0.5, hash(i, 13) - 0.35, hash(i, 14) - 0.5).normalize();
      _p.copy(BP).addScaledVector(dir, (8 + 22 * hash(i, 15)) * (1 - Math.exp(-age * 1.2)));
      _p.y -= 0.6 * age;
      const sz = (2.5 + 5.5 * hash(i, 16)) * (1 - Math.exp(-age * 1.5)) + 0.6 * age;
      _e.set(hash(i, 17) * 6, hash(i, 18) * 6, 0);
      _q.setFromEuler(_e);
      smoke.setMatrixAt(i, _m.compose(_p, _q, _s.setScalar(sz)));
    }
    for (let i = 0; i < DEBRIS; i++) {
      if (dt <= 0) {
        hide(debris, i);
        continue;
      }
      const v = new THREE.Vector3(hash(i, 21) - 0.5, hash(i, 22) - 0.2, hash(i, 23) - 0.5).normalize().multiplyScalar(8 + 20 * hash(i, 24));
      _p.copy(BP).addScaledVector(v, dt);
      _p.y -= 6 * dt * dt;
      _e.set(hash(i, 25) * 9 * dt, hash(i, 26) * 9 * dt, hash(i, 27) * 9 * dt);
      _q.setFromEuler(_e);
      const sz = 0.15 + 0.6 * hash(i, 28);
      _s.set(sz, sz * (0.3 + hash(i, 29)), sz * (0.5 + hash(i, 30)));
      debris.setMatrixAt(i, _m.compose(_p, _q, _s));
    }
    for (const m of [fire, fireCore, smoke, debris]) m.instanceMatrix.needsUpdate = true;
    if (debris.instanceColor) debris.instanceColor.needsUpdate = true;
  }

  // ==================== INTERIOR: a placa do SRI ====================
  const inside = new THREE.Group();
  inside.position.copy(I);
  scene.add(inside);
  const board = makeBoard({ keepOut: [[-17, -23, 13, 21]], loop: LOOP });
  inside.add(board.group);
  const P = 0.5;
  // barramento: 8 trilhas até o registrador
  for (let j = 0; j < 8; j++) {
    const b = solid(new THREE.BoxGeometry(0.16, 0.035, 14.5), M.bus, null, false);
    b.position.set(0.5 + j, 0.018, -8.15);
    inside.add(b);
  }
  const busLbl = floorLabel("BARRAMENTO", "#7d8590", 120, 0.34);
  busLbl.rotation.z = Math.PI / 2;
  busLbl.position.set(-0.6, 0.012, -9.5);
  inside.add(busLbl);
  const pulses = makePulses(8, 3);
  pulses.forEach((p) => inside.add(p));
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
  const CODE_X0 = -14; // começo do texto
  const code = floorLabel("bh := int16(horizontal_bias);", "#e6edf3", 120, 0.55, 700);
  code.position.set(CODE_X0 + code.userData.w / 2 - 0.12, 0.012, -19.6);
  const comment = floorLabel("-- Align_SRI · herdado do Ariane 4", "#7d8590", 120, 0.36, 700);
  comment.position.set(CODE_X0 + comment.userData.w / 2 - 0.08, 0.012, -20.45);
  const underline = new THREE.Mesh(new THREE.BoxGeometry(code.userData.w - 0.3, 0.02, 0.06), M.ledOff);
  underline.position.set(CODE_X0 + code.userData.w / 2 - 0.12, 0.012, -19.2);
  inside.add(code, comment, underline);
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
    pulses.forEach((pz) => {
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
    underline.material = V >= 1.62 && V < 45.98 ? M.ledAlert : M.ledOff;
    bugState(bug, bugPose(V));
  }

  // ==================== PLANOS ====================
  // env, mapeamento de F (f0 + (V − a)·rate), base da câmera e pós (abertura do foco)
  const R = (sh) => (V) => flight(sh.f0 + (V - sh.a) * sh.rate).p;
  const B = () => BP.clone();
  const W = () => new THREE.Vector3();
  const IN = () => I.clone();
  const SH = [
    // gancho: a linha de código (loop: o último quadro é este primeiro)
    { a: 0, b: 2.0, env: "int", base: IN, p0: [-13.6, 4.6, -15.2], p1: [-12.2, 4.2, -15.6], l0: [-13.0, 0, -19.6], l1: [-11.6, 0, -19.6], ap: 11, hand: 0.004 },
    { a: 2.0, b: 5.34, env: "ext", f0: 36.85, rate: 0.6, base: B, p0: [70, -18, 95], p1: [62, -14, 84], l0: [0, -6, 0], l1: [0, -4, 0], ap: 1.5 },
    { a: 5.34, b: 8.28, env: "ext", f0: 39.2, rate: 0.8, aimAbs: true, p0: [230, 3.5, 300], p1: [222, 4.5, 290], ap: 0.5 },
    // contexto: base, decolagem, satélites
    { a: 8.28, b: 11.06, env: "ext", f0: -3.9, rate: 1, base: W, p0: [26, 2.5, 34], p1: [20, 12, 28], l0: [0, 8, 0], l1: [0, 10, 0], ap: 3 },
    { a: 11.06, b: 12.8, env: "ext", f0: -1.12, rate: 1, base: W, p0: [13, 1.8, 17], p1: [12.5, 2.2, 16], l0: [0, 9, 0], l1: [0, 10.5, 0], ap: 2, shake: [12.18, 0.12, 1.2, 55] },
    { a: 12.8, b: 14.66, env: "ext", f0: 0.62, rate: 1, base: W, p0: [-24, 3, 28], p1: [-22, 5, 26], aimRocket: true, ap: 2 },
    { a: 14.66, b: 16.1, env: "ext", f0: 2.48, rate: 1, rel: "R", p0: [7, -3, 9], p1: [4.2, 3.2, 6], l0: [0, 0.5, 0], l1: [0, 3.2, 0], ap: 4 },
    { a: 16.1, b: 17.96, env: "ext", f0: 3.92, rate: 1, rel: "R", p0: [4.2, 3.6, 5.2], p1: [-3.6, 3.9, 5.4], l0: [0, 3.1, 0], l1: [0, 3.1, 0], ap: 6 },
    // T+36: voo, mergulho no SRI
    { a: 17.96, b: 20.24, env: "ext", f0: 35.6, rate: 0.15, rel: "R", p0: [-45, 22, 75], p1: [-38, 18, 64], l0: [0, -2, 0], l1: [0, 0, 0], ap: 1 },
    { a: 20.24, b: 21.5, env: "ext", f0: 35.95, rate: 0.04, rel: "R", p0: [4.5, 3.0, 9.5], p1: [0.02, 1.6, 1.12], l0: [0, 1.62, 0.4], l1: [0, 1.6, 0.9], ap: 6, ease: "p2in" },
    { a: 21.5, b: 22.22, env: "int", base: IN, p0: [4, 30, 4], p1: [-3.5, 7.5, 7], l0: [4, 0, -6], l1: [4, 0.2, -3], ap: 6, ease: "p2out" },
    { a: 22.22, b: 24.66, env: "int", base: IN, p0: [-6, 7.5, 8], p1: [11, 6.5, 6.5], l0: [4, 0.2, -2], l1: [4, 0.2, -1.6], ap: 10 },
    { a: 24.66, b: 26.6, env: "int", base: IN, p0: [9.5, 2.2, 5.6], p1: [8.2, 1.7, 4.4], l0: [5, 0.3, -0.8], l1: [4.5, 0.3, -0.6], ap: 12 },
    { a: 26.6, b: 28.24, env: "int", base: IN, p0: [-3, 1.4, 2.6], p1: [-2, 1.2, 2.1], l0: [4, 0.3, -0.6], l1: [4, 0.3, -0.6], ap: 12 },
    { a: 28.24, b: 30.22, env: "int", base: IN, p0: [-1.5, 3.4, 5.4], p1: [-6, 9, 12], l0: [4, 0.3, -0.2], l1: [4, 0, -2], ap: 7 },
    { a: 30.22, b: 33.38, env: "int", base: IN, p0: [-1.2, 8.5, 23], p1: [5.6, 8.5, 23], l0: [-1.2, 0.3, 16.5], l1: [5.6, 0.3, 16.5], ap: 8, ease: "lin" },
    { a: 33.38, b: 35.94, env: "int", base: IN, p0: [2, 6, 24], p1: [3, 22, 26], l0: [2.2, 0, 15], l1: [2, 0, 6], ap: 4 },
    // colapso
    { a: 35.94, b: 38.48, env: "ext", f0: 36.1, rate: 0.315, rel: "R", rot: true, p0: [5, -6.5, 7], p1: [4.3, -5.6, 6], l0: [0, -4.4, 0], l1: [0, -4.8, 0], ap: 5 },
    { a: 38.48, b: 40.86, env: "ext", f0: 36.57, rate: 0.7, base: B, p0: [-55, -14, 80], p1: [-48, -12, 70], l0: [0, -2, 0], l1: [0, -2, 0], ap: 1 },
    // a função inútil e a volta para a linha
    { a: 40.86, b: 43.02, env: "int", base: IN, p0: [-6.5, 3.4, -8.5], p1: [-8, 2.8, -10], l0: [-11, 0.4, -14], l1: [-11, 0.4, -14], ap: 12 },
    { a: 43.02, b: 45.98, env: "int", base: IN, p0: [-14.5, 3, -9.5], p1: [-15.5, 3.6, -11.5], l0: [-11, 0.4, -14], l1: [-11.5, 0.3, -15], ap: 10 },
    { a: 45.98, b: LOOP + 0.01, env: "int", base: IN, p0: [-14.5, 3.8, -12], p1: [-13.6, 4.6, -15.2], l0: [-11.5, 0.3, -15], l1: [-13.0, 0, -19.6], ap: 11, hand: 0.004 },
  ];
  // bases que dependem do foguete e mira absoluta
  for (const sh of SH) {
    const Fof = (V) => sh.f0 + (V - sh.a) * sh.rate;
    if (sh.rel === "R") {
      sh.base = (V) => flight(Fof(V)).p;
      if (sh.rot) {
        const p0 = sh.p0;
        const p1 = sh.p1;
        const l0 = sh.l0;
        const l1 = sh.l1;
        const rotZ = (v, a) => new THREE.Vector3(v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a), v[2]);
        sh.path = (V, k) => {
          const f = flight(Fof(V));
          return rotZ(p0, f.a).lerp(rotZ(p1, f.a), k).add(f.p);
        };
        sh.aim = (V, k) => {
          const f = flight(Fof(V));
          return rotZ(l0, f.a).lerp(rotZ(l1, f.a), k).add(f.p);
        };
      }
    }
    if (sh.aimRocket) {
      sh.aim = (V) => flight(Fof(V)).p.add(new THREE.Vector3(0, -1, 0));
      sh.l0 = sh.l1 = [0, 0, 0];
    }
    if (sh.aimAbs) {
      sh.base = W;
      sh.aim = () => new THREE.Vector3(BP.x * 0.5, BP.y * 0.47, 0);
    }
    if (sh.f0 !== undefined) sh.F = Fof;
  }

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
    // exposição: clarão nas explosões, mergulho no escuro ao entrar no SRI
    let exposure = 1;
    for (const vb of [2.25, 39.09]) if (V >= vb) exposure += 0.55 * Math.max(0, 1 - (V - vb) / 0.3);
    exposure *= 1 - 0.92 * Math.exp(-Math.pow((V - 21.5) / 0.07, 2));
    let ca = 0;
    for (const vi of [2.25, 28.24, 31.42, 32.82, 39.09]) if (V >= vi) ca += 0.008 * Math.max(0, 1 - (V - vi) / 0.35);
    return { focus: c.dist, aperture: sh.ap * (sh.env === "ext" ? 1 : 0.6), exposure, ca };
  }
  return createEpisode(S, { loop: LOOP, shots: SH, skies: { ext: SKIES.day, int: BOARD_SKY }, update, post });
}
