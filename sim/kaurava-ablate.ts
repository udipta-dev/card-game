// What is actually carrying Kaurava?
//
// With the conjured-astra crutch removed, Kaurava sits at 57.7% against
// Pandava's 46.7% and Asura's 41.0% over 9000 games. Four hypotheses have been
// measured and all four came back near zero: Arrow Rain, icchamrityu's
// protection from destruction, the basePower/3 power floor, and an extra
// mulligan for the seat that moves first.
//
// So stop guessing. Kaurava's identity is four maharathis who are all extremely
// hard to remove, in a game whose removal is mostly damage, and the mirror
// check says their opening commitment costs them nothing (kaurava mirror 51.1%,
// pandava 40.0%, where 50% is even by definition). This strips ONE protection
// at a time and runs the real lab against each.
//
// Leave-one-out on keywords rather than on deck slots, because removing a card
// changes the provision spend and the warrior count as well, and then the
// result cannot be attributed to anything.
import { formatReport, runBalance } from '@ai/balanceLab';
import { getCard } from '@content/cards';
import type { Card, KeywordKind } from '@engine/types';

const PER_SIDE = Number(process.argv[2] ?? 300);

const ABLATIONS: { who: string; kind: KeywordKind; what: string }[] = [
  { who: 'bhishma', kind: 'icchamrityu', what: 'cannot be slain until Shikhandi stands' },
  { who: 'drona', kind: 'immuneUntilPlayed', what: 'cannot be slain until the lie is told' },
  { who: 'karna', kind: 'armor', what: 'the Kavacha turns aside the first 4' },
  { who: 'duryodhana', kind: 'bond', what: 'rallies his brothers (+2 kin, +1 rank)' },
];

function spread(report: string): { line: string; gap: number } {
  const rows = [...report.matchAll(/^ {2}(pandava|kaurava|asura)\s+([\d.]+)%/gm)];
  if (rows.length !== 3) return { line: 'unparsed', gap: NaN };
  const pct = rows.map((r) => Number(r[2]));
  return {
    line: rows.map((r, i) => `${r[1]} ${pct[i].toFixed(1)}%`).join('   '),
    gap: Math.max(...pct) - Math.min(...pct),
  };
}

const show = (label: string) => {
  const s = spread(formatReport(runBalance(PER_SIDE)));
  console.log(`  ${label.padEnd(30)}${s.line}   |  spread ${s.gap.toFixed(1)}`);
};

console.log(`\nWHAT CARRIES KAURAVA   ${PER_SIDE} games per side order, one keyword at a time\n`);
show('control, nothing stripped');

for (const a of ABLATIONS) {
  const card = getCard(a.who) as Card;
  const kept = card.keywords.slice();
  card.keywords = kept.filter((k) => k.kind !== a.kind);
  show(`${a.who} minus ${a.kind}`);
  card.keywords = kept; // one at a time, never cumulative
}

// And Duryodhana's adamant body, which is an onPlay flag rather than a keyword.
{
  const card = getCard('duryodhana') as Card;
  const kept = card.effects.slice();
  card.effects = [];
  show('duryodhana minus diamond-body');
  card.effects = kept;
}
console.log('');
