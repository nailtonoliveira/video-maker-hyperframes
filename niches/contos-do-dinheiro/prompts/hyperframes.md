/hyperframes Crie as cenas 2D deste vídeo vertical (1080 × 1920, 30 fps) da série Contos do Dinheiro: "{{TITULO}}".

Modo sem paradas: não faça perguntas e não ofereça alternativas. Decida e execute. Este projeto faz parte de um workspace com vários vídeos: trabalhe **somente dentro desta pasta** (fora dela, só leitura).

# O que já existe nesta pasta (não recrie do zero!)
Projeto HyperFrames criado do template do nicho. O **exemplo do template** é o episódio 002 "A nota que encolheu" (85 s), montado e funcionando. **Reescreva-o** para este episódio, aproveitando a estrutura e o estilo:
- `index.html`: monta as cenas (`compositions/<cena>.html`, uma por trecho do roteiro), `compositions/captions.html` (`#captions`), a locução (`#voz`), a música (`#musica`) e os efeitos (`#efeitos`). A raiz e as legendas já estão com {{DURACAO}} s de **voz**; o cartão final (`aviso`) vem depois: some **6 s** ao `data-duration` da raiz (`#root`), sem mexer no de `#captions`.
- `assets/kit.js`: o **kit visual da série** (desenho em SVG por código). Leia o arquivo antes de desenhar: céu, nuvens, chão, casas, árvore, broto, moeda, cerca, placa (`sign`), calendário, pessoa (`person` com bocas e braços animáveis), balão, rua (`street`), quintal em corte (`corte`), **nota de dinheiro com rosto** (`note`), lata (`tin`), envelope, cozinha (`kitchen`), mesa, bolo, produto de mercado, caixa do mercado (`checkout`), e os ajudantes de animação (`pop`, `out`, `mouth`, `counter`, `page`, `idle`). Elenco fixo em `KIT.ELENCO` (ana, bruno, filha, vizinho, vizinha, joaquim, liaCrianca, lia). Peça nova: **acrescente ao kit.js** no mesmo estilo (traço `#2a2320` de 5 px, cores lisas) em vez de desenhar solto na cena.
- `compositions/*.html` do exemplo: abertura, guardar, precos, aniversario, mercado, moral, final e aviso. Cada uma tem `const T0 = <início absoluto>` e `t(abs)`, para agendar tudo **no tempo absoluto da narração**. Use como modelo de estrutura: SVG com `<g id="xx-cam"><g id="xx-mundo">`, mundo montado com o kit em `innerHTML`, timeline GSAP pausada registrada em `window.__timelines`, estados iniciais com `gsap.set(...)` **e** `tl.set(..., 0)`.
- `assets/voice.mp3` (**{{DURACAO}} s**, {{FRAMES}} quadros) e `assets/voice.json` (tempo de cada palavra, do Whisper): é o relógio do vídeo.
- `compositions/captions.html`: legendas já geradas. **Nunca edite.**
- `assets/episode/trilha.json`: a trilha do exemplo, com os tempos do exemplo.
- `roteiro.md` e `roteiro.json`: o roteiro aprovado (locução, visual, âncoras, `cartao_final`, `numeros`). `dados/fatos.json`: os números reais calculados. `../../NICHE.md`: identidade da série. **Siga à risca.**
- `REVISAO.md`: checklist da revisão **humana**. **Não edite** (é a trava de publicação).

# Título na tela
"{{TITULO_TELA}}" pode aparecer como placa dentro da arte no quadro 0; o quadro 0 mostra o **resultado** (o gancho visual) e é recriado idêntico no último quadro da história (loop).

# Sincronização (calculada a partir de assets/voice.json)
Cada cena do roteiro ocupa o intervalo abaixo; cada âncora é o instante em que aquele visual deve acontecer. Confira em `assets/voice.json` a palavra exata e prenda o evento ao início dela. Âncora "?" não foi achada automaticamente: localize você mesmo.

{{TIMELINE}}

# Números que podem aparecer na tela
Só valores de `dados/fatos.json` (os mesmos que a narração diz). Contadores (`K.counter`) terminam no valor exato arredondado como na fala.

{{FATOS}}

# Regras visuais (da série; o exemplo cumpre todas)
- Ilustração 2D chapada, clara e saturada, **um assunto grande no centro**; nada de fundo escuro, brilho, partículas, granulação, degradê (exceto céu), foto ou rosto realista.
- Texto só **dentro da arte** (placas, calendários, carimbos, visor, envelope), legível (≥ 28 px na tela), em y 168–1130; **nunca** repete a frase falada palavra por palavra. A legenda ocupa ~y 1150–1290: não ponha nada importante ali.
- Algo muda na tela a cada 1–4 s; personagens respiram (`K.idle`) e falam (`K.mouth` alternando `open`/`smile` nas palavras).
- Cada cena dura o trecho dela na narração; troque de cena com corte seco ou movimento de câmera curto (≤ 1 s).
- Cartão `aviso` (6 s, sem narração): reescreva as linhas com `roteiro.json` → `cartao_final`.

# Ordem de trabalho
1. **`SPEC.md`**: reescreva para este episódio: duração, palcos, metáfora física, elenco, BANNED, e a tabela de cenas com os tempos absolutos e o que a tela faz em cada âncora.
2. **Kit**: acrescente ao `assets/kit.js` as peças novas que o episódio pede.
3. **Cenas**: reescreva `compositions/` (apague as cenas do exemplo que não servem) e o `index.html` (uma cena por trecho, cobrindo 0 → {{DURACAO}} sem buraco, e o `aviso` de {{DURACAO}} até {{DURACAO}} + 6).
4. **`assets/episode/trilha.json`**: mesmo esquema do exemplo, com os tempos deste episódio: `musica` (`tom` `la_menor`/`re_menor`/`mi_menor`, diferente do episódio anterior se possível; `drone` e `brilho` com `env`; `pulso` na passagem do tempo; `subida` antes da revelação dos números) e `efeitos` (`deslize` nos cortes, `tique` em calendário, `clique` em moeda/objeto, `baque` nos números, `estalo` em carimbo). Não gere os `.wav`.
5. **`npm run check`**: corrija todos os erros e pese os avisos (calendário passando rápido em passagem de tempo é aceitável).
6. **Snapshots** (sempre com `--describe false`): `npx hyperframes snapshot --describe false --at <tempos>` com o quadro 0, o meio de cada cena, cada revelação de número e o último quadro da história. **Abra e olhe cada imagem**: assunto grande e legível, nada sobreposto, texto fora da faixa da legenda, último quadro igual ao quadro 0. Corrija e repita até ficar certo.
7. **`REVIEW.md`**: o que cada snapshot mostra, o que foi corrigido e o que ficou pendente (não confunda com `REVISAO.md`, que é humano).
8. **Não renderize** e não deixe servidor de preview rodando.
