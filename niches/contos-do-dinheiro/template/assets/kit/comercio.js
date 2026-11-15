/* Kit Contos do Dinheiro · Comércio: produto de mercado, vitrine com balcão, mão do balconista. */
(function () {
  const K = window.KIT, { C, SW, T, rng } = K;

  // Produto de mercado (base no (0,0)): caixa ou garrafa com rótulo.
  function product(id, nome, cor, o = {}) {
    const w = o.w || 150, h = o.h || 190;
    const corpo = o.garrafa
      ? `<path d="M${-w / 2 + 20} 0 V ${-h + 60} Q ${-w / 2 + 20} ${-h + 20} -18 ${-h + 10} V ${-h - 20} H 18 V ${-h + 10} Q ${w / 2 - 20} ${-h + 20} ${w / 2 - 20} ${-h + 60} V 0 Z" fill="${cor}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>`
      : `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="10" fill="${cor}" stroke="${C.ink}" stroke-width="${SW}"/>`;
    const fs = Math.min(34, Math.floor((w - 24) / (nome.length * 0.62)));
    return `<g id="${id}"><g id="${id}-in">${corpo}
      <rect x="${-w / 2 + 10}" y="${-h / 2 - 28}" width="${w - 20}" height="56" rx="8" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>
      <text x="0" y="${-h / 2 + 11}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="${fs}" fill="${C.ink}">${nome}</text></g></g>`;
  }

  // Vitrine com balcão: topo do balcão em y=0, centro x=0, até y=h. Vidro <id>-vidro (acende: fill).
  function showcase(id, w = 760, h = 190) {
    let itens = "";
    for (let i = 0; i < 5; i++) {
      const x = -w / 2 + 80 + i * ((w - 160) / 4);
      itens += i % 2 === 0
        ? `<g transform="translate(${x},${h - 40}) scale(0.55)">${K.broa(`${id}-it${i}`)}</g>`
        : `<g transform="translate(${x},${h - 40}) scale(0.7)">${K.paoQueijo(`${id}-it${i}`)}</g>`;
    }
    return `<g id="${id}">
      <rect id="${id}-vidro" x="${-w / 2}" y="20" width="${w}" height="${h - 20}" fill="#cfe8ef" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="${-w / 2}" y="${h - 36}" width="${w}" height="16" fill="#e8d5b5" stroke="${C.ink}" stroke-width="4"/>
      ${itens}
      <path d="M${-w / 2 + 30} 50 L ${-w / 2 + 90} 110 M ${-w / 2 + 60} 44 L ${-w / 2 + 140} 124" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".8"/>
      <rect x="${-w / 2 - 14}" y="-6" width="${w + 28}" height="30" rx="8" fill="#8a5a3b" stroke="${C.ink}" stroke-width="${SW}"/>
    </g>`;
  }
  // Mão do balconista (manga branca) entrando pela direita: ponta da mão no (0,0).
  function clerkHand(id) {
    return `<g id="${id}"><rect x="40" y="-34" width="700" height="68" rx="30" fill="#f4f1e8" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M48 -30 C 0 -40 -36 -20 -30 6 C -26 28 10 34 48 28 Z" fill="#e0ac69" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/></g>`;
  }


  Object.assign(K, { product, showcase, clerkHand });
})();
