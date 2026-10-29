// Motor 3D — câmera por planos. shot = { a, b, base(t), path(t,k,shot), aim(t,k,shot), p0, p1, l0, l1, ease, hand }
import * as THREE from "./three/three.module.min.js";
import { E, seg } from "./util.js";

export const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);
export function shotAt(shots, t) {
  return shots.find((q) => t >= q.a && t < q.b) || shots[shots.length - 1];
}
// câmera na mão: frequências múltiplas de 2π/duração (loop > 0), para o último quadro casar com o primeiro
const handW = (w, loop) => (loop ? (Math.max(1, Math.round((w * loop) / (2 * Math.PI))) * 2 * Math.PI) / loop : w);
export function cameraOf(shot, t, loop = 0) {
  const k = E[shot.ease || "p2io"](seg(t, shot.a, shot.b));
  const base = shot.base ? shot.base(t) : new THREE.Vector3();
  // path/aim recebem o plano como 3º argumento (follow lê p0/p1/l0/l1 dele); quem ignora o 3º continua funcionando
  const pos = shot.path ? shot.path(t, k, shot) : v3(shot.p0).lerp(v3(shot.p1), k).add(base);
  const look = shot.aim ? shot.aim(t, k, shot) : v3(shot.l0).lerp(v3(shot.l1), k).add(base);
  const dist = pos.distanceTo(look);
  const hand = (shot.hand ?? 0.006) * dist;
  pos.x += hand * (Math.sin(t * handW(1.3, loop)) + 0.5 * Math.sin(t * handW(3.1, loop) + 1));
  pos.y += hand * (Math.sin(t * handW(1.7, loop) + 2) + 0.5 * Math.sin(t * handW(2.6, loop)));
  return { pos, look, dist };
}
// segue um alvo target(t) -> { p: Vector3, a: número }; devolve campos para espalhar no plano.
// rotate: p0/p1/l0/l1 giram em torno de z pelo ângulo a e somam p (câmera presa ao corpo do alvo).
const rotZ = (v, a) => new THREE.Vector3(v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a), v[2]);
export function follow(target, { rotate = false } = {}) {
  if (!rotate) return { base: (t) => target(t).p };
  return {
    path: (t, k, s) => {
      const f = target(t);
      return rotZ(s.p0, f.a).lerp(rotZ(s.p1, f.a), k).add(f.p);
    },
    aim: (t, k, s) => {
      const f = target(t);
      return rotZ(s.l0, f.a).lerp(rotZ(s.l1, f.a), k).add(f.p);
    },
  };
}
