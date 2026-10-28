# SPEC — Ariane 5: o bug de 370 milhões

GOAL:    o espectador sente o absurdo de uma linha inútil destruir um foguete e, no loop, assiste de novo.
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps (YouTube Shorts)
TIME:    48.28 s x 30 = 1448 frames. Relógio = locução (assets/voice.mp3, timestamps de audio-01.json).

LOOK:    meio = editor de código / terminal. Chão #080a0f sólido + grade 1px: linhas a cada 60 px
         rgba(125,133,144,.14), linhas mestras a cada 300 px a .24; grade desliza 60 px em 48.28 s (loop sem salto).
         Tinta #e6edf3. Cinza #7d8590 = comentários e rótulos de código. Ciano #38bdf8 = tipos e tempo.
         Verde-menta #00ff9d = estado OK / palavra ativa da legenda. Vermelho #ff3366 = erro, dinheiro, colapso.
         Fonte única: JetBrains Mono 400/700/800. Títulos 112–140 px, tracking -2%. Código 32–40 px. Rótulos 30 px.
         Nada de brilho/neon/glow: cor plena, sem sombra.
LAYOUT:  texto só em x 96–948 (trilho de ações do Shorts à direita) e y 200–1130; legendas ancoradas em y 1310
         (base), 52 px, máx. 820 px; abaixo de 1330 só a grade.
OBJECTS: contador de dólares (código `prejuizo =`), cronômetro T+ (ciano), telemetria ALT x T+ (curva real
         ALT = 3.5 km·(t/36)²), 4 satélites Cluster, caixas float64/int16 com faixas de bits (64 e 16 células),
         tag ERROR, monitor SRI com PRIMARY/BACKUP_CPU, foguete Ariane 5 (núcleo + 2 boosters) num mostrador de ângulo.
MOTION:  entrada expo.out 0.35–0.5 s; saída power3.in 0.25 s; acertos (hit) = tl.set de 0 ms; tremores determinísticos.
         Título em pé fica parado. Palavras 0.067 s de stagger; letras 0.05 s.
SHOTS:
  S1 0.00–8.10  título "UMA LINHA DE CÓDIGO" já no frame 0 (thumbnail) · sublinha LINHA 1.62 · contador $0→$370,000,000
                2.42–4.84 (hit + impacto) · T+00:00→00:37 5.88–7.32, trava vermelho (ping) · saída blur 7.85.
  S2 8.10–17.80 "ARIANE 5 — 1996" letra a letra 8.56 · ESA 10.78 / voo V501 12.18 digitados · telemetria 12.80–15.10
                · 4× CLUSTER conectando 15.02 (pop) · whip para cima 17.45.
  S3 17.80–30.00 T+00:36 18.08 · linha `bh := int16(horizontal_bias);` 20.24 · float64 32768.5 22.22, bits 22.72
                · seta int16() 24.66 · caixa int16 24.90, bits 25.64 · valor voa 25.90 e estoura 26.60
                · [OVERFLOW] + ERROR: INTEGER OVERFLOW piscando 27.36 · glitch-cut 29.80.
  S4 30.00–40.70 monitor SRI · PRIMARY_CPU CRASHED 30.44 · failover 31.00 · BACKUP_CPU CRASHED 32.62
                · "mesmo software, mesmo erro" 34.50 · foguete 35.94 · gira 0°→90° 36.50 · MÁX 37.38
                · flash + fragmentos 39.00 · SINAL PERDIDO 39.60.
  S5 40.70–48.28 código Align_SRI (herdado do Ariane 4) 40.86 · riscado 43.72 · "LINHA DE CÓDIGO INÚTIL" 43.40
                · "rodava 40 s após a decolagem" 44.58 · fade-out 46.10 · barra de loop zera 46.50 e reenche
                · título de S1 remontado 46.66 → último frame = frame 0.
SOUND:   sem música (sem fonte de música disponível). SFX da biblioteca embutida, pico 1 frame após a imagem;
         silêncio depois da explosão até o loop.
BANNED:  glow/neon, partículas decorativas, tudo centralizado, tudo entrando com fade+slide-up, título que flutua
         depois de pousar, cantoneiras/HUD decorativo, gradiente linear em tela cheia.
QA:      0.0 (thumb = título), 4.9 (contador pousado), 7.4 (T+00:37 vermelho), 15.4 (satélites), 27.6 (ERROR),
         33.0 (dois CRASHED), 37.0 (foguete 90°), 39.1 (flash), 45.0 (INÚTIL), 48.25 (= frame 0).
