# SPEC — Knight Capital: a flag de código morto que queimou US$ 440 milhões em 45 minutos

GOAL:    o espectador sente a desproporção (1 servidor esquecido → US$ 440 mi) e, quando a última frase
         "Foi exatamente assim que..." emenda no "440 milhões" do frame 0, assiste de novo.
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps (YouTube Shorts)
TIME:    44.96 s x 30 = 1349 frames. Relógio = locução (assets/voice.mp3, timestamps de assets/voice.json).

LOOK:    identidade do nicho (../../NICHE.md → Visual). Diferenças deste episódio: a "janela de terminal"
         (borda 1 px cinza 45 %, barra de título 56 px com caminho em cinza 30 px, fundo #080a0f 92 %) é a
         peça de S2–S5; S1 fica direto sobre a grade. Atmosfera vermelha do bg (#bg-alert) de 28.72 a 41.99 s.
LAYOUT:  texto só em x 96–948 e y 200–1130; conteúdo da janela com 32 px de margem (x 128–916);
         legendas com base em y 1310; abaixo de 1330 só a grade. Tudo alinhado à esquerda.
         Título 124 px não cabe em uma linha (19 × 73 px = 1380 px) → 2 linhas "ERRO DE" / "440 MILHÕES" (y 220–473).
OBJECTS:
  S1  título 2 linhas #ff3366 · rótulo cinza "let prejuizo =" (y 500) + contador "-US$ 440.000.000" 64 px 800 (y 542)
      · linha de tempo y 640: "00:45:00" ciano 40 px + barra 636 × 12 px que esvazia (scaleX 1→0)
      · rack 2 × 4 de caixas SRV-01…SRV-08 em y 720–1020 (420 × 66 px, gap 12): nome 34 px 700 + status 30 px.
  S2  janela "knight@nyse-gw: ~/smars" · "DATE: 2012-08-01 // 09:30 EDT" ciano 36 px (y 280) + "// abertura do pregão"
      · caixa NODE (y 390–520): "NODE:" cinza 30 + "KNIGHT CAPITAL AMERICAS LLC" 700 40 px
      · bloco SMARS (y 560–740): "SMARS" 800 56 px, "[Smart Market Access Routing System]" cinza 30, ■ "STATUS: ACTIVE" menta
      · linha 1 px vertical (x 188, y 740→880) + 4 pulsos ciano 10 × 24 px · caixa "NYSE ORDER BOOK" (y 880–1000).
  S3  janela "smars/rlp_router.cpp" · calha de números 01–05 cinza · L01 "#define FLAG_RLP_MODE  0x08" sobre
      "// old: FLAG_POWER_PEG" (que desce para L02) · L03 "if (flags & FLAG_RLP_MODE) {" · caixa y 500–650 com
      cabeçalho (cinza "// legacy" + etiqueta ciano "[DEPRECATED SINCE 2003]" à direita) e "exec_PowerPeg(order);"
      · L05 "}" · bloco de diff "COMMIT 2005" (y 780–950) com "- if (cum_shares >= max_shares) break;" 32 px vermelho riscado.
  S4  janela "SRV-08 :: smars-prod" · "// SRV-08 · LEGACY BUILD" cinza · laço vermelho 3 linhas
      "SRV-08 -> while(FLAG_0x08) {" / "    route_PowerPeg();" / "}" (y 322–460)
      · contador "4.000.000 ORDENS" 800 76 px (y 484) · barra 20 px que enche + "154 AÇÕES DA NYSE" tinta 30 px
      · log de execuções (7 linhas 28 px, y 676–886) que rola em corte seco · "loss_rate =" cinza + caixa
      "-US$ 163.000/s" 800 92 px (y 952–1100; sem espaços em volta da barra para caber em 740 px) · flash branco 60 %.
  S5  janela "audit_report.log" · caixa de alerta (y 320–510): "SEC ENFORCEMENT //" 34 px 700, "MULTA: US$ 12.000.000"
      48 px 800, "Regra 15c3-5 · Market Access Rule" cinza 30 · barra vertical de valor de mercado 120 × 480 px
      (x 128, y 570–1050) em menta + "KNIGHT CAPITAL" / "VALOR DE MERCADO" / leitura "100%" → "0%" / "STATUS: INSOLVENTE"
      · no fim: título + rótulo + contador de S1 com a mesma marcação e as mesmas coordenadas.
MOTION:  entrada expo.out 0.35–0.5 s como "impressão" de terminal (clip-path abrindo da esquerda ou de cima, nunca
         fade+slide-up); saída de cena = clip-path varrendo para a esquerda em power3.in 0.25 s; acertos = tl.set de 0 ms;
         tremor determinístico = sequência fixa de x por frame (−10, 9, −8, 7, −6, 5, −4, 3, −2, 1, 0 px);
         piscar = tl.set de opacidade a cada 0.2 s; stagger de 0.067 s nas luzes do rack, 0.05 s nas letras do título.
         Título pousado fica parado. Log e contador avançam em degraus (tl.set por frame), nunca deslizando.
SHOTS:   (tempos absolutos, presos ao início da palavra em assets/voice.json)
  S1 0.00–8.82  host s1. Frame 0 (thumbnail) = título + "let prejuizo =" + "-US$ 440.000.000" já cravados.
     2.66 "em"         "00:45:00" + barra entram expo.out 0.35 (clip da esquerda); a barra esvazia linear até 8.57.
     5.22 "esqueceu"   rack entra expo.out 0.4 (clip de cima); 5.55 + n·0.067 as caixas 1–7 acendem em menta ("RLP OK").
     6.32 "um de 8"    SRV-08 corta seco para vermelho + "LEGACY BUILD" cinza + tremor (6.32–6.69); pisca até 8.57.
     8.57–8.82         saída power3.in 0.25 s (J-cut: "Em primeiro de" 8.10–8.82 ainda sobre o rack piscando).
  S2 8.82–16.76 host s2.
     8.82 "agosto"     corte seco: janela + "DATE: 2012-08-01 // 09:30 EDT" cravados.
     11.12 "Knight"    caixa NODE entra expo.out 0.35 (clip da esquerda).
     13.12 "o roteador" bloco SMARS entra expo.out 0.35 (clip de cima) com ■ STATUS: ACTIVE menta.
     15.06 "bolsa"     linha 1 px desenha (scaleY expo.out 0.35); 15.21 caixa NYSE entra; 15.40 pulsos ciano descem a linha.
     16.51–16.76       saída.
  S3 16.76–27.36 host s3.
     16.76 "Os"        janela do editor entra expo.out 0.4 (clip da esquerda) com "// old: FLAG_POWER_PEG" na L01.
     17.46 "reaproveitaram" "#define FLAG_RLP_MODE  0x08" varre por cima da L01 (expo.out 0.35); o comentário desce para L02.
     19.10 "ativava"   L03 "if (flags & FLAG_RLP_MODE) {" crava.
     19.74 "rotina"    caixa com "exec_PowerPeg(order);" + L05 "}" cravam; borda vermelha via tl.set.
     20.50 "Powerpeg"  tremor curto na caixa.
     21.68 "desativada" "[DEPRECATED SINCE 2003]" ciano crava à direita do cabeçalho da caixa.
     24.26 "sem trava" (Whisper: "centrava") bloco COMMIT 2005 entra expo.out 0.35 (clip de cima).
     25.06 "parada"    risco vermelho 3 px atravessa a linha removida (scaleX expo.out 0.35).
     25.88 "2005"      "2005" do cabeçalho do diff acerta (tl.set branco/escala 1.08 → ciano em 0.3 s).
     27.11–27.36       saída.
  S4 27.36–37.74 host s4.
     27.36 "O servidor" corte seco: janela + "// SRV-08 · LEGACY BUILD".
     28.72 "entrou"    laço vermelho crava, tremor (28.72–29.09), pisca 1 ↔ 0.4 a cada 0.2 s; log começa a rolar (1 linha / 2 frames);
                       atmosfera vermelha do bg entra (0.4 s).
     30.62 "4"         contador sobe em degraus por frame até "4.000.000 ORDENS" em 31.54; log acelera (1 linha / frame).
     31.90 "em 154"    barra enche 100 % expo.out 0.35 + "154 AÇÕES DA NYSE".
     34.06 "queimando" "loss_rate =" crava.
     35.88 "mil"       flash branco 60 % por 1 frame + caixa "-US$ 163.000/s" crava.
     37.49–37.74       saída.
  S5 37.74–44.96 host s5.
     37.74 "A falha"   janela "audit_report.log" entra expo.out 0.4 (clip de cima) com a barra de valor de mercado cheia.
     39.02 "multa"     caixa SEC ENFORCEMENT crava (tl.set).
     41.74 "destruiu"  barra despenca a zero power3.in 0.25; 41.99 "0%" + "STATUS: INSOLVENTE" cravam; bg vermelho corta; silêncio.
     43.44 "exatamente" saída power3.in 0.25; 43.69 título remonta letra a letra (0.05 s) até 44.64;
                       44.70 rótulo + contador cravam → último frame = frame 0 (grade em +60 px = 0).
SOUND:   SFX de assets/sfx, início = imagem + 1 frame − pico do arquivo (picos medidos: click .072, key-press .077,
         pop .119, whoosh-short .162, ping .323, glitch-3 .455, typing .455, error .739, glitch-1 .820,
         impact-bass-1 .073, impact-bass-2 .126, riser 3.036). Volumes 0.14–0.3 abaixo da voz (1.18).
         Riser sob "154 ações" com pico no flash (35.88). Nenhum SFX depois de 41.74 (corte total; silêncio pós-clímax).
         Sem música (a série ainda não tem fonte).
BANNED:  glow/neon, partículas decorativas, tudo centralizado, tudo entrando com fade+slide-up, título que flutua
         depois de pousar, cantoneiras/HUD decorativo, gradiente linear em tela cheia, contadores que deslizam suavemente
         (contagem é em degraus), cores fora da paleta do nicho.
QA:      0.0 (thumb = título + contador) · 3.2 (cronômetro) · 6.5 (SRV-08 vermelho) · 9.0 (DATE) · 15.5 (diagrama completo)
         · 20.0 (PowerPeg) · 25.5 (diff riscado) · 31.0 (contador) · 35.9 (flash) · 36.5 (-US$ 163.000/s)
         · 39.2 (SEC) · 42.1 (insolvente) · 44.93 (= frame 0).
