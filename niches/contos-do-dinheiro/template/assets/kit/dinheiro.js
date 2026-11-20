/* Kit Contos do Dinheiro · Dinheiro: moeda, nota com rosto, lata, envelope, pilha de moedas, saco, cofrinho, cartão, maquininha, extrato, mão com cartão, bolso, ralo. */
(function () {
  const K = window.KIT, { C, SW, T, rng } = K;

  function coinShape(r) {
    return `<circle r="${r}" fill="${C.gold}" stroke="${C.ink}" stroke-width="4"/>
      <path d="M${r * 0.32} ${-r * 0.36} C ${r * 0.2} ${-r * 0.56} ${-r * 0.42} ${-r * 0.56} ${-r * 0.38} ${-r * 0.16} C ${-r * 0.34} ${r * 0.12} ${r * 0.38} ${-r * 0.02} ${r * 0.38} ${r * 0.24} C ${r * 0.38} ${r * 0.58} ${-r * 0.24} ${r * 0.56} ${-r * 0.36} ${r * 0.32} M 0 ${-r * 0.7} V ${r * 0.7}" fill="none" stroke="${C.goldDark}" stroke-width="${Math.max(2.5, r * 0.16)}" stroke-linecap="round"/>`;
  }
  function coin(id, r = 26) {
    return `<g id="${id}"><g>${coinShape(r)}</g></g>`;
  }

  // Nota de R$ 100 com rosto: centro no (0,0), 440 × 220. Encolher = escalar <id>-body (o "100" continua escrito).
  // Bocas <id>-m-smile|open|sad|flat, olhos <id>-olhos (abertos) e <id>-sono (fechados).
  function note(id, o = {}) {
    const w = 440, h = 220;
    const mouths = {
      smile: `<path d="M-20 34 Q 0 52 20 34" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`,
      open: `<path d="M-18 30 Q 0 66 18 30 Z" fill="#7a2e2e" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>`,
      sad: `<path d="M-18 46 Q 0 30 18 46" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`,
      flat: `<path d="M-16 40 H 16" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`,
    };
    const boca = o.boca || "smile";
    return `<g id="${id}"><g id="${id}-body">
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="18" fill="${o.cor || C.nota}" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="${-w / 2 + 18}" y="${-h / 2 + 18}" width="${w - 36}" height="${h - 36}" rx="10" fill="none" stroke="${C.notaDark}" stroke-width="4" stroke-dasharray="14 8"/>
      <circle cx="0" cy="10" r="74" fill="#d4ebf7" stroke="${C.notaDark}" stroke-width="4"/>
      <text x="${w / 2 - 34}" y="${-h / 2 + 88}" text-anchor="end" font-family="Nunito" font-weight="900" font-size="84" fill="${C.ink}" data-layout-ignore>100</text>
      <text x="${-w / 2 + 34}" y="${h / 2 - 34}" text-anchor="start" font-family="Nunito" font-weight="900" font-size="34" fill="${C.ink}" data-layout-ignore>REAIS</text>
      <g id="${id}-olhos"><circle cx="-24" cy="-2" r="9" fill="${C.ink}"/><circle cx="24" cy="-2" r="9" fill="${C.ink}"/></g>
      <g id="${id}-sono" opacity="0"><path d="M-34 0 Q -24 8 -14 0 M 14 0 Q 24 8 34 0" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/></g>
      <circle cx="-44" cy="24" r="10" fill="#f08a7e" opacity=".55"/><circle cx="44" cy="24" r="10" fill="#f08a7e" opacity=".55"/>
      ${Object.entries(mouths).map(([n, d]) => `<g id="${id}-m-${n}" opacity="${n === boca ? 1 : 0}">${d}</g>`).join("")}
    </g></g>`;
  }

  // Lata de biscoito: base no (0,0), 320 × 270. Tampa em <id>-lid (gira para abrir em torno da borda esquerda).
  // o.corte: frente translúcida (para ver a nota lá dentro, que vai num <g> desenhado depois da lata).
  function tin(id, o = {}) {
    const w = 320, h = 250, a = o.corte ? 0.22 : 1;
    return `<g id="${id}">
      <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="16" fill="${C.lata}" fill-opacity="${a}" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="${-w / 2}" y="${-h + 26}" width="${w}" height="20" fill="${C.gold}" fill-opacity="${a}" stroke="${C.ink}" stroke-width="4"/>
      <rect x="${-w / 2}" y="-46" width="${w}" height="20" fill="${C.gold}" fill-opacity="${a}" stroke="${C.ink}" stroke-width="4"/>
      ${o.corte ? "" : `<rect x="-118" y="${-h + 70}" width="236" height="110" rx="14" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>
      <text x="0" y="${-h + 138}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="38" fill="${C.lataDark}">BISCOITOS</text>`}
      <g transform="translate(${-w / 2 - 6},${-h})"><g id="${id}-lid">
        <rect x="0" y="-30" width="${w + 12}" height="34" rx="12" fill="${C.lataDark}" stroke="${C.ink}" stroke-width="${SW}"/>
        <rect x="${w / 2 - 34}" y="-46" width="80" height="18" rx="8" fill="${C.gold}" stroke="${C.ink}" stroke-width="4"/>
      </g></g></g>`;
  }

  // Envelope (centro no (0,0)) com uma ou mais linhas manuscritas.
  function envelope(id, linhas, o = {}) {
    const w = o.w || 420, h = o.h || 250;
    let y = -h / 2 + 96, txt = "";
    for (const [t, fs] of linhas) {
      txt += `<text x="0" y="${y}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="${fs}" fill="${C.ink}">${t}</text>`;
      y += fs * 1.2;
    }
    return `<g id="${id}"><g id="${id}-in">
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="10" fill="#fdf0d5" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M${-w / 2} ${-h / 2} L 0 ${-h / 2 + 70} L ${w / 2} ${-h / 2}" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>
      ${txt}</g></g>`;
  }

  // Maquininha de cartão (azul): base no (0,0). Tela verde "OK" em <id>-ok (escondida).
  function cardMachine(id) {
    let teclas = "";
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) teclas += `<rect x="${-42 + j * 30}" y="${-92 + i * 24}" width="22" height="16" rx="5" fill="#dbe7f6" stroke="${C.ink}" stroke-width="3"/>`;
    return `<g id="${id}"><rect x="-66" y="-210" width="132" height="210" rx="22" fill="#3d7dd8" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="-50" y="-190" width="100" height="80" rx="10" fill="#22303c" stroke="${C.ink}" stroke-width="4"/>
      <g id="${id}-ok" opacity="0"><rect x="-50" y="-190" width="100" height="80" rx="10" fill="#57cc6b" stroke="${C.ink}" stroke-width="4"/>
        ${T(0, -136, "OK", 44, "#fff")}</g>
      ${teclas}</g>`;
  }
  // Cartão: centro no (0,0), 170 × 108.
  function card(id) {
    return `<g id="${id}"><rect x="-85" y="-54" width="170" height="108" rx="12" fill="#577590" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="-62" y="-26" width="38" height="30" rx="6" fill="${C.gold}" stroke="${C.ink}" stroke-width="3"/>
      <path d="M-62 26 H 60" stroke="#dbe7f6" stroke-width="8" stroke-linecap="round"/></g>`;
  }
  // Cofrinho de porcelana: base no (0,0), ~240 × 160.
  function piggy(id) {
    return `<g id="${id}"><g id="${id}-in">
      <path d="M-60 -16 V 0 H -36 V -16 M 30 -16 V 0 H 54 V -16" fill="#f7d6d0" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <ellipse cx="0" cy="-74" rx="100" ry="66" fill="#f7d6d0" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M-50 -128 L -38 -158 L -18 -134" fill="#f28482" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <ellipse cx="96" cy="-74" rx="22" ry="28" fill="#f28482" stroke="${C.ink}" stroke-width="${SW}"/>
      <circle cx="92" cy="-82" r="4" fill="${C.ink}"/><circle cx="100" cy="-66" r="4" fill="${C.ink}"/>
      <circle cx="50" cy="-92" r="7" fill="${C.ink}"/>
      <rect x="-30" y="-136" width="56" height="12" rx="6" fill="${C.ink}"/>
      <path d="M-40 -60 Q -10 -36 20 -60" fill="none" stroke="#f28482" stroke-width="7" stroke-linecap="round"/></g></g>`;
  }
  // Ralo: centro no (0,0).
  function drain(id) {
    return `<g id="${id}"><ellipse rx="96" ry="28" fill="#9aa5b1" stroke="${C.ink}" stroke-width="${SW}"/>
      <ellipse rx="70" ry="18" fill="#3e4756" stroke="${C.ink}" stroke-width="4"/>
      <path d="M-48 -10 V 10 M -24 -16 V 16 M 0 -18 V 18 M 24 -16 V 16 M 48 -10 V 10" stroke="#9aa5b1" stroke-width="6"/></g>`;
  }
  // Pilha de moedas de lado: base no (0,0); moedas <id>-c0..(n-1) de baixo para cima.
  function coinStack(id, n, o = {}) {
    const w = o.w || 150, dy = o.dy || 30;
    let c = "";
    for (let i = 0; i < n; i++) {
      const y = -i * dy - 16, dx = i % 3 === 1 ? 6 : i % 3 === 2 ? -5 : 0;
      c += `<g id="${id}-c${i}"><rect x="${-w / 2 + dx}" y="${y - 16}" width="${w}" height="32" rx="16" fill="${C.gold}" stroke="${C.ink}" stroke-width="4"/>
        <path d="M${-w / 2 + dx + 18} ${y} H ${w / 2 + dx - 18}" stroke="${C.goldDark}" stroke-width="5" stroke-linecap="round"/></g>`;
    }
    return `<g id="${id}">${c}</g>`;
  }

  // Saco de dinheiro: centro no (0,0), ~150 × 190.
  function moneyBag(id) {
    return `<g id="${id}"><g id="${id}-in">
      <path d="M-30 -66 C -110 -40 -100 84 0 84 C 100 84 110 -40 30 -66 Z" fill="${C.gold}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M-30 -66 L -46 -96 L -14 -84 L 0 -102 L 14 -84 L 46 -96 L 30 -66 Z" fill="${C.gold}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M-34 -66 H 34" stroke="${C.goldDark}" stroke-width="10" stroke-linecap="round"/>
      <g transform="translate(0,16)">${coinShape(34)}</g></g></g>`;
  }
  // Mão (manga do Bruno) segurando o cartão, vinda da esquerda: centro do cartão no (0,0).
  function handCard(id, o = {}) {
    const shirt = o.shirt || K.ELENCO.bruno.shirt, skin = o.skin || K.ELENCO.bruno.skin;
    return `<g id="${id}"><g id="${id}-in">
      <rect x="-700" y="40" width="560" height="120" rx="50" fill="${shirt}" stroke="${C.ink}" stroke-width="${SW}"/>
      <g transform="rotate(-12)">${card(id + "-cartao")}</g>
      <path d="M-170 30 C -120 10 -60 20 -40 50 C -24 76 -40 110 -70 120 C -110 140 -160 150 -180 150 Z" fill="${skin}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M-60 48 C -30 30 -6 34 -4 52 C -2 66 -26 72 -50 70" fill="${skin}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M-120 70 Q -90 64 -70 80 M -126 100 Q -96 94 -76 108" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/></g></g>`;
  }
  // Bolso de calça em close: centro no (0,0), tecido w × h.
  function pocket(id, o = {}) {
    const w = o.w || 1200, h = o.h || 900, jeans = o.cor || K.ELENCO.bruno.pants, top = -h / 2;
    return `<g id="${id}"><rect x="${-w / 2}" y="${top}" width="${w}" height="${h}" fill="${jeans}" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="${-w / 2}" y="${top}" width="${w}" height="70" fill="#1d3b45" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M${-w / 2} ${top + 84} H ${w / 2}" stroke="#e9c46a" stroke-width="5" stroke-dasharray="16 12"/>
      <rect x="-200" y="${top - 6}" width="44" height="92" rx="6" fill="#1d3b45" stroke="${C.ink}" stroke-width="4"/>
      <path d="M-420 ${top + 70} Q -60 ${top + 90} 80 ${top + 330} L 420 ${top + 330}" fill="none" stroke="${C.ink}" stroke-width="${SW + 2}"/>
      <path d="M-400 ${top + 96} Q -80 ${top + 116} 60 ${top + 352} L 420 ${top + 356}" fill="none" stroke="#e9c46a" stroke-width="5" stroke-dasharray="16 12"/></g>`;
  }
  // Visor de extrato: centro no (0,0). linhas: [[esquerda, direita], ...]; linha do saldo com bloco-cursor <id>-cursor.
  function statement(id, linhas, o = {}) {
    const w = o.w || 820, h = o.h || 640;
    let y = -h / 2 + 170, rows = "";
    for (const [a, b] of linhas) {
      rows += T(-w / 2 + 70, y, a, 40, "#9be7a6", { anchor: "start" }) + T(w / 2 - 70, y, b, 40, "#9be7a6", { anchor: "end" });
      y += 66;
    }
    return `<g id="${id}"><g id="${id}-in">
      <rect x="${-w / 2 - 30}" y="${-h / 2 - 30}" width="${w + 60}" height="${h + 60}" rx="36" fill="#9aa5b1" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="20" fill="#22303c" stroke="${C.ink}" stroke-width="${SW}"/>
      ${T(0, -h / 2 + 76, o.titulo || "EXTRATO", 52, "#9be7a6")}
      <path d="M${-w / 2 + 60} ${-h / 2 + 104} H ${w / 2 - 60}" stroke="#9be7a6" stroke-width="4" stroke-dasharray="12 10"/>
      ${rows}
      <path d="M${-w / 2 + 60} ${h / 2 - 130} H ${w / 2 - 60}" stroke="#9be7a6" stroke-width="4"/>
      ${T(-w / 2 + 70, h / 2 - 56, "SALDO", 56, "#ffd166", { anchor: "start" })}
      <g id="${id}-cursor"><rect x="${w / 2 - 230}" y="${h / 2 - 102}" width="160" height="58" rx="6" fill="#ffd166"/></g></g></g>`;
  }


  Object.assign(K, { coinShape, coin, note, tin, envelope, cardMachine, card, piggy, drain, coinStack, moneyBag, handCard, pocket, statement });
})();
