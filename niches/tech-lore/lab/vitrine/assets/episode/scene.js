// Vitrine dos exteriores do kit: cada objeto em plano aberto 9:16, câmera girando devagar em volta, 4 s por objeto.
// Não é episódio: serve para julgar, quadro a quadro, se cada objeto se lê pelo que é sem rótulo (REVIEW.md).
import { THREE, COL, createStage, createEpisode, SKIES, makeTerrain, gridLines, solid, fill, seg, E, loopPeriod } from "../motor/core.js";
import { BOARD_SKY } from "../kit/placa.js";
import { makeLaunchPad, makeAriane5, makeDataCenter, makeTradingFloor, makeMedicalDevice } from "../kit/exteriores.js";

const DUR = 4;

export function build(canvas) {
  const S = createStage(canvas);
  const { scene } = S;

  // ---------- luz do dia: terreno, base e Ariane 5 ----------
  const dia = new THREE.Group();
  const rocket = makeAriane5();
  dia.add(makeTerrain({}).group, makeLaunchPad(), rocket.group);
  scene.add(dia);

  // ---------- sala: chão escuro com a grade da série e luz de estúdio ----------
  const sala = new THREE.Group();
  const chao = solid(new THREE.BoxGeometry(160, 0.2, 160), fill(COL.ground), null, false);
  chao.position.y = -0.1;
  sala.add(chao, gridLines(0, 0, 80, 1, COL.gray, 0.08, 0.002), gridLines(0, 0, 80, 5, COL.gray, 0.16, 0.003));
  const hemi = new THREE.HemisphereLight(0x8aa2c8, 0x06080c, 0.9);
  const key = new THREE.DirectionalLight(0xfff1e0, 2.2);
  key.position.set(8, 14, 10);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 40 });
  key.shadow.bias = -0.0005;
  const rim = new THREE.DirectionalLight(0x6fb6ff, 1.1);
  rim.position.set(-10, 6, -14);
  sala.add(hemi, key, key.target, rim);
  scene.add(sala);

  const dc = makeDataCenter({ racks: 8 });
  const trade = makeTradingFloor({ mesas: 6 });
  const med = makeMedicalDevice();
  for (const o of [dc, trade, med]) sala.add(o.group);

  // ---------- objetos: centro mirado, raio e altura da órbita, ângulos inicial → final (graus, 0 = +z) ----------
  const LOOP = DUR * 4;
  const ledP = loopPeriod(LOOP, 0.6);
  const OBJ = [
    { env: "dia", show: [], look: [0, 6.5, 0], r: 26, y: 7, a: [-12, 14], set: () => {} },
    {
      env: "sala", show: [dc.group], look: [0, 0.9, 0], r: 9, y: 6, a: [100, 72],
      set: (u, t) => {
        dc.leds(t, ledP);
        dc.alarme(E.p2io(seg(u, 2.3, 2.9)));
      },
    },
    {
      env: "sala", show: [trade.group], look: [0, 1.2, -0.9], r: 11.5, y: 7.2, a: [-20, 12],
      set: (u) => {
        trade.telas(4231.5 - 980 * E.p2in(seg(u, 1.8, 3.6)));
        trade.queda(E.p2io(seg(u, 1.8, 3.4)));
      },
    },
    {
      env: "sala", show: [med.group], look: [1.4, 0.9, 0], r: 9.5, y: 6.5, a: [22, 44],
      set: (u) => {
        med.giro(-0.12 * seg(u, 0, DUR));
        med.feixe(u > 1.2);
        med.alerta(E.p2io(seg(u, 2.6, 3.0)));
      },
    },
  ];
  const all = [dc.group, trade.group, med.group];
  const orbit = (o) => (t, k) => {
    const a = THREE.MathUtils.degToRad(o.a[0] + (o.a[1] - o.a[0]) * k);
    return new THREE.Vector3(o.look[0] + o.r * Math.sin(a), o.y, o.look[2] + o.r * Math.cos(a));
  };
  const shots = OBJ.map((o, i) => ({
    a: i * DUR,
    b: (i + 1) * DUR + (i === OBJ.length - 1 ? 0.01 : 0),
    env: o.env, ease: "lin", hand: 0.002, obj: o,
    path: orbit(o),
    aim: () => new THREE.Vector3(...o.look),
  }));

  function update(t, sh) {
    const o = sh.obj;
    dia.visible = o.env === "dia";
    sala.visible = o.env === "sala";
    for (const g of all) g.visible = o.show.includes(g);
    // estado de todos em toda chamada (os escondidos ficam no estado de repouso)
    rocket.pose(new THREE.Vector3(0, 7.8, 0), 0);
    rocket.burn(0, t, false);
    rocket.nozzle(0);
    rocket.breakup(0);
    rocket.xray(false, t, 0);
    rocket.hatch(0, 0);
    dc.leds(t, ledP);
    dc.alarme(0);
    trade.telas(4231.5);
    trade.queda(0);
    med.giro(0);
    med.feixe(false);
    med.alerta(0);
    o.set(t - sh.a, t);
  }
  const post = (t, sh, c) => ({ focus: c.dist, aperture: 0.6 });
  return createEpisode(S, { loop: LOOP, shots, skies: { dia: SKIES.day, sala: BOARD_SKY }, update, post });
}
