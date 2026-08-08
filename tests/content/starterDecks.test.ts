// The armies the game ships must obey the rules the game enforces.
//
// Nothing checked this. A starter army briefly shipped at 20 cards and 171
// provisions, over both the card limit and the budget, and the only thing that
// caught it was an ad-hoc script written for something else. The muster screen
// would have refused to let a PLAYER build it.
import { describe, expect, it } from 'vitest';
import { PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK, DECK_BUDGET } from '@content/decks';
import { MIN_WARRIORS, MUSTER_MAX, MUSTER_MIN, checkMuster, musterProvisions, poolFor } from '@content/muster';
import { orphanWeapons } from '@content/arsenal';
import { getCard } from '@content/cards';

const DECKS = [PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK];

describe('every starter army is one a player could have built', () => {
  it.each(DECKS.map((d) => [d.house, d]))('%s passes the muster check', (_h, deck) => {
    const check = checkMuster(deck.cards);
    expect(check.ok, check.problems.join('; ')).toBe(true);
  });

  it.each(DECKS.map((d) => [d.house, d]))('%s is within the card limits', (_h, deck) => {
    expect(deck.cards.length).toBeGreaterThanOrEqual(MUSTER_MIN);
    expect(deck.cards.length).toBeLessThanOrEqual(MUSTER_MAX);
  });

  it.each(DECKS.map((d) => [d.house, d]))('%s is within budget', (_h, deck) => {
    expect(musterProvisions(deck.cards)).toBeLessThanOrEqual(DECK_BUDGET);
  });

  it.each(DECKS.map((d) => [d.house, d]))('%s can hold a line', (_h, deck) => {
    const units = deck.cards.filter((id) => getCard(id).type === 'unit').length;
    expect(units).toBeGreaterThanOrEqual(MIN_WARRIORS);
  });

  it.each(DECKS.map((d) => [d.house, d]))('%s carries no weapon it cannot fire', (_h, deck) => {
    // 14 provisions of nothing, and the thing the muster screen warns loudest
    // about. A starter army must never be the example of the mistake.
    expect(orphanWeapons(deck.cards)).toEqual([]);
  });

  it.each(DECKS.map((d) => [d.house, d]))('%s only contains cards from its own pool', (_h, deck) => {
    const pool = new Set(poolFor(deck.house).map((c) => c.id));
    for (const id of deck.cards) expect(pool.has(id), `${id} is not in the ${deck.house} pool`).toBe(true);
  });

  it('names no card twice in any army', () => {
    for (const d of DECKS) expect(new Set(d.cards).size, d.house).toBe(d.cards.length);
  });
});
