// How well the opponent plays, and what it is allowed to bring, at each rung.
//
// A ladder to fifty is only worth climbing if the enemy at forty plays
// differently from the enemy at four. Two dials, and they are not equal:
//
//   1. ITS ARMY IS BUILT TO YOUR LEVEL. This is most of the curve and costs
//      nothing to maintain: at level 3 it fields seven-cost warriors because
//      that is all it can afford, exactly like you. No hand-written ladder of
//      decks to keep in step with the card set every time a price changes.
//
//   2. HOW WELL IT MANAGES ITS HAND. Whether it mulligans, and whether it
//      trades its worst card at the top of a round.
//
// EVERY DIAL HERE WAS MEASURED, and two candidates were thrown out for failing.
// 400 games per pair, identical armies, seats alternated, so the only thing
// varying is the dial. Right-hand side wins:
//
//   worlds 1 vs worlds 4, neither trades    48.3% +-5.0     no effect
//   worlds 2 vs worlds 4, both trade        50.6% +-5.0     no effect
//   keeps its hand vs mulligans             56.4% +-4.9     real
//   no trade vs trade (worlds 1)            63.6% +-4.8     real
//   no trade vs trade (worlds 4)            63.4% +-4.8     real
//   nothing vs mulligan and trade           71.2% +-4.5     real
//
// So DETERMINIZATION WIDTH IS NOT A DIFFICULTY DIAL, which is the opposite of
// what docs/ladder.md assumed when it put "worlds 1 / 2 / 4" in the table. Four
// worlds earns its keep on one specific decision (whether to fire an astra into
// a possible counter) and that decision is rare enough not to move a win rate.
// A step nobody can feel is not a step, so it is gone rather than shipped as
// decoration. Lookahead went the same way and for the same reason: measured at
// 51.2% over 2000 games, CI 49.0 to 53.4.
//
// What is left is honest, and it is the same shape as a human getting better:
// the beginner keeps a bad hand and plays it out, the middle player throws his
// worst cards away, and the top player does both. Re-measure with
// `npm run ladder-ai`.
import { budgetAt, capAt } from '@run/ladder';
import { DECK_BUDGET } from '@content/decks';
import type { Limits } from '@content/muster';

export interface Skill {
  /** Does it throw its worst cards back at the deal? */
  mulligan: boolean;
  /** May it throw its worst card at the top of a round? */
  roundSwap: boolean;
}

const RUNGS: { upTo: number; skill: Skill }[] = [
  { upTo: 10, skill: { mulligan: false, roundSwap: false } },
  { upTo: 30, skill: { mulligan: true, roundSwap: false } },
  { upTo: Infinity, skill: { mulligan: true, roundSwap: true } },
];

export function skillFor(level: number): Skill {
  return RUNGS.find((r) => level <= r.upTo)!.skill;
}

/**
 * What the opponent may spend and how big a card it may field.
 *
 * The same table the player will eventually be held to, from @run/ladder, with
 * ONE CLAMP: it may never outspend the player's fixed 170.
 *
 * The clamp is temporary and it is here rather than hidden at a call site so it
 * cannot be forgotten. The ladder budget runs 120 to 220 because the design
 * makes the PLAYER's budget level-dependent too, at which point the two sides
 * meet at every rung and the clamp comes out. That half is not built yet, on
 * purpose: docs/ladder.md open question 3 says level 1 at cap 7 is a genuinely
 * different game that nobody has played and needs a session in the lab first.
 *
 * Until then the player musters at 170 at every level, so an unclamped level-40
 * opponent would field a 200-provision army against a 170-provision one and
 * call it difficulty. Below level 36 the table is under 170 anyway and the
 * clamp does nothing, which is the whole range a climbing player is in.
 */
export function limitsFor(level: number): Limits {
  return { budget: Math.min(budgetAt(level), DECK_BUDGET), cap: capAt(level) };
}
