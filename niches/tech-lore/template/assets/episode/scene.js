// Exemplo do template (12 s): os 5 atos do tech-lore em miniatura, com o Ariane 5 (voo 501, 1996).
// 1 exterior (base + foguete) → 2 mergulho pela escotilha do SRI → 3 placa: a linha de código e o bug no ponto da
// falha → 4 alarme (o chip morre, a placa avermelha) → 5 volta ao quadro 0 (o último quadro casa com o primeiro).
// Reescreva por episódio: LOOP = duração da locução, cortes T nas palavras-âncora (assets/voice.json).
import { THREE, createStage, createEpisode, SKIES, makeTerrain, seg, E, shake, pulses, dip, loopPeriod } from "../motor/core.js";
import { M, makeChip, chipState, makeCodeLine, makeBug, bugState, bugWalk } from "../kit/props.js";
import { BOARD_SKY, makeBoard } from "../kit/placa.js";
import { makeLaunchPad, makeAriane5 } from "../kit/exteriores.js";

const LOOP = 12;
const T = { dive: 2.4, board: 4.4, alarm: 6.8, back: 9.2 }; // início de cada ato depois do 1
const I = new THREE.Vector3(0, -500, 0); // origem da placa: os grupos se alternam por visible; a base só separa os mundos
const ROCKET = new THREE.Vector3(0, 7.8, 0); // centro do Ariane 5 parado na base

export function build(canvas) {
  const S = createStage(canvas);
  const { scene } = S;

  // ==================== EXTERIOR: terreno, base ELA-3 e o foguete ====================
  const ext = new THREE.Group();
  const rocket = makeAriane5();
  ext.add(makeTerrain({}).group, makeLaunchPad(), rocket.group);
  scene.add(ext);

  // ==================== INTERIOR: a placa do SRI ====================
  const inside = new THREE.Group();
  inside.position.copy(I);
  scene.add(inside);
  const board = makeBoard({ keepOut: [[-8, -4, 6, 5]], loop: LOOP });
  const line = makeCodeLine({ code: "bh := int16(horizontal_bias);", comment: "-- Align_SRI · herdado do Ariane 4", x0: -6, z: -1.5 });
  const CHIP = new THREE.Vector3(2.6, 0, 2.2);
  const chip = makeChip({ name: "SRI", sub: "navegação" });
  const bug = makeBug();
  inside.add(board.group, line.group, chip, bug);
  // o bug anda pela linha e para no ponto da falha: a conversão int16(...)
  const BUG_A = new THREE.Vector3(-6.8, 0.012, -0.75);
  const FAULT = new THREE.Vector3(-3.85, 0.012, -0.75);
  const blinkP = loopPeriod(LOOP, 0.8);

  // ==================== PLANOS (1,7–3 s, câmera sempre em movimento) ====================
  const R = () => ROCKET.clone();
  const IN = () => I.clone();
  const SH = [
    // 1 exterior: o quadro 0 (gancho com o título); o plano 5 termina exatamente em p0/l0 deste
    // assunto alto/vertical: enquadre pela altura (~55 %)
    { a: 0, b: T.dive, env: "ext", base: R, p0: [12, -1.5, 16.5], p1: [9.8, 0, 14], l0: [0, 1.2, 0], l1: [0, 1.8, 0], ap: 1.5 },
    // 2 mergulho: a escotilha abre e a câmera entra na gaveta do SRI
    { a: T.dive, b: T.board, env: "ext", base: R, p0: [5, 3.2, 9.5], p1: [0.02, 1.6, 1.12], l0: [0, 1.8, 0], l1: [0, 1.6, 0.9], ap: 6, ease: "p2in" },
    // 3 placa, de cima (texto no chão só em plano de cima): o mergulho continua até a linha de código
    { a: T.board, b: T.alarm, env: "int", base: IN, p0: [-2.7, 22, 7.5], p1: [-2.5, 13.2, 5.2], l0: [-2.5, 0, -1.6], l1: [-2.35, 0, -1.45], ap: 10, ease: "p2out" },
    // 4 alarme: outro lado, ~30° de elevação (texto no chão não fica rasante); tremor no estouro
    { a: T.alarm, b: T.back, env: "int", base: IN, p0: [7.6, 7.4, 8.6], p1: [6.4, 6.4, 7.4], l0: [0, 0.3, 0.6], l1: [-0.4, 0.3, 0.4], ap: 8, shake: [T.alarm, 0.05, 0.5, 55] },
    // 5 volta: afasta do foguete pelo outro lado até o quadro 0
    { a: T.back, b: LOOP + 0.01, env: "ext", base: R, p0: [-6, 5, 9], p1: [12, -1.5, 16.5], l0: [0, 2.5, 0], l1: [0, 1.2, 0], ap: 1.5 },
  ];

  // o motor escolhe o plano, põe céu e câmera; aqui fica só a cena e o pós deste episódio
  function update(V, sh, c) {
    const isExt = sh.env === "ext";
    ext.visible = isExt;
    inside.visible = !isExt;
    // exterior: foguete parado; escotilha (dobradiça, gaveta) só durante o mergulho
    const diving = V >= T.dive && V < T.board;
    rocket.pose(ROCKET, 0);
    rocket.burn(0, V, false);
    rocket.nozzle(0);
    rocket.breakup(0);
    rocket.xray(false, V, 0);
    rocket.hatch(diving ? E.p2io(seg(V, 2.9, 3.4)) : 0, diving ? E.p2io(seg(V, 3.2, 3.8)) : 0);
    // interior: bug até a falha, sublinhado e chip vermelhos no alarme
    const pose = bugWalk(V, 4.6, 6.4, BUG_A, FAULT);
    pose.pos.x += shake(V, T.alarm, 0.06, 0.4);
    bugState(bug, pose);
    line.underline.material = V >= T.alarm ? M.ledAlert : M.ledOff;
    const st = chipState(chip, V, T.alarm, blinkP);
    chip.position.set(CHIP.x + st.dx, st.y, CHIP.z);
    chip.rotation.z = st.rz;
    board.update(V, { focus: c.look.clone().sub(I), alarm: E.expoOut(seg(V, T.alarm, T.alarm + 0.4)) });
  }
  function post(V, sh, c) {
    // mergulho no escuro ao entrar na placa; aberração no estouro do alarme
    const exposure = dip(V, T.board, 0.07, 0.92);
    const ca = pulses(V, [T.alarm], 0.008, 0.35);
    return { focus: c.dist, aperture: sh.ap * (sh.env === "ext" ? 1 : 0.6), exposure, ca };
  }
  return createEpisode(S, { loop: LOOP, shots: SH, skies: { ext: SKIES.day, int: BOARD_SKY }, update, post });
}
