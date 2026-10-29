# Nicho: IA Lab — Como a IA Funciona por Dentro (Em 3D, Sem Jargão)

Shorts sobre como a Inteligência Artificial (ChatGPT, Claude, agentes, prompts e automações) funciona por dentro — e por que o jeito que todo mundo usa dá errado. Feito para **prender qualquer pessoa (mesmo quem é leigo ou está começando na IA)** usando metáforas físicas simples, zero "sopa de letrinhas" técnica e tudo encenado em **diorama 3D WebGL (Three.js + `assets/kit3d.js`)** dentro de uma **Oficina de Grafite & Âmbar Quente (`amber`)** (bancada cinza-chumbo fosca + fundo de concreto/grafite escuro neutro com linhas e luzes em âmbar-ouro) com **Robôs Cápsula / Droides Expressivos** (visor digital de LED com expressões `●_●`, `>_<`, `^_^`), monitores industriais, setas de fluxo 3D e **HUD 2D de Placa Metálica Industrial (chapa escura com parafusos e LED de status) + placar dinâmico**.

Fonte da verdade da identidade do nicho: o que está aqui vale para todo vídeo da série; o `template/` é a implementação disso e é copiado para cada vídeo novo. Este arquivo também vai inteiro dentro dos prompts do pipeline (`prompts/`), então o que estiver aqui guia temas, roteiro, metadados e cenas. Voz, modelos de IA e aprovações ficam em `niche.json`.

## Formato
- YouTube Shorts / Reels / TikTok `1080 × 1920`, `30 fps`, duração dinâmica conforme a complexidade do tema (`35–75 s`; a duração final é a da locução).
- **Quantidade de cenas dinâmica (`N` cenas guiadas pelo tema):** o número de cenas nunca é fixo; é determinado por quantos problemas/etapas ou bonecos especialistas o vídeo exige:
  1. **Cena 1 (Gancho + O Jeito Comum):** apresenta uma situação que todo mundo que usa IA já viveu e o jeito óbvio que as pessoas tentam fazer.
  2. **Cenas Intermediárias (`Cena 2` até `Cena N-2` — Loop *"Só que... Então..."* ou Banca de Especialistas):** cada cena mostra **um problema real de forma física e óbvia** (*"Só que..."* → o boneco se confunde, a folha rasga, a senha vaza, o placar sobe no vermelho) seguido da **solução simples e visual** (*"Então você coloca..."* → entra outro boneco com uma função clara, uma regra ou um filtro).
  3. **Cena `N-1` (Como Funciona / A Solução na Prática):** os bonecos especialistas ou a nova regra entrando em ação e resolvendo os gargalos um a um.
  4. **Cena `N` (O Veredito / Fechamento em Loop — últimos 3–4 s):** a bancada inteira funcionando redonda, zerando os erros no placar (`ERROS: 9 → 0`) e fechando com uma conclusão forte que se conecta com a primeira frase do vídeo (loop invisível). **Por padrão, NÃO peça para o público comentar palavras aleatórias no final**; só inclua chamada do tipo *"Comente X que eu te mando Y"* se o episódio especificar explicitamente um `CTA obrigatório` via flag `--cta`.
- **Legenda queimada estilo Pílula Dark Glass (`dark-pill`):** grupos de até 3 palavras em `bottom: 380px`, pílula escura `#141417` com borda metálica `#475569`, texto branco `#f8fafc` e palavra falada no instante atual saltando em pílula âmbar-ouro `#fbbf24` com texto `#141414`.
- Todo evento visual (troca da placa metálica superior, incremento do placar, entrada de droide/seta 3D, corte de câmera) preso ao início da palavra correspondente na transcrição (`assets/voice.json`).

## Roteiro (Regra de Ouro: Zero Jargão / Acessível para Leigos)
- **Qualquer pessoa precisa entender em 2 segundos:** fale como no vídeo da `clubedasskills` e do `comoconstroi` — vocabulário de conversa do dia a dia.
- **PROIBIDO usar siglas ou jargões pesados de engenharia** na locução, nos títulos ou no HUD (`BM25`, `AST`, `JSON-RPC`, `KV Cache`, `HNSW`, `Cross-Encoder`, `Embeddings`, `Idempotência`, `Latência P99`).
- **Traduza tudo em papéis humanos ou objetos físicos na mesa:**
  - Em vez de *"viés de confirmação na mesma janela de contexto"* → diga *"quem escreveu acha que tá tudo certo e não vê o próprio erro"*.
  - Em vez de *"chunking semântico no RAG"* → diga *"a IA corta o seu PDF em tirinhas e perde o título da página"*.
  - Em vez de *"testes de borda e vulnerabilidade SAST"* → diga *"o usuário confuso que clica em tudo errado até quebrar, e o hacker que acha a senha esquecida"*.
- **Código na tela 3D é sempre ilustrativo e em português simples:** máximo 3–4 linhas curtas que até quem não programa entende ao bater o olho (ex.: `SENHA = "123"`, `se preco == 0:`, `apagar_tudo()`).
- **Fechamento sem CTA forçado:** a última frase fecha o raciocínio com impacto (e faz ponte de loop com o gancho inicial). Nunca invente palavras para o público comentar (*"Comenta X"*), a menos que o comando do pipeline tenha passado `--cta "..."`.

