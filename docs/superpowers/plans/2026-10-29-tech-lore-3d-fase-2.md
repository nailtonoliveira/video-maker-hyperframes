# Tech-lore 3D no template e no pipeline — Fase 2 — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Objetivo:** todo episódio novo do tech-lore sai em 3D pelo `./pipeline`, usando o motor da fase 1, com trilha
procedural e volume normalizado. A fase termina com um episódio real aprovado pelo usuário.

**Arquitetura:**
- **Template:** `niches/tech-lore/template/` vira um projeto 3D: motor instalado por vídeo, kit do nicho em
  `assets/kit/`, um episódio curto de exemplo e placeholders de áudio.
- **Pipeline:**
  - `new_video.py` instala o motor quando o `niche.json` declara `"motor"`;
  - o prompt de cenas recebe o `PROMPT.md` do motor (`{{MOTOR}}`) e a documentação do kit (`KIT.md`);
  - uma etapa nova, `trilha`, gera os `.wav` a partir de `assets/episode/trilha.json`;
  - o `render` normaliza o áudio para −14 LUFS quando o nicho pede.
- **Kit:** ganha uma biblioteca de exteriores conferida numa vitrine (um lab de exposição).

**Tecnologias:** Three.js r184, HyperFrames 0.8.200, Node 22 (`node --test`), Python 3 (`unittest`; numpy só no
`tools/.venv`), ffmpeg (loudnorm, SSIM).

**Spec:** `docs/superpowers/specs/2026-10-28-motores-compartilhados-design.md`. Fase 2 da seção 7; seções 5.2, 6 e 10.

## Restrições globais

