# REVIEW — O Golpe dos 3 Segundos (ia-lab 001)

**Estado:** pronto para render (não renderizado; nenhum servidor de preview rodando).
**Check:** `npm run check` → 0 erros. Layout 0 issues, Motion 0, Contrast 21/21 WCAG AA, Craft 0.
Avisos aceitos:
- `composition_file_too_large` (world.html ~600 linhas): o NICHE.md exige palco 3D + HUD no mesmo `world.html` para manter a sincronia, então ele fica num arquivo só.
- `console_warning` "GPU stall due to ReadPixels": aviso de desempenho do driver WebGL por software no check, sem efeito na imagem.
- Removi o `tl.set("#hud-watermark", {display:"none"}, 0)`, que não fazia nada (o CSS já esconde o watermark). `SHOW_WATERMARK`, `WATERMARK_TEXT` e `THEME = "amber"` continuam como estavam.

## Snapshots inspecionados (`snapshot --describe false`)
0, 3, 5, 8.5, 10.5, 12.5, 15.5, 20, 23, 25.5, 28.5, 31, 34, 35.3/35.6, 38.5, 39.5/39.6 s.

| t | O que se vê | OK |
| --- | --- | --- |
| 0.0 (thumb) | Faixa "O GOLPE DOS 3 SEGUNDOS", placar AMOSTRA 3s âmbar, droide VOCÊ com celular, monitor AUDIO_STORY.WAV com a onda | ✔ |
| 5.0 | VOCÊ ergue o celular (visor de gravação), tela verde com selo POSTADO | ✔ |
| 8.5 | IA DE VOZ entrou; a onda verde de 12 barras pulsa no fatiador | ✔ |
| 10.5 | Onda cortada em 3 blocos (ciano/âmbar/roxo) com os rótulos TOM / RESPIRO; CLONE 66% | ✔ |
| 12.5 | Seta âmbar sobe para o monitor; selo CLONE 100%; coder digitando | ✔ |
| 15.5 | Luz vermelha; GOLPISTA com `>_<`, tela WHATSAPP_FAMILIA com selo GOLPE; PERIGO 40% | ✔ |
| 20.0 | FAMÍLIA à esquerda, seta vermelha pulsando do golpista para ela, PIX URGENTE; PERIGO 90% | ✔ |
| 23 / 25.5 | Câmera fecha na FAMÍLIA em pânico `>_<`; tela BANCO_FAMILIA SOCORRO! → pisca com PIX ENVIADO; ERROS 1 | ✔ |
| 28.5 | Cadeado pousou no centro, golpista em pânico, seta cortada, luz volta ao âmbar | ✔ |
| 31.0 | Placa dourada SENHA: ****, LED do cadeado verde, selo SENHA ATIVA | ✔ |
| 34.0 | Faixa SEM A SENHA? DESLIGA, tela VERIFICADOR.PY | ✔ |
| 35.6 | Carimbo da FAMÍLIA `^_^`, golpista já ejetado, selo DESLIGOU | ✔ |
| 38.5 / 39.6 | GOLPE ANULADO, ERROS 0 verde, VOCÊ de volta comemorando, selo AMEAÇA: ZERO; enquadramento ≈ abertura (loop) | ✔ |

## Correções feitas durante a revisão
1. **Monitor sob o HUD nos planos fechados** (cenas 2, 4 e 5 da 1ª versão): calculei a projeção da câmera e mudei para uma câmera mais alta (y 4.4–5.8), monitor em y 2.45 e droides em z 1.0. A linha 01 do monitor agora fica abaixo do placar em todos os planos.
2. **"AMEAÇA: ZERO" escondido pelo droide VOCÊ** no final: VOCÊ passou para (1.45, 0, 1.05) e a câmera final recuou; o selo e a linha 04 ficam legíveis.
3. **Rótulo GOLPISTA cortado na borda direita** (28.5 s / 34 s): recuei e reenquadrei as câmeras das cenas 5 e 6.

## Pontos aceitos (de propósito)
- Na cena 4 (25.5 s) o golpista fica parcialmente fora do quadro: o plano é um close no desespero da família.
- As legendas `dark-pill` (y ≈ 1440–1540) passam por cima das bases dos droides e da base do cadeado; os rostos, os rótulos e o corpo do cadeado ficam livres.
- Os selos do monitor (POSTADO, CLONE 100%) encostam nos rótulos 3D dos droides, mas continuam legíveis.
- Sem CTA: a última frase é o loop "E você nunca esquece que…", então `#hud-cta-modal` fica em `opacity: 0`.

## Som
22 SFX no `index.html` (início = evento + 1 frame − pico medido do arquivo), em trilhas separadas por tipo, sem sobreposição na mesma trilha.
Os volumes seguem o NICHE.md (whoosh 0.28, pop 0.55, error 1.8, impact 0.24–0.3, click/key 0.4, ping 0.5).

## Para o pipeline
- O episódio ainda não está na tabela de episódios de `niches/ia-lab/NICHE.md`. Esta tarefa estava restrita à pasta do vídeo, então a linha precisa ser adicionada fora dela.
