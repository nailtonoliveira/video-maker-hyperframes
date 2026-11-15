# Nicho: Contos do Dinheiro: fábulas de finanças com números reais

Shorts e Reels narrados (sem rosto) em que **uma história curta com personagens** ensina uma ideia de dinheiro, e
**os números da história são reais** (Banco Central, IBGE, B3, Tesouro), calculados por script e citados no fim.
Referência de formato: microcontos com "regra do mundo" (tipo @historiasdertr), mas com o próprio visual da série.

## Formato
- 1080 × 1920, 30 fps, **60–120 s** (a duração vem de `voice.mp3`; o piloto tem 112 s de voz + 5 s de cartão).
- **Uma ideia por episódio** (juros compostos, inflação, parcelamento, reserva de emergência, taxa de corretagem…).
- **Um dado real atravessa o vídeo** (ex.: R$ 200/mês a 100% do CDI), do gancho ao resultado.
- Arco fixo: **gancho com o resultado** (0–5 s) → **regra do mundo** → **personagem com um desejo** → **escolha** →
  **passagem do tempo** → **medição com números reais** → **reviravolta** → **moral irônica de 1 linha** →
  **callback que recria o gancho** (o último quadro casa com o quadro 0).
- Cartão final obrigatório de transparência (3–5 s, sem narração): fonte, período, método, o que **não** foi
  descontado, "personagens fictícios" e "conteúdo educativo, não é recomendação de investimento".

### Rotação de formatos (não repetir o mesmo formato em dois episódios seguidos)
| Formato | Como é | Exemplo |
| --- | --- | --- |
| **Fábula com regra do mundo** | "Nessa rua, o dinheiro guardado vira árvore." | 001 A árvore de juros |
| **Duas vidas, uma escolha** | dois vizinhos ou dois gêmeos, a mesma renda, uma decisão diferente | "O carro na garagem × o carro no Tesouro" |
| **Carta do futuro** | o personagem de 2040 escreve para o de hoje | "Querida eu de 25 anos" |
| **O julgamento** | um tribunal de bairro julga uma compra (parcelado, cartão, consórcio) | "O réu: 12x sem juros" |
| **O objeto que conta** | o próprio dinheiro narra (uma nota de R$ 100 que perde valor) | "A nota que encolheu" (inflação) |
Variam também: estação/hora do dia, bairro, elenco secundário e a metáfora física do episódio.

## Roteiro
- Frase 1 = o resultado surpreendente em uma linha ("A árvore dela ficou maior. E ela plantou quase dez mil a menos.").
- Frases curtas (5–12 palavras), presente ou passado simples, humor seco; nada de "você sabia", saudação ou "se inscreva".
- Toda afirmação numérica tem linha na tabela de fatos do `roteiro.md` (valor, fonte, cálculo) e é reproduzível por
  `dados/calculo.py`. **Nunca** arredondar para cima o que favorece a moral; dizer "quase", "uns" ou o valor exato.
- Sem promessa de rentabilidade, sem nomes de bancos/corretoras/produtos de marca, sem "invista em X".
- Valores nominais: dizer isso no cartão final (e citar a inflação do período).

## Visual
- Ilustração 2D chapada desenhada em SVG por código (`assets/kit/`, índice em `assets/kit/INDICE.md`): traço
  `#2a2320` de 5 px, cores lisas, sem degradê exceto céu, sem brilho/partículas, sem granulação.
- **Câmera perto e tela cheia:** toda cena acontece num **palco pronto** do kit (`K.palco.cozinha`, `rua`, `loja`
  (mercado/padaria), `tribunal`, `praca`), que enche a tela de cima a baixo: parede ou céu, móveis, chão em
  perspectiva e um **primeiro plano** (mesa, plateia de costas, rua com carro, canteiro...). Atores com `K.ator`:
  pés em y 1400, ~480 px de altura, rosto em y ~1000. Nenhum quadro com a metade de baixo vazia.
