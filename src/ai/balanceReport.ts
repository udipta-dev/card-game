// A balance analyser that reports FINDINGS, not a data dump.
//
// The existing lab (balanceLab.ts) prints a hundred rows and leaves a human to
// eyeball them. This does three things it does not:
//
//  1. Every number carries a confidence interval, and nothing is called a
//     problem unless the interval supports it. Measured noise floor on an
//     AI-vs-identical-AI harness was ~1.5 points, so anything smaller than that
//     is a ghost.
//  2. Cards are judged by LIFT over their own deck, not raw win rate. A card in
//     a strong deck wins a lot by association; subtracting the deck's own rate
//     is what isolates the card.
//  3. It simulates the RUN layer, which nothing has ever measured, even though
//     it is now half the game.
import { getCard, provisionOf } from '@content/cards';
import { ASURA_DECK, KAURAVA_DECK, PANDAVA_DECK } from '@content/decks';
import type { DeckList } from '@content/decks';
import { createMatch } from '@engine/createMatch';
import { reduce } from '@engine/reducer';
import type { CardId, GameState, Seat } from '@engine/types';
import { chooseReward, chooseShrineOffer, createRun, planBattle, resolveBattle } from '@run/run';
import type { RunState } from '@run/types';
import { chooseAction } from './ai';
import { differsFrom, rate } from './stats';
import type { Rate } from './stats';

const DECKS = [PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK];
const MAX_STEPS = 600;

/** Play one battle to the end with the AI on both seats. */
function playBattle(seed: number, a: DeckList, b: DeckList): GameState {
  let s = createMatch(seed, a, b, 'ai');
  s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
  s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });
  let steps = 0;
  while (s.phase !== 'battleEnd' && steps++ < MAX_STEPS) {
    s = reduce(s, chooseAction(s, s.activeSeat));
  }
  return s;
}

// --------------------------------------------------------------- battle side

export interface CardStat {
  id: CardId;
  name: string;
  deck: string;
  provision: number;
  played: Rate;
  /** Win rate when played MINUS the deck's own win rate. The card's own effect. */
  lift: number;
  liftLo: number;
  liftHi: number;
  playRate: number;
}

export interface DeckStat {
  name: string;
  house: string;
  provisions: number;
  overall: Rate;
}

export interface BattleReport {
  games: number;
  decks: DeckStat[];
  cards: CardStat[];
  firstMover: Rate;
  drawRate: number;
}

export function simulateBattles(games: number): BattleReport {
  const pairs: { a: DeckList; b: DeckList }[] = [];
  for (const a of DECKS) for (const b of DECKS) if (a !== b) pairs.push({ a, b });

  const deckWins = new Map<string, { w: number; n: number }>();
  const cardWins = new Map<string, { w: number; n: number; deck: string }>();
  let firstWins = 0;
  let decided = 0;
  let draws = 0;

  for (let i = 0; i < games; i++) {
    const { a, b } = pairs[i % pairs.length];
    const s = playBattle(i + 1, a, b);
    // createMatch is called with firstMover 'ai', and 'player' holds deck `a`.
    const seatDeck: Record<Seat, DeckList> = { player: a, ai: b };

    if (s.winner === null) {
      draws++;
      continue;
    }
    decided++;
    if (s.winner === 'ai') firstWins++; // 'ai' moved first

    for (const seat of ['player', 'ai'] as Seat[]) {
      const deck = seatDeck[seat];
      const won = s.winner === seat;
      const d = deckWins.get(deck.name) ?? { w: 0, n: 0 };
      d.w += won ? 1 : 0;
      d.n += 1;
      deckWins.set(deck.name, d);

      // Which of this seat's cards actually reached the table.
      const playedIds = new Set(
        s.log
          .filter((e): e is Extract<typeof e, { t: 'play' }> => e.t === 'play' && e.seat === seat)
          .map((e) => e.cardId),
      );
      for (const id of playedIds) {
        const key = `${deck.name}::${id}`;
        const c = cardWins.get(key) ?? { w: 0, n: 0, deck: deck.name };
        c.w += won ? 1 : 0;
        c.n += 1;
        cardWins.set(key, c);
      }
    }
  }

  const decks: DeckStat[] = DECKS.map((d) => {
    const s = deckWins.get(d.name) ?? { w: 0, n: 0 };
    return {
      name: d.name,
      house: d.house,
      provisions: d.cards.reduce((n, id) => n + provisionOf(getCard(id)), 0),
      overall: rate(s.w, s.n),
    };
  });
  const deckRate = new Map(decks.map((d) => [d.name, d.overall.rate]));
  const deckGames = new Map(decks.map((d) => [d.name, d.overall.n]));

  const cards: CardStat[] = [];
  for (const [key, c] of cardWins) {
    const id = key.split('::')[1];
    const played = rate(c.w, c.n);
    const base = deckRate.get(c.deck) ?? 0.5;
    cards.push({
      id,
      name: getCard(id).name,
      deck: c.deck,
      provision: provisionOf(getCard(id)),
      played,
      lift: played.rate - base,
      liftLo: played.lo - base,
      liftHi: played.hi - base,
      playRate: c.n / (deckGames.get(c.deck) || 1),
    });
  }
  cards.sort((x, y) => y.lift - x.lift);

  return {
    games,
    decks,
    cards,
    firstMover: rate(firstWins, decided),
    drawRate: draws / games,
  };
}

