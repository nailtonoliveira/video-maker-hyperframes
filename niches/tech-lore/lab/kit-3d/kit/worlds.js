// Kit 3D do tech-lore — mundos reutilizáveis: a placa por dentro da máquina e a Terra vista de fora.
import { THREE, COL, rng, solid, label, gridLines, blink, fill } from "./core.js";
import { M } from "./props.js";

export const SKY = {
  // dia dessaturado: mantém a paleta escura da série sem fingir que foi de noite
  day: { top: 0x2c3a4e, mid: 0x7d8a99, bottom: 0x39434d, fog: 0x6f7d8c, fogNear: 180, fogFar: 2800 },
  board: { top: 0x05070b, mid: 0x111a26, bottom: 0x05070b, fog: 0x0e1621, fogNear: 22, fogFar: 95 },
};

// período de piscar que divide a duração do vídeo (loop sem salto)
const loopPeriod = (loop, want) => loop / Math.max(1, Math.round(loop / want));

// ==================== a placa: trilhas, vias, componentes, LEDs, serigrafia ====================
// keepOut: retângulos [x0, z0, x1, z1] onde a cena do episódio acontece (sem enfeites)
export function makeBoard({ seed = 11, cx = 4, cz = 0, half = 70, keepOut = [], loop = 48.28 }) {
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

// ==================== a Terra: chão com morros, costa, mar e nuvens ====================
export function makeEarth({ seed = 3, coast = (z) => 260 + 70 * Math.sin(z / 420), flatR = 70 }) {
  const group = new THREE.Group();
  const r = rng(seed);
  const waves = Array.from({ length: 6 }, () => [r() * 0.01 + 0.002, r() * 0.01 + 0.002, r() * 6, 4 + r() * 10]);
  const hills = (x, z) => waves.reduce((s, [fx, fz, ph, a]) => s + a * Math.sin(x * fx + ph) * Math.cos(z * fz - ph), 0);

  let geo = new THREE.PlaneGeometry(7000, 7000, 140, 140);
  geo.rotateX(-Math.PI / 2);
  geo = geo.toNonIndexed();
  const pos = geo.attributes.position;
  const colors = [];
  const cJungle = new THREE.Color(0x24382c);
  const cJungle2 = new THREE.Color(0x2e4434);
  const cPad = new THREE.Color(0x4b5149);
  const cSand = new THREE.Color(0x6e6a58);
  const cSea = new THREE.Color(0x3b4a4f);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const dc = coast(z) - x;
    const dPad = Math.hypot(x, z);
    let h;
    if (dc > 0) {
      const ramp = Math.min(1, Math.max(0, (dPad - flatR) / 90));
      h = Math.max(0.5, (hills(x, z) + 14) * ramp * Math.min(1, dc / 60));
    } else h = -4;
    pos.setY(i, h);
  }
  // cor por face (flat): mata, areia perto da costa, clareira da base
  for (let i = 0; i < pos.count; i += 3) {
    const x = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3;
    const z = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
    const dc = coast(z) - x;
    let c = (i / 3) % 2 ? cJungle : cJungle2;
    if (dc < 0) c = cSea;
    else if (dc < 35) c = cSand;
    else if (Math.hypot(x, z) < flatR + 10) c = cPad;
    for (let k = 0; k < 3; k++) colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const land = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true }));
  land.receiveShadow = true;
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(7000, 7000), new THREE.MeshStandardMaterial({ color: 0x2b3d4a, roughness: 0.35, metalness: 0.1 }));
  sea.rotation.x = -Math.PI / 2;
  sea.position.y = 0.2;
  group.add(sea, land);

  // cúmulos: cada nuvem é um cacho de 5–8 bolhas, base achatada, sombra clareada pelo céu
  const N = 70;
  const PUFF = 7;
  const clouds = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.MeshStandardMaterial({ color: 0xd3d9e0, emissive: 0x4a5664, roughness: 1, flatShading: true }),
    N * PUFF,
  );
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const s = new THREE.Vector3();
  const m = new THREE.Matrix4();
  const c = new THREE.Vector3();
  for (let i = 0; i < N; i++) {
    const rad = 120 + r() * 1100;
    const a = r() * Math.PI * 2;
    c.set(Math.cos(a) * rad + 150, 150 + r() * 70, Math.sin(a) * rad);
    const size = 10 + r() * 16;
    for (let k = 0; k < PUFF; k++) {
      const ox = (r() - 0.5) * size * 2.2;
      const oz = (r() - 0.5) * size * 1.4;
      const big = size * (0.55 + r() * 0.5) * (1 - Math.abs(ox) / (size * 2.4));
      e.set(r() * 6, r() * 6, r() * 6);
      q.setFromEuler(e);
      s.set(big, big * 0.75, big);
      m.compose(new THREE.Vector3(c.x + ox, c.y + big * 0.35, c.z + oz), q, s);
      clouds.setMatrixAt(i * PUFF + k, m);
    }
  }
  group.add(clouds);

  const hemi = new THREE.HemisphereLight(0xb8c6d8, 0x2b3530, 1.2);
  const sun = new THREE.DirectionalLight(0xfff2e0, 2.6);
  sun.position.set(400, 520, 260);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -50, right: 50, top: 50, bottom: -50, near: 100, far: 1400 });
  sun.shadow.bias = -0.0006;
  group.add(hemi, sun, sun.target);
  return { group, sun };
}
