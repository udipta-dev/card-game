import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { makeState } from './helpers';

describe('how Bhima actually reaches Duryodhana', () => {
  // He NAMES him now. The vow used to take every one of the seven who happened
  // to be standing, all at once, with nobody deciding anything; it now offers
  // whichever are reachable and you choose which promise to collect.
  it('kills the man you name, when he is already standing', () => {
    const s = makeState({ playerHand: ['bhima'], aiBoard: { ratha: ['duryodhana'] } });
    const mark = Object.values(s.instances).find((u) => u.cardId === 'duryodhana')!;
    const s1 = reduce(s, {
      type: 'PLAY_CARD',
      iid: s.hands.player[0],
      row: 'ratha',
      targets: [mark.iid],
    });
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
    const mark = Object.values(s.instances).find((u) => u.cardId === 'duryodhana')!;
    const s1 = reduce(s, {
      type: 'PLAY_CARD',
      iid: s.hands.player[0],
      row: 'ratha',
      targets: [mark.iid],
    });
    const alive = Object.values(s1.instances).some((u) => u.cardId === 'duryodhana' && u.row);
    expect(alive).toBe(false);
  });

  it('and a man not on his list cannot be named at all', () => {
    // The seven are the seven. Offering the whole enemy host and then refusing
    // most of it is the shape of bug that made this worth fixing.
    const s = makeState({ playerHand: ['bhima'], aiBoard: { ratha: ['karna'] } });
    const karna = Object.values(s.instances).find((u) => u.cardId === 'karna')!;
    const s1 = reduce(s, {
      type: 'PLAY_CARD',
      iid: s.hands.player[0],
      row: 'ratha',
      targets: [karna.iid],
    });
    expect(Object.values(s1.instances).some((u) => u.cardId === 'karna' && u.row)).toBe(true);
  });
});
