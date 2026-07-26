// Smoke tests only. The analyser's job is measurement, and asserting specific
// win rates here would just re-encode today's balance as a rule and break on
// every deliberate change. What must hold is that the machinery is sound.
import { describe, expect, it } from 'vitest';
import { findings, simulateBattles, simulateRuns } from '@ai/balanceReport';

describe('battle analysis', () => {
  const b = simulateBattles(60);

  it('reports every deck with a usable sample', () => {
    expect(b.decks.length).toBe(3);
    for (const d of b.decks) expect(d.overall.n).toBeGreaterThan(0);
  });

  it('gives every rate a confidence interval that brackets it', () => {
    for (const d of b.decks) {
      expect(d.overall.lo).toBeLessThanOrEqual(d.overall.rate);
      expect(d.overall.hi).toBeGreaterThanOrEqual(d.overall.rate);
    }
  });

  it('measures cards as lift over their own deck, not raw win rate', () => {
    // Lift is a difference of rates, so it must sit within [-1, 1] and be
    // exactly rate-minus-deck-rate, which is what isolates the card from the
    // strength of the deck carrying it.
    expect(b.cards.length).toBeGreaterThan(0);
    for (const c of b.cards) {
      expect(c.lift).toBeGreaterThanOrEqual(-1);
      expect(c.lift).toBeLessThanOrEqual(1);
      const deck = b.decks.find((d) => d.name === c.deck)!;
      expect(c.lift).toBeCloseTo(c.played.rate - deck.overall.rate, 6);
    }
  });

  it('sorts cards strongest first', () => {
    for (let i = 1; i < b.cards.length; i++) {
      expect(b.cards[i - 1].lift).toBeGreaterThanOrEqual(b.cards[i].lift);
    }
  });
});

describe('run analysis', () => {
  it('plays runs to a real conclusion and records where they died', () => {
    const r = simulateRuns(6, 'walk');
    expect(r.runs).toBe(6);
    expect(r.avgDepth).toBeGreaterThanOrEqual(0);
    const deaths = r.deathsByRung.reduce((n, d) => n + d, 0);
    // Every run either finished the ladder or died on a rung, never vanished.
    expect(deaths + r.completed.wins).toBe(6);
  });
});

describe('findings', () => {
  it('never reports a card the sample cannot support', () => {
    const b = simulateBattles(30);
    const out = findings(b, [simulateRuns(3, 'walk')]);
    for (const f of out) {
      if (f.area !== 'card') continue;
      const named = b.cards.find((c) => f.text.startsWith(c.name));
      if (named) expect(named.played.n).toBeGreaterThanOrEqual(40);
    }
  });

  it('ranks the worst problems first', () => {
    const b = simulateBattles(30);
    const out = findings(b, [simulateRuns(3, 'walk')]);
    const order = { high: 0, medium: 1, low: 2 } as const;
    for (let i = 1; i < out.length; i++) {
      expect(order[out[i - 1].severity]).toBeLessThanOrEqual(order[out[i].severity]);
    }
  });
});
