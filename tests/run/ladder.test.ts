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
import { allCards, provisionOf } from '@content/cards';
import type { House } from '@engine/types';
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
    // The whole point. At the step that first affords Karna you can field him;
    // lose a level and you still can, you simply have less budget to fit him in.
    //
    // Derived from STEPS rather than written as a number, because the bands were
    // retimed once already and a hard-coded 26 made a deliberate change look
    // like a regression.
    const karnaStep = STEPS.find((st) => st.cap >= provisionOf(getCard('karna')))!;
    const after = afterAttempt({ level: karnaStep.level, highWater: karnaStep.level }, false);
    expect(affordable('karna', after.highWater)).toBe(true);
    expect(budgetAt(after.level)).toBeLessThan(budgetAt(karnaStep.level));
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

  it('passes through the game as it is played today, somewhere in the middle', () => {
    // The starter armies spend about 170 of a 170 budget at a cap of 12. That
    // point should sit inside the ladder rather than at either end: below it is
    // new territory, above it is the part that never had cards big enough to
    // need it. Retiming moved it from level 26 to 33, which is the change; what
    // must stay true is that it is passed through at all.
    const twelve = STEPS.find((st) => st.cap === 12)!;
    expect(capAt(twelve.level)).toBe(12);
    expect(twelve.level).toBeGreaterThan(MIN_LEVEL);
    expect(twelve.level).toBeLessThan(MAX_LEVEL);
    const nearest = [...Array(MAX_LEVEL)].map((_, i) => Math.abs(budgetAt(i + 1) - DECK_BUDGET));
    expect(Math.min(...nearest)).toBeLessThanOrEqual(2);
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
    const second = STEPS[1];
    expect(stepAt(second.level).level).toBe(second.level);
    expect(stepAt(second.level + 1).level).toBe(second.level);
    expect(stepAt(second.level - 1).level).toBe(STEPS[0].level);
  });

  it('and the next one, until there is no next one', () => {
    expect(nextStep(MIN_LEVEL)?.level).toBe(STEPS[1].level);
    expect(nextStep(MAX_LEVEL)).toBeUndefined();
  });
});

describe('the bands are timed against the card set that exists', () => {
  // The first cut of STEPS was spaced by eye and it put cap 12 at level 26, which
  // spent the first half of the ladder on 120 cards and the second half on nine.
  // These pin the shape so a future reprice cannot quietly undo it.
  const COSTS = allCards().map((c) => provisionOf(c));
  const countUpTo = (cap: number) => COSTS.filter((p) => p <= cap).length;

  it('climbs, and never twice at the same level', () => {
    for (let i = 1; i < STEPS.length; i++) {
      expect(STEPS[i].level).toBeGreaterThan(STEPS[i - 1].level);
      expect(STEPS[i].cap).toBeGreaterThan(STEPS[i - 1].cap);
    }
    expect(STEPS[0].level).toBe(MIN_LEVEL);
    expect(STEPS[STEPS.length - 1].level).toBe(MAX_LEVEL);
  });

  it('reaches the top of the real card set exactly at the top of the ladder', () => {
    // A ceiling above the most expensive card would mean the last rungs unlock
    // nothing at all; one below it would leave a card permanently unreachable.
    expect(STEPS[STEPS.length - 1].cap).toBe(Math.max(...COSTS));
  });

  it('spends two thirds of the ladder on the range the cards are actually in', () => {
    // 120 of 129 cards cost twelve or less. If the cap runs past twelve early,
    // everything a player can be given has been given by the halfway point.
    const twelve = STEPS.find((s) => s.cap === 12)!;
    expect(twelve.level).toBeGreaterThanOrEqual(30);
    expect(countUpTo(12) / COSTS.length).toBeGreaterThan(0.9);
  });

  it('opens something at every step, for every army', () => {
    for (const house of ['pandava', 'kaurava', 'asura'] as House[]) {
      const schedule = unlockSchedule(poolFor(house).map((c) => c.id));
      for (const { step, cards } of schedule) {
        expect(cards.length, `${house} gains nothing at level ${step.level}`).toBeGreaterThan(0);
      }
    }
  });

  it('names every step after a card that army actually gains', () => {
    // The bug this replaces: a Pandava player was shown "Level 26 · Karna" above
    // a list that could never contain a Kaurava.
    for (const house of ['pandava', 'kaurava', 'asura'] as House[]) {
      const pool = poolFor(house).map((c) => c.id);
      for (const { cards, headline } of unlockSchedule(pool)) {
        if (cards.length) expect(cards).toContain(headline);
      }
    }
  });

  it('leaves every card reachable by the top of the ladder', () => {
    const cap = capAt(MAX_LEVEL);
    for (const c of allCards()) expect(provisionOf(c)).toBeLessThanOrEqual(cap);
  });
});
