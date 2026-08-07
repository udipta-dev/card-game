// Three ways the campaign lied to the player or lost their work.
import { describe, expect, it } from 'vitest';
import { createRun, resolveBattle } from '@run/run';
import { rollShrine } from '@run/shrine';
import { PANDAVA_DECK } from '@content/decks';
import type { GameState } from '@engine/types';
import type { RunState } from '@run/types';

/** Just enough of a finished battle for resolveBattle to read. */
const finished = (winner: 'player' | 'ai' | null): GameState =>
  ({ winner, bannedThisRun: [], suspendedThisRun: [], curses: { player: [], ai: [] } }) as unknown as GameState;

describe('the host you mustered is the host that marches', () => {
  it('starts the run from the cards you chose, not the starter list', () => {
    const chosen = PANDAVA_DECK.cards.slice(0, 12);
    const run = createRun(11, 'pandava', chosen);
    // Every warrior in the run came from the chosen list.
    expect(run.roster.every((id) => chosen.includes(id))).toBe(true);
    expect(run.roster.length).toBeLessThan(PANDAVA_DECK.cards.length);
  });

  it('still falls back to the starter list when nothing was chosen', () => {
    expect(createRun(11, 'pandava').roster.length).toBeGreaterThan(0);
    expect(createRun(11, 'pandava', []).roster).toEqual(createRun(11, 'pandava').roster);
  });

  it('never carries a tier-3 astra in from the muster; those are earned', () => {
    // Even if the player hand-picks one, the campaign strips it.
    const run = createRun(11, 'pandava', [...PANDAVA_DECK.cards, 'brahmashirsha']);
    expect(run.roster).not.toContain('brahmashirsha');
  });
});

describe('a drawn battle is not a defeat', () => {
  it('ends the run, but records that nobody was beaten', () => {
    const run = createRun(11, 'pandava');
    const drawn = resolveBattle(run, finished(null));
    expect(drawn.phase).toBe('lost'); // you still do not march on
    expect(drawn.endedBy).toBe('stalemate');
  });

  it('still calls a real loss a defeat', () => {
    const run = createRun(11, 'pandava');
    expect(resolveBattle(run, finished('ai')).endedBy).toBe('defeat');
  });
});

describe('the shrine cannot take a warrior who is not there', () => {
  it('never demands the life of someone away at penance', () => {
    const base = createRun(7, 'pandava');
    // Send most of the host to penance, leaving few to be asked for.
    const units = base.roster.slice(0, 8);
    const run: RunState = {
      ...base,
      away: units.map((warrior) => ({
        warrior,
        deityId: 'agni',
        astra: null,
        battles: 2,
        returnsAt: 3,
      })),
    };

    const gone = new Set(units);
    let sacrifices = 0;
    for (let seed = 0; seed < 60; seed++) {
      for (const offer of rollShrine({ ...run, seed, index: seed % 4 })) {
        if (offer.kind !== 'vardaan' || offer.shrap?.kind !== 'sacrifice') continue;
        sacrifices++;
        expect(gone.has(offer.shrap.warrior)).toBe(false);
      }
    }
    // The assertion above is only worth anything if sacrifices were offered.
    expect(sacrifices).toBeGreaterThan(0);
  });
});
