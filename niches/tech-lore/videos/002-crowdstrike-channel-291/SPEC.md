# SPEC — <título do episódio>

GOAL:    <o que o espectador deve sentir; e que no loop assista de novo>
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps (YouTube Shorts)
TIME:    <duração> s x 30 = <frames> frames. Relógio = locução (assets/voice.mp3, timestamps de assets/voice.json).

LOOK:    identidade do nicho (../../NICHE.md → Visual). Diferenças deste episódio: <nenhuma | quais>
LAYOUT:  texto só em x 96–948 e y 200–1130; legendas com base em y 1310; abaixo de 1330 só a grade.
OBJECTS: <objetos desenhados: contadores, gráficos, caixas de código, diagramas...>
MOTION:  entrada expo.out 0.35–0.5 s; saída power3.in 0.25 s; acertos = tl.set de 0 ms; tremores determinísticos.
SHOTS:
  S1 0.00–<t>  título no frame 0 (thumbnail) · <eventos presos às palavras, com tempos>
  S2 ...
  S3 ...
  S4 ...
  S5 ...  → último frame = frame 0.
SOUND:   SFX de assets/sfx, pico 1 frame após a imagem; <música?>
BANNED:  glow/neon, partículas decorativas, tudo centralizado, tudo entrando com fade+slide-up, título que flutua
         depois de pousar, cantoneiras/HUD decorativo, gradiente linear em tela cheia.
QA:      0.0 (thumb = título), <momentos-chave>, <fim> (= frame 0).
