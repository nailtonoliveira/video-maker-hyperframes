import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "../three/three.module.min.js";
import { cameraOf, follow, shotAt } from "../camera.js";

const near = (a, b, e = 1e-6) => assert.ok(Math.abs(a - b) < e, `${a} != ${b}`);

test("loop fecha: primeiro e último quadro casam", () => {
  const shot = { a: 0, b: 48.29, p0: [1, 2, 3], p1: [1, 2, 3], l0: [0, 0, 0], l1: [0, 0, 0] };
  const p = cameraOf(shot, 0, 48.28).pos;
  const q = cameraOf(shot, 48.28, 48.28).pos;
  for (const c of ["x", "y", "z"]) assert.ok(Math.abs(p[c] - q[c]) < 1e-4);
});
test("follow sem rotação", () => {
  const shot = { a: 0, b: 1, p0: [0, 1, 0], p1: [0, 1, 0], l0: [0, 0, 0], l1: [0, 0, 0], hand: 0, ...follow(() => ({ p: new THREE.Vector3(10, 0, 0), a: 0 })) };
  const { pos } = cameraOf(shot, 0.5, 0);
  near(pos.x, 10);
  near(pos.y, 1);
  near(pos.z, 0);
});
test("follow com rotação", () => {
  const shot = { a: 0, b: 1, p0: [1, 0, 0], p1: [1, 0, 0], l0: [0, 0, 0], l1: [0, 0, 0], hand: 0, ...follow(() => ({ p: new THREE.Vector3(5, 0, 0), a: Math.PI / 2 }), { rotate: true }) };
  const { pos } = cameraOf(shot, 0.5, 0);
  near(pos.x, 5);
  near(pos.y, 1);
  near(pos.z, 0);
});
test("shotAt além do fim devolve o último", () => {
  const s = [{ a: 0, b: 1 }, { a: 1, b: 2 }];
  assert.equal(shotAt(s, 99), s[1]);
});
