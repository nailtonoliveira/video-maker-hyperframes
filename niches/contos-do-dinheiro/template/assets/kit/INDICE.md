# Kit visual · Contos do Dinheiro (índice)

Leia **este índice**, não o kit inteiro. Abra só o arquivo da peça que for usar, quando precisar ver o desenho ou os ids.
Ilustração 2D chapada desenhada em SVG por código: traço `C.ink` de `SW` (5 px), cores lisas, sem degradê (exceto céu), sem brilho.
Cada peça devolve uma **string SVG** com ids prefixados pelo `id`/`p` que você passa; tudo é determinístico (sem `Math.random`; use `K.rng(semente)`).

## Como montar uma cena (câmera perto)
1. **Palco pronto**: `const P = K.palco.<nome>("<prefixo>", {...})` → `{ fundo, moveis, frente, chao, escala, vagas, ambiente }`.
   Monte nesta ordem: `P.fundo` + (quem fica **atrás** dos móveis, ex.: o juiz) + `P.moveis` + atores e objetos + `P.frente`.
   O palco já enche a tela de cima a baixo (parede/céu, móveis, chão em perspectiva e primeiro plano). **Não desenhe chão liso**.
2. **Atores**: `K.ator(id, "ana", P.vagas.esq)` põe a pessoa do `ELENCO` com os pés em `P.chao` (y 1400) e escala 1,45 (~480 px, rosto em y ~1000).
   Mais ao fundo: `{ escala: 0.8, y: 1300 }`. Partes animáveis: as de `K.person` (`<id>-armL/-armR`, `<id>-head`, `<id>-body`, bocas).
3. **Texto e números** na faixa `K.PALCO.LIVRE` (x 160–920, y 170–740): placas, calendários, carimbos, visores. A legenda fica em y 1150–1300.
4. **Ambiente**: `P.ambiente(tl, T0, 0, DUR)` uma vez por cena (nuvens, vapor, carro, plateia...). É função do tempo absoluto e fecha o loop sozinho.
5. Peça nova do episódio: escreva em **`episodio.js`** (não mexa nos outros arquivos do kit) e acrescente uma linha aqui.

## Faixas da tela (1080 × 1920)
| y | O que vai |
| --- | --- |
| 0–170 | topo (a interface da plataforma cobre): só céu/parede |
| 170–740 | **LIVRE**: placas, números, calendários (x 160–920) |
| 740–1150 | rostos e tronco dos atores, móveis, objetos de cena |
| 1150–1300 | legenda (nada de rosto nem texto aqui; corpo e móveis podem) |
| 1300–1500 | pés dos atores (y 1400) e chão com detalhe |
| 1500–1920 | primeiro plano do palco (decoração; a interface da plataforma cobre parte) |


## `base.js` (11 KB)
Base do kit: cores (C), traço (SW), texto (T), sorteio com semente (rng), elenco fixo (ELENCO) e ajudantes de animação.

- `K.rng(seed)`: Pseudoaleatório com semente (determinístico).
- `K.brl(n)`
- `K.pop(tl, sel, t, o = {})`: Pula para dentro com exagero (estado final escala 1).
- `K.out(tl, sel, t, dur = 0.2)`
- `K.mouth(tl, id, name, t)`: Troca a boca visível (sem interpolação: uma "pose").
- `K.counter(tl, sel, a, b, t, dur, fmt = brl)`: Contador de dinheiro num <text>: segue a linha do tempo (onUpdate é chamado em toda busca).
- `K.page(tl, id, n, i, t)`: Mostra só a página i do calendário no tempo t.
- `K.idle(tl, id, ini, fim, fase = 0)`: Respiração de personagem (vida no repouso): pequenas oscilações com fase própria, só até 'fim'.
- `K.turn(tl, sel, a0, a1, t, dur, ease = "power2.inOut")`: Gira um braço (ou qualquer <g> cuja origem local é o pivô) por atributo rotate(a): o pivô é sempre o ombro, mesmo com adereço na mão. Não misture com 'rotation' do GSAP no mesmo elemento. pose() define o estado inicial.
- `K.pose(tl, sel, a)`
- `K.slam(tl, sel, t)`: Carimbada: entra grande e bate (estado final escala 1).
- `K.periodo(p)`: Período ajustado para caber um número inteiro de vezes na voz: o último quadro repete o quadro 0.
- `K.ciclo(tl, T0, ini, fim, fn)`: Ciclo de ambiente: fn(tempoAbsoluto) ajusta atributos. É função do TEMPO ABSOLUTO da narração (emenda entre cenas), e roda a cada busca de quadro (seguro para o render). ini/fim: tempo da cena (t(abs)); T0: início absoluto da cena.
- `K.tf(id, v)`
- `K.op(id, v)`
- `K.piso(id, y0, o = {})`: Piso em perspectiva de y0 (encontro com a parede) até o fim da tela; ponto de fuga em (540, y0 - fuga). o.tipo: "xadrez" (cores[0]/cores[1]) | "tabuas" (madeira) | "pedras" (calçada). Desenhado por código, sem textura.
- `K.fios(id, n = 3, o = {})`: Fios de vapor/fumaça (ids <id>-f0..n-1), animados por vapor(): base no (0,0).
- `K.vapor(id, abs, n = 3, P = 1.6)`

