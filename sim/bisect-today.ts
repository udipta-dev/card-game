// Which of today's card changes moved faction balance, and by how much?
//
// Faction spread was 2.3 points at 9000 games this morning. It is now 37.5.
// Reverting the carried-astra grant from hand back to deck recovers most of it
// and stops at 15.2, so at least one more of today's edits is also moving it.
//
// Rather than bisect through git and rebuild node_modules in a worktree, this
// mutates the card database in memory back to this morning's values, one change
// at a time, and runs the real balance lab against each. Same harness, same
// seeds, one variable at a time.
//
// Nothing here touches src/. If a revert wins, the fix goes into the card file
// properly; this only decides which one to reach for.
import { formatReport, runBalance } from '@ai/balanceLab';
import { getCard } from '@content/cards';
import type { Card } from '@engine/types';

const PER_SIDE = Number(process.argv[2] ?? 400);

/** One of today's edits, and how to put the card back the way it was. */
interface Revert {
  key: string;
  what: string;
  undo: () => void;
}

const REVERTS: Revert[] = [
  {
    key: 'uluka',
    what: 'Uluka drew a card on play (was a blank 5)',
    undo: () => {
      (getCard('uluka') as Card).effects = [];
    },
  },
  {
    key: 'prahlada',
    what: 'Prahlada gained armour 3 (was a blank 5)',
    undo: () => {
      (getCard('prahlada') as Card).keywords = [];
    },
  },
  {
    key: 'bhima',
    what: 'Bhima’s vow named seven men (was one, and fired in 2% of games)',
    undo: () => {
      const e = (getCard('bhima') as Card).effects[0];
      if (e) e.target = { pick: 'chosen', filter: { side: 'enemy' } };
    },
  },
  {
    key: 'ashwatthama_elephant',
    what: '"Ashwatthama is Dead" struck every foe for -1 (was actions: [])',
    undo: () => {
      for (const e of (getCard('ashwatthama_elephant') as Card).effects) e.actions = [];
    },
  },
  {
    key: 'samvodhana',
    what: 'Samvodhan-Astra raised every ally by +1 (was inert)',
    undo: () => {
      for (const e of (getCard('samvodhana') as Card).effects)
        e.actions = e.actions.filter((a) => a.kind !== 'buff');
    },
  },
];

function spread(report: string): string {
  const rows = [...report.matchAll(/^ {2}(pandava|kaurava|asura)\s+([\d.]+)%/gm)];
  if (rows.length !== 3) return 'unparsed';
  const pct = rows.map((r) => Number(r[2]));
  const gap = Math.max(...pct) - Math.min(...pct);
  return `${rows.map((r, i) => `${r[1]} ${pct[i].toFixed(1)}%`).join('   ')}   |  spread ${gap.toFixed(1)}`;
}

console.log(`\nBISECTING TODAY   ${PER_SIDE} games per side order, one revert at a time\n`);
console.log(`  as it stands now      ${spread(formatReport(runBalance(PER_SIDE)))}`);

for (const r of REVERTS) {
  // Reverts are applied cumulatively-free: each run starts from a fresh import
  // is not possible in one process, so undo one, measure, and leave it undone
  // only for its own line by re-running the whole set in separate processes.
  // Here we take the simpler honest route: apply this one revert on top of
  // whatever came before, and print the running total. The LAST line is
  // therefore "everything from today reverted".
  r.undo();
  console.log(`  minus ${r.key.padEnd(16)}${spread(formatReport(runBalance(PER_SIDE)))}`);
}
console.log(`\n  (each line has every revert above it applied as well)\n`);
