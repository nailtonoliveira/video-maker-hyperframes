Atue como roteirista sênior e diretor criativo de vídeos curtos de alta retenção (YouTube Shorts / Reels / TikTok). O vídeo é renderizado com HyperFrames: motion design feito com HTML, CSS e GSAP. Não há filmagem, avatar nem imagem realista.

# A série (identidade fixa: siga, não reinvente)
{{NICHE_MD}}

# O episódio
{{TEMA}}

# Regras do roteiro
1. **Idioma:** pt-BR, falado, frases curtas.
2. **Tamanho:** a locução inteira deve ter entre **{{PALAVRAS_MIN}} e {{PALAVRAS_MAX}} palavras** (≈ {{DURACAO}} s de narração). Conte as palavras. Não escreva tempos em segundos: eles vêm do áudio depois.
3. **Estrutura:** siga as cenas e a função de cada uma descritas na seção "Formato" da série.
4. **Gancho:** a primeira frase entrega o número ou contraste mais forte do caso. Sem saudação, sem "você sabia".
5. **Loop:** a última frase termina em aberto e, colada antes da primeira, forma **uma única frase gramaticalmente perfeita**. Mostre essa leitura contínua no campo `loop`.
6. **Fatos:** só use fatos que você confirmou na busca. Liste cada fato usado, com a fonte. Se um número é estimativa, diga isso na locução ("cerca de") e marque confiança "média".
7. **Números na locução:** escreva números com algarismos ("370 milhões", "1996"). Eles viram texto por extenso numa etapa seguinte; os algarismos ficam assim na legenda.
8. **Visual:** descreva o que aparece na tela usando os objetos da identidade da série (código, terminal, contadores, diagramas, caixas, barras). Nada de filmagem realista.
9. **Âncoras de sincronia:** para cada cena, liste 2 a 6 momentos em que algo muda na tela. O `gatilho` é um trecho **copiado exatamente da locução** daquela cena (2 a 5 palavras), dito no instante em que o visual deve acontecer. Evite gatilhos só com números.
10. **Título na tela:** `titulo_tela` é a frase de impacto que aparece já no frame 0 (vira a thumbnail), com no máximo 4 palavras.
{{AJUSTES}}
# Formato da resposta
Somente JSON, sem texto antes ou depois:
{
  "titulo": "título do episódio",
  "titulo_tela": "ATÉ 4 PALAVRAS",
  "resumo": "1–2 frases",
  "cenas": [
    {
      "n": 1,
      "nome": "nome da cena (ex.: O Gancho)",
      "locucao": "texto falado da cena",
      "visual": "o que a tela mostra nesta cena",
      "ancoras": [{"gatilho": "trecho exato da locução", "visual": "o que acontece na tela nesse instante"}]
    }
  ],
  "loop": {"ultima_frase": "...", "primeira_frase": "...", "leitura_continua": "última + primeira, como uma frase só"},
  "fatos": [{"fato": "...", "fonte": "...", "confianca": "alta | média"}]
}
