# Motores compartilhados 2D e 3D para nichos HyperFrames

Data: 2026-10-28 · Branch de origem: `lab/kit-3d` · Estado: **rascunho para aprovação**

## 1. Intenção

Ao criar um nicho, você decide se os vídeos dele serão **3D** ou **2D**. Em qualquer caso, o nicho parte de um
**motor compartilhado** e de peças comuns, sem reescrever do zero o que outro nicho já resolveu. Cada nicho escreve só
a sua identidade (cores, fontes, ritmo) e as peças que são só dele.

Por quê: o lab do tech-lore provou o 3D (Ariane 5, 48 s), e o ia-lab fez outro 3D em paralelo, com outro kit. Sem um
motor comum, cada nicho novo repete as mesmas centenas de linhas e os mesmos erros de render já resolvidos:
- precisão float32 em coordenadas grandes;
- loop que não fecha;
- granulação que leva o arquivo a 400 MB;
- `clipPath` sumindo no quadro 0.

## 2. Decisões já tomadas por você

1. Criar um motor 3D compartilhado, extraído do lab, com o **tech-lore como primeiro nicho a usá-lo**.
2. **Não mexer no ia-lab** agora. Ele está na branch de outra sessão. Quando os dois trabalhos estiverem concluídos, as
   implementações serão mescladas (o ia-lab passa a usar o motor).
3. Criar um motor 2D compartilhado, extraído do template 2D do tech-lore, e a escolha de motor em `new_niche.py`.
4. Criar um módulo de personagens e de modelos prontos (GLTF) no motor 3D.

Continua valendo, das decisões anteriores:
- o tech-lore em 3D, com o visual de "maquete técnica" e o bug como mascote;
- acabamento de cinema **sem granulação**;
- planos de 1,7–3 s com a câmera em movimento, fov em torno de 50, assunto ocupando 50–60 % da largura;
- texto no chão só em planos de cima.

## 3. Objetivos, não-objetivos e anti-objetivos

**Objetivos**
1. `python3 tools/new_niche.py <nicho> --motor 3d|2d` cria um nicho que já renderiza um vídeo de exemplo, com um tema
   neutro.
2. Um vídeo novo de qualquer nicho leva uma cópia do motor e fica congelado. Atualizar o motor não muda vídeos
   antigos.
3. O pipeline (`./pipeline`) funciona igual para nichos 2D e 3D. Só muda o trecho do prompt de cenas que descreve o
   motor.
4. O tech-lore passa a produzir episódios 3D pelo pipeline, com arquivos de 30–45 MB.

**Não-objetivos**
- Mexer no ia-lab ou no `kit3d.js` dele (fica para a mesclagem, depois).
- Refazer os vídeos 001–003 do tech-lore.
- Um "motor único" para 2D e 3D. Os contratos são diferentes; o que se compartilha entre eles está na seção 5.3.
- Acelerar o render. Cerca de 9 min por vídeo é o gargalo de captura WebGL do HyperFrames.
- Música de verdade. Continua sintetizada.

**Anti-objetivos**
- Um motor desenhado no abstrato, com parâmetros que ninguém usa. Tudo que entra no motor precisa ter **pelo menos dois
  usuários reais**: o nicho e o starter de exemplo, que tem outro tema.
- Um motor que obriga o nicho a ter o visual do tech-lore: aresta de 1 px, JetBrains Mono, fundo escuro.
- Uma atualização do motor que quebra um vídeo já renderizado.
- Nichos que parecem todos o mesmo vídeo.
- Voltar aos defeitos do spike v1: planos curtos, teleobjetiva, vazio preto, ações ilegíveis.

## 4. Restrições

- HyperFrames 0.8.200 fixado, render determinístico: tudo é função de `t`, sem `Math.random()` sem semente, sem
  `requestAnimationFrame`, sem rede. O 3D é desenhado no evento `hf-seek`.
- Cada vídeo é autocontido: nada é referenciado fora da pasta do vídeo. O motor é **copiado**, como `shared/sfx/`.
- O `claude -p` da etapa de cenas só tem as ferramentas de `tools/dc/config.py`: o `python3` do sistema **sem numpy**,
  `node`, `npx` e `ffmpeg`.
- Sem API de IA paga, e modelos 3D só com licença CC0, guardados no repositório com a origem registrada.
- `compositions/captions.html` continua gerado por `tools/build_captions.py`.

## 5. Arquitetura

### 5.1 Estrutura

