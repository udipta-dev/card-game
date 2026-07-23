import { describe, expect, it } from 'vitest';
import { createMatch } from '@engine/createMatch';
import { mulberry32 } from '@engine/ids';
import { reduce } from '@engine/reducer';
import { legalMoves } from '@engine/selectors';
import { DECK_BUDGET, KAURAVA_DECK, PANDAVA_DECK, deckProvisions } from '@content/decks';
import type { DeckList } from '@content/decks';
import type { GameState } from '@engine/types';

const MAX_STEPS = 1200;

function assertHealthy(s: GameState, tag: string): void {
  for (const u of Object.values(s.instances)) {
    expect(Number.isFinite(u.currentPower), `${tag}: NaN power on ${u.cardId}`).toBe(true);
    expect(u.currentPower, `${tag}: negative power on ${u.cardId}`).toBeGreaterThanOrEqual(0);
  }
  // Board never references a missing instance.
  for (const seat of ['player', 'ai'] as const) {
    for (const row of ['ratha', 'gaja', 'padati'] as const) {
      for (const iid of s.board[seat][row]) {
        expect(s.instances[iid], `${tag}: dangling board ref ${iid}`).toBeDefined();
      }
    }
  }
  expect(s.roundWins.player).toBeLessThanOrEqual(3);
  expect(s.roundWins.ai).toBeLessThanOrEqual(3);
}

/** Play a whole match choosing uniformly at random among legal moves. */
function randomPlayout(seed: number, a: DeckList, b: DeckList) {
  const rng = mulberry32((seed ^ 0x9e3779b9) >>> 0);
  let s: GameState = createMatch(seed, a, b);
  // Random mulligans too.
  const mull = (seat: 'player' | 'ai') => {
    const swap = s.hands[seat].filter(() => rng() < 0.3).slice(0, 2);
    s = reduce(s, { type: 'MULLIGAN', seat, iids: swap });
  };
  mull('player');
  mull('ai');

  let steps = 0;
  while (s.phase !== 'battleEnd' && steps < MAX_STEPS) {
    const moves = legalMoves(s, s.activeSeat);
    expect(moves.length, `seed ${seed}: no legal moves`).toBeGreaterThan(0); // PASS always legal
    const move = moves[Math.floor(rng() * moves.length)];
    const before = s;
    s = reduce(s, move);
    // A legal move must always change state (progress guarantee).
    expect(s, `seed ${seed}: legal move was a no-op (${move.type})`).not.toBe(before);
    if (steps % 25 === 0) assertHealthy(s, `seed ${seed} step ${steps}`);
    steps++;
  }
  assertHealthy(s, `seed ${seed} final`);
  return { s, steps };
}

describe('stress: random-legal-move self-play', () => {
  it('2000 random games terminate with a valid result and no invalid state', () => {
    let stalls = 0;
    for (let seed = 1; seed <= 2000; seed++) {
      const { s, steps } = randomPlayout(seed, PANDAVA_DECK, KAURAVA_DECK);
      expect(s.phase, `seed ${seed} did not terminate`).toBe('battleEnd');
      expect([null, 'player', 'ai']).toContain(s.winner);
      if (steps >= MAX_STEPS) stalls++;
    }
    expect(stalls, 'some games hit the step cap').toBe(0);
  });

  it('mirror matchups (both sides same deck) are stable', () => {
    for (const deck of [PANDAVA_DECK, KAURAVA_DECK]) {
      for (let seed = 1; seed <= 400; seed++) {
        const { s } = randomPlayout(seed * 31 + 7, deck, deck);
        expect(s.phase).toBe('battleEnd');
      }
    }
  });
});

describe('stress: deck sanity', () => {
  it('starter decks stay within the provision budget', () => {
    for (const deck of [PANDAVA_DECK, KAURAVA_DECK]) {
      expect(deckProvisions(deck), `${deck.id} over budget`).toBeLessThanOrEqual(DECK_BUDGET);
    }
  });
});
