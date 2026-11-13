# SPEC · 001 A árvore de juros

- 1080 × 1920, 30 fps, 117,4 s (voz 112,09 s + cartão 5 s). Tempos absolutos = tempos da narração (`assets/voice.json`).
- Palco: rua (escala 1,3×), corte do quintal, quintal da Ana, quintal do Bruno, placa da esquina, cartão.
- BANNED: fundo escuro com coisas flutuando, brilho/partículas, granulação, cards em fila, legenda repetida em balão,
  texto < 28 px, logotipo de banco/corretora.

| Cena (arquivo) | Tempo | O que a tela faz |
| --- | --- | --- |
| `abertura` | 0–24,55 | Quadro 0: a rua com as duas árvores e placas R$ 14.400 × R$ 24.000 (árvore do Bruno a 0,86×). 4,95 s mergulho no chão → corte do quintal: mão solta a moeda (7,0), broto (8,35), árvore (9,1), fruto (11,6), placa JURO (13,8), fruto cai e vira semente (15,4–17), galho com mais frutos (17,85), placa PLANTAR = RENDER 100% DO CDI (19,75) |
| `ana` | 24,55–48,75 | Quintal da Ana, calendário JAN→ABR 2010; 4 plantios (29,05 / 32,05 / 33,85 / 34,95) com placa R$ 200→800; vizinhos sobem na cerca e riem (35,3), balão HA HA HA (36,95); calendário voa até DEZ 2015 e a placa corre até R$ 14.400 (38,95); carrinho de bebê (41,0); ela vira (42,1); carimbo PAROU EM 2015 (43,55); zoom na placa (45,6) |
| `bruno` | 48,75–66 | Bruno olha a árvore da Ana (51,65), pensa numa árvore (53,85); 2016–2025: grade de 120 meses enchendo, calendário por ano, 10 plantios, placa 0→R$ 24.000 (55,65–63,5); pulso no título "10 ANOS · 120 MESES" (62,15) e na grade (63,6); zoom na placa (64,0) |
| `sozinha` | 66–71,45 | Três dias passam (céu dia/tarde/noite, sol girando), ano 2016→2025, árvore da Ana 0,62→1,0 com frutos aparecendo, a filha cresce |
| `medicao` | 71,45–88,85 | FIM DE 2025 (71,9); nota "valores reais · 100% do CDI · já descontado o IR" (75,8); placa do Bruno 0→R$ 37.349 (76,3–77,9); da Ana 0→R$ 43.462 (79,1–80,7); corte para os dois (81,85): Bruno pula de braços erguidos, Ana aponta o chão (84,55), placas MAIS DINHEIRO R$ 24.000 (85,9) e MAIS TEMPO 16 ANOS (87,5) |
| `juros` | 88,85–102,25 | Corte do quintal: gerações de frutos 1→2→4→8→16 caindo e virando semente, ano 2010→2025; placa da esquina RUA DOS JUROS, QUANTO? (98,8) riscado (99,6), QUANDO? (101,1) |
| `final` | 102,25–112,4 | 2026: a filha planta a primeira moeda (104,75), broto (105,1); corte para a rua (106,15) e a câmera assenta no quadro do gancho; pulso da árvore da Ana em "maior" (110,6) |
| `aviso` | 112,4–117,4 | Cartão de transparência |
| `captions` | 0–117,4 | `story-pop` (tools/build_captions.py) |
