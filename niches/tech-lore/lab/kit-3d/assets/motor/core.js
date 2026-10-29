// Motor 3D — núcleo: palco (renderer, céu, pós-processamento) e o laço do episódio.
// Regra de ouro: tudo que aparece na tela é função pura do tempo t (o HyperFrames busca quadros fora de ordem).
// Reexporta THREE e os outros módulos do motor, para o kit e o episódio importarem de um lugar só.
import * as THREE from "./three/three.module.min.js";
import { TEMA } from "../tema.js";
import { shake } from "./util.js";
import { shotAt, cameraOf } from "./camera.js";
export { THREE };
export * from "./util.js";
export * from "./camera.js";
export * from "./materiais.js";
export * from "./texto.js";
export * from "./mundos.js";

// padrões de pós do tema, nos nomes que o render do palco lê
const P = TEMA.pos;
const POST = { vignette: P.vinheta, shutter: P.obturador, ca: P.aberracao, grain: P.granulacao, exposure: P.exposicao };

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
      uShutter: { value: POST.shutter },
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
      uGrain: { value: POST.grain },
      uCA: { value: POST.ca },
      uVignette: { value: POST.vignette },
      uExposure: { value: POST.exposure },
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
      mblur.uniforms.uShutter.value = post.shutter ?? POST.shutter;
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
    u.uGrain.value = post.grain ?? POST.grain; // ruído novo a cada quadro multiplica o arquivo (~12x a CRF 16): use só em planos curtos
    u.uCA.value = post.ca ?? POST.ca;
    u.uVignette.value = post.vignette ?? POST.vignette;
    u.uExposure.value = post.exposure ?? POST.exposure;
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

// ---------- laço do episódio: plano → céu → câmera → cena → pós ----------
// shots: planos de camera.js (+ env, chave de skies; + shake = [t0, amp, dur, f] opcional)
// update(t, sh, c): põe a cena no tempo t; post(t, sh, c): campos de pós que sobrepõem os padrões do tema
export function createEpisode(S, { loop, fps = 30, shots, skies, update, post }) {
  function render(t) {
    const sh = shotAt(shots, t);
    S.setSky(skies[sh.env]);
    const c = cameraOf(sh, t, loop);
    if (sh.shake) c.pos.y += shake(t, ...sh.shake);
    S.cam.position.copy(c.pos);
    S.cam.up.set(0, 1, 0);
    S.cam.lookAt(c.look);
    // quadro anterior para o borrão de movimento (só dentro do mesmo plano; sem o tremor)
    const tp = t - 1 / fps;
    const prev = tp >= sh.a ? cameraOf(sh, tp, loop) : null;
    if (update) update(t, sh, c);
    S.render(t, { ...POST, ...(post ? post(t, sh, c) : {}) }, prev);
  }
  return { render };
}
