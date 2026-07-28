// The undying floor, reduce-to, and line targeting.
//
// The floor is the interesting one. Before it, "cannot be killed" and "cannot
// be reduced to nothing" were different things, and only the first was true:
// Bhishma could be ground to 0 power and left standing on the field
// contributing nothing. Unkillable AND useless is the worst of both, and it
// made attacking him pointless rather than costly.
import { describe, expect, it } from 'vitest';
import { powerFloor } from '@engine/keywords';
import { rowPower } from '@engine/queries';
import { afflict } from '@engine/curses';
import { applyTargetAction } from '@engine/effects/handlers';
import { resolveTargets } from '@engine/effects/targeting';
import type { EffectCtx } from '@engine/effects/context';
import type { GameState, Row, Seat } from '@engine/types';
import { makeState } from './helpers';

/** A minimal effect context, so tests drive the real handlers, not a mock. */
const ctx = (state: GameState, actorOwner: Seat = 'player', playedRow: Row | null = null): EffectCtx => ({
  state,
  actorOwner,
  actorCardId: 'test',
  playedRow,
  actorIid: null,
  chosen: [],
});

describe('a warrior who cannot be killed cannot be reduced to nothing', () => {
  it('grinds Bhishma down to 1 and no further', () => {
    const s = makeState({ playerBoard: { ratha: ['bhishma'] } });
    const iid = s.board.player.ratha[0];
    expect(powerFloor(s, s.instances[iid])).toBe(1);

    // Hit him for far more than he has, through the real damage handler.
    applyTargetAction(ctx(s, 'ai'), { kind: 'damage', amount: 99 }, iid);
    expect(s.instances[iid].currentPower).toBe(1);

    // And again. He does not go to zero and he does not go negative.
    applyTargetAction(ctx(s, 'ai'), { kind: 'damage', amount: 99 }, iid);
    expect(s.instances[iid].currentPower).toBe(1);
  });

  it('cannot be zeroed by setPower either, which was the back door', () => {
    const s = makeState({ playerBoard: { ratha: ['bhishma'] } });
    const iid = s.board.player.ratha[0];
    applyTargetAction(ctx(s, 'ai'), { kind: 'setPower', value: 0 }, iid);
    expect(s.instances[iid].currentPower).toBe(1);
  });

  it('drops the floor to 0 once Shikhandi takes the field', () => {
    const s = makeState({ playerBoard: { ratha: ['bhishma', 'shikhandi'] } });
    const bhishma = s.board.player.ratha[0];
    // His condition is met, so he is an ordinary man again in every respect.
    expect(powerFloor(s, s.instances[bhishma])).toBe(0);
  });

  it('holds the floor for the deathless too', () => {
    const s = makeState({ playerBoard: { ratha: ['ashwatthama'] } });
    const iid = s.board.player.ratha[0];
    expect(powerFloor(s, s.instances[iid])).toBe(1);
  });

  it('leaves ordinary warriors able to reach zero', () => {
    const s = makeState({ playerBoard: { ratha: ['nakula'] } });
    expect(powerFloor(s, s.instances[s.board.player.ratha[0]])).toBe(0);
  });
});

describe('reduceTo lowers, and only lowers', () => {
  it('binds the greatest warrior down to one', () => {
    const s = makeState({ playerBoard: { ratha: ['arjuna'] } });
    const iid = s.board.player.ratha[0];
    expect(s.instances[iid].currentPower).toBeGreaterThan(1);
    applyTargetAction(ctx(s, 'ai'), { kind: 'reduceTo', value: 1 }, iid);
    expect(s.instances[iid].currentPower).toBe(1);
  });

  it('never RAISES a weak warrior, which setPower would', () => {
    const s = makeState({ playerBoard: { padati: ['pandava_infantry'] } });
    const iid = s.board.player.padati[0];
    const before = s.instances[iid].currentPower;
    applyTargetAction(ctx(s), { kind: 'reduceTo', value: 9 }, iid);
    expect(s.instances[iid].currentPower).toBe(before);
    // The distinction from setPower is the whole reason this action exists.
    applyTargetAction(ctx(s), { kind: 'setPower', value: 9 }, iid);
    expect(s.instances[iid].currentPower).toBe(9);
  });

  it('still respects the undying floor', () => {
    const s = makeState({ playerBoard: { ratha: ['bhishma'] } });
    const iid = s.board.player.ratha[0];
    applyTargetAction(ctx(s, 'ai'), { kind: 'reduceTo', value: 0 }, iid);
    expect(s.instances[iid].currentPower).toBe(1);
  });
});

