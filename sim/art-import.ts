// Bring finished art into the game at the size the game actually uses.
//
//   npx vite-node sim/art-import.ts <source folder> [<folder>...]
//   npm run art:import -- ~/Downloads/Mahabharata\ Pics/*
//
// The masters stay where they are and are never touched. This writes a
// downsized copy into src/assets/art/cards/, named by card id.
//
// WHY DOWNSIZE. The generations are 1280x1920. The largest the game ever
// paints one is 80x120, which at a 2x display is 160x240 of real pixels. So
// every master is about eight times oversized in each dimension, sixty-four
// times by area, and the first import weighed 97 MB. That is 97 MB into git
// history forever and 97 MB over the wire to open the codex.
//
// 384x480 is 1.6x the largest on-screen use, which leaves headroom for a
// bigger card view later without shipping a photographic master to a phone.
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import sharp from 'sharp';
import { allCards } from '../src/content/cards';

const OUT = 'src/assets/art/cards';
const W = 384;
const H = 480; // 4:5, the card frame's aspect
const QUALITY = 82;
const IMG = /\.(webp|png|jpe?g|avif)$/i;

const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const dirs = process.argv.slice(2).filter((a) => !a.startsWith('-'));
if (!dirs.length) {
  console.error('usage: art-import <source folder> [more folders]');
  process.exit(1);
}

const wanted = new Map<string, string>();
for (const c of allCards()) {
  wanted.set(squash(c.id), c.id);
  wanted.set(squash(c.name), c.id);
}

mkdirSync(OUT, { recursive: true });

const done = new Set<string>();
let bytesIn = 0;
let bytesOut = 0;
const skipped: string[] = [];

for (const dir of dirs) {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) continue;
  for (const f of readdirSync(dir)) {
    if (!IMG.test(f)) continue;
    const src = join(dir, f);
    if (statSync(src).isDirectory()) continue;
    const cardId = wanted.get(squash(f.replace(IMG, '')));
    if (!cardId) {
      skipped.push(`${basename(dir)}/${f}`);
      continue;
    }
    if (done.has(cardId)) continue; // first one wins
    const dest = join(OUT, `${cardId}.webp`);
    bytesIn += statSync(src).size;
    // `cover` crops rather than squashes: the frame is 4:5 and so is the art,
    // so in practice this is a straight resize.
    await sharp(src).resize(W, H, { fit: 'cover', position: 'top' }).webp({ quality: QUALITY }).toFile(dest);
    bytesOut += statSync(dest).size;
    done.add(cardId);
  }
}

const missing = allCards().filter((c) => !done.has(c.id));
const mb = (n: number) => (n / 1024 / 1024).toFixed(1);

console.log(`\n  imported ${done.size} of ${allCards().length} cards at ${W}x${H}`);
console.log(`  ${mb(bytesIn)} MB of masters  ->  ${mb(bytesOut)} MB shipped  (${(bytesOut / bytesIn * 100).toFixed(1)}%)`);
if (missing.length) {
  console.log(`\n  ${missing.length} card(s) still with no art:`);
  for (const c of missing) console.log(`     ${c.id}  (${c.name})`);
}
if (skipped.length) {
  console.log(`\n  ${skipped.length} file(s) matched no card and were skipped:`);
  for (const s of skipped) console.log(`     ${s}`);
}
console.log('');
