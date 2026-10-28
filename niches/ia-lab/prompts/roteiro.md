Atue como roteirista sênior e diretor criativo de vídeos curtos 3D de alta retenção (YouTube Shorts / Reels / TikTok). O vídeo é renderizado no HyperFrames usando nossa biblioteca de diorama 3D (`assets/kit3d.js`: bancada de madeira, agentes em blocos estilo Claude/dev, telas de código 3D, setas 3D de pressão/fluxo e HUD superior de papel rasgado com fita crepe + placar dinâmico).

# A série (identidade fixa: siga à risca, não reinvente)
{{NICHE_MD}}

# O episódio
{{TEMA}}

# Regras do roteiro
1. **Idioma:** pt-BR, falado, direto, frases curtas e ritmadas (zero enrolação acadêmica).
2. **Quantidade de cenas dinâmica (`N` cenas guiadas pelo tema):** o número de cenas **não é fixo**. Analise o tema e divida-o em quantas cenas forem necessárias (tipicamente entre 4 e 8 cenas) para que cada gargalo (*"Só que..."*) ou cada agente da banca tenha seu próprio momento claro:
   - **Cena 1:** Gancho forte + a primeira tentativa / configuração inicial.
   - **Cenas `2` até `N-2`:** Cada cena apresenta um gargalo real (*"Só que..."*) ou um especialista atuando, seguido da peça que resolve aquele ponto (*"Então..."*).
   - **Cena `N-1`:** O veredito / sistema completo rodando redondo (placar zerando erros ou batendo 100%).
   - **Cena `N`:** Payoff rápido + CTA direto (ex.: *"Comenta [PALAVRA] que eu te mando o prompt/arquitetura"* ou *"Manda pra um dev e segue o canal"*).
3. **Tamanho da locução:** ajuste o total de palavras à complexidade do tema (referência base: entre **{{PALAVRAS_MIN}} e {{PALAVRAS_MAX}} palavras**, podendo variar em ±25% se o tema exigir mais ou menos etapas). Não escreva tempos em segundos: eles vêm do áudio depois.
4. **Direção Visual (`visual`) e Âncoras (`ancoras`) prontas para o `kit3d.js`:**
   Em cada cena, especifique claramente:
   - **Faixa do topo (`#hud-banner-text`):** o texto curto em CAIXA ALTA (até 26 caracteres) que entra na faixa de fita crepe daquela cena.
   - **Placar (`#hud-score-card`):** qual é o rótulo da métrica e para qual valor/cor (`verde`, `vermelho`, `âmbar`) o número muda nas âncoras da cena (ex.: `BUGS VISTOS: 0`, `INVASÕES: 1`, `ALUCINAÇÕES: 9`, `ERROS: 0`).
   - **Ação 3D na bancada:** quais agentes (`coder`, `hacker`, `senior`, `tester`, `boss`, `user`), telas de código (`createCodeScreen`) e setas 3D (`createFlowArrow`) aparecem ou reagem (`type`, `panic`, `point`, `celebrate`, `stamp`).
5. **Âncoras de sincronia:** para cada cena, liste de 2 a 5 momentos em que algo muda na tela (troca de faixa, subida do placar, falha na tela 3D, entrada de agente, abertura do modal CTA). O `gatilho` deve ser um trecho **copiado exatamente da locução** daquela cena (2 a 5 palavras).
6. **Título na tela (`titulo_tela`):** frase curta de impacto em CAIXA ALTA (até 26 caracteres) que já começa estampada na faixa de fita crepe no frame 0 (thumbnail).
7. **Números na locução:** escreva números com algarismos ("5 agentes", "9 erros"). Eles viram texto por extenso na etapa de TTS e ficam em algarismos na legenda.
{{AJUSTES}}
# Formato da resposta
Somente JSON, sem texto antes ou depois:
{
  "titulo": "título do episódio",
  "titulo_tela": "FAIXA DO FRAME 0 (ATÉ 26 CHARS)",
  "resumo": "1–2 frases resumindo a evolução do vídeo",
  "cenas": [
    {
      "n": 1,
      "nome": "nome da etapa/cena (ex.: Tentativa Inicial / Gargalo 1 / O Hacker / Veredito / CTA)",
      "locucao": "texto falado da cena",
      "visual": "Faixa: '...' | Placar: '...' | 3D: descrição dos agentes, tela de código e setas na bancada",
      "ancoras": [
        {"gatilho": "trecho exato da locução", "visual": "ação exata no HUD (setBanner/setScore) ou no 3D (agente/tela/seta)"}
      ]
    }
  ],
  "loop": {
    "ultima_frase": "frase final (CTA)",
    "primeira_frase": "primeira frase do vídeo",
    "leitura_continua": "resumo do fechamento + gancho"
  },
  "fatos": [
    {"fato": "conceito ou mecanismo técnico real explicado", "fonte": "documentação ou referência", "confianca": "alta | média"}
  ]
}
