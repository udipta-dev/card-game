// A Gwent-literate heuristic opponent: greedy one-ply search over the SAME
// reduce() the player uses, plus an explicit pass/bank policy for the moments a
// naive maximiser gets wrong (dry-passing a lost round to bank cards; committing
// the minimum to close out a won round).
//
// Three attempts to make this smarter were measured head-to-head and all lost.
// See LOOKAHEAD below and the zeroed weights in policy.ts. The short version:
// the one-ply search already sees more than it looks like it does, because the
// mechanical consequences of curses and abilities land in seatPower, and the
// obvious deeper search is poisoned by the hidden-hand determinization.
import { reduce } from '@engine/reducer';
import { getCard } from '@content/cards';
import { isFinalRound, opponentOf, seatPower, unitsOf } from '@engine/queries';
import { legalMoves } from '@engine/selectors';
import type { Action, GameState, Seat } from '@engine/types';
import { evaluate } from './evaluate';
import { WEIGHTS } from './policy';
import type { Weights } from './policy';

function isPlay(a: Action): boolean {
  return a.type === 'PLAY_CARD';
}

/**
 * OFF (0) BY MEASUREMENT, not by oversight.
 *
 * Two-ply lookahead was built and measured against the one-ply AI, and it lost:
 * 47.6% at shortlist 3, 43.5% at 6, 39.3% at 12, against a 48.5% control. The
 * monotonic decline gave the cause away. hideOpponentHand() empties the
 * opponent's hand BEFORE the search runs, so the reply step believes they can
 * only pass, and a pass when we have also passed resolves the round. The search
 * was therefore scoring every candidate as "what if my opponent concedes right
 * now", which massively overvalues aggression, and the more moves it examined
 * the more damage it did.
 *
 * The machinery below is correct and costs about 1ms per decision. Turning it
 * on requires giving the reply step a plausible opponent hand, sampled from
 * their remaining deck, rather than the empty one determinization leaves behind.
 * That is a real piece of work, not a constant change.
 */
const LOOKAHEAD = 0;

/**
 * What a move is really worth once the opponent answers it. A one-ply search
 * cannot tell a play that wins the board from one that hands the opponent a
 * better answer, which is how it walks into removal.
 */
function scoreAfterReply(state: GameState, seat: Seat, move: Action, w: Weights): number {
  const after = reduce(state, move);
  if (after.phase === 'battleEnd') return evaluate(after, seat, w);

  const opp = opponentOf(seat);
  // If the turn did not pass to them, there is nothing to answer with.
  if (after.activeSeat !== opp) return evaluate(after, seat, w);

  const replies = legalMoves(after, opp);
  if (!replies.length) return evaluate(after, seat, w);

  // They pick whatever is worst for us.
  let worst = Infinity;
  for (const r of replies) {
    const v = evaluate(reduce(after, r), seat, w);
    if (v < worst) worst = v;
  }
  return worst;
}

/** Deterministic argmax: first move achieving the max score wins ties. */
function greedy(state: GameState, seat: Seat, moves: Action[], w: Weights, look: number): Action {
  // Rank everything cheaply, then re-rank only the top few by what the
  // opponent can do about them.
  const ranked = moves
    .map((m) => ({ m, score: evaluate(reduce(state, m), seat, w) }))
    .sort((a, b) => b.score - a.score);

  if (look <= 0) return ranked[0].m; // one-ply only
  const shortlist = ranked.slice(0, look);
  let best = ranked[0].m;
  let bestScore = -Infinity;
  for (const { m } of shortlist) {
    const score = scoreAfterReply(state, seat, m, w);
    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  }
  return best;
}

/** The opponent has already passed, this round is a closed book we can read. */
function chooseWhenOppPassed(state: GameState, seat: Seat, plays: Action[], w: Weights, look: number): Action {
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
    for (const w2 of winning) {
      const score = evaluate(w2.next, seat, w);
      if (score > bestScore) {
        bestScore = score;
        best = w2;
      }
    }
    return best.m;
  }

  // We cannot take this round with one card. In the decider we must keep
  // fighting (greedy avoids the battle-losing pass); otherwise concede & bank.
  if (isFinalRound(state)) return greedy(state, seat, [...plays, { type: 'PASS', seat }], w, look);
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
export function chooseAction(
  realState: GameState,
  seat: Seat,
  w: Weights = WEIGHTS,
  look: number = LOOKAHEAD,
): Action {
  // The returned action references the AI's own card ids, which are unchanged,
  // so it is valid to apply against the real state.
  // An astra is in the air and we are the target. Decide before anything else:
  // spending the answer costs us the card, scours both hosts, and can curse
  // whichever side fielded the lesser astra-master.
  if (realState.phase === 'awaitingCounter' && realState.pendingCounter) {
    return { type: 'ANSWER_ASTRA', seat, counter: shouldAnswer(realState, seat) };
  }
  const state = hideOpponentHand(realState, seat);
  const moves = legalMoves(state, seat);
  const plays = moves.filter(isPlay);
  if (plays.length === 0) return { type: 'PASS', seat };

  if (state.passed[opponentOf(seat)]) return chooseWhenOppPassed(state, seat, plays, w, look);

  return greedy(state, seat, moves, w, look);
}

/**
 * Whether to spend an answer on an astra in flight.
 *
 * Answering is NOT free: the counter is gone for the run, the clash scours
 * both hosts, and the side with the lesser fielded astra-master takes a curse.
 * So the question is whether letting it through costs more than that.
 */
function shouldAnswer(state: GameState, seat: Seat): boolean {
  const p = state.pendingCounter!;
  const incoming = getCard(p.astraCardId);
  const tier = incoming.astraTier ?? 1;
  const mine = seatPower(state, seat);

  // An elemental weapon is rarely worth a card and a scouring. Eat it.
  if (tier < 2) return false;
  // A tier-3 ultimate will usually take the board outright. Always answer.
  if (tier >= 3) return true;

  // Tier 2: answer only if there is enough of our host standing to be worth
  // saving. The clash costs us 2 off every warrior either way, so with almost
  // nothing on the field we would be paying a card to protect nothing.
  const blastCost = unitsOf(state, seat).length * 2;
  return mine > 8 && mine - blastCost > 0;
}
