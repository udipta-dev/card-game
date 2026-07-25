import { getCurse } from '@engine/curses';
import { isFinalRound, opponentOf, seatPower, unitsOf } from '@engine/queries';
import type { GameState, Seat } from '@engine/types';
import { BIG, WEIGHTS } from './policy';
import type { Weights } from './policy';

/** Cards still in reserve (hand + deck), the resource the banking game is over. */
export function cardCount(state: GameState, seat: Seat): number {
  return state.hands[seat].length + state.decks[seat].length;
}

/**
 * What the curses a seat carries are costing it. Being barred from astras
 * outright is much worse than a stat penalty, so it is weighted separately.
 */
export function curseBurden(state: GameState, seat: Seat, w: Weights): number {
  let n = 0;
  for (const id of state.curses?.[seat] ?? []) {
    n += getCurse(id)?.barsAstras ? w.curseBarred : w.curse;
  }
  return n;
}

/** Unspent skill at arms on the board: power the seat has not called on yet. */
export function chargesHeld(state: GameState, seat: Seat): number {
  return unitsOf(state, seat).reduce((n, u) => n + (u.counters.charges ?? 0), 0);
}

/**
 * Score a state from `seat`'s perspective. Higher is better. Pure. This is the
 * heuristic the one-ply search maximises over.
 *
 * Beyond the Gwent basics (power, rounds, banked cards) it accounts for the
 * two things the consequence layer added. Without the curse term the AI treats
 * adharma as free and looses the Brahma line at every opportunity; without the
 * charge term it spends a warrior's one skill at arms on the first turn it can.
 */
export function evaluate(state: GameState, seat: Seat, w: Weights = WEIGHTS): number {
  const opp = opponentOf(seat);

  if (state.phase === 'battleEnd') {
    if (state.winner === seat) return BIG;
    if (state.winner === opp) return -BIG;
    return 0; // draw
  }

  const power = seatPower(state, seat) - seatPower(state, opp);
  const rounds = state.roundWins[seat] - state.roundWins[opp];
  // Cards are worth nothing in the final round (spend everything), but extra
  // in round 1, so the AI banks rather than dumping its best cards up front.
  const cardW = isFinalRound(state) ? 0 : state.round === 1 ? w.card * 1.6 : w.card;
  const cards = cardCount(state, seat) - cardCount(state, opp);
  // A curse on the enemy is as good as one on us is bad.
  const curses = curseBurden(state, opp, w) - curseBurden(state, seat, w);
  const charges = chargesHeld(state, seat) - chargesHeld(state, opp);

  return (
    power * w.power + rounds * w.round + cards * cardW + curses + charges * w.charge
  );
}
