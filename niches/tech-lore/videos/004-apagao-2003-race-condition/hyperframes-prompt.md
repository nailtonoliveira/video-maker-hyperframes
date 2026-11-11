/hyperframes Crie as cenas 3D deste vídeo vertical para YouTube Shorts (1080 × 1920, 30 fps): "Apagão de 2003: A Condição de Corrida de Milissegundos".

Modo sem paradas: não faça perguntas e não ofereça alternativas para escolha. Decida e execute. Este projeto faz parte de um workspace com vários vídeos: trabalhe **somente dentro desta pasta** (fora dela, só leitura).

# O que já existe nesta pasta (não recrie do zero!)
Projeto HyperFrames criado a partir do template 3D do tech-lore. O **exemplo do template** (Ariane 5, voo 501, 12 s: os 5 atos em miniatura) está montado e funcionando. **Reescreva-o** para este episódio, aproveitando a estrutura.
- `index.html`: monta, de `0` até `44.73` s, `compositions/world.html` (`#world`), `compositions/captions.html` (`#captions`), a locução (`#voice`), as **3 faixas da trilha procedural** (`#ambiente`, `#music`, `#efeitos` → `assets/audio/*.wav`) e um SFX de exemplo (`#sfx-dive`). A raiz e essas faixas já estão com 44.73 s.
- `compositions/world.html`: o `<canvas id="gl">` do mundo 3D, o bootstrap do motor (`montar.js`, `hf-seek`, `buildReady`: **não mexa**) e a **camada 2D de títulos** (`.title`, `.sub`) com a timeline GSAP em tempos absolutos. `const DUR = 12` ainda é a do exemplo.
- `assets/episode/scene.js`: o **episódio 3D** do exemplo (5 planos, um por ato), com `const LOOP = 12` e os cortes `T` do exemplo.
- `assets/episode/trilha.json`: a trilha do exemplo, com os tempos do exemplo.
- `assets/motor/` (motor 3D congelado neste vídeo) + **`assets/motor/PROMPT.md`** (guia, copiado abaixo) e `assets/tema.js` (cores e fontes). Não edite.
- `assets/kit/` (peças do nicho: placa, chip, bits, linha de código, efeitos, exteriores, o bug) + **`assets/kit/KIT.md`** (guia, copiado abaixo). Não edite.
- `assets/voice.mp3` (**44.73 s**, 1342 frames) e `assets/voice.json` (tempo de cada palavra, do Whisper). É o relógio do vídeo.
- `compositions/captions.html`: legendas já geradas. **Nunca edite** (são regeneradas por script).
- `assets/sfx/`: biblioteca de efeitos sonoros (`whoosh.mp3`, `whoosh-short.mp3`, `impact-bass-1.mp3`, `impact-bass-2.mp3`, `error.mp3`, `glitch-1..3.mp3`, `click.mp3`, `key-press.mp3`, `typing.mp3`, `ping.mp3`, `pop.mp3`, `riser.mp3`).
- `SPEC.md`: modelo do plano do episódio, para preencher.
- `roteiro.md`: roteiro aprovado, com locução, mundo e direção visual de cada cena.
- `../../NICHE.md`: identidade visual e regras da série. **Siga à risca** (maquete técnica, cores, área útil, ritmo, proibições).

# Título na tela (quadro 0, vira a thumbnail)
"50 MILHÕES SEM LUZ": pousado no quadro 0 sobre o exterior do plano 1, e remontado idêntico no fim.

# O arco: 5 atos = 5 cenas
| Cena | Ato | Mundo | Na tela |
| --- | --- | --- | --- |
| 1 | Gancho | exterior | o lugar real, com o título do gancho no quadro 0 |
| 2 | Contexto | exterior → mergulho | a máquina por fora; uma porta física abre e a câmera entra até a placa, sem corte seco no meio (só o Ariane 5 tem porta no kit, `hatch`; nos outros exteriores, monte a porta com `solid` do motor) |
| 3 | A falha | placa | a linha de código real no chão (plano de cima), chips e bits com valores reais; o bug anda e **para no ponto da falha** |
| 4 | Colapso | placa → exterior | a peça da falha morre em vermelho, a placa avermelha, tremor; a consequência no lugar real |
| 5 | Loop | exterior | volta ao lugar real e termina **exatamente** no quadro 0 |

O campo "Mundo" de cada cena, abaixo, diz onde ela passa mais tempo.

