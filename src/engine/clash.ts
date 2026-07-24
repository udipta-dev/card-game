// When two great weapons meet in the air. Vyasa and Narada stepped between
// Arjuna and Ashwatthama for exactly this reason: the meeting of two
// Brahmashirshas would have scoured the world. The canon detail that makes
// this a mechanic rather than a cancellation is that Arjuna knew how to
// withdraw his weapon and Ashwatthama did not, and so only one of them paid.
import { getCard } from '@content/cards';
import { afflict } from './curses';
import { opponentOf, unitsOf } from './queries';
import type { Card, CurseId, GameState, Seat } from './types';

/** The curses an act of adharma can draw. */
export const ADHARMA_CURSES: CurseId[] = [
  'scorched_earth',
  'broken_bowstring',
  'withered_host',
  'shivas_gaze',
  'forgotten_mantra',
];

/**
 * The highest astra training a seat currently fields. A warrior who bears a
 * named ultimate counts as fully trained: he was taught by the god himself.
 */
export function fieldedMastery(state: GameState, seat: Seat): number {
  let best = 0;
  for (const u of unitsOf(state, seat)) {
    const c = getCard(u.cardId);
    best = Math.max(best, c.astraMastery ?? 0, c.knownAstras?.length ? 3 : 0);
  }
  return best;
}

/**
 * Two astras meet. If both are Brahma-line or greater, the blast scours both
 * hosts, and whichever side never learned the withdrawal takes a curse for it.
 * Elemental weapons answering each other stay a clean cancellation.
 */
export function resolveClash(
  state: GameState,
  firer: Seat,
  astra: Card,
  counter: Card,
): void {
  const tierFired = astra.astraTier ?? 1;
  const tierAnswer = counter.astraTier ?? 1;
  if (tierFired < 2 || tierAnswer < 2) return;

  const blast = Math.max(tierFired, tierAnswer) >= 3 ? 4 : 2;
  const defender = opponentOf(firer);
  for (const seat of [firer, defender] as Seat[]) {
    for (const u of unitsOf(state, seat)) {
      u.currentPower = Math.max(0, u.currentPower - blast);
    }
  }

  const masteryFirer = fieldedMastery(state, firer);
  const masteryDefender = fieldedMastery(state, defender);
  let unwithdrawn: Seat | null = null;
  if (masteryFirer < masteryDefender) unwithdrawn = firer;
  else if (masteryDefender < masteryFirer) unwithdrawn = defender;

  state.log.push({
    t: 'clash',
    astra: astra.id,
    against: counter.id,
    blast,
    unwithdrawn,
  });
  if (unwithdrawn) afflict(state, unwithdrawn, ADHARMA_CURSES);
}
