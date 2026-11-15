# SPEC · (exemplo do template: 3 cenas que mostram o padrão; reescreva para o episódio)

- 1080 × 1920, 30 fps, duração = voz + cartão final de 6 s. Tempos absolutos = tempos da narração (`assets/voice.json`).
- **Câmera perto, tela cheia:** cada cena num palco pronto do kit (`assets/kit/INDICE.md`); atores com `K.ator` (pés em y 1400).
- Metáfora física do episódio: (uma só, atravessa o vídeo; ex.: a árvore que cresce, a nota que encolhe).
- BANNED: metade de baixo vazia ou chão liso, fundo escuro, brilho/partículas, granulação, degradê (exceto céu), logotipo
  de banco/marca, desenho realista de cédula, texto < 28 px, texto na faixa da legenda (y 1150–1300).

| Cena (arquivo) | Palco | Tempo | O que a tela faz |
| --- | --- | --- | --- |
| `abertura` | rua | 0–12 | Ana e Bruno na calçada; placa O MESMO AUMENTO com contador até R$ 300 (0,4–1,5); carimbo TODO MÊS (3,2); Bruno levanta o braço (4,4); câmera chega na Ana (7) |
| `conversa` | cozinha | 12–30 | Balão SEPARO ANTES DE GASTAR (13,2); a lata aparece na bancada (16,4); calendário JAN 2018 → DEZ 2023 (18–21); Bruno fica triste e a câmera chega nele (22,5) |
| `revelacao` | tribunal | 30–79,94 | Juiz atrás da mesa; placa SEIS ANOS DEPOIS com contador até R$ 27.160 (31,6–33,2); carimbo COMPROVADO (33,6); martelo (34,2) |
| `aviso` | (cartão) | 79,94–85,94 | Cartão de transparência (linhas de `roteiro.json` → `cartao_final`) |
| `captions` | | 0–79,94 | `story-pop` (gerado; não editar) |
