// Episódio 001 (55,55 s): "Lojas Americanas: O Rombo do Risco Sacado".
// 7 cenas e 24 planos (1,7–3,0 s) atravessando imperio, livro, sala, pregao e a folha de bônus, com rebobinagem nos
// últimos 2,4 s. Cortes e eventos presos ao início das palavras-âncora de assets/voice.json.
import { THREE, createStage, createEpisode, seg, E, pulses, loopPeriod, clamp, label } from "../motor/core.js";
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

const LOOP = 55.55;
const R0 = LOOP - 2.4; // 53.15: início da rebobinagem
const R1 = LOOP - 0.2; // 55.35: tudo de volta ao quadro 0
const T = {
  dias: 2.16, // "apenas 10 dias"
  varejista: 4.04, // "maior varejista"
  ascend: 6.42, // "Durante anos"
  lucros: 8.14, // "exibia lucros recordes"
  manada: 11.58, // "atraindo a manada"
  manobra: 14.58, // "Por trás dos panos"
  dividas: 16.2, // "dívidas bancárias"
  sacado: 17.64, // "em risco sacado"
  caixas: 20.04, // "caixas de fornecedores"
  cargo: 23.04, // fim de "rombo" → "Com 10 dias de cargo"
  acendeu: 24.94, // "novo comando acendeu" (Perita entra)
  uvOn: 25.56, // "acendeu": a lanterna UV liga
  revelou: 27.7, // "revelou contratos forjados"
  maquiar: 29.4, // "para maquiar o balanço"
  janeiro: 31.24, // "Em janeiro de 2023"
  fiscal: 33.74, // "o fiscal desceu"
  stamp: 34.64, // "carimbo"
  divida40: 35.72, // "a dívida passava de 40 bilhões"
  collapse: 38.68, // "a torre desmoronou"
  acoes: 40.82, // "As ações viraram pó"
  peoes: 42.88, // "da manada amargaram"
  diretoria: 45.84, // "a diretoria foi acusada"
  absurdo: 48.4, // "O detalhe mais absurdo"
  bonus: 50.66, // "embolsou bônus milionários"
};

const SALA_BASE = new THREE.Vector3(0, 0, 0);
const LIVRO_BASE = new THREE.Vector3(0, -200, 0);
const BONUS_BASE = new THREE.Vector3(0, -300, 0);
const PREGAO_BASE = new THREE.Vector3(0, -400, 0);

// troca o texto de um rótulo do kit sem editar o kit (mesma fonte/peso do kit, IBM Plex Mono 700)
function relabel(mesh, text, color, px, worldH) {
  const fresh = label(text, color, px, worldH, 700);
  mesh.geometry.dispose();
  mesh.material.map?.dispose();
  mesh.material.dispose();
  mesh.geometry = fresh.geometry;
  mesh.material = fresh.material;
  mesh.userData.w = fresh.userData.w;
}
const labelOf = (obj) => obj.children.find((c) => c.isMesh && c.material && c.material.map);

