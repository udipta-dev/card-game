import { describe, expect, it } from 'vitest';
import { validateContent , checkDeckAstras, checkDecksCanWieldTheirAstras } from '@content/validateContent';
import { CARD_DB, allCards } from '@content/cards';
import { DECKS } from '@content/decks';

describe('content', () => {
  it('has no validation errors', () => {
    const errs = validateContent();
    expect(errs, JSON.stringify(errs, null, 2)).toHaveLength(0);
  });

  it('every deck references only real cards', () => {
    for (const deck of Object.values(DECKS)) {
      for (const id of deck.cards) expect(CARD_DB[id], `deck ${deck.id} -> ${id}`).toBeDefined();
    }
  });

  it('base powers are within 0..10', () => {
    for (const c of allCards()) {
      expect(c.basePower).toBeGreaterThanOrEqual(0);
      expect(c.basePower).toBeLessThanOrEqual(10);
    }
  });
});

describe('no astra without a wielder', () => {
  it('every deck can actually invoke every astra it carries', () => {
    expect(checkDecksCanWieldTheirAstras()).toEqual([]);
  });

  it('catches a deck holding an astra nobody in it can loose', () => {
    // The rule has to be able to FAIL, or it is decoration. Vasavi Shakti is
    // tier 3 and only Karna holds it by name, so a deck of footmen cannot.
    const errs = checkDeckAstras(
      { id: 'broken', cards: ['pandava_infantry', 'kaurava_infantry', 'vasavi_shakti'] },
    );
    expect(errs.length).toBe(1);
    expect(errs[0].message).toContain('no warrior in it can invoke it');
  });
});
