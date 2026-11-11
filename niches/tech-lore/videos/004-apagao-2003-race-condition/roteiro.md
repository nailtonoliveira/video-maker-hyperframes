# Apagão de 2003: A Condição de Corrida de Milissegundos

**Título na tela (frame 0):** 50 MILHÕES SEM LUZ  
**Resumo:** Em 14 de agosto de 2003, uma condição de corrida no subsistema de alarmes do software GE XA/21 travou em loop silencioso no centro de controle da FirstEnergy. Sem alertas para os operadores, linhas de transmissão caíram em efeito dominó, gerando o maior blecaute da história norte-americana.  
**Palavras:** 109 (≈ 47 s de narração)

## Cena 1 — O Gancho

**Locução:** Um conflito de milissegundos na memória de um servidor apagou a energia de 50 milhões de pessoas.

**Visual:** Maquete técnica 3D do exterior de um data center industrial da FirstEnergy com arestas finas em ciano e piso técnico escuro. Título do gancho '50 MILHÕES SEM LUZ' pousado no quadro 0 em JetBrains Mono sobre placa escura. Câmera em deslocamento lento orbitando os blocos de servidores e subestações sob céu em domo dessaturado.

**Mundo:** exterior

**Âncoras:**
- "Um conflito de milissegundos" → Título em wipe horizontal expo.out pousado no quadro 0 com subtítulo técnico // RACE CONDITION DETECTED.
- "na memória de um servidor" → Aproximação de câmera focando a fachada do bloco central de processamento com pulsos de dados em verde-menta.
- "50 milhões de pessoas" → Corte de plano rasante mostrando barramentos elétricos massivos convergindo para o data center com profundidade de campo rasa.

## Cena 2 — O Contexto

**Locução:** Em 14 de agosto de 2003, no centro de controle da FirstEnergy, o software GE XA/21 gerenciava a rede elétrica.

**Visual:** A câmera foca o gabinete do servidor SCADA da FirstEnergy e executa um mergulho contínuo através da porta física da gaveta do rack. A abertura técnica revela barramentos luminosos e feixes de cabos até pousar na superfície de uma placa de circuito com o chip GE XA/21.

**Mundo:** mergulho

**Âncoras:**
- "Em 14 de agosto de 2003" → Plano médio do rack com carimbo de tempo '2003-08-14 14:14:00 EDT' gravado na lateral do chassi em cinza #7d8590.
- "no centro de controle" → A gaveta frontal do rack destrava mecanicamente e desliza para a frente, revelando o interior da máquina.
- "software GE XA/21" → Mergulho contínuo para o interior escuro, iluminando o chip principal gravado em ciano com 'GE XA/21 EMS'.
- "a rede elétrica" → Câmera nivela sobre a placa; trilhas de dados e LEDs de barramento pulsam em sincronia verde-menta.

## Cena 3 — A Falha Técnica

**Locução:** Às 14h14, duas tarefas tentaram gravar no mesmo buffer de alarmes ao mesmo tempo. Sem bloqueio mútuo, a fila corrompeu e o processo entrou em loop infinito.

**Visual:** Plano plongée técnico da placa de circuito. No solo técnico, a linha de código: 'alarm_queue.push(event); // race condition'. O bug da série (besouro escuro com arestas vermelhas e olhos menta) percorre a trilha de dados e trava exatamente sobre a chamada push desprotegida por mutex.

**Mundo:** placa

**Âncoras:**
- "Às 14h14, duas tarefas" → Dois pulsos de dados em ciano colidem no mesmo registrador de fila simultaneamente sem sincronização.
- "gravar no mesmo buffer" → O besouro rasteja com precisão pelas trilhas de cobre em direção ao buffer de eventos de alarme.
- "Sem bloqueio mútuo" → O bug estanca com as patas sobre a instrução 'push(event)', onde a flag 'MUTEX_LOCK' exibe 0x00.
- "a fila corrompeu" → A estrutura de dados quebra com tremor determinístico e o registrador vira vermelho #ff3366 exibindo QUEUE_CORRUPT.
- "loop infinito" → Um anel de luz vermelha passa a girar eternamente sobre o chip de alarmes sem despachar nenhum sinal.

