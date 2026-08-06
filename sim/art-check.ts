// Does the art folder actually contain what the game will ask for?
//
// Art resolves by convention: a file named after the CARD ID appears on that
// card, and anything else is silently ignored. Silently is the problem. A
// misspelled file is not an error, it is a card that quietly keeps its
// placeholder, and with 114 of them nobody notices which.
//
// Usage:  npx vite-node sim/art-check.ts <folder> [<folder>...]
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { allCards } from '../src/content/cards';

const IMG = /\.(webp|png|jpe?g|avif)$/i;
/** Squash to letters and digits so casing, spaces, commas and underscores all
 *  compare equal: "Vasavi Shakti.webp" and "vasavi_shakti.png" are the same. */
const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const dirs = process.argv.slice(2).filter((a) => !a.startsWith('-'));
if (!dirs.length) {
  console.error('give me one or more folders');
  process.exit(1);
}

const cards = allCards();
const byKey = new Map<string, { id: string; name: string; type: string }>();
for (const c of cards) {
  byKey.set(key(c.id), c);          // the id the game actually wants
  byKey.set(key(c.name), c);        // and the display name, in case they named by that
}

const found = new Map<string, { file: string; dir: string }>(); // cardId -> file
const unmatched: string[] = [];

for (const dir of dirs) {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    console.error(`cannot read ${dir}`);
    continue;
  }
  for (const f of entries) {
    if (!IMG.test(f) || statSync(join(dir, f)).isDirectory()) continue;
    const stem = f.replace(IMG, '');
    const card = byKey.get(key(stem));
    if (!card) unmatched.push(`${dir.split('/').pop()}/${f}`);
    else if (found.has(card.id)) unmatched.push(`${dir.split('/').pop()}/${f}  (duplicate of ${found.get(card.id)!.file})`);
    else found.set(card.id, { file: f, dir });
  }
}

const missing = cards.filter((c) => !found.has(c.id));

console.log(`\n${found.size} of ${cards.length} cards have art.\n`);

if (missing.length) {
  console.log(`--- ${missing.length} CARDS WITH NO FILE`);
  const byType: Record<string, string[]> = {};
  for (const c of missing) (byType[c.type] ??= []).push(`${c.id}  (${c.name})`);
  for (const [t, list] of Object.entries(byType)) {
    console.log(`  ${t}:`);
    for (const l of list) console.log(`     ${l}`);
  }
  console.log('');
}

if (unmatched.length) {
  console.log(`--- ${unmatched.length} FILES THAT MATCH NO CARD`);
  for (const u of unmatched) console.log(`     ${u}`);
  console.log('');
}

// What the rename would be, for everything not already named by id.
const needsRename = [...found.entries()].filter(([id, f]) => f.file.replace(IMG, '') !== id);
if (needsRename.length) {
  console.log(`--- ${needsRename.length} files are not named by the card id`);
  console.log(`    (harmless: the lookup squashes case and punctuation, so these DO appear.`);
  console.log(`     listed only so a wrong-card match is visible if one ever happens)`);
  for (const [id, f] of needsRename.slice(0, 8)) console.log(`     ${f.file}  ->  ${id}.webp`);
  if (needsRename.length > 8) console.log(`     ...and ${needsRename.length - 8} more`);
}
