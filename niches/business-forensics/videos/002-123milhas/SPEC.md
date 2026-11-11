# SPEC — 123Milhas: O Calote de R$ 2,3 Bilhões nas Passagens Fantasma

GOAL:    tensão crescente com a satisfação de entender o truque (bilhete vendido sem existir = pirâmide de passageiros);
         no fim, a rebobinagem devolve a torre-pirâmide intacta e a frase final cola na primeira, e o espectador assiste de novo.
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps (Shorts / Reels / TikTok)
TIME:    59.77 s x 30 = 1794 frames. Relógio = locução (assets/voice.mp3, timestamps de assets/voice.json).
         Mesma duração em index.html (set_duration.py), `const DUR` do world.html e do hud.html, e `const LOOP` do scene.js.

LOOK:    identidade do nicho (../../NICHE.md → Visual): A Mesa da Perícia 3D (motor em assets/motor/, guia PROMPT.md;
         peças em assets/kit/, guia KIT.md).
LAYOUT:  texto crítico só em x 64–920 e y 220–1500 (`compositions/hud.html`: `#hud-ficha`, `#hud-valor`, `#hud-data`,
         `#hud-carimbo`); assunto 3D em y 600–1290; legendas `label-tag` com base em y 1450 (`bottom: 470`).
WORLDS:  `imperio` (torre-pirâmide na mesa) · `livro` (dentro do livro-caixa em (0, -200, 0)) · `sala` (mesa + Perita/Fiscal) ·
         `pregao` (em (0, -400, 0))
CASE:    nome `123MILHAS` (placa da torre, ficha `CASO Nº 002 · 123MILHAS`) · forma do império `piramide`
         (`makeEmpireTower({ forma: "piramide", andares: 8, ocos: [2, 3, 4, 5] })`) · truque físico `piramide`
         (`makePonziPyramid` no livro com fileiras de peões da Manada em cada degrau e moedas novas subindo da base ao topo) ·
         carimbo `CALOTE` (P8: não há condenação; o relatório da CPI indiciou → selo `INVESTIGADO`) ·
         consequência: 700 mil credores, recuperação judicial em 29/AGO/2023, sócios indiciados na CPI, ressarcimento só em voucher.
DIFF:    em relação ao episódio-modelo do template (Monarca S.A.):
         1. nome do caso: MONARCA S.A. (US$ 74 BI) → 123MILHAS (R$ 2,3 BI, 700 MIL credores);
         2. forma do império: `torre` reta → `piramide` (andares que encolhem para cima, 4 andares ocos no meio);
         3. truque físico: `caixas` aninhadas (SPEs) → `piramide` de peões sobre `makePonziPyramid`, pagos com moedas novas;
         4. carimbo: `FRAUDE` → `CALOTE`; o Fiscal guarda as fichas na gaveta `CPI` (selo `INVESTIGADO`);
         5. consequência: pregão em queda → pregão com a Manada de clientes tombada + voucher `SEM FUNDOS` como detalhe absurdo.
CAMERA:  planos de 1,7–3,0 s, câmera sempre em movimento, fov 50, assunto em 50–60 % da largura (assunto alto: ~55 % da altura);
         texto no chão (`floorLabel`) só em plano de cima (`MACRO_LIVRO`); `ap` alto nos closes (6–9), baixo nos abertos (0,8–1,5).