## `pessoas.js` (10 KB)
Personagens: pessoa (elenco), figurante e balão de fala.

- `K.person(id, o = {})`: Pessoa: pés no (0,0). tipo: adulto (~330 px) ou crianca (~230 px). Partes animáveis: <id>-armL, <id>-armR, <id>-head, bocas <id>-m-smile|open|sad|flat (só 'boca' visível). o.propL / o.propR: SVG desenhado dentro do braço (coordenadas do braço: ombro no (0,0), mão em (±14, 98)); gira junto.
- `K.bubble(id, linhas, o = {})`: Balão de fala/pensamento (centro no (0,0)); a cauda aponta para (tx, ty) relativo ao centro.
- `K.ator(id, quem, x, o = {})`: Ator: pessoa do elenco já no enquadramento do palco. quem: nome do ELENCO ("ana") ou objeto de opções de person(). x: centro; o.y: linha dos pés (padrão PALCO.CHAO); o.escala multiplica a escala do palco (ex.: 0.8 = mais ao fundo); o.pessoa: opções extras de person() (boca, propL, propR...). Partes animáveis: as de person() com o mesmo id.
- `K.figurante(id, i = 0, o = {})`
- `K.costas(id, i = 0, o = {})`: Pessoa DE COSTAS (cabeça e ombros), para plateia, fila e primeiro plano: base dos ombros no (0,0), ~220 × 250. <id>-cab (cabeça, pode balançar). i escolhe roupa/cabelo como em figurante().

## `palco-cozinha.js` (11 KB)
Palco "cozinha" (casa): parede com janela, bancada, geladeira, piso xadrez em perspectiva

- `K.palco.cozinha(p, o = {})`: o: { parede, listra, noite (janela com céu de noite e lua), mesa (false = sem mesa na frente), xicara (false = mesa sem xícara) } Tampo da bancada em y 985 (objetos em cima: base nesse y). ids: <p>-janela, <p>-cortina, <p>-geladeira, <p>-bancada, <p>-relogio, <p>-mesa, <p>-cadeira

## `palco-rua.js` (9 KB)
Palco "rua" (bairro): céu, casas recortadas nas bordas, calçada em perspectiva onde os atores

- `K.carro(id, cor = "#3d5a80")`: Carro visto de lado: centro das rodas no y=0, ~420 × 190. Rodas <id>-r0/-r1 (giram).
- `K.palco.rua(p, o = {})`: o: { ceu: "skyDay"|"skyDusk"|"skyNight", casas: [{cor, telhado, num}, {cor, telhado, num}], carro (false = sem carro) } ids: <p>-n1/-n2 (nuvens), <p>-aves, <p>-carro, <p>-poste-luz, casas <p>-casa-esq/-dir

## `palco-loja.js` (9 KB)
Palco "loja": mercado (prateleiras de produtos e caixa com visor) ou padaria (pães e vitrine).

- `K.estante(id, x, y, w, h, o = {})`: Estante com produtos (deterministas pela semente): canto superior esquerdo em (x, y).
- `K.palco.loja(p, o = {})`: o: { tipo: "mercado" | "padaria", nome: "MERCADO" (placa no alto; omita para não ter placa), visor: "R$ 0" } ids: <p>-visor-txt (texto do visor do caixa, mercado), <p>-lamp0/1, <p>-fregues, <p>-placa-nome

## `palco-tribunal.js` (5 KB)
Palco "tribunal" (do bairro): parede com lambris, janelas altas com cortina, mesa do juiz ao

- `K.palco.tribunal(p, o = {})`: o: { placa: "TRIBUNAL DO BAIRRO" (plaquinha na mesa do juiz; "" = sem), plateia: 0..4 (padrão 4), luz (cone sobre o centro) } Ordem de montagem: fundo + atras (o juiz: K.ator(id, "vizinho", P.vagas.juiz.x, P.vagas.juiz)) + moveis + atores + frente. ids: <p>-mesa-juiz, <p>-plateia0..3 (-cab balança), <p>-cort*, <p>-cone

