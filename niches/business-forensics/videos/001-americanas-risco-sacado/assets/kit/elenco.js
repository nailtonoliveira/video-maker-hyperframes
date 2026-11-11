// Kit 3D do business-forensics — Elenco procedural de peças de tabuleiro (Magnata, Perita, Contador, Manada, Fiscal).
import { THREE, solid, fill, edge, label, E, seg, hash, blink, loopPeriod, clamp } from "../motor/core.js";
import { C, MBF } from "./cores.js";

function cachedFace(w, h, drawFn) {
  const cache = new Map();
  return function getTex(key) {
    if (cache.has(key)) return cache.get(key);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    drawFn(c.getContext("2d"), key, w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    cache.set(key, tex);
    return tex;
  };
}

// ==================== 4.1 O Magnata ====================
export function makeMagnata({ escala = 1 } = {}) {
  const group = new THREE.Group();
  group.scale.setScalar(escala);
  const rig = new THREE.Group();
  group.add(rig);

  // Pedestal
  const base = solid(new THREE.CylinderGeometry(0.34, 0.36, 0.16, 18), MBF.nanquim, MBF.eOuro);
  base.position.y = 0.08;
  rig.add(base);

  // Torso trapezoidal em V
  const tShape = new THREE.Shape([
    new THREE.Vector2(-0.31, 0),
    new THREE.Vector2(0.31, 0),
    new THREE.Vector2(0.65, 1.25),
    new THREE.Vector2(-0.65, 1.25),
  ]);
  const tGeo = new THREE.ExtrudeGeometry(tShape, { depth: 0.52, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 1 });
  tGeo.translate(0, 0.16, -0.26);
  const torso = solid(tGeo, fill(0x2b1a1d, 0.85), MBF.eNanquim);
  rig.add(torso);

  // Gravata losango ouro
  const tieShape = new THREE.Shape([
    new THREE.Vector2(0, 0.7),
    new THREE.Vector2(0.11, 0.52),
    new THREE.Vector2(0, 0),
    new THREE.Vector2(-0.11, 0.52),
  ]);
  const tieGeo = new THREE.ExtrudeGeometry(tieShape, { depth: 0.04, bevelEnabled: false });
  tieGeo.translate(0, 0.65, 0.28);
  rig.add(solid(tieGeo, MBF.ouro, MBF.eNanquim));

  // Braços articulados no ombro
  const armL = new THREE.Group();
  armL.position.set(-0.62, 1.36, 0);
  const armLMesh = solid(new THREE.BoxGeometry(0.16, 0.62, 0.16), fill(0x2b1a1d, 0.85), MBF.eNanquim);
  armLMesh.position.y = -0.28;
  armL.add(armLMesh);

  const armR = new THREE.Group();
  armR.position.set(0.62, 1.36, 0);
  const armRMesh = solid(new THREE.BoxGeometry(0.16, 0.62, 0.16), fill(0x2b1a1d, 0.85), MBF.eNanquim);
  armRMesh.position.y = -0.28;
  armR.add(armRMesh);
  rig.add(armL, armR);

  // Cabeça + visor + gota de suor
  const head = solid(new THREE.SphereGeometry(0.3, 18, 14), MBF.cera, MBF.eNanquim);
  head.position.y = 1.72;
  rig.add(head);

  const sweat = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), MBF.uv);
  sweat.position.set(0.26, 1.82, 0.18);
  sweat.visible = false;
  rig.add(sweat);

  const getFace = cachedFace(256, 64, (ctx, key) => {
    const [est, blk] = key.split(":");
    ctx.fillStyle = "#120a0b";
    ctx.fillRect(0, 0, 256, 64);
    ctx.strokeStyle = est === "ganancioso" ? "#e9b949" : "#f2e8d5";
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = 6;
    if (blk === "1") {
      ctx.fillRect(52, 30, 48, 6);
      ctx.fillRect(156, 30, 48, 6);
      return;
    }
    if (est === "ganancioso") {
      for (const cx of [76, 180]) {
        ctx.beginPath();
        ctx.moveTo(cx, 12);
        ctx.lineTo(cx + 20, 32);
        ctx.lineTo(cx, 52);
        ctx.lineTo(cx - 20, 32);
        ctx.closePath();
        ctx.fill();
      }
    } else if (est === "pego") {
      for (const cx of [76, 180]) {
        ctx.beginPath();
        ctx.arc(cx, 36, 14, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (est === "derrotado") {
      for (const cx of [76, 180]) {
        ctx.beginPath();
        ctx.arc(cx, 24, 16, 0.2, Math.PI - 0.2);
        ctx.stroke();
      }
    } else if (est === "nervoso") {
      ctx.fillRect(70, 28, 12, 12);
      ctx.fillRect(174, 28, 12, 12);
    } else {
      for (const cx of [76, 180]) {
        ctx.beginPath();
        ctx.arc(cx, 38, 16, Math.PI, 0);
        ctx.stroke();
      }
      ctx.fillRect(154, 12, 48, 5);
    }
  });

  const visorMat = new THREE.MeshBasicMaterial({ map: getFace("confiante:0") });
  const visor = solid(new THREE.BoxGeometry(0.5, 0.13, 0.08), MBF.nanquim, MBF.eOuro);
  visor.position.set(0, 1.72, 0.26);
  const visorFace = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.11), visorMat);
  visorFace.position.z = 0.042;
  visor.add(visorFace);
  rig.add(visor);

  // Auréola inteira e metades para fall(k)
  const halo = solid(new THREE.TorusGeometry(0.42, 0.05, 10, 24), MBF.ouro, MBF.eNanquim);
  halo.rotation.x = Math.PI / 2 + 0.21;
  halo.position.y = 2.25;
  const haloL = solid(new THREE.TorusGeometry(0.42, 0.05, 10, 12, Math.PI), MBF.ouro, MBF.eNanquim);
  const haloR = solid(new THREE.TorusGeometry(0.42, 0.05, 10, 12, Math.PI), MBF.ouro, MBF.eNanquim);
  haloL.visible = false;
  haloR.visible = false;
  rig.add(halo, haloL, haloR);

  let estadoAtual = "confiante";

  function rosto(estado, isBlink = false) {
    estadoAtual = estado;
    visorMat.map = getFace(`${estado}:${isBlink ? 1 : 0}`);
    sweat.visible = estado === "nervoso" || estado === "pego";
  }

  function act(t, modo = "idle", o = {}) {
    const loop = o.loop || 52;
    const P1 = o.P || loopPeriod(loop, 2.4);
    const P2 = loopPeriod(loop, 0.5);
    const P3 = loopPeriod(loop, 0.11);
    const b = blink(t, loopPeriod(loop, 3.2), 0.2, 0.06);

    rig.position.set(0, 0, 0);
    rig.rotation.set(0, 0, 0);
    rig.scale.set(1, 1, 1);
    armL.rotation.set(0, 0, 0);
    armR.rotation.set(0, 0, 0);
    halo.visible = true;
    haloL.visible = false;
    haloR.visible = false;
    halo.position.set(0, 2.25, 0);
    const nSpin = Math.max(1, Math.round(loop / 4));
    halo.rotation.set(Math.PI / 2 + 0.21, 0, (2 * Math.PI * nSpin * t) / loop);

    if (modo === "celebrate") {
      const s = Math.abs(Math.sin((Math.PI * t) / P2));
      rig.position.y = 0.22 * s;
      rig.scale.y = 1 - 0.12 * Math.max(0, Math.cos((2 * Math.PI * t) / P2));
      armL.rotation.z = 2.5;
      armR.rotation.z = -2.5;
      halo.rotation.z = (2 * Math.PI * nSpin * 3 * t) / loop;
      rosto(o.estado || "confiante", b);
    } else if (modo === "point") {
      const k = E.backOut(seg(t, o.t0 || 0, (o.t0 || 0) + 0.3));
      armR.rotation.x = -1.35 * k;
      rig.rotation.x = 0.08 * k;
      rosto(o.estado || "ganancioso", b);
    } else if (modo === "panic") {
      rig.rotation.z = 0.06 * Math.sin((2 * Math.PI * t) / P3);
      rig.position.x = 0.03 * Math.sin((2 * Math.PI * t) / P3 + 1.1);
      halo.rotation.x = Math.PI / 2 + 0.3 * Math.sin((2 * Math.PI * t) / P3);
      rosto("pego", b);
    } else if (modo === "fall") {
      const k = clamp(o.k ?? 0, 0, 1);
      rig.rotation.x = 1.35 * E.p2in(k);
      rig.position.y = -0.4 * k;
      halo.visible = k < 0.05;
      haloL.visible = k >= 0.05;
      haloR.visible = k >= 0.05;
      haloL.position.set(-0.5 * k, 2.25 - 1.6 * k * k, 0);
      haloR.position.set(0.5 * k, 2.25 - 1.6 * k * k, 0);
      haloL.rotation.set(Math.PI / 2, 0, k * 1.5);
      haloR.rotation.set(Math.PI / 2, Math.PI, -k * 1.5);
      rosto("derrotado", b);
    } else {
      rig.rotation.z = 0.035 * Math.sin((2 * Math.PI * t) / P1);
      rig.position.y = 0.02 * (1 - Math.cos((2 * Math.PI * t) / P1));
      rosto(o.estado || estadoAtual, b);
    }
  }

  return { group, act, rosto };
}

