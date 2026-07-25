// Build docs/art-manifest.md: the exact filename every card expects, and which
// ones already have art. Run after dropping files into src/assets/art/cards/:
//   npx vite-node sim/build-art-manifest.ts
import fs from 'node:fs';
import path from 'node:path';
import { allCards } from '@content/cards';
import type { Card } from '@engine/types';

const ART_DIR = 'src/assets/art/cards';
const EXT = /\.(webp|png|jpe?g|avif)$/i;

const have = new Set(
  fs.existsSync(ART_DIR)
    ? fs
        .readdirSync(ART_DIR)
        .filter((f) => EXT.test(f))
        .map((f) => f.replace(EXT, ''))
    : [],
);

const cards = allCards();
const GROUPS: { title: string; match: (c: Card) => boolean }[] = [
  { title: 'The Pandava Host', match: (c) => c.type === 'unit' && c.house === 'pandava' },
  { title: 'The Kaurava Host', match: (c) => c.type === 'unit' && c.house === 'kaurava' },
  { title: 'The Asura Host', match: (c) => c.type === 'unit' && c.house === 'asura' },
  { title: 'Those Who Stood Apart', match: (c) => c.type === 'unit' && c.house === 'legend' },
  { title: 'Astras', match: (c) => c.type === 'astra' },
  { title: 'Vardaan and Fates', match: (c) => c.type === 'boon' || c.type === 'curse' },
];

const out: string[] = [];
const done = cards.filter((c) => have.has(c.id)).length;

out.push('# Card art manifest');
out.push('');
out.push(`**${done} of ${cards.length}** cards have art.`);
out.push('');
out.push('Drop a file named after the card id into `src/assets/art/cards/` and it appears on that card automatically. Nothing to register.');
out.push('');
out.push('Regenerate this file with `npx vite-node sim/build-art-manifest.ts`.');
out.push('');

for (const g of GROUPS) {
  const group = cards.filter(g.match);
  if (!group.length) continue;
  const n = group.filter((c) => have.has(c.id)).length;
  out.push(`## ${g.title} (${n}/${group.length})`);
  out.push('');
  out.push('| Card | Expected filename | Have |');
  out.push('| --- | --- | --- |');
  for (const c of group) {
    out.push(`| ${c.name} | \`${c.id}.webp\` | ${have.has(c.id) ? 'yes' : ''} |`);
  }
  out.push('');
}

// Anything in the folder that matches no card is almost certainly a typo in the
// filename, and would silently never render. Worth shouting about.
const known = new Set(cards.map((c) => c.id));
const orphans = [...have].filter((id) => !known.has(id));
if (orphans.length) {
  out.push('## Files matching no card');
  out.push('');
  out.push('These will never render. Most likely a misspelled filename.');
  out.push('');
  for (const o of orphans) out.push(`- \`${o}\``);
  out.push('');
}

fs.mkdirSync(path.dirname('docs/art-manifest.md'), { recursive: true });
fs.writeFileSync('docs/art-manifest.md', out.join('\n'));
console.log(`docs/art-manifest.md written: ${done}/${cards.length} cards have art`);
if (orphans.length) console.log(`WARNING: ${orphans.length} file(s) match no card: ${orphans.join(', ')}`);
