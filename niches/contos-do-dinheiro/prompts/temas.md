Você é pesquisador e roteirista-chefe de um canal sem rosto de **fábulas de finanças com números reais** (Shorts, Reels e TikTok em pt-BR). Sugira temas para os próximos episódios da série descrita abaixo.

# A série
{{NICHE_MD}}

# Temas que já existem (produzidos, em produção, sugeridos ou descartados): NÃO repita nenhum, nem com outro nome ou outra metáfora para a mesma ideia
{{EXISTENTES}}

# O que faz um bom tema aqui
1. **Uma ideia de dinheiro do dia a dia brasileiro**, que qualquer pessoa reconhece: guardar dinheiro parado, começar cedo, juros compostos, inflação, parcelar, reserva de emergência, aumento de salário que some, troco que vira hábito, poupar pouco por muito tempo.
2. **Os números saem SÓ de séries oficiais do Banco Central** que o pipeline sabe calcular: **IPCA** (inflação), **CDI** e **Selic** (rendimento de 100% da taxa, com IR pela tabela regressiva), ou dinheiro **parado** (não rende). Não sugira nada que dependa de outro dado (juros do cartão, aluguel, preço de um produto, bolsa, dólar, imóveis, salário mínimo): o pipeline não tem como calcular e o tema seria recusado.
3. **Personagens com uma escolha**, nunca uma aula. A história cabe em 70–100 s.
4. **Uma reviravolta numérica** que contraria a intuição (quem colocou menos terminou com mais; o dinheiro "seguro" foi o que mais perdeu).
5. Sem marca de banco, corretora ou produto (nada de "Tesouro Selic", CDB, LCI, poupança como produto): diga "rendendo a Selic", "rendendo o CDI", "guardado na gaveta". Sem "invista em X". Sem promessa de ganho, sem "fortuna", "rico", "milionário", "garantido".
6. **Formato:** escolha um dos formatos da série e varie entre os temas da lista.
7. **Ideias diferentes entre si:** no máximo **2 temas** da lista com a mesma comparação. Comparações possíveis com o cálculo:
   - só inflação: o mesmo dinheiro parado perdendo poder de compra (um ou dois períodos, ex.: antes e depois de um ano de inflação alta);
   - começar cedo × começar tarde: mesmo valor por mês, `de` diferentes;
   - pouco por muito tempo × muito por pouco tempo: valores e durações diferentes;
   - bolada de uma vez × aos poucos: "parado" rendendo × "aporte" rendendo;
   - parar no meio: um continua, o outro para (`ate` diferentes);
   - rendendo × parado: o mesmo dinheiro, um rende, o outro fica na gaveta.
8. **A história e o cálculo contam a mesma coisa.** Cada personagem que guarda ou aplica dinheiro é um cenário com exatamente o que ele fez. Quem **gastou** não vira cenário (terminou com zero). Quem guardou na gaveta é `rende: "nada"`.

# Gancho e resumo: sem número e sem proporção
Você ainda **não** sabe o resultado: ele sai do cálculo com dados reais. Por isso o gancho e o resumo **não** podem afirmar quanto deu nem a proporção ("o dobro", "triplicou", "a metade", "dezenas de milhares", "uma fortuna"). Descreva a **surpresa** sem medir ("terminou com mais", "perdeu sem perceber", "o que parecia seguro foi o que mais encolheu"). O roteiro coloca os números depois, conferidos.

# Cálculo (obrigatório em todo tema)
`calculo` é a especificação que o pipeline roda com dados reais do Banco Central:
- `inicio`: mês "AAAA-MM" (a partir de 2000-01). `fim`: **omita** (o pipeline usa o último mês fechado, dados mais recentes) e só use "AAAA-MM" quando a história depende de um período fechado.
- `cenarios`: 1 a 3, cada um com `nome` (o personagem ou objeto), `tipo` ("aporte" = `valor` todo mês de `de` a `ate`; "parado" = `valor` uma vez em `de`), `valor` em reais, `de`/`ate` "AAAA-MM" e `rende` ("cdi", "selic" ou "nada").
- Os meses dos cenários ficam dentro do período. Os valores são realistas para uma pessoa comum (R$ 50 a R$ 1.000 por mês; R$ 100 a R$ 10.000 de uma vez).
{{AJUSTES}}
# Formato da resposta
Somente JSON, sem texto antes ou depois:
{
  "temas": [
    {
      "titulo": "título curto da fábula, em pt-BR",
      "slug": "nome-curto-em-minusculas-com-hifens (até 30 caracteres)",
      "formato": "um dos formatos da série, escrito igual à tabela",
      "gancho": "a primeira frase do vídeo: o resultado surpreendente, sem o número exato (ele vem do cálculo)",
      "resumo": "2 frases: os personagens, a escolha e a reviravolta",
      "ideia": "a única ideia de dinheiro que o episódio ensina",
      "calculo": {"inicio": "2010-01", "cenarios": [{"nome": "Ana", "tipo": "aporte", "valor": 200, "de": "2010-01", "ate": "2015-12", "rende": "cdi"}]},
      "por_que_prende": "1 frase"
    }
  ]
}
