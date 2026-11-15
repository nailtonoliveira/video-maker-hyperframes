/* Kit Contos do Dinheiro · Texto dentro da arte: placa, calendário, folha de calendário, carimbo, pasta, comanda, quadro da semana, quadro que desenrola, selo, relógio. */
(function () {
  const K = window.KIT, { C, SW, T, rng } = K;

  // Placa de madeira com texto (centro no (0,0)). linhas: [[texto, tamanho, cor?], ...]
  function sign(id, linhas, o = {}) {
    const w = o.w || 360, lh = linhas.reduce((s, l) => s + l[1] * 1.15, 0), h = o.h || lh + 44;
    let y = -h / 2 + 22, txt = "";
    for (const [t, fs, cor, tid] of linhas) {
      y += fs * 1.0;
      txt += `<text ${tid ? `id="${tid}"` : ""} x="0" y="${y}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="${fs}" fill="${cor || C.ink}">${t}</text>`;
      y += fs * 0.15;
    }
    const post = o.post ? `<rect x="-10" y="${h / 2 - 4}" width="20" height="${o.post}" fill="${C.trunk}" stroke="${C.ink}" stroke-width="4"/>` : "";
    return `<g id="${id}"><g id="${id}-in">${post}
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="14" fill="${o.bg || C.paper}" stroke="${C.ink}" stroke-width="${SW}"/>
      ${o.nails === false ? "" : `<circle cx="${-w / 2 + 18}" cy="${-h / 2 + 18}" r="5" fill="${C.ink}"/><circle cx="${w / 2 - 18}" cy="${-h / 2 + 18}" r="5" fill="${C.ink}"/>`}
      ${txt}</g></g>`;
  }

  // Calendário de parede (centro no (0,0)): uma página por item de 'paginas' (ids <id>-p0..), só a 1ª visível.
  function calendar(id, paginas, o = {}) {
    const w = o.w || 200, h = o.h || 180;
    const pages = paginas.map(([mes, ano], i) => `<g id="${id}-p${i}" opacity="${i === 0 ? 1 : 0}">
        <text id="${id}-p${i}-mes" x="0" y="${-h / 2 + 92}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="54" fill="${C.ink}">${mes}</text>
        <text id="${id}-p${i}-ano" x="0" y="${-h / 2 + 148}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="44" fill="${C.red}">${ano}</text></g>`).join("");
    return `<g id="${id}">
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="12" fill="${C.paper}" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="36" rx="12" fill="${C.red}" stroke="${C.ink}" stroke-width="${SW}"/>
      <circle cx="${-w / 4}" cy="${-h / 2}" r="7" fill="${C.ink}"/><circle cx="${w / 4}" cy="${-h / 2}" r="7" fill="${C.ink}"/>
      ${pages}</g>`;
  }

  // Pasta do processo (amarela): centro no (0,0). linhas: [[texto, tamanho], ...] na etiqueta.
  function folder(id, linhas, o = {}) {
    const w = o.w || 400, h = o.h || 300;
    let y = -h / 2 + 96, txt = "";
    for (const [t, fs] of linhas) { txt += T(0, y, t, fs); y += fs * 1.25; }
    return `<g id="${id}"><g id="${id}-in">
      <path d="M${-w / 2} ${-h / 2 + 4} V ${-h / 2 - 22} Q ${-w / 2} ${-h / 2 - 34} ${-w / 2 + 14} ${-h / 2 - 34} H ${-w / 2 + 130} L ${-w / 2 + 150} ${-h / 2 + 4} Z" fill="#e9b949" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="14" fill="#f4c95d" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="${-w / 2 + 40}" y="${-h / 2 + 36}" width="${w - 80}" height="${linhas.length * 60 + 30}" rx="8" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>
      ${txt}</g></g>`;
  }

  // Carimbo (centro no (0,0)): moldura dupla e texto em vermelho; o.bg pinta o fundo (para ler sobre desenho).
  function stamp(id, texto, o = {}) {
    const fs = o.fs || 56, cor = o.cor || C.red, w = o.w || Math.round(texto.length * fs * 0.66 + 56), h = fs + 44;
    return `<g id="${id}"><g id="${id}-in">
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="12" fill="${o.bg || "none"}" stroke="${cor}" stroke-width="8"/>
      <rect x="${-w / 2 + 10}" y="${-h / 2 + 10}" width="${w - 20}" height="${h - 20}" rx="8" fill="none" stroke="${cor}" stroke-width="3"/>
      ${T(0, fs * 0.36, texto, fs, cor)}</g></g>`;
  }
  // Relógio de parede: centro no (0,0). Ponteiros <id>-h e <id>-m (rotation 0 = 12h; giram em torno do centro).
  function clock(id, r = 80) {
    let marcas = "";
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      marcas += `<path d="M${(Math.sin(a) * r * 0.78).toFixed(1)} ${(-Math.cos(a) * r * 0.78).toFixed(1)} L ${(Math.sin(a) * r * 0.9).toFixed(1)} ${(-Math.cos(a) * r * 0.9).toFixed(1)}" stroke="${C.ink}" stroke-width="${i % 3 === 0 ? 7 : 4}" stroke-linecap="round"/>`;
    }
    return `<g id="${id}"><circle r="${r}" fill="${C.paper}" stroke="${C.ink}" stroke-width="${SW + 2}"/>${marcas}
      <path id="${id}-h" d="M0 0 V ${-r * 0.48}" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/>
      <path id="${id}-m" d="M0 0 V ${-r * 0.72}" stroke="${C.red}" stroke-width="7" stroke-linecap="round"/>
      <circle r="9" fill="${C.ink}"/></g>`;
  }
  // Comanda de papel presa na parede: centro no (0,0). linhas: [[texto, tamanho, cor?], ...]
  function comanda(id, linhas, o = {}) {
    const w = o.w || 380, h = o.h || 420;
    let y = -h / 2 + 70, txt = "", zz = "";
    linhas.forEach(([t, fs, cor], i) => { txt += T(0, y, t, fs, cor); y += fs * 1.35 + (i === 0 ? 24 : 0); });
    for (let x = w / 2; x > -w / 2; x -= 30) zz += ` L ${x - 15} ${h / 2 + 14} L ${Math.max(x - 30, -w / 2)} ${h / 2}`;
    return `<g id="${id}"><g id="${id}-in">
      <path d="M${-w / 2} ${-h / 2} H ${w / 2} V ${h / 2}${zz} Z" fill="${C.paper}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M${-w / 2 + 30} ${-h / 2 + 92} H ${w / 2 - 30}" stroke="${C.ink}" stroke-width="3" stroke-dasharray="10 8"/>
      <circle cx="0" cy="${-h / 2 + 4}" r="14" fill="${C.red}" stroke="${C.ink}" stroke-width="4"/>
      ${txt}</g></g>`;
  }
  // Quadro "TODO DIA" com os dias úteis: centro no (0,0). Marcas <id>-k0..4 (escondidas).
  function weekBoard(id) {
    let rows = "";
    ["SEG", "TER", "QUA", "QUI", "SEX"].forEach((d, i) => {
      const y = -70 + i * 50;
      rows += T(-30, y + 12, d, 34) + `<rect x="34" y="${y - 18}" width="36" height="36" rx="6" fill="#fff" stroke="${C.ink}" stroke-width="4"/>
        <path id="${id}-k${i}" d="M40 ${y} L 50 ${y + 12} L 72 ${y - 16}" fill="none" stroke="${C.red}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>`;
    });
    return `<g id="${id}"><g id="${id}-in"><rect x="-120" y="-170" width="240" height="370" rx="14" fill="${C.paper}" stroke="${C.ink}" stroke-width="${SW}"/>
      ${T(0, -118, "TODO DIA", 38, C.red)}${rows}</g></g>`;
  }
  // Folha de calendário solta (centro no (0,0)).
  function calSheet(id) {
    return `<g id="${id}"><rect x="-90" y="-80" width="180" height="160" rx="10" fill="${C.paper}" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="-90" y="-80" width="180" height="32" rx="10" fill="${C.red}" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M-50 -10 H 50 M -50 20 H 30 M -50 50 H 40" stroke="#c9b48f" stroke-width="8" stroke-linecap="round"/></g>`;
  }

  // Quadro de papel que desenrola: rolo de cima centrado no (0,0); folha <id>-folha (escala Y do topo) até h; rolo de baixo <id>-rolo.
  function scrollBoard(id, w = 720, h = 840) {
    return `<g id="${id}">
      <g id="${id}-folha"><rect x="${-w / 2}" y="0" width="${w}" height="${h}" fill="#fffaf0" stroke="${C.ink}" stroke-width="${SW}"/></g>
      <g id="${id}-rolo"><rect x="${-w / 2 - 24}" y="${h - 14}" width="${w + 48}" height="30" rx="15" fill="#8a5a3b" stroke="${C.ink}" stroke-width="${SW}"/></g>
      <path d="M-60 -16 L 0 -70 L 60 -16" fill="none" stroke="${C.ink}" stroke-width="5"/><circle cx="0" cy="-74" r="9" fill="${C.ink}"/>
      <rect x="${-w / 2 - 30}" y="-16" width="${w + 60}" height="32" rx="16" fill="#8a5a3b" stroke="${C.ink}" stroke-width="${SW}"/></g>`;
  }
  // Selo redondo (fonte dos dados), sem emblema: centro no (0,0).
  function seal(id, linhas, r = 96) {
    let y = -((linhas.length - 1) * 34) / 2 + 11, txt = "";
    for (const l of linhas) { txt += T(0, y, l, 30, "#3d5a80"); y += 34; }
    return `<g id="${id}"><g id="${id}-in"><circle r="${r}" fill="${C.paper}" stroke="#3d5a80" stroke-width="8"/>
      <circle r="${r - 14}" fill="none" stroke="#3d5a80" stroke-width="3" stroke-dasharray="8 7"/>${txt}</g></g>`;
  }

  Object.assign(K, { sign, calendar, folder, stamp, clock, comanda, weekBoard, calSheet, scrollBoard, seal });
})();
