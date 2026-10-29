// Motor 3D — monta o episódio: carrega a fonte do tema (as texturas de texto precisam dela) e chama build(canvas).
// episode é uma URL absoluta: um import() relativo aqui resolveria a partir de assets/motor/, não da página.
import { TEMA } from "../tema.js";

export async function mount({ canvas, episode }) {
  const f = TEMA.fontes.rotulo3d;
  await Promise.all([document.fonts.load(`800 64px "${f}"`), document.fonts.load(`700 64px "${f}"`)]);
  const module = await import(episode);
  return module.build(canvas);
}
