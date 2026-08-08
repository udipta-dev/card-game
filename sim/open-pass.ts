// Is "never open a round by passing" actually worth having?
//
// The behaviour it removes is real and was measured: at ladder level 1 the
// opponent opened a round by passing 34 times in 60, always with legal plays in
// hand, and at every other level never once. The cause is a hole in evaluate():
// it weighs board power against cards held, those weights were tuned on the full
// game where a card is worth 7 to 12 power, and under the early cap a card is
// worth 5, so the card term wins and passing looks good.
//
// Behaviour being wrong is not the same as fixing it being right, so both sides
// play the same army and only the rule differs.
//
//   npm run open-pass [games]
import { reduce } from '@engine/reducer';
import { createMatch, MULLIGAN_MAX } from '@engine/createMatch';
import { chooseAction } from '@ai/ai';
import { worstCards } from '@ai/hand';
import { autoMuster, poolFor, toDeckList } from '@content/muster';
import { limitsFor } from '@ai/difficulty';
import { PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK } from '@content/decks';
import type { DeckList, GameState, Seat } from '@engine/types';

const GAMES = Number(process.argv[2] ?? 400);
const HOUSES = ['pandava', 'kaurava', 'asura'] as const;
const FULL: Record<string, DeckList> = {
  pandava: PANDAVA_DECK,
  kaurava: KAURAVA_DECK,
  asura: ASURA_DECK,
};

const army = (house: (typeof HOUSES)[number], level: number): DeckList =>
  level >= 50
    ? FULL[house]
    : toDeckList(
        house,
        `${house} L${level}`,
        autoMuster(poolFor(house).map((c) => c.id), undefined, limitsFor(level)),
      );

/** 'ai' is always the guarded seat. */
function duel(level: number) {
  let guardedWins = 0;
  let decided = 0;
  for (let g = 0; g < GAMES; g++) {
    const d = army(HOUSES[g % 3], level);
    const opener: Seat = g % 2 === 0 ? 'player' : 'ai';
    let s: GameState = createMatch(g * 7919 + 5, d, d, opener);
    for (const seat of ['player', 'ai'] as Seat[]) {
      s = reduce(s, { type: 'MULLIGAN', seat, iids: worstCards(s, seat, MULLIGAN_MAX) });
    }
    for (let step = 0; step < 900 && s.phase !== 'battleEnd'; step++) {
      const seat = s.activeSeat;
      // 'player' keeps the old rule and may concede an opening; 'ai' may not.
      const next = reduce(
        s,
        chooseAction(s, seat, undefined, undefined, undefined, undefined, undefined, seat === 'player'),
      );
      if (next === s) break;
      s = next;
    }
    if (s.winner === null) continue;
    decided++;
    if (s.winner === 'ai') guardedWins++;
  }
  const pct = (guardedWins / decided) * 100;
  const ci = 196 * Math.sqrt((pct / 100) * (1 - pct / 100) / decided);
  console.log(`  level ${String(level).padStart(2)}: the guarded seat wins ${pct.toFixed(1)}% +-${ci.toFixed(1)}  (${decided})`);
}

console.log(`${GAMES} games per level, identical armies, only the rule differs.\n`);
for (const level of [1, 6, 19, 33, 50]) duel(level);
