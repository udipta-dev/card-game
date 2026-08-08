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
import { shuffle } from '@engine/ids';
import { getCard } from '@content/cards';
import { isFinalRound, opponentOf, seatPower, unitsOf } from '@engine/queries';
import { legalMoves } from '@engine/selectors';
import type { Action, GameState, Seat } from '@engine/types';
import { evaluate } from './evaluate';
import { MULLIGAN_MAX } from '@engine/createMatch';
import { worstCards } from './hand';
import { WEIGHTS } from './policy';
import type { Weights } from './policy';

function isPlay(a: Action): boolean {
  return a.type === 'PLAY_CARD';
}

/**
 * STILL OFF (0), but no longer for the original reason.
 *
 * The first time two-ply was measured it lost, and lost harder the deeper it
 * looked: 47.6% at shortlist 3, 43.5% at 6, 39.3% at 12, against a 48.5%
 * control. That monotonic decline was the tell. The opponent's hand was being
 * emptied before the search ran, so the reply step believed they could only
 * pass, a mutual pass ends the round, and every candidate was therefore scored
 * as "what if they concede right now".
 *
 * That cause is fixed: determinizeOpponentHand now deals a plausible hand
 * instead of no hand. Re-measured against the shipped one-ply AI, the decline
 * is gone:
 *
 *   shortlist 3   52.0%   (was 47.6%)
 *   shortlist 6   50.7%   (was 43.5%)
 *
 * So the diagnosis was right. But at 2000 games shortlist 3 lands at 51.2%
 * [95% CI 49.0-53.4], which does not clear 50, and it costs a reply search per
 * candidate. Not harmful any more, just not worth paying for. Left off, and
 * left reachable: `npm run duel 2000 4 0 3 0` reruns the comparison.
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
function greedy(worlds: GameState[], seat: Seat, moves: Action[], w: Weights, look: number): Action {
  // Rank everything cheaply across every world, then re-rank only the top few
  // by what the opponent can do about them.
  const ranked = moves
    .map((m) => ({ m, score: scoreAcrossWorlds(worlds, seat, m, w, 0) }))
    .sort((a, b) => b.score - a.score);

  if (look <= 0) return ranked[0].m;
  const shortlist = ranked.slice(0, look);
  let best = ranked[0].m;
  let bestScore = -Infinity;
  for (const { m } of shortlist) {
    const score = scoreAcrossWorlds(worlds, seat, m, w, look);
    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  }
  return best;
}

/** The opponent has already passed, this round is a closed book we can read. */
function chooseWhenOppPassed(
  worlds: GameState[],
  seat: Seat,
  plays: Action[],
  w: Weights,
  look: number,
): Action {
  // The opponent has passed, so their hand cannot affect this round any more:
  // one world is enough to read a closed book.
  const state = worlds[0];
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
  if (isFinalRound(state)) return greedy(worlds, seat, [...plays, { type: 'PASS', seat }], w, look);
  return { type: 'PASS', seat };
}

/**
 * Replace the opponent's real hand with a PLAUSIBLE one.
 *
 * The AI must not read their actual hand, or it pre-dodges every counter and
 * astras stop being fired. The previous answer was to empty the hand outright,
 * and that turned out to cost more than it saved, in two separate ways.
 *
 * First, five cards in the game act on the enemy hand: Shakuni discards two of
 * them, Jayadratha denies four, and Tvashtra and Praswapa deny one each.
 * Simulated against an empty hand every one of those is a no-op, so the search
 * scored the whole guile line at zero. Shakuni measured 42.5%, second worst
 * card in the game, for an ability the AI could not see happen.
 *
 * Second, it poisoned lookahead. With no cards the opponent can only pass, and
 * a pass when we have also passed ends the round, so every candidate was scored
 * as "what if they concede right now". That overvalues aggression, which is why
 * two-ply lost to one-ply and lost harder the deeper it looked.
 *
 * The fix is the standard one for imperfect information. The union of their
 * hand and their deck is exactly the set of their cards we have not seen, and
 * we ARE entitled to know that set: it is their decklist minus what they have
 * played. What we are not entitled to know is how it splits. So reshuffle the
 * union and deal a fresh hand of the right size. Nothing is invented, nothing
 * real is revealed, and the hand is the right SHAPE even when it is the wrong
 * cards, which is all the search needs.
 */
function determinizeOpponentHand(realState: GameState, seat: Seat, sample: number): GameState {
  const s = structuredClone(realState);
  const opp = opponentOf(seat);
  const handSize = s.hands[opp].length;
  if (handSize === 0) return s;
  const pool = [...s.hands[opp], ...s.decks[opp]];
  // Salted per sample, and derived from state.seed rather than any global
  // source, so the AI stays pure and reproducible.
  const [dealt] = shuffle(pool, (s.seed ^ (0x9e3779b9 + sample * 0x85ebca6b)) >>> 0);
  s.hands[opp] = dealt.slice(0, handSize);
  s.decks[opp] = dealt.slice(handSize);
  return s;
}

/**
 * How many plausible worlds to average a decision over.
 *
 * One is not enough, and the astra test proved it. A single deal is a point
 * estimate: if that one hand happens to hold the counter, the AI treats being
 * countered as CERTAIN and will not fire at all. Averaging over several deals
 * turns that back into what it should be, a probability. A counter appearing
 * in one world out of four discounts the play by a quarter instead of killing
 * it outright.
 *
 * Four is where the cost stops buying accuracy: see the head-to-head in the
 * commit that introduced this.
 */
