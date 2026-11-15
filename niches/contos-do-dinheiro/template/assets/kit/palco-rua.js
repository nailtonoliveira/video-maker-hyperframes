/* Kit Contos do Dinheiro · Palco "rua" (bairro): céu, casas recortadas nas bordas, calçada em perspectiva onde os atores
   ficam, meio-fio e a rua no primeiro plano, com um carro que passa de vez em quando. Peça extra: K.carro. */
(function () {
  const K = window.KIT, { C, SW, T } = K;

  // Carro visto de lado: centro das rodas no y=0, ~420 × 190. Rodas <id>-r0/-r1 (giram).
  function carro(id, cor = "#3d5a80") {
    const roda = (x, i) => `<g transform="translate(${x},0)"><g id="${id}-r${i}"><circle r="40" fill="${C.ink}"/><circle r="20" fill="#cfd6de" stroke="${C.ink}" stroke-width="4"/>
      <path d="M-18 0 H 18 M 0 -18 V 18" stroke="${C.ink}" stroke-width="5"/></g></g>`;
    return `<g id="${id}">
      <path d="M-200 -30 C -204 -86 -170 -96 -120 -100 L -80 -160 C -70 -176 -50 -184 -30 -184 L 90 -184 C 116 -184 132 -172 146 -150 L 176 -100 C 206 -96 214 -76 212 -30 Z" fill="${cor}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M-66 -104 L -40 -150 Q -34 -160 -22 -160 L 20 -160 L 20 -104 Z M 40 -160 L 90 -160 Q 106 -160 116 -146 L 140 -104 L 40 -104 Z" fill="#cfe8ef" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>
      <rect x="190" y="-82" width="24" height="16" rx="6" fill="${C.gold}" stroke="${C.ink}" stroke-width="3"/>
      <rect x="-208" y="-78" width="18" height="16" rx="6" fill="${C.red}" stroke="${C.ink}" stroke-width="3"/>
      <path d="M-10 -96 V -36" stroke="${C.ink}" stroke-width="4"/>
      ${roda(-120, 0)}${roda(130, 1)}</g>`;
  }

  function casa(x, w, o) {
    const topo = 830, base = 1180, h = base - topo;
    return `<g transform="translate(${x},${base})">${K.house(o.id, { w, h, wall: o.cor, roof: o.telhado, num: o.num })}</g>`;
  }

  // o: { ceu: "skyDay"|"skyDusk"|"skyNight", casas: [{cor, telhado, num}, {cor, telhado, num}], carro (false = sem carro) }
  // ids: <p>-n1/-n2 (nuvens), <p>-aves, <p>-carro, <p>-poste-luz, casas <p>-casa-esq/-dir
  K.palco.rua = function (p, o = {}) {
    const [ce, cd] = o.casas || [{ cor: "#f4d58d", telhado: "#c8553d", num: 12 }, { cor: "#a8c5e2", telhado: "#3d5a80", num: 14 }];
    const noite = o.ceu === "skyNight";
    let aves = "";
    [[0, 0], [70, 26], [130, -10]].forEach(([dx, dy], i) => (aves += `<g transform="translate(${dx},${dy})"><path id="${p}-ave${i}" d="M-22 0 Q -11 -14 0 0 Q 11 -14 22 0" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/></g>`));
    const fundo = `${K.sky(p + "-sky", o.ceu || "skyDay")}
      ${noite ? `<circle cx="820" cy="300" r="56" fill="#fdf0d5" stroke="${C.ink}" stroke-width="${SW}"/>` : `<circle cx="860" cy="260" r="70" fill="#ffd166" stroke="${C.ink}" stroke-width="${SW}"/>`}
      <g id="${p}-n1">${K.cloud(p + "-n1-in", 260, 330, 0.9)}</g><g id="${p}-n2">${K.cloud(p + "-n2-in", 760, 520, 0.65)}</g>
      <g transform="translate(0,420)"><g id="${p}-aves">${aves}</g></g>
      ${K.hills(p + "-morros", 1010)}
      <g fill="#c9d6df" stroke="${C.ink}" stroke-width="4">
        <rect x="330" y="880" width="120" height="300"/><rect x="460" y="820" width="150" height="360"/><rect x="620" y="900" width="110" height="280"/></g>
      <g fill="#f4fbfd">${[350, 395, 480, 530, 575, 640, 690].map((x, i) => `<rect x="${x}" y="${i % 2 ? 920 : 960}" width="26" height="34" stroke="${C.ink}" stroke-width="3"/>`).join("")}</g>
      ${casa(-70, 400, { id: p + "-casa-esq", ...ce })}
      ${casa(750, 400, { id: p + "-casa-dir", ...cd })}
      ${K.fence(p + "-cerca", 340, 720, 1180)}
      <g transform="translate(330,1180) scale(0.8)">${K.tree(p + "-arv", 0)}</g>`;

    // Calçada em perspectiva (atores aqui), meio-fio e rua.
    const moveis = `${K.piso(p + "-calcada", 1180, { tipo: "pedras", cores: ["#efe4cf", "#e3d5ba", "#f5ecdb"], junta: "#cdbd9e", largura: 120, linha: 40, cresce: 1.22 })}
      <rect x="-20" y="1470" width="1120" height="34" fill="#cfc6b8" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="-20" y="1504" width="1120" height="250" fill="${C.road}" stroke="${C.ink}" stroke-width="${SW}"/>
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="${-60 + i * 260}" y="1622" width="150" height="18" rx="9" fill="#f4f1e8"/>`).join("")}
      <rect x="-20" y="1750" width="1120" height="30" fill="#cfc6b8" stroke="${C.ink}" stroke-width="${SW}"/>
      ${K.piso(p + "-calcada2", 1780, { tipo: "pedras", cores: ["#efe4cf", "#e3d5ba", "#f5ecdb"], junta: "#cdbd9e", largura: 200, linha: 60, fuga: 1500 })}`;
    // Primeiro plano: carro que passa, poste à esquerda (recortado), hidrante e moita à direita.
    const frente = `${o.carro === false ? "" : `<g transform="translate(0,1726) scale(0.9)"><g id="${p}-carro">${carro(p + "-carro-in", o.corCarro || "#e76f51")}</g></g>`}
      <g id="${p}-poste"><rect x="34" y="250" width="30" height="1230" fill="#5c677d" stroke="${C.ink}" stroke-width="${SW}"/>
        <path d="M49 260 C 49 200 120 190 150 220" fill="none" stroke="${C.ink}" stroke-width="22" stroke-linecap="round"/><path d="M49 260 C 49 200 120 190 150 220" fill="none" stroke="#5c677d" stroke-width="12" stroke-linecap="round"/>
        <path d="M118 214 H 186 L 172 246 H 132 Z" fill="#3e4756" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
        <ellipse id="${p}-poste-luz" cx="152" cy="252" rx="22" ry="9" fill="${noite ? C.gold : "#fdf0d5"}" stroke="${C.ink}" stroke-width="4"/>
        <rect x="22" y="1440" width="54" height="40" rx="8" fill="#3e4756" stroke="${C.ink}" stroke-width="${SW}"/></g>
      <g transform="translate(965,1470)">
        <path d="M-90 0 C -110 -60 -60 -110 -20 -96 C 0 -140 70 -130 80 -86 C 120 -86 130 -20 110 0 Z" fill="${C.leaf}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
        <circle cx="-30" cy="-60" r="9" fill="#f28482"/><circle cx="30" cy="-80" r="9" fill="#ffd166"/><circle cx="70" cy="-40" r="9" fill="#f28482"/></g>
      <g transform="translate(840,1476)"><rect x="-26" y="-96" width="52" height="96" rx="12" fill="${C.red}" stroke="${C.ink}" stroke-width="${SW}"/>
        <rect x="-36" y="-70" width="72" height="20" rx="8" fill="${C.red}" stroke="${C.ink}" stroke-width="4"/><circle cx="0" cy="-104" r="16" fill="${C.red}" stroke="${C.ink}" stroke-width="4"/></g>
      <g transform="translate(150,1960)">
        <path d="M-200 0 C -230 -120 -150 -230 -60 -200 C -30 -280 90 -280 120 -190 C 210 -200 250 -90 220 0 Z" fill="${C.leafDark}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
        <path d="M-120 -120 C -100 -150 -60 -160 -40 -140 M 30 -170 C 60 -200 100 -190 110 -160" fill="none" stroke="${C.leafLight}" stroke-width="10" stroke-linecap="round"/>
        <circle cx="-80" cy="-60" r="14" fill="#f28482" stroke="${C.ink}" stroke-width="3"/><circle cx="60" cy="-90" r="14" fill="#ffd166" stroke="${C.ink}" stroke-width="3"/><circle cx="150" cy="-40" r="14" fill="#cdb4db" stroke="${C.ink}" stroke-width="3"/></g>
      <g transform="translate(880,1920)">
        <path d="M-80 0 L -96 -230 H 96 L 80 0 Z" fill="#2a9d8f" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
        <rect x="-110" y="-260" width="220" height="40" rx="12" fill="#21867a" stroke="${C.ink}" stroke-width="${SW}"/>
        <path d="M-40 -180 V -40 M 0 -180 V -40 M 40 -180 V -40" stroke="#21867a" stroke-width="8" stroke-linecap="round"/></g>
      <g transform="translate(560,1880)"><rect x="-70" y="-30" width="140" height="60" rx="8" fill="#9aa5b1" stroke="${C.ink}" stroke-width="4"/>
        <path d="M-50 -10 H 50 M -50 10 H 50" stroke="#6c757d" stroke-width="5"/></g>`;

    return {
      chao: K.PALCO.CHAO, escala: K.PALCO.ESCALA,
      vagas: { esq: 300, centro: 540, dir: 740 },
      fundo, moveis, frente,
      // Ambiente: nuvens andando, passarinhos batendo asa e atravessando, carro passando a cada ~9 s.
      ambiente(tl, T0, ini, fim) {
        K.ciclo(tl, T0, ini, fim, (abs) => {
          K.tf(p + "-n1", `translate(${(-200 + 500 * K.fase01(abs, 40)).toFixed(1)},0)`);
          K.tf(p + "-n2", `translate(${(260 - 520 * K.fase01(abs, 52, 0.5)).toFixed(1)},0)`);
          const fa = K.fase01(abs, 14);
          K.tf(p + "-aves", `translate(${(-260 + 1600 * fa).toFixed(1)},${(30 * Math.sin(fa * 6.283)).toFixed(1)})`);
          for (let i = 0; i < 3; i++) K.tf(`${p}-ave${i}`, `scale(1,${(0.35 + 0.65 * Math.abs(K.onda(abs, 0.5, i / 3))).toFixed(2)})`);
          if (o.carro !== false) {
            const P = K.periodo(9), s = K.fase01(abs, 9) * P, dur = 2.4;
            const x = s < dur ? 1400 - (s / dur) * 1900 : -700;
            K.tf(p + "-carro", `translate(${x.toFixed(1)},0)`);
            const giro = ((-abs * 540) % 360).toFixed(1);
            K.tf(p + "-carro-in-r0", `rotate(${giro})`);
            K.tf(p + "-carro-in-r1", `rotate(${giro})`);
          }
        });
      },
    };
  };

  Object.assign(K, { carro });
})();
