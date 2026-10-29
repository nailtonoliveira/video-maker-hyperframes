Atue como roteirista sênior e diretor criativo de vídeos curtos de alta retenção (YouTube Shorts / Reels / TikTok). O vídeo é renderizado com HyperFrames: um mundo 3D em Three.js no estilo maquete técnica (sólidos escuros com aresta fina), com títulos de terminal em HTML/GSAP por cima. Não há filmagem, avatar nem imagem realista.

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
8. **Visual e mundo:** cada cena acontece num `mundo`, conforme a tabela da seção "Formato" da série. No `visual`, descreva o que a câmera vê nesse mundo, com os objetos da série:
   - `exterior`: o lugar ou veículo real do caso, com escala e céu. Use um dos exteriores da série (foguete e base de lançamento, data center, sala de pregão, sala de radioterapia, avião, carro, sonda espacial); se nenhum for o lugar exato, escolha o mais próximo e diga qual. As cenas 1 e 5 ficam aqui (o quadro 0 é o mesmo do fim).
   - `mergulho`: a câmera vê a máquina por fora e entra nela por uma **porta física** (escotilha, painel, gaveta do rack, gabinete do servidor) até a placa. Diga qual é a porta.
   - `placa`: a placa de circuito por dentro: **a linha de código real** (curta, até ~40 caracteres, pode ser uma reconstrução fiel do tipo de erro), chips com o nome real do sistema, bits ou registradores com valores reais. O **bug** (besouro da série) anda pela linha e **para no ponto exato da falha**: diga qual trecho (a conversão, o campo, a flag).
   - Na cena 4, diga qual peça morre e qual é a consequência visível no lugar real (explosão, telão do pregão despencando em vermelho, giroflex e luz de alarme no data center, asa se soltando...).
   Nada de rosto, personagem, filmagem ou objeto genérico.
9. **Âncoras de sincronia:** para cada cena, liste 2 a 6 momentos em que algo muda na tela (corte de plano, título, porta abrindo, bug parando, peça morrendo). Os planos duram 1,7–3 s, então distribua as âncoras ao longo da cena. O `gatilho` é um trecho **copiado exatamente da locução** daquela cena (2 a 5 palavras), dito no instante em que o visual deve acontecer. Evite gatilhos só com números.
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
      "mundo": "exterior | mergulho | placa",
      "visual": "o que a câmera vê neste mundo",
      "ancoras": [{"gatilho": "trecho exato da locução", "visual": "o que acontece na tela nesse instante"}]
    }
  ],
  "loop": {"ultima_frase": "...", "primeira_frase": "...", "leitura_continua": "última + primeira, como uma frase só"},
  "fatos": [{"fato": "...", "fonte": "...", "confianca": "alta | média"}]
}
