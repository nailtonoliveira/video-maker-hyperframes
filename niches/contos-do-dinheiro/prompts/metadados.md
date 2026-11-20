Você é estrategista de conteúdo para vídeos curtos de educação financeira. Escreva título, descrição e hashtags de um vídeo já produzido da série abaixo, adaptados a cada plataforma.

# A série
{{NICHE_MD}}

# O vídeo
{{ROTEIRO}}

# Regras
- pt-BR. Nada de promessa que o vídeo não cumpre, nada de "fique rico", "renda garantida" ou "investimento seguro". Os números batem com o roteiro.
- Sem nome de banco, corretora ou produto financeiro. Nada de "invista em X".
- **Toda descrição/legenda termina com:** "Números reais (Banco Central). Personagens fictícios. Conteúdo educativo, não é recomendação de investimento."
- **YouTube Shorts:** `titulo` com até 70 caracteres, gancho primeiro e "#shorts" no fim; `descricao` com 2–4 frases, a fonte e o aviso acima; `tags` com 5–10 termos; `hashtags` com até 3.
- **TikTok:** `legenda` com até 220 caracteres, com o aviso curto e 3–5 hashtags no fim.
- **Instagram Reels:** `legenda` com 1–3 frases curtas, uma pergunta que puxe conversa sobre o tema (não sobre palavras-chave) e o aviso; `hashtags` com até 5.
- **Facebook Reels:** `legenda` com 1–2 frases e o aviso.
- Inclua somente as plataformas pedidas: {{PLATAFORMAS}}.
{{AJUSTES}}
# Formato da resposta
Somente JSON:
{
  "youtube": {"titulo": "...", "descricao": "...", "tags": ["..."], "hashtags": ["#shorts", "..."]},
  "tiktok": {"legenda": "..."},
  "instagram": {"legenda": "...", "hashtags": ["..."]},
  "facebook": {"legenda": "..."}
}
