# REVIEW · 002 A nota que encolheu

Estado: **renderizado, aguardando revisão humana**. Itens marcados = verificados pelo agente; desmarcados dependem de uma pessoa.

## 1. Fatos
- [x] Tabela de fatos em `roteiro.md` com fonte (IPCA, SGS 433) e período (jan/2010–dez/2025).
- [x] `python3 dados/calculo.py` → +145,3%; R$ 100 = R$ 40,76 de poder de compra; o carrinho de R$ 100 custa R$ 245,34; 2015 +10,67%; 2021 +10,06%; fim de 2021 R$ 49,31; média 0,47%/mês; 179 de 192 meses com alta (12 com deflação, 1 estável).
- [x] Arredondamentos: "quarenta e um" (40,76), "duzentos e quarenta e cinco" (245,34), "mais de dez por cento" (10,67 e 10,06), "menos da metade" (49,31): nenhum exagera a moral.
- [x] Os valores na tela (placa ano a ano, retratos 79/63/57/47/41, VALE R$ 49) vêm do mesmo cálculo.
- [x] Cartão final: fonte, período, "o IPCA é uma média", personagens fictícios, conteúdo educativo. Sem marcas nem "invista em X".
- [ ] Simplificação a confirmar: "as mesmas coisas" = cesta média do IPCA (dito no cartão), não uma compra específica.

## 2. Políticas
- [x] Roteiro, arte (SVG por código) e voz próprios.
- [x] Formato diferente do 001: "o objeto que conta" (001 foi "fábula com regra do mundo").
- [ ] Leitura e edição humana do roteiro (registrar aqui o que mudou).
- [ ] Marcar "conteúdo alterado/sintético" no upload se a plataforma pedir.
- [x] Música e efeitos: trilha procedural (`shared/trilha`, ré menor) e efeitos do catálogo.

## 2b. Voz (ouvir com fone)
- [x] Nenhuma tag lida em voz alta (transcrição Whisper conferida automaticamente).
- [x] Em ~1,8 s a voz diz "valho" corretamente (conferido de ouvido pelo dono do canal em 2026-11-12; o "vale o" era erro do Whisper).
- [ ] Emoção das tags no lugar certo (deadpan no gancho, warm no vô, whispers no fim), sem exagero.
- [ ] Ritmo confortável a 1,2× (2,81 palavras/s medidos).

## 3. Marca
- [x] Voz da série `Ivi89YTIeFmV6NfDzICt` (Eleven v3, seed 1717, acelerar 1,2), a mesma do `niche.json`.
- [x] Paleta, fonte Nunito, legenda `story-pop`; elenco novo (seu Joaquim, Lia) adicionado ao kit.

## 4. Retenção
- [x] Quadro 0 = resultado (nota de 100 que vai encolher) e último quadro da história = quadro 0 (loop).
- [x] Troca visual a cada 1–4 s.
- [x] `npx hyperframes check`: ok, 0 erros. Avisos aceitos: calendário de 2016–2020 passa em < 0,4 s de propósito (passagem de tempo).
- [x] Volume final −14,0 LUFS.
- [ ] Assistir inteiro com som e sem som.
