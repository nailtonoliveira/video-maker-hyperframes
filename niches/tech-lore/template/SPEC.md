# SPEC — <título do episódio>

GOAL:    <o que o espectador deve sentir; e que no loop assista de novo>
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps (YouTube Shorts)
TIME:    <duração> s x 30 = <frames> frames. Relógio = locução (assets/voice.mp3, timestamps de assets/voice.json).
         Mesma duração em index.html (set_duration.py), `const DUR` do world.html e `const LOOP` do scene.js.

LOOK:    identidade do nicho (../../NICHE.md → Visual): maquete 3D (motor em assets/motor/, guia PROMPT.md; peças em
         assets/kit/, guia KIT.md). Diferenças deste episódio: <nenhuma | quais>
LAYOUT:  títulos 2D (world.html) só em x 96–948 e y 200–1130; legendas com base em y 1310.
WORLDS:  <exterior: lugar/veículo real do kit> · mergulho · placa (a linha de código, chips, o bug no ponto da falha)
DIFF:    o que muda em relação ao episódio anterior (<NNN anterior | exemplo do template>): lugar · porta do mergulho ·
         peça da falha · consequência · céu
CAMERA:  planos de 1,7–3 s, câmera sempre em movimento, fov ~50, assunto em 50–60 % da largura (assunto alto/vertical:
         pela altura, ~55 %); texto no chão só em plano de cima; ap alto nos planos próximos, baixo nos abertos.
SHOTS:   (planos do assets/episode/scene.js; títulos do world.html nos mesmos tempos)
  1 0.00–<t>  exterior · quadro 0 = título do gancho (thumbnail)
  2 ...       mergulho para dentro da máquina
  3 ...       placa: a linha de código e o bug no ponto da falha
  4 ...       alarme: o que quebrou, em vermelho
  5 ...–<fim> volta ao quadro 0 → último quadro = quadro 0.
SOUND:   trilha procedural (assets/episode/trilha.json → shared/trilha/trilha.py → assets/audio/*.wav: ambiente,
         música, efeitos) + SFX de assets/sfx com pico 1 quadro após a imagem.
BANNED:  glow/neon, partículas decorativas, granulação, tudo centralizado, título que flutua depois de pousar,
         câmera parada, Math.random/Date.now (tudo é função de t).
QA:      0.0 (thumb = título), <momentos-chave>, <fim − 0,1> (= quadro 0).
