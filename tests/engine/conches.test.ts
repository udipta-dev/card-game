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
import { applyGlobalAction, applyTargetAction } from '@engine/effects/handlers';
import type { EffectCtx } from '@engine/effects/context';
import type { GameState, Seat } from '@engine/types';

const ctx = (state: GameState, actorOwner: Seat = 'player'): EffectCtx => ({
  state, actorOwner, actorCardId: 'test', playedRow: null, actorIid: null, chosen: [],
});
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
    // His own 6, the +2 the conch puts on the row, and the +1 he rallies onto
    // Arjuna, who was already standing there. The rally is new: bond used to
    // take its bonus onto Nakula's own head and leave the line untouched.
    expect(rowPower(s1, 'player', 'ratha')).toBe(before + 6 + 2 + 1);
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
    // His body, plus the +1 he rallies onto Arjuna. The point of the test is
    // that Manipushpaka itself leans on the ENEMY line rather than lifting his
    // own, and that still holds: the +1 is the rally, not the conch.
    expect(rowPower(s1, 'player', 'ratha'), 'his own gains his body and the rally').toBe(
      ownBefore + 6 + 1,
    );
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

describe('deprived of his chariot: demotion, not death', () => {
  // Ganguli's "deprived of his car" is 1883 English for ratha, not a motor
  // vehicle, so the cards say chariot. 69 paragraphs use the phrase, against 50
  // for cutting off an arm or a head: it is the commonest decisive outcome in
  // the war that is not a death, and nothing in this engine moved a unit
  // between rows until now.
  it('moves the man to the foot row and leaves his power alone', () => {
    const s = makeState({ aiBoard: { ratha: ['karna'] } });
    const iid = s.board.ai.ratha[0];
    const before = s.instances[iid].currentPower;

    applyTargetAction(ctx(s, 'player'), { kind: 'dismount' }, iid);

    expect(s.board.ai.ratha, 'gone from the chariots').not.toContain(iid);
    expect(s.board.ai.padati, 'standing with the foot').toContain(iid);
    expect(s.instances[iid].row).toBe('padati');
    // He is worse on foot. Without this the whole action is a no-op, because
    // seatPower sums every row equally and he keeps his power wherever he
    // stands: the first build of this measured Bahlika DOWN 47.5% -> 39.3%.
    expect(s.instances[iid].currentPower, 'fighting on foot now').toBe(before - 2);
  });

  it('costs him whatever the chariot row was carrying', () => {
    // The real point of the mechanic: he keeps his power and loses the buff.
    const s = makeState({ aiBoard: { ratha: ['karna'] } });
    const iid = s.board.ai.ratha[0];
    s.rowMods.push({ seat: 'ai', row: 'ratha', amount: 4, duration: 'round', source: 'test' });
    const withBuff = rowPower(s, 'ai', 'ratha');

    applyTargetAction(ctx(s, 'player'), { kind: 'dismount' }, iid);

    expect(rowPower(s, 'ai', 'ratha'), 'the empty chariot row scores nothing').toBe(0);
    expect(rowPower(s, 'ai', 'padati'), 'without the bonus, and on foot').toBe(withBuff - 4 - 2);
  });

  it('does nothing to a man already on foot', () => {
    const s = makeState({ aiBoard: { padati: ['kaurava_infantry'] } });
    const iid = s.board.ai.padati[0];
    applyTargetAction(ctx(s, 'player'), { kind: 'dismount' }, iid);
    expect(s.board.ai.padati).toContain(iid);
    expect(s.board.ai.padati.filter((x) => x === iid), 'not duplicated').toHaveLength(1);
  });
});

describe('Vikarna lifts what was unjustly laid on his own side', () => {
  // In the dice hall, with a hundred brothers and every elder silent, he alone
  // argued the wager was void and Draupadi unwon (Sabha P. LXVIII).
  it('strips every penalty from your rows and leaves the enemy’s alone', () => {
    const s = makeState({ playerBoard: { ratha: ['dushasana'] }, aiBoard: { ratha: ['arjuna'] } });
    s.rowMods.push(
      { seat: 'player', row: 'ratha', amount: -3, duration: 'lingering', source: 'brahmastra' },
      { seat: 'player', row: 'gaja', amount: -2, duration: 'round', source: 'test' },
      { seat: 'ai', row: 'ratha', amount: -4, duration: 'round', source: 'ours' },
    );

    applyGlobalAction(ctx(s, 'player'), { kind: 'cleanse' });

    expect(s.rowMods.filter((m) => m.seat === 'player'), 'ours are gone').toHaveLength(0);
    expect(s.rowMods.filter((m) => m.seat === 'ai'), 'theirs are not').toHaveLength(1);
  });

  it('never strips a BUFF, only a penalty', () => {
    // Otherwise he undoes his own side's conches, which would be absurd.
    const s = makeState({ playerBoard: { ratha: ['dushasana'] } });
    s.rowMods.push(
      { seat: 'player', row: 'ratha', amount: 4, duration: 'round', source: 'conch' },
      { seat: 'player', row: 'ratha', amount: -4, duration: 'round', source: 'scorch' },
    );

    applyGlobalAction(ctx(s, 'player'), { kind: 'cleanse' });

    expect(s.rowMods).toHaveLength(1);
    expect(s.rowMods[0].amount).toBe(4);
  });

  it('restores the row power the penalty was costing', () => {
    const s = makeState({ playerBoard: { ratha: ['dushasana'] } });
    const clean = rowPower(s, 'player', 'ratha');
    s.rowMods.push({ seat: 'player', row: 'ratha', amount: -4, duration: 'lingering', source: 'x' });
    expect(rowPower(s, 'player', 'ratha')).toBeLessThan(clean);

    applyGlobalAction(ctx(s, 'player'), { kind: 'cleanse' });
    expect(rowPower(s, 'player', 'ratha')).toBe(clean);
  });

  it('is what the card does', () => {
    expect(getCard('vikarna').effects[0].actions[0]).toEqual({ kind: 'cleanse' });
  });
});
