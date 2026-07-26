// Can a host actually REACH each astra tier in a run?
//   npx vite-node sim/tier-reach.ts [runs]
//
// The scenario sweep's per-tier policies each take one KIND of offer, which
// cannot test a tier that requires a chain: 'penance-t3' walks past the first
// shrine (which can never offer a tier 3, since none has been earned yet) and
// then has nothing to take at the second. Its zero was an artefact of the
// policy. This walks the chain properly: fetch anything cheap first, then reach
// as high as the gods allow.
import { getCard } from '@content/cards';
import { createMatch } from '@engine/createMatch';
import { reduce } from '@engine/reducer';
import { chooseAction } from '@ai/ai';
import { chooseReward, chooseShrineOffer, createRun, planBattle, resolveBattle } from '@run/run';
import type { RunState } from '@run/types';
import type { GameState, House } from '@engine/types';

function playBattle(seed: number, a: any, b: any, init: any): GameState {
  let s = createMatch(seed, a, b, 'ai', init);
  s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
  s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });
  let n = 0;
  while (s.phase !== 'battleEnd' && n++ < 600) s = reduce(s, chooseAction(s, s.activeSeat));
  return s;
}

const HOUSES: House[] = ['pandava', 'kaurava', 'asura'];
let anyT3 = 0, anyT2 = 0, anyT1 = 0, none = 0, offeredT3 = 0, shrines = 0;
const RUNS = Number(process.argv[2] ?? 500);
for (let i = 0; i < RUNS; i++) {
  let run: RunState = createRun(i + 1, HOUSES[i % HOUSES.length]);
  let guard = 0;
  while (run.phase !== 'won' && run.phase !== 'lost' && guard++ < 40) {
    if (run.phase === 'reward') { run = chooseReward(run, run.rewardChoices![0]); continue; }
    if (run.phase === 'shrine') {
      const pen = (run.shrineOffers ?? []).filter((o: any) => o.kind === 'penance') as any[];
      if (pen.length) shrines++;
      if (pen.some((p) => p.odds.t3 > 0)) offeredT3++;
      const earned = Object.values(run.astraGrants).flat().length > 0;
      const want = !earned
        ? [...pen].sort((a, b) => a.battles - b.battles)[0]
        : ([...pen].filter((p) => p.odds.t3 > 0).sort((a, b) => b.battles - a.battles)[0] ?? pen[0]);
      run = chooseShrineOffer(run, want ?? null);
      continue;
    }
    const plan = planBattle(run);
    run = resolveBattle(run, playBattle(plan.seed, plan.playerDeck, plan.aiDeck, plan.init));
  }
  const tiers = Object.values(run.astraGrants).flat().map((a) => getCard(a).astraTier ?? 1);
  if (tiers.some((t) => t >= 3)) anyT3++;
  else if (tiers.some((t) => t === 2)) anyT2++;
  else if (tiers.length) anyT1++;
  else none++;
}
console.log('runs                       :', RUNS);
console.log('shrines with a penance     :', shrines);
console.log('  ...that offered a tier 3 :', offeredT3);
console.log('runs ending with a TIER 3  :', anyT3);
console.log('runs ending with a tier 2  :', anyT2);
console.log('runs ending with a tier 1  :', anyT1);
console.log('runs ending with nothing   :', none);
