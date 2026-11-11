**Modo A (Nova Identidade)**: o nicho `business-forensics` não existe em `niches/` (hoje só existem `tech-lore` e `ia-lab`), então a série precisa de uma identidade visual completa e original.

# Design Bible: Business Forensics (Impérios, Golpes e Falências Bilionárias)

## Premissas

Tudo o que foi decidido sem perguntar fica registrado aqui. Mudar uma premissa pede revisar as seções citadas.

| # | Premissa | Afeta |
| --- | --- | --- |
| P1 | O motor base é o **`shared/motor-3d/` (v0.1.0)**, o mesmo do `tech-lore`: `createStage`/`createEpisode`, câmera na mão sincronizada com o loop, pós (DOF, desfoque de movimento, vinheta) e o tema vindo de `tema.json`. O palco `createDioramaStage` do `kit3d.js` **não** é usado (ver Decisão D1). | 3, 10, 14 |
| P2 | O nicho nasce com `python3 tools/new_niche.py business-forensics --from tech-lore` e, depois, o kit do tech-lore é podado (ver seção 17). | 14, 17 |
| P3 | O vídeo-modelo tem **52 s** (`LOOP = 52`). A duração real sai do `voice.mp3` (35–75 s), e os tempos do modelo escalam proporcionalmente. | 2, 10 |
| P4 | Público: Brasil, 18–40 anos, celular, interesse em negócios, true crime e mercado financeiro, sem formação em contabilidade. | 0, roteiro |
| P5 | Fontes: as famílias declaradas em CSS (`Barlow Condensed`, `IBM Plex Mono`) são resolvidas e embutidas pelo compilador do HyperFrames, como já acontece com `Inter`/`JetBrains Mono` nos templates atuais. **Verificar no primeiro snapshot** que não caiu em fonte de fallback. | 6, 7, 8 |
| P6 | O texto 3D (CanvasTexture) usa só a fonte de `tema.json → fontes.rotulo3d` (`IBM Plex Mono`), porque o `montar.js` só pré-carrega essa família antes do `build`. | 6, 8, 14 |
| P7 | Nomes reais de empresas e pessoas aparecem **só como texto** (título, etiqueta, placa da torre). Nenhum logotipo, cor de marca ou mascote é reproduzido. | 3, 13 |
| P8 | Os rótulos jurídicos seguem o estado real do caso: `CONDENADO` só com condenação registrada; senão, `ACUSADO`, `INVESTIGADO` ou `FALÊNCIA`. | 8, 13 |
| P9 | A legenda reusa o estilo existente `label-tag` de `tools/build_captions.py`, só com valores em `captions.json`. Nenhuma alteração no script. | 7 |
| P10 | O áudio segue o padrão do tech-lore: trilha procedural `shared/trilha/trilha.py` (3 faixas) + SFX de `shared/sfx/` só nos acertos, mix a −14 LUFS. | 12 |
| P11 | Só existem os 14 SFX presentes em `shared/sfx/` (`click`, `error`, `glitch-1/2/3`, `impact-bass-1/2`, `key-press`, `ping`, `pop`, `riser`, `typing`, `whoosh`, `whoosh-short`). O `CREDITS.md` cita outros (`chime`, `sparkle`…) que **não estão na pasta** e não são usados aqui. | 9, 12 |

---

## 0. Ficha

| Campo | Valor |
| --- | --- |
| Nicho | `business-forensics`: **Business Forensics: Impérios, Golpes e Falências Bilionárias** |
| Modo | A (Nova Identidade) |
| Versão | 1.0 (2026-10-30) |
| Público-alvo assumido | Brasileiros de 18–40 anos, no celular, que consomem true crime e histórias de negócio, mas não leem balanço patrimonial (P4) |
| Formato | 1080 × 1920, 30 fps, 35–75 s (modelo: 52 s), PT-BR |
| Promessa da série | **"Em menos de um minuto, a autópsia de um império: como ele subiu, onde estava a fraude e o instante exato em que tudo caiu."** |

---

## 1. Conceito e gancho da série

### Ideia visual central: "A Mesa da Perícia"
Cada episódio é um **caso aberto numa sala de provas**. Em cima de uma mesa de perícia de mogno escuro, sob uma única
lâmpada de interrogatório, a empresa vira **uma torre de blocos de ouro** (o império). Quem a ergue, quem a frauda,
quem a investiga e quem a derruba são **peças de tabuleiro em escala de maquete** (personagens procedurais sem
esqueleto). A fraude tem sempre uma forma física: **andares ocos** da torre, que por fora parecem ouro maciço e sob a
luz UV da perita viram só aresta (lucro que não existia). O clímax é sempre o mesmo gesto: **o carimbo**
(`FRAUDE`, `FALÊNCIA`, `ACUSADO`) desce e a torre cai. O loop é uma **rebobinagem**: a queda corre ao contrário e
devolve a torre intacta, rachada na base, como estava no quadro 0.

### Pilar emocional
**Tensão com satisfação de descoberta.** O espectador sabe desde o quadro 0 que a torre vai cair (título
`US$ 74 BI → ZERO` e a rachadura vermelha pulsando), e fica para ver **como** e **onde** estava o truque. A curva
emocional é: soberba (ouro subindo) → desconforto (o truque) → revelação (UV) → catarse (carimbo + queda) → ironia
(o detalhe absurdo) → rebobinar.

### Por que retém
1. **Final anunciado, mistério no meio.** O "spoiler" do quadro 0 troca a pergunta "o que acontece?" pela pergunta
   "como foi possível?", que só se responde no fim.
2. **Placar com dinheiro real.** O medidor `VALOR DE MERCADO` sobe e despenca na frente do espectador: número
   concreto, mudando a cada 2–4 s.
3. **Metáforas físicas de 2 s.** Dívida escondida = papel engolido por caixas aninhadas; lucro falso = andar oco;
   pirâmide = peões empilhados. Dá para entender sem áudio.
4. **Gesto ritual repetido em todo episódio** (o carimbo). O público aprende a esperá-lo, como um bordão visual.
5. **Loop por rebobinagem**: o fim devolve o quadro 0 sem corte, e o replay automático parece continuação.

### Três referências de linguagem visual (descritas, sem nomes de obras)
- **R1, mesa de evidências de série policial dos anos 70:** luz de cima, cone de luz quente marcando um círculo na
  mesa, fundo caindo para o escuro, etiquetas de papel amarradas nos objetos, quadro de cortiça com fios vermelhos.
- **R2, maquete de arquitetura em ouro fosco:** volumes simples empilhados com aresta fina escura, sombra dura de
  uma única fonte, escala lida pela comparação com peças de tabuleiro.
- **R3, infográfico editorial de jornal financeiro impresso:** papel marfim, tipografia condensada em caixa alta,
  números em fonte monoespaçada, uma só cor de alerta (vermelho-lacre) e marcação à caneta circulando o dado culpado.

---

## 2. Arco de retenção

### Estrutura dinâmica (N cenas, N = 6 a 9)
O número de cenas depende de quantos **truques** o caso tem (cada truque = 1 cena "Manobra"). Mínimo de 6 cenas,
máximo de 9. Campo `mundo` de cada cena no roteiro: `imperio`, `sala`, `livro` ou `pregao` (seção 3).

| Cena | Papel | Mundo padrão | O que a tela faz | Duração típica |
| --- | --- | --- | --- | --- |
| 1 | **Gancho: o número do colapso** | `imperio` | torre intacta e rachada na base, Magnata comemorando no topo, título do gancho pousado no quadro 0 e medidor no pico | 3–4 s |
| 2 | **Ascensão** | `imperio` (ou `pregao`) | andares nascendo, Manada comprando, setas de ouro entrando na torre, medidor subindo | 6–8 s |
| 3 … N−4 | **A Manobra** (1 cena por truque) | `livro` | o Contador e o truque físico (caixas aninhadas, livro duplo, pirâmide, bolha) dentro do livro-caixa | 6–10 s cada |
| N−3 | **As Rachaduras** | `sala` | a Perita entra, varre com a luz UV, os andares ocos aparecem e o fio vermelho liga as provas | 7–9 s |
| N−2 | **O Colapso (clímax)** | `imperio` | o Fiscal carimba, a torre cai, as moedas estouram, o medidor despenca a zero e a Manada entra em pânico | 8–10 s |
| N−1 | **O Estrago** | `pregao` ou `sala` | consequência: pregão em queda, peões tombados, Magnata `derrotado` | 5–7 s |
| N | **O Detalhe Absurdo + Loop** | `sala` → `imperio` | o detalhe mais irônico (uma etiqueta, um carimbo antigo de "AUDITORIA APROVADA"), depois rebobinagem até o quadro 0 | 4–5 s |

Regra de roteiro que sustenta o arco: **a última frase termina em suspensão e completa a primeira** (ex.: fim
"…e foi assim que setenta e quatro bilhões" → começo "viraram zero em vinte e quatro dias").

### Mapa de tempos do vídeo-modelo (52 s, 7 cenas, 22 planos)
Caso fictício de referência: "Monarca S.A., de US$ 74 bi a zero em 24 dias".

| Janela | O que acontece | Mudança visual (≤ 3 s entre elas) |
| --- | --- | --- |
| **0–1 s** | Quadro 0 já em movimento: câmera em dolly-in + órbita de 8°, torre de ouro ocupando 55 % da altura, rachadura vermelha pulsando na base (período `loopPeriod(LOOP, 0.8)`), Magnata em `celebrate` no topo, auréola girando. Ficha do caso pousada: `US$ 74 BI → ZERO`. Medidor: `US$ 74 BI` em ouro, com `▼` vermelho piscando. | Tudo já em movimento no quadro 0 |
| **1–3 s** | Em 2,20 s (palavra-âncora "24 dias"), corte para close na rachadura da base; o selo de data troca para `24 DIAS`. | Corte + troca da data |
| **3–11 s (ascensão)** | 4,10 plongée: andares nascem com `backOut` · 6,40 rasante na Manada pulando · 8,60 close no Magnata `ganancioso`. Medidor rola de `US$ 2 BI` a `US$ 74 BI` em degraus. | 3 cortes, 9 andares, 6 degraus do medidor |
| **11–31 s (meio)** | 11,6–22,4: Manobra no `livro` (o Contador rabisca, mergulho na página, a linha `DÍVIDA 30 BI` engolida por 3 caixas aninhadas) · 22,4–31,0: Rachaduras na `sala` (a Perita entra, a luz UV revela 4 andares ocos, o fio vermelho liga PROVA A→B→C). O medidor começa a piscar em vermelho em 29,0 s. | Corte a cada 2,0–2,6 s, e dentro dos planos: caixa fechando, fio crescendo, andar ficando oco |
| **31–41 s (clímax)** | 31,0 contra-plongée do Fiscal · **33,4 carimbo `FRAUDE`** (slam 2D + 3D, tremor) · 35,0 a torre desaba e as moedas estouram · 37,6 o medidor despenca a `US$ 0` e a Manada entra em pânico. 0,6 s de silêncio musical logo após o carimbo. | Maior densidade de eventos do vídeo |
| **41–49 s** | Estrago (pregão com `queda(k)`, peões tombados, Magnata `derrotado`) + detalhe absurdo (macro na etiqueta `AUDITORIA: APROVADA`, carimbada 3 meses antes). | Cortes a cada 2,2 s |
| **Últimos 3 s → loop** | 49,6–52,0: **rebobinagem**. A queda corre ao contrário em `p3io` (blocos, moedas, peões, auréola), o medidor rola de volta a `US$ 74 BI`, a ficha do gancho remonta em wipe a partir de 51,4 s e a câmera chega exatamente a `p0/l0` do plano 1 em `t = LOOP`. | Rebobinagem contínua até o quadro 0 |

