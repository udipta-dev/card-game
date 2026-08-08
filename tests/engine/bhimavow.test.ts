import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { makeState } from './helpers';

describe('how Bhima actually reaches Duryodhana', () => {
  it('kills him automatically when Bhima is committed and Duryodhana already stands', () => {
    const s = makeState({ playerHand: ['bhima'], aiBoard: { ratha: ['duryodhana'] } });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });
    const alive = Object.values(s1.instances).some((u) => u.cardId === 'duryodhana' && u.row);
    expect(alive, 'Duryodhana survived Bhima').toBe(false);
  });

  it('but does nothing if Duryodhana is still in hand when Bhima lands', () => {
    const s = makeState({ playerHand: ['bhima'], aiHand: ['duryodhana'] });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });
    expect(s1.hands.ai.length, 'the vow reached into his hand').toBe(s.hands.ai.length);
  });

  it('reaches him in any row, not just the one Bhima joined', () => {
    const s = makeState({ playerHand: ['bhima'], aiBoard: { padati: ['duryodhana'] } });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });
    const alive = Object.values(s1.instances).some((u) => u.cardId === 'duryodhana' && u.row);
    expect(alive).toBe(false);
  });
});
