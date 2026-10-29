# Nicho: Tech Lore — Desastres da Tecnologia

Shorts sobre falhas de software e engenharia que custaram caro (dinheiro, missões, vidas). Narração sem rosto.
O mundo é uma **maquete técnica 3D** (Three.js): o lugar real do desastre, um mergulho para dentro da máquina e a
placa de circuito onde mora a linha de código que quebrou, com títulos de terminal por cima. Fonte da verdade da
identidade do nicho: o que está aqui vale para todo vídeo da série; o `template/` é a implementação disso e é copiado
para cada vídeo novo. Este arquivo também vai inteiro dentro dos prompts do pipeline (`prompts/`), então o que estiver
aqui guia temas, roteiro, metadados e cenas. Voz, modelos de IA e aprovações ficam em `niche.json`.

## Formato
- YouTube Shorts 1080 × 1920, 30 fps, 40–60 s (a duração final é a da locução).
- **5 cenas = 5 atos**, cada um num mundo (campo `mundo` do roteiro: `exterior`, `mergulho` ou `placa`):

  | Cena | Ato | Mundo | O que a tela faz |
  | --- | --- | --- | --- |
  | 1 | Gancho: o número absurdo | `exterior` | o lugar real do caso (foguete na base, data center, pregão…), com o título do gancho pousado no quadro 0 |
  | 2 | Contexto: quem, quando, qual máquina | `mergulho` | apresenta a máquina por fora e entra nela por uma porta física (escotilha, painel, gaveta do rack) até a placa |
  | 3 | A falha técnica explicada | `placa` | a placa por dentro: a linha de código real, chips, bits com valores reais; o bug anda e para **no ponto da falha** |
  | 4 | O colapso | `placa` → `exterior` | a peça da falha morre em vermelho, a placa avermelha, e a consequência aparece no lugar real |
  | 5 | O detalhe mais absurdo, que **emenda na primeira frase** | `exterior` | volta ao lugar real e termina no quadro 0 (loop) |

  Na cena 4, `mundo` é onde ela passa mais tempo (`placa` ou `exterior`).
- Variação entre episódios: **o lugar, a porta do mergulho, a peça da falha, a consequência e o céu**. O arco fica.
- Último quadro = quadro 0: o último plano termina na posição de câmera do primeiro, o título do gancho remonta no
  mesmo lugar e tudo que pisca ou balança tem período que divide a duração.
- Legenda queimada (grupos de até 3 palavras, palavra falada em verde-menta).
- Todo evento visual preso ao início da palavra correspondente na transcrição (`assets/voice.json`): cortes de plano,
  títulos, o bug parando, a peça morrendo, os efeitos da trilha.

## Roteiro
- Frase 1 = gancho com número concreto (dinheiro, tempo, pessoas). Nada de "você sabia".
- Fatos verificáveis: nome do sistema, data, número de série/voo, a linha ou o tipo de erro real.
- A falha tem uma **peça física** que dá para mostrar na placa e o bug pisar: a conversão, a variável, o campo do
  arquivo, a flag, o registrador.
- Última frase termina em suspensão ("Foi exatamente assim que...") e completa a frase 1.

## Visual
- **Maquete técnica:** sólidos foscos escuros com aresta de 1 px, a grade da série, sombras e escala reais. Lugar
  real, nunca um vazio preto. O motor (`assets/motor/`, guia `PROMPT.md`) dá palco, câmera, céu, pós e texto; o kit do
  nicho (`assets/kit/`, guia `KIT.md`) dá chip, registrador, bits, barramento, linha de código, placa, efeitos,
  exteriores e o bug. Nada modelado do zero quando o kit tem a peça.
- **Exteriores do kit:** foguete e base de lançamento (Ariane 5), data center, sala de pregão, sala de radioterapia,
  avião, carro, sonda espacial. Cada um tem que se ler pelo que é num enquadramento 9:16 aberto, sem rótulo. Quando o
  caso não tem um exterior próprio, use o lugar do kit mais próximo do que aconteceu.
- **Mergulho contínuo:** do exterior para dentro da máquina por uma porta física, sem corte seco no meio; a placa por
  dentro é viva (pulsos de dados, LEDs, facho de luz seguindo o foco).
- **O bug** (besouro da série: corpo escuro, aresta vermelha, olhos menta) aparece **no ponto da falha**: anda pela
  linha de código e para exatamente na conversão, no campo ou na flag que quebrou. Não passeia pela tela à toa.
- **Céu em domo 3D permitido** (dia dessaturado no exterior, céu escuro na placa, estrelas no espaço); nada de
  gradiente 2D chapado em tela cheia.
