// The lightning rod.
//
// Indra created Ghatotkacha "as a fit antagonist of Karna of unrivalled
// energy, IN CONSEQUENCE OF THE DART he had given unto Karna" (Adi CLV). The
// boy's entire purpose is to make that weapon land on the wrong man. Krishna
// danced on the terrace of his own chariot when it worked, and told a grieving
// Arjuna why: "Karna, his dart being baffled through Ghatotkacha, is already
// slain in battle. The man does not exist in this world that could not stay
// before Karna armed with that dart" (Drona CLXXX).
import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { getCard } from '@content/cards';
import { createRun, resolveBattle } from '@run/run';
import type { GameState } from '@engine/types';
import { makeState } from './helpers';

/**
 * Put an astra in the AI's hand and fire it at the player's chariot row.
 *
 * Two paths reach the same place and both must be covered: the battle only
 * suspends into 'awaitingCounter' when the defender is HOLDING an answer, and
 * most of the time nobody is, so the weapon resolves inside PLAY_CARD. The
 * first version of the interception lived only in the counter path, which
 * meant it never fired in the ordinary case. Assert we actually moved.
 */
function fireAstraAtPlayer(s: GameState, astraId: string): GameState {
  const iid = s.hands.ai.find((h) => s.instances[h].cardId === astraId);
  expect(iid, `${astraId} should be in the AI hand`).toBeDefined();
  s.activeSeat = 'ai';
  const fired = reduce(s, { type: 'PLAY_CARD', iid: iid!, row: 'ratha' });
  expect(fired, 'the astra should have been playable').not.toBe(s);
  if (fired.phase !== 'awaitingCounter') return fired;
  return reduce(fired, { type: 'ANSWER_ASTRA', seat: 'player', counter: false });
}

describe('an astra that gets through takes Ghatotkacha instead', () => {
  it('kills him and never touches the men it was aimed at', () => {
    const s = makeState({
      playerBoard: { gaja: ['ghatotkacha'], ratha: ['arjuna', 'yudhishthira'] },
      aiBoard: { ratha: ['karna'] },
      aiHand: ['brahmastra'],
    });
    const rod = s.board.player.gaja[0];
    const arjuna = s.board.player.ratha[0];
    const arjunaPower = s.instances[arjuna].currentPower;

    const out = fireAstraAtPlayer(s, 'brahmastra');

    expect(out.instances[rod], 'Ghatotkacha took it').toBeUndefined();
    expect(out.instances[arjuna], 'Arjuna is still standing').toBeDefined();
    expect(out.instances[arjuna].currentPower, 'and untouched').toBe(arjunaPower);
    expect(out.log.some((e) => e.t === 'drewAstra')).toBe(true);
  });

  it('suspends the weapon rather than spending it', () => {
    const s = makeState({
      playerBoard: { gaja: ['ghatotkacha'] },
      aiBoard: { ratha: ['karna'] },
      aiHand: ['brahmastra'],
    });
    const out = fireAstraAtPlayer(s, 'brahmastra');
    expect(out.bannedThisRun).toContain('brahmastra');
    // Suspension is always a SUBSET of the ban, so nothing has to consult two
    // lists to decide whether a card can be played right now.
    expect(out.suspendedThisRun).toContain('brahmastra');
  });

  it('and with him gone the next weapon lands normally', () => {
    // The control. Without this, every assertion above could be explained by
    // astras simply not working in this test setup.
    const s = makeState({
      playerBoard: { ratha: ['arjuna', 'yudhishthira'] },
      aiBoard: { ratha: ['karna'] },
      aiHand: ['brahmastra'],
    });
    const arjuna = s.board.player.ratha[0];
    const before = s.instances[arjuna].currentPower;

    const out = fireAstraAtPlayer(s, 'brahmastra');

    expect(out.log.some((e) => e.t === 'drewAstra'), 'nobody drew it').toBe(false);
    expect(out.suspendedThisRun, 'spent, not wasted').not.toContain('brahmastra');
    const after = out.instances[arjuna];
    expect(after === undefined || after.currentPower < before, 'the weapon bit').toBe(true);
  });
});

describe('a suspended weapon comes back when someone returns from penance', () => {
  it('is restored to the arsenal by a warrior coming off the mountain', () => {
    const run = createRun(5, 'pandava');
    run.banned = ['brahmastra'];
    run.suspended = ['brahmastra'];
    run.roster = [...run.roster, 'brahmastra'];
    // Somebody is away and due back at the index this battle advances into.
    run.away = [{ warrior: 'bhima', deityId: 'agni', returnsAt: run.index + 1, astra: null }] as never;

    const after = resolveBattle(run, { ...finished(), winner: 'player' } as GameState);

    expect(after.banned, 'the ban is lifted').not.toContain('brahmastra');
    expect(after.suspended, 'and the suspension with it').not.toContain('brahmastra');
    expect(after.roster, 'the weapon is back in the host').toContain('brahmastra');
  });

  it('stays suspended while nobody is coming back', () => {
    const run = createRun(5, 'pandava');
    run.banned = ['brahmastra'];
    run.suspended = ['brahmastra'];
    run.roster = [...run.roster, 'brahmastra'];
    run.away = [];

    const after = resolveBattle(run, { ...finished(), winner: 'player' } as GameState);

    expect(after.banned).toContain('brahmastra');
    expect(after.suspended).toContain('brahmastra');
  });

  it('does NOT lift a weapon that was truly spent', () => {
    // Fired at a target and consumed. Penance recovers waste, not expenditure.
    const run = createRun(5, 'pandava');
    run.banned = ['pashupatastra'];
    run.suspended = [];
    run.away = [{ warrior: 'bhima', deityId: 'agni', returnsAt: run.index + 1, astra: null }] as never;

    const after = resolveBattle(run, { ...finished(), winner: 'player' } as GameState);

    expect(after.banned).toContain('pashupatastra');
  });
});

/** A minimal finished battle state: won, nothing spent, no curses. */
function finished(): GameState {
  const s = makeState({});
  s.phase = 'battleEnd';
  s.winner = 'player';
  s.bannedThisRun = [];
  s.suspendedThisRun = [];
  s.curses = { player: [], ai: [] };
  return s;
}

describe('Ghatotkacha no longer out-muscles the men he was made to protect', () => {
  it('climbs by 1 a round, not 3', () => {
    const kw = getCard('ghatotkacha').keywords.find((k) => k.kind === 'nightGrowth');
    expect(kw).toEqual({ kind: 'nightGrowth', amount: 1 });
  });

  it('so he never passes Arjuna, who is the point of him', () => {
    const g = getCard('ghatotkacha');
    const growth = 1;
    const finalRound = g.basePower + growth * 2;
    expect(finalRound).toBeLessThan(getCard('arjuna').basePower);
  });

  it('and still draws the astra', () => {
    expect(getCard('ghatotkacha').keywords.some((k) => k.kind === 'drawsAstra')).toBe(true);
  });
});
