// The campaign you are in the middle of, so closing the tab does not end it.
//
// A run lived entirely in React state. Reloading the page, letting a phone
// sleep the tab, or a service-worker update all threw away a campaign that
// might have been ten battles deep, with no warning and nothing to recover.
// For a mode whose whole premise is "lose one battle and it is over", losing it
// to a refresh instead is the worst possible ending.
//
// This is deliberately the same shape as the rest of the game's storage: a
// single key, written on change, validated on the way back in. It is a
// stop-gap for one player on one device. Real accounts and a server belong with
// the multiplayer work, not here.
import type { RunState } from './types';

const KEY = 'kuru_run_v1';

/**
 * Bumped whenever RunState changes shape in a way that would make an old save
 * dangerous to resume. A stale run is dropped rather than migrated: a campaign
 * is short, and resuming into a half-understood state is worse than restarting.
 */
const VERSION = 1;

interface Envelope {
  v: number;
  run: RunState;
}

export function saveRun(run: RunState): void {
  try {
    // A finished run is not worth resuming; clear it so the menu is clean.
    if (run.phase === 'won' || run.phase === 'lost') {
      localStorage.removeItem(KEY);
      return;
    }
    localStorage.setItem(KEY, JSON.stringify({ v: VERSION, run } satisfies Envelope));
  } catch {
    // A full or blocked store must never take the battle down with it.
  }
}

export function clearRun(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing to do */
  }
}

/**
 * The run in progress, or null. Structurally checked, not trusted: this string
 * outlives the code that wrote it and a malformed one must not crash the menu.
 */
export function loadRun(): RunState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const env = JSON.parse(raw) as Partial<Envelope>;
    if (env?.v !== VERSION || !env.run) return null;

    const r = env.run;
    const ok =
      typeof r.seed === 'number' &&
      typeof r.house === 'string' &&
      Array.isArray(r.roster) &&
      r.roster.length > 0 &&
      Array.isArray(r.ladder) &&
      r.ladder.length > 0 &&
      typeof r.index === 'number' &&
      r.index >= 0 &&
      r.index <= r.ladder.length &&
      (r.phase === 'map' || r.phase === 'reward' || r.phase === 'shrine');
    return ok ? r : null;
  } catch {
    return null;
  }
}
