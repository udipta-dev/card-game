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
/**
 * The fourth option, and the interesting one: a LOAN rather than a gift.
 *
 * The first mover opens with one extra card and then draws one fewer at the
 * start of round two, so his card count over the match is unchanged. It pays
 * the debt exactly where the debt is, which is having to commit to round one
 * blind, and stops paying the moment round one is over.
 *
 * This is the shape of Gwent's answer (a stratagem playable only in round one)
 * rather than raw card advantage, which the numbers below show overshoots by
 * roughly three times.
 */
const LOAN = 'loan';

/** Deal the first mover `n` more cards off the top of his own deck. */
function compensate(s: GameState, n: number): GameState {
  const seat: Seat = s.firstMover;
  for (let i = 0; i < n; i++) {
    const iid = s.decks[seat].shift();
    if (iid) s.hands[seat].push(iid);
  }
  return s;
}

function playOut(seed: number, a: number, b: number, first: Seat, bonus: number | typeof LOAN) {
  const loaned = bonus === LOAN;
  let s = compensate(createMatch(seed, DECKS[a], DECKS[b], first), loaned ? 1 : (bonus as number));
  // Out of the mulligan phase first, or the match never plays a card at all.
  // Omitting this did not throw; it span the guard 4000 times per game and
  // reported NaN for every variant after an hour of work.
  s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
  s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });
  let repaid = false;
  for (let guard = 0; guard < 800 && s.phase !== 'battleEnd'; guard++) {
    const next = reduce(s, chooseAction(s, s.activeSeat));
    if (next === s) break;
    s = next;
    // Call the loan in the moment round two opens: one card back off the top
    // of the hand, so the match total is identical to an uncompensated one.
    if (loaned && !repaid && s.round > 1) {
      repaid = true;
      const back = s.hands[first].pop();
      if (back) s.decks[first].push(back);
    }
  }
  return s;
}

console.log(`\nPAYING THE FIRST MOVER   ${GAMES} games per size, both seats\n`);
console.log('  extra cards   first mover wins   draws   swing from even');

for (const bonus of [...BONUSES, LOAN] as (number | typeof LOAN)[]) {
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

  // An empty or degenerate sample is a broken harness, not a result.
  if (!n || firstWins + draws === 0)
    throw new Error(`bonus ${bonus} produced no decided games: the harness is broken`);

  const pct = (firstWins / n) * 100;
  console.log(
    `  ${String(bonus === LOAN ? '1, repaid' : bonus).padStart(11)}   ${pct.toFixed(1).padStart(15)}%   ` +
      `${((draws / n) * 100).toFixed(1).padStart(4)}%   ${(pct - 50).toFixed(1).padStart(14)}`,
  );
}
console.log('');
