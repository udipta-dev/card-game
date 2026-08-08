// Does the ladder's difficulty curve exist?
//
// The claim in docs/ladder.md is that the opponent at forty plays differently
// from the opponent at four. That is a claim about measurable strength, so it
// gets measured rather than asserted. Two questions, and the second is the one
// that actually matters:
//
//   1. Does the LOW-RUNG BRAIN lose to the high-rung brain, with both armies
//      identical? This isolates dial 2, how well it plays.
//   2. Does the LOW-RUNG ARMY lose to the high-rung army, with both brains
//      identical? This isolates dial 1, what it may bring, which the doc calls
//      most of the curve.
//
// If either comes back at 50% the dial is decoration and should be deleted
// rather than shipped as a difficulty setting.
//
//   npm run ladder-ai [gamesPerPair]
import { reduce } from '@engine/reducer';
import { createMatch, MULLIGAN_MAX } from '@engine/createMatch';
import { chooseAction } from '@ai/ai';
import { worstCards } from '@ai/hand';
import { skillFor, limitsFor } from '@ai/difficulty';
import { autoMuster, poolFor, toDeckList } from '@content/muster';
import { PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK } from '@content/decks';
import type { DeckList, GameState, Seat } from '@engine/types';

const GAMES = Number(process.argv[2] ?? 400);
const DECKS = [PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK];
const LEVELS = [1, 5, 15, 25, 35, 50];

/** One match between two configured opponents. Returns the winner's index. */
function play(
  seed: number,
  decks: [DeckList, DeckList],
  skills: [ReturnType<typeof skillFor>, ReturnType<typeof skillFor>],
  opener: Seat,
): Seat | null {
  const bySeat = (seat: Seat) => (seat === 'player' ? 0 : 1);
  let s: GameState = createMatch(seed, decks[0], decks[1], opener);
  // DISPATCHED PER SEAT rather than through chooseAction, which answers for
  // whichever seat still owes one. Routed through the usual call, one seat's
  // call would answer for the other and hand the low rung the full policy,
  // which is precisely the dial being measured.
  for (const seat of ['player', 'ai'] as Seat[]) {
    const k = skills[bySeat(seat)];
    s = reduce(s, {
      type: 'MULLIGAN',
      seat,
      iids: k.mulligan ? worstCards(s, seat, MULLIGAN_MAX) : [],
    });
  }
  for (let step = 0; step < 900 && s.phase !== 'battleEnd'; step++) {
    const seat = s.activeSeat;
    const k = skills[bySeat(seat)];
    const next = reduce(s, chooseAction(s, seat, undefined, undefined, undefined, k.roundSwap, k.mulligan));
    if (next === s) break;
    s = next;
  }
  return s.winner;
}

function rate(seed0: number, mk: (i: number) => { decks: [DeckList, DeckList]; skills: [ReturnType<typeof skillFor>, ReturnType<typeof skillFor>] }) {
  let wins = 0;
  let played = 0;
  for (let g = 0; g < GAMES; g++) {
    const { decks, skills } = mk(g);
    // Alternate the opening seat: the first mover is worth 14 points in this
    // game, which would swamp anything being measured here if it were fixed.
    const opener: Seat = g % 2 === 0 ? 'player' : 'ai';
    const w = play(seed0 + g * 7919, decks, skills, opener);
    if (w === null) continue;
    played++;
    if (w === 'ai') wins++;
  }
  return { pct: played ? (wins / played) * 100 : NaN, played };
}

console.log(`${GAMES} games per pair, seat 'ai' is always the HIGH rung.\n`);

console.log('1. BRAIN ONLY. Identical curated armies, level 1 brain vs level 50 brain.');
for (const low of LEVELS.slice(0, -1)) {
  const r = rate(1_000_003 + low, (g) => ({
    decks: [DECKS[g % 3], DECKS[g % 3]],
    skills: [skillFor(low), skillFor(50)],
  }));
  console.log(`   level ${String(low).padStart(2)} brain  vs level 50 brain   high rung wins ${r.pct.toFixed(1)}%  (${r.played})`);
}

console.log('\n2. ARMY ONLY. Identical level-50 brains, army built to each level.');
const armies = new Map<string, DeckList>();
const armyFor = (house: 'pandava' | 'kaurava' | 'asura', level: number): DeckList => {
  const key = `${house}:${level}`;
  const hit = armies.get(key);
  if (hit) return hit;
  const built = toDeckList(
    house,
    `${house} L${level}`,
    autoMuster(poolFor(house).map((c) => c.id), undefined, limitsFor(level)),
  );
  armies.set(key, built);
  return built;
};
for (const low of LEVELS.slice(0, -1)) {
  const r = rate(2_000_003 + low, (g) => {
    const house = (['pandava', 'kaurava', 'asura'] as const)[g % 3];
    return {
      decks: [armyFor(house, low), armyFor(house, 50)],
      skills: [skillFor(50), skillFor(50)],
    };
  });
  console.log(`   level ${String(low).padStart(2)} army   vs level 50 army    high rung wins ${r.pct.toFixed(1)}%  (${r.played})`);
}

console.log('\n3. BOTH DIALS, which is what a player actually meets.');
for (const low of LEVELS.slice(0, -1)) {
  const r = rate(3_000_003 + low, (g) => {
    const house = (['pandava', 'kaurava', 'asura'] as const)[g % 3];
    return {
      decks: [armyFor(house, low), armyFor(house, 50)],
      skills: [skillFor(low), skillFor(50)],
    };
  });
  console.log(`   level ${String(low).padStart(2)} rung   vs level 50 rung    high rung wins ${r.pct.toFixed(1)}%  (${r.played})`);
}
