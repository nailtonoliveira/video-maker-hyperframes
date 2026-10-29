// Motor 3D — texto como textura, na fonte de rótulo do tema (montar.js a carrega antes de criar as texturas).
import * as THREE from "./three/three.module.min.js";
import { TEMA } from "../tema.js";

const FONTE = TEMA.fontes.rotulo3d;

export function label(text, color, px, worldH, weight = 800) {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  ctx.font = `${weight} ${px}px "${FONTE}"`;
  c.width = Math.ceil(ctx.measureText(text).width) + px * 0.4;
  c.height = Math.ceil(px * 1.3);
  ctx.font = `${weight} ${px}px "${FONTE}"`;
  ctx.fillStyle = typeof color === "number" ? "#" + color.toString(16).padStart(6, "0") : color; // número (COL.ink) ou CSS
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