# Sincronização (calculada a partir de assets/voice.json)
Cada cena ocupa o intervalo abaixo; cada âncora é o instante em que aquele visual deve acontecer. Confira em `assets/voice.json` a palavra exata e prenda o evento ao início dela (cortes de plano, títulos, porta, bug, peça morrendo, efeitos da trilha). Âncora marcada "?" não foi encontrada automaticamente: localize você mesmo no voice.json.

**Cena 1 — O Gancho** (0.00 s → 5.64 s)
- Locução: Um conflito de milissegundos na memória de um servidor apagou a energia de 50 milhões de pessoas.
- Visual: Maquete técnica 3D do exterior de um data center industrial da FirstEnergy com arestas finas em ciano e piso técnico escuro. Título do gancho '50 MILHÕES SEM LUZ' pousado no quadro 0 em JetBrains Mono sobre placa escura. Câmera em deslocamento lento orbitando os blocos de servidores e subestações sob céu em domo dessaturado.
- Mundo: exterior
  - 0.00 s · "Um conflito de milissegundos" → Título em wipe horizontal expo.out pousado no quadro 0 com subtítulo técnico // RACE CONDITION DETECTED.
  - 1.30 s · "na memória de um servidor" → Aproximação de câmera focando a fachada do bloco central de processamento com pulsos de dados em verde-menta.
  - 3.84 s · "50 milhões de pessoas" → Corte de plano rasante mostrando barramentos elétricos massivos convergindo para o data center com profundidade de campo rasa.

**Cena 2 — O Contexto** (5.64 s → 17.26 s)
- Locução: Em 14 de agosto de 2003, no centro de controle da FirstEnergy, o software GE XA/21 gerenciava a rede elétrica.
- Visual: A câmera foca o gabinete do servidor SCADA da FirstEnergy e executa um mergulho contínuo através da porta física da gaveta do rack. A abertura técnica revela barramentos luminosos e feixes de cabos até pousar na superfície de uma placa de circuito com o chip GE XA/21.
- Mundo: mergulho
  - 5.64 s · "Em 14 de agosto de 2003" → Plano médio do rack com carimbo de tempo '2003-08-14 14:14:00 EDT' gravado na lateral do chassi em cinza #7d8590.
  - 8.04 s · "no centro de controle" → A gaveta frontal do rack destrava mecanicamente e desliza para a frente, revelando o interior da máquina.
  - ? · "software GE XA/21" → Mergulho contínuo para o interior escuro, iluminando o chip principal gravado em ciano com 'GE XA/21 EMS'.
  - 14.66 s · "a rede elétrica" → Câmera nivela sobre a placa; trilhas de dados e LEDs de barramento pulsam em sincronia verde-menta.

**Cena 3 — A Falha Técnica** (17.26 s → 27.12 s)
- Locução: Às 14h14, duas tarefas tentaram gravar no mesmo buffer de alarmes ao mesmo tempo. Sem bloqueio mútuo, a fila corrompeu e o processo entrou em loop infinito.
- Visual: Plano plongée técnico da placa de circuito. No solo técnico, a linha de código: 'alarm_queue.push(event); // race condition'. O bug da série (besouro escuro com arestas vermelhas e olhos menta) percorre a trilha de dados e trava exatamente sobre a chamada push desprotegida por mutex.
- Mundo: placa
  - ? · "Às 14h14, duas tarefas" → Dois pulsos de dados em ciano colidem no mesmo registrador de fila simultaneamente sem sincronização.
  - 19.26 s · "gravar no mesmo buffer" → O besouro rasteja com precisão pelas trilhas de cobre em direção ao buffer de eventos de alarme.
  - 22.50 s · "Sem bloqueio mútuo" → O bug estanca com as patas sobre a instrução 'push(event)', onde a flag 'MUTEX_LOCK' exibe 0x00.
  - 23.82 s · "a fila corrompeu" → A estrutura de dados quebra com tremor determinístico e o registrador vira vermelho #ff3366 exibindo QUEUE_CORRUPT.
  - 26.24 s · "loop infinito" → Um anel de luz vermelha passa a girar eternamente sobre o chip de alarmes sem despachar nenhum sinal.

