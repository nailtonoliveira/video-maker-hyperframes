# REVIEW — Ariane 5 (Shorts 1080x1920, 48.28 s)

## Decisões criativas
- Roteiro e tempos do pedido seguidos; os slots das cenas foram estendidos para não deixar buracos pretos entre elas:
  S1 0–8.10 · S2 8.10–17.80 · S3 17.80–30.00 · S4 30.00–40.70 · S5 40.70–48.28.
- Cada evento visual está preso ao início da palavra correspondente em audio-01.json (ver comentários `at(...)` em cada cena).
- Legendas queimadas (Shorts é muito visto sem som): grupos de até 3 palavras, palavra ativa em verde-menta,
  geradas por `scripts/build_captions.py` (corrige a transcrição "Ao 36" → "Aos 36").
- Loop: o último frame (48.25 s) remonta o título "UMA LINHA DE CÓDIGO" na mesma posição do frame 0, e a grade
  do fundo anda exatamente 60 px (uma célula) no vídeo todo, então não há salto no corte do loop.
- Cronômetro da cena 1 conta para cima até 00:37 e trava (pedido atual), não regressiva como no roteiro original.
- Fatos de apoio na tela: voo V501, 04/06/1996, Kourou; carga 4× Cluster; ALT ≈ 3.5 km em T+36 s;
  função de alinhamento herdada do Ariane 4 que rodava ~40 s após a decolagem (relatório da comissão de inquérito).

## Medido x apenas visto
- `check`: 0 erros. Avisos mantidos de propósito:
  - `line_unread` no título final / "↻ reiniciando" (1.4–1.8 s): é a ponte do loop, o título continua no frame 0.
  - `content_overlap` (info) em 25.9–26.2 s: o valor 32768.5 voando sobre o rótulo da seta, transitório e intencional.
- Snapshots revisados: beats, 4 costuras, tela de celular e os momentos de QA do SPEC.
- Som: picos dos SFX medidos com `hyperframes audio` e posicionados 1 frame após a imagem. **Não foi ouvido.**
  Não há trilha musical: sem login HeyGen nem MusicGen local. Para adicionar, coloque um MP3 em assets/ e um
  `<audio id="music" ... data-volume="0.14">` no index.html.

## Ponto mais fraco
- Metade inferior do quadro (abaixo das legendas) fica só com a grade: é a zona da interface do Shorts, mantida
  vazia de propósito. Com mais tempo: uma textura de telemetria em baixa opacidade ali.
- O flash da explosão (39.0 s) é branco a 80%: se ficar forte demais no celular, baixar para 0.6 em s4.html.
