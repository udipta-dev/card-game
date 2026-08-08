// The difficulty ladder, as rules rather than as win rates.
//
// The STRENGTH claims are measured in sim/ladder-ai.ts, because strength is a
// statistical question and a unit test cannot answer one. What is checked here
// is everything that must be true before those numbers mean anything: that the
// rungs are monotone, that the opponent never outspends the player, and that
// the top of the ladder is exactly the game that shipped before it existed.
import { describe, expect, it } from 'vitest';
import { limitsFor, skillFor } from '@ai/difficulty';
import { MAX_LEVEL, MIN_LEVEL, budgetAt, capAt } from '@run/ladder';
import { DECK_BUDGET, DECKS } from '@content/decks';
import { autoMuster, musterProvisions, poolFor } from '@content/muster';
import { buildLadder } from '@run/encounters';
import { getCard, provisionOf } from '@content/cards';
import type { House } from '@engine/types';

const HOUSES: House[] = ['pandava', 'kaurava', 'asura'];

describe('the opponent gets better as you climb', () => {
  it('never takes a skill away as the level rises', () => {
    // Monotone, which is the one property a difficulty curve cannot do without.
    // Both dials only ever switch on.
    let seen = skillFor(MIN_LEVEL);
    for (let l = MIN_LEVEL; l <= MAX_LEVEL; l++) {
      const now = skillFor(l);
      expect(Number(now.mulligan)).toBeGreaterThanOrEqual(Number(seen.mulligan));
      expect(Number(now.roundSwap)).toBeGreaterThanOrEqual(Number(seen.roundSwap));
      seen = now;
    }
  });

  it('starts unable to manage its hand and ends able to do both', () => {
    expect(skillFor(1)).toEqual({ mulligan: false, roundSwap: false });
    expect(skillFor(MAX_LEVEL)).toEqual({ mulligan: true, roundSwap: true });
  });

  it('gives all three rungs a distinct brain', () => {
    // Two rungs that behave identically are one rung wearing two labels, which
    // is exactly what the first cut of this shipped: worlds 1 against worlds 2
    // measured 63.6% and 64.7% against the top brain, indistinguishable.
    const brains = [skillFor(5), skillFor(20), skillFor(45)].map((s) => JSON.stringify(s));
    expect(new Set(brains).size).toBe(3);
  });
});

describe('the opponent is built to your level', () => {
  it('never outspends the player, at any level', () => {
    // The player musters at a fixed 170 until the level-dependent budget is
    // built for BOTH sides. An opponent above that is not difficulty.
    for (let l = MIN_LEVEL; l <= MAX_LEVEL; l++) {
      expect(limitsFor(l).budget!).toBeLessThanOrEqual(DECK_BUDGET);
    }
  });

  it('tracks the published table wherever the table is under the clamp', () => {
    // The clamp bites from level 26 up, where budgetAt first crosses 170. Below
    // that the opponent's economy IS the published table, and that is the range
    // a climbing player spends most of their time in.
    for (let l = MIN_LEVEL; l <= MAX_LEVEL; l++) {
      expect(limitsFor(l).budget).toBe(Math.min(budgetAt(l), DECK_BUDGET));
      expect(limitsFor(l).cap).toBe(capAt(l));
    }
    for (const l of [1, 10, 20, 25]) expect(limitsFor(l).budget).toBe(budgetAt(l));
    expect(budgetAt(25)).toBeLessThanOrEqual(DECK_BUDGET);
    expect(budgetAt(26)).toBeGreaterThan(DECK_BUDGET);
  });

  it('holds the opponent to the same ceiling the player sees', () => {
    for (let l = MIN_LEVEL; l <= MAX_LEVEL; l++) {
      expect(limitsFor(l).cap).toBe(capAt(l));
    }
  });

  it.each(HOUSES)('%s: builds an army inside the level ceiling', (house) => {
    const pool = poolFor(house).map((c) => c.id);
    for (const level of [1, 8, 20, 40]) {
      const limits = limitsFor(level);
      const army = autoMuster(pool, undefined, limits);
      expect(army.length).toBeGreaterThan(0);
      expect(musterProvisions(army)).toBeLessThanOrEqual(limits.budget!);
      for (const id of army) expect(provisionOf(getCard(id))).toBeLessThanOrEqual(limits.cap!);
    }
  });

  it.each(HOUSES)('%s: fields smaller men early than late', (house) => {
    const pool = poolFor(house).map((c) => c.id);
    const biggest = (level: number) =>
      Math.max(...autoMuster(pool, undefined, limitsFor(level)).map((id) => provisionOf(getCard(id))));
    expect(biggest(1)).toBeLessThan(biggest(20));
    expect(biggest(20)).toBeLessThanOrEqual(biggest(45));
  });
});

describe('the top of the ladder is the game that already shipped', () => {
  it.each(HOUSES)('%s: the level-50 encounter army is the curated one', (house) => {
    // The point of building the opponent from the CURATED army rather than from
    // scratch: at the top, nothing is taken away and nothing is added, so the
    // late ladder is not quietly easier than the campaign was.
    const top = buildLadder(1234, house, MAX_LEVEL);
    const bottom = buildLadder(1234, house, 1);
    for (let i = 0; i < top.length; i++) {
      const curated = DECKS[`${top[i].house}_starter`];
      // The last two rungs drop nothing, so they are the whole army.
      if (i >= top.length - 2) {
        expect([...top[i].deckCards].sort()).toEqual([...curated.cards].sort());
      }
      // And every level-1 opponent is inside the level-1 ceiling.
      for (const id of bottom[i].deckCards) {
        expect(provisionOf(getCard(id))).toBeLessThanOrEqual(capAt(1));
      }
    }
  });

  it('leaves an old save facing the opponents it was started against', () => {
    // buildLadder defaults to the top rung precisely so a run saved before the
    // ladder existed does not silently become a different campaign on reload.
    expect(buildLadder(99, 'pandava')).toEqual(buildLadder(99, 'pandava', MAX_LEVEL));
  });
});