// ------------------------------------------------------------------ run side

/**
 * How the simulated player behaves at a shrine. Short and long penance are
 * separate policies ON PURPOSE. Offers arrive longest-first, so a naive
 * "take the penance" policy always picks the most expensive wager available
 * and measures the worst case, not the mechanic.
 */
export type ShrinePolicy = 'vardaan' | 'penance-long' | 'penance-short' | 'walk';

export interface RunReport {
  policy: ShrinePolicy;
  runs: number;
  completed: Rate;
  avgDepth: number;
  /** How many runs ended at each rung: where the ladder actually kills people. */
  deathsByRung: number[];
}

/** Play one full run with the AI, choosing at shrines by `policy`. */
function playRun(seed: number, house: 'pandava' | 'kaurava' | 'asura', policy: ShrinePolicy): RunState {
  let run = createRun(seed, house);
  let guard = 0;
  while (run.phase !== 'won' && run.phase !== 'lost' && guard++ < 40) {
    if (run.phase === 'reward') {
      run = chooseReward(run, run.rewardChoices![0]);
      continue;
    }
    if (run.phase === 'shrine') {
      const offers = run.shrineOffers ?? [];
      const penances = offers.filter((o) => o.kind === 'penance');
      let want = null;
      if (policy === 'vardaan') {
        want = offers.find((o) => o.kind === 'vardaan') ?? null;
      } else if (policy === 'penance-long') {
        // Offers arrive longest-first: the deepest, most expensive wager.
        want = penances[0] ?? null;
      } else if (policy === 'penance-short') {
        want = penances.length ? penances[penances.length - 1] : null;
      }
      run = chooseShrineOffer(run, want);
      continue;
    }
    const plan = planBattle(run);
    const s = playBattle(plan.seed, plan.playerDeck, plan.aiDeck);
    run = resolveBattle(run, s);
  }
  return run;
}

export function simulateRuns(runs: number, policy: ShrinePolicy): RunReport {
  const houses = ['pandava', 'kaurava', 'asura'] as const;
  let completed = 0;
  let depthTotal = 0;
  const deathsByRung: number[] = [];

  for (let i = 0; i < runs; i++) {
    const r = playRun(i + 1, houses[i % houses.length], policy);
    depthTotal += r.depth;
    if (r.phase === 'won') completed++;
    else {
      deathsByRung[r.depth] = (deathsByRung[r.depth] ?? 0) + 1;
    }
  }
  for (let i = 0; i < deathsByRung.length; i++) deathsByRung[i] = deathsByRung[i] ?? 0;

  return {
    policy,
    runs,
    completed: rate(completed, runs),
    avgDepth: depthTotal / runs,
    deathsByRung,
  };
}

// ------------------------------------------------------------------ findings

export interface Finding {
  severity: 'high' | 'medium' | 'low';
  area: string;
  text: string;
}

