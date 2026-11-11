// Kit 3D do business-forensics — Torre do Império, pilha de moedas e estouro de moedas.
import { THREE, solid, fill, edge, label, E, seg, hash, clamp } from "../motor/core.js";
import { C, MBF } from "./cores.js";

// Função pura para cálculo da queda/rebobinagem de um bloco i em k (0..1), testável em Node sem WebGL.
export function collapsePose(i, total, isHollow, k, seed = 7) {
  const c = clamp(k, 0, 1);
  if (c <= 0) return { dx: 0, dy: 0, dz: 0, rx: 0, ry: 0, rz: 0, localK: 0 };
  const delay = isHollow ? 0.04 * (i / Math.max(1, total)) : 0.14 + 0.26 * (i / Math.max(1, total));
  const lk = E.p2in(seg(c, delay, Math.min(1, delay + 0.6)));
  const ang = hash(i + seed, 1) * Math.PI * 2;
  const dist = (1.2 + 2.6 * hash(i + seed, 2)) * lk;
  const dx = Math.cos(ang) * dist;
  const dz = Math.sin(ang) * dist;
  const dy = -lk * lk * (0.4 + i * 0.55);
  const rx = (hash(i + seed, 3) - 0.5) * 2.2 * lk;
  const ry = (hash(i + seed, 4) - 0.5) * 1.8 * lk;
  const rz = (hash(i + seed, 5) - 0.5) * 2.2 * lk;
  return { dx, dy, dz, rx, ry, rz, localK: lk };
}

export function makeEmpireTower({
  nome = "MONARCA S.A.",
  andares = 9,
  ocos = [3, 4, 5, 6],
  w = 2.4,
  h = 0.6,
  seed = 7,
  forma = "torre",
} = {}) {
  const group = new THREE.Group();
  const hollowSet = new Set(ocos);
  const floors = [];

  // Pedestal escuro da maquete
  const plinth = solid(new THREE.BoxGeometry(w + 0.5, 0.18, w + 0.5), MBF.nanquim, MBF.eOuro);
  plinth.position.y = 0.09;
  group.add(plinth);

  const cOuro = new THREE.Color(C.ouro);
  const cMorto = new THREE.Color(C.morto);
  const cUv = new THREE.Color(C.uv);
  const cNanquim = new THREE.Color(C.nanquim);
  const cFraude = new THREE.Color(C.fraude);

  for (let i = 0; i < andares; i++) {
    const isHollow = hollowSet.has(i);
    const scaleW = forma === "piramide" ? 1 - (i / Math.max(1, andares)) * 0.48 : 1 - (i / Math.max(1, andares)) * 0.08;
    const fw = w * scaleW;
    const fMat = new THREE.MeshStandardMaterial({
      color: C.ouro,
      roughness: 0.62,
      metalness: 0,
      flatShading: true,
      transparent: isHollow,
      opacity: 1,
    });
    const eMat = edge(C.nanquim, 0.92);
    const box = solid(new THREE.BoxGeometry(fw, h - 0.03, fw), fMat, eMat);
    const baseY = 0.18 + i * h + h / 2;
    box.position.set(0, baseY, 0);
    if (isHollow) box.userData.mesh.renderOrder = 1;
    group.add(box);
    floors.push({ box, fMat, eMat, baseY, isHollow, i });
  }

  // Placa da torre no topo (IBM Plex Mono 700, nanquim sobre ouro)
  const topY = 0.18 + andares * h;
  const signGroup = new THREE.Group();
  signGroup.position.set(0, topY + 0.24, 0);
  const signPlate = solid(new THREE.BoxGeometry(w * 0.92, 0.38, 0.14), MBF.ouro, MBF.eNanquim);
  const signLbl = label(nome.slice(0, 14), C.nanquim, 72, 0.26, 700);
  signLbl.position.set(0, 0, 0.075);
  signGroup.add(signPlate, signLbl);
  group.add(signGroup);

  // Rachadura vermelha na base e subindo pela fachada frontal (+z)
  const crackMat = new THREE.MeshBasicMaterial({ color: C.fraude });
  const crackSegs = [];
  for (let i = 0; i < Math.min(5, andares); i++) {
    const segMesh = new THREE.Mesh(new THREE.BoxGeometry(0.07, h * 0.95, 0.04), crackMat);
    segMesh.position.set((i % 2 === 0 ? -0.12 : 0.09) * (1 + i * 0.15), 0.18 + i * h + h / 2, (w / 2) + 0.025);
    segMesh.rotation.z = (i % 2 === 0 ? 0.22 : -0.25);
    group.add(segMesh);
    crackSegs.push(segMesh);
  }

  let riseState = 1;
  let revealState = 0;
  let collapseState = 0;

  function applyStates() {
    const n = floors.length;
    for (let i = 0; i < n; i++) {
      const f = floors[i];
      const rStart = (i / n) * 0.65;
      const rk = riseState >= 1 ? 1 : E.backOut(seg(riseState, rStart, rStart + 0.35));
      const cp = collapsePose(i, n, f.isHollow, collapseState, seed);

      f.box.visible = rk > 0.002;
      const s = Math.max(0.001, Math.min(1.15, rk));
      const squashY = rk > 0 && rk < 1 ? 1 + 0.15 * (1 - rk) : 1;
      f.box.scale.set(s, s * squashY, s);

      f.box.position.set(cp.dx, Math.max(0.18 + h * 0.3, f.baseY + cp.dy), cp.dz);
      f.box.rotation.set(cp.rx, cp.ry, cp.rz);

      if (f.isHollow) {
        const u = E.p2io(seg(revealState, (i / n) * 0.4, (i / n) * 0.4 + 0.6));
        f.fMat.opacity = 1 - 0.86 * u;
        f.fMat.depthWrite = u < 0.05;
        f.eMat.color.copy(cNanquim).lerp(cUv, u);
      } else {
        f.fMat.opacity = 1;
        f.fMat.depthWrite = true;
        f.eMat.color.copy(cNanquim);
      }
      f.fMat.color.copy(cOuro).lerp(cMorto, cp.localK);
      if (cp.localK > 0.2) f.eMat.color.copy(cFraude);
    }

    const topCp = collapsePose(n - 1, n, false, collapseState, seed);
    const signR = riseState >= 1 ? 1 : E.backOut(seg(riseState, 0.7, 1.0));
    signGroup.visible = signR > 0.002;
    signGroup.scale.setScalar(Math.max(0.001, signR));
    signGroup.position.set(topCp.dx, Math.max(0.35, topY + 0.24 + topCp.dy), topCp.dz);
    signGroup.rotation.set(topCp.rx, topCp.ry, topCp.rz);
  }

  return {
    group,
    topY,
    rise(k) {
      riseState = clamp(k, 0, 1);
      applyStates();
    },
    crack(k) {
      const ck = clamp(k, 0, 1);
      crackSegs.forEach((m, idx) => {
        const lim = idx === 0 ? 1 : seg(ck, idx * 0.18, idx * 0.18 + 0.25);
        m.visible = lim > 0.01 && collapseState < 0.25;
        const pulse = idx === 0 ? 0.65 + 0.35 * ck : lim;
        m.scale.set(pulse, Math.max(0.01, lim), 1);
      });
    },
    reveal(k) {
      revealState = clamp(k, 0, 1);
      applyStates();
    },
    collapse(k) {
      collapseState = clamp(k, 0, 1);
      applyStates();
    },
  };
}

