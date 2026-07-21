import { describe, expect, it } from 'vitest';
import { validateContent } from '@content/validateContent';
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
