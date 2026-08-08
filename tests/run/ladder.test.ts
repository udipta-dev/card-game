// The ladder's numbers, and the one rule that matters most.
//
// A demotion costs BUDGET, never a card. Rank moves both ways and drives what
// you can field; the high-water mark only ratchets and drives what you own. Get
// that backwards and losing twice deletes Karna from a player's collection,
// which is the difference between a ladder people climb and one they quit.
import { describe, expect, it } from 'vitest';
import {
  MAX_LEVEL,
  MIN_LEVEL,
  NEW_STANDING,
  STEPS,
  afterAttempt,
  affordable,
  budgetAt,
  capAt,
  nextStep,
  stepAt,
  unlockSchedule,
} from '@run/ladder';
import { poolFor } from '@content/muster';
import { getCard } from '@content/cards';
import { DECK_BUDGET } from '@content/decks';

describe('a loss costs budget, never a card', () => {
  it('demotion lowers the level', () => {
    expect(afterAttempt({ level: 20, highWater: 20 }, false).level).toBe(19);
  });

  it('but never the high-water mark, so nothing owned is taken away', () => {
    const after = afterAttempt({ level: 20, highWater: 20 }, false);
    expect(after.highWater).toBe(20);
    expect(capAt(after.highWater)).toBe(capAt(20));
  });

  it('so a demoted player still owns the card they unlocked', () => {
    // The whole point. At 26 you can afford Karna; lose a level and you still
    // can, you simply have less budget to fit him into.
    const after = afterAttempt({ level: 26, highWater: 26 }, false);
    expect(affordable('karna', after.highWater)).toBe(true);
    expect(budgetAt(after.level)).toBeLessThan(budgetAt(26));
  });

  it('and level 1 is a floor, not a cliff', () => {
    expect(afterAttempt(NEW_STANDING, false).level).toBe(MIN_LEVEL);
  });

  it('the top is a ceiling too', () => {
    expect(afterAttempt({ level: MAX_LEVEL, highWater: MAX_LEVEL }, true).level).toBe(MAX_LEVEL);
  });
});

describe('the two currencies', () => {
  it('budget runs 120 to 220 across the fifty', () => {
    expect(budgetAt(1)).toBe(120);
    expect(budgetAt(MAX_LEVEL)).toBe(220);
  });

  it('and rises every level, so no step ever feels empty', () => {
    for (let l = 2; l <= MAX_LEVEL; l++) expect(budgetAt(l)).toBeGreaterThanOrEqual(budgetAt(l - 1));
  });

  it('the cap only ever rises', () => {
    for (let l = 2; l <= MAX_LEVEL; l++) expect(capAt(l)).toBeGreaterThanOrEqual(capAt(l - 1));
  });

  it('level 26 lands on the game as it is played today', () => {
    // The starter armies spend about 170 of a 170 budget at a cap of 12, so
    // everything below 26 is new territory and everything above is the part
    // that never had cards big enough to need it.
    expect(capAt(26)).toBe(12);
    expect(Math.abs(budgetAt(26) - DECK_BUDGET)).toBeLessThanOrEqual(2);
  });
});

describe('what walks through the door', () => {
  it('every step names a card that actually exists', () => {
    for (const s of STEPS) expect(() => getCard(s.headline)).not.toThrow();
  });

  it('and that card is affordable exactly at its own step, not before', () => {
    // A step whose headline was already affordable is a ceremony for nothing.
    for (const s of STEPS) {
      expect(affordable(s.headline, s.level), `${s.headline} at ${s.level}`).toBe(true);
      if (s.level > MIN_LEVEL) {
        expect(affordable(s.headline, s.level - 1), `${s.headline} before ${s.level}`).toBe(false);
      }
    }
  });

  it('the schedule is derived from card costs, so nothing goes stale', () => {
    const pool = poolFor('kaurava').map((c) => c.id);
    const schedule = unlockSchedule(pool);
    // Every card in the pool appears exactly once, or it can never be unlocked.
    const listed = schedule.flatMap((u) => u.cards);
    const affordableEver = pool.filter((id) => affordable(id, MAX_LEVEL));
    expect(new Set(listed).size).toBe(listed.length);
    expect(listed.length).toBe(affordableEver.length);
  });

  it('and the Pashupata is the last thing you earn', () => {
    expect(STEPS[STEPS.length - 1].headline).toBe('pashupatastra');
    expect(STEPS[STEPS.length - 1].level).toBe(MAX_LEVEL);
  });
});

describe('where you stand', () => {
  it('names the step you are on, not the one you are heading for', () => {
    expect(stepAt(7).level).toBe(5);
    expect(stepAt(5).level).toBe(5);
  });

  it('and the next one, until there is no next one', () => {
    expect(nextStep(1)?.level).toBe(5);
    expect(nextStep(MAX_LEVEL)).toBeUndefined();
  });
});
