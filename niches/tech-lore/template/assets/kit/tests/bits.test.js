// Testes dos bits (sem Three): node --test assets/kit/tests/*.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { intBits, float64Bits } from "../bits.js";

test("intBits: 32767 em 16 bits é 0 seguido de quinze 1", () => {
  assert.deepEqual(intBits(32767, 16), [0, ...Array(15).fill(1)]);
});

test("intBits: -1 em 16 bits é dezesseis 1 (complemento de dois)", () => {
  assert.deepEqual(intBits(-1, 16), Array(16).fill(1));
});

test("float64Bits: 32768.5 tem 64 bits e começa por sinal 0 e expoente 0x40E", () => {
  const b = float64Bits(32768.5);
  assert.equal(b.length, 64);
  assert.deepEqual(b.slice(0, 12), [0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0]);
});

test("intBits: 32768 em 16 bits estoura para 1 seguido de quinze 0 (o Ariane)", () => {
  assert.deepEqual(intBits(32768, 16), [1, ...Array(15).fill(0)]);
});

test("intBits: -32768 em 16 bits é 1 seguido de quinze 0", () => {
  assert.deepEqual(intBits(-32768, 16), [1, ...Array(15).fill(0)]);
});

test("intBits: 2**40 + 5 em 48 bits tem 48 bits e termina em 0101", () => {
  const b = intBits(2 ** 40 + 5, 48);
  assert.equal(b.length, 48);
  assert.deepEqual(b.slice(-4), [0, 1, 0, 1]);
  assert.equal(b[47 - 40], 1);
});
