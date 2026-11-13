# 001 · A árvore de juros

Formato: **fábula com regra do mundo** (rotação de formatos em `../../NICHE.md`).
Ideia única: começar cedo vale mais do que colocar mais dinheiro (juros compostos).
Dado que atravessa o vídeo: R$ 200 por mês a 100% do CDI.

## Fatos e fontes

| Afirmação | Valor | Fonte / cálculo |
| --- | --- | --- |
| CDI mensal jan/2010–dez/2025 | 192 meses | Banco Central, SGS série 4391 (`dados/cdi.json`) |
| Ana: R$ 200/mês, jan/2010–dez/2015 (72 aportes) | investiu R$ 14.400 | `dados/calculo.py` |
| Bruno: R$ 200/mês, jan/2016–dez/2025 (120 aportes) | investiu R$ 24.000 | `dados/calculo.py` |
| Ana em dez/2025, líquido de IR (tabela regressiva por aporte) | **R$ 43.462** | `dados/calculo.py` |
| Bruno em dez/2025, líquido de IR | **R$ 37.349** | `dados/calculo.py` |
| Diferença investida | R$ 9.600 a menos para Ana | 24.000 − 14.400 |
| Inflação (IPCA) no período | +145,3% | SGS série 433; valores do vídeo são **nominais** (dito no cartão final) |

Ana e Bruno são personagens fictícios; os números são reais (aporte no 1º dia útil do mês, sem taxas).

## Roteiro (narração)

1. A árvore dela ficou maior. E ela plantou quase dez mil reais a menos.
2. Nessa rua, todo dinheiro que você guarda vira uma árvore no quintal.
3. E toda árvore dá fruto. O fruto é o juro.
4. Quando o fruto cai, ele vira semente. E nasce mais galho.
5. Aqui, plantar é deixar o dinheiro rendendo cem por cento do CDI.
6. Em janeiro de 2010, a Ana tinha vinte anos e plantou duzentos reais.
7. No mês seguinte, mais duzentos. E no outro. E no outro.
8. Os vizinhos riam. "Isso aí é graveto, Ana."
9. Seis anos depois, a Ana teve uma filha. E parou de plantar. Nunca mais colocou um real.
10. Ela tinha plantado catorze mil e quatrocentos.
11. Foi aí que o Bruno, da casa ao lado, olhou pra árvore dela e pensou: agora é a minha vez.
12. De 2016 até 2025, o Bruno plantou duzentos reais todo mês. Dez anos. Nunca falhou.
13. Vinte e quatro mil reais.
14. E a árvore da Ana? Ninguém mexia nela. Ela só crescia.
15. No fim de 2025, a rua inteira foi medir.
16. A árvore do Bruno: trinta e sete mil.
17. A da Ana: quarenta e três mil.
18. "Mas eu plantei mais!"
19. A Ana apontou pro chão. "Você plantou mais dinheiro. Eu plantei mais tempo."
20. Os frutos dela caíram por dezesseis anos. Cada fruto virou semente. E cada semente deu fruto também.
21. Por isso, nessa rua, ninguém pergunta quanto você plantou. Pergunta quando.
22. Ontem, a filha da Ana plantou a primeira moeda.
23. E daqui a uns anos, alguém vai olhar pra rua e dizer: a árvore dela ficou maior.

Cartão final (texto, sem narração, 3 s): valores reais, 100% do CDI (Banco Central), jan/2010–dez/2025,
líquidos de IR, sem descontar a inflação. Personagens fictícios. Conteúdo educativo, não é recomendação de investimento.
