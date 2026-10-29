// Kit 3D do tech-lore — exteriores: lugares e veículos reais reutilizáveis (base e Ariane 5, data center, pregão,
// radioterapia, avião, carro e sonda).
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
  const ledGeo = new THREE.BoxGeometry(0.06, 0.026, 0.012); // grande o bastante para ler a 9 m num celular
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
            const led = new THREE.Mesh(ledGeo, M.ledOff);
            led.position.set(-RW / 2 + 0.1 + k * 0.085, y + h / 2, RD / 2 + 0.034);
            r.add(led);
            ledList.push({ led, h: hash(n, 3 + k), phase: hash(n, 5 + k) * 2, on: hash(n, 7 + k) < 0.75 ? M.ledMint : M.ledCyan });
          }
        y += h;
        n++;
      }
      group.add(r);
    }

  // tampas das pontas das fileiras (o que a câmera vê de lado): painel claro com venezianas e coluna de LEDs da PDU
  const endMat = fill(0x3a4553, 0.8);
  const ventGeo = new THREE.BoxGeometry(0.012, 0.035, RD - 0.3);
  const pduGeo = new THREE.BoxGeometry(0.012, 0.05, 0.05);
  for (const side of [-1, 1])
    for (const sx of [-1, 1]) {
      const x = sx * (L / 2 + 0.012);
      const z = side * (AISLE / 2 + RD / 2);
      const end = solid(new THREE.BoxGeometry(0.024, RH - 0.06, RD - 0.04), endMat, eRack, false);
      end.position.set(x, FL + RH / 2, z);
      group.add(end);
      for (let v = 0; v < 14; v++) {
        const vent = new THREE.Mesh(ventGeo, blankMat);
        vent.position.set(x + sx * 0.013, FL + 0.95 + v * 0.065, z + side * 0.05);
        group.add(vent);
      }
      for (let k = 0; k < 6; k++) {
        const led = new THREE.Mesh(pduGeo, M.ledOff);
        led.position.set(x + sx * 0.013, FL + 0.25 + k * 0.1, z - side * (RD / 2 - 0.12));
        group.add(led);
        ledList.push({ led, h: hash(k + side * 7 + sx * 3, 9), phase: hash(k, side + sx + 11) * 2, on: k < 4 ? M.ledMint : M.ledCyan });
      }
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
  const strip = new THREE.Mesh(new THREE.BoxGeometry(L, 0.03, 0.1), glowless(0x56616e)); // luminária apagada: não rouba o olho
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
// mesas = 6: piso 9 × 8,8 m, mesas de 1,8 × 0,8 m com 4 monitores (2 × 2) e cadeira, telão de 6 × 2,4 m
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

  // texto → rótulo, LRU de 32: o mesmo número reaproveita a textura; o mais antigo é descartado (textura, material e
  // geometria). O texto desenhado só depende do valor, então a ordem dos quadros não muda o resultado.
  const LABELS_MAX = 32;
  const labels = new Map();
  let shown = null;
  return {
    group,
    telas(valor) {
      const txt = fmtNum(valor);
      let l = labels.get(txt);
      if (l) labels.delete(txt);
      else {
        l = label(txt, COL.ink, 140, 0.42);
        l.position.x = l.userData.w / 2;
      }
      labels.set(txt, l);
      if (labels.size > LABELS_MAX) {
        const [oldTxt, old] = labels.entries().next().value;
        labels.delete(oldTxt);
        if (shown === old) {
          numHolder.remove(old);
          shown = null;
        }
        old.material.map.dispose();
        old.material.dispose();
        old.geometry.dispose();
      }
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
// paredes de blindagem cortadas a 0,75 m (corte da maquete) e o console (terminal) fora da sala, em +x (piso até x = 5,3).
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

  // maca e paciente: pés para a máquina e cabeça em +z (do lado da câmera, fora do cone do feixe); o feixe cai no
  // abdome, no isocentro (z = 0). Maca de 2,5 m em balanço sobre a coluna.
  const ped = solid(new THREE.BoxGeometry(0.5, 0.85, 0.7), darkMat, M.eSoft);
  ped.position.set(0, 0.52, 0.95);
  const top = solid(new THREE.BoxGeometry(0.56, 0.07, 2.5), fill(0x11161d), M.eSoft);
  top.position.set(0, 1.0, -0.2);
  const skin = fill(0xa9b2bd);
  const sheetMat = fill(0x5d7287);
  const capsule = (r, len, mat, x, y, z, sx = 1, sz = 1) => {
    const c = solid(new THREE.CapsuleGeometry(r, len, 4, 12), mat, M.eSoft);
    c.rotation.x = Math.PI / 2; // eixo da cápsula ao longo da maca (z); escala: sx largura, sz espessura
    c.scale.set(sx, 1, sz);
    c.position.set(x, y, z);
    return c;
  };
  const torso = capsule(0.16, 0.42, skin, 0, 1.15, 0.2, 1.35, 0.75);
  const arms = [-1, 1].map((sx) => capsule(0.055, 0.45, skin, sx * 0.27, 1.1, 0.18));
  const legs = capsule(0.19, 0.72, sheetMat, 0, 1.115, -0.75, 1.2, 0.5); // lençol sobre as pernas
  const feet = [-1, 1].map((sx) => {
    const f = solid(new THREE.SphereGeometry(0.07, 10, 6), sheetMat, M.eSoft);
    f.scale.set(1, 1.3, 0.8);
    f.position.set(sx * 0.09, 1.2, -1.26);
    return f;
  });
  const pillow = solid(new THREE.BoxGeometry(0.4, 0.07, 0.3), fill(0xb8bfc8), M.eSoft);
  pillow.position.set(0, 1.07, 0.66);
  const pHead = solid(new THREE.SphereGeometry(0.145, 14, 10), fill(0xc3cad3), M.eSoft);
  pHead.position.set(0, 1.23, 0.64);
  group.add(ped, top, torso, ...arms, legs, ...feet, pillow, pHead);

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

// ---------- auxiliares dos exteriores novos ----------
// placa extrudada: contorno [x, z] no plano horizontal, espessura th centrada em y = 0
function plankXZ(pts, th, f, e) {
  const sh = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, z)));
  const geo = new THREE.ExtrudeGeometry(sh, { depth: th, bevelEnabled: false });
  geo.rotateX(Math.PI / 2); // (x, v) → (x, z); a extrusão desce em y
  geo.translate(0, th / 2, 0);
  return solid(geo, f, e);
}
// placa extrudada: contorno [x, y] no plano vertical, espessura th centrada em z = 0
function plankXY(pts, th, f, e) {
  const sh = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  const geo = new THREE.ExtrudeGeometry(sh, { depth: th, bevelEnabled: false });
  geo.translate(0, 0, -th / 2);
  return solid(geo, f, e);
}
// cilindro deitado ao longo de x (rTop na ponta +x)
function cylX(rTop, rBot, len, seg, f, e) {
  const geo = new THREE.CylinderGeometry(rTop, rBot, len, seg);
  geo.rotateZ(-Math.PI / 2);
  return solid(geo, f, e);
}

