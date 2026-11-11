# SPEC — Lojas Americanas: O Rombo do Risco Sacado

GOAL:    tensão de descoberta (a dívida dos bancos some dentro das caixas de "fornecedores" e reaparece sob a luz UV) e
         a satisfação do carimbo ACUSADO derrubando a torre; o loop por rebobinagem devolve o espectador ao gancho.
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps (Shorts / Reels / TikTok)
TIME:    55.55 s x 30 = 1667 frames. Relógio = locução (assets/voice.mp3, timestamps de assets/voice.json).
         Mesma duração em index.html (set_duration.py), `const DUR` do world.html e do hud.html, e `const LOOP` do scene.js.

LOOK:    identidade do nicho (../../NICHE.md → Visual): A Mesa da Perícia 3D (motor em assets/motor/, guia PROMPT.md;
         peças em assets/kit/, guia KIT.md).
LAYOUT:  texto crítico só em x 64–920 e y 220–1500 (`compositions/hud.html`: `#hud-ficha`, `#hud-valor`, `#hud-data`,
         `#hud-carimbo`); assunto 3D em y 600–1290; legendas `label-tag` com base em y 1450 (`bottom: 470`).
WORLDS:  `imperio` (torre na mesa) · `livro` (livro-caixa do passivo em (0, -200, 0)) · `bonus` (folha de bônus, 2º livro
         em (0, -300, 0), céu `livro`) · `sala` (mesa + quadro + Perita/Fiscal) · `pregao` (em (0, -400, 0), com Manada própria)
CASE:    nome `AMERICANAS` (placa da torre, ficha `CASO Nº 001 · AMERICANAS`) · forma `torre` (9 andares, ocos 3–6) ·
         truque `caixas` (3 caixas `FORNECEDOR 1 / FORNECEDOR 2 / FORNECEDORES` engolem o documento `RISCO SACADO` e as
         moedas dos bancos) · carimbo `ACUSADO` (P8: há acusação da CVM/PF, não condenação) · consequência: ações viram pó
         no pregão, Manada em `ruina`, diretoria acusada (Operação Disclosure, JUN/2024) e bônus pagos sobre números falsos.
DIFF:    em relação ao episódio-modelo do template (Monarca S.A., 52 s):
         1. nome do caso: MONARCA S.A. → AMERICANAS (placa, ficha, pasta, tags);
         2. truque físico: caixas SPE/OFFSHORE/HOLDING com `DÍVIDA 30 BI` → caixas de FORNECEDORES engolindo o
            `RISCO SACADO` + pilha de moedas dos bancos (dívida bancária virando conta de fornecedor);
         3. carimbo: FRAUDE → ACUSADO (Fiscal com gaveta `2023`, decalque e `#hud-carimbo`);
         4. consequência: pregão com a Manada tombando no próprio chão do pregão + Magnata com auréola partida cercado
            por etiquetas `CVM: ACUSADO` / `PF: DISCLOSURE`;
         5. detalhe absurdo: pasta `METAS BATIDAS` + folha de bônus carimbada `PAGO` / `BATIDA` (mundo `bonus` novo).
         Forma do império continua `torre` (é a maior varejista: um império vertical clássico).
CAMERA:  planos de 1,7–3,0 s, câmera sempre em movimento, fov 50, assunto em 50–60 % da largura (assunto alto: ~55 % da altura);
         texto no chão (`floorLabel`) só em plano de cima (`MACRO_LIVRO`); `ap` alto nos closes (6–9), baixo nos abertos (0,8–1,5).
