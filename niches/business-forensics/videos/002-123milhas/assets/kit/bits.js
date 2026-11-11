// Kit 3D do tech-lore — bits de números (sem Three, testável em Node). MSB primeiro.
// inteiro de n bits em complemento de dois
export function intBits(x, n) {
  const bits = [];
  for (let i = n - 1; i >= 0; i--) bits.push(Number((BigInt(Math.trunc(x)) >> BigInt(i)) & 1n));
  return bits;
}
// float64 IEEE 754: sinal, 11 de expoente, 52 de mantissa
export function float64Bits(x) {
  const dv = new DataView(new ArrayBuffer(8));
  dv.setFloat64(0, x);
  const bits = [];
  for (let i = 0; i < 64; i++) bits.push((dv.getUint8(i >> 3) >> (7 - (i & 7))) & 1);
  return bits;
}
