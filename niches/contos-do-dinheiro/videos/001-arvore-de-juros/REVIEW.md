# REVIEW · 001 A árvore de juros

Estado: **renderizado, aguardando revisão humana**. Os itens marcados foram verificados pelo agente; os
desmarcados dependem de uma pessoa.

## 1. Fatos
- [x] Tabela de fatos em `roteiro.md` com fonte (BCB SGS 4391 e 433) e período (jan/2010–dez/2025).
- [x] `python3 dados/calculo.py` → Ana investiu R$ 14.400 e tem R$ 43.462; Bruno investiu R$ 24.000 e tem R$ 37.349 (líquidos de IR, tabela regressiva por aporte).
- [x] Fala "quase dez mil a menos" (real: R$ 9.600), "trinta e sete mil" (37.349), "quarenta e três mil" (43.462): arredondamentos para baixo, não exageram a moral.
- [x] Cartão final: fonte, período, IR descontado, inflação **não** descontada (IPCA +145,3%), personagens fictícios, conteúdo educativo.
- [x] Sem marcas, sem promessa de ganho, sem "invista em X".
- [ ] Simplificações a confirmar por uma pessoa: aporte no 1º dia do mês, sem taxa de custódia, "100% do CDI" como rentabilidade (um CDB/Tesouro Selic real rende perto disso, não exatamente).

## 2. Políticas
- [x] Roteiro, arte (SVG desenhado por código) e voz próprios. Nada copiado dos vídeos de referência.
- [x] Formato 1 da rotação (fábula com regra do mundo). O próximo episódio deve usar outro.
- [ ] Leitura e edição humana do roteiro (registrar aqui o que mudou).
- [ ] Marcar "conteúdo alterado/sintético" no upload se o YouTube pedir (voz ElevenLabs).
- [x] Música e efeitos: trilha procedural do repo (`shared/trilha`) e SFX de `shared/sfx` (créditos em `assets/sfx/CREDITS.md`).

## 3. Marca
- [x] Voz `YNOujSUmHtgN6anjqXPf` com os ajustes de `niche.json`.
- [ ] Decidir se esta voz de biblioteca fica como marca ou se cria uma voz própria (Voice Design) antes do episódio 002.

## 4. Retenção
- [x] Quadro 0 = o resultado (as duas árvores e as placas R$ 14.400 × R$ 24.000).
- [x] Troca visual a cada 1–4 s (calendário, contadores, grade de 120 meses, cortes de mundo).
- [x] Último quadro da história = quadro 0 (mesma rua, mesmas placas), antes do cartão final.
- [x] `npx hyperframes check`: ok (avisos aceitos: calendário em passagem de tempo fica < 0,4 s de propósito; esconder estados iniciais via `tl.set`).
- [ ] Assistir inteiro com som e sem som.

## Pontos fracos conhecidos (para a próxima versão)
- Personagens rígidos (só braços, cabeça e boca se mexem); falta antecipação e caminhada.
- O cartão final quebra o loop perfeito; testar o aviso como placa dentro da última cena.
- Música procedural em tom menor: funciona, mas uma trilha de biblioteca leve (piano/caixinha) deve reter melhor.
- 117 s é longo para Shorts; testar um corte de ~60 s (gancho → Ana → Bruno → medição → moral).
