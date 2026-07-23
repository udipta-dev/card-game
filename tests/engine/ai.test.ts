import { describe, expect, it } from 'vitest';
import { chooseAction } from '@ai/ai';
import { firstOf, makeState } from './helpers';

describe('AI pass/bank policy', () => {
  it('banks when already ahead and the opponent has passed', () => {
    const s = makeState({
      activeSeat: 'ai',
      passed: { player: true },
      aiBoard: { ratha: ['arjuna'] }, // 10
      playerBoard: { ratha: ['nakula'] }, // 6
      aiHand: ['kaurava_infantry'],
    });
    expect(chooseAction(s, 'ai').type).toBe('PASS');
  });

  it('plays a closing card when behind and the opponent has passed', () => {
    const s = makeState({
      activeSeat: 'ai',
      passed: { player: true },
      playerBoard: { ratha: ['nakula'] }, // 6
      aiHand: ['arjuna'], // 10 closes it
    });
    const action = chooseAction(s, 'ai');
    expect(action.type).toBe('PLAY_CARD');
    if (action.type === 'PLAY_CARD') {
      expect(s.instances[action.iid].cardId).toBe('arjuna');
    }
  });

  it('dry-passes to bank when it cannot take a non-final round', () => {
    const s = makeState({
      round: 1,
      activeSeat: 'ai',
      passed: { player: true },
      playerBoard: { ratha: ['arjuna'] }, // 10, unreachable
      aiHand: ['kaurava_infantry'], // only a 2
    });
    expect(chooseAction(s, 'ai').type).toBe('PASS');
    // ...but it does NOT throw away the card — it's still in hand.
    expect(firstOf(s, 'ai', 'kaurava_infantry')).toBeDefined();
  });
});

describe('AI imperfect information', () => {
  it('fires an astra it cannot see will be countered', () => {
    // A clairvoyant AI would refuse Nagastra into a held Garudastra; a fair AI
    // does not see the counter, so it takes the kill.
    const s = makeState({
      activeSeat: 'ai',
      aiBoard: { ratha: ['karna'] }, // invoker for Nagastra
      aiHand: ['nagastra'],
      playerBoard: { ratha: ['arjuna'] }, // the target
      playerHand: ['garudastra'], // the counter the AI must not peek at
    });
    const action = chooseAction(s, 'ai');
    expect(action.type).toBe('PLAY_CARD');
    if (action.type === 'PLAY_CARD') {
      expect(s.instances[action.iid].cardId).toBe('nagastra');
    }
  });
});
