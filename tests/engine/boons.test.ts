// The boon and curse layer, after the canon sweep.
//
// Every assertion here traces to a line of Ganguli quoted in the card comment
// or in docs/canon-inventory.md. That matters more than usual for this file:
// the sweep found that the previous Gandhari card was built on an episode that
// is not in the text at all, and the only thing that catches that class of
// mistake is going back to the source and writing down what it actually says.
import { describe, expect, it } from 'vitest';
import { CURSES, afflict, cursedAgainstAstras } from '@engine/curses';
import { applyTargetAction, applyGlobalAction } from '@engine/effects/handlers';
import { resolveTargets } from '@engine/effects/targeting';
import { reduce } from '@engine/reducer';
import { getCard } from '@content/cards';
import type { EffectCtx } from '@engine/effects/context';
import type { GameState, Row, Seat } from '@engine/types';
import { makeState } from './helpers';

const ctx = (state: GameState, actorOwner: Seat = 'player', playedRow: Row | null = null): EffectCtx => ({
  state,
  actorOwner,
  actorCardId: 'test',
  playedRow,
  actorIid: null,
  chosen: [],
});

describe('Parashurama’s curse fires at the hour of need, not before', () => {
  // "it will never, at the time of need, when the hour of thy death comes,
  // occur to thy memory" -- Karna Parva XLII.
  it('leaves the astras working in an early round', () => {
    const s = makeState({ playerBoard: { ratha: ['arjuna'] } });
    s.round = 1;
    s.roundWins = { player: 0, ai: 0 };
    afflict(s, 'player', ['forgotten_mantra']);
    expect(s.curses.player).toContain('forgotten_mantra');
    expect(cursedAgainstAstras(s, 'player')).toBe(false);
  });

  it('and takes them away in the round that decides the battle', () => {
    const s = makeState({ playerBoard: { ratha: ['arjuna'] } });
    afflict(s, 'player', ['forgotten_mantra']);
    // One more round win on either side makes this the decider.
    s.roundWins = { player: 1, ai: 0 };
    expect(cursedAgainstAstras(s, 'player')).toBe(true);
  });

  it('while Shiva’s Gaze still bars them from the moment it lands', () => {
    // The distinction between the two curses is the entire point of the fix.
    const s = makeState({ playerBoard: { ratha: ['arjuna'] } });
    s.round = 1;
    s.roundWins = { player: 0, ai: 0 };
    afflict(s, 'player', ['shivas_gaze']);
    expect(cursedAgainstAstras(s, 'player')).toBe(true);
  });
});

describe('Gandhari’s curse makes you the slayer of your own kinsmen', () => {
  // "thou shalt be the slayer of thy own kinsmen!" -- Stri Parva XXV.
  it('turns the mightiest warrior on the next mightiest, and only him', () => {
    const s = makeState({ playerBoard: { ratha: ['arjuna', 'bhima', 'nakula'] } });
    const [first, second, third] = s.board.player.ratha;
    const powers = () => s.board.player.ratha.map((i) => s.instances[i].currentPower);
    const [p1, p2, p3] = powers();
    // Arjuna is a 10 and Bhima a 9, so the curse should find Bhima.
    expect(p1).toBeGreaterThan(p2);
    expect(p2).toBeGreaterThan(p3);

    afflict(s, 'player', ['kin_slayer']);

    expect(s.instances[first].currentPower, 'the slayer is untouched').toBe(p1);
    expect(s.instances[second].currentPower, 'the kinsman takes it').toBe(p2 - 5);
    expect(s.instances[third].currentPower, 'nobody else').toBe(p3);
  });

  it('does nothing at all with only one warrior standing', () => {
    const s = makeState({ playerBoard: { ratha: ['arjuna'] } });
    const iid = s.board.player.ratha[0];
    const before = s.instances[iid].currentPower;
    afflict(s, 'player', ['kin_slayer']);
    expect(s.instances[iid].currentPower).toBe(before);
  });

  it('and never bars astras, because that is not what she cursed him with', () => {
    expect(CURSES['kin_slayer'].barsAstras).toBeUndefined();
  });
});