```
shared/
  sfx/                         (já existe)
  motor-3d/
    VERSION
    three/                     three r184 (module, core, addons usados: GLTFLoader)
    core.js                    palco, céu, neblina, sombras, pós-processamento, câmera por planos, createEpisode
    util.js                    tempo, semente, easings, tremor, piscar, seg/clamp
    materiais.js               fábricas de material a partir do tema (sólido, aresta, emissivo, "maquete", "toon", "liso")
    texto.js                   texto como textura, com a fonte do tema
    mundos.js                  chão, terreno com costa, nuvens, presets de céu (dia, noite, interior)
    personagens.js             boneco articulado com poses e ações (fase 4)
    modelos.js                 carregar GLTF local, AnimationMixer por tempo (fase 4)
    PROMPT.md                  a API e as regras do motor, para o prompt de cenas
  motor-2d/
    VERSION
    fx.js                      ajudantes GSAP: wipe, hit (tl.set), contador, cursor, tremor, stagger de palavras/letras
    blocos/                    composições reaproveitáveis: fundo com grade, título, bloco de código, placa de texto
    PROMPT.md
  trilha/
    trilha.py                  gerador de ambiente/música/efeitos a partir de um JSON de eventos + normalização (-14 LUFS)
  starters/
    3d/                        template inicial de nicho 3D (exemplo com tema neutro)
    2d/                        template inicial de nicho 2D
niches/<nicho>/
  niche.json                   + "motor": "3d" | "2d", "trilha": true | false
  tema.json                    cores, fontes, estilo de material, pós-processamento, ritmo
  template/                    starter adaptado, com o kit próprio do nicho em assets/kit/
```

Dentro de cada vídeo: `assets/motor/` (cópia do motor), `assets/kit/` (do template do nicho), `assets/episode/` (a cena
3D do vídeo) e `assets/tema.js` + `assets/tema.css` (gerados do `tema.json`).

### 5.2 Fluxo das ferramentas

- **`new_niche.py <nicho> --motor 3d|2d`:** copia `shared/starters/<motor>/` para `niches/<nicho>/template/`. Cria o
  `tema.json` neutro, o `NICHE.md` modelo e os `prompts/`. O `--from <nicho>` continua existindo para clonar um nicho
  inteiro.
- **`new_video.py`:** copia o template e `shared/sfx/` (como hoje), mais `shared/motor-<motor>/` em `assets/motor/`.
  Gera `assets/tema.js` e `assets/tema.css` a partir do `tema.json` e grava a versão do motor no `meta.json`.
- **Pipeline:**
  - **Etapa `prompt`:** o `hyperframes-prompt.md` do vídeo passa a ser `PROMPT.md` do motor + `prompts/hyperframes.md`
    do nicho, com um novo marcador `{{MOTOR}}`.
  - **Etapa nova `trilha`**, entre `cenas` e `render`, só para nichos com `"trilha": true`: roda
    `tools/.venv/bin/python shared/trilha/trilha.py <vídeo>`, que lê `<vídeo>/assets/episode/trilha.json` e grava
    `assets/audio/*.wav`. Fica no pipeline porque o `claude -p` não tem numpy.
  - As outras etapas não mudam.

### 5.3 O que é compartilhado entre 2D e 3D

- `motor-2d/fx.js` é usado também pelos nichos 3D, nos títulos 2D sobre o canvas. No lab, os títulos do Ariane já são
  GSAP puro.
- Legendas, SFX, `trilha/`, tema e pipeline são comuns aos dois.
- O que **não** se compartilha é o palco. O 3D é um canvas redesenhado a cada `hf-seek`; o 2D é uma árvore HTML com uma
  timeline GSAP.

### 5.4 Tema

O `tema.json` é a única fonte da identidade do nicho no código:
- paleta com papéis (`chao`, `tinta`, `secundaria`, `ok`, `alerta`, `destaque`…);
- fontes (títulos, código, rótulos 3D);
- estilo de material (`maquete` com aresta de 1 px, `toon`, `liso`);
- valores padrão de pós-processamento (desfoque de movimento, profundidade de campo, vinheta, aberração);
- ritmo (duração mínima de plano, easings preferidos).

O motor lê só o tema. As constantes do tech-lore que hoje estão fixas no código (`COL`, JetBrains Mono) vão para o
`tema.json` do tech-lore.

### 5.5 Motor 3D: o contrato do episódio

O episódio exporta um `build(canvas, { motor, kit, tema })`. Ele monta a cena e chama
`motor.createEpisode({ loop, shots, update(t) })`. O motor cuida de:
- registrar `buildReady`;
- escutar `hf-seek`;
- calcular a câmera do plano ativo, com balanço de mão de período compatível com o loop;
- calcular o quadro anterior para o desfoque de movimento;
- render e pós-processamento.

O episódio só descreve **o que existe** e **o estado de cada coisa em `t`**.

### 5.6 Personagens e modelos (fase 4)

- **`personagens.js`:** boneco montado com primitivas (quadril, tronco, cabeça, braços e pernas em 2 segmentos), com o
  estilo de material do tema. Tem uma biblioteca de poses (parado, andar, apontar, digitar, comemorar, pânico, cair) e
  `act(t, ação, t0)` com transição entre poses. Proporções e cores vêm de parâmetros, para cada nicho ter os seus
  personagens.
- **`modelos.js`:** carrega GLTF de `assets/modelos/` antes do `buildReady`. As animações embutidas tocam com
  `AnimationMixer.setTime(t)`, que é determinístico. Os modelos CC0 ficam em `shared/modelos/`, com origem e licença
  num `LICENSES.md`, e o nicho copia os que usa.

## 6. O tech-lore no motor 3D

