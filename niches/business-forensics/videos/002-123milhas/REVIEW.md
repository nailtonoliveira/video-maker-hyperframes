# REVIEW — 002 · 123Milhas: o calote de R$ 2,3 bilhões nas passagens fantasma

Duração 59.77 s (1794 quadros) = locução. `npm run check`: **passou**, 0 erros; layout 0 problemas; motion 0; contraste
29/29 WCAG AA; craft 0. Avisos restantes: GL "GPU stall due to ReadPixels" (driver, sem efeito no quadro) e
`clip_media_fit` dos 3 `.wav` da trilha (placeholders de 1 s; a etapa `trilha` do pipeline os regenera a partir do
`assets/episode/trilha.json` antes do render).

Snapshots: `npx hyperframes snapshot --describe false --at …` (SwiftShader, sem GPU), conferidos um a um.

## O que cada snapshot mostra

| t (s) | Plano | O que se vê | Veredito |
| --- | --- | --- | --- |
| 0.00 | ABERTO_IMPERIO | ficha `CASO Nº 002 · 123MILHAS / R$ 2,3 BI → ZERO`, medidor `DÍVIDA DECLARADA R$ 2,3 BI ▼`, selo `AGO/2023`; torre-pirâmide de 8 andares com placa `123MILHAS`, Magnata `celebrate` (confiante), rachadura vermelha na base, Manada em euforia, pilha de moedas. Assunto em y ≈ 590–1430 | ok (thumb) |
| 3.30 | close base | rachadura pulsando em close na fachada; peões em primeiro plano desfocados; medidor `CREDORES` começando a contar | ok |
| 5.50 | CLOSE_ROSTO | Magnata com visor `nervoso`, placa da torre embaixo; medidor `700 MIL` | ok |
| 8.60 | PLONGEE_MESA | torre-pirâmide vista de cima, Manada na frente; selo disparando `27/AGO` | ok |
| 10.20 | RASANTE_MANADA | peões de marfim em varredura, telão do pregão ao fundo; ficha `ATO I · METADE DO PREÇO`, `JAN/2023` | ok |
| 12.50 | aberto no telão | telão `1,10` em alta, setas de ouro disparando, medidor `R$ 1,0 BI ▲` | ok |
| 15.50 | close | peões erguendo bilhetes de papel com selo ouro; `JUN/2023`, `R$ 2,0 BI` | ok |
| 17.90 | imperio aberto | andares brotando, setas de ouro, medidor no pico `R$ 2,3 BI`, `JUL/2023` | ok |
| 20.00 | MACRO_LIVRO | livro-caixa `LIVRO-CAIXA // PROMO`, `PACOTE PROMO .. PAGO` (sublinhado ouro), `BILHETE ...... NÃO` (riscado em lacre), `RESERVA PRÉVIA .. 0`; Contador ao lado; ficha `ATO II · BILHETES FANTASMA` | ok (página escura, texto legível) |
| 23.00 | livro 3/4 | `makePonziPyramid` com fileiras de peões em cada degrau | ok |
| 25.80 | livro close | moedas novas subindo da página pela base até o peão do topo; medidor `CREDORES` contando | ok |
| 28.00 | PERFIL_PERITA | Perita com lente UV, cone violeta sobre a pasta `SEM RESERVA`; selo `LUZ UV` | ok |
| 30.00 | sala aberto | 4 andares ocos translúcidos com aresta violeta; ficha `ATO III · PIRÂMIDE SEM LASTRO` | ok |
| 32.50 | plongée | etiqueta `TARIFAS EM ALTA`, fio vermelho com alfinetes da etiqueta à rachadura e à pasta; `TARIFAS AÉREAS EM ALTA ▲` | ok (fio fino, 1 px do kit) |
| 34.80 | contra-plongée | Manada em `duvida`, ocos violetas acima, fio subindo ao teto; `LASTRO ZERO ▼` | ok |
| 36.80 | CLOSE_ROSTO | Magnata `panic` (visor `pego`), alarme avermelhando a luz; `EMISSÕES PROMO SUSPENSAS`, `18/AGO/2023`, ficha `ATO IV · CALOTE EM 11 DIAS` | ok |
| **38.14** | CONTRA_PLONGEE | **carimbo**: braço-carimbo `CALOTE` do Fiscal na mesa (gaveta `CPI` visível), `#hud-carimbo CALOTE` no centro (y 810–1010), aberração cromática e tremor; silêncio do drone 38.14–38.74 no `trilha.json` | ok |
| 41.50 | imperio aberto | torre-pirâmide desabando (blocos indo a `morto`, arestas fraude), estouro de moedas, Manada tombando; `CRÉDITO DOS CLIENTES` caindo `▼ CALOTE`, `29/AGO/2023`, selo `CALOTE` encolhido sobre a ficha | ok |
| 44.00 | RASANTE_MANADA | peões tombados (`ruina`) no pregão, telão em queda ao fundo; ficha `ATO V · 700 MIL CREDORES` | ok |
| 46.20 | telão | gráfico despencando em vermelho, `0,00`, seta ▼ | ok |
| 48.20 | close Fiscal | gaveta `CPI` aberta com fichas de papel; `RELATÓRIO DA CPI · INDICIADOS`, `CPI CÂMARA` | ok |
| 51.50 | close | Magnata ajoelhado (`derrotado`, auréola partida) entre os escombros; selo `INVESTIGADO` piscando | ok |
| 54.00 | macro | etiqueta `VOUCHER PRÓPRIO` deitada na mesa; ficha `A IRONIA FINAL · PAGOS EM VOUCHER`, `REEMBOLSO SÓ VOUCHER` | ok |
| 56.30 | macro | decalque `SEM FUNDOS` prensado na etiqueta; medidor `DÍVIDA DECLARADA` subindo de volta (`R$ 1,0 BI`) | ok |
| 58.50 | rebobinagem | blocos e moedas voltando à torre, peões levantando; medidor no pico `R$ 2,3 BI`, selo `AGO/2023` | ok |
| **59.767** (último quadro) | = SH[0].p0 | idêntico ao quadro 0: mesma câmera, torre intacta, Magnata confiante, ficha `R$ 2,3 BI → ZERO`, medidor `R$ 2,3 BI ▼`, `AGO/2023`. Única diferença: a legenda `até que...` (gerada) | ok (loop) |

