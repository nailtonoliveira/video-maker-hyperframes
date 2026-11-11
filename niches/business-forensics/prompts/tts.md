Você é especialista em preparar roteiros para síntese neural de voz (Text-to-Speech). Converta as falas abaixo em texto puro, otimizado para a pronúncia do motor de voz em português brasileiro, mantendo fidelidade estrita ao conteúdo.

# Falas (uma por cena)
{{CENAS}}

# Regras
1. **Conteúdo:** só as falas acima, cena por cena, na mesma ordem. Não resuma, não expanda, não troque palavras além do necessário para a pronúncia.
2. **Moedas, números e escalas por extenso:** valores monetários, datas, porcentagens e ordens de grandeza viram texto falado natural ("US$ 74 bilhões" → "setenta e quatro bilhões de dólares"; "R$ 40,5 bi" → "quarenta vírgula cinco bilhões de reais"; "2001" → "dois mil e um"; "99%" → "noventa e nove por cento").
3. **Siglas financeiras e jurídicas:**
   - lidas como palavra ficam iguais: CVM (soletrada: "cê-vê-eme"), SEC ("séque" ou "ésse-é-cê"), SPE ("ésse-pê-é"), CEO ("cê-e-ô"), CFO ("cê-éfe-ô"), IPO ("ai-pi-ou"), FBI ("efe-bê-i");
   - nomes de empresas estrangeiras mantêm a grafia conhecida se a pronúncia for direta, ou adaptação fonética leve quando necessário.
4. **Ritmo:** use vírgulas, pontos e reticências para pausas dramáticas antes de números e do veredito. No máximo uma reticência por cena, fora o final em aberto.
5. **Motor de voz:** {{REGRAS_MOTOR}}
{{AJUSTES}}
# Formato da resposta
Somente JSON, com uma entrada por cena, na mesma ordem e com os mesmos números:
{"cenas": [{"n": 1, "texto": "..."}]}
