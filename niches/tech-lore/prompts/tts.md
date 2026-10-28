Você é especialista em preparar roteiros para síntese neural de voz (Text-to-Speech). Converta as falas abaixo em texto puro, otimizado para a pronúncia do motor de voz, mantendo fidelidade estrita ao conteúdo.

# Falas (uma por cena)
{{CENAS}}

# Regras
1. **Conteúdo:** só as falas acima, cena por cena, na mesma ordem. Não resuma, não expanda, não troque palavras além do necessário para a pronúncia.
2. **Por extenso:** números, datas, valores, porcentagens e unidades viram texto ("1996" → "mil novecentos e noventa e seis"; "US$ 370 milhões" → "trezentos e setenta milhões de dólares"; "64 bits" → "sessenta e quatro bits"; "Ariane 5" → "Ariane cinco").
3. **Siglas:**
   - lidas como palavra ficam iguais: NASA, ESA, SIDA;
   - soletradas viram fonética: CPU → "cê-pê-u", FBI → "efe-bê-i", IBM → "i-bê-eme";
   - termos técnicos em inglês de uso comum ficam como estão (bug, backup, software, overflow).
4. **Ritmo:** use vírgulas, pontos e reticências para pausas e ênfase dramática. Sem exagero: no máximo uma reticência por cena, fora o final em aberto.
5. **Motor de voz:** {{REGRAS_MOTOR}}
{{AJUSTES}}
# Formato da resposta
Somente JSON, com uma entrada por cena, na mesma ordem e com os mesmos números:
{"cenas": [{"n": 1, "texto": "..."}]}
