/hyperframes Crie as cenas 3D e o HUD 2D deste vídeo vertical para YouTube Shorts / Reels / TikTok (1080 × 1920, 30 fps): "{{TITULO}}".

Modo sem paradas: não faça perguntas e não ofereça alternativas para escolha. Decida e execute. Este projeto faz parte de um workspace com vários vídeos: trabalhe **somente dentro desta pasta** (fora dela, só leitura).

# O que já existe nesta pasta (não recrie do zero!)
Projeto HyperFrames criado a partir do template 3D do **business-forensics** ("A Mesa da Perícia"). O **episódio-modelo** (Monarca S.A., 52 s, 22 planos) está montado e funcionando. **Reescreva-o** para este episódio, aproveitando a estrutura.
- `index.html`: monta, de `0` até `{{DURACAO}}` s, `compositions/world.html` (`#world`), `compositions/hud.html` (`#hud`), `compositions/captions.html` (`#captions`), a locução (`#voice`), as **3 faixas da trilha procedural** (`#ambiente`, `#music`, `#efeitos` → `assets/audio/*.wav`) e os SFX (`#sfx-*`). A raiz e essas faixas já estão com {{DURACAO}} s.
- `compositions/world.html`: o `<canvas id="gl">` do mundo 3D e o bootstrap do motor (`montar.js`, `hf-seek`, `buildReady`: **não mexa**; apenas ajuste `const DUR = {{DURACAO}};`).
- `compositions/hud.html`: a **camada 2D do HUD** (`#hud-ficha`, `#hud-valor`, `#hud-data`, `#hud-carimbo`) com os helpers `ficha()`, `valor()`, `data()` e `carimbo()` registrados em `window.__timelines["hud"]`. Ajuste `const DUR = {{DURACAO}};` e agende os textos e números reais deste episódio nas âncoras.
- `assets/episode/scene.js`: o **episódio 3D** (planos de 1,7–3,0 s nos mundos `imperio`, `livro`, `sala`, `pregao`, `skies: SKIES_BF` e rebobinagem nos últimos 2,4 s).
- `assets/episode/trilha.json`: a trilha procedural em `"re_menor"`, com o silêncio dramático de 0,6 s logo após o carimbo.
- `assets/motor/` + `assets/motor/PROMPT.md` e `assets/tema.js`: motor 3D e tema validados. Não edite.
- `assets/kit/` + `assets/kit/KIT.md`: peças do nicho (`cores.js`, `sala.js`, `imperio.js`, `provas.js`, `livro.js`, `truques.js`, `elenco.js`, `exteriores.js`, `efeitos.js`, `telas.js`). Não edite.
- `assets/voice.mp3` (**{{DURACAO}} s**, {{FRAMES}} frames) e `assets/voice.json` (tempo de cada palavra, do Whisper). É o relógio do vídeo.
- `compositions/captions.html`: legendas `label-tag` já geradas. **Nunca edite** (são regeneradas por script).
- `assets/sfx/`: os 14 arquivos de SFX (`click`, `error`, `glitch-1/2/3`, `impact-bass-1/2`, `key-press`, `ping`, `pop`, `riser`, `typing`, `whoosh`, `whoosh-short`).
- `SPEC.md` e `roteiro.md`: plano e roteiro aprovado deste episódio.
- `../../NICHE.md`: identidade visual e regras da série. **Siga à risca**.

# Título na ficha do quadro 0 (vira a thumbnail)
"{{TITULO_TELA}}": pousado no quadro 0 em `#hud-ficha` (`clipPath: "inset(0 0% 0 0)"` explícito em `t = 0`), e remontado idêntico em `{{DURACAO}} - 0.6` s.

# Sincronização (calculada a partir de assets/voice.json)
Cada cena ocupa o intervalo abaixo; cada âncora é o instante em que aquele visual deve acontecer. Confira em `assets/voice.json` a palavra exata e prenda o evento ao início dela (cortes de plano, trocas de ficha/medidor/data, truque no livro, luz UV, carimbo 3D + 2D, queda da torre, efeitos da trilha).

{{TIMELINE}}

# Fatos que podem aparecer na tela
Valores reais no medidor `#hud-valor`, no selo `#hud-data`, na placa da torre, no livro-caixa e nas etiquetas de prova; nada inventado. Respeite P7 (sem logotipos/marcas reais) e P8 (`CONDENADO` só com condenação registrada).

{{FATOS}}

# Ordem de trabalho
1. **`SPEC.md`**: preencha os planos (`SHOTS`, 1,7–3,0 s cortados nas âncoras), `CASE` e `DIFF` (o que muda em relação ao episódio anterior ou ao modelo: nome do caso, forma do império, truque físico, carimbo e consequência — pelo menos 3 itens têm que mudar).
2. **`assets/episode/scene.js`**:
   - `const LOOP = {{DURACAO}};` e os tempos `T` nos inícios das palavras-âncora.
   - Planos de 1,7–3,0 s cobrindo `0` → `LOOP + 0.01`, alternando aberto/próximo e direção, com assunto centrado em y 600–1290.
   - Use `SKIES_BF`, `makeEvidenceRoom`, `makeEmpireTower`, o elenco (`makeMagnata`, `makePerita`, `makeContador`, `makeManada`, `makeFiscal`), o livro (`makeLedger` em `(0, -200, 0)`) e o truque do caso (`makeShellBoxes`, `makePonziPyramid` ou `makeBubble`).
   - Nos últimos ~2,4 s (`t >= LOOP - 2.4`), aplique o fator de rebobinagem `rew = 1 - E.p3io(seg(t, LOOP - 2.4, LOOP - 0.2))` em toda função de queda e termine o último plano em `SH[0].p0` / `SH[0].l0` (`ease: "p3io"`), para o último quadro casar com o quadro 0.
3. **`compositions/world.html` e `compositions/hud.html`**:
   - Ajuste `const DUR = {{DURACAO}};` nos dois arquivos.
   - Em `compositions/hud.html`, agende `ficha()`, `valor()`, `data()` e `carimbo()` nos tempos das âncoras, mantendo o medidor em movimento (nunca parado por > 8 s) e remontando o estado do quadro 0 na rebobinagem.
4. **`assets/episode/trilha.json`**: ajuste os tempos para `{{DURACAO}}` s, mantendo `"tom": "re_menor"` e o silêncio dramático de 0,6 s no `drone` logo após o instante do carimbo.
5. **SFX no `index.html`**: ajuste os `<audio id="sfx-..." class="clip" ...>` com pico 1 quadro após os eventos (zero SFX em `t = 0` e nos últimos 100 ms).
6. **`npm run check`** e corrija todos os erros.
7. **Snapshots**: `npx hyperframes snapshot --describe false --at <tempos>` cobrindo `0`, cada ato, o instante exato do carimbo e `{{DURACAO}} - 0.05`. Abra e confira cada PNG (contraste, zona segura x 64–920 / y 220–1500, legibilidade e igualdade entre quadro 0 e final).
8. **`REVIEW.md`**: registre o que cada snapshot mostra e o que foi ajustado.
9. **Não renderize** e não deixe servidor de preview rodando.

---

Os dois guias abaixo são cópias de `assets/motor/PROMPT.md` e `assets/kit/KIT.md` desta pasta.

{{MOTOR}}

{{KIT}}
