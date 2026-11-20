/* Kit Contos do Dinheiro · Palco "cozinha" (casa): parede com janela, bancada, geladeira, piso xadrez em perspectiva
   e, no primeiro plano, a borda da mesa da família. Câmera perto: atores com K.ator(...) nos x de `vagas`. */
(function () {
  const K = window.KIT, { C, SW, T } = K;

  // o: { parede, listra, noite (janela com céu de noite e lua), mesa (false = sem mesa na frente), xicara (false = mesa sem xícara) }
  // Tampo da bancada em y 985 (objetos em cima: base nesse y). ids: <p>-janela, <p>-cortina, <p>-geladeira, <p>-bancada, <p>-relogio, <p>-mesa, <p>-cadeira
  K.palco.cozinha = function (p, o = {}) {
    const parede = o.parede || "#fbe3c4", listra = o.listra || "#f6d7b0", noite = !!o.noite;
    const ceu = noite ? ["#24264f", "#4b4a86"] : ["#8fd0ea", "#e6f6f0"];
    const BASE = 1240; // pé da parede (e dos móveis encostados)
    let listras = "";
    for (let x = 30; x < 1080; x += 120) listras += `<rect x="${x}" y="0" width="48" height="${BASE}" fill="${listra}"/>`;
    let azulejos = "";
    for (let x = 0; x <= 1080; x += 60) azulejos += `<path d="M${x} 800 V 985" stroke="#d9e4e8" stroke-width="3"/>`;
    for (let y = 800; y <= 985; y += 60) azulejos += `<path d="M0 ${y} H 1080" stroke="#d9e4e8" stroke-width="3"/>`;

    // Janela recortada na borda esquerda (fora da faixa livre das placas).
    const janela = `<g id="${p}-janela">
      <defs><linearGradient id="${p}-ceu-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ceu[0]}"/><stop offset="1" stop-color="${ceu[1]}"/></linearGradient>
        <clipPath id="${p}-jclip"><rect x="-20" y="250" width="170" height="380"/></clipPath></defs>
      <rect x="-30" y="236" width="196" height="408" fill="#fff6e3" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect id="${p}-ceu" x="-20" y="250" width="170" height="380" fill="url(#${p}-ceu-g)" stroke="${C.ink}" stroke-width="4"/>
      <g clip-path="url(#${p}-jclip)"><g id="${p}-nuvem">${K.cloud(p + "-nuvem-in", 60, 360, 0.55)}</g>
        ${noite ? `<circle cx="96" cy="320" r="26" fill="#fdf0d5" stroke="${C.ink}" stroke-width="4"/>` : ""}
        <path d="M-20 560 Q 40 520 90 545 T 150 540 V 630 H -20 Z" fill="#a9d18e" stroke="${C.ink}" stroke-width="4"/></g>
      <path d="M65 250 V 630 M -20 440 H 150" stroke="${C.ink}" stroke-width="5"/>
      <rect x="-30" y="636" width="210" height="26" rx="6" fill="#fff6e3" stroke="${C.ink}" stroke-width="${SW}"/>
      <g transform="translate(176,226)"><g id="${p}-cortina">
        <path d="M0 0 C -8 120 14 260 -6 400 L -56 400 C -40 260 -64 120 -52 0 Z" fill="${C.red}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
        <path d="M-26 20 C -30 140 -18 260 -30 380" fill="none" stroke="#b43a3a" stroke-width="5"/></g></g>
      <rect x="-30" y="212" width="236" height="22" rx="10" fill="${C.trunk}" stroke="${C.ink}" stroke-width="${SW}"/>
      <g transform="translate(96,672)"><g transform="translate(0,0)">
        <path d="M-40 0 H 40 L 30 52 H -30 Z" fill="#e07a5f" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
        <path d="M0 0 C -6 -40 -40 -60 -54 -50 C -40 -30 -20 -16 0 0 Z M 0 0 C 8 -50 40 -70 54 -58 C 40 -36 20 -16 0 0 Z M 0 0 C 0 -40 4 -70 0 -90" fill="${C.leaf}" stroke="${C.ink}" stroke-width="4"/></g></g></g>`;

    // Armário alto recortado na borda direita, geladeira embaixo dele.
    const geladeira = `<g id="${p}-geladeira">
      <rect x="930" y="170" width="190" height="300" rx="10" fill="#e9c46a" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="950" y="190" width="150" height="260" rx="8" fill="none" stroke="${C.ink}" stroke-width="4"/><circle cx="966" cy="330" r="8" fill="${C.ink}"/>
      <rect x="900" y="560" width="220" height="${BASE - 560}" rx="24" fill="#e8eef2" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M900 780 H 1120" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="922" y="620" width="16" height="120" rx="8" fill="#9aa5b1" stroke="${C.ink}" stroke-width="3"/>
      <rect x="922" y="820" width="16" height="160" rx="8" fill="#9aa5b1" stroke="${C.ink}" stroke-width="3"/>
      <circle cx="1000" cy="640" r="14" fill="${C.red}" stroke="${C.ink}" stroke-width="3"/><rect x="980" y="680" width="70" height="56" rx="4" fill="#fff" stroke="${C.ink}" stroke-width="3" transform="rotate(-6 1015 708)"/>
      <path d="M990 700 l 14 16 l 20 -26" fill="none" stroke="${C.leaf}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="1060" cy="860" r="14" fill="${C.gold}" stroke="${C.ink}" stroke-width="3"/></g>`;

    // Bancada encostada na parede (tampo em y 985), com fruteira, potes, bule e relógio de parede.
    const bancada = `<g id="${p}-bancada">
      <rect x="-20" y="800" width="920" height="185" fill="#f4fbfd"/>${azulejos}
      <path d="M-20 800 H 900" stroke="${C.ink}" stroke-width="4"/>
      <rect x="-20" y="1000" width="920" height="${BASE - 1000}" fill="#e9c46a" stroke="${C.ink}" stroke-width="${SW}"/>
      ${[0, 1, 2, 3].map((i) => `<rect x="${10 + i * 222}" y="1040" width="200" height="${BASE - 1060}" rx="10" fill="none" stroke="${C.ink}" stroke-width="4"/><rect x="${95 + i * 222}" y="1060" width="30" height="12" rx="6" fill="${C.ink}"/>`).join("")}
      <rect x="-30" y="982" width="940" height="26" rx="8" fill="#f4f1e8" stroke="${C.ink}" stroke-width="${SW}"/>
      <g transform="translate(250,982)">
        <path d="M-90 0 C -90 -60 90 -60 90 0 Z" fill="#c8553d" stroke="${C.ink}" stroke-width="${SW}"/>
        <circle cx="-40" cy="-62" r="30" fill="#f4a261" stroke="${C.ink}" stroke-width="4"/><circle cx="10" cy="-74" r="32" fill="${C.red}" stroke="${C.ink}" stroke-width="4"/>
        <circle cx="52" cy="-58" r="26" fill="#ffd166" stroke="${C.ink}" stroke-width="4"/><path d="M10 -104 q 6 -16 18 -18" fill="none" stroke="${C.leafDark}" stroke-width="5" stroke-linecap="round"/></g>
      ${[["#fff", 470, 120], ["#f7d6d0", 560, 96], ["#d4ebf7", 640, 80]].map(([cor, x, h]) => `<g transform="translate(${x},982)"><rect x="-34" y="${-h}" width="68" height="${h}" rx="12" fill="${cor}" stroke="${C.ink}" stroke-width="4"/><rect x="-38" y="${-h - 16}" width="76" height="20" rx="8" fill="${C.trunk}" stroke="${C.ink}" stroke-width="4"/></g>`).join("")}
      <g transform="translate(800,982)">
        <path d="M-70 0 C -86 -70 -50 -110 0 -110 C 50 -110 86 -70 70 0 Z" fill="#3d5a80" stroke="${C.ink}" stroke-width="${SW}"/>
        <path d="M66 -70 L 112 -100" stroke="${C.ink}" stroke-width="16" stroke-linecap="round"/><path d="M66 -70 L 112 -100" stroke="#3d5a80" stroke-width="8" stroke-linecap="round"/>
        <rect x="-26" y="-130" width="52" height="22" rx="8" fill="${C.ink}"/>
        <g transform="translate(112,-108)">${K.fios(p + "-bule-vapor", 2, { dx: 20 })}</g></g></g>
      <g transform="translate(96,880)">${K.clock(p + "-relogio", 62)}<path id="${p}-relogio-s" d="M0 6 V -50" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/></g>`;

    // Rodapé e piso xadrez em perspectiva.
    const chao = `${K.piso(p + "-piso", BASE, { cores: ["#f3e6cc", "#d8c39e"], largura: 150, linha: 42 })}
      <ellipse cx="540" cy="1430" rx="400" ry="74" fill="#84a59d" stroke="${C.ink}" stroke-width="${SW}"/>
      <ellipse cx="540" cy="1430" rx="340" ry="52" fill="none" stroke="#fff6e3" stroke-width="8" stroke-dasharray="26 16"/>`;

    // Primeiro plano: a borda da mesa da família, com toalha xadrez, xícara com vapor e pão; cadeira recortada à esquerda.
    let toalha = "";
    for (let i = 0; i < 12; i++) toalha += `<rect x="${-40 + i * 100}" y="1700" width="50" height="240" fill="#f28482" opacity=".55"/>`;
    for (let j = 0; j < 3; j++) toalha += `<rect x="-40" y="${1720 + j * 80}" width="1160" height="40" fill="#f28482" opacity=".45"/>`;
    const mesa = o.mesa === false ? "" : `<g id="${p}-mesa">
      <g id="${p}-cadeira"><path d="M28 1700 V 1500 M 168 1700 V 1500" stroke="${C.ink}" stroke-width="30" stroke-linecap="round"/>
        <path d="M28 1700 V 1500 M 168 1700 V 1500" stroke="${C.wood}" stroke-width="18" stroke-linecap="round"/>
        <path d="M0 1500 Q 98 1460 196 1500 V 1540 Q 98 1504 0 1540 Z" fill="${C.wood}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
        <rect x="16" y="1590" width="164" height="30" rx="10" fill="${C.wood}" stroke="${C.ink}" stroke-width="${SW}"/></g>
      <rect x="-40" y="1690" width="1160" height="260" fill="#fff6e3" stroke="${C.ink}" stroke-width="${SW}"/>${toalha}
      <path d="M-40 1690 H 1120" stroke="${C.ink}" stroke-width="${SW}"/>
      ${o.xicara === false ? "" : `<g transform="translate(860,1770)">
        <ellipse cx="0" cy="0" rx="110" ry="22" fill="${C.louca}" stroke="${C.ink}" stroke-width="${SW}"/>
        <path d="M66 -90 C 120 -96 120 -30 56 -36" fill="none" stroke="${C.ink}" stroke-width="22" stroke-linecap="round"/><path d="M66 -90 C 120 -96 120 -30 56 -36" fill="none" stroke="#e07a5f" stroke-width="10" stroke-linecap="round"/>
        <path d="M-72 -118 L -60 -26 Q -56 -10 -36 -10 L 36 -10 Q 56 -10 60 -26 L 72 -118 Z" fill="#e07a5f" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
        <ellipse cx="0" cy="-118" rx="72" ry="14" fill="${C.cafe || "#6f4e37"}" stroke="${C.ink}" stroke-width="${SW}"/>
        <g transform="translate(0,-136)">${K.fios(p + "-xic-vapor", 3)}</g></g>`}
      <g transform="translate(260,1790)">
        <ellipse cx="0" cy="0" rx="150" ry="30" fill="#e9c46a" stroke="${C.ink}" stroke-width="${SW}"/>
        <path d="M-110 -6 C -110 -70 -40 -84 0 -80 C 50 -84 110 -64 110 -6 Z" fill="#f2c57c" stroke="${C.ink}" stroke-width="${SW}"/>
        <path d="M-60 -60 l 20 30 M -10 -72 l 20 34 M 40 -68 l 20 30" stroke="#c98a12" stroke-width="6" stroke-linecap="round"/></g>
      <g transform="translate(560,1760)"><rect x="-44" y="-70" width="88" height="70" rx="10" fill="#fff" stroke="${C.ink}" stroke-width="4"/><rect x="-50" y="-84" width="100" height="18" rx="8" fill="#3d5a80" stroke="${C.ink}" stroke-width="4"/></g></g>`;

    return {
      chao: K.PALCO.CHAO, escala: K.PALCO.ESCALA,
      vagas: { esq: 290, centro: 540, dir: 760 },
      fundo: `<rect x="-20" y="-20" width="1120" height="${BASE + 20}" fill="${parede}"/>${listras}${janela}${geladeira}`,
      moveis: `${bancada}${chao}`,
      frente: mesa,
      // Ambiente: nuvem passando na janela, cortina balançando, vapor do bule e da xícara, ponteiro dos segundos.
      ambiente(tl, T0, ini, fim) {
        K.ciclo(tl, T0, ini, fim, (abs) => {
          K.tf(p + "-nuvem", `translate(${(-140 + 300 * K.fase01(abs, 24)).toFixed(1)},0)`);
          K.tf(p + "-cortina", `rotate(${(1.6 * K.onda(abs, 4.2)).toFixed(2)})`);
          K.vapor(p + "-bule-vapor", abs, 2, 1.8);
          K.vapor(p + "-xic-vapor", abs, 3, 1.6);
          K.tf(p + "-relogio-s", `rotate(${(Math.floor(abs) * 6) % 360})`);
        });
      },
    };
  };
})();
