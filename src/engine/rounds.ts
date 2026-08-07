import { getCard } from '@content/cards';
import { runBoardTrigger } from './events';
import { lowerPower, removeInstance } from './keywords';
import { nextRandom } from './ids';
import { MAX_ROUNDS, WINS_NEEDED, boonCardIds, seatPower, unitsOf } from './queries';
import { ROUND_DRAW } from './createMatch';
import type { GameState, Seat } from './types';
import { ROWS } from './types';

function drawCards(state: GameState, seat: Seat, n: number): void {
  for (let i = 0; i < n; i++) {
    const iid = state.decks[seat].shift();
    if (!iid) break;
    state.hands[seat].push(iid);
  }
}

/**
 * Nobody opens a round unable to put a man on the field.
 *
 * A round begins with the board swept, and an astra needs a warrior standing to
 * fire it. So a hand of nothing but weapons is not a bad hand, it is no turn at
 * all: you pass, the enemy plays into an empty field, and the round is decided
 * before you act. Measured over 900 games (sim/dead-hand.ts): 12.1% of round-2
 * openings held ZERO warriors and 42.0% held exactly one, and on 10.1% of the
 * player's own turns there was no legal card of any kind to put down.
 *
 * So the between-round draw digs. If a seat would start a round with no warrior
 * in hand, the deck is searched for the first one and it comes up in place of a
 * card that could not be played. This is not extra cards: the hand is the same
 * size either way, and if the deck holds no warrior at all nothing changes.
 * Both seats get it, so it is symmetric.
 */
function digForAWarrior(state: GameState, seat: Seat): void {
  const isWarrior = (iid: string) => getCard(state.instances[iid]!.cardId).type === 'unit';
  if (state.hands[seat].some(isWarrior)) return;
  const at = state.decks[seat].findIndex(isWarrior);
  if (at < 0) return; // no warrior left anywhere; nothing to be done

  const [warrior] = state.decks[seat].splice(at, 1);
  // Put back the least useful thing we just drew, so the hand size is unchanged.
  // The hand is all non-warriors by definition here, so the last drawn card is
  // as good a candidate as any, and it returns to the top rather than being
  // lost: you will see it again next round, when you may have a man for it.
  const spare = state.hands[seat].pop();
  if (spare) state.decks[seat].unshift(spare);
  state.hands[seat].push(warrior);
  state.log.push({ t: 'draw', seat, cardId: state.instances[warrior]!.cardId });
}

function clearBoard(state: GameState): void {
  for (const seat of ['player', 'ai'] as Seat[]) {
    for (const row of ROWS) {
      // Copy ids first; removeInstance mutates the array.
      for (const iid of [...state.board[seat][row]]) removeInstance(state, iid);
    }
  }
}

/**
 * Resolve the current round once both seats have passed. Mutates state:
 * fires onRoundEnd, scores, awards the round, then either ends the battle or
 * sets up the next round (board clear, lingering-mod decay, draws).
 */
