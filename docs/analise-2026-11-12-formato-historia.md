# Análise: por que os vídeos atuais rendem menos que as referências (12/11/2026)

Comparação de 3 renders do repo (`business-forensics/002-123milhas`, `tech-lore/004-apagao-2003`, `ia-lab/001`)
com os Reels de referência (@historiasdertr, @imagina_se_ia, @comoconstroi).

## O que as referências fazem e os nossos não
| | Referências | Nossos vídeos |
| --- | --- | --- |
| **Narrativa** | História com personagem, desejo, virada e moral; "regra do mundo" no 1º segundo | Documentário/perícia: fatos em sequência, sem protagonista |
| **Emoção** | Rostos expressivos, gente comum (mãe, filha, vizinho) | Peças de tabuleiro e máquinas, sem rosto |
| **Leitura da imagem** | Claro, saturado, 1 assunto grande no centro | Escuro (mogno, cinza), muitos elementos pequenos, DOF e vinheta |
| **Texto na tela** | Só a legenda grande + texto *dentro* da arte (placas, calendários) | Ficha + medidor + selo + etiquetas + legenda competindo |
| **Legenda** | 1–3 palavras, enormes, contorno grosso, no meio da tela | Etiquetas pequenas (58 px) no rodapé |
| **Duração** | 90–165 s (história completa) | 40–60 s (pouco tempo para criar vínculo) |
| **Custo por episódio** | Mesmo palco e elenco reaproveitados | Motor 3D + cena nova escrita do zero pelo `claude -p` a cada vídeo |

## O que foi feito nesta rodada
1. **Nicho novo `niches/contos-do-dinheiro/`** (nicho 01, finanças em formato de história): `NICHE.md` com arco, rotação
   de 5 formatos, regras de fatos e marca; `REVISAO.md` (checklist obrigatório); `niche.json` com voz única; `template/`.
2. **Kit 2D reutilizável** `template/assets/kit.js`: rua, corte do quintal, casas, árvores com frutos-moeda, elenco fixo
   (Ana, Bruno, filha, vizinhos) com bocas e braços animáveis, placas, calendário, balões, contadores em R$.
3. **Estilo de legenda `story-pop`** em `tools/build_captions.py` (palavra entra quando é dita, números e palavras-chave em
   ouro, contorno grosso) + regra que nunca separa número da unidade ("10 | mil") em qualquer estilo.
4. **Piloto `videos/001-arvore-de-juros`** com dados reais do Banco Central (`dados/cdi.json`, `dados/calculo.py`).

## Recomendações para o pipeline (ainda não feitas)
- `prompts/roteiro.md` do nicho novo: pedir o arco de fábula (gancho com resultado → regra → personagem → virada → moral →
  callback), a tabela de fatos e o `calculo.py`; proibir números sem script.
- Etapa nova **"dados"** antes do roteiro: baixar séries do BCB/IBGE (SGS, SIDRA) e rodar o cálculo; o roteiro só usa o que sair dali.
- Etapa **"revisão"** bloqueante depois de `render`: o pipeline só gera `publicar/` quando o `REVIEW.md` tiver os itens 1–3 marcados.
- `catalogo.json`: guardar o **formato** de cada episódio e recusar o mesmo formato duas vezes seguidas.
- Para os nichos antigos: clarear a paleta, tirar o HUD de 4 blocos (deixar 1 número por cena), legenda maior no meio da
  tela e um protagonista com rosto que atravesse o episódio.
