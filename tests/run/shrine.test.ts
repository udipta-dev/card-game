// The gods between battles: vardaan taken now at a price, or tapasya that costs
// a warrior's absence and pays out a divyastra.
import { describe, expect, it } from 'vitest';
import { getCard } from '@content/cards';
import { canInvokeAstra } from '@engine/queries';
import type { GameState } from '@engine/types';
import { chooseReward, chooseShrineOffer, createRun, fieldedRoster, planBattle, resolveBattle } from '@run/run';
import { isShrineIndex, rollShrine } from '@run/shrine';
import type { PenanceOffer, VardaanOffer } from '@run/shrine';
import type { RunState } from '@run/types';
import { makeState } from '../engine/helpers';

function finished(opts: { winner: 'player' | 'ai'; banned?: string[] }): GameState {
  return {
    winner: opts.winner,
    bannedThisRun: opts.banned ?? [],
    curses: { player: [], ai: [] },
  } as unknown as GameState;
}

/** Win battles until the run sits at `index`, taking the first reward each time. */
function advanceTo(run: RunState, index: number): RunState {
  let r = run;
  while (r.index < index && r.phase !== 'lost' && r.phase !== 'won') {
    r = resolveBattle(r, finished({ winner: 'player' }));
    if (r.phase === 'reward') r = chooseReward(r, r.rewardChoices![0]);
  }
  return r;
}

describe('a shrine stands between some battles', () => {
  it('opens before the rung it guards, not every rung', () => {
    expect(isShrineIndex(2)).toBe(true);
    expect(isShrineIndex(1)).toBe(false);
  });

  it('is reached by winning, and offers gifts', () => {
    const run = advanceTo(createRun(5, 'pandava'), 2);
    expect(run.phase).toBe('shrine');
    expect(run.shrineOffers!.length).toBeGreaterThan(0);
    expect(run.shrineOffers!.some((o) => o.kind === 'vardaan')).toBe(true);
  });

  it('can be walked past, taking nothing', () => {
    const run = advanceTo(createRun(5, 'pandava'), 2);
    const after = chooseShrineOffer(run, null);
    expect(after.phase).toBe('map');
    expect(after.roster).toEqual(run.roster);
  });
});

describe('vardaan: a gift, and what it costs', () => {
  it('enters the host as a card you can field', () => {
    const run = advanceTo(createRun(5, 'pandava'), 2);
    const gift = run.shrineOffers!.find((o) => o.kind === 'vardaan') as VardaanOffer;
    const after = chooseShrineOffer(run, gift);
    expect(after.roster).toContain(gift.cardId);
    expect(planBattle(after).playerDeck.cards).toContain(gift.cardId);
  });

  it('a bound shrap of sacrifice takes the named warrior forever', () => {
    const run = advanceTo(createRun(5, 'pandava'), 2);
    const victim = run.roster.find((id) => getCard(id).type === 'unit')!;
    const offer: VardaanOffer = {
      kind: 'vardaan',
      id: 'test',
      cardId: 'surya_kavacha',
      shrap: { kind: 'sacrifice', warrior: victim, text: '' },
    };
    const after = chooseShrineOffer(run, offer);
    expect(after.roster).toContain('surya_kavacha');
    expect(after.roster).not.toContain(victim);
    expect(after.banned).toContain(victim); // gone for the run, not just this battle
  });

  it('a bound shrap of curse clings into the next battle', () => {
    const run = advanceTo(createRun(5, 'pandava'), 2);
    const offer: VardaanOffer = {
      kind: 'vardaan',
      id: 'test',
      cardId: 'kunti_invocation',
      shrap: { kind: 'curse', curse: 'scorched_earth', text: '' },
    };
    const after = chooseShrineOffer(run, offer);
    expect(after.pendingCurses).toContain('scorched_earth');
    expect(planBattle(after).init.playerCurses).toContain('scorched_earth');
  });

  it('is spent once and then gone for the run', () => {
    const run = advanceTo(createRun(5, 'pandava'), 2);
    const withGift = chooseShrineOffer(run, {
      kind: 'vardaan',
      id: 't',
      cardId: 'vayu_fury',
    } as VardaanOffer);
    // The card self-bans when played; the run strips banned cards from the pool.
    const after = resolveBattle(withGift, finished({ winner: 'player', banned: ['vayu_fury'] }));
    expect(after.roster).not.toContain('vayu_fury');
  });
});

describe('tapasya: a warrior invested, an astra returned', () => {
  const penance = (run: RunState): PenanceOffer => ({
    kind: 'penance',
    id: 't',
    deityId: 'vayu',
    warrior: run.roster.find((id) => (getCard(id).basePower ?? 0) >= 8)!,
    astra: 'vayavyastra',
    battles: 2,
  });

  it('takes the warrior off the field while they are away', () => {
    const run = advanceTo(createRun(5, 'pandava'), 2);
    const offer = penance(run);
    const after = chooseShrineOffer(run, offer);

    expect(after.away.map((p) => p.warrior)).toContain(offer.warrior);
    // Still owned, but not marching.
    expect(after.roster).toContain(offer.warrior);
    expect(fieldedRoster(after)).not.toContain(offer.warrior);
    expect(planBattle(after).playerDeck.cards).not.toContain(offer.warrior);
  });

  it('returns them bearing the astra, which they can then actually loose', () => {
    const run = advanceTo(createRun(5, 'pandava'), 2);
    const offer = penance(run);
    let r = chooseShrineOffer(run, offer);

    // One battle: still away.
    r = resolveBattle(r, finished({ winner: 'player' }));
    expect(fieldedRoster(r)).not.toContain(offer.warrior);
    if (r.phase === 'reward') r = chooseReward(r, r.rewardChoices![0]);

    // Second battle completes the penance.
    r = resolveBattle(r, finished({ winner: 'player' }));
    expect(r.away).toEqual([]);
    expect(fieldedRoster(r)).toContain(offer.warrior);
    // The weapon itself joins the host, and the warrior is recorded as knowing it.
    expect(r.roster).toContain('vayavyastra');
    expect(r.astraGrants[offer.warrior]).toContain('vayavyastra');

    // And the engine honours the grant in a real battle.
    const s = makeState({ playerBoard: { ratha: [offer.warrior] } });
    s.astraGrants.player = r.astraGrants;
    expect(canInvokeAstra(s, 'player', 'vayavyastra')).toBe(true);
  });
});

describe('the gods are consistent', () => {
  it('the same run meets the same shrine twice over', () => {
    const a = rollShrine(advanceTo(createRun(9, 'kaurava'), 2));
    const b = rollShrine(advanceTo(createRun(9, 'kaurava'), 2));
    expect(a).toEqual(b);
  });

  it('never offers a gift the host already holds', () => {
    const run = advanceTo(createRun(5, 'pandava'), 2);
    const held = new Set([...run.roster, ...run.banned]);
    for (const o of run.shrineOffers!) {
      if (o.kind === 'vardaan') expect(held.has(o.cardId)).toBe(false);
    }
  });

  it('only offers penance to a warrior the god would receive', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const run = advanceTo(createRun(seed, 'pandava'), 2);
      const p = run.shrineOffers?.find((o) => o.kind === 'penance') as PenanceOffer | undefined;
      if (!p) continue;
      expect(getCard(p.warrior).basePower).toBeGreaterThanOrEqual(8);
    }
  });
});
