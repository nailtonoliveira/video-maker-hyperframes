// Kit 3D do tech-lore — efeitos instanciados: rastro de fumaça, nuvem de chão e explosão.
// Cada um devolve { group, update }; update é função pura do tempo (nada carregado entre quadros).
import { THREE, glowless, hash } from "../motor/core.js";

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _s = new THREE.Vector3();
const _p = new THREE.Vector3();
const _c = new THREE.Color();
const cYoung = new THREE.Color(0xf2f4f7);
const cOld = new THREE.Color(0x9aa4b0);
const hide = (mesh, i) => mesh.setMatrixAt(i, _m.makeScale(0, 0, 0));
const puffs = (n) => {
  const mesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true }), n);
  mesh.frustumCulled = false;
  return mesh;
};

// rastro: um bolo de fumaça a cada `step` s de voo, até `until`
// update(F, flight, tail): F = tempo de voo; flight(F) -> { p, a }; tail(a) -> deslocamento até o bocal
export function makeTrail({ until, step = 0.05 }) {
  const n = Math.ceil(until / step);
  const trail = puffs(n);
  const group = new THREE.Group();
  group.add(trail);
  function update(F, flight, tail) {
    for (let k = 0; k < n; k++) {
      const fe = 0.3 + k * step;
      const age = F - fe;
      if (age < 0.15 || fe > until) {
        hide(trail, k);
        continue;
      }
      const at = flight(fe);
      const sz = 0.9 + 6.5 * (1 - Math.exp(-age * 0.3));
      _p.copy(at.p).add(tail(at.a));
      _p.x += 0.8 * age + (hash(k, 1) - 0.5) * age * 0.8;
      _p.y += -0.2 * age + (hash(k, 2) - 0.5) * age * 0.5;
      _p.z += (hash(k, 3) - 0.5) * age * 0.8;
      _e.set(hash(k, 4) * 6, hash(k, 5) * 6, hash(k, 6) * 6);
      _q.setFromEuler(_e);
      _s.set(sz * (0.8 + hash(k, 7) * 0.4), sz * (0.8 + hash(k, 8) * 0.4), sz * (0.8 + hash(k, 9) * 0.4));
      trail.setMatrixAt(k, _m.compose(_p, _q, _s));
      trail.setColorAt(k, _c.copy(cYoung).lerp(cOld, Math.min(1, age / 14)));
    }
    trail.instanceMatrix.needsUpdate = true;
    if (trail.instanceColor) trail.instanceColor.needsUpdate = true;
  }
  return { group, update };
}

// nuvem de chão da decolagem: bolos que nascem nos primeiros 6 s e se espalham em anel em volta de center
export function makeGroundCloud({ count = 150, center = [0, 0, 6] } = {}) {
  const [cx, cy, cz] = center;
  const ground = puffs(count);
  const group = new THREE.Group();
  group.add(ground);
  function update(F) {
    for (let k = 0; k < count; k++) {
      const fe = (k / count) * 6;
      const age = F - fe;
      if (age < 0) {
        hide(ground, k);
        continue;
      }
      const ang = hash(k, 1) * Math.PI * 2;
      const r = 4 + (14 + 18 * hash(k, 2)) * (1 - Math.exp(-age * 0.5));
      _p.set(cx + Math.cos(ang) * r, cy + (1.2 + 3 * hash(k, 3) * (1 - Math.exp(-age))), Math.sin(ang) * r + cz);
      const sz = 2.5 + 6 * (1 - Math.exp(-age * 0.4)) * (0.7 + hash(k, 4) * 0.6);
      _e.set(hash(k, 5) * 6, hash(k, 6) * 6, 0);
      _q.setFromEuler(_e);
      ground.setMatrixAt(k, _m.compose(_p, _q, _s.setScalar(sz)));
      ground.setColorAt(k, _c.copy(cYoung).lerp(cOld, Math.min(1, age / 10)));
    }
    ground.instanceMatrix.needsUpdate = true;
    if (ground.instanceColor) ground.instanceColor.needsUpdate = true;
  }
  return { group, update };
}