SHOTS:   (planos do assets/episode/scene.js; eventos do hud.html nos mesmos tempos; âncora = início da palavra em voice.json)
  Cena 1 — O Gancho (0.00–9.10)
   1  0.00– 2.06 imperio ABERTO_IMPERIO · quadro 0 = ficha `R$ 2,3 BI → ZERO` + medidor `R$ 2,3 BI ▼` + `AGO/2023` + torre-pirâmide
                 intacta com rachadura pulsando + Magnata `celebrate` (confiante) + Manada em euforia na frente
   2  2.06– 4.70 imperio CLOSE base · 3.22 "setecentos": rachadura cresce na base; medidor → `CREDORES 700 MIL`
   3  4.70– 7.42 imperio CLOSE_ROSTO · Magnata `idle` com visor `nervoso`
   4  7.42– 9.10 imperio PLONGEE_MESA · 7.42 "apenas": selo dispara `18/AGO` → `29/AGO` em 12 degraus secos (tique)
  Cena 2 — A Ascensão (9.10–18.56)
   5  9.10–11.18 pregao RASANTE_MANADA (varredura lin) · 9.10 "Em": ficha `ATO I`, selo `JAN/2023`; medidor `DÍVIDA A DESCOBERTO`
                 sobe de R$ 0,0 a R$ 2,3 BI em degraus até 17.8; telão do pregão acompanha (0,50 → 2,30)
   6 11.18–14.12 pregao aberto no telão · setas de ouro (`createFlowArrow`) disparando da Manada para o telão; selo avança por mês
   7 14.12–17.16 pregao close · 14.12 "vendendo": peões em euforia levantam bilhetes de papel com selo ouro
   8 17.16–18.86 imperio aberto · 17.16 "metade": andares brotam em `backOut`, setas de ouro na torre, Magnata `point` (ganancioso)
  Cena 3 — A Manobra (18.56–27.08)
   9 18.86–21.68 livro MACRO_LIVRO (de cima) · 18.86 "bilhetes": ficha `ATO II · BILHETES FANTASMA`; Contador `scribble` riscando
                 `BILHETE ... NÃO` e `RESERVA PRÉVIA 0`; 20.10 "existiam": `nervous`; medidor `RESERVA PRÉVIA ZERO`
  10 21.68–24.48 livro 3/4 baixo · 21.68 "vendia": `makePonziPyramid.grow` com fileiras de peões subindo degrau a degrau (deslize)
  11 24.48–27.16 livro close lateral · 24.48 "bancar": 12 moedas entram pela base e sobem ao topo; medidor `CREDORES` 0 → 700 MIL
  Cena 4 — As Rachaduras (27.08–35.14)
  12 27.16–28.84 sala PERFIL_PERITA · 27.16 "luz": lâmpada cai a 30 %, contra-luz UV, Perita `lean` com o cone UV sobre a pasta
                 `LIVRO-CAIXA / SEM RESERVA`; ficha `ATO III · PIRÂMIDE SEM LASTRO`
  13 28.84–31.08 sala aberto · 28.84 "truque": `tower.reveal` → 4 andares ocos com aresta violeta
  14 31.08–33.72 sala plongée · 31.08 "subiram": etiqueta `TARIFAS EM ALTA`, fio vermelho até a rachadura e a pasta (cliques);
                 medidor `TARIFAS AÉREAS ▲ EM ALTA`
  15 33.72–35.86 sala contra-plongée · 33.72 "perdeu": Manada em `duvida`, rachadura sobe, o fio estica até o teto;
                 medidor `LASTRO ZERO`
  Cena 5 — O Colapso (35.14–42.78)
  16 35.86–37.72 imperio CLOSE_ROSTO (lado oposto ao plano 3) · 35.86 "os voos": selo congela `18/AGO/2023`, Magnata `panic`,
                 alarme; medidor `EMISSÕES PROMO SUSPENSAS`; ficha `ATO IV · CALOTE EM 11 DIAS`
  17 37.72–40.46 imperio CONTRA_PLONGEE no Fiscal · `raise` em 37.72, **carimbo em 38.14 ("desceu")**: `slam` 3D + decalque
                 `CALOTE` na mesa + `#hud-carimbo CALOTE` + tremor + baque + 0,6 s de silêncio do drone (38.14–38.74)
  18 40.46–43.22 imperio aberto · 40.46 "torre": `collapse` (estalos, ronco), moedas estouram, poeira; medidor
                 `CRÉDITO DOS CLIENTES` R$ 2,3 BI → ZERO; selo `29/AGO/2023` (recuperação judicial)
  Cena 6 — O Estrago (42.78–52.06)
  19 43.22–45.32 pregao RASANTE_MANADA (varredura lin) · 43.22 "setecentos": peões tombam em `ruina`, poeira, vento; telão em
                 queda; medidor `CREDORES 700 MIL`; ficha `ATO V · 700 MIL CREDORES`
  20 45.32–47.22 pregao aberto no telão em queda (vermelho)
  21 47.22–50.24 sala close no Fiscal · 47.22 "sócios": gaveta `CPI` abre com fichas de papel e bate travada em 49.2 (trava);
                 medidor `RELATÓRIO DA CPI · INDICIADOS`; selo `CPI CÂMARA`
  22 50.24–52.96 sala close · 50.24 "estelionato": Magnata ajoelhado (`derrotado`, auréola partida); selo `INVESTIGADO` pisca
  Cena 7 — O Detalhe Absurdo e Loop (52.06–59.77)
  23 52.96–55.52 sala MACRO de cima · 52.96 "ironia": etiqueta `VOUCHER PRÓPRIO` deitada na mesa; ficha `A IRONIA ·
                 PAGOS EM VOUCHER`; medidor `REEMBOLSO SÓ VOUCHER`
  24 55.52–57.37 sala macro (outro ângulo) · 55.86 "vouchers": decalque `SEM FUNDOS` prensado na etiqueta; 55.52: medidor
                 `DÍVIDA DECLARADA` sobe de ZERO a R$ 2,3 BI em degraus até 58.50
  25 57.37–59.78 imperio rebobinagem (`rew = 1 − p3io(seg(t, 57.37, 59.57))`): blocos, moedas, Magnata e Manada voltam;
                 câmera termina em SH[0].p0 / SH[0].l0 (`p3io`); ficha remonta `R$ 2,3 BI → ZERO` em 59.17 → último quadro = quadro 0.
SOUND:   trilha procedural em `re_menor` (assets/episode/trilha.json → shared/trilha/trilha.py → assets/audio/*.wav) +
         SFX de assets/sfx com pico 1 quadro após a imagem e 0,6 s de silêncio logo após o carimbo (38.14–38.74).
BANNED:  granulação, Math.random/Date.now, verde em qualquer lugar, logotipos/marcas reais, CONDENADO sem condenação real,
         câmera parada, editar captions.html à mão, dados inventados (sem "correção de CDI", sem número de parcelas).
QA:      0.0 (thumb = ficha + torre-pirâmide), 3.3, 8.6, 12.5, 15.5, 17.9, 20.0, 23.0, 25.8, 28.0, 30.0, 32.5, 34.8, 36.8,
         38.14 (carimbo), 38.5, 41.5, 44.0, 46.2, 48.2, 51.5, 54.0, 56.3, 58.5, 59.72 (= quadro 0).
