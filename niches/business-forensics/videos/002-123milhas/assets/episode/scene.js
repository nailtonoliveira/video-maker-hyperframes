// Episódio 002 (59,77 s): "123Milhas: o calote de R$ 2,3 bilhões nas passagens fantasma".
// 7 cenas e 25 planos (1,7–3,0 s) atravessando imperio, pregao, livro e sala, com rebobinagem nos últimos 2,4 s.
// Império em forma de pirâmide (andares ocos = bilhetes nunca emitidos); truque físico = pirâmide de peões sobre
// makePonziPyramid, paga com moedas novas; carimbo CALOTE; consequência = CPI + voucher sem fundos.
import { THREE, createStage, createEpisode, seg, E, pulses, loopPeriod, clamp, hash, solid, label } from "../motor/core.js";
import { createFlowArrow } from "../kit3d.js";
import { C, MBF } from "../kit/cores.js";
import { SKIES_BF, makeEvidenceRoom } from "../kit/sala.js";
import { makeEmpireTower, makeCoinStack, makeCoinBurst } from "../kit/imperio.js";
import { makeEvidenceTag, makeRedString, makeCaseFolder, makeStampMark } from "../kit/provas.js";
import { makeLedger } from "../kit/livro.js";
import { makePonziPyramid } from "../kit/truques.js";
import { makeMagnata, makePerita, makeContador, makeManada, makeFiscal } from "../kit/elenco.js";
import { makeTradingFloor } from "../kit/exteriores.js";
import { makeGroundCloud } from "../kit/efeitos.js";

const LOOP = 59.77;
// Inícios das palavras-âncora (assets/voice.json)
const T = {
  setecentos: 3.22, // "setecentos mil passageiros"
  apenas: 7.42, // "apenas onze dias"
  em2023: 9.1, // "Em dois mil e vinte e três"
  vendendo: 14.12, // "vendendo pacotes promos"
  metade: 17.16, // "metade do preço"
  bilhetes: 18.86, // "bilhetes não existiam"
  existiam: 20.1,
  vendia: 21.68, // "vendia a descoberto"
  bancar: 24.48, // "bancar passageiros antigos"
  luz: 27.16, // "luz UV da perícia"
  truque: 28.84, // "o truque aparece"
  subiram: 31.08, // "tarifas subiram"
  perdeu: 33.72, // "perdeu o chão"
  voos: 35.86, // "os voos travaram"
  fiscal: 37.72, // "O fiscal"
  stamp: 38.14, // "desceu o carimbo de calote"
  collapse: 40.46, // "torre bilionária desabou"
  credores: 43.22, // "setecentos mil credores"
  navios: 45.32,
  socios: 47.22, // "sócios foram indiciados"
  estelionato: 50.24, // "estelionato e fraude"
  ironia: 52.96, // "ironia final"
  apenasV: 55.52, // "apenas vouchers"
  vouchers: 55.86,
  rewind: LOOP - 2.4, // 57.37
};

const SALA_BASE = new THREE.Vector3(0, 0, 0);
const LIVRO_BASE = new THREE.Vector3(0, -200, 0);
const PREGAO_BASE = new THREE.Vector3(0, -400, 0);

// posição ao longo de uma poligonal (u em 0..1, parametrizada pelo comprimento)
function makePath(pts) {
  const v = pts.map((p) => new THREE.Vector3(...p));
  const acc = [0];
  for (let i = 1; i < v.length; i++) acc.push(acc[i - 1] + v[i].distanceTo(v[i - 1]));
  const L = acc[acc.length - 1];
  return (u, out) => {
    const d = clamp(u) * L;
    let i = 1;
    while (i < acc.length - 1 && acc[i] < d) i++;
    const f = (d - acc[i - 1]) / Math.max(1e-6, acc[i] - acc[i - 1]);
    return out.lerpVectors(v[i - 1], v[i], clamp(f));
  };
}

// seta de ouro apontada de `from` para `to` (o pulse do kit mexe o x local do filho, ao longo da direção)
function aimedArrow(from, to, opts) {
  const holder = new THREE.Group();
  holder.position.set(...from);
  const dir = new THREE.Vector3(...to).sub(holder.position).normalize();
  holder.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
  const a = createFlowArrow(THREE, opts);
  holder.add(a.group);
  return { holder, arrow: a };
}

