# Knight Capital: A flag de código morto que queimou US$ 440 milhões em 45 minutos

**Título na tela (frame 0):** ERRO DE 440 MILHÕES  
**Resumo:** Em 1º de agosto de 2012, um deploy manual incompleto em 1 de 8 servidores SMARS da Knight Capital ativou a rotina morta Power Peg em loop infinito, gerando 4 milhões de ordens em 154 ações e um prejuízo de US$ 440 milhões em 45 minutos.  
**Palavras:** 107 (≈ 47 s de narração)

## Cena 1 — O Gancho

**Locução:** 440 milhões de dólares evaporaram em 45 minutos porque um técnico esqueceu de atualizar 1 de 8 servidores.

**Visual:** Chão #080a0f com grade ortogonal de 1 px (60 px, mestras a 300 px). No topo esquerdo (x 96, y 220), título 'ERRO DE 440 MILHÕES' em JetBrains Mono 800 (124 px, tracking -2%, #ff3366) já pousado desde o frame 0. Abaixo, contador de prejuízo em vermelho (#ff3366), cronômetro de 45 minutos em ciano (#38bdf8) e matriz de 8 caixas de servidores (SRV-01 a SRV-08) entre y 680 e y 1020, onde 7 ficam em verde-menta (#00ff9d) e a 8ª pisca em vermelho (#ff3366).

