// The run layer: a persistent host through an escalating ladder. These tests
// drive the pure reducer directly, standing in fake battle results, so they
// never touch the battle engine or storage.
import { describe, expect, it } from 'vitest';
import { getCard } from '@content/cards';
import type { GameState } from '@engine/types';
import { chooseReward, createRun, currentEncounter, planBattle, resolveBattle } from '@run/run';

/** A minimal finished GameState carrying only what the run reads back. */
function finished(opts: {
  winner: 'player' | 'ai';
  banned?: string[];
  playerCurses?: string[];
}): GameState {
  return {
    winner: opts.winner,
    bannedThisRun: opts.banned ?? [],
    curses: { player: opts.playerCurses ?? [], ai: [] },
  } as unknown as GameState;
}

describe('a run is a sequence, not a single battle', () => {
  it('starts on the map with a full ladder and no great astra in the roster', () => {
    const run = createRun(1, 'pandava');
    expect(run.phase).toBe('map');
    expect(run.ladder.length).toBeGreaterThan(3);
    expect(run.index).toBe(0);
    // The ultimate is earned later, never carried from the start.
    expect(run.roster.some((id) => (getCard(id).astraTier ?? 0) >= 3)).toBe(false);
    // The opponents are never the player's own host.
    expect(run.ladder.every((e) => e.house !== 'pandava')).toBe(true);
  });

  it('escalates: later rungs field more than earlier ones', () => {
    const run = createRun(7, 'pandava');
    const first = run.ladder[0].deckCards.length;
    const last = run.ladder[run.ladder.length - 1].deckCards.length;
    expect(last).toBeGreaterThan(first);
  });

  it('a single defeat ends the run', () => {
    const run = createRun(1, 'pandava');
    const after = resolveBattle(run, finished({ winner: 'ai' }));
    expect(after.phase).toBe('lost');
  });

  it('a victory advances the ladder and offers a reward', () => {
    const run = createRun(1, 'pandava');
    const after = resolveBattle(run, finished({ winner: 'player' }));
    expect(after.phase).toBe('reward');
    expect(after.depth).toBe(1);
    expect(after.index).toBe(1);
    expect(after.rewardChoices?.length).toBe(3);
  });

  it('winning the final rung wins the run', () => {
    let run = createRun(1, 'pandava');
    run = { ...run, index: run.ladder.length - 1 };
    const after = resolveBattle(run, finished({ winner: 'player' }));
    expect(after.phase).toBe('won');
  });
});

describe('what you win you keep, what you spend is gone', () => {
  it('recruiting a reward grows the roster', () => {
    const run = createRun(1, 'pandava');
    const won = resolveBattle(run, finished({ winner: 'player' }));
    const recruit = won.rewardChoices!.find((r) => r.kind === 'recruit')!;
    const after = chooseReward(won, recruit);
    expect(after.roster).toContain(recruit.cardId);
    expect(after.roster.length).toBe(run.roster.length + 1);
    expect(after.phase).toBe('map');
  });

  it('a warrior burnt out of the deck leaves the roster for the whole run', () => {
    const run = createRun(1, 'pandava');
    const victim = run.roster.find((id) => getCard(id).type === 'unit')!;
    const after = resolveBattle(run, finished({ winner: 'player', banned: [victim] }));
    expect(after.banned).toContain(victim);
    expect(after.roster).not.toContain(victim);
    // And it stays gone: the next battle is fielded without it.
    const plan = planBattle(after);
    expect(plan.playerDeck.cards).not.toContain(victim);
  });

  it('a spent great astra never returns to the pool', () => {
    let run = createRun(1, 'pandava');
    run = { ...run, roster: [...run.roster, 'brahmashirsha'] };
    const after = resolveBattle(run, finished({ winner: 'player', banned: ['brahmashirsha'] }));
    expect(after.roster).not.toContain('brahmashirsha');
  });
});

describe('a curse clings, then fades', () => {
  it('carries a fresh curse into exactly the next battle', () => {
    const run = createRun(1, 'pandava');
    const won = resolveBattle(run, finished({ winner: 'player', playerCurses: ['scorched_earth'] }));
    expect(won.pendingCurses).toContain('scorched_earth');
    // It is seeded into the next battle...
    const plan = planBattle(won);
    expect(plan.init.playerCurses).toContain('scorched_earth');

    // ...and if it is not re-earned, it does not carry a second time.
    const next = resolveBattle(won, finished({ winner: 'player', playerCurses: ['scorched_earth'] }));
    expect(next.pendingCurses).not.toContain('scorched_earth');
  });

  it('cleansing clears the clinging curse', () => {
    const run = createRun(1, 'pandava');
    const won = resolveBattle(run, finished({ winner: 'player', playerCurses: ['shivas_gaze'] }));
    const cleanse = { kind: 'cleanse' as const, label: '', text: '' };
    const after = chooseReward({ ...won, rewardChoices: [cleanse] }, cleanse);
    expect(after.pendingCurses).toEqual([]);
  });
});

describe('battle plans are deterministic', () => {
  it('the same run stage builds the same battle', () => {
    const run = createRun(42, 'kaurava');
    const a = planBattle(run);
    const b = planBattle(run);
    expect(a.seed).toBe(b.seed);
    expect(a.aiDeck.cards).toEqual(b.aiDeck.cards);
    expect(currentEncounter(run).house).not.toBe('kaurava');
  });
});
