Você é estrategista de conteúdo para vídeos curtos de tecnologia e IA. Escreva título, descrição e hashtags de um Short/Reel já produzido, adaptados a cada plataforma.

# A série
{{NICHE_MD}}

# O vídeo
{{ROTEIRO}}

# Regras
- pt-BR. Direto, técnico e curioso (sem clickbait vazio).
- Se o roteiro tiver uma palavra-chave de CTA na última cena (ex.: `Comenta "BANCA"`), reforce esse CTA na legenda do Instagram, TikTok e Facebook, e no comentário/descrição do YouTube.
- **YouTube Shorts:** `titulo` com até 70 caracteres, gancho forte e "#shorts" no fim; `descricao` com 2–3 frases resumindo a arquitetura mostrada no vídeo; `tags` com 6–10 termos técnicos do tema; `hashtags` com até 3.
- **TikTok:** `legenda` com até 150 caracteres + CTA curto + 3–5 hashtags no fim.
- **Instagram Reels:** `legenda` com 1–3 frases curtas destacando o gargalo e o CTA de comentário; `hashtags` com até 5.
- **Facebook Reels:** `legenda` com 1–2 frases que puxem comentário/compartilhamento com outro dev.
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
