// Kit 3D do business-forensics — Sala de Provas (mesa de mogno, mata-borrão, quadro de cortiça, lambri e lâmpada).
import { THREE, solid, fill, edge, label, rng, clamp } from "../motor/core.js";
import { C, MBF } from "./cores.js";

export const TEMA_SALA = {
  skyTop: 0x0d0708,
  skyMid: 0x1e0f12,
  skyBot: 0x080405,
  wallTop: "#1a0d10",
  wallMid: "#2b1418",
  wallBot: "#120809",
  plank: "#2b1418",
  plankAlt: "#24110f",
  plankSeam: "#120809",
  cork: "#5a3f2e",
  corkDot: "rgba(18, 8, 9, 0.35)",
  gridMinor: "rgba(107, 91, 82, 0.22)",
  gridMajor: "rgba(107, 91, 82, 0.45)",
  marginLine: "rgba(179, 38, 30, 0.80)",
  wallLabel: "SALA DE PROVAS // CASO Nº {n}",
  hemiSky: 0xf6e7cf,
  hemiGround: 0x1a0d10,
  hemiI: 0.55,
  keyColor: 0xfff1d6,
  keyI: 38,
  keyAngle: 0.52,
  keyPenumbra: 0.45,
  rimColor: 0x9b8cff,
  rimI: 0.9,
  slabs: [0x2b1a1d, 0x33201f, 0x281719, 0x2f1d1f],
  seam: 0x120809,
  matBg: "#e4d6b8",
  matGrid: "rgba(107, 91, 82, 0.35)",
  matBorder: "rgba(179, 38, 30, 0.85)",
  bumper: 0x1c1214,
  led: 0xe9b949,
  bolt: 0xa3958a,
};

export const SKIES_BF = {
  sala: { top: 0x0d0708, mid: 0x1e0f12, bottom: 0x080405, fog: 0x1a0d10, fogNear: 14, fogFar: 46 },
  imperio: { top: 0x0d0708, mid: 0x24121a, bottom: 0x080405, fog: 0x1e0f12, fogNear: 10, fogFar: 34 },
  livro: { top: 0x1a1210, mid: 0x2e211b, bottom: 0x0e0907, fog: 0x241914, fogNear: 8, fogFar: 30 },
  pregao: { top: 0x120a0b, mid: 0x2a1a1c, bottom: 0x0b0607, fog: 0x1e1214, fogNear: 12, fogFar: 40 },
};

