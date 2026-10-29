// Kit 3D do tech-lore — exteriores: base de lançamento e foguete (Ariane 5) com seus estados.
import { THREE, COL, solid, setLook, fill, edge, glowless, label, hash } from "../motor/core.js";
import { M } from "./props.js";

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
