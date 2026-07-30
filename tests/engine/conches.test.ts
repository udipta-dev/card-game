// The named conches, and the bottom tier generally.
//
// Fifty-five warriors at power 7 or below had no effect, no ability and nothing
// but a number, so half of every deck was interchangeable. The Gita's opening
// roll-call hands us six named signatures for free (Bhishma P. XXV), and states
// what they do: the blare "rent the hearts of the Dhartarashtras".
import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { cardOnBoard, rowPower } from '@engine/queries';
import { attemptDestroy } from '@engine/keywords';
import { runBoardTrigger } from '@engine/events';
import { getCard } from '@content/cards';
import { attachBoon, makeState, firstOf } from './helpers';

describe('the twins answer each other across the line', () => {
  it('Sughosa lifts Nakula’s own chariot line', () => {
    const s = makeState({
      playerHand: ['nakula'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { ratha: ['karna'] },
    });
    s.activeSeat = 'player';
    const before = rowPower(s, 'player', 'ratha');
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: firstOf(s, 'player', 'nakula').iid, row: 'ratha' });
    // His own 6 plus the +2 the conch puts on the row.
    expect(rowPower(s1, 'player', 'ratha')).toBe(before + 6 + 2);
  });

  it('Manipushpaka leans on the enemy’s instead, so they are not one card twice', () => {
    const s = makeState({
      playerHand: ['sahadeva'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { ratha: ['karna'] },
    });
    s.activeSeat = 'player';
    const ownBefore = rowPower(s, 'player', 'ratha');
    const foeBefore = rowPower(s, 'ai', 'ratha');
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: firstOf(s, 'player', 'sahadeva').iid, row: 'ratha' });

    expect(rowPower(s1, 'ai', 'ratha'), 'the enemy line sags').toBe(foeBefore - 1);
    expect(rowPower(s1, 'player', 'ratha'), 'his own gains only his body').toBe(ownBefore + 6);
  });

  it('and Sahadeva still cuts down Shakuni, which must not regress', () => {
    const s = makeState({ playerHand: ['sahadeva'], aiBoard: { ratha: ['shakuni'] } });
    s.activeSeat = 'player';
    const shakuni = firstOf(s, 'ai', 'shakuni');
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: firstOf(s, 'player', 'sahadeva').iid, row: 'ratha' });
    expect(s1.instances[shakuni.iid]).toBeUndefined();
  });
});

describe('the bottom tier is less interchangeable than it was', () => {
  it('Nakula is no longer a bare number', () => {
    expect(getCard('nakula').effects.length).toBeGreaterThan(0);
  });

  it('the twins do different things, which is the whole point', () => {
    const n = JSON.stringify(getCard('nakula').effects);
    const s = JSON.stringify(getCard('sahadeva').effects);
    expect(n).not.toEqual(s);
  });
});

describe('Srutayudha: unkillable until he aims at a man who will not fight', () => {
  // Varuna's mace and its published condition (Drona P. XCII): "This mace
  // should not be hurled at one who is not engaged in fight. If hurled at such
  // a person, it will come back and fall upon thyself." He threw it at Krishna,
  // who had vowed not to raise a weapon, and it rebounded and killed him.
  it('cannot be destroyed by ordinary means', () => {
    const s = makeState({ aiBoard: { ratha: ['srutayudha'] } });
    expect(attemptDestroy(s, 'player', s.board.ai.ratha[0])).toBe(false);
  });

  it('destroys himself once the enemy fields the one man who will not fight', () => {
    const s = makeState({
      aiBoard: { ratha: ['srutayudha'] },
      playerBoard: { ratha: ['arjuna'] },
    });
    const him = s.board.ai.ratha[0];
    attachBoon(s, s.board.player.ratha[0], 'krishna_charioteer');

    runBoardTrigger(s, 'onRoundEnd');
    expect(s.instances[him], 'the mace came back').toBeUndefined();
  });

  it('and lives if that man is not there, which is the control', () => {
    const s = makeState({
      aiBoard: { ratha: ['srutayudha'] },
      playerBoard: { ratha: ['arjuna'] },
    });
    const him = s.board.ai.ratha[0];
    runBoardTrigger(s, 'onRoundEnd');
    expect(s.instances[him]).toBeDefined();
  });
});

describe('cardOnBoard sees what rides with a warrior', () => {
  // It walked board units only, so any condition naming an attached card was
  // permanently false and every card written against Krishna was silently
  // inert. Srutayudha is the first card that depends on this being right.
  it('finds an attached boon, not just units standing in a row', () => {
    const s = makeState({ playerBoard: { ratha: ['arjuna'] } });
    expect(cardOnBoard(s, 'player', 'krishna_charioteer', 'own')).toBe(false);
    attachBoon(s, s.board.player.ratha[0], 'krishna_charioteer');
    expect(cardOnBoard(s, 'player', 'krishna_charioteer', 'own')).toBe(true);
  });

  it('still finds ordinary units, which must not regress', () => {
    const s = makeState({ playerBoard: { ratha: ['arjuna'] } });
    expect(cardOnBoard(s, 'player', 'arjuna', 'own')).toBe(true);
    expect(cardOnBoard(s, 'player', 'bhima', 'own')).toBe(false);
  });
});
