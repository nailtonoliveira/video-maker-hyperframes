# REVIEW — 001 Lojas Americanas: O Rombo do Risco Sacado

Duração 55,55 s (1667 quadros) = locução. `LOOP` (scene.js) = `DUR` (world.html, hud.html) = `data-duration` (index.html).
`npm run check`: **passou, 0 erros**. Lint 0, Layout 0 problemas em 9 amostras, Motion 0, Contraste 27/27 AA, Craft 0.
Avisos restantes: 7 × `GPU stall due to ReadPixels` (driver do WebGL na captura, não é do projeto) e 3 × `clip_media_fit`
(`assets/audio/{ambiente,musica,efeitos}.wav` ainda são os placeholders de 1 s do template: a etapa `trilha` do
pipeline gera os 55,55 s a partir do `assets/episode/trilha.json` novo; nesta sessão não houve permissão para rodar
`shared/trilha/trilha.py`).

## Snapshots finais (`snapshot --describe false`, artefato e8e64ef4)

| t (s) | Plano | O que mostra | Conferência |
| --- | --- | --- | --- |
| 0.00 | 1 ABERTO_IMPERIO | thumb: ficha `CASO Nº 001 · AMERICANAS` / `ROMBO DE R$ 25 BI` pousada, medidor `R$ 25 BI ▼` (barra cheia), `JAN/2023`; torre AMERICANAS inteira, Magnata em celebrate logo abaixo do HUD, Manada em euforia, rachadura na base | título legível, tudo em x 64–904 |
| 3.0 | 2 PLONGEE_MESA | rachadura vermelha na base da fachada entre a torre e a Manada; selo `10 DIAS` | rachadura aparece por cima dos peões |
| 5.0 | 3 CLOSE | Magnata comemorando no topo, auréola de ouro, placa AMERICANAS | assunto em y ~700–1150 |
| 7.3 | 4 CONTRA_PLONGEE | toco da torre renascendo, ficha `ATO I · A ASCENSÃO / LUCROS RECORDES`, `2019-2022`, medidor `R$ 0 BI ▲ OCULTO` | — |
| 9.0 | 5 lateral | andares 4-5-6 nascendo em backOut (8,20 / 8,64 / 9,09), setas de ouro, medidor subindo | — |
| 10.7 | 6 aberto alto | torre completa, setas dos dois lados | — |
| 12.5 | 7 RASANTE_MANADA | onda de peões em euforia | — |
| 16.0 | 8 Contador | Contador rabiscando, `ATO II · A MANOBRA / RISCO SACADO`, `DÍVIDA COM BANCOS` subindo | — |
| 19.0 | 9 MACRO_LIVRO | linha `RISCO SACADO` marcada em lacre, 3 caixas abertas abaixo, documento + moedas dos bancos | floorLabel só em plano de cima |
| 21.5 | 10 lateral | caixas `FORNECEDOR 1/2` aninhando, `DÍVIDA NO BALANÇO` caindo a zero (`▼ SUMIU`) | — |
| 24.0 | 11 sala aberta | torre na sala, `ATO III · A PERÍCIA / CONTRATOS FORJADOS`, `10 DIAS` | — |
| 26.5 | 12 PERFIL_PERITA | Perita de perfil, lanterna UV acesa (25,56 "acendeu"), cone violeta até a torre, ocos ficando translúcidos | — |
| 28.5 | 13 cortiça | fio vermelho `CARTA BANCO → RISCO SACADO → VPC FORJADO`, `INCONSISTÊNCIA ▲ REVELADA` | quadro com exposição 1,6; ainda é o plano mais escuro e o fio do kit tem 1 px |
| 30.3 | 14 fachada | 4 andares ocos em violeta, rachadura subindo, luz de alarme | — |
| 32.5 | 15 Fiscal | arquivo com gaveta `2023` e braço `ACUSADO`, `ATO IV · O COLAPSO / FATO RELEVANTE`, `JAN/2023` | — |
| 34.64 | 16 carimbo | instante exato: braço na mesa, `#hud-carimbo` ACUSADO centrado (~y 900), decalque na mesa, tremor | mesma imagem pedida fora de ordem (PSNR 67 dB) |
| 34.8 | 16 | carimbo assentado, Manada começando o pânico | — |
| 37.0 | 17 plongée | torre trêmula, `PASSIVO TOTAL R$ 40 BI ▲ 2×`, selo ACUSADO no canto da ficha | selo fora do título |
| 39.6 | 18 aberto | desabamento: blocos voando, moedas estourando, `VIROU PÓ EM 10 DIAS` zerando | — |
| 41.8 | 19 pregão | telão em queda (25 → 0), `ATO V · O ESTRAGO / AÇÕES VIRARAM PÓ` | — |
| 44.0 | 20 RASANTE_MANADA | peões tombando no chão do pregão (`ruina`) | — |
| 47.0 | 21 CLOSE_ROSTO | Magnata derrotado, auréola partida, etiquetas `CVM: ACUSADO` e `PF: DISCLOSURE` no terno, `JUN/2024` | — |
| 49.6 | 22 pasta | pasta do caso aberta em `METAS BATIDAS` | — |
| 52.0 | 23 folha de bônus | `BÔNUS: MILIONÁRIOS` (carimbo PAGO), `METAS: BATIDAS`, `NÚMEROS: FALSOS`; medidor `R$ MILHÕES ▲ PAGO` | texto 3D em x 64–1000; o crítico está no HUD |
| 54.0 | 24 rebobinagem | blocos voltando para a torre, Magnata subindo, medidor remontando, carimbo 2D sumido | — |
| 55.50 / 55.533 | 24 fim | mesmo enquadramento, HUD e cena do quadro 0 | último quadro × quadro 0: só o bloco do Magnata difere (quique de 0,5 s = 1 quadro de movimento até 55,55 ≡ 0) |

