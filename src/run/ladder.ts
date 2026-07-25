// Building the escalating sequence of opponents, and scaling their strength by
// trimming their strongest cards for the early fights.
import { getCard, provisionOf } from '@content/cards';
import { DECKS } from '@content/decks';
import type { DeckList } from '@content/decks';
import { nextRandom } from '@engine/ids';
import type { CardId, House } from '@engine/types';
import type { Encounter } from './types';

const DECK_BY_HOUSE: Record<string, DeckList> = {
  pandava: DECKS['pandava_starter'],
  kaurava: DECKS['kaurava_starter'],
  asura: DECKS['asura_starter'],
};

/** Drop the `n` costliest cards from a deck, weakening it for an early fight. */
function trimmed(house: House, n: number): CardId[] {
  const deck = DECK_BY_HOUSE[house];
  if (!deck) return [];
  const ranked = [...deck.cards].sort((a, b) => provisionOf(getCard(b)) - provisionOf(getCard(a)));
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
 */
export function buildLadder(seed: number, playerHouse: House): Encounter[] {
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
      deckCards: trimmed(house, rung.drop),
      boss: rung.boss,
    };
  });
}
