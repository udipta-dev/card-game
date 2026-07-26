import { describe, expect, it } from 'vitest';
import { differsFrom, marginOfError, rate, samplesNeeded, wilson } from '@ai/stats';

describe('confidence intervals', () => {
  it('brackets the observed rate', () => {
    const [lo, hi] = wilson(60, 100);
    expect(lo).toBeLessThan(0.6);
    expect(hi).toBeGreaterThan(0.6);
  });

  it('narrows as the sample grows, which is the whole point', () => {
    expect(marginOfError(60, 100)).toBeGreaterThan(marginOfError(600, 1000));
    expect(marginOfError(600, 1000)).toBeGreaterThan(marginOfError(6000, 10000));
  });

  it('stays inside [0,1] even at the extremes, where the normal approximation breaks', () => {
    for (const [w, n] of [[0, 10], [10, 10], [1, 3], [0, 1]] as const) {
      const [lo, hi] = wilson(w, n);
      expect(lo).toBeGreaterThanOrEqual(0);
      expect(hi).toBeLessThanOrEqual(1);
      expect(lo).toBeLessThanOrEqual(hi);
    }
  });

  it('says nothing at all when there is no data', () => {
    expect(wilson(0, 0)).toEqual([0, 1]);
  });
});

describe('significance', () => {
  it('refuses to call a coin biased on a handful of flips', () => {
    // 6 of 10 is a 60% rate and means nothing.
    expect(differsFrom(6, 10, 0.5)).toBe(false);
  });

  it('calls the same rate significant once the sample is large', () => {
    expect(differsFrom(600, 1000, 0.5)).toBe(true);
  });

  it('does not flag a rate sitting on the expectation', () => {
    expect(differsFrom(500, 1000, 0.5)).toBe(false);
  });
});

describe('planning a run', () => {
  it('demands more games for finer gaps, quadratically', () => {
    const five = samplesNeeded(0.05);
    const one = samplesNeeded(0.01);
    expect(one).toBeGreaterThan(five * 20); // 25x, as 1/delta^2 implies
  });

  it('is honest that a zero gap is unresolvable', () => {
    expect(samplesNeeded(0)).toBe(Infinity);
  });
});

describe('rate()', () => {
  it('bundles the number with how much to trust it', () => {
    const r = rate(55, 100);
    expect(r.rate).toBeCloseTo(0.55, 5);
    expect(r.lo).toBeLessThan(r.rate);
    expect(r.hi).toBeGreaterThan(r.rate);
    expect(r.moe).toBeGreaterThan(0);
  });
});
