// A weapon nobody can fire, and a warrior whose weapon you left at home.
//
// You could spend 14 of your 170 provisions on the Vaishnav-Astra, cut the only
// man in your house who can loose it, march, and the game would never say a
// word. It would sit in your hand for three rounds and you would reasonably
// conclude the card was broken. That is exactly what happened in playtesting.
//
// The reverse was just as invisible: Bhagadatta walks onto the field carrying
// the Vaishnava, and unless you already knew that from the epic there was no
// way to find out.
import { describe, expect, it } from 'vitest';
import {
  arsenalOf,
  cheapestWielder,
  orphanWeapons,
  unpackedWeapons,
  wieldersOf,
} from '@content/arsenal';
import { advise, applyAdvisory, MIN_WARRIORS, MUSTER_MAX, checkMuster, poolFor } from '@content/muster';
import { PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK, DECK_BUDGET } from '@content/decks';
import { getCard } from '@content/cards';

describe('who can fire what', () => {
  it('an ultimate needs its named bearer, never rank alone', () => {
    // Nothing in the game is trained to tier 3, so rank can never reach it.
    expect(wieldersOf(['bhagadatta'], 'vaishnavastra')).toEqual(['bhagadatta']);
    expect(wieldersOf(['indrajit'], 'vaishnavastra')).toEqual(['indrajit']);
    // Bhishma is mastery 2, the highest in the game, and still cannot.
    expect(wieldersOf(['bhishma'], 'vaishnavastra')).toEqual([]);
  });

  it('the Brahma line needs training, and gets it from any master', () => {
    expect(wieldersOf(['bhishma'], 'brahmastra')).toEqual(['bhishma']);
    // Bhagadatta is mastery 1: strong, but never taught the tier-2 mantras.
    expect(wieldersOf(['bhagadatta'], 'brahmastra')).toEqual([]);
  });

  it('an elemental goes to anyone with any training at all', () => {
    expect(wieldersOf(['bhagadatta'], 'agneyastra')).toEqual(['bhagadatta']);
  });
});

describe('what is wrong with a host', () => {
  it('spots a weapon nobody present can fire', () => {
    const host = ['vaishnavastra', 'bhishma', 'drona'];
    expect(orphanWeapons(host)).toEqual(['vaishnavastra']);
  });

  it('and says nothing when the bearer is there', () => {
    expect(orphanWeapons(['vaishnavastra', 'bhagadatta'])).toEqual([]);
  });

  it('spots a warrior whose weapon was left at home', () => {
    const out = unpackedWeapons(['bhagadatta', 'bhishma']);
    expect(out).toEqual([{ astra: 'vaishnavastra', bearers: ['bhagadatta'] }]);
  });

  it('groups a weapon two men can bear, rather than listing it twice', () => {
    // Drona and Ashwatthama both bear the Brahmashirsha, and a per-warrior list
    // printed it twice, reading as two different weapons.
    const out = unpackedWeapons(['drona', 'ashwatthama']);
    const brahma = out.filter((u) => u.astra === 'brahmashirsha');
    expect(brahma).toHaveLength(1);
    expect(brahma[0].bearers.sort()).toEqual(['ashwatthama', 'drona']);
  });

  it('suggests the cheapest man who could fire an orphan', () => {
    const who = cheapestWielder(poolFor('kaurava').map((c) => c.id), 'vaishnavastra');
    expect(who).toBe('bhagadatta');
  });
});

describe('every starter deck is already clean', () => {
  // This is the reason the starters were left alone: they carry no dead weight.
  it.each([
    ['pandava', PANDAVA_DECK],
    ['kaurava', KAURAVA_DECK],
    ['asura', ASURA_DECK],
  ])('%s can fire every weapon it carries', (_name, deck) => {
    expect(orphanWeapons(deck.cards)).toEqual([]);
  });
});

describe('the arsenal reads mightiest first', () => {
  it('ranks by tier, so the ultimates lead', () => {
    const rows = arsenalOf(['bhagadatta', 'vaishnavastra', 'agneyastra', 'brahmastra', 'bhishma']);
    expect(rows.map((r) => r.tier)).toEqual([3, 2, 1]);
    expect(rows[0].astra).toBe('vaishnavastra');
  });

  it('names who can fire each one', () => {
    const rows = arsenalOf(['bhagadatta', 'vaishnavastra']);
    expect(rows[0].wielders).toEqual(['bhagadatta']);
  });
});

describe('fixing it for you', () => {
  it('adds the bearer for an orphan weapon', () => {
    const host = [...KAURAVA_DECK.cards.filter((c) => c !== 'bhagadatta'), 'vaishnavastra'];
    const [advisory] = advise(host, poolFor('kaurava').map((c) => c.id)).filter(
      (a) => a.kind === 'orphan-weapon',
    );
    expect(advisory.astra).toBe('vaishnavastra');

    const { cards } = applyAdvisory(host, advisory);
    expect(cards).toContain('bhagadatta');
    expect(orphanWeapons(cards)).toEqual([]);
  });

  it('never returns an illegal host', () => {
    const host = [...KAURAVA_DECK.cards.filter((c) => c !== 'bhagadatta'), 'vaishnavastra'];
    for (const a of advise(host, poolFor('kaurava').map((c) => c.id))) {
      const { cards } = applyAdvisory(host, a);
      expect(cards.length).toBeLessThanOrEqual(MUSTER_MAX);
      expect(
        cards.reduce((n, id) => n + (getCard(id).provision ?? getCard(id).basePower + 2), 0),
      ).toBeLessThanOrEqual(DECK_BUDGET);
      expect(cards.filter((id) => getCard(id).type === 'unit').length).toBeGreaterThanOrEqual(
        MIN_WARRIORS,
      );
      expect(new Set(cards).size, 'no duplicates').toBe(cards.length);
    }
  });

  it('never strands a different weapon while making room', () => {
    // Dropping the last man who can fire something else would be a "fix" that
    // quietly creates a second fault.
    const host = [...KAURAVA_DECK.cards.filter((c) => c !== 'bhagadatta'), 'vaishnavastra'];
    for (const a of advise(host, poolFor('kaurava').map((c) => c.id))) {
      const { cards } = applyAdvisory(host, a);
      expect(orphanWeapons(cards).length).toBeLessThanOrEqual(orphanWeapons(host).length);
    }
  });

  it('leaves the host alone when the suggestion is already there', () => {
    const host = ['bhagadatta', 'vaishnavastra'];
    const advisory = { kind: 'orphan-weapon' as const, astra: 'vaishnavastra', suggest: 'bhagadatta', text: '' };
    expect(applyAdvisory(host, advisory).cards).toEqual(host);
  });

  it('adding an unpacked weapon keeps the host legal', () => {
    const [advisory] = advise(KAURAVA_DECK.cards, poolFor('kaurava').map((c) => c.id)).filter(
      (a) => a.kind === 'unpacked-weapon',
    );
    const { cards } = applyAdvisory(KAURAVA_DECK.cards, advisory);
    expect(cards).toContain(advisory.astra);
    expect(checkMuster(cards).ok, checkMuster(cards).problems.join('; ')).toBe(true);
  });
});
