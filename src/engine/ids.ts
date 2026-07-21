// Seedable PRNG + instance id generation. Keeping randomness inside GameState
// (the `seed` field) makes every match deterministic and replayable, critical
// for testing the engine and for scripted Campaign set-pieces.

/** mulberry32: fast, seedable, good-enough distribution for a card game. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Advance a seed one step; returns [nextSeed, value in [0,1)]. Pure. */
export function nextRandom(seed: number): [number, number] {
  const nextSeed = (seed + 0x6d2b79f5) | 0;
  const value = mulberry32(seed)();
  return [nextSeed >>> 0, value];
}

/** Deterministic Fisher–Yates shuffle. Returns [shuffled, nextSeed]. Pure. */
export function shuffle<T>(items: readonly T[], seed: number): [T[], number] {
  const arr = items.slice();
  let s = seed >>> 0;
  for (let i = arr.length - 1; i > 0; i--) {
    let value: number;
    [s, value] = nextRandom(s);
    const j = Math.floor(value * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return [arr, s];
}

let instanceCounter = 0;
/** Monotonic, unique-per-process instance id. Not part of GameState. */
export function newInstanceId(cardId: string): string {
  instanceCounter += 1;
  return `${cardId}#${instanceCounter}`;
}

/** Reset the instance counter, used only in tests for reproducibility. */
export function resetInstanceCounter(): void {
  instanceCounter = 0;
}
