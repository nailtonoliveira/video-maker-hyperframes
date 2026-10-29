/hyperframes Crie as cenas 3D deste vídeo vertical para YouTube Shorts / Reels (1080 × 1920, 30 fps): "{{TITULO}}".

Modo sem paradas: não faça perguntas e não ofereça alternativas para escolha. Decida e execute. Este projeto faz parte de um workspace com vários vídeos: trabalhe **somente dentro desta pasta**.

# O que já existe nesta pasta (não recrie do zero!)
- Projeto HyperFrames criado a partir do template do nicho `ia-lab`:
  - `index.html`: monta `compositions/world.html` (de `0` até `{{DURACAO}}` s), `compositions/captions.html` e `assets/voice.mp3`.
  - **`assets/kit3d.js`**: **BIBLIOTECA 3D COMPARTILHADA (`shared/kit3d/kit3d.js`) COPIADA PARA ESTE VÍDEO**. Contém `PALETTE`, `STAGE_THEMES`, `E`, `seg`, `shake`, `createDioramaStage`, `createBlockAgent`, `createCodeScreen`, `createFlowArrow`, `createFloatingLabel` e `applyCameraShot`. **Use obrigatoriamente o `kit3d.js`** — nunca modele palco, agentes ou telas do zero.
  - `compositions/world.html`: contém a estrutura pronta do `<canvas id="gl">`, o HUD 2D de Placa Metálica Industrial com parafusos e LED (`#hud-tape-wrap`, `#hud-paper-strip`, `#hud-led`, `#hud-banner-text`), o placar metálico dinâmico (`#hud-score-card`, `#hud-score-label`, `#hud-score-val`), o card de CTA opcional (`#hud-cta-modal`) e um exemplo funcional do `buildScene(THREE, KIT)`.
  - `assets/voice.mp3` (**{{DURACAO}} s**, {{FRAMES}} frames) e `assets/voice.json` (timestamps palavra por palavra do Whisper).
  - `compositions/captions.html`: legendas estilo pílula dark glass (`dark-pill`) já geradas. **Nunca edite `compositions/captions.html`**.
  - `assets/sfx/`: biblioteca de efeitos sonoros (`whoosh-short.mp3`, `pop.mp3`, `error.mp3`, `impact-bass-1.mp3`, `click.mp3`, `ping.mp3`, `key-press.mp3`).
  - `roteiro.md`: roteiro aprovado com a locução e a direção visual das `N` cenas.
  - `../../NICHE.md`: identidade visual e regras da série. **Siga à risca**.

# Título na faixa de fita crepe no frame 0 (thumbnail)
"{{TITULO_TELA}}"

# Sincronização das `N` cenas (calculada a partir de assets/voice.json)
Cada cena do roteiro corresponde a um intervalo de tempo abaixo (um plano no array `SHOTS` da câmera 3D + atualização do HUD `setBanner` e `setScore`). Confira em `assets/voice.json` a palavra exata de cada âncora e prenda o evento ao início dela:

{{TIMELINE}}

# Conceitos / Fatos técnicos para exibir nas telas 3D (`createCodeScreen`)
{{FATOS}}

# Execução Passo a Passo
1. Atualize `SPEC.md` com o plano completo das `N` cenas (tempos exatos, textos da faixa de fita crepe, valores do placar, objetos do `kit3d.js` e `SHOTS` de câmera).
2. Edite `compositions/world.html`:
   - Ajuste `const DUR = {{DURACAO}};` (preservando `const THEME = "amber";`, `const SHOW_WATERMARK` e `const WATERMARK_TEXT` como já estão no arquivo).
   - Na timeline GSAP (`tl`), agende com `setBanner(texto, t)` e `setScore(rotulo, valor, corHex, t)` todas as trocas de título da faixa superior e de placar para cada uma das `N` cenas e suas âncoras.
   - **Card de CTA (`#hud-cta-modal`) opcional:** Só exiba `#hud-cta-modal` na última cena se a locução da última cena tiver explicitamente uma chamada de CTA (ex.: *"Comenta X..."*). Se o roteiro fechar direto na conclusão/veredito (padrão sem CTA), mantenha `#hud-cta-modal` oculto (`opacity: 0`) para não tampar o palco 3D no final.
   - Em `buildScene(THREE, KIT)`, instancie os agentes (`createBlockAgent` com `role: "coder" | "hacker" | "senior" | "tester" | "boss" | "user"`), as telas de código (`createCodeScreen` com código real do tema) e as setas 3D (`createFlowArrow`).
   - Configure o array `SHOTS` cobrindo de `0` até `{{DURACAO}}` com um movimento de câmera claro para cada uma das `N` cenas, adicionando `shake(t, tAncora, 0.14, 0.35)` nos momentos de falha/gargalo (*"Só que..."*).
3. Edite `index.html` apenas para adicionar as tags `<audio id="sfx-..." class="clip" ...>` dos efeitos sonoros sincronizados às âncoras (mantendo `world`, `captions` e `voice` intactos cobrindo `0` → `{{DURACAO}}`).
4. Rode `npm run check` e corrija qualquer erro. Depois rode `npx hyperframes snapshot --describe false --at <tempos-de-cada-cena>`, inspecione visualmente os PNGs gerados para garantir que o 3D, a faixa de fita crepe, o placar e as legendas estão legíveis e sem sobreposição, e escreva `REVIEW.md`.
5. **Não renderize** e não deixe servidor de preview rodando: o pipeline renderiza depois da aprovação.
