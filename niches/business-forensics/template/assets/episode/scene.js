// Episódio-modelo do template (52 s): "Monarca S.A., de US$ 74 bi a zero em 24 dias".
// 7 cenas e 22 planos (1,7–3,0 s) atravessando imperio, livro, sala e pregao, com rebobinagem nos últimos 2,4 s.
// Reescreva por episódio: LOOP = duração da locução, cortes nas palavras-âncora (assets/voice.json).
import { THREE, createStage, createEpisode, seg, E, pulses, loopPeriod, clamp } from "../motor/core.js";
import { createFlowArrow } from "../kit3d.js";
import { C } from "../kit/cores.js";
import { SKIES_BF, makeEvidenceRoom } from "../kit/sala.js";
import { makeEmpireTower, makeCoinStack, makeCoinBurst } from "../kit/imperio.js";
import { makeEvidenceTag, makeRedString, makeCaseFolder, makeStampMark } from "../kit/provas.js";
import { makeLedger } from "../kit/livro.js";
import { makeShellBoxes } from "../kit/truques.js";
import { makeMagnata, makePerita, makeContador, makeManada, makeFiscal } from "../kit/elenco.js";
import { makeTradingFloor } from "../kit/exteriores.js";
import { makeGroundCloud } from "../kit/efeitos.js";

const LOOP = 52;
const T = {
  cutCrack: 2.2,
  ascend: 4.1,
  ledger: 11.6,
  cracks: 22.4,
  climax: 31.0,
  stamp: 33.4,
  collapse: 35.0,
  panic: 37.6,
  aftermath: 41.0,
  absurd: 44.8,
  rewind: 49.6,
};

const SALA_BASE = new THREE.Vector3(0, 0, 0);
const LIVRO_BASE = new THREE.Vector3(0, -200, 0);
const PREGAO_BASE = new THREE.Vector3(0, -400, 0);

