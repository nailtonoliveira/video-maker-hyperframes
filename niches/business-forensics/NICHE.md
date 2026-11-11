# Nicho: Business Forensics — Impérios, Golpes e Falências Bilionárias

Shorts de investigação contábil e corporativa sobre impérios que subiram, fraudaram ou quebraram (Enron, Wirecard,
Theranos, Lehman Brothers, Barings, Boi Gordo, Madoff, FTX…). Narração sem rosto.
O mundo é uma **maquete 3D da Mesa da Perícia** (Three.js + `shared/motor-3d/`): numa sala de provas de mogno escuro sob
uma lâmpada de interrogatório, a empresa é uma **torre de blocos de ouro**, a fraude é um **andar oco** ou truque físico
dentro do livro-caixa, os agentes são **peças de tabuleiro sem esqueleto** (Magnata, Perita, Contador, Manada, Fiscal) e
o clímax é o **carimbo** (`FRAUDE`, `FALÊNCIA`, `ACUSADO`, `CONDENADO`) que derruba a torre.
Fonte da verdade da identidade do nicho (`docs/design-bibles/business-forensics-design-bible.md`): o que está aqui vale
para todo vídeo da série; o `template/` é a implementação disso e vai inteiro nos prompts do pipeline (`prompts/`).

## Formato
- YouTube Shorts / Reels / TikTok 1080 × 1920, 30 fps, 35–75 s (modelo: 52 s; a duração final vem de `voice.mp3`).
- **6 a 9 cenas**, conforme o número de manobras do caso, cada uma num `mundo` (`imperio`, `sala`, `livro` ou `pregao`):

  | Cena | Papel | Mundo padrão | O que a tela faz | Duração típica |
  | --- | --- | --- | --- | --- |
  | 1 | **Gancho: o número do colapso** | `imperio` | torre intacta com rachadura vermelha pulsando na base, Magnata em `celebrate` no topo, ficha pousada no quadro 0 (`US$ 74 BI → ZERO`) e medidor no pico com `▼` | 3–4 s |
  | 2 | **Ascensão** | `imperio` ou `pregao` | andares de ouro nascendo com `backOut`, Manada comprando em onda, setas de ouro (`createFlowArrow`) entrando na torre e medidor subindo em degraus | 6–8 s |
  | 3 … N−4 | **A Manobra** (1 cena por truque) | `livro` | dentro do livro-caixa (`(0, -200, 0)`): o Contador rabisca e o truque físico acontece sobre os números (`caixas`, `livro_duplo`, `piramide`, `bolha` ou `andar_oco`) | 6–10 s |
  | N−3 | **As Rachaduras** | `sala` | a Perita entra sob a lâmpada, varre com a luz UV, os andares ocos aparecem em violeta `#9b8cff` e o fio vermelho liga as provas | 7–9 s |
  | N−2 | **O Colapso (clímax)** | `imperio` | o Fiscal desce o carimbo (`slam` 3D + `#hud-carimbo` 2D + tremor + 0,6 s de silêncio musical), a torre desaba, as moedas estouram e o medidor despenca a zero | 8–10 s |
  | N−1 | **O Estrago** | `pregao` ou `sala` | consequência: pregão em queda (`queda(k)`), peões da Manada tombados (`ruina`), Magnata `derrotado` | 5–7 s |
  | N | **O Detalhe Absurdo + Loop** | `sala` → `imperio` | macro na etiqueta/documento mais irônico do caso, seguido de **rebobinagem** (`k` voltando a 0 em `p3io`) até casar com o quadro 0 | 4–5 s |

