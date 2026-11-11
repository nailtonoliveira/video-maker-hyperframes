// Kit 3D do business-forensics — Mundo do Livro-Caixa (página gigante como chão em (0, -200, 0) + lançamentos contábeis).
import { THREE, solid, floorLabel, E, clamp } from "../motor/core.js";
import { C, MBF } from "./cores.js";
import { TEMA_SALA } from "./sala.js";

function makeLedgerPageTex() {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 1280;
  const ctx = c.getContext("2d");
  ctx.fillStyle = TEMA_SALA.matBg;
  ctx.fillRect(0, 0, 2048, 1280);
  ctx.strokeStyle = TEMA_SALA.gridMinor;
  ctx.lineWidth = 2;
  for (let y = 32; y < 1280; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(2048, y);
    ctx.stroke();
  }
  ctx.strokeStyle = TEMA_SALA.gridMajor;
  ctx.lineWidth = 3;
  for (let x = 256; x < 2048; x += 256) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1280);
    ctx.stroke();
  }
  ctx.strokeStyle = TEMA_SALA.marginLine;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(192, 0);
  ctx.lineTo(192, 1280);
  ctx.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeLedger({
  titulo = "LIVRO-CAIXA // 2001",
  linhas = ["RECEITA ...... 74 BI", "DÍVIDA ....... 30 BI", "CAIXA REAL .... 0 BI"],
  linhaFraude = 1,
} = {}) {
  const group = new THREE.Group();

  // Capa dura de mogno ao redor da página
  const cover = solid(new THREE.BoxGeometry(38, 0.4, 26), MBF.mogno, MBF.eNanquim);
  cover.position.y = -0.21;
  group.add(cover);

  // Página pautada 36 × 24 u como chão em y = 0
  const pageMat = new THREE.MeshStandardMaterial({ map: makeLedgerPageTex(), roughness: 0.92 });
  const page = new THREE.Mesh(new THREE.PlaneGeometry(36, 24), pageMat);
  page.rotation.x = -Math.PI / 2;
  page.position.y = 0.005;
  page.receiveShadow = true;
  group.add(page);

  // Cabeçalho do livro
  const hdr = floorLabel(titulo.slice(0, 22), C.nanquim, 84, 0.72, 700);
  hdr.position.set(0, 0.02, -4.6);
  group.add(hdr);

  // Linhas de lançamento contábil
  const rows = [];
  linhas.forEach((txt, i) => {
    const z = -2.2 + i * 2.1;
    const rowGroup = new THREE.Group();
    rowGroup.position.set(0, 0.02, z);
    const isFraud = i === linhaFraude;
    const lbl = floorLabel(txt.slice(0, 22), isFraud ? C.lacre : C.nanquim, 84, 0.68, 700);
    const barMat = new THREE.MeshBasicMaterial({ color: isFraud ? C.lacre : C.ouro });
    const bar = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.03, 0.14), barMat);
    bar.position.set(0, 0.01, 0.52);
    bar.scale.x = 0.001;
    rowGroup.add(lbl, bar);
    group.add(rowGroup);
    rows.push({ rowGroup, lbl, bar, barMat, baseZ: z, isFraud });
  });

  // Iluminação local do mundo livro (SpotLight em y = 14 sobre a página + hemisférica)
  const hemi = new THREE.HemisphereLight(0xf6e7cf, 0x241914, 0.75);
  const spot = new THREE.SpotLight(0xfff1d6, 34, 34, 0.68, 0.45, 1.8);
  spot.position.set(0, 14, 2);
  spot.target.position.set(0, 0, 0);
  group.add(hemi, spot, spot.target);

  const cLacre = new THREE.Color(C.lacre);
  const cUv = new THREE.Color(C.uv);

  return {
    group,
    rows,
    open(k = 1) {
      const ck = clamp(k, 0, 1);
      group.scale.set(1, 1, Math.max(0.01, E.p2out(ck)));
    },
    flip(k = 0) {
      const ck = clamp(k, 0, 1);
      page.rotation.z = 0.04 * Math.sin(ck * Math.PI);
    },
    mark(i, k = 0) {
      const r = rows[i];
      if (!r) return;
      const ck = clamp(k, 0, 1);
      r.bar.visible = ck > 0.01;
      r.bar.scale.x = Math.max(0.001, E.p2out(ck));
    },
    uv(k = 0) {
      const ck = clamp(k, 0, 1);
      const r = rows[linhaFraude];
      if (r) r.barMat.color.copy(cLacre).lerp(cUv, ck);
    },
  };
}
