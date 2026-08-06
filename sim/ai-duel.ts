// Head-to-head: the AI against a different configuration of itself.
//
// Card win rates cannot answer "is this AI stronger", because both seats use
// the same brain in the lab. This plays configuration A in one seat against
// configuration B in the other, swapping seats every match so the first-mover
// advantage cancels.
import { createMatch } from '../src/engine/createMatch';
import { DECKS } from '../src/content/decks';
import { reduce } from '../src/engine/reducer';
import { chooseAction } from '../src/ai/ai';
import { WEIGHTS } from '../src/ai/policy';
import { wilson } from '../src/ai/stats';

const N = Number(process.argv[2] ?? 400);
const A = Number(process.argv[3] ?? 4); // worlds for challenger
const B = Number(process.argv[4] ?? 0); // worlds for control (0 = old blank-hand)
const LA = Number(process.argv[5] ?? 0); // lookahead shortlist for challenger
const LB = Number(process.argv[6] ?? 0); // lookahead shortlist for control
const decks = Object.values(DECKS);

let wins = 0, games = 0;
for (let i = 0; i < N; i++) {
  const challengerSeat = i % 2 === 0 ? 'ai' : 'player';
  let s = createMatch(i + 1, decks[i % decks.length], decks[(i + 1) % decks.length]);
  // Both seats keep their opening hand; the mulligan is not what is under test.
  s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
  s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });
  for (let step = 0; step < 600 && s.phase !== 'battleEnd'; step++) {
    const seat = s.activeSeat;
    const mine = seat === challengerSeat;
    s = reduce(s, chooseAction(s, seat, WEIGHTS, mine ? LA : LB, mine ? A : B));
  }
  if (s.phase !== 'battleEnd') continue;
  games++;
  if (s.winner === challengerSeat) wins++;
}
const rate = wins / games;
const [lo, hi] = wilson(wins, games);
console.log(
  `challenger(worlds=${A},look=${LA}) vs control(worlds=${B},look=${LB}): ${(rate * 100).toFixed(1)}% ` +
    `over ${games} games  [95% CI ${(lo * 100).toFixed(1)}-${(hi * 100).toFixed(1)}]`,
);
console.log(lo > 0.5 ? '  -> challenger is stronger' : hi < 0.5 ? '  -> challenger is WEAKER' : '  -> no significant difference');
