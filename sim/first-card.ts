// Paying back the man who has to move first.
//
// first-mover.ts established the fault and ruled out the obvious cause: the
// seat that acts LAST in a round wins only 25.5% of them, so "last say" is not
// the mechanism. The edge is at match level. Moving first means committing to
// round one blind, with nothing given back, and rounds.ts then hands the next
// round's opening to whoever just won, which rubber-bands rounds 2 and 3 but
// pays the very first opener nothing at all.
//
// So give him a card. This measures how big that card should be, by dealing the
// first mover a larger opening hand and running the same seeds at each size. It
// deliberately does NOT change the engine: the hand is widened here, from the
// same deck the match was built with, so a bad answer costs nothing to discard.
import { reduce } from '@engine/reducer';
import { createMatch } from '@engine/createMatch';
import { chooseAction } from '@ai/ai';
import { PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK } from '@content/decks';
import type { GameState, Seat } from '@engine/types';

const DECKS = [PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK];
const GAMES = Number(process.argv[2] ?? 1500);
/** How many extra opening cards to try handing the first mover. */
const BONUSES = [0, 1, 2];

/** Deal the first mover `n` more cards off the top of his own deck. */
function compensate(s: GameState, n: number): GameState {
  const seat: Seat = s.firstMover;
  for (let i = 0; i < n; i++) {
    const iid = s.decks[seat].shift();
    if (iid) s.hands[seat].push(iid);
  }
  return s;
}

function playOut(seed: number, a: number, b: number, first: Seat, bonus: number) {
  let s = compensate(createMatch(seed, DECKS[a], DECKS[b], first), bonus);
  for (let guard = 0; guard < 4000 && !s.winner; guard++) {
    const act = chooseAction(s, s.activeSeat);
    if (!act) break;
    s = reduce(s, act);
  }
  return s;
}

console.log(`\nPAYING THE FIRST MOVER   ${GAMES} games per size, both seats\n`);
console.log('  extra cards   first mover wins   draws   swing from even');

for (const bonus of BONUSES) {
  let n = 0;
  let firstWins = 0;
  let draws = 0;

  for (let g = 0; g < GAMES; g++) {
    const a = g % 3;
    const b = (g + 1 + (g % 2)) % 3;
    // Same pairing from both sides, so deck strength cannot masquerade as a
    // seat effect. The seed is shared across bonus sizes on purpose: this is a
    // paired comparison, not three independent samples.
    for (const first of ['player', 'ai'] as Seat[]) {
      const s = playOut(g * 7919 + 13, a, b, first, bonus);
      n++;
      if (!s.winner) draws++;
      else if (s.winner === first) firstWins++;
    }
  }

  const pct = (firstWins / n) * 100;
  console.log(
    `  ${String(bonus).padStart(11)}   ${pct.toFixed(1).padStart(15)}%   ` +
      `${((draws / n) * 100).toFixed(1).padStart(4)}%   ${(pct - 50).toFixed(1).padStart(14)}`,
  );
}
console.log('');