export function resolveRound(state: GameState): void {
  runBoardTrigger(state, 'onRoundEnd');

  const ps = seatPower(state, 'player');
  const as = seatPower(state, 'ai');
  // A weapon may take the round outright, whatever the power on the board. Read
  // and cleared here because a round is only ever decided in this one place.
  const forced = state.forcedRoundWinner ?? null;
  state.forcedRoundWinner = null;
  const roundWinner: Seat | 'tie' = forced ?? (ps > as ? 'player' : as > ps ? 'ai' : 'tie');

  if (roundWinner === 'tie') {
    state.roundWins.player += 1;
    state.roundWins.ai += 1;
  } else {
    state.roundWins[roundWinner] += 1;
  }

  state.log.push({
    t: 'roundEnd',
    round: state.round,
    scores: { player: ps, ai: as },
    winner: roundWinner,
  });

  const pw = state.roundWins.player;
  const aw = state.roundWins.ai;
  const battleOver = pw >= WINS_NEEDED || aw >= WINS_NEEDED || state.round >= MAX_ROUNDS;

  if (battleOver) {
    let winner: Seat | null;
    if (pw > aw) winner = 'player';
    else if (aw > pw) winner = 'ai';
    else winner = ps > as ? 'player' : as > ps ? 'ai' : null; // tie-break on power, else draw
    state.phase = 'battleEnd';
    state.winner = winner;
    state.log.push({
      t: 'battleEnd',
      winner: winner ?? 'player',
      reason: winner ? 'rounds' : 'draw',
    });
    return;
  }

  // ---- Set up the next round ----
  state.round += 1;
  clearBoard(state);
  state.rowMods = state.rowMods.filter((m) => m.duration === 'lingering');
  // Denials last the round that laid them, like the stupefaction they rhyme
  // with. Note this loop is only needed for flags that sit on cards in HAND:
  // 'denied' does, and survives the board clear. Antardhana's 'hidden' sits on
  // warriors standing on the field, and clearBoard has just destroyed every
  // one of them, so vanishing cannot leak into the next round by construction.
  for (const inst of Object.values(state.instances)) inst.flags.delete('denied');
  state.passed = { player: false, ai: false };
  // Each seat may trade one card back before it first plays this round.
  state.roundSwap = { player: true, ai: true };
  state.playedThisRound = { player: false, ai: false };
  drawCards(state, 'player', ROUND_DRAW);
  drawCards(state, 'ai', ROUND_DRAW);
  digForAWarrior(state, 'player');
  digForAWarrior(state, 'ai');

  // Winner of the round leads the next: they commit first, so the loser gets
  // "last say" and a chance to rubber-band back. Tie leaves the first mover leading.
  state.activeSeat = roundWinner === 'ai' ? 'ai' : 'player';
  state.phase = 'playing';
  state.log.push({ t: 'roundStart', round: state.round });
  tickHazards(state);
  runBoardTrigger(state, 'onRoundStart');
}

/**
 * Weapons still hanging over the field strike at the start of each round.
 *
 * The Narayanastra grows with resistance: 4, then 6, then 8. Krishna's order
 * was to drop every weapon and lie down, so the way out is to PASS, which costs
 * you the round and is handled where PASS is (see reducer) - unless Krishna
 * himself is riding with the host, in which case the submission is free.
 */
export function tickHazards(state: GameState): void {
  const lifted: typeof state.hazards = [];
  for (const h of state.hazards) {
    if (h.kind !== 'narayana') continue;
    const men = unitsOf(state, h.victim);
    if (!men.length) continue;
    // TWO THINGS CALL IT OFF, and both are Vishnu declining his own storm.
    //
    // Prahlada is the boy Vishnu came in person to save, five times over, so
    // the weapon made to end asuras will not take the host he stands in.
    if (men.some((u) => u.cardId === 'prahlada')) {
      state.log.push({ t: 'hazardLifted', kind: h.kind, seat: h.victim, reason: 'prahlada' });
      lifted.push(h);
      continue;
    }
    // Krishna knows the terms, because he is the one who published them:
    // "Speedily lay down your weapons, all of you, and alight from your
    // vehicles" (Drona CC). Everyone else buys that escape by passing and
    // losing the round; with him riding, the host submits on his word for free.
    if (men.some((u) => boonCardIds(state, u.iid).includes('krishna_charioteer'))) {
      state.log.push({ t: 'hazardLifted', kind: h.kind, seat: h.victim, reason: 'krishna' });
      lifted.push(h);
      continue;
    }
    const amount = 4 + h.struck * 2;
    // Random, but off the SEEDED stream, so a replay is still a replay.
    const [next, roll] = nextRandom(state.seed);
    state.seed = next;
    const target = men[Math.floor(roll * men.length)];
    lowerPower(state, target, amount);
    h.struck += 1;
    state.log.push({ t: 'hazard', kind: 'narayana', seat: h.victim, iid: target.iid, amount });
  }
  if (lifted.length) state.hazards = state.hazards.filter((h) => !lifted.includes(h));
}