Zona segura: todo texto do HUD fica em x 64–904 / y 236–582 e o carimbo 2D em y 810–1010; legendas em y ≈ 1360–1450.

## O que foi ajustado durante a revisão

1. **Câmera perto demais dos peões** (pregão 10.2/15.5, livro 23/25.8, rasante 44): distâncias e alturas aumentadas para o
   assunto caber em 50–60 % da largura; bilhetes e setas de ouro afinados (`length 1.3`, `thickness 0.12`).
2. **Rachadura do quadro 0 escondida pela Manada**: Manada da sala recuada para z 3.3 e câmera do gancho mais alta (y 7.8);
   close da rachadura (3.3) passou a ser de cima dos peões.
3. **MACRO_LIVRO** (20.0) mais alto (y 18–21) para as 3 linhas e o Contador caberem no quadro.
4. **Carimbo 3D** baixo demais, por baixo das legendas (38.14): câmera recuada e mais baixa, decalque subiu para y ≈ 1300.
5. **Voucher escondido sob os peões tombados** (54.0): etiqueta movida para (−4.4, 3.6) e moedas espalhadas ocultas só nos
   dois macros do voucher; decalque `SEM FUNDOS` reduzido (0,55) sobre a borda da etiqueta.
6. **Poeira** grande demais nos closes do estrago: nuvem da sala 0.18 → 0.11 e só durante o desabamento/rebobinagem; nuvem do
   pregão 0.08 → 0.045.
7. **Magnata ajoelhado de cabeça baixa** (51.5): queda `0.42·k` e inclinação de 0.08 rad para o visor `derrotado` aparecer.
8. **HUD fora de ordem**: os trancos de escala do medidor eram `fromTo` e, com a agulha voltando, o número ficava preso em
   1,16× (visto em 23.0 s pedido depois de 56.3 s). Trocados por `set` + `to`; conferido de novo fora de ordem (23 → 20 → 30
   → 43 → 51 s), tudo igual ao seek em ordem.
9. **Tipografia**: `#valor-delta` 26 → 28 px (piso do nicho; aviso `text_below_floor`).
10. **Fonte das legendas** (erro do lint `font_family_without_font_face` em `captions.html`): `captions.json` passou a usar
    `var(--font-display)`, como o episódio 001, e `--font-display` ganhou o fallback `Oswald` empacotado; legendas regeneradas
    com `tools/build_captions.py` (sem editar o HTML à mão). Corrigido também o "ou vê da" do Whisper → `U V da`
    (`fixes_idx` 69/70).

## Fatos na tela (todos dos fatos do roteiro)
R$ 2,3 BI de dívida declarada · 700 MIL credores · 18/AGO/2023 (Promo suspensa) · 29/AGO/2023 (recuperação judicial) =
`CALOTE EM 11 DIAS` · Promo vendida sem reserva prévia · relatório da CPI → `INDICIADOS` / `INVESTIGADO` (P8: sem
`CONDENADO`) · reembolso só em voucher da própria agência. `123MILHAS` só como texto (P7: sem logotipo nem cores da marca).
Leituras qualitativas no medidor (`EM ALTA`, `LASTRO ZERO`, `SUSPENSAS`) não trazem números inventados.

## Pendências fora desta pasta
- Linha do episódio 002 na tabela de episódios de `niches/business-forensics/NICHE.md` (esta etapa só escreve na pasta do vídeo).
- Regenerar `assets/audio/*.wav` (etapa `trilha` do pipeline) antes do render.
