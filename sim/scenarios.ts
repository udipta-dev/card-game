// Full scenario sweep: every axis the game varies along, measured together.
//   npx vite-node sim/scenarios.ts [runsPerScenario]
//
// The question this exists to answer is whether the EFFORT ECONOMY is
// proportional: a cheap weapon should be worth a cheap price, and an
// world-ending one should be nearly out of reach. Averages across all penance
// hide that completely, so everything here is broken out by tier.
import { getCard } from '@content/cards';
import { createMatch } from '@engine/createMatch';
import { reduce } from '@engine/reducer';
import { chooseAction } from '@ai/ai';
import { rate } from '@ai/stats';
import { chooseReward, chooseShrineOffer, createRun, planBattle, resolveBattle } from '@run/run';
import { getDeity } from '@run/shrine';
import type { PenanceOffer, ShrineOffer } from '@run/shrine';
import type { RunState } from '@run/types';
import type { GameState } from '@engine/types';

const RUNS = Number(process.argv[2] ?? 250);
const HOUSES = ['pandava', 'kaurava', 'asura'] as const;
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const pad = (s: string, n: number) => s.padEnd(n).slice(0, n);

function playBattle(seed: number, a: any, b: any, init: any): GameState {
  let s = createMatch(seed, a, b, 'ai', init);
  s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
  s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });
  let n = 0;
  while (s.phase !== 'battleEnd' && n++ < 600) s = reduce(s, chooseAction(s, s.activeSeat));
  return s;
}

/** The highest tier a wager could possibly return, given the god's domain. */
function topTier(o: PenanceOffer): number {
  const d = getDeity(o.deityId);
  if (!d) return 0;
  const tiers = Object.keys(d.domain).map(Number).filter((t) => (d.domain as any)[t]?.length);
  const reachable = tiers.filter((t) => (t === 3 ? o.odds.t3 > 0 : t === 2 ? o.odds.t2 > 0 : o.odds.t1 > 0));
  return reachable.length ? Math.max(...reachable) : 0;
}

type Policy =
  | 'walk'
  | 'vardaan'
  | 'vardaan-free'
  | 'penance-any'
  | 'penance-t1'
  | 'penance-t2'
  | 'penance-t3'
  | 'greedy-best';

interface Funnel {
  offered: number;
  taken: number;
  returned: number;
  withAstra: number;
  battlesHeld: number;
  fired: number;
}

interface Result {
  policy: Policy;
  runs: number;
  won: number;
  depthTotal: number;
  deaths: number[];
  funnel: Funnel;
}

function pick(offers: ShrineOffer[], policy: Policy): ShrineOffer | null {
  const pen = offers.filter((o): o is PenanceOffer => o.kind === 'penance');
  const gifts = offers.filter((o) => o.kind === 'vardaan');
  switch (policy) {
    case 'walk':
      return null;
    case 'vardaan':
      return gifts[0] ?? null;
    case 'vardaan-free':
      return gifts.find((g) => !(g as any).shrap) ?? null;
    case 'penance-any':
      return pen[0] ?? null;
    case 'penance-t1':
      return pen.filter((p) => topTier(p) === 1).sort((a, b) => a.battles - b.battles)[0] ?? null;
    case 'penance-t2':
      return pen.filter((p) => topTier(p) === 2).sort((a, b) => a.battles - b.battles)[0] ?? null;
    case 'penance-t3':
      return pen.filter((p) => topTier(p) === 3).sort((a, b) => b.battles - a.battles)[0] ?? null;
    case 'greedy-best':
      // Take the highest tier available, else a free gift, else walk.
      return (
        pen.filter((p) => topTier(p) === 3)[0] ??
        pen.filter((p) => topTier(p) === 2)[0] ??
        gifts.find((g) => !(g as any).shrap) ??
        null
      );
  }
}

