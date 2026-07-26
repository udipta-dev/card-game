// The gods between battles: vardaan taken now at a price, or tapasya that costs
// a warrior's absence and pays out a divyastra.
import { describe, expect, it } from 'vitest';
import { getCard } from '@content/cards';
import { canInvokeAstra } from '@engine/queries';
import type { GameState } from '@engine/types';
import { chooseReward, chooseShrineOffer, createRun, fieldedRoster, planBattle, resolveBattle } from '@run/run';
import { DEITIES, effectiveOdds, isShrineIndex, penanceOdds, rollPenanceOutcome, rollShrine, worthOf } from '@run/shrine';
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
    battles: 2,
    odds: { fail: 0, t1: 1, t2: 0, t3: 0 },
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
    // Vayu teaches only the Vayavyastra, so a satisfied god gives exactly that.
    const won = r.astraGrants[offer.warrior];
    if (won) {
      expect(won).toContain('vayavyastra');
      expect(r.roster).toContain('vayavyastra');
      // And the engine honours the grant in a real battle.
      const s = makeState({ playerBoard: { ratha: [offer.warrior] } });
      s.astraGrants.player = r.astraGrants;
      expect(canInvokeAstra(s, 'player', 'vayavyastra')).toBe(true);
    } else {
      // He may return empty-handed; that is the wager, and the roster is unchanged.
      expect(r.roster).not.toContain('vayavyastra');
    }
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
      expect(worthOf(p.warrior)).toBeGreaterThanOrEqual(8);
    }
  });
});

describe('penance is a wager, and the terms are legible', () => {
  const arjuna = 'arjuna';   // power 10, mastery 2 -> standing 14
  const bhima = 'bhima';     // power 9,  mastery 0 -> standing 9, mighty but untaught
  const nakula = 'nakula';   // power 6                -> standing 6

  it('standing is rank plus training, so raw might is not enough', () => {
    expect(worthOf(arjuna)).toBe(14);
    expect(worthOf(bhima)).toBe(9);
    expect(worthOf(arjuna)).toBeGreaterThan(worthOf(bhima));
  });

  it('a longer penance reaches higher', () => {
    const short = penanceOdds(arjuna, 1);
    const long = penanceOdds(arjuna, 4);
    expect(long.t3).toBeGreaterThan(short.t3);
    expect(long.fail).toBeLessThan(short.fail);
  });

  it('a worthier warrior reaches higher for the same penance', () => {
    const great = penanceOdds(arjuna, 3);
    const lesser = penanceOdds(bhima, 3);
    expect(great.t3).toBeGreaterThan(lesser.t3);
  });

  it('the ultimates are walled behind BOTH a master and a long absence', () => {
    expect(penanceOdds(arjuna, 2).t3).toBe(0);  // long enough? no
    expect(penanceOdds(bhima, 4).t3).toBe(0);   // worthy enough? no
    expect(penanceOdds(nakula, 4).t3).toBe(0);
    expect(penanceOdds(arjuna, 3).t3).toBeGreaterThan(0);
  });

  it('is never a certainty, however great the wager', () => {
    for (const battles of [1, 2, 3, 4]) {
      const o = penanceOdds(arjuna, battles);
      expect(o.t3).toBeLessThan(0.6);
      expect(o.fail).toBeGreaterThan(0);
      expect(o.fail + o.t1 + o.t2 + o.t3).toBeCloseTo(1, 5);
    }
  });

  it('Shiva gives the Pashupatastra or nothing at all', () => {
    const shiva = DEITIES.find((d) => d.id === 'shiva')!;
    const o = effectiveOdds(shiva, arjuna, 3);
    // He holds nothing at the lesser tiers, so every lesser roll comes to nothing.
    expect(o.t1).toBe(0);
    expect(o.t2).toBe(0);
    expect(o.t3).toBeGreaterThan(0);
    expect(o.fail).toBeGreaterThan(o.t3); // the odds are against you, and shown
  });

  it('a lesser god pays out reliably, which is the trade', () => {
    const agni = DEITIES.find((d) => d.id === 'agni')!;
    const o = effectiveOdds(agni, arjuna, 2);
    expect(o.t1).toBeGreaterThan(0.8); // he only has the Agneyastra, and gives it
    expect(o.t3).toBe(0);
  });

  it('only a true master may even approach Shiva', () => {
    const shiva = DEITIES.find((d) => d.id === 'shiva')!;
    expect(worthOf(arjuna)).toBeGreaterThanOrEqual(shiva.minWorth);
    expect(worthOf(bhima)).toBeLessThan(shiva.minWorth);
  });
});

