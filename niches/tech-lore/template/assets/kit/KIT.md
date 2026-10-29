# Kit 3D do tech-lore — peças do nicho

O motor (`assets/motor/`, guia em `assets/motor/PROMPT.md`) dá palco, câmera, pós, materiais e texto. O kit dá as peças
da série: estilo maquete (sólido fosco + aresta de 1 px, cores de `COL`), a placa por dentro da máquina, efeitos,
lugares reais e o bug. Não edite o kit dentro de um vídeo: a fonte da verdade é `niches/tech-lore/template/assets/kit/`.

## Regras das peças
- Fábrica `makeX(opts)` devolve um grupo (ou `{ group, ...estado }`). Nada de tempo de episódio dentro do kit: quem diz
  quando é o `scene.js`.
- Métodos de estado recebem 0→1 ou booleano e definem **tudo o que tocam em toda chamada** (o render busca quadros
  fora de ordem). Chame todos em todo `update`, inclusive com o objeto escondido.
- Períodos de piscar vêm do episódio: `loopPeriod(LOOP, quero)`.

## Peças (`props.js`)
- `M`: materiais prontos (`slate`, `ink`, `chip`, `board`, `bus`, `ledOff/ledMint/ledCyan/ledAlert`, `eMint`, `eAlert`...).
- `makeChip({ name, sub, w, d, h, pins, leds, nameH })` + `chipState(chip, t, deadAt, period, tilt)` → `{ y, rz, dx }`
  (vivo pisca; morto fica vermelho, afunda e inclina).
- `makeRegister({ n, P, text })` + `registerState(reg, t, { riseAt, jamAt, crackAt })`: bandeja de n bits que racha.
- `makeBitBlock(bits)` + `bitBlockState(cells, bits, t, { bornAt, slideA, slideB, jamAt, ejectAt, redAt })` → frente.
- `makeBus(lanes, { x0, z, length, text })`, `makePulses(lanes, perLane)`: barramento e pulsos de dados.
- `makeCodeLine({ code, comment, x0, z })` → `{ group, underline }`: código no chão (só em plano de cima).
- `intBits(x, n)`, `float64Bits(x)` (`bits.js`): bits reais, MSB primeiro.

## A placa (`placa.js`)
- `BOARD_SKY`: céu escuro da placa (use como `skies.int`).
- `makeBoard({ seed, cx, cz, half, keepOut, loop })` → `{ group, update(t, { focus, alarm }) }`: trilhas, vias,
  componentes, LEDs, serigrafia e o facho que segue `focus`; `alarm` 0→1 avermelha o facho. `keepOut` = retângulos
  `[x0, z0, x1, z1]` livres para a cena. `loop` é obrigatório.

## Efeitos (`efeitos.js`) — instanciados, `update` puro do tempo
- `makeTrail({ until, step })` → `update(F, flight, tail)`: rastro de fumaça ao longo de `flight(F) → { p, a }`.
- `makeGroundCloud({ count, center })` → `update(F)`: nuvem de chão da decolagem.
- `makeExplosion({ at })` → `update(dt)`: fogo facetado, fumaça e destroços (`dt` = s desde o estouro).

## Exteriores (`exteriores.js`) — lugares e veículos reais
| Fábrica | Tamanho | Estado |
| --- | --- | --- |
| `makeLaunchPad()` | laje 44 × 44 u, torres de 20 u (1 u ≈ 5 m) | — |
| `makeAriane5()` | ~11 u de altura (bocais em y = −5,2), centro na origem (1 u ≈ 5 m) | `pose(p, a)`, `burn(ign, t, on)`, `nozzle(k)`, `breakup(dt)`, `xray(on, t, t0)`, `hatch(kHinge, kDrawer)` |
| `makeDataCenter({ racks = 8 })` | piso 7,2 × 7,2 m, racks de 2 m, 2 fileiras (1 u = 1 m) | `leds(t, period)`, `alarme(k)` |
| `makeTradingFloor({ mesas = 6 })` | piso 9 × 8,8 m, telão 6 × 2,4 m na parede (−z) | `telas(valor)`, `queda(k)` |
| `makeMedicalDevice()` | sala 6,6 × 6,6 m (paredes cortadas a 0,75 m) + piso do console até x = 5,3; isocentro a 1,3 m | `giro(k)`, `feixe(on)`, `alerta(k)` |
| `makeAirplane()` | ~7,5 u de comprimento, envergadura ~7,2 u, deriva até y = 1,95 (1 u ≈ 5 m); origem no centro, nariz em +x | `pose(p, a)`, `trem(k)`, `dano(k)` |
| `makeCar({ cor })` | 4,4 × 1,8 × 1,43 m, rodas de 0,32 m (1 u = 1 m); origem no chão, frente em +x | `rodas(ang)`, `freio(on)` |
| `makeSpaceProbe()` | corpo 1,2 × 0,9 × 1,2, prato de 1,8, envergadura aberta ~7,2; origem no centro, antena em +y | `paineis(k)`, `antena(ang)`, `pose(p, a)` |

