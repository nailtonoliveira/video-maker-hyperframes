/hyperframes Crie as cenas 2D deste vídeo vertical (1080 × 1920, 30 fps) da série Contos do Dinheiro: "{{TITULO}}".

Modo sem paradas: não faça perguntas e não ofereça alternativas. Decida e execute. Este projeto faz parte de um workspace com vários vídeos: trabalhe **somente dentro desta pasta** (fora dela, só leitura).

# O que já existe nesta pasta (não recrie do zero!)
Projeto HyperFrames criado do template do nicho, montado e funcionando:
- `assets/kit/`: o **kit visual da série** (SVG por código), dividido por tema. **Leia `assets/kit/INDICE.md`** (todas as peças, assinaturas, ids e as regras de montagem): ele basta para montar as cenas. **Não abra nem dê `cat` nos arquivos do kit**; no máximo abra o `palco-<nome>.js` de um palco que for usar, e para conferir um id ou um detalhe use `grep -n` no arquivo. Ler o kit inteiro custa caro e não é necessário.
  - **Palcos prontos** (`K.palco.cozinha`, `rua`, `loja` com `tipo` mercado/padaria, `tribunal`, `praca`): cada um enche a tela de cima a baixo (parede/céu, móveis, chão em perspectiva, primeiro plano) e traz ambiente animado. **Toda cena usa um palco.** Monte `P.fundo` + (quem fica atrás dos móveis) + `P.moveis` + atores/objetos + `P.frente`, e chame `P.ambiente(tl, T0, 0, DUR)`.
  - **Atores:** `K.ator(id, "ana", P.vagas.esq)` (pés em y 1400, ~480 px). Elenco fixo em `K.ELENCO` (ana, bruno, filha, vizinho, vizinha, joaquim, liaCrianca, lia); gente ao fundo com `K.figurante`, plateia/fila com `K.costas`.
  - **Peça ou palco novo:** escreva **só em `assets/kit/episodio.js`** (mesmo estilo: traço `#2a2320` de 5 px, cores lisas) e acrescente uma linha em `INDICE.md`. Não edite os outros arquivos do kit. Um lugar que não existe vira palco novo em `episodio.js` no mesmo formato (`fundo`, `moveis`, `frente`, `vagas`, `ambiente`), enchendo a tela inteira.
- `index.html`: carrega o kit e monta as cenas (`compositions/<cena>.html`, uma por trecho do roteiro), `compositions/captions.html` (`#captions`), a locução (`#voz`), a música (`#musica`) e os efeitos (`#efeitos`). A raiz e as legendas já estão com {{DURACAO}} s de **voz**; o cartão final (`aviso`) vem depois: some **6 s** ao `data-duration` da raiz (`#root`), sem mexer no de `#captions`.
- `compositions/abertura.html`, `conversa.html`, `revelacao.html`: **cenas de exemplo** do template (rua, cozinha, tribunal) que mostram o padrão: `const T0 = <início absoluto>` e `t(abs)` para agendar tudo **no tempo absoluto da narração**; SVG com `<g id="xx-cam"><g id="xx-mundo">`; mundo montado com o kit em `innerHTML`; timeline GSAP pausada registrada em `window.__timelines`; estados iniciais com `gsap.set(...)` **e** `tl.set(..., 0)`; braços com `K.pose`/`K.turn`. Use como modelo e **apague-as** depois de escrever as cenas do episódio. `compositions/aviso.html`: o cartão final (reescreva as linhas).
- `assets/voice.mp3` (**{{DURACAO}} s**, {{FRAMES}} quadros) e `assets/voice.json` (tempo de cada palavra, do Whisper): é o relógio do vídeo.
- `compositions/captions.html`: legendas já geradas. **Nunca edite.**
- `assets/episode/trilha.json`: a trilha de um episódio anterior, como exemplo do esquema.
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

# Regras visuais (da série; as cenas de exemplo cumprem todas)
- Ilustração 2D chapada, clara e saturada; nada de fundo escuro, brilho, partículas, granulação, degradê (exceto céu), foto ou rosto realista.
- **Tela cheia, câmera perto:** todo quadro tem conteúdo de cima a baixo. A **metade de baixo nunca fica vazia** nem vira chão liso: é chão em perspectiva + primeiro plano do palco. Atores grandes (escala do palco); o assunto da cena é grande e legível.
- **Faixas (1080 × 1920):** texto e números em y 170–740 (x 160–920, `K.PALCO.LIVRE`); rostos, objetos e móveis em 740–1150; legenda em 1150–1300 (**nada de rosto nem texto** ali); pés em 1400; 1500–1920 só decoração (a interface da plataforma cobre).
- Texto só **dentro da arte** (placas, calendários, carimbos, visor, envelope), legível (≥ 28 px na tela); **nunca** repete a frase falada palavra por palavra.
- Algo muda na tela a cada 1–4 s; personagens respiram (`K.idle`) e falam (`K.mouth` alternando `open`/`smile` nas palavras); o ambiente do palco roda a cena inteira.
- Cada cena dura o trecho dela na narração; troque de cena com corte seco ou movimento de câmera curto (≤ 1 s). Varie o palco entre cenas quando a história muda de lugar; close (câmera em 1,2–1,6×) para detalhes, sem perder o fundo.
- Cartão `aviso` (6 s, sem narração): reescreva as linhas com `roteiro.json` → `cartao_final`.

# Ordem de trabalho
1. **`SPEC.md`**: reescreva para este episódio: duração, palcos, metáfora física, elenco, BANNED, e a tabela de cenas com os tempos absolutos e o que a tela faz em cada âncora.
2. **Kit**: leia `assets/kit/INDICE.md`; escreva em `assets/kit/episodio.js` só as peças novas que o episódio pede (e a linha delas no índice).
3. **Cenas**: escreva `compositions/` (uma cena por trecho, cada uma num palco; apague `abertura`/`conversa`/`revelacao` do exemplo se não forem usadas) e o `index.html` (uma cena por trecho, cobrindo 0 → {{DURACAO}} sem buraco, e o `aviso` de {{DURACAO}} até {{DURACAO}} + 6).
4. **`assets/episode/trilha.json`**: mesmo esquema do exemplo, com os tempos deste episódio: `musica` (`tom` `la_menor`/`re_menor`/`mi_menor`, diferente do episódio anterior se possível; `drone` e `brilho` com `env`; `pulso` na passagem do tempo; `subida` antes da revelação dos números) e `efeitos` (`deslize` nos cortes, `tique` em calendário, `clique` em moeda/objeto, `baque` nos números, `estalo` em carimbo). Não gere os `.wav`.
5. **`npm run check`**: corrija todos os erros e pese os avisos (calendário passando rápido em passagem de tempo é aceitável).
6. **Snapshots** (sempre com `--describe false`): `npx hyperframes snapshot --describe false --at <tempos>` com o quadro 0, o meio de cada cena, cada revelação de número e o último quadro da história. **Abra e olhe cada imagem**: tela cheia (metade de baixo com chão e primeiro plano, nunca vazia), assunto grande e legível, nada sobreposto, texto fora da faixa da legenda, último quadro igual ao quadro 0. Corrija e repita até ficar certo.
7. **`REVIEW.md`**: o que cada snapshot mostra, o que foi corrigido e o que ficou pendente (não confunda com `REVISAO.md`, que é humano).
8. **Não renderize** e não deixe servidor de preview rodando.
