/hyperframes Crie as cenas 3D deste vídeo vertical para YouTube Shorts / Reels (1080 × 1920, 30 fps): "O Golpe dos 3 Segundos: Como a IA Rouba a Voz de Quem Você Ama".

Modo sem paradas: não faça perguntas e não ofereça alternativas para escolha. Decida e execute. Este projeto faz parte de um workspace com vários vídeos: trabalhe **somente dentro desta pasta**.

# O que já existe nesta pasta (não recrie do zero!)
- Projeto HyperFrames criado a partir do template do nicho `ia-lab`:
  - `index.html`: monta `compositions/world.html` (de `0` até `39.66` s), `compositions/captions.html` e `assets/voice.mp3`.
  - **`assets/kit3d.js`**: **BIBLIOTECA 3D COMPARTILHADA (`shared/kit3d/kit3d.js`) COPIADA PARA ESTE VÍDEO**. Contém `PALETTE`, `STAGE_THEMES`, `E`, `seg`, `shake`, `createDioramaStage`, `createBlockAgent`, `createCodeScreen`, `createFlowArrow`, `createFloatingLabel` e `applyCameraShot`. **Use obrigatoriamente o `kit3d.js`** — nunca modele palco, agentes ou telas do zero.
  - `compositions/world.html`: contém a estrutura pronta do `<canvas id="gl">`, o HUD 2D de Placa Metálica Industrial com parafusos e LED (`#hud-tape-wrap`, `#hud-paper-strip`, `#hud-led`, `#hud-banner-text`), o placar metálico dinâmico (`#hud-score-card`, `#hud-score-label`, `#hud-score-val`), o card de CTA opcional (`#hud-cta-modal`) e um exemplo funcional do `buildScene(THREE, KIT)`.
  - `assets/voice.mp3` (**39.66 s**, 1190 frames) e `assets/voice.json` (timestamps palavra por palavra do Whisper).
  - `compositions/captions.html`: legendas estilo pílula dark glass (`dark-pill`) já geradas. **Nunca edite `compositions/captions.html`**.
  - `assets/sfx/`: biblioteca de efeitos sonoros (`whoosh-short.mp3`, `pop.mp3`, `error.mp3`, `impact-bass-1.mp3`, `click.mp3`, `ping.mp3`, `key-press.mp3`).
  - `roteiro.md`: roteiro aprovado com a locução e a direção visual das `N` cenas.
  - `../../NICHE.md`: identidade visual e regras da série. **Siga à risca**.

# Título na faixa de fita crepe no frame 0 (thumbnail)
"O GOLPE DOS 3 SEGUNDOS"

# Sincronização das `N` cenas (calculada a partir de assets/voice.json)
Cada cena do roteiro corresponde a um intervalo de tempo abaixo (um plano no array `SHOTS` da câmera 3D + atualização do HUD `setBanner` e `setScore`). Confira em `assets/voice.json` a palavra exata de cada âncora e prenda o evento ao início dela:

**Cena 1 — O Gancho e o Story Comum** (0.00 s → 6.76 s)
- Locução: 3 segundos de áudio do seu Instagram já bastam pra clonar a sua voz. Você posta um story inocente, sem imaginar o risco.
- Visual: Faixa: 'O GOLPE DOS 3 SEGUNDOS' | Placar: 'AMOSTRA: 3s' | 3D: Bancada grafite com linhas âmbar. Droide usuário (user, ciano) grava stories no smartphone com visor focado '●_●'. Monitor 3D exibe onda sonora verde curta com a legenda 'AUDIO_STORY.wav'.
  - 0.00 s · "3 segundos de áudio" → setBanner('O GOLPE DOS 3 SEGUNDOS') e setScore('AMOSTRA', '3s', 'amber')
  - 4.04 s · "posta um story inocente" → user.act(t, 'point') e tela 3D acende onda sonora verde AUDIO_STORY.wav

**Cena 2 — O Fatiador de Voz** (6.76 s → 13.42 s)
- Locução: A inteligência artificial pega esse trechinho, fatia seu tom e respiração em blocos e aprende a falar qualquer frase.
- Visual: Faixa: 'FATIANDO SUA VOZ' | Placar: 'CLONE: 100%' | 3D: Entra o droide técnico (coder, amarelo) operando um módulo fatiador 3D. A onda de som é cortada em três blocos luminosos e uma seta 3D âmbar transfere os dados para o sintetizador.
  - 9.32 s · "fatia seu tom" → setBanner('FATIANDO SUA VOZ') e fatiador 3D divide o áudio em blocos luminosos
  - 11.74 s · "aprende a falar qualquer" → coder.act(t, 'type') e setScore('CLONE', '100%', 'cyan')

**Cena 3 — O Droide Impostor** (13.42 s → 21.18 s)
- Locução: Só que aí entra o golpista. Ele usa essa voz idêntica no WhatsApp da sua família, fingindo um sequestro e pedindo Pix urgente.
- Visual: Faixa: 'O IMPOSTOR NO WHATSAPP' | Placar: 'PERIGO: 90%' | 3D: Câmera treme com shake(0.14). Surge o droide impostor (hacker, vermelho) com capuz e visor em pânico '>_<'. Seta 3D vermelha pulsante aponta direto para a bancada da família.
  - 14.20 s · "entra o golpista" → setBanner('O IMPOSTOR NO WHATSAPP') e hacker entra na bancada com visor '>_<'
  - 19.60 s · "pedindo Pix urgente" → setScore('PERIGO', '90%', 'red') e createFlowArrow vermelha pulsa em direção à família