- Data center: corredor frio ao longo de x. Lê-se melhor na diagonal (vê as frentes de uma fileira com os LEDs) ou
  na ponta do corredor, 2–3 m acima dos racks. As pontas das fileiras têm tampa clara com venezianas e LEDs da PDU,
  para o lado não ficar liso. `leds` usa `period`/1, /2 ou /3 por LED; `alarme` acende os giroflex e uma luz vermelha.
- Pregão: mesas de frente para o telão (em −z); câmera em +z, alta (≈7 m). `telas(valor)` escreve o número no
  formato brasileiro. Cada texto vira uma textura, guardada num cache LRU de 32: no episódio, arredonde ou escalone
  o valor (por exemplo de 5 em 5) para não redesenhar a cada quadro. `queda(k)` derruba o gráfico em vermelho, vira
  a seta e avermelha monitores e faixa de cotações.
- Radioterapia: maca no eixo z, estativa em −z, console fora da parede em +x. `giro(k)`: k 0→1 = uma volta do braço;
  `feixe(on)`: cone ciano do cabeçote ao paciente; `alerta(k)`: tela do console, lâmpada e luz local em vermelho.
- Avião: asas ao longo de z, asa direita em +z. `pose(p, a)`: posição e arfagem (em torno de z), alvo de
  `follow(…)` (com `rotate: true` a câmera fica presa ao corpo, como no Ariane). `trem(k)`: 0 recolhido (escondido),
  1 baixado (rodas em y = −0,92 do centro). `dano(k)`: a ponta da asa direita se solta e gira, a turbina direita
  ganha aresta vermelha, fogo facetado e fumaça escura. Lê-se melhor de 3/4 pela frente, um pouco acima, contra o céu
  (`makeTerrain` lá embaixo).
- Carro: `rodas(ang)` em radianos, positivo rolando para +x (ang = distância / 0,32); as rodas têm 5 raios para o giro
  aparecer. `freio(on)`: lanternas, brake-light e uma luz vermelha curta atrás. Lataria muda com `cor`.
- Sonda: corpo dourado (manta térmica), prato em +y, asas de painéis ao longo de z, motor em −y, mastro do
  magnetômetro em −x. `paineis(k)`: 0–0,4 a asa sai da lateral do corpo, 0,4–1 os 3 painéis desdobram em sanfona.
  `antena(ang)`: inclinação do prato em torno de z. `pose(p, a)` como o Ariane. No espaço não há luz no kit: use uma
  direcional forte (o Sol) + hemisférica fraca, e estrelas no céu do episódio (como na vitrine).
- Os interiores (data center, pregão, radioterapia) não trazem luz geral: use a luz do dia (`makeTerrain`) ou uma luz
  de sala (hemisférica + direcional com sombra), como na vitrine (`niches/tech-lore/lab/vitrine`).
- Valores das telas e LEDs sem Three (`telas.js`, testados em Node): `fmtNum(valor, casas)`,
  `curvaPregao(n, k, seed)`, `periodoLed(period, h)`.

## O bug (`props.js`)
- `makeBug()`: besouro da série (~0,55 u, corpo escuro, aresta vermelha, olhos menta). Aparece **no ponto da falha**.
- `bugState(bug, { pos, yaw, gait })` e `bugWalk(t, t0, t1, a, b, ease)` → pose andando em linha reta (marcha em
  trípode, passo proporcional à distância). Para fechar o loop, termine na pose do quadro 0.

## Testes
`node --test assets/kit/tests/*.test.js` (sempre com o glob). Só lógica pura (`bits.js`, `telas.js`); malha se julga
olhando quadros (vitrine).
