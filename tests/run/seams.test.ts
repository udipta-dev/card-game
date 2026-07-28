// SEAM TESTS: the handoffs between layers.
//
// Written after I reported that tier-3 astras need "the weapon and the man",
// on the strength of a probe that ran QUICKPLAY battles where astraGrants is
// empty by construction. The observation was real and the conclusion was
// wrong, because I trusted a chain I had read rather than one I had run.
//
// Every test here crosses a boundary: run -> battle, battle -> run, or round
// -> round. Unit tests inside one layer cannot catch a seam that does not
// carry its payload, and those are the failures that look like design
// problems rather than bugs.
import { describe, expect, it } from 'vitest';
import { createMatch } from '@engine/createMatch';
import { reduce } from '@engine/reducer';
import { canInvokeAstra, unitsOf } from '@engine/queries';
import { getCard } from '@content/cards';
import { chooseAction } from '@ai/ai';
import { createRun, planBattle, resolveBattle } from '@run/run';
import type { GameState } from '@engine/types';

function build(run: ReturnType<typeof createRun>): GameState {
  const plan = planBattle(run);
  return createMatch(plan.seed, plan.playerDeck, plan.aiDeck, 'player', plan.init);
}

describe('seam: what tapasya earns actually reaches the battlefield', () => {
  it('carries astraGrants from the run into the match state', () => {
    const run = createRun(7, 'pandava');
    run.astraGrants = { arjuna: ['narayanastra'] };
    const s = build(run);
    expect(s.astraGrants.player).toEqual({ arjuna: ['narayanastra'] });
  });

  it('and the granted ultimate is genuinely invocable in that match', () => {
    // The end-to-end claim, not the unit-test one. Narayana's canonical
    // wielder is Ashwatthama, a Kaurava, so this can only be true via the grant.
    const run = createRun(7, 'pandava');
    run.astraGrants = { arjuna: ['narayanastra'] };
    let s = build(run);
    // The match opens in mulligan. Skipping it silently swallowed the PLAY_CARD
    // and left the board empty, which is why the first version of this test
    // failed against an engine that was working correctly.
    s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
    s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });

    // Put ANY warrior on the field. A grant belongs to the host, not the man.
    const iid = s.hands.player.find((i) => getCard(s.instances[i].cardId).type === 'unit');
    expect(iid, 'no warrior in the opening hand for this seed').toBeDefined();
    const row = getCard(s.instances[iid!].cardId).rows[0];
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: iid!, row });
    expect(unitsOf(s1, 'player').length).toBeGreaterThan(0);

    expect(canInvokeAstra(s1, 'player', 'narayanastra')).toBe(true);
  });

  it('a host with no grant cannot invoke it, which is the control', () => {
    const run = createRun(7, 'pandava');
    const s = build(run);
    expect(canInvokeAstra(s, 'player', 'narayanastra')).toBe(false);
  });
});

describe('seam: a curse earned last battle bites in the next one', () => {
  it('carries pendingCurses from the run into the match state', () => {
    const run = createRun(11, 'kaurava');
    run.pendingCurses = ['shivas_gaze'];
    const s = build(run);
    expect(s.curses.player).toContain('shivas_gaze');
  });
});

describe('seam: what a battle spends stays spent for the run', () => {
  it('carries bannedThisRun from the run into the match, so it stays unplayable', () => {
    const run = createRun(3, 'pandava');
    run.banned = ['brahmastra'];
    const s = build(run);
    expect(s.bannedThisRun).toContain('brahmastra');
  });

  it('the fielded roster excludes warriors away at penance', () => {
    const run = createRun(5, 'pandava');
    const before = planBattle(run).playerDeck.cards.length;
    run.away = [{ warrior: run.roster.find((c) => c === 'arjuna') ?? run.roster[0], deityId: 'agni', battlesLeft: 2, battles: 2 }] as never;
    const after = planBattle(run).playerDeck.cards.length;
    expect(after).toBe(before - 1);
  });
});

describe('seam: a lingering debuff outlives the round that made it', () => {
  it('survives into the next round, where a round-scoped one does not', () => {
    const run = createRun(2, 'pandava');
    let s = build(run);
    s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
    s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });
    s.rowMods.push(
      { seat: 'player', row: 'ratha', amount: -3, duration: 'lingering', source: 'test' },
      { seat: 'player', row: 'gaja', amount: -3, duration: 'round', source: 'test' },
    );
    const startRound = s.round;
    // Both pass, ending the round. Nobody has played anything, so it is a
    // 0-0 tie and the battle cannot be decided here.
    let guard = 0;
    while (s.round === startRound && s.phase !== 'battleEnd' && guard++ < 200) {
      s = reduce(s, { type: 'PASS', seat: s.activeSeat });
    }
    // NO ESCAPE HATCH. An "if the battle ended, return" here would let this
    // test pass while asserting nothing, which is how I wrote a fake test
    // earlier today. If the round does not advance, that is a failure.
    expect(s.round, 'the round should have advanced').toBe(startRound + 1);
    expect(s.rowMods.some((m) => m.source === 'test' && m.duration === 'lingering')).toBe(true);
    expect(s.rowMods.some((m) => m.source === 'test' && m.duration === 'round')).toBe(false);
  });
});

describe('seam: a finished battle writes its consequences back to the run', () => {
  it('a card banned during the battle is still banned in the run afterwards', () => {
    const run = createRun(13, 'pandava');
    const plan = planBattle(run);
    let s = createMatch(plan.seed, plan.playerDeck, plan.aiDeck, 'player', plan.init);
    s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
    s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });
    let guard = 0;
    while (s.phase !== 'battleEnd' && guard++ < 600) s = reduce(s, chooseAction(s, s.activeSeat));
    const after = resolveBattle(run, s);
    for (const id of s.bannedThisRun) {
      expect(after.banned).toContain(id);
    }
  });
});
