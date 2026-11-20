/* Kit Contos do Dinheiro · Casa e comida: mesa, bolo, bancada, pilha de comprovantes, xícara com rosto (e vapor), broa, pão de queijo, prato. */
(function () {
  const K = window.KIT, { C, SW, T, rng } = K;

  // Mesa simples (topo em y=0, centro x=0).
  function table(id, w = 620) {
    return `<g id="${id}"><rect x="${-w / 2}" y="0" width="${w}" height="34" rx="8" fill="#c08552" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M${-w / 2 + 40} 34 V 260 M ${w / 2 - 40} 34 V 260" stroke="${C.ink}" stroke-width="22" stroke-linecap="round"/>
      <path d="M${-w / 2 + 40} 34 V 260 M ${w / 2 - 40} 34 V 260" stroke="#c08552" stroke-width="12" stroke-linecap="round"/></g>`;
  }

  // Bolo de aniversário (base no (0,0)) com o número em velas.
  function cake(id, n) {
    return `<g id="${id}"><g id="${id}-in">
      <rect x="-130" y="-120" width="260" height="120" rx="14" fill="#f7d6d0" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M-130 -84 q 32 24 65 0 t 65 0 t 65 0 t 65 0" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
      <rect x="-60" y="-200" width="120" height="74" rx="10" fill="${C.paper}" stroke="${C.ink}" stroke-width="${SW}"/>
      <text x="0" y="-145" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="56" fill="${C.red}">${n}</text>
      <path d="M-30 -200 v -30 M 30 -200 v -30" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/>
      <path d="M-30 -246 q 8 10 0 16 q -8 -6 0 -16 M 30 -246 q 8 10 0 16 q -8 -6 0 -16" fill="${C.gold}" stroke="${C.ink}" stroke-width="3"/></g></g>`;
  }

  // Xícara com rosto (o réu): base do pires no (0,0), ~150 px até a borda. Bocas <id>-m-*, olhos <id>-olhos / <id>-feliz,
  // fios de vapor <id>-v0..2 (animados por steam()).
  function cup(id, o = {}) {
    const boca = o.boca || "smile";
    const mouths = {
      smile: `<path d="M-16 -62 Q 0 -46 16 -62" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`,
      open: `<path d="M-17 -66 Q 0 -30 17 -66 Z" fill="#7a2e2e" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`,
      sad: `<path d="M-15 -50 Q 0 -64 15 -50" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`,
      flat: `<path d="M-13 -56 H 13" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`,
    };
    const fio = (x, i) => `<g transform="translate(${x},-142)"><g id="${id}-v${i}" opacity="0">
      <path d="M0 0 C -14 -16 14 -32 0 -48 C -14 -64 10 -78 2 -90" fill="none" stroke="${C.ink}" stroke-width="15" stroke-linecap="round"/>
      <path d="M0 0 C -14 -16 14 -32 0 -48 C -14 -64 10 -78 2 -90" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g></g>`;
    return `<g id="${id}"><g id="${id}-body">
      ${fio(-36, 0)}${fio(0, 1)}${fio(36, 2)}
      <ellipse cx="0" cy="-12" rx="112" ry="20" fill="${C.louca}" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M66 -110 C 124 -116 124 -40 58 -46" fill="none" stroke="${C.ink}" stroke-width="24" stroke-linecap="round"/>
      <path d="M66 -110 C 124 -116 124 -40 58 -46" fill="none" stroke="${C.louca}" stroke-width="12" stroke-linecap="round"/>
      <path d="M-80 -134 L -66 -38 Q -62 -18 -40 -18 L 40 -18 Q 62 -18 66 -38 L 80 -134 Z" fill="${C.louca}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M-77 -114 L 77 -114" stroke="${C.red}" stroke-width="9"/>
      <ellipse cx="0" cy="-134" rx="80" ry="15" fill="${C.louca}" stroke="${C.ink}" stroke-width="${SW}"/>
      <ellipse cx="0" cy="-133" rx="64" ry="9" fill="${C.cafe}"/>
      <g id="${id}-olhos"><circle cx="-26" cy="-84" r="7.5" fill="${C.ink}"/><circle cx="26" cy="-84" r="7.5" fill="${C.ink}"/></g>
      <g id="${id}-feliz" opacity="0"><path d="M-36 -82 Q -26 -94 -16 -82 M 16 -82 Q 26 -94 36 -82" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/></g>
      <circle cx="-44" cy="-62" r="9" fill="#f08a7e" opacity=".55"/><circle cx="44" cy="-62" r="9" fill="#f08a7e" opacity=".55"/>
      ${Object.entries(mouths).map(([n, d]) => `<g id="${id}-m-${n}" opacity="${n === boca ? 1 : 0}">${d}</g>`).join("")}
    </g></g>`;
  }

  // Vapor: a pose de cada fio é função do TEMPO ABSOLUTO (período 106,75/71 s), então o último quadro emenda no quadro 0.
  const VAPOR_P = 106.75 / 71;
  function steamPose(ids, abs) {
    ids.forEach((id) => {
      for (let i = 0; i < 3; i++) {
        const el = document.getElementById(`${id}-v${i}`);
        if (!el) continue;
        let f = (abs / VAPOR_P + i / 3) % 1;
        if (f < 0) f += 1;
        el.setAttribute("transform", `translate(${(7 * Math.sin(f * Math.PI * 2)).toFixed(2)},${(-30 * f).toFixed(2)})`);
        el.setAttribute("opacity", Math.sin(f * Math.PI).toFixed(3));
      }
    });
  }
  function steam(tl, ids, T0, ini, fim) {
    const o = { v: ini };
    steamPose(ids, T0 + ini);
    tl.fromTo(o, { v: ini }, { v: fim, duration: fim - ini, ease: "none", immediateRender: false, onUpdate: () => steamPose(ids, T0 + o.v) }, ini);
  }

  // Fatia de broa de milho: base no (0,0), 150 × 80. Mordidas = círculos da máscara <id>-b0..2 (animar attr r 0 → 34).
  function broa(id) {
    let pts = "";
    [[-40, -36], [-8, -24], [26, -40], [48, -20], [-52, -18], [6, -50]].forEach(([x, y]) => (pts += `<circle cx="${x}" cy="${y}" r="4" fill="${C.broaDark}"/>`));
    return `<g id="${id}"><defs><mask id="${id}-mk" maskUnits="userSpaceOnUse" x="-100" y="-120" width="200" height="140">
        <rect x="-100" y="-120" width="200" height="140" fill="#fff"/>
        <circle id="${id}-b0" cx="76" cy="-62" r="0" fill="#000"/><circle id="${id}-b1" cx="34" cy="-86" r="0" fill="#000"/><circle id="${id}-b2" cx="-12" cy="-84" r="0" fill="#000"/></mask></defs>
      <g mask="url(#${id}-mk)"><g id="${id}-in">
        <rect x="-76" y="-78" width="152" height="74" rx="16" fill="${C.broa}" stroke="${C.ink}" stroke-width="${SW}"/>
        <path d="M-74 -56 Q -76 -78 -54 -78 H 54 Q 76 -78 74 -56 Q 40 -66 0 -60 Q -40 -66 -74 -56 Z" fill="${C.broaDark}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>
        ${pts}</g></g></g>`;
  }

  // Pão de queijo: base no (0,0), ~110 × 70.
  function paoQueijo(id) {
    return `<g id="${id}"><g id="${id}-in">
      <path d="M-52 0 C -66 -14 -60 -56 -28 -64 C -14 -78 18 -78 32 -64 C 62 -56 66 -14 52 0 Z" fill="#f2d27a" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <ellipse cx="-18" cy="-46" rx="12" ry="7" fill="#fbe7a9"/><ellipse cx="20" cy="-30" rx="9" ry="5" fill="#e0b54f"/><ellipse cx="-30" cy="-20" rx="7" ry="4" fill="#e0b54f"/></g></g>`;
  }

  // Prato raso: centro no (0,0).
  function plate(id, rx = 140) {
    return `<g id="${id}"><ellipse cx="0" cy="0" rx="${rx}" ry="${rx * 0.2}" fill="${C.louca}" stroke="${C.ink}" stroke-width="${SW}"/>
      <ellipse cx="0" cy="-3" rx="${rx * 0.62}" ry="${rx * 0.11}" fill="none" stroke="#d9cdb8" stroke-width="4"/></g>`;
  }

  // Bancada com gaveta: topo em y=0, centro x=0, até y=h. Frente da gaveta <id>-gaveta.
  function cabinet(id, w = 860, h = 250) {
    return `<g id="${id}"><rect x="${-w / 2}" y="0" width="${w}" height="${h}" fill="#e9c46a" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="${-w / 2 + 30}" y="130" width="${w / 2 - 50}" height="${h - 146}" rx="8" fill="none" stroke="${C.ink}" stroke-width="4"/>
      <rect x="20" y="130" width="${w / 2 - 50}" height="${h - 146}" rx="8" fill="none" stroke="${C.ink}" stroke-width="4"/>
      <rect x="-160" y="36" width="320" height="80" rx="6" fill="#7a3e2b"/>
      <g id="${id}-gaveta"><rect x="-160" y="36" width="320" height="80" rx="10" fill="#f4a261" stroke="${C.ink}" stroke-width="${SW}"/>
        <rect x="-36" y="68" width="72" height="16" rx="8" fill="${C.ink}"/></g>
      <rect x="${-w / 2 - 16}" y="-10" width="${w + 32}" height="30" rx="8" fill="#f4f1e8" stroke="${C.ink}" stroke-width="${SW}"/></g>`;
  }
  // Pilha de comprovantes: base no (0,0) (centro), ~w × h. Cresce escalando <id>-in a partir da base.
  function receiptPile(id, w = 760, h = 560) {
    const r = K.rng(303);
    let tiras = "";
    for (let i = 0; i < 70; i++) {
      const u = i / 70, yy = -h * (u * 0.92) - 20, half = (w / 2) * (1 - u) * 0.95 + 20;
      const x = Math.round((r() * 2 - 1) * half), rot = Math.round((r() * 2 - 1) * 35);
      tiras += `<g transform="translate(${x},${Math.round(yy)}) rotate(${rot})"><rect x="-44" y="-58" width="88" height="116" rx="4" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>
        <path d="M-28 -32 H 28 M -28 -12 H 20 M -28 8 H 28 M -28 28 H 10" stroke="#c9b48f" stroke-width="5" stroke-linecap="round"/></g>`;
    }
    return `<g id="${id}"><g id="${id}-in">${tiras}</g></g>`;
  }

  // Lâmpada pendente: fio do teto até (x, y); <id> balança em torno do teto.
  function lampada(id, x, y, cor) {
    return `<g transform="translate(${x},-20)"><g id="${id}"><path d="M0 0 V ${y + 20}" stroke="${C.ink}" stroke-width="5"/>
      <path d="M-62 ${y + 76} Q -56 ${y + 20} 0 ${y + 16} Q 56 ${y + 20} 62 ${y + 76} Z" fill="${cor}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <ellipse cx="0" cy="${y + 78}" rx="26" ry="11" fill="#fff2b8" stroke="${C.ink}" stroke-width="4"/></g></g>`;
  }

  Object.assign(K, { lampada, table, cake, cup, steamPose, steam, broa, paoQueijo, plate, cabinet, receiptPile });
})();
