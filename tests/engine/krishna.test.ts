// Krishna: the card that changes rules instead of adding power.
//
// He was a +3 attachment for 10 provisions and measured 36.5%, the worst card
// in the game, because no number is right for Vishnu incarnate. He now adds 1
// and answers three named weapons, each of them sourced, and in the deciding
// round he takes the greatest man opposite him. Every assertion maps to
// something he actually does in the text.
import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { tickHazards } from '@engine/rounds';
import { legalMoves } from '@engine/selectors';
import { attemptDestroy, powerFloor } from '@engine/keywords';
import { getCard } from '@content/cards';
import { DECKS, deckProvisions } from '@content/decks';
import type { GameState } from '@engine/types';
import { attachBoon, firstOf, hasEvent, makeState } from './helpers';

describe('Krishna calls off the Narayanastra for nothing', () => {
  // "Speedily lay down your weapons, all of you, and alight from your
  // vehicles" -- Drona CC. Everyone else buys that escape by passing and
  // losing the round; he is the man who knew the terms.
  function underTheWeapon(withKrishna: boolean): GameState {
    const s = makeState({ playerBoard: { ratha: ['arjuna', 'bhima'] } });
    s.hazards = [{ kind: 'narayana', victim: 'player', struck: 0 }];
    if (withKrishna) attachBoon(s, s.board.player.ratha[0], 'krishna_charioteer');
    return s;
  }

  it('lifts the weapon instead of taking the hit', () => {
    const s = underTheWeapon(true);
    const before = s.board.player.ratha.map((i) => s.instances[i].currentPower);
    tickHazards(s);

    expect(s.hazards, 'the weapon is gone from the field').toHaveLength(0);
    expect(hasEvent(s, (e) => e.t === 'hazardLifted' && e.reason === 'krishna')).toBe(true);
    expect(s.board.player.ratha.map((i) => s.instances[i].currentPower)).toEqual(before);
  });

  it('and without him the same host is struck, which is the control', () => {
    const s = underTheWeapon(false);
    const before = s.board.player.ratha.map((i) => s.instances[i].currentPower);
    tickHazards(s);

    expect(s.hazards, 'still hanging over them').toHaveLength(1);
    expect(s.board.player.ratha.map((i) => s.instances[i].currentPower)).not.toEqual(before);
  });
});

describe('the counsel strips a warrior of what makes him unkillable', () => {
  // Drona laying down his bow, Duryodhana's thighs, Jayadratha's sunset. None
  // of them was killed by a better weapon.
  it('kills Bhishma, whom nothing in the game can otherwise touch', () => {
    const s = makeState({ aiBoard: { ratha: ['bhishma'] } });
    const iid = s.board.ai.ratha[0];

    // Control first: he is untouchable and cannot be worn below 1.
    expect(attemptDestroy(s, 'player', iid)).toBe(false);
    expect(powerFloor(s, s.instances[iid])).toBe(1);

    s.instances[iid].flags.add('stripped');

    expect(powerFloor(s, s.instances[iid]), 'the floor goes too').toBe(0);
    expect(attemptDestroy(s, 'player', iid)).toBe(true);
    expect(s.instances[iid]).toBeUndefined();
  });

  it('works on every protection, not just the one it was written for', () => {
    // deathless (Ashwatthama), diamond-body (Duryodhana), armor (Karna).
    for (const [card, setup] of [
      ['ashwatthama', () => {}],
      ['duryodhana', (s: GameState, i: string) => s.instances[i].flags.add('diamond-body')],
      ['karna', () => {}],
    ] as const) {
      const s = makeState({ aiBoard: { ratha: [card] } });
      const iid = s.board.ai.ratha[0];
      setup(s, iid);
      expect(attemptDestroy(s, 'player', iid), `${card} should resist`).toBe(false);

      const s2 = makeState({ aiBoard: { ratha: [card] } });
      const iid2 = s2.board.ai.ratha[0];
      setup(s2, iid2);
      s2.instances[iid2].flags.add('stripped');
      expect(attemptDestroy(s2, 'player', iid2), `${card} should fall`).toBe(true);
    }
  });

  it('leaves an ordinary warrior exactly as killable as before', () => {
    const s = makeState({ aiBoard: { ratha: ['nakula'] } });
    const iid = s.board.ai.ratha[0];
    expect(attemptDestroy(s, 'player', iid)).toBe(true);
  });
});