// ==================== 4.2 A Perita ====================
export function makePerita({ escala = 1 } = {}) {
  const group = new THREE.Group();
  group.scale.setScalar(escala);
  const rig = new THREE.Group();
  group.add(rig);

  // Corpo sino de sobretudo
  const coatPts = [new THREE.Vector2(0.55, 0), new THREE.Vector2(0.42, 0.55), new THREE.Vector2(0.22, 1.15), new THREE.Vector2(0, 1.15)];
  const coat = solid(new THREE.LatheGeometry(coatPts, 20), MBF.bege, MBF.eNanquim);
  rig.add(coat);

  // Gola + cabo
  for (const sx of [-1, 1]) {
    const col = solid(new THREE.BoxGeometry(0.28, 0.3, 0.04), MBF.taupe, MBF.eNanquim);
    col.position.set(sx * 0.14, 1.05, 0.22);
    col.rotation.z = sx * 0.35;
    rig.add(col);
  }
  const neck = solid(new THREE.CylinderGeometry(0.07, 0.07, 0.4, 12), MBF.nanquim, MBF.eNanquim);
  neck.position.y = 1.35;
  rig.add(neck);

  // Cabeça-lupa Torus + lente com olho único
  const rim = solid(new THREE.TorusGeometry(0.46, 0.08, 12, 24), MBF.uv, MBF.eNanquim);
  rim.position.y = 2.02;
  rig.add(rim);

  const getEye = cachedFace(256, 256, (ctx, key) => {
    const [est, blk] = key.split(":");
    ctx.fillStyle = "#f2e8d5";
    ctx.fillRect(0, 0, 256, 256);
    if (blk === "1") {
      ctx.fillStyle = "#1c1214";
      ctx.fillRect(0, 0, 256, 256);
      return;
    }
    const rIris = est === "descoberta" ? 72 : 56;
    const rPupil = est === "foco" ? 18 : 28;
    ctx.fillStyle = "#9b8cff";
    ctx.beginPath();
    ctx.arc(128, 128, rIris, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#120a0b";
    ctx.beginPath();
    ctx.arc(128, 128, rPupil, 0, Math.PI * 2);
    ctx.fill();
    if (est === "foco" || est === "desconfiada") {
      ctx.fillStyle = "#cbbd9f";
      ctx.fillRect(0, 0, 256, est === "desconfiada" ? 110 : 72);
    }
  });

  const lensMat = new THREE.MeshBasicMaterial({ map: getEye("scan:0") });
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.04, 24), lensMat);
  lens.rotation.x = Math.PI / 2;
  lens.position.y = 2.02;
  rig.add(lens);

  // Mão direita + lanterna UV + cone UV
  const arm = new THREE.Group();
  arm.position.set(0.48, 0.92, 0.25);
  const hand = solid(new THREE.SphereGeometry(0.09, 10, 8), MBF.bege, MBF.eNanquim);
  const torch = solid(new THREE.CylinderGeometry(0.07, 0.07, 0.36, 12), MBF.nanquim, MBF.eUv);
  torch.rotation.x = Math.PI / 2;
  torch.position.z = 0.18;
  const uvConeMat = new THREE.MeshBasicMaterial({
    color: C.uv,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const uvCone = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 1.4, 4.0, 20, 1, true), uvConeMat);
  uvCone.rotation.x = -Math.PI / 2;
  uvCone.position.z = 2.2;
  uvCone.renderOrder = 2;
  arm.add(hand, torch, uvCone);
  rig.add(arm);

  let estadoAtual = "scan";
  function rosto(estado, isBlink = false) {
    estadoAtual = estado;
    lensMat.map = getEye(`${estado}:${isBlink ? 1 : 0}`);
  }

  function act(t, modo = "idle", o = {}) {
    const loop = o.loop || 52;
    const Ps = o.P || loopPeriod(loop, 2.0);
    const b = blink(t, loopPeriod(loop, 3.2), 0.7, 0.06);

    rig.position.set(0, 0, 0);
    rig.rotation.set(0, 0, 0);
    rig.scale.set(1, 1 + 0.015 * Math.sin((2 * Math.PI * t) / loopPeriod(loop, 3.2)), 1);
    arm.rotation.set(0, 0, 0);
    uvCone.visible = o.uv !== false;

    if (modo === "scan") {
      rig.rotation.y = 0.45 * Math.sin((2 * Math.PI * t) / Ps);
      arm.rotation.y = 0.35 * Math.sin((2 * Math.PI * t) / Ps - 0.4);
      rosto("scan", b);
    } else if (modo === "lean") {
      const k = clamp(o.k ?? 1, 0, 1);
      rig.rotation.x = 0.3 * E.p2out(k);
      rosto("foco", b);
    } else if (modo === "nod") {
      const k = seg(t, o.t0 || 0, (o.t0 || 0) + 0.5);
      rig.rotation.x = 0.12 * Math.sin(Math.PI * k);
      rosto("descoberta", b);
    } else {
      rosto(o.estado || estadoAtual, b);
    }
  }

  return { group, act, rosto };
}

