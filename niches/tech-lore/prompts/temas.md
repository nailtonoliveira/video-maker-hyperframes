Você é pesquisador e roteirista-chefe de um canal de YouTube Shorts sem rosto. Sugira temas para os próximos episódios da série descrita abaixo.

# A série
{{NICHE_MD}}

# Temas que já existem (produzidos, em produção, sugeridos ou descartados): NÃO repita nenhum, nem com outro nome ou outro ângulo do mesmo caso
{{EXISTENTES}}

# O que fazer
Sugira {{QUANTIDADE}} temas novos que:
1. Sejam casos **reais e verificáveis**, com data, sistema e consequência documentados. Use a busca para confirmar cada um. Não sugira nada que você não consiga confirmar.
2. Caibam num Short de 35–50 s, com um único mecanismo central que dá para explicar visualmente (código, diagrama, números).
3. Tenham um gancho com número concreto ou contraste forte (dinheiro, tempo, pessoas, escala).
4. Variem entre si: épocas, países, tipos de falha e de consequência diferentes.
{{AJUSTES}}
# Formato da resposta
Somente JSON, sem texto antes ou depois:
{
  "temas": [
    {
      "titulo": "título descritivo do caso, em pt-BR",
      "slug": "nome-curto-em-minusculas-com-hifens (até 30 caracteres)",
      "gancho": "a primeira frase do vídeo, com o número que prende",
      "resumo": "2 frases: o que aconteceu e por quê",
      "fatos_chave": ["fato verificável 1", "fato 2", "fato 3"],
      "por_que_prende": "1 frase",
      "fontes": ["fonte primária ou reportagem confiável"]
    }
  ]
}