---

## 3. Mundo e cenário

### Palco principal: a Sala de Provas (mundo `sala`, base de todos os outros)
- **Mesa de perícia**: tampo em `y = 0` (mesma convenção do kit3d), 14 × 9 u, 0,9 u de espessura, em 7 tábuas de
  mogno (Box 14 × 0,9 × 1,26 com junta de 0,04 u entre elas), cores alternadas em `slabs`. Por cima, um **mata-borrão
  de livro-caixa** (Plane 9,6 × 6,0 u em `y = 0,005`) com textura procedural de papel pautado.
- **Quadro de conexões** na parede do fundo (`z = −9`): Plane de cortiça 10 × 6 u, centro em `y = 4,2`, com até 6
  cartões marfim presos (Box 1,4 × 0,9 × 0,02) e fios vermelhos (`makeRedString`). É o fundo de todos os planos que
  olham para −z.
- **Lâmpada de interrogatório**: abajur cônico (Lathe aberto, raio 0,9 u, altura 0,7 u, cor `#1c1214`) em
  `(0, 9, 0)`, com SpotLight e um cone de luz visível (Cylinder aberto, raio do topo 0,1, da base 5,2, altura 9,
  `MeshBasicMaterial` `#fff1d6` com opacidade 0,05, `depthWrite: false`). Ela recorta o círculo de luz quente na mesa.
- **Paredes laterais**: lambri vertical (textura procedural), a 11 u do centro, para que planos abertos nunca
  mostrem vazio preto.

### Variações por episódio (o que muda e o que fica)
Muda: **o nome do caso, a forma do império, o truque físico, o carimbo e a consequência**. Fica: a mesa, a
lâmpada, o quadro, o elenco, a paleta e o arco.

| Mundo | Onde | Uso |
| --- | --- | --- |
| `imperio` | close na torre sobre a mesa (a sala desfocada ao fundo, `ap` baixo) | gancho, ascensão, colapso, loop |
| `sala` | mesa inteira + quadro de conexões | investigação, provas, detalhe absurdo |
| `livro` | **dentro do livro-caixa**: a câmera mergulha na página, que vira chão (36 × 24 u, base fixa em `(0, −200, 0)`, perto da origem, como pede o motor) | a Manobra: linhas contábeis gigantes no chão (`floorLabel`), o truque acontecendo sobre os números |
| `pregao` | reuso de `makeTradingFloor()` do kit do tech-lore, recolorido pelo `tema.json` | ascensão pela bolsa (`telas(valor)`) e estrago (`queda(k)`) |

Forma do império por tipo de caso (parâmetro de `makeEmpireTower`): `torre` (empresa única, 6–14 andares), `rede`
(franquia ou grupo: 5–9 torres baixas ligadas por `createFlowArrow`), `piramide` (esquema de pirâmide:
`makePonziPyramid` com peões da Manada).

### Configuração do tema no formato do kit
Objeto `TEMA_SALA` (mesmas chaves de `STAGE_THEMES` do `kit3d.js`, consumido por `makeEvidenceRoom`) **+**
`SKIES_BF` no formato `skies` do motor. **[NEW]** em `assets/kit/sala.js`.

```js
export const TEMA_SALA = {
  skyTop: 0x0d0708, skyMid: 0x1e0f12, skyBot: 0x080405,        // domo do motor (só aparece além das paredes)
  wallTop: "#1a0d10", wallMid: "#2b1418", wallBot: "#120809",  // degradê do lambri
  plank: "#2b1418", plankAlt: "#24110f", plankSeam: "#120809", // tábuas do lambri: 64 px, junta de 2 px
  cork: "#5a3f2e", corkDot: "rgba(18, 8, 9, 0.35)",            // cortiça: pontos fixos rng(seed), 1 200 pontos
  gridMinor: "rgba(107, 91, 82, 0.22)",                        // pauta do mata-borrão: linha a cada 32 px
  gridMajor: "rgba(107, 91, 82, 0.45)",                        // colunas de valores: a cada 256 px
  marginLine: "rgba(179, 38, 30, 0.80)",                       // margem vermelha do livro-caixa, x = 96 px
  wallLabel: "SALA DE PROVAS // CASO Nº {n}",                  // serigrafia na porta do arquivo (IBM Plex Mono 700)
  hemiSky: 0xf6e7cf, hemiGround: 0x1a0d10, hemiI: 0.55,
  keyColor: 0xfff1d6, keyI: 38, keyAngle: 0.52, keyPenumbra: 0.45, // SpotLight da lâmpada (decay 2, distance 30)
  rimColor: 0x9b8cff, rimI: 0.9,                               // contra-luz UV (direcional em (−10, 7, −9))
  slabs: [0x2b1a1d, 0x33201f, 0x281719, 0x2f1d1f],             // tábuas de mogno da mesa
  seam: 0x120809,
  matBg: "#e4d6b8", matGrid: "rgba(107, 91, 82, 0.35)", matBorder: "rgba(179, 38, 30, 0.85)",
  bumper: 0x1c1214, led: 0xe9b949, bolt: 0xa3958a,             // borda da mesa, filete de latão, tachas
};

export const SKIES_BF = {
  sala:   { top: 0x0d0708, mid: 0x1e0f12, bottom: 0x080405, fog: 0x1a0d10, fogNear: 14, fogFar: 46 },
  imperio:{ top: 0x0d0708, mid: 0x24121a, bottom: 0x080405, fog: 0x1e0f12, fogNear: 10, fogFar: 34 },
  livro:  { top: 0x1a1210, mid: 0x2e211b, bottom: 0x0e0907, fog: 0x241914, fogNear: 8,  fogFar: 30 },
  pregao: { top: 0x120a0b, mid: 0x2a1a1c, bottom: 0x0b0607, fog: 0x1e1214, fogNear: 12, fogFar: 40 },
};
```

`tema.json` do nicho (validado por `tools/motor.py`):

```json
{
  "cores": {
    "chao": "#120a0b", "tinta": "#f2e8d5", "secundaria": "#a3958a", "ok": "#e9b949",
    "alerta": "#ff5a3c", "destaque": "#9b8cff", "ardosia": "#3b2428", "morto": "#4a1512"
  },
  "fontes": { "rotulo3d": "IBM Plex Mono" },
  "material": "maquete",
  "pos": { "vinheta": 0.55, "obturador": 0.4, "aberracao": 0, "granulacao": 0, "exposicao": 1 }
}
```

Atenção: no motor, `COL.mint` lê o papel `ok`, que aqui é **ouro**, e `COL.cyan` lê `destaque`, que aqui é **violeta
UV**. Para não confundir, o kit expõe aliases **[NEW]** em `assets/kit/cores.js`:
`export const C = { ouro: COL.mint, fraude: COL.alert, uv: COL.cyan, papel: COL.ink, taupe: COL.gray, chao: COL.ground, mogno: COL.slate, morto: COL.dead, lacre: 0xb3261e, nanquim: 0x1c1214 }`.
Episódios usam `C.*`, nunca `COL.mint`/`COL.cyan`.

### Texturas procedurais (CanvasTexture, desenhadas **uma vez** no `build`, nunca por quadro)
| Textura | Tamanho | Conteúdo |
| --- | --- | --- |
| Lambri | 1024 × 1024 | tábuas de 64 px alternando `plank`/`plankAlt`, juntas de 2 px em `plankSeam` e degradê vertical `wallTop → wallMid → wallBot` multiplicado |
| Cortiça | 1024 × 640 | `cork` + 1 200 pontos de 2–4 px de `rng(seed)` em `corkDot` e moldura de 24 px em `#2b1418` |
| Mata-borrão / página do livro | 2048 × 1280 | `matBg`, pauta a cada 32 px, colunas a cada 256 px, margem vermelha em x = 96 e, no `livro`, os lançamentos (IBM Plex Mono 700, 44 px) |
| Placa da torre | 512 × 128 | nome da empresa em IBM Plex Mono 700 72 px, `#1c1214` sobre `#e9b949` |
| Rostos (por personagem) | ver seção 4 | expressões desenhadas por estado, com cache pela chave do estado |

### Props recorrentes
Torre do Império (blocos de ouro), Livro-Caixa, Pilha de Moedas, Explosão de Moedas, Caixas Aninhadas (empresas de
fachada), Pirâmide de Peões, Bolha (esfera facetada que infla e estoura), Etiqueta de Prova, Fio Vermelho, Pasta do
Caso, Carimbo (preso ao Fiscal) e Marca do Carimbo (decalque).

### Luz e sombra
- **Uma única fonte de sombra**: o SpotLight da lâmpada, `shadow.mapSize 2048²`, `bias −0.0004`, ângulo 0,52 rad.
  O resto não projeta sombra.
- Hemisférica fraca (`hemiI 0.55`) para nada ficar preto absoluto. Contra-luz direcional violeta `#9b8cff`
  (`rimI 0.9`) desenhando o contorno das peças contra o fundo vinho.
- No `livro`: a SpotLight desce para `y = 14` sobre a base do mundo, com o círculo de luz centrado na linha do truque.
- **Alarme** (`update(t, { alarm })` 0→1): `keyColor` vai em direção a `#ff5a3c` (até 45 %), o filete de latão da
  mesa fica vermelho e o cone de luz vai a opacidade 0,08.
- **UV** (`update(t, { uv })` 0→1): `keyI` cai para 30 %, `rimI` sobe a 2,2 e o cone da lanterna da Perita aparece.

### Escala e unidades
- **1 u = 1 "metro de maquete"**: personagem padrão com 2,0–2,5 u, peão da Manada com 0,9 u, andar da torre com
  0,6 u de altura e 2,4 × 2,4 u de base, torre de 6–14 andares (3,6–8,4 u).
