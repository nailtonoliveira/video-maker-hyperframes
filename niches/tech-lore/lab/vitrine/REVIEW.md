# Vitrine — revisão quadro a quadro

Ordem (4 s cada, loop 28 s): 0–4 base + Ariane 5 (dia) · 4–8 data center · 8–12 pregão · 12–16 radioterapia (sala) ·
16–20 avião (dia) · 20–24 carro (sala) · 24–28 sonda (espaço).
Snapshots em `renders/` (fora do git): Tarefa 5 em `it1`, `it2`, `it3`, `final` e `final-iso`; Tarefa 6 em `t6-it1`,
`t6-it2`, `t6-it3` e `t6-final` (a amostra final de todos os objetos).

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
  fica vermelho e a luz vermelha banha o corredor. Correção (Tarefa 6): "confunde: nada" estava errado. A leitura
  dependia da câmera: no meio da órbita (6 s) as pontas das fileiras eram painéis lisos, os LEDs tinham 1–2 px num
  celular e a régua de luz branca puxava o olho.
- Tarefa 6: LEDs maiores (0,06 × 0,026 m, antes 0,035 × 0,016), tampas das pontas claras com venezianas e coluna de
  LEDs da PDU, régua de luz apagada (cinza médio) e órbita na diagonal (122°→88°, y 5,5): a câmera vê as frentes de
  uma fileira e termina na ponta do corredor. `t6-final` 4,5 s, 6 s e 7,6 s: lê-se como sala de servidores nas três
  amostras; os LEDs passam de 4 px nas frentes. Confunde: a 4,5 s a fileira da esquerda é cortada pela borda do
  quadro (só se vê a traseira), sem perder a leitura.
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
- Tarefa 6: o paciente quase não se lia como pessoa (cabeça pequena e escura, embaixo do cone do feixe; lençol como
  uma laje). Agora: pés para a máquina e cabeça em +z, do lado da câmera (a cabeça para a máquina ficava escondida
  atrás do cabeçote nessa órbita), cabeça maior (r 0,145) e clara, braços ao lado do tronco, lençol arredondado sobre
  as pernas com os pés marcados, feixe no abdome. `t6-final` 14 s: lê-se como pessoa deitada na maca.

## Avião (`makeAirplane()`)
- t6-it1 (17, 18 e 19,5 s; órbita 40°→70°, r 22, a 5 u acima, contra o terreno): lê-se de cara como avião comercial
  bimotor. Fuselagem branca torneada com a cauda levantada, janelas, para-brisa, faixa e deriva azul, asas enflechadas
  com winglets, turbinas com entrada escura. O trem baixa entre 0,5 e 1,6 s, e o `dano` solta a ponta da asa direita,
  com fogo facetado, fumaça e aresta vermelha na turbina.
- Sem mudança na malha depois do it1. Confunde (t6-final): visto de frente, a fumaça cai por cima da asa e parece
  um bloco escuro; a ponta da asa solta parava a ~9 m embaixo da asa e seguiria o avião para sempre.
- Revisão (fix 1, `t6-fix1` 18,9–19,9 s): a ponta cai em parábola, sai do quadro e some em `dano(1)`. A fumaça virou
  bolas menores, espaçadas e mais claras (0x4a5058); lê-se como fumaça facetada atrás da turbina, não como um
  bloco.

## Carro (`makeCar()`)
- t6-it1 (órbita 48°→78°): lê-se como sedã (lataria, cabine de vidro escuro, teto, rodas de 5 raios, faróis). Mas a
  câmera só via a frente, e o freio aparecia só como um brilho vermelho no chão.
- t6-it2: a órbita passou a ir da frente 3/4 ao lado e à traseira 3/4 (40°→−45°), para as lanternas acenderem à
  vista (2,4 s). O r 9,5 cortava o carro de lado.
- final (r 13, y 4,2): o carro ocupa 60–70 % da largura, as lanternas e o brake-light ficam vermelhos com a luz no
  chão e o giro das rodas aparece nos raios. Confunde: nada; o desenho é de um sedã quadrado dos anos 80/90.

## Sonda (`makeSpaceProbe()`)
- t6-it1 (órbita 70°→100°, r 15): corpo dourado, prato, painéis com grade e estrelas; lê-se como sonda ou satélite.
  As asas abertas cruzavam o quadro de lado e deixavam o corpo pequeno; com r 12,5 (it2) cortavam nas bordas.
- t6-it3/final: órbita 30°→55° (as asas recuam na diagonal), r 14, y 5. 24,3–25 s: dobrada, a asa sai da lateral, com
  o prato inclinado; 26 s: os painéis desdobram em sanfona; 27,8 s: aberta, com o prato de volta na vertical.
- Revisão (fix 1): com r 14, a asa esquerda saía do quadro a 27,8 s e encostava nele a 26 s. Com r 15,5
  (`t6-fix1`), a sonda inteira fica dentro do quadro nos dois tempos. Confunde: nada; sem rótulo, lê-se
  como "sonda/satélite", não necessariamente uma sonda interplanetária (falta contexto de planeta, o que fica para
  o episódio).

## Resumo (amostra `t6-final`)
| Objeto | Reconhecível | Observação |
| --- | --- | --- |
| Base + Ariane 5 | sim | Foguete com boosters na base; a mesa de lançamento pesa no pé do quadro. |
| Data center | sim | Diagonal + ponta do corredor; tampas com venezianas, LEDs maiores, régua apagada; lê-se nas 3 amostras (fileira da esquerda cortada a 4,5 s). |
| Pregão | sim | Telão com velas e número, 6 mesas; o gráfico ocupa a metade de baixo do telão. |
| Radioterapia | sim | Acelerador com braço em C, feixe ciano e paciente que agora se lê como pessoa; console na borda. |
| Avião | sim | Bimotor comercial de 3/4 contra o terreno; no dano, a ponta da asa cai e some, e a fumaça sai em bolas. |
| Carro | sim | Sedã de 3/4 frente → traseira; freio visível; o desenho é datado (quadrado). |
| Sonda | sim | Corpo dourado, prato e painéis em sanfona; lê-se como sonda/satélite, sem dizer qual. |
