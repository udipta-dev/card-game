// The convenience button must not hand the player a worse army than the one
// they would have built by dragging cards themselves.
//
// It used to. Ranked by power per provision and stopped at MUSTER_MAX cards,
// which optimises card COUNT rather than budget: nineteen efficient cheap cards
// spend about 152 of 170, so it left 18 provisions on the table. Measured
// against the curated starters that army produced pandava 26.2%, where the
// curated one sits at 42.9%.
import { describe, expect, it } from 'vitest';
import { autoMuster, poolFor, checkMuster, MUSTER_MAX, MIN_WARRIORS, musterProvisions } from '@content/muster';
import { DECK_BUDGET, DECKS } from '@content/decks';
import { orphanWeapons } from '@content/arsenal';
import { getCard } from '@content/cards';

const HOUSES = ['pandava', 'kaurava', 'asura'] as const;

describe('the auto-muster builds something worth fielding', () => {
  it.each(HOUSES)('%s: it is legal', (house) => {
    const built = autoMuster(poolFor(house).map((c) => c.id));
    const check = checkMuster(built);
    expect(check.ok, check.problems.join('; ')).toBe(true);
  });

  it.each(HOUSES)('%s: it SPENDS the budget rather than leaving it on the table', (house) => {
    // The whole original bug. Anything under about 95% of the budget means the
    // player was handed provisions they never got to use.
    const built = autoMuster(poolFor(house).map((c) => c.id));
    expect(musterProvisions(built)).toBeGreaterThan(DECK_BUDGET * 0.95);
  });

  it.each(HOUSES)('%s: and still brings a full complement of cards', (house) => {
    // The other half of the trap, found by over-correcting into it: ranking by
    // raw worth takes the most expensive warriors first and runs out of budget
    // at fifteen cards, which loses harder than underspending did, because this
    // game is decided by card economy.
    //
    // Not pinned to MUSTER_MAX any more. It hands back a known-good army when
    // the pool can hold one, and the Asura starter is a deliberate 18: it lost
    // the Brahma-Astra, which cost every army in the game 7 to 9 points. A rule
    // demanding exactly 19 would forbid the better army.
    const built = autoMuster(poolFor(house).map((c) => c.id));
    expect(built.length).toBeGreaterThanOrEqual(MUSTER_MAX - 1);
    expect(built.length).toBeLessThanOrEqual(MUSTER_MAX);
  });

  it.each(HOUSES)('%s: hands back a known-good army rather than a guess', (house) => {
    // Three heuristics were measured and all three produced roughly the same
    // 42-point spread. Handing back the curated armies instead measures 3.0.
    const built = autoMuster(poolFor(house).map((c) => c.id));
    const starter = Object.values(DECKS).find((d) => d.house === house);
    expect(built).toEqual(starter?.cards);
  });

  it.each(HOUSES)('%s: enough warriors to hold a line', (house) => {
    const built = autoMuster(poolFor(house).map((c) => c.id));
    const units = built.filter((id) => getCard(id).type === 'unit').length;
    expect(units).toBeGreaterThanOrEqual(MIN_WARRIORS);
  });

  it.each(HOUSES)('%s: no weapon nobody in it can fire', (house) => {
    // 14 provisions of nothing, and the single most confusing thing the game can
    // hand you. The muster screen warns about it; the auto-build must not create
    // one in the first place.
    expect(orphanWeapons(autoMuster(poolFor(house).map((c) => c.id)))).toEqual([]);
  });

  it('is the same every time, so a player can rebuild what they had', () => {
    const a = autoMuster(poolFor('pandava').map((c) => c.id));
    const b = autoMuster(poolFor('pandava').map((c) => c.id));
    expect(a).toEqual(b);
  });

  it('copes with a pool the player has cut down by hand', () => {
    // The case sim/deck-search.ts cannot cover, and the reason this function
    // still exists at all.
    const small = poolFor('kaurava').map((c) => c.id).slice(0, 22);
    const built = autoMuster(small);
    expect(checkMuster(built).ok).toBe(true);
    expect(built.every((id) => small.includes(id))).toBe(true);
  });
});
