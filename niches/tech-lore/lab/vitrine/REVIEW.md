# Vitrine — revisão quadro a quadro

Ordem (4 s cada, loop 16 s): 0–4 base + Ariane 5 (dia) · 4–8 data center · 8–12 pregão · 12–16 radioterapia (sala).
Snapshots em `renders/` (fora do git): `it1`, `it2`, `it3`, `final` e `final-iso`.

## Base + Ariane 5 (`makeLaunchPad`, `makeAriane5`)
- it1: foguete a 10 % da largura; a órbita (20°→50°) passava atrás da torre para-raios (15, 15), que cortava o quadro.
- it2: raio 21, órbita −12°→14° (longe das torres): foguete enche a altura, mas a mesa de lançamento domina o pé.
- final (r 26, y 7): foguete com boosters, faixa do compartimento e mesa; lê-se como foguete na base. Sem mudança de
  modelo (é o do lab).

## Data center (`makeDataCenter({ racks: 8 })`)
- it1: câmera de lado: via-se a traseira lisa de uma fileira, "caixas pretas" sem leitura; perto demais (corte).
- Ajustes: câmera na ponta do corredor (100°→72°), porta traseira ventilada nos racks (faixas verticais), racks um
  pouco mais claros (os planos se separam do chão), giroflex maior.
- final: corredor frio entre duas fileiras de racks com servidores e LEDs menta/ciano, piso elevado com placas
  perfuradas, eletrocalhas e régua de luz. Lê-se como corredor de data center. Com `alarme(1)` (7,6 s) o giroflex
  fica vermelho e a luz vermelha banha o corredor. Confunde: nada; os LEDs são pequenos (4–5 px) mas visíveis.
- `--angle iso` (6 s): o ângulo iso só inclina o plano da composição (o canvas 3D vira um cartão); serve para ver a
  composição, não acrescenta leitura do objeto.

## Pregão (`makeTradingFloor({ mesas: 6 })`)
- it1: lê-se de cara (telão com velas, número, mesas com 4 monitores e gráficos); câmera baixa e perto demais e a
  queda era tímida (curva em 0,3→0,72, só o fim descia).
- it2/it3: câmera mais alta (y 7,2, r 11,5) mostra as 6 mesas e o telão inteiro; a curva subia pouco e na queda
  batia no piso e terminava em "dojis" verdes achatados.
- final: curva sobe de 0,15 a ~0,85 e despenca depois de 55 % até ~0,05; velas da queda vermelhas, seta para baixo,
  faixa de cotações vermelha, mini-gráficos dos monitores em vermelho, número 4.231,50 → 3.357,36. Lê-se como mesa
  de operações / pregão em queda. Confunde: o gráfico fica na metade de baixo do telão (espaço do número em cima).

## Radioterapia (`makeMedicalDevice()`)
- it1: braço em caixa com cabeçote quadrado saindo de lado (parecia uma prensa); paciente era uma "pílula"; arestas
  invisíveis no branco; luz vermelha do alerta tingia a sala toda de rosa; console escondido atrás da parede.
- Ajustes: arestas mais escuras no branco, braço mais fino, cabeçote redondo (colimador) pendurado na ponta, paciente
  com tronco, lençol, travesseiro e cabeça, feixe ciano mais visível (0,5), paredes cortadas a 0,75 m, luz do alerta
  só no console (alcance 3,5 m), câmera mais alta mirando entre a máquina e o console.
- final: estativa + tambor + braço em C com cabeçote sobre a maca, feixe ciano no paciente, console com terminal
  verde fora da sala que vai ao vermelho com a lâmpada de aviso (15,5 s). Lê-se como acelerador linear de
  radioterapia. Confunde: o console fica na borda direita do quadro no fim da órbita; num episódio, enquadrar o
  console em plano próprio.
