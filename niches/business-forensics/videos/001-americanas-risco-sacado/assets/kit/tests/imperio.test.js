import test from "node:test";
import assert from "node:assert/strict";
import { collapsePose } from "../imperio.js";

test("collapsePose: em k = 0, deslocamentos e rotações são zero", () => {
  const p = collapsePose(0, 9, false, 0);
  assert.equal(p.dx, 0);
  assert.equal(p.dy, 0);
  assert.equal(p.dz, 0);
  assert.equal(p.rx, 0);
  assert.equal(p.localK, 0);
});

test("collapsePose: em k > 0, dy afunda e localK aumenta", () => {
  const p = collapsePose(3, 9, true, 0.8);
  assert.ok(p.dy < 0);
  assert.ok(p.localK > 0);
});

test("collapsePose: é determinístico para mesmos parâmetros", () => {
  const p1 = collapsePose(2, 9, false, 0.5, 42);
  const p2 = collapsePose(2, 9, false, 0.5, 42);
  assert.deepEqual(p1, p2);
});
