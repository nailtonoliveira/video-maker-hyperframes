/hyperframes Crie as cenas 3D e o HUD 2D deste vídeo vertical para YouTube Shorts / Reels / TikTok (1080 × 1920, 30 fps): "123Milhas: O Calote de R$ 2,3 Bilhões nas Passagens Fantasma".

Modo sem paradas: não faça perguntas e não ofereça alternativas para escolha. Decida e execute. Este projeto faz parte de um workspace com vários vídeos: trabalhe **somente dentro desta pasta** (fora dela, só leitura).

# O que já existe nesta pasta (não recrie do zero!)
Projeto HyperFrames criado a partir do template 3D do **business-forensics** ("A Mesa da Perícia"). O **episódio-modelo** (Monarca S.A., 52 s, 22 planos) está montado e funcionando. **Reescreva-o** para este episódio, aproveitando a estrutura.
- `index.html`: monta, de `0` até `59.77` s, `compositions/world.html` (`#world`), `compositions/hud.html` (`#hud`), `compositions/captions.html` (`#captions`), a locução (`#voice`), as **3 faixas da trilha procedural** (`#ambiente`, `#music`, `#efeitos` → `assets/audio/*.wav`) e os SFX (`#sfx-*`). A raiz e essas faixas já estão com 59.77 s.
- `compositions/world.html`: o `<canvas id="gl">` do mundo 3D e o bootstrap do motor (`montar.js`, `hf-seek`, `buildReady`: **não mexa**; apenas ajuste `const DUR = 59.77;`).
- `compositions/hud.html`: a **camada 2D do HUD** (`#hud-ficha`, `#hud-valor`, `#hud-data`, `#hud-carimbo`) com os helpers `ficha()`, `valor()`, `data()` e `carimbo()` registrados em `window.__timelines["hud"]`. Ajuste `const DUR = 59.77;` e agende os textos e números reais deste episódio nas âncoras.
- `assets/episode/scene.js`: o **episódio 3D** (planos de 1,7–3,0 s nos mundos `imperio`, `livro`, `sala`, `pregao`, `skies: SKIES_BF` e rebobinagem nos últimos 2,4 s).
- `assets/episode/trilha.json`: a trilha procedural em `"re_menor"`, com o silêncio dramático de 0,6 s logo após o carimbo.
- `assets/motor/` + `assets/motor/PROMPT.md` e `assets/tema.js`: motor 3D e tema validados. Não edite.
- `assets/kit/` + `assets/kit/KIT.md`: peças do nicho (`cores.js`, `sala.js`, `imperio.js`, `provas.js`, `livro.js`, `truques.js`, `elenco.js`, `exteriores.js`, `efeitos.js`, `telas.js`). Não edite.
- `assets/voice.mp3` (**59.77 s**, 1794 frames) e `assets/voice.json` (tempo de cada palavra, do Whisper). É o relógio do vídeo.
- `compositions/captions.html`: legendas `label-tag` já geradas. **Nunca edite** (são regeneradas por script).
- `assets/sfx/`: os 14 arquivos de SFX (`click`, `error`, `glitch-1/2/3`, `impact-bass-1/2`, `key-press`, `ping`, `pop`, `riser`, `typing`, `whoosh`, `whoosh-short`).
- `SPEC.md` e `roteiro.md`: plano e roteiro aprovado deste episódio.
- `../../NICHE.md`: identidade visual e regras da série. **Siga à risca**.

# Título na ficha do quadro 0 (vira a thumbnail)
"R$ 2,3 BI → ZERO": pousado no quadro 0 em `#hud-ficha` (`clipPath: "inset(0 0% 0 0)"` explícito em `t = 0`), e remontado idêntico em `59.77 - 0.6` s.

# Sincronização (calculada a partir de assets/voice.json)
Cada cena ocupa o intervalo abaixo; cada âncora é o instante em que aquele visual deve acontecer. Confira em `assets/voice.json` a palavra exata e prenda o evento ao início dela (cortes de plano, trocas de ficha/medidor/data, truque no livro, luz UV, carimbo 3D + 2D, queda da torre, efeitos da trilha).

