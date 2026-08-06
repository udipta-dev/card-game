// Choosing who marches, inside a run.
//
// The defect this fixes: every card won was added to the deck automatically
// while the opening hand stayed at six, so a specific card went from 53% to
// appear in a 19-card deck down to 40% in a 25-card one. Winning made your
// deck worse. Capping the marching order turns a victory into a swap rather
// than a dilution.
import { describe, expect, it } from 'vitest';
import { createRun, fieldedRoster, marchingCards, planBattle } from '@run/run';
import { MUSTER_MAX, checkMuster } from '@content/muster';
import { PANDAVA_DECK } from '@content/decks';
import type { RunState } from '@run/types';

const fresh = (): RunState => createRun(11, 'pandava');

/** A run that has won its way to a roster bigger than a legal host. */
function withGrownRoster(extra: number): RunState {
  const run = fresh();
  const pool = PANDAVA_DECK.cards;
  const more = [
    'iravan', 'sankha', 'kuntibhoja', 'anjanaparvan', 'prativindhya',
    'sutasoma', 'shrutakarma', 'shatanika', 'shrutasena',
  ].filter((id) => !pool.includes(id)).slice(0, extra);
  return { ...run, roster: [...run.roster, ...more] };
}

describe('with no choice made', () => {
  it('fields everything available, exactly as the run always did', () => {
    const run = fresh();
    expect(marchingCards(run)).toEqual(fieldedRoster(run));
  });

  it('so the deck grows with the roster, which is the problem', () => {
    const grown = withGrownRoster(6);
    expect(marchingCards(grown).length).toBe(fieldedRoster(grown).length);
    expect(marchingCards(grown).length).toBeGreaterThan(MUSTER_MAX);
  });
});

describe('with a choice made', () => {
  it('fields exactly what was chosen, and the battle uses it', () => {
    const grown = withGrownRoster(6);
    const chosen = fieldedRoster(grown).slice(0, MUSTER_MAX);
    const run = { ...grown, marching: chosen };

    expect(marchingCards(run)).toEqual(chosen);
    expect(planBattle(run).playerDeck.cards).toEqual(chosen);
  });

  it('winning stops diluting: the deck stays capped as the roster grows', () => {
    const small = withGrownRoster(2);
    const chosen = fieldedRoster(small).slice(0, MUSTER_MAX);
    const later = { ...small, roster: [...small.roster, 'iravan', 'sankha'], marching: chosen };
    // Roster grew, marching order did not.
    expect(fieldedRoster(later).length).toBeGreaterThan(marchingCards(later).length);
    expect(marchingCards(later).length).toBe(MUSTER_MAX);
  });
});

describe('a stale choice is repaired, not obeyed', () => {
  it('drops cards that have since been spent or sent to penance', () => {
    const grown = withGrownRoster(6);
    const chosen = fieldedRoster(grown).slice(0, MUSTER_MAX);
    // One of them is spent for the rest of the run after being chosen.
    const spent = chosen[0];
    const run = { ...grown, marching: chosen, banned: [spent] };

    const marching = marchingCards(run);
    expect(marching).not.toContain(spent);
    expect(marching.every((id) => fieldedRoster(run).includes(id))).toBe(true);
  });

  it('falls back to the whole roster if what is left is no longer a legal host', () => {
    // Most of the chosen host has been spent. Rather than march a crippled
    // deck, the run fields everything it still has.
    const grown = withGrownRoster(6);
    const chosen = fieldedRoster(grown).slice(0, MUSTER_MAX);
    const run = { ...grown, marching: chosen, banned: chosen.slice(0, 12) };

    expect(checkMuster(chosen.filter((id) => !run.banned.includes(id))).ok).toBe(false);
    expect(marchingCards(run)).toEqual(fieldedRoster(run));
  });

  it('never hands the engine an illegal deck, whatever the choice was', () => {
    const grown = withGrownRoster(6);
    for (const marching of [[], ['arjuna'], fieldedRoster(grown).slice(0, 3)]) {
      const run = { ...grown, marching };
      const cards = marchingCards(run);
      expect(cards.length).toBeGreaterThanOrEqual(3);
      expect(new Set(cards).size).toBe(cards.length);
      expect(planBattle(run).playerDeck.cards).toEqual(cards);
    }
  });
});