// ==================== 4.3 O Contador ====================
export function makeContador({ escala = 1, livros = 4 } = {}) {
  const group = new THREE.Group();
  group.scale.setScalar(escala);
  const rig = new THREE.Group();
  group.add(rig);

  for (const sx of [-1, 1]) {
    const leg = solid(new THREE.BoxGeometry(0.14, 0.3, 0.14), MBF.nanquim, MBF.eNanquim);
    leg.position.set(sx * 0.2, 0.15, 0);
    rig.add(leg);
  }

  const bookMats = [MBF.mogno, MBF.vinho, fill(0x2b1a1d, 0.85)];
  const offsetsX = [0, 0.06, -0.05, 0.04];
  const rotsY = [0, 0.07, -0.05, 0.09];
  const bookMeshes = [];
  for (let i = 0; i < livros; i++) {
    const b = solid(new THREE.BoxGeometry(0.9, 0.22, 0.62), bookMats[i % bookMats.length], MBF.eNanquim);
    const p0 = new THREE.Vector3(offsetsX[i % offsetsX.length], 0.41 + i * 0.22, 0);
    b.position.copy(p0);
    b.rotation.y = rotsY[i % rotsY.length];
    rig.add(b);
    bookMeshes.push({ b, p0, ry: b.rotation.y, i });
  }

  const headY = 0.32 + livros * 0.22 + 0.26;
  const head = solid(new THREE.BoxGeometry(0.62, 0.52, 0.3), MBF.nanquim, MBF.eOuro);
  head.position.y = headY;
  rig.add(head);

  const getLcd = cachedFace(256, 96, (ctx, key) => {
    const [est] = key.split(":");
    ctx.fillStyle = "#1c1214";
    ctx.fillRect(0, 0, 256, 96);
    ctx.fillStyle = est === "pego" ? "#ff5a3c" : "#e9b949";
    ctx.font = '700 44px "IBM Plex Mono", monospace';
    ctx.textBaseline = "middle";
    const txt = est === "pego" ? "O O ERR" : est === "escondido" ? "-  -" : est === "calculando" ? "o o ###" : "o   o";
    ctx.fillText(txt, 28, 48);
  });
  const lcdMat = new THREE.MeshBasicMaterial({ map: getLcd("normal:0") });
  const lcd = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.22), lcdMat);
  lcd.position.set(0, 0.08, 0.155);
  head.add(lcd);

  // Braço direito com lápis
  const armR = new THREE.Group();
  armR.position.set(0.48, headY - 0.3, 0.1);
  const pencil = solid(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8), MBF.ouro, MBF.eNanquim);
  pencil.rotation.z = 0.6;
  pencil.position.set(0.12, -0.1, 0.15);
  armR.add(pencil);
  rig.add(armR);

  function rosto(estado) {
    lcdMat.map = getLcd(`${estado}:0`);
  }

  function act(t, modo = "idle", o = {}) {
    const loop = o.loop || 52;
    const Pw = loopPeriod(loop, 0.18);
    const Pn = loopPeriod(loop, 0.35);

    rig.position.set(0, 0, 0);
    rig.scale.set(1, 1, 1);
    armR.rotation.set(0, 0, 0);
    bookMeshes.forEach(({ b, p0, ry }) => {
      b.position.copy(p0);
      b.rotation.set(0, ry, 0);
    });
    head.position.set(0, headY, 0);

    if (modo === "scribble") {
      armR.rotation.z = 0.5 + 0.25 * Math.sin((2 * Math.PI * t) / Pw);
      rig.position.y = 0.01 * Math.abs(Math.sin((2 * Math.PI * t) / Pw));
      rosto("calculando");
    } else if (modo === "nervous") {
      bookMeshes.forEach(({ b, p0, i }) => {
        b.position.x = p0.x + 0.05 * Math.sin((2 * Math.PI * t) / Pn + 1.3 * i);
      });
      rosto("nervoso");
    } else if (modo === "hide") {
      const k = clamp(o.k ?? 1, 0, 1);
      rig.scale.set(1 + 0.1 * k, 1 - 0.25 * E.backOut(k), 1);
      rosto("escondido");
    } else if (modo === "topple") {
      const k = clamp(o.k ?? 0, 0, 1);
      bookMeshes.forEach(({ b, p0, i }) => {
        const vx = (hash(i, 1) - 0.5) * 1.2;
        const vy = (1 + hash(i, 2)) * 1.2;
        const vz = (hash(i, 3) - 0.5) * 1.2;
        b.position.set(p0.x + vx * k, Math.max(0.12, p0.y + vy * k - 4.9 * k * k), p0.z + vz * k);
      });
      rosto("pego");
    } else {
      rig.position.y = 0.015 * Math.sin((2 * Math.PI * t) / loopPeriod(loop, 1.6));
      rosto(o.estado || "normal");
    }
  }

  return { group, act, rosto };
}

