# 002 · A nota que encolheu

Formato: **o objeto que conta** (rotação em `../../NICHE.md`; o 001 foi "fábula com regra do mundo").
Ideia única: dinheiro parado perde poder de compra (inflação), mesmo sem ninguém gastar.
Dado que atravessa o vídeo: uma nota de R$ 100 guardada de jan/2010 a dez/2025, corrigida pelo IPCA.

## Fatos e fontes

| Afirmação | Valor | Fonte / cálculo |
| --- | --- | --- |
| IPCA mensal jan/2010–dez/2025 | 192 meses | IBGE, via Banco Central (SGS série 433, `dados/ipca.json`) |
| IPCA acumulado no período | +145,3% (fator 2,4534) | `dados/calculo.py` |
| "Hoje, valho quarenta e um" | R$ 40,76 em dinheiro de jan/2010 | 100 ÷ 2,4534 |
| "custavam duzentos e quarenta e cinco reais" | R$ 245,34 | 100 × 2,4534 (dito para baixo) |
| "quase meio por cento por mês, em média" | 0,47% | média dos 192 meses |
| "quase todo mês" | 179 de 192 meses com alta (12 com deflação, 1 estável) | `dados/calculo.py` |
| "Em 2015, mais de dez por cento num ano só" | +10,67% | IPCA de jan a dez/2015 |
| "Em 2021, mais dez por cento" | +10,06% | IPCA de jan a dez/2021 |
| "já valia menos da metade" (fim de 2021) | R$ 49,31 | `dados/calculo.py` |

Seu Joaquim e Lia são personagens fictícios. "As mesmas coisas" = a cesta média do IPCA; cada item variou
diferente (dito no cartão final). Nota guardada sem render nada (dinheiro em espécie).

## Roteiro (narração; quem fala é a nota)

1. Eu valia cem reais. Hoje, valho quarenta e um. E ninguém nunca me gastou.
2. Eu sou uma nota de cem.
3. Em janeiro de 2010, o seu Joaquim me dobrou em quatro e me guardou numa lata de biscoito.
4. No envelope, ele escreveu: "Pra Lia, nos dezoito anos."
5. A Lia tinha dois anos. Eu era o dinheiro mais bem guardado da casa.
6. Lá fora, os preços subiam. Quase todo mês, um pouquinho. Quase meio por cento por mês, em média.
7. Ninguém reparava. Nem eu.
8. Em 2015, os preços subiram mais de dez por cento num ano só.
9. Eu continuava escrito cem.
10. Em 2021, mais dez por cento. E eu já valia menos da metade.
11. E eu ali. Dobrada. Quietinha. Achando que estava segura.
12. Em dezembro de 2025, a Lia fez dezoito anos. O vô abriu a lata.
13. "Cem reais, minha neta. Guardei pra você."
14. A Lia sorriu. E me levou ao mercado.
15. Foi lá que eu entendi.
16. As mesmas coisas que eu pagava em 2010 agora custavam duzentos e quarenta e cinco reais.
17. Eu continuava escrito cem. Mas, por dentro, eu valia quarenta e um.
18. Ninguém me roubou. Ninguém me gastou. Os preços me comeram, um pedacinho por mês.
19. Dinheiro parado não fica parado. Ele encolhe.
20. Ontem, a Lia ganhou outra nota de cem. E já estava procurando uma lata.
21. Eu queria avisar. Mas nota não fala.

Cartão final (texto, sem narração): IPCA (IBGE/Banco Central), jan/2010–dez/2025, +145,3%. R$ 100 guardados
sem render compram hoje o que R$ 41 compravam em 2010. O IPCA é uma média: cada preço variou diferente.
Personagens fictícios. Conteúdo educativo, não é recomendação de investimento.