**Cena 1 — O Gancho** (0.00 s → 9.10 s)
- Locução: R$ 2,3 bilhões em dívidas e 700 mil passageiros no chão derrubaram a 123Milhas em apenas 11 dias.
- Visual: Plano ABERTO_IMPERIO. Torre dourada intacta com rachadura em fraude #ff5a3c pulsando na base; Magnata em celebrate no topo com visor confiante. No HUD, #hud-ficha exibe R$ 2,3 BI → ZERO, #hud-valor crava R$ 2,3 BI com seta ▼ e #hud-data marca AGO/2023.
- Mundo: imperio
  - 0.00 s · "R$ 2,3 bilhões" → #hud-ficha surge com animação de clipPath e #hud-valor crava R$ 2,3 BI no pico com indicador ▼.
  - 3.22 s · "700 mil passageiros" → Rachadura em fraude #ff5a3c pulsa na base da torre e o visor do Magnata oscila para nervoso.
  - 7.42 s · "apenas 11 dias." → Corte rápido para PLONGEE_MESA; medidor de tempo dispara de 18/AGO a 29/AGO em degraus secos.

**Cena 2 — A Ascensão** (9.10 s → 18.56 s)
- Locução: Em 2023, a empresa dominava a televisão e a internet vendendo pacotes Promo com datas flexíveis pela metade do preço.
- Visual: Plano RASANTE_MANADA. Dezenas de peões de marfim entram em euforia no pregão; setas de ouro createFlowArrow fluem em disparada para os andares da torre. No HUD, #hud-valor sobe em degraus e #hud-data avança de JAN/2023 a JUL/2023.
- Mundo: pregao
  - 9.10 s · "Em 2023," → #hud-data atualiza para JAN/2023 e a câmera desliza em rasante pelo piso de nanquim #1c1214.
  - 14.12 s · "vendendo pacotes Promo" → Peões da Manada entram em euforia levantando bilhetes de papel #f2e8d5 com selo ouro.
  - 17.16 s · "metade do preço." → Andares dourados brotam na torre em backOut e o Magnata estufa o peito com visor ganancioso.

**Cena 3 — A Manobra** (18.56 s → 27.08 s)
- Locução: Mas os bilhetes não existiam. A agência vendia a descoberto, usando clientes novos para bancar passageiros antigos.
- Visual: Plano MACRO_LIVRO dentro do livro-caixa em (0, -200, 0). Contador em scribble rabisca colunas de bilhetes vazios. Peões da Manada são empilhados em pirâmide física: os peões da base sustentam o topo com moedas novas, sem bilhete aéreo emitido.
- Mundo: livro
  - 18.86 s · "bilhetes não existiam." → O Contador risca lançamentos no livro-caixa com lápis de nanquim e esconde gavetas em nervous.
  - 21.68 s · "vendia a descoberto," → Peões instanciados montam uma pirâmide vertical frágil, equilibrando vouchers ocos nas costas.
  - 24.48 s · "bancar passageiros antigos." → Moedas de ouro entram pela base da pirâmide e sobem direto para liquidar bilhetes em atraso.

**Cena 4 — As Rachaduras** (27.08 s → 35.14 s)
- Locução: Sob a luz UV da perícia, o truque aparece: quando as tarifas subiram, a pirâmide sem lastro perdeu o chão.
- Visual: Plano PERFIL_PERITA na mesa de mogno #3b2428. A Perita aponta a lanterna UV em violeta #9b8cff; os andares da pirâmide tornam-se transparentes e ocos. Fio vermelho de provas interliga as passagens aéreas cotadas em alta ao rombo de caixa.
- Mundo: sala
  - 27.16 s · "luz UV da perícia," → Feixe violeta #9b8cff ilumina o livro-caixa e o Contador entra em estado hide atrás dos livros.
  - 28.84 s · "o truque aparece:" → Arestas dos andares brilham em violeta-tinta #4c35b8 revelando ausência total de reservas de voo.
  - 33.72 s · "perdeu o chão." → A base da pirâmide de peões oscila em duvida e um fio vermelho estica até o teto sob zumbido tenso.