**Cena 4 — O Colapso** (27.12 s → 38.76 s)
- Locução: Quando cabos de alta tensão caíram no Ohio, os alarmes não dispararam. Sem aviso, a sobrecarga derrubou 100 usinas e gerou 6 bilhões de dólares em prejuízo.
- Visual: O subsistema de alarmes na placa queima em vermelho escuro e a câmera transita em corte rápido para o exterior. Linhas de transmissão em Ohio tocam vegetação e sofrem arcos elétricos sem alerta no console; em cascata, módulos do data center e a malha regional apagam as luzes em efeito dominó.
- Mundo: exterior
  - 27.12 s · "Quando cabos de alta tensão" → Corte de plano para o exterior: cabos de 345 kV vergam e entram em curto com árvores geométricas.
  - 30.50 s · "os alarmes não dispararam" → Plano rasante do console de monitoramento do data center totalmente mudo e estático, sem luzes de alarme.
  - 32.30 s · "Sem aviso, a sobrecarga" → Pulso elétrico vermelho percorre as linhas de transmissão no horizonte provocando desligamentos sucessivos.
  - 34.04 s · "derrubou 100 usinas" → Corte aberto: centenas de geradores e módulos da maquete têm seus LEDs de operação desligados instantaneamente.
  - 35.90 s · "gerou 6 bilhões de dólares" → Letreiro técnico '-US$ 6 BILHÕES' surge em vermelho de alerta com aberração cromática contida.

**Cena 5 — O Loop** (38.76 s → 44.73 s)
- Locução: A tela dos operadores continuou estática e muda por mais de uma hora, e foi exatamente assim que...
- Visual: A câmera recua completando a órbita no exterior do data center apagado, voltando à mesma posição, ângulo e escala do quadro 0. O céu em domo retorna à iluminação inicial e o título '50 MILHÕES SEM LUZ' remonta exatamente nas coordenadas do início, fechando o loop contínuo.
- Mundo: exterior
  - 38.76 s · "A tela dos operadores" → Visão técnica através da vidraça da sala de controle mostrando monitores estáticos em contraste com o exterior.
  - 41.58 s · "por mais de uma hora" → Contador de terminal avança em timelapse de 14:14 para 15:45 sem gerar uma única notificação.
  - 42.54 s · "e foi exatamente assim que" → A câmera trava na posição inicial do quadro 0 e o título 2D de abertura remonta perfeitamente no centro.

# Fatos que podem aparecer na tela
Valores reais nas telas, chips, bits e títulos; nada inventado.

- O blecaute de 14 de agosto de 2003 atingiu cerca de 50 milhões de pessoas em oito estados dos EUA e na província de Ontário, no Canadá. (U.S.-Canada Power System Outage Task Force: Final Report on the August 14, 2003 Blackout in the United States and Canada (2004))
- Uma condição de corrida (race condition) de milissegundos no subsistema C/C++ de alarmes do software GE Energy XA/21 corrompeu a estrutura de dados compartilhada às 14h14, travando o processo em loop infinito. (SecurityFocus / KEMA Inc. Software Audit: Tracking the Blackout Bug (2004))
- A falha silenciosa congelou as telas e alertas sonoros da FirstEnergy por mais de uma hora, impedindo os operadores de isolar a queda das linhas de 345 kV de Ohio antes do efeito cascata. (U.S.-Canada Power System Outage Task Force: Final Report (2004))
- A cascata desligou mais de 100 usinas elétricas (261 unidades geradoras) e gerou prejuízos econômicos estimados entre US$ 6 bilhões e US$ 10 bilhões. (U.S.-Canada Power System Outage Task Force: Final Report (2004))

# Ordem de trabalho
1. **`SPEC.md`**: preencha o modelo com os planos (`SHOTS`): para cada plano, tempos (`a`–`b`, de 1,7 a 3 s, cortados nas âncoras), mundo, câmera (de onde para onde, aberto ou próximo), assunto e título 2D. Em `WORLDS`, diga o lugar (exterior do kit), a porta do mergulho, a peça da falha (o trecho exato onde o bug para), a consequência e o céu.
   Inclua uma seção **"O que muda em relação ao episódio anterior"** com esses cinco itens: lugar, porta do mergulho, peça da falha, consequência, céu. O episódio anterior é a pasta em `../` com o maior `NNN` abaixo do deste vídeo que tenha `SPEC.md` (`ls ..`; leia só o `SPEC.md` dele). Ele é 3D se tiver `assets/episode/scene.js`; se não tiver (é 2D, como 001–003) ou se não houver nenhum, compare com o exemplo do template (base de lançamento e Ariane 5 · escotilha da gaveta do SRI · `int16(horizontal_bias)` · chip SRI morto e placa vermelha · céu de dia). Pelo menos três dos cinco itens têm que mudar.
