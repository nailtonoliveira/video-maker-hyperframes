// Kit 3D do tech-lore — exteriores: lugares reais reutilizáveis (base e Ariane 5, data center, pregão, radioterapia).
// Padrão: fábrica makeX(opts) → { group, ...estado }; origem no centro da base; nenhum tempo de episódio aqui dentro.
// Cada método de estado recebe 0→1 ou booleano e define tudo o que toca em toda chamada.
import { THREE, COL, solid, setLook, fill, edge, glowless, label, hash, blink, gridLines } from "../motor/core.js";
import { M } from "./props.js";
import { periodoLed, curvaPregao, fmtNum } from "./telas.js";

// base ELA-3: laje, mesa de lançamento, fosso das chamas, trilhos de transferência e 4 torres para-raios
export function makeLaunchPad() {
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
  return pad;
}

// Ariane 5 (1 u ≈ 5 m; origem do grupo = centro; base dos bocais em y = −5.2)
export function makeAriane5() {
  const white = fill(0xe4e8ee, 0.7);
  const eWhite = edge(0x6b7684, 0.55);
  const bandMat = fill(0x2a323d);
  const nozMat = fill(0x3a4350, 0.5);
  const flameMat = glowless(0xfff1dc);
  const xrayMat = new THREE.MeshStandardMaterial({ color: 0xe4e8ee, transparent: true, opacity: 0.1, depthWrite: false });
  const group = new THREE.Group();
  const part = (name) => {
    const g = new THREE.Group();
    g.name = name;
    group.add(g);
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
  group.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });

  return {
    group,
    // posição do centro e inclinação (em torno de z)
    pose(p, a) {
      group.position.copy(p);
      group.rotation.set(0, 0, a);
    },
    // ign: ignição 0→1; t: relógio do tremor das chamas; on: motor aceso
    burn(ign, t, on) {
      flames.forEach((f, i) => {
        f.visible = on;
        f.scale.set(1, Math.max(0.01, ign * (1 + 0.08 * Math.sin(t * 41 + i) + 0.05 * Math.sin(t * 67 + i * 2))), 1);
      });
      engineLight.intensity = on ? 90 * ign + 10 * Math.sin(t * 29) : 0;
    },
    // bocal central desviado (0→1)
    nozzle(k) {
      nozzle.rotation.z = 0.45 * k;
    },
    // dt: segundos desde a desintegração; cada parte voa por conta própria
    breakup(dt) {
      PARTS.forEach((p, i) => {
        p.position.copy(PART_V[i]).multiplyScalar(dt);
        p.position.y -= 3 * dt * dt;
        p.rotation.set(PART_W[i].x * dt, PART_W[i].y * dt, PART_W[i].z * dt);
        p.visible = !(dt > 0 && i === 5 && dt > 0.3);
      });
    },
    // raio-x da coifa: satélites ficam menta um a um a partir de t0
    xray(on, t, t0) {
      for (const m of [fairing, nose]) setLook(m, on ? xrayMat : white, on ? M.eCyan : eWhite);
      sats.forEach((s, i) => {
        s.visible = on;
        setLook(s, s.userData.mesh.material, t >= t0 + i * 0.12 ? M.eMint : M.eCyan);
      });
    },
    // escotilha (0→1 aberta) e gaveta do SRI (0→1 para fora)
    hatch(kHinge, kDrawer) {
      hinge.rotation.y = -1.95 * kHinge;
      drawer.position.set(0, 1.625, 0.33 + 0.5 * kDrawer);
    },
  };
}

