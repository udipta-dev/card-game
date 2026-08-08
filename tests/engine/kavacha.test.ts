// The armour Karna gave away, and how you win it back.
//
// His card used to carry armour 4, the largest in the game, on the highest
// power in the game, in a game whose removal is almost entirely damage. An
// ablation found it was the single biggest thing holding his whole house above
// the other two: stripping it moved Kaurava 58.3% -> 53.8%.
//
// It is also not his to have at Kurukshetra. He GAVE the Kavacha-Kundala away,
// to Indra begging in a brahmana's disguise, in exchange for the Vasavi Shakti,
// and fights the entire war without it.
//
// So he starts without it and Surya's Kavacha is how it comes back: a boon in
// every house's muster pool, played onto whichever warrior you choose.
import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { getCard } from '@content/cards';
import { poolFor } from '@content/muster';
import { attemptDestroy } from '@engine/keywords';
import { firstOf, makeState } from './helpers';

describe('Karna fights without what he traded away', () => {
  it('carries no armour on his own card', () => {
    expect(getCard('karna').keywords.some((k) => k.kind === 'armor')).toBe(false);
  });
});

describe('Surya’s Kavacha is a card, not a pilgrimage', () => {
  it('sits in every house’s muster pool, so any host can pack it', () => {
    // No shrine visit and no Surya card needed: it is a boon you buy with
    // provisions and put on a man, exactly like any other card in the deck.
    for (const house of ['pandava', 'kaurava', 'asura'] as const) {
      expect(poolFor(house).some((c) => c.id === 'surya_kavacha'), house).toBe(true);
    }
  });

  it('clothes the warrior you choose in armour, rather than making him bigger', () => {
    // ARMOUR, not +5 power, which is what it used to grant. A kavacha turns
    // blows aside; it does not make the man larger.
    const s = makeState({ playerHand: ['surya_kavacha'], playerBoard: { ratha: ['karna'] } });
    const karna = firstOf(s, 'player', 'karna');
    const powerBefore = karna.currentPower;
    const s1 = reduce(s, {
      type: 'PLAY_CARD',
      iid: s.hands.player[0],
      row: 'ratha',
      targets: [karna.iid],
    });
    const after = firstOf(s1, 'player', 'karna');
    expect(after.counters.armor ?? 0, 'no armour was granted').toBe(4);
    expect(after.currentPower, 'it should not raise his power').toBe(powerBefore);
  });

  it('and the armour actually turns a blow aside', () => {
    const s = makeState({ playerHand: ['surya_kavacha'], playerBoard: { ratha: ['karna'] } });
    const karna = firstOf(s, 'player', 'karna');
    expect(attemptDestroy(s, 'ai', karna.iid), 'bare, he dies').toBe(true);

    const s2 = makeState({ playerHand: ['surya_kavacha'], playerBoard: { ratha: ['karna'] } });
    const k2 = firstOf(s2, 'player', 'karna');
    const s3 = reduce(s2, {
      type: 'PLAY_CARD',
      iid: s2.hands.player[0],
      row: 'ratha',
      targets: [k2.iid],
    });
    expect(attemptDestroy(s3, 'ai', firstOf(s3, 'player', 'karna').iid), 'clothed, it turns').toBe(
      false,
    );
  });

  it('takes the better of two coats rather than stacking them', () => {
    // Two coats of mail are not twice the mail, and stacking would make a cheap
    // boon the best card in any deck that could draw it twice.
    const s = makeState({ playerHand: ['surya_kavacha'], playerBoard: { ratha: ['ravana'] } });
    const ravana = firstOf(s, 'player', 'ravana'); // born with armour 3
    expect(ravana.counters.armor).toBe(3);
    const s1 = reduce(s, {
      type: 'PLAY_CARD',
      iid: s.hands.player[0],
      row: 'ratha',
      targets: [ravana.iid],
    });
    expect(firstOf(s1, 'player', 'ravana').counters.armor).toBe(4); // 4, not 7
  });
});
