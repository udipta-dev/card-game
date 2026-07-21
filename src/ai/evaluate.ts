import { isFinalRound, opponentOf, seatPower } from '@engine/queries';
import type { GameState, Seat } from '@engine/types';
import { BIG, WEIGHTS } from './policy';

/** Cards still in reserve (hand + deck), the resource the banking game is over. */
export function cardCount(state: GameState, seat: Seat): number {
  return state.hands[seat].length + state.decks[seat].length;
}

/**
 * Score a state from `seat`'s perspective. Higher is better. Pure. This is the
 * heuristic the one-ply search maximises over.
 */
export function evaluate(state: GameState, seat: Seat): number {
  const opp = opponentOf(seat);

  if (state.phase === 'battleEnd') {
    if (state.winner === seat) return BIG;
    if (state.winner === opp) return -BIG;
    return 0; // draw
  }

  const power = seatPower(state, seat) - seatPower(state, opp);
  const rounds = state.roundWins[seat] - state.roundWins[opp];
  const cardW = isFinalRound(state) ? 0 : WEIGHTS.card;
  const cards = cardCount(state, seat) - cardCount(state, opp);

  return power * WEIGHTS.power + rounds * WEIGHTS.round + cards * cardW;
}
