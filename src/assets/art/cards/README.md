# Card art

Drop a file named after the **card id** into this folder and it appears on that
card. Nothing to register, no code to change.

    src/assets/art/cards/arjuna.webp          -> Arjuna
    src/assets/art/cards/vasavi_shakti.webp   -> Vasavi Shakti
    src/assets/art/cards/gandhari_gaze.webp   -> Gandhari's Gaze

Accepted: `.webp` `.avif` `.png` `.jpg`. WebP is preferred, it is roughly a
third the size of PNG at the same quality and every target browser supports it.

Cards with no file here keep their placeholder glyph, so a partly finished set
degrades quietly rather than showing broken images.

**The exact filename each card expects** is listed in `docs/art-manifest.md`,
generated from the live card data:

    npx vite-node sim/build-art-manifest.ts

Art is 4:5 portrait. The card frame crops to that, and the bottom of the frame
is the first thing to go, so keep faces in the upper two thirds.
