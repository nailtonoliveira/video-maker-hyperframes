# REVIEW — 004 Apagão de 2003

`npm run check`: 0 erros. Os 10 avisos são os `.wav` provisórios da trilha (1 s; a etapa `trilha` do pipeline gera os
definitivos) e mensagens de desempenho do driver WebGL. Layout 0 problemas, contraste 15/15 AA.
Snapshots com `--describe false`, em 4 rodadas (`/tmp/s004a…e`). Nada renderizado e nenhum preview deixado rodando.

## O que cada snapshot mostra (versão final)
| t (s) | Ato | O que se vê |
| --- | --- | --- |
| 0.0 | 1 | Data center (2 fileiras de racks com LEDs, eletrocalhas) sobre o pátio, sala de controle atrás, subestação com transformadores e pórtico, linha de torres até a cidade no horizonte. "50 MILHÕES / SEM LUZ" + "// RACE CONDITION DETECTED" pousados em x 96, y 200–520. Assunto no meio do quadro, ~60 % da largura. |
| 1.0 | 1 | Mesmo plano em movimento, legenda abaixo do assunto. |
| 2.9 | 1 | Ponta do corredor: frentes dos racks com LEDs menta e ciano, tampas das pontas com venezianas. |
| 4.7 | 1 | Rasante: 3 barramentos convergindo para o data center, DOF rasa. |
| 6.8 | 2 | Lateral do rack: placa "FIRSTENERGY · SCADA / 2003-08-14 14:14:00 EDT" legível; título "14/08/2003". |
| 9.6 | 2 | Tampa aberta e chassi fora do rack, no corredor. |
| 11.2 | 2 | Dentro do chassi: mini-chip "GE XA/21" com aresta menta (título "GE" entrando em wipe). |
| 13.3 | 2 | Placa de cima: chip GE XA/21 / EMS · alarmes, barramento com pulsos menta; título "GE XA/21 // alarmes em C/C++". |
| 16.4 | 2 | Lateral baixa do barramento com pulsos; "14:14" em ciano. |
| 18.6 | 3 | De cima: as tarefas A e B no mesmo slot da `alarm_queue`, vermelhas; linha de código embaixo, acima da legenda. |
| 20.2 | 3 | Bug andando sobre a linha de código (plano próximo, ~45°). |
| 22.7 | 3 | Plongée: o bug parado embaixo de `push(event)`, sublinhado vermelho, bits `MUTEX_LOCK = 0x00` com aresta vermelha; "SEM MUTEX". |
| 24.0 | 3 | A fila rachou em vermelho, `QUEUE_CORRUPT`, placa avermelhada (o título sai em 23,82 para mostrar a fila). |
| 26.7 | 3 | Chip GE XA/21 morto em vermelho com o anel girando; "LOOP // infinito · alarmes mudos". |
| 28.3 | 4 | Lateral do vão: cabos cedendo sobre as árvores; "345 kV // linhas de Ohio caem". |
| 29.3 | 4 | O cabo encosta na árvore crescida (vermelha), arco e faísca. |
| 31.0 | 4 | Console: monitor "EDT 14:14", nenhuma luz de alarme; "0 ALARMES". |
| 33.2 | 4 | Céu de apagão: o pulso vermelho corre a linha, torres e cabos ficam vermelhos rumo à cidade. |
| 34.3 / 35.7 | 4 | Cidade de cima: as janelas apagam em onda do centro para fora (35,7 s: toda apagada); "100+ USINAS // 261 unidades geradoras". |
| 36.6 / 37.3 | 4 | Data center apagado (dominó dos racks), "-US$ 6 / BILHÕES" em vermelho. |
| 39.6 | 5 | Pela vidraça: 3 monitores estáticos (ALARM LIST · sem eventos / 14:14 / SCADA · on-line), cadeiras vazias. |
| 42.1 | 5 | Relógio em timelapse (15:09 no meio do caminho 14:14 → 15:45); "+1 HORA". |
| 43.6 | 5 | Órbita de volta, luzes reacesas; o gancho remontando. |
| 44.68 | 5 | Mesmo enquadramento, título e subtítulo do quadro 0 (PSNR 33,6 dB contra o quadro 0; a diferença é o resto do movimento em 0,05 s e a legenda "que..."). |

Fora de ordem: 13,3 · 31,0 · 39,6 · 0 · 44,68 pedidos depois de 34–35 s saíram iguais aos da primeira rodada.

## O que foi corrigido
- 18,4 s / 22,7 s: a legenda cobria o registrador e os bits do mutex. Aproximei o registrador (z −3,2 → −2,6),
  escalei a linha de código ×0,82 (os 24 caracteres cabem no quadro vertical), desloquei bug, bits e rótulos e
  reenquadrei os planos 9 e 11. Agora tudo fica entre y 700 e 1150.
- A tarefa B escondia a A no slot: B agora bate e tomba por cima da A.
- O título "SEM MUTEX" cobria a fila rachando: sai em 23,82 (a fila corrompe).
- A cidade aparecia atrás das árvores do vão (28,3 s) e como faixas brancas na borda do quadro 0: foi para o fim da
  linha (s = 262 m, `flatR` 340), menor e com janelas menos brilhantes. O pulso vermelho agora corre até ela.
- O plano do pulso (33,2 s) ficava colado no pórtico: a câmera foi para o lado da linha, alta, com varredura linear.
- O plano das usinas (35,2 s) misturava pórtico, racks e cidade: virou um plano aberto da cidade apagando em onda.
  O dominó dos racks foi para o plano do prejuízo (35,9 s).
- As janelas não apagavam (eu trocava o material do grupo de `solid`, não o da malha): corrigido.
- Quadro 0 com a cidade e o farol da torre colados no topo: a câmera do quadro 0 subiu (y 9,5 → 11).
- A luz do arco tingia as árvores de ciano: intensidade 400 → 45.

## Pendente / para a revisão humana
- `scene.js` tem ~400 linhas (meta ~250): subestação, linha de 345 kV, árvores, sala de controle e cidade não existem
  no kit e foram montadas com `solid`. Se a rede elétrica voltar em outros episódios, vale virar peça do kit.
- A placa "100+ USINAS" mostra a cidade (consumidores) apagando, não usinas modeladas; o número está no título.
- Plano 14 (console): começa em 29,54 ("no Ohio"), 0,96 s antes da âncora 30,50, para manter os planos entre 1,7 e 3 s;
  o título "0 ALARMES" entra na âncora.
- O farol menta da primeira torre aparece no topo do quadro 0 (fica no quadro do fim também).
- Os SFX só foram medidos (picos via ffmpeg), não ouvidos; a trilha só existe depois da etapa `trilha`.
