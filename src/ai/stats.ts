// Statistics for the balance lab. Without these every number in a balance
// report is a guess: a card at 56% over 40 games and a card at 56% over 4000
// look identical on the page and mean completely different things.
//
// This exists because of a measured mistake. An A/B harness run during AI work
// showed 48.5% when playing an AI against an IDENTICAL copy of itself, so
// anything inside roughly a point and a half of even was noise. Chasing those
// gaps wastes hours.

/**
 * Wilson score interval for a proportion. Preferred over the textbook normal
 * approximation because it stays sane at small samples and near 0 or 1, which
 * is exactly where card-level data lives (a card played 30 times).
 */
export function wilson(successes: number, n: number, z = 1.96): [number, number] {
  if (n <= 0) return [0, 1];
  const p = successes / n;
  const denom = 1 + (z * z) / n;
  const centre = p + (z * z) / (2 * n);
  const spread = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
  return [Math.max(0, (centre - spread) / denom), Math.min(1, (centre + spread) / denom)];
}

/** Half-width of the interval: the "plus or minus" a report should print. */
export function marginOfError(successes: number, n: number, z = 1.96): number {
  const [lo, hi] = wilson(successes, n, z);
  return (hi - lo) / 2;
}

/**
 * Is this proportion meaningfully different from `expected`? True only when the
 * whole confidence interval sits to one side, so a verdict is never issued on
 * a sample too small to support it.
 */
export function differsFrom(successes: number, n: number, expected: number, z = 1.96): boolean {
  const [lo, hi] = wilson(successes, n, z);
  return lo > expected || hi < expected;
}

/** How many games are needed to resolve a gap of `delta` around a 50% rate. */
export function samplesNeeded(delta: number, z = 1.96): number {
  if (delta <= 0) return Infinity;
  return Math.ceil((z * z * 0.25) / (delta * delta));
}

export interface Rate {
  wins: number;
  n: number;
  rate: number;
  lo: number;
  hi: number;
  moe: number;
}

export function rate(wins: number, n: number): Rate {
  const [lo, hi] = wilson(wins, n);
  return { wins, n, rate: n ? wins / n : 0, lo, hi, moe: (hi - lo) / 2 };
}
