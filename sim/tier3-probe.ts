// Can the tier-3 astras actually be evaluated?
//   npx vite-node sim/tier3-probe.ts [battles]
//
// Brahmashirsha, Pashupata and Narayana are in no starting deck and cannot yet
// be earned on a six-rung ladder, so npm run sim reports nothing for them: the
// "tier 3 averages X%" claim rests entirely on Vasavi and Vaishnava. This
// forces each one into a deck so its rewrite can be measured before we commit
// to it. THROWAWAY DECKS, not a balance proposal.
import { getCard, provisionOf } from '@content/cards';
import { DECKS } from '@content/decks';
import { createMatch } from '@engine/createMatch';
import { reduce } from '@engine/reducer';
import { chooseAction } from '@ai/ai';
import { rate } from '@ai/stats';
import type { GameState } from '@engine/types';

const BATTLES = Number(process.argv[2] ?? 600);
const UNDER_TEST = ['brahmashirsha', 'pashupatastra', 'narayanastra', 'vaishnavastra', 'vasavi_shakti'];

const asDeck = (cards: string[], id: string) =>
  ({ id, name: id, house: 'pandava', cards }) as any;

function play(seed: number, a: string[], b: string[]): GameState {
  let s = createMatch(seed, asDeck(a, 'probe'), asDeck(b, 'foe'), 'ai', undefined);
  s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
  s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });
  let n = 0;
  while (s.phase !== 'battleEnd' && n++ < 600) s = reduce(s, chooseAction(s, s.activeSeat));
  return s;
}

/** Swap the cheapest non-unit out and drop units until the astra fits. */
function deckWith(base: string[], astra: string): string[] {
  const cards = base.filter((id) => id !== astra).slice();
  cards.push(astra);
  let cost = () => cards.reduce((n, id) => n + provisionOf(getCard(id)), 0);
  while (cost() > 170) {
    // Drop the cheapest unit, so the astra is what changed and not the curve.
    let worstIdx = -1, worst = Infinity;
    cards.forEach((id, i) => {
      const c = getCard(id);
      if (c.type !== 'unit') return;
      const p = provisionOf(c);
      if (p < worst) { worst = p; worstIdx = i; }
    });
    if (worstIdx < 0) break;
    cards.splice(worstIdx, 1);
  }
  return cards;
}

const base = (DECKS as any).pandava_starter.cards as string[];
console.log(`\nTIER-3 PROBE  (${BATTLES} battles each, vs the unmodified Kaurava deck)`);
console.log('The astra is added and the cheapest units dropped to pay for it, so');
console.log('what changed is the astra and not the shape of the curve.\n');
console.log('astra                 cost  win%   played%  fired-and-won%');

const foe = (DECKS as any).kaurava_starter.cards as string[];
for (const astra of UNDER_TEST) {
  const deck = deckWith(base, astra);
  let wins = 0, played = 0, playedWins = 0;
  for (let i = 0; i < BATTLES; i++) {
    const s = play(i * 977 + 13, deck, foe);
    const won = s.winner === 'player';
    if (won) wins++;
    const fired = s.log.some((e: any) => (e.t === 'play' || e.t === 'astra') && e.cardId === astra);
    if (fired) { played++; if (won) playedWins++; }
  }
  const w = rate(wins, BATTLES), p = rate(played, BATTLES);
  const pw = played ? rate(playedWins, played) : null;
  console.log(
    `  ${getCard(astra).name.padEnd(20)} ${String(provisionOf(getCard(astra))).padStart(3)}  ` +
      `${(w.rate * 100).toFixed(1).padStart(5)}  ${(p.rate * 100).toFixed(1).padStart(6)}   ` +
      `${pw ? (pw.rate * 100).toFixed(1).padStart(6) : '   n/a'}`,
  );
}
