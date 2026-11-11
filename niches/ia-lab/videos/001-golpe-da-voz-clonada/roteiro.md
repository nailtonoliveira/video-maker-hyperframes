# O Golpe dos 3 Segundos: Como a IA Rouba a Voz de Quem Você Ama

**Título na tela (frame 0):** O GOLPE DOS 3 SEGUNDOS  
**Resumo:** Uma amostra de 3 segundos em redes sociais basta para a IA clonar sua voz e aplicar golpes na sua família. Descubra como funciona a clonagem e a regra simples da palavra secreta para zerar esse perigo.  
**Palavras:** 124 (≈ 53 s de narração)

## Cena 1 — O Gancho e o Story Comum

**Locução:** 3 segundos de áudio do seu Instagram já bastam pra clonar a sua voz. Você posta um story inocente, sem imaginar o risco.

**Visual:** Faixa: 'O GOLPE DOS 3 SEGUNDOS' | Placar: 'AMOSTRA: 3s' | 3D: Bancada grafite com linhas âmbar. Droide usuário (user, ciano) grava stories no smartphone com visor focado '●_●'. Monitor 3D exibe onda sonora verde curta com a legenda 'AUDIO_STORY.wav'.

**Âncoras:**
- "3 segundos de áudio" → setBanner('O GOLPE DOS 3 SEGUNDOS') e setScore('AMOSTRA', '3s', 'amber')
- "posta um story inocente" → user.act(t, 'point') e tela 3D acende onda sonora verde AUDIO_STORY.wav

## Cena 2 — O Fatiador de Voz

**Locução:** A inteligência artificial pega esse trechinho, fatia seu tom e respiração em blocos e aprende a falar qualquer frase.

**Visual:** Faixa: 'FATIANDO SUA VOZ' | Placar: 'CLONE: 100%' | 3D: Entra o droide técnico (coder, amarelo) operando um módulo fatiador 3D. A onda de som é cortada em três blocos luminosos e uma seta 3D âmbar transfere os dados para o sintetizador.

**Âncoras:**
- "fatia seu tom" → setBanner('FATIANDO SUA VOZ') e fatiador 3D divide o áudio em blocos luminosos
- "aprende a falar qualquer" → coder.act(t, 'type') e setScore('CLONE', '100%', 'cyan')

## Cena 3 — O Droide Impostor

**Locução:** Só que aí entra o golpista. Ele usa essa voz idêntica no WhatsApp da sua família, fingindo um sequestro e pedindo Pix urgente.

**Visual:** Faixa: 'O IMPOSTOR NO WHATSAPP' | Placar: 'PERIGO: 90%' | 3D: Câmera treme com shake(0.14). Surge o droide impostor (hacker, vermelho) com capuz e visor em pânico '>_<'. Seta 3D vermelha pulsante aponta direto para a bancada da família.

**Âncoras:**
- "entra o golpista" → setBanner('O IMPOSTOR NO WHATSAPP') e hacker entra na bancada com visor '>_<'
- "pedindo Pix urgente" → setScore('PERIGO', '90%', 'red') e createFlowArrow vermelha pulsa em direção à família

## Cena 4 — O Desespero Humano

**Locução:** No pânico de ouvir o parente chorando, ninguém confere o número e todo mundo transfere sem pensar.

**Visual:** Faixa: 'PÂNICO E PIX FALSO' | Placar: 'ERROS: 1' | 3D: Câmera aproxima no droide familiar (boss, laranja) tremendo com visor '>_<'. Monitor 3D pisca em vermelho com as mensagens 'SOCORRO!' e 'PIX: R$ 3.000 ENVIADO'.

**Âncoras:**
- "ouvir o parente chorando" → setBanner('PÂNICO E PIX FALSO') e boss.act(t, 'panic')
- "transfere sem pensar" → tela 3D pisca em vermelho com PIX ENVIADO e setScore('ERROS', '1', 'red')

## Cena 5 — O Filtro da Senha Secreta

**Locução:** Então a proteção é simples: combine hoje mesmo uma palavra secreta com a sua família que só vocês conhecem.

**Visual:** Faixa: 'A PALAVRA SECRETA' | Placar: 'SENHA: ATIVA' | 3D: Grande cadeado metálico 3D pousa com backOut no meio da bancada. O droide familiar acalma o visor para '●_●' e levanta uma placa dourada com a chave. Tela 3D fica verde.

**Âncoras:**
- "a proteção é simples" → setBanner('A PALAVRA SECRETA') e cadeado metálico 3D entra no centro da bancada
- "uma palavra secreta" → boss.act(t, 'point'), erguendo placa dourada e setScore('SENHA', 'ATIVA', 'green')

## Cena 6 — O Veredito e Loop

**Locução:** Se quem ligou não souber a palavra, desliga na hora. Com esse escudo na mesa, o golpe zera. E você nunca esquece que...

**Visual:** Faixa: 'GOLPE ANULADO' | Placar: 'ERROS: 0' | 3D: Droide familiar dá uma carimbada firme na mesa. O droide impostor é ejetado da bancada. Tela 3D exibe 'AMEAÇA: ZERO' e os droides comemoram com visor '^_^'.

**Âncoras:**
- "desliga na hora" → boss.act(t, 'stamp') e hacker é empurrado para fora da mesa
- "o golpe zera" → setBanner('GOLPE ANULADO'), setScore('ERROS', '0', 'green') e droides mudam visor para '^_^'

## Loop

> E você nunca esquece que 3 segundos de áudio do seu Instagram já bastam pra clonar a sua voz.

## Fatos

- Modelos modernos de inteligência artificial generativa de voz precisam de apenas 3 segundos de áudio público para mapear timbre, modulação e cadência de uma pessoa e gerar qualquer fala nova. — *https://g1.globo.com/fantastico/noticia/2024/03/17/golpistas-usam-inteligencia-artificial-para-imitar-voz-de-parentes-e-pedir-dinheiro.ghtml* (alta)
- Criminosos usam amostras curtas gravadas de stories ou ligações para simular falsos sequestros e acidentes graves via WhatsApp, explorando o pânico dos familiares para arrancar transferências via Pix. — *https://www.ebc.com.br/noticias/seguranca/2024/03/golpe-do-roubo-de-voz-por-ia-faz-vitimas-no-brasil* (alta)
- A principal orientação oficial de segurança e das polícias civis contra o golpe da voz clonada é instituir uma palavra-código ou senha combinada internamente entre os membros da família. — *https://g1.globo.com/fantastico/noticia/2024/03/17/golpistas-usam-inteligencia-artificial-para-imitar-voz-de-parentes-e-pedir-dinheiro.ghtml* (alta)