// ==================== data center: corredor frio entre duas fileiras de racks ====================
// 1 u = 1 m; origem no centro do piso, embaixo do piso elevado (0,3 m). racks = racks por fileira (0,6 m cada).
// racks = 8: piso 7,2 × 7,2 m, racks de 2 m (0,6 × 1 m) dos dois lados de um corredor de 1,2 m, eletrocalhas a 2,75 m.
// leds(t, period): LEDs dos servidores; period vem do episódio (loopPeriod), cada LED usa period/1, /2 ou /3.
// alarme(k): giroflex nas pontas do corredor e luz vermelha, 0 → 1.
export function makeDataCenter({ racks = 8 } = {}) {
  const RW = 0.6;
  const RD = 1.0;
  const RH = 2.0;
  const AISLE = 1.2;
  const FL = 0.3;
  const L = racks * RW;
  const half = 0.6 * Math.ceil(Math.max(L + 2.4, 2 * (RD + 0.9) + AISLE) / 1.2);
  const group = new THREE.Group();
  const floor = solid(new THREE.BoxGeometry(half * 2, FL, half * 2), fill(0x1a2029), edge(COL.gray, 0.5));
  floor.position.y = FL / 2;
  group.add(floor, gridLines(0, 0, half, 0.6, COL.gray, 0.35, FL + 0.003));
  // placas perfuradas no corredor frio (uma sim, uma não)
  const perf = fill(0x3a4553);
  for (let i = 0; i < racks; i += 2)
    for (const z of [-0.3, 0.3]) {
      const tile = solid(new THREE.BoxGeometry(0.56, 0.012, 0.56), perf, null, false);
      tile.position.set(-L / 2 + RW / 2 + i * RW, FL + 0.006, z);
      group.add(tile);
    }

  const rackMat = fill(0x1c232d, 0.8);
  const eRack = edge(COL.gray, 0.6);
  const unitMat = fill(0x27313e);
  const blankMat = fill(0x0f141a);
  const eUnit = edge(COL.gray, 0.25);
  const ledList = [];
  let n = 0;
  for (const side of [-1, 1])
    for (let i = 0; i < racks; i++) {
      const r = new THREE.Group();
      r.position.set(-L / 2 + RW / 2 + i * RW, FL, side * (AISLE / 2 + RD / 2));
      r.rotation.y = side < 0 ? 0 : Math.PI; // frente (+z local) para o corredor
      const body = solid(new THREE.BoxGeometry(RW - 0.02, RH, RD), rackMat, eRack);
      body.position.y = RH / 2;
      r.add(body);
      // porta traseira ventilada (o corredor quente): grade de faixas verticais
      const door = solid(new THREE.BoxGeometry(RW - 0.08, RH - 0.1, 0.02), unitMat, eUnit, false);
      door.position.set(0, RH / 2, -RD / 2 - 0.01);
      r.add(door);
      for (let v = 0; v < 5; v++) {
        const slot = new THREE.Mesh(new THREE.BoxGeometry(0.05, RH - 0.3, 0.005), blankMat);
        slot.position.set(-0.2 + v * 0.1, RH / 2, -RD / 2 - 0.022);
        r.add(slot);
      }
      // servidores de 2 a 4 U na frente, com vãos tampados
      let y = 0.1;
      while (y < RH - 0.2) {
        const h = [2, 2, 3, 4][Math.floor(hash(n, 1) * 4)] * 0.0445;
        const blank = hash(n, 2) < 0.18;
        const sv = solid(new THREE.BoxGeometry(RW - 0.1, h - 0.01, 0.03), blank ? blankMat : unitMat, blank ? null : eUnit, false);
        sv.position.set(0, y + h / 2, RD / 2 + 0.015);
        r.add(sv);
        if (!blank)
          for (let k = 0; k < 2; k++) {
            const led = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.016, 0.01), M.ledOff);
            led.position.set(-RW / 2 + 0.1 + k * 0.06, y + h / 2, RD / 2 + 0.033);
            r.add(led);
            ledList.push({ led, h: hash(n, 3 + k), phase: hash(n, 5 + k) * 2, on: hash(n, 7 + k) < 0.75 ? M.ledMint : M.ledCyan });
          }
        y += h;
        n++;
      }
      group.add(r);
    }

  // eletrocalhas sobre as fileiras e réguas de luz sobre o corredor
  const tray = fill(0x56616f, 0.6);
  const TY = FL + RH + 0.45;
  for (const side of [-1, 1]) {
    const z = side * (AISLE / 2 + RD / 2);
    for (const dz of [-0.22, 0.22]) {
      const rail = solid(new THREE.BoxGeometry(L + 0.4, 0.07, 0.03), tray, null);
      rail.position.set(0, TY, z + dz);
      group.add(rail);
    }
    const cables = solid(new THREE.BoxGeometry(L + 0.3, 0.06, 0.36), fill(0x232c38), null);
    cables.position.set(0, TY - 0.005, z);
    group.add(cables);
    for (let x = -L / 2; x <= L / 2 + 0.01; x += 1.2) {
      const post = solid(new THREE.BoxGeometry(0.03, 0.45, 0.03), tray, null);
      post.position.set(x, FL + RH + 0.225, z);
      group.add(post);
    }
  }
  for (let x = -L / 2; x <= L / 2 + 0.01; x += 1.2) {
    const bar = solid(new THREE.BoxGeometry(0.04, 0.04, AISLE + RD), tray, null);
    bar.position.set(x, TY + 0.02, 0);
    group.add(bar);
  }
  const strip = new THREE.Mesh(new THREE.BoxGeometry(L, 0.03, 0.1), glowless(0xcdd6e0));
  strip.position.set(0, TY, 0);
  group.add(strip);

  // giroflex no topo dos racks das pontas (um em cada ponta do corredor) e a luz vermelha do alarme
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0x3a2228 });
  const cOff = new THREE.Color(0x3a2228);
  const cOn = new THREE.Color(COL.alert);
  for (const [side, sx] of [[-1, 1], [1, -1]]) {
    const x = sx * (L / 2 - RW / 2);
    const z = side * (AISLE / 2 + 0.25);
    const foot = solid(new THREE.CylinderGeometry(0.1, 0.11, 0.07, 12), fill(0x2a323d), M.eSoft);
    foot.position.set(x, FL + RH + 0.035, z);
    const dome = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.095, 0.2, 12), beaconMat);
    dome.position.set(x, FL + RH + 0.17, z);
    group.add(foot, dome);
  }
  const alarmLight = new THREE.PointLight(COL.alert, 0, 9, 1.4);
  alarmLight.position.set(0, FL + RH + 0.3, 0);
  group.add(alarmLight);

  return {
    group,
    leds(t, period) {
      for (const l of ledList) l.led.material = blink(t, periodoLed(period, l.h), l.phase, 0.55) ? l.on : M.ledOff;
    },
    alarme(k) {
      beaconMat.color.copy(cOff).lerp(cOn, k);
      alarmLight.intensity = 14 * k;
    },
  };
}

