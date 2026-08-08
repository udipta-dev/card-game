// "He cannot be killed until the lie is told."
//
// Dhrishtadyumna was born out of a fire lit for one purpose, and his card says
// so: he destroys Drona wherever Drona stands. But Drona carries
// immuneUntilPlayed, so the destroy is refused until "Ashwatthama is Dead" has
// been played. Two cards, in order, to remove one man, which is what the epic
// charges: Yudhishthira had to say it before Drona would lay down the bow.
import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { getCard } from '@content/cards';
import { makeState } from './helpers';

const standing = (s: ReturnType<typeof makeState>, card: string) =>
  Object.values(s.instances).some((u) => u.cardId === card && u.row);

describe('Drona takes two cards to kill, in either order', () => {
  it('Dhrishtadyumna alone cannot touch him', () => {
    const s = makeState({ playerHand: ['dhrishtadyumna'], aiBoard: { ratha: ['drona'] } });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });
    expect(standing(s1, 'drona'), 'the fire-born killed him without the lie').toBe(true);
  });

  it('the lie alone does not kill him either, it only unstrings the bow', () => {
    const s = makeState({ playerHand: ['ashwatthama_elephant'], aiBoard: { ratha: ['drona'] } });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });
    expect(standing(s1, 'drona')).toBe(true);
    const drona = Object.values(s1.instances).find((u) => u.cardId === 'drona')!;
    // thenSetPower 4, and then the lie's own -1 lands on him with everyone
    // else, because the disarm now resolves BEFORE the card's effects. He sat
    // down in meditation; he did not shrink to nothing.
    expect(drona.currentPower).toBe(3);
  });

  it('but the lie and then the fire-born together take him', () => {
    const s = makeState({
      playerHand: ['ashwatthama_elephant', 'dhrishtadyumna'],
      aiBoard: { ratha: ['drona'] },
    });
    const lie = s.hands.player[0];
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: lie, row: 'ratha' });
    const s2 = { ...s1, activeSeat: 'player' as const };
    const dhrishta = s2.hands.player.find((i) => s2.instances[i]!.cardId === 'dhrishtadyumna')!;
    const s3 = reduce(s2, { type: 'PLAY_CARD', iid: dhrishta, row: 'ratha' });
    expect(standing(s3, 'drona'), 'Drona survived both').toBe(false);
  });

  it('and the fire-born first still works, because the lie collects', () => {
    // THIS USED TO BE THE TRAP. Dhrishtadyumna's kill fires once, on arrival,
    // and was refused while Drona was still immune, so committing him before
    // the lie spent your only answer and left Drona standing. Nothing on either
    // card said so, and the two read as a flat contradiction side by side.
    //
    // The lie now finishes the job when the slayer is already on the field, so
    // whichever of the pair arrives second, Drona falls.
    const s = makeState({
      playerHand: ['dhrishtadyumna', 'ashwatthama_elephant'],
      aiBoard: { ratha: ['drona'] },
    });
    const dhrishta = s.hands.player[0];
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: dhrishta, row: 'ratha' });
    const s2 = { ...s1, activeSeat: 'player' as const };
    const lie = s2.hands.player.find((i) => s2.instances[i]!.cardId === 'ashwatthama_elephant')!;
    const s3 = reduce(s2, { type: 'PLAY_CARD', iid: lie, row: 'ratha' });
    expect(standing(s3, 'drona'), 'the fire-born was wasted by arriving early').toBe(false);
  });

  it('the keyword names the card that unstrings him, so this is not a coincidence', () => {
    const kw = getCard('drona').keywords.find((k) => k.kind === 'immuneUntilPlayed');
    expect(kw && 'card' in kw ? kw.card : null).toBe('ashwatthama_elephant');
  });
});
