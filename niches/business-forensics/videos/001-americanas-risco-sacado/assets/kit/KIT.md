# Kit 3D do business-forensics — A Mesa da Perícia

O motor (`assets/motor/`, guia em `assets/motor/PROMPT.md`) dá palco (`createStage`, `createEpisode`), câmera (`cameraOf`), pós, materiais (`solid`, `fill`, `edge`) e texto (`label`, `floorLabel`).
O kit dá a identidade da série **Business Forensics**: a Sala de Provas (`sala.js`), a Torre do Império e as moedas (`imperio.js`), o Livro-Caixa (`livro.js`), os truques físicos (`truques.js`), as provas (`provas.js`), o elenco de peças de tabuleiro (`elenco.js`) e a sala de pregão (`exteriores.js`).
Não edite o kit dentro de um vídeo: a fonte da verdade é `niches/business-forensics/template/assets/kit/`.

## Regras das peças
- Toda fábrica `makeX(opts)` devolve `{ group, ...estado }` (ou `{ group, act, rosto }` no elenco).
- Todo método de estado recebe `k` (`0 → 1`) ou `(t, ...)` e define **tudo o que toca em toda chamada** (o HyperFrames busca quadros fora de ordem).
- Todo texto 3D (`label` / `floorLabel`) passa `weight = 700` (IBM Plex Mono).
- Para o loop por rebobinagem (`t ∈ [LOOP - 2.4, LOOP - 0.2]`), basta passar `k(t) = 1 - E.p3io(seg(t, LOOP - 2.4, LOOP - 0.2))` para `collapse(k)`, `fall({ k })`, `ruina({ k })` etc.

## Cores e materiais (`cores.js`)
- `C`: `{ ouro, fraude, uv, papel, taupe, chao, mogno, morto, lacre, nanquim, creme, sepia, cera, bege, violetaTinta, vinho }`. Use sempre `C.*` (nunca `COL.mint`/`COL.cyan`).
- `MBF`: materiais prontos (`ouro`, `papel`, `mogno`, `nanquim`, `taupe`, `sepia`, `lacre`, `fraude`, `uv`, `morto`, `eNanquim`, `eOuro`, `eFraude`, `eUv`, `eTaupe`).

## Sala de Provas e Céus (`sala.js`)
- `SKIES_BF`: `{ sala, imperio, livro, pregao }` — passe em `createEpisode(S, { ..., skies: SKIES_BF })`.
- `makeEvidenceRoom({ seed, caso })` → `{ group, update(t, { alarm, uv }) }`:
  - Tampo de mogno em `y = 0` (`14 × 9 u`), mata-borrão pautado (`y = 0.005`), paredes de lambri, quadro de cortiça (`z = -9`) com cartões marfim e lâmpada de interrogatório em `(0, 9, 0)` com SpotLight (`shadow.mapSize 2048²`) + contra-luz UV (`#9b8cff`).
  - `alarm` (`0 → 1`): avermelha a luz e o filete da mesa.
  - `uv` (`0 → 1`): reduz a luz quente a 30 % e sobe a contra-luz UV a 2,2.

## Torre do Império e Moedas (`imperio.js`)
- `makeEmpireTower({ nome, andares = 9, ocos = [3, 4, 5, 6], w = 2.4, h = 0.6, seed, forma = "torre" })` → `{ group, topY, rise(k), crack(k), reveal(k), collapse(k) }`:
  - `rise(k)`: andares nascem de baixo para cima com `E.backOut`.
  - `crack(k)`: rachadura vermelha pulsa na base e sobe pela fachada.
  - `reveal(k)`: os andares em `ocos` ficam translúcidos (opacidade 0,14) com aresta violeta UV `#9b8cff`.
  - `collapse(k)`: queda parabólica determinística (os ocos primeiro) e cor indo a `C.morto`; em `k = 0` a torre está intacta.
- `makeCoinStack({ n = 16, r = 0.26 })` → `{ group, fill(k) }`.
- `makeCoinBurst({ count = 120, seed = 13, origem = [0, 2.2, 0] })` → `{ group, update(k) }` (`InstancedMesh`).
- Setas de entrada/saída de dinheiro: importe `createFlowArrow` de `../kit3d.js` (`color: C.ouro` para entrada, `C.fraude` para saída).
- Poeira do desabamento: `makeGroundCloud({ count, center })` de `./efeitos.js`.

## Mundo do Livro-Caixa (`livro.js`) e Truques (`truques.js`)
- Coloque o grupo do mundo `livro` numa base fixa `new THREE.Vector3(0, -200, 0)` e alterne `visible` pelo `sh.env === "livro"`.
- `makeLedger({ titulo, linhas, linhaFraude })` → `{ group, open(k), flip(k), mark(i, k), uv(k) }`: página pautada `36 × 24 u` no chão com lançamentos em `floorLabel` (só em plano de cima `MACRO_LIVRO`) + iluminação própria.
- `makeShellBoxes({ nomes })` → `{ group, swallow(k), nest(k) }`: 3 caixas de fachada que engolem a dívida, fecham a tampa e se aninham.
- `makePonziPyramid({ niveis = 3 })` → `{ group, grow(k), collapse(k) }`.
- `makeBubble({ r = 1.4 })` → `{ group, inflate(k), pop(k) }`.

## Provas (`provas.js`)
- `makeEvidenceTag({ texto })` → `{ group, show(k) }`: etiqueta marfim com furo, barbante e texto `#4c35b8`.
- `makeRedString(pontos)` → `{ group, draw(k) }`: fio vermelho com alfinetes, desenhado progressivamente (`setDrawRange`).
- `makeCaseFolder({ caso, nome })` → `{ group, open(k) }`: pasta de dossiê que abre na mesa.
- `makeStampMark(texto)` → `{ group, press(k) }`: decalque vermelho-lacre `#b3261e` deixado pelo carimbo.

## Elenco (`elenco.js`)
- `makeMagnata({ escala })` → `{ group, act(t, modo, o), rosto(estado) }`:
  - `modo`: `"idle" | "celebrate" | "point" | "panic" | "fall"`. Posicione no topo da torre (`y = tower.topY`).
- `makePerita({ escala })` → `{ group, act(t, modo, o), rosto(estado) }`:
  - `modo`: `"idle" | "scan" | "lean" | "nod"`. Lanterna UV com cone translúcido (`o.uv`).
- `makeContador({ escala, livros = 4 })` → `{ group, act(t, modo, o), rosto(estado) }`:
  - `modo`: `"idle" | "scribble" | "nervous" | "hide" | "topple"`. Uso exclusivo no mundo `livro`.
- `makeManada({ count = 36, cols = 9, spacing = 0.75, seed = 5 })` → `{ group, act(t, modo, o) }`:
  - `modo`: `"euforia" | "duvida" | "panico" | "ruina"` (2 `InstancedMesh`: corpo + casca `BackSide`).
- `makeFiscal({ escala, texto = "FRAUDE" })` → `{ group, act(t, modo, o), rosto(estado) }`:
  - `modo`: `"idle" | "advance" | "raise" | "slam" | "drawer"`. Em `"slam"`, o carimbo toca a mesa exatamente em `o.t0`.

## Pregão (`exteriores.js`)
- `makeTradingFloor({ mesas = 6 })` → `{ group, telas(valor), queda(k) }`: recolorido automaticamente pelo `tema.json` (alta em ouro, queda em vermelho-fraude). Escalone `valor` de 5 em 5 para respeitar o cache LRU de 32 texturas.