// ==================== pregão: mesas de operadores com monitores e o telão de cotação ====================
// 1 u = 1 m; origem no centro do piso. mesas = posições de operador, 3 por fileira, de frente para o telão (em −z).
// mesas = 6: piso 9 × 8,8 m, mesas de 1,6 × 0,8 m com 4 monitores (2 × 2) e cadeira, telão de 6 × 2,4 m
// (base a 1,3 m) na parede do fundo, de 4 m.
// telas(valor): número do telão (formato brasileiro). queda(k): 0 → 1, o gráfico do telão e dos monitores despenca
// em vermelho, a seta vira para baixo e a faixa de cotações fica vermelha.
export function makeTradingFloor({ mesas = 6 } = {}) {
  const PER = 3;
  const rows = Math.ceil(mesas / PER);
  const W = 9;
  const D = 4.2 + rows * 2.3;
  const group = new THREE.Group();
  const floor = solid(new THREE.BoxGeometry(W, 0.12, D), fill(0x1a2029), edge(COL.gray, 0.5));
  floor.position.y = 0.06;
  group.add(floor, gridLines(0, 0, W / 2, 0.6, COL.gray, 0.18, 0.123));
  const wallMat = fill(0x222a35);
  const wall = solid(new THREE.BoxGeometry(W, 4, 0.2), wallMat, edge(COL.gray, 0.5));
  wall.position.set(0, 2, -D / 2 + 0.1);
  group.add(wall);

  // telão: moldura, tela, grade, velas (candles), número, seta e faixa de cotações
  const SW = 6;
  const SH = 2.4;
  const screen = new THREE.Group();
  screen.position.set(0, 1.3 + SH / 2, -D / 2 + 0.27);
  group.add(screen);
  const frame = solid(new THREE.BoxGeometry(SW + 0.2, SH + 0.2, 0.12), fill(0x11161d), edge(COL.gray, 0.6));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), glowless(0x0b1520));
  face.position.z = 0.062;
  screen.add(frame, face);
  const gridMat = edge(COL.gray, 0.22);
  const CB = -1.0; // base do gráfico (y local)
  const CH = 1.6; // altura útil do gráfico
  for (let k = 0; k <= 3; k++) {
    const g = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2.75, 0, 0), new THREE.Vector3(2.75, 0, 0)]), gridMat);
    g.position.set(0, CB + (CH * k) / 3, 0.064);
    screen.add(g);
  }
  const NC = 26;
  const upMat = glowless(COL.mint);
  const downMat = glowless(COL.alert);
  const candles = [];
  for (let i = 0; i < NC; i++) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1, 0.01), upMat);
    const wick = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1, 0.008), upMat);
    const x = -2.7 + (5.4 * (i + 0.5)) / NC;
    body.position.set(x, 0, 0.068);
    wick.position.set(x, 0, 0.066);
    screen.add(body, wick);
    candles.push({ body, wick });
  }
  const numHolder = new THREE.Group();
  numHolder.position.set(-2.75, 0.88, 0.07);
  screen.add(numHolder);
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.3, 3), upMat);
  arrow.position.set(2.55, 0.88, 0.09);
  screen.add(arrow);
  const ticker = [];
  const tick = new THREE.Group();
  tick.position.set(0, 1.3 - 0.22, -D / 2 + 0.22);
  group.add(tick);
  const tickBack = new THREE.Mesh(new THREE.PlaneGeometry(SW + 0.2, 0.22), glowless(0x0b1520));
  tick.add(tickBack);
  for (let i = 0; i < 18; i++) {
    const s = new THREE.Mesh(new THREE.PlaneGeometry(0.13 + 0.14 * hash(i, 41), 0.07), upMat);
    s.position.set(-SW / 2 + 0.2 + (i * SW) / 18, 0, 0.005);
    tick.add(s);
    ticker.push({ s, h: hash(i, 42) });
  }

  // mesas: tampo, laterais, 4 monitores (2 × 2) com mini-gráfico e cadeira
  const deskMat = fill(0x2c3542);
  const monMat = fill(0x161c24);
  const scrMat = glowless(0x0e1b29);
  const chairMat = fill(0x1d242e);
  const miniUp = edge(COL.mint);
  const miniDown = edge(COL.alert);
  const minis = [];
  for (let m = 0; m < mesas; m++) {
    const row = Math.floor(m / PER);
    const col = m % PER;
    const desk = new THREE.Group();
    desk.position.set((col - (PER - 1) / 2) * 2.1, 0.12, -D / 2 + 3.6 + row * 2.3);
    group.add(desk);
    const top = solid(new THREE.BoxGeometry(1.8, 0.05, 0.8), deskMat, M.eSoft);
    top.position.y = 0.73;
    desk.add(top);
    for (const sx of [-1, 1]) {
      const leg = solid(new THREE.BoxGeometry(0.04, 0.71, 0.72), deskMat, M.eSoft);
      leg.position.set(sx * 0.86, 0.355, 0);
      desk.add(leg);
    }
    const pole = solid(new THREE.CylinderGeometry(0.025, 0.025, 0.95, 8), monMat, null);
    pole.position.set(0, 1.2, -0.3);
    desk.add(pole);
    for (const [mx, my] of [[-0.29, 0.97], [0.29, 0.97], [-0.29, 1.33], [0.29, 1.33]]) {
      const mon = solid(new THREE.BoxGeometry(0.56, 0.34, 0.03), monMat, M.eSoft);
      mon.position.set(mx, my, -0.27);
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.3), scrMat);
      scr.position.set(mx, my, -0.254);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 12 }, () => new THREE.Vector3())), miniUp);
      line.position.set(mx, my, -0.252);
      line.frustumCulled = false;
      desk.add(mon, scr, line);
      minis.push({ line, seed: minis.length * 3 + 1 });
    }
    const chair = new THREE.Group();
    chair.position.set(0.1 * (hash(m, 51) - 0.5), 0, 0.75);
    chair.rotation.y = (hash(m, 52) - 0.5) * 0.6;
    const seat = solid(new THREE.BoxGeometry(0.5, 0.08, 0.5), chairMat, M.eSoft);
    seat.position.y = 0.48;
    const back = solid(new THREE.BoxGeometry(0.46, 0.55, 0.06), chairMat, M.eSoft);
    back.position.set(0, 0.8, 0.24);
    const stem = solid(new THREE.CylinderGeometry(0.03, 0.03, 0.42, 8), monMat, null);
    stem.position.y = 0.23;
    const foot = solid(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 5), monMat, null);
    foot.position.y = 0.04;
    chair.add(seat, back, stem, foot);
    desk.add(chair);
  }

  const labels = new Map(); // texto → rótulo (o mesmo número reaproveita a textura)
  let shown = null;
  return {
    group,
    telas(valor) {
      const txt = fmtNum(valor);
      if (!labels.has(txt)) {
        const l = label(txt, COL.ink, 140, 0.42);
        l.position.x = l.userData.w / 2;
        labels.set(txt, l);
      }
      const l = labels.get(txt);
      if (shown !== l) {
        if (shown) numHolder.remove(shown);
        numHolder.add(l);
        shown = l;
      }
    },
    queda(k) {
      const c = curvaPregao(NC + 1, k, 7);
      candles.forEach(({ body, wick }, i) => {
        const o = CB + CH * c[i];
        const cl = CB + CH * c[i + 1];
        const up = cl >= o;
        const h = Math.max(0.025, Math.abs(cl - o));
        body.scale.y = h;
        body.position.y = (o + cl) / 2;
        const wh = h + 0.06 + 0.12 * hash(i, 43);
        wick.scale.y = wh;
        wick.position.y = (o + cl) / 2 + 0.03 * (hash(i, 44) - 0.5);
        body.material = wick.material = up ? upMat : downMat;
      });
      const falling = k > 0.35;
      arrow.material = falling ? downMat : upMat;
      arrow.rotation.z = falling ? Math.PI : 0;
      for (const { s, h } of ticker) s.material = h < (falling ? 0.3 + 0.7 * k : 0.2) ? downMat : upMat;
      for (const { line, seed } of minis) {
        const p = curvaPregao(12, k, seed);
        const pos = line.geometry.attributes.position;
        p.forEach((y, i) => pos.setXYZ(i, -0.24 + (0.48 * i) / 11, -0.13 + 0.26 * y, 0));
        pos.needsUpdate = true;
        line.material = falling ? miniDown : miniUp;
      }
    },
  };
}