## `palco-praca.js` (7 KB)
Palco "praca": céu, árvores grandes e coreto ao fundo, caminho de pedras em perspectiva onde os

- `K.pombo(id, o = {})`: Pombo: pés no (0,0), ~90 px. <id>-cab (bica o chão: gira).
- `K.palco.praca(p, o = {})`: o: { ceu, coreto (false = sem), pombos (0..3, padrão 3) } ids: <p>-n1, <p>-arv-esq/-dir (balançam), <p>-pombo0..2 (-cab bica), <p>-agua (chafariz)

## `natureza.js` (9 KB)
Céu, nuvem, morros, chão, árvore, broto, casa, carrinho de bebê, caixa de correio, cerca e o quintal em corte.

- `K.sky(id, kind)`
- `K.cloud(id, x, y, s)`
- `K.hills(id, y)`
- `K.ground(id, y)`: Chão do bairro: grama, calçada e rua (decoração abaixo da faixa de texto).
- `K.tree(id, nFrutos = 0, opts = {})`
- `K.sprout(id)`: Broto: base no (0,0), ~90 px.
- `K.house(id, o = {})`: Casa: canto inferior esquerdo no (0,0); largura w.
- `K.stroller(id)`: Carrinho de bebê (base no (0,0)).
- `K.mailbox(id, nome)`: Caixa de correio com nome (base no (0,0)).
- `K.fence(id, x0, x1, y, color = "#fff6e3")`
- `K.corte(p, y = 905)`: Corte do quintal (o chão visto em seção): céu em cima, grama na linha y, terra embaixo.
- `K.drop(id)`: Gota de suor: centro no (0,0).

## `dinheiro.js` (12 KB)
Dinheiro: moeda, nota com rosto, lata, envelope, pilha de moedas, saco, cofrinho, cartão, maquininha, extrato, mão com cartão, bolso, ralo.

- `K.coinShape(r)`
- `K.coin(id, r = 26)`
- `K.note(id, o = {})`: Nota de R$ 100 com rosto: centro no (0,0), 440 × 220. Encolher = escalar <id>-body (o "100" continua escrito). Bocas <id>-m-smile|open|sad|flat, olhos <id>-olhos (abertos) e <id>-sono (fechados).
- `K.tin(id, o = {})`: Lata de biscoito: base no (0,0), 320 × 270. Tampa em <id>-lid (gira para abrir em torno da borda esquerda). o.corte: frente translúcida (para ver a nota lá dentro, que vai num <g> desenhado depois da lata).
- `K.envelope(id, linhas, o = {})`: Envelope (centro no (0,0)) com uma ou mais linhas manuscritas.
- `K.cardMachine(id)`: Maquininha de cartão (azul): base no (0,0). Tela verde "OK" em <id>-ok (escondida).
- `K.card(id)`: Cartão: centro no (0,0), 170 × 108.
- `K.piggy(id)`: Cofrinho de porcelana: base no (0,0), ~240 × 160.
- `K.drain(id)`: Ralo: centro no (0,0).
- `K.coinStack(id, n, o = {})`: Pilha de moedas de lado: base no (0,0); moedas <id>-c0..(n-1) de baixo para cima.
- `K.moneyBag(id)`: Saco de dinheiro: centro no (0,0), ~150 × 190.
- `K.handCard(id, o = {})`: Mão (manga do Bruno) segurando o cartão, vinda da esquerda: centro do cartão no (0,0).
- `K.pocket(id, o = {})`: Bolso de calça em close: centro no (0,0), tecido w × h.
- `K.statement(id, linhas, o = {})`: Visor de extrato: centro no (0,0). linhas: [[esquerda, direita], ...]; linha do saldo com bloco-cursor <id>-cursor.

## `papelaria.js` (9 KB)
Texto dentro da arte: placa, calendário, folha de calendário, carimbo, pasta, comanda, quadro da semana, quadro que desenrola, selo, relógio.

