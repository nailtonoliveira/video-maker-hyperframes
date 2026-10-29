# Motor 3D (Three.js) — como escrever o episódio

O mundo 3D deste vídeo é um módulo `assets/episode/scene.js` que usa o motor copiado para `assets/motor/` (congelado
neste vídeo) e o kit do nicho em `assets/kit/` (peças específicas do nicho, documentadas pelo nicho). Não modele palco,
câmera nem pós-processamento do zero, e não edite `assets/motor/` nem `assets/tema.js`: as cores e fontes vêm do tema.

## Regras de ouro (o render busca quadros fora de ordem)
- Tudo na tela é **função pura de `t`**. Proibido `Math.random()` (use `rng(seed)` e `hash(i, k)`), `Date.now()`,
  `requestAnimationFrame`, rede, e qualquer estado guardado entre chamadas de `render(t)`.
- **Granulação 0** (padrão do tema). Ruído novo a cada quadro multiplica o arquivo por ~12.
- **Coordenadas perto da origem.** Uma placa/cena interior bem longe da Terra vai numa base fixa (`base`), mas não passe
  de alguns milhares de unidades; float32 perde precisão e o desfoque de movimento treme.
- **Loop:** o último quadro tem que casar com o primeiro. Períodos de piscar e de balanço de câmera dividem a duração
  do loop: use `loopPeriod(loop, want)` e `blink(t, period)`. A câmera na mão já respeita `loop`.
- O vídeo é autocontido: nada fora da pasta. Imports relativos ao próprio módulo.

## Contrato do episódio
```js
import { THREE, createStage, createEpisode, SKIES, E, seg /* ... */ } from "../motor/core.js";
export function build(canvas) {
  const S = createStage(canvas);          // renderer + céu + pós; S.scene, S.cam, S.setSky
  // ... monte a cena em S.scene ...
  return createEpisode(S, { loop, shots, skies, update, post }); // devolve { render(t) }
}
```
- `shots`: lista de planos (abaixo), cobrindo `0` até `loop` sem buraco (o último pode terminar em `loop + 0.01`).
- `skies`: `{ chave: { top, mid, bottom, fog, fogNear, fogFar } }`; cada plano escolhe por `env`. `SKIES.day` pronto.
- `update(t, sh, c)`: põe a cena no tempo `t` (`sh` = plano atual, `c` = `{ pos, look, dist }` da câmera).
  Todo `update` define, em toda chamada, toda propriedade mutável que toca; objetos atualizados só em alguns planos
  ficam escondidos nos outros.
- `post(t, sh, c)`: devolve campos de pós que sobrepõem o tema: `focus` (use `c.dist`), `aperture`, `exposure`, `ca`,
  `vignette`, `shutter`, `grain` (manter 0).
- Quem carrega o episódio é o `world.html` (bootstrap com `hf-seek`/`buildReady` + `montar.js`, que carrega a fonte do
  tema antes de `build`). Não mexa nele além da duração e dos tempos da timeline GSAP.

## Exports de `../motor/core.js`
- `THREE`, `createStage(canvas, W, H)`, `createEpisode(S, opts)`: palco e laço do episódio.
- util: `rng`, `hash`, `clamp`, `seg(t, a, b)` (0..1), `E` (easings: lin, expoOut, p2in, p2out, p2io, p3io, p3out,
  backOut), `shake`, `blink`, `loopPeriod`, `pulses(t, tempos, amp, dur)` (decaem linearmente), `dip(t, t0, largura, profundidade)`.
- câmera: `shotAt`, `cameraOf`, `v3`, `follow(alvo, { rotate })` (alvo(t) → `{ p, a }`).
- materiais: `COL` (papéis de cor do tema), `color(papel)`, `fill`, `edge`, `glowless`, `solid(geom, f, e, shadow = true)`,
  `setLook`. Estilo único: maquete (sólido fosco + aresta de 1 px).
  `COL` (tema): ground←chao, ink←tinta, gray←secundaria, mint←ok, alert←alerta, cyan←destaque, slate←ardosia, dead←morto.
  `COL.nome` errado dá `undefined` em silêncio; `color("<papel>")` (nome do tema) dá erro claro.
- texto: `label(text, cor, px, alturaMundo, weight = 800)` (plano de frente), `floorLabel(...)` (deitado no chão);
  `cor` aceita número (`COL.ink`) ou string CSS.
- mundos: `gridLines`, `SKIES`, `makeTerrain({ seed, coast, ... })` (morros, costa, mar, nuvens).

## Um plano (`shots[i]`)
```js
{ a: 8.28, b: 11.06, env: "ext",
  p0: [26, 2.5, 34], p1: [20, 12, 28],   // posição da câmera no início → fim (lerp com `ease`)
  l0: [0, 8, 0],     l1: [0, 10, 0],     // ponto mirado no início → fim
  base: () => Vector3,                   // opcional: soma a p/l (cena longe da origem, ou alvo seguido)
  ease: "p2io",                          // easing do plano (padrão p2io); "lin" para varreduras
  hand: 0.006,                           // câmera na mão, fração da distância (padrão 0.006)
  shake: [t0, amp, dur, f],              // tremor de impacto (só desloca y; não entra no desfoque)
  ap: 3 }                                // dado livre do episódio (aqui: abertura da DOF), lido pelo seu `post`
```
- `base` é ignorado quando há `path`/`aim` (com só `aim`, `pos` ainda soma `base`, `look` não).
- Em vez de `p0/p1/l0/l1`, `path(t, k, plano)` e `aim(t, k, plano)` devolvem Vector3 (k = progresso eased).
- `follow(alvo)` espalhado no plano faz `base` seguir o alvo; `follow(alvo, { rotate: true })` gira `p0/p1/l0/l1`
  com o ângulo do alvo (câmera presa ao corpo).
- O motor só lê `a, b, env, ease, hand, shake, base, path, aim, p0/p1/l0/l1`. Qualquer outro campo (`ap`, `F`...) é
  dado livre que o **seu** código lê. O motor **não** lê `ap`: sem profundidade de campo no `post`, tudo fica nítido.
  Para ter DOF, `post` deve devolver `{ focus: c.dist, aperture: sh.ap }` (ou equivalente).

## Ritmo e enquadramento
- **Planos de 1,7 a 3 s**, sempre com a câmera em movimento (nunca parada); troque de plano na palavra-âncora da
  locução (veja `assets/voice.json`).
- **fov em torno de 50** (já é o do palco); o assunto ocupa **50 a 60 % da largura** do quadro vertical: ajuste a
  distância, não o fov.
- **Texto no chão (`floorLabel`) só em plano de cima**; em plano rasante use `label` de frente.
- Alterne escala (aberto → próximo) e direção entre planos seguidos; o gancho do frame 0 deve ser o mesmo quadro do fim.
- Profundidade de campo: `ap` alto em planos próximos (6–12), baixo em planos abertos (0,5–2).

## Fluxo
1. Escreva `assets/episode/scene.js` e ajuste `LOOP` (duração da locução) e os tempos das âncoras.
2. `npm run check`; depois `npx hyperframes snapshot --describe false --at <tempos>` e **olhe os PNGs** (enquadramento,
   texto legível, nada cortado). Peça os quadros fora de ordem para conferir que saem iguais.
3. Não renderize e não deixe preview rodando: o pipeline renderiza depois.