**Cena 5 — O Colapso** (35.14 s → 42.78 s)
- Locução: Em agosto, os voos travaram. O fiscal desceu o carimbo de calote e a torre bilionária desabou.
- Visual: Plano CONTRA_PLONGEE no império. O Fiscal ergue o braço-carimbo e desfere slam 3D com tremor de tela. O #hud-carimbo estampa CALOTE em lacre #b3261e; a trilha faz pausa de 0,6 s de silêncio, a torre de ouro se desintegra em blocos mortos #4a1512 e #hud-valor zera.
- Mundo: imperio
  - 35.86 s · "os voos travaram." → #hud-data congela em 18/AGO/2023 e o visor do Magnata no topo da torre muda para panic.
  - 38.14 s · "desceu o carimbo de calote" → Fiscal desfere o baque do carimbo 3D sincronizado ao #hud-carimbo CALOTE em lacre #b3261e e silêncio de 0,6 s.
  - 40.46 s · "torre bilionária desabou." → A torre rui em pedaços com estrondo grave, moedas explodem no chão e #hud-valor desce a ZERO.

**Cena 6 — O Estrago** (42.78 s → 52.06 s)
- Locução: Restaram 700 mil credores a ver navios, enquanto os sócios foram indiciados na CPI por estelionato e fraude.
- Visual: Plano RASANTE_MANADA. Centenas de peões tombados em estado ruina sobre o chão escuro #120a0b. O Fiscal abre gaveta de arquivo de aço com etiquetas da CPI do Congresso; o Magnata está de joelhos em derrotado com a auréola dourada apagada.
- Mundo: pregao
  - 43.22 s · "700 mil credores" → Câmera rasante percorre peões de marfim tombados sob névoa de poeira e vento desértico.
  - 47.22 s · "sócios foram indiciados" → Gaveta metálica drawer do Fiscal bate travada com fichas de indiciamento em papel #f2e8d5.
  - 50.24 s · "estelionato e fraude." → Magnata ajoelha derrotado ao lado do Contador tombado, enquanto o selo INVESTIGADO pisca no HUD.

**Cena 7 — O Detalhe Absurdo e Loop** (52.06 s → 59.77 s)
- Locução: Na mesa, a ironia final: as vítimas receberam apenas vouchers da própria agência quebrada, até que...
- Visual: Macro fecha na etiqueta mais irônica: voucher impresso parcelado com correção de CDI para compras na própria 123Milhas. Ao atingir até que..., a animação entra em rebobinagem (p3io): blocos e moedas remontam, a ficha volta ao quadro 0 e a câmera congela em SH[0].p0.
- Mundo: sala
  - 52.96 s · "ironia final:" → Macro extremo na etiqueta de papel com o carimbo irônico VOUCHER SEM FUNDOS e fita vermelha.
  - 55.52 s · "apenas vouchers" → Início da rebobinagem p3io: escombros flutuam de volta e #hud-valor sobe em wipe reverso.
  - 58.50 s · "até que..." → A torre remonta intacta, medidor trava no pico de R$ 2,3 BI e a cena casa perfeitamente com o quadro 0.

# Fatos que podem aparecer na tela
Valores reais no medidor `#hud-valor`, no selo `#hud-data`, na placa da torre, no livro-caixa e nas etiquetas de prova; nada inventado. Respeite P7 (sem logotipos/marcas reais) e P8 (`CONDENADO` só com condenação registrada).