describe('a divyastra devastates a line, not a side', () => {
  it('hits both hosts in the row it is aimed at', () => {
    const s = makeState({
      playerBoard: { ratha: ['arjuna'], gaja: ['bhima'] },
      aiBoard: { ratha: ['karna', 'drona'], gaja: ['duryodhana'] },
    });
    const hit = resolveTargets(ctx(s), { pick: 'lineBothSides', row: 'ratha' });
    // Two enemy chariots AND our own one, because the chariots burn whoever
    // they belong to.
    expect(hit.length).toBe(3);
    expect(hit).toContain(s.board.player.ratha[0]);
    expect(hit).toContain(s.board.ai.ratha[0]);
    expect(hit).toContain(s.board.ai.ratha[1]);
    // The elephants, on either side, are untouched.
    expect(hit).not.toContain(s.board.player.gaja[0]);
    expect(hit).not.toContain(s.board.ai.gaja[0]);
  });

  it('strikes the enemy before the firer’s own men', () => {
    const s = makeState({
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { ratha: ['karna'] },
    });
    const hit = resolveTargets(ctx(s), { pick: 'lineBothSides', row: 'ratha' });
    expect(hit[0]).toBe(s.board.ai.ratha[0]);
  });
});

describe('Sanmohana stupefies rather than kills', () => {
  it('a stupefied line contributes nothing, without anyone being hurt', () => {
    const s = makeState({ aiBoard: { ratha: ['karna', 'drona'] } });
    const before = rowPower(s, 'ai', 'ratha');
    expect(before).toBeGreaterThan(0);

    for (const iid of s.board.ai.ratha) {
      applyTargetAction(ctx(s), { kind: 'addFlag', flag: 'stupefied' }, iid);
    }
    // The line is worth nothing this round...
    expect(rowPower(s, 'ai', 'ratha')).toBe(0);
    // ...but nobody has been damaged, and nobody has been removed.
    for (const iid of s.board.ai.ratha) {
      expect(s.instances[iid]).toBeDefined();
      expect(s.instances[iid].currentPower).toBeGreaterThan(0);
    }
  });

  it('works on a warrior no damage could shift', () => {
    // Bhishma floors at 1 and cannot be removed, so damage can never take him
    // off the scoreboard. Stupefaction can.
    const s = makeState({ aiBoard: { ratha: ['bhishma'] } });
    const iid = s.board.ai.ratha[0];
    applyTargetAction(ctx(s), { kind: 'damage', amount: 99 }, iid);
    expect(rowPower(s, 'ai', 'ratha')).toBe(1); // still scoring
    applyTargetAction(ctx(s), { kind: 'addFlag', flag: 'stupefied' }, iid);
    expect(rowPower(s, 'ai', 'ratha')).toBe(0);
  });
});

describe('the undying floor holds on EVERY path, not just the handlers', () => {
  // Found by audit: five places wrote currentPower and only the effect handlers
  // respected the floor. A curse could grind Bhishma to nothing when no weapon
  // in the game could. An invariant enforced in four places out of seven is
  // not an invariant.
  it('survives Broken Bowstring, which took 4 straight off the top', () => {
    const s = makeState({ playerBoard: { ratha: ['bhishma'] } });
    const iid = s.board.player.ratha[0];
    s.instances[iid].currentPower = 2;
    afflict(s, 'player', ['broken_bowstring']);
    expect(s.instances[iid].currentPower).toBe(1);
  });

  it('survives Withered Host', () => {
    const s = makeState({ playerBoard: { ratha: ['bhishma'] } });
    const iid = s.board.player.ratha[0];
    s.instances[iid].currentPower = 1;
    afflict(s, 'player', ['withered_host']);
    expect(s.instances[iid].currentPower).toBe(1);
  });

  it('survives the Forgotten Mantra', () => {
    const s = makeState({ playerBoard: { ratha: ['bhishma'] } });
    const iid = s.board.player.ratha[0];
    s.instances[iid].currentPower = 2;
    afflict(s, 'player', ['forgotten_mantra']);
    expect(s.instances[iid].currentPower).toBe(1);
  });

  it('and an ordinary warrior still reaches zero on those same paths', () => {
    const s = makeState({ playerBoard: { ratha: ['nakula'] } });
    const iid = s.board.player.ratha[0];
    s.instances[iid].currentPower = 1;
    afflict(s, 'player', ['withered_host']);
    expect(s.instances[iid].currentPower).toBe(0);
  });
});

describe('an empty line scores nothing', () => {
  it('a row modifier on an empty row adds no points', () => {
    // Found in playtesting: an empty Padati row was showing 2 and the battle
    // total included it. The arithmetic was right over a wrong premise.
    const s = makeState({});
    s.rowMods.push({ seat: 'player', row: 'padati', amount: 2, duration: 'round', source: 'test' });
    expect(rowPower(s, 'player', 'padati')).toBe(0);
  });

  it('but the same modifier counts once a warrior stands there', () => {
    const s = makeState({ playerBoard: { padati: ['pandava_infantry'] } });
    const base = rowPower(s, 'player', 'padati');
    s.rowMods.push({ seat: 'player', row: 'padati', amount: 2, duration: 'round', source: 'test' });
    expect(rowPower(s, 'player', 'padati')).toBe(base + 2);
  });

  it('a debuff cannot drive an occupied row below zero either', () => {
    const s = makeState({ playerBoard: { padati: ['pandava_infantry'] } });
    s.rowMods.push({ seat: 'player', row: 'padati', amount: -99, duration: 'round', source: 'test' });
    expect(rowPower(s, 'player', 'padati')).toBe(0);
  });
});