- Variação entre episódios: **o nome do caso, a forma do império (`torre | rede | piramide`), o truque físico, o texto do carimbo e a consequência**. O palco, a paleta, o elenco e o arco ficam.
- **Loop por rebobinagem:** nos últimos ~2,4 s toda função de queda recebe `k(t) = 1 − E.p3io(seg(t, LOOP − 2.4, LOOP − 0.2))`, o medidor volta ao pico, a ficha do gancho remonta em wipe e o último plano termina em `SH[0].p0 / SH[0].l0`. Tudo que pisca ou gira usa `loopPeriod(LOOP, ...)`.
- Legenda `label-tag` (etiquetas de papel `#f2e8d5`, palavra ativa em vermelho-lacre `#b3261e` / `#fff4e0`, até 3 palavras e 20 caracteres).

## Roteiro
- Frase 1 = gancho com o contraste numérico do colapso (valor de pico → zero/rombo e o tempo da queda). Sem saudação, sem "você sabia".
- Fatos verificáveis: empresa, ano, valor de mercado/rombo, mecanismo real da manobra contábil ou operacional e fonte.
- **Regra jurídica (P8):** use `CONDENADO` apenas quando houver condenação judicial transitada/registrada; caso contrário, use `ACUSADO`, `INVESTIGADO`, `FALÊNCIA`, `CALOTE` ou `PIRÂMIDE`.
- **Nomes e marcas (P7):** nomes reais de empresas e executivos aparecem **só como texto** (ficha, etiquetas, placa da torre). Nunca reproduza logotipos, cores corporativas ou mascotes reais.
- Cada manobra tem uma **metáfora física de 2 s** no mundo `livro` ou `sala`:
  - `caixas`: dívida/prejuízo engolido por caixas aninhadas (SPEs / empresas de fachada);
  - `andar_oco`: receita fictícia = andares da torre que parecem ouro maciço e ficam ocos sob luz UV;
  - `piramide`: peões da Manada empilhados sustentando o topo com dinheiro novo;
  - `bolha`: esfera facetada dourada que infla além da base real até estourar.
- Última frase termina em suspensão e, colada antes da primeira, forma uma única frase contínua.

## Visual
- **A Mesa da Perícia (`maquete`):** sólidos foscos com `flatShading` e aresta de 1 px em nanquim `#1c1214`. O motor (`assets/motor/`) dá palco, câmera, céu, pós e texto; o kit (`assets/kit/`) dá cores (`C`), Sala de Provas (`sala.js`), Torre e Moedas (`imperio.js`), Livro-Caixa (`livro.js`), Truques (`truques.js`), Provas (`provas.js`), Elenco (`elenco.js`) e Pregão (`exteriores.js`).
- **Paleta (`tema.json` → `C` em `assets/kit/cores.js`):**
  - `chao #120a0b`, `nanquim #1c1214`, `mogno #3b2428` (`ardosia`), `papel #f2e8d5` (`tinta`), `taupe #a3958a` (`secundaria`), `sepia #6b5b52`;
  - `ouro #e9b949` (`ok`) = dinheiro, valor, ascensão, blocos da torre (só material/HUD, nunca luz de cena);
  - `fraude #ff5a3c` (`alerta`) = rachadura, erro, queda, setas de saída;
  - `lacre #b3261e` + `creme #fff4e0` = carimbo do veredito e palavra falada na legenda;
  - `uv #9b8cff` (`destaque`) + `violeta-tinta #4c35b8` = Perita, luz UV, aresta de andar oco, evidências;
  - `morto #4a1512` = escombros após a queda. **Não existe verde na série.**
- **Elenco procedural (`assets/kit/elenco.js`):**
  - `makeMagnata`: terno trapezoidal em V `#2b1a1d`, gravata e auréola Torus ouro `#e9b949`, visor com expressões (`confiante`, `ganancioso`, `nervoso`, `pego`, `derrotado`), ações `idle`, `celebrate`, `point`, `panic`, `fall`;
  - `makePerita`: sobretudo em sino `#cbbd9f`, cabeça-lupa Torus `#9b8cff` com olho único e lanterna UV, ações `idle`, `scan`, `lean`, `point`, `nod`;
  - `makeContador`: pilha de 4 livros desalinhados + cabeça calculadora LCD `#e9b949` e lápis, ações `idle`, `scribble`, `nervous`, `hide`, `topple`;
  - `makeManada`: ≥ 12 peões marfim instanciados (corpo + casca `BackSide` `#1c1214`), estados `euforia`, `duvida`, `panico`, `ruina`;
  - `makeFiscal`: arquivo de aço `#3b2428` com 3 gavetas etiquetadas e braço-carimbo `#b3261e`, ações `idle`, `advance`, `raise`, `slam`, `drawer`.
