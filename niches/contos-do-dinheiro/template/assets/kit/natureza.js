/* Kit Contos do Dinheiro · Céu, nuvem, morros, chão, árvore, broto, casa, carrinho de bebê, caixa de correio, cerca e o quintal em corte. */
(function () {
  const K = window.KIT, { C, SW, T, rng } = K;

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
    const r = K.rng(7);
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
      fruits += `<g id="${id}-f${i}" transform="translate(${x},${y})"><g class="fruta">${K.coinShape(15)}</g></g>`;
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

  // Corte do quintal (o chão visto em seção): céu em cima, grama na linha y, terra embaixo.
  function corte(p, y = 905) {
    let pedras = "";
    const r = K.rng(31);
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

  // Gota de suor: centro no (0,0).
  function drop(id) {
    return `<g id="${id}"><path d="M0 -26 C 14 -6 18 4 18 12 A 18 18 0 0 1 -18 12 C -18 4 -14 -6 0 -26 Z" fill="#8fd0ea" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/></g>`;
  }

  Object.assign(K, { sky, cloud, hills, ground, tree, sprout, house, stroller, mailbox, fence, corte, drop });
})();
