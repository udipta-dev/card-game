// Which cards have their own drawn mark, and which are sharing one.
//
// The mark table is parsed out of the source rather than imported, because
// marks.tsx is JSX and this runs under plain tsx. That also means the audit
// reports exactly what ships, not a second copy of the mapping that can drift.
import { readFileSync } from 'node:fs';
import { allCards } from '../src/content/cards';

const src = readFileSync('src/ui/card/marks.tsx', 'utf8');
const body = src.slice(src.indexOf('const BY_ID'), src.indexOf('const BY_TYPE'));
const map = new Map<string, string>();
for (const m of body.matchAll(/^ {2}(\w+): (\w+),/gm)) map.set(m[1], m[2]);

const TYPE_FALLBACK: Record<string, string> = {
  unit: 'Khadga', astra: 'BrahmaBurst', shastra: 'Khadga',
  boon: 'Padma', curse: 'Kapala', stratagem: 'Aksha',
};

const byMark = new Map<string, string[]>();
const unmapped: string[] = [];
const cards = allCards();
for (const c of cards) {
  const mark = map.get(c.id) ?? TYPE_FALLBACK[c.type];
  if (!map.has(c.id)) unmapped.push(`${c.id.padEnd(24)} ${c.type.padEnd(10)} ${c.name}`);
  byMark.set(mark, [...(byMark.get(mark) ?? []), c.name]);
}

console.log(`${cards.length} cards | ${cards.length - unmapped.length} with an explicit mark | ${unmapped.length} falling through\n`);
console.log('--- NO MARK OF THEIR OWN ---');
unmapped.forEach((u) => console.log('  ' + u));
console.log('\n--- ONE MARK, 3+ CARDS ---');
[...byMark.entries()]
  .filter(([, v]) => v.length >= 3)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([k, v]) => console.log(`  ${k} x${v.length}\n      ${v.join(', ')}`));