## Visual (Oficina Grafite & Âmbar 3D + Droides Cápsula + HUD Placa Metálica)
- **Arquitetura de Composição:**
  - `compositions/world.html` concentra **tanto o palco 3D (`<canvas id="gl">`) quanto o HUD 2D superior** (`#hud-tape-wrap` / `#hud-paper-strip` / `#hud-led`, `#hud-score-card`, `#hud-cta-modal`), garantindo sincronia absoluta entre cortes de câmera 3D e placas metálicas 2D.
  - `assets/kit3d.js` (copiado automaticamente de `shared/kit3d/kit3d.js` para cada novo vídeo por `tools/new_video.py`) fornece os construtores 3D prontos da série (`STAGE_THEMES.amber` por padrão): **sempre use `kit3d.js`** em vez de modelar geometrias cruas do zero. Para evoluir o Kit 3D para todos os nichos futuros, edite `shared/kit3d/kit3d.js`.
- **Paleta (Tema Padrão `amber` — Grafite & Âmbar Quente):**
  - Fundo Oficina 3D: Grafite carvão neutro `#111113` → `#1f1c19` com linhas técnicas em âmbar-ouro (`rgba(245, 158, 11, 0.20)`), crosshairs `+` e diagramas CAD ao fundo.
  - Bancada de Grafite Chumbo: chapas foscas `#27272a` / `#2e2c29` (`y = 0` é o topo da mesa) com tapete técnico grafite `#181614` emoldurado em âmbar `#f59e0b`, parafusos sextavados e barra de LED frontal âmbar `#fbbf24`.
  - Robôs Cápsula / Droides (`createBlockAgent`): Ciano `#38bdf8`, Laranja Industrial `#f97316`, Verde Esmeralda `#10b981`, Amarelo Inspeção `#eab308`, Roxo `#a855f7`, Vermelho `#ef4444`. Visor digital de LED escuro (`#040811`) que muda os olhos automaticamente (`●_●` focado, `>_<` vermelho em `"panic"`, `^_^` verde em `"celebrate"`).
  - Placas Metálicas HUD: Grafite escuro `#1c1917` / `#181615` com borda metálica `#78716c` (`4px`), parafusos nos cantos, indicador `#hud-led` aceso e sombra dura (`0 9px 0 #09090b`).
  - Semântica:
    - No 3D WebGL (`PALETTE` em `kit3d.js`): Verde `#22c55e`, Vermelho `#ef4444`, Âmbar `#f59e0b`, Ciano `#38bdf8`.
    - No HUD sobre Grafite Escuro (`#181615` / `#1c1917`) — **use sempre cores LED luminosas para passar no contraste WCAG AA (`>= 4.5:1`)**: Verde LED `#4ade80`, Vermelho LED `#ff6b6b`, Âmbar LED `#fbbf24`, Ciano LED `#38bdf8` (a função `setScore` converte automaticamente).
- **Tipografia & Regras de Craft:**
  - HUD, Placar e Legendas: `Inter` (`font-weight: 800/900`). Tamanho mínimo de leitura na tela: `28px`.
  - Telas de Código 3D, Valores do Placar e Comandos: `JetBrains Mono` (`font-weight: 700/900`).
  - Quando usado (`--cta`), o card de CTA final (`#hud-cta-modal`) deve entrar pelo menos `2.5s` antes de `DUR` para passar na auditoria de leitura (`line_unread`).
- **Zonas da Tela (1080 × 1920):**
  - `y: 96px` (direita): Watermark industrial (`#hud-watermark`, **oculto por padrão**; ativado apenas quando a flag `--marca` é passada no pipeline, usando o valor de `marca_dagua` em `niche.json`).
  - `y: 196px – 314px`: Placa Metálica Industrial superior com parafusos e LED de status (`#hud-tape-wrap`). Título em caixa alta, até 26 caracteres por troca.
  - `y: 344px – 446px` (direita): Placar Metálico Industrial (`#hud-score-card`) com métrica em caixa alta à esquerda e número digital LED à direita.
  - `y: 460px – 1380px`: Palco de ação 3D livre para os droides cápsula, monitores industriais 3D e setas 3D.
  - `bottom: 380px` (`y ≈ 1440px – 1540px`): Legendas `dark-pill` geradas por `tools/build_captions.py`.
- **Movimento e Câmera 3D:**
  - Cada cena do roteiro corresponde a um plano em `SHOTS` dentro de `compositions/world.html`, com câmera sempre em leve movimento (`p0 → p1`, `l0 → l1`) + balanço orgânico de mão (`handheld`).
  - Na transição para um gargalo (*"Só que..."*), dispare `shake(t, tGatilho, 0.14, 0.35)` na câmera, mude a tela 3D para `"error"`, mostre a seta vermelha pulsante (`createFlowArrow`) e suba o número do placar com `back.out`.
  - Na entrada de uma solução (*"Então..."*), escale o novo agente/módulo com `E.backOut(seg(t, t0, t0 + 0.45))` e mude a ação do agente (`coder.act(t, "type" | "panic" | "point" | "celebrate")`).
- **Proibido:** `Math.random()` sem seed, `requestAnimationFrame` próprio, texto 2D fora das caixas do HUD, deixar o placar estático o vídeo inteiro, ou editar `compositions/captions.html` à mão.

## Som
- Locução: voz única da série configurada em `niche.json`.
- SFX de `assets/sfx/` (copiados de `shared/sfx/`) colocados no `index.html` com pico 1 frame após o evento visual:
  - Troca de faixa/corte de câmera: `whoosh-short.mp3` (`data-volume="0.28"`).
  - Entrada de agente ou módulo 3D: `pop.mp3` (`data-volume="0.55"`).
  - Gargalo / Erro / Alucinação: `error.mp3` (`data-volume="1.8"`) + `impact-bass-1.mp3` (`data-volume="0.24"`).
  - Incremento rápido de cliques/testes: `click.mp3` ou `key-press.mp3` (`data-volume="0.4"`).
  - Veredito / Aprovação / Checklist: `ping.mp3` (`data-volume="0.5"`).

## Episódios
| Nº | Pasta | Tema | Estado |
| --- | --- | --- | --- |
