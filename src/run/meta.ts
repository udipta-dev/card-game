// Cross-run progress: what survives losing. This is the ONLY part of the run
// layer that touches storage, kept thin and separate from the pure engine so
// the reducer stays testable. All reads and writes tolerate a missing or
// corrupt store (private browsing, cleared data) without throwing.

const KEY = 'kurukshetra.meta.v1';

export interface RunMeta {
  runsStarted: number;
  runsWon: number;
  bestDepth: number;
}

const EMPTY: RunMeta = { runsStarted: 0, runsWon: 0, bestDepth: 0 };

export function loadMeta(): RunMeta {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<RunMeta>;
    return {
      runsStarted: parsed.runsStarted ?? 0,
      runsWon: parsed.runsWon ?? 0,
      bestDepth: parsed.bestDepth ?? 0,
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
  });
}
