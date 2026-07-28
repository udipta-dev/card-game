// GUILE: the hand and the deck, not the board.
//
// Every effect action operated on warriors standing on the field, which is why
// every schemer in the game collapsed into a debuff: reducing enemy power was
// the only thing the engine could express. But the epic's answer to strength is
// almost never more strength. It is a disarm, a legalism, or a targeting
// restriction - Krishna calls his own engineered kills "the employment of
// means" (Drona CLXXXI).
import { describe, expect, it } from 'vitest';
import { reduce, isLegalPlay } from '@engine/reducer';
import { applyGlobalAction } from '@engine/effects/handlers';
import type { EffectCtx } from '@engine/effects/context';
import type { GameState, Seat } from '@engine/types';
import { makeState, hasEvent } from './helpers';

const ctx = (state: GameState, actorOwner: Seat = 'player'): EffectCtx => ({
  state,
  actorOwner,
  actorCardId: 'test',
  playedRow: null,
  actorIid: null,
  chosen: [],
});

describe('Shakuni stakes the game, he does not sap it', () => {
  it('makes both sides stake, with the dice loaded his way', () => {
    // A clean symmetrical wager measured 38.8%, WORSE than the debuff it
    // replaced, because a fair game gives the man who proposed it no edge.
    // Shakuni never proposed a fair one: they lose two, he loses one.
    const s = makeState({
      playerHand: ['shakuni', 'arjuna', 'bhima'],
      aiHand: ['karna', 'drona', 'kripa'],
    });
    const mineBefore = s.hands.player.length;
    const theirsBefore = s.hands.ai.length;
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'padati' });
    expect(s1.hands.player.length).toBe(mineBefore - 2); // Shakuni himself, plus his stake
    expect(s1.hands.ai.length).toBe(theirsBefore - 2);
    expect(hasEvent(s1, (e) => e.t === 'discard' && e.seat === 'ai')).toBe(true);
    expect(hasEvent(s1, (e) => e.t === 'discard' && e.seat === 'player')).toBe(true);
  });

  it('does not damage anybody', () => {
    const s = makeState({ playerHand: ['shakuni'], aiBoard: { ratha: ['karna'] } });
    const iid = s.board.ai.ratha[0];
    const before = s.instances[iid].currentPower;
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'padati' });
    expect(s1.instances[iid].currentPower).toBe(before);
  });
});

describe('denial is a targeting restriction, not damage', () => {
  it('a denied warrior cannot be committed', () => {
    const s = makeState({ aiHand: ['karna'] });
    const iid = s.hands.ai[0];
    expect(s.instances[iid].flags.has('denied')).toBe(false);
    applyGlobalAction(ctx(s), { kind: 'denyPlay', count: 1 });
    expect(s.instances[iid].flags.has('denied')).toBe(true);
    expect(isLegalPlay({ ...s, activeSeat: 'ai' }, 'ai', iid, 'ratha')).toBe(false);
  });

  it('leaves him unhurt: he is barred, not broken', () => {
    const s = makeState({ aiHand: ['karna'] });
    const iid = s.hands.ai[0];
    const before = s.instances[iid].currentPower;
    applyGlobalAction(ctx(s), { kind: 'denyPlay', count: 1 });
    expect(s.instances[iid].currentPower).toBe(before);
    expect(s.instances[iid]).toBeDefined();
  });
});

describe('draw is the counsel that never fought', () => {
  it('pulls from your own deck into your own hand', () => {
    const s = makeState({ playerDeck: ['bhima', 'nakula', 'sahadeva'] });
    const hand = s.hands.player.length;
    const deck = s.decks.player.length;
    applyGlobalAction(ctx(s), { kind: 'draw', count: 2, side: 'own' });
    expect(s.hands.player.length).toBe(hand + 2);
    expect(s.decks.player.length).toBe(deck - 2);
  });

  it('does nothing at all on an empty deck rather than throwing', () => {
    const s = makeState({ playerDeck: [] });
    const hand = s.hands.player.length;
    applyGlobalAction(ctx(s), { kind: 'draw', count: 3, side: 'own' });
    expect(s.hands.player.length).toBe(hand);
  });
});