- **Kit do nicho** (`niches/tech-lore/template/assets/kit/`):
  - chip;
  - registrador e bloco de bits (generalizados para qualquer tamanho e valor);
  - pulsos de dados;
  - linha de código com sublinhado;
  - contador;
  - alarme;
  - a placa de circuito;
  - o bug;
  - uma biblioteca de exteriores: foguete e base, data center, sala de pregão, aparelho hospitalar, avião, carro, sonda.
- **Arco fixo em 5 atos**, mapeado às 5 cenas do `NICHE.md`:

  | Ato | Mundo |
  | --- | --- |
  | Gancho | exterior |
  | Contexto | exterior → mergulho |
  | A falha | placa, com o bug |
  | Colapso | placa → exterior |
  | Loop | volta ao quadro 0 |

  A variação entre episódios vem do lugar, da porta do mergulho, da peça da falha, da consequência e do céu.
- **Meta:** a cena de um episódio com ≤ 250 linhas. O Ariane tem 565 hoje.
- **`NICHE.md`, `prompts/roteiro.md` e `prompts/hyperframes.md`** reescritos para o 3D. O roteiro ganha o campo `mundo`
  por cena. A proibição de "gradiente em tela cheia" passa a "céu em domo 3D permitido; nada de gradiente 2D chapado".
  A granulação por quadro fica proibida.

## 7. Fases e critérios de aceite

| Fase | Entrega | Pronto quando |
| --- | --- | --- |
| 1. Motor 3D | `shared/motor-3d/` + `tema.json` do tech-lore + kit do tech-lore; o Ariane do lab reescrito em cima | os quadros 0, 10, 21,5, 30, 39 e 48 s iguais ao render atual; `scene.js` ≤ 250 linhas; check sem erros |
| 2. Tech-lore 3D no pipeline | template 3D do tech-lore, `trilha/` + etapa `trilha`, `{{MOTOR}}` no prompt, NICHE e prompts reescritos | `./pipeline --ensaio` de ponta a ponta (o ensaio é apagado depois); um episódio real com check sem erros, planos ≥ 1,6 s, loop fechando, 30–45 MB, mix entre −15 e −13 LUFS, **aprovado por você** |
| 3. Motor 2D + starters | `shared/motor-2d/` extraído do template 2D atual, `starters/2d` e `starters/3d`, `new_niche.py --motor` | um nicho de teste de cada motor criado, renderizado e apagado; o starter 3D usa um tema visualmente oposto ao do tech-lore (claro, `liso`, outra fonte) |
| 4. Personagens e modelos | `personagens.js`, `modelos.js`, `shared/modelos/` com alguns CC0 e as licenças | o starter 3D mostra um boneco andando e apontando e um modelo GLTF animado, idênticos em dois renders seguidos |
| Depois | Mesclagem com o ia-lab | a combinar quando as duas branches estiverem concluídas |

O ponto 2 do critério da fase 3 é a prova de que o motor é genérico sem tocar no ia-lab: o starter é o segundo usuário real.

## 8. Riscos

| Risco | Mitigação |
| --- | --- |
| O `claude -p` não acerta um 3D bom sozinho | Arco fixo, biblioteca de exteriores, `createEpisode` de alto nível, snapshots obrigatórios por ato; a aprovação de cenas continua humana |
| Tema rico demais vira um sistema de configuração | Só entra no tema o que o tech-lore e o starter usam de forma diferente |
| Divergência com o `kit3d.js` do ia-lab, que dificulta a mesclagem | Usar os mesmos nomes do ia-lab quando o conceito for o mesmo (`seg`, `E`, `shake`, `PALETTE`, ação `act(t, …)`); registrar as diferenças num `MESCLAGEM.md` |
| Faixas de degradê nas cenas escuras sem granulação | Pontilhado fixo opcional no tema (cerca de 1,5× o tamanho do arquivo, testado) |
| Conflito de merge com a `feat/nicho-ia-lab`, que mexe em `tools/build_captions.py` e `tools/set_duration.py` | Este trabalho mexe em `new_niche.py`, `new_video.py` e `tools/dc/`; fazer o merge na ordem de conclusão |
| Animações GLTF não determinísticas | Só `mixer.setTime(t)`, nunca `update(delta)`; teste de dois renders idênticos na fase 4 |

## 9. Decisões minhas (confira)

- O motor é copiado para `assets/motor/` de cada vídeo, não para o template do nicho. Assim um vídeo novo sempre pega o
  motor atual, e os antigos ficam congelados.
- O tema é um `tema.json` que vira `tema.js` e `tema.css` na criação do vídeo. Isso evita ler JSON em tempo de render.
- `trilha/` é separado do motor 3D, porque um nicho 2D também pode querer trilha procedural.
- O arco de 5 atos é só do tech-lore, não do motor.
- `PROMPT.md` fica em cada motor e é injetado no prompt de cenas pelo marcador `{{MOTOR}}`.
- A biblioteca de exteriores do tech-lore começa com 7 objetos.
- O lab continua no repositório até o primeiro episódio real 3D ser aprovado. Depois a gente decide se fica.
- Todo o trabalho segue na branch `lab/kit-3d`, ou numa branch nova a partir dela, sem tocar na `main` até a fase 2 ser
  aprovada.