// explosão em `at`: fogo facetado (cor plena), fumaça escura e destroços; update(dt), dt = s desde o estouro
export function makeExplosion({ at }) {
  const FIRE = 46;
  // fogo facetado: cor por bolha (amarelo → laranja → vermelho) com emissão parcial, para ter volume sem brilho
  const fireMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xff7a2a, emissiveIntensity: 0.45, roughness: 1, flatShading: true });
  const fire = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), fireMat, FIRE);
  const fireCore = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), glowless(0xfff0d0), FIRE);
  const SMOKE = 110;
  const smoke = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true }), SMOKE);
  const DEBRIS = 160;
  const debris = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ roughness: 0.8, flatShading: true }), DEBRIS);
  const group = new THREE.Group();
  for (const m of [fire, fireCore, smoke, debris]) {
    m.frustumCulled = false;
    group.add(m);
  }
  for (let i = 0; i < DEBRIS; i++) debris.setColorAt(i, _c.setHex(hash(i, 9) < 0.7 ? 0xd9dde3 : 0x3a414a));
  const FIRE_COLS = [0xffe2a0, 0xffb35c, 0xff7a3a, 0xe0482c];
  for (let i = 0; i < FIRE; i++) fire.setColorAt(i, _c.setHex(FIRE_COLS[Math.floor(hash(i, 31) * 4)]));
  for (let i = 0; i < SMOKE; i++) smoke.setColorAt(i, _c.setHex(0x8a8f96).multiplyScalar(0.7 + 0.5 * hash(i, 33)));

  function update(dt) {
    for (let i = 0; i < FIRE; i++) {
      const age = dt - i * 0.012;
      const life = 1.1 + hash(i, 1) * 0.8;
      if (dt <= 0 || age < 0 || age > life) {
        hide(fire, i);
        hide(fireCore, i);
        continue;
      }
      const dir = new THREE.Vector3(hash(i, 2) - 0.5, hash(i, 3) - 0.3, hash(i, 4) - 0.5).normalize();
      _p.copy(at).addScaledVector(dir, (4 + 14 * hash(i, 5)) * (1 - Math.exp(-age * 3)));
      const k = age / life;
      const sz = (1.5 + 5.5 * hash(i, 6)) * Math.sin(Math.PI * Math.min(1, k * 1.15));
      _e.set(hash(i, 34) * 6, hash(i, 35) * 6, 0);
      _q.setFromEuler(_e);
      fire.setMatrixAt(i, _m.compose(_p, _q, _s.setScalar(Math.max(0, sz))));
      fireCore.setMatrixAt(i, _m.compose(_p, _q, _s.setScalar(hash(i, 32) < 0.35 ? Math.max(0, sz * 0.5) : 0)));
    }
    for (let i = 0; i < SMOKE; i++) {
      const age = dt - 0.05 - i * 0.01;
      if (dt <= 0 || age < 0) {
        hide(smoke, i);
        continue;
      }
      const dir = new THREE.Vector3(hash(i, 12) - 0.5, hash(i, 13) - 0.35, hash(i, 14) - 0.5).normalize();
      _p.copy(at).addScaledVector(dir, (8 + 22 * hash(i, 15)) * (1 - Math.exp(-age * 1.2)));
      _p.y -= 0.6 * age;
      const sz = (2.5 + 5.5 * hash(i, 16)) * (1 - Math.exp(-age * 1.5)) + 0.6 * age;
      _e.set(hash(i, 17) * 6, hash(i, 18) * 6, 0);
      _q.setFromEuler(_e);
      smoke.setMatrixAt(i, _m.compose(_p, _q, _s.setScalar(sz)));
    }
    for (let i = 0; i < DEBRIS; i++) {
      if (dt <= 0) {
        hide(debris, i);
        continue;
      }
      const v = new THREE.Vector3(hash(i, 21) - 0.5, hash(i, 22) - 0.2, hash(i, 23) - 0.5).normalize().multiplyScalar(8 + 20 * hash(i, 24));
      _p.copy(at).addScaledVector(v, dt);
      _p.y -= 6 * dt * dt;
      _e.set(hash(i, 25) * 9 * dt, hash(i, 26) * 9 * dt, hash(i, 27) * 9 * dt);
      _q.setFromEuler(_e);
      const sz = 0.15 + 0.6 * hash(i, 28);
      _s.set(sz, sz * (0.3 + hash(i, 29)), sz * (0.5 + hash(i, 30)));
      debris.setMatrixAt(i, _m.compose(_p, _q, _s));
    }
    for (const m of [fire, fireCore, smoke, debris]) m.instanceMatrix.needsUpdate = true;
    if (debris.instanceColor) debris.instanceColor.needsUpdate = true;
  }
  return { group, update };
}
