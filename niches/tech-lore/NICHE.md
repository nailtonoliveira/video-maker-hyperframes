# Nicho: Tech Lore — Desastres da Tecnologia

Shorts sobre falhas de software e engenharia que custaram caro (dinheiro, missões, vidas). Narração sem rosto,
tudo em motion graphics de terminal. Fonte da verdade da identidade do nicho: o que está aqui vale para todo
vídeo da série; o `template/` é a implementação disso e é copiado para cada vídeo novo. Este arquivo
também vai inteiro dentro dos prompts do pipeline (`prompts/`), então o que estiver aqui guia temas, roteiro,
metadados e cenas. Voz, modelos de IA e aprovações ficam em `niche.json`.

## Formato
- YouTube Shorts 1080 × 1920, 30 fps, 40–60 s (a duração final é a da locução).
- 5 cenas: gancho com o número absurdo → contexto (quem, quando) → a falha técnica explicada em código →
  o colapso → o detalhe mais absurdo, que **emenda na primeira frase** (loop).
- Último frame = frame 0: o título da cena 1 remonta no mesmo lugar e a grade anda exatamente 60 px no vídeo.
- Legenda queimada (grupos de até 3 palavras, palavra falada em verde-menta).
- Todo evento visual preso ao início da palavra correspondente na transcrição (`assets/voice.json`).

## Roteiro
- Frase 1 = gancho com número concreto (dinheiro, tempo, pessoas). Nada de "você sabia".
- Fatos verificáveis: nome do sistema, data, número de série/voo, a linha ou o tipo de erro real.
- Última frase termina em suspensão ("Foi exatamente assim que...") e completa a frase 1.

## Visual
- Meio = editor de código / terminal. Chão `#080a0f` sólido + grade 1 px (60 px, mestras a cada 300 px).
- Tinta `#e6edf3`. Cinza `#7d8590` = comentários e rótulos de código. Ciano `#38bdf8` = tipos e tempo.
  Verde-menta `#00ff9d` = estado OK / palavra ativa. Vermelho `#ff3366` = erro, dinheiro, colapso.
- Fonte única: JetBrains Mono 400/700/800. Títulos 112–140 px, tracking −2 %. Código 32–40 px. Rótulos 30 px.
- Texto só em x 96–948 e y 200–1130; legendas com base em y 1310; abaixo de 1330 só a grade (UI do Shorts).
- Movimento: entrada expo.out 0.35–0.5 s; saída power3.in 0.25 s; acertos = `tl.set` de 0 ms;
  tremores determinísticos; palavras com 0.067 s de stagger, letras 0.05 s. Título pousado fica parado.
- Proibido: glow/neon, partículas decorativas, tudo centralizado, tudo entrando com fade+slide-up,
  cantoneiras/HUD decorativo, gradiente linear em tela cheia.

## Som
- Locução: voz única da série (mesma voz e velocidade em todos os episódios).
- SFX de `assets/sfx/` (copiados de `shared/sfx/`), pico 1 frame após a imagem; silêncio depois do clímax.
- Música: ainda não há fonte. Quando houver, `<audio id="music" ... data-volume="0.14">` no index.html.

## Episódios
| Nº | Pasta | Tema | Estado |
| --- | --- | --- | --- |
| 001 | `videos/001-ariane5` | Ariane 5 — overflow de 64→16 bits (1996) | renderizado |

## Lições do 001
- O Whisper `base` erra palavras curtas ("Ao 36" → "Aos 36"): corrigir em `captions.json` → `fixes`.
- Revisar os SFX ouvindo; no 001 eles foram só medidos.
- O flash branco a 80 % pode ser forte no celular; 60 % é mais seguro.
