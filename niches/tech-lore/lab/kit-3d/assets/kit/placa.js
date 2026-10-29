// Kit 3D do tech-lore — a placa por dentro da máquina (trilhas, componentes, LEDs, facho) e o céu dela.
import { THREE, COL, rng, solid, label, gridLines, blink, fill, loopPeriod } from "../motor/core.js";
import { M } from "./props.js";

export const BOARD_SKY = { top: 0x05070b, mid: 0x111a26, bottom: 0x05070b, fog: 0x0e1621, fogNear: 22, fogFar: 95 };

// ==================== a placa: trilhas, vias, componentes, LEDs, serigrafia ====================
// keepOut: retângulos [x0, z0, x1, z1] onde a cena do episódio acontece (sem enfeites)
export function makeBoard({ seed = 11, cx = 4, cz = 0, half = 70, keepOut = [], loop }) {
  if (!loop) throw new Error("makeBoard: informe loop (duração do vídeo)");
  const group = new THREE.Group();
  const free = (x, z, pad = 0) => !keepOut.some(([x0, z0, x1, z1]) => x > x0 - pad && x < x1 + pad && z > z0 - pad && z < z1 + pad);

  const slab = solid(new THREE.BoxGeometry(half * 2, 0.2, half * 2), M.board, null, false);
  slab.position.set(cx, -0.1, cz);
  group.add(slab);
  group.add(gridLines(cx, cz, half, 1, COL.gray, 0.08, 0.004));
  group.add(gridLines(cx, cz, half, 5, COL.gray, 0.18, 0.005));

  // trilhas em L (Manhattan) e vias nas pontas
  const r = rng(seed);
  const vias = [];
  for (let n = 0; n < 120; n++) {
    let x = Math.round(cx + (r() - 0.5) * half * 1.7);
    let z = Math.round(cz + (r() - 0.5) * half * 1.7);
    let horiz = r() < 0.5;
    for (let s = 0; s < 4; s++) {
      const len = 3 + Math.floor(r() * 10);
      const dir = r() < 0.5 ? -1 : 1;
      const nx = horiz ? x + dir * len : x;
      const nz = horiz ? z : z + dir * len;
      const mx = (x + nx) / 2;
      const mz = (z + nz) / 2;
      if (free(mx, mz, 1) && free(nx, nz, 1)) {
        const tr = solid(new THREE.BoxGeometry(horiz ? len + 0.14 : 0.14, 0.03, horiz ? 0.14 : len + 0.14), M.trace, null, false);
        tr.position.set(mx, 0.015, mz);
        group.add(tr);
        if (s === 3 || r() < 0.3) vias.push([nx, nz]);
      }
      x = nx;
      z = nz;
      horiz = !horiz;
    }
  }
  const viaMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 10), fill(0x56616f, 0.4), vias.length);
  const m4 = new THREE.Matrix4();
  vias.forEach(([x, z], i) => viaMesh.setMatrixAt(i, m4.makeTranslation(x, 0.02, z)));
  group.add(viaMesh);

  // componentes: o horizonte da placa, com LEDs e referências de serigrafia
  const rk = rng(seed + 12);
  const leds = [];
  let refN = 1;
  for (let n = 0; n < 230; n++) {
    const x = cx + (rk() - 0.5) * half * 1.6;
    const z = cz + (rk() - 0.5) * half * 1.6;
    if (!free(x, z, 1.5)) continue;
    const kind = rk();
    let c;
    let top = 0.5;
    let ref = "C";
    if (kind < 0.33) {
      const rad = 0.3 + rk() * 0.5;
      const h = 0.8 + rk() * 2.4;
      c = solid(new THREE.CylinderGeometry(rad, rad, h, 14), M.compLight, M.eSoft);
      c.position.set(x, h / 2, z);
      const cross = new THREE.Mesh(new THREE.BoxGeometry(rad * 1.4, 0.01, 0.04), M.ledOff);
      cross.position.y = h / 2 + 0.006;
      c.add(cross);
      top = h;
    } else if (kind < 0.72) {
      const w = 1.2 + rk() * 3.5;
      const d = 1.2 + rk() * 3.5;
      const h = 0.25 + rk() * 0.5;
      c = solid(new THREE.BoxGeometry(w, h, d), M.comp, M.eSoft);
      c.position.set(x, h / 2, z);
      top = h;
      ref = "U";
      if (rk() < 0.45) {
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.1), M.ledOff);
        led.position.set(-w / 2 + 0.3, h / 2 + 0.02, d / 2 - 0.2);
        c.add(led);
        leds.push({ led, period: loopPeriod(loop, 0.5 + rk() * 1.6), phase: rk() * 2, color: rk() < 0.7 ? M.ledMint : M.ledCyan });
      }
    } else if (kind < 0.88) {
      const g = new THREE.Group();
      const fins = 5 + Math.floor(rk() * 6);
      const h = 1.5 + rk() * 3.5;
      for (let f = 0; f < fins; f++) {
        const fin = solid(new THREE.BoxGeometry(0.08, h, 2.2), M.compLight, M.eSoft);
        fin.position.set(f * 0.32, h / 2, 0);
        g.add(fin);
      }
      const base = solid(new THREE.BoxGeometry(fins * 0.32, 0.2, 2.4), M.comp, M.eSoft);
      base.position.set((fins - 1) * 0.16, 0.1, 0);
      g.add(base);
      c = g;
      c.position.set(x, 0, z);
      top = 0;
      ref = "Q";
    } else {
      const w = 0.6 + rk() * 1.2;
      const h = 0.5 + rk() * 0.8;
      c = solid(new THREE.BoxGeometry(w, h, w), M.compLight, M.eSoft);
      c.position.set(x, h / 2, z);
      ref = "L";
      top = h;
    }
    c.rotation.y = Math.floor(rk() * 4) * (Math.PI / 2);
    group.add(c);
    if (rk() < 0.22 && top > 0) {
      const s = label(`${ref}${refN++}`, "#7d8590", 64, 0.32, 700);
      s.rotation.x = -Math.PI / 2;
      s.position.set(x, 0.012, z + 1.6);
      group.add(s);
    }
  }

  // luz: base fraca + facho que segue a ação (é o facho que separa o assunto do fundo)
  const hemi = new THREE.HemisphereLight(0x8aa2c8, 0x06080c, 0.9);
  const fillLight = new THREE.DirectionalLight(0xcfe0ff, 0.9);
  fillLight.position.set(-12, 18, 10);
  const rim = new THREE.DirectionalLight(0x6fb6ff, 1.3);
  rim.position.set(-10, 6, -18);
  const spot = new THREE.SpotLight(0xfff1e0, 1100, 0, 0.42, 0.75, 2);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.shadow.bias = -0.0005;
  spot.shadow.camera.near = 2;
  spot.shadow.camera.far = 60;
  const target = new THREE.Object3D();
  spot.target = target;
  group.add(hemi, fillLight, rim, spot, target);

  const white = new THREE.Color(0xfff1e0);
  const red = new THREE.Color(COL.alert);
  function update(t, { focus, alarm = 0 }) {
    for (const l of leds) l.led.material = blink(t, l.period, l.phase, 0.5) ? l.color : M.ledOff;
    target.position.copy(focus);
    spot.position.set(focus.x + 4, 15, focus.z + 8);
    spot.color.copy(white).lerp(red, alarm * 0.6);
  }
  return { group, update };
}
