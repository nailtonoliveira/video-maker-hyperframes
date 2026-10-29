import test from "node:test";
import assert from "node:assert/strict";
import { rng, seg, E, loopPeriod, blink, pulses, dip } from "../util.js";

test("rng é determinístico e fica em [0,1)", () => {
  const a = rng(7);
  const b = rng(7);
  for (let i = 0; i < 5; i++) {
    const x = a();
    assert.equal(x, b());
    assert.ok(x >= 0 && x < 1);
  }
});
test("seg", () => {
  assert.equal(seg(5, 0, 10), 0.5);
  assert.equal(seg(-1, 0, 10), 0);
  assert.equal(seg(11, 0, 10), 1);
});
test("E", () => {
  assert.equal(E.p2io(0), 0);
  assert.equal(E.p2io(1), 1);
  assert.ok(Math.abs(E.backOut(1) - 1) < 1e-9);
});
test("loopPeriod divide o loop", () => {
  const p = loopPeriod(48.28, 0.5);
  assert.ok(Math.abs(48.28 / p - Math.round(48.28 / p)) < 1e-9);
});
test("blink fecha o loop", () => {
  const p = loopPeriod(48.28, 0.7);
  assert.equal(blink(0, p, 0.3), blink(48.28, p, 0.3));
});
test("pulses", () => {
  assert.equal(pulses(2.25, [2.25, 39.09], 0.55, 0.3), 0.55);
  assert.ok(Math.abs(pulses(2.4, [2.25], 0.55, 0.3) - 0.275) < 1e-9);
  assert.equal(pulses(1, [2.25], 0.55, 0.3), 0);
});
test("dip", () => {
  assert.ok(Math.abs(dip(21.5, 21.5, 0.07, 0.92) - 0.08) < 1e-9);
  assert.ok(Math.abs(dip(30, 21.5, 0.07, 0.92) - 1) < 1e-9);
});