- **Tipografia:** `Barlow Condensed` 800/900 (título da ficha 92 px, carimbo 2D 128 px, legenda 58 px) + `IBM Plex Mono` 700 (sobrelinha 30 px, medidor 64 px, selo de data 40 px e todo texto 3D `label`/`floorLabel` com `weight = 700`). Nunca abaixo de 28 px.
- **HUD 2D (`compositions/hud.html`):** sub-composição própria (`window.__timelines["hud"]`) com `#hud-ficha` (x 64–904, y 236–436, `clipPath` explícito em t = 0), `#hud-valor` (hodômetro em degraus via `tl.set`, x 64–600, y 456–572), `#hud-data` (x 640–904, y 456–572) e `#hud-carimbo` (centro 492, 900, slam sincronizado com o Fiscal e encolhimento para selo).
- **Zona segura comum (Shorts/Reels/TikTok):** texto crítico só em **x 64–920 e y 220–1500**; assunto 3D centrado em y 600–1290; legenda em x 96–896 com base em y 1450 (`bottom: 470`).
- **Câmera e pós:** fov 50, planos de 1,7–3,0 s cortados nas palavras-âncora, sempre em movimento (`hand 0.006`), alternando aberto/próximo (`ABERTO_IMPERIO`, `PLONGEE_MESA`, `CLOSE_ROSTO`, `MACRO_LIVRO`, `RASANTE_MANADA`, `CONTRA_PLONGEE`, `PERFIL_PERITA`). DOF (`ap` 0,8–1,5 aberto, 6–9 próximo), vinheta 0,55, granulação 0 sempre.
- **Proibido:** granulação/ruído por quadro, `Math.random`/`Date.now`/`rAF`, `createDioramaStage`/`createBlockAgent`/`makeBug`/`makeBoard`, verde em qualquer lugar, logotipos/marcas reais, `CONDENADO` sem condenação real, pares de cor com contraste < 4,5:1, editar `compositions/captions.html` à mão.

## Som
- Locução: voz única da série configurada em `niche.json` (~2,4 palavras/s).
- **Trilha procedural (`assets/episode/trilha.json` → `shared/trilha/trilha.py`):**
  - `ambiente.wav`: `zumbido` constante da lâmpada da sala + `alarme` no colapso, `ronco` no desabamento da torre e `vento` no pregão vazio;
  - `musica.wav`: tom `"re_menor"`, `drone` com pausa dramática de **0,6 s de silêncio logo após o carimbo**, `brilho` na ascensão, `pulso` (bpm 96) das rachaduras ao carimbo e `subida` antes do impacto;
  - `efeitos.wav`: `tique` (andares/degraus), `deslize` (manobra), `clique` (alfinetes), `baque` (carimbo, ganho 1.0), `estalo` (andares quebrando), `trava` (gaveta do Fiscal).
- **SFX (`assets/sfx/`):** só nos acertos que a trilha não cobre (`whoosh-short`, `pop`, `click`, `ping`, `whoosh`, `key-press`, `typing`, `error`, `impact-bass-1/2`, `glitch-1/2`, `riser`), pico 1 quadro (33 ms) após a imagem, zero SFX em `t = 0` e nos últimos 100 ms.
- Mix normalizado a **−14 LUFS** (`audio_lufs` em `niche.json`).

## Episódios
| Nº | Pasta | Tema | Estado |
| --- | --- | --- | --- |
