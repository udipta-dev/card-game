// Bring the gods into the game at the size the game actually paints them.
//
//   npx vite-node sim/deity-import.ts <source folder>
//   npm run art:deities -- ~/Downloads/Mahabharata\ Pics/gods
//
// The masters stay where they are and are never touched. This writes a
// downsized copy into src/assets/art/deities/, named by deity id.
//
// Same reasoning as the card import: a generation is ~1280x1920 and the game
// never paints a god larger than a small panel beside some text, so shipping
// the master would put a photographic file into git history forever and over
// the wire to a phone.
//
// 320x400 rather than the cards' 384x480, because a god appears in a side
// panel and not in a card frame: two places only, the shrine's offers and the
// warning before you fire his weapon.
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import sharp from 'sharp';
import { DEITIES } from '../src/run/shrine';

const OUT = 'src/assets/art/deities';
const W = 320;
const H = 400; // 4:5, matching the prompts
const QUALITY = 82;
const IMG = /\.(webp|png|jpe?g|avif)$/i;

/** Case and punctuation are the computer's problem, not the artist's. */
const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const dirs = process.argv.slice(2).filter((a) => !a.startsWith('-'));
if (!dirs.length) {
  console.error('usage: deity-import <source folder>');
  process.exit(1);
}

// Accept the id or the display name, in any casing: Agni.webp, agni.webp,
// AGNI.WEBP and Parashurama.webp all land on the right god.
const wanted = new Map<string, string>();
for (const d of DEITIES) {
  wanted.set(squash(d.id), d.id);
  wanted.set(squash(d.name), d.id);
}

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

let written = 0;
const unmatched: string[] = [];
const seen = new Set<string>();

for (const dir of dirs) {
  if (!existsSync(dir)) {
    console.error(`no such folder: ${dir}`);
    continue;
  }
  for (const file of readdirSync(dir)) {
    if (!IMG.test(file)) continue;
    const stem = basename(file).replace(IMG, '');
    const id = wanted.get(squash(stem));
    if (!id) {
      unmatched.push(file);
      continue;
    }
    const src = join(dir, file);
    // `cover` with a top bias: these are busts, so if anything is lost it
    // should come off the bottom of the chest rather than off the face.
    await sharp(src)
      .resize(W, H, { fit: 'cover', position: 'top' })
      .webp({ quality: QUALITY })
      .toFile(join(OUT, `${id}.webp`));
    seen.add(id);
    written++;
    console.log(`  ${file}  ->  ${id}.webp`);
  }
}

const missing = DEITIES.filter((d) => !seen.has(d.id)).map((d) => d.id);
console.log(`\n${written} written to ${OUT}/`);
if (missing.length) console.log(`still without art: ${missing.join(', ')}`);
if (unmatched.length) console.log(`did not match a god: ${unmatched.join(', ')}`);
