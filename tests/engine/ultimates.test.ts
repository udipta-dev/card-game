// One world-ender per battle, per side.
//
// Without a cap, a hand holding two tier-3 weapons fires both in the same
// fight, and the battle is decided by which cards you happened to draw rather
// than by anything either player did. One is a moment; two is a coin flip.
//
// The Brahma line (tier 2) is deliberately NOT capped: each is already spent
// for the run the moment it fires, which is its own limit.
import { describe, expect, it } from 'vitest';
import { ULTIMATES_PER_BATTLE, isLegalPlay, reduce } from '@engine/reducer';
import { getCard } from '@content/cards';
import { makeState, firstOf } from './helpers';

describe('the cap on ultimates', () => {
  it('is one, and the constant says so', () => {
    expect(ULTIMATES_PER_BATTLE).toBe(1);
  });

  it('lets the first tier-3 weapon through', () => {
    const s = makeState({
      playerHand: ['brahmashirsha'],
      // Drona bears the Brahmashirsha, so it can actually be invoked.
      playerBoard: { ratha: ['drona'] },
      aiBoard: { ratha: ['dushasana'] },
    });
    const iid = firstOf(s, 'player', 'brahmashirsha').iid;
    expect(isLegalPlay(s, 'player', iid, 'ratha')).toBe(true);
  });

  it('bars a second one in the same battle', () => {
    const s = makeState({
      playerHand: ['brahmashirsha', 'narayanastra'],
      playerBoard: { ratha: ['drona'], gaja: ['ashwatthama'] },
      aiBoard: { ratha: ['dushasana'] },
    });
    const first = firstOf(s, 'player', 'brahmashirsha').iid;
    const second = firstOf(s, 'player', 'narayanastra').iid;
    expect(isLegalPlay(s, 'player', second, 'ratha')).toBe(true);

    const s1 = reduce(s, { type: 'PLAY_CARD', iid: first, row: 'ratha' });
    expect(s1.ultimatesFired.player).toBe(1);
    expect(isLegalPlay(s1, 'player', second, 'ratha')).toBe(false);
  });

  it('counts the firing, not the landing', () => {
    // A weapon answered in the air or swallowed by Ghatotkacha was still
    // loosed. The act is what is capped.
    const s = makeState({
      playerHand: ['brahmashirsha'],
      playerBoard: { ratha: ['drona'] },
      aiBoard: { ratha: ['ghatotkacha'] },
    });
    const s1 = reduce(s, {
      type: 'PLAY_CARD',
      iid: firstOf(s, 'player', 'brahmashirsha').iid,
      row: 'ratha',
    });
    expect(s1.ultimatesFired.player).toBe(1);
  });

  it('does not cap the Brahma line, which limits itself by being spent', () => {
    expect(getCard('brahmastra').astraTier).toBe(2);
    const s = makeState({
      playerHand: ['brahmastra'],
      playerBoard: { ratha: ['drona'] },
      aiBoard: { ratha: ['dushasana'] },
    });
    const iid = firstOf(s, 'player', 'brahmastra').iid;
    const s1 = reduce(s, { type: 'PLAY_CARD', iid, row: 'ratha' });
    // Fired, and not counted against the ultimate cap.
    expect(s1.ultimatesFired.player).toBe(0);
    // It bans itself instead.
    expect(s1.bannedThisRun).toContain('brahmastra');
  });

  it('each side has its own count', () => {
    const s = makeState({
      playerHand: ['brahmashirsha'],
      playerBoard: { ratha: ['drona'] },
      aiBoard: { ratha: ['dushasana'] },
    });
    const s1 = reduce(s, {
      type: 'PLAY_CARD',
      iid: firstOf(s, 'player', 'brahmashirsha').iid,
      row: 'ratha',
    });
    expect(s1.ultimatesFired.player).toBe(1);
    expect(s1.ultimatesFired.ai).toBe(0);
  });
});
