# Dark Channels

Fábrica de Shorts sem rosto feitos com HyperFrames, organizada por nicho. Cada vídeo é um projeto
HyperFrames completo e isolado na sua própria pasta, então vídeos e nichos nunca se misturam.

## Primeira vez

1. Preencha as chaves em `.env` (modelo em `.env.example`): `ELEVENLABS_API_KEY` e `GEMINI_API_KEY` (nível
   gratuito, só para os embeddings). A `ANTHROPIC_API_KEY` é opcional (só se um nicho usar a API do Claude).
   O texto (temas, roteiro, tts, metadados) sai do Antigravity CLI (`agy`), logado na sua assinatura Google AI
   Pro: faça login uma vez rodando `agy` no terminal. Provedor e modelos ficam em `niche.json` → `"llm"`
   (`antigravity`, `gemini` ou `claude`; modelos do agy em `agy models`).
2. Escolha a voz: `./pipeline vozes` lista as vozes da sua conta. Copie o `voice_id` para
   `niches/tech-lore/niche.json` → `"voz"`, junto com o modelo e os ajustes que você usa no site.
3. Confira tudo: `./pipeline doctor`. Ele testa as chaves, as ferramentas e se os modelos configurados existem.

## Fazer vídeos (pipeline automático)

```bash
./pipeline temas tech-lore            # a IA sugere 10 temas novos (sem repetir o catálogo)
./pipeline novo tech-lore T004        # produz o tema T004 do começo ao fim
./pipeline novo tech-lore             # mostra os sugeridos e você escolhe
./pipeline novo tech-lore --tema "O apagão da AT&T em 1990"   # tema livre
./pipeline status                     # onde cada vídeo está
```

O fluxo de cada vídeo:

| # | Etapa | O que faz | Para pedir aprovação? |
|---|---|---|---|
| 1 | roteiro | A IA de texto (com busca na web) escreve o roteiro em JSON: cenas, âncoras visuais, loop e fatos com fonte → `roteiro.md` | ✋ |
| 2 | tts | A IA prepara o texto para a voz (números por extenso, siglas, ritmo) → `tts.txt` | |
| 3 | voz | ElevenLabs gera `assets/voice.mp3` | ✋ ouça |
| 4 | tempos | Whisper local → `assets/voice.json` (tempo de cada palavra) | |
| 5 | legendas | Ajusta a duração do vídeo, corrige a transcrição pelo roteiro e gera as legendas | |
| 6 | prompt | Acha no áudio onde cada cena e cada âncora começa e monta `hyperframes-prompt.md` | |
| 7 | cenas | Claude Code (`claude -p`, sua assinatura) cria SPEC, cenas, SFX e REVIEW; o pipeline roda check e snapshots | ✋ revise o preview |
| 8 | render | MP4 em `renders/` | |
| 9 | metadados | A IA escreve título, descrição e hashtags por plataforma | ✋ |
| 10 | publicar | Monta `publicar/`: MP4 + `youtube.txt`, `tiktok.txt`, `instagram.txt`, `facebook.txt` + `CHECKLIST.md` | |

**Nas aprovações:** `s` aprova, `r` refaz (pedindo o que mudar, nas etapas de texto e cenas) e `p` para.
Parou? Retome com `./pipeline rodar tech-lore/004` (atalho `<nicho>/<número>`).

Outras opções:

```bash
./pipeline rodar tech-lore/004 --refazer voz     # refaz desta etapa em diante
./pipeline rodar tech-lore/004 --ate prompt      # para depois de uma etapa
./pipeline rodar tech-lore/004 --aprovar         # aprova a etapa pendente sem perguntar
./pipeline novo tech-lore T004 --auto            # sem nenhuma parada
./pipeline novo tech-lore T004 --ensaio          # testa o fluxo sem gastar: respostas e voz de exemplo
./pipeline descartar tech-lore T005 T007         # descarta temas (não voltam a ser sugeridos)
./pipeline temas tech-lore --listar [--todos]    # mostra o catálogo
```

**Depois de publicar** em cada rede (upload manual, com os textos de `publicar/`):

```bash
./pipeline publicado tech-lore/004 youtube https://youtube.com/shorts/...
```

Quando todas as plataformas do nicho estão registradas, o tema vira `publicado` no catálogo.

## Onde fica cada coisa

```
dark-channels/
├── pipeline                  atalho do pipeline (./pipeline -h)
├── .env / .env.example       chaves de API (.env fica fora do git)
├── CLAUDE.md / AGENTS.md     regras para agentes (AGENTS.md é um link para CLAUDE.md)
├── tools/
│   ├── pipeline.py, dc/      o pipeline (etapas, IA, voz, alinhamento, catálogo)
│   ├── fixtures/ensaio/      respostas de exemplo do modo --ensaio
│   ├── transcribe.py · set_duration.py · build_captions.py · new_video.py · new_niche.py
│   └── .venv/                Python com faster-whisper, google-genai, anthropic
├── shared/sfx/               biblioteca de efeitos (copiada para cada vídeo novo)
└── niches/<nicho>/
    ├── NICHE.md              identidade da série (vai dentro dos prompts)
    ├── niche.json            voz, modelos de IA, duração, plataformas, quais etapas pedem aprovação
    ├── prompts/              temas · roteiro · tts · metadados · hyperframes (edite à vontade)
    ├── catalogo.json         todos os temas: sugerido → em_producao → produzido → pronto → publicado | descartado
    ├── template/             projeto-base copiado para cada vídeo
    └── videos/NNN-slug/      um projeto HyperFrames por vídeo, com pipeline.json (estado) e .pipeline/ (logs)
```

Os prompts usam marcadores `{{NOME}}`, preenchidos pelo pipeline. Os logs de cada chamada de IA (prompt e
resposta) ficam em `<vídeo>/.pipeline/`.

## Criar um nicho novo

```bash
python3 tools/new_niche.py historia-sombria                 # parte do tech-lore
python3 tools/new_niche.py misterios --from historia-sombria
```

Depois: reescreva `NICHE.md` (formato, roteiro, visual, som), escolha a voz em `niche.json`, adapte o
`template/` (cores em `index.html`, fundo em `compositions/bg.html`, legenda em `captions.json`) e revise os
`prompts/`, sobretudo o `roteiro.md`, se a estrutura de cenas for diferente.

## Sem o pipeline (manual)

Os scripts de `tools/` funcionam sozinhos, todos recebendo a pasta do vídeo:

```bash
source ~/.nvm/nvm.sh && nvm use                          # Node 22
python3 tools/new_video.py tech-lore therac25
tools/.venv/bin/python tools/transcribe.py niches/tech-lore/videos/002-therac25/assets/voice.mp3
python3 tools/set_duration.py niches/tech-lore/videos/002-therac25
python3 tools/build_captions.py niches/tech-lore/videos/002-therac25
cd niches/tech-lore/videos/002-therac25 && npm run check && npm run render
```

## Por que nada se mistura

- Cada vídeo tem seu `index.html`, seu estado `.hyperframes/`, seu `pipeline.json`, seu `meta.json` com id
  único e seus `renders/`.
- Criar um vídeo **copia** o template e os SFX, sem referenciar nada. Mudar o template depois não altera
  vídeos prontos, e cada `package.json` fixa a versão do HyperFrames.
- Todas as etapas recebem a pasta do vídeo e só escrevem dentro dela. O Claude Code da etapa de cenas roda
  com essa pasta como diretório de trabalho e só tem permissão para editar ali.