export function build(canvas) {
  const S = createStage(canvas);
  const { scene } = S;

  // ==================== 1. SALA DE PROVAS + IMPÉRIO ====================
  const salaGroup = new THREE.Group();
  const room = makeEvidenceRoom({ seed: 11, caso: "001" });
  const tower = makeEmpireTower({ nome: "MONARCA S.A.", andares: 9, ocos: [3, 4, 5, 6], w: 2.4, h: 0.6, seed: 7 });
  const magnata = makeMagnata({ escala: 0.95 });
  const manada = makeManada({ count: 36, cols: 9, spacing: 0.72, seed: 5 });
  manada.group.position.set(0, 0, 2.5);
  const perita = makePerita({ escala: 1 });
  perita.group.position.set(-2.9, 0, 1.3);
  perita.group.rotation.y = 0.55;
  const fiscal = makeFiscal({ escala: 1, texto: "FRAUDE" });
  fiscal.group.position.set(2.5, 0, -1.2);
  fiscal.group.rotation.y = -0.35;

  const coinStack = makeCoinStack({ n: 16, r: 0.26 });
  coinStack.group.position.set(-1.9, 0, 0.9);
  const coinBurst = makeCoinBurst({ count: 120, seed: 13, origem: [0, 2.4, 0] });
  const dust = makeGroundCloud({ count: 60, center: [0, 0.1, 0] });
  dust.group.scale.setScalar(0.18);

  const arrowIn = createFlowArrow(THREE, { from: [-3.4, 0.4, 1.8], to: [-1.4, 1.2, 0.4], color: C.ouro, radius: 0.05 });
  const redString = makeRedString([
    [-2.4, 0.12, -1.2],
    [0.0, 1.8, 1.25],
    [2.1, 0.12, -0.8],
  ]);
  const evidenceTag = makeEvidenceTag({ texto: "AUDITORIA: OK" });
  evidenceTag.group.position.set(1.8, 0.02, 1.2);
  evidenceTag.group.rotation.y = -0.25;
  const folder = makeCaseFolder({ caso: "CASO 001", nome: "AUDITORIA: APROVADA" });
  folder.group.position.set(0, 0.01, 2.1);
  const stampMark = makeStampMark("FRAUDE");
  stampMark.group.position.set(2.1, 0.02, -0.3);

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
    arrowIn.group,
    redString.group,
    evidenceTag.group,
    folder.group,
    stampMark.group
  );
  scene.add(salaGroup);

  // ==================== 2. MUNDO DO LIVRO-CAIXA ====================
  const livroGroup = new THREE.Group();
  livroGroup.position.copy(LIVRO_BASE);
  const ledger = makeLedger({
    titulo: "BALANÇO // MONARCA S.A.",
    linhas: ["RECEITA ...... 74 BI", "DÍVIDA ....... 30 BI", "LUCRO REAL .... 0 BI"],
    linhaFraude: 1,
  });
  const shellBoxes = makeShellBoxes({ nomes: ["SPE ALPHA", "OFFSHORE B", "HOLDING C"] });
  shellBoxes.group.position.set(0, 0.02, 1.4);
  const contador = makeContador({ escala: 1, livros: 4 });
  contador.group.position.set(-3.2, 0.02, -1.2);
  contador.group.rotation.y = 0.4;
  livroGroup.add(ledger.group, shellBoxes.group, contador.group);
  scene.add(livroGroup);

  // ==================== 3. MUNDO DO PREGÃO ====================
  const pregaoGroup = new THREE.Group();
  pregaoGroup.position.copy(PREGAO_BASE);
  const trading = makeTradingFloor({ mesas: 6 });
  const pHemi = new THREE.HemisphereLight(0xf6e7cf, 0x1e1214, 0.7);
  const pDir = new THREE.DirectionalLight(0xfff1d6, 2.2);
  pDir.position.set(6, 12, 8);
  pregaoGroup.add(trading.group, pHemi, pDir);
  scene.add(pregaoGroup);

  // ==================== 22 PLANOS (1,7–3,0 s) ====================
  const BS = () => SALA_BASE.clone();
  const BL = () => LIVRO_BASE.clone();
  const BP = () => PREGAO_BASE.clone();
  const SH = [
    // Cena 1: Gancho (0 – 4,1 s)
    { a: 0.0, b: 2.2, env: "imperio", base: BS, p0: [3.2, 4.6, 11.8], p1: [1.8, 4.2, 10.6], l0: [0, 3.2, 0], l1: [0, 3.4, 0], ap: 1.0 },
    { a: 2.2, b: 4.1, env: "imperio", base: BS, p0: [-1.8, 1.1, 3.4], p1: [-1.2, 0.9, 2.8], l0: [0, 0.6, 0.9], l1: [0, 0.5, 0.9], ap: 7.0 },
    // Cena 2: Ascensão (4,1 – 11,6 s)
    { a: 4.1, b: 6.4, env: "imperio", base: BS, p0: [5.5, 9.5, 11.2], p1: [3.8, 8.2, 9.8], l0: [0, 2.4, 0], l1: [0, 3.2, 0], ap: 0.9 },
    { a: 6.4, b: 8.6, env: "imperio", base: BS, p0: [-3.4, 0.7, 5.2], p1: [2.8, 0.8, 5.0], l0: [0, 0.6, 2.4], l1: [0, 0.7, 2.4], ap: 4.0 },
    { a: 8.6, b: 11.6, env: "imperio", base: BS, p0: [1.4, 6.8, 3.2], p1: [-1.1, 6.9, 2.9], l0: [0, 6.4, 0], l1: [0, 6.5, 0], ap: 8.5 },
    // Cena 3: A Manobra no Livro-Caixa (11,6 – 22,4 s)
    { a: 11.6, b: 14.0, env: "livro", base: BL, p0: [-5.4, 2.4, 3.2], p1: [-4.2, 2.1, 2.4], l0: [-3.0, 1.1, -1.0], l1: [-2.8, 1.1, -0.8], ap: 6.0 },
    { a: 14.0, b: 16.4, env: "livro", base: BL, p0: [0.0, 13.5, 3.2], p1: [0.0, 10.8, 2.2], l0: [0, 0, -0.2], l1: [0, 0, 0.2], ap: 5.0 },
    { a: 16.4, b: 19.2, env: "livro", base: BL, p0: [-3.8, 3.6, 5.8], p1: [2.4, 3.2, 5.2], l0: [-1.2, 0.8, 1.2], l1: [0.8, 0.8, 1.2], ap: 4.5 },
    { a: 19.2, b: 22.4, env: "livro", base: BL, p0: [4.2, 2.8, 4.8], p1: [2.6, 2.2, 3.6], l0: [1.8, 0.9, 1.2], l1: [2.2, 0.9, 1.2], ap: 6.5 },
    // Cena 4: As Rachaduras na Sala (22,4 – 31,0 s)
    { a: 22.4, b: 24.6, env: "sala", base: BS, p0: [-5.8, 3.2, 6.2], p1: [-4.2, 2.8, 4.8], l0: [-1.8, 1.8, 0.6], l1: [-1.2, 1.9, 0.4], ap: 6.5 },
    { a: 24.6, b: 27.0, env: "sala", base: BS, p0: [-2.4, 4.4, 8.8], p1: [2.2, 4.8, 8.4], l0: [0, 2.8, 0], l1: [0, 3.2, 0], ap: 1.5 },
    { a: 27.0, b: 29.0, env: "sala", base: BS, p0: [0.0, 8.8, 7.6], p1: [0.0, 7.2, 6.4], l0: [0, 0.8, -0.4], l1: [0, 1.0, -0.6], ap: 1.2 },
    { a: 29.0, b: 31.0, env: "sala", base: BS, p0: [1.2, 6.9, 2.8], p1: [0.6, 6.8, 2.4], l0: [0, 6.5, 0], l1: [0, 6.5, 0], ap: 9.0, shake: [29.0, 0.12, 0.3, 65] },
    // Cena 5: O Colapso / Clímax (31,0 – 41,0 s)
    { a: 31.0, b: 33.4, env: "imperio", base: BS, p0: [3.8, 0.6, 2.8], p1: [3.2, 0.5, 2.2], l0: [2.4, 1.8, -1.0], l1: [2.4, 2.0, -0.8], ap: 3.5 },
    { a: 33.4, b: 35.0, env: "imperio", base: BS, p0: [4.2, 3.6, 6.4], p1: [3.4, 3.0, 5.4], l0: [1.8, 0.8, -0.4], l1: [1.6, 0.6, -0.3], ap: 3.0, shake: [33.4, 0.25, 0.45, 70] },
    { a: 35.0, b: 37.6, env: "imperio", base: BS, p0: [-4.6, 4.8, 10.8], p1: [-2.8, 3.8, 9.6], l0: [0, 2.4, 0], l1: [0, 1.4, 0], ap: 1.2, shake: [35.0, 0.16, 0.6, 60] },
    { a: 37.6, b: 41.0, env: "imperio", base: BS, p0: [3.6, 1.2, 6.2], p1: [-2.4, 1.4, 5.8], l0: [0, 0.5, 2.2], l1: [0, 0.4, 2.0], ap: 3.5 },
    // Cena 6: O Estrago no Pregão e na Sala (41,0 – 44,8 s)
    { a: 41.0, b: 43.0, env: "pregao", base: BP, p0: [-3.2, 3.4, 5.8], p1: [2.6, 3.0, 5.2], l0: [0, 2.2, -3.5], l1: [0, 2.2, -3.5], ap: 1.5 },
    { a: 43.0, b: 44.8, env: "sala", base: BS, p0: [-2.2, 1.8, 4.4], p1: [-1.4, 1.4, 3.6], l0: [0, 0.6, 0.8], l1: [0, 0.5, 0.6], ap: 5.5 },
    // Cena 7: Detalhe Absurdo + Rebobinagem até o quadro 0 (44,8 – 52,0 s)
    { a: 44.8, b: 47.2, env: "sala", base: BS, p0: [0.8, 2.8, 4.6], p1: [0.2, 1.8, 3.4], l0: [0, 0.1, 2.1], l1: [0, 0.1, 2.1], ap: 7.0 },
    { a: 47.2, b: 49.6, env: "sala", base: BS, p0: [2.4, 1.4, 3.2], p1: [2.0, 1.1, 2.5], l0: [1.8, 0.3, 1.2], l1: [1.8, 0.3, 1.2], ap: 8.0 },
    { a: 49.6, b: LOOP + 0.01, env: "imperio", base: BS, p0: [-3.6, 5.2, 10.4], p1: [3.2, 4.6, 11.8], l0: [0, 2.0, 0], l1: [0, 3.2, 0], ap: 1.0, ease: "p3io" },
  ];

  const crackPeriod = loopPeriod(LOOP, 0.8);
  const arrowPeriod = loopPeriod(LOOP, 0.75);

  function update(t, sh) {
    const inLivro = sh.env === "livro";
    const inPregao = sh.env === "pregao";
    salaGroup.visible = !inLivro && !inPregao;
    livroGroup.visible = inLivro;
    pregaoGroup.visible = inPregao;

    // Fator de rebobinagem (1 → 0 entre 49.6 e 51.8 s)
    const rew = t >= T.rewind ? 1 - E.p3io(seg(t, T.rewind, LOOP - 0.2)) : 1;

    // 1. Estado da Torre e Moedas
    const isAscending = t >= T.ascend && t < T.ledger;
    const riseK = isAscending ? seg(t, T.ascend, T.ascend + 3.8) : 1;
    const uvK = t >= T.cracks && t < T.collapse ? E.p2io(seg(t, 24.4, 26.8)) : 0;
    const colK = t >= T.collapse ? E.p2in(seg(t, T.collapse, T.collapse + 1.8)) * rew : 0;
    const crackPulse = 0.5 + 0.5 * Math.sin((2 * Math.PI * t) / crackPeriod);
    const crackGrow = t >= 29.0 && t < T.rewind ? clamp(seg(t, 29.0, 31.0), 0.2, 1) : 0.15 * crackPulse;

    tower.rise(riseK);
    tower.reveal(uvK);
    tower.collapse(colK);
    tower.crack(crackGrow);

    coinStack.fill(isAscending ? seg(t, T.ascend + 0.4, T.ascend + 4.2) : rew);
    coinBurst.update(colK);
    dust.update(colK > 0.01 ? colK * 3.5 : -1);

    arrowIn.group.visible = isAscending;
    arrowIn.pulse(t, (2 * Math.PI) / arrowPeriod, 0.14);

    // 2. Elenco na Sala
    magnata.group.position.set(0, tower.topY * Math.max(0.25, riseK), 0);
    if (t >= T.collapse && rew > 0.02) {
      magnata.act(t, "fall", { loop: LOOP, k: colK });
    } else if (t >= 29.0 && t < T.collapse) {
      magnata.act(t, "panic", { loop: LOOP });
    } else if (isAscending && t >= 8.6) {
      magnata.act(t, "point", { loop: LOOP, t0: 8.6, estado: "ganancioso" });
    } else {
      magnata.act(t, "celebrate", { loop: LOOP, estado: "confiante" });
    }

    if (t >= T.panic && rew > 0.02) {
      const rK = seg(t, T.panic + 1.2, T.panic + 2.8) * rew;
      if (rK > 0.05) manada.act(t, "ruina", { loop: LOOP, k: rK });
      else manada.act(t, "panico", { loop: LOOP, k: seg(t, T.panic, T.panic + 1.2) * rew });
    } else {
      manada.act(t, "euforia", { loop: LOOP });
    }

    perita.group.visible = t >= T.cracks && t < T.rewind;
    perita.act(t, t >= 27.0 ? "lean" : "scan", { loop: LOOP, k: seg(t, 27.0, 28.2), uv: uvK > 0.1 });

    fiscal.group.visible = t >= T.climax && t < T.rewind;
    if (t >= T.stamp - 0.14 && t < T.rewind) {
      fiscal.act(t, "slam", { loop: LOOP, t0: T.stamp });
    } else if (t >= T.climax + 1.0) {
      fiscal.act(t, "raise", { loop: LOOP, k: seg(t, T.climax + 1.0, T.stamp - 0.15) });
    } else {
      fiscal.act(t, "advance", { loop: LOOP, z0: -2.4, D: 1.2, k: seg(t, T.climax, T.climax + 1.0) });
    }

    // 3. Provas e Iluminação da Sala
    redString.group.visible = t >= 26.4 && t < T.rewind;
    redString.draw(seg(t, 26.4, 28.6) * rew);
    evidenceTag.show(t >= T.absurd && t < T.rewind ? seg(t, T.absurd, T.absurd + 0.5) * rew : 0);
    folder.group.visible = t >= T.absurd && t < T.rewind;
    folder.open(seg(t, T.absurd + 0.2, T.absurd + 1.2) * rew);
    stampMark.press(t >= T.stamp && t < T.rewind ? seg(t, T.stamp, T.stamp + 0.15) * rew : 0);

    const alarmLevel = t >= 29.0 && t < T.rewind ? clamp(seg(t, 29.0, 34.0), 0, 1) * rew : 0;
    room.update(t, { alarm: alarmLevel, uv: uvK });

    // 4. Mundo do Livro-Caixa
    ledger.open(1);
    ledger.mark(1, seg(t, 13.5, 14.5));
    shellBoxes.swallow(seg(t, 15.8, 18.2));
    shellBoxes.nest(seg(t, 18.2, 21.6));
    contador.act(t, t >= 19.2 ? "nervous" : "scribble", { loop: LOOP });

    // 5. Mundo do Pregão
    const fallK = clamp(seg(t, 41.0, 42.8), 0, 1);
    const valStep = Math.round(((1 - fallK) * 74) / 5) * 5;
    trading.telas(valStep);
    trading.queda(fallK);
  }

  function post(t, sh, c) {
    const ca = pulses(t, [T.stamp], 0.006, 0.22);
    const vigBoost = pulses(t, [T.stamp], 0.25, 0.5);
    return {
      focus: c.dist,
      aperture: sh.ap ?? 1.2,
      ca,
      vignette: Math.min(0.85, 0.55 + vigBoost),
    };
  }

  return createEpisode(S, { loop: LOOP, shots: SH, skies: SKIES_BF, update, post });
}