// ==================== avião comercial (bimotor de corredor único, tipo A320 / 737) ====================
// 1 u ≈ 5 m (a mesma escala do Ariane e do terreno). Origem no centro da fuselagem, na altura da asa; nariz em +x,
// asas ao longo de z. Comprimento ~7,5 u, envergadura ~7,2 u, deriva até y = 1,95. Com trem(1), rodas em y = −0,92.
// pose(p, a): posição e arfagem (rotação em torno de z, nariz para cima com a > 0) — alvo de follow(…).
// trem(k): 0 = recolhido (escondido), 1 = baixado. dano(k): 0 → 1, a ponta da asa direita (+z) se solta e gira,
// a turbina direita fica com aresta vermelha, fogo facetado e fumaça escura atrás.
export function makeAirplane() {
  const white = fill(0xe4e8ee, 0.7);
  const eWhite = edge(0x6b7684, 0.55);
  const wingMat = fill(0xb9c0c8, 0.7);
  const livery = fill(0x3d5878, 0.7);
  const glass = fill(0x161d27, 0.5);
  const darkMetal = fill(0x3a414a);
  const tire = fill(0x15191f, 0.9);
  const group = new THREE.Group();

  // fuselagem: perfil de revolução (eixo x) com a cauda levantada (o ventre sobe, o dorso fica reto)
  const R = 0.4;
  const prof = [[0, -3.76], [0.07, -3.74], [0.16, -3.5], [0.27, -3.0], [0.36, -2.4], [0.4, -1.9], [0.4, 2.6], [0.38, 2.95],
    [0.33, 3.25], [0.24, 3.5], [0.12, 3.68], [0, 3.76]];
  const rAt = (s) => {
    for (let i = 1; i < prof.length; i++)
      if (s <= prof[i][1]) {
        const [r0, s0] = prof[i - 1];
        const [r1, s1] = prof[i];
        return r0 + ((r1 - r0) * (s - s0)) / (s1 - s0);
      }
    return 0;
  };
  const lift = (s) => (s < -1.9 ? 0.85 * (R - rAt(s)) : 0); // subida da linha de centro na cauda
  const fGeo = new THREE.LatheGeometry(prof.map(([r, s]) => new THREE.Vector2(r, s)), 24);
  fGeo.rotateZ(-Math.PI / 2); // eixo y → x (nariz em +x)
  const fp = fGeo.attributes.position;
  for (let i = 0; i < fp.count; i++) fp.setY(i, fp.getY(i) + lift(fp.getX(i)));
  fGeo.computeVertexNormals();
  const hull = solid(fGeo, white, eWhite);
  group.add(hull);
  // peça fina no casco: s ao longo do eixo, th ângulo a partir do topo (para +z), inclinada com a curva do nariz
  const onHull = (s, th, w, h, mat) => {
    const r = rAt(s) + 0.004;
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.012, h), mat);
    const slope = (rAt(s + 0.02) - rAt(s - 0.02)) / 0.04;
    m.position.set(s, r * Math.cos(th) + lift(s), r * Math.sin(th));
    m.rotation.set(th, 0, Math.atan(slope));
    group.add(m);
    return m;
  };
  for (const th of [-0.95, -0.35, 0.35, 0.95]) onHull(3.33, th, 0.15, 0.13, glass); // para-brisa
  for (let s = -1.75; s <= 2.45; s += 0.16) for (const th of [-1.25, 1.25]) onHull(s, th, 0.07, 0.085, glass); // janelas
  for (const th of [-1.6, 1.6]) onHull(0.35, th, 4.4, 0.06, livery); // faixa da pintura
  for (const [s, th] of [[2.75, 1.22], [2.75, -1.22], [-2.05, 1.22], [-2.05, -1.22]]) onHull(s, th, 0.1, 0.17, fill(0xc4cad2, 0.7)); // portas

  // asas baixas, enflechadas, com diedro de 5°; a ponta direita (+z) é uma peça à parte (dano)
  const LE = (z) => 0.9 - (z - 0.2) * 0.4647;
  const TE = (z) => (z < 1.4 ? -0.8 : -0.8 - (z - 1.4) * 0.1364);
  const ZK = 2.6;
  let tip = null;
  let tipBase = null;
  for (const sz of [-1, 1]) {
    const wing = new THREE.Group();
    wing.position.set(0, -0.22, 0);
    wing.rotation.x = -sz * 0.09;
    group.add(wing);
    const inner = plankXZ([[0.9, 0.2 * sz], [LE(ZK), ZK * sz], [TE(ZK), ZK * sz], [-0.8, 1.4 * sz], [-0.8, 0.2 * sz]], 0.07, wingMat, eWhite);
    wing.add(inner);
    const outer = new THREE.Group(); // pivô na raiz da ponta (bordo de ataque)
    outer.position.set(LE(ZK), 0, ZK * sz);
    wing.add(outer);
    const ow = plankXZ([[0, 0], [LE(3.6) - LE(ZK), (3.6 - ZK) * sz], [TE(3.6) - LE(ZK), (3.6 - ZK) * sz], [TE(ZK) - LE(ZK), 0]], 0.07, wingMat, eWhite);
    const wl = plankXY([[LE(3.6) - LE(ZK), 0], [TE(3.6) - LE(ZK), 0], [TE(3.6) - LE(ZK) - 0.18, 0.48], [TE(3.6) - LE(ZK) + 0.06, 0.48]], 0.03, livery, eWhite);
    wl.position.z = (3.6 - ZK) * sz;
    outer.add(ow, wl);
    if (sz > 0) {
      tip = outer;
      tipBase = outer.position.clone();
    }
  }

  // empenagem: estabilizadores horizontais e deriva com a cor da pintura
  for (const sz of [-1, 1]) {
    const hs = plankXZ([[-2.5, 0.12 * sz], [-3.2, 1.35 * sz], [-3.52, 1.35 * sz], [-3.45, 0.12 * sz]], 0.05, wingMat, eWhite);
    hs.position.y = 0.12;
    hs.rotation.x = -sz * 0.1;
    group.add(hs);
  }
  const fin = plankXY([[-2.2, 0.25], [-3.3, 1.95], [-3.72, 1.95], [-3.66, 0.25]], 0.06, livery, eWhite);
  group.add(fin);

  // turbinas sob as asas: nacele, entrada escura com cone, pilone e escape
  const engines = [];
  for (const sz of [-1, 1]) {
    const eg = new THREE.Group();
    eg.position.set(0.5, -0.43, 1.25 * sz);
    group.add(eg);
    const nac = cylX(0.23, 0.18, 0.95, 20, white, eWhite);
    const fan = new THREE.Mesh(new THREE.CircleGeometry(0.19, 20), fill(0x10151c));
    fan.rotation.y = Math.PI / 2;
    fan.position.x = 0.476;
    const spin = solid(new THREE.ConeGeometry(0.06, 0.12, 12).rotateZ(-Math.PI / 2), darkMetal, null);
    spin.position.x = 0.5;
    const exh = solid(new THREE.ConeGeometry(0.12, 0.25, 12).rotateZ(Math.PI / 2), darkMetal, null);
    exh.position.x = -0.6;
    const pylon = solid(new THREE.BoxGeometry(0.7, 0.2, 0.06), wingMat, eWhite);
    pylon.position.set(-0.1, 0.22, 0);
    eg.add(nac, fan, spin, exh, pylon);
    engines.push(nac);
  }
  // dano: fogo facetado e fumaça escura atrás da turbina direita
  const fireMat = glowless(0xffa052);
  const fire = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.7, 7).rotateZ(Math.PI / 2), fireMat);
  fire.position.set(-0.45, -0.43, 1.25);
  group.add(fire);
  const smokeMat = fill(0x2a2f36, 0.95);
  const smoke = Array.from({ length: 6 }, (_, i) => {
    const m = solid(new THREE.IcosahedronGeometry(0.2 + 0.07 * i, 0), smokeMat, null, false);
    m.position.set(-0.8 - 0.55 * i, -0.43 + 0.05 * i, 1.25 + 0.08 * (hash(i, 71) - 0.5));
    m.rotation.set(hash(i, 72) * 3, hash(i, 73) * 3, 0);
    group.add(m);
    return m;
  });

  // trem de pouso: dois principais (recolhem para o centro) e o do nariz (recolhe para a frente)
  const gear = [];
  const leg = (x, z, axis, dir, wheelsZ) => {
    const g = new THREE.Group();
    g.position.set(x, -0.3, z);
    const strut = solid(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 8), darkMetal, null);
    strut.position.y = -0.25;
    g.add(strut);
    for (const wz of wheelsZ) {
      const w = solid(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 14).rotateX(Math.PI / 2), tire, M.eSoft);
      w.position.set(0, -0.5, wz);
      g.add(w);
    }
    group.add(g);
    gear.push({ g, axis, dir });
  };
  for (const sz of [-1, 1]) leg(-0.35, 0.75 * sz, "x", sz, [-0.06, 0.06]);
  leg(2.7, 0, "z", 1, [-0.05, 0.05]);

  const eEngineBad = edge(COL.alert);
  group.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });
  return {
    group,
    pose(p, a) {
      group.position.copy(p);
      group.rotation.set(0, 0, a);
    },
    trem(k) {
      for (const { g, axis, dir } of gear) {
        g.visible = k > 0.02;
        g.rotation.set(0, 0, 0);
        g.rotation[axis] = dir * (Math.PI / 2) * (1 - k);
      }
    },
    dano(k) {
      tip.position.set(tipBase.x - 1.6 * k, tipBase.y - 1.1 * k, tipBase.z + 0.9 * k);
      tip.rotation.set(1.6 * k, 0.7 * k, -0.5 * k);
      setLook(engines[1], white, k >= 0.5 ? eEngineBad : eWhite);
      fire.visible = k > 0.02;
      fire.scale.set(Math.max(0.01, k), 1, 1);
      smoke.forEach((m, i) => {
        const s = clamp01(k * 1.4 - i * 0.08);
        m.visible = s > 0.01;
        m.scale.setScalar(Math.max(0.01, s));
      });
    },
  };
}
const clamp01 = (x) => Math.max(0, Math.min(1, x));

