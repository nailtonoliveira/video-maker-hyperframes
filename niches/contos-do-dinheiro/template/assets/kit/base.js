/* Kit Contos do Dinheiro · Base do kit: cores (C), traço (SW), texto (T), sorteio com semente (rng), elenco fixo (ELENCO) e ajudantes de animação.
   Carregue este arquivo antes dos outros (index.html). Cada peça devolve uma string SVG com ids prefixados;
   tudo é determinístico (sem Math.random). */
(function () {
  const C = {
    ink: "#2a2320",
    paper: "#fff6e3",
    gold: "#f2b134",
    goldDark: "#c98a12",
    leaf: "#4f9d5d",
    leafDark: "#3c7f49",
    leafLight: "#6cb874",
    trunk: "#8a5a3b",
    grass: "#7cb35b",
    grassDark: "#5e9a45",
    soil: "#8b5e3c",
    soilDark: "#6d452a",
    walk: "#e9dcc3",
    road: "#6b6b73",
    red: "#d64545",
    skyDay: ["#8fd0ea", "#e6f6f0"],
    skyDusk: ["#f39c6b", "#fde3b0"],
    skyNight: ["#24264f", "#4b4a86"],
  };
  const SW = 5; // espessura do traço

  // Pseudoaleatório com semente (determinístico).
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  function brl(n) {
    const s = String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return "R$ " + s;
  }
  // Pula para dentro com exagero (estado final escala 1).
  function pop(tl, sel, t, o = {}) {
    tl.fromTo(sel, { scale: 0, opacity: 0, transformOrigin: o.origin || "50% 50%" },
      { scale: 1, opacity: 1, duration: o.dur || 0.42, ease: o.ease || "back.out(2.2)" }, t);
  }
  function out(tl, sel, t, dur = 0.2) {
    tl.to(sel, { opacity: 0, duration: dur, ease: "power2.in" }, t);
  }
  // Troca a boca visível (sem interpolação: uma "pose").
  function mouth(tl, id, name, t) {
    ["smile", "open", "sad", "flat"].forEach((n) => tl.set(`#${id}-m-${n}`, { opacity: n === name ? 1 : 0 }, t));
  }
  // Contador de dinheiro num <text>: segue a linha do tempo (onUpdate é chamado em toda busca).
  function counter(tl, sel, a, b, t, dur, fmt = brl) {
    const o = { v: a };
    tl.fromTo(o, { v: a }, {
      v: b, duration: dur, ease: "none", immediateRender: false,
      onUpdate: () => { const el = document.querySelector(sel); if (el) el.textContent = fmt(o.v); },
    }, t);
  }
  // Mostra só a página i do calendário no tempo t.
  function page(tl, id, n, i, t) {
    for (let k = 0; k < n; k++) tl.set(`#${id}-p${k}`, { opacity: k === i ? 1 : 0 }, t);
  }
  // Respiração de personagem (vida no repouso): pequenas oscilações com fase própria, só até 'fim'.
  function idle(tl, id, ini, fim, fase = 0) {
    const n = Math.max(1, Math.floor((fim - ini) / 1.6));
    for (let i = 0; i < n; i++) {
      const t = ini + i * 1.6 + (fase % 0.8);
      if (t + 1.6 > fim) break;
      tl.fromTo(`#${id}-body`, { y: 0 }, { y: -4, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: 1 }, t);
    }
  }

  // Elenco fixo da série (mesmas cores em todo episódio em que aparecem).
  const ELENCO = {
    ana: { cabelo: "coque", shirt: "#2a9d8f", skin: "#c68642", hair: "#2b1b12", pants: "#3d405b" },
    bruno: { cabelo: "curto", shirt: "#e76f51", skin: "#f1c27d", hair: "#6b3e26", pants: "#264653" },
    filha: { crianca: true, cabelo: "rabo", vestido: true, shirt: "#ffd166", skin: "#c68642", hair: "#2b1b12", pants: "#c68642" },
    vizinho: { cabelo: "careca", shirt: "#9b5de5", skin: "#e0ac69", hair: "#9a9a9a", pants: "#4a4e69" },
    vizinha: { cabelo: "chapeu", shirt: "#577590", skin: "#8d5524", hair: "#d64545", pants: "#33415c" },
    // 002: seu Joaquim (avô, óculos, cardigã marrom) e a neta Lia (criança em 2010, adulta em 2025).
    joaquim: { cabelo: "careca", oculos: true, bigode: true, shirt: "#a0522d", skin: "#e0ac69", hair: "#d9d9d9", pants: "#5c5470" },
    liaCrianca: { crianca: true, cabelo: "rabo", vestido: true, shirt: "#f28482", skin: "#8d5524", hair: "#2b1b12", pants: "#8d5524" },
    lia: { cabelo: "rabo", shirt: "#f28482", skin: "#8d5524", hair: "#2b1b12", pants: "#3d405b" },
  };


  C.nota = "#8ec5e6"; C.notaDark = "#4f8fbf"; C.lata = "#e07a5f"; C.lataDark = "#b5523b";
  C.wood = "#a86f42"; C.woodDark = "#6b4226"; C.luz = "#ffd166"; C.cafe = "#6f4e37"; C.broa = "#f6c453"; C.broaDark = "#d99a2b";
  C.verde = "#4f9d5d"; C.louca = "#fffdf7"; C.sombra = "#8c7b99"; C.veu = "#3d3350";
  const T = (x, y, txt, fs, cor, o = {}) => `<text ${o.id ? `id="${o.id}"` : ""} x="${x}" y="${y}" text-anchor="${o.anchor || "middle"}" font-family="Nunito" font-weight="900" font-size="${fs}" fill="${cor || C.ink}">${txt}</text>`;

  // Gira um braço (ou qualquer <g> cuja origem local é o pivô) por atributo rotate(a): o pivô é sempre o ombro,
  // mesmo com adereço na mão. Não misture com 'rotation' do GSAP no mesmo elemento. pose() define o estado inicial.
  function turn(tl, sel, a0, a1, t, dur, ease = "power2.inOut") {
    const o = { a: a0 };
    tl.fromTo(o, { a: a0 }, { a: a1, duration: dur, ease, immediateRender: false,
      onUpdate: () => { const e = document.querySelector(sel); if (e) e.setAttribute("transform", `rotate(${o.a.toFixed(2)})`); } }, t);
  }
  function pose(tl, sel, a) {
    gsap.set(sel, { attr: { transform: `rotate(${a})` } });
    tl.set(sel, { attr: { transform: `rotate(${a})` } }, 0);
  }
  // Carimbada: entra grande e bate (estado final escala 1).
  function slam(tl, sel, t) {
    tl.fromTo(sel, { scale: 2.3, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.18, ease: "power4.in" }, t);
  }


  // ---------- Palcos (câmera perto) e ambiente ----------
  // Enquadramento padrão de todo palco: pés dos atores em CHAO, adulto na ESCALA (~480 px de altura, rosto em y ~1000).
  // LIVRE: faixa calma de parede/céu para placas, calendários e números. LEGENDA: faixa das legendas (nada de rosto ou texto ali).
  // Abaixo de CHAO o palco já tem chão e primeiro plano (decoração: no celular, a interface da plataforma cobre o rodapé).
  const PALCO = { CHAO: 1400, ESCALA: 1.45, LIVRE: { x0: 160, x1: 920, y0: 170, y1: 740 }, LEGENDA: { y0: 1150, y1: 1300 } };
  const palco = {}; // palco.<nome>(prefixo, opções) → { fundo, moveis, frente, chao, escala, vagas, ambiente }; um arquivo palco-<nome>.js por palco

  // Duração da voz (para o ambiente fechar o loop): K.LOOP, ou o data-duration das legendas no index.html.
  function duracaoVoz() {
    if (window.KIT.LOOP) return window.KIT.LOOP;
    const c = typeof document !== "undefined" && document.getElementById("captions");
    return (c && parseFloat(c.getAttribute("data-duration"))) || 0;
  }
  // Período ajustado para caber um número inteiro de vezes na voz: o último quadro repete o quadro 0.
  function periodo(p) {
    const L = duracaoVoz();
    return L ? L / Math.max(1, Math.round(L / p)) : p;
  }
  // Ciclo de ambiente: fn(tempoAbsoluto) ajusta atributos. É função do TEMPO ABSOLUTO da narração (emenda entre cenas),
  // e roda a cada busca de quadro (seguro para o render). ini/fim: tempo da cena (t(abs)); T0: início absoluto da cena.
  function ciclo(tl, T0, ini, fim, fn) {
    const o = { v: ini };
    fn(T0 + ini);
    tl.fromTo(o, { v: ini }, { v: fim, duration: Math.max(0.01, fim - ini), ease: "none", immediateRender: false, onUpdate: () => fn(T0 + o.v) }, ini);
  }
  // Ajudantes para as funções de ambiente dos palcos: mexem no transform de um <g id> pela fase (0..1) de um período.
  const onda = (abs, P, fase = 0) => Math.sin(2 * Math.PI * (abs / periodo(P) + fase));
  const fase01 = (abs, P, fase = 0) => { const f = (abs / periodo(P) + fase) % 1; return f < 0 ? f + 1 : f; };
  function tf(id, v) {
    const e = document.getElementById(id);
    if (e) e.setAttribute("transform", v);
  }
  function op(id, v) {
    const e = document.getElementById(id);
    if (e) e.setAttribute("opacity", v);
  }

  // Piso em perspectiva de y0 (encontro com a parede) até o fim da tela; ponto de fuga em (540, y0 - fuga).
  // o.tipo: "xadrez" (cores[0]/cores[1]) | "tabuas" (madeira) | "pedras" (calçada). Desenhado por código, sem textura.
  function piso(id, y0, o = {}) {
    const fuga = o.fuga || 900, vy = y0 - fuga, w0 = o.largura || 150, cores = o.cores || ["#f3e6cc", "#dcc7a2"];
    const X = (xb, y) => +(540 + ((xb - 540) * (y - vy)) / fuga).toFixed(1);
    const ys = [];
    for (let y = y0, h = o.linha || 44; y < 1940; y += h, h *= o.cresce || 1.3) ys.push(Math.round(y));
    ys.push(1940);
    const xs = [];
    for (let i = -6; i <= 6; i++) xs.push(540 + (i - 0.5) * w0);
    let tiles = "";
    for (let j = 0; j < ys.length - 1; j++)
      for (let i = 0; i < xs.length - 1; i++) {
        const [a, b, ya, yb] = [xs[i], xs[i + 1], ys[j], ys[j + 1]];
        let cor;
        if (o.tipo === "tabuas") cor = cores[(i * 7 + (j % 3 === 0 ? 1 : 0)) % cores.length];
        else if (o.tipo === "pedras") cor = cores[(i * 3 + j * 5) % cores.length];
        else cor = cores[(i + j) % 2];
        tiles += `<path d="M${X(a, ya)} ${ya} L ${X(b, ya)} ${ya} L ${X(b, yb)} ${yb} L ${X(a, yb)} ${yb} Z" fill="${cor}" stroke="${o.junta || "none"}" stroke-width="3"/>`;
      }
    return `<g id="${id}"><rect x="-20" y="${y0}" width="1120" height="${1940 - y0}" fill="${cores[0]}"/>${tiles}
      <path d="M-20 ${y0} H 1100" stroke="${C.ink}" stroke-width="${SW}"/></g>`;
  }
  // Fios de vapor/fumaça (ids <id>-f0..n-1), animados por vapor(): base no (0,0).
  function fios(id, n = 3, o = {}) {
    const dx = o.dx || 26, cor = o.cor || "#fff";
    let s = "";
    for (let i = 0; i < n; i++) s += `<g transform="translate(${(i - (n - 1) / 2) * dx},0)"><g id="${id}-f${i}" opacity="0">
      <path d="M0 0 C -10 -12 10 -24 0 -36 C -10 -48 8 -58 2 -68" fill="none" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/>
      <path d="M0 0 C -10 -12 10 -24 0 -36 C -10 -48 8 -58 2 -68" fill="none" stroke="${cor}" stroke-width="5" stroke-linecap="round"/></g></g>`;
    return `<g id="${id}">${s}</g>`;
  }
  function vapor(id, abs, n = 3, P = 1.6) {
    for (let i = 0; i < n; i++) {
      const f = fase01(abs, P, i / n);
      tf(`${id}-f${i}`, `translate(${(5 * Math.sin(f * 6.283)).toFixed(1)},${(-26 * f).toFixed(1)})`);
      op(`${id}-f${i}`, Math.sin(f * Math.PI).toFixed(3));
    }
  }


  window.KIT = { C, SW, T, rng, ELENCO, piso, fios, vapor, PALCO, palco, periodo, ciclo, onda, fase01, tf, op, brl, pop, out, mouth, counter, page, idle, turn, pose, slam };
})();