- Tampo em `y = 0`. Tudo pousa no tampo, nada flutua sem motivo (exceção: a auréola do Magnata).
- Mundo `livro` numa base fixa `(0, −200, 0)`, alternado por `visible`. Nada passa de ±300 u da origem.

---

## 4. Elenco (procedural)

Princípios comuns:
- Personagens são **peças de tabuleiro sem esqueleto**: grupos aninhados (`root → rig → partes`) animados por
  rotação, posição e escala como **funções puras de `t`**. Nenhum estado entre quadros.
- Estilo maquete do motor: `fill(cor)` com `flatShading` + `edge(C.nanquim, 0.9)` de 1 px via `solid()`.
- **Toda periodicidade usa `P = loopPeriod(LOOP, desejado)`**, e cada `act()` recebe `P` do episódio.
- **Rostos**: CanvasTexture redesenhada só quando a chave `estado:piscada` muda. O cache é só um otimizador: o
  resultado depende apenas de `(estado, piscada)`, então buscar quadros fora de ordem dá a mesma imagem.
- Piscada: `blink(t, loopPeriod(LOOP, 3.2), fase, 0.06)` do motor.
- Assinatura do builder: `makeX(opts) → { group, act(t, modo, o), rosto(estado) }`, com `o = { P, k, t0, seed }`.
  Ficam em `assets/kit/elenco.js`. **[NEW]** (por que não reusar `createBlockAgent`: ver D6).

### Teste de silhueta (preto chapado a 15 % da largura = 162 px)
| Personagem | Traço que sobrevive em 162 px | % da caixa da silhueta |
| --- | --- | --- |
| O Magnata | "V" de ombros largos + bolinha da cabeça + **anel flutuante** | anel = 36 % da largura, V = 100 % |
| A Perita | **cabeça de lupa (anel com cabo)** sobre um sino | anel = 84 % da largura |
| O Contador | escada de **livros empilhados desalinhados** + caixa da cabeça | livros = 50 % da altura |
| A Manada | **peão** de tabuleiro, sempre em grupo de ≥ 12 | grupo = forma de multidão |
| O Fiscal | **retângulo alto de arquivo de aço + martelo em "T"** (carimbo) | carimbo = 45 % da largura |

Nenhum deles usa cápsula com domo e anel de levitação (droides do ia-lab) nem forma de inseto (bug do tech-lore).
Também não usam cartola, monóculo nem bigode, para não lembrar mascotes conhecidos.

---

### 4.1 O Magnata, **[NEW]** `makeMagnata({ escala = 1, nome = "" })`
- **Papel narrativo:** o fundador/CEO. Encarna a ascensão e a queda.
- **Personalidade:** vaidoso, expansivo, cego.
- **Silhueta (escala de mundo, altura total 2,35 u):**
  - Base: Cylinder r 0,34, h 0,16 (pedestal de peça), `#1c1214`.
  - Torso: **Extrude** de trapézio (topo 1,30 u, base 0,62 u, altura 1,25 u), profundidade 0,55, bevel 0,04 →
    o "terno de poder" em V, `#2b1a1d`, de `y 0,16` a `y 1,41`.
  - Gravata: Extrude de losango 0,22 × 0,70 × 0,04, ouro `#e9b949`, na frente do torso.
  - Braços: Box 0,16 × 0,62 × 0,16 articulados no ombro (pivô em `(±0,62, 1,36, 0)`), `#2b1a1d`.
  - Cabeça: Sphere r 0,30 em `y 1,72`, cera `#d9c4a0`.
  - Óculos-visor: Box 0,50 × 0,13 × 0,08 na frente da cabeça, `#120a0b`, com CanvasTexture dos olhos.
  - **Auréola do sucesso:** Torus R 0,42, r 0,05, ouro `#e9b949`, flutuando em `y 2,25`, inclinada 12°.
- **Cor de papel:** ouro `#e9b949` (C.ouro).
- **Expressões** (visor 256 × 64, fundo `#120a0b`, traço `#f2e8d5`):
  `confiante` (olhos meia-lua + sobrancelha direita erguida) · `ganancioso` (olhos em losango ouro `#e9b949`) ·
  `nervoso` (pontos de 8 px + gota de suor, uma Sphere r 0,05 `#9b8cff` na têmpora) · `pego` (círculos de 28 px +
  sobrancelhas altas) · `derrotado` (arcos para baixo + sobrancelhas caídas).
- **Ações** (`P1 = loopPeriod(LOOP, 2.4)`, `P2 = loopPeriod(LOOP, 0.5)`, `P3 = loopPeriod(LOOP, 0.11)`):
  - `idle`: `rig.rotation.z = 0.035·sin(2πt/P1)`; `rig.position.y = 0.02·(1 − cos(2πt/P1))`; auréola
    `rotation.y = 2π·n·t/LOOP` com `n = round(LOOP/4)`.
  - `celebrate`: `y = 0.22·|sin(πt/P2)|`; squash ao tocar a base, `scale.y = 1 − 0.12·max(0, cos(2πt/P2))`; braços
    `rz = ±2.5`; auréola com `n·3`.
  - `point(o.t0)`: braço direito `rx = −1.35·E.backOut(seg(t, t0, t0 + 0.30))`; tronco `rx = 0.08`.
  - `panic`: `rz = 0.06·sin(2πt/P3)`; `x = 0.03·sin(2πt/P3 + 1.1)`; auréola balança `rx = 0.3·sin(2πt/P3)`; rosto `pego`.
  - `fall(o.k)`: `rx = 1.35·E.p2in(k)`; `y = −0.4·k`; a auréola se parte em 2 metades (dois Torus de arco π),
    que se afastam `x ± 0.5·k` e caem `y −1.6·k²`. Rosto `derrotado`.
- **Regra de uso:** já está no topo da torre no quadro 0. Sai de cena só caindo (`fall`). **Nunca** entra no mundo
  `livro`, nunca toca no livro-caixa e nunca sorri (`celebrate`/`confiante`) depois do carimbo, exceto na
  rebobinagem.

### 4.2 A Perita, **[NEW]** `makePerita({ escala = 1 })`
- **Papel narrativo:** auditora, jornalista ou investigadora. É o olhar do espectador.
- **Personalidade:** metódica, fria, implacável.
- **Silhueta (altura 2,50 u):**
  - Corpo: **Lathe** em sino de sobretudo (perfil: r 0,22 em y 1,15 → r 0,55 em y 0), bege-dossiê `#cbbd9f`.
  - Gola: 2 Box 0,28 × 0,30 × 0,04 inclinadas ±20°, `#a3958a`.
  - Pescoço/cabo: Cylinder r 0,07, h 0,40, `#1c1214`, de y 1,15 a 1,55.
  - **Cabeça-lupa:** Torus R 0,46, r 0,08, violeta `#9b8cff`, centro em y 2,02, de frente para +z. Dentro dele, a
    lente: Cylinder r 0,40, h 0,03 (deitado no eixo z), com CanvasTexture do **olho único**.
  - Lanterna UV: Cylinder r 0,07, h 0,36, `#1c1214`, na mão direita (Sphere r 0,09 `#cbbd9f`) e com cone
    (Cylinder aberto, r 0,05 → 1,4, h 4, `#9b8cff`, opacidade 0,18, `depthWrite: false`).
- **Cor de papel:** violeta UV `#9b8cff` (C.uv).
- **Expressões** (lente 256 × 256, íris `#9b8cff`, pupila `#120a0b`, esclera `#f2e8d5`): `scan` (pupila em
  Lissajous, `x = 40·sin(2πt/Ps)`, `y = 18·sin(4πt/Ps)`) · `foco` (pupila 60 % menor + pálpebras retas a 30 %) ·
  `descoberta` (íris 130 % + 3 traços de espanto acima da lente) · `desconfiada` (pálpebra de cima a 45 %, reta) ·
  `piscada`.
- **Ações** (`Ps = loopPeriod(LOOP, 2.0)`):
  - `idle`: respiração, `scale.y = 1 + 0.015·sin(2πt/loopPeriod(LOOP, 3.2))`.
  - `scan`: `rig.rotation.y = 0.45·sin(2πt/Ps)`; a lanterna acompanha com atraso de fase de 0,4 rad.
  - `lean(o.k)`: `rx = 0.30·E.p2out(k)` (inclina sobre a prova).
  - `point(alvo, o.k)`: o braço da lanterna gira até mirar `alvo` (interpolação de quaternion com `E.p3io(k)`).
  - `nod(o.t0)`: `rx = 0.12·sin(π·seg(t, t0, t0 + 0.5))` (aceno único).
- **Regra de uso:** entra na cena das Rachaduras, sempre sob a lâmpada. **Nunca** pula, nunca entra em pânico, nunca
  comemora (a reação máxima é `nod`) e nunca aparece no gancho, a menos que o caso comece pela investigação.

### 4.3 O Contador, **[NEW]** `makeContador({ escala = 1, livros = 4 })`
- **Papel narrativo:** quem executa a manobra (contador, CFO, operador).
- **Personalidade:** ansioso, servil, engenhoso.
- **Silhueta (altura 1,75 u, o mais baixo do elenco):**
  - Pernas: 2 Box 0,14 × 0,30 × 0,14, `#1c1214`.
  - Corpo: **pilha de 4 livros** (Box 0,90 × 0,22 × 0,62), deslocados `x = [0, +0.06, −0.05, +0.04]` e
    `rotation.y = [0, 4°, −3°, 5°]`. Capas alternando `#3b2428` / `#5c1f1f` / `#2b1a1d`, com uma face de páginas
    `#e4d6b8` (Box fino 0,02 u, rebaixado).
  - Cabeça: Box calculadora 0,62 × 0,52 × 0,30, `#1c1214`, com tela LCD (Plane 0,50 × 0,22) e 6 teclas (Box 0,08³,
    `#a3958a`).
  - Braços: Cylinder r 0,05, h 0,45, com mão Sphere r 0,07. Na direita, um lápis (Cylinder r 0,03, h 0,40, ponta
    Cone ouro).
- **Cor de papel:** vinho `#5c1f1f` com LCD ouro `#e9b949`.
- **Expressões** (LCD 256 × 96, fundo `#1c1214`, segmentos `#e9b949`): `normal` (`o o`) · `calculando` (`o o` + uma
  linha `######` rolando, 1 caractere por `loopPeriod(LOOP, 0.1)`) · `nervoso` (`° °` + gota de suor) · `pego`
  (`O O` + `ERR` em `#ff5a3c`) · `escondido` (`- -`).