2. **`assets/episode/scene.js`**: reescreva o episódio do exemplo seguindo o guia do motor e o do kit (abaixo).
   - `const LOOP = 44.73;` e os cortes `T` nos inícios das palavras-âncora.
   - Planos de 1,7–3 s cobrindo `0` → `LOOP` sem buraco (o último termina em `LOOP + 0.01`), câmera sempre em movimento, fov ~50, assunto em 50–60 % da largura, alternando aberto/próximo e direção.
   - Exterior do kit que se lê sem rótulo; mergulho pela porta (`hatch` no Ariane 5; nos outros exteriores, uma porta, painel ou gaveta feita com `solid` do motor, que abre antes da câmera entrar: nada de corte seco); placa com `makeBoard({ ..., loop: LOOP })`, a linha de código do caso, a peça da falha e o bug (`bugWalk`) parando no ponto da falha; colapso com a peça morrendo e a consequência; o último plano termina em `p0`/`l0` do primeiro.
   - Todo `update` define tudo o que toca em toda chamada; piscadas com `loopPeriod(LOOP, ...)`; granulação 0; nada de `Math.random`/`Date.now`. Meta: até ~250 linhas.
3. **Títulos em `compositions/world.html`**: `const DUR = 44.73;`. Troque os títulos do exemplo (elementos `.title`/`.sub` e seus ids) pelos do episódio e agende-os na timeline nos tempos das âncoras. O título do gancho fica pousado no quadro 0 com `clipPath` explícito em `t = 0` e remonta idêntico antes do fim. Títulos curtos (a 128 px cabem ~11 caracteres por linha em x 96–948), em y 200–1130, sem cobrir o assunto 3D. Não mexa no bootstrap do motor.
4. **`assets/episode/trilha.json`**: reescreva com os tempos absolutos deste episódio, no mesmo esquema do exemplo: `ambiente` com até três fontes, cada uma com `env`: `vento` (exterior), `zumbido` (placa) e `ronco` (estrondo grave, opcional: o exemplo do template usa só `vento` e `zumbido`); o alarme **não** é uma fonte: é a chave `alarme` dentro de `zumbido`, uma lista de trechos `[a, b]` em que o zumbido treme (colapso). `musica`: `tom` (`la_menor`, `re_menor` ou `mi_menor`), `drone` e `brilho` com `env`; `pulso` (crescendo da falha ao colapso) com `inicio`, `fim` e `bpm`, e `subida` opcional com `inicio` e `fim` (esses dois não usam `env`). `efeitos`: catálogo fixo `trava`, `deslize`, `baque`, `estalo`, `faisca`, `clique`, `tique`, cada um com `t` ou `tempos` e `ganho`; acrescente efeitos novos no fim da lista. Cada `env` é uma lista de `[a, b, nível, subida, descida]`. Os `.wav` são gerados pela etapa `trilha` do pipeline depois: não os gere.
5. **SFX no `index.html`**: substitua `#sfx-dive` pelos SFX do episódio (`<audio id="sfx-..." class="clip" ...>` com `data-start`, `data-duration`, `data-track-index` ≥ 30 e `data-volume`), só nos acertos que a trilha não cobre, com pico 1 quadro após a imagem (`data-start` = momento da imagem + 0,033 − pico do arquivo). Mantenha `world`, `captions`, `voice` e as 3 faixas da trilha intactos, cobrindo `0` → `44.73`.
6. **`npm run check`** e corrija todos os erros.
7. **Snapshots de cada ato** (todo snapshot leva `--describe false`; onde o guia do motor diz `env -u GEMINI_API_KEY`, use `--describe false`: o `env` não está liberado): `npx hyperframes snapshot --describe false --at <tempos>` com o quadro 0, pelo menos um momento de cada um dos 5 atos (meio de cada plano importante), o instante em que o bug para, o colapso e `44.73 − 0,05`. **Abra e olhe cada PNG**: o exterior se lê pelo que é sem rótulo; o assunto ocupa 50–60 % da largura; texto no chão só em plano de cima e legível; o bug está no ponto da falha; títulos dentro da área útil, sem cobrir o assunto nem a legenda; o último quadro casa com o quadro 0. Peça alguns tempos fora de ordem para conferir que saem iguais. Corrija e tire os snapshots de novo até ficar certo.
8. **`REVIEW.md`**: o que cada snapshot mostra, o que foi corrigido e o que ficou pendente.
9. **Não renderize** e não deixe servidor de preview rodando: o pipeline gera a trilha e renderiza depois da aprovação.

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