- **Vida contínua:** cada palco tem ambiente (`P.ambiente`: nuvens, vapor, carro passando, plateia mexendo).
- Palco novo só quando a história pede um lugar que não existe: entra no kit no mesmo padrão (`palco-<nome>.js`).
- Elenco fixo (`KIT.ELENCO`): Ana (coque, blusa `#2a9d8f`), Bruno (cabelo curto, blusa `#e76f51`), a filha
  (vestido `#ffd166`), vizinho (careca, `#9b5de5`), vizinha (chapéu, `#577590`). Personagens novos entram no kit.
- **Texto dentro da arte** (placas, calendários, carimbos) é legível e faz parte da história; nunca repete a frase
  falada palavra por palavra (balão de fala só para o que não é narrado, ex.: "HA HA HA!").
- Dinheiro = ouro `#f2b134` (moedas, frutos); alerta/data = vermelho `#d64545`; papel das placas `#fff6e3`.
- Fonte única: **Nunito** 700/900 (empacotada). Nada abaixo de 28 px.
- Faixas da tela: texto e números em y 170–740 (x 160–920); rostos e objetos em 740–1150; legenda em 1150–1300
  (sem rosto nem texto ali); pés em 1400; primeiro plano decorativo em 1500–1920 (a interface da plataforma cobre).
- Legenda `story-pop` (`tools/build_captions.py`): 1–3 palavras, 96 px, branca com contorno de 16 px, números e
  palavras-chave em `#ffd23f`, cada palavra entra quando é dita.

## Som
- **Voz única da série**: definida em `niche.json` → `voz` e **nunca trocada** entre episódios (é a marca).
  É uma voz criada no Voice Design só para este canal (nenhum outro nicho usa). O piloto 001 usou "Victor Power",
  de biblioteca; a partir do 002 vale a voz própria.
- **Interpretação, não leitura:** modelo Eleven v3 com audio tags (`prompts/tts.md` tem a paleta da série),
  reticências, travessões e uma palavra em caixa alta por cena. Narrador caloroso, com ironia leve; nunca terror.
- **Ritmo:** a voz é gerada em velocidade normal e acelerada depois com `acelerar` (ffmpeg atempo, sem mudar o tom),
  antes do Whisper. Alvo: ~2,9–3,1 palavras por segundo no áudio final (o piloto 001 tinha 2,5).
- Música procedural suave (`shared/trilha`, `la_menor`, drone + brilho), pulso só na sequência de esforço e uma
  subida antes da medição; efeitos `tique` (calendário), `clique` (moeda), `baque` (números), `deslize` (cortes).
- Mix: voz 1.0, música 0.16, efeitos 0.7.

## Revisão obrigatória antes de publicar (ver `REVISAO.md`)
Nenhum episódio vai ao ar sem a revisão humana de fatos, linguagem e originalidade preenchida no `REVIEW.md` do vídeo.

## Episódios
| Nº | Pasta | Tema | Formato | Estado |
| --- | --- | --- | --- | --- |
| 001 | `videos/001-arvore-de-juros` | Começar cedo × colocar mais (juros compostos, CDI 2010–2025) | Fábula com regra do mundo | piloto renderizado, aprovado (voz antiga) |
| 002 | `videos/002-a-nota-que-encolheu` | Dinheiro parado perde valor (inflação, IPCA 2010–2025) | O objeto que conta | renderizado, aguardando revisão |

## Produção pelo pipeline
`./pipeline temas contos-do-dinheiro` sugere temas com a spec do cálculo; `./pipeline novo contos-do-dinheiro <ID>` produz.
- Etapa `dados` (aprovação): baixa IPCA/CDI/Selic do Banco Central e roda `dados/calculo.py` (cópia de `shared/calculo/`).
- Etapa `roteiro`: o roteiro é recusado se usar o mesmo formato do episódio anterior ou um número que não esteja em
  `dados/fatos.json` (todo valor dito é declarado em `numeros`).
- Etapa `publicar`: bloqueada até o `REVISAO.md` do vídeo estar assinado ("Revisado por: <nome> em <data>") e sem
  nenhum item desmarcado. O `REVIEW.md` é do agente; o `REVISAO.md` é humano.
