# REVIEW: 003 Knight Capital (ERRO DE 440 MILHÕES)

Estado: `npm run check` **ok** (0 erros; 4 avisos mantidos de propósito, ver abaixo). Não renderizado: o pipeline
renderiza depois da aprovação. Nenhum servidor de preview foi aberto.

## Decisões criativas
- Modo sem paradas: um único storyline, o do roteiro aprovado (sem alternativas).
- O título de 124 px não cabe numa linha (≈1380 px), então vai em 2 linhas: "ERRO DE" / "440 MILHÕES", em y 220–473.
- S1 vai até **8.82 s**, não 8.10: o corte cai em "agosto", como pede a âncora da cena 2 ("cena anterior sai…
  e o terminal crava a DATE"). "Em primeiro de" (8.10–8.82) toca sobre o rack piscando (J-cut).
- S2–S5 usam uma janela de terminal fixa (x 96–948, y 200–1130). Entradas por clip-path (impressão vinda da
  esquerda ou de cima) ou por corte seco. Saídas varrem para a esquerda em power3.in 0.25 s. Nada entra com fade+slide-up.
- "-US$ 163.000 / s" virou "-US$ 163.000/s": com espaços, 92 px não cabe nos 740 px úteis da caixa.
- "rotina morta Power Peg" (âncora "?") = "rotina" 19.74 (caixa com borda vermelha) + tremor em "Powerpeg" 20.50.
  "sem trava de parada" (âncora "?") = 24.26, que o Whisper transcreveu como "centrava".
- A barra de valor de mercado mostra 100% → 0% (relativo), sem cifra de capitalização, para não inventar número.
- A atmosfera vermelha do bg (`#bg-alert`, previsto no template) vai de 28.72 a 41.99 e é cortada a seco junto
  com o colapso da barra. Daí em diante não há SFX (silêncio pós-clímax).
- O log de execuções da S4 é textura gerada por um LCG semeado (determinístico). Horários e IDs são ilustrativos.

## O que foi medido
- Picos dos SFX medidos por decodificação. Cada SFX começa em imagem + 1 frame − pico. Exceção: o impacto
  do frame 0, que bate ~1 frame depois (não dá para começar antes de 0 s).
- Loop: comparei os pixels do frame 0 com o de 44.933 s acima das legendas. Texto e título são idênticos. As
  únicas diferenças estão nas 8 linhas horizontais da grade, que no último frame estão a 59.96 px de 60
  (anti-aliasing subpixel); o frame seguinte é exatamente o frame 0. As legendas diferem
  ("que..." × "440 milhões de"), porque são geradas por script.
- Contraste: os números da calha do editor (S3) foram de 60 % para 80 % de opacidade e passam AA.
- Ligaduras do JetBrains Mono desligadas (`font-variant-ligatures: none`): `->` e `>=` viravam setas e ≥ no código.

## O que só foi olhado, não verificado
- **O som não foi ouvido**, só medido. Vale ouvir o error (6.32), o glitch-1 (28.72) e o riser + impacto (35.88).
- O flash de 60 % dura 1 frame (35.88). No contact sheet ele fica cinza na tela toda, como previsto. Conferir no celular.

## Notas
- P2 · t=27.36–28.72 · S4 · janela quase vazia por 1.36 s (só "// SRV-08 · LEGACY BUILD") → dá para cravar o
  laço já em "esquecido" (28.12) se a espera pesar · o resto fica igual.
- P2 · t=16.76–19.74 · S3 · linhas 04–05 da calha vazias por ~3 s antes da caixa · aceito (lê como arquivo aberto).
- P2 · t=6.32 · S1 · o tremor desloca a SRV-08 até 10 px além de x 948 por 1–2 frames · aceito.

## Plano mais fraco
S2 (8.82–11.12): terminal com só DATE e um comentário por 2.3 s. Com mais tempo, a linha "// abertura do pregão"
seria digitada letra a letra até "Knight".

## Avisos mantidos de propósito
- `line_unread` × 4 (título, rótulo e contador no fim): é a remontagem do loop. O vídeo termina no meio de
  "Foi exatamente assim que…" e a leitura continua no frame 0, onde o mesmo texto fica parado por 2.66 s+.

## Fora desta pasta (não tocado)
- A tabela de episódios do `../../NICHE.md` ainda não lista o 003: o passo de cenas do pipeline só trabalha
  dentro desta pasta.