function makeWainscotTex() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext("2d");
  for (let x = 0, i = 0; x < 1024; x += 64, i++) {
    ctx.fillStyle = i % 2 === 0 ? TEMA_SALA.plank : TEMA_SALA.plankAlt;
    ctx.fillRect(x, 0, 62, 1024);
    ctx.fillStyle = TEMA_SALA.plankSeam;
    ctx.fillRect(x + 62, 0, 2, 1024);
  }
  const g = ctx.createLinearGradient(0, 0, 0, 1024);
  g.addColorStop(0, "rgba(18, 8, 9, 0.55)");
  g.addColorStop(0.5, "rgba(43, 20, 24, 0.15)");
  g.addColorStop(1, "rgba(18, 8, 9, 0.65)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 1024);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeCorkTex(seed = 11) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 640;
  const ctx = c.getContext("2d");
  ctx.fillStyle = TEMA_SALA.cork;
  ctx.fillRect(0, 0, 1024, 640);
  const rand = rng(seed);
  ctx.fillStyle = TEMA_SALA.corkDot;
  for (let i = 0; i < 1200; i++) {
    const x = 24 + rand() * (1024 - 48);
    const y = 24 + rand() * (640 - 48);
    const s = 2 + Math.floor(rand() * 3);
    ctx.fillRect(x, y, s, s);
  }
  ctx.strokeStyle = "#2b1418";
  ctx.lineWidth = 48;
  ctx.strokeRect(0, 0, 1024, 640);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeBlotterTex() {
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
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(96, 0);
  ctx.lineTo(96, 1280);
  ctx.stroke();
  ctx.strokeStyle = TEMA_SALA.matBorder;
  ctx.lineWidth = 14;
  ctx.strokeRect(18, 18, 2012, 1244);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeEvidenceRoom({ seed = 11, caso = "001" } = {}) {
  const group = new THREE.Group();

  // Tampo da mesa em y = 0: 7 tábuas de mogno 14 × 0,9 × 1,26 com junta de 0,04 u
  const slabMats = TEMA_SALA.slabs.map((hex) => fill(hex, 0.85));
  for (let i = 0; i < 7; i++) {
    const z = -4.5 + 0.63 + i * 1.3;
    const slab = solid(new THREE.BoxGeometry(14, 0.9, 1.26), slabMats[i % slabMats.length], MBF.eNanquim);
    slab.position.set(0, -0.45, z);
    group.add(slab);
  }
  // Borda e filete de latão da mesa
  const trimMat = fill(TEMA_SALA.led, 0.55);
  const trim = new THREE.Mesh(new THREE.BoxGeometry(14.12, 0.08, 9.12), trimMat);
  trim.position.set(0, -0.06, 0);
  group.add(trim);

  // Mata-borrão de livro-caixa sobre a mesa (y = 0.005)
  const blotter = new THREE.Mesh(
    new THREE.PlaneGeometry(9.6, 6.0),
    new THREE.MeshStandardMaterial({ map: makeBlotterTex(), roughness: 0.92 })
  );
  blotter.rotation.x = -Math.PI / 2;
  blotter.position.y = 0.005;
  blotter.receiveShadow = true;
  group.add(blotter);

  // Paredes laterais e de fundo com lambri
  const wallMat = new THREE.MeshStandardMaterial({ map: makeWainscotTex(), roughness: 0.95 });
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(24, 14), wallMat);
  backWall.position.set(0, 5.5, -9.2);
  group.add(backWall);
  for (const sx of [-1, 1]) {
    const sideWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 14), wallMat);
    sideWall.rotation.y = -sx * (Math.PI / 2);
    sideWall.position.set(sx * 11, 5.5, 0);
    group.add(sideWall);
  }

  // Quadro de conexões de cortiça (z = -9, 10 × 6 u, centro y = 4.2) + até 6 cartões marfim
  const board = solid(
    new THREE.BoxGeometry(10, 6, 0.12),
    new THREE.MeshStandardMaterial({ map: makeCorkTex(seed), roughness: 0.92 }),
    MBF.eNanquim
  );
  board.position.set(0, 4.2, -9.0);
  group.add(board);

  const rand = rng(seed + 100);
  const cardCoords = [
    [-3.2, 5.4], [0.0, 5.6], [3.1, 5.3],
    [-2.8, 3.1], [0.4, 3.0], [3.2, 3.2],
  ];
  for (let i = 0; i < cardCoords.length; i++) {
    const [cx, cy] = cardCoords[i];
    const card = solid(new THREE.BoxGeometry(1.4, 0.9, 0.02), MBF.papel, MBF.eNanquim);
    card.position.set(cx, cy, -8.92);
    card.rotation.z = (rand() - 0.5) * 0.08;
    const pin = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), MBF.lacre);
    pin.position.set(0, 0.34, 0.02);
    card.add(pin);
    group.add(card);
  }

  const wallTxt = TEMA_SALA.wallLabel.replace("{n}", String(caso));
  const wallLbl = label(wallTxt, C.taupe, 64, 0.32, 700);
  wallLbl.position.set(0, 7.6, -9.1);
  group.add(wallLbl);

  // Lâmpada de interrogatório em (0, 9, 0)
  const shadePts = [new THREE.Vector2(0.12, 0.7), new THREE.Vector2(0.9, 0), new THREE.Vector2(0.86, 0)];
  const shade = solid(new THREE.LatheGeometry(shadePts, 24), MBF.nanquim, MBF.eTaupe, false);
  shade.position.set(0, 9, 0);
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 4, 8), MBF.nanquim);
  cord.position.set(0, 11.7, 0);
  group.add(shade, cord);

  const coneMat = new THREE.MeshBasicMaterial({
    color: TEMA_SALA.keyColor,
    transparent: true,
    opacity: 0.05,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 5.2, 9, 24, 1, true), coneMat);
  cone.position.set(0, 4.5, 0);
  cone.renderOrder = 2;
  group.add(cone);

  // Iluminação da sala: 1 única fonte de sombra (SpotLight da lâmpada) + hemisférica + contra-luz UV
  const hemi = new THREE.HemisphereLight(TEMA_SALA.hemiSky, TEMA_SALA.hemiGround, TEMA_SALA.hemiI);
  const keyLight = new THREE.SpotLight(TEMA_SALA.keyColor, TEMA_SALA.keyI, 30, TEMA_SALA.keyAngle, TEMA_SALA.keyPenumbra, 2);
  keyLight.position.set(0, 9, 0);
  keyLight.target.position.set(0, 0, 0);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.bias = -0.0004;
  const rimLight = new THREE.DirectionalLight(TEMA_SALA.rimColor, TEMA_SALA.rimI);
  rimLight.position.set(-10, 7, -9);
  group.add(hemi, keyLight, keyLight.target, rimLight);

  const cKeyBase = new THREE.Color(TEMA_SALA.keyColor);
  const cAlarm = new THREE.Color(C.fraude);
  const cTrimBase = new THREE.Color(TEMA_SALA.led);

  function update(t, { alarm = 0, uv = 0 } = {}) {
    const a = clamp(alarm, 0, 1);
    const u = clamp(uv, 0, 1);
    keyLight.color.copy(cKeyBase).lerp(cAlarm, 0.45 * a);
    coneMat.color.copy(keyLight.color);
    coneMat.opacity = 0.05 + 0.03 * a;
    trimMat.color.copy(cTrimBase).lerp(cAlarm, a);
    keyLight.intensity = TEMA_SALA.keyI * (1 - 0.7 * u);
    rimLight.intensity = TEMA_SALA.rimI + 1.3 * u;
  }

  return { group, update, keyLight, rimLight };
}
