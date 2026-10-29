// Kit 3D do tech-lore — valores das telas e dos LEDs dos exteriores (sem Three, testável em Node).
const h1 = (i, k) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// número no formato brasileiro: 4231.5 → "4.231,50" (sem Intl: o mesmo texto em qualquer máquina)
export function fmtNum(valor, casas = 2) {
  const neg = valor < 0;
  const [int, dec] = Math.abs(valor).toFixed(casas).split(".");
  const grupos = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const txt = dec ? `${grupos},${dec}` : grupos;
  return neg && /[1-9]/.test(txt) ? `-${txt}` : txt;
}

// curva do telão do pregão: n pontos em 0..1. Sobe com ruído; com a queda k (0→1) o trecho depois de 55 % despenca.
export function curvaPregao(n, k, seed = 7) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const x = i / (n - 1);
    let y = 0.15 + 0.75 * x + 0.08 * (h1(i, seed) - 0.5) + 0.04 * Math.sin(x * 9 + seed);
    const d = Math.max(0, (x - 0.55) / 0.45);
    y -= k * 0.95 * Math.pow(d, 1.2);
    pts.push(Math.min(0.98, Math.max(0.02, y)));
  }
  return pts;
}

// período de um LED: o período base dividido por 1, 2 ou 3 (h em 0..1); continua dividindo o loop
export const periodoLed = (period, h) => period / (1 + Math.min(2, Math.floor(h * 3)));