- Cores (tema do vídeo, `COL` no código): chão `#080a0f`, tinta `#e6edf3`, cinza `#7d8590` = comentários e rótulos de
  código, ciano `#38bdf8` = tipos, tempo e dados, verde-menta `#00ff9d` = estado OK / palavra ativa, vermelho
  `#ff3366` = erro, dinheiro, colapso.
- Fonte única: JetBrains Mono 400/700/800 (títulos 2D e texto 3D). Títulos 2D 112–140 px, tracking −2 %, com placa
  escura atrás; subtítulo 40 px com `// ` em cinza. Código no chão da placa, legível de cima.
- Texto 2D só em x 96–948 e y 200–1130; legendas com base em y 1310; abaixo de 1330 nenhum texto (UI do Shorts).
- **Câmera e ritmo:** planos de 1,7–3 s, trocados na palavra-âncora; câmera sempre em movimento dentro do plano;
  fov ~50 (aproxime pela distância, não pelo fov); assunto ocupando 50–60 % da largura (assunto alto: ~55 % da altura);
  alterne aberto/próximo e direção entre planos seguidos. Texto no chão só em plano de cima; em plano rasante, texto
  de frente. Profundidade de campo alta nos planos próximos, baixa nos abertos.
- **Pós de cinema:** profundidade de campo, desfoque de movimento, vinheta leve, aberração cromática só no estouro.
  **Granulação 0, sempre.**
- Movimento 2D: títulos entram em wipe expo.out 0,35–0,5 s; acertos = `tl.set` de 0 ms; título pousado fica parado.
  Tremores determinísticos (câmera e peça) no estouro.
- Proibido: granulação, glow/neon, partículas decorativas, gradiente 2D chapado em tela cheia, câmera parada, objeto
  genérico no lugar de um exterior do kit, tudo centralizado, tudo entrando com fade+slide-up, cantoneiras/HUD
  decorativo, `Math.random`/`Date.now` (tudo é função do tempo).

## Som
- Locução: voz única da série (mesma voz e velocidade em todos os episódios).
- **Trilha procedural** (não há música de banco): `assets/episode/trilha.json` vira três faixas na etapa `trilha` do
  pipeline (`shared/trilha/trilha.py` → `assets/audio/`):
  - `ambiente.wav`: vento no exterior, zumbido elétrico na placa, alarme tremendo no colapso;
  - `musica.wav`: drone e brilho sustentados, pulso que cresce da falha ao colapso;
  - `efeitos.wav`: trava, deslize, baque, estalo, faísca, clique, tique nos acertos.
  Tempos absolutos, presos às mesmas âncoras dos planos.
- SFX de `assets/sfx/` (copiados de `shared/sfx/`) só nos acertos que a trilha não cobre, pico 1 quadro após a imagem;
  silêncio depois do clímax.
- O render normaliza o mix a **−14 LUFS** (`audio_lufs` do `niche.json`); aceitável entre −15 e −13.
- Arquivo final de 30–45 MB para 45–60 s.

## Episódios
Os episódios 001–003 são **2D** (motion graphics de terminal, template antigo) e ficam congelados assim. Do próximo em
diante, a série é **3D** (template atual).

| Nº | Pasta | Tema | Estado |
| --- | --- | --- | --- |
| 001 | `videos/001-ariane5` | Ariane 5 — overflow de 64→16 bits (1996) · 2D | renderizado |
| 002 | `videos/002-crowdstrike-channel-291` | CrowdStrike — Channel File 291 (2024) · 2D | parado no roteiro (erro da IA) |
| 003 | `videos/003-knight-capital-440m` | Knight Capital — flag de código morto, US$ 440 mi (2012) · 2D | renderizado pelo pipeline |

## Lições do 001
- O Whisper `base` erra palavras curtas ("Ao 36" → "Aos 36"): corrigir em `captions.json` → `fixes`.
- Revisar os SFX ouvindo; no 001 eles foram só medidos.
- O flash branco a 80 % pode ser forte no celular; 60 % é mais seguro.
- **Granulação:** no Ariane 5 refeito em 3D, ruído novo a cada quadro levou o MP4 de 33 MB para 445 MB (o codificador
  não comprime ruído). Granulação fica em 0; faixas de degradê no escuro se resolvem de outro jeito.
- No 3D: coordenadas perto da origem (a placa vai numa base fixa, não a milhares de unidades), e o título do quadro 0
  com `clipPath` explícito em t = 0 (um `fromTo` posterior o apagaria).
