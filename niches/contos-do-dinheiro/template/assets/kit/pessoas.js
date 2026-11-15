/* Kit Contos do Dinheiro · Personagens: pessoa (elenco), figurante e balão de fala. */
(function () {
  const K = window.KIT, { C, SW, T, rng } = K;

  // Pessoa: pés no (0,0). tipo: adulto (~330 px) ou crianca (~230 px).
  // Partes animáveis: <id>-armL, <id>-armR, <id>-head, bocas <id>-m-smile|open|sad|flat (só 'boca' visível).
  // o.propL / o.propR: SVG desenhado dentro do braço (coordenadas do braço: ombro no (0,0), mão em (±14, 98)); gira junto.
  function person(id, o = {}) {
    const k = o.crianca ? 0.7 : 1;
    const skin = o.skin || "#f1c27d", shirt = o.shirt || "#2a9d8f", pants = o.pants || "#3d405b", hair = o.hair || "#4a2c1d";
    const boca = o.boca || "smile";
    const hairPath = {
      coque: `<circle cx="0" cy="-62" r="24" fill="${hair}" stroke="${C.ink}" stroke-width="${SW}"/><path d="M-54 -6 C -58 -60 -20 -66 0 -60 C 20 -66 58 -60 54 -6 C 40 -36 -40 -36 -54 -6 Z" fill="${hair}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>`,
      curto: `<path d="M-54 -10 C -56 -58 -10 -70 10 -62 C 40 -70 60 -44 54 -10 C 40 -30 10 -40 -54 -10 Z" fill="${hair}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>`,
      rabo: `<path d="M44 -30 C 90 -20 96 30 70 60 C 66 30 60 0 44 -10 Z" fill="${hair}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M-54 -6 C -58 -60 -20 -66 0 -60 C 20 -66 58 -60 54 -6 C 30 -30 -30 -30 -54 -6 Z" fill="${hair}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>`,
      careca: `<path d="M-54 -4 C -60 -20 -50 -26 -44 -24 M 54 -4 C 60 -20 50 -26 44 -24" fill="none" stroke="${C.ink}" stroke-width="${SW}"/><path d="M-50 4 C -64 -10 -56 -30 -46 -26 L -40 10 Z M 50 4 C 64 -10 56 -30 46 -26 L 40 10 Z" fill="${hair}" stroke="${C.ink}" stroke-width="4"/>`,
      chapeu: `<path d="M-78 -26 H 78 L 70 -14 H -70 Z" fill="${hair}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M-46 -26 C -46 -80 46 -80 46 -26 Z" fill="${hair}" stroke="${C.ink}" stroke-width="${SW}"/>`,
    }[o.cabelo || "curto"];
    const mouths = {
      smile: `<path d="M-16 18 Q 0 32 16 18" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`,
      open: `<path d="M-15 14 Q 0 44 15 14 Z" fill="#7a2e2e" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`,
      sad: `<path d="M-14 28 Q 0 16 14 28" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`,
      flat: `<path d="M-12 22 H 12" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`,
    };
    const mouthSvg = Object.entries(mouths).map(([n, d]) => `<g id="${id}-m-${n}" opacity="${n === boca ? 1 : 0}">${d}</g>`).join("");
    const arm = (side) => {
      const sx = side === "L" ? -40 : 40, dx = side === "L" ? -14 : 14;
      return `<g transform="translate(${sx},-206)"><g id="${id}-arm${side}">${o["prop" + side] || ""}
        <path d="M0 0 L ${dx} 92" stroke="${C.ink}" stroke-width="22" stroke-linecap="round"/>
        <path d="M0 0 L ${dx} 92" stroke="${shirt}" stroke-width="12" stroke-linecap="round"/>
        <circle cx="${dx}" cy="98" r="13" fill="${skin}" stroke="${C.ink}" stroke-width="4"/></g></g>`;
    };
    return `<g id="${id}"><g id="${id}-body" transform="scale(${k})">
      <path d="M-16 -112 L -20 -6 M 16 -112 L 20 -6" stroke="${C.ink}" stroke-width="24" stroke-linecap="round"/>
      <path d="M-16 -112 L -20 -6 M 16 -112 L 20 -6" stroke="${pants}" stroke-width="14" stroke-linecap="round"/>
      <path d="M-34 -2 h 26 M 8 -2 h 26" stroke="${C.ink}" stroke-width="14" stroke-linecap="round"/>
      ${o.vestido ? `<path d="M-46 -214 L 46 -214 L 62 -96 L -62 -96 Z" fill="${shirt}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>` : `<rect x="-46" y="-222" width="92" height="124" rx="36" fill="${shirt}" stroke="${C.ink}" stroke-width="${SW}"/>`}
      ${arm("L")}${arm("R")}
      <g transform="translate(0,-276)"><g id="${id}-head">
        <circle r="54" fill="${skin}" stroke="${C.ink}" stroke-width="${SW}"/>
        ${hairPath}
        <circle cx="-19" cy="-2" r="6.5" fill="${C.ink}"/><circle cx="19" cy="-2" r="6.5" fill="${C.ink}"/>
        <circle cx="-32" cy="16" r="9" fill="#f08a7e" opacity=".55"/><circle cx="32" cy="16" r="9" fill="#f08a7e" opacity=".55"/>
        ${mouthSvg}
        ${o.oculos ? `<g fill="none" stroke="${C.ink}" stroke-width="4"><circle cx="-20" cy="-2" r="16"/><circle cx="20" cy="-2" r="16"/><path d="M-4 -2 H 4 M -36 -4 L -52 -10 M 36 -4 L 52 -10"/></g>` : ""}
        ${o.bigode ? `<path d="M-22 12 Q -10 4 0 10 Q 10 4 22 12 Q 10 20 0 14 Q -10 20 -22 12 Z" fill="${hair}" stroke="${C.ink}" stroke-width="3"/>` : ""}
      </g></g>
    </g></g>`;
  }

  // Balão de fala/pensamento (centro no (0,0)); a cauda aponta para (tx, ty) relativo ao centro.
  function bubble(id, linhas, o = {}) {
    const w = o.w || 600, h = o.h || 160, tx = o.tx ?? -120, ty = o.ty ?? 150;
    let y = -h / 2 + 18, txt = "";
    for (const [t, fs] of linhas) {
      y += fs * 1.0;
      txt += `<text x="0" y="${y}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="${fs}" fill="${C.ink}">${t}</text>`;
      y += fs * 0.2;
    }
    const tail = o.pensamento
      ? `<circle cx="${tx * 0.55}" cy="${h / 2 + 26}" r="16" fill="#fff" stroke="${C.ink}" stroke-width="4"/><circle cx="${tx * 0.8}" cy="${h / 2 + 62}" r="10" fill="#fff" stroke="${C.ink}" stroke-width="4"/>`
      : `<path d="M${tx * 0.3 - 30} ${h / 2 - 6} L ${tx} ${ty} L ${tx * 0.3 + 30} ${h / 2 - 6} Z" fill="#fff" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>`;
    return `<g id="${id}"><g id="${id}-in">${tail}
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${o.pensamento ? h / 2 : 36}" fill="#fff" stroke="${C.ink}" stroke-width="${SW}"/>
      ${o.pensamento ? "" : `<path d="M${tx * 0.3 - 26} ${h / 2 - 3} L ${tx * 0.3 + 26} ${h / 2 - 3}" stroke="#fff" stroke-width="8"/>`}
      ${txt}</g></g>`;
  }


  // Ator: pessoa do elenco já no enquadramento do palco. quem: nome do ELENCO ("ana") ou objeto de opções de person().
  // x: centro; o.y: linha dos pés (padrão PALCO.CHAO); o.escala multiplica a escala do palco (ex.: 0.8 = mais ao fundo);
  // o.pessoa: opções extras de person() (boca, propL, propR...). Partes animáveis: as de person() com o mesmo id.
  function ator(id, quem, x, o = {}) {
    const P = K.PALCO, s = +(P.ESCALA * (o.escala || 1)).toFixed(3);
    const base = typeof quem === "string" ? K.ELENCO[quem] : quem;
    const sombra = o.sombra === false ? "" : `<ellipse cx="0" cy="0" rx="62" ry="13" fill="#2a2320" opacity=".14"/>`;
    return `<g transform="translate(${x},${o.y ?? P.CHAO}) scale(${s})">${sombra}${person(id, { ...base, ...(o.pessoa || {}) })}</g>`;
  }

  // Roupas de figurante (gente do bairro ao fundo). i escolhe a roupa; sem boca animada.
  const ROUPAS = [
    { cabelo: "curto", shirt: "#f4a261", skin: "#e0ac69", hair: "#3b2416", pants: "#3d405b" },
    { cabelo: "coque", shirt: "#84a59d", skin: "#8d5524", hair: "#1f140d", pants: "#5c5470" },
    { cabelo: "chapeu", shirt: "#bc6c25", skin: "#f1c27d", hair: "#283618", pants: "#264653" },
    { cabelo: "rabo", shirt: "#b5838d", skin: "#c68642", hair: "#4a2c1d", pants: "#33415c" },
    { cabelo: "careca", shirt: "#6d6875", skin: "#e0ac69", hair: "#7a7a7a", pants: "#3d405b", bigode: true },
    { cabelo: "curto", shirt: "#2a9d8f", skin: "#ffdbac", hair: "#b08968", pants: "#4a4e69", oculos: true },
  ];
  function figurante(id, i = 0, o = {}) {
    return person(id, { ...ROUPAS[((i % ROUPAS.length) + ROUPAS.length) % ROUPAS.length], boca: o.boca || "smile" });
  }

  // Pessoa DE COSTAS (cabeça e ombros), para plateia, fila e primeiro plano: base dos ombros no (0,0), ~220 × 250.
  // <id>-cab (cabeça, pode balançar). i escolhe roupa/cabelo como em figurante().
  function costas(id, i = 0, o = {}) {
    const r = { ...ROUPAS[((i % ROUPAS.length) + ROUPAS.length) % ROUPAS.length], ...o };
    const cab = {
      curto: `<path d="M-56 -4 C -60 -64 60 -64 56 -4 C 52 26 -52 26 -56 -4 Z" fill="${r.hair}" stroke="${C.ink}" stroke-width="${SW}"/>`,
      coque: `<path d="M-56 0 C -60 -64 60 -64 56 0 C 52 30 -52 30 -56 0 Z" fill="${r.hair}" stroke="${C.ink}" stroke-width="${SW}"/><circle cx="0" cy="-58" r="26" fill="${r.hair}" stroke="${C.ink}" stroke-width="${SW}"/>`,
      rabo: `<path d="M-56 0 C -60 -64 60 -64 56 0 C 52 30 -52 30 -56 0 Z" fill="${r.hair}" stroke="${C.ink}" stroke-width="${SW}"/><path d="M-10 24 C -20 70 20 70 10 24 Z" fill="${r.hair}" stroke="${C.ink}" stroke-width="${SW}"/>`,
      careca: `<path d="M-50 20 C -64 0 -58 -16 -48 -14 M 50 20 C 64 0 58 -16 48 -14" fill="none" stroke="${r.hair}" stroke-width="14" stroke-linecap="round"/>`,
      chapeu: `<path d="M-80 -20 H 80 L 72 -8 H -72 Z" fill="${r.hair}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M-48 -20 C -48 -76 48 -76 48 -20 Z" fill="${r.hair}" stroke="${C.ink}" stroke-width="${SW}"/>`,
    }[r.cabelo || "curto"];
    return `<g id="${id}">
      <path d="M-110 0 C -110 -86 -64 -104 0 -104 C 64 -104 110 -86 110 0 Z" fill="${r.shirt}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <rect x="-22" y="-128" width="44" height="34" fill="${r.skin}" stroke="${C.ink}" stroke-width="4"/>
      <g transform="translate(0,-176)"><g id="${id}-cab">
        <circle cx="-56" cy="6" r="13" fill="${r.skin}" stroke="${C.ink}" stroke-width="4"/><circle cx="56" cy="6" r="13" fill="${r.skin}" stroke="${C.ink}" stroke-width="4"/>
        <circle r="56" fill="${r.skin}" stroke="${C.ink}" stroke-width="${SW}"/>${cab}</g></g></g>`;
  }


  Object.assign(K, { person, bubble, ator, figurante, costas });
})();