SHOTS:   (planos do assets/episode/scene.js; eventos do hud.html nos mesmos tempos; palavra-âncora do voice.json)
  Cena 1 — O Gancho (imperio)
   1  0.00– 2.16  ABERTO_IMPERIO · quadro 0 = ficha "ROMBO DE R$ 25 BI" + medidor R$ 25 BI ▼ + JAN/2023 + rachadura pulsando + Magnata celebrate
   2  2.16– 4.04  PLONGEE_MESA na rachadura da base ("apenas 10 dias"; selo 10 DIAS, medidor oscila)
   3  4.04– 6.42  CLOSE no Magnata comemorando no topo ("maior varejista")
  Cena 2 — A Ascensão (imperio)
   4  6.42– 8.14  CONTRA_PLONGEE: toco da torre renascendo ("Durante anos"; ficha ATO I, selo 2019-2022)
   5  8.14– 9.84  lateral subindo com os andares 4-5-6 (backOut em 8.20 / 8.64 / 9.09 = "exibia lucros recordes"; hodômetro dispara)
   6  9.84–11.58  aberto alto: setas de ouro entrando, torre completa
   7 11.58–14.58  RASANTE_MANADA: onda de peões em euforia ("atraindo a manada")
  Cena 3 — A Manobra (livro)
   8 14.58–17.58  Contador rabiscando ao lado do livro ("Por trás dos panos"; medidor DÍVIDA COM BANCOS 0 → 20)
   9 17.58–20.04  MACRO_LIVRO de cima: 3 caixas de FORNECEDORES abrem sobre os lançamentos ("em risco sacado"; linha RISCO SACADO marcada)
  10 20.04–23.04  lateral: o documento RISCO SACADO + moedas deslizam para a caixa, tampas travam e as caixas se aninham ("caixas de fornecedores"; DÍVIDA NO BALANÇO 20 → 0)
  Cena 4 — As Rachaduras (sala)
  11 23.04–24.94  aberto da sala ("Com 10 dias de cargo"; ficha ATO III, selo 10 DIAS)
  12 24.94–27.70  PERFIL_PERITA: entra e acende a lanterna UV ("novo comando acendeu"); andares ocos em violeta
  13 27.70–29.40  quadro de cortiça: fio vermelho CARTA BANCO → RISCO SACADO → VPC FORJADO ("revelou contratos forjados"; INCONSISTÊNCIA 0 → 20)
  14 29.40–31.24  close na fachada: rachadura sobe, alarme acende, Magnata em pânico
  Cena 5 — O Colapso (imperio)
  15 31.24–33.74  contra-plongée no Fiscal avançando ("Em janeiro de 2023"; selo JAN/2023, ficha ATO IV)
  16 33.74–35.72  Fiscal ergue o braço ("fiscal", 33.74) e desce o carimbo em 34.64 ("carimbo"): slam 3D + ACUSADO 2D + tremor + 0,6 s de silêncio
  17 35.72–38.68  plongée alta: torre trêmula sob luz de alarme ("a dívida passava de 40 bilhões"; PASSIVO TOTAL 20 → 40)
  18 38.68–40.62  aberto: a torre desmorona, moedas estouram, poeira ("a torre desmoronou"; VIROU PÓ 25 → 0)
  Cena 6 — O Estrago (pregao → sala)
  19 40.62–42.88  pregão: telão despenca em 40.82 ("ações viraram pó"; ficha ATO V)
  20 42.88–45.84  RASANTE_MANADA no chão do pregão: peões tombam em `ruina` ("os peões da manada amargaram prejuízo")
  21 45.84–48.40  CLOSE_ROSTO: Magnata derrotado, auréola partida, etiquetas CVM: ACUSADO / PF: DISCLOSURE ("diretoria foi acusada"; selo JUN/2024)
  Cena 7 — O Detalhe Absurdo + Loop (sala → bonus → imperio)
  22 48.40–50.66  macro na pasta do caso abrindo em METAS BATIDAS ("O detalhe mais absurdo")
  23 50.66–53.15  MACRO_LIVRO na folha de bônus: carimbos PAGO (51.14 "bônus") e BATIDA (52.60 "batidas"), NÚMEROS: FALSOS marcado
  24 53.15–55.56  rebobinagem (`rew = 1 − p3io(seg(t, 53.15, 55.35))`): torre se reergue, Magnata volta ao topo, medidor 0 → 25,
                  ficha do gancho remonta em 54.95, câmera termina em SH[0].p0 / SH[0].l0 (p3io) → último quadro = quadro 0.
SOUND:   trilha procedural em `re_menor` (assets/episode/trilha.json → shared/trilha/trilha.py → assets/audio/*.wav):
         drone 0–34.64 e 35.24–55.55 (0,6 s de silêncio após o carimbo), brilho 6.42–14.58, pulso 96 bpm 23.04–34.64,
         subida 33.74–34.64, alarme 38.68–40.62, ronco 38.68–41.4, vento 40.62–48.4; efeitos: tique nos andares
         (8.20…10.74), deslize 20.04, trava nas 3 tampas (21.60 / 22.38 / 22.90), clique nos alfinetes (27.74 / 28.30 / 28.86),
         baque 34.64, estalo 38.9 / 39.3 / 39.8.
         SFX de assets/sfx com pico 1 quadro após a imagem (início = evento + 0,033 − ataque do arquivo); nenhum em t = 0
         nem nos últimos 100 ms.
BANNED:  granulação, Math.random/Date.now, verde em qualquer lugar, logotipos/marcas reais, CONDENADO sem condenação real,
         câmera parada, editar captions.html à mão, números fora dos fatos (só R$ 25 BI do título, R$ 20 BI das
         inconsistências e R$ 40 BI do passivo; o hodômetro só interpola entre eles).
QA:      0.0 (thumb = ficha + torre), 3.0, 5.0, 9.0, 12.5, 16.0, 19.0, 21.5, 24.0, 26.5, 28.5, 30.3, 32.5, 34.64 (carimbo),
         34.8, 37.0, 39.6, 41.8, 44.0, 47.0, 49.6, 52.0, 54.0, 55.50 (= quadro 0).
