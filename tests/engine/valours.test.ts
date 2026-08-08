// Three listed, one done, chosen as he takes the field.
//
// The maharathi tier was the flattest thing in the game: eleven men, eight with
// no activated skill at all, and the three who had one all had the SAME one.
// Those three were also the top three win rates in the lab.
//
// A valour is not the old ability. It is picked and fired in the same breath as
// committing the man, so it costs no turn of its own, and the choice is locked
// the moment he lands.
import { describe, expect, it } from 'vitest';
import { reduce, VALOURS_PER_TIER, isLegalPlay } from '@engine/reducer';
import { legalMoves } from '@engine/selectors';
import { allCards, getCard } from '@content/cards';
import { validateContent } from '@content/validateContent';
import { firstOf, hasEvent, makeState } from './helpers';

describe('every maharathi is offered three', () => {
  it('and no card is offered more than its rank allows', () => {
    expect(validateContent()).toEqual([]);
  });

  it('Balarama alone keeps the older turn-costing shape', () => {
    // One card left on the previous model, deliberately, while the new one is
    // this young. If he ever gains valours the ability system loses its last
    // user and should be deleted rather than left as dead machinery.
    const withAbility = allCards().filter((c) => c.ability).map((c) => c.id);
    expect(withAbility).toEqual(['balarama']);
    expect(getCard('balarama').valours).toBeUndefined();
  });

  it('every maharathi has a full menu, however many there are', () => {
    // Was pinned at eleven. Three asuras were promoted into the rank on canon
    // grounds (Bali held the three worlds, the Devi had to be created to remove
    // Mahishasura, killing Vritra cost Indra his throne for a while), so the
    // count is not the invariant. That every man of the rank is offered three is.
    const maharathis = allCards().filter((c) => c.tier === 'maharathi');
    expect(maharathis.length).toBeGreaterThanOrEqual(11);
    for (const c of maharathis) {
      expect(c.valours?.length, `${c.name} has no full menu`).toBe(VALOURS_PER_TIER.maharathi);
    }
  });

  it('and the turn-costing Arrow Rain is gone from all three who had it', () => {
    // One ability, held by one man per house, on the three strongest cards in
    // the game. It is now one of three choices, it rides along with committing
    // the man instead of costing a turn, and it hits one rank rather than every
    // enemy on the field.
    for (const id of ['arjuna', 'bhishma', 'ravana']) {
      expect(getCard(id).ability, `${id} still holds a turn-costing ability`).toBeUndefined();
    }
  });

  it('no two of a man’s own three do the same thing', () => {
    for (const c of allCards()) {
      if (!c.valours?.length) continue;
      const shapes = c.valours.map((v) => `${v.target.pick}:${v.actions.map((a) => a.kind).join(',')}`);
      expect(new Set(shapes).size, `${c.name} repeats himself`).toBe(shapes.length);
    }
  });
});

describe('choosing is doing', () => {
  it('fires the one he picked, in the same turn he arrives', () => {
    const s = makeState({ playerHand: ['ravana'], aiBoard: { ratha: ['dushasana'] } });
    const foe = firstOf(s, 'ai', 'dushasana');
    const before = foe.currentPower;
    // Index 0 is Arrow Rain: the rank he faces.
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha', valour: 0 });
    expect(firstOf(s1, 'ai', 'dushasana').currentPower).toBe(before - 2);
    expect(hasEvent(s1, (e) => e.t === 'valour' && e.name === 'Arrow Rain')).toBe(true);
  });

  it('and a different pick does a different thing off the same card', () => {
    const s = makeState({ playerHand: ['ravana'], aiBoard: { ratha: ['dushasana'] } });
    const before = firstOf(s, 'ai', 'dushasana').currentPower;
    // Index 1 is Ten Heads: he steadies himself and you draw.
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha', valour: 1 });
    expect(firstOf(s1, 'ai', 'dushasana').currentPower, 'the foe should be untouched').toBe(before);
    expect(firstOf(s1, 'player', 'ravana').currentPower).toBe(getCard('ravana').basePower + 2);
  });

  it('costs no turn of its own, unlike the ability it replaced', () => {
    const s = makeState({ playerHand: ['ravana'], aiBoard: { ratha: ['dushasana'] } });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha', valour: 0 });
    expect(s1.activeSeat, 'the play and the valour are one turn').toBe('ai');
  });

  it('refuses an index that names no valour of his', () => {
    // Out of range would otherwise resolve to undefined and silently do
    // nothing, which is the quietest possible way to lose a decision.
    const s = makeState({ playerHand: ['ravana'] });
    expect(isLegalPlay(s, 'player', s.hands.player[0], 'ratha', 9)).toBe(false);
    expect(reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha', valour: 9 })).toBe(s);
  });

  it('offers every choice to the AI, or the sim cannot weigh them', () => {
    // A choice the move generator does not enumerate is a choice the AI can
    // never make and the lab reports as worthless.
    const s = makeState({ playerHand: ['ravana'], aiBoard: { ratha: ['dushasana'] } });
    s.activeSeat = 'player';
    const picked = new Set(
      legalMoves(s, 'player')
        .filter((m) => m.type === 'PLAY_CARD' && m.iid === s.hands.player[0])
        .map((m) => (m as { valour?: number }).valour),
    );
    expect(picked).toEqual(new Set([0, 1, 2]));
  });
});

describe('the traits that are not choices', () => {
  it('Bhima’s vow stays on his card, so Duryodhana’s answer is real', () => {
    // Duryodhana's card says "Answered by: Bhima, and by no one else". An
    // answer you might choose not to give is not an answer.
    const names = getCard('bhima').valours?.map((v) => v.name) ?? [];
    expect(names.join(' ')).not.toMatch(/vow/i);
    expect(getCard('bhima').effects.length).toBeGreaterThan(0);
  });

  it('and he now takes ONE of the seven, chosen, not all of them at once', () => {
    const s = makeState({
      playerHand: ['bhima'],
      aiBoard: { ratha: ['duryodhana'], gaja: ['dushasana'] },
    });
    const target = firstOf(s, 'ai', 'duryodhana');
    const s1 = reduce(s, {
      type: 'PLAY_CARD',
      iid: s.hands.player[0],
      row: 'ratha',
      targets: [target.iid],
      valour: 0,
    });
    const alive = ['duryodhana', 'dushasana'].filter((c) =>
      Object.values(s1.instances).some((u) => u.cardId === c && u.row),
    );
    expect(alive, 'the vow should take the one man you named').toEqual(['dushasana']);
  });
});