// ==================== 4.4 A Manada (InstancedMesh + casca BackSide) ====================
export function makeManada({ count = 36, cols = 9, spacing = 0.75, seed = 5 } = {}) {
  const group = new THREE.Group();
  const pawnPts = [
    new THREE.Vector2(0.32, 0),
    new THREE.Vector2(0.12, 0.42),
    new THREE.Vector2(0.2, 0.52),
    new THREE.Vector2(0.1, 0.6),
    new THREE.Vector2(0.17, 0.76),
    new THREE.Vector2(0, 0.9),
  ];
  const geo = new THREE.LatheGeometry(pawnPts, 14);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, flatShading: true });
  const shellGeo = geo.clone();
  shellGeo.scale(1.06, 1.04, 1.06);
  const shellMat = new THREE.MeshBasicMaterial({ color: C.nanquim, side: THREE.BackSide });

  const bodyMesh = new THREE.InstancedMesh(geo, bodyMat, count);
  const shellMesh = new THREE.InstancedMesh(shellGeo, shellMat, count);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  bodyMesh.frustumCulled = false;
  shellMesh.frustumCulled = false;
  group.add(bodyMesh, shellMesh);

  const rows = Math.ceil(count / cols);
  const baseCoords = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const x = (c - (cols - 1) / 2) * spacing;
    const z = (r - (rows - 1) / 2) * spacing;
    baseCoords.push({ x, z, c, r });
  }

  const m4 = new THREE.Matrix4();
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const eul = new THREE.Euler();
  const scl = new THREE.Vector3();
  const col = new THREE.Color();
  const cPapel = new THREE.Color(C.papel);
  const cOuro = new THREE.Color(C.ouro);
  const cFraude = new THREE.Color(C.fraude);
  const cSepia = new THREE.Color(C.sepia);

  function act(t, modo = "euforia", o = {}) {
    const loop = o.loop || 52;
    const Pe = loopPeriod(loop, 0.6);
    const Pp = loopPeriod(loop, 0.12);
    const k = clamp(o.k ?? 0, 0, 1);

    for (let i = 0; i < count; i++) {
      const b = baseCoords[i];
      let x = b.x;
      let y = 0;
      let z = b.z;
      let rx = 0;
      let sy = 1;

      if (modo === "euforia") {
        y = 0.25 * Math.max(0, Math.sin((2 * Math.PI * t) / Pe - 0.35 * b.c));
        sy = 1 - 0.1 * (1 - y / 0.25);
        col.copy(cPapel).lerp(cOuro, 0.35);
      } else if (modo === "duvida") {
        rx = -0.12 * k;
        col.copy(cPapel);
      } else if (modo === "panico") {
        const ang = Math.atan2(b.z, b.x || 0.01);
        const rad = 1.8 * E.p2out(k) * (0.6 + 0.4 * hash(i + seed, 3));
        const trem = 0.03 * Math.sin((2 * Math.PI * t) / Pp + 6.28 * hash(i + seed, 4));
        x += Math.cos(ang) * rad + trem;
        z += Math.sin(ang) * rad + trem;
        col.copy(cPapel).lerp(cFraude, 0.4 * k);
      } else if (modo === "ruina") {
        const di = 0.5 * hash(i + seed, 7);
        rx = 1.5708 * E.p2in(seg(k, di, di + 0.4));
        col.copy(cPapel).lerp(cSepia, k);
      } else {
        col.copy(cPapel);
      }

      pos.set(x, y, z);
      eul.set(rx, 0, 0);
      quat.setFromEuler(eul);
      scl.set(1, sy, 1);
      m4.compose(pos, quat, scl);
      bodyMesh.setMatrixAt(i, m4);
      shellMesh.setMatrixAt(i, m4);
      bodyMesh.setColorAt(i, col);
    }
    bodyMesh.instanceMatrix.needsUpdate = true;
    shellMesh.instanceMatrix.needsUpdate = true;
    if (bodyMesh.instanceColor) bodyMesh.instanceColor.needsUpdate = true;
  }

  return { group, act };
}

