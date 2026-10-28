// Kit 3D do tech-lore — núcleo: palco, pós-processamento, utilidades e câmera.
// Regra de ouro: tudo que aparece na tela é função pura do tempo t (o HyperFrames busca quadros fora de ordem).
import * as THREE from "./three.module.min.js";
export { THREE };

export const COL = {
  ground: 0x080a0f,
  ink: 0xe6edf3,
  gray: 0x7d8590,
  mint: 0x00ff9d,
  alert: 0xff3366,
  cyan: 0x38bdf8,
  slate: 0x1c2531,
  dead: 0x4a1222,
};

// ---------- tempo e acaso determinísticos ----------
export function rng(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const hash = (i, k) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const E = {
  lin: (k) => k,
  expoOut: (k) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k)),
  p2in: (k) => k * k,
  p2out: (k) => 1 - (1 - k) * (1 - k),
  p2io: (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2),
  p3io: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  p3out: (k) => 1 - Math.pow(1 - k, 3),
  backOut: (k) => 1 + 2.70158 * Math.pow(k - 1, 3) + 1.70158 * Math.pow(k - 1, 2),
};
export const shake = (t, t0, amp, dur, f = 70) => (t < t0 || t > t0 + dur ? 0 : amp * (1 - (t - t0) / dur) * Math.sin((t - t0) * f));
// pisca com período que divide a duração do vídeo: o último quadro casa com o primeiro
export const blink = (t, period, phase = 0, duty = 0.5) => ((((t + phase) / period) % 1) + 1) % 1 < duty;
export const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);

// ---------- materiais: maquete técnica = sólido fosco + aresta de 1 px ----------
export const fill = (c, r = 0.85, extra = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0, flatShading: true, ...extra });
export const edge = (c, o = 1) => new THREE.LineBasicMaterial({ color: c, transparent: o < 1, opacity: o });
export const glowless = (c) => new THREE.MeshBasicMaterial({ color: c }); // LED/chama: cor plena, sem bloom

export function solid(geom, f, e, shadow = true) {
  const g = new THREE.Group();
  const mesh = new THREE.Mesh(geom, f);
  mesh.castShadow = shadow;
  mesh.receiveShadow = true;
  g.add(mesh);
  if (e) {
    const line = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 25), e);
    g.add(line);
    g.userData.line = line;
  }
  g.userData.mesh = mesh;
  return g;
}
export function setLook(obj, f, e) {
  obj.userData.mesh.material = f;
  if (obj.userData.line && e) obj.userData.line.material = e;
}

// texto como textura (JetBrains Mono já carregada pela composição)
export function label(text, color, px, worldH, weight = 800) {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  ctx.font = `${weight} ${px}px "JetBrains Mono"`;
  c.width = Math.ceil(ctx.measureText(text).width) + px * 0.4;
  c.height = Math.ceil(px * 1.3);
  ctx.font = `${weight} ${px}px "JetBrains Mono"`;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.fillText(text, px * 0.2, c.height / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  const w = (worldH * c.width) / c.height;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, worldH), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
  m.userData.w = w;
  return m;
}
// texto deitado no chão, lido por uma câmera que olha para −z
export function floorLabel(text, color, px, worldH, weight = 800) {
  const m = label(text, color, px, worldH, weight);
  m.rotation.x = -Math.PI / 2;
  return m;
}

export function gridLines(cx, cz, half, step, color, opacity, y) {
  const p = [];
  for (let i = -half; i <= half; i += step) p.push(cx - half, y, cz + i, cx + half, y, cz + i, cx + i, y, cz - half, cx + i, y, cz + half);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
  return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
}

// ---------- palco: renderer, céu, pós-processamento ----------
const FULL_VS = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";

// borrão de movimento da câmera: reprojeta cada pixel com a câmera do quadro anterior
const MBLUR_FS = `
uniform sampler2D tColor; uniform sampler2D tDepth;
uniform mat4 uInvViewProj; uniform mat4 uPrevViewProj; uniform float uShutter;
varying vec2 vUv;
void main(){
  float d = texture2D(tDepth, vUv).x;
  vec4 w = uInvViewProj * vec4(vUv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
  w /= w.w;
  vec4 pc = uPrevViewProj * w;
  vec2 puv = pc.xy / pc.w * 0.5 + 0.5;
  vec2 vel = clamp((vUv - puv) * uShutter, vec2(-0.035), vec2(0.035));
  if (uShutter <= 0.0 || length(vel) < 0.0006) { gl_FragColor = texture2D(tColor, vUv); return; }
  vec4 c = vec4(0.0);
  for (int i = 0; i < 10; i++) { float k = float(i) / 9.0 - 0.5; c += texture2D(tColor, vUv + vel * k); }
  gl_FragColor = c / 10.0;
}`;

