# SPEC — <título do episódio>

GOAL:    Explicar visualmente em diorama 3D como <tema> funciona por dentro através de gargalos e soluções ("Só que... Então..."), mantendo mudança visual constante a cada 2.5–4s.
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps (YouTube Shorts / Reels / TikTok)
TIME:    <duração> s x 30 = <frames> frames. Relógio = locução (assets/voice.mp3, timestamps de assets/voice.json).

LOOK:    Identidade do nicho ia-lab (../../NICHE.md): oficina de grafite & âmbar quente (THEME = "amber"), bancada cinza-chumbo, droides cápsula com visor LED (assets/kit3d.js), monitores 3D, setas de fluxo 3D e HUD 2D de placa metálica industrial + placar digital.
LAYOUT:  HUD placa metálica em y 196–314; placar metálico em y 344–446 à direita; ação 3D central em y 460–1380; legendas dark-pill em bottom 380px.
OBJECTS: Stage (createDioramaStage), Agentes (createBlockAgent), Telas (createCodeScreen), Setas (createFlowArrow), Placas (createFloatingLabel).
MOTION:  Câmera 3D declarativa via array SHOTS (um shot por cena + handheld + shake nos gargalos); entradas 3D com E.backOut; trocas de faixa e placar com back.out.
SHOTS:
  Cena 1 (0.00–<t1>)  Faixa: "<TÍTULO_TELA>" · Placar: <MÉTRICA>: <VALOR> · Câmera: close no agente inicial e tela de código.
  Cena 2 (<t1>–<t2>)  "Só que..." (Gargalo 1) → Seta vermelha + erro na tela + placar sobe → "Então..." entra agente/módulo 2.
  ...
  Cena N (<tN-1>–<DUR>) Veredito APROVADO + placar zerado (e #hud-cta-modal apenas se o roteiro tiver --cta explícito).
SOUND:   SFX de assets/sfx no index.html (whoosh-short nas trocas de cena, error + impact-bass nos gargalos, pop na entrada de agentes, ping na aprovação).
BANNED:  Math.random() sem seed, geometria 3D solta sem usar kit3d.js, placar estático, editar captions.html à mão.
QA:      0.0 (thumb com faixa + agente), meio de cada cena (gargalos e soluções), fim (veredito 3D visível e sem sobreposição).
