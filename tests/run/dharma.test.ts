// Adharma has a clock, and it is counted in battles.
//
// A curse used to be a bare label with no duration. It lasted the battle it was
// earned in, exactly one battle carried forward, and then it was gone: the
// price of loosing a world-ending weapon was one bad afternoon. Nothing in the
// game could express "and this follows you".
import { describe, expect, it } from 'vitest';
import {
  CURSE_BATTLES,
  PASHUPATA_BATTLES,
  activeCurses,
  battlesLeftText,
  bind,
  curseBattlesFor,
  serveOneBattle,
} from '@run/dharma';
import { createRun, planBattle, resolveBattle } from '@run/run';
import { getCard } from '@content/cards';
import type { GameState } from '@engine/types';
import type { RunState } from '@run/types';

/** A won battle whose log contains the given afflictions. */
const wonWith = (afflictions: Array<{ curse: string; by?: string }>): GameState =>
  ({
    winner: 'player',
    bannedThisRun: [],
    suspendedThisRun: [],
    curses: { player: afflictions.map((a) => a.curse), ai: [] },
    log: afflictions.map((a) => ({
      t: 'afflict',
      seat: 'player',
      curse: a.curse,
      name: a.curse,
      text: '',
      by: a.by,
    })),
  }) as unknown as GameState;

describe('what each act of adharma costs', () => {
  it('prices a weapon by its tier', () => {
    expect(curseBattlesFor('brahmastra', 2)).toBe(CURSE_BATTLES[2]);
    expect(curseBattlesFor('brahmashirsha', 3)).toBe(CURSE_BATTLES[3]);
  });

  it('marks the Pashupata longest of all, because it simply wins', () => {
    expect(curseBattlesFor('pashupatastra', 3)).toBe(PASHUPATA_BATTLES);
    expect(PASHUPATA_BATTLES).toBeGreaterThan(CURSE_BATTLES[3]);
  });

  it('charges nothing for an elemental weapon', () => {
    expect(curseBattlesFor('agneyastra', 1)).toBe(0);
  });

  it('the prices are far enough apart to be felt as different decisions', () => {
    expect(CURSE_BATTLES[3]).toBeGreaterThanOrEqual(CURSE_BATTLES[2] * 2);
  });
});

describe('the clock', () => {
  it('binds a curse for the stated number of battles', () => {
    expect(bind({}, 'scorched_earth', 5)).toEqual({ scorched_earth: 5 });
  });

  it('takes the longer sentence rather than adding them', () => {
    // Firing two Brahma-Astras is not one enormous sin, and stacking would
    // spiral a run into an unrecoverable state for the same mistake twice.
    const once = bind({}, 'scorched_earth', 5);
    expect(bind(once, 'scorched_earth', 5)).toEqual({ scorched_earth: 5 });
    expect(bind(once, 'scorched_earth', 10)).toEqual({ scorched_earth: 10 });
    expect(bind({ scorched_earth: 10 }, 'scorched_earth', 5)).toEqual({ scorched_earth: 10 });
  });

  it('counts down one battle at a time and lifts at zero', () => {
    let clock = bind({}, 'scorched_earth', 2);
    clock = serveOneBattle(clock);
    expect(clock).toEqual({ scorched_earth: 1 });
    clock = serveOneBattle(clock);
    expect(clock).toEqual({});
    expect(activeCurses(clock)).toEqual([]);
  });

  it('reports what is still in force', () => {
    expect(activeCurses({ scorched_earth: 3, withered_host: 1 }).sort()).toEqual([
      'scorched_earth',
      'withered_host',
    ]);
  });

  it('says how long is left in words a player can read', () => {
    expect(battlesLeftText(1)).toBe('one more battle');
    expect(battlesLeftText(4)).toBe('4 more battles');
  });
});

describe('a curse survives the battle that earned it', () => {
  const run = (): RunState => createRun(11, 'pandava');

  it('a great weapon marks you for battles, not for one afternoon', () => {
    const after = resolveBattle(run(), wonWith([{ curse: 'scorched_earth', by: 'brahmastra' }]));
    // Bound for its tier's price, minus the battle just fought.
    expect(after.curseClock?.scorched_earth).toBe(CURSE_BATTLES[2] - 1);
  });

  it('the Pashupata marks you longest', () => {
    const after = resolveBattle(run(), wonWith([{ curse: 'scorched_earth', by: 'pashupatastra' }]));
    expect(after.curseClock?.scorched_earth).toBe(PASHUPATA_BATTLES - 1);
  });

  it('and every battle fought serves a battle of it', () => {
    let r = resolveBattle(run(), wonWith([{ curse: 'scorched_earth', by: 'brahmashirsha' }]));
    const first = r.curseClock!.scorched_earth;
    r = resolveBattle(r, wonWith([]));
    expect(r.curseClock!.scorched_earth).toBe(first - 1);
  });

  it('the next battle is actually fought under it', () => {
    const after = resolveBattle(run(), wonWith([{ curse: 'scorched_earth', by: 'brahmashirsha' }]));
    expect(planBattle(after).init.playerCurses).toContain('scorched_earth');
  });

  it('and it is gone once the sentence is served', () => {
    let r = resolveBattle(run(), wonWith([{ curse: 'scorched_earth', by: 'brahmastra' }]));
    // Serve the remaining battles. The ladder is only six rungs, and winning
    // them all ends the run, so the clock is advanced directly rather than by
    // marching off the end of the map.
    for (let i = 0; i < CURSE_BATTLES[2]; i++) {
      r = { ...r, curseClock: serveOneBattle(r.curseClock ?? {}) };
    }
    expect(r.curseClock?.scorched_earth).toBeUndefined();
    expect(activeCurses(r.curseClock ?? {})).not.toContain('scorched_earth');
  });

  it('a curse with no weapon behind it keeps the old one-battle carry', () => {
    // A shrine's bound shrap is a price paid once, not a mark on your record.
    const after = resolveBattle(run(), wonWith([{ curse: 'scorched_earth' }]));
    expect(after.curseClock?.scorched_earth).toBeUndefined();
    expect(after.pendingCurses).toContain('scorched_earth');
  });
});

describe('the weapons that carry a price actually exist at those tiers', () => {
  it('so the table is not pricing something imaginary', () => {
    expect(getCard('brahmastra').astraTier).toBe(2);
    expect(getCard('brahmashirsha').astraTier).toBe(3);
    expect(getCard('pashupatastra').astraTier).toBe(3);
  });
});
