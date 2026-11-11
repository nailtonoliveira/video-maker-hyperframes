# SPEC — O Golpe dos 3 Segundos: Como a IA Rouba a Voz de Quem Você Ama

GOAL:    Mostrar em diorama 3D, sem jargão, como 3 s de áudio de um story viram uma voz clonada, como o golpista
         usa essa voz num falso sequestro no WhatsApp, e como a palavra secreta da família zera o golpe.
OUTPUT:  HyperFrames, 1080 × 1920, 30 fps (YouTube Shorts / Reels / TikTok)
TIME:    39.66 s × 30 = 1190 frames. Relógio = locução (assets/voice.mp3; âncoras de assets/voice.json).

LOOK:    Identidade ia-lab (../../NICHE.md): THEME = "amber" (oficina grafite & âmbar), droides cápsula do kit3d.js,
         monitor industrial 3D ao fundo, setas 3D, HUD de placa metálica + placar LED. Sem CTA (#hud-cta-modal fica em opacity 0:
         a última frase é o loop "E você nunca esquece que…", não um pedido de comentário).
LAYOUT:  Placa superior y 196–314 · placar y 344–446 (direita) · palco 3D y 460–1380 · legendas dark-pill bottom 380 px.
         Largura útil do palco em retrato: ±1.6–1.9 unidades a 8–10 u da câmera → droides em x = ±1.3, objeto-herói em x ≈ 0.

## Elenco e objetos (todos do assets/kit3d.js)

| Objeto | Construtor | Posição | Vida |
| --- | --- | --- | --- |
| Palco | `createDioramaStage(THEME)` | — | 0 → fim; `updateStage(t, 0.85)` (luz vermelha) de 13.42 a 27.10 |
| VOCÊ (user, ciano `#38bdf8`) + celular | `createBlockAgent({role:"user"})` + `solid` | (0,0,1.2) → (-1.3,0,1.0) em 6.76 | sai 13.42; volta 37.14 em (1.45,0,1.05) comemorando |
| IA DE VOZ (coder, amarelo `#eab308`) | `createBlockAgent({role:"coder"})` | (1.3,0,1.0) | entra 6.76 (backOut 0.45 s), sai 13.42 |
| Fatiador + onda 3D (12 barras) | `solid` + `createMaterials` + `createFloatingLabel` | (0,0.25,1.4) | 6.76 → 13.42; corte 9.32; rótulos TOM / RESPIRO / RITMO |
| Seta âmbar (para o sintetizador) | `createFlowArrow(amber)` vertical | (0,1.4,1.4) | 11.74 → 13.42 |
| GOLPISTA (hacker, vermelho `#ef4444`) | `createBlockAgent({role:"hacker"})` | (1.3,0,1.0) | entra 14.20 com `>_<`; ejetado 34.90 |
| FAMÍLIA (boss, laranja `#f97316`) | `createBlockAgent({role:"boss"})` | (-1.3,0,1.0) | entra 17.68 |
| Seta vermelha golpista → família | `createFlowArrow(red)` | (0.55→-0.55, 1.15, 1.35) | 19.60 → 27.10 (cadeado corta a seta) |
| Cadeado metálico (escudo) | `solid` + `createMaterials` | (0.05,0,1.0) | cai 27.10, aterrissa com squash backOut, LED verde 29.40 |
| Placa dourada "SENHA: ****" | `createFloatingLabel` | junto à mão da FAMÍLIA | 29.40 → fim |
| Monitor (6 telas, uma por cena) | `createCodeScreen` | (0,2.45,-2.1), 3.6 × 2.4 | troca com "liga" (scale.y backOut 0.22 s) |

## Telas do monitor (código ilustrativo em português)

1. `audio_story.wav` — `▁▃▆█▅▂▇█▄▁▃▆  00:03` / `origem = 'instagram'` / `duracao = 3  # segundos` / `quem_ve = 'TODO MUNDO'` → 4.04 ok, linha 0 verde, selo POSTADO.
2. `clonador_voz.py` — `amostra = fatiar(audio, 3)` / `tom, respiro, ritmo = amostra` / `clone.aprender(amostra)` / `clone.falar('qualquer frase')` → 9.32 destaca linha 0; 11.74 ok, linha 3, selo CLONE 100%.
3. `whatsapp_familia` — `de: 'FILHO' (voz clonada)` / `> mae, me sequestraram!` / `> manda PIX urgente!!` / `chave_pix = golpista` → erro; 14.20 selo GOLPE; 19.60 linha 2, selo PIX URGENTE.
4. `banco_familia` — `> SOCORRO! me ajuda!` / `conferir_numero()  # PULOU` / `PIX: R$ 3.000 ENVIADO` / `saldo = R$ 0` → erro SOCORRO!; 24.96 pisca vermelho a 2.5 Hz com selo PIX ENVIADO.
5. `protecao_familia.py` — `senha = combinar_hoje()` / `so_a_familia_sabe(senha)` / `se ligacao.pede_pix:` / `    perguntar(senha)` → 29.40 ok, selo SENHA ATIVA.
6. `verificador.py` — `se nao_sabe(senha):` / `    desligar()  # na hora` / `golpe = ANULADO` / `AMEAÇA: ZERO` → 34.90 selo DESLIGOU; 37.14 linha 3, selo AMEAÇA: ZERO.

