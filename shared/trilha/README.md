# shared/trilha — trilha procedural genérica

Gera `assets/audio/{ambiente,musica,efeitos}.wav` (48 kHz, estéreo, 16 bits) a partir de
`<video>/assets/episode/trilha.json`. Determinística (ruídos do ffmpeg com semente + numpy).

    tools/.venv/bin/python shared/trilha/trilha.py <pasta-do-video>

Lê também a duração da raiz em `<video>/index.html` (`data-composition-id="main" ... data-duration`),
não do JSON: eventos e trechos depois do fim são cortados sem erro. Sai com código 1 se faltar um dos dois.
Em Python: `gerar(spec, duracao, saida) -> {"ambiente": Path, "musica": Path, "efeitos": Path}`.

## Esquema do trilha.json

Tempos absolutos, em segundos do vídeo. Todas as chaves são opcionais; camada ausente = silêncio
(arquivo de zeros).

    {"semente": 501,
     "ambiente": {"ronco": {"env": [...]}, "vento": {"env": [...]},
                  "zumbido": {"env": [...], "alarme": [[28.24, 35.94]]}},
     "musica":   {"tom": "la_menor", "drone": {"env": [...]}, "brilho": {"env": [...]},
                  "pulso": {"inicio": 17.96, "fim": 35.94, "bpm": 120},
                  "subida": {"inicio": 35.94, "fim": 39.09}},
     "efeitos":  [{"tipo": "trava", "t": 20.31, "ganho": 0.8},
                  {"tipo": "clique", "tempos": [29.9, 29.95], "ganho": 0.3}]}

- `env`: lista de `[a, b, nível, subida?, descida?]` (rampas lineares em s; padrão 0,08). Trechos
  sobrepostos valem pelo maior nível.
- `ambiente.ronco` (estrondo grave), `vento` (sopro médio), `zumbido` (50/100/150 Hz + chiado);
  `alarme` faz o zumbido tremer a 2 Hz nos trechos `[a, b]`.
- `musica.tom`: `la_menor` (padrão), `re_menor` ou `mi_menor` (transpõe o mesmo acorde); outro valor dá
  erro citando `tom`. `drone` e `brilho` são vozes sustentadas (envelope `env`); `pulso` é bumbo mais
  tique a `bpm`, crescendo de `inicio` a `fim`; `subida` é um glissando que sobe de `inicio` a `fim`.
  Os LFOs são ajustados para dividir a duração (loop sem salto).
- `efeitos`: catálogo fixo `trava` (clank), `deslize`, `baque`, `estalo`, `faisca`, `clique`, `tique`.
  Cada um aceita `t` ou `tempos` e `ganho` (número, ou lista com um ganho por tempo). Os aleatórios usam
  `semente` + o índice do efeito na lista (acrescente efeitos novos no fim para não mudar os antigos).
- Picos de saída: ambiente 0,7, música 0,7, efeitos 0,85.
