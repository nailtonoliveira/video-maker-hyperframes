# Vitrine dos exteriores (tech-lore)

Projeto HyperFrames de exposição: cada exterior do kit em plano aberto 9:16, câmera girando devagar, 4 s por objeto
(`assets/episode/scene.js`). Serve para julgar, quadro a quadro, se cada objeto se lê sem rótulo; as notas ficam no
`REVIEW.md`. Sem locução, legendas nem áudio.

- A fonte da verdade do kit é `niches/tech-lore/template/assets/kit/`. Para atualizar a cópia daqui (a partir da
  raiz do workspace):

  ```bash
  rm -rf niches/tech-lore/lab/vitrine/assets/kit
  cp -r niches/tech-lore/template/assets/kit niches/tech-lore/lab/vitrine/assets/kit
  ```

- Para reinstalar o motor (`assets/motor/`) e o tema (`assets/tema.js`):

  ```bash
  python3 tools/motor.py niches/tech-lore/lab/vitrine --nicho tech-lore
  ```

- Objeto novo: some 4 s ao `OBJ` do `scene.js` e à duração do `index.html` e do `world.html` (`data-duration` e
  `tl.set({}, {}, DUR)`). Depois, `npx hyperframes check` e `snapshot` no meio de cada objeto.