describe('Shiva’s boon to Jayadratha checks four and lets the fifth through', () => {
  // "Except Dhananjaya, the son of Pritha, thou shalt in battle check the four
  // other sons of Pandu." -- Drona Parva XLI.
  function handOf(s: GameState, seat: Seat) {
    return s.hands[seat].map((iid) => ({
      iid,
      card: s.instances[iid].cardId,
      power: s.instances[iid].currentPower,
      denied: s.instances[iid].flags.has('denied'),
    }));
  }

  it('denies four of the enemy’s warriors but never their best', () => {
    const s = makeState({
      aiHand: ['arjuna', 'bhima', 'yudhishthira', 'nakula', 'sahadeva', 'satyaki'],
    });
    applyGlobalAction(ctx(s, 'player'), { kind: 'denyPlay', count: 4, sparingStrongest: true });

    const hand = handOf(s, 'ai');
    expect(hand.filter((h) => h.denied).length).toBe(4);

    const best = hand.reduce((a, b) => (b.power > a.power ? b : a));
    expect(best.card, 'the strongest in hand should be Arjuna here').toBe('arjuna');
    expect(best.denied, 'the gate does not hold against their best man').toBe(false);
  });

  it('without the exemption the same block can take the best man too', () => {
    // The control. If this did not differ, `sparingStrongest` would be doing
    // nothing and the test above would be passing for the wrong reason.
    const s = makeState({ aiHand: ['arjuna', 'bhima', 'nakula'] });
    applyGlobalAction(ctx(s, 'player'), { kind: 'denyPlay', count: 3 });
    expect(handOf(s, 'ai').every((h) => h.denied)).toBe(true);
  });

  it('is what the card actually does', () => {
    const deny = getCard('jayadratha').effects[0].actions[0];
    expect(deny).toEqual({ kind: 'denyPlay', count: 4, sparingStrongest: true });
  });
});

describe('Bhagadatta stands where Bhishma put him', () => {
  it('is a 9, above the men he beat and level with Bhima whom he felled', () => {
    expect(getCard('bhagadatta').basePower).toBe(9);
    expect(getCard('bhagadatta').basePower).toBe(getCard('bhima').basePower);
  });

  it('still holds the Vaishnava by inheritance rather than training', () => {
    const c = getCard('bhagadatta');
    expect(c.knownAstras).toContain('vaishnavastra');
    expect(c.astraMastery).toBe(1);
  });
});

describe('Antardhana hides a host instead of doing nothing at all', () => {
  // Found by the sweep, not by a bug report: the card set a 'hidden' flag and
  // NOTHING in the engine read it. Nine provisions bought a draw and a no-op,
  // which is why the sim played it 0.3% of the time and the Asura deck was
  // carrying it as dead weight.
  it('makes a vanished warrior unreachable by an enemy weapon', () => {
    const s = makeState({ aiBoard: { ratha: ['karna'] } });
    const iid = s.board.ai.ratha[0];

    expect(resolveTargets(ctx(s, 'player'), { pick: 'allEnemyUnits' })).toContain(iid);
    applyTargetAction(ctx(s, 'ai'), { kind: 'addFlag', flag: 'hidden' }, iid);
    expect(resolveTargets(ctx(s, 'player'), { pick: 'allEnemyUnits' })).not.toContain(iid);
  });

  it('hides him from every kind of targeting, not just the sweeping ones', () => {
    // The powerFloor lesson: an invariant honoured by some selectors and not
    // others is not an invariant. highestEnemyUnit was the obvious back door.
    const s = makeState({ aiBoard: { ratha: ['karna', 'drona'] } });
    for (const iid of s.board.ai.ratha) {
      applyTargetAction(ctx(s, 'ai'), { kind: 'addFlag', flag: 'hidden' }, iid);
    }
    const c = ctx(s, 'player');
    expect(resolveTargets(c, { pick: 'highestEnemyUnit' })).toEqual([]);
    expect(resolveTargets(c, { pick: 'enemyRow', row: 'ratha' })).toEqual([]);
    expect(resolveTargets(c, { pick: 'lineBothSides', row: 'ratha' })).toEqual([]);
    expect(resolveTargets(c, { pick: 'unitByCard', side: 'enemy', card: 'karna' })).toEqual([]);
  });

  it('but never hides him from his own side’s boons', () => {
    const s = makeState({ aiBoard: { ratha: ['karna'] } });
    const iid = s.board.ai.ratha[0];
    applyTargetAction(ctx(s, 'ai'), { kind: 'addFlag', flag: 'hidden' }, iid);
    // The AI is the owner here, so its own effects still find him.
    expect(resolveTargets(ctx(s, 'ai'), { pick: 'allOwnUnits' })).toContain(iid);
  });

  it('and cannot carry the hiding into the next round', () => {
    // Not by a flag reset: the round boundary destroys every warrior on the
    // field, so the vanished man is gone along with everyone else. Asserting
    // the instance is cleared is the honest version of "it wore off", and it
    // is why rounds.ts deliberately does NOT clear this flag.
    const s = makeState({ aiBoard: { ratha: ['karna'] } });
    const iid = s.board.ai.ratha[0];
    applyTargetAction(ctx(s, 'ai'), { kind: 'addFlag', flag: 'hidden' }, iid);
    expect(s.instances[iid].flags.has('hidden')).toBe(true);

    let next = reduce(s, { type: 'PASS', seat: 'player' });
    next = reduce(next, { type: 'PASS', seat: 'ai' });
    expect(next.round, 'the round should have advanced').toBe(s.round + 1);
    expect(next.instances[iid], 'the warrior left the field with everyone else').toBeUndefined();
  });
});