const WORLDS = 4;

/**
 * ON, and the reason it was off for so long is worth keeping.
 *
 * The old heuristic was correct play and unevenly available, which is the
 * worst combination. It asked one question, "is this astra dead?", and traded
 * if so. Measured over 60 matches, trades made and matches won:
 *
 *   pandava   0 swaps   35% wins
 *   kaurava  19 swaps   65% wins
 *   asura    15 swaps   45% wins
 *
 * Pandava never traded at all, because every Pandava astra keeps a possible
 * wielder somewhere in hand or deck, while the other two carry weapons tied to
 * one named man that die when he does. So the trade was free card cycling for
 * two houses out of three, and deck spread went from 3.0 points to 15.7.
 * Turning the flag off returned it to 3.0 exactly, which is how we knew the
 * MECHANIC was neutral and the heuristic was the whole of the damage.
 *
 * What it wanted was a heuristic that judges hand quality rather than one card
 * class, and evaluate() could not supply it: it scores board power and card
 * COUNT, and has no notion of which cards are any good.
 *
 * hand.ts is that piece of work. worstCards ranks every card in hand on one
 * scale, so Pandava throws its weakest body, Kaurava throws its stranded
 * weapon, and both are simply discarding their worst card. Same rule from
 * every seat. Deck spread is the acceptance test, and it is measured below.
 */
const AI_USES_ROUND_SWAP = true;

/**
 * The worst card in hand, if it is bad enough to be worth cycling.
 *
 * Not "is this astra dead?", which was the old rule and was only ever true for
 * two houses out of three. worstCards judges every card in hand on the same
 * scale, so a house with no stranded weapons still gets to throw its weakest
 * body and the trade stops being a gift to Kaurava and Asura alone.
 */
function worstCardSwap(state: GameState, seat: Seat): Action | null {
  if (state.phase !== 'playing' || state.activeSeat !== seat) return null;
  if (!state.roundSwap[seat] || state.playedThisRound[seat]) return null;
  if (state.decks[seat].length === 0) return null;
  const [worst] = worstCards(state, seat, 1);
  return worst ? { type: 'ROUND_SWAP', seat, iid: worst } : null;
}

/** The old behaviour: erase the hand entirely. Kept for the head-to-head. */
function blankOpponentHand(realState: GameState, seat: Seat): GameState {
  const s = structuredClone(realState);
  s.hands[opponentOf(seat)] = [];
  return s;
}

/** Mean score of a move across several plausible opponent hands. */
function scoreAcrossWorlds(
  worlds: GameState[],
  seat: Seat,
  move: Action,
  w: Weights,
  look: number,
): number {
  let total = 0;
  for (const world of worlds) {
    total += look > 0 ? scoreAfterReply(world, seat, move, w) : evaluate(reduce(world, move), seat, w);
  }
  return total / worlds.length;
}

/** Choose the AI's next action. Pure & deterministic given the state. */
export function chooseAction(
  realState: GameState,
  seat: Seat,
  w: Weights = WEIGHTS,
  look: number = LOOKAHEAD,
  /**
   * How many plausible opponent hands to average over. 0 reproduces the old
   * behaviour exactly (blank the hand), which is what the head-to-head in the
   * commit message was run against. Kept as a knob rather than deleted so the
   * comparison stays reproducible.
   */
  worldCount: number = WORLDS,
): Action {
  // The returned action references the AI's own card ids, which are unchanged,
  // so it is valid to apply against the real state.
  // An astra is in the air and we are the target. Decide before anything else:
  // spending the answer costs us the card, scours both hosts, and can curse
  // whichever side fielded the lesser astra-master.
  if (realState.phase === 'awaitingCounter' && realState.pendingCounter) {
    return { type: 'ANSWER_ASTRA', seat, counter: shouldAnswer(realState, seat) };
  }

  // THE OPENING MULLIGAN, which the AI simply never took. There was no policy
  // for it anywhere, so every match in every lab run to date was played by an
  // opponent who kept whatever six cards it was dealt.
  //
  // Answering for whichever seat still owes one, rather than only for `seat`,
  // because the phase does not advance until both are done and the usual sim
  // loop only ever calls this for state.activeSeat.
  if (realState.phase === 'mulligan') {
    const owes: Seat = realState.mulliganDone[seat] ? opponentOf(seat) : seat;
    return { type: 'MULLIGAN', seat: owes, iids: worstCards(realState, owes, MULLIGAN_MAX) };
  }

  if (AI_USES_ROUND_SWAP) {
    const swap = worstCardSwap(realState, seat);
    if (swap) return swap;
  }
  // Our own hand and board are identical in every world, so the legal move
  // list is too; only what the opponent might be holding differs.
  const worlds =
    worldCount <= 0
      ? [blankOpponentHand(realState, seat)]
      : Array.from({ length: worldCount }, (_, i) => determinizeOpponentHand(realState, seat, i));
  const moves = legalMoves(worlds[0], seat);
  const plays = moves.filter(isPlay);
  if (plays.length === 0) return { type: 'PASS', seat };

  if (worlds[0].passed[opponentOf(seat)])
    return chooseWhenOppPassed(worlds, seat, plays, w, look);

  return greedy(worlds, seat, moves, w, look);
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