# Kit 3D do tech-lore — peças do nicho

O motor (`assets/motor/`, guia em `assets/motor/PROMPT.md`) dá palco, câmera, pós, materiais e texto. O kit dá as peças
da série: estilo maquete (sólido fosco + aresta de 1 px, cores de `COL`), a placa por dentro da máquina, efeitos,
lugares reais e o bug. Não edite o kit dentro de um vídeo: a fonte da verdade é `niches/tech-lore/template/assets/kit/`.

## Regras das peças
- Fábrica `makeX(opts)` devolve um grupo (ou `{ group, ...estado }`). Nada de tempo de episódio dentro do kit: quem diz
  quando é o `scene.js`.
- Métodos de estado recebem 0→1 ou booleano e definem **tudo o que tocam em toda chamada** (o render busca quadros
  fora de ordem). Chame todos em todo `update`, inclusive com o objeto escondido.
- Períodos de piscar vêm do episódio: `loopPeriod(LOOP, quero)`.

## Peças (`props.js`)
- `M`: materiais prontos (`slate`, `ink`, `chip`, `board`, `bus`, `ledOff/ledMint/ledCyan/ledAlert`, `eMint`, `eAlert`...).
- `makeChip({ name, sub, w, d, h, pins, leds, nameH })` + `chipState(chip, t, deadAt, period, tilt)` → `{ y, rz, dx }`
  (vivo pisca; morto fica vermelho, afunda e inclina).
- `makeRegister({ n, P, text })` + `registerState(reg, t, { riseAt, jamAt, crackAt })`: bandeja de n bits que racha.
- `makeBitBlock(bits)` + `bitBlockState(cells, bits, t, { bornAt, slideA, slideB, jamAt, ejectAt, redAt })` → frente.
- `makeBus(lanes, { x0, z, length, text })`, `makePulses(lanes, perLane)`: barramento e pulsos de dados.
- `makeCodeLine({ code, comment, x0, z })` → `{ group, underline }`: código no chão (só em plano de cima).
- `intBits(x, n)`, `float64Bits(x)` (`bits.js`): bits reais, MSB primeiro.

## A placa (`placa.js`)
- `BOARD_SKY`: céu escuro da placa (use como `skies.int`).
- `makeBoard({ seed, cx, cz, half, keepOut, loop })` → `{ group, update(t, { focus, alarm }) }`: trilhas, vias,
  componentes, LEDs, serigrafia e o facho que segue `focus`; `alarm` 0→1 avermelha o facho. `keepOut` = retângulos
  `[x0, z0, x1, z1]` livres para a cena. `loop` é obrigatório.

## Efeitos (`efeitos.js`) — instanciados, `update` puro do tempo
- `makeTrail({ until, step })` → `update(F, flight, tail)`: rastro de fumaça ao longo de `flight(F) → { p, a }`.
- `makeGroundCloud({ count, center })` → `update(F)`: nuvem de chão da decolagem.
- `makeExplosion({ at })` → `update(dt)`: fogo facetado, fumaça e destroços (`dt` = s desde o estouro).

## Exteriores (`exteriores.js`) — lugares e veículos reais
| Fábrica | Tamanho | Estado |
| --- | --- | --- |
| `makeLaunchPad()` | laje 44 × 44 u, torres de 20 u (1 u ≈ 5 m) | — |
| `makeAriane5()` | ~11 u de altura (bocais em y = −5,2), centro na origem (1 u ≈ 5 m) | `pose(p, a)`, `burn(ign, t, on)`, `nozzle(k)`, `breakup(dt)`, `xray(on, t, t0)`, `hatch(kHinge, kDrawer)` |
| `makeDataCenter({ racks = 8 })` | piso 7,2 × 7,2 m, racks de 2 m, 2 fileiras (1 u = 1 m) | `leds(t, period)`, `alarme(k)` |
| `makeTradingFloor({ mesas = 6 })` | piso 9 × 8,8 m, telão 6 × 2,4 m na parede (−z) | `telas(valor)`, `queda(k)` |
| `makeMedicalDevice()` | sala 6,6 × 6,6 m (paredes cortadas a 0,75 m) + piso do console até x = 5,3; isocentro a 1,3 m | `giro(k)`, `feixe(on)`, `alerta(k)` |
| `makeAirplane()` | ~7,5 u de comprimento, envergadura ~7,2 u, deriva até y = 1,95 (1 u ≈ 5 m); origem no centro, nariz em +x | `pose(p, a)`, `trem(k)`, `dano(k)` |
| `makeCar({ cor })` | 4,4 × 1,8 × 1,43 m, rodas de 0,32 m (1 u = 1 m); origem no chão, frente em +x | `rodas(ang)`, `freio(on)` |
| `makeSpaceProbe()` | corpo 1,2 × 0,9 × 1,2, prato de 1,8, envergadura aberta ~7,2; origem no centro, antena em +y | `paineis(k)`, `antena(ang)`, `pose(p, a)` |