- **Ações** (`Pw = loopPeriod(LOOP, 0.18)`, `Pn = loopPeriod(LOOP, 0.35)`):
  - `idle`: `y = 0.015·sin(2πt/loopPeriod(LOOP, 1.6))`.
  - `scribble` (maquiar): braço do lápis `rz = 0.5 + 0.25·sin(2πt/Pw)`; corpo `y += 0.01·|sin(2πt/Pw)|`.
  - `nervous`: cada livro `i` desliza `dx_i = 0.05·sin(2πt/Pn + 1.3·i)`; rosto `nervoso`.
  - `hide(o.k)`: squash `scale.y = 1 − 0.25·E.backOut(k)`, `scale.x = 1 + 0.10·k`; rosto `escondido`.
  - `topple(o.k)`: os livros se soltam em parábola, `p_i = p0_i + v_i·k − (0, 4.9·k², 0)`, com
    `v_i = (hash(i,1) − 0.5, 1 + hash(i,2), hash(i,3) − 0.5)·1.2`.
- **Regra de uso:** só nas cenas de Manobra e no mundo `livro`. **Nunca** no topo da torre, nunca no quadro 0/loop,
  nunca na mesma tomada que o Fiscal antes do carimbo.

### 4.4 A Manada, **[NEW]** `makeManada({ count = 36, cols = 9, spacing = 0.75, seed = 5 })`
- **Papel narrativo:** investidores, acionistas, clientes ou funcionários. O "nós" da história.
- **Personalidade:** crédula, eufórica, volúvel.
- **Silhueta (altura 0,90 u):** peão em **Lathe** (perfil: base r 0,32 em y 0 → cintura r 0,12 em y 0,42 → colar r 0,20
  em y 0,52 → pescoço r 0,10 em y 0,60), mais cabeça Sphere r 0,17 em y 0,76. Marfim `#f2e8d5`.
- **Técnica:** **1 `InstancedMesh`** para o corpo + 1 `InstancedMesh` de casca (mesma geometria escalada 1,06,
  `side: BackSide`, `#1c1214`) no lugar das arestas, que não se instanciam (ver D10). Cor por instância com
  `setColorAt`.
- **Expressão:** coletiva (não há rosto, é pequeno demais): cor e movimento.
  `euforia` (marfim → ouro 35 %) · `duvida` (marfim) · `panico` (marfim → `#ff5a3c` 40 %) · `ruina` (→ `#6b5b52`).
- **Ações** (`Pe = loopPeriod(LOOP, 0.6)`; `i` = índice, `c` = coluna):
  - `euforia`: `y_i = 0.25·max(0, sin(2πt/Pe − 0.35·c))` (onda de "ola"), com squash `scale.y = 1 − 0.1·(1 − y_i/0.25)` no chão.
  - `duvida(o.k)`: inclinação `0.12·k` em direção ao centro da torre.
  - `panico(o.k)`: raio `r_i += 1.8·E.p2out(k)·(0.6 + 0.4·hash(i, 3))`, mais um tremor
    `0.03·sin(2πt/loopPeriod(LOOP, 0.12) + 6.28·hash(i, 4))`.
  - `ruina(o.k)`: `rx_i = 1.5708·E.p2in(seg(k, d_i, d_i + 0.4))`, com `d_i = 0.5·hash(i, 7)` (tombam em cascata).
- **Regra de uso:** sempre em grupo de ≥ 12. Nunca sozinha, nunca com rosto, nunca na frente do Magnata no
  enquadramento do gancho.

### 4.5 O Fiscal, **[NEW]** `makeFiscal({ escala = 1, texto = "FRAUDE" })`
- **Papel narrativo:** regulador, justiça, mercado, credores. A consequência.
- **Personalidade:** lento, inevitável, seco.
- **Silhueta (altura 2,30 u, carimbo até 2,90 u):**
  - Corpo: **arquivo de aço**, Box 0,95 × 1,90 × 0,75, ardósia `#3b2428`, sobre 4 pés Box 0,10 × 0,12 × 0,10.
  - 3 gavetas: Box 0,85 × 0,52 × 0,04 salientes, cada uma com puxador (Box 0,30 × 0,05 × 0,06, `#a3958a`) e
    porta-etiqueta (Plane 0,30 × 0,12 com texto IBM Plex Mono: `2001`, `PROVAS`, `AUTOS`).
  - Visor: fenda Plane 0,70 × 0,12 na gaveta de cima, com CanvasTexture.
  - **Carimbo** (braço direito): cabo Cylinder r 0,12, h 0,50 + pomo Sphere r 0,16, `#1c1214`, e base Box
    0,80 × 0,22 × 0,50 vermelho-lacre `#b3261e`. Pivô no ombro, em `(0,62, 1,70, 0)`.
- **Cor de papel:** vermelho-lacre `#b3261e`.
- **Expressões** (fenda 256 × 48, fundo `#120a0b`, traço `#f2e8d5`): `neutro` (duas barras horizontais) ·
  `veredito` (barras inclinadas ±12° para dentro, em `#ff5a3c`) · `fechado` (uma linha).
- **Ações:**
  - `idle`: **imóvel**. Só a piscada do visor. A imobilidade é a personalidade.
  - `advance(o.k)`: `z = z0 + D·E.p3io(k)`, sem quique.
  - `raise(o.k)`: carimbo `y_rel = 0.9·E.p2out(k)`, `rx = −0.6·k`.
  - `slam(o.t0)`: em `[t0 − 0.14, t0]`, carimbo `y_rel = 0.9·(1 − E.p2in(seg)²)`, tocando no instante exato `t0`;
    depois, `scale.y` do corpo `0.92 → 1` em 0,18 s (`backOut`) e tremor de câmera (seção 9). O decalque
    `makeStampMark(texto)` aparece no ponto de impacto.
  - `drawer(o.k)`: a gaveta de cima sai `z += 0.6·E.p2out(k)` e mostra um documento.
- **Regra de uso:** **uma entrada por episódio**, no clímax, sempre depois de a Perita mostrar a prova. Nunca quica,
  nunca corre, nunca aparece no gancho nem no loop.

---

## 5. Paleta

### Tokens
| Token | Hex | Papel semântico | Uso 3D | Uso HUD 2D |
| --- | --- | --- | --- | --- |
| `chao` | `#120a0b` | neutro mais escuro | chão da sala, domo inferior | — |
| `nanquim` | `#1c1214` | neutro escuro, tinta | arestas de 1 px, pedestais, cabos | fundo do medidor e do selo de data; texto sobre papel |
| `mogno` (`ardosia`) | `#3b2428` | neutro médio | Fiscal, capas de livro, tábuas | — |
| `papel` (`tinta`) | `#f2e8d5` | neutro claro, documento | Manada, etiquetas, cartões | fundo da ficha e das legendas; texto sobre escuro |
| `taupe` (`secundaria`) | `#a3958a` | secundário, rótulo | puxadores, tachas, gola | rótulos do medidor sobre `nanquim` |
| `sepia` | `#6b5b52` | secundário sobre papel, ruína | peões em `ruina` | sobrelinha da ficha sobre `papel` |
| `ouro` (`ok`) | `#e9b949` | **valor, ascensão, lucro** | blocos da torre, moedas, auréola, setas de entrada | número do medidor em alta, borda do medidor |
| `fraude` (`alerta`) | `#ff5a3c` | **erro, fraude, queda** | rachadura, alarme, andar condenado, setas de saída | número do medidor em queda, `▼`, borda em alarme |
| `lacre` | `#b3261e` | **veredito, palavra falada** | base do carimbo, decalque | fundo do carimbo 2D e da palavra ativa da legenda |
| `creme` | `#fff4e0` | texto sobre lacre | — | texto do carimbo e da palavra ativa |
| `uv` (`destaque`) | `#9b8cff` | **evidência, pista, descoberta** | Perita, luz UV, aresta de andar oco, contra-luz | texto `PROVA` sobre `nanquim` |
| `violeta-tinta` | `#4c35b8` | evidência sobre papel | texto de etiqueta de prova | sublinhado de prova sobre `papel` |
| `morto` | `#4a1512` | colapsado | blocos depois da queda, escombros | — |
| `cera` | `#d9c4a0` | pele de peça | cabeça do Magnata | — |
| `bege` | `#cbbd9f` | sobretudo | corpo da Perita | — |

**Diferença das séries existentes:** o tech-lore é azul-noite (`#080a0f`) com menta, ciano e magenta; o ia-lab é
grafite com âmbar em toda a luz. Aqui o ambiente é **vinho-escuro + papel marfim**, o ouro aparece **só como
material** (dinheiro, nunca como luz de cena) e o acento frio é **violeta UV**. **Não existe verde** na série.

### Contraste WCAG (texto/fundo, mínimo 4,5:1)
| Texto | Fundo | Razão | Onde |
| --- | --- | --- | --- |
| `papel #f2e8d5` | `chao #120a0b` | **16,1 : 1** | rótulos 3D claros sobre a sala |
| `papel #f2e8d5` | `nanquim #1c1214` | **15,1 : 1** | valor neutro do medidor, selo de data |
| `nanquim #1c1214` | `papel #f2e8d5` | **15,1 : 1** | título da ficha, legenda inativa, etiquetas |
| `papel #f2e8d5` | `mogno #3b2428` | **11,8 : 1** | etiquetas das gavetas do Fiscal |
| `ouro #e9b949` | `nanquim #1c1214` | **10,0 : 1** | número do medidor em alta |
| `ouro #e9b949` | `chao #120a0b` | **10,7 : 1** | placa da torre (inversa: `nanquim` sobre `ouro`, 10,0 : 1) |
| `uv #9b8cff` | `nanquim #1c1214` | **6,6 : 1** | `PROVA A` no HUD |
| `uv #9b8cff` | `chao #120a0b` | **7,1 : 1** | rótulo 3D de evidência |
| `taupe #a3958a` | `nanquim #1c1214` | **6,3 : 1** | rótulo `VALOR DE MERCADO` |
| `fraude #ff5a3c` | `nanquim #1c1214` | **5,9 : 1** | número do medidor em queda, `▼ 99%` |
| `fraude #ff5a3c` | `chao #120a0b` | **6,3 : 1** | rótulo 3D de alerta |
| `creme #fff4e0` | `lacre #b3261e` | **6,0 : 1** | carimbo 2D, palavra ativa da legenda |
| `lacre #b3261e` | `papel #f2e8d5` | **5,4 : 1** | decalque do carimbo sobre documento 3D, sublinhado |
| `violeta-tinta #4c35b8` | `papel #f2e8d5` | **6,9 : 1** | texto de etiqueta de prova |
| `sepia #6b5b52` | `papel #f2e8d5` | **5,3 : 1** | sobrelinha da ficha (`CASO Nº 001 · 2001`) |

**Pares proibidos (abaixo de 4,5:1):** `ouro` sobre `papel` (1,5), `uv` sobre `papel` (2,3), `fraude` sobre
`papel` (2,6) e `lacre` sobre `nanquim` (2,8).

---

## 6. Tipografia

