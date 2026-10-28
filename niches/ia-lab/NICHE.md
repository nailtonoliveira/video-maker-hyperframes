# Nicho: IA Lab — Engenharia de IA & Bastidores de Código em 3D

Shorts sobre como arquiteturas reais de IA, agentes, MCPs, RAGs, prompts e automações funcionam por dentro — e por que o jeito amador quebra. Narração sem rosto, tudo encenado em **diorama 3D WebGL (Three.js + `assets/kit3d.js`)** sobre uma bancada de madeira quente com agentes em blocos, telas de código, setas de fluxo 3D e **HUD 2D de papel rasgado com fita crepe + placar dinâmico**.

Fonte da verdade da identidade do nicho: o que está aqui vale para todo vídeo da série; o `template/` é a implementação disso e é copiado para cada vídeo novo. Este arquivo também vai inteiro dentro dos prompts do pipeline (`prompts/`), então o que estiver aqui guia temas, roteiro, metadados e cenas. Voz, modelos de IA e aprovações ficam em `niche.json`.

## Formato
- YouTube Shorts / Reels / TikTok `1080 × 1920`, `30 fps`, duração dinâmica conforme a complexidade do tema (`35–75 s`; a duração final é a da locução).
- **Quantidade de cenas dinâmica (`N` cenas guiadas pelo tema):** o número de cenas nunca é fixo; é determinado por quantos gargalos/etapas ou especialistas o mecanismo do episódio exige:
  1. **Cena 1 (Gancho + Tentativa Inicial):** apresenta a promessa/dor prática e a solução óbvia que todo mundo tenta primeiro.
  2. **Cenas Intermediárias (`Cena 2` até `Cena N-2` — Loop *"Só que... Então..."* ou Banca de Agentes):** cada cena mostra **um gargalo técnico real** (*"Só que..."* → falha visível no 3D, seta vermelha de pressão, placar subindo em alerta) seguido da **peça de engenharia que resolve aquele gargalo** (*"Então você coloca..."* → novo agente/módulo entra na bancada).
  3. **Cena `N-1` (O Veredito / Arquitetura Rodando):** o sistema completo operando integrado, zerando os erros no placar (`ERROS: 9 → 0`) ou carimbando `APROVADO`.
  4. **Cena `N` (Payoff + CTA Final — últimos 3–4 s):** card de engajamento na tela (*"Comenta [PALAVRA] que eu te mando o prompt/arquitetura"* ou *"Manda pra um dev e segue o canal"*).
- **Legenda queimada estilo Etiqueta Recortada (`label-tag`):** grupos de até 3 palavras em `bottom: 380px`, caixas terracota `#c85a32` levemente inclinadas, com a palavra falada no instante atual destacando em amarelo-ouro `#ffd43b` e texto preto `#141414`.
- Todo evento visual (troca da faixa de fita crepe, incremento do placar, entrada de agente/seta 3D, corte de câmera) preso ao início da palavra correspondente na transcrição (`assets/voice.json`).

## Roteiro
- Frase 1 = gancho direto na ferida ou promessa técnica concreta (ex.: *"Um único Claude codando sozinho vai quebrar sua produção"*, *"Por que seu RAG inventa resposta mesmo com o PDF certo"*). Nada de saudação nem *"você sabia"*.
- Progressão causal sem gordura: conecte as cenas usando o contraste *"Só que..."* (gargalo) → *"Então..."* (solução arquitetural) ou enumerando os agentes da banca (`O primeiro é...`, `O segundo...`, `O veredito...`).
- Fatos e conceitos técnicos reais: cite os mecanismos reais (context window, system prompt, MCP, tool calling, embeddings, chunking, guardrails, unit tests, sandbox, git worktree).
- Última cena entrega um CTA curto e acionável com uma palavra-chave clara entre aspas ou convite direto para compartilhar com outro dev.

## Visual (Diorama 3D + HUD Paper/Tape)
- **Arquitetura de Composição:**
  - `compositions/world.html` concentra **tanto o palco 3D (`<canvas id="gl">`) quanto o HUD 2D superior** (`#hud-tape-wrap`, `#hud-score-card`, `#hud-cta-modal`), garantindo sincronia absoluta entre cortes de câmera 3D e placas 2D.
  - `assets/kit3d.js` fornece os construtores 3D prontos: **sempre use `kit3d.js`** em vez de modelar geometrias cruas do zero.
- **Paleta:**
  - Céu Noturno / Fundo 3D: `#0b0f1d` → `#161f38` com janelas pixeladas desfocadas ao fundo.
  - Bancada de Madeira Quente: tábuas `#6e4726` / `#764c29` (`y = 0` é o topo da mesa).
  - Agentes & Marca: Terracota `#d96b43`, Ciano `#38bdf8`, Amarelo Capacete `#ffd43b`, Roxo `#9b59b6`.
  - Papel & HUD: Creme `#f4efe6` com borda grossa `#141414` (`4px–6px`) e sombra dura (`0 8px 0 #141414`). Fita crepe kraft `#d6ba8a`.
  - Semântica:
    - No 3D WebGL (`PALETTE` em `kit3d.js`): Verde `#2ecc71`, Vermelho `#e74c3c`, Âmbar `#f39c12`, Terracota `#d96b43`.
    - No HUD sobre Papel Creme (`#f4efe6`) — **use sempre estes tons escuros para passar no contraste WCAG AA (`>= 3:1`)**: Verde `#18864b`, Vermelho `#c92a2a`, Âmbar `#b45309`, Terracota `#b84a24`.
- **Tipografia & Regras de Craft:**
  - HUD, Placar e Legendas: `Inter` (`font-weight: 800/900`). Tamanho mínimo de leitura na tela: `28px`.
  - Telas de Código 3D e Comandos: `JetBrains Mono` (`font-weight: 700`).
  - O card de CTA final (`#hud-cta-modal`) deve entrar pelo menos `2.5s` antes de `DUR` para passar na auditoria de leitura (`line_unread`).
- **Zonas da Tela (1080 × 1920):**
  - `y: 96px` (direita): Watermark pill (`ia-lab.dev`).
  - `y: 196px – 314px`: Faixa de papel rasgado com fita crepe nas pontas (`#hud-tape-wrap`). Título em caixa alta, até 28 caracteres por troca.
  - `y: 344px – 446px` (direita): Card de placar (`#hud-score-card`) com métrica em caixa alta à esquerda e número grande à direita.
  - `y: 460px – 1380px`: Palco de ação 3D livre para os agentes, telas de código e setas 3D.
  - `bottom: 380px` (`y ≈ 1440px – 1540px`): Legendas `label-tag` geradas por `tools/build_captions.py`.
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
