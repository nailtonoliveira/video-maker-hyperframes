// Motor 3D — utilidades puras (sem THREE): acaso determinístico, easing, pulsos.
// Regra de ouro: tudo é função pura do tempo t (o HyperFrames busca quadros fora de ordem).
export function rng(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const hash = (i, k) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const E = {
  lin: (k) => k,
  expoOut: (k) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k)),
  p2in: (k) => k * k,
  p2out: (k) => 1 - (1 - k) * (1 - k),
  p2io: (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2),
  p3io: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  p3out: (k) => 1 - Math.pow(1 - k, 3),
  backOut: (k) => 1 + 2.70158 * Math.pow(k - 1, 3) + 1.70158 * Math.pow(k - 1, 2),
};
export const shake = (t, t0, amp, dur, f = 70) => (t < t0 || t > t0 + dur ? 0 : amp * (1 - (t - t0) / dur) * Math.sin((t - t0) * f));
// pisca com período que divide a duração do vídeo: o último quadro casa com o primeiro
export const blink = (t, period, phase = 0, duty = 0.5) => ((((t + phase) / period) % 1) + 1) % 1 < duty;
// período mais próximo de `want` que divide o loop em um número inteiro de voltas
export const loopPeriod = (loop, want) => loop / Math.max(1, Math.round(loop / want));
// soma de pulsos que decaem linearmente: amp·max(0, 1 − (t − ti)/dur) para t ≥ ti
export const pulses = (t, times, amp, dur) => times.reduce((s, ti) => (t >= ti ? s + amp * Math.max(0, 1 - (t - ti) / dur) : s), 0);
// queda gaussiana em torno de t0: vale 1 longe, 1 − depth no centro
export const dip = (t, t0, width, depth) => 1 - depth * Math.exp(-(((t - t0) / width) ** 2));