- Todas as restrições globais da fase 1 continuam valendo. Elas estão em
  `docs/superpowers/plans/2026-10-28-motor-3d-fase-1.md`:
  - render determinístico, função pura de `t`;
  - granulação 0;
  - coordenadas perto da origem;
  - períodos que dividem o loop;
  - vídeo autocontido;
  - snapshots com `env -u GEMINI_API_KEY`;
  - Node 22 pelo caminho literal `/home/nai/.nvm/versions/node/v22.23.4/bin`;
  - `node --test` sempre com glob `tests/*.test.js`;
  - commits com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`;
  - push só quando o usuário pedir.
- Branch: `feat/motor-3d` (a mesma da fase 1, por decisão do usuário: um PR só para as duas fases), na worktree `.claude/worktrees/kit-3d`.
- **Não mexer** em `niches/ia-lab/`, `shared/kit3d/` (de outra sessão) nem `tools/set_duration.py`. O `set_duration.py`
  muda na branch `feat/nicho-ia-lab` para também atualizar `const DUR` no `world.html`.
- **Mudanças mínimas em `tools/new_video.py`**: um import e uma chamada. Essa branch e a `feat/nicho-ia-lab` mexem nas
  mesmas linhas, e o conflito na mesclagem tem que ser trivial.
- Os vídeos `niches/tech-lore/videos/001–003` ficam congelados: nada no pipeline pode reprocessá-los nem quebrá-los.
- Nichos sem `"motor"`, `"trilha"` ou `"audio_lufs"` no `niche.json` se comportam exatamente como hoje.
- Segredos: o `.env` não existe na worktree e não é copiado para ela. Nenhuma tarefa usa API paga, exceto a Tarefa 10,
  que roda com o usuário e no checkout que tiver o `.env`.
- Planos de 1,7–3 s com câmera em movimento, fov ~50, assunto ocupando 50–60 % da largura, texto no chão só em plano de
  cima e o bug no ponto da falha. Valem para o exemplo do template e para o que os prompts pedem.
- Arquivo final de 30–45 MB para 45–60 s.

## Foco da revisão

1. **Vídeos antigos não são tocados.** A etapa nova `trilha` aparece como "pendente" em `pipeline.json` antigos. Num
   vídeo sem `assets/episode/trilha.json`, ela tem que se marcar como feita, sem fazer nada. Teste
   `test_trilha_sem_json_nao_faz_nada` na Tarefa 8.
2. **Nicho 2D ou ia-lab não muda.** Sem `audio_lufs`, o render não normaliza; sem `motor`, o `new_video` não instala
   nada; sem `{{MOTOR}}` no prompt, o marcador não é exigido. Testes na Tarefa 2 (`test_nicho_sem_motor`) e na
   Tarefa 8 (`test_render_sem_lufs_nao_normaliza`).
3. **Duração do vídeo ≠ duração do exemplo.** No ensaio, a voz tem outra duração que a do exemplo do template. A trilha
   lê a duração do `index.html`, não do JSON, e eventos depois do fim são ignorados. Teste
   `test_eventos_depois_do_fim` na Tarefa 3.
4. **A normalização não pode estragar o vídeo.** Ela copia o vídeo (`-c:v copy`), mantém a duração e só troca o áudio.
   Se o ffmpeg falhar, o MP4 original fica intacto. Teste `test_normaliza_mantem_video` na Tarefa 4.
5. **Exteriores reconhecíveis.** Cada objeto tem que se ler pelo que é num enquadramento 9:16 aberto, sem rótulo. A
   vitrine da Tarefa 5/6 é olhada quadro a quadro e anotada em `REVIEW.md`.

---

### Tarefa 1: Branch, ambiente e pendências da fase 1

**Arquivos:**
- Criar: o link simbólico `tools/.venv` → `/home/nai/dark-channels/tools/.venv` (gitignored; necessário para o pipeline
  rodar na worktree)
- Modificar:
  - `tools/motor.py` (nenhuma mudança de comportamento; só testes novos)
  - `tools/tests/test_motor.py`
  - `niches/tech-lore/lab/kit-3d/assets/kit/props.js` e `exteriores.js`, `efeitos.js`, `tests/bits.test.js`
  - `niches/tech-lore/lab/kit-3d/assets/episode/scene.js`
- Apagar: `niches/tech-lore/lab/kit-3d/assets/kit/package.json`

**Interfaces:**
- Produz:
  - `makeAriane5()`: o `makeRocket` atual renomeado, com a mesma API (`group`, `pose`, `burn`, `nozzle`, `breakup`,
    `xray`, `hatch`);
  - `makeBitBlock(bits)` sem a opção `cols`. O `bitBlockState(cells, bits, t, {..., cols = 16})` continua sendo o único
    dono das colunas;
  - `makeExplosion({ at })` guarda `at.clone()`.

- [ ] **Passo 1:** continuar na `feat/motor-3d` (HEAD `9090c26`, sem branch nova) e
  `ln -s /home/nai/dark-channels/tools/.venv tools/.venv`. Confira com
  `tools/.venv/bin/python -c "import numpy, faster_whisper"`. Esperado: sem erro.
- [ ] **Passo 2: testes que faltam em `test_motor.py`**
  - `test_falta_motor`: `motor="2d"` inexistente levanta `FileNotFoundError` que cita `shared/motor-2d`;
  - `test_falta_tema`: sem `niches/<n>/tema.json`, o erro cita o caminho;
  - `test_cli`: rodar `python3 tools/motor.py <tmp_video> --nicho n` com `raiz` falsa. Se a CLI não aceitar raiz,
    teste via `subprocess` com uma raiz montada por cópia mínima. Se isso exigir mudar a CLI, adicione `--raiz` oculto.
  - Ver falhar o que for comportamento novo, implementar, ver passar.
- [ ] **Passo 3: testes de `intBits` em `bits.test.js`**
  - `intBits(32768, 16)` = `1` seguido de quinze `0` (o estouro do Ariane);
  - `intBits(-32768, 16)` = `1` seguido de quinze `0`;
  - `intBits(2 ** 40 + 5, 48)` termina em `…0101`, com 48 bits.
- [ ] **Passo 4: aplicar as mudanças de interface acima**
  - `makeRocket` → `makeAriane5`, também no `scene.js`;
  - remover `cols` do `makeBitBlock`;
  - `at.clone()` no `makeExplosion`;
  - apagar `assets/kit/package.json`. O `package.json` da raiz do lab já tem `"type": "module"`; confirme que o
    `node --test` continua passando.
- [ ] **Passo 5: frames iguais**
  - Reinstale o motor: `python3 tools/motor.py niches/tech-lore/lab/kit-3d --nicho tech-lore`.
  - Capture o snapshot dos 6 tempos de referência em `renders/t1`.
  - Rode `python3 tools/comparar_quadros.py niches/tech-lore/lab/kit-3d/renders/golden niches/tech-lore/lab/kit-3d/renders/t1`.
  - Esperado: tudo 1,000000.
- [ ] **Passo 6:** rodar todos os testes (node e unittest) e commitar com a mensagem
  `"fase 2: ambiente e pendências da fase 1 (testes, makeAriane5)"`.

---

### Tarefa 2: Nicho declara o motor, e o `new_video` instala

**Arquivos:**
- Modificar:
  - `tools/dc/config.py`: `DEFAULT_NICHE` ganha `"motor": None`, `"trilha": False`, `"audio_lufs": None` e
    `"mundos": None`;
  - `niches/tech-lore/niche.json`: `"motor": "3d"`, `"trilha": true`, `"audio_lufs": -14` e
    `"mundos": ["exterior", "mergulho", "placa"]`;
  - `tools/motor.py`;
  - `tools/new_video.py`: um import e uma chamada.
- Teste: `tools/tests/test_motor.py`

**Interfaces:**
- Produz `motor.instalar_do_nicho(video: Path, nicho: str, *, raiz: Path = ROOT) -> str | None`. Lê
  `niches/<nicho>/niche.json`. Sem `"motor"`, devolve `None` e não toca em nada; com `"motor"`, chama
  `instalar_motor(video, nicho, motor, raiz=raiz)` e devolve a versão.
- `new_video.py` chama `instalar_do_nicho(dest, args.nicho)` **depois** de escrever `meta.json` e `package.json`, e
  imprime `motor <tipo> <versão>` na saída quando houver. A linha `Criado: <rel>` continua idêntica, porque
  `pipeline.py` a lê com regex.

- [ ] **Passo 1: testes que falham**
  - `test_nicho_sem_motor`: devolve `None` e o vídeo fica sem `assets/motor`;
  - `test_nicho_com_motor`: instala e devolve a versão; o `meta.json` ganha `motor.versao`.
- [ ] **Passo 2:** implementar e ver passar.
- [ ] **Passo 3: prova real**
  - `python3 tools/new_video.py tech-lore teste-motor`. Esperado: o vídeo novo tem `assets/motor/core.js`,
    `assets/tema.js` e `meta.json` com `motor`.
  - Apague o vídeo de teste (`rm -r niches/tech-lore/videos/<NNN>-teste-motor`).
  - O template ainda é 2D nesta tarefa. É esperado que o vídeo de teste tenha o motor sem usá-lo.
- [ ] **Passo 4:** commit com a mensagem `"pipeline: nicho declara motor; new_video instala motor e tema"`.

---

### Tarefa 3: Trilha procedural genérica (`shared/trilha/`)

**Arquivos:**
- Criar:
  - `shared/trilha/trilha.py`;
  - `shared/trilha/README.md`, que documenta o esquema do JSON em até 60 linhas;
  - `tools/tests/test_trilha.py`, que roda com `tools/.venv/bin/python -m unittest`;
  - `niches/tech-lore/lab/kit-3d/assets/episode/trilha.json`, a trilha do Ariane no formato novo.
- Apagar: `niches/tech-lore/lab/kit-3d/episode/ariane5_audio.py` (e a pasta `episode/`, que fica vazia).

**Interfaces:**
- CLI: `tools/.venv/bin/python shared/trilha/trilha.py <video_dir>`.
  - Lê `<video>/assets/episode/trilha.json` e a duração da raiz em `<video>/index.html` (o mesmo regex de
    `stages.Video.duracao`).
  - Escreve `<video>/assets/audio/{ambiente,musica,efeitos}.wav` (48 kHz, estéreo, 16 bits).
  - Imprime uma linha por arquivo, como hoje: `nome: pico X, rms Y dBFS`.
  - Sai com código 1 e mensagem clara se faltar o JSON ou o `index.html`.
- Função `gerar(spec: dict, duracao: float, saida: Path) -> dict[str, Path]`.
- Esquema do `trilha.json`. Tempos absolutos em segundos do vídeo; `env` = lista de `[a, b, nível, subida?, descida?]`,
  com a mesma semântica do `env()` atual:

```json
{
  "semente": 501,
  "ambiente": {
    "ronco":   {"env": [[2.0, 5.34, 0.4, 0.05, 0.05]]},
    "vento":   {"env": [[2.0, 8.28, 0.3]]},
    "zumbido": {"env": [[0, 2.0, 0.4, 0.001, 0.05]], "alarme": [[28.24, 35.94]]}
  },
  "musica": {
    "tom": "la_menor",
    "drone":  {"env": [[0, 8.28, 0.8, 0.001, 0.4]]},
    "brilho": {"env": [[8.28, 17.96, 0.8, 0.8, 0.5]]},
    "pulso":  {"inicio": 17.96, "fim": 35.94, "bpm": 120},
    "subida": {"inicio": 35.94, "fim": 39.09}
  },
  "efeitos": [
    {"tipo": "trava", "t": 20.31, "ganho": 0.8},
    {"tipo": "clique", "tempos": [29.9, 29.95], "ganho": 0.3}
  ]
}
```

- Catálogo fixo de efeitos, com a síntese de hoje: `trava` (clank), `deslize` (slide), `baque` (thump), `estalo`
  (crack), `faisca` (zap), `clique` (click) e `tique` (tick).
  - Cada efeito aceita `t` **ou** `tempos`, e `ganho`.
  - Os aleatórios usam `semente` + o índice do efeito na lista.
- Tons disponíveis em `musica.tom`: `la_menor` (as frequências de hoje), `re_menor` e `mi_menor`, transpondo o mesmo
  acorde.
- Os períodos de LFO continuam ajustados para dividir a duração (`p = L / max(1, round(L / periodo))`).
- Eventos ou trechos depois do fim são cortados sem erro.

- [ ] **Passo 1: testes que falham** (com uma duração curta de 4 s, para rodar rápido)
  - `test_gera_tres_wavs`: 48 kHz, estéreo e a duração certa (±1 amostra);
  - `test_deterministico`: duas gerações dão bytes iguais;
  - `test_eventos_depois_do_fim`: um efeito em `t = 99` não quebra e não muda o arquivo;
  - `test_silencio_sem_camadas`: com `ambiente` vazio, o `ambiente.wav` sai silencioso. O `write` não pode dividir por
    zero; com pico 0, grava zeros;
  - `test_tom_invalido`: lança erro com uma mensagem que cita `tom`.
- [ ] **Passo 2:** implementar o `trilha.py` reaproveitando `ff_noise`, `env`, `one_shot`, `place`, `write` e a
  síntese do `ariane5_audio.py`. Ver os testes passarem.
- [ ] **Passo 3: o Ariane no formato novo**
  - Escreva o `trilha.json` do lab com os mesmos trechos e tempos do script antigo.
  - Para os cliques de queda de bits, calcule os 48 tempos uma vez, com a fórmula do script antigo, e grave-os na lista
    `tempos`.
  - Para os tiques de nascimento, faça o mesmo com 64 tempos.
- [ ] **Passo 4: comparar com a trilha antiga**
  - Gere a trilha nova num diretório temporário e compare com os `.wav` versionados de hoje.
  - Esperado: o RMS de cada arquivo a ±1 dB do antigo, e os eventos de `efeitos.wav` nos mesmos instantes (picos a
    ±10 ms).
  - Depois, gere por cima no lab e confirme com `check` e um snapshot de 1 quadro que o projeto continua íntegro.
- [ ] **Passo 5:** apagar `episode/ariane5_audio.py` e commitar com a mensagem
  `"trilha: gerador procedural genérico (shared/trilha) e Ariane migrado"`.

---

### Tarefa 4: Normalização de volume no render

**Arquivos:**
- Criar: `tools/dc/audio.py`
- Teste: `tools/tests/test_audio.py`

**Interfaces:**
- `medir_lufs(mp4: Path) -> float`: lê `input_i` de `ffmpeg -af loudnorm=print_format=json -f null -`.
- `normalizar(mp4: Path, lufs: float) -> tuple[float, float]`: devolve `(antes, depois)`.
  - Faz o loudnorm em duas passadas (`I=lufs:TP=-1.5:LRA=11`, com os valores medidos na 1ª passada), `-c:v copy`,
    `-c:a aac -b:a 192k`.
  - Escreve num arquivo temporário ao lado e só depois troca pelo original (`os.replace`).
  - Se o ffmpeg falhar, levanta `RuntimeError` com o fim do stderr, e o original fica intacto.

Ruling: a spec (seção 6.4) põe a normalização na etapa `trilha`. Mas o mix só existe depois do render (voz + trilhas
+ SFX misturados pelo HyperFrames), então a normalização vai para o fim do `render`. Registrar isso na seção 10 da spec
na Tarefa 10.

- [ ] **Passo 1: testes que falham**, com um MP4 sintético de 3 s gerado no `setUp` (`ffmpeg -f lavfi testsrc` +
  `sine` a −30 dB)
  - `test_normaliza_para_alvo`: depois de `normalizar(..., -14)`, `medir_lufs` dá −14 ± 1;
  - `test_normaliza_mantem_video`: o stream de vídeo tem o mesmo hash (`ffmpeg -map 0:v -c copy -f md5 -`) e a mesma
    duração ±0,05 s;
  - `test_falha_preserva_original`: com um caminho inválido para o ffmpeg (simule com `ffmpeg_bin=` injetável), o
    arquivo original fica byte a byte igual.
- [ ] **Passo 2:** implementar e ver passar (`python3 -m unittest tools.tests.test_audio`).
- [ ] **Passo 3:** commit com a mensagem `"pipeline: normalização de volume (loudnorm 2 passadas) em tools/dc/audio.py"`.

---

### Tarefa 5: Kit no template e vitrine de exteriores (parte 1)

**Arquivos:**
- Criar:
  - `niches/tech-lore/template/assets/kit/`: cópia do kit do lab depois da Tarefa 1, com `props.js`, `placa.js`,
    `exteriores.js`, `efeitos.js`, `bits.js` e `tests/`. **A partir daqui, a fonte da verdade do kit é o template**, e
    o lab fica congelado como episódio de referência;
  - `niches/tech-lore/template/assets/kit/KIT.md`, a API do kit em até 100 linhas, no tom do `PROMPT.md` do motor;
  - `niches/tech-lore/lab/vitrine/`: um projeto HyperFrames de exposição. É um `index.html` com uma `world.html` que
    mostra cada exterior em plano aberto 9:16, girando devagar, 4 s por objeto, na luz do dia (`SKIES.day` +
    `makeTerrain`) ou na da placa;
  - `niches/tech-lore/lab/vitrine/REVIEW.md`.
- Modificar: `niches/tech-lore/template/assets/kit/exteriores.js`.

**Interfaces:**
- Cada exterior novo segue o padrão do `makeAriane5`. É uma fábrica `makeX(opts) -> { group, ...estado }`, com a origem
  no centro da base, sólidos e arestas do estilo `maquete` (`solid`, `fill`, `edge` e `M`, com cores de `COL` ou
  cinzas neutros) e nenhum tempo de episódio dentro. O estado é sempre passado por métodos com valores 0→1 ou
  booleanos, que definem tudo o que tocam em toda chamada.
- O tamanho é documentado no comentário da fábrica (1 u = 1 m nos objetos novos; o `makeAriane5` continua com
  1 u ≈ 5 m).
- Nesta tarefa:
  - `makeDataCenter({ racks = 8 })` com `{ group, leds(t, period), alarme(k) }`: corredor de racks com LEDs piscando
    (períodos via `loopPeriod` passado pelo episódio) e uma luz de alarme que vai ao vermelho com `k`;
  - `makeTradingFloor({ mesas = 6 })` com `{ group, telas(valor), queda(k) }`: mesas com monitores e um telão de
    cotação; `telas` mostra um número com `label`, e `queda` deixa o gráfico vermelho;
  - `makeMedicalDevice()` com `{ group, feixe(on), alerta(k) }`: aparelho de radioterapia (cabeçote giratório, maca e
    console).
- Na vitrine, o `scene.js` usa `createEpisode` com 4 s por objeto (incluindo o `makeAriane5` e a base) e loop =
  soma das durações.

- [ ] **Passo 1:** copiar o kit para o template (`cp -r`) e criar a vitrine. O motor é instalado na vitrine com
  `tools/motor.py`, e o kit é copiado do template com `cp -r` (o `README` da vitrine diz isso).
- [ ] **Passo 2:** implementar os 3 exteriores, com testes em Node só para o que for lógica pura. Nada de teste de
  malha.
- [ ] **Passo 3: `check` e snapshot**
  - `check` sem erros.
  - Snapshot da vitrine no meio de cada objeto e com `--angle iso` em um deles.
  - Leia cada PNG e escreva no `REVIEW.md`, por objeto: o que se reconhece, o que confunde e o que foi ajustado.
  - Itere até os 3 se lerem sem rótulo.
- [ ] **Passo 4:** escrever o `KIT.md` (motor à parte, peças, placa, efeitos, exteriores e o bug) e commitar com a
  mensagem `"tech-lore: kit no template, vitrine e 3 exteriores (data center, pregão, radioterapia)"`.

---

### Tarefa 6: Vitrine de exteriores (parte 2)

**Arquivos:**
- Modificar:
  - `niches/tech-lore/template/assets/kit/exteriores.js`, `KIT.md`;
  - a vitrine (`scene.js`, `REVIEW.md`; recopie o kit).

**Interfaces:**
- Consome o padrão da Tarefa 5.
- Produz:
  - `makeAirplane()` com `{ group, pose(p, a), trem(k), dano(k) }`: avião comercial (fuselagem, asas, empenagem e
    turbinas);
  - `makeCar()` com `{ group, rodas(ang), freio(on) }`: carro de passeio;
  - `makeSpaceProbe()` com `{ group, paineis(k), antena(ang), pose(p, a) }`: sonda espacial com painéis solares e
    antena parabólica. O `pose(p, a)` faz do objeto um alvo de `follow(…)`.

- [ ] **Passo 1:** implementar os 3 exteriores e incluí-los na vitrine.
- [ ] **Passo 2:** `check`, snapshot e leitura dos PNGs, como na Tarefa 5. Itere até os 6 objetos novos se lerem sem
  rótulo. O `REVIEW.md` fecha com uma tabela de objeto × reconhecível (sim/não) × observação.
- [ ] **Passo 3:** commit com a mensagem `"tech-lore: exteriores avião, carro e sonda na vitrine"`.

---

### Tarefa 7: Template 3D do tech-lore

**Arquivos:**
- Modificar:
  - `niches/tech-lore/template/index.html`: world, captions, voz, as 3 trilhas (com os volumes do lab: ambiente 0,32,
    música 0,16, efeitos 0,9) e um SFX de exemplo;
  - `niches/tech-lore/template/SPEC.md`.
- Criar:
  - `niches/tech-lore/template/compositions/world.html`: canvas, camada de títulos 2D (as funções `show`, `hide`,
    `wipe` e `hit` do lab, com o título do quadro 0 com `clipPath` explícito em t=0) e o bootstrap do motor;
  - `niches/tech-lore/template/assets/episode/scene.js`: um exemplo de 12 s com os 5 atos em miniatura (exterior com a
    base e o Ariane → mergulho → placa com a linha de código e o bug → alarme → volta ao quadro 0), ≤ 160 linhas;
  - `niches/tech-lore/template/assets/episode/trilha.json`: a trilha do exemplo;
  - `niches/tech-lore/template/assets/audio/{ambiente,musica,efeitos}.wav`: placeholders de 1 s de silêncio (48 kHz,
    estéreo), para o `check` passar antes da etapa `trilha`.
- Apagar: `niches/tech-lore/template/compositions/bg.html` e `s1.html`.

**Interfaces:**
- `world.html` declara `const DUR = 12;` e termina a timeline com `tl.set({}, {}, DUR)`. O `scene.js` declara
  `const LOOP = 12;`.
- Ruling: o `set_duration.py` não é alterado nesta branch (ver Restrições). O prompt de cenas manda o `claude -p`
  ajustar `DUR` e `LOOP` para `{{DURACAO}}`. Depois da mesclagem com a `feat/nicho-ia-lab`, o `set_duration.py` de lá
  atualiza o `DUR` sozinho.

- [ ] **Passo 1:** escrever os arquivos.
- [ ] **Passo 2: verificar num vídeo de teste**
  - `python3 tools/new_video.py tech-lore teste-template`, depois
    `tools/.venv/bin/python shared/trilha/trilha.py <vídeo>`.
  - No vídeo: `check` (0 erros) e snapshot em `0,2,4,6,8,10,11.9` com `--no-end`.
  - Leia os PNGs e confira:
    - planos ≥ 1,7 s;
    - o título do quadro 0;
    - o bug visível no ato da placa;
    - o quadro de 11,9 s casando com o 0.
  - Render rápido (`--quality draft`) para confirmar tamanho e áudio. Esperado: proporcional a ≤ 45 MB por 60 s.
  - Apague o vídeo de teste.
- [ ] **Passo 3:** commit com a mensagem `"tech-lore: template 3D (motor, kit, exemplo de 12 s, trilha)"`.

---

### Tarefa 8: Pipeline — `{{MOTOR}}`, `mundo`, etapa `trilha` e normalização

**Arquivos:**
- Modificar:
  - `tools/dc/stages.py`: o `ETAPAS` ganha `"trilha"` entre `"cenas"` e `"render"`, mais `etapa_trilha`,
    `etapa_render`, `etapa_prompt`, `roteiro_md` e `_validar_roteiro`;
  - `tools/fixtures/ensaio/roteiro.json`: o campo `mundo` em cada cena.
- Teste: `tools/tests/test_stages.py`, com um vídeo falso em diretório temporário (`pipeline.json`, `index.html`
  mínimo, `niche.json` falso via monkeypatch de `config.NICHES`).

**Interfaces:**
- `etapa_prompt`:
  - se `cfg["motor"]`, passa `MOTOR=` com o conteúdo de `<video>/assets/motor/PROMPT.md` e `KIT=` com o de
    `<video>/assets/kit/KIT.md` (string vazia se não existir); senão `MOTOR=""` e `KIT=""`;
  - cada cena da timeline ganha a linha `- Mundo: <mundo>` quando existir.
- `roteiro_md`: imprime `**Mundo:** <mundo>` quando a cena tiver.
- `_validar_roteiro(d, mundos=None)`: com `mundos`, cada cena precisa de `mundo ∈ mundos`; a mensagem cita a cena. A
  chamada em `etapa_roteiro` passa `cfg.get("mundos")`.
- `etapa_trilha(v, ajustes="")`:
  - sem `assets/episode/trilha.json`, devolve `"sem trilha.json: nada a gerar"`;
  - com ele, roda `config.VENV_PY shared/trilha/trilha.py <video>` e devolve a saída.
  - Fica fora de `aprovacoes`.
- `etapa_render`: depois do render, se `cfg.get("audio_lufs") is not None`, chama `audio.normalizar(mp4, lufs)` e
  acrescenta ao resumo `áudio: <antes> → <depois> LUFS`.

- [ ] **Passo 1: testes que falham**
  - `test_trilha_sem_json_nao_faz_nada`;
  - `test_trilha_com_json_gera_wavs` (usa o `trilha.json` do template e um `index.html` de 3 s);
  - `test_validar_roteiro_mundo` (falta o `mundo` → erro; mundo fora da lista → erro; sem `mundos` → aceita);
  - `test_render_sem_lufs_nao_normaliza` (monkeypatch de `v.hf` e de `audio.normalizar` para registrar chamadas);
  - `test_prompt_sem_motor_nao_exige_marcador`.
- [ ] **Passo 2:** implementar e ver passar.
- [ ] **Passo 3:** confirmar que `./pipeline status tech-lore` lista 001–003 sem erro e sem mudar os `pipeline.json`
  deles (`git status` limpo nessas pastas).
- [ ] **Passo 4:** commit com a mensagem `"pipeline: etapa trilha, normalização, MOTOR/KIT no prompt e campo mundo"`.

---

### Tarefa 9: Identidade 3D (NICHE.md e prompts) e ensaio de ponta a ponta

**Arquivos:**
- Modificar:
  - `niches/tech-lore/NICHE.md`:
    - "Formato": o arco em 5 atos mapeado às 5 cenas;
    - "Visual": maquete técnica, céu em domo 3D permitido ("nada de gradiente 2D chapado"), granulação proibida,
      ritmo e enquadramento do motor, o bug no ponto da falha, exteriores do kit;
    - "Som": as trilhas procedurais e o volume a −14 LUFS;
    - "Lições do 001": a granulação;
  - `niches/tech-lore/prompts/roteiro.md`: a regra 8 descreve exterior, mergulho, placa e bug; o JSON de resposta ganha
    `"mundo": "exterior | mergulho | placa"` por cena;
  - `niches/tech-lore/prompts/hyperframes.md`: reescrito no estilo do ia-lab (ler na `feat/nicho-ia-lab`, só leitura),
    com:
    - `{{MOTOR}}` e `{{KIT}}` inseridos;
    - os arquivos que já existem;
    - a ordem de trabalho: `SPEC.md` com os planos → `scene.js` (ajustar `LOOP`) → títulos no `world.html` (ajustar
      `DUR`) → `assets/episode/trilha.json` → SFX no `index.html` → `npm run check` → snapshots de cada ato →
      `REVIEW.md`;
    - "não renderize";
    - o pedido para que o `SPEC.md` diga o que muda em relação ao episódio anterior (lugar, porta do mergulho, peça da
      falha, consequência, céu);
  - a tabela de episódios do `NICHE.md`: uma nota de que 001–003 são 2D e o próximo é 3D.

- [ ] **Passo 1:** escrever as mudanças.
- [ ] **Passo 2: ensaio de ponta a ponta**, sem APIs pagas
  - Rode `./pipeline novo tech-lore --tema "Ensaio 3D" --ensaio --auto`.
  - Esperado:
    - todas as etapas terminam; no ensaio, as cenas ficam as do template;
    - a `trilha` gera os 3 `.wav`;
    - o `render` gera o MP4 e reporta `áudio: X → −14 LUFS` (±1);
    - o `hyperframes-prompt.md` contém o `PROMPT.md` e o `KIT.md`.
  - Anote os números no commit.
- [ ] **Passo 3: limpeza**
  - Apague o vídeo de ensaio e as entradas dele em `niches/tech-lore/catalogo.json`.
  - `git diff` do catálogo vazio em relação ao commit anterior.
- [ ] **Passo 4:** commit com a mensagem `"tech-lore: identidade 3D (NICHE.md, prompts) e ensaio do pipeline"`.

---

### Tarefa 10: Episódio real (com o usuário)

Esta tarefa não vai para subagente: o controlador conduz com o usuário. Ela usa a voz da ElevenLabs (paga) e o
`claude -p` da assinatura. O `.env` não existe na worktree, então ela roda onde o usuário decidir, normalmente no
checkout principal depois da mesclagem.

- [ ] **Passo 1:** o usuário escolhe o tema e o lugar de execução. O controlador apresenta 3 temas do catálogo que
  combinem com os exteriores prontos.
- [ ] **Passo 2:** `./pipeline novo tech-lore <ID>`, com as aprovações normais (roteiro, voz, cenas, metadados).
- [ ] **Passo 3: critérios de aceite da spec**
  - check sem erros;
  - planos ≥ 1,6 s;
  - loop fechando (SSIM do quadro 0 contra o último ≥ 0,98);
  - arquivo de 30–45 MB;
  - mix entre −15 e −13 LUFS;
  - **aprovação do usuário**.
- [ ] **Passo 4:**
  - Registre o episódio na tabela do `NICHE.md`.
  - Registre o resultado na seção 10 da spec: fase 2 concluída e as lições, sobretudo o que o `claude -p` errou e o que
    entrou no `PROMPT.md` ou no `KIT.md`.
  - Commit.

## Nota de mesclagem com a `feat/nicho-ia-lab`

A outra sessão criou `shared/kit3d/kit3d.js` e mudou `tools/new_video.py` e `tools/new_niche.py`: hoje, eles copiam
o `kit3d` para qualquer vídeo cujo template tenha um `compositions/world.html`, o que inclui o template 3D do
tech-lore. Na mesclagem:
- manter as duas cópias condicionadas ao nicho (o `kit3d` quando o template tiver `assets/kit3d.js`; o motor quando o
  `niche.json` tiver `"motor"`);
- tirar o gatilho por `world.html`;
- unificar `shared/kit3d` e `shared/motor-3d` conforme o "Depois" da seção 7 da spec.

Essa unificação não faz parte da fase 2.
