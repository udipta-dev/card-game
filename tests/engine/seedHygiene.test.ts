// The seed must stay a seed.
//
// nextRandom returns [nextSeed, value]. One call site had it backwards, and the
// two consequences were both silent:
//
//   1. The value used as a 0..1 roll was actually the next seed, an integer in
//      the billions. In the round trade that made the insert position ~2.2e10,
//      which splice clamps to the end, so the traded card was ALWAYS buried at
//      the bottom of the deck: the exact memorisable position the line existed
//      to avoid.
//   2. state.seed was assigned a float between 0 and 1. That is not a seed.
//      Every roll after a trade ran off a poisoned generator, and it collapsed
//      into a repeating cycle within three calls, so curses, discards and
//      shuffles all stopped being random for the rest of the battle.
//
// Nothing failed loudly. This pins the invariant instead.
import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { createMatch } from '@engine/createMatch';
import { nextRandom } from '@engine/ids';
import { legalMoves } from '@engine/selectors';
import { PANDAVA_DECK, KAURAVA_DECK } from '@content/decks';
import type { Action, GameState } from '@engine/types';

const isSeed = (n: number) => Number.isInteger(n) && n >= 0 && n <= 0xffffffff;

describe('nextRandom', () => {
  it('returns the next SEED first and the 0..1 roll second', () => {
    const [seed, roll] = nextRandom(12345);
    expect(isSeed(seed), `${seed} should be a uint32 seed`).toBe(true);
    expect(roll).toBeGreaterThanOrEqual(0);
    expect(roll).toBeLessThan(1);
  });

  it('does not repeat itself when chained correctly', () => {
    let s = 12345;
    const seen = new Set<number>();
    for (let i = 0; i < 500; i++) {
      const [next, roll] = nextRandom(s);
      expect(roll).toBeLessThan(1);
      seen.add(roll);
      s = next;
    }
    // A degenerate generator collapses to a handful of values almost at once.
    expect(seen.size).toBeGreaterThan(450);
  });
});

describe('state.seed survives a whole battle as a seed', () => {
  function playOut(seed: number, policy: 'random' | 'swapFirst'): GameState {
    let s: GameState = createMatch(seed, PANDAVA_DECK, KAURAVA_DECK);
    s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
    s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });
    let rng = seed;
    for (let step = 0; step < 600 && s.phase !== 'battleEnd'; step++) {
      const moves = legalMoves(s, s.activeSeat);
      if (!moves.length) break;
      // Prefer the trade when asked, since that is the path that broke it.
      const swap = policy === 'swapFirst' ? moves.find((m) => m.type === 'ROUND_SWAP') : undefined;
      const [next, r] = nextRandom(rng);
      rng = next;
      const move: Action = swap ?? moves[Math.floor(r * moves.length)];
      const after = reduce(s, move);
      if (after === s) break;
      s = after;
      expect(isSeed(s.seed), `seed became ${s.seed} after ${move.type}`).toBe(true);
    }
    return s;
  }

  it('stays an integer seed through random play', () => {
    for (let i = 0; i < 20; i++) playOut(i * 7919 + 3, 'random');
  });

  it('stays an integer seed through the round trade specifically', () => {
    for (let i = 0; i < 20; i++) playOut(i * 104729 + 11, 'swapFirst');
  });
});

describe('the traded card is not always buried in the same place', () => {
  it('lands at more than one depth across seeds', () => {
    const depths = new Set<number>();
    for (let i = 0; i < 40; i++) {
      let s: GameState = createMatch(i * 31337 + 5, PANDAVA_DECK, KAURAVA_DECK);
      s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
      s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });
      // Get to a point where the player may trade.
      let guard = 0;
      while (s.phase === 'playing' && guard++ < 60) {
        const swap = legalMoves(s, s.activeSeat).find((m) => m.type === 'ROUND_SWAP');
        if (swap && s.activeSeat === 'player') {
          const traded = swap.type === 'ROUND_SWAP' ? swap.iid : '';
          const after = reduce(s, swap);
          const at = after.decks.player.indexOf(traded);
          if (at >= 0) depths.add(at);
          break;
        }
        const moves = legalMoves(s, s.activeSeat);
        if (!moves.length) break;
        const next = reduce(s, moves[0]);
        if (next === s) break;
        s = next;
      }
    }
    // It used to be the bottom of the deck, every single time.
    expect(depths.size, `buried at depths: ${[...depths].join(', ')}`).toBeGreaterThan(1);
  });
});