// ==================== carro de passeio (sedã compacto) ====================
// 1 u = 1 m; origem no chão, no centro do carro; frente em +x. 4,4 × 1,8 × 1,43 m, entre-eixos 2,65 m, rodas de 0,32 m.
// rodas(ang): giro das rodas em radianos (positivo = rolando para +x; use distância / 0,32). freio(on): lanternas e
// luz de freio acesas em vermelho. opts.cor: cor da lataria.
export function makeCar({ cor = 0x50647c } = {}) {
  const body = fill(cor, 0.6);
  const eBody = edge(0x0d1117, 0.7);
  const glass = fill(0x141b24, 0.4);
  const dark = fill(0x10151b, 0.9);
  const group = new THREE.Group();
  const RA = -1.3;
  const FA = 1.35;
  const WR = 0.32;
  const W = 1.78;

  // lataria: perfil lateral extrudado na largura, com os arcos das rodas recortados
  const sh = new THREE.Shape();
  const dx = Math.sqrt(0.4 * 0.4 - 0.1 * 0.1);
  const a0 = Math.asin(0.1 / 0.4);
  sh.moveTo(-2.22, 0.36);
  sh.lineTo(-2.15, 0.22);
  sh.lineTo(RA - dx, 0.22);
  sh.absarc(RA, WR, 0.4, Math.PI + a0, -a0, true);
  sh.lineTo(FA - dx, 0.22);
  sh.absarc(FA, WR, 0.4, Math.PI + a0, -a0, true);
  sh.lineTo(2.13, 0.22);
  sh.lineTo(2.21, 0.32);
  sh.lineTo(2.23, 0.55);
  sh.lineTo(2.14, 0.72);
  sh.lineTo(1.0, 0.86);
  sh.lineTo(-1.75, 0.92);
  sh.lineTo(-2.12, 0.89);
  sh.lineTo(-2.23, 0.62);
  sh.lineTo(-2.22, 0.36);
  const bGeo = new THREE.ExtrudeGeometry(sh, { depth: W, bevelEnabled: false, curveSegments: 10 });
  bGeo.translate(0, 0, -W / 2);
  group.add(solid(bGeo, body, eBody));
  // cabine de vidro escuro (mais estreita) com teto e colunas da cor da lataria
  const cab = plankXY([[1.02, 0.85], [0.15, 1.37], [-1.05, 1.39], [-1.76, 0.91]], 1.5, glass, eBody);
  const roof = plankXY([[0.2, 1.36], [0.12, 1.43], [-1.06, 1.43], [-1.1, 1.37]], 1.54, body, eBody);
  group.add(cab, roof);
  for (const sz of [-1, 1]) {
    const bp = solid(new THREE.BoxGeometry(0.1, 0.5, 0.02), body, null);
    bp.position.set(-0.4, 1.14, sz * 0.751);
    const cp = plankXY([[-1.25, 0.92], [-1.0, 1.38], [-1.12, 1.38], [-1.62, 0.92]], 0.02, body, null);
    cp.position.z = sz * 0.751;
    const mirror = solid(new THREE.BoxGeometry(0.12, 0.09, 0.14), body, eBody);
    mirror.position.set(0.88, 0.98, sz * 0.96);
    group.add(bp, cp, mirror);
    // costuras das portas e maçanetas
    const seams = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([
      [0.95, 0.3, 0.86], [0.95, 0.84, 0.86], [-0.4, 0.26, 0.9], [-0.4, 0.9, 0.9], [-1.55, 0.3, 0.86], [-1.55, 0.92, 0.86],
    ].map(([x, y, h]) => new THREE.Vector3(x, y, sz * (W / 2 + 0.003)))), edge(0x0d1117, 0.9));
    group.add(seams);
    for (const x of [0.55, -0.85]) {
      const hd = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.02), dark);
      hd.position.set(x, 0.78, sz * (W / 2 + 0.008));
      group.add(hd);
    }
  }
  // frente: faróis, grade e para-choque; traseira: lanternas, placa e para-choque
  for (const sz of [-1, 1]) {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.36), glowless(0xdfe6ee));
    hl.position.set(2.19, 0.62, sz * 0.6);
    group.add(hl);
  }
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.8), dark);
  grille.position.set(2.225, 0.44, 0);
  const bumpF = solid(new THREE.BoxGeometry(0.1, 0.12, W + 0.02), dark, null);
  bumpF.position.set(2.18, 0.3, 0);
  const bumpR = solid(new THREE.BoxGeometry(0.1, 0.12, W + 0.02), dark, null);
  bumpR.position.set(-2.18, 0.32, 0);
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.4), fill(0xc9d0d8));
  plate.position.set(-2.235, 0.5, 0);
  group.add(grille, bumpF, bumpR, plate);
  const tailOff = glowless(0x4a1c22);
  const tailOn = glowless(COL.alert);
  const tails = [];
  for (const sz of [-1, 1]) {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.38), tailOff);
    tl.position.set(-2.225, 0.72, sz * 0.62);
    group.add(tl);
    tails.push(tl);
  }
  const third = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.4), tailOff);
  third.position.set(-1.7, 0.99, 0);
  group.add(third);
  tails.push(third);
  const brakeLight = new THREE.PointLight(COL.alert, 0, 3.5, 1.6);
  brakeLight.position.set(-2.6, 0.6, 0);
  group.add(brakeLight);

  // rodas: pneu, aro claro e 5 raios (o giro aparece)
  const tireMat = fill(0x15191f, 0.9);
  const rimMat = fill(0x9aa3ad, 0.5);
  const rims = [];
  for (const x of [RA, FA])
    for (const sz of [-1, 1]) {
      const wg = new THREE.Group();
      wg.position.set(x, WR, sz * 0.8);
      const tr = solid(new THREE.CylinderGeometry(WR, WR, 0.22, 22).rotateX(Math.PI / 2), tireMat, M.eSoft);
      const rim = new THREE.Group();
      const disc = solid(new THREE.CylinderGeometry(0.2, 0.2, 0.226, 16).rotateX(Math.PI / 2), rimMat, null);
      rim.add(disc);
      for (let k = 0; k < 5; k++) {
        const sp = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, 0.01), dark);
        const a = (k / 5) * Math.PI * 2;
        sp.position.set(0.09 * Math.sin(a), 0.09 * Math.cos(a), sz * 0.115);
        sp.rotation.z = -a;
        rim.add(sp);
      }
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.24, 10).rotateX(Math.PI / 2), dark);
      rim.add(hub);
      wg.add(tr, rim);
      group.add(wg);
      rims.push(rim);
    }
  group.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });
  return {
    group,
    rodas(ang) {
      for (const r of rims) r.rotation.z = -ang;
    },
    freio(on) {
      for (const t of tails) t.material = on ? tailOn : tailOff;
      brakeLight.intensity = on ? 3 : 0;
    },
  };
}