describe('length never substitutes for standing', () => {
  it('a lesser warrior cannot reach the great weapons however long he sits', () => {
    for (const battles of [1, 2, 3, 4, 5]) {
      const o = penanceOdds('nakula', battles); // standing 6
      expect(o.t2).toBe(0);
      expect(o.t3).toBe(0);
    }
    // Ghatotkacha is mighty (7) but untaught: still barred from the Brahma line.
    expect(penanceOdds('ghatotkacha', 4).t2).toBe(0);
  });

  it('Bhima may earn a great weapon but never an ultimate, being untrained', () => {
    const o = penanceOdds('bhima', 4); // standing 9: power without the mantras
    expect(o.t2).toBeGreaterThan(0);
    expect(o.t3).toBe(0);
  });
});

describe('no god offers a wager he cannot honour', () => {
  it('never shows a penance that is certain to come to nothing', () => {
    for (let seed = 1; seed <= 60; seed++) {
      for (const house of ['pandava', 'kaurava', 'asura'] as const) {
        const run = advanceTo(createRun(seed, house), 2);
        for (const o of run.shrineOffers ?? []) {
          if (o.kind !== 'penance') continue;
          const success = o.odds.t1 + o.odds.t2 + o.odds.t3;
          expect(success).toBeGreaterThan(0.15);
        }
      }
    }
  });
});

describe('the shrine cannot advertise what it will not deliver', () => {
  // Regression: effectiveOdds ignored the host's inventory while
  // rollPenanceOutcome respected it. Every starting deck carries the
  // Brahma-Astra and Brahma's tier-2 domain holds only the Brahma-Astra, so the
  // shrine offered 50% at a weapon the roll could never hand over. Observed as
  // 39 penances, 14 returns, zero astras.
  const brahma = DEITIES.find((d) => d.id === 'brahma')!;

  it('shows no chance at a tier whose every weapon the host already holds', () => {
    const held = new Set(['brahmastra']);
    const shown = effectiveOdds(brahma, 'arjuna', 2, held);
    expect(shown.t2).toBe(0);
    expect(shown.fail).toBeCloseTo(1, 5);
  });

  it('still shows the chance when the host does not hold it', () => {
    expect(effectiveOdds(brahma, 'arjuna', 2, new Set()).t2).toBeGreaterThan(0);
  });

  it('agrees with what rolling actually returns, which is the whole bug', () => {
    for (const held of [new Set<string>(), new Set(['brahmastra']), new Set(['brahmastra', 'brahmashirsha'])]) {
      const shown = effectiveOdds(brahma, 'arjuna', 3, held);
      let seed = 4242;
      let got = 0;
      const N = 4000;
      for (let i = 0; i < N; i++) {
        const o = rollPenanceOutcome(brahma, 'arjuna', 3, seed, held);
        seed = o.seed;
        if (o.astra) got++;
      }
      const advertised = shown.t1 + shown.t2 + shown.t3;
      expect(got / N).toBeCloseTo(advertised, 1);
    }
  });

  it('never offers a wager the host cannot actually win', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const run = advanceTo(createRun(seed, 'pandava'), 2);
      const held = new Set([...run.roster, ...run.banned]);
      for (const o of run.shrineOffers ?? []) {
        if (o.kind !== 'penance') continue;
        const deity = DEITIES.find((d) => d.id === o.deityId)!;
        const real = effectiveOdds(deity, o.warrior, o.battles, held);
        expect(real.t1 + real.t2 + real.t3).toBeGreaterThan(0.15);
      }
    }
  });
});
