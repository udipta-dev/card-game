// How often is your hand a brick?
//
// Reported from play: "round 2 my hand had only astras and boons, no playable
// warriors, and round 3 I had one." An astra needs a warrior standing on the
// board to fire it, and the board is cleared between rounds, so a hand with no
// warrior in it opens a round with nothing legal to do at all.
//
// This measures the real rate at the moment it hurts: the START of a round,
// before either side has played, which is when a warriorless hand strands you.
import { reduce } from '@engine/reducer';
import { createMatch } from '@engine/createMatch';
import { legalMoves } from '@engine/selectors';
import { chooseAction } from '@ai/ai';
import { getCard } from '@content/cards';
import { PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK } from '@content/decks';
import type { GameState, Seat } from '@engine/types';

const DECKS = [PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK];
const GAMES = 900;

interface Bucket {
  opens: number;
  noWarrior: number;
  noPlay: number;
  oneWarrior: number;
  opensOffTurn: number;
}
const byRound: Record<number, Bucket> = {};
const bump = (r: number): Bucket =>
  (byRound[r] ??= { opens: 0, noWarrior: 0, noPlay: 0, oneWarrior: 0, opensOffTurn: 0 });

function sample(s: GameState, seat: Seat, round: number): void {
  const b = bump(round);
  b.opens++;
  const warriors = s.hands[seat].filter((i) => getCard(s.instances[i]!.cardId).type === 'unit');
  if (warriors.length === 0) b.noWarrior++;
  if (warriors.length === 1) b.oneWarrior++;
  // The thing that actually strands you: not one legal card to put down.
  // Only meaningful on your own turn, because isLegalPlay rejects everything
  // when it is not your move, which would score every enemy turn as a brick.
  if (s.activeSeat === seat) {
    const plays = legalMoves(s, seat).filter((m) => m.type === 'PLAY_CARD');
    if (plays.length === 0) b.noPlay++;
  } else {
    b.opensOffTurn++;
  }
}

for (let g = 0; g < GAMES; g++) {
  const a = DECKS[g % 3];
  const b = DECKS[(g + 1 + (g % 2)) % 3];
  let s: GameState = createMatch(g * 6151 + 7, a, b);
  s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
  s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });

  let seenRound = 0;
  for (let step = 0; step < 800 && s.phase !== 'battleEnd'; step++) {
    // First moment of a new round, with the board empty and nothing played.
    if (s.phase === 'playing' && s.round !== seenRound) {
      seenRound = s.round;
      sample(s, 'player', s.round);
    }
    const next = reduce(s, chooseAction(s, s.activeSeat));
    if (next === s) break;
    s = next;
  }
}

console.log(`\nOPENING HAND AT THE START OF EACH ROUND   ${GAMES} games\n`);
console.log('round   opens   no warrior at all   only one   nothing legal to play');
for (const r of Object.keys(byRound).map(Number).sort()) {
  const b = byRound[r];
  const p = (n: number, of: number) => `${((n / Math.max(1, of)) * 100).toFixed(1)}%`.padStart(7);
  const onTurn = b.opens - b.opensOffTurn;
  console.log(
    `  ${r}   ${String(b.opens).padStart(5)}      ${p(b.noWarrior, b.opens)}       ${p(b.oneWarrior, b.opens)}        ${p(b.noPlay, onTurn)}  (of ${onTurn} on-turn opens)`,
  );
}
console.log();