describe('the counsel is a crisis, not an opening move', () => {
  // It resolves as he ARRIVES. It used to be a separate once-per-battle move
  // gated to the deciding round, and it fired zero times in 300 matches: the
  // board clears every round and takes attached boons with it, so Krishna never
  // lives to a second turn, and the ability needed two.
  function field(round: number, wins: { player: number; ai: number }) {
    const s = makeState({
      playerHand: ['krishna_charioteer'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { ratha: ['bhishma', 'dushasana'] },
    });
    s.round = round;
    s.roundWins = wins;
    s.activeSeat = 'player';
    return s;
  }

  it('takes the greatest enemy with him in the deciding round', () => {
    const s = field(2, { player: 1, ai: 0 });
    const bhishma = firstOf(s, 'ai', 'bhishma');
    // Nothing in the game can otherwise touch him.
    expect(attemptDestroy(s, 'player', bhishma.iid)).toBe(false);

    const krishna = firstOf(s, 'player', 'krishna_charioteer');
    const s1 = reduce(s, {
      type: 'PLAY_CARD',
      iid: krishna.iid,
      row: 'ratha',
      targets: [s.board.player.ratha[0]],
    });

    expect(hasEvent(s1, (e) => e.t === 'stripped')).toBe(true);
    expect(s1.instances[bhishma.iid], 'Bhishma is gone').toBeUndefined();
  });

  it('and does nothing to them in an early round, which is the whole gate', () => {
    const s = field(1, { player: 0, ai: 0 });
    const bhishma = firstOf(s, 'ai', 'bhishma');
    const krishna = firstOf(s, 'player', 'krishna_charioteer');
    const s1 = reduce(s, {
      type: 'PLAY_CARD',
      iid: krishna.iid,
      row: 'ratha',
      targets: [s.board.player.ratha[0]],
    });

    expect(s1.instances[bhishma.iid], 'still standing').toBeDefined();
    expect(hasEvent(s1, (e) => e.t === 'stripped')).toBe(false);
    // But the shield half applies from the moment he arrives.
    expect(s1.instances[s.board.player.ratha[0]].flags.has('krishna-guarded')).toBe(true);
  });
});

describe('Krishna stays a Pandava card and stays affordable', () => {
  it('belongs to the Pandavas and nobody else', () => {
    expect(getCard('krishna_charioteer').house).toBe('pandava');
    for (const deck of Object.values(DECKS)) {
      if (deck.house === 'pandava') continue;
      expect(deck.cards, `${deck.id} must not hold him`).not.toContain('krishna_charioteer');
    }
  });

  it('adds almost no power, which is the entire point of the rework', () => {
    const buff = getCard('krishna_charioteer').effects[0].actions[0];
    expect(buff).toEqual({ kind: 'buff', amount: 1 });
  });

  it('leaves every starter deck inside the budget', () => {
    for (const deck of Object.values(DECKS)) {
      expect(deckProvisions(deck), `${deck.id}`).toBeLessThanOrEqual(170);
    }
  });
});

describe('an attached card can still act, which was a real bug', () => {
  // Found while building Krishna and kept after his ability was dropped: the
  // enumeration walked board units only, so nothing riding with a warrior could
  // ever act, and boons never got initInstanceRuntime so they had no charges.
  // Both are latent today and both would have bitten the first shastra we give
  // an ability to. The Ravana case guards the path that already worked.
  it('offers a fielded warrior his own ability', () => {
    const s = makeState({ playerBoard: { ratha: ['ravana'] } });
    s.activeSeat = 'player';
    const iid = s.board.player.ratha[0];
    expect(legalMoves(s, 'player').some((m) => m.type === 'USE_ABILITY' && m.iid === iid)).toBe(true);
  });

  it('gives an attached boon its runtime, so it could hold charges', () => {
    const s = makeState({ playerBoard: { ratha: ['arjuna'] } });
    const boon = attachBoon(s, s.board.player.ratha[0], 'krishna_charioteer');
    expect(s.instances[boon].counters).toBeDefined();
  });
});