**Cena 4 — O Desespero Humano** (21.18 s → 26.56 s)
- Locução: No pânico de ouvir o parente chorando, ninguém confere o número e todo mundo transfere sem pensar.
- Visual: Faixa: 'PÂNICO E PIX FALSO' | Placar: 'ERROS: 1' | 3D: Câmera aproxima no droide familiar (boss, laranja) tremendo com visor '>_<'. Monitor 3D pisca em vermelho com as mensagens 'SOCORRO!' e 'PIX: R$ 3.000 ENVIADO'.
  - 21.84 s · "ouvir o parente chorando" → setBanner('PÂNICO E PIX FALSO') e boss.act(t, 'panic')
  - 24.96 s · "transfere sem pensar" → tela 3D pisca em vermelho com PIX ENVIADO e setScore('ERROS', '1', 'red')

**Cena 5 — O Filtro da Senha Secreta** (26.56 s → 33.04 s)
- Locução: Então a proteção é simples: combine hoje mesmo uma palavra secreta com a sua família que só vocês conhecem.
- Visual: Faixa: 'A PALAVRA SECRETA' | Placar: 'SENHA: ATIVA' | 3D: Grande cadeado metálico 3D pousa com backOut no meio da bancada. O droide familiar acalma o visor para '●_●' e levanta uma placa dourada com a chave. Tela 3D fica verde.
  - 27.10 s · "a proteção é simples" → setBanner('A PALAVRA SECRETA') e cadeado metálico 3D entra no centro da bancada
  - 29.40 s · "uma palavra secreta" → boss.act(t, 'point'), erguendo placa dourada e setScore('SENHA', 'ATIVA', 'green')

**Cena 6 — O Veredito e Loop** (33.04 s → 39.66 s)
- Locução: Se quem ligou não souber a palavra, desliga na hora. Com esse escudo na mesa, o golpe zera. E você nunca esquece que...
- Visual: Faixa: 'GOLPE ANULADO' | Placar: 'ERROS: 0' | 3D: Droide familiar dá uma carimbada firme na mesa. O droide impostor é ejetado da bancada. Tela 3D exibe 'AMEAÇA: ZERO' e os droides comemoram com visor '^_^'.
  - 34.90 s · "desliga na hora" → boss.act(t, 'stamp') e hacker é empurrado para fora da mesa
  - ? · "o golpe zera" → setBanner('GOLPE ANULADO'), setScore('ERROS', '0', 'green') e droides mudam visor para '^_^'

# Conceitos / Fatos técnicos para exibir nas telas 3D (`createCodeScreen`)
- Modelos modernos de inteligência artificial generativa de voz precisam de apenas 3 segundos de áudio público para mapear timbre, modulação e cadência de uma pessoa e gerar qualquer fala nova. (https://g1.globo.com/fantastico/noticia/2024/03/17/golpistas-usam-inteligencia-artificial-para-imitar-voz-de-parentes-e-pedir-dinheiro.ghtml)
- Criminosos usam amostras curtas gravadas de stories ou ligações para simular falsos sequestros e acidentes graves via WhatsApp, explorando o pânico dos familiares para arrancar transferências via Pix. (https://www.ebc.com.br/noticias/seguranca/2024/03/golpe-do-roubo-de-voz-por-ia-faz-vitimas-no-brasil)
- A principal orientação oficial de segurança e das polícias civis contra o golpe da voz clonada é instituir uma palavra-código ou senha combinada internamente entre os membros da família. (https://g1.globo.com/fantastico/noticia/2024/03/17/golpistas-usam-inteligencia-artificial-para-imitar-voz-de-parentes-e-pedir-dinheiro.ghtml)

# Execução Passo a Passo
1. Atualize `SPEC.md` com o plano completo das `N` cenas (tempos exatos, textos da faixa de fita crepe, valores do placar, objetos do `kit3d.js` e `SHOTS` de câmera).
2. Edite `compositions/world.html`:
   - Ajuste `const DUR = 39.66;` (preservando `const THEME = "amber";`, `const SHOW_WATERMARK` e `const WATERMARK_TEXT` como já estão no arquivo).
   - Na timeline GSAP (`tl`), agende com `setBanner(texto, t)` e `setScore(rotulo, valor, corHex, t)` todas as trocas de título da faixa superior e de placar para cada uma das `N` cenas e suas âncoras.
   - **Card de CTA (`#hud-cta-modal`) opcional:** Só exiba `#hud-cta-modal` na última cena se a locução da última cena tiver explicitamente uma chamada de CTA (ex.: *"Comenta X..."*). Se o roteiro fechar direto na conclusão/veredito (padrão sem CTA), mantenha `#hud-cta-modal` oculto (`opacity: 0`) para não tampar o palco 3D no final.
   - Em `buildScene(THREE, KIT)`, instancie os agentes (`createBlockAgent` com `role: "coder" | "hacker" | "senior" | "tester" | "boss" | "user"`), as telas de código (`createCodeScreen` com código real do tema) e as setas 3D (`createFlowArrow`).
   - Configure o array `SHOTS` cobrindo de `0` até `39.66` com um movimento de câmera claro para cada uma das `N` cenas, adicionando `shake(t, tAncora, 0.14, 0.35)` nos momentos de falha/gargalo (*"Só que..."*).
3. Edite `index.html` apenas para adicionar as tags `<audio id="sfx-..." class="clip" ...>` dos efeitos sonoros sincronizados às âncoras (mantendo `world`, `captions` e `voice` intactos cobrindo `0` → `39.66`).
4. Rode `npm run check` e corrija qualquer erro. Depois rode `npx hyperframes snapshot --describe false --at <tempos-de-cada-cena>`, inspecione visualmente os PNGs gerados para garantir que o 3D, a faixa de fita crepe, o placar e as legendas estão legíveis e sem sobreposição, e escreva `REVIEW.md`.
5. **Não renderize** e não deixe servidor de preview rodando: o pipeline renderiza depois da aprovação.