Duas famílias, ambas OFL (Google Fonts):

| Uso | Fonte | Peso | Tamanho (1080 × 1920) | Tracking | Caixa | Máx. caracteres/linha |
| --- | --- | --- | --- | --- | --- | --- |
| Título da ficha | **Barlow Condensed** | 800 | 92 px (mín. 76 px se 2 linhas) | −1 % | ALTA | 18 (2 linhas no máx.) |
| Sobrelinha da ficha | **IBM Plex Mono** | 700 | 30 px | +6 % | ALTA | 28 |
| Legenda | Barlow Condensed | 900 (fixo no `label-tag`) | 58 px | 0 | como falado (frase) | 20 por grupo (`max_chars`) |
| Rótulo do medidor | IBM Plex Mono | 700 | 28 px | +8 % | ALTA | 18 |
| Valor do medidor | IBM Plex Mono | 700 | 64 px | −2 % | ALTA | 10 (`US$ 1,2 TRI`) |
| Delta do medidor | IBM Plex Mono | 700 | 36 px | 0 | ALTA | 7 (`▼ 99%`) |
| Selo de data | IBM Plex Mono | 700 | 40 px | +4 % | ALTA | 10 (`OUT 2001`) |
| Carimbo 2D | Barlow Condensed | 800 | 128 px | +4 % | ALTA | 10 |
| Texto 3D (etiquetas, placa, livro, gavetas) | IBM Plex Mono (`rotulo3d`) | 700 (sempre explícito no `label()`) | **altura projetada ≥ 28 px**: `worldH ≥ 0,0136·d` para o x-height, ou na prática `worldH ≥ 0,02·d` para a etiqueta toda (fov 50, d = distância à câmera) | 0 | ALTA | 16 |

Regras:
- Nada abaixo de 28 px na tela final, nem texto 3D (vale a fórmula de `worldH`).
- Valores numéricos só em IBM Plex Mono: é monoespaçada, então o número não "dança" ao rolar.
- O IBM Plex Mono vai até 700. O `montar.js` pede 800 e 700, o navegador resolve 800 → 700. Toda chamada
  `label(..., weight)` passa **700**, nunca o padrão 800 (risco de negrito sintético).
- Formato de número PT-BR: `US$ 74 BI`, `R$ 1,2 TRI`, `R$ 40 MI`, vírgula decimal (reusa `fmtNum` de `telas.js`).

---

## 7. Legendas

**Estilo: reuso de `label-tag`** (sem código novo), configurado como **etiquetas de prova**: cada palavra é uma
etiqueta de papel com borda e sombra dura escuras, levemente girada (±1,1–1,6°, fixo no script), e a palavra
falada vira **etiqueta de lacre vermelho**, como um dado circulado a caneta.

`template/captions.json`:
```json
{
  "fixes": {},
  "style": "label-tag",
  "font_family": "'Barlow Condensed', sans-serif",
  "max_words": 3,
  "max_chars": 20,
  "pause": 0.14,
  "left": 96,
  "width": 800,
  "bottom": 470,
  "font_size": 58,
  "ink": "#1c1214",
  "tag_bg": "#f2e8d5",
  "tag_active_bg": "#b3261e",
  "tag_active_ink": "#fff4e0"
}
```

| Item | Especificação |
| --- | --- |
| Agrupamento | até 3 palavras e 20 caracteres; quebra em `,` `.` e em pausas ≥ 140 ms |
| Posição | x 96–896 (centralizada no bloco), base da etiqueta em y 1450 (`bottom: 470`); 1 linha ocupa y ≈ 1364–1456; quebra para 2 linhas (rara) a partir de y ≈ 1270 |
| Destaque da palavra falada | no `inicio` da palavra: fundo `#b3261e` e texto `#fff4e0` (6,0:1), pop de escala 1,14 → 1,04 em 160 ms `back.out(2)` e giro invertido 0,8× → giro original |
| Entrada do grupo | começa 40 ms antes da 1ª palavra (`start − 0.04`); opacidade 0 → 1 e `y +14 → 0` em 120 ms `back.out(1.8)` |
| Saída do grupo | fim = último `fim` + 350 ms (ou 40 ms antes do grupo seguinte, o que vier primeiro); opacidade → 0 em 80 ms `power2.in` |
| Sobre fundo escuro (sala, livro à noite) | etiqueta marfim opaca: contraste com o fundo de ~15:1 |
| Sobre fundo claro (página do livro, cartões) | separa pela borda de 3 px `#141414` e pela sombra dura `0 6px 0 #141414`. Regra de enquadramento: a página fica em y 600–1250 e a faixa da legenda (y 1270–1460) cai sobre a borda escura da mesa ou do livro |
| Quadro 0 e último quadro | sem legenda (o script abre o 1º grupo em ≥ 0,15 s e fecha o último em `DUR − 0.02`), então o loop casa |
| Proibido | editar `compositions/captions.html` à mão; trocar a cor da palavra ativa para ouro (o ouro é dinheiro) |

---

## 8. Texto na tela e HUD

Tudo em **`compositions/hud.html`** **[NEW]**, uma sub-composição própria com timeline GSAP pausada registrada em
`window.__timelines["hud"]`. Ela não toca no `world.html` do motor (ver D7). Mudanças de texto por `tl.set` (0 ms)
nas âncoras. Movimento por `fromTo` com `clipPath`. Sem `onUpdate`, sem estado.

### 8.1 Ficha do caso: `#hud-ficha` (título)
- **Posição:** x 64–904, y 236–436, girada −1,2° (fixo), cartão `#f2e8d5` com borda de 3 px `#1c1214`, sombra dura
  `0 8px 0 #0a0506`, um clipe de papel em SVG no canto superior esquerdo (`#a3958a`, 28 × 72 px) e um furo de
  fichário (círculo de 18 px `#1c1214` a 40 % de opacidade) à esquerda.
- **Conteúdo:** sobrelinha (`CASO Nº 001 · 24 DIAS`, IBM Plex Mono 700 30 px `#6b5b52`) + título (Barlow Condensed
  800 92 px `#1c1214`).
- **Limite:** sobrelinha de 28 caracteres; título de 18 por linha, 2 linhas.
- **Regra de escrita:** afirmação com número ou substantivo concreto (`US$ 74 BI → ZERO`, `DÍVIDA ESCONDIDA`,
  `4 ANDARES OCOS`). Nunca pergunta, nunca "você sabia", nunca nome de pessoa sem cargo.
- **Entrada (quadro 0):** já pousada, `clipPath: inset(0 0 0 0)` definido **explicitamente em t = 0**.
- **Troca:** o texto antigo sai em wipe para a direita (`clipPath inset(0 0 0 100%)`, 160 ms `power2.in`), o cartão
  dá um "peteleco" (`scaleY 1 → 0.94 → 1`, 120 ms), e o texto novo entra em wipe da esquerda (380 ms `expo.out`),
  tudo começando na palavra-âncora. O cartão em si nunca sai da tela.
- **Remontagem do loop:** em `LOOP − 0.6 s` o título do gancho volta pelo mesmo wipe e pousa em `LOOP − 0.22 s`.

### 8.2 Medidor do império: `#hud-valor` (placar)
- **Posição:** x 64–600, y 456–572, cartão `#1c1214` com borda de 3 px no estado (`#e9b949` em alta, `#ff5a3c` em
  queda), cantos de 6 px e sombra `0 6px 0 #0a0506`.
- **Conteúdo:** rótulo `VALOR DE MERCADO` (ou `DÍVIDA`, `INVESTIDORES`, `PREJUÍZO`, conforme o caso; IBM Plex
  Mono 700 28 px `#a3958a`) + valor (64 px, `#e9b949`/`#ff5a3c`/`#f2e8d5`) + delta (`▲ 37×` / `▼ 99%`, 36 px) + a
  **linha de vida**: barra de 8 px na base, de largura proporcional a valor/pico, na cor do estado.
- **Limite:** valor ≤ 10 caracteres (`US$ 1,2 TRI`), rótulo ≤ 18.
- **Regra de escrita:** sempre moeda + número + escala (`MI`, `BI`, `TRI`), arredondado a 2 algarismos significativos.
- **Mudança ("hodômetro em degraus"):** `valor(t0, t1, de, ate, passos = 6–10)` gera `passos` chamadas `tl.set` de
  texto igualmente espaçadas entre `t0` e `t1` (curva `power2.out` na subida, `power3.in` na queda). Cada degrau
  pulsa o valor (`scale 1.18 → 1`, 180 ms `back.out(2.4)`). A troca de cor é instantânea, no degrau em que o delta
  inverte. Em alarme, o `▼` pisca com `loopPeriod(LOOP, 0.8)` (o mesmo período da rachadura).
- **Nunca estático por mais de 8 s**: se o roteiro não tiver número novo, o rótulo troca de métrica.

### 8.3 Selo de data: `#hud-data`
- **Posição:** x 640–904, y 456–572, cartão `#1c1214` com borda tracejada de 3 px `#a3958a`.
- **Conteúdo:** `OUT 2001`, `24 DIAS`, `1997 → 2000`, `DIA 1` (IBM Plex Mono 700 40 px `#f2e8d5`). Limite de 10
  caracteres.
- **Troca:** "carimbo de datador": `rotateX 0 → 90°` (90 ms `power2.in`), `tl.set` do texto e `90° → 0` (140 ms
  `back.out(2)`). Mais `click.mp3`.

### 8.4 Carimbo 2D: `#hud-carimbo`
- **Posição:** centro em (492, 900), girado −8°, largura máx. 760 px (x 112–872).
- **Visual:** retângulo `#b3261e` com borda dupla interna de 6 px `#fff4e0` (afastada 10 px), texto Barlow Condensed
  800 128 px `#fff4e0`, tracking +4 %. Textos permitidos: `FRAUDE`, `FALÊNCIA`, `ACUSADO`, `INVESTIGADO`,
  `CONDENADO` (só com condenação registrada, P8), `CALOTE`, `PIRÂMIDE`. Limite de 10 caracteres.
- **Entrada:** sincronizada com o `slam` 3D: `scale 2.2 → 1` e `opacity 0 → 1` em 140 ms `power4.in`, aterrissando
  no `t0` do impacto, depois um `scale 1 → 1.04 → 1` de 120 ms.
- **Saída:** fica 1,4 s e encolhe para o canto da ficha (`x → 760, y → 300, scale → 0.28`, 320 ms `power3.inOut`),
  onde vira um **selo pequeno** que fica até o início da rebobinagem. Na rebobinagem, sai em `opacity → 0` (200 ms)
  para o quadro final casar com o quadro 0.