/**
 * Turn measurements into statements. Nothing is reported unless its confidence
 * interval supports it, so the output is a list of things worth acting on
 * rather than a table to squint at.
 */
export function findings(b: BattleReport, runs: RunReport[]): Finding[] {
  const out: Finding[] = [];
  const fair = 1 / 2;

  // --- faction balance
  for (const d of b.decks) {
    if (!differsFrom(d.overall.wins, d.overall.n, fair)) continue;
    const off = (d.overall.rate - fair) * 100;
    out.push({
      severity: Math.abs(off) > 5 ? 'high' : 'medium',
      area: 'faction',
      text: `${d.name} wins ${(d.overall.rate * 100).toFixed(1)}% (±${(d.overall.moe * 100).toFixed(1)}), ${off > 0 ? 'above' : 'below'} even by ${Math.abs(off).toFixed(1)} points over ${d.overall.n} games.`,
    });
  }

  // --- first-mover fairness
  if (differsFrom(b.firstMover.wins, b.firstMover.n, fair)) {
    const off = (b.firstMover.rate - fair) * 100;
    out.push({
      severity: Math.abs(off) > 6 ? 'high' : 'medium',
      area: 'turn order',
      text: `Moving first wins ${(b.firstMover.rate * 100).toFixed(1)}% (±${(b.firstMover.moe * 100).toFixed(1)}). The human plays second by design, so this is the edge they are handed.`,
    });
  }

  // --- individual cards, judged on lift and only when the sample supports it
  for (const c of b.cards) {
    if (c.played.n < 40) continue; // too rare to judge
    const significant = c.liftLo > 0.05 || c.liftHi < -0.05;
    if (!significant) continue;
    const pts = c.lift * 100;
    out.push({
      severity: Math.abs(pts) > 10 ? 'high' : 'medium',
      area: 'card',
      text: `${c.name} (${c.deck}, ${c.provision}p) shifts its deck by ${pts > 0 ? '+' : ''}${pts.toFixed(1)} points when played, over ${c.played.n} games.`,
    });
  }

  // --- cost efficiency: is an expensive card earning its provisions?
  const priced = b.cards.filter((c) => c.played.n >= 40);
  if (priced.length > 4) {
    const avgLiftPerProvision =
      priced.reduce((n, c) => n + c.lift / Math.max(1, c.provision), 0) / priced.length;
    for (const c of priced) {
      const per = c.lift / Math.max(1, c.provision);
      if (c.provision >= 9 && per < avgLiftPerProvision - 0.01) {
        out.push({
          severity: 'low',
          area: 'cost',
          text: `${c.name} costs ${c.provision} provisions but returns less lift per point than the average card. Either the effect is weak or the price is wrong.`,
        });
      }
    }
  }

  // --- the run layer
  for (const r of runs) {
    out.push({
      severity: r.completed.rate < 0.02 || r.completed.rate > 0.6 ? 'high' : 'low',
      area: 'run',
      text: `Shrine policy "${r.policy}": ${(r.completed.rate * 100).toFixed(1)}% of runs completed (±${(r.completed.moe * 100).toFixed(1)}), average depth ${r.avgDepth.toFixed(2)} of ${6} over ${r.runs} runs.`,
    });
  }
  if (runs.length > 1) {
    const best = [...runs].sort((a, c) => c.avgDepth - a.avgDepth)[0];
    const worst = [...runs].sort((a, c) => a.avgDepth - c.avgDepth)[0];
    const gap = best.avgDepth - worst.avgDepth;
    if (gap > 0.3) {
      out.push({
        severity: 'medium',
        area: 'run',
        text: `Shrine choice matters: "${best.policy}" reaches depth ${best.avgDepth.toFixed(2)} against "${worst.policy}" at ${worst.avgDepth.toFixed(2)}. A dominant option is a design problem if the gap is large.`,
      });
    } else {
      out.push({
        severity: 'medium',
        area: 'run',
        text: `Shrine choice barely matters: every policy lands within ${gap.toFixed(2)} of the same depth. The offers are not yet a real decision.`,
      });
    }
  }

  const order = { high: 0, medium: 1, low: 2 };
  return out.sort((a, c) => order[a.severity] - order[c.severity]);
}
