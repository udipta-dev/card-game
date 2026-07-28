// The Narayanastra: the only weapon in the game that does not resolve.
//
// Drona Parva CC. It "never comes back without effecting the destruction of
// the foe", it grows with resistance, and Krishna's order was to drop every
// weapon and lie down: "if you stand weaponless on the earth, this weapon
// will not slay you". Bhima refused, kept fighting, and was mauled.
import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { tickHazards } from '@engine/rounds';
import { seatPower } from '@engine/queries';
import { makeState, hasEvent } from './helpers';

describe('Narayanastra hangs over the field', () => {
  it('places a standing threat rather than dealing damage now', () => {
    const s = makeState({
      playerHand: ['narayanastra'],
      playerBoard: { ratha: ['ashwatthama'] }, // his by name
      aiBoard: { ratha: ['arjuna'], gaja: ['bhima'] },
    });
    const before = seatPower(s, 'ai');
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });
    // Nothing has been hurt YET.
    expect(seatPower(s1, 'ai')).toBe(before);
    expect(s1.hazards).toHaveLength(1);
    expect(s1.hazards[0]).toMatchObject({ kind: 'narayana', victim: 'ai', struck: 0 });
  });

  it('strikes harder every round: 4, then 6, then 8', () => {
    const s = makeState({ aiBoard: { ratha: ['arjuna'] } });
    s.hazards.push({ kind: 'narayana', victim: 'ai', struck: 0 });
    const iid = s.board.ai.ratha[0];

    const p0 = s.instances[iid].currentPower;
    tickHazards(s);
    expect(p0 - s.instances[iid].currentPower).toBe(4);

    s.instances[iid].currentPower = 20; // restore so the next hit is readable
    tickHazards(s);
    expect(20 - s.instances[iid].currentPower).toBe(6);

    s.instances[iid].currentPower = 20;
    tickHazards(s);
    expect(20 - s.instances[iid].currentPower).toBe(8);
  });

  it('is lifted by laying down arms, which is the only way out', () => {
    const s = makeState({ aiBoard: { ratha: ['arjuna'] } });
    s.hazards.push({ kind: 'narayana', victim: 'ai', struck: 1 });
    const s1 = reduce({ ...s, activeSeat: 'ai' }, { type: 'PASS', seat: 'ai' });
    expect(s1.hazards).toHaveLength(0);
    expect(hasEvent(s1, (e) => e.t === 'hazardLifted' && e.reason === 'submission')).toBe(true);
  });

  it('is NOT lifted when the other side passes', () => {
    const s = makeState({ aiBoard: { ratha: ['arjuna'] } });
    s.hazards.push({ kind: 'narayana', victim: 'ai', struck: 0 });
    const s1 = reduce(s, { type: 'PASS', seat: 'player' });
    expect(s1.hazards).toHaveLength(1);
  });

  it('cannot be answered by a counter-astra at all', () => {
    const s = makeState({
      playerHand: ['narayanastra'],
      playerBoard: { ratha: ['ashwatthama'] },
      aiBoard: { ratha: ['arjuna'] },
      aiHand: ['brahmastra'],
    });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });
    // No counter prompt: there is no answer to it but submission.
    expect(s1.phase).toBe('playing');
    expect(s1.hazards).toHaveLength(1);
  });
});