### 8.5 Rótulos 3D
| Rótulo | Builder | Regra |
| --- | --- | --- |
| Placa da torre | `label(nome, C.nanquim, 72, worldH, 700)` sobre um Box ouro no topo da torre | só o nome da empresa, ≤ 14 caracteres, nunca o logo |
| Etiqueta de prova | **[NEW]** `makeEvidenceTag({ letra, texto })`: Box 1,0 × 0,6 × 0,02 marfim + furo + barbante | `PROVA A: BALANÇO 2000`, ≤ 16 caracteres, texto `#4c35b8` |
| Lançamento do livro | `floorLabel(...)` dentro de `makeLedger` | ≤ 22 caracteres (`DÍVIDA ....... 30 BI`), só em plano de cima |
| Caixas de fachada | `label` na face frontal | nome fictício ou real da entidade, ≤ 12 caracteres |
| Gavetas do Fiscal | `label` no porta-etiqueta | ano/número do processo, ≤ 8 caracteres |

Entrada do rótulo 3D: `scale.y 0 → 1` em 0,30 s `E.backOut`, presa à palavra-âncora. Troca de texto 3D: só entre
planos (nunca no meio de um plano) e sempre por textura pré-criada no `build`.

---

## 9. Vocabulário de movimento

Picos de SFX 1 quadro (33 ms) depois do evento visual. Volumes = `data-volume` no `index.html`.

| Gatilho narrativo | Resposta visual | Easing / duração | SFX (`shared/sfx/`) |
| --- | --- | --- | --- |
| **Gancho (quadro 0)** | dolly-in de 8 % da distância + órbita de 8°; rachadura pulsando; ficha pousada; `▼` piscando; Magnata `celebrate` | plano `p2io` de 2,2 s; pulso `loopPeriod(LOOP, 0.8)` | nenhum em t = 0 (para não estalar na emenda); a trilha já está no `drone` |
| Corte de plano | troca de plano na palavra-âncora | instantâneo | `whoosh-short.mp3` 0,25 |
| Andar da torre nasce | Box `scale 0 → 1` de baixo para cima, squash `scale.y 1.15 → 1` | `E.backOut`, 0,35 s por andar, escalonado a cada 0,12 s | trilha `tique` por andar; `pop.mp3` 0,35 só no 1º e no último |
| **Revelação de número** (medidor) | hodômetro em degraus + pilha de moedas 3D subindo `fill(k)` | 0,6–1,2 s, `power2.out`; degraus de 180 ms `back.out(2.4)` | `click.mp3` 0,3 em até 6 degraus; `ping.mp3` 0,45 no valor final |
| Entrada de personagem | `scale 0 → 1` + squash de pouso (`scale.y 0.85 → 1`) | `E.backOut` 0,45 s + 0,18 s | `pop.mp3` 0,5 (exceto o Fiscal, ver clímax) |
| Dinheiro entra/sai | `createFlowArrow` (ouro = entra, `#ff5a3c` = sai) crescendo `scale.x 0 → 1` | `E.p2out` 0,4 s; depois `pulse(t, 2π/loopPeriod(LOOP, 0.75), 0.14)` | `whoosh.mp3` 0,3 |
| **A Manobra** (truque) | a linha da dívida desliza para dentro da caixa, a tampa fecha e a caixa entra em outra | deslize `p3io` 0,5 s; tampa `p2in` 0,2 s; aninhar `p3io` 0,6 s | trilha `deslize`; `key-press.mp3` 0,4 na tampa |
| Contador maquiando | `scribble` + LCD `calculando` | contínuo, `Pw` | `typing.mp3` 0,22 (recortado ≤ 1,5 s) |
| **Problema / erro** (rachadura cresce) | a rachadura sobe 1 andar, o medidor fica vermelho, tremor curto | `p2in` 0,25 s; `shake [t0, 0.12, 0.3]` | `error.mp3` 0,9 + `impact-bass-1.mp3` 0,25 |
| Prova revelada (UV) | `uv` 0→1 na sala; andar oco: o preenchimento vai a opacidade 0,12 e a aresta fica `#9b8cff` | `p2io` 0,5 s por andar, escalonado a cada 0,25 s | `ping.mp3` 0,4 no 1º andar; `glitch-1.mp3` 0,25 no último |
| Fio vermelho liga provas | `drawRange` de 0 → n | `E.p2out` 0,4 s por trecho | `click.mp3` 0,35 em cada alfinete |
| **Clímax: carimbo** | `slam` 3D + carimbo 2D + squash do Fiscal + tremor + `ca` + vinheta vermelha (borda) | queda de 0,14 s `p2in²`; tremor `[t0, 0.25, 0.45, 70]`; `ca` 0,006 → 0 em 0,2 s; vinheta 0,55 → 0,8 → 0,55 em 0,5 s | `impact-bass-2.mp3` 0,6 + trilha `baque` 1,0; depois **0,6 s de silêncio musical** (`dip`) |
| Colapso da torre | andares caem em parábola escalonada (os ocos primeiro), moedas estouram (`makeCoinBurst`), poeira (`makeGroundCloud`) | 1,6 s no total; cada bloco `seg(k, d_i, d_i + 0.6)` com `p2in` | trilha `estalo` ×3 + `ronco`; `glitch-2.mp3` 0,4 quando o medidor bate zero |
| Medidor despenca | degraus até `US$ 0`, a linha de vida zera, a borda fica vermelha | 1,2 s `power3.in` | `click.mp3` 0,3 nos 3 últimos degraus |
| Pânico da Manada | `panico(k)` → `ruina(k)` | 0,8 s + 1,2 s | ambiente `alarme` (trilha) |
| Detalhe absurdo | dolly-in lento até a macro da etiqueta/documento; o selo de data vira | plano `p3io` 2,4 s | `whoosh-short.mp3` 0,25; `key-press.mp3` 0,4 no selo |
| **Loop: rebobinagem** | toda função de queda recebe `k(t) = 1 − E.p3io(seg(t, LOOP − 2.4, LOOP − 0.2))`; o medidor rola de volta; a câmera segue para `p0/l0` do plano 1; a ficha remonta | 2,2 s `p3io`; ficha 380 ms `expo.out` | `riser.mp3` 0,22, recortado para terminar em `LOOP − 0.10` com fade de 80 ms; trilha `subida` |

Tremores sempre determinísticos (`shake(t, t0, amp, dur, f)` do motor). Nada de ruído por quadro.

---

## 10. Câmera e enquadramento

- **fov 50** (padrão do `createStage`). Aproxime pela distância, nunca pelo fov.
- **Planos de 1,7–3,0 s**, sempre com movimento interno (`p0 → p1` e `l0 → l1` diferentes, `hand 0.006`). A câmera
  na mão do motor (`cameraOf(..., loop)`) já usa frequências que dividem `LOOP`.
- **Tipos de plano da série:**

| Plano | Distância / altura | Assunto no quadro | Uso | `ap` (DOF) |
| --- | --- | --- | --- | --- |
| `ABERTO_IMPERIO` | d 12–16, y 3–6, órbita ±8° | torre com 55 % da altura do quadro | gancho, colapso, loop | 1,0 |
| `PLONGEE_MESA` | d 14–18, ângulo de 60–75° para baixo | mesa com 80 % da largura | ascensão, sala | 0,8 |
| `CLOSE_ROSTO` | d 2,2–3,2, na altura da cabeça | rosto/visor com 40–50 % da largura | expressão, reação | 9 |
| `MACRO_LIVRO` | d 3–5, de cima (85–90°) | linha do lançamento com 60 % da largura | Manobra (`floorLabel`) | 6 |
| `RASANTE_MANADA` | y 0,4–0,8, d 4–6, travelling lateral | primeira fila de peões a 50 % da largura | euforia, pânico | 4 |
| `CONTRA_PLONGEE` | y 0,3, olhando 25° para cima | Fiscal com 60 % da altura | clímax | 3 |
| `PERFIL_PERITA` | d 3–4, 3/4 de lado | Perita + prova sob a luz | rachaduras | 7 |

- **Tamanho do assunto:** 50–60 % da largura em planos médios. Assunto alto (torre, Fiscal): 55–60 % da altura,
  sempre centrado entre **y 600 e y 1290** (fora da ficha, do medidor e da legenda) e **x 64–920**.
- **Alternância:** nunca 2 planos seguidos do mesmo tipo; alterne aberto/próximo e a direção (órbita
  horária → anti-horária, travelling esquerda → direita).
- **Corte na palavra-âncora:** o limite do plano (`a`/`b`) cai no `inicio` da palavra-âncora em `assets/voice.json`,
  sem arredondar para o quadro. Âncoras típicas: número, nome da empresa, verbo do truque ("escondeu"), "só que",
  palavra do carimbo, "zero". Eventos do mesmo instante (carimbo 2D + `slam` + tremor) usam o mesmo `t0`.
- **Texto no chão (`floorLabel`) só em plano de cima** (`MACRO_LIVRO`, `PLONGEE_MESA`); em plano rasante, use `label`
  de frente.
- **Loop de câmera:** o último plano tem `p1 = SH[0].p0`, `l1 = SH[0].l0` e `ease: "p3io"`, terminando em
  `LOOP + 0.01`. Como o 1º plano começa em `p2io` (velocidade zero em k = 0), a emenda não dá tranco.
- **DOF:** `post` devolve `{ focus: c.dist, aperture: sh.ap }`; abertos com `ap` 0,5–1,5, próximos com 6–12.

---

## 11. Grade da tela

```
x:   0   64                                   920   1080
y:   ┌────┬──────────────────────────────────────┬──────┐
   0 │    │  UI DA PLATAFORMA (sem texto crítico)│      │
     │    │                                      │      │
 220 ├────┼──────────────────────────────────────┤      │
 236 │    │ ┌──────────────────────────────────┐ │      │
     │    │ │ #hud-ficha  (x 64–904, y 236–436)│ │      │
     │    │ │ CASO Nº 001 · 24 DIAS            │ │  C   │
     │    │ │ US$ 74 BI → ZERO                 │ │  O   │
 436 │    │ └──────────────────────────────────┘ │  L   │
 456 │    │ ┌──────────────────┐ ┌─────────────┐ │  U   │
     │    │ │#hud-valor 64–600 │ │#hud-data    │ │  N   │
     │    │ │VALOR DE MERCADO  │ │ 640–904     │ │  A   │
 572 │    │ │US$ 74 BI  ▼      │ │ 24 DIAS     │ │      │
     │    │ └──────────────────┘ └─────────────┘ │  U   │
 600 │    │ · · · · · · · · · · · · · · · · · · ·│  I   │
     │    │                                      │      │
     │    │   PALCO 3D: ASSUNTO (y 600–1290)     │ 160  │
     │    │      #hud-carimbo centro (492, 900)  │  px  │
     │    │      (x 112–872)                     │      │
     │    │                                      │ só   │
1290 │    │ · · · · · · · · · · · · · · · · · · ·│ 3D   │
1364 │    │   [ETIQUETA] [ETIQUETA] [ATIVA]      │      │
     │    │   legenda x 96–896, base y 1450      │      │
1500 ├────┴──────────────────────────────────────┴──────┤
     │        UI DA PLATAFORMA (420 px; só cenário 3D)  │
1920 └──────────────────────────────────────────────────┘
       O 3D é tela cheia (0–1080 × 0–1920); só o texto obedece à grade.
```

