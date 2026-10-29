// Motor 3D — mundos: grade de chão, presets de céu e terreno com costa, mar e nuvens.
import * as THREE from "./three/three.module.min.js";
import { rng } from "./util.js";

export function gridLines(cx, cz, half, step, color, opacity, y) {
  const p = [];
  for (let i = -half; i <= half; i += step) p.push(cx - half, y, cz + i, cx + half, y, cz + i, cx + i, y, cz - half, cx + i, y, cz + half);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
  return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
}

export const SKIES = {
  // dia dessaturado: mantém a paleta escura da série sem fingir que foi de noite
  day: { top: 0x2c3a4e, mid: 0x7d8a99, bottom: 0x39434d, fog: 0x6f7d8c, fogNear: 180, fogFar: 2800 },
};

// chão com morros, costa, mar e nuvens. Cores: mata (2 tons alternados), clareira, areia, fundo do mar, mar e nuvens
export function makeTerrain({
  seed = 3,
  coast = (z) => 260 + 70 * Math.sin(z / 420),
  flatR = 70,
  jungle = 0x24382c,
  jungle2 = 0x2e4434,
  pad = 0x4b5149,
  sand = 0x6e6a58,
  seabed = 0x3b4a4f,
  sea = 0x2b3d4a,
  cloud = 0xd3d9e0,
} = {}) {
  const group = new THREE.Group();
  const r = rng(seed);
  const waves = Array.from({ length: 6 }, () => [r() * 0.01 + 0.002, r() * 0.01 + 0.002, r() * 6, 4 + r() * 10]);
  const hills = (x, z) => waves.reduce((s, [fx, fz, ph, a]) => s + a * Math.sin(x * fx + ph) * Math.cos(z * fz - ph), 0);

  let geo = new THREE.PlaneGeometry(7000, 7000, 140, 140);
  geo.rotateX(-Math.PI / 2);
  geo = geo.toNonIndexed();
  const pos = geo.attributes.position;
  const colors = [];
  const cJungle = new THREE.Color(jungle);
  const cJungle2 = new THREE.Color(jungle2);
  const cPad = new THREE.Color(pad);
  const cSand = new THREE.Color(sand);
  const cSea = new THREE.Color(seabed);
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
  const seaMesh = new THREE.Mesh(new THREE.PlaneGeometry(7000, 7000), new THREE.MeshStandardMaterial({ color: sea, roughness: 0.35, metalness: 0.1 }));
  seaMesh.rotation.x = -Math.PI / 2;
  seaMesh.position.y = 0.2;
  group.add(seaMesh, land);

  // cúmulos: cada nuvem é um cacho de 5–8 bolhas, base achatada, sombra clareada pelo céu
  const N = 70;
  const PUFF = 7;
  const clouds = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.MeshStandardMaterial({ color: cloud, emissive: 0x4a5664, roughness: 1, flatShading: true }),
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
