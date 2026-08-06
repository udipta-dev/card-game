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
    // A clairvoyant AI would refuse Nagastra into a held Sauparna; a fair AI
    // does not see the counter, so it takes the kill.
    //
    // The player needs a real DECK here, not just a hand. The AI hides the
    // opponent's hand by reshuffling the union of their hand and deck, which is
    // exactly the set of their cards it has not seen. With an empty deck that
    // union is the hand itself, so the reshuffle returns the hand unchanged and
    // the AI reads it perfectly.
    //
    // That is not a hole in the disguise, it is the disguise working: when only
    // one card can possibly be left, deducing it is correct play rather than
    // cheating, and a human would do the same. It simply cannot arise in a real
    // match. Measured over 40 full games the smallest unseen pool was 19 cards
    // against a hand of 6, because a 19-card deck only ever gives up 10 cards
    // and therefore never empties. Worst case the AI's guess matched the real
    // card 32% of the time, which is the coin it is supposed to be flipping.
    const s = makeState({
      activeSeat: 'ai',
      aiBoard: { ratha: ['karna'] }, // invoker for Nagastra
      aiHand: ['nagastra'],
      playerBoard: { ratha: ['arjuna'] }, // the target
      playerHand: ['sauparna'], // the counter the AI must not peek at
      // Both sides need one, and of similar size: cardCount is hand + deck and
      // the round-1 banking weight is heavy, so a lopsided deck makes the AI
      // pass to bank and the test measures card advantage instead of sight.
      playerDeck: [
        'nakula', 'sahadeva', 'satyaki', 'drupada', 'virata', 'chekitana',
        'uttara', 'yuyutsu', 'iravan', 'sankha', 'kuntibhoja', 'shikhandi',
      ],
      aiDeck: [
        'dushasana', 'shalya', 'kripa', 'kritavarma', 'bahlika', 'somadatta',
        'vikarna', 'chitrasena', 'vivimsati', 'durmukha', 'uluka', 'susharma',
      ],
    });
    const action = chooseAction(s, 'ai');
    expect(action.type).toBe('PLAY_CARD');
    if (action.type === 'PLAY_CARD') {
      expect(s.instances[action.iid].cardId).toBe('nagastra');
    }
  });
});