- Data center: corredor frio ao longo de x. Lê-se melhor na diagonal (vê as frentes de uma fileira com os LEDs) ou
  na ponta do corredor, 2–3 m acima dos racks. As pontas das fileiras têm tampa clara com venezianas e LEDs da PDU,
  para o lado não ficar liso. `leds` usa `period`/1, /2 ou /3 por LED; `alarme` acende os giroflex e uma luz vermelha.
- Pregão: mesas de frente para o telão (em −z); câmera em +z, alta (≈7 m). `telas(valor)` escreve o número no
  formato brasileiro. Cada texto vira uma textura, guardada num cache LRU de 32: no episódio, arredonde ou escalone
  o valor (por exemplo de 5 em 5) para não redesenhar a cada quadro. `queda(k)` derruba o gráfico em vermelho, vira
  a seta e avermelha monitores e faixa de cotações.
- Radioterapia: maca no eixo z, estativa em −z, console fora da parede em +x. `giro(k)`: k 0→1 = uma volta do braço;
  `feixe(on)`: cone ciano do cabeçote ao paciente; `alerta(k)`: tela do console, lâmpada e luz local em vermelho.
- Avião: asas ao longo de z, asa direita em +z. `pose(p, a)`: posição e arfagem (em torno de z), alvo de
  `follow(…)` (com `rotate: true` a câmera fica presa ao corpo, como no Ariane). `trem(k)`: 0 recolhido (escondido),
  1 baixado (rodas em y = −0,92 do centro). `dano(k)`: a ponta da asa direita se solta, gira e cai em parábola, e
  **some em k = 1** (deixe a rampa curta, ~1 s, para a queda se ver); a turbina direita ganha aresta vermelha, fogo
  facetado e fumaça. A fumaça é presa ao corpo: com o avião andando, um rastro no mundo pede `makeTrail`
  (`efeitos.js`). Lê-se melhor de 3/4 pela frente, um pouco acima, contra o céu (`makeTerrain` lá embaixo).
- Escalas misturadas: avião (1 u ≈ 5 m) e carro (1 u = 1 m) juntos: escale o carro ×0,2 (ou o avião ×5).
- Carro: `rodas(ang)` em radianos, positivo rolando para +x (ang = distância / 0,32); as rodas têm 5 raios para o giro
  aparecer. `freio(on)`: lanternas, brake-light e uma luz vermelha curta atrás. Lataria muda com `cor`.
- Sonda: corpo dourado (manta térmica), prato em +y, asas de painéis ao longo de z, motor em −y, mastro do
  magnetômetro em −x. `paineis(k)`: 0–0,4 a asa sai da lateral do corpo, 0,4–1 os 3 painéis desdobram em sanfona.
  `antena(ang)`: inclinação do prato em torno de z. `pose(p, a)` como o Ariane. No espaço não há luz no kit: use uma
  direcional forte (o Sol) + hemisférica fraca, e estrelas no céu do episódio (como na vitrine).
- Os interiores (data center, pregão, radioterapia) não trazem luz geral: use a luz do dia (`makeTerrain`) ou uma luz
  de sala (hemisférica + direcional com sombra), como na vitrine (`niches/tech-lore/lab/vitrine`).
- Valores das telas e LEDs sem Three (`telas.js`, testados em Node): `fmtNum(valor, casas)`,
  `curvaPregao(n, k, seed)`, `periodoLed(period, h)`.

## O bug (`props.js`)
- `makeBug()`: besouro da série (~0,55 u, corpo escuro, aresta vermelha, olhos menta). Aparece **no ponto da falha**.
- `bugState(bug, { pos, yaw, gait })` e `bugWalk(t, t0, t1, a, b, ease)` → pose andando em linha reta (marcha em
  trípode, passo proporcional à distância). Para fechar o loop, termine na pose do quadro 0.

## Testes
`node --test assets/kit/tests/*.test.js` (sempre com o glob). Só lógica pura (`bits.js`, `telas.js`); malha se julga
olhando quadros (vitrine).

