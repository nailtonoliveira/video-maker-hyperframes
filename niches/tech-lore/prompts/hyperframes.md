/hyperframes Crie as cenas deste vídeo vertical para YouTube Shorts (1080 × 1920, 30 fps): "{{TITULO}}".

Modo sem paradas: não faça perguntas e não ofereça alternativas para escolha. Decida e execute. Este projeto faz parte de um workspace com vários vídeos: trabalhe **somente dentro desta pasta**.

# O que já existe nesta pasta (não recrie)
- Projeto HyperFrames criado a partir do template do nicho: `index.html` (fundo, cena de exemplo `s1`, legendas, voz), `compositions/bg.html` e `compositions/s1.html` (exemplo do estilo, que deve ser substituído).
- `assets/voice.mp3`: a narração. Duração: **{{DURACAO}} s** ({{FRAMES}} frames); a raiz já está com essa duração.
- `assets/voice.json`: tempo de cada palavra (Whisper). É o relógio do vídeo.
- `compositions/captions.html`: legendas já geradas. **Não edite** (são regeneradas por script).
- `assets/sfx/`: biblioteca de efeitos sonoros.
- `roteiro.md`: roteiro aprovado, com a locução e a direção visual de cada cena.
- `../../NICHE.md`: identidade visual e regras da série. **Siga à risca** (cores, fonte, área útil, movimento, proibições).

# Título na tela (frame 0, vira a thumbnail)
"{{TITULO_TELA}}"

# Sincronização (calculada a partir de assets/voice.json)
Cada cena ocupa o intervalo abaixo; cada âncora é o instante em que aquele visual deve acontecer. Confira em `assets/voice.json` a palavra exata e prenda o evento ao início dela. Âncora marcada "?" não foi encontrada automaticamente: localize você mesmo no voice.json.

{{TIMELINE}}

# Fatos que podem aparecer na tela
{{FATOS}}

# Execução
1. Escreva `SPEC.md` (há um modelo na pasta) com os tempos acima: objetos, movimentos e os SHOTS por cena.
2. Crie uma composição por cena (`compositions/s1.html` … `sN.html`), substituindo o exemplo, e monte-as em sequência no `index.html` cobrindo 0 → {{DURACAO}} s sem buracos. Mantenha `bg`, `captions` e `voice` como estão.
3. Loop: o último frame deve ser igual ao frame 0 (o título da cena 1 remonta no mesmo lugar).
4. SFX de `assets/sfx/` nos acertos visuais (`<audio>` com `id`, pico 1 frame após a imagem), conforme a seção Som da série.
5. Rode `npm run check` e corrija todos os erros. Depois `npx hyperframes snapshot --review`, olhe os quadros, corrija o que estiver errado e escreva `REVIEW.md`.
6. **Não renderize** e não deixe servidor de preview rodando: o pipeline renderiza depois da aprovação.
