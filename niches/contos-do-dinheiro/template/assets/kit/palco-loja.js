/* Kit Contos do Dinheiro · Palco "loja": mercado (prateleiras de produtos e caixa com visor) ou padaria (pães e vitrine).
   Estantes cheias nas laterais, balcão ao fundo, lâmpadas penduradas, um freguês passando ao fundo e, no primeiro
   plano, carrinho e caixotes de frutas (mercado) ou cestos de pão (padaria). */
(function () {
  const K = window.KIT, { C, SW, T, rng } = K;

  // Estante com produtos (deterministas pela semente): canto superior esquerdo em (x, y).
  function estante(id, x, y, w, h, o = {}) {
    const r = rng(o.semente || 5), nPrat = o.prateleiras || 4, ph = h / nPrat;
    const cores = o.padaria ? ["#f2c57c", "#e9b949", "#d99a2b", "#f6c453"] : ["#e76f51", "#2a9d8f", "#e9c46a", "#f4a261", "#8ecae6", "#b5838d", "#ffd166", "#84a59d"];
    let itens = "";
    for (let k = 0; k < nPrat; k++) {
      const base = y + (k + 1) * ph - 14;
      let cx = x + 14;
      while (cx < x + w - 40) {
        const larg = 34 + Math.round(r() * 30), alt = Math.min(ph - 40, 60 + Math.round(r() * 60)), cor = cores[Math.floor(r() * cores.length)];
        if (cx + larg > x + w - 14) break;
        if (o.padaria) {
          itens += `<ellipse cx="${cx + larg / 2}" cy="${base - 22}" rx="${larg / 2 + 6}" ry="24" fill="${cor}" stroke="${C.ink}" stroke-width="4"/>
            <path d="M${cx + larg / 2 - 12} ${base - 34} l 8 14 M ${cx + larg / 2 + 4} ${base - 38} l 8 14" stroke="#b07a1c" stroke-width="4" stroke-linecap="round"/>`;
          cx += larg + 16;
        } else if (r() < 0.3) {
          itens += `<path d="M${cx + 6} ${base} V ${base - alt + 26} Q ${cx + 6} ${base - alt + 10} ${cx + larg / 2 - 7} ${base - alt + 4} V ${base - alt - 8} H ${cx + larg / 2 + 7} V ${base - alt + 4} Q ${cx + larg - 6} ${base - alt + 10} ${cx + larg - 6} ${base - alt + 26} V ${base} Z" fill="${cor}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>
            <rect x="${cx + 8}" y="${base - alt * 0.55}" width="${larg - 16}" height="${alt * 0.22}" fill="#fff6e3"/>`;
          cx += larg + 8;
        } else {
          itens += `<rect x="${cx}" y="${base - alt}" width="${larg}" height="${alt}" rx="5" fill="${cor}" stroke="${C.ink}" stroke-width="4"/>
            <rect x="${cx + 6}" y="${base - alt + alt * 0.3}" width="${larg - 12}" height="${alt * 0.26}" rx="3" fill="#fff6e3"/>`;
          cx += larg + 8;
        }
      }
      itens += `<rect x="${x - 6}" y="${base}" width="${w + 12}" height="16" rx="4" fill="${o.madeira || "#c08552"}" stroke="${C.ink}" stroke-width="4"/>`;
    }
    return `<g id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.fundo || "#8c5a3c"}" stroke="${C.ink}" stroke-width="${SW}"/>${itens}</g>`;
  }

  // o: { tipo: "mercado" | "padaria", nome: "MERCADO" (placa no alto; omita para não ter placa), visor: "R$ 0" }
  // ids: <p>-visor-txt (texto do visor do caixa, mercado), <p>-lamp0/1, <p>-fregues, <p>-placa-nome
  K.palco.loja = function (p, o = {}) {
    const pad = o.tipo === "padaria";
    const parede = pad ? "#fde3c0" : "#e6f2ea", BASE = 1240;
    let rodape = "";
    for (let x = -20; x < 1100; x += 64) rodape += `<rect x="${x}" y="${BASE - 150}" width="64" height="150" fill="${(x / 64) % 2 ? "#f6efe2" : "#ffffff"}" opacity=".8"/>`;
    const fundo = `<rect x="-20" y="-20" width="1120" height="${BASE + 20}" fill="${parede}"/>
      <rect x="-20" y="${BASE - 150}" width="1120" height="150" fill="${pad ? "#f4d3a6" : "#cfe3d6"}"/>
      ${estante(p + "-est-esq", -30, 300, 300, BASE - 300, { semente: 11, padaria: pad, prateleiras: 5 })}
      ${estante(p + "-est-dir", 810, 300, 300, BASE - 300, { semente: 23, padaria: pad, prateleiras: 5 })}
      ${o.nome ? `<g transform="translate(540,215)">${K.sign(p + "-placa-nome", [[o.nome, 64, C.red]], { w: 470 })}</g>` : ""}
      ${K.lampada(p + "-lamp0", 150, 120, pad ? "#e07a5f" : "#2a9d8f")}${K.lampada(p + "-lamp1", 930, 120, pad ? "#e07a5f" : "#2a9d8f")}`;

    // Freguês passando ao fundo (atrás do balcão) e o balcão: caixa com visor (mercado) ou vitrine de pães (padaria).
    const fregues = `<g id="${p}-fregues"><g transform="translate(0,1250) scale(1.05)">${K.figurante(p + "-fregues-p", 2)}</g></g>`;
    const balcao = pad
      ? `<g transform="translate(540,1000)">${K.showcase(p + "-vitrine", 560, 240)}</g>`
      : `<g id="${p}-caixa">
          <rect x="280" y="1010" width="520" height="${BASE - 1010}" fill="#9aa5b1" stroke="${C.ink}" stroke-width="${SW}"/>
          <rect x="270" y="990" width="540" height="34" rx="8" fill="#5c677d" stroke="${C.ink}" stroke-width="${SW}"/>
          <path d="M700 990 V 880" stroke="${C.ink}" stroke-width="18"/><path d="M700 990 V 880" stroke="#5c677d" stroke-width="9"/>
          <rect x="590" y="790" width="220" height="100" rx="14" fill="#22303c" stroke="${C.ink}" stroke-width="${SW}"/>
          ${T(700, 860, o.visor || "R$ 0", 52, "#9be7a6", { id: p + "-visor-txt" })}
          <rect x="340" y="950" width="150" height="44" rx="8" fill="#3e4756" stroke="${C.ink}" stroke-width="4"/>
          <rect x="360" y="1060" width="200" height="120" rx="10" fill="#cfd6de" stroke="${C.ink}" stroke-width="4"/></g>`;

    const chao = K.piso(p + "-piso", BASE, pad
      ? { cores: ["#e9a77c", "#d98e62"], largura: 130, linha: 40, junta: "#c27a52" }
      : { cores: ["#f4f4ef", "#d7dde2"], largura: 150, linha: 42 });

    // Primeiro plano.
    const frutas = (x, cor, semente) => {
      const r = rng(semente);
      let s = "";
      for (let i = 0; i < 9; i++) s += `<circle cx="${x - 120 + (i % 5) * 58 + (i > 4 ? 28 : 0) + Math.round(r() * 8)}" cy="${i > 4 ? 1612 : 1640}" r="30" fill="${cor}" stroke="${C.ink}" stroke-width="4"/>`;
      return s;
    };
    const caixote = (x, cor, semente) => `<g>${frutas(x, cor, semente)}
      <rect x="${x - 160}" y="1650" width="320" height="300" rx="8" fill="#c08552" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M${x - 160} 1730 H ${x + 160} M ${x - 160} 1810 H ${x + 160}" stroke="${C.woodDark || "#6b4226"}" stroke-width="6"/></g>`;
    const frente = pad
      ? `<g transform="translate(180,1700)"><ellipse cx="0" cy="0" rx="190" ry="44" fill="#c98a12" stroke="${C.ink}" stroke-width="${SW}"/>
          ${[-110, -30, 50, 120].map((x, i) => `<ellipse cx="${x}" cy="-30" rx="62" ry="36" fill="${i % 2 ? "#f6c453" : "#f2c57c"}" stroke="${C.ink}" stroke-width="4" transform="rotate(${i * 9 - 12} ${x} -30)"/>`).join("")}
          <path d="M-190 0 L -170 260 H 170 L 190 0" fill="#c98a12" stroke="${C.ink}" stroke-width="${SW}"/></g>
        <g transform="translate(920,1660)"><path d="M-140 280 C -170 120 -150 -10 -100 -60 L 100 -60 C 150 -10 170 120 140 280 Z" fill="#f4f1e8" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
          <path d="M-100 -60 Q 0 -100 100 -60" fill="none" stroke="${C.ink}" stroke-width="${SW}"/>${T(0, 80, "FARINHA", 46, C.woodDark || "#6b4226")}</g>`
      : `<g id="${p}-carrinho" transform="translate(150,1560)">
          <path d="M-210 0 H 190 L 160 220 H -170 Z" fill="none" stroke="${C.ink}" stroke-width="20" stroke-linejoin="round"/>
          <path d="M-210 0 H 190 L 160 220 H -170 Z" fill="none" stroke="#cfd6de" stroke-width="10" stroke-linejoin="round"/>
          ${[-130, -50, 30, 110].map((x) => `<path d="M${x} 0 L ${x - 6} 220" stroke="#9aa5b1" stroke-width="6"/>`).join("")}
          <path d="M-205 70 H 180 M -195 140 H 172" stroke="#9aa5b1" stroke-width="6"/>
          <path d="M190 0 L 240 -60 H 300" fill="none" stroke="${C.ink}" stroke-width="16" stroke-linecap="round"/><path d="M190 0 L 240 -60 H 300" fill="none" stroke="${C.red}" stroke-width="8" stroke-linecap="round"/></g>
        ${caixote(860, "#f4a261", 3)}`;

    return {
      chao: K.PALCO.CHAO, escala: K.PALCO.ESCALA,
      vagas: { esq: 330, centro: 540, dir: 750 },
      fundo: fundo + fregues, moveis: balcao + chao, frente,
      // Ambiente: lâmpadas balançando e um freguês atravessando ao fundo (atrás do balcão).
      ambiente(tl, T0, ini, fim) {
        K.ciclo(tl, T0, ini, fim, (abs) => {
          K.tf(p + "-lamp0", `rotate(${(1.8 * K.onda(abs, 3.6)).toFixed(2)})`);
          K.tf(p + "-lamp1", `rotate(${(1.8 * K.onda(abs, 3.6, 0.35)).toFixed(2)})`);
          const s = K.fase01(abs, 16), x = s < 0.6 ? -160 + (s / 0.6) * 1400 : -300;
          K.tf(p + "-fregues", `translate(${x.toFixed(1)},${(-6 * Math.abs(Math.sin(abs * 6))).toFixed(1)})`);
        });
      },
    };
  };

  Object.assign(K, { estante });
})();
