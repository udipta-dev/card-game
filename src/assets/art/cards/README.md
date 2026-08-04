# Card art

Drop a file named after the **card id** into this folder and it appears on that
card. Nothing to register, no code to change.

    src/assets/art/cards/arjuna.webp          -> Arjuna
    src/assets/art/cards/vasavi_shakti.webp   -> Vasavi Shakti
    src/assets/art/cards/brahmas_bargain.png  -> Brahma's Bargain

Accepted: `.webp` `.avif` `.png` `.jpg`. WebP is preferred, it is roughly a
third the size of PNG at the same quality and every target browser supports it.

Cards with no file here keep their placeholder glyph, so a partly finished set
degrades quietly rather than showing broken images.

**The exact filename each card expects** is listed in `docs/art-manifest.md`,
generated from the live card data:

    npx vite-node sim/build-art-manifest.ts

Art is 4:5 portrait. The card frame crops to that, and the bottom of the frame
is the first thing to go, so keep faces in the upper two thirds.

## Weapons go on pure black

Astras and shastras (25 cards) are the exception. They are painted **isolated
on pure black**, and the card frame composites them with `mix-blend-mode:
screen`, which drops the black so the weapon's own light falls on the card's
house ground. Drop a black-ground painting in raw and it would read as a hole
cut in the grid; blended, the card glows.

Two consequences, both load-bearing:

- **A weapon painted on a scene will look broken.** Screen blending lifts every
  pixel of that scene, so a dusk sky becomes a pale grey box. There is no
  half-measure here: the ground has to be black.
- **Nothing may fall to near-black**, because screen can only add light. A dark
  bronze haft on a black ground disappears entirely. So does haze, grain, a
  lifted vignette and volumetric smoke, except those turn into a grey veil
  instead of vanishing, which is worse.

The same file then seeds the invocation clip. No video format carries an alpha
channel in every browser, so an effect that sits over the board has to be
black-and-screened anyway; generating the card art that way means one asset
does both jobs. See `docs/video-prompts.md`.

Warriors, vardaans and stratagems are unchanged: any ground, any scene.