- A 123Milhas suspendeu subitamente a emissão de passagens e pacotes da linha Promo em 18 de agosto de 2023 e ajuizou pedido de recuperação judicial em 29 de agosto de 2023 na 1ª Vara Empresarial de Belo Horizonte. (https://g1.globo.com/economia/noticia/2023/08/29/123-milhas-entra-com-pedido-de-recuperacao-judicial.ghtml)
- O endividamento total declarado pelo grupo 123Milhas atingiu cerca de R$ 2,3 bilhões, com lista de mais de 700 mil credores e clientes lesados. (https://www.infomoney.com.br/negocios/123milhas-apresenta-lista-com-mais-de-700-mil-credores-e-divida-de-r-23-bi/)
- A operação da linha Promo funcionava a descoberto sem reserva prévia de passagens, bancando custos de emissões anteriores com o fluxo de caixa de novas vendas de pacotes futuros flexíveis. (https://www.camara.leg.br/noticias/1009121-relatorio-final-da-cpi-das-piramides-pede-indiciamento-de-socios-da-123milhas/)
- O relatório final da CPI das Pirâmides Financeiras na Câmara dos Deputados indiciou os sócios administradores da 123Milhas por crimes como estelionato, gestão fraudulenta e contra a economia popular. (https://www.camara.leg.br/noticias/1009121-relatorio-final-da-cpi-das-piramides-pede-indiciamento-de-socios-da-123milhas/)
- A agência tentou inicialmente compensar os consumidores apenas com vouchers parcelados utilizáveis exclusivamente em sua própria plataforma, modelo barrado por órgãos de proteção ao consumidor antes do pedido de recuperação judicial. (https://g1.globo.com/economia/noticia/2023/08/18/123milhas-suspende-passagens-ja-emitidas-da-linha-promo.ghtml)

# Ordem de trabalho
1. **`SPEC.md`**: preencha os planos (`SHOTS`, 1,7–3,0 s cortados nas âncoras), `CASE` e `DIFF` (o que muda em relação ao episódio anterior ou ao modelo: nome do caso, forma do império, truque físico, carimbo e consequência — pelo menos 3 itens têm que mudar).
2. **`assets/episode/scene.js`**:
   - `const LOOP = 59.77;` e os tempos `T` nos inícios das palavras-âncora.
   - Planos de 1,7–3,0 s cobrindo `0` → `LOOP + 0.01`, alternando aberto/próximo e direção, com assunto centrado em y 600–1290.
   - Use `SKIES_BF`, `makeEvidenceRoom`, `makeEmpireTower`, o elenco (`makeMagnata`, `makePerita`, `makeContador`, `makeManada`, `makeFiscal`), o livro (`makeLedger` em `(0, -200, 0)`) e o truque do caso (`makeShellBoxes`, `makePonziPyramid` ou `makeBubble`).
   - Nos últimos ~2,4 s (`t >= LOOP - 2.4`), aplique o fator de rebobinagem `rew = 1 - E.p3io(seg(t, LOOP - 2.4, LOOP - 0.2))` em toda função de queda e termine o último plano em `SH[0].p0` / `SH[0].l0` (`ease: "p3io"`), para o último quadro casar com o quadro 0.
3. **`compositions/world.html` e `compositions/hud.html`**:
   - Ajuste `const DUR = 59.77;` nos dois arquivos.
   - Em `compositions/hud.html`, agende `ficha()`, `valor()`, `data()` e `carimbo()` nos tempos das âncoras, mantendo o medidor em movimento (nunca parado por > 8 s) e remontando o estado do quadro 0 na rebobinagem.
4. **`assets/episode/trilha.json`**: ajuste os tempos para `59.77` s, mantendo `"tom": "re_menor"` e o silêncio dramático de 0,6 s no `drone` logo após o instante do carimbo.
5. **SFX no `index.html`**: ajuste os `<audio id="sfx-..." class="clip" ...>` com pico 1 quadro após os eventos (zero SFX em `t = 0` e nos últimos 100 ms).
6. **`npm run check`** e corrija todos os erros.
7. **Snapshots**: `npx hyperframes snapshot --describe false --at <tempos>` cobrindo `0`, cada ato, o instante exato do carimbo e `59.77 - 0.05`. Abra e confira cada PNG (contraste, zona segura x 64–920 / y 220–1500, legibilidade e igualdade entre quadro 0 e final).
8. **`REVIEW.md`**: registre o que cada snapshot mostra e o que foi ajustado.
9. **Não renderize** e não deixe servidor de preview rodando.

---

Os dois guias abaixo são cópias de `assets/motor/PROMPT.md` e `assets/kit/KIT.md` desta pasta.

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


# Kit 3D do business-forensics — A Mesa da Perícia

O motor (`assets/motor/`, guia em `assets/motor/PROMPT.md`) dá palco (`createStage`, `createEpisode`), câmera (`cameraOf`), pós, materiais (`solid`, `fill`, `edge`) e texto (`label`, `floorLabel`).
O kit dá a identidade da série **Business Forensics**: a Sala de Provas (`sala.js`), a Torre do Império e as moedas (`imperio.js`), o Livro-Caixa (`livro.js`), os truques físicos (`truques.js`), as provas (`provas.js`), o elenco de peças de tabuleiro (`elenco.js`) e a sala de pregão (`exteriores.js`).
Não edite o kit dentro de um vídeo: a fonte da verdade é `niches/business-forensics/template/assets/kit/`.

## Regras das peças
- Toda fábrica `makeX(opts)` devolve `{ group, ...estado }` (ou `{ group, act, rosto }` no elenco).
- Todo método de estado recebe `k` (`0 → 1`) ou `(t, ...)` e define **tudo o que toca em toda chamada** (o HyperFrames busca quadros fora de ordem).
- Todo texto 3D (`label` / `floorLabel`) passa `weight = 700` (IBM Plex Mono).
- Para o loop por rebobinagem (`t ∈ [LOOP - 2.4, LOOP - 0.2]`), basta passar `k(t) = 1 - E.p3io(seg(t, LOOP - 2.4, LOOP - 0.2))` para `collapse(k)`, `fall({ k })`, `ruina({ k })` etc.

## Cores e materiais (`cores.js`)
- `C`: `{ ouro, fraude, uv, papel, taupe, chao, mogno, morto, lacre, nanquim, creme, sepia, cera, bege, violetaTinta, vinho }`. Use sempre `C.*` (nunca `COL.mint`/`COL.cyan`).
- `MBF`: materiais prontos (`ouro`, `papel`, `mogno`, `nanquim`, `taupe`, `sepia`, `lacre`, `fraude`, `uv`, `morto`, `eNanquim`, `eOuro`, `eFraude`, `eUv`, `eTaupe`).

## Sala de Provas e Céus (`sala.js`)
- `SKIES_BF`: `{ sala, imperio, livro, pregao }` — passe em `createEpisode(S, { ..., skies: SKIES_BF })`.
- `makeEvidenceRoom({ seed, caso })` → `{ group, update(t, { alarm, uv }) }`:
  - Tampo de mogno em `y = 0` (`14 × 9 u`), mata-borrão pautado (`y = 0.005`), paredes de lambri, quadro de cortiça (`z = -9`) com cartões marfim e lâmpada de interrogatório em `(0, 9, 0)` com SpotLight (`shadow.mapSize 2048²`) + contra-luz UV (`#9b8cff`).
  - `alarm` (`0 → 1`): avermelha a luz e o filete da mesa.
  - `uv` (`0 → 1`): reduz a luz quente a 30 % e sobe a contra-luz UV a 2,2.

## Torre do Império e Moedas (`imperio.js`)
- `makeEmpireTower({ nome, andares = 9, ocos = [3, 4, 5, 6], w = 2.4, h = 0.6, seed, forma = "torre" })` → `{ group, topY, rise(k), crack(k), reveal(k), collapse(k) }`:
  - `rise(k)`: andares nascem de baixo para cima com `E.backOut`.
  - `crack(k)`: rachadura vermelha pulsa na base e sobe pela fachada.
  - `reveal(k)`: os andares em `ocos` ficam translúcidos (opacidade 0,14) com aresta violeta UV `#9b8cff`.
  - `collapse(k)`: queda parabólica determinística (os ocos primeiro) e cor indo a `C.morto`; em `k = 0` a torre está intacta.
- `makeCoinStack({ n = 16, r = 0.26 })` → `{ group, fill(k) }`.
- `makeCoinBurst({ count = 120, seed = 13, origem = [0, 2.2, 0] })` → `{ group, update(k) }` (`InstancedMesh`).
- Setas de entrada/saída de dinheiro: importe `createFlowArrow` de `../kit3d.js` (`color: C.ouro` para entrada, `C.fraude` para saída).
- Poeira do desabamento: `makeGroundCloud({ count, center })` de `./efeitos.js`.

## Mundo do Livro-Caixa (`livro.js`) e Truques (`truques.js`)
- Coloque o grupo do mundo `livro` numa base fixa `new THREE.Vector3(0, -200, 0)` e alterne `visible` pelo `sh.env === "livro"`.
- `makeLedger({ titulo, linhas, linhaFraude })` → `{ group, open(k), flip(k), mark(i, k), uv(k) }`: página pautada `36 × 24 u` no chão com lançamentos em `floorLabel` (só em plano de cima `MACRO_LIVRO`) + iluminação própria.
- `makeShellBoxes({ nomes })` → `{ group, swallow(k), nest(k) }`: 3 caixas de fachada que engolem a dívida, fecham a tampa e se aninham.
- `makePonziPyramid({ niveis = 3 })` → `{ group, grow(k), collapse(k) }`.
- `makeBubble({ r = 1.4 })` → `{ group, inflate(k), pop(k) }`.

## Provas (`provas.js`)
- `makeEvidenceTag({ texto })` → `{ group, show(k) }`: etiqueta marfim com furo, barbante e texto `#4c35b8`.
- `makeRedString(pontos)` → `{ group, draw(k) }`: fio vermelho com alfinetes, desenhado progressivamente (`setDrawRange`).
- `makeCaseFolder({ caso, nome })` → `{ group, open(k) }`: pasta de dossiê que abre na mesa.
- `makeStampMark(texto)` → `{ group, press(k) }`: decalque vermelho-lacre `#b3261e` deixado pelo carimbo.

## Elenco (`elenco.js`)
- `makeMagnata({ escala })` → `{ group, act(t, modo, o), rosto(estado) }`:
  - `modo`: `"idle" | "celebrate" | "point" | "panic" | "fall"`. Posicione no topo da torre (`y = tower.topY`).
- `makePerita({ escala })` → `{ group, act(t, modo, o), rosto(estado) }`:
  - `modo`: `"idle" | "scan" | "lean" | "nod"`. Lanterna UV com cone translúcido (`o.uv`).
- `makeContador({ escala, livros = 4 })` → `{ group, act(t, modo, o), rosto(estado) }`:
  - `modo`: `"idle" | "scribble" | "nervous" | "hide" | "topple"`. Uso exclusivo no mundo `livro`.
- `makeManada({ count = 36, cols = 9, spacing = 0.75, seed = 5 })` → `{ group, act(t, modo, o) }`:
  - `modo`: `"euforia" | "duvida" | "panico" | "ruina"` (2 `InstancedMesh`: corpo + casca `BackSide`).
- `makeFiscal({ escala, texto = "FRAUDE" })` → `{ group, act(t, modo, o), rosto(estado) }`:
  - `modo`: `"idle" | "advance" | "raise" | "slam" | "drawer"`. Em `"slam"`, o carimbo toca a mesa exatamente em `o.t0`.

## Pregão (`exteriores.js`)
- `makeTradingFloor({ mesas = 6 })` → `{ group, telas(valor), queda(k) }`: recolorido automaticamente pelo `tema.json` (alta em ouro, queda em vermelho-fraude). Escalone `valor` de 5 em 5 para respeitar o cache LRU de 32 texturas.

