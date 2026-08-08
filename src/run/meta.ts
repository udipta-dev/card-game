// Cross-run progress: what survives losing. This is the ONLY part of the run
// layer that touches storage, kept thin and separate from the pure engine so
// the reducer stays testable. All reads and writes tolerate a missing or
// corrupt store (private browsing, cleared data) without throwing.

import { MAX_LEVEL, MIN_LEVEL, NEW_STANDING, afterAttempt } from './ladder';
import type { Standing } from './ladder';

const KEY = 'kurukshetra.meta.v1';

const clamp = (n: unknown): number =>
  typeof n === 'number' && Number.isFinite(n)
    ? Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(n)))
    : MIN_LEVEL;

export interface RunMeta {
  runsStarted: number;
  runsWon: number;
  bestDepth: number;
  /**
   * Where you stand on the fifty. A run IS a level attempt, so this moves once
   * per finished run, and the high-water mark inside it never falls: a demotion
   * costs budget and never a card.
   */
  standing: Standing;
}

const EMPTY: RunMeta = { runsStarted: 0, runsWon: 0, bestDepth: 0, standing: NEW_STANDING };

export function loadMeta(): RunMeta {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<RunMeta>;
    return {
      runsStarted: parsed.runsStarted ?? 0,
      runsWon: parsed.runsWon ?? 0,
      bestDepth: parsed.bestDepth ?? 0,
      // A player who was here before the ladder existed starts at the bottom
      // rather than crashing on a missing field. Clamped on the way in too,
      // because a hand-edited or half-written store must not be able to hand
      // capAt() a level outside the table.
      standing: {
        level: clamp(parsed.standing?.level),
        highWater: Math.max(clamp(parsed.standing?.level), clamp(parsed.standing?.highWater)),
      },
    };
  } catch {
    return { ...EMPTY };
  }
}

function save(meta: RunMeta): RunMeta {
  try {
    localStorage.setItem(KEY, JSON.stringify(meta));
  } catch {
    // Storage unavailable (private mode, quota). Progress just won't persist.
  }
  return meta;
}

export function recordRunStart(): RunMeta {
  const m = loadMeta();
  return save({ ...m, runsStarted: m.runsStarted + 1 });
}

/** Call when a run ends. `depth` is how many battles were won. */
export function recordRunEnd(won: boolean, depth: number): RunMeta {
  const m = loadMeta();
  return save({
    ...m,
    runsWon: m.runsWon + (won ? 1 : 0),
    bestDepth: Math.max(m.bestDepth, depth),
    // ONE RUN, ONE LEVEL ATTEMPT. Win it and you rise, lose it and you fall,
    // and what you have already unlocked stays unlocked either way.
    standing: afterAttempt(m.standing, won),
  });
}

/** Where the player stands, for anything that only wants to read it. */
export function currentStanding(): Standing {
  return loadMeta().standing;
}