function runScenario(policy: Policy, runs: number): Result {
  const r: Result = {
    policy,
    runs,
    won: 0,
    depthTotal: 0,
    deaths: [],
    funnel: { offered: 0, taken: 0, returned: 0, withAstra: 0, battlesHeld: 0, fired: 0 },
  };

  for (let i = 0; i < runs; i++) {
    let run: RunState = createRun(i + 1, HOUSES[i % HOUSES.length]);
    const earned = new Set<string>();
    let guard = 0;
    while (run.phase !== 'won' && run.phase !== 'lost' && guard++ < 40) {
      if (run.phase === 'reward') {
        run = chooseReward(run, run.rewardChoices![0]);
        continue;
      }
      if (run.phase === 'shrine') {
        const offers = run.shrineOffers ?? [];
        if (offers.some((o) => o.kind === 'penance')) r.funnel.offered++;
        const want = pick(offers, policy);
        if (want?.kind === 'penance') r.funnel.taken++;
        run = chooseShrineOffer(run, want);
        continue;
      }
      const away = run.away.length;
      const plan = planBattle(run);
      const s = playBattle(plan.seed, plan.playerDeck, plan.aiDeck, plan.init);
      if (earned.size) {
        r.funnel.battlesHeld++;
        if (s.log.some((e) => e.t === 'play' && e.seat === 'player' && earned.has(e.cardId))) {
          r.funnel.fired++;
        }
      }
      run = resolveBattle(run, s);
      if (away > 0 && run.away.length < away) {
        r.funnel.returned++;
        for (const p of run.returned ?? []) if (p.astra) { r.funnel.withAstra++; earned.add(p.astra); }
      }
    }
    r.depthTotal += run.depth;
    if (run.phase === 'won') r.won++;
    else r.deaths[run.depth] = (r.deaths[run.depth] ?? 0) + 1;
  }
  for (let i = 0; i < 6; i++) r.deaths[i] = r.deaths[i] ?? 0;
  return r;
}

// ---------------------------------------------------------------------------
console.log(`\nKURUKSHETRA SCENARIO SWEEP   ${RUNS} runs per scenario\n${'='.repeat(78)}`);

const policies: Policy[] = [
  'walk',
  'vardaan-free',
  'vardaan',
  'penance-t1',
  'penance-t2',
  'penance-t3',
  'penance-any',
  'greedy-best',
];

const t0 = Date.now();
const results = policies.map((p) => runScenario(p, RUNS));

console.log('SHRINE POLICY            completed      avg depth   vs walking');
const walkDepth = results.find((r) => r.policy === 'walk')!.depthTotal / RUNS;
for (const r of results) {
  const depth = r.depthTotal / RUNS;
  const c = rate(r.won, r.runs);
  const delta = depth - walkDepth;
  console.log(
    `  ${pad(r.policy, 22)} ${pad(`${pct(c.rate)} ±${pct(c.moe)}`, 15)}${pad(depth.toFixed(2), 12)}${
      r.policy === 'walk' ? '(baseline)' : `${delta >= 0 ? '+' : ''}${delta.toFixed(2)}`
    }`,
  );
}

console.log('\nPENANCE COLLECTION FUNNEL   (does the price ever buy anything?)');
console.log('  policy               taken   returned  gotAstra  everFired   collected');
for (const r of results) {
  const f = r.funnel;
  if (!f.taken) continue;
  console.log(
    `  ${pad(r.policy, 20)} ${pad(String(f.taken), 8)}${pad(String(f.returned), 10)}${pad(
      String(f.withAstra),
      10,
    )}${pad(String(f.fired), 12)}${pct(f.fired / Math.max(1, f.taken))}`,
  );
}

console.log('\nWHERE RUNS DIE   (rung index, 0 = lost the first battle)');
for (const r of results) {
  console.log(`  ${pad(r.policy, 20)} [${r.deaths.slice(0, 6).join(', ')}]  won ${r.won}`);
}

// Per-house survival, to check no host is a trap.
console.log('\nBY HOUSE (walk policy)');
for (const h of HOUSES) {
  let won = 0;
  let depth = 0;
  const n = Math.max(40, Math.floor(RUNS / 2));
  for (let i = 0; i < n; i++) {
    let run: RunState = createRun(i + 1, h);
    let guard = 0;
    while (run.phase !== 'won' && run.phase !== 'lost' && guard++ < 40) {
      if (run.phase === 'reward') { run = chooseReward(run, run.rewardChoices![0]); continue; }
      if (run.phase === 'shrine') { run = chooseShrineOffer(run, null); continue; }
      const plan = planBattle(run);
      run = resolveBattle(run, playBattle(plan.seed, plan.playerDeck, plan.aiDeck, plan.init));
    }
    depth += run.depth;
    if (run.phase === 'won') won++;
  }
  const c = rate(won, n);
  console.log(`  ${pad(h, 20)} completed ${pad(`${pct(c.rate)} ±${pct(c.moe)}`, 16)} avg depth ${(depth / n).toFixed(2)}`);
}

console.log(`\nSwept in ${((Date.now() - t0) / 1000).toFixed(1)}s.\n`);
