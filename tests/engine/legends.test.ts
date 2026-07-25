// The figures who stood apart. Each reuses a primitive proven elsewhere, so
// these tests check the wiring, not the mechanic.
import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { attemptDestroy } from '@engine/keywords';
import { unitsOf } from '@engine/queries';
import { firstOf, makeState } from './helpers';

describe('Jarasandha: only Bhima can tear him apart', () => {
  it('cannot be slain while Bhima is off the board', () => {
    const s = makeState({ aiBoard: { ratha: ['jarasandha'] } });
    const j = firstOf(s, 'ai', 'jarasandha');
    attemptDestroy(s, 'player', j.iid);
    expect(s.instances[j.iid]).toBeDefined(); // icchamrityu holds
  });

  it('falls once Bhima stands', () => {
    const s = makeState({
      playerBoard: { ratha: ['bhima'] },
      aiBoard: { ratha: ['jarasandha'] },
    });
    const j = firstOf(s, 'ai', 'jarasandha');
    attemptDestroy(s, 'player', j.iid);
    expect(s.instances[j.iid]).toBeUndefined();
  });
});

describe('Barbarika: the arrows would take everyone, so he takes his own head', () => {
  it('rains on the whole field and then removes himself', () => {
    const s = makeState({
      playerHand: ['barbarika'],
      aiBoard: { ratha: ['duryodhana'], gaja: ['dushasana'] },
      playerBoard: { padati: ['nakula'] },
    });
    const duryodhana = firstOf(s, 'ai', 'duryodhana');
    const nakula = firstOf(s, 'player', 'nakula');
    const before = { d: duryodhana.currentPower, n: nakula.currentPower };

    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });

    // The storm hits both hosts, then Barbarika is gone from the board.
    expect(s1.instances[duryodhana.iid].currentPower).toBe(before.d - 3);
    expect(s1.instances[nakula.iid].currentPower).toBe(before.n - 3);
    expect(unitsOf(s1, 'player').some((u) => u.cardId === 'barbarika')).toBe(false);
  });
});

describe('Shishupala: beyond harm until Krishna takes the field', () => {
  it('cannot be slain before Krishna is played', () => {
    const s = makeState({ aiBoard: { ratha: ['shishupala'] } });
    const sh = firstOf(s, 'ai', 'shishupala');
    attemptDestroy(s, 'player', sh.iid);
    expect(s.instances[sh.iid]).toBeDefined();
  });
});
