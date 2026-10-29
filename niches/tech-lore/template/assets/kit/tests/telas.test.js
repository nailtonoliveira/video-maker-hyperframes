// Testes dos valores das telas e LEDs dos exteriores (sem Three): node --test assets/kit/tests/*.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { fmtNum, curvaPregao, periodoLed } from "../telas.js";

test("fmtNum: milhar com ponto e decimal com vírgula", () => {
  assert.equal(fmtNum(4231.5), "4.231,50");
  assert.equal(fmtNum(1234567.891), "1.234.567,89");
  assert.equal(fmtNum(0), "0,00");
});

test("fmtNum: negativo e sem casas", () => {
  assert.equal(fmtNum(-3.2), "-3,20");
  assert.equal(fmtNum(98765, 0), "98.765");
  assert.equal(fmtNum(-0.001), "0,00");
});

test("curvaPregao: n pontos entre 0 e 1, subindo sem queda", () => {
  const c = curvaPregao(40, 0);
  assert.equal(c.length, 40);
  assert.ok(c.every((y) => y >= 0 && y <= 1));
  assert.ok(c[39] > c[0] + 0.2);
});

test("curvaPregao: com queda 1 a ponta despenca abaixo do começo", () => {
  const c = curvaPregao(40, 1);
  assert.ok(c.every((y) => y >= 0 && y <= 1));
  assert.ok(c[39] < c[0]);
  assert.ok(c[39] < 0.15);
});

test("curvaPregao: a queda só mexe na parte final da curva", () => {
  const a = curvaPregao(40, 0);
  const b = curvaPregao(40, 1);
  assert.deepEqual(b.slice(0, 20), a.slice(0, 20));
});

test("curvaPregao: determinística (mesmos argumentos, mesma curva)", () => {
  assert.deepEqual(curvaPregao(30, 0.4, 9), curvaPregao(30, 0.4, 9));
});

test("periodoLed: divide o período base por 1, 2 ou 3 (continua dividindo o loop)", () => {
  const loop = 16;
  const p = loop / 32;
  for (const h of [0, 0.2, 0.34, 0.5, 0.7, 0.99]) {
    const q = periodoLed(p, h);
    const voltas = loop / q;
    assert.ok(Math.abs(voltas - Math.round(voltas)) < 1e-9, `h=${h}`);
    assert.ok(q <= p && q >= p / 3);
  }
});
