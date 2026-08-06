// Choosing your host. The rules that stop a muster being illegal arithmetic.
import { describe, expect, it } from 'vitest';
import {
  MUSTER_MAX,
  MUSTER_MIN,
  autoMuster,
  checkMuster,
  musterProvisions,
  poolFor,
  toDeckList,
  whyNotAdd,
} from '@content/muster';
import { ASURA_DECK, DECK_BUDGET, KAURAVA_DECK, PANDAVA_DECK } from '@content/decks';
import { getCard } from '@content/cards';

const STARTERS = [PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK];

describe('the pool a house may draw on', () => {
  it('is its own cards plus the shared arsenal, and it is bigger than a deck', () => {
    for (const house of ['pandava', 'kaurava', 'asura'] as const) {
      const pool = poolFor(house);
      expect(pool.length).toBeGreaterThan(MUSTER_MAX);
      // Nothing from another house sneaks in.
      expect(pool.every((c) => c.house === house || c.house === 'neutral')).toBe(true);
    }
  });

  it('reaches the warriors the starter decks left out', () => {
    // The reason this screen exists: eleven Pandava warriors could never be
    // played, because the starter list was the only list.
    const pool = poolFor('pandava').map((c) => c.id);
    const unreachable = pool.filter(
      (id) => getCard(id).type === 'unit' && !PANDAVA_DECK.cards.includes(id),
    );
    expect(unreachable.length).toBeGreaterThan(5);
  });
});

describe('what makes a muster legal', () => {
  it('accepts every starter deck as-is', () => {
    for (const d of STARTERS) {
      const check = checkMuster(d.cards);
      expect(check.problems).toEqual([]);
      expect(check.ok).toBe(true);
      expect(check.provisions).toBeLessThanOrEqual(DECK_BUDGET);
    }
  });

  it('refuses too few cards, and says how many are missing', () => {
    const short = PANDAVA_DECK.cards.slice(0, MUSTER_MIN - 2);
    const check = checkMuster(short);
    expect(check.ok).toBe(false);
    expect(check.problems.join(' ')).toMatch(/2 more cards/);
  });

  it('refuses more than the maximum', () => {
    const pool = poolFor('pandava').map((c) => c.id);
    const over = pool.slice(0, MUSTER_MAX + 3);
    expect(checkMuster(over).problems.join(' ')).toMatch(/3 too many/);
  });

  it('refuses a duplicate', () => {
    const dup = [...PANDAVA_DECK.cards.slice(0, MUSTER_MIN - 1), PANDAVA_DECK.cards[0]];
    expect(checkMuster(dup).problems.join(' ')).toMatch(/same card twice/);
  });

  it('refuses a host of weapons with nobody to loose them', () => {
    // Astras need a warrior standing. All-arsenal is legal arithmetic and a
    // lost battle, so it is caught here rather than on the field.
    const astras = poolFor('pandava')
      .filter((c) => c.type === 'astra')
      .map((c) => c.id)
      .slice(0, MUSTER_MIN);
    expect(checkMuster(astras).ok).toBe(false);
    expect(checkMuster(astras).problems.join(' ')).toMatch(/hold the line/);
  });

  it('refuses a muster over the provisions budget', () => {
    // The most expensive legal-sized selection there is.
    const dear = poolFor('kaurava')
      .filter((c) => c.type === 'unit')
      .sort((a, b) => (b.basePower ?? 0) - (a.basePower ?? 0))
      .slice(0, MUSTER_MAX)
      .map((c) => c.id);
    const check = checkMuster(dear);
    expect(check.provisions).toBeGreaterThan(DECK_BUDGET);
    expect(check.problems.join(' ')).toMatch(/provisions over budget/);
  });
});

describe('adding one more card', () => {
  it('explains the refusal rather than just refusing', () => {
    const full = PANDAVA_DECK.cards;
    const next = poolFor('pandava').map((c) => c.id).find((id) => !full.includes(id))!;
    expect(whyNotAdd(full, next)).toMatch(/19 cards at most/);
    expect(whyNotAdd(full, full[0])).toMatch(/Already mustered/);
  });

  it('names the shortfall when the budget is the problem', () => {
    // Nearly full budget, then try to add the dearest card in the pool.
    const some = PANDAVA_DECK.cards.slice(0, 14);
    const dearest = poolFor('pandava')
      .filter((c) => !some.includes(c.id))
      .sort((a, b) => (b.basePower ?? 0) - (a.basePower ?? 0))[0].id;
    const why = whyNotAdd(some, dearest);
    if (why) expect(why).toMatch(/provisions/);
  });

  it('lets a legal card in', () => {
    const some = PANDAVA_DECK.cards.slice(0, 10);
    const cheap = poolFor('pandava')
      .filter((c) => !some.includes(c.id))
      .sort((a, b) => (a.basePower ?? 0) - (b.basePower ?? 0))[0].id;
    expect(whyNotAdd(some, cheap)).toBeNull();
  });
});

describe('the automatic muster', () => {
  it('produces a legal host for every house', () => {
    for (const house of ['pandava', 'kaurava', 'asura'] as const) {
      const ids = autoMuster(poolFor(house).map((c) => c.id));
      const check = checkMuster(ids);
      expect(check.problems).toEqual([]);
      expect(check.count).toBeLessThanOrEqual(MUSTER_MAX);
      expect(check.provisions).toBeLessThanOrEqual(DECK_BUDGET);
    }
  });

  it('is the same every time, so a run is reproducible', () => {
    const pool = poolFor('asura').map((c) => c.id);
    expect(autoMuster(pool)).toEqual(autoMuster(pool));
  });

  it('handles a pool smaller than a full host without going illegal on size', () => {
    // A run roster can be small. Auto must not invent cards.
    const tiny = PANDAVA_DECK.cards.slice(0, 8);
    const ids = autoMuster(tiny);
    expect(ids.length).toBeLessThanOrEqual(tiny.length);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('handing the choice to the engine', () => {
  it('becomes a DeckList the engine can start a match from', () => {
    const ids = autoMuster(poolFor('kaurava').map((c) => c.id));
    const deck = toDeckList('kaurava', 'My host', ids);
    expect(deck.house).toBe('kaurava');
    expect(deck.cards).toEqual(ids);
    expect(musterProvisions(deck.cards)).toBeLessThanOrEqual(DECK_BUDGET);
  });
});