// ==================== radioterapia: acelerador linear (cabeçote giratório), maca com paciente e console ====================
// 1 u = 1 m; origem no centro do piso da sala (6,6 × 6,6 m). Isocentro a 1,3 m do chão, sobre a maca (eixo z).
// Estativa de 2,9 m no fundo (−z), braço em C que gira em torno do eixo da maca, maca de 2,2 m com paciente,
// paredes de blindagem cortadas a 1,1 m (corte da maquete) e o console (terminal) fora da sala, em +x (até x = 5).
// giro(k): braço gira, k 0 → 1 = uma volta. feixe(on): feixe ciano do cabeçote ao paciente.
// alerta(k): tela do console, lâmpada de aviso e luz da sala vão ao vermelho, 0 → 1.
export function makeMedicalDevice() {
  const ISO = 1.3;
  const group = new THREE.Group();
  const white = fill(0xd5dbe2, 0.7);
  const eWhite = edge(0x4a5361, 0.9);
  const darkMat = fill(0x2a323d);
  const floor = solid(new THREE.BoxGeometry(6.6, 0.1, 6.6), fill(0x1a2029), edge(COL.gray, 0.5));
  floor.position.y = 0.05;
  const out = solid(new THREE.BoxGeometry(2.0, 0.1, 4.0), fill(0x161b22), edge(COL.gray, 0.5));
  out.position.set(4.3, 0.05, 1.3);
  group.add(floor, out, gridLines(0, 0, 3.3, 0.6, COL.gray, 0.18, 0.103));
  // paredes de blindagem (concreto) cortadas: o topo escuro é o corte
  const WH = 0.75; // altura do corte das paredes
  const conc = fill(0x3a414a);
  const cut = fill(0x0f1318);
  const wallAt = (w, d, x, z) => {
    const wl = solid(new THREE.BoxGeometry(w, WH, d), conc, edge(COL.gray, 0.5));
    wl.position.set(x, 0.1 + WH / 2, z);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(w - 0.02, 0.01, d - 0.02), cut);
    cap.position.set(x, 0.1 + WH + 0.005, z);
    group.add(wl, cap);
  };
  wallAt(6.6, 0.6, 0, -3.6);
  wallAt(0.6, 7.2, -3.6, 0);
  wallAt(0.6, 4.6, 3.6, -1.3);

  // estativa e tambor
  const stand = solid(new THREE.BoxGeometry(1.9, 2.9, 0.9), white, eWhite);
  stand.position.set(0, 1.55, -2.4);
  const drum = solid(new THREE.CylinderGeometry(1.15, 1.15, 0.35, 32), white, eWhite);
  drum.rotation.x = Math.PI / 2;
  drum.position.set(0, ISO, -1.8);
  group.add(stand, drum);
  // braço em C (gira em torno de z no isocentro)
  const gantry = new THREE.Group();
  gantry.position.set(0, ISO, -1.6);
  group.add(gantry);
  const arm = solid(new THREE.BoxGeometry(0.8, 0.42, 2.05), white, eWhite);
  arm.position.set(0, 1.36, 1.0);
  const head = solid(new THREE.CylinderGeometry(0.44, 0.48, 0.5, 24), white, eWhite);
  head.position.set(0, 0.9, 1.6);
  const coll = solid(new THREE.CylinderGeometry(0.3, 0.34, 0.2, 16), darkMat, M.eCyan);
  coll.position.set(0, 0.55, 1.6);
  const lowArm = solid(new THREE.BoxGeometry(0.3, 0.12, 1.5), white, eWhite);
  lowArm.position.set(0, -0.95, 0.75);
  const panel = solid(new THREE.BoxGeometry(0.7, 0.1, 0.7), darkMat, eWhite);
  panel.position.set(0, -0.95, 1.6);
  gantry.add(arm, head, coll, lowArm, panel);
  const beamMat = new THREE.MeshBasicMaterial({ color: COL.cyan, transparent: true, opacity: 0.5, depthWrite: false });
  const beam = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.75, 24, 1, true), beamMat);
  beam.position.set(0, 0.45 - 0.375, 1.6);
  gantry.add(beam);

  // maca e paciente
  const ped = solid(new THREE.BoxGeometry(0.5, 0.85, 0.7), darkMat, M.eSoft);
  ped.position.set(0, 0.52, 1.2);
  const top = solid(new THREE.BoxGeometry(0.56, 0.07, 2.2), fill(0x11161d), M.eSoft);
  top.position.set(0, 1.0, 0.75);
  const skin = fill(0x8f99a6);
  const torso = solid(new THREE.CapsuleGeometry(0.16, 0.45, 4, 10), skin, M.eSoft);
  torso.rotation.x = Math.PI / 2;
  torso.scale.set(1.3, 1, 0.7);
  torso.position.set(0, 1.15, 0.3);
  const sheet = solid(new THREE.BoxGeometry(0.5, 0.16, 1.0), fill(0x5d7287), M.eSoft);
  sheet.position.set(0, 1.12, 1.15);
  const pillow = solid(new THREE.BoxGeometry(0.4, 0.07, 0.3), fill(0xb8bfc8), M.eSoft);
  pillow.position.set(0, 1.07, -0.25);
  const pHead = solid(new THREE.SphereGeometry(0.12, 12, 8), skin, M.eSoft);
  pHead.position.set(0, 1.2, -0.22);
  group.add(ped, top, torso, sheet, pillow, pHead);

  // console fora da sala: mesa, terminal (tela que vai ao vermelho), teclado, cadeira e lâmpada de aviso
  const desk = solid(new THREE.BoxGeometry(1.3, 0.05, 0.7), fill(0x2c3542), M.eSoft);
  desk.position.set(4.3, 0.83, 0.2);
  for (const sx of [-1, 1]) {
    const leg = solid(new THREE.BoxGeometry(0.04, 0.72, 0.62), fill(0x2c3542), M.eSoft);
    leg.position.set(4.3 + sx * 0.6, 0.46, 0.2);
    group.add(leg);
  }
  const crt = solid(new THREE.BoxGeometry(0.46, 0.4, 0.42), fill(0xb8bfc8, 0.7), eWhite);
  crt.position.set(4.3, 1.06, 0.08);
  const scrMat = new THREE.MeshBasicMaterial({ color: 0x0b1a14 });
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.27), scrMat);
  scr.position.set(4.3, 1.07, 0.292);
  const txtOk = glowless(COL.mint);
  const txtBad = glowless(COL.alert);
  const lines = [];
  for (let i = 0; i < 5; i++) {
    const ln = new THREE.Mesh(new THREE.PlaneGeometry(0.12 + 0.16 * hash(i, 61), 0.018), txtOk);
    ln.position.set(4.3 - 0.15 + (0.12 + 0.16 * hash(i, 61)) / 2, 1.16 - i * 0.045, 0.294);
    lines.push(ln);
  }
  const kb = solid(new THREE.BoxGeometry(0.44, 0.03, 0.16), fill(0xb8bfc8, 0.7), eWhite);
  kb.position.set(4.3, 0.87, 0.42);
  const lampPost = solid(new THREE.BoxGeometry(0.04, 0.5, 0.04), darkMat, null);
  lampPost.position.set(3.75, 1.1, -0.05);
  const lampMat = new THREE.MeshBasicMaterial({ color: 0x3a2228 });
  const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.08), lampMat);
  lamp.position.set(3.75, 1.4, -0.05);
  const chair = new THREE.Group();
  chair.position.set(4.3, 0, 1.0);
  const seat = solid(new THREE.BoxGeometry(0.48, 0.07, 0.48), fill(0x1d242e), M.eSoft);
  seat.position.y = 0.48;
  const back = solid(new THREE.BoxGeometry(0.44, 0.5, 0.06), fill(0x1d242e), M.eSoft);
  back.position.set(0, 0.78, 0.22);
  const stem = solid(new THREE.CylinderGeometry(0.03, 0.03, 0.42, 8), darkMat, null);
  stem.position.y = 0.27;
  chair.add(seat, back, stem);
  group.add(desk, crt, scr, ...lines, kb, lampPost, lamp, chair);
  const roomLight = new THREE.PointLight(COL.alert, 0, 3.5, 1.4);
  roomLight.position.set(4.3, 2.0, 0.9);
  group.add(roomLight);

  const cOff = new THREE.Color(0x3a2228);
  const cOn = new THREE.Color(COL.alert);
  const cScr = new THREE.Color(0x0b1a14);
  const cScrBad = new THREE.Color(COL.dead);
  return {
    group,
    giro(k) {
      gantry.rotation.z = k * Math.PI * 2;
    },
    feixe(on) {
      beam.visible = on;
    },
    alerta(k) {
      lampMat.color.copy(cOff).lerp(cOn, k);
      scrMat.color.copy(cScr).lerp(cScrBad, k);
      for (const ln of lines) ln.material = k >= 0.5 ? txtBad : txtOk;
      roomLight.intensity = 4 * k;
    },
  };
}
