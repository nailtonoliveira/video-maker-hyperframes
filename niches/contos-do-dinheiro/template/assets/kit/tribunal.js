/* Kit Contos do Dinheiro · Tribunal: fundo, banco dos réus, holofote, balança, martelo e base, mesa do juiz. */
(function () {
  const K = window.KIT, { C, SW, T, rng } = K;

  // Fundo do tribunal: parede creme, lambris de madeira (y lam..piso), piso de tábuas. o.x0/o.w: faixa do mundo (panorâmicas).
  function court(p, o = {}) {
    const x0 = o.x0 || 0, w = o.w || 1080, lam = o.lambri || 800, piso = o.piso || 1130;
    let paineis = "", tabuas = "";
    for (let x = x0 + 36; x + 150 <= x0 + w - 20; x += 180) paineis += `<rect x="${x}" y="${lam + 44}" width="150" height="${piso - lam - 88}" rx="10" fill="none" stroke="${C.woodDark}" stroke-width="4"/>`;
    for (let y = piso + 80; y < 1920; y += 92) tabuas += `<path d="M${x0 - 20} ${y} H ${x0 + w + 20}" stroke="#c49a6c" stroke-width="4"/>`;
    return `<g id="${p}-court">
      <rect x="${x0 - 20}" y="-20" width="${w + 40}" height="${lam + 20}" fill="${o.parede || "#f3dfbf"}"/>
      <rect x="${x0 - 20}" y="${lam}" width="${w + 40}" height="${piso - lam}" fill="#c98b57" stroke="${C.ink}" stroke-width="${SW}"/>
      ${paineis}
      <rect x="${x0 - 20}" y="${lam - 20}" width="${w + 40}" height="24" fill="${C.wood}" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="${x0 - 20}" y="${piso}" width="${w + 40}" height="${1940 - piso}" fill="#dcb98c" stroke="${C.ink}" stroke-width="${SW}"/>${tabuas}
    </g>`;
  }

  // Banco dos réus: topo em y=0, centro x=0, até y=h (piso). Plaqueta de metal <id>-placa.
  function dock(id, texto, o = {}) {
    const w = o.w || 620, h = o.h || 250, pw = o.pw || 520;
    return `<g id="${id}">
      <rect x="${-w / 2}" y="0" width="${w}" height="${h}" fill="${C.wood}" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M${-w / 2 + 34} 44 V ${h - 18} M ${w / 2 - 34} 44 V ${h - 18}" stroke="${C.woodDark}" stroke-width="6"/>
      <rect x="${-w / 2 - 18}" y="-8" width="${w + 36}" height="32" rx="8" fill="#8a5a3b" stroke="${C.ink}" stroke-width="${SW}"/>
      <g id="${id}-placa"><rect x="${-pw / 2}" y="${h / 2 - 30}" width="${pw}" height="76" rx="10" fill="${C.paper}" stroke="${C.ink}" stroke-width="${SW}"/>
        <circle cx="${-pw / 2 + 16}" cy="${h / 2 + 8}" r="5" fill="${C.ink}"/><circle cx="${pw / 2 - 16}" cy="${h / 2 + 8}" r="5" fill="${C.ink}"/>
        ${T(0, h / 2 + 22, texto, o.fs || 38)}</g>
    </g>`;
  }

  // Cone de luz chapado (holofote): do teto (xa..xb em y0) ao chão (xc..xd em y1), com a mancha elíptica no fim.
  function spotlight(id, o = {}) {
    const { xa = 450, xb = 630, xc = 210, xd = 870, y0 = -20, y1 = 880 } = o;
    return `<g id="${id}"><path d="M${xa} ${y0} L ${xb} ${y0} L ${xd} ${y1} L ${xc} ${y1} Z" fill="${C.luz}" opacity="${o.a ?? 0.5}"/>
      <ellipse cx="${(xc + xd) / 2}" cy="${y1}" rx="${(xd - xc) / 2}" ry="34" fill="${C.luz}" opacity="${o.a ?? 0.5}"/></g>`;
  }

  // Balança da justiça: pivô do braço no (0,0); coluna até y=360. Braço <id>-beam (gira), pratos <id>-panL/-panR
  // (sobem/descem L·sen θ junto com o braço). Conteúdo dos pratos: o.left / o.right (base no fundo do prato).
  function balance(id, o = {}) {
    const L = o.L || 150;
    const pan = (s, x, cont) => `<g transform="translate(${x},0)"><g id="${id}-pan${s}">
      <path d="M0 0 L -70 168 M 0 0 L 70 168" stroke="${C.ink}" stroke-width="4"/>
      <g transform="translate(0,166)">${cont || ""}</g>
      <path d="M-84 160 H 84 Q 74 202 0 202 Q -74 202 -84 160 Z" fill="${C.gold}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/></g></g>`;
    return `<g id="${id}">
      <rect x="-10" y="-30" width="20" height="360" fill="${C.goldDark}" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M-90 360 L -60 326 H 60 L 90 360 Z" fill="${C.goldDark}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      ${pan("L", -L, o.left)}${pan("R", L, o.right)}
      <g id="${id}-beam"><rect x="${-L - 14}" y="-10" width="${2 * L + 28}" height="20" rx="10" fill="${C.gold}" stroke="${C.ink}" stroke-width="${SW}"/></g>
      <circle cx="0" cy="0" r="16" fill="${C.gold}" stroke="${C.ink}" stroke-width="${SW}"/>
      <circle cx="0" cy="-46" r="14" fill="${C.gold}" stroke="${C.ink}" stroke-width="${SW}"/></g>`;
  }
  // Inclina a balança até θ graus (negativo = prato esquerdo desce), com balanço amortecido.
  function tilt(tl, id, th, t, L = 150) {
    const dy = (a) => L * Math.sin((a * Math.PI) / 180);
    [th * 1.35, th * 0.8, th * 1.08, th].forEach((a, i) => {
      const d = i === 0 ? 0.35 : 0.22, at = t + (i === 0 ? 0 : 0.35 + (i - 1) * 0.22);
      tl.to(`#${id}-beam`, { rotation: a, transformOrigin: "50% 50%", duration: d, ease: "sine.inOut" }, at);
      tl.to(`#${id}-panL`, { y: -dy(a), duration: d, ease: "sine.inOut" }, at);
      tl.to(`#${id}-panR`, { y: dy(a), duration: d, ease: "sine.inOut" }, at);
    });
  }

  // Martelo de juiz (adereço de braço: K.person({ propL: gavel(...) })): cabo ao longo do braço, cabeça atravessada.
  function gavel(id, dx = -14) {
    return `<g id="${id}"><rect x="${dx - 8}" y="92" width="16" height="104" rx="7" fill="#8a5a3b" stroke="${C.ink}" stroke-width="4"/>
      <rect x="${dx - 66}" y="186" width="132" height="56" rx="14" fill="${C.woodDark}" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="${dx - 44}" y="186" width="14" height="56" fill="${C.gold}" stroke="${C.ink}" stroke-width="3"/>
      <rect x="${dx + 30}" y="186" width="14" height="56" fill="${C.gold}" stroke="${C.ink}" stroke-width="3"/></g>`;
  }
  // Base do martelo: base no (0,0).
  function gavelBlock(id) {
    return `<g id="${id}"><rect x="-62" y="-26" width="124" height="26" rx="10" fill="${C.woodDark}" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="-48" y="-40" width="96" height="18" rx="8" fill="#8a5a3b" stroke="${C.ink}" stroke-width="4"/></g>`;
  }
  // Mesa do juiz (madeira escura): topo em y=0, centro x=0, até y=h.
  function judgeDesk(id, w = 600, h = 250) {
    const c = h / 2 + 10;
    return `<g id="${id}"><rect x="${-w / 2}" y="0" width="${w}" height="${h}" fill="${C.woodDark}" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="${-w / 2 - 20}" y="-10" width="${w + 40}" height="34" rx="8" fill="#8a5a3b" stroke="${C.ink}" stroke-width="${SW}"/>
      <circle cx="0" cy="${c}" r="58" fill="${C.gold}" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M0 ${c - 34} V ${c + 30} M -30 ${c - 24} H 30 M -16 ${c + 32} H 16" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>
      <path d="M-30 ${c - 24} L -42 ${c + 4} H -18 Z M 30 ${c - 24} L 18 ${c + 4} H 42 Z" fill="${C.goldDark}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/></g>`;
  }


  Object.assign(K, { court, dock, spotlight, balance, tilt, gavel, gavelBlock, judgeDesk });
})();
