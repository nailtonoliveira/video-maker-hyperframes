# SPEC — <título do episódio>

GOAL:    <o que o espectador deve sentir: tensão com satisfação de descoberta; e que no loop por rebobinagem assista de novo>
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps (Shorts / Reels / TikTok)
TIME:    <duração> s x 30 = <frames> frames. Relógio = locução (assets/voice.mp3, timestamps de assets/voice.json).
         Mesma duração em index.html (set_duration.py), `const DUR` do world.html e do hud.html, e `const LOOP` do scene.js.

LOOK:    identidade do nicho (../../NICHE.md → Visual): A Mesa da Perícia 3D (motor em assets/motor/, guia PROMPT.md;
         peças em assets/kit/, guia KIT.md).
LAYOUT:  texto crítico só em x 64–920 e y 220–1500 (`compositions/hud.html`: `#hud-ficha`, `#hud-valor`, `#hud-data`,
         `#hud-carimbo`); assunto 3D em y 600–1290; legendas `label-tag` com base em y 1450 (`bottom: 470`).
WORLDS:  `imperio` (torre na mesa) · `livro` (dentro do livro-caixa em (0, -200, 0)) · `sala` (mesa + quadro + Perita/Fiscal) · `pregao`
CASE:    forma do império (`torre | rede | piramide`) · truque físico (`caixas | livro_duplo | piramide | bolha | andar_oco`) ·
         carimbo (`FRAUDE | FALÊNCIA | ACUSADO | CONDENADO`) · consequência
DIFF:    o que muda em relação ao episódio anterior (<NNN anterior | exemplo do template>): nome do caso · forma do império ·
         truque físico · carimbo · consequência
CAMERA:  planos de 1,7–3,0 s, câmera sempre em movimento, fov 50, assunto em 50–60 % da largura (assunto alto: ~55 % da altura);
         texto no chão (`floorLabel`) só em plano de cima (`MACRO_LIVRO`); `ap` alto nos closes (6–9), baixo nos abertos (0,8–1,5).
SHOTS:   (planos do assets/episode/scene.js; eventos do hud.html nos mesmos tempos)
  1 0.00–<t>  imperio · quadro 0 = ficha do gancho + rachadura pulsando + Magnata em celebrate
  2 ...       ascensão: andares subindo, Manada em euforia, medidor em degraus
  3 ...       livro: Contador e o truque físico sobre os números
  4 ...       sala: Perita com luz UV revelando os andares ocos e fio vermelho
  5 ...       clímax: Fiscal desce o carimbo (`slam` + `#hud-carimbo` + 0,6 s de silêncio), torre cai, medidor zera
  6 ...       estrago + detalhe absurdo
  N ...–<fim> rebobinagem (`k` voltando a 0 em `p3io`) → último quadro = quadro 0.
SOUND:   trilha procedural em `re_menor` (assets/episode/trilha.json → shared/trilha/trilha.py → assets/audio/*.wav) +
         SFX de assets/sfx com pico 1 quadro após a imagem e 0,6 s de silêncio logo após o carimbo.
BANNED:  granulação, Math.random/Date.now, verde em qualquer lugar, logotipos/marcas reais, CONDENADO sem condenação real,
         câmera parada, editar captions.html à mão.
QA:      0.0 (thumb = ficha + torre), <momentos-chave>, <carimbo>, <fim − 0,05> (= quadro 0).
