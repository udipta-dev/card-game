import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { firstOf, makeState } from './helpers';

describe('round loop — vanilla', () => {
  it('higher board power wins the round; battle continues to round 2', () => {
    const s0 = makeState({ playerHand: ['nakula'], aiHand: ['kaurava_infantry'] });
    // player plays a 6, ai plays a 2, both pass.
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'nakula').iid, row: 'ratha' });
    expect(s1.activeSeat).toBe('ai');
    const s2 = reduce(s1, { type: 'PLAY_CARD', iid: firstOf(s1, 'ai', 'kaurava_infantry').iid, row: 'padati' });
    const s3 = reduce(s2, { type: 'PASS', seat: 'player' });
    const s4 = reduce(s3, { type: 'PASS', seat: 'ai' });
    expect(s4.roundWins.player).toBe(1);
    expect(s4.roundWins.ai).toBe(0);
    expect(s4.phase).toBe('playing');
    expect(s4.round).toBe(2);
  });

  it('the round loser leads the next round', () => {
    const s0 = makeState({ playerHand: ['nakula'], aiHand: ['kaurava_infantry'] });
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'nakula').iid, row: 'ratha' });
    const s2 = reduce(s1, { type: 'PLAY_CARD', iid: firstOf(s1, 'ai', 'kaurava_infantry').iid, row: 'padati' });
    const s3 = reduce(s2, { type: 'PASS', seat: 'player' });
    const s4 = reduce(s3, { type: 'PASS', seat: 'ai' });
    // ai lost round 1, so ai leads round 2.
    expect(s4.activeSeat).toBe('ai');
  });

  it('a dry pass concedes the round but banks the hand', () => {
    const s0 = makeState({ playerHand: ['arjuna'], aiHand: ['kaurava_infantry'] });
    // player passes immediately, banking Arjuna; ai commits a 2 and the round.
    const s1 = reduce(s0, { type: 'PASS', seat: 'player' });
    const s2 = reduce(s1, { type: 'PLAY_CARD', iid: firstOf(s1, 'ai', 'kaurava_infantry').iid, row: 'padati' });
    const s3 = reduce(s2, { type: 'PASS', seat: 'ai' });
    expect(s3.roundWins.ai).toBe(1);
    // Arjuna is still in hand for the next round.
    expect(s3.hands.player.some((iid) => s3.instances[iid].cardId === 'arjuna')).toBe(true);
  });
});
