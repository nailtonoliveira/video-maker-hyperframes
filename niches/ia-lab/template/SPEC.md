# SPEC — <título do episódio>

GOAL:    Explicar visualmente em diorama 3D como <tema> funciona por dentro através de gargalos e soluções ("Só que... Então..."), mantendo mudança visual constante a cada 2.5–4s.
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps (YouTube Shorts / Reels / TikTok)
TIME:    <duração> s x 30 = <frames> frames. Relógio = locução (assets/voice.mp3, timestamps de assets/voice.json).

LOOK:    Identidade do nicho ia-lab (../../NICHE.md): bancada de madeira 3D, agentes em blocos (assets/kit3d.js), telas de código 3D, setas de fluxo 3D e HUD 2D de fita crepe + placar dinâmico.
LAYOUT:  HUD faixa de fita crepe em y 196–314; placar em y 344–446 à direita; ação 3D central em y 460–1380; legendas label-tag em bottom 380px.
OBJECTS: Stage (createDioramaStage), Agentes (createBlockAgent), Telas (createCodeScreen), Setas (createFlowArrow), Placas (createFloatingLabel).
MOTION:  Câmera 3D declarativa via array SHOTS (um shot por cena + handheld + shake nos gargalos); entradas 3D com E.backOut; trocas de faixa e placar com back.out.
SHOTS:
  Cena 1 (0.00–<t1>)  Faixa: "<TÍTULO_TELA>" · Placar: <MÉTRICA>: <VALOR> · Câmera: close no agente inicial e tela de código.
  Cena 2 (<t1>–<t2>)  "Só que..." (Gargalo 1) → Seta vermelha + erro na tela + placar sobe → "Então..." entra agente/módulo 2.
  ...
  Cena N (<tN-1>–<DUR>) Veredito APROVADO + Card CTA (#hud-cta-modal) nos últimos 3s.
SOUND:   SFX de assets/sfx no index.html (whoosh-short nas trocas de cena, error + impact-bass nos gargalos, pop na entrada de agentes, ping na aprovação).
BANNED:  Math.random() sem seed, geometria 3D solta sem usar kit3d.js, placar estático, editar captions.html à mão.
QA:      0.0 (thumb com faixa + agente), meio de cada cena (gargalos e soluções), fim (card CTA visível e sem sobreposição).
