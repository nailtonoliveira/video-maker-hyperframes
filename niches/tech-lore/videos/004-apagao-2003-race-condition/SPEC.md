# SPEC — Apagão de 2003: A Condição de Corrida de Milissegundos

GOAL:    o espectador sente o absurdo de um servidor "saudável" e mudo enquanto 50 milhões ficam sem luz; o último
         plano volta ao quadro 0 e a locução emenda ("...foi exatamente assim que / um conflito de milissegundos...").
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps (YouTube Shorts)
TIME:    44,73 s x 30 = 1342 frames. Relógio = locução (assets/voice.mp3, timestamps de assets/voice.json).
         Mesma duração em index.html, `const DUR` do world.html e `const LOOP` do scene.js.

LOOK:    identidade do nicho (../../NICHE.md → Visual): maquete 3D (motor em assets/motor/, peças em assets/kit/).
         Diferenças deste episódio: subestação, linha de 345 kV (pórtico + 6 torres), árvores, sala de controle e
         cidade montadas com `solid` do motor (o kit não tem rede elétrica); céu próprio (tarde nublada → apagão).
LAYOUT:  títulos 2D (world.html) só em x 96–948 e y 200–560; legendas com base em y 1310.
WORLDS:
  - Exterior: `makeDataCenter({ racks: 8 })` da FirstEnergy sobre pátio de concreto + sala de controle envidraçada
    (console com 3 monitores, lâmpada de alarme que nunca acende) + subestação (2 transformadores, barramentos até a
    entrada de energia) + linha de 345 kV de Ohio indo até a cidade no horizonte (25 quadras com janelas acesas).
  - Porta do mergulho: a gaveta do servidor SCADA no rack da ponta da fileira −z. A tampa frontal
    "GE XA/21 · SCADA" destrava (8,34 s) e o chassi desliza 0,6 m pelos trilhos (9,04–9,94 s); a câmera entra no
    chassi aberto até o mini-chip "GE XA/21" e corta, com mergulho no escuro, para a placa (11,84 s).
  - Placa: chip `GE XA/21 · EMS · alarmes` → barramento `ALARM EVENTS` (pulsos menta) → registrador
    `alarm_queue[8]` → linha de código `alarm_queue.push(event);` / `// race condition · sem mutex` → bits
    `MUTEX_LOCK = 0x00` (8 bits zerados, `intBits(0, 8)`).
  - Peça da falha: o trecho `push(event)` da linha de código. O bug anda de 19,46 a 22,50 s e para ali; as tarefas A e
    B caem no mesmo slot da fila (18,16 s), a fila racha em vermelho com `QUEUE_CORRUPT` (23,82 s), o chip entra em
    loop com um anel vermelho girando (26,24 s) e morre.
  - Consequência: o cabo do vão 1 cede até a árvore e abre arco (29,12 s); console mudo; pulso vermelho corre a linha,
    torres ficam vermelhas e apagam o farol (32,36–33,90 s); a cidade apaga em onda (34,2–35,4 s); os racks apagam em
    dominó (36,05–36,95 s). Tudo volta antes do fim (42,54–43,4 s) para o loop.
  - Céu: `ext` = tarde de agosto nublada e quente (topo 0x2a3443, meio 0x8c8679); `apagao` = quase noite
    (topo 0x0b0f15, meio 0x3b3833), sol 0,8 e hemisférica 0,45; placa = `BOARD_SKY`.

## O que muda em relação ao episódio anterior
O 003 (Knight Capital) é 2D, então a comparação é com o exemplo do template (Ariane 5).

| Item | Exemplo do template (Ariane 5) | Este episódio |
| --- | --- | --- |
| Lugar | base de lançamento ELA-3 + Ariane 5 | data center da FirstEnergy + sala de controle + subestação + linha de 345 kV em Ohio |
| Porta do mergulho | escotilha do compartimento + gaveta do SRI | tampa frontal + chassi deslizante do servidor SCADA no rack |
| Peça da falha | `int16(horizontal_bias)` | `push(event)` sem mutex (`MUTEX_LOCK = 0x00`) na `alarm_queue` |
| Consequência | chip SRI morto, placa vermelha | fila corrompida + chip em loop; linha encosta na árvore, torres, cidade e racks apagam em cascata |
| Céu | dia dessaturado (`SKIES.day`) | tarde nublada quente → céu de apagão |

