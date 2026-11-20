/* Kit visual "Contos do Dinheiro": ilustração 2D chapada desenhada em SVG por código.
   Tudo é determinístico (sem Math.random): cada peça devolve uma string SVG com ids prefixados.
   Origem das peças: base no (0,0) (pés da pessoa, pé da árvore, canto inferior esquerdo da casa). */
(function () {
  const C = {
    ink: "#2a2320",
    paper: "#fff6e3",
    gold: "#f2b134",
    goldDark: "#c98a12",
    leaf: "#4f9d5d",
    leafDark: "#3c7f49",
    leafLight: "#6cb874",
    trunk: "#8a5a3b",
    grass: "#7cb35b",
    grassDark: "#5e9a45",
    soil: "#8b5e3c",
    soilDark: "#6d452a",
    walk: "#e9dcc3",
    road: "#6b6b73",
    red: "#d64545",
    skyDay: ["#8fd0ea", "#e6f6f0"],
    skyDusk: ["#f39c6b", "#fde3b0"],
    skyNight: ["#24264f", "#4b4a86"],
  };
  const SW = 5; // espessura do traço

  // Pseudoaleatório com semente (determinístico).
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  function sky(id, kind) {
    const [a, b] = C[kind] || C.skyDay;
    return `<defs><linearGradient id="${id}-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
      <rect id="${id}" x="0" y="0" width="1080" height="1920" fill="url(#${id}-g)"/>`;
  }

  function cloud(id, x, y, s) {
    return `<g id="${id}" transform="translate(${x},${y}) scale(${s})"><g>
      <path d="M-90 20 a40 40 0 0 1 30 -55 a55 55 0 0 1 100 -5 a40 40 0 0 1 50 60 z" fill="#fff" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/></g></g>`;
  }

  function hills(id, y) {
    return `<g id="${id}"><path d="M0 ${y} Q 180 ${y - 120} 380 ${y - 40} T 760 ${y - 60} T 1080 ${y - 30} V ${y + 200} H 0 Z" fill="#a9d18e" stroke="${C.ink}" stroke-width="${SW}"/></g>`;
  }

  // Chão do bairro: grama, calçada e rua (decoração abaixo da faixa de texto).
  function ground(id, y) {
    let tufts = "";
    for (let i = 0; i < 14; i++) {
      const x = 30 + i * 78;
      tufts += `<path d="M${x} ${y + 40} l8 -18 l6 18 l8 -14 l4 14" fill="none" stroke="${C.grassDark}" stroke-width="4" stroke-linecap="round"/>`;
    }
    return `<g id="${id}">
      <rect x="-20" y="${y}" width="1120" height="${1940 - y}" fill="${C.grass}" stroke="${C.ink}" stroke-width="${SW}"/>
      ${tufts}
      <rect x="-20" y="${y + 330}" width="1120" height="70" fill="${C.walk}" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="-20" y="${y + 400}" width="1120" height="700" fill="${C.road}" stroke="${C.ink}" stroke-width="${SW}"/>
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="${40 + i * 230}" y="${y + 520}" width="120" height="16" rx="8" fill="#f4f1e8"/>`).join("")}
    </g>`;
  }

  // Árvore: base no (0,0); tamanho total ~560 px de altura. nFrutos moedas na copa (ids <id>-f0..).
  const FRUIT_POS = (() => {
    const r = rng(7);
    const out = [];
    const blobs = [[0, -340, 150], [-115, -290, 105], [115, -290, 105], [-60, -440, 95], [70, -430, 100]];
    for (let i = 0; i < 60; i++) {
      const [bx, by, br] = blobs[i % blobs.length];
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * (br - 30);
      out.push([Math.round(bx + Math.cos(a) * d), Math.round(by + Math.sin(a) * d)]);
    }
    return out;
  })();

  function tree(id, nFrutos = 0, opts = {}) {
    const leaf = opts.leaf || C.leaf;
    let fruits = "";
    for (let i = 0; i < nFrutos; i++) {
      const [x, y] = FRUIT_POS[i % FRUIT_POS.length];
      fruits += `<g id="${id}-f${i}" transform="translate(${x},${y})"><g class="fruta">${coinShape(15)}</g></g>`;
    }
    return `<g id="${id}"><g id="${id}-grow">
      <path d="M-26 0 C -20 -80 -16 -160 -14 -230 L 14 -230 C 16 -160 20 -80 26 0 Z" fill="${C.trunk}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M-6 -180 L -70 -250 M 6 -200 L 80 -260" stroke="${C.ink}" stroke-width="16" stroke-linecap="round"/>
      <path d="M-6 -180 L -70 -250 M 6 -200 L 80 -260" stroke="${C.trunk}" stroke-width="8" stroke-linecap="round"/>
      <g stroke="${C.ink}" stroke-width="${SW}">
        <circle cx="-115" cy="-290" r="105" fill="${C.leafDark}"/>
        <circle cx="115" cy="-290" r="105" fill="${C.leafDark}"/>
        <circle cx="0" cy="-340" r="150" fill="${leaf}"/>
        <circle cx="-60" cy="-440" r="95" fill="${leaf}"/>
        <circle cx="70" cy="-430" r="100" fill="${leaf}"/>
      </g>
      <path d="M-30 -440 a50 50 0 0 1 60 -30" fill="none" stroke="${C.leafLight}" stroke-width="10" stroke-linecap="round"/>
      <g id="${id}-frutos">${fruits}</g>
    </g></g>`;
  }

  // Broto: base no (0,0), ~90 px.
  function sprout(id) {
    return `<g id="${id}"><g id="${id}-grow">
      <path d="M0 0 C 0 -30 2 -60 0 -80" fill="none" stroke="${C.leafDark}" stroke-width="8" stroke-linecap="round"/>
      <path d="M0 -60 C -30 -90 -60 -70 -55 -50 C -35 -40 -15 -45 0 -60 Z" fill="${C.leafLight}" stroke="${C.ink}" stroke-width="4"/>
      <path d="M0 -75 C 30 -105 62 -88 58 -66 C 38 -56 16 -60 0 -75 Z" fill="${C.leaf}" stroke="${C.ink}" stroke-width="4"/>
    </g></g>`;
  }

  function coinShape(r) {
    return `<circle r="${r}" fill="${C.gold}" stroke="${C.ink}" stroke-width="4"/>
      <path d="M${r * 0.32} ${-r * 0.36} C ${r * 0.2} ${-r * 0.56} ${-r * 0.42} ${-r * 0.56} ${-r * 0.38} ${-r * 0.16} C ${-r * 0.34} ${r * 0.12} ${r * 0.38} ${-r * 0.02} ${r * 0.38} ${r * 0.24} C ${r * 0.38} ${r * 0.58} ${-r * 0.24} ${r * 0.56} ${-r * 0.36} ${r * 0.32} M 0 ${-r * 0.7} V ${r * 0.7}" fill="none" stroke="${C.goldDark}" stroke-width="${Math.max(2.5, r * 0.16)}" stroke-linecap="round"/>`;
  }
  function coin(id, r = 26) {
    return `<g id="${id}"><g>${coinShape(r)}</g></g>`;
  }

  // Casa: canto inferior esquerdo no (0,0); largura w.
  function house(id, o = {}) {
    const w = o.w || 380, h = o.h || 280, wall = o.wall || "#f4d58d", roof = o.roof || "#c8553d";
    return `<g id="${id}">
      <rect x="0" y="${-h}" width="${w}" height="${h}" fill="${wall}" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M-30 ${-h} L ${w / 2} ${-h - 170} L ${w + 30} ${-h} Z" fill="${roof}" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <rect x="${w * 0.12}" y="${-h + 60}" width="100" height="90" fill="#bfe3f2" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M${w * 0.12 + 50} ${-h + 60} V ${-h + 150} M ${w * 0.12} ${-h + 105} H ${w * 0.12 + 100}" stroke="${C.ink}" stroke-width="4"/>
      <rect x="${w * 0.6}" y="${-150}" width="90" height="150" rx="6" fill="#9c6644" stroke="${C.ink}" stroke-width="${SW}"/>
      <circle cx="${w * 0.6 + 72}" cy="-72" r="7" fill="${C.gold}" stroke="${C.ink}" stroke-width="3"/>
      ${o.num ? `<rect x="${w * 0.6 + 10}" y="-205" width="70" height="42" rx="6" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/><text x="${w * 0.6 + 45}" y="-174" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="30" fill="${C.ink}">${o.num}</text>` : ""}
    </g>`;
  }

  // Carrinho de bebê (base no (0,0)).
  function stroller(id) {
    return `<g id="${id}"><g id="${id}-in">
      <circle cx="-50" cy="-24" r="24" fill="#3d405b" stroke="${C.ink}" stroke-width="${SW}"/><circle cx="50" cy="-24" r="24" fill="#3d405b" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M-90 -60 H 90 A 90 70 0 0 1 -90 -60 Z" transform="scale(1,-1) translate(0,120)" fill="#f28482" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <circle cx="0" cy="-118" r="30" fill="#c68642" stroke="${C.ink}" stroke-width="${SW}"/>
      <path d="M-90 -150 A 90 90 0 0 1 10 -205 L 0 -60 Z" fill="#f7d6d0" stroke="${C.ink}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M90 -60 L 130 -160 H 160" fill="none" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/></g></g>`;
  }

  // Caixa de correio com nome (base no (0,0)).
  function mailbox(id, nome) {
    const w = Math.max(96, nome.length * 26 + 30);
    return `<g id="${id}"><rect x="-6" y="-70" width="12" height="70" fill="${C.trunk}" stroke="${C.ink}" stroke-width="4"/>
      <rect x="${-w / 2}" y="-122" width="${w}" height="56" rx="12" fill="${C.paper}" stroke="${C.ink}" stroke-width="${SW}"/>
      <text x="0" y="-82" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="32" fill="${C.ink}">${nome}</text></g>`;
  }

  function fence(id, x0, x1, y, color = "#fff6e3") {
    let p = "";
    for (let x = x0; x <= x1; x += 44) {
      p += `<path d="M${x} ${y} v -86 l 15 -18 l 15 18 v 86 z" fill="${color}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`;
    }
    return `<g id="${id}"><rect x="${x0 - 6}" y="${y - 66}" width="${x1 - x0 + 42}" height="14" fill="${color}" stroke="${C.ink}" stroke-width="4"/>${p}</g>`;
  }

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
        <text x="0" y="${-h / 2 + 92}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="54" fill="${C.ink}">${mes}</text>
        <text x="0" y="${-h / 2 + 148}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="44" fill="${C.red}">${ano}</text></g>`).join("");
    return `<g id="${id}">
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="12" fill="${C.paper}" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="36" rx="12" fill="${C.red}" stroke="${C.ink}" stroke-width="${SW}"/>
      <circle cx="${-w / 4}" cy="${-h / 2}" r="7" fill="${C.ink}"/><circle cx="${w / 4}" cy="${-h / 2}" r="7" fill="${C.ink}"/>
      ${pages}</g>`;
  }

  // Pessoa: pés no (0,0). tipo: adulto (~330 px) ou crianca (~230 px).
  // Partes animáveis: <id>-armL, <id>-armR, <id>-head, bocas <id>-m-smile|open|sad|flat (só 'boca' visível).
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
      return `<g transform="translate(${sx},-206)"><g id="${id}-arm${side}">
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

  // ---------- Ajudantes de animação (GSAP, sempre fromTo/set para ser seguro ao buscar quadros) ----------
  function brl(n) {
    const s = String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return "R$ " + s;
  }
  // Pula para dentro com exagero (estado final escala 1).
  function pop(tl, sel, t, o = {}) {
    tl.fromTo(sel, { scale: 0, opacity: 0, transformOrigin: o.origin || "50% 50%" },
      { scale: 1, opacity: 1, duration: o.dur || 0.42, ease: o.ease || "back.out(2.2)" }, t);
  }
  function out(tl, sel, t, dur = 0.2) {
    tl.to(sel, { opacity: 0, duration: dur, ease: "power2.in" }, t);
  }
  // Troca a boca visível (sem interpolação: uma "pose").
  function mouth(tl, id, name, t) {
    ["smile", "open", "sad", "flat"].forEach((n) => tl.set(`#${id}-m-${n}`, { opacity: n === name ? 1 : 0 }, t));
  }
  // Contador de dinheiro num <text>: segue a linha do tempo (onUpdate é chamado em toda busca).
  function counter(tl, sel, a, b, t, dur, fmt = brl) {
    const o = { v: a };
    tl.fromTo(o, { v: a }, {
      v: b, duration: dur, ease: "none", immediateRender: false,
      onUpdate: () => { const el = document.querySelector(sel); if (el) el.textContent = fmt(o.v); },
    }, t);
  }
  // Mostra só a página i do calendário no tempo t.
  function page(tl, id, n, i, t) {
    for (let k = 0; k < n; k++) tl.set(`#${id}-p${k}`, { opacity: k === i ? 1 : 0 }, t);
  }
  // Respiração de personagem (vida no repouso): pequenas oscilações com fase própria, só até 'fim'.
  function idle(tl, id, ini, fim, fase = 0) {
    const n = Math.max(1, Math.floor((fim - ini) / 1.6));
    for (let i = 0; i < n; i++) {
      const t = ini + i * 1.6 + (fase % 0.8);
      if (t + 1.6 > fim) break;
      tl.fromTo(`#${id}-body`, { y: 0 }, { y: -4, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: 1 }, t);
    }
  }

  // A rua (palco de casa): casas da Ana (esquerda) e do Bruno (direita), árvores na frente.
  // o: { ceu, anaFrutos, brunoFrutos, placas: [[l1,l2],[l1,l2]] } → ids p-ana-tree, p-bruno-tree, p-ana-placa, p-bruno-placa
  function street(p, o = {}) {
    const placa = (id, x, l) => l ? `<g transform="translate(${x},1070)">${sign(id, [[l[0], 30], [l[1], 50, l[2]]], { w: 290 })}</g>` : "";
    // Enquadramento fixo: tudo (menos o céu) ampliado 1,3× em torno do pé das árvores, para o assunto ocupar a faixa útil.
    return `${sky(p + "-sky", o.ceu || "skyDay")}
      <g transform="translate(540,1180) scale(1.3) translate(-540,-1180)">
      ${cloud(p + "-n1", 200, 380, 0.9)}${cloud(p + "-n2", 860, 470, 0.7)}
      ${hills(p + "-hills", 880)}
      ${ground(p + "-chao", 980)}
      <g transform="translate(40,990)">${house(p + "-casa-ana", { w: 330, wall: "#f4d58d", roof: "#c8553d" })}</g>
      <g transform="translate(710,990)">${house(p + "-casa-bruno", { w: 330, wall: "#a8c5e2", roof: "#3d5a80" })}</g>
      ${fence(p + "-cerca", 500, 556, 1190)}
      <g transform="translate(320,1180)">${tree(p + "-ana-tree", o.anaFrutos ?? 30)}</g>
      <g transform="translate(760,1180)">${tree(p + "-bruno-tree", o.brunoFrutos ?? 20)}</g>
      ${placa(p + "-ana-placa", 320, o.placas && o.placas[0])}
      ${placa(p + "-bruno-placa", 760, o.placas && o.placas[1])}
      ${o.extra || ""}
      </g>`;
  }

  // Corte do quintal (o chão visto em seção): céu em cima, grama na linha y, terra embaixo.
  function corte(p, y = 905) {
    let pedras = "";
    const r = rng(31);
    for (let i = 0; i < 18; i++) {
      const x = Math.round(r() * 1080), yy = Math.round(y + 120 + r() * 900), rr = 8 + Math.round(r() * 14);
      pedras += `<ellipse cx="${x}" cy="${yy}" rx="${rr * 1.4}" ry="${rr}" fill="${C.soilDark}" stroke="${C.ink}" stroke-width="3"/>`;
    }
    return `${sky(p + "-sky", "skyDay")}${cloud(p + "-n1", 200, 240, 0.9)}${cloud(p + "-n2", 880, 330, 0.7)}
      <rect x="-20" y="${y}" width="1120" height="${1940 - y}" fill="${C.soil}" stroke="${C.ink}" stroke-width="${SW}"/>
      <rect x="-20" y="${y + 380}" width="1120" height="${1940 - y}" fill="${C.soilDark}" opacity=".45"/>
      ${pedras}
      <rect x="-20" y="${y - 26}" width="1120" height="40" fill="${C.grass}" stroke="${C.ink}" stroke-width="${SW}"/>`;
  }

  // Elenco fixo da série (mesmas cores em todo episódio em que aparecem).
  const ELENCO = {
    ana: { cabelo: "coque", shirt: "#2a9d8f", skin: "#c68642", hair: "#2b1b12", pants: "#3d405b" },
    bruno: { cabelo: "curto", shirt: "#e76f51", skin: "#f1c27d", hair: "#6b3e26", pants: "#264653" },
    filha: { crianca: true, cabelo: "rabo", vestido: true, shirt: "#ffd166", skin: "#c68642", hair: "#2b1b12", pants: "#c68642" },
    vizinho: { cabelo: "careca", shirt: "#9b5de5", skin: "#e0ac69", hair: "#9a9a9a", pants: "#4a4e69" },
    vizinha: { cabelo: "chapeu", shirt: "#577590", skin: "#8d5524", hair: "#d64545", pants: "#33415c" },
  };

  window.KIT = { C, ELENCO, rng, street, corte, mailbox, stroller, sky, cloud, hills, ground, tree, sprout, coin, house, fence, sign, calendar, person, bubble,
    brl, pop, out, mouth, counter, page, idle };
})();
