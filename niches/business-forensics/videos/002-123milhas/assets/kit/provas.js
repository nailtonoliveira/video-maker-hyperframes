// Kit 3D do business-forensics — Provas (etiqueta de prova, fio vermelho, pasta do caso e marca do carimbo).
import { THREE, solid, label, E, clamp } from "../motor/core.js";
import { C, MBF } from "./cores.js";

export function makeEvidenceTag({ texto = "PROVA A: BALANÇO" } = {}) {
  const group = new THREE.Group();
  const card = solid(new THREE.BoxGeometry(1.3, 0.56, 0.025), MBF.papel, MBF.eNanquim);
  card.position.y = 0.28;
  const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 12), MBF.nanquim);
  hole.rotation.x = Math.PI / 2;
  hole.position.set(-0.52, 0.28, 0);
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.35, 6), MBF.sepia);
  cord.rotation.z = 0.6;
  cord.position.set(-0.66, 0.18, 0);
  const txt = label(texto.slice(0, 16), "#4c35b8", 64, 0.22, 700);
  txt.position.set(0.06, 0.28, 0.016);
  group.add(card, hole, cord, txt);

  return {
    group,
    show(k = 1) {
      const s = clamp(E.backOut(clamp(k, 0, 1)), 0, 1.15);
      group.visible = k > 0.005;
      group.scale.set(1, Math.max(0.001, s), 1);
    },
  };
}

export function makeRedString(pontos = [[-2.2, 0.12, -1.2], [0.0, 0.12, 0.6], [2.2, 0.12, -0.8]]) {
  const group = new THREE.Group();
  const vecs = pontos.map((p) => (p.isVector3 ? p.clone() : new THREE.Vector3(...p)));
  const totalSegs = 64;
  const pts = [];
  for (let i = 0; i <= totalSegs; i++) {
    const u = i / totalSegs;
    const scaled = u * (vecs.length - 1);
    const idx = Math.min(vecs.length - 2, Math.floor(scaled));
    const frac = scaled - idx;
    const v = new THREE.Vector3().lerpVectors(vecs[idx], vecs[idx + 1], frac);
    v.y += 0.03 * Math.sin(frac * Math.PI);
    pts.push(v);
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: C.lacre }));
  group.add(line);

  const pins = vecs.map((v) => {
    const pin = new THREE.Group();
    pin.position.copy(v);
    const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.16, 8), MBF.taupe);
    needle.position.y = 0.08;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), MBF.lacre);
    head.position.y = 0.17;
    pin.add(needle, head);
    group.add(pin);
    return pin;
  });

  return {
    group,
    draw(k) {
      const ck = clamp(k, 0, 1);
      const n = Math.floor(ck * (totalSegs + 1));
      geo.setDrawRange(0, n);
      pins.forEach((p, idx) => {
        const thresh = idx / Math.max(1, pins.length - 1);
        p.visible = ck >= thresh - 0.02;
      });
    },
  };
}

export function makeCaseFolder({ caso = "CASO 001", nome = "AUDITORIA: APROVADA" } = {}) {
  const group = new THREE.Group();
  const back = solid(new THREE.BoxGeometry(2.2, 0.04, 1.5), MBF.bege, MBF.eNanquim);
  back.position.y = 0.02;
  const page = solid(new THREE.BoxGeometry(2.0, 0.03, 1.35), MBF.papel, MBF.eNanquim);
  page.position.y = 0.05;
  const pageLbl = label(nome.slice(0, 16), C.lacre, 64, 0.24, 700);
  pageLbl.rotation.x = -Math.PI / 2;
  pageLbl.position.set(0, 0.068, 0.1);
  page.add(pageLbl);

  const pivot = new THREE.Group();
  pivot.position.set(0, 0.07, -0.75);
  const cover = solid(new THREE.BoxGeometry(2.2, 0.04, 1.5), MBF.bege, MBF.eNanquim);
  cover.position.set(0, 0, 0.75);
  const coverLbl = label(caso.slice(0, 14), C.nanquim, 64, 0.24, 700);
  coverLbl.rotation.x = -Math.PI / 2;
  coverLbl.position.set(0, 0.024, 0.75);
  cover.add(coverLbl);
  pivot.add(cover);

  group.add(back, page, pivot);
  return {
    group,
    open(k) {
      pivot.rotation.x = -2.1 * E.p2io(clamp(k, 0, 1));
    },
  };
}

export function makeStampMark(texto = "FRAUDE") {
  const group = new THREE.Group();
  const plate = solid(new THREE.BoxGeometry(1.5, 0.02, 0.62), MBF.lacre, MBF.eNanquim, false);
  plate.position.y = 0.012;
  const txt = label(texto.slice(0, 10), "#fff4e0", 72, 0.28, 700);
  txt.rotation.x = -Math.PI / 2;
  txt.position.set(0, 0.024, 0);
  group.add(plate, txt);

  return {
    group,
    press(k) {
      const ck = clamp(k, 0, 1);
      group.visible = ck > 0.01;
      const s = ck > 0 ? 1 + 0.08 * (1 - ck) : 0.001;
      group.scale.set(s, 1, s);
    },
  };
}