- **Zona segura comum (Shorts/Reels/TikTok):** texto crítico só em **x 64–920, y 220–1500**. A margem de 64 px
  à esquerda e a coluna de 160 px à direita (x 920–1080) só recebem cenário 3D.
- Como é Modo A, não há zona anterior a respeitar. Para comparação: o tech-lore usa x 96–948 / y 200–1130 com
  legenda em y 1310, e o ia-lab põe a legenda em `bottom: 380`. Esta série adota a zona comum das 3 plataformas,
  mais rígida à direita (920 contra 948).

---

## 12. Som (apoio visual)

- **Locução:** voz única da série em `niche.json` (masculina ou feminina grave, ritmo de narração documental,
  `speed 1.0`, ~2,4 palavras/s). Os eventos visuais ficam presos às palavras dela.
- **Trilha procedural** (`assets/episode/trilha.json` → `shared/trilha/trilha.py`):

| Camada | Configuração do modelo (52 s) | Papel |
| --- | --- | --- |
| `ambiente.zumbido` | `env [[0, 52, 0.22]]`; `alarme [[37.6, 40.8]]` | zumbido da lâmpada da sala (sempre presente) |
| `ambiente.ronco` | `env [[35.0, 38.0, 0.8, 0.05, 1.2]]` | estrondo da torre desabando |
| `ambiente.vento` | `env [[40.8, 47.2, 0.25]]` | vazio do pregão depois da queda |
| `musica.tom` | `"re_menor"` (o tech-lore usa `la_menor`) | identidade harmônica da série |
| `musica.drone` | `env [[0, 33.4, 0.5], [34.0, 52, 0.4]]` | tensão contínua, com silêncio de 0,6 s após o carimbo |
| `musica.brilho` | `env [[4.1, 11.6, 0.45]]` | brilho da ascensão (ouro subindo) |
| `musica.pulso` | `inicio 22.4, fim 33.4, bpm 96` | pulso cardíaco que cresce da prova até o carimbo |
| `musica.subida` | `inicio 31.0, fim 33.4` | glissando que culmina no carimbo |
| `efeitos` | `tique` (andares e degraus), `deslize` (Manobra), `clique` (alfinetes), `baque` (carimbo, ganho 1.0), `estalo` ×3 (andares quebrando), `trava` (gaveta do Fiscal) | o som físico dos objetos |

- **SFX de `assets/sfx/`** só nos acertos que a trilha não cobre (tabela da seção 9), com pico 1 quadro após a
  imagem. No máximo 2 SFX simultâneos. Nada de SFX em `t = 0` nem nos últimos 100 ms (emenda limpa).
- **Silêncio dramático:** 0,6 s depois do carimbo (drone `dip`, sem SFX). É a pausa mais importante da série.
- **Mix:** −14 LUFS (`audio_lufs` do `niche.json`), aceitável entre −15 e −13. Locução `data-volume 1.18`
  (como no tech-lore), ambiente 0,32, música 0,45, efeitos 0,7.
- **Arquivo final:** 30–45 MB para 45–60 s (granulação 0).

---

## 13. Proibições e antipadrões

1. **Granulação/ruído por quadro** (`grain > 0`), partículas decorativas, poeira flutuando sem motivo.
2. `Math.random()`, `Date.now()`, `requestAnimationFrame`, física acumulada ou qualquer estado entre quadros. Use
   `rng(seed)`/`hash(i, k)` e funções de `k`.
3. Período de piscar, balanço ou giro que **não** venha de `loopPeriod(LOOP, …)`/`2π·n/LOOP`.
4. Usar `createDioramaStage` ou `applyCameraShot` do `kit3d.js` neste nicho (fov 42, câmera na mão e piscadas fora do
   loop, sem pós). Também `createBlockAgent` (droide do ia-lab), `makeBug`/`makeBoard` (identidade do tech-lore) e
   `createFloatingLabel`/`createCodeScreen` (fonte Inter fixa no código).
5. Logotipos, cores de marca, mascotes ou fachadas reais de empresas. Nome real só como texto (P7).
6. `CONDENADO` sem condenação registrada (P8). Acusação sem fonte no roteiro.
7. Verde em qualquer lugar (o "ok" da série é ouro); ouro como luz de cena (ouro é só material/dinheiro).
8. Pares de contraste proibidos da seção 5; texto abaixo de 28 px; texto crítico fora de x 64–920 / y 220–1500.
9. Câmera parada, plano maior que 3 s, dois planos seguidos do mesmo tipo, troca de plano fora da palavra-âncora.
10. Título com fade + slide-up, título "dançando" depois de pousar, ficha saindo da tela, medidor estático por mais de 8 s.
11. Glow/bloom, neon, lens flare. Cones de luz só como malha fosca translúcida (opacidade ≤ 0,18).
12. Fiscal quicando, Perita comemorando, Contador no topo da torre, Magnata sorrindo depois do carimbo (fora da
    rebobinagem), Manada com menos de 12 peões.
13. Cartola, monóculo, bigode, saco com cifrão ou qualquer clichê de mascote de jogo de tabuleiro conhecido.
14. Gradiente 2D chapado em tela cheia, vazio preto atrás do assunto (sempre a sala, a página ou o pregão).
15. "Você sabia", CTA de comentário inventado (só com `--cta`), pergunta como título.
16. Editar `compositions/captions.html` à mão ou mexer no `world.html` além da duração e dos tempos.
17. Redesenhar CanvasTexture a cada quadro (só na troca de estado) ou criar geometria/material dentro de `update`.

---

## 14. Viabilidade técnica

Orçamento por episódio: ≤ 350 malhas + ≤ 6 `InstancedMesh`, ≤ 1 luz com sombra, ≤ 24 CanvasTextures
(nenhuma acima de 2048²), ≤ 400 instâncias no total.

| Elemento | Reusa (arquivo/função) | [NEW] | Complexidade | Risco de render |
| --- | --- | --- | --- | --- |
| Palco, câmera, pós, céu | `shared/motor-3d/core.js` `createStage`, `createEpisode`, `cameraOf`, `SKIES` | — | B | baixo |
| Tema de cores e fontes | `tools/motor.py` → `assets/tema.js` | `niches/business-forensics/tema.json` (config) | B | baixo (validado pelo script) |
| Aliases de cor | `COL` (`materiais.js`) | `kit/cores.js` `C` | B | nenhum |
| Sala de Provas (mesa, lambri, cortiça, lâmpada) | `solid`, `fill`, `edge`, `label` | `kit/sala.js` `makeEvidenceRoom({ seed, loop, caso })` → `{ group, update(t, { alarm, uv }) }`, `TEMA_SALA`, `SKIES_BF` | M | médio: acne da SpotLight (bias −0,0004), cone translúcido (`depthWrite: false`, `renderOrder 2`) |
| Torre do Império | `solid`, `label` (placa) | `kit/imperio.js` `makeEmpireTower({ nome, andares, ocos, w, h, seed, forma })` → `{ group, rise(k), crack(k), reveal(k), collapse(k) }` | M | baixo: ≤ 14 blocos, `collapse` é parábola pura de `k` |
| Moedas (pilha e estouro) | — | `makeCoinStack({ n, r })` → `fill(k)`; `makeCoinBurst({ count = 120, seed, origem })` → `update(k)` (`InstancedMesh`, Cylinder 0,22 × 0,06, 16 lados) | M | baixo: instanciado, sem ruído |
| Poeira do desabamento | `kit/efeitos.js` `makeGroundCloud` (tech-lore) | — | B | baixo |
| Setas de dinheiro | `shared/kit3d/kit3d.js` `createFlowArrow` (copiado para `assets/kit3d.js`) | — | B | baixo: `pulse` com velocidade de `loopPeriod` |
| Livro-caixa / mundo `livro` | `floorLabel`, `fmtNum` (`telas.js`) | `kit/livro.js` `makeLedger({ titulo, linhas, linhaFraude })` → `{ group, open(k), flip(k), mark(i, k), uv(k) }` | M | médio: legibilidade de `floorLabel` (aplicar a fórmula de `worldH`) |
| Truques físicos | `solid` | `kit/truques.js` `makeShellBoxes({ nomes, seed })` → `{ swallow(k), nest(k) }`; `makePonziPyramid({ niveis })` → `{ grow(k), collapse(k) }`; `makeBubble({ r })` → `{ inflate(k), pop(k) }` | M | baixo |
| Provas (etiqueta, fio, pasta) | `label` | `kit/provas.js` `makeEvidenceTag`, `makeRedString(pontos)` → `{ draw(k) }` (`setDrawRange`), `makeCaseFolder({ caso, nome })` → `{ open(k) }`, `makeStampMark(texto)` → `{ press(k) }` | B | baixo |
| Pregão | `kit/exteriores.js` `makeTradingFloor` + `telas(valor)` + `queda(k)` (tech-lore, recolorido pelo tema) | — | B | médio: cache LRU de 32 texturas (escalonar o valor de 5 em 5) |
| Magnata, Perita, Contador, Fiscal | `solid`, `fill`, `edge`, `blink`, `loopPeriod`, `E`, `seg` | `kit/elenco.js` `makeMagnata`, `makePerita`, `makeContador`, `makeFiscal` → `{ group, act, rosto }` | A | médio: cache de rosto por estado (nunca redesenhar por quadro), ~25 malhas cada |
| Manada | `hash`, `E` | `kit/elenco.js` `makeManada({ count, cols, spacing, seed })` (2 `InstancedMesh`: corpo + casca) | M | baixo: `instanceMatrix.needsUpdate` por quadro é barato (≤ 64) |
| HUD (ficha, medidor, data, carimbo) | padrão `setScore` do ia-lab (`tl.set` + `fromTo`) | `compositions/hud.html` com `ficha()`, `valor()`, `data()`, `carimbo()` | M | baixo: `clipPath` explícito em t = 0 |
| Legendas | `tools/build_captions.py` estilo `label-tag` | — (só `captions.json`) | B | baixo |
| Trilha | `shared/trilha/trilha.py` | — (só `trilha.json`) | B | baixo |
| SFX | `shared/sfx/` (14 arquivos) | — | B | nenhum |