export function makeCoinStack({ n = 16, r = 0.26 } = {}) {
  const group = new THREE.Group();
  const coins = [];
  const geo = new THREE.CylinderGeometry(r, r, 0.06, 16);
  for (let i = 0; i < n; i++) {
    const c = solid(geo, MBF.ouro, MBF.eNanquim);
    c.position.set(((i % 3) - 1) * 0.015, 0.03 + i * 0.064, (((i + 1) % 3) - 1) * 0.015);
    group.add(c);
    coins.push(c);
  }
  return {
    group,
    fill(k) {
      const fk = clamp(k, 0, 1);
      coins.forEach((c, i) => {
        const lk = E.backOut(seg(fk, (i / n) * 0.75, (i / n) * 0.75 + 0.25));
        c.visible = lk > 0.01;
        c.scale.setScalar(Math.max(0.001, lk));
      });
    },
  };
}

export function makeCoinBurst({ count = 120, seed = 13, origem = [0, 2.2, 0] } = {}) {
  const group = new THREE.Group();
  const geo = new THREE.CylinderGeometry(0.22, 0.22, 0.06, 16);
  const mesh = new THREE.InstancedMesh(geo, MBF.ouro, count);
  mesh.castShadow = true;
  mesh.frustumCulled = false;
  group.add(mesh);

  const m4 = new THREE.Matrix4();
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const eul = new THREE.Euler();
  const scl = new THREE.Vector3();
  const [ox, oy, oz] = origem;

  return {
    group,
    update(k) {
      const ck = clamp(k, 0, 1);
      for (let i = 0; i < count; i++) {
        if (ck <= 0.001) {
          mesh.setMatrixAt(i, m4.makeScale(0, 0, 0));
          continue;
        }
        const ang = hash(i + seed, 1) * Math.PI * 2;
        const vHoriz = 1.6 + 4.2 * hash(i + seed, 2);
        const vy = 2.0 + 4.5 * hash(i + seed, 3);
        const t = ck * 1.35;
        const x = ox + Math.cos(ang) * vHoriz * t;
        const z = oz + Math.sin(ang) * vHoriz * t;
        const y = Math.max(0.04, oy + vy * t - 6.8 * t * t);
        pos.set(x, y, z);
        eul.set(hash(i, 4) * 9 * t, hash(i, 5) * 9 * t, hash(i, 6) * 9 * t);
        quat.setFromEuler(eul);
        scl.setScalar(1);
        mesh.setMatrixAt(i, m4.compose(pos, quat, scl));
      }
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}
