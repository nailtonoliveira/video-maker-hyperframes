/hyperframes Crie as cenas 3D deste vídeo vertical para YouTube Shorts (1080 × 1920, 30 fps): "{{TITULO}}".

Modo sem paradas: não faça perguntas e não ofereça alternativas para escolha. Decida e execute. Este projeto faz parte de um workspace com vários vídeos: trabalhe **somente dentro desta pasta** (fora dela, só leitura).

# O que já existe nesta pasta (não recrie do zero!)
Projeto HyperFrames criado a partir do template 3D do tech-lore. O **exemplo do template** (Ariane 5, voo 501, 12 s: os 5 atos em miniatura) está montado e funcionando. **Reescreva-o** para este episódio, aproveitando a estrutura.
- `index.html`: monta, de `0` até `{{DURACAO}}` s, `compositions/world.html` (`#world`), `compositions/captions.html` (`#captions`), a locução (`#voice`), as **3 faixas da trilha procedural** (`#ambiente`, `#music`, `#efeitos` → `assets/audio/*.wav`) e um SFX de exemplo (`#sfx-dive`). A raiz e essas faixas já estão com {{DURACAO}} s.
- `compositions/world.html`: o `<canvas id="gl">` do mundo 3D, o bootstrap do motor (`montar.js`, `hf-seek`, `buildReady`: **não mexa**) e a **camada 2D de títulos** (`.title`, `.sub`) com a timeline GSAP em tempos absolutos. `const DUR = 12` ainda é a do exemplo.
- `assets/episode/scene.js`: o **episódio 3D** do exemplo (5 planos, um por ato), com `const LOOP = 12` e os cortes `T` do exemplo.
- `assets/episode/trilha.json`: a trilha do exemplo, com os tempos do exemplo.
- `assets/motor/` (motor 3D congelado neste vídeo) + **`assets/motor/PROMPT.md`** (guia, copiado abaixo) e `assets/tema.js` (cores e fontes). Não edite.
- `assets/kit/` (peças do nicho: placa, chip, bits, linha de código, efeitos, exteriores, o bug) + **`assets/kit/KIT.md`** (guia, copiado abaixo). Não edite.
- `assets/voice.mp3` (**{{DURACAO}} s**, {{FRAMES}} frames) e `assets/voice.json` (tempo de cada palavra, do Whisper). É o relógio do vídeo.
- `compositions/captions.html`: legendas já geradas. **Nunca edite** (são regeneradas por script).
- `assets/sfx/`: biblioteca de efeitos sonoros (`whoosh.mp3`, `whoosh-short.mp3`, `impact-bass-1.mp3`, `impact-bass-2.mp3`, `error.mp3`, `glitch-1..3.mp3`, `click.mp3`, `key-press.mp3`, `typing.mp3`, `ping.mp3`, `pop.mp3`, `riser.mp3`).
- `SPEC.md`: modelo do plano do episódio, para preencher.
- `roteiro.md`: roteiro aprovado, com locução, mundo e direção visual de cada cena.
- `../../NICHE.md`: identidade visual e regras da série. **Siga à risca** (maquete técnica, cores, área útil, ritmo, proibições).

# Título na tela (quadro 0, vira a thumbnail)
"{{TITULO_TELA}}": pousado no quadro 0 sobre o exterior do plano 1, e remontado idêntico no fim.

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

{{TIMELINE}}

# Fatos que podem aparecer na tela
Valores reais nas telas, chips, bits e títulos; nada inventado.

{{FATOS}}

# Ordem de trabalho
1. **`SPEC.md`**: preencha o modelo com os planos (`SHOTS`): para cada plano, tempos (`a`–`b`, de 1,7 a 3 s, cortados nas âncoras), mundo, câmera (de onde para onde, aberto ou próximo), assunto e título 2D. Em `WORLDS`, diga o lugar (exterior do kit), a porta do mergulho, a peça da falha (o trecho exato onde o bug para), a consequência e o céu.
   Inclua uma seção **"O que muda em relação ao episódio anterior"** com esses cinco itens: lugar, porta do mergulho, peça da falha, consequência, céu. O episódio anterior é a pasta em `../` com o maior `NNN` abaixo do deste vídeo que tenha `SPEC.md` (`ls ..`; leia só o `SPEC.md` dele). Ele é 3D se tiver `assets/episode/scene.js`; se não tiver (é 2D, como 001–003) ou se não houver nenhum, compare com o exemplo do template (base de lançamento e Ariane 5 · escotilha da gaveta do SRI · `int16(horizontal_bias)` · chip SRI morto e placa vermelha · céu de dia). Pelo menos três dos cinco itens têm que mudar.
