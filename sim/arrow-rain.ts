// Three cards run hot, and they are the same card three times.
//
// Ravana 64.1%, Arjuna 62.4%, Bhishma 61.5%, against a field where the median
// warrior sits near 50%. They are not three balance problems. They are one
// ability held by one maharathi in each of the three houses: Arrow Rain, -2 to
// EVERY enemy unit, once per battle. Nothing else in the game touches the whole
// opposing board for free.
//
// The size of it is easy to miss because the number is small. Against a field
// of six or seven warriors, -2 each is twelve to fourteen power off the enemy
// total, which is more than any single card in the set is worth, and it arrives
// attached to a 10-power body that was already the best card in the deck.
//
// This measures the ability rather than the three cards: same seeds, same
// decks, only Arrow Rain's reach and depth changed. If the three come down
// together, it was always the ability.
import { reduce } from '@engine/reducer';
import { createMatch } from '@engine/createMatch';
import { chooseAction } from '@ai/ai';
import { PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK } from '@content/decks';
import { getCard } from '@content/cards';
import type { GameState, Seat, TargetSpec, EffectAction } from '@engine/types';

const DECKS = [PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK];
const BEARERS = ['ravana', 'arjuna', 'bhishma'];
const GAMES = Number(process.argv[2] ?? 900);

interface Variant {
  label: string;
  target: TargetSpec;
  actions: EffectAction[];
}
const VARIANTS: Variant[] = [
  { label: 'now: -2 every foe', target: { pick: 'allEnemyUnits' }, actions: [{ kind: 'damage', amount: 2 }] },
  { label: '-1 every foe', target: { pick: 'allEnemyUnits' }, actions: [{ kind: 'damage', amount: 1 }] },
  // The rank he is shooting into, rather than the whole field. Keeps the
  // picture (a sky full of arrows) and makes WHERE you place him matter.
  { label: '-2 the rank he faces', target: { pick: 'enemyRowSameAsPlayed' }, actions: [{ kind: 'damage', amount: 2 }] },
  { label: '-3 the rank he faces', target: { pick: 'enemyRowSameAsPlayed' }, actions: [{ kind: 'damage', amount: 3 }] },
];

/** Rewrite the ability on all three bearers in place, for this run only. */
function applyVariant(v: Variant): void {
  for (const id of BEARERS) {
    const ability = getCard(id).ability;
    if (!ability) throw new Error(`${id} has no ability to vary`);
    ability.target = v.target;
    ability.actions = v.actions;
  }
}

console.log(`\nARROW RAIN   ${GAMES} games per variant, same seeds throughout\n`);
console.log('  variant                    Ravana   Arjuna   Bhishma    spread');

for (const v of VARIANTS) {
  applyVariant(v);
  const played: Record<string, number> = {};
  const won: Record<string, number> = {};

  for (let g = 0; g < GAMES; g++) {
    const a = g % 3;
    const b = (g + 1 + (g % 2)) % 3;
    let s: GameState = createMatch(g * 7919 + 13, DECKS[a], DECKS[b]);
    for (let guard = 0; guard < 4000 && !s.winner; guard++) {
      const act = chooseAction(s, s.activeSeat);
      if (!act) break;
      s = reduce(s, act);
    }
    // Who committed each bearer, from the log, and did that seat go on to win.
    const by: Partial<Record<string, Seat>> = {};
    for (const e of s.log) {
      if (e.t === 'play' && BEARERS.includes(e.cardId) && !by[e.cardId]) by[e.cardId] = e.seat;
    }
    for (const [card, seat] of Object.entries(by)) {
      played[card] = (played[card] ?? 0) + 1;
      if (s.winner === seat) won[card] = (won[card] ?? 0) + 1;
    }
  }

  const rates = BEARERS.map((id) => (played[id] ? ((won[id] ?? 0) / played[id]) * 100 : NaN));
  const spread = Math.max(...rates) - Math.min(...rates);
  console.log(
    `  ${v.label.padEnd(24)}  ` +
      rates.map((r) => `${r.toFixed(1).padStart(6)}%`).join('  ') +
      `   ${spread.toFixed(1).padStart(6)}`,
  );
}
console.log('');
