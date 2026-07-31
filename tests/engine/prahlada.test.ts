// Prahlada: the one asura Vishnu's weapons will not touch.
//
// He was a power-4 body with a clan bond and no effects, which is the most
// generic card in the game given to the least generic character in it. Krishna
// names him in the Gita among the forms the divine itself takes: "I am Prahlada
// among the Daityas" (Bhishma P. XXXIV). His father tried poison, the cliff,
// the elephants, fire and the sea, and Vishnu preserved him through every one.
import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { tickHazards } from '@engine/rounds';
import { getCard } from '@content/cards';
import { firstOf, hasEvent, makeState } from './helpers';

describe('the Vaishnava will not strike a host he stands in', () => {
  // Indrajit, NOT Ravana. Ravana carries armour 3, and armour absorbs the first
  // destroy attempt, so he survives the weapon for reasons that have nothing to
  // do with Prahlada. The first version of this used him and the control failed,
  // which would otherwise have let the real test pass for the wrong reason.
  function fire(defenders: string[]) {
    const s = makeState({
      playerHand: ['vaishnavastra'],
      playerBoard: { ratha: ['bhagadatta'] }, // Bhagadatta bears it
      aiBoard: { ratha: defenders },
    });
    s.activeSeat = 'player';
    const victim = firstOf(s, 'ai', 'indrajit');
    const after = reduce(s, {
      type: 'PLAY_CARD',
      iid: firstOf(s, 'player', 'vaishnavastra').iid,
      row: 'ratha',
      targets: [victim.iid],
    });
    return { after, victim };
  }

  it('spares the host while the boy stands', () => {
    const { after, victim } = fire(['indrajit', 'prahlada']);
    expect(after.instances[victim.iid], 'Indrajit lives').toBeDefined();
  });

  it('but takes the same warrior when the boy is not there, which is the control', () => {
    const { after, victim } = fire(['indrajit']);
    expect(after.instances[victim.iid], 'Indrajit falls').toBeUndefined();
  });
});

describe('the Narayana lifts for him as it does for Krishna', () => {
  it('calls off the storm without the host having to submit', () => {
    const s = makeState({ playerBoard: { ratha: ['ravana'], padati: ['prahlada'] } });
    s.hazards = [{ kind: 'narayana', victim: 'player', struck: 0 }];
    const before = s.instances[s.board.player.ratha[0]].currentPower;

    tickHazards(s);

    expect(s.hazards, 'the storm is gone').toHaveLength(0);
    expect(hasEvent(s, (e) => e.t === 'hazardLifted' && e.reason === 'prahlada')).toBe(true);
    expect(s.instances[s.board.player.ratha[0]].currentPower).toBe(before);
  });

  it('and strikes the same host without him', () => {
    const s = makeState({ playerBoard: { ratha: ['ravana'], padati: ['asura_horde'] } });
    s.hazards = [{ kind: 'narayana', victim: 'player', struck: 0 }];
    tickHazards(s);
    expect(s.hazards).toHaveLength(1);
  });
});

describe('he is no longer a demon in a demon line', () => {
  it('carries no clan bond, because refusing that is his whole story', () => {
    expect(getCard('prahlada').keywords).toEqual([]);
  });

  it('holds no astra and no weapon of his own', () => {
    const c = getCard('prahlada');
    expect(c.astraMastery ?? 0).toBe(0);
    expect(c.knownAstras ?? []).toEqual([]);
    expect(c.ability).toBeUndefined();
  });

  it('stands with the foot, not the chariots', () => {
    expect(getCard('prahlada').rows).toEqual(['padati']);
  });
});