export function build(canvas) {
  const S = createStage(canvas);
  const { scene } = S;

  // ==================== 1. SALA DE PROVAS + IMPÉRIO ====================
  const salaGroup = new THREE.Group();
  const room = makeEvidenceRoom({ seed: 11, caso: "001" });
  const tower = makeEmpireTower({ nome: "AMERICANAS", andares: 9, ocos: [3, 4, 5, 6], w: 2.4, h: 0.6, seed: 7 });
  const magnata = makeMagnata({ escala: 0.95 });
  const manada = makeManada({ count: 36, cols: 9, spacing: 0.72, seed: 5 });
  manada.group.position.set(0, 0, 3.1); // folga diante da fachada: a rachadura aparece por cima dos peões
  const perita = makePerita({ escala: 1 });
  perita.group.rotation.y = 1.99; // lanterna apontada para a torre
  const fiscal = makeFiscal({ escala: 1, texto: "ACUSADO" });
  fiscal.group.position.set(2.5, 0, -1.2);
  fiscal.group.rotation.y = -0.35;
  // gaveta de cima do Fiscal: o ano do veredito deste caso
  const fiscalRig = fiscal.group.children[0];
  const topDrawer = fiscalRig.children.filter((c) => c.isGroup && labelOf(c))[0];
  if (topDrawer) relabel(labelOf(topDrawer), "2023", C.papel, 64, 0.12);

  const coinStack = makeCoinStack({ n: 16, r: 0.26 });
  coinStack.group.position.set(-1.9, 0, 0.9);
  const coinBurst = makeCoinBurst({ count: 120, seed: 13, origem: [0, 2.4, 0] });
  const dust = makeGroundCloud({ count: 60, center: [0, 0.1, 0] });
  dust.group.scale.setScalar(0.07);

  // setas de ouro (dinheiro entrando na torre), uma de cada lado; o pulse do kit mexe no x do grupo interno
  const arrowL = createFlowArrow(THREE, { color: C.ouro, length: 1.6, thickness: 0.18 });
  const arrowR = createFlowArrow(THREE, { color: C.ouro, length: 1.6, thickness: 0.18 });
  const arrowLHost = new THREE.Group();
  arrowLHost.position.set(-3.4, 1.4, 0.6);
  arrowLHost.add(arrowL.group);
  const arrowRHost = new THREE.Group();
  arrowRHost.position.set(3.4, 2.6, 0.6);
  arrowRHost.rotation.y = Math.PI;
  arrowRHost.add(arrowR.group);

  // quadro de cortiça (z = -9): carta dos bancos → risco sacado → contrato de VPC forjado
  const redString = makeRedString([
    [-2.8, 3.1, -8.86],
    [0.0, 5.6, -8.86],
    [0.4, 3.0, -8.86],
  ]);
  const tagBanco = makeEvidenceTag({ texto: "CARTA BANCO" });
  tagBanco.group.position.set(-2.8, 2.05, -8.86);
  const tagRisco = makeEvidenceTag({ texto: "RISCO SACADO" });
  tagRisco.group.position.set(-1.2, 4.75, -8.86);
  const tagVpc = makeEvidenceTag({ texto: "VPC FORJADO" });
  tagVpc.group.position.set(0.4, 1.95, -8.86);

  // provas do estrago e do detalhe absurdo
  const tagCvm = makeEvidenceTag({ texto: "CVM: ACUSADO" });
  // presas no terno do Magnata no close do estrago; o show() do kit reescreve a escala do grupo, então a escala
  // fica num grupo-hospedeiro
  const tagCvmHost = new THREE.Group();
  tagCvmHost.position.set(-4.66, 0.92, 1.95);
  tagCvmHost.rotation.set(0, 0.1, 0.12);
  tagCvmHost.scale.setScalar(0.5);
  tagCvmHost.add(tagCvm.group);
  const tagPf = makeEvidenceTag({ texto: "PF: DISCLOSURE" });
  const tagPfHost = new THREE.Group();
  tagPfHost.position.set(-4.16, 0.58, 1.97);
  tagPfHost.rotation.set(0, -0.1, -0.1);
  tagPfHost.scale.setScalar(0.5);
  tagPfHost.add(tagPf.group);
  const folder = makeCaseFolder({ caso: "AMERICANAS", nome: "METAS BATIDAS" });
  folder.group.position.set(-4.8, 0.01, -2.4);
  folder.group.rotation.y = 0.1;
  const stampMark = makeStampMark("ACUSADO");
  stampMark.group.position.set(2.0, 0.02, 0.35);
  stampMark.group.rotation.y = -0.35;

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
    arrowLHost,
    arrowRHost,
    redString.group,
    tagBanco.group,
    tagRisco.group,
    tagVpc.group,
    tagCvmHost,
    tagPfHost,
    folder.group,
    stampMark.group
  );
  scene.add(salaGroup);

  // ==================== 2. LIVRO-CAIXA DO PASSIVO (truque das caixas) ====================
  const livroGroup = new THREE.Group();
  livroGroup.position.copy(LIVRO_BASE);
  const ledger = makeLedger({
    titulo: "BALANÇO // AMERICANAS",
    linhas: ["FORNECEDORES", "RISCO SACADO", "DÍV. BANCÁRIA"],
    linhaFraude: 1,
  });
  const shellBoxes = makeShellBoxes({ nomes: ["FORNECEDOR 1", "FORNECEDOR 2", "FORNECEDORES"] });
  shellBoxes.group.position.set(0, 0.02, 3.4);
  const boxGroups = shellBoxes.group.children.slice(0, 3);
  const debtDoc = shellBoxes.group.children[3];
  const debtLbl = labelOf(debtDoc);
  if (debtLbl) relabel(debtLbl, "RISCO SACADO", C.lacre, 64, 0.22);
  // as moedas dos bancos viajam em cima do documento e somem com ele dentro da caixa
  const bankCoins = makeCoinStack({ n: 8, r: 0.2 });
  bankCoins.fill(1);
  shellBoxes.group.add(bankCoins.group);
  const contador = makeContador({ escala: 1, livros: 4 });
  contador.group.position.set(-3.2, 0.02, -1.2);
  contador.group.rotation.y = 0.4;
  livroGroup.add(ledger.group, shellBoxes.group, contador.group);
  scene.add(livroGroup);

  // ==================== 3. FOLHA DE BÔNUS (detalhe absurdo) ====================
  const bonusGroup = new THREE.Group();
  bonusGroup.position.copy(BONUS_BASE);
  const bonusLedger = makeLedger({
    titulo: "BÔNUS // CÚPULA",
    linhas: ["BÔNUS: MILIONÁRIOS", "METAS: BATIDAS", "NÚMEROS: FALSOS"],
    linhaFraude: 2,
  });
  const stampPago = makeStampMark("PAGO");
  stampPago.group.position.set(1.7, 0.03, -1.35);
  stampPago.group.rotation.y = 0.18;
  stampPago.group.scale.setScalar(1.4);
  const stampBatida = makeStampMark("BATIDA");
  stampBatida.group.position.set(1.5, 0.03, 0.75);
  stampBatida.group.rotation.y = -0.14;
  stampBatida.group.scale.setScalar(1.4);
  bonusGroup.add(bonusLedger.group, stampPago.group, stampBatida.group);
  scene.add(bonusGroup);

  // ==================== 4. PREGÃO (com Manada própria no chão) ====================
  const pregaoGroup = new THREE.Group();
  pregaoGroup.position.copy(PREGAO_BASE);
  const trading = makeTradingFloor({ mesas: 6 });
  const manadaP = makeManada({ count: 27, cols: 9, spacing: 0.7, seed: 9 });
  manadaP.group.position.set(0, 0.12, 3.3);
  const pHemi = new THREE.HemisphereLight(0xf6e7cf, 0x1e1214, 0.7);
  const pDir = new THREE.DirectionalLight(0xfff1d6, 2.2);
  pDir.position.set(6, 12, 8);
  pregaoGroup.add(trading.group, manadaP.group, pHemi, pDir);
  scene.add(pregaoGroup);

  // ==================== 24 PLANOS (1,7–3,0 s) ====================
  // w = mundo visível (sala | livro | bonus | pregao); env = céu de SKIES_BF
  const BS = () => SALA_BASE.clone();
  const BL = () => LIVRO_BASE.clone();
  const BB = () => BONUS_BASE.clone();
  const BP = () => PREGAO_BASE.clone();
  const SH = [
    // Cena 1 — O Gancho (0 – 6,42 s)
    { a: 0.0, b: T.dias, env: "imperio", w: "sala", base: BS, p0: [3.9, 6.4, 14.4], p1: [2.2, 6.0, 13.0], l0: [0, 5.2, 0], l1: [0, 5.4, 0], ap: 1.0 },
    { a: T.dias, b: T.varejista, env: "imperio", w: "sala", base: BS, p0: [0.9, 3.4, 3.9], p1: [0.5, 3.0, 3.4], l0: [0, 0.8, 1.2], l1: [0, 0.7, 1.2], ap: 6.5 },
    { a: T.varejista, b: T.ascend, env: "imperio", w: "sala", base: BS, p0: [-2.6, 7.6, 6.4], p1: [-1.3, 7.1, 3.9], l0: [0, 6.5, 0], l1: [0, 6.7, 0], ap: 7.0 },
    // Cena 2 — A Ascensão (6,42 – 14,58 s)
    { a: T.ascend, b: T.lucros, env: "imperio", w: "sala", base: BS, p0: [3.4, 0.5, 6.2], p1: [2.6, 0.6, 5.4], l0: [0, 3.6, 0], l1: [0, 4.0, 0], ap: 2.5 },
    { a: T.lucros, b: 9.84, env: "imperio", w: "sala", base: BS, p0: [-6.6, 2.6, 8.8], p1: [-5.2, 4.6, 8.0], l0: [0, 2.4, 0], l1: [0, 4.0, 0], ap: 2.0 },
    { a: 9.84, b: T.manada, env: "imperio", w: "sala", base: BS, p0: [5.5, 9.5, 11.2], p1: [3.8, 8.2, 9.8], l0: [0, 2.4, 0], l1: [0, 3.2, 0], ap: 0.9 },
    { a: T.manada, b: T.manobra, env: "imperio", w: "sala", base: BS, p0: [-3.4, 0.8, 6.4], p1: [2.8, 0.9, 6.0], l0: [0, 0.6, 3.0], l1: [0, 0.7, 3.0], ap: 4.0, ease: "lin" },
    // Cena 3 — A Manobra no Livro-Caixa (14,58 – 23,04 s)
    { a: T.manobra, b: 17.58, env: "livro", w: "livro", base: BL, p0: [-5.4, 2.4, 3.2], p1: [-4.2, 2.1, 2.4], l0: [-3.0, 1.1, -1.0], l1: [-2.8, 1.1, -0.8], ap: 6.0 },
    { a: 17.58, b: T.caixas, env: "livro", w: "livro", base: BL, p0: [0.0, 16.4, 5.2], p1: [0.0, 14.2, 4.4], l0: [0, 0, 1.6], l1: [0, 0, 1.9], ap: 2.5 },
    { a: T.caixas, b: T.cargo, env: "livro", w: "livro", base: BL, p0: [-4.6, 3.6, 10.8], p1: [1.6, 3.4, 10.4], l0: [-3.0, 0.8, 4.0], l1: [1.6, 0.8, 3.6], ap: 4.5, ease: "lin" },
    // Cena 4 — As Rachaduras na Sala (23,04 – 31,24 s)
    { a: T.cargo, b: T.acendeu, env: "sala", w: "sala", base: BS, p0: [-2.6, 5.4, 12.4], p1: [2.4, 5.6, 11.8], l0: [0, 3.8, 0], l1: [0, 4.0, 0], ap: 1.5 },
    { a: T.acendeu, b: T.revelou, env: "sala", w: "sala", base: BS, p0: [-1.2, 2.4, 6.4], p1: [-0.8, 2.2, 5.6], l0: [-2.4, 1.4, 0.5], l1: [-2.2, 1.5, 0.4], ap: 6.5 },
    { a: T.revelou, b: T.maquiar, env: "sala", w: "sala", base: BS, p0: [1.8, 4.8, -0.6], p1: [1.4, 4.6, -1.2], l0: [-1.0, 4.1, -9], l1: [-1.3, 4.1, -9], ap: 1.0, exp: 1.6 },
    { a: T.maquiar, b: T.janeiro, env: "sala", w: "sala", base: BS, p0: [3.8, 2.4, 6.2], p1: [2.8, 3.8, 5.4], l0: [0, 2.4, 0], l1: [0, 3.6, 0], ap: 6.0, shake: [T.maquiar, 0.08, 0.3, 60] },
    // Cena 5 — O Colapso (31,24 – 40,62 s)
    { a: T.janeiro, b: T.fiscal, env: "imperio", w: "sala", base: BS, p0: [4.2, 0.6, 3.2], p1: [3.5, 0.5, 2.5], l0: [2.4, 1.8, -1.2], l1: [2.4, 2.0, -0.9], ap: 3.5 },
    { a: T.fiscal, b: T.divida40, env: "imperio", w: "sala", base: BS, p0: [4.6, 3.6, 6.6], p1: [3.8, 3.0, 5.6], l0: [2.2, 1.2, -0.6], l1: [2.0, 0.9, -0.5], ap: 3.0, shake: [T.stamp, 0.25, 0.45, 70] },
    { a: T.divida40, b: T.collapse, env: "imperio", w: "sala", base: BS, p0: [0.6, 10.6, 7.2], p1: [-0.6, 9.4, 6.2], l0: [0, 2.0, 0], l1: [0, 2.4, 0], ap: 1.2 },
    { a: T.collapse, b: 40.62, env: "imperio", w: "sala", base: BS, p0: [-4.8, 5.0, 11.2], p1: [-3.0, 3.8, 9.8], l0: [0, 2.4, 0], l1: [0, 1.4, 0], ap: 1.2, shake: [T.collapse, 0.16, 0.6, 60] },
    // Cena 6 — O Estrago (40,62 – 48,40 s)
    { a: 40.62, b: T.peoes, env: "pregao", w: "pregao", base: BP, p0: [-3.2, 3.4, 7.4], p1: [2.6, 3.0, 6.8], l0: [0, 2.0, -2.0], l1: [0, 2.0, -2.0], ap: 1.5 },
    { a: T.peoes, b: T.diretoria, env: "pregao", w: "pregao", base: BP, p0: [-2.6, 0.6, 8.6], p1: [1.8, 0.65, 8.0], l0: [-0.6, 0.6, 3.3], l1: [0.6, 0.6, 3.3], ap: 4.0, ease: "lin" },
    { a: T.diretoria, b: T.absurdo, env: "sala", w: "sala", base: BS, p0: [-3.6, 2.3, 6.6], p1: [-4.0, 2.1, 5.9], l0: [-4.4, 1.3, 1.5], l1: [-4.4, 1.4, 1.5], ap: 6.0 },
    // Cena 7 — Detalhe Absurdo + Rebobinagem até o quadro 0 (48,40 – 55,55 s)
    { a: T.absurdo, b: T.bonus, env: "sala", w: "sala", base: BS, p0: [-4.0, 3.4, 0.6], p1: [-4.5, 2.6, -0.4], l0: [-4.8, 0.05, -2.4], l1: [-4.8, 0.05, -2.45], ap: 7.0 },
    { a: T.bonus, b: R0, env: "livro", w: "bonus", base: BB, p0: [0.0, 18.4, 3.8], p1: [0.0, 16.0, 3.0], l0: [0, 0, -0.3], l1: [0, 0, -0.1], ap: 2.5 },
    { a: R0, b: LOOP + 0.01, env: "imperio", w: "sala", base: BS, p0: [-3.6, 5.2, 10.4], p1: [3.2, 4.6, 11.8], l0: [0, 2.0, 0], l1: [0, 3.2, 0], ap: 1.0, ease: "p3io" },
  ];
  // o último plano termina exatamente no enquadramento do quadro 0
  SH[SH.length - 1].p1 = SH[0].p0.slice();
  SH[SH.length - 1].l1 = SH[0].l0.slice();

  const crackPeriod = loopPeriod(LOOP, 0.8);
  const arrowPeriod = loopPeriod(LOOP, 0.75);

  function update(t, sh) {
    salaGroup.visible = sh.w === "sala";
    livroGroup.visible = sh.w === "livro";
    bonusGroup.visible = sh.w === "bonus";
    pregaoGroup.visible = sh.w === "pregao";

    // Fator de rebobinagem: 1 até R0, 1 → 0 em p3io até R1 (toda função de queda é multiplicada por ele)
    const rew = 1 - E.p3io(seg(t, R0, R1));
    const live = t < R0; // objetos que só existem entre o veredito e a rebobinagem

    // 1. Torre: ascensão (toco → 9 andares), luz UV nos ocos, queda e rebobinagem
    const isAscending = t >= T.ascend && t < T.manobra;
    const riseK = !isAscending ? 1 : t < T.lucros ? 0.18 + 0.1 * seg(t, T.ascend, T.lucros) : 0.28 + 0.72 * seg(t, T.lucros, 12.6);
    const uvK = t >= T.acendeu && t < T.janeiro ? E.p2io(seg(t, T.uvOn, T.uvOn + 1.0)) : 0;
    const revealK = t >= T.acendeu ? E.p2io(seg(t, T.uvOn + 0.15, T.uvOn + 1.6)) * rew : 0;
    const colK = t >= T.collapse ? E.p2in(seg(t, T.collapse, T.collapse + 1.7)) * rew : 0;
    const crackPulse = 0.5 + 0.5 * Math.sin((2 * Math.PI * t) / crackPeriod);
    const crackGrow = t >= T.maquiar && live ? clamp(seg(t, T.maquiar, T.janeiro), 0.2, 1) : 0.3 * crackPulse;

    tower.rise(riseK);
    tower.reveal(revealK);
    tower.collapse(colK);
    tower.crack(crackGrow);

    coinStack.fill(isAscending ? seg(t, T.lucros + 0.2, 12.4) : 1);
    const debris = t < 40.62 || t >= R0;
    coinBurst.group.visible = debris || t < T.diretoria;
    coinBurst.update(colK);
    dust.group.visible = debris;
    dust.update(colK > 0.01 && debris ? colK * 2.0 : -1);

    const arrowsOn = t >= T.lucros && t < T.manobra;
    arrowLHost.visible = arrowsOn;
    arrowRHost.visible = arrowsOn;
    arrowL.pulse(t, (2 * Math.PI) / arrowPeriod, 0.18);
    arrowR.pulse(t, (2 * Math.PI) / arrowPeriod, 0.18);

    // 2. Magnata: no topo (sobe com a torre na ascensão, desce com a queda)
    const magTop = isAscending ? Math.max(0.18, tower.topY * riseK) : tower.topY;
    magnata.group.position.set(0, 0.18 + (magTop - 0.18) * (1 - E.p2in(clamp(colK * 1.25, 0, 1))), 0);
    if (t >= T.diretoria && live) {
      // fora dos escombros, na beira esquerda da mesa, para o close do rosto
      magnata.group.position.set(-4.4, 0, 1.4);
      // derrotado, curvado e com a auréola partida ao meio
      magnata.act(t, "fall", { loop: LOOP, k: 0.12 + 0.2 * E.p2out(seg(t, T.diretoria, T.diretoria + 1.2)) });
    } else if (t >= T.collapse && rew > 0.02) {
      magnata.act(t, "fall", { loop: LOOP, k: colK });
    } else if (t >= T.maquiar && t < T.collapse) {
      magnata.act(t, "panic", { loop: LOOP });
    } else if (t >= T.acendeu && t < T.maquiar) {
      magnata.act(t, "idle", { loop: LOOP, estado: "nervoso" });
    } else if (isAscending && t >= T.lucros) {
      magnata.act(t, "point", { loop: LOOP, t0: T.lucros, estado: "ganancioso" });
    } else {
      magnata.act(t, "celebrate", { loop: LOOP, estado: "confiante" });
    }

    // 3. Manada da sala: euforia no gancho, some no começo da ascensão e volta em onda em "atraindo a manada"
    const herdIn = t < T.ascend || t >= T.manada;
    const herdPop = t >= T.manada && t < T.manobra ? E.backOut(seg(t, T.manada, T.manada + 0.6)) : 1;
    manada.group.visible = herdIn && herdPop > 0.01;
    manada.group.scale.set(1, Math.max(0.001, herdPop), 1);
    if (t >= T.stamp && rew > 0.02) {
      const rK = seg(t, T.collapse + 0.2, T.collapse + 1.6) * rew;
      if (rK > 0.05) manada.act(t, "ruina", { loop: LOOP, k: rK });
      else manada.act(t, "panico", { loop: LOOP, k: seg(t, T.stamp, T.stamp + 1.2) * rew });
    } else if (t >= T.acendeu && t < T.stamp) {
      manada.act(t, "duvida", { loop: LOOP, k: seg(t, T.acendeu, T.acendeu + 1.0) });
    } else {
      manada.act(t, "euforia", { loop: LOOP });
    }

    // 4. Perita: entra pela esquerda e acende a lanterna UV em "acendeu"
    perita.group.visible = t >= T.acendeu && t < 40.62;
    perita.group.position.set(-2.9 - 1.6 * (1 - E.p3out(seg(t, T.acendeu, T.acendeu + 0.7))), 0, 1.3);
    perita.act(t, t >= T.revelou ? "lean" : "scan", { loop: LOOP, k: seg(t, T.revelou, T.revelou + 1.0), uv: t >= T.uvOn && t < T.janeiro });

    // 5. Fiscal: avança em "janeiro", ergue o braço em "fiscal", carimba em "carimbo"
    fiscal.group.visible = t >= T.janeiro && live;
    if (t >= T.stamp - 0.14) {
      fiscal.act(t, "slam", { loop: LOOP, t0: T.stamp });
    } else if (t >= T.fiscal) {
      fiscal.act(t, "raise", { loop: LOOP, k: seg(t, T.fiscal, T.stamp - 0.15) });
    } else {
      fiscal.act(t, "advance", { loop: LOOP, z0: -1.2, D: 1.2, k: seg(t, T.janeiro, T.janeiro + 1.4) });
    }
    stampMark.press(t >= T.stamp && live ? seg(t, T.stamp, T.stamp + 0.15) : 0);

    // 6. Provas: fio vermelho no quadro, etiquetas, pasta do caso
    const boardOn = t >= T.revelou && live;
    redString.group.visible = boardOn;
    redString.draw(boardOn ? seg(t, T.revelou + 0.04, T.revelou + 1.2) : 0);
    tagBanco.show(boardOn ? seg(t, T.revelou, T.revelou + 0.35) : 0);
    tagRisco.show(boardOn ? seg(t, 28.14, 28.5) : 0);
    tagVpc.show(boardOn ? seg(t, 28.72, 29.08) : 0);
    tagCvm.show(t >= T.diretoria && live ? seg(t, T.diretoria + 0.1, T.diretoria + 0.45) : 0);
    tagPf.show(t >= T.diretoria && live ? seg(t, 46.58, 46.93) : 0);
    folder.group.visible = t >= T.absurdo && live;
    folder.open(seg(t, T.absurdo + 0.2, T.absurdo + 1.3));

    const alarmLevel = t >= T.maquiar && t < T.peoes ? clamp(seg(t, T.maquiar, T.stamp), 0, 1) : 0;
    room.update(t, { alarm: alarmLevel, uv: uvK });

    // 7. Livro-caixa do passivo: caixas de FORNECEDORES engolem o RISCO SACADO
    ledger.open(1);
    ledger.flip(seg(t, T.manobra, T.manobra + 0.6));
    ledger.mark(1, seg(t, 17.9, 18.6));
    ledger.uv(0);
    shellBoxes.swallow(seg(t, T.caixas, 21.6));
    shellBoxes.nest(seg(t, 21.6, 22.9));
    boxGroups.forEach((g, i) => {
      const s = E.backOut(seg(t, T.sacado + 0.12 * i, T.sacado + 0.12 * i + 0.45));
      g.scale.setScalar(Math.max(0.001, s));
    });
    bankCoins.group.visible = debtDoc.visible;
    bankCoins.group.position.set(debtDoc.position.x + 0.2, debtDoc.position.y + 0.04, debtDoc.position.z - 0.1);
    bankCoins.group.scale.copy(debtDoc.scale);
    contador.act(t, t >= T.caixas ? "nervous" : "scribble", { loop: LOOP });

    // 8. Folha de bônus: PAGO em "bônus", BATIDA em "batidas", NÚMEROS FALSOS riscado
    bonusLedger.open(1);
    bonusLedger.flip(seg(t, T.bonus, T.bonus + 0.6));
    bonusLedger.mark(0, seg(t, 51.14, 51.6));
    bonusLedger.mark(1, seg(t, 52.28, 52.7));
    bonusLedger.mark(2, seg(t, 52.85, 53.1));
    bonusLedger.uv(0);
    stampPago.press(t >= 51.14 ? seg(t, 51.14, 51.29) : 0);
    stampBatida.press(t >= 52.6 ? seg(t, 52.6, 52.75) : 0);

    // 9. Pregão: telão despenca em "ações viraram pó", Manada tomba em "peões da manada"
    const fallK = seg(t, T.acoes, 42.4);
    trading.telas(Math.round(((1 - fallK) * 25) / 5) * 5);
    trading.queda(fallK);
    if (t >= T.peoes) manadaP.act(t, "ruina", { loop: LOOP, k: seg(t, T.peoes, 44.6) });
    else manadaP.act(t, "duvida", { loop: LOOP, k: seg(t, T.acoes, T.acoes + 0.8) });
  }

  function post(t, sh, c) {
    const ca = pulses(t, [T.stamp], 0.006, 0.22);
    const vigBoost = pulses(t, [T.stamp], 0.25, 0.5);
    return {
      focus: c.dist,
      aperture: sh.ap ?? 1.2,
      ca,
      vignette: Math.min(0.85, 0.55 + vigBoost),
      ...(sh.exp ? { exposure: sh.exp } : {}),
    };
  }

  return createEpisode(S, { loop: LOOP, shots: SH, skies: SKIES_BF, update, post });
}