2. **`assets/episode/scene.js`**: reescreva o episódio do exemplo seguindo o guia do motor e o do kit (abaixo).
   - `const LOOP = {{DURACAO}};` e os cortes `T` nos inícios das palavras-âncora.
   - Planos de 1,7–3 s cobrindo `0` → `LOOP` sem buraco (o último termina em `LOOP + 0.01`), câmera sempre em movimento, fov ~50, assunto em 50–60 % da largura, alternando aberto/próximo e direção.
   - Exterior do kit que se lê sem rótulo; mergulho pela porta (`hatch` no Ariane 5; nos outros exteriores, uma porta, painel ou gaveta feita com `solid` do motor, que abre antes da câmera entrar: nada de corte seco); placa com `makeBoard({ ..., loop: LOOP })`, a linha de código do caso, a peça da falha e o bug (`bugWalk`) parando no ponto da falha; colapso com a peça morrendo e a consequência; o último plano termina em `p0`/`l0` do primeiro.
   - Todo `update` define tudo o que toca em toda chamada; piscadas com `loopPeriod(LOOP, ...)`; granulação 0; nada de `Math.random`/`Date.now`. Meta: até ~250 linhas.
3. **Títulos em `compositions/world.html`**: `const DUR = {{DURACAO}};`. Troque os títulos do exemplo (elementos `.title`/`.sub` e seus ids) pelos do episódio e agende-os na timeline nos tempos das âncoras. O título do gancho fica pousado no quadro 0 com `clipPath` explícito em `t = 0` e remonta idêntico antes do fim. Títulos curtos (a 128 px cabem ~11 caracteres por linha em x 96–948), em y 200–1130, sem cobrir o assunto 3D. Não mexa no bootstrap do motor.
4. **`assets/episode/trilha.json`**: reescreva com os tempos absolutos deste episódio, no mesmo esquema do exemplo: `ambiente` com três fontes, cada uma com `env`: `vento` (exterior), `zumbido` (placa) e `ronco` (estrondo grave); o alarme **não** é uma fonte: é a chave `alarme` dentro de `zumbido`, uma lista de trechos `[a, b]` em que o zumbido treme (colapso). `musica`: `tom` (`la_menor`, `re_menor` ou `mi_menor`), `drone` e `brilho` com `env`; `pulso` (crescendo da falha ao colapso) com `inicio`, `fim` e `bpm`, e `subida` opcional com `inicio` e `fim` (esses dois não usam `env`). `efeitos`: catálogo fixo `trava`, `deslize`, `baque`, `estalo`, `faisca`, `clique`, `tique`, cada um com `t` ou `tempos` e `ganho`; acrescente efeitos novos no fim da lista. Cada `env` é uma lista de `[a, b, nível, subida, descida]`. Os `.wav` são gerados pela etapa `trilha` do pipeline depois: não os gere.
5. **SFX no `index.html`**: substitua `#sfx-dive` pelos SFX do episódio (`<audio id="sfx-..." class="clip" ...>` com `data-start`, `data-duration`, `data-track-index` ≥ 30 e `data-volume`), só nos acertos que a trilha não cobre, com pico 1 quadro após a imagem (`data-start` = momento da imagem + 0,033 − pico do arquivo). Mantenha `world`, `captions`, `voice` e as 3 faixas da trilha intactos, cobrindo `0` → `{{DURACAO}}`.
6. **`npm run check`** e corrija todos os erros.
7. **Snapshots de cada ato** (todo snapshot leva `--describe false`; onde o guia do motor diz `env -u GEMINI_API_KEY`, use `--describe false`: o `env` não está liberado): `npx hyperframes snapshot --describe false --at <tempos>` com o quadro 0, pelo menos um momento de cada um dos 5 atos (meio de cada plano importante), o instante em que o bug para, o colapso e `{{DURACAO}} − 0,05`. **Abra e olhe cada PNG**: o exterior se lê pelo que é sem rótulo; o assunto ocupa 50–60 % da largura; texto no chão só em plano de cima e legível; o bug está no ponto da falha; títulos dentro da área útil, sem cobrir o assunto nem a legenda; o último quadro casa com o quadro 0. Peça alguns tempos fora de ordem para conferir que saem iguais. Corrija e tire os snapshots de novo até ficar certo.
8. **`REVIEW.md`**: o que cada snapshot mostra, o que foi corrigido e o que ficou pendente.
9. **Não renderize** e não deixe servidor de preview rodando: o pipeline gera a trilha e renderiza depois da aprovação.

---

Os dois guias abaixo são cópias de `assets/motor/PROMPT.md` e `assets/kit/KIT.md` desta pasta.

{{MOTOR}}

{{KIT}}
