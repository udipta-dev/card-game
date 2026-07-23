// A Gwent-literate heuristic opponent: greedy one-ply search over the SAME
// reduce() the player uses, plus an explicit pass/bank policy for the moments a
// naive maximiser gets wrong (dry-passing a lost round to bank cards; committing
// the minimum to close out a won round).
import { reduce } from '@engine/reducer';
import { isFinalRound, opponentOf, seatPower } from '@engine/queries';
import { legalMoves } from '@engine/selectors';
import type { Action, GameState, Seat } from '@engine/types';
import { evaluate } from './evaluate';

function isPlay(a: Action): boolean {
  return a.type === 'PLAY_CARD';
}

/** Deterministic argmax: first move achieving the max score wins ties. */
function greedy(state: GameState, seat: Seat, moves: Action[]): Action {
  let best = moves[0];
  let bestScore = -Infinity;
  for (const m of moves) {
    const score = evaluate(reduce(state, m), seat);
    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  }
  return best;
}

/** The opponent has already passed, this round is a closed book we can read. */
function chooseWhenOppPassed(state: GameState, seat: Seat, plays: Action[]): Action {
  const opp = opponentOf(seat);
  const myPower = seatPower(state, seat);
  const oppPower = seatPower(state, opp);

  // Already ahead: bank everything, take the round.
  if (myPower > oppPower) return { type: 'PASS', seat };

  // Can any single play put us ahead? If so, commit the most efficient one.
  const winning = plays
    .map((m) => ({ m, next: reduce(state, m) }))
    .filter((x) => seatPower(x.next, seat) > oppPower);
  if (winning.length > 0) {
    let best = winning[0];
    let bestScore = -Infinity;
    for (const w of winning) {
      const score = evaluate(w.next, seat);
      if (score > bestScore) {
        bestScore = score;
        best = w;
      }
    }
    return best.m;
  }

  // We cannot take this round with one card. In the decider we must keep
  // fighting (greedy avoids the battle-losing pass); otherwise concede & bank.
  if (isFinalRound(state)) return greedy(state, seat, [...plays, { type: 'PASS', seat }]);
  return { type: 'PASS', seat };
}

/**
 * Hide the opponent's concealed hand so the AI plans without clairvoyant
 * knowledge of held counters (imperfect-information determinization). The
 * opponent's card count is unknown across every candidate, so it cancels in the
 * argmax and does not distort the choice; only the counter-web stops being
 * pre-dodged, so astras actually get fired and answered in real games.
 */
function hideOpponentHand(realState: GameState, seat: Seat): GameState {
  const s = structuredClone(realState);
  s.hands[opponentOf(seat)] = [];
  return s;
}

/** Choose the AI's next action. Pure & deterministic given the state. */
export function chooseAction(realState: GameState, seat: Seat): Action {
  // The returned action references the AI's own card ids, which are unchanged,
  // so it is valid to apply against the real state.
  const state = hideOpponentHand(realState, seat);
  const moves = legalMoves(state, seat);
  const plays = moves.filter(isPlay);
  if (plays.length === 0) return { type: 'PASS', seat };

  if (state.passed[opponentOf(seat)]) return chooseWhenOppPassed(state, seat, plays);

  return greedy(state, seat, moves);
}