export function build(canvas) {
  const S = createStage(canvas);
  const { scene } = S;

  // ==================== 1. SALA DE PROVAS + IMPÉRIO (torre-pirâmide) ====================
  const salaGroup = new THREE.Group();
  const room = makeEvidenceRoom({ seed: 11, caso: "002" });
  const tower = makeEmpireTower({ nome: "123MILHAS", andares: 8, ocos: [2, 3, 4, 5], w: 3.2, h: 0.55, seed: 23, forma: "piramide" });
  const AND = 8;
  const H = 0.55;
  const magnata = makeMagnata({ escala: 0.85 });
  const MAG_Z = -0.45; // atrás da placa da torre, no último andar
  const KNEEL = new THREE.Vector3(-2.7, 0, 0.7); // onde o Magnata cai e se ajoelha

  const manada = makeManada({ count: 27, cols: 9, spacing: 0.62, seed: 5 });
  manada.group.position.set(0, 0, 3.3);

  const perita = makePerita({ escala: 1 });
  perita.group.position.set(-4.8, 0, 1.4);
  perita.group.rotation.y = Math.atan2(4.8, -0.9); // lanterna UV apontada para a torre

  const fiscal = makeFiscal({ escala: 1, texto: "CALOTE" });
  const FISCAL_P = new THREE.Vector3(3.0, 0, -0.6);
  const FISCAL_R = -0.35;
  fiscal.group.position.copy(FISCAL_P);
  fiscal.group.rotation.y = FISCAL_R;
  // gaveta de cima: etiqueta "CPI" (no lugar da etiqueta de ano do kit) e fichas de indiciamento em papel
  const fRig = fiscal.group.children[0];
  const drawers = fRig.children.filter((c) => c.isGroup && c.children.length === 3);
  const dTop = drawers[0];
  const oldLbl = dTop.children[2];
  dTop.remove(oldLbl);
  oldLbl.geometry.dispose();
  oldLbl.material.map?.dispose();
  oldLbl.material.dispose();
  const cpiLbl = label("CPI", C.papel, 64, 0.13, 700);
  cpiLbl.position.set(0, 0.08, 0.025);
  dTop.add(cpiLbl);
  for (let i = 0; i < 4; i++) {
    const ficha = solid(new THREE.BoxGeometry(0.62, 0.34, 0.012), MBF.papel, MBF.eNanquim, false);
    ficha.position.set(0.04 * (i % 2 ? 1 : -1), 0.2 + 0.015 * i, -0.08 - i * 0.07);
    ficha.rotation.x = -0.08;
    dTop.add(ficha);
  }
  // onde o braço-carimbo toca a mesa (local (0.68, 0, 0.25) girado com o Fiscal)
  const STAMP_P = new THREE.Vector3(0.68, 0, 0.25).applyAxisAngle(new THREE.Vector3(0, 1, 0), FISCAL_R).add(FISCAL_P);

  const coinStack = makeCoinStack({ n: 16, r: 0.26 });
  coinStack.group.position.set(2.4, 0, 1.3);
  const coinBurst = makeCoinBurst({ count: 120, seed: 13, origem: [0, 2.4, 0] });
  const dust = makeGroundCloud({ count: 60, center: [0, 0.1, 0] });
  dust.group.scale.setScalar(0.11);

  // setas de ouro entrando na torre na ascensão
  const arrowsT = [
    aimedArrow([-4.2, 0.5, 2.6], [-1.2, 1.6, 0.6], { color: C.ouro, length: 1.3, thickness: 0.12 }),
    aimedArrow([4.0, 0.6, 2.8], [1.1, 2.4, 0.5], { color: C.ouro, length: 1.3, thickness: 0.12 }),
  ];

  // provas: pasta do livro-caixa sob a luz UV, etiqueta das tarifas, fio vermelho, decalques do carimbo
  const folder = makeCaseFolder({ caso: "LIVRO-CAIXA", nome: "SEM RESERVA" });
  folder.group.position.set(-2.9, 0.01, 1.75);
  folder.group.rotation.y = 0.25;
  const tagTarifas = makeEvidenceTag({ texto: "TARIFAS EM ALTA" });
  tagTarifas.group.position.set(2.9, 0.0, 2.3);
  tagTarifas.group.rotation.y = -0.3;
  const redString = makeRedString([
    [2.55, 0.12, 2.25],
    [0.0, 1.0, 1.75],
    [-2.6, 0.12, 1.9],
    [-1.4, 8.0, -3.4],
  ]);
  const stampCaloteH = new THREE.Group();
  stampCaloteH.position.set(STAMP_P.x, 0.0, STAMP_P.z);
  stampCaloteH.rotation.y = FISCAL_R;
  stampCaloteH.scale.setScalar(0.62);
  const stampCalote = makeStampMark("CALOTE");
  stampCaloteH.add(stampCalote.group);

  // detalhe absurdo: etiqueta de voucher deitada na mesa + decalque SEM FUNDOS
  const VOUCHER_P = new THREE.Vector3(-4.4, 0.015, 3.6);
  const tagVoucherH = new THREE.Group();
  tagVoucherH.position.copy(VOUCHER_P);
  tagVoucherH.rotation.set(-Math.PI / 2, 0, 0);
  const tagVoucher = makeEvidenceTag({ texto: "VOUCHER PRÓPRIO" });
  tagVoucherH.add(tagVoucher.group);
  const stampVoucherH = new THREE.Group();
  stampVoucherH.position.set(VOUCHER_P.x + 0.15, 0.035, VOUCHER_P.z + 0.06);
  stampVoucherH.rotation.y = 0.18;
  stampVoucherH.scale.setScalar(0.55);
  const stampVoucher = makeStampMark("SEM FUNDOS");
  stampVoucherH.add(stampVoucher.group);

  salaGroup.add(
    room.group,
    tower.group,
    magnata.group,
    manada.group,
    perita.group,
    fiscal.group,
    coinStack.group,
    coinBurst.group,
    dust.group,
    ...arrowsT.map((a) => a.holder),
    folder.group,
    tagTarifas.group,
    redString.group,
    stampCaloteH,
    tagVoucherH,
    stampVoucherH
  );
  scene.add(salaGroup);

  // ==================== 2. MUNDO DO LIVRO-CAIXA (a pirâmide de passageiros) ====================
  const livroGroup = new THREE.Group();
  livroGroup.position.copy(LIVRO_BASE);
  const ledger = makeLedger({
    titulo: "LIVRO-CAIXA // PROMO",
    linhas: ["PACOTE PROMO .. PAGO", "BILHETE ...... NÃO", "RESERVA PRÉVIA .. 0"],
    linhaFraude: 1,
  });
  const contador = makeContador({ escala: 1, livros: 4 });
  contador.group.position.set(-5.2, 0.02, -0.6);
  contador.group.rotation.y = 0.7;

  const PYR = new THREE.Vector3(5.6, 0.02, 0.6);
  const pyramid = makePonziPyramid({ niveis: 3 });
  pyramid.group.position.copy(PYR);
  // fileiras de peões em cada degrau (anel da frente), crescendo com o degrau
  const pyrRows = [
    { lv: 0, n: 6, sp: 0.66, z: 1.81 },
    { lv: 1, n: 4, sp: 0.6, z: 1.09 },
    { lv: 2, n: 1, sp: 0.6, z: 0.0 },
  ].map((r) => {
    const m = makeManada({ count: r.n, cols: r.n, spacing: r.sp, seed: 20 + r.lv });
    const holder = new THREE.Group();
    holder.add(m.group);
    return { ...r, m, holder };
  });
  // moedas novas: entram pela base e sobem degrau a degrau até o peão do topo
  const coinPath = makePath([
    [-4.4, 0.08, 3.9],
    [-0.3, 0.08, 2.5],
    [-0.2, 0.6, 2.25],
    [-0.1, 0.6, 1.55],
    [0.0, 1.14, 1.5],
    [0.0, 1.14, 0.82],
    [0.0, 1.68, 0.78],
    [0.0, 1.68, 0.25],
    [0.0, 2.75, 0.0],
  ]);
  const coinGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16);
  const coinsL = Array.from({ length: 12 }, () => solid(coinGeo, MBF.ouro, MBF.eNanquim));
  const coinsLGroup = new THREE.Group();
  coinsLGroup.position.copy(PYR);
  coinsLGroup.add(...coinsL);

  livroGroup.add(ledger.group, contador.group, pyramid.group, coinsLGroup, ...pyrRows.map((r) => r.holder));
  scene.add(livroGroup);

  // ==================== 3. MUNDO DO PREGÃO (a Manada de clientes) ====================
  const pregaoGroup = new THREE.Group();
  pregaoGroup.position.copy(PREGAO_BASE);
  const trading = makeTradingFloor({ mesas: 6 });
  const pHemi = new THREE.HemisphereLight(0xf6e7cf, 0x1e1214, 0.7);
  const pDir = new THREE.DirectionalLight(0xfff1d6, 2.2);
  pDir.position.set(6, 12, 8);
  const MP_COLS = 12;
  const MP_SP = 0.55;
  const MP_Z = 3.3;
  const manadaP = makeManada({ count: 36, cols: MP_COLS, spacing: MP_SP, seed: 9 });
  manadaP.group.position.set(0, 0.12, MP_Z);
  // bilhetes de papel com selo ouro erguidos pela Manada
  const tickets = Array.from({ length: 36 }, (_, i) => {
    const g = new THREE.Group();
    const card = solid(new THREE.BoxGeometry(0.3, 0.17, 0.02), MBF.papel, MBF.eNanquim, false);
    const selo = solid(new THREE.BoxGeometry(0.07, 0.17, 0.026), MBF.ouro, null, false);
    selo.position.x = 0.1;
    g.add(card, selo);
    const c = i % MP_COLS;
    const r = Math.floor(i / MP_COLS);
    return { g, c, x: (c - (MP_COLS - 1) / 2) * MP_SP, z: (r - 1) * MP_SP, tilt: (hash(i, 61) - 0.5) * 0.5 };
  });
  const arrowsP = [-2.2, 0, 2.2].map((x) => aimedArrow([x, 1.5, 2.3], [x * 0.35, 2.7, -3.6], { color: C.ouro, length: 1.3, thickness: 0.12 }));
  const dustP = makeGroundCloud({ count: 50, center: [0, 0, 0] });
  dustP.group.position.set(0, 0.15, MP_Z);
  dustP.group.scale.setScalar(0.045);
  pregaoGroup.add(trading.group, pHemi, pDir, manadaP.group, ...tickets.map((k) => k.g), ...arrowsP.map((a) => a.holder), dustP.group);
  scene.add(pregaoGroup);

  // ==================== 25 PLANOS (1,7–3,0 s) ====================
  const BS = () => SALA_BASE.clone();
  const BL = () => LIVRO_BASE.clone();
  const BP = () => PREGAO_BASE.clone();
  const SH0 = { p0: [3.2, 7.8, 19.6], l0: [0, 3.0, 0.8] };
  const SH = [
    // Cena 1: O Gancho (0 – 9,10 s)
    { a: 0.0, b: 2.06, env: "imperio", base: BS, p0: SH0.p0, p1: [2.0, 7.3, 18.2], l0: SH0.l0, l1: [0, 3.1, 0.8], ap: 1.0 },
    { a: 2.06, b: 4.7, env: "imperio", base: BS, p0: [-1.4, 2.4, 3.9], p1: [-0.7, 2.1, 3.4], l0: [0, 0.65, 1.6], l1: [0, 0.6, 1.6], ap: 7.0 },
    { a: 4.7, b: 7.42, env: "imperio", base: BS, p0: [2.2, 6.6, 5.4], p1: [-1.4, 6.4, 5.0], l0: [0, 5.5, MAG_Z], l1: [0, 5.6, MAG_Z], ap: 8.0 },
    { a: 7.42, b: 9.1, env: "imperio", base: BS, p0: [0.8, 17.5, 6.5], p1: [0.2, 15.0, 5.4], l0: [0, 0.8, -1.0], l1: [0, 0.8, -1.0], ap: 1.2 },
    // Cena 2: A Ascensão (9,10 – 18,86 s)
    { a: 9.1, b: 11.18, env: "pregao", base: BP, p0: [-4.6, 1.0, 8.6], p1: [3.8, 0.9, 8.2], l0: [-1.4, 0.7, MP_Z], l1: [1.4, 0.7, MP_Z], ease: "lin", ap: 4.0 },
    { a: 11.18, b: 14.12, env: "pregao", base: BP, p0: [2.6, 3.4, 10.0], p1: [-1.6, 2.8, 9.0], l0: [0, 1.9, -1.0], l1: [0, 1.9, -1.2], ap: 1.2 },
    { a: 14.12, b: 17.16, env: "pregao", base: BP, p0: [-2.8, 2.3, 8.6], p1: [-1.4, 2.0, 7.8], l0: [0.2, 1.4, MP_Z], l1: [0.4, 1.4, MP_Z - 0.2], ap: 6.0 },
    { a: 17.16, b: 18.86, env: "imperio", base: BS, p0: [7.0, 2.6, 14.5], p1: [5.2, 3.8, 13.2], l0: [0, 2.8, 0.4], l1: [0, 3.8, 0.4], ap: 1.4 },
    // Cena 3: A Manobra no Livro-Caixa (18,86 – 27,16 s)
    { a: 18.86, b: 21.68, env: "livro", base: BL, p0: [-1.4, 21.0, 7.4], p1: [-2.2, 18.0, 6.0], l0: [-1.6, 0, -0.6], l1: [-2.0, 0, -0.6], ap: 5.0 },
    { a: 21.68, b: 24.48, env: "livro", base: BL, p0: [12.8, 3.6, 10.2], p1: [11.0, 3.0, 9.2], l0: [5.6, 1.0, 0.8], l1: [5.6, 1.1, 0.8], ap: 4.5 },
    { a: 24.48, b: 27.16, env: "livro", base: BL, p0: [0.8, 2.6, 7.4], p1: [2.0, 3.0, 6.6], l0: [5.4, 1.1, 1.2], l1: [5.6, 1.3, 1.0], ap: 6.5 },
    // Cena 4: As Rachaduras na Sala (27,16 – 35,86 s)
    { a: 27.16, b: 28.84, env: "sala", base: BS, p0: [-7.4, 2.6, 6.8], p1: [-6.6, 2.4, 6.0], l0: [-3.4, 1.3, 1.3], l1: [-3.2, 1.3, 1.2], ap: 7.0 },
    { a: 28.84, b: 31.08, env: "sala", base: BS, p0: [-4.2, 3.6, 10.6], p1: [-1.4, 3.3, 9.8], l0: [0, 2.4, 0.2], l1: [0, 2.5, 0.2], ap: 1.4 },
    { a: 31.08, b: 33.72, env: "sala", base: BS, p0: [0.8, 11.5, 9.6], p1: [0.2, 10.4, 8.4], l0: [0, 0.4, 0.4], l1: [0, 0.4, 0.2], ap: 1.2 },
    { a: 33.72, b: 35.86, env: "sala", base: BS, p0: [2.8, 0.5, 7.6], p1: [1.9, 0.7, 6.8], l0: [0, 1.6, 1.8], l1: [0, 2.6, 0.4], ap: 3.5 },
    // Cena 5: O Colapso (35,86 – 43,22 s)
    { a: 35.86, b: 37.72, env: "imperio", base: BS, p0: [-1.8, 6.4, 4.0], p1: [-1.1, 6.2, 3.5], l0: [0, 5.6, MAG_Z], l1: [0, 5.6, MAG_Z], ap: 8.0 },
    { a: 37.72, b: 40.46, env: "imperio", base: BS, p0: [6.4, 0.6, 4.8], p1: [5.8, 0.55, 4.1], l0: [3.4, 1.05, -0.25], l1: [3.5, 0.95, -0.2], ap: 3.0, shake: [T.stamp, 0.25, 0.45, 70] },
    { a: 40.46, b: 43.22, env: "imperio", base: BS, p0: [-5.0, 5.4, 15.0], p1: [-3.0, 4.2, 13.4], l0: [0, 2.6, 0.4], l1: [0, 1.2, 0.8], ap: 1.2, shake: [T.collapse, 0.16, 0.6, 60] },
    // Cena 6: O Estrago (43,22 – 52,96 s)
    { a: 43.22, b: 45.32, env: "pregao", base: BP, p0: [4.4, 2.3, 8.6], p1: [-4.0, 2.0, 8.2], l0: [1.4, 0.3, MP_Z], l1: [-1.4, 0.3, MP_Z], ease: "lin", ap: 4.0 },
    { a: 45.32, b: 47.22, env: "pregao", base: BP, p0: [-2.4, 3.1, 9.4], p1: [1.8, 2.7, 8.6], l0: [0, 2.0, -2.2], l1: [0, 2.0, -2.4], ap: 1.4 },
    { a: 47.22, b: 50.24, env: "sala", base: BS, p0: [1.4, 2.4, 3.2], p1: [1.8, 2.0, 2.5], l0: [2.85, 1.65, -0.2], l1: [2.9, 1.6, -0.15], ap: 7.0 },
    { a: 50.24, b: 52.96, env: "sala", base: BS, p0: [-4.4, 1.1, 5.6], p1: [-3.6, 0.95, 4.9], l0: [KNEEL.x, 1.15, KNEEL.z], l1: [KNEEL.x, 1.1, KNEEL.z], ap: 6.0 },
    // Cena 7: O Detalhe Absurdo + Rebobinagem até o quadro 0 (52,96 – 59,77 s)
    { a: 52.96, b: 55.52, env: "sala", base: BS, p0: [VOUCHER_P.x + 0.15, 3.6, VOUCHER_P.z + 1.3], p1: [VOUCHER_P.x, 2.7, VOUCHER_P.z + 1.0], l0: [VOUCHER_P.x, 0, VOUCHER_P.z - 0.25], l1: [VOUCHER_P.x, 0, VOUCHER_P.z - 0.2], ap: 8.0 },
    { a: 55.52, b: T.rewind, env: "sala", base: BS, p0: [VOUCHER_P.x + 1.2, 2.8, VOUCHER_P.z + 1.5], p1: [VOUCHER_P.x + 0.8, 2.4, VOUCHER_P.z + 1.3], l0: [VOUCHER_P.x + 0.1, 0, VOUCHER_P.z - 0.15], l1: [VOUCHER_P.x + 0.1, 0, VOUCHER_P.z - 0.1], ap: 9.0 },
    { a: T.rewind, b: LOOP + 0.01, env: "imperio", base: BS, p0: [-4.4, 7.6, 22.0], p1: SH0.p0, l0: [0, 2.2, 0.8], l1: SH0.l0, ap: 1.0, ease: "p3io" },
  ];

  const crackPeriod = loopPeriod(LOOP, 0.8);
  const arrowPeriod = loopPeriod(LOOP, 0.75);
  const Pe = loopPeriod(LOOP, 0.6); // mesmo período do pulo de euforia da Manada (elenco.js)
  const Pd = loopPeriod(LOOP, 0.9);
  const tmp = new THREE.Vector3();
  const topPos = new THREE.Vector3();

  function update(t, sh) {
    const inLivro = sh.env === "livro";
    const inPregao = sh.env === "pregao";
    salaGroup.visible = !inLivro && !inPregao;
    livroGroup.visible = inLivro;
    pregaoGroup.visible = inPregao;

    // Fator de rebobinagem: 1 → 0 entre LOOP − 2,4 e LOOP − 0,2 (p3io)
    const rew = t >= T.rewind ? 1 - E.p3io(seg(t, T.rewind, LOOP - 0.2)) : 1;
    const preRew = t < T.rewind;

    // ---------- 1. Torre-pirâmide e moedas ----------
    const riseK = t >= T.metade && t < T.bilhetes ? 0.3 + 0.7 * seg(t, T.metade, T.metade + 1.5) : 1;
    const revK = t >= T.truque ? E.p2io(seg(t, T.truque, T.truque + 1.4)) * rew : 0;
    const colK = t >= T.collapse ? E.p2in(seg(t, T.collapse, T.collapse + 1.8)) * rew : 0;
    const crackPulse = 0.5 + 0.5 * Math.sin((2 * Math.PI * t) / crackPeriod);
    let crackK = 0.15 * crackPulse;
    if (t >= T.setecentos && t < T.apenas) crackK = 0.22 + 0.16 * crackPulse;
    else if (t >= T.perdeu && preRew) crackK = 0.4 * seg(t, T.perdeu, T.perdeu + 1.2) + 0.05 * crackPulse;

    tower.rise(riseK);
    tower.reveal(revK);
    tower.collapse(colK);
    tower.crack(crackK);

    coinStack.fill(t >= T.metade && t < T.bilhetes ? seg(t, T.metade + 0.1, T.metade + 1.5) : 1 - colK);
    coinBurst.update(colK);
    coinBurst.group.visible = !(t >= T.ironia && t < T.rewind); // macro do voucher limpo
    dust.update(colK > 0.01 && (t < T.credores || t >= T.rewind) ? colK * 3.5 : -1);

    const arrowsTOn = t >= T.metade && t < T.bilhetes;
    for (const { holder, arrow } of arrowsT) {
      holder.visible = arrowsTOn;
      arrow.pulse(t, (2 * Math.PI) / arrowPeriod, 0.3);
    }

    // ---------- 2. Elenco na sala/império ----------
    const stackH = 0.18 + H * AND * clamp((riseK - 0.1) / 0.65);
    topPos.set(0, stackH, MAG_Z);
    const fk = E.p2in(seg(colK, 0.05, 0.85));
    tmp.lerpVectors(topPos, KNEEL, fk);
    tmp.y += 1.2 * Math.sin(Math.PI * fk);
    magnata.group.position.copy(tmp);
    magnata.group.rotation.set(0, 0, 0);
    if (colK > 0.02) {
      magnata.act(t, "fall", { loop: LOOP, k: 0.42 * colK });
      if (t >= T.estelionato && preRew) {
        const kn = E.p2out(seg(t, T.estelionato, T.estelionato + 0.4));
        magnata.group.position.y -= 0.3 * kn;
        magnata.group.rotation.x = 0.08 * kn;
      }
    } else if (t >= T.voos && t < T.collapse) {
      magnata.act(t, "panic", { loop: LOOP });
    } else if (t >= T.luz && t < T.voos) {
      magnata.act(t, "idle", { loop: LOOP, estado: "nervoso" });
    } else if (t >= T.metade && t < T.luz) {
      magnata.act(t, "point", { loop: LOOP, t0: T.metade, estado: "ganancioso" });
    } else if (t >= T.setecentos && t < T.apenas) {
      magnata.act(t, "idle", { loop: LOOP, estado: "nervoso" });
    } else {
      magnata.act(t, "celebrate", { loop: LOOP, estado: "confiante" });
    }

    if (t >= T.collapse && rew > 0.02) {
      manada.act(t, "ruina", { loop: LOOP, k: seg(t, T.collapse + 0.15, T.collapse + 1.5) * rew });
    } else if (t >= T.perdeu && t < T.collapse) {
      manada.act(t, "duvida", { loop: LOOP, k: seg(t, T.perdeu, T.perdeu + 0.4) * (0.7 + 0.3 * Math.sin((2 * Math.PI * t) / Pd)) });
    } else {
      manada.act(t, "euforia", { loop: LOOP });
    }

    perita.group.visible = t >= T.luz && t < T.credores;
    if (t < T.truque) perita.act(t, "lean", { loop: LOOP, k: seg(t, T.luz, T.luz + 0.6), uv: true });
    else if (t < T.voos) perita.act(t, "scan", { loop: LOOP, uv: true });
    else perita.act(t, "idle", { loop: LOOP, uv: false, estado: "foco" });

    fiscal.group.visible = t >= T.voos && preRew;
    if (t >= T.socios) {
      const dk = seg(t, T.socios, T.socios + 0.45) * (1 - seg(t, 49.2, 49.32));
      fiscal.act(t, "drawer", { loop: LOOP, k: dk });
    } else if (t >= T.stamp - 0.14) {
      fiscal.act(t, "slam", { loop: LOOP, t0: T.stamp });
    } else if (t >= T.fiscal) {
      fiscal.act(t, "raise", { loop: LOOP, k: seg(t, T.fiscal, T.stamp - 0.15) });
    } else {
      fiscal.act(t, "advance", { loop: LOOP, z0: -1.2, D: 1.2, k: seg(t, T.voos, T.voos + 1.3) });
    }

    // ---------- 3. Provas e iluminação da sala ----------
    const uvRoom = t >= T.luz && t < T.voos ? seg(t, T.luz, T.luz + 0.3) * (1 - seg(t, T.voos - 0.4, T.voos)) : 0;
    folder.group.visible = t >= T.luz && t < T.voos;
    folder.open(seg(t, T.luz, T.luz + 0.7));
    tagTarifas.show(t >= T.subiram && preRew ? seg(t, T.subiram, T.subiram + 0.4) : 0);
    redString.group.visible = t >= T.subiram && preRew;
    redString.draw((2 / 3) * E.p2out(seg(t, T.subiram + 0.2, 33.0)) + (1 / 3) * E.p2out(seg(t, T.perdeu, T.perdeu + 0.8)));
    stampCalote.press(t >= T.stamp && preRew ? seg(t, T.stamp, T.stamp + 0.15) : 0);
    tagVoucher.show(t >= T.ironia && preRew ? seg(t, T.ironia, T.ironia + 0.45) : 0);
    stampVoucher.press(t >= T.vouchers && preRew ? seg(t, T.vouchers, T.vouchers + 0.15) : 0);

    const alarm = t >= T.voos && preRew ? seg(t, T.voos, T.voos + 0.7) * (1 - 0.6 * seg(t, T.credores, T.credores + 0.8)) : 0;
    room.update(t, { alarm, uv: uvRoom });

    // ---------- 4. Mundo do livro-caixa ----------
    ledger.open(1);
    ledger.flip(seg(t, T.bilhetes, T.bilhetes + 0.6));
    ledger.mark(0, seg(t, T.bilhetes, T.bilhetes + 0.5));
    ledger.mark(1, seg(t, 19.56, 20.2));
    ledger.mark(2, 0);
    ledger.uv(0);
    contador.act(t, t < T.existiam ? "scribble" : "nervous", { loop: LOOP });

    const gk = seg(t, T.vendia, T.vendia + 1.9);
    pyramid.grow(gk);
    pyramid.collapse(0);
    for (const r of pyrRows) {
      const lk = E.backOut(seg(gk, r.lv * 0.25, r.lv * 0.25 + 0.45));
      r.holder.visible = lk > 0.05;
      r.holder.scale.setScalar(Math.max(0.001, lk));
      r.holder.position.set(PYR.x, PYR.y + 0.26 + r.lv * 0.54 + 0.26 * lk, PYR.z + r.z * lk);
      if (r.lv === 2) r.m.act(t, "euforia", { loop: LOOP });
      else r.m.act(t, "duvida", { loop: LOOP, k: 0.5 + 0.5 * Math.sin((2 * Math.PI * t) / Pd + 1.7 * r.lv) });
    }
    const coinsOn = t >= T.bancar && t < T.luz;
    coinsL.forEach((cn, i) => {
      const u = (t - T.bancar) * 0.42 - i * 0.07;
      cn.visible = coinsOn && u > 0 && u < 1;
      coinPath(u, cn.position);
      cn.rotation.set(0.25 * Math.sin(6 * u), 8 * u, 0);
    });

    // ---------- 5. Mundo do pregão ----------
    const ascP = t >= T.em2023 && t < T.bilhetes;
    const aftP = t >= T.credores;
    let tela = 2.3;
    if (ascP) tela = 0.5 + 1.8 * seg(t, 9.6, 17.8);
    else if (aftP) tela = 2.3 * (1 - seg(t, T.credores + 0.2, T.credores + 1.2));
    trading.telas(Math.round(tela * 10) / 10);
    trading.queda(aftP ? seg(t, T.credores + 0.1, T.credores + 2.2) : 0);

    if (aftP) manadaP.act(t, "ruina", { loop: LOOP, k: seg(t, T.credores + 0.1, T.credores + 1.4) });
    else manadaP.act(t, "euforia", { loop: LOOP });

    const tkOn = t >= T.vendendo && t < T.bilhetes;
    for (const tk of tickets) {
      const lift = E.backOut(seg(t, T.vendendo + 0.025 * tk.c, T.vendendo + 0.4 + 0.025 * tk.c));
      tk.g.visible = tkOn && lift > 0.01;
      const py = 0.25 * Math.max(0, Math.sin((2 * Math.PI * t) / Pe - 0.35 * tk.c));
      tk.g.position.set(tk.x, 0.12 + py + 0.95 + 0.3 * lift, MP_Z + tk.z);
      tk.g.rotation.set(0, 0, tk.tilt);
      tk.g.scale.setScalar(Math.max(0.001, Math.min(1, lift)));
    }
    for (const { holder, arrow } of arrowsP) {
      holder.visible = ascP;
      arrow.pulse(t, (2 * Math.PI) / arrowPeriod, 0.35);
    }
    dustP.update(aftP ? (t - T.credores) * 1.6 : -1);
  }

  function post(t, sh, c) {
    const ca = pulses(t, [T.stamp], 0.006, 0.22) + pulses(t, [T.collapse], 0.003, 0.3);
    const vigBoost = pulses(t, [T.stamp], 0.25, 0.5);
    return {
      focus: c.dist,
      aperture: sh.ap ?? 1.2,
      ca,
      vignette: Math.min(0.85, 0.55 + vigBoost),
      exposure: sh.env === "livro" ? 1.3 : 1,
    };
  }

  return createEpisode(S, { loop: LOOP, shots: SH, skies: SKIES_BF, update, post });
}
