// Motor 3D — materiais. Estilo "maquete" (o único da fase 1): sólido fosco + aresta de 1 px.
import * as THREE from "./three/three.module.min.js";
import { TEMA } from "../tema.js";

if (TEMA.material !== "maquete") throw new Error(`tema: material "${TEMA.material}" não suportado (só "maquete")`);

// hex do papel de cor do tema como número; o erro nomeia o papel que falta
export function color(papel) {
  const hex = TEMA.cores[papel];
  if (hex === undefined) throw new Error(`tema: falta a cor "${papel}"`);
  return parseInt(hex.slice(1), 16);
}

export const COL = {
  ground: color("chao"),
  ink: color("tinta"),
  gray: color("secundaria"),
  mint: color("ok"),
  alert: color("alerta"),
  cyan: color("destaque"),
  slate: color("ardosia"),
  dead: color("morto"),
};

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