## Ajustes feitos depois dos snapshots
1. **Quadro 0:** o Magnata ficava atrás do `#hud-ficha`/`#hud-valor`. Câmera recuada e mirando mais alto (`p0 [3.9, 6.4, 14.4]`, `l0 [0, 5.2, 0]`); o último plano herda esse enquadramento.
2. **Rachadura (plano 2):** os peões cobriam a base. Manada da sala passou de z 2,5 para 3,1 e a câmera subiu acima deles; rachadura no gancho de 0,15 para 0,3 × pulso (período `loopPeriod`).
3. **Poeira do desabamento:** a nuvem de decolagem do kit virava blocos claros gigantes até o fim do vídeo. Escala de 0,18 para 0,07 e visível só no desabamento e na rebobinagem; moedas espalhadas escondidas nos closes 45,84–53,15.
4. **Livro-caixa:** caixas para z 3,4 (não tapam mais as linhas); plano 10 virou travelling lateral `lin` da caixa 1 até FORNECEDORES.
5. **Perita:** virada para a torre (`rotation.y = 1.99`), câmera de perfil reposicionada e lanterna acendendo na palavra "acendeu" (25,56 s).
6. **Quadro de cortiça:** fio mais compacto, câmera por trás da torre e de frente para o quadro, exposição 1,6.
7. **Close do Magnata (plano 21):** levado para a beira esquerda da mesa, longe dos escombros, com as etiquetas da CVM/PF presas no terno por grupos-hospedeiros (o `show()` do kit reescreve a escala do grupo).
8. **Selo do carimbo:** o carimbo encolhido caía sobre o título da ficha; agora vai para o canto superior direito (`x 298, y −628`).
9. **HUD seekável:** o pulso do número (`fromTo({ scale: 1.16 })`, herdado do template) deixava o número em 1,16 quando o render voltava no tempo (34,64 s saía diferente conforme a ordem). Trocado por uma curva 1 → 1,16 → 1 (`pulsa()`). Depois disso, os quadros repetidos fora de ordem saem iguais (PSNR ≥ 67 dB, ∞ em 37,1 s e 54,5 s).
10. **Craft:** `#valor-delta` de 26 para 28 px (mínimo da série) e `JAN/2023` final remontado em 53,3 s (2,2 s na tela).
11. **Fonte de display:** Barlow Condensed não é fonte empacotada do HyperFrames e não há `.woff2` dela no workspace. O lint barrava `captions.html` e pulava layout/contraste. `captions.json` passou a usar `var(--font-display)` (legendas regeneradas com `tools/build_captions.py`, sem edição manual) e `--font-display` virou `"Barlow Condensed", "Oswald", sans-serif`. Sem Barlow instalada, HUD e legendas renderizam em **Oswald**. Para ter Barlow de verdade, falta o `.woff2` em `assets/fonts/` + `@font-face` no template do nicho.

## Fatos na tela
Só R$ 25 BI (título do roteiro), R$ 20 BI (inconsistências do fato relevante) e R$ 40 BI (passivo na recuperação
judicial). O hodômetro só interpola entre eles. Datas: JAN/2023 (fato relevante), 2019-2022, JUN/2024 (Operação
Disclosure), PRÉ-2023. Carimbo `ACUSADO` (P8: acusação da CVM/PF, sem condenação). Nomes só como texto (placa,
ficha, pasta); nenhum logotipo ou cor corporativa (P7).

## Pendências fora desta pasta
- Incluir o episódio 001 na tabela de episódios de `niches/business-forensics/NICHE.md` (fora da pasta: só leitura nesta tarefa).
- Template do nicho: `.woff2` da Barlow Condensed e o mesmo `fromTo` de escala no `hud.html` (o bug de busca fora de ordem vem de lá).