// profundidade de campo (disco de Vogel), aberração cromática, vinheta, granulação e exposição
const FINAL_FS = `
#include <packing>
uniform sampler2D tColor; uniform sampler2D tDepth;
uniform float uNear; uniform float uFar; uniform float uFocus; uniform float uAperture; uniform float uMaxBlur;
uniform float uTime; uniform float uGrain; uniform float uCA; uniform float uVignette; uniform float uExposure;
uniform vec2 uRes;
varying vec2 vUv;
float viewDist(vec2 uv){ return -perspectiveDepthToViewZ(texture2D(tDepth, uv).x, uNear, uFar); }
float coc(float z){ return clamp(abs(z - uFocus) / max(z, 0.001) * uAperture, 0.0, uMaxBlur); }
void main(){
  float d0 = texture2D(tDepth, vUv).x;
  float z = viewDist(vUv);
  float c0 = d0 >= 0.99999 ? 0.0 : coc(z);
  vec3 col;
  if (c0 < 0.6) {
    col = texture2D(tColor, vUv).rgb;
  } else {
    vec3 acc = vec3(0.0); float ws = 0.0;
    int n = c0 < 4.0 ? 14 : 32;
    for (int i = 0; i < 32; i++) {
      if (i >= n) break;
      float r = sqrt((float(i) + 0.5) / float(n));
      float a = float(i) * 2.39996323;
      vec2 uv = vUv + vec2(cos(a), sin(a)) * r * c0 / uRes;
      float zs = viewDist(uv);
      float w = zs < z ? clamp(coc(zs) / c0, 0.0, 1.0) : 1.0;
      acc += texture2D(tColor, uv).rgb * w; ws += w;
    }
    col = acc / max(ws, 0.0001);
  }
  if (uCA > 0.0) {
    vec2 dir = vUv - 0.5;
    col.r = mix(col.r, texture2D(tColor, vUv + dir * uCA).r, 0.85);
    col.b = mix(col.b, texture2D(tColor, vUv - dir * uCA).b, 0.85);
  }
  col *= uExposure;
  vec2 q = (vUv - 0.5) * vec2(0.95, 1.1);
  col *= mix(1.0, smoothstep(0.95, 0.3, length(q)), uVignette);
  float g = fract(sin(dot(floor(vUv * uRes) + floor(uTime * 30.0) * 17.31, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  col += g * uGrain;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

export function createStage(canvas, W = 1080, H = 1920) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 10, 60);
  const cam = new THREE.PerspectiveCamera(50, W / H, 0.05, 6000);

  // céu: domo em degradê que acompanha a câmera
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: { top: { value: new THREE.Color() }, mid: { value: new THREE.Color() }, bottom: { value: new THREE.Color() } },
    vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader:
      "uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; varying vec3 vP;\nvoid main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(mid, top, pow(h, 0.5)) : mix(mid, bottom, pow(-h, 0.45)); gl_FragColor = vec4(c, 1.0);\n#include <colorspace_fragment>\n}",
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(4500, 32, 16), skyMat);
  sky.renderOrder = -1;
  sky.frustumCulled = false;
  scene.add(sky);

  // alvos de render em ponto flutuante (sem faixas nos escuros), com MSAA para as arestas de 1 px
  const rtScene = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
  rtScene.depthTexture = new THREE.DepthTexture(W, H);
  const rtBlur = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType });
  const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
  const postScene = new THREE.Scene();
  postScene.add(quad);
  const mblur = new THREE.ShaderMaterial({
    vertexShader: FULL_VS,
    fragmentShader: MBLUR_FS,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      tColor: { value: rtScene.texture },
      tDepth: { value: rtScene.depthTexture },
      uInvViewProj: { value: new THREE.Matrix4() },
      uPrevViewProj: { value: new THREE.Matrix4() },
      uShutter: { value: 0.5 },
    },
  });
  const final = new THREE.ShaderMaterial({
    vertexShader: FULL_VS,
    fragmentShader: FINAL_FS,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      tColor: { value: rtBlur.texture },
      tDepth: { value: rtScene.depthTexture },
      uNear: { value: 0.05 },
      uFar: { value: 6000 },
      uFocus: { value: 10 },
      uAperture: { value: 0 },
      uMaxBlur: { value: 14 },
      uTime: { value: 0 },
      uGrain: { value: 0.035 },
      uCA: { value: 0 },
      uVignette: { value: 0.55 },
      uExposure: { value: 1 },
      uRes: { value: new THREE.Vector2(W, H) },
    },
  });

  const vp = new THREE.Matrix4();
  const camT = new THREE.Matrix4();
  const prevCam = cam.clone();

  // post = { focus, aperture, ca, exposure, grain, vignette, shutter }; prev = {pos, look} do quadro anterior (ou null)
  function render(t, post, prev) {
    cam.updateMatrixWorld();
    sky.position.copy(cam.position);
    renderer.setRenderTarget(rtScene);
    renderer.render(scene, cam);

    // reprojeção relativa à câmera (em float32, coordenadas de mundo grandes perdem precisão)
    camT.makeTranslation(cam.position.x, cam.position.y, cam.position.z);
    vp.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse).multiply(camT);
    mblur.uniforms.uInvViewProj.value.copy(vp).invert();
    if (prev) {
      prevCam.copy(cam);
      prevCam.position.copy(prev.pos);
      prevCam.up.copy(cam.up);
      prevCam.lookAt(prev.look);
      prevCam.updateMatrixWorld();
      mblur.uniforms.uPrevViewProj.value.multiplyMatrices(prevCam.projectionMatrix, prevCam.matrixWorldInverse).multiply(camT);
      mblur.uniforms.uShutter.value = post.shutter ?? 0.4;
    } else {
      mblur.uniforms.uPrevViewProj.value.copy(vp);
      mblur.uniforms.uShutter.value = 0;
    }
    quad.material = mblur;
    renderer.setRenderTarget(rtBlur);
    renderer.render(postScene, postCam);

    const u = final.uniforms;
    u.uNear.value = cam.near;
    u.uFar.value = cam.far;
    u.uFocus.value = post.focus;
    u.uAperture.value = post.aperture ?? 0;
    u.uTime.value = t;
    u.uGrain.value = post.grain ?? 0.035;
    u.uCA.value = post.ca ?? 0;
    u.uVignette.value = post.vignette ?? 0.55;
    u.uExposure.value = post.exposure ?? 1;
    quad.material = final;
    renderer.setRenderTarget(null);
    renderer.render(postScene, postCam);
  }

  function setSky(env) {
    skyMat.uniforms.top.value.setHex(env.top);
    skyMat.uniforms.mid.value.setHex(env.mid);
    skyMat.uniforms.bottom.value.setHex(env.bottom);
    scene.fog.color.setHex(env.fog);
    scene.fog.near = env.fogNear;
    scene.fog.far = env.fogFar;
  }

  return { THREE, renderer, scene, cam, render, setSky };
}

// ---------- câmera por plano ----------
// shot = { a, b, base(t) -> Vector3, p0, p1, l0, l1, ease, hand }
export function shotAt(shots, t) {
  return shots.find((q) => t >= q.a && t < q.b) || shots[shots.length - 1];
}
// câmera na mão: frequências múltiplas de 2π/duração, para o último quadro casar com o primeiro
let LOOP_LEN = 0;
export function setLoop(seconds) {
  LOOP_LEN = seconds;
}
const handW = (w) => (LOOP_LEN ? (Math.max(1, Math.round((w * LOOP_LEN) / (2 * Math.PI))) * 2 * Math.PI) / LOOP_LEN : w);
export function cameraOf(shot, t) {
  const k = E[shot.ease || "p2io"](seg(t, shot.a, shot.b));
  const base = shot.base ? shot.base(t) : new THREE.Vector3();
  const pos = shot.path ? shot.path(t, k) : v3(shot.p0).lerp(v3(shot.p1), k).add(base);
  const look = shot.aim ? shot.aim(t, k) : v3(shot.l0).lerp(v3(shot.l1), k).add(base);
  const dist = pos.distanceTo(look);
  const hand = (shot.hand ?? 0.006) * dist;
  pos.x += hand * (Math.sin(t * handW(1.3)) + 0.5 * Math.sin(t * handW(3.1) + 1));
  pos.y += hand * (Math.sin(t * handW(1.7) + 2) + 0.5 * Math.sin(t * handW(2.6)));
  return { pos, look, dist };
}