Riscos gerais e mitigação:
- **Tamanho do arquivo:** sem granulação, sem textura animada por quadro, céu em degradê suave. O fundo vinho
  escuro pode criar faixas de degradê: o motor renderiza em HalfFloat, e a vinheta 0,55 disfarça. Não "resolva"
  com ruído.
- **Fonte em textura:** todo texto 3D em IBM Plex Mono 700, a única família pré-carregada pelo `montar.js`.
- **Transparência:** cones (lâmpada, lanterna) e andares ocos com `depthWrite: false` e `renderOrder` explícito.
- **Precisão:** o mundo `livro` fica em `(0, −200, 0)`, nunca a milhares de unidades.

---

## 15. Registro de decisões

| Decisão | Alternativas consideradas | Justificativa |
| --- | --- | --- |
| D1. Motor base = `shared/motor-3d` (`--from tech-lore`) | palco `createDioramaStage` + `applyCameraShot` do `kit3d.js` (`--from ia-lab`) | o motor tem câmera na mão com frequências que dividem o loop, pós (DOF, desfoque de movimento, vinheta), fov 50 e tema validado. O palco do kit3d tem fov 42, câmera na mão e piscadas fora do loop e nenhum pós, o que quebra o critério de loop |
| D2. Conceito "Mesa da Perícia" com o império como torre de ouro | linha do tempo 2D de gráficos; cidade em escala real; escritório realista | maquete + peças cabe no estilo único do motor (`maquete`), lê-se em 2 s e dá forma física à fraude (andar oco) |
| D3. Paleta vinho + papel + ouro + violeta UV, sem verde | preto + verde-dinheiro; azul-marinho + dourado; branco clínico | é a única combinação sem sobreposição com o menta/ciano do tech-lore e o âmbar do ia-lab. O verde de dinheiro colidiria com o menta do tech-lore |
| D4. Legenda = `label-tag` reconfigurado | estilo novo "marca-texto" [NEW]; `dark-pill`; `terminal` | zero código novo, estilo ainda não usado por nenhum nicho, e a etiqueta de papel é literalmente a linguagem de "prova". O marca-texto amarelo sobre marfim teria luminância parecida (pouca separação) |
| D5. Fontes Barlow Condensed + IBM Plex Mono | Inter + JetBrains Mono (já usadas); Oswald; serifadas de jornal | a condensada cabe 18 caracteres a 92 px numa tela de 9:16 e lembra manchete. A Plex Mono dá números que não dançam, lembra máquina de escrever de dossiê e difere das fontes dos dois nichos |
| D6. Elenco novo de peças de tabuleiro (`kit/elenco.js`) | reusar `createBlockAgent` com cores novas | o droide cápsula é a identidade do ia-lab, e o `act()` dele usa frequências fora do loop (`sin(t·1.85)` etc.). Silhuetas novas passam no teste de 15 % e são originais |
| D7. HUD em `compositions/hud.html` separado | HUD dentro do `world.html` (padrão ia-lab) | o `PROMPT.md` do motor proíbe mexer no `world.html` além da duração e dos tempos. Sub-composição própria com timeline registrada mantém o contrato, e a sincronia vem da mesma raiz |
| D8. Loop por rebobinagem da queda | corte seco para o quadro 0; fade para preto; repetir a cena 1 | como `collapse(k)` é função pura, rebobinar é só `k` voltando a 0: custo zero, sem salto, e o replay parece continuação |
| D9. Fraude como "andar oco" revelado por UV | gráfico com seta vermelha; cifrões sumindo; texto explicativo | metáfora física única da série ("parecia ouro, era vazio"), lida sem áudio e reaproveitável em qualquer fraude contábil |
| D10. Manada instanciada com casca no lugar de aresta | 36 malhas com `EdgesGeometry`; instâncias sem contorno | arestas não se instanciam. A casca `BackSide` mantém o traço escuro da maquete com 2 draw calls em vez de 72 |
| D11. Carimbo como gesto ritual do clímax | explosão; tela vermelha; martelo de juiz | é original, jurídico e reutilizável (`FRAUDE`/`FALÊNCIA`/`ACUSADO`), e tem um instante exato para prender som e corte |
| D12. Medidor em degraus via `tl.set` | `onUpdate` contínuo; texto 3D | degraus são determinísticos, seekáveis e auditáveis pelo lint, e o pulso de cada degrau gera mudança visual a cada ~0,2 s nas revelações |
| D13. Reuso do pregão do tech-lore (`makeTradingFloor`) | modelar uma bolsa nova | já existe, já tem `telas(valor)` e `queda(k)` e é recolorido pelo `tema.json` sem tocar no código |
| D14. Zona segura comum (x 64–920, y 220–1500) | zona do tech-lore (até y 1130) | a série publica nas 3 plataformas. A coluna direita de 160 px protege dos botões do TikTok e do Reels |

---

## 16. Checklist de retenção

| # | Critério | Resultado | Justificativa |
| --- | --- | --- | --- |
| 1 | **Gancho no quadro 0** | **PASS** | no quadro 0 já há dolly em curso, a rachadura vermelha pulsando, Magnata em `celebrate`, a ficha `US$ 74 BI → ZERO` pousada (`clipPath` explícito em t = 0) e o medidor com `▼`: o conflito se lê sem som |
| 2 | **Mudança visual a cada 1,5–3 s** | **PASS** | planos de 1,7–3,0 s (22 em 52 s, média de 2,36 s) e, dentro deles, andares, degraus, fios, tampas e trocas de rosto. Medidor nunca parado por mais de 8 s |
| 3 | **Legenda palavra a palavra** | **PASS** | `label-tag` gerado do `voice.json`, palavra ativa em lacre `#b3261e`/`#fff4e0` (6,0:1) no `inicio` exato de cada palavra |
| 4 | **Loop sem emenda** | **PASS** | rebobinagem pura de `k`; o último plano termina em `SH[0].p0/l0`; câmera na mão, piscadas, giros e pulsos com período `loopPeriod`/`2π·n/LOOP`; a ficha remonta; o carimbo-selo sai; sem SFX nem legenda nos extremos; alarme e UV voltam a 0 |
| 5 | **Legível em 2 s sem áudio** | **PASS** | cada plano tem um tipo com uma ideia (torre subindo, caixa engolindo dívida, andar oco, carimbo), o título é uma afirmação de ≤ 18 caracteres, e o medidor e a data dão contexto numérico |

Autorrevisão contra as restrições técnicas: 1080 × 1920 / 30 fps / 35–75 s ✔ · tudo procedural (primitivas,
CanvasTexture, CSS/SVG) ✔ · tudo função de `t`, sem `Math.random`/`Date.now`/`rAF` ✔ · granulação 0 ✔ · reuso
priorizado (motor, `createFlowArrow`, `makeTradingFloor`, `makeGroundCloud`, `fmtNum`, `label-tag`, trilha) com cada
[NEW] justificado ✔ · identidade distinta em silhueta, paleta e cenário, sem semelhança com marcas ✔ · texto ≥ 28 px
e contraste ≥ 4,5:1 em todos os pares usados ✔.

---

## 17. Próximos passos (em ordem)

1. **Criar a pasta do nicho:**
   `python3 tools/new_niche.py business-forensics --from tech-lore`
   (copia `template/`, `prompts/` e `niche.json`, e escreve um `NICHE.md` esqueleto. Não copia `tema.json` nem
   `catalogo.json`.)
2. **Tema:** criar `niches/business-forensics/tema.json` com o bloco da seção 3. Conferir rodando
   `python3 tools/motor.py <pasta-de-teste> --nicho business-forensics`.
3. **`NICHE.md`:** reescrever a partir desta bible, nas seções do padrão da casa (Formato com a tabela de cenas e
   `mundo` = `imperio | sala | livro | pregao`; Roteiro com gancho numérico, truque físico, P8 e frase final que
   emenda; Visual com paleta, fontes, zonas, câmera e proibições; Som; Episódios com a tabela vazia).
4. **`niche.json`:** `nome` = "Business Forensics: Impérios, Golpes e Falências Bilionárias", `duracao_alvo_s 52`,
   `palavras_por_segundo 2.4`, `voz.voice_id` (escolher com `./pipeline vozes`), `audio_lufs -14` e
   `marca_dagua` se houver. Criar `catalogo.json` vazio se o pipeline exigir.
5. **Kit do nicho** (`template/assets/kit/`): **manter** `exteriores.js`, `props.js` (só pelo `M`, que é dependência),
   `bits.js` (reexportado por `props.js`), `telas.js` e `efeitos.js`; **apagar** `placa.js`; reescrever `KIT.md` para
   este nicho. Depois implementar os [NEW] nesta ordem: `cores.js` → `sala.js` → `imperio.js` → `provas.js` →
   `livro.js` → `truques.js` → `elenco.js`. Testes de lógica pura (`collapse(k)`, `hash`, formatação) em
   `assets/kit/tests/*.test.js`.
6. **kit3d:** `cp shared/kit3d/kit3d.js niches/business-forensics/template/assets/kit3d.js`, para o
   `new_video.py` passar a copiar a versão atual em cada vídeo (usado só pelo `createFlowArrow`).
7. **Template:** reescrever `assets/episode/scene.js` como o episódio-modelo de 52 s (os 22 planos da seção 2,
   `skies: SKIES_BF`) e `assets/episode/trilha.json` (seção 12). Criar `compositions/hud.html` (seção 8) e
   referenciá-lo no `index.html` com `data-composition-src`, entre o `world` e as `captions`. Trocar
   `template/captions.json` pelo bloco da seção 7.
8. **Vitrine de validação** (fora de `videos/`, como `niches/tech-lore/lab/`): montar uma cena com os 5 personagens e
   os props, rodar `npm run check` e `npx hyperframes snapshot --describe false --at 0,2.2,8.6,24.6,33.4,36,51.9`,
   conferir as fontes (P5), o teste de silhueta, o contraste e a igualdade dos quadros 0 e final
   (`tools/comparar_quadros.py`). Parar o preview no fim.
9. **Prompts** (`prompts/`): adaptar `temas.md` (casos de fraude e falência com fonte, tipo de truque e estado
   jurídico), `roteiro.md` (campo `mundo` com os 4 valores, `truque` ∈ `caixas | livro_duplo | piramide | bolha |
   andar_oco`, `carimbo` e `estado_juridico`), `tts.md` (moedas e escalas por extenso: "setenta e quatro bilhões
   de dólares") e `hyperframes.md` (o contrato desta bible: elenco, HUD, regra do loop por rebobinagem).
   `metadados.md` só muda o tom.
10. **Ensaio:** `./pipeline novo business-forensics --tema "Caso de teste" --ensaio`, revisar os snapshots, depois
    apagar o vídeo de ensaio e as entradas dele no catálogo (regra do `CLAUDE.md`).
11. **Primeiro episódio real** e o registro dele na tabela de episódios do `NICHE.md`.
