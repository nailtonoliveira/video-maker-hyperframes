/* Kit Contos do Dinheiro · Palco "praca": céu, árvores grandes e coreto ao fundo, caminho de pedras em perspectiva onde os
   atores ficam e, no primeiro plano, o encosto de um banco de praça, um canteiro de flores e pombos ciscando. */
(function () {
  const K = window.KIT, { C, SW, T } = K;

  // Pombo: pés no (0,0), ~90 px. <id>-cab (bica o chão: gira).
  function pombo(id, o = {}) {
    const vira = o.vira ? -1 : 1;
    return `<g id="${id}" transform="scale(${vira},1)">
      <path d="M-40 -34 C -40 -64 10 -70 30 -50 L 52 -36 C 40 -20 10 -10 -20 -14 Z" fill="#9aa5b1" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-40 -34 L -66 -40 L -56 -24 Z" fill="#6c757d" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-6 -12 V 0 M 8 -12 V 0" stroke="#e76f51" stroke-width="5" stroke-linecap="round"/>
      <g transform="translate(26,-52)"><g id="${id}-cab"><circle r="16" fill="#6c757d" stroke="${C.ink}" stroke-width="4"/>
        <path d="M14 -2 L 28 4 L 13 8 Z" fill="${C.gold}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><circle cx="5" cy="-4" r="3.5" fill="${C.ink}"/></g></g></g>`;
  }

  function copa(x, y, s, cor, cor2) {
    return `<g transform="translate(${x},${y}) scale(${s})">
      <path d="M-24 0 C -18 -120 -14 -220 -12 -300 L 12 -300 C 14 -220 18 -120 24 0 Z" fill="${C.trunk}" stroke="${C.ink}" stroke-width="${SW}"/>
      <g stroke="${C.ink}" stroke-width="${SW}"><circle cx="-110" cy="-330" r="110" fill="${cor2}"/><circle cx="110" cy="-340" r="110" fill="${cor2}"/>
        <circle cx="0" cy="-400" r="150" fill="${cor}"/><circle cx="-60" cy="-500" r="90" fill="${cor}"/><circle cx="80" cy="-490" r="96" fill="${cor}"/></g></g>`;
  }

  // o: { ceu, coreto (false = sem), pombos (0..3, padrão 3) }
  // ids: <p>-n1, <p>-arv-esq/-dir (balançam), <p>-pombo0..2 (-cab bica), <p>-agua (chafariz)
  K.palco.praca = function (p, o = {}) {
    const BASE = 1200;
    const fundo = `${K.sky(p + "-sky", o.ceu || "skyDay")}
      <g id="${p}-n1">${K.cloud(p + "-n1-in", 540, 300, 0.85)}</g>
      ${K.hills(p + "-morros", 1050)}
      ${o.coreto === false ? "" : `<g id="${p}-coreto" transform="translate(540,${BASE})">
        <rect x="-190" y="-60" width="380" height="60" fill="#f4f1e8" stroke="${C.ink}" stroke-width="${SW}"/>
        ${[-160, -55, 55, 160].map((x) => `<rect x="${x - 10}" y="-250" width="20" height="190" fill="#fff" stroke="${C.ink}" stroke-width="4"/>`).join("")}
        <path d="M-210 -250 L 0 -380 L 210 -250 Z" fill="${C.red}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
        <path d="M-180 -120 H 180" stroke="${C.ink}" stroke-width="5"/>
        ${[-150, -90, -30, 30, 90, 150].map((x) => `<path d="M${x} -120 V -60" stroke="${C.ink}" stroke-width="4"/>`).join("")}</g>`}
      <g id="${p}-arv-esq" transform="translate(110,${BASE + 40})"><g id="${p}-arv-esq-in">${copa(0, 0, 1.15, C.leaf, C.leafDark)}</g></g>
      <g id="${p}-arv-dir" transform="translate(990,${BASE + 40})"><g id="${p}-arv-dir-in">${copa(0, 0, 1.05, "#6cb874", C.leaf)}</g></g>`;

    const chao = `<rect x="-20" y="${BASE}" width="1120" height="${1940 - BASE}" fill="${C.grass}" stroke="${C.ink}" stroke-width="${SW}"/>
      <g>${K.piso(p + "-caminho", BASE, { tipo: "pedras", cores: ["#efe4cf", "#e3d5ba", "#f5ecdb"], junta: "#cdbd9e", largura: 110, linha: 38, cresce: 1.22 })}</g>`;
    // Chafariz pequeno ao fundo, à direita do coreto.
    const chafariz = `<g transform="translate(840,${BASE + 70})"><ellipse cx="0" cy="0" rx="120" ry="26" fill="#8ecae6" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M-120 0 V 30 Q 0 66 120 30 V 0" fill="#cfd6de" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="-12" y="-90" width="24" height="90" fill="#cfd6de" stroke="${C.ink}" stroke-width="4"/>
      <g id="${p}-agua"><path d="M0 -96 C -30 -150 -70 -120 -80 -40 M 0 -96 C 30 -150 70 -120 80 -40" fill="none" stroke="#8ecae6" stroke-width="10" stroke-linecap="round"/></g></g>`;

    const np = o.pombos ?? 3;
    const pombos = [[620, 1520, false], [760, 1560, true], [380, 1600, false]].slice(0, np)
      .map(([x, y, v], i) => `<g transform="translate(${x},${y})">${pombo(p + "-pombo" + i, { vira: v })}</g>`).join("");
    // Primeiro plano: canteiro à esquerda, encosto do banco à direita (recortados), pombos no caminho.
    const flores = [[-10, "#f28482"], [70, "#ffd166"], [150, "#f28482"], [230, "#cdb4db"], [30, "#ffd166"], [110, "#cdb4db"], [190, "#ffd166"]];
    const frente = `${pombos}
      <g transform="translate(0,1700)">
        <path d="M-40 0 C 40 -60 240 -60 330 0 V 260 H -40 Z" fill="${C.leafDark}" stroke="${C.ink}" stroke-width="${SW}"/>
        ${flores.map(([x, cor], i) => `<g transform="translate(${x},${i > 3 ? -10 : -40})"><circle r="22" fill="${cor}" stroke="${C.ink}" stroke-width="4"/><circle r="8" fill="${C.gold}"/></g>`).join("")}
        <rect x="-40" y="40" width="400" height="40" rx="10" fill="#cfc6b8" stroke="${C.ink}" stroke-width="${SW}"/></g>
      <g transform="translate(700,1690)">
        ${[30, 330].map((x) => `<rect x="${x - 18}" y="0" width="36" height="260" fill="#3e4756" stroke="${C.ink}" stroke-width="4"/>`).join("")}
        ${[0, 70, 140].map((y) => `<rect x="-60" y="${y + 20}" width="500" height="44" rx="10" fill="${C.wood}" stroke="${C.ink}" stroke-width="${SW}"/>`).join("")}</g>`;

    return {
      chao: K.PALCO.CHAO, escala: K.PALCO.ESCALA,
      vagas: { esq: 320, centro: 540, dir: 760 },
      fundo, moveis: chao + chafariz, frente,
      // Ambiente: nuvem, copas balançando, água do chafariz pulsando, pombos bicando.
      ambiente(tl, T0, ini, fim) {
        K.ciclo(tl, T0, ini, fim, (abs) => {
          K.tf(p + "-n1", `translate(${(-300 + 600 * K.fase01(abs, 50)).toFixed(1)},0)`);
          K.tf(p + "-arv-esq-in", `rotate(${(1.1 * K.onda(abs, 5)).toFixed(2)})`);
          K.tf(p + "-arv-dir-in", `rotate(${(1.1 * K.onda(abs, 5.6, 0.3)).toFixed(2)})`);
          K.tf(p + "-agua", `scale(${(1 + 0.08 * K.onda(abs, 0.8)).toFixed(3)},${(1 + 0.12 * K.onda(abs, 0.8)).toFixed(3)})`);
          for (let i = 0; i < np; i++) {
            const f = K.fase01(abs, 2.4 + i * 0.5, i * 0.37);
            K.tf(`${p}-pombo${i}-cab`, `rotate(${f < 0.18 ? (Math.sin((f / 0.18) * Math.PI) * 50).toFixed(1) : 0})`);
          }
        });
      },
    };
  };

  Object.assign(K, { pombo });
})();
