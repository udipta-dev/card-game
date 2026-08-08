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

export const STEPS: Step[] = [
  { level: 1, cap: 7, headline: 'shakuni' },
  { level: 5, cap: 8, headline: 'nakula' },
  { level: 10, cap: 9, headline: 'ghatotkacha' },
  { level: 15, cap: 10, headline: 'ashwatthama' },
  { level: 20, cap: 11, headline: 'bhima' },
  { level: 26, cap: 12, headline: 'karna' },
  { level: 32, cap: 13, headline: 'bhishma' },
  { level: 38, cap: 14, headline: 'vasavi_shakti' },
  { level: 42, cap: 15, headline: 'narayanastra' },
  { level: 46, cap: 16, headline: 'brahmashirsha' },
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
}

export function unlockSchedule(pool: readonly CardId[]): Unlock[] {
  const out: Unlock[] = [];
  let previousCap = 0;
  for (const step of STEPS) {
    const cards = pool
      .filter((id) => provisionOf(id) > previousCap && provisionOf(id) <= step.cap)
      .sort((a, b) => provisionOf(b) - provisionOf(a) || getCard(a).name.localeCompare(getCard(b).name));
    out.push({ step, cards });
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