- `K.sign(id, linhas, o = {})`: Placa de madeira com texto (centro no (0,0)). linhas: [[texto, tamanho, cor?], ...]
- `K.calendar(id, paginas, o = {})`: Calendário de parede (centro no (0,0)): uma página por item de 'paginas' (ids <id>-p0..), só a 1ª visível.
- `K.folder(id, linhas, o = {})`: Pasta do processo (amarela): centro no (0,0). linhas: [[texto, tamanho], ...] na etiqueta.
- `K.stamp(id, texto, o = {})`: Carimbo (centro no (0,0)): moldura dupla e texto em vermelho; o.bg pinta o fundo (para ler sobre desenho).
- `K.clock(id, r = 80)`: Relógio de parede: centro no (0,0). Ponteiros <id>-h e <id>-m (rotation 0 = 12h; giram em torno do centro).
- `K.comanda(id, linhas, o = {})`: Comanda de papel presa na parede: centro no (0,0). linhas: [[texto, tamanho, cor?], ...]
- `K.weekBoard(id)`: Quadro "TODO DIA" com os dias úteis: centro no (0,0). Marcas <id>-k0..4 (escondidas).
- `K.calSheet(id)`: Folha de calendário solta (centro no (0,0)).
- `K.scrollBoard(id, w = 720, h = 840)`: Quadro de papel que desenrola: rolo de cima centrado no (0,0); folha <id>-folha (escala Y do topo) até h; rolo de baixo <id>-rolo.
- `K.seal(id, linhas, r = 96)`: Selo redondo (fonte dos dados), sem emblema: centro no (0,0).

## `casa.js` (10 KB)
Casa e comida: mesa, bolo, bancada, pilha de comprovantes, xícara com rosto (e vapor), broa, pão de queijo, prato.

- `K.table(id, w = 620)`: Mesa simples (topo em y=0, centro x=0).
- `K.cake(id, n)`: Bolo de aniversário (base no (0,0)) com o número em velas.
- `K.cup(id, o = {})`: Xícara com rosto (o réu): base do pires no (0,0), ~150 px até a borda. Bocas <id>-m-*, olhos <id>-olhos / <id>-feliz, fios de vapor <id>-v0..2 (animados por steam()).
- `K.steamPose(ids, abs)`
- `K.steam(tl, ids, T0, ini, fim)`
- `K.broa(id)`: Fatia de broa de milho: base no (0,0), 150 × 80. Mordidas = círculos da máscara <id>-b0..2 (animar attr r 0 → 34).
- `K.paoQueijo(id)`: Pão de queijo: base no (0,0), ~110 × 70.
- `K.plate(id, rx = 140)`: Prato raso: centro no (0,0).
- `K.cabinet(id, w = 860, h = 250)`: Bancada com gaveta: topo em y=0, centro x=0, até y=h. Frente da gaveta <id>-gaveta.
- `K.receiptPile(id, w = 760, h = 560)`: Pilha de comprovantes: base no (0,0) (centro), ~w × h. Cresce escalando <id>-in a partir da base.
- `K.lampada(id, x, y, cor)`: Lâmpada pendente: fio do teto até (x, y); <id> balança em torno do teto.

## `comercio.js` (3 KB)
Comércio: produto de mercado, vitrine com balcão, mão do balconista.

- `K.product(id, nome, cor, o = {})`: Produto de mercado (base no (0,0)): caixa ou garrafa com rótulo.
- `K.showcase(id, w = 760, h = 190)`: Vitrine com balcão: topo do balcão em y=0, centro x=0, até y=h. Vidro <id>-vidro (acende: fill).
- `K.clerkHand(id)`: Mão do balconista (manga branca) entrando pela direita: ponta da mão no (0,0).

## `tribunal.js` (7 KB)
Tribunal: fundo, banco dos réus, holofote, balança, martelo e base, mesa do juiz.

- `K.court(p, o = {})`: Fundo do tribunal: parede creme, lambris de madeira (y lam..piso), piso de tábuas. o.x0/o.w: faixa do mundo (panorâmicas).
- `K.dock(id, texto, o = {})`: Banco dos réus: topo em y=0, centro x=0, até y=h (piso). Plaqueta de metal <id>-placa.
- `K.spotlight(id, o = {})`: Cone de luz chapado (holofote): do teto (xa..xb em y0) ao chão (xc..xd em y1), com a mancha elíptica no fim.
- `K.balance(id, o = {})`: Balança da justiça: pivô do braço no (0,0); coluna até y=360. Braço <id>-beam (gira), pratos <id>-panL/-panR (sobem/descem L·sen θ junto com o braço). Conteúdo dos pratos: o.left / o.right (base no fundo do prato).
- `K.tilt(tl, id, th, t, L = 150)`: Inclina a balança até θ graus (negativo = prato esquerdo desce), com balanço amortecido.
- `K.gavel(id, dx = -14)`: Martelo de juiz (adereço de braço: K.person({ propL: gavel(...) })): cabo ao longo do braço, cabeça atravessada.
- `K.gavelBlock(id)`: Base do martelo: base no (0,0).
- `K.judgeDesk(id, w = 600, h = 250)`: Mesa do juiz (madeira escura): topo em y=0, centro x=0, até y=h.

## `episodio.js` (1 KB)
Peças NOVAS deste episódio (só dele). Mesmo estilo do kit: traço C.ink de SW px, cores lisas,