**Âncoras:**
- "440 milhões de dólares" → Contador numérico abaixo do título crava '-US$ 440.000.000' via tl.set de 0 ms em vermelho (#ff3366, 64 px).
- "em 45 minutos" → Rótulo de tempo '00:45:00' em ciano (#38bdf8, 40 px) entra com expo.out (0.35 s) ao lado de uma barra horizontal que esvazia.
- "esqueceu de atualizar" → Bloco com 8 caixas de servidores (SRV-01 a SRV-08) entra em expo.out (0.4 s); as 7 primeiras acendem em verde-menta (#00ff9d) com stagger de 0.067 s.
- "1 de 8 servidores." → A caixa SRV-08 muda em corte seco (tl.set, 0 ms) para vermelho (#ff3366) com rótulo 'LEGACY BUILD' em cinza (#7d8590, 30 px) e sofre tremor determinístico horizontal.

## Cena 2 — O Contexto

**Locução:** Em 1º de agosto de 2012, a corretora Knight Capital Americas ligou o roteador SMARS na abertura da Bolsa de Nova York.

**Visual:** Janela de terminal limpa em x 96–948 e y 200–1130 exibindo cabeçalho de sessão com data e horário de abertura do mercado em ciano (#38bdf8), caixa de identificação da corretora em tinta #e6edf3 e diagrama em blocos conectando o roteador de ordens SMARS ao nó da NYSE.

**Âncoras:**
- "agosto de 2012," → Cena anterior sai em power3.in (0.25 s) e topo do terminal crava 'DATE: 2012-08-01 // 09:30 EDT' em ciano (#38bdf8, 36 px).
- "Knight Capital Americas" → Caixa superior exibe 'NODE: KNIGHT CAPITAL AMERICAS LLC' em JetBrains Mono 700 (40 px, #e6edf3) com entrada expo.out (0.35 s).
- "o roteador SMARS" → Bloco central 'SMARS [Smart Market Access Routing System]' aparece em y 560 com indicador 'STATUS: ACTIVE' em verde-menta (#00ff9d).
- "Bolsa de Nova York." → Linha ortogonal de 1 px conecta o bloco SMARS à caixa 'NYSE ORDER BOOK' em y 880, iniciando fluxo de pulsos retangulares em ciano (#38bdf8).

## Cena 3 — A Falha Técnica

**Locução:** Os engenheiros reaproveitaram uma flag que ativava a rotina morta Power Peg, desativada em 2003 e deixada sem trava de parada desde 2005.

**Visual:** Editor de código em JetBrains Mono (34 px) mostra a definição da flag reaproveitada para o programa RLP, a chamada legada 'PowerPeg()' marcada como código morto de 2003 e um painel de diff de 2005 destacando a remoção da verificação de limite de ações.

**Âncoras:**
- "reaproveitaram uma flag" → Linha de código '01  #define FLAG_RLP_MODE  0x08' entra em expo.out (0.35 s) sobrepondo o comentário cinza '// old: FLAG_POWER_PEG' (#7d8590).
- "rotina morta Power Peg," → Caixa de código em y 500 destaca 'exec_PowerPeg(order)' com borda vermelha (#ff3366) acionada em tl.set de 0 ms.
- "desativada em 2003" → Etiqueta '[DEPRECATED SINCE 2003]' aparece em ciano (#38bdf8, 30 px) alinhada à direita do cabeçalho da função.
- "sem trava de parada" → Bloco de diff 'COMMIT 2005' surge em y 780 mostrando a linha '- if (cum_shares >= max_shares) break;' riscada em vermelho (#ff3366).

## Cena 4 — O Colapso

**Locução:** O servidor esquecido entrou em loop infinito e disparou 4 milhões de ordens em 154 ações, queimando cerca de 163 mil dólares por segundo.

**Visual:** Painel de execução do servidor SRV-08 em colapso: laço 'while(true)' travado no topo, log de ordens de compra e venda rolando em corte seco, contadores gigantes de ordens e ações afetadas, e medidor de perda financeira por segundo em vermelho (#ff3366).

**Âncoras:**
- "entrou em loop infinito" → Topo do terminal mostra 'SRV-08 -> while(FLAG_0x08) { route_PowerPeg(); }' piscando em vermelho (#ff3366) com tremor determinístico.
- "4 milhões de ordens" → Contador principal salta em passos rápidos até '4.000.000 ORDENS' (JetBrains Mono 800, 76 px, #ff3366) sobre lista de execuções em alta velocidade.
- "em 154 ações," → Barra de progresso abaixo do contador preenche 100% em expo.out (0.35 s) com o rótulo '154 AÇÕES DA NYSE' em tinta #e6edf3.
- "mil dólares por segundo." → Flash branco seguro a 60% de opacidade por 1 frame revela a caixa '-US$ 163.000 / s' em vermelho (#ff3366, 92 px) via tl.set de 0 ms.

## Cena 5 — O Detalhe Absurdo

**Locução:** A falha ainda rendeu multa de 12 milhões de dólares da SEC e destruiu a empresa. Foi exatamente assim que

**Visual:** Relatório final de auditoria no terminal exibe a autuação da SEC pela regra 15c3-5 e uma barra vertical de capitalização da empresa que zera em colapso seco; no fim da frase, a tela limpa e reconstrói exatamente o frame 0 com a grade deslocada em 60 px.

**Âncoras:**
- "multa de 12 milhões" → Caixa de alerta 'SEC ENFORCEMENT // MULTA: US$ 12.000.000' entra em tl.set (0 ms) em y 320 com texto em vermelho (#ff3366).
- "destruiu a empresa." → Barra de valor de mercado da Knight Capital despenca a zero em power3.in (0.25 s) com rótulo 'STATUS: INSOLVENTE' (#7d8590) e corte total de SFX.
- "exatamente assim que" → Elementos saem em power3.in (0.25 s), a grade fecha o deslocamento exato de 60 px e o título 'ERRO DE 440 MILHÕES' remonta em x 96, y 220 idêntico ao frame 0.

## Loop

> Foi exatamente assim que 440 milhões de dólares evaporaram em 45 minutos porque um técnico esqueceu de atualizar 1 de 8 servidores.

## Fatos

- Em 1º de agosto de 2012, a corretora Knight Capital Americas LLC sofreu uma falha grave no sistema automatizado de roteamento de ordens SMARS (Smart Market Access Routing System) na abertura da NYSE. — *https://www.sec.gov/files/litigation/admin/2013/34-70694.pdf* (alta)
- Para participar do novo Retail Liquidity Program (RLP), engenheiros reaproveitaram uma flag que antes ativava a rotina legada Power Peg (desativada em 2003 e cuja verificação de contagem cumulativa de ações fora removida num refactor em 2005), e um técnico esqueceu de atualizar 1 dos 8 servidores SMARS. — *https://www.ciopages.com/articles/knight-capital-dead-code* (alta)
- Durante os primeiros 45 minutos de pregão, o servidor não atualizado executou mais de 4 milhões de ordens em 154 ações, gerando um prejuízo pré-impostos reportado inicialmente em US$ 440 milhões (e posteriormente atualizado para cerca de US$ 460 milhões). — *https://www.henricodolfing.ch/en/case-study-4-the-440-million-software-error-at-knight-capital/* (alta)
- Ritmo médio de perda estimado em cerca de US$ 163 mil por segundo (US$ 440 milhões divididos por 2.700 segundos / 45 minutos). — *https://en.wikipedia.org/wiki/Knight_Capital_Group* (média)
- Em outubro de 2013, a SEC aplicou uma multa de US$ 12 milhões à Knight Capital Americas LLC por violação da Market Access Rule (Regra 15c3-5). — *https://www.sec.gov/newsroom/press-releases/2013-222* (alta)
