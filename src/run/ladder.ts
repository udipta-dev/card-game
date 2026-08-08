// The ladder: fifty levels, two currencies, and one rule about what a loss costs.
//
// The shape was settled in conversation and the numbers approved in
// docs/ladder.md. This is that document made executable, and the doc stays the
// place to argue with the numbers.
//
// TWO NUMBERS ARE TRACKED, NOT ONE, and the whole design rests on the
// difference between them:
//
//   rank             moves both ways. Win a level and it rises, lose and it
//                    falls. It drives your total budget, matchmaking, and the
//                    leaderboard when there is one.
//   high-water mark  the best rank you have ever held. It never falls. It
//                    drives your per-card cap, and therefore what you OWN.
//
// So a demotion costs you budget and never a card. You field a leaner army for
// a while; you do not watch Karna disappear from your collection because you
// lost twice. That is the difference between a ladder people climb and a ladder
// people quit.
import { getCard } from '@content/cards';
import type { CardId } from '@engine/types';

export const MAX_LEVEL = 50;

/** The lowest a demotion can take you. Level 1 is the floor, not zero. */
export const MIN_LEVEL = 1;

/**
 * The per-card cap at each step, and the name that arrives with it.
 *
 * The cap is the real gate, and it is worn as an economy rather than as a rule:
 * the game never says "you may not have Karna", it says you cannot afford a card
 * that big yet. Same outcome, completely different feeling.
 *
 * Steps are where the card costs actually cluster, measured from the live set,
 * so every one of them opens a real band rather than a number nobody notices.
 * Eleven bands means ten ceremonies across fifty levels, about one every five,
 * which is often enough to keep the next one visible and rare enough that it
 * still lands.
 */
export interface Step {
  level: number;
  cap: number;
  /** The card the step is remembered by. One name, never a list. */
  headline: CardId;
}

/**
 * RETIMED AGAINST THE ACTUAL CARD SET, which the first cut of this table was not.
 *
 * The costs are not spread evenly and never were. Of 129 cards, 120 cost twelve
 * or less:
 *
 *   cost   4   5   6    7    8    9   10   11   12   13   14   15   16   18
 *   cards  4   6   5   24   27   20   17   10    7    3    3    1    1    1
 *
 * The old schedule reached cap 12 at level 26, which spent the first half of the
 * ladder on 120 cards and the second half on nine. Everything a player could
 * actually be given had been given by the halfway point, and levels 26 to 50
 * handed out one neutral astra every few rungs. Worse per house: past level 26 no
 * army gained a single card of its OWN, because the only house cards above twelve
 * are Bhishma and Bali.
 *
 * The bands now climb through the dense range across two thirds of the ladder and
 * leave the last stretch to the world-enders, one at a time, which is the right
 * shape for a top end: rare, named, and worth the climb.
 *
 * The nine cards above twelve are still nine cards. Retiming is worth doing and
 * is not a substitute for content at the top; see docs/ladder.md.
 */
export const STEPS: Step[] = [
  { level: 1, cap: 7, headline: 'shakuni' },
  { level: 6, cap: 8, headline: 'nakula' },
  { level: 12, cap: 9, headline: 'ghatotkacha' },
  { level: 19, cap: 10, headline: 'ashwatthama' },
  { level: 26, cap: 11, headline: 'bhima' },
  { level: 33, cap: 12, headline: 'karna' },
  { level: 38, cap: 13, headline: 'bhishma' },
  { level: 42, cap: 14, headline: 'vasavi_shakti' },
  { level: 45, cap: 15, headline: 'narayanastra' },
  { level: 47, cap: 16, headline: 'brahmashirsha' },
  { level: 50, cap: 18, headline: 'pashupatastra' },
];

/**
 * Total budget at a level, straight-lined from 120 to 220 across the fifty.
 *
 * Linear on purpose. The cap steps in jumps because card costs cluster in bands;
 * the budget should not, or a player would feel two separate ceremonies at every
 * step and neither would mean anything.
 */
export function budgetAt(level: number): number {
  const l = Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, level));
  return 120 + Math.round(((l - 1) * 100) / (MAX_LEVEL - 1));
}

/** The most any single card may cost, at a given high-water mark. */
export function capAt(highWater: number): number {
  const l = Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, highWater));
  let cap = STEPS[0].cap;
  for (const s of STEPS) if (l >= s.level) cap = s.cap;
  return cap;
}

/** The step a level belongs to, for showing where you stand. */
export function stepAt(level: number): Step {
  let step = STEPS[0];
  for (const s of STEPS) if (level >= s.level) step = s;
  return step;
}

/** The next step up, or undefined at the top of the ladder. */
export function nextStep(level: number): Step | undefined {
  return STEPS.find((s) => s.level > level);
}

const provisionOf = (id: CardId) => getCard(id).provision ?? getCard(id).basePower + 2;

/** Can this card be afforded at this high-water mark? */
export function affordable(id: CardId, highWater: number): boolean {
  return provisionOf(id) <= capAt(highWater);
}

/**
 * Everything the ladder ever unlocks, in the order it arrives.
 *
 * Derived from the card costs rather than hand-listed, so a card whose price
 * changes moves to the right step by itself. A hand-written unlock table is a
 * second source of truth that goes stale the first time anyone rebalances.
 */
export interface Unlock {
  step: Step;
  cards: CardId[];
  /**
   * The card this step is remembered by, FROM THIS ARMY.
   *
   * Not `step.headline`, and the difference was a real bug on screen. The
   * headline in the table is one canonical name per band, and a band is a price
   * band across the whole game: Karna heads the 12s, and a Pandava player was
   * shown "Level 26 · Karna" above a list that could never contain him, because
   * Karna is a Kaurava. The step is named after the biggest card YOU actually
   * gain there, and falls back to the canonical name only when you gain none.
   */
  headline: CardId;
}

export function unlockSchedule(pool: readonly CardId[]): Unlock[] {
  const out: Unlock[] = [];
  let previousCap = 0;
  for (const step of STEPS) {
    const cards = pool
      .filter((id) => provisionOf(id) > previousCap && provisionOf(id) <= step.cap)
      .sort((a, b) => provisionOf(b) - provisionOf(a) || getCard(a).name.localeCompare(getCard(b).name));
    out.push({ step, cards, headline: cards[0] ?? step.headline });
    previousCap = step.cap;
  }
  return out;
}

/**
 * What a level attempt does to your standing.
 *
 * Win and you rise, lose and you fall, and the high-water mark only ever
 * ratchets. Clamped at both ends: level 1 is a floor rather than a cliff, so a
 * new player losing their first three attempts is not sent below the start.
 */
export interface Standing {
  level: number;
  highWater: number;
}

export function afterAttempt(standing: Standing, won: boolean): Standing {
  const level = Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, standing.level + (won ? 1 : -1)));
  return { level, highWater: Math.max(standing.highWater, level) };
}

/** A fresh career, before anyone has climbed anything. */
export const NEW_STANDING: Standing = { level: MIN_LEVEL, highWater: MIN_LEVEL };