## Cenas, âncoras (início da palavra no voice.json) e câmera (SHOTS)

| Cena | Intervalo | Faixa | Placar | Âncoras | Câmera (p0→p1 / l0→l1) |
| --- | --- | --- | --- | --- | --- |
| 1 Gancho | 0.00–6.76 | O GOLPE DOS 3 SEGUNDOS (frame 0, sem pop) | AMOSTRA 3s âmbar | 4.04 "posta": VOCÊ ergue o celular (`point`), tela verde POSTADO | push-in: [0,4.8,10.2]→[0.2,4.3,8.8] / [0,1.75,-0.4]→[0,1.7,-0.2], p2io |
| 2 Fatiador | 6.76–13.42 | 9.32 FATIANDO SUA VOZ | 9.32 CLONE 33% · 10.40 66% · 11.74 100% ciano | 6.76 "A" IA DE VOZ + fatiador entram; 9.32 "fatia" lâminas descem e onda vira 3 blocos; 11.74 "aprende" coder `type` + seta âmbar | trilho lateral: [-0.6,4.9,9.8]→[0.4,4.5,9.2] / [0,1.65,0]→[0.1,1.6,0.1], p2io |
| 3 Impostor | 13.42–21.18 | 14.20 O IMPOSTOR NO WHATSAPP | 14.20 PERIGO 40% · 16.98 60% âmbar · 19.60 90% vermelho | 13.42 "Só que" shake 0.14/0.35 + alarme; 14.20 "entra" golpista `>_<`; 17.68 "família" FAMÍLIA entra; 19.60 "pedindo" seta vermelha pulsa (+shake 0.10) | revelação larga: [1.0,5.4,10.8]→[0,4.8,10.0] / [0.1,1.75,-0.3]→[0,1.7,-0.2], p2out |
| 4 Desespero | 21.18–26.56 | 21.84 PÂNICO E PIX FALSO | 24.96 ERROS 1 vermelho | 21.84 "ouvir" FAMÍLIA `panic`; 24.96 "transfere" tela pisca PIX ENVIADO (+shake 0.12) | aproximação na família: [-0.2,4.4,9.4]→[-0.5,3.9,8.2] / [-0.3,1.75,-0.2]→[-0.4,1.75,0], p2io |
| 5 Senha | 26.56–33.04 | 27.10 A PALAVRA SECRETA | 29.40 SENHA ATIVA verde | 27.10 "a proteção" cadeado cai (squash backOut), seta vermelha some, golpista `panic`; 29.40 "uma palavra" FAMÍLIA `point` + placa dourada | grua descendo: [0,5.8,10.6]→[0.1,4.8,9.9] / [0,1.5,0]→[0.1,1.65,0], p2out |
| 6 Veredito | 33.04–39.66 | 33.04 SEM A SENHA? DESLIGA · 37.14 GOLPE ANULADO | 37.14 ERROS 0 verde | 34.90 "desliga" FAMÍLIA `stamp` + golpista ejetado (shake 0.10); 37.14 "o (golpe zera)" VOCÊ volta, todos `celebrate` `^_^`, tela AMEAÇA: ZERO | afastamento p/ loop: [0.15,4.6,9.7]→[0.05,4.8,10.4] / [0.1,1.7,0]→[0.05,1.75,-0.4] (≈ abertura), p2io |

MOTION:  Entradas 3D com `E.backOut(seg(t, t0, t0 + 0.45))`; saídas com `1 − E.p2in` em 0.35 s; troca de faixa `back.out(2.2)` 0.22 s;
         placar `back.out(2.4)` 0.26 s; câmera sempre em movimento (p0→p1) + handheld do kit; shakes nos gargalos.
SOUND:   SFX no index.html, início = evento + 1 frame − pico do arquivo (picos medidos: whoosh 0.162, pop 0.119, error 0.739,
         impact-bass-1 0.073, click 0.072, ping 0.323, key-press 0.077):
         4.04 click · 6.76 whoosh + pop · 9.32 whoosh + click · 11.74 key-press · 13.42 error + impact · 14.20 whoosh + pop ·
         17.68 pop · 19.60 error + impact · 21.84 whoosh · 24.96 error + impact · 27.10 whoosh · 27.40 impact (pouso) ·
         29.40 ping · 33.04 whoosh · 34.90 impact + whoosh · 37.14 ping.
BANNED:  Math.random(), rAF próprio, geometria fora do kit3d.js (o celular, o fatiador e o cadeado usam `solid`/`createMaterials` do kit),
         placar estático, editar captions.html, CTA inventado.
QA:      snapshots em 0.0 (thumb), 3.0, 5.0, 8.5, 10.5, 12.5, 15.5, 20.0, 23.0, 25.5, 28.5, 31.0, 34.0, 36.0, 38.5, 39.5.
