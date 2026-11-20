/* Kit Contos do Dinheiro · Palco "tribunal" (do bairro): parede com lambris, janelas altas com cortina, mesa do juiz ao
   fundo (com vaga para o juiz atrás dela), piso de tábuas e, no primeiro plano, a plateia de costas no banco de madeira. */
(function () {
  const K = window.KIT, { C, SW, T } = K;

  function janela(p, i, x) {
    return `<g id="${p}-jan${i}">
      <path d="M${x} 640 V 330 Q ${x} 250 ${x + 75} 250 Q ${x + 150} 250 ${x + 150} 330 V 640 Z" fill="#cfe8ef" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M${x + 75} 250 V 640 M ${x} 450 H ${x + 150}" stroke="${C.ink}" stroke-width="4"/>
      <path d="M${x + 20} 300 L ${x + 60} 270 M ${x + 22} 340 L ${x + 64} 306" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
      <rect x="${x - 14}" y="634" width="178" height="22" rx="6" fill="${C.wood}" stroke="${C.ink}" stroke-width="4"/>
      <g transform="translate(${x - 18},230)"><g id="${p}-cort${i}a"><path d="M0 0 C 30 140 10 300 24 420 L -20 420 C -10 300 -26 140 -16 0 Z" fill="#9b2226" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/></g></g>
      <g transform="translate(${x + 168},230)"><g id="${p}-cort${i}b"><path d="M0 0 C -30 140 -10 300 -24 420 L 20 420 C 10 300 26 140 16 0 Z" fill="#9b2226" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/></g></g>
      <rect x="${x - 40}" y="220" width="230" height="20" rx="8" fill="${C.woodDark}" stroke="${C.ink}" stroke-width="4"/></g>`;
  }

  // o: { placa: "TRIBUNAL DO BAIRRO" (plaquinha na mesa do juiz; "" = sem), plateia: 0..4 (padrão 4), luz (cone sobre o centro) }
  // Ordem de montagem: fundo + atras (o juiz: K.ator(id, "vizinho", P.vagas.juiz.x, P.vagas.juiz)) + moveis + atores + frente.
  // ids: <p>-mesa-juiz, <p>-plateia0..3 (-cab balança), <p>-cort*, <p>-cone
  K.palco.tribunal = function (p, o = {}) {
    const BASE = 1240, LAM = 760;
    let paineis = "";
    for (let x = 20; x < 1060; x += 180) paineis += `<rect x="${x}" y="${LAM + 50}" width="150" height="${BASE - LAM - 100}" rx="10" fill="none" stroke="${C.woodDark}" stroke-width="4"/>`;
    const fundo = `<rect x="-20" y="-20" width="1120" height="${LAM + 20}" fill="#f3dfbf"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${i * 200 - 40}" y="-20" width="90" height="${LAM + 20}" fill="#efd6b0"/>`).join("")}
      <rect x="-20" y="${LAM}" width="1120" height="${BASE - LAM}" fill="#c98b57" stroke="${C.ink}" stroke-width="${SW}"/>${paineis}
      <rect x="-20" y="${LAM - 20}" width="1120" height="24" fill="${C.wood}" stroke="${C.ink}" stroke-width="${SW}"/>
      ${janela(p, 0, 10)}${janela(p, 1, 920)}
      ${K.lampada(p + "-lamp0", 300, 90, C.goldDark)}${K.lampada(p + "-lamp1", 780, 90, C.goldDark)}
      ${o.luz ? K.spotlight(p + "-cone", { xa: 470, xb: 610, xc: 260, xd: 820, y0: -20, y1: 1420, a: 0.35 }) : ""}`;

    const mesa = `<g id="${p}-mesa-juiz"><g transform="translate(540,900)">${K.judgeDesk(p + "-mesa-juiz-in", 560, BASE - 900)}</g>
      <g transform="translate(760,898)">${K.gavelBlock(p + "-base-martelo")}</g>
      ${o.placa === "" ? "" : `<g transform="translate(540,952)">${K.sign(p + "-placa-mesa", [[o.placa || "TRIBUNAL DO BAIRRO", 30]], { w: 400, nails: false })}</g>`}</g>`;
    const chao = K.piso(p + "-piso", BASE, { tipo: "tabuas", cores: ["#dcb98c", "#d2ad7d", "#e3c399"], junta: "#b88c5c", largura: 120, linha: 54, cresce: 1.18 });

    // Plateia de costas e o encosto do banco no primeiro plano.
    const n = o.plateia ?? 4;
    let plateia = "";
    [[150, 0, 1.15], [420, 3, 1.1], [690, 1, 1.15], [950, 5, 1.1]].slice(0, n).forEach(([x, roupa, s], i) => {
      plateia += `<g transform="translate(${x},1860) scale(${s})">${K.costas(p + "-plateia" + i, roupa)}</g>`;
    });
    const frente = `${plateia}
      <rect x="-20" y="1790" width="1120" height="40" rx="10" fill="${C.wood}" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="-20" y="1846" width="1120" height="40" rx="10" fill="${C.wood}" stroke="${C.ink}" stroke-width="${SW}"/>
      ${[60, 400, 680, 1020].map((x) => `<rect x="${x - 16}" y="1780" width="32" height="160" fill="${C.woodDark}" stroke="${C.ink}" stroke-width="4"/>`).join("")}`;

    return {
      chao: K.PALCO.CHAO, escala: K.PALCO.ESCALA,
      vagas: { esq: 270, centro: 540, dir: 810, juiz: { x: 540, y: 1180, escala: 0.9 } },
      fundo, moveis: mesa + chao, frente,
      // Ambiente: cortinas e lâmpadas balançando de leve, plateia mexendo a cabeça.
      ambiente(tl, T0, ini, fim) {
        K.ciclo(tl, T0, ini, fim, (abs) => {
          K.tf(p + "-lamp0", `rotate(${(1.2 * K.onda(abs, 4)).toFixed(2)})`);
          K.tf(p + "-lamp1", `rotate(${(1.2 * K.onda(abs, 4, 0.4)).toFixed(2)})`);
          ["0a", "0b", "1a", "1b"].forEach((c, i) => K.tf(`${p}-cort${c}`, `rotate(${(1.4 * K.onda(abs, 5, i * 0.2)).toFixed(2)})`));
          for (let i = 0; i < n; i++) K.tf(`${p}-plateia${i}-cab`, `rotate(${(4 * K.onda(abs, 3.2 + i * 0.7, i * 0.3)).toFixed(2)})`);
        });
      },
    };
  };
})();