// ==================== sonda espacial (corpo dourado, antena parabólica e duas asas de painéis solares) ====================
// Origem no centro do corpo; antena em +y, asas ao longo de z, motor em −y. Corpo 1,2 × 0,9 × 1,2, prato de 1,8 de
// diâmetro, envergadura aberta ~7,2 (escala livre: 1 u ≈ 1 m numa sonda média).
// paineis(k): 0 = asas dobradas junto ao corpo, 1 = abertas (0–0,4 a asa desce/sobe, 0,4–1 os painéis desdobram).
// antena(ang): inclinação do prato em radianos em torno de z (0 = apontando para +y). pose(p, a): posição e rotação em
// torno de z — alvo de follow(…).
export function makeSpaceProbe() {
  const gold = fill(0xa8863f, 0.55);
  const eGold = edge(0x3b2e14, 0.8);
  const white = fill(0xdfe4ea, 0.7);
  const eWhite = edge(0x6b7684, 0.6);
  const darkMetal = fill(0x3a414a);
  const cellMat = fill(0x1d3557, 0.4);
  const eCell = edge(0x6f8fb3, 0.8);
  const group = new THREE.Group();

  const bus = solid(new THREE.BoxGeometry(1.2, 0.9, 1.2), gold, eGold);
  const deck = solid(new THREE.BoxGeometry(1.26, 0.06, 1.26), darkMetal, M.eSoft);
  deck.position.y = 0.48;
  const deckB = solid(new THREE.BoxGeometry(1.26, 0.06, 1.26), darkMetal, M.eSoft);
  deckB.position.y = -0.48;
  group.add(bus, deck, deckB);
  // motor principal e propulsores de atitude nos cantos
  const noz = solid(new THREE.CylinderGeometry(0.12, 0.26, 0.4, 16, 1, true), darkMetal, M.eSoft);
  noz.position.y = -0.71;
  group.add(noz);
  for (const [x, z] of [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]]) {
    const q = solid(new THREE.BoxGeometry(0.1, 0.1, 0.1), darkMetal, null);
    q.position.set(x, -0.36, z);
    group.add(q);
  }
  // instrumentos: plataforma de câmeras em +x, rastreador de estrelas e mastro do magnetômetro
  const cam = solid(new THREE.BoxGeometry(0.22, 0.2, 0.3), white, eWhite);
  cam.position.set(0.72, -0.15, 0.2);
  const lens = solid(new THREE.CylinderGeometry(0.06, 0.07, 0.14, 12).rotateZ(-Math.PI / 2), darkMetal, null);
  lens.position.set(0.88, -0.15, 0.2);
  const star = solid(new THREE.BoxGeometry(0.14, 0.14, 0.14), darkMetal, M.eSoft);
  star.position.set(-0.4, 0.58, -0.4);
  const boom = solid(new THREE.CylinderGeometry(0.015, 0.015, 2.2, 6).rotateZ(Math.PI / 2), white, null);
  boom.position.set(-1.7, -0.3, 0);
  const mag = solid(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 10).rotateZ(Math.PI / 2), white, eWhite);
  mag.position.set(-2.85, -0.3, 0);
  group.add(cam, lens, star, boom, mag);

  // antena parabólica num mastro, com alimentador no foco sobre três hastes
  const mast = solid(new THREE.CylinderGeometry(0.06, 0.08, 0.3, 10), darkMetal, null);
  mast.position.y = 0.66;
  group.add(mast);
  const dish = new THREE.Group();
  dish.position.y = 0.8;
  group.add(dish);
  const FOC = 0.45;
  const dPts = Array.from({ length: 9 }, (_, i) => {
    const r = (0.9 * i) / 8;
    return new THREE.Vector2(r, (r * r) / (4 * FOC));
  });
  const bowl = solid(new THREE.LatheGeometry(dPts, 28), fill(0xdfe4ea, 0.7, { side: THREE.DoubleSide }), eWhite);
  const feed = solid(new THREE.CylinderGeometry(0.05, 0.07, 0.14, 10), darkMetal, null);
  feed.position.y = FOC;
  dish.add(bowl, feed);
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2;
    const base = new THREE.Vector3(0.78 * Math.cos(a), (0.78 * 0.78) / (4 * FOC), 0.78 * Math.sin(a));
    const tipP = new THREE.Vector3(0, FOC, 0);
    const len = base.distanceTo(tipP);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, len, 5), darkMetal);
    rod.position.copy(base).add(tipP).multiplyScalar(0.5);
    rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tipP.clone().sub(base).normalize());
    dish.add(rod);
  }

  // asas de painéis: braço + 3 painéis em sanfona (1,0 × 0,9), células com grade
  const PL = 1.0;
  const PW = 0.9;
  const PT = 0.03;
  const panelOf = (sz) => {
    const g = new THREE.Group();
    const p = solid(new THREE.BoxGeometry(PW, PT, PL), cellMat, eCell);
    p.position.z = (sz * PL) / 2;
    g.add(p);
    const pts = [];
    for (let i = 1; i < 4; i++) pts.push(new THREE.Vector3(-PW / 2 + (i * PW) / 4, PT / 2 + 0.002, 0), new THREE.Vector3(-PW / 2 + (i * PW) / 4, PT / 2 + 0.002, sz * PL));
    for (let i = 1; i < 5; i++) pts.push(new THREE.Vector3(-PW / 2, PT / 2 + 0.002, (sz * i * PL) / 5), new THREE.Vector3(PW / 2, PT / 2 + 0.002, (sz * i * PL) / 5));
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), edge(0x6f8fb3, 0.45)));
    return g;
  };
  const wings = [];
  for (const sz of [-1, 1]) {
    const root = new THREE.Group();
    root.position.set(0, 0.1, sz * 0.6);
    group.add(root);
    const yoke = solid(new THREE.BoxGeometry(0.05, 0.05, 0.4), white, null);
    yoke.position.z = sz * 0.2;
    root.add(yoke);
    const p1 = panelOf(sz);
    p1.position.z = sz * 0.4;
    root.add(p1);
    const h2 = new THREE.Group();
    h2.position.set(0, PT, sz * PL);
    p1.add(h2);
    const p2 = panelOf(sz);
    p2.position.y = -PT;
    h2.add(p2);
    const h3 = new THREE.Group();
    h3.position.set(0, -PT, sz * PL);
    p2.add(h3);
    const p3 = panelOf(sz);
    p3.position.y = PT;
    h3.add(p3);
    wings.push({ sz, root, h2, h3 });
  }
  group.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });
  return {
    group,
    paineis(k) {
      const k1 = clamp01(k / 0.4);
      const k2 = clamp01((k - 0.4) / 0.6);
      for (const { sz, root, h2, h3 } of wings) {
        root.rotation.x = sz * (Math.PI / 2) * (1 - k1);
        h2.rotation.x = sz * -Math.PI * (1 - k2);
        h3.rotation.x = sz * Math.PI * (1 - k2);
      }
    },
    antena(ang) {
      dish.rotation.set(0, 0, ang);
    },
    pose(p, a) {
      group.position.copy(p);
      group.rotation.set(0, 0, a);
    },
  };
}
