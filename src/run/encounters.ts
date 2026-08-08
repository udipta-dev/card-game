// Building the escalating sequence of opponents, and scaling their strength by
// trimming their strongest cards for the early fights.
//
// This is the ENCOUNTER builder. It was called ladder.ts, and that name now
// belongs to run/ladder.ts, which holds the fifty levels and the two currencies.
// Both are "the ladder" in conversation; only one of them is a progression.
import { getCard, provisionOf } from '@content/cards';
import { DECKS } from '@content/decks';
import type { DeckList } from '@content/decks';
import { nextRandom } from '@engine/ids';
import { MAX_LEVEL } from './ladder';
import type { CardId, House } from '@engine/types';
import { autoMuster, poolFor, whyNotAdd, MUSTER_MAX } from '@content/muster';
import { limitsFor } from '@ai/difficulty';
import type { Encounter } from './types';

const DECK_BY_HOUSE: Record<string, DeckList> = {
  pandava: DECKS['pandava_starter'],
  kaurava: DECKS['kaurava_starter'],
  asura: DECKS['asura_starter'],
};

/**
 * The army this house fields at a given ladder level.
 *
 * Built from the CURATED army rather than from scratch, and the difference is
 * worth the extra step. autoMuster on a capped pool produces a heuristic army,
 * and heuristic armies measured a 42-point spread against the searched ones, so
 * building the opponent from scratch at every level would have made the late
 * ladder EASIER than the campaign is today. Instead the curated army is the
 * base, the level's ceiling takes its biggest names away, and what is left of
 * the budget is refilled from the house's own pool.
 *
 * At the top of the ladder every curated card clears the cap and the refill has
 * nothing to add, so this returns exactly the army that ships today.
 */
function armyAtLevel(house: House, level: number): CardId[] {
  const deck = DECK_BY_HOUSE[house];
  if (!deck) return [];
  const limits = limitsFor(level);
  const kept = deck.cards.filter((id) => provisionOf(getCard(id)) <= (limits.cap ?? Infinity));
  if (kept.length === deck.cards.length) return [...deck.cards];

  // Refill what the ceiling took, cheapest-first from the same pool, so the
  // early opponent fields a full army of small men rather than a short one.
  const pool = poolFor(house)
    .map((c) => c.id)
    .filter((id) => !kept.includes(id));
  const filled = [...kept];
  for (const id of autoMuster(pool, MUSTER_MAX, limits)) {
    if (whyNotAdd(filled, id, limits) === null) filled.push(id);
  }
  return filled;
}

/** Drop the `n` costliest cards from a deck, weakening it for an early fight. */
function trimmed(house: House, n: number, level: number): CardId[] {
  const cards = armyAtLevel(house, level);
  const ranked = [...cards].sort((a, b) => provisionOf(getCard(b)) - provisionOf(getCard(a)));
  return ranked.slice(n); // keep all but the top n
}

/** The three-word names give each rung a little character. */
const RUNGS: { name: string; drop: number; boss?: boolean }[] = [
  { name: 'An outrider party', drop: 7 },
  { name: 'A raiding band', drop: 6 },
  { name: 'The vanguard', drop: 4 },
  { name: 'The gathered host', drop: 2 },
  { name: 'The full host', drop: 0 },
  { name: 'The great host, in full array', drop: 0, boss: true },
];

/**
 * Build the ladder for a run. Opponents are the hosts the player did not
 * choose, alternating and growing stronger rung by rung. Deterministic on seed.
 *
 * `level` is the ladder level being ATTEMPTED, which sets the ceiling every
 * opponent in this run is built under. It defaults to the top so a caller that
 * does not care about the ladder (the lab, a test, an old save) gets exactly
 * the opponents that shipped before the ladder existed.
 */
export function buildLadder(seed: number, playerHouse: House, level = MAX_LEVEL): Encounter[] {
  const foes = (['kaurava', 'asura', 'pandava'] as House[]).filter((h) => h !== playerHouse);
  // A seeded starting offset so two runs of the same host still differ in order.
  const [, roll] = nextRandom(seed);
  const start = Math.floor(roll * foes.length);

  return RUNGS.map((rung, i) => {
    const house = foes[(start + i) % foes.length];
    return {
      id: `enc-${i}`,
      name: rung.name,
      house,
      deckCards: trimmed(house, rung.drop, level),
      boss: rung.boss,
    };
  });
}
