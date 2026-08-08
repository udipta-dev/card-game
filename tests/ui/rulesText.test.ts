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

// ---------------------------------------------------------------------------
// Later: the same failure mode, three more times.
//
// Every fault here is silent by construction. An unhandled clause returns null,
// null is filtered out of an `and`, and the card renders a confident sentence
// with a piece missing. Nothing throws and nothing logs.
//
//   - Krishna's shield rendered NOTHING on Krishna's own card, because addFlag
//     had wording for exactly one flag out of eight.
//   - The Vaishnava printed only half its condition, because targetHasBoon had
//     no case, so the clause naming Krishna was dropped from the `and`.
//   - Then, once it had a case, the negation inverted it: the card read "so
//     long as Krishna guards your mark, slays a chosen foe", the opposite of
//     the rule, on the clause deciding whether the weapon kills.
// ---------------------------------------------------------------------------

/** Every condition object appearing anywhere in the set, `and`/`or`/`not` unwrapped. */
function everyCondition(): { card: string; c: NonNullable<unknown> & { q: string } }[] {
  const out: { card: string; c: { q: string } }[] = [];
  const walk = (card: string, c: unknown): void => {
    if (!c || typeof c !== 'object') return;
    const q = c as { q: string; cs?: unknown[]; c?: unknown };
    out.push({ card, c: q });
    q.cs?.forEach((sub) => walk(card, sub));
    if (q.c) walk(card, q.c);
  };
  for (const card of allCards()) {
    for (const eff of card.effects) walk(card.id, eff.condition);
  }
  return out as { card: string; c: NonNullable<unknown> & { q: string } }[];
}

describe('a card cannot keep a rule to itself', () => {
  it('every flag a card applies is explained in words', () => {
    // addFlag had wording for 'diamond-body' and nothing else, so Krishna's
    // shield and Vinda's bowstring both rendered as empty space.
    for (const card of allCards()) {
      for (const eff of card.effects) {
        for (const a of eff.actions) {
          if (a.kind !== 'addFlag') continue;
          const text = rulesText(card).join(' ').toLowerCase();
          expect(text.length, `${card.id} applies '${a.flag}' and says nothing`).toBeGreaterThan(0);
          // The flag's own wording must be present, not merely SOME text: a
          // card with a second, unrelated effect would otherwise pass.
          const others = { ...card, effects: card.effects.filter((e) => e !== eff) };
          expect(
            rulesText(card).length,
            `${card.id}'s '${a.flag}' effect renders no line of its own`,
          ).toBeGreaterThan(rulesText(others as typeof card).length - 1);
        }
      }
    }
  });

  it('every condition kind in the set renders something', () => {
    // An unhandled kind returns null and is silently dropped from an `and`,
    // which is how the Vaishnava came to print half of its own rule.
    const KINDS = new Set(everyCondition().map((e) => e.c.q));
    expect(KINDS.size, 'no conditions found, the walk is broken').toBeGreaterThan(0);
    for (const card of allCards()) {
      for (const eff of card.effects) {
        if (!eff.condition) continue;
        const solo = { ...card, effects: [eff] };
        const text = rulesText(solo as typeof card).join(' ');
        expect(text.trim(), `${card.id}: a conditional effect renders nothing`).not.toBe('');
      }
    }
  });

  it('no rule ends on a dangling condition', () => {
    // "While Anuvinda stands:" with nothing after it. Happens when the effect
    // has a condition but its actions produce no line.
    for (const card of allCards()) {
      for (const line of rulesText(card)) {
        expect(line, `${card.id} leaves a condition hanging`).not.toMatch(/:\s*$/);
      }
    }
  });
});

describe('a negation says the opposite', () => {
  it('never renders a not-clause as its own affirmative', () => {
    // The whole fault in one property. The rewrite used two independent string
    // replaces and treated "the string changed" as proof the negation landed.
    for (const { card, c } of everyCondition()) {
      if (c.q !== 'not') continue;
      const inner = (c as unknown as { c: { q: string } }).c;
      const host = getCard(card);
      const negated = rulesText({
        ...host,
        effects: [{ ...host.effects[0], condition: c, actions: [{ kind: 'destroy' }] }],
      } as typeof host).join(' ');
      const affirmed = rulesText({
        ...host,
        effects: [{ ...host.effects[0], condition: inner, actions: [{ kind: 'destroy' }] }],
      } as typeof host).join(' ');
      expect(negated, `${card}: "not" reads identically to the plain condition`).not.toBe(affirmed);
      expect(negated.toLowerCase(), `${card}: "not" carries no negative word`).toMatch(
        /\b(not|unless|without|never)\b/,
      );
    }
  });

  it('the Vaishnava names BOTH things that turn it aside', () => {
    // The one that shipped wrong, kept as a named case because it is the most
    // expensive card in the game and both clauses are the reason to buy it.
    const text = rulesText(getCard('vaishnavastra')).join(' ');
    expect(text).toMatch(/Krishna/);
    expect(text).toMatch(/Prahlada/);
    expect(text).toMatch(/does not guard/);
    expect(text).toMatch(/does not stand/);
  });
});

describe('armour belongs to whoever is wearing it', () => {
  it('only Karna is told he wears the Kavacha-Kundala', () => {
    // The line was hardcoded, so Shikhandi and Prahlada were both being handed
    // the armour Karna was born in and traded away.
    for (const card of allCards()) {
      if (card.id === 'karna') continue;
      expect(rulesText(card).join(' '), `${card.id} is wearing Karna's armour`).not.toMatch(
        /Kavacha-Kundala/,
      );
    }
    expect(rulesText(getCard('karna')).join(' ')).toMatch(/Kavacha-Kundala/);
  });

  it('and the line states how much it turns aside', () => {
    // It said "the first strike" whatever the amount, which is wrong for any
    // armour above 1. Prahlada carries 3.
    expect(rulesText(getCard('prahlada')).join(' ')).toMatch(/first 3 of harm/);
  });
});

describe('a card that cannot be beaten says who beats it', () => {
  it('Duryodhana names Bhima on his own card', () => {
    // "Cannot be slain ... until a vow strips it from him" tells you a vow
    // exists and not whose. `counteredBy` was rendered inside the `card.type
    // === 'astra'` branch, so a warrior's answer was typed, stored, validated
    // and then silently never shown, and the answer lived only on Bhima's card
    // where a Kaurava player holding Duryodhana would never look.
    const text = rulesText(getCard('duryodhana')).join(' ');
    expect(text).toMatch(/cannot be slain/i);
    expect(text).toMatch(/Answered by: Bhima/);
  });

  it('and every counteredBy in the set reaches the panel, astra or not', () => {
    for (const card of allCards()) {
      if (!card.counteredBy?.length) continue;
      const text = rulesText(card).join(' ');
      for (const answer of card.counteredBy) {
        expect(text, `${card.id} hides its answer ${answer}`).toMatch(
          new RegExp(getCard(answer).name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
        );
      }
    }
  });
});