// ==================== 4.5 O Fiscal ====================
export function makeFiscal({ escala = 1, texto = "FRAUDE" } = {}) {
  const group = new THREE.Group();
  group.scale.setScalar(escala);
  const rig = new THREE.Group();
  group.add(rig);

  // Arquivo de aço sobre 4 pés
  for (const [fx, fz] of [[-0.38, -0.28], [0.38, -0.28], [-0.38, 0.28], [0.38, 0.28]]) {
    const foot = solid(new THREE.BoxGeometry(0.1, 0.12, 0.1), MBF.nanquim, MBF.eNanquim);
    foot.position.set(fx, 0.06, fz);
    rig.add(foot);
  }
  const body = solid(new THREE.BoxGeometry(0.95, 1.9, 0.75), MBF.mogno, MBF.eNanquim);
  body.position.y = 0.12 + 0.95;
  rig.add(body);

  // 3 gavetas
  const drawerLabels = ["2001", "PROVAS", "AUTOS"];
  const drawers = [];
  for (let i = 0; i < 3; i++) {
    const dy = 1.65 - i * 0.58;
    const dr = new THREE.Group();
    dr.position.set(0, dy, 0.39);
    const face = solid(new THREE.BoxGeometry(0.85, 0.52, 0.04), MBF.mogno, MBF.eTaupe);
    const handle = solid(new THREE.BoxGeometry(0.3, 0.05, 0.06), MBF.taupe, MBF.eNanquim);
    handle.position.set(0, -0.1, 0.04);
    const lbl = label(drawerLabels[i], C.papel, 64, 0.12, 700);
    lbl.position.set(0, 0.08, 0.025);
    dr.add(face, handle, lbl);
    rig.add(dr);
    drawers.push({ dr, baseZ: 0.39 });
  }

  // Visor na gaveta de cima
  const getSlit = cachedFace(256, 48, (ctx, key) => {
    const [est, blk] = key.split(":");
    ctx.fillStyle = "#120a0b";
    ctx.fillRect(0, 0, 256, 48);
    if (blk === "1") return;
    ctx.strokeStyle = est === "veredito" ? "#ff5a3c" : "#f2e8d5";
    ctx.lineWidth = 8;
    for (const [x0, x1, dy] of [[44, 108, est === "veredito" ? 8 : 0], [148, 212, est === "veredito" ? -8 : 0]]) {
      ctx.beginPath();
      ctx.moveTo(x0, 24 - dy);
      ctx.lineTo(x1, 24 + dy);
      ctx.stroke();
    }
  });
  const slitMat = new THREE.MeshBasicMaterial({ map: getSlit("neutro:0") });
  const slit = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.12), slitMat);
  slit.position.set(0, 1.9, 0.415);
  rig.add(slit);

  // Braço-carimbo em (0.62, 1.70, 0)
  const stampArm = new THREE.Group();
  stampArm.position.set(0.68, 1.7, 0.25);
  const handleCyl = solid(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 14), MBF.nanquim, MBF.eTaupe);
  handleCyl.position.y = 0.25;
  const knob = solid(new THREE.SphereGeometry(0.16, 12, 10), MBF.nanquim, MBF.eTaupe);
  knob.position.y = 0.56;
  const stampBase = solid(new THREE.BoxGeometry(0.8, 0.22, 0.5), MBF.lacre, MBF.eNanquim);
  stampBase.position.y = -0.08;
  const stampLbl = label(texto.slice(0, 10), "#fff4e0", 64, 0.16, 700);
  stampLbl.position.set(0, -0.08, 0.255);
  stampArm.add(handleCyl, knob, stampBase, stampLbl);
  rig.add(stampArm);

  function rosto(estado, isBlink = false) {
    slitMat.map = getSlit(`${estado}:${isBlink ? 1 : 0}`);
  }

  function act(t, modo = "idle", o = {}) {
    const loop = o.loop || 52;
    const b = blink(t, loopPeriod(loop, 3.6), 0.4, 0.05);
    rig.position.set(0, 0, o.z0 || 0);
    rig.scale.set(1, 1, 1);
    stampArm.position.set(0.68, 1.7, 0.25);
    stampArm.rotation.set(0, 0, 0);
    drawers[0].dr.position.z = drawers[0].baseZ;

    if (modo === "advance") {
      const k = clamp(o.k ?? 0, 0, 1);
      rig.position.z = (o.z0 || 0) + (o.D || 1.5) * E.p3io(k);
      rosto("neutro", b);
    } else if (modo === "raise") {
      const k = clamp(o.k ?? 0, 0, 1);
      stampArm.position.y = 1.7 + 0.9 * E.p2out(k);
      stampArm.rotation.x = -0.6 * k;
      rosto("veredito", b);
    } else if (modo === "slam") {
      const t0 = o.t0 ?? 33.4;
      if (t < t0) {
        const s = seg(t, t0 - 0.14, t0);
        const drop = E.p2in(s) * E.p2in(s);
        stampArm.position.y = 0.22 + (2.6 - 0.22) * (1 - drop);
      } else {
        stampArm.position.y = 0.22;
        const rec = E.backOut(seg(t, t0, t0 + 0.18));
        rig.scale.y = 0.92 + 0.08 * rec;
      }
      rosto("veredito", b);
    } else if (modo === "drawer") {
      const k = clamp(o.k ?? 0, 0, 1);
      drawers[0].dr.position.z = drawers[0].baseZ + 0.6 * E.p2out(k);
      rosto("neutro", b);
    } else {
      rosto(o.estado || "neutro", b);
    }
  }

  return { group, act, rosto };
}