## Cena 4 — O Colapso

**Locução:** Quando cabos de alta tensão caíram no Ohio, os alarmes não dispararam. Sem aviso, a sobrecarga derrubou 100 usinas e gerou 6 bilhões de dólares em prejuízo.

**Visual:** O subsistema de alarmes na placa queima em vermelho escuro e a câmera transita em corte rápido para o exterior. Linhas de transmissão em Ohio tocam vegetação e sofrem arcos elétricos sem alerta no console; em cascata, módulos do data center e a malha regional apagam as luzes em efeito dominó.

**Mundo:** exterior

**Âncoras:**
- "Quando cabos de alta tensão" → Corte de plano para o exterior: cabos de 345 kV vergam e entram em curto com árvores geométricas.
- "os alarmes não dispararam" → Plano rasante do console de monitoramento do data center totalmente mudo e estático, sem luzes de alarme.
- "Sem aviso, a sobrecarga" → Pulso elétrico vermelho percorre as linhas de transmissão no horizonte provocando desligamentos sucessivos.
- "derrubou 100 usinas" → Corte aberto: centenas de geradores e módulos da maquete têm seus LEDs de operação desligados instantaneamente.
- "gerou 6 bilhões de dólares" → Letreiro técnico '-US$ 6 BILHÕES' surge em vermelho de alerta com aberração cromática contida.

## Cena 5 — O Loop

**Locução:** A tela dos operadores continuou estática e muda por mais de uma hora, e foi exatamente assim que...

**Visual:** A câmera recua completando a órbita no exterior do data center apagado, voltando à mesma posição, ângulo e escala do quadro 0. O céu em domo retorna à iluminação inicial e o título '50 MILHÕES SEM LUZ' remonta exatamente nas coordenadas do início, fechando o loop contínuo.

**Mundo:** exterior

**Âncoras:**
- "A tela dos operadores" → Visão técnica através da vidraça da sala de controle mostrando monitores estáticos em contraste com o exterior.
- "por mais de uma hora" → Contador de terminal avança em timelapse de 14:14 para 15:45 sem gerar uma única notificação.
- "e foi exatamente assim que" → A câmera trava na posição inicial do quadro 0 e o título 2D de abertura remonta perfeitamente no centro.

## Loop

> A tela dos operadores continuou estática e muda por mais de uma hora, e foi exatamente assim que um conflito de milissegundos na memória de um servidor apagou a energia de 50 milhões de pessoas.

## Fatos

- O blecaute de 14 de agosto de 2003 atingiu cerca de 50 milhões de pessoas em oito estados dos EUA e na província de Ontário, no Canadá. — *U.S.-Canada Power System Outage Task Force: Final Report on the August 14, 2003 Blackout in the United States and Canada (2004)* (alta)
- Uma condição de corrida (race condition) de milissegundos no subsistema C/C++ de alarmes do software GE Energy XA/21 corrompeu a estrutura de dados compartilhada às 14h14, travando o processo em loop infinito. — *SecurityFocus / KEMA Inc. Software Audit: Tracking the Blackout Bug (2004)* (alta)
- A falha silenciosa congelou as telas e alertas sonoros da FirstEnergy por mais de uma hora, impedindo os operadores de isolar a queda das linhas de 345 kV de Ohio antes do efeito cascata. — *U.S.-Canada Power System Outage Task Force: Final Report (2004)* (alta)
- A cascata desligou mais de 100 usinas elétricas (261 unidades geradoras) e gerou prejuízos econômicos estimados entre US$ 6 bilhões e US$ 10 bilhões. — *U.S.-Canada Power System Outage Task Force: Final Report (2004)* (alta)
