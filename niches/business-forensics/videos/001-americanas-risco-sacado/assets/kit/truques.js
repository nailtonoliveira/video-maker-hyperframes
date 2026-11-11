// Kit 3D do business-forensics — Truques físicos (caixas aninhadas / SPEs, pirâmide de peões e bolha especulativa).
import { THREE, solid, fill, edge, label, E, seg, clamp } from "../motor/core.js";
import { C, MBF } from "./cores.js";

export function makeShellBoxes({ nomes = ["SPE ALPHA", "OFFSHORE B", "HOLDING C"] } = {}) {
  const group = new THREE.Group();
  const sizes = [
    [1.8, 1.0, 1.4],
    [2.5, 1.4, 1.9],
    [3.3, 1.85, 2.5],
  ];
  const mats = [MBF.mogno, MBF.vinho, MBF.nanquim];
  const boxes = [];

  for (let i = 0; i < 3; i++) {
    const [w, h, d] = sizes[i];
    const bGroup = new THREE.Group();
    const body = solid(new THREE.BoxGeometry(w, h, d), mats[i % mats.length], MBF.eOuro);
    body.position.y = h / 2;
    const lidPivot = new THREE.Group();
    lidPivot.position.set(0, h, -d / 2);
    const lid = solid(new THREE.BoxGeometry(w + 0.06, 0.1, d + 0.06), MBF.ouro, MBF.eNanquim);
    lid.position.set(0, 0.05, d / 2);
    lidPivot.add(lid);

    const lbl = label((nomes[i] || `CAIXA ${i + 1}`).slice(0, 12), C.ouro, 64, 0.26, 700);
    lbl.position.set(0, h * 0.52, d / 2 + 0.02);
    bGroup.add(body, lidPivot, lbl);
    group.add(bGroup);
    boxes.push({ bGroup, lidPivot, w, h, d, baseX: (i - 1) * 3.2 });
  }

  // Documento/dívida que desliza para dentro da primeira caixa
  const doc = solid(new THREE.BoxGeometry(1.3, 0.06, 0.85), MBF.papel, MBF.eFraude);
  const docLbl = label("DÍVIDA 30 BI", C.lacre, 64, 0.22, 700);
  docLbl.rotation.x = -Math.PI / 2;
  docLbl.position.set(0, 0.036, 0);
  doc.add(docLbl);
  group.add(doc);

  return {
    group,
    swallow(k) {
      const ck = clamp(k, 0, 1);
      const slide = E.p3io(seg(ck, 0, 0.65));
      const close = E.p2in(seg(ck, 0.55, 1.0));
      doc.position.set(-3.2, 0.12 + 0.45 * Math.sin(slide * Math.PI), 2.2 * (1 - slide));
      doc.scale.setScalar(Math.max(0.001, 1 - 0.35 * slide));
      doc.visible = ck < 0.85;
      boxes[0].lidPivot.rotation.x = -1.7 * (1 - close);
    },
    nest(k) {
      const ck = clamp(k, 0, 1);
      const step1 = E.p3io(seg(ck, 0, 0.55));
      const step2 = E.p3io(seg(ck, 0.45, 1.0));

      boxes[0].bGroup.position.set(-3.2 * (1 - step1) + 3.2 * step2, 0.08 * step1, 0);
      boxes[0].bGroup.visible = step1 < 0.92;
      boxes[1].bGroup.position.set(3.2 * step2, 0.05 * step2, 0);
      boxes[1].bGroup.visible = step2 < 0.92;
      boxes[1].lidPivot.rotation.x = -1.6 * (1 - E.p2in(seg(ck, 0.35, 0.6)));
      boxes[2].bGroup.position.set(3.2 * (1 - step2), 0, 0);
      boxes[2].lidPivot.rotation.x = -1.6 * (1 - E.p2in(seg(ck, 0.75, 1.0)));
    },
  };
}

export function makePonziPyramid({ niveis = 3 } = {}) {
  const group = new THREE.Group();
  const tiers = [];
  for (let lv = 0; lv < niveis; lv++) {
    const w = (niveis - lv) * 1.45;
    const tier = solid(new THREE.BoxGeometry(w, 0.52, w), lv === niveis - 1 ? MBF.ouro : MBF.papel, MBF.eNanquim);
    const baseY = 0.26 + lv * 0.54;
    tier.position.y = baseY;
    group.add(tier);
    tiers.push({ tier, baseY, lv });
  }
  return {
    group,
    grow(k) {
      const ck = clamp(k, 0, 1);
      tiers.forEach(({ tier, lv }) => {
        const lk = E.backOut(seg(ck, lv * 0.25, lv * 0.25 + 0.45));
        tier.visible = lk > 0.01;
        tier.scale.setScalar(Math.max(0.001, lk));
      });
    },
    collapse(k) {
      const ck = clamp(k, 0, 1);
      tiers.forEach(({ tier, baseY, lv }) => {
        const lk = E.p2in(seg(ck, lv * 0.15, lv * 0.15 + 0.6));
        tier.position.y = Math.max(0.26, baseY - lk * lv * 0.5);
        tier.rotation.z = (lv % 2 === 0 ? 1 : -1) * 0.35 * lk;
      });
    },
  };
}

export function makeBubble({ r = 1.4 } = {}) {
  const group = new THREE.Group();
  const mat = fill(C.ouro, 0.45, { transparent: true, opacity: 0.78 });
  const sphere = solid(new THREE.IcosahedronGeometry(r, 1), mat, edge(C.ouro, 0.95));
  sphere.position.y = r + 0.2;
  group.add(sphere);

  return {
    group,
    inflate(k) {
      const ck = clamp(k, 0, 1);
      const s = 0.35 + 0.95 * E.p2out(ck);
      sphere.scale.setScalar(s);
      sphere.position.y = r * s + 0.2;
    },
    pop(k) {
      const ck = clamp(k, 0, 1);
      sphere.visible = ck < 0.85;
      mat.opacity = 0.78 * (1 - ck);
      sphere.scale.setScalar(1.3 + 0.4 * ck);
    },
  };
}
