import { runBoardTrigger } from './events';
import { removeInstance } from './keywords';
import { MAX_ROUNDS, WINS_NEEDED, seatPower } from './queries';
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
  const roundWinner: Seat | 'tie' = ps > as ? 'player' : as > ps ? 'ai' : 'tie';

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
  state.passed = { player: false, ai: false };
  drawCards(state, 'player', ROUND_DRAW);
  drawCards(state, 'ai', ROUND_DRAW);

  // Loser of the round leads the next (Gwent rule); tie → player leads.
  state.activeSeat = roundWinner === 'player' ? 'ai' : 'player';
  state.phase = 'playing';
  state.log.push({ t: 'roundStart', round: state.round });
  runBoardTrigger(state, 'onRoundStart');
}
