// Adharma has a clock.
//
// A curse used to be a bare label with no duration at all. It lasted the battle
// you earned it in, exactly one battle carried forward, and then it was gone.
// So the price of loosing a world-ending weapon was, in practice, one bad
// afternoon. Nothing in the game could express "and this follows you".
//
// Durations are counted in BATTLES, not rounds, for a reason worth writing
// down. A battle is at most three rounds and averages 2.5, so rounds are too
// fine a unit to reason about: "cursed for ten rounds" is arithmetic, "cursed
// for four battles" is a thing you can hold in your head and plan around. A
// battle is also the unit the player actually experiences as a chunk of play.
//
// This lives in the run layer rather than the engine on purpose. The engine
// knows about rounds and a single battle; only a run knows what "three battles
// from now" means. The engine stays a pure function of one battle, and each
// battle is simply handed the curses that are still live when it starts.
import type { House, CurseId } from '@engine/types';

/**
 * How many battles each act of adharma costs you.
 *
 * The scale is the weapon's tier, because that is already how the game rates
 * how terrible a thing is to do. The numbers are deliberately far apart: the
 * point is that reaching for the last weapon on the list should be a decision
 * you feel for the rest of the run, not a slightly worse turn.
 */
export const CURSE_BATTLES: Record<number, number> = {
  // A great weapon, the Brahma line. Common enough that every deck holds one.
  2: 5,
  // An ultimate. Brahmashirsha, Narayana, the carried spears.
  3: 10,
};

/**
 * The Pashupata is its own case. It does not damage or destroy: it simply ends
 * the battle in your favour, which is the most decisive thing any card can do,
 * so it carries the longest mark in the game.
 */
export const PASHUPATA_BATTLES = 15;

/**
 * An asura serves one battle longer for the same act, and it is his own fault.
 *
 * Ahankar. The word means the "I-maker": the sense of being a separate self that
 * takes credit for what it does. It is the flaw the whole asura tradition is
 * built on, and it is exactly why penance works so well for them and forgiveness
 * so badly. Hiranyakashipu, Ravana and Bali all won enormous boons by sitting
 * still, and every one of them lost everything the moment he decided the boon
 * was his by right.
 *
 * So the same weapon fired by the same hand costs an asura more, because he
 * cannot put down the part of himself that is proud of firing it.
 */
export const ASURA_SHRAP_PENALTY = 1;

export function curseBattlesFor(astraId: string, tier: number, house?: House): number {
  const base = astraId === 'pashupatastra' ? PASHUPATA_BATTLES : (CURSE_BATTLES[tier] ?? 0);
  if (base <= 0) return 0;
  return base + (house === 'asura' ? ASURA_SHRAP_PENALTY : 0);
}

/** A curse and how many battles of it are left to serve. */
export type CurseClock = Record<CurseId, number>;

/**
 * Lay a curse on the clock, or extend one already running.
 *
 * Taking the longer of the two rather than adding them: a player who fires two
 * Brahma-Astras has not committed one enormous sin, and stacking would spiral a
 * run into an unrecoverable state for a mistake made twice.
 */
export function bind(clock: CurseClock, curse: CurseId, battles: number): CurseClock {
  if (battles <= 0) return clock;
  return { ...clock, [curse]: Math.max(clock[curse] ?? 0, battles) };
}

/** Which curses are still in force, for seeding the next battle. */
export function activeCurses(clock: CurseClock): CurseId[] {
  return Object.entries(clock)
    .filter(([, left]) => left > 0)
    .map(([id]) => id);
}

/**
 * One battle has been fought. Everything on the clock serves a battle, and
 * anything that reaches zero is lifted.
 */
export function serveOneBattle(clock: CurseClock): CurseClock {
  const next: CurseClock = {};
  for (const [id, left] of Object.entries(clock)) {
    if (left > 1) next[id] = left - 1;
  }
  return next;
}

/** Plain words for the player: how much longer this hangs over them. */
export function battlesLeftText(left: number): string {
  if (left <= 0) return 'lifting now';
  if (left === 1) return 'one more battle';
  return `${left} more battles`;
}
