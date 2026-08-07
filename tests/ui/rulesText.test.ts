// No card may keep its rules a secret.
//
// Seven cards rendered a completely empty rules panel: Shakuni, Jayadratha,
// Yudhishthira, Sweta, Shalya, Barbarika and Balarama. The player was shown a
// power, a tier and a flavour line, and the whole card was hidden. Shakuni is
// the clearest case: he makes the enemy discard two and himself discard one,
// which is his entire reason to exist, and his panel printed nothing at all.
//
// The cause was structural rather than an oversight on those seven. The
// generator hard-coded each sentence to one (action, target) pair, so any pair
// nobody had written by hand produced silence. `buff` had no wording of any
// kind and is used by fourteen cards, which is why Krishna's +1 and Gandiva's
// +3 were both invisible on their own cards.
import { describe, expect, it } from 'vitest';
import { allCards, getCard } from '@content/cards';
import { rulesText } from '@ui/card/cardTheme';

const withMechanics = allCards().filter(
  (c) => c.effects.length > 0 || c.keywords.length > 0 || !!c.ability,
);

describe('every card that does something says so', () => {
  it('covers the whole set, so this test is not vacuous', () => {
    expect(withMechanics.length).toBeGreaterThan(80);
  });

  it.each(withMechanics.map((c) => [c.name, c.id]))('%s renders rules text', (_name, id) => {
    expect(rulesText(getCard(id)).length).toBeGreaterThan(0);
  });

  it('never prints a doubled sign like "+-3"', () => {
    // Shalya lowers Karna, so his buff amount is negative and the generator
    // used to prefix it with a plus regardless.
    for (const c of withMechanics) {
      for (const line of rulesText(c)) {
        expect(line, `${c.name}: ${line}`).not.toMatch(/\+-|--\d|\+\+/);
      }
    }
  });

  it('never leaves two colon-terminated clauses jammed together', () => {
    // Krishna's card read "In the round that decides the battle: Unless while
    // jarasandha stands against you:" which is not a sentence.
    for (const c of withMechanics) {
      for (const line of rulesText(c)) {
        expect(line.match(/:/g)?.length ?? 0, `${c.name}: ${line}`).toBeLessThanOrEqual(1);
      }
    }
  });

  it('names cards properly rather than printing raw ids', () => {
    for (const c of withMechanics) {
      for (const line of rulesText(c)) {
        // Ids are lowercase with underscores; a real name never looks like that.
        expect(line, `${c.name}: ${line}`).not.toMatch(/\b[a-z]+_[a-z_]+\b/);
      }
    }
  });
});

describe('the cards that were blank now say the thing that matters', () => {
  const says = (id: string, re: RegExp) =>
    expect(rulesText(getCard(id)).join(' ')).toMatch(re);

  it('Shakuni states the loaded wager', () => says('shakuni', /enemy loses 2 cards/i));
  it('Balarama states his once-per-battle mace', () => says('balarama', /mace of the plough/i));
  it('Barbarika states that he falls with them', () => says('barbarika', /falls with them/i));
  it('Krishna states the +1 as well as the kill', () => says('krishna_charioteer', /\+1/));
  it('Gandiva states the +3 and the draw', () => says('gandiva', /\+3[\s\S]*draw/i));
  it('Shalya states that he weakens Karna', () => says('shalya', /weakens Karna/i));
});
