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

describe('the canon sweep landed in the game, and the refuse list did not', () => {
  it('holds the astras the research actually sourced', () => {
    for (const id of ['tvashtra', 'praswapa', 'samvodhana', 'prajna', 'antardhana']) {
      expect(CARD_DB[id], `${id} missing`).toBeDefined();
      expect(CARD_DB[id].type).toBe('astra');
    }
  });

  it('holds NONE of the names that are in neither epic', () => {
    // Every one of these is all over the internet and in no primary text.
    // docs/canon-inventory.md section 6b. Mohini in particular has a fake
    // name AND a fake effect.
    const invented = [
      'mohini', 'mohiniastra', 'sailastra', 'kandarpastra', 'mrityuastra',
      'kaalastra', 'suryastra', 'chandrastra', 'somastra', 'shivastra',
      'sarpastra', 'adityastra', 'anjalikastra',
    ];
    for (const id of invented) {
      expect(CARD_DB[id], `${id} is not in either epic and must not be a card`).toBeUndefined();
    }
  });

  it('gives Praswapa its own named answer, so sleep is not simply better', () => {
    // Udyoga CLXXXVI: the epic supplies the counter itself.
    expect(CARD_DB['praswapa'].counteredBy).toContain('samvodhana');
    expect(CARD_DB['samvodhana']).toBeDefined();
  });
});
