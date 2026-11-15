Atue como roteirista sênior de microcontos de alta retenção (Shorts / Reels / TikTok). O vídeo é uma ilustração 2D chapada desenhada em SVG por código (HyperFrames), com personagens fixos da série e texto legível dentro da arte. Não há filmagem, foto nem imagem realista.

# A série (identidade fixa: siga, não reinvente)
{{NICHE_MD}}

# O episódio
{{TEMA}}

# Os números reais do episódio (calculados com dados do Banco Central)
{{DADOS}}

# Formato
Formatos da série:
{{FORMATOS}}
Formato do episódio anterior: **{{FORMATO_ANTERIOR}}**. Use **outro** formato (o sugerido no tema, se houver e for diferente). Escreva o escolhido em `formato`, igual à lista.

# Regras do roteiro
1. **Idioma:** pt-BR falado, frases curtas (5–12 palavras), presente ou passado simples, humor seco. Uma ideia por frase.
2. **Tamanho:** entre **{{PALAVRAS_MIN}} e {{PALAVRAS_MAX}} palavras** de locução no total (≈ {{DURACAO}} s). Conte.
3. **Arco da série:** gancho com o resultado (frase 1) → regra do mundo ou premissa → personagem com um desejo → escolha → passagem do tempo → medição com os números reais → reviravolta → moral irônica de 1 linha → callback que recria o gancho (a última imagem é a primeira).
4. **Proibido:** "você sabia", saudação, "se inscreva", pedir comentário, promessa de ganho, nome de banco/corretora/produto, "invista em X", recomendação.
5. **Números (trava automática):** use **somente** números que estão no JSON acima (ou anos e meses do período). Pode arredondar na fala ("quarenta e um", "quase dez mil"), mas **nunca para o lado que exagera a moral** (se a moral é "perdeu valor", não arredonde a perda para cima). Declare **cada** valor dito em `numeros`, com o valor exato do JSON de onde saiu e o caminho dele (ex.: `cenarios[0].final_liquido_ir`). Anos e meses não entram em `numeros`. Se um número não está no JSON, **não use**.
5b. **Proporções (trava automática):** "o dobro", "triplicou", "a metade" só se forem verdade. Declare em `numeros` com `origem` **"<caminho> / <caminho>"** (ex.: `{"dito": "quase o dobro", "valor": 1.92, "origem": "cenarios[0].final_liquido_ir / cenarios[0].investido"}`); "quase o dobro" exige razão entre 1,76 e 2, "o dobro" entre 1,88 e 2,12. Se a razão não chega lá, diga o valor ("vinte e sete mil, contra vinte e um mil"). Nada de "fortuna", "rico", "milionário", "garantido", "sem risco" e nada de nome de produto (Tesouro, CDB, LCI, poupança como produto): diga "rendendo a Selic", "rendendo o CDI".
6. **Números na locução:** valores em reais por extenso como se fala ("duzentos reais", "quarenta e três mil"); anos com algarismos ("2010"); porcentagens por extenso ("dez por cento").
7. **Personagens:** use o elenco da série (Ana, Bruno, a filha, vizinho, vizinha, seu Joaquim, Lia) ou crie no máximo 1 novo, descrito em `visual`. Nada de rosto realista.
8. **Fala de personagem** entre aspas, curta. O narrador é sempre a mesma voz (a marca do canal).
9. **Visual:** em cada cena, descreva o palco (rua, quintal em corte, cozinha, mercado, ou um novo simples), os personagens, os objetos e o texto que aparece **dentro da arte** (placas, calendários, carimbos, visor), sem repetir a frase falada palavra por palavra. Uma metáfora física atravessa o vídeo (árvore que cresce, nota que encolhe…).
10. **Âncoras de sincronia:** 2 a 6 por cena. O `gatilho` é um trecho **copiado exatamente da locução** da cena (2 a 5 palavras), dito no instante em que o visual acontece. Evite gatilhos só com números.
11. **Título na tela:** `titulo_tela` com no máximo 4 palavras (vira a thumbnail).
12. **Cartão final:** escreva em `cartao_final` as 3–4 linhas de transparência: fonte e período, o que foi e o que não foi descontado (IR, inflação, taxas), "personagens fictícios", "conteúdo educativo, não é recomendação de investimento".
{{AJUSTES}}
# Formato da resposta
Somente JSON, sem texto antes ou depois:
{
  "titulo": "título do episódio",
  "titulo_tela": "ATÉ 4 PALAVRAS",
  "formato": "um formato da lista",
  "resumo": "1–2 frases",
  "cenas": [
    {
      "n": 1,
      "nome": "nome da cena (ex.: O Gancho)",
      "locucao": "texto falado da cena",
      "visual": "palco, personagens, objetos, texto dentro da arte",
      "ancoras": [{"gatilho": "trecho exato da locução", "visual": "o que acontece na tela nesse instante"}]
    }
  ],
  "numeros": [{"dito": "quarenta e um", "valor": 40.76, "origem": "cenarios[0].poder_de_compra_em_reais_do_inicio"}],
  "cartao_final": ["linha 1", "linha 2", "linha 3", "linha 4"],
  "loop": {"ultima_frase": "...", "primeira_frase": "...", "leitura_continua": "como a última imagem recria a primeira"},
  "fatos": [{"fato": "...", "fonte": "Banco Central SGS 433 / dados/calculo.py", "confianca": "alta"}]
}