Os 5 itens mudam.

CAMERA:  planos de 1,7–3 s, câmera sempre em movimento, fov 50; texto no chão só em plano de cima (planos 7, 9, 11);
         ap alto nos planos próximos (7–10), baixo nos abertos (0,8–2).
SHOTS:   (planos do assets/episode/scene.js; títulos do world.html nos mesmos tempos)
  1  0.00–2.04   ext · aberto, 3/4 alto pela frente (+x +z) sobre o data center e a subestação · quadro 0 = "50 MILHÕES / SEM LUZ" + "// RACE CONDITION DETECTED"
  2  2.04–3.84   ext · próximo, pela ponta do corredor (−x), aproxima das frentes dos racks com LEDs menta
  3  3.84–5.64   ext · rasante atrás da subestação, barramentos convergindo para o data center, DOF rasa
  4  5.64–8.04   ext · médio na lateral do rack SCADA: "FIRSTENERGY · SCADA / 2003-08-14 14:14:00 EDT" · título "14/08/2003"
  5  8.04–10.14  ext · próximo pela ponta do corredor: a tampa destrava e o chassi desliza
  6  10.14–11.84 ext · mergulho (p2in) para dentro do chassi até o mini-chip "GE XA/21"
  7  11.84–14.66 placa · de cima, desce até o chip GE XA/21 · título "GE XA/21" (11,18) + "// alarmes em C/C++"
  8  14.66–17.26 placa · lateral baixa ao longo do barramento, pulsos menta; a fila sobe em 15,92 · "14:14"
  9  17.26–19.26 placa · de cima: tarefas A e B colidem no mesmo slot (18,16) · "// 2 tarefas · 1 buffer"
  10 19.26–21.26 placa · próximo, seguindo o bug pela linha de código
  11 21.26–24.20 placa · plongée: o bug para em push(event) (22,50) · "SEM MUTEX"; a fila racha (23,82), QUEUE_CORRUPT, tremor
  12 24.20–27.12 placa · outro lado, ~40°: fila vermelha, chip com anel em loop e morto (26,24) · "LOOP"
  13 27.12–29.54 ext · lateral ao vão 1: o cabo cede e encosta na árvore, arco (29,12) · "345 kV"
  14 29.54–32.30 ext · rasante no console: relógio 14:14, nenhuma luz de alarme · "0 ALARMES" (30,50)
  15 32.30–34.04 apagão · aberto, ao lado da linha: pulso vermelho corre até a cidade, torres ficam vermelhas
  16 34.04–35.90 apagão · aberto sobre a cidade: janelas apagam em onda · "100+ USINAS" + "// 261 unidades geradoras"
  17 35.90–38.76 apagão · grua sobre o data center apagando em dominó · "-US$ 6 / BILHÕES" + CA
  18 38.76–40.52 apagão · pela vidraça: 3 monitores estáticos
  19 40.52–42.54 apagão · próximo do relógio: 14:14 → 15:45 em 0,86 s (41,58) · "+1 HORA"
  20 42.54–44.74 ext · recua e completa a órbita até P0/L0; tudo reacende; o gancho remonta (42,60 / 42,94)
SOUND:   trilha procedural (assets/episode/trilha.json): vento no exterior (baixo na sala de controle), zumbido na placa
         com alarme tremendo 23,82–27,12, ronco no arco e na cascata; ré menor, pulso 18,16–35,90, subida 32,30–34,04;
         efeitos trava (8,36 · 22,50), deslize (9,06), baque (11,84), estalo (18,16 · 23,82), faísca (29,12…),
         clique (15,92 · 30,50), tiques do relógio (41,58–42,38). SFX: whoosh 11,84 · glitch-2 26,24 ·
         whoosh-short 27,12 · impact-bass-1 34,04 · impact-bass-2 35,90 (pico 1 quadro após a imagem).
BANNED:  glow/neon, partículas decorativas, granulação, tudo centralizado, título que flutua depois de pousar,
         câmera parada, Math.random/Date.now (tudo é função de t).
QA:      0.0 (thumb = título), 6.8, 9.6, 11.2, 13.3, 18.6, 22.7 (bug parado), 24.0 (fila corrompida), 26.7 (loop),
         29.3 (arco), 31.0, 33.2, 35.3, 36.6, 39.6, 42.1, 44.68 (= quadro 0).
