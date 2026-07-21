import { describe, expect, it } from 'vitest';
import { chooseAction } from '@ai/ai';
import { createMatch } from '@engine/createMatch';
import { reduce } from '@engine/reducer';
import { KAURAVA_DECK, PANDAVA_DECK } from '@content/decks';
import type { GameState, Seat } from '@engine/types';

const MAX_STEPS = 500;

function playout(seed: number): { state: GameState; steps: number } {
  let s = createMatch(seed, PANDAVA_DECK, KAURAVA_DECK);
  s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
  s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });

  let steps = 0;
  while (s.phase !== 'battleEnd' && steps < MAX_STEPS) {
    const seat: Seat = s.activeSeat;
    s = reduce(s, chooseAction(s, seat));
    steps++;
  }
  return { state: s, steps };
}

function assertHealthy(s: GameState): void {
  for (const u of Object.values(s.instances)) {
    expect(Number.isFinite(u.currentPower), `power for ${u.cardId}`).toBe(true);
    expect(u.currentPower).toBeGreaterThanOrEqual(0);
  }
  expect(s.roundWins.player).toBeLessThanOrEqual(3);
  expect(s.roundWins.ai).toBeLessThanOrEqual(3);
}

describe('AI vs AI self-play fuzz', () => {
  it('every seeded match terminates in a valid battle result', () => {
    const N = 1000;
    let stalls = 0;
    for (let seed = 1; seed <= N; seed++) {
      const { state, steps } = playout(seed);
      expect(state.phase, `seed ${seed} did not terminate`).toBe('battleEnd');
      expect(steps, `seed ${seed} hit the step cap`).toBeLessThan(MAX_STEPS);
      expect([null, 'player', 'ai']).toContain(state.winner);
      assertHealthy(state);
      if (steps >= MAX_STEPS) stalls++;
    }
    expect(stalls).toBe(0);
  });

  it('is fully deterministic for a given seed', () => {
    const a = playout(42);
    const b = playout(42);
    expect(a.state.winner).toBe(b.state.winner);
    expect(a.steps).toBe(b.steps);
    expect(a.state.roundWins).toEqual(b.state.roundWins);
  });
});
