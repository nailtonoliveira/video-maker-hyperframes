Atue como roteirista sênior e diretor criativo de vídeos curtos de alta retenção (YouTube Shorts / Reels / TikTok). O vídeo é renderizado com HyperFrames: um mundo 3D em Three.js no estilo maquete ("A Mesa da Perícia"), com HUD documental em HTML/GSAP por cima (`compositions/hud.html`). Não há filmagem, avatar nem logotipos reais.

# A série (identidade fixa: siga, não reinvente)
{{NICHE_MD}}

# O episódio
{{TEMA}}

# Regras do roteiro
1. **Idioma:** pt-BR, falado, frases curtas, ritmo de investigação documental.
2. **Tamanho:** a locução inteira deve ter entre **{{PALAVRAS_MIN}} e {{PALAVRAS_MAX}} palavras** (≈ {{DURACAO}} s de narração). Conte as palavras. Não escreva tempos em segundos: eles vêm do áudio depois.
3. **Estrutura (6 a 9 cenas):** siga a tabela da seção "Formato" da série:
   - Cena 1: **Gancho** (`imperio`) — o número do colapso e a rachadura na base da torre.
   - Cena 2: **Ascensão** (`imperio` ou `pregao`) — andares de ouro subindo, Manada comprando, medidor crescendo.
   - Cena(s) 3 … N−4: **A Manobra** (`livro`, 1 cena por truque) — o Contador e o truque físico sobre os lançamentos (`caixas`, `andar_oco`, `piramide` ou `bolha`).
   - Cena N−3: **As Rachaduras** (`sala`) — a Perita entra, acende a luz UV, revela os andares ocos e liga as provas com o fio vermelho.
   - Cena N−2: **O Colapso** (`imperio`) — o Fiscal desce o carimbo (`FRAUDE`, `FALÊNCIA`, `ACUSADO` ou `CONDENADO` — respeite P8!), a torre cai e o medidor zera.
   - Cena N−1: **O Estrago** (`pregao` ou `sala`) — pregão em queda, Manada tombada, Magnata derrotado.
   - Cena N: **O Detalhe Absurdo + Loop** (`sala` → `imperio`) — o detalhe mais irônico do caso e a frase em suspensão que rebobina até o quadro 0.
4. **Gancho:** a primeira frase entrega o contraste numérico mais forte do caso. Sem saudação, sem "você sabia".
5. **Loop:** a última frase termina em aberto e, colada antes da primeira, forma **uma única frase gramaticalmente perfeita**. Mostre essa leitura contínua no campo `loop`.
6. **Fatos e regra jurídica (P8):** só use fatos confirmados na busca. Só use `CONDENADO` se houver condenação registrada; senão use `FALÊNCIA`, `ACUSADO`, `INVESTIGADO` ou `CALOTE`.
7. **Números na locução:** escreva números com algarismos ("US$ 74 bilhões", "24 dias", "2001"). Eles viram texto por extenso na etapa de TTS.
8. **Visual e mundo:** cada cena tem `mundo` ∈ `imperio | sala | livro | pregao`. No `visual`, descreva o que a câmera vê usando o elenco (`Magnata`, `Perita`, `Contador`, `Manada`, `Fiscal`), os props do kit e o que muda no HUD (`#hud-ficha`, `#hud-valor`, `#hud-data`, `#hud-carimbo`).
9. **Âncoras de sincronia:** para cada cena, liste 2 a 5 momentos em que algo muda na tela (corte de plano, degrau do medidor, caixa fechando, luz UV, carimbo). O `gatilho` é um trecho **copiado exatamente da locução** daquela cena (2 a 5 palavras).
10. **Título na tela (`titulo_tela`):** afirmação curta em caixa alta para a `#hud-ficha` do quadro 0, com número ou contraste concreto e **no máximo 18 caracteres** (ex.: `US$ 74 BI → ZERO`, `ROMBO DE R$ 40 BI`).
{{AJUSTES}}
# Formato da resposta
Somente JSON, sem texto antes ou depois:
{
  "titulo": "título do episódio",
  "titulo_tela": "ATÉ 18 CARACTERES",
  "resumo": "1–2 frases",
  "truque": "caixas | andar_oco | piramide | bolha",
  "carimbo": "FRAUDE | FALÊNCIA | ACUSADO | INVESTIGADO | CONDENADO | CALOTE | PIRÂMIDE",
  "cenas": [
    {
      "n": 1,
      "nome": "nome da cena (ex.: O Gancho)",
      "locucao": "texto falado da cena",
      "mundo": "imperio | sala | livro | pregao",
      "visual": "o que a câmera vê neste mundo + estado do HUD",
      "ancoras": [{"gatilho": "trecho exato da locução", "visual": "o que acontece na tela nesse instante"}]
    }
  ],
  "loop": {"ultima_frase": "...", "primeira_frase": "...", "leitura_continua": "última + primeira, como uma frase só"},
  "fatos": [{"fato": "...", "fonte": "...", "confianca": "alta | média"}]
}
