// Find the best army a house can field, by playing games rather than guessing.
//
//   npx vite-node sim/deck-search.ts [house] [generations]
//
// WHY THIS EXISTS. autoMuster, the "fill automatically, best value first"
// button, is a heuristic that has never been checked against a game, and when
// finally measured it produced a Pandava deck at 26.2% where the curated starter
// sits at 42.9%. It also left 18 provisions unspent. A player pressing the
// convenience button is handed a materially worse army.
//
// The published work on this is unanimous about where the difficulty is, and it
// is not the search operators. From the Hearthstone and Legends of Code and
// Magic literature: the fitness function is non-deterministic and cannot be
// calculated, only estimated by simulation. So a deck that won 6 of 10 may be
// worse than one that won 5, and naive hill-climbing chases that noise and
// converges on nothing.
//
// The same literature names the trap we are already in: these approaches "often
// use naive game-specific heuristics that don't transfer to real gameplay",
// which is exactly what "best value first" is. We do not have to guess, because
// we have the engine.
//
// SO: RACING. Evaluate many candidates over few games, kill the clear losers,
// give the survivors more games, repeat. Compute goes to the decks that might
// actually be good rather than being spread evenly over decks that obviously are
// not. Fitness is real win rate against the three curated starters in both seat
// orders, never a score.
//
// This runs OFFLINE, here in the lab. It is far too slow to sit behind a button,
// which is the point: the search happens here and the game ships the answer.
import { reduce } from '@engine/reducer';
import { createMatch } from '@engine/createMatch';
import { chooseAction } from '@ai/ai';
import { nextRandom } from '@engine/ids';
import { getCard } from '@content/cards';
import { PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK, DECK_BUDGET } from '@content/decks';
import type { DeckList } from '@content/decks';
import { MIN_WARRIORS, MUSTER_MAX, MUSTER_MIN, checkMuster, poolFor } from '@content/muster';
import { orphanWeapons } from '@content/arsenal';
import type { CardId, GameState, House, Seat } from '@engine/types';

const HOUSE = (process.argv[2] ?? 'pandava') as House;
const GENERATIONS = Number(process.argv[3] ?? 4);

/** The field every candidate is judged against: the three curated armies. */
const FIELD: DeckList[] = [PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK];

// Racing schedule. Wide and cheap first, narrow and honest last. The last rung
// is the only number worth quoting, because it is the only one with enough games
// behind it to mean anything.
const POPULATION = 24;
const RUNGS = [
  { keep: 24, games: 6 },
  { keep: 8, games: 18 },
  { keep: 3, games: 48 },
];

const prov = (id: CardId) => getCard(id).provision ?? getCard(id).basePower + 2;
const spend = (ids: readonly CardId[]) => ids.reduce((n, id) => n + prov(id), 0);
const warriors = (ids: readonly CardId[]) => ids.filter((id) => getCard(id).type === 'unit').length;

const POOL = poolFor(HOUSE).map((c) => c.id);

/** A deterministic pick, so a run is reproducible from its seed. */
function pick<T>(xs: readonly T[], seed: number): [T, number] {
  const [next, roll] = nextRandom(seed);
  return [xs[Math.floor(roll * xs.length)], next];
}

/**
 * Is this a legal army? The engine's own rules, not a second copy of them.
 *
 * Orphan weapons are excluded on top of checkMuster, because a weapon nobody in
 * the army can fire is 14 provisions of nothing, and the search would otherwise
 * happily "discover" that carrying the Pashupata is free power.
 */
function legal(ids: readonly CardId[]): boolean {
  return (
    checkMuster(ids).ok &&
    warriors(ids) >= MIN_WARRIORS &&
    orphanWeapons(ids).length === 0
  );
}

/** Drop cards until an over-budget or oversized army is legal again. */
function repair(ids: CardId[], seed: number): [CardId[], number] {
  let out = [...new Set(ids)];
  let s = seed;
  let guard = 0;
  while (guard++ < 200 && !legal(out)) {
    // Any weapon nobody left can fire goes first: it is strictly dead weight.
    const orphan = orphanWeapons(out);
    if (orphan.length) {
      out = out.filter((id) => id !== orphan[0]);
      continue;
    }
    if (out.length > MUSTER_MAX || spend(out) > DECK_BUDGET) {
      // Shed a non-warrior first if we are at the warrior floor, otherwise the
      // most expensive card, which is the fastest route back under budget.
      const shed = warriors(out) <= MIN_WARRIORS
        ? out.filter((id) => getCard(id).type !== 'unit')
        : out;
      if (!shed.length) return [out, s];
      const worst = shed.slice().sort((a, b) => prov(b) - prov(a))[0];
      out = out.filter((id) => id !== worst);
      continue;
    }
    // Too small, or short of warriors: add something affordable.
    const room = DECK_BUDGET - spend(out);
    const want = warriors(out) < MIN_WARRIORS ? 'unit' : 'any';
    const cand = POOL.filter(
      (id) =>
        !out.includes(id) &&
        prov(id) <= room &&
        (want === 'any' || getCard(id).type === 'unit'),
    );
    if (!cand.length) return [out, s];
    const [add, nextSeed] = pick(cand, s);
    s = nextSeed;
    out.push(add);
  }
  return [out, s];
}

/** One mutation: swap, add or drop, then repair back to legality. */
function mutate(ids: readonly CardId[], seed: number): [CardId[], number] {
  let s = seed;
  const [roll, s1] = ((): [number, number] => {
    const [n, r] = nextRandom(s);
    return [r, n];
  })();
  s = s1;
  let out = [...ids];

  if (roll < 0.65 && out.length) {
    // SWAP, the workhorse. Small steps, because every evaluation is expensive.
    const [gone, s2] = pick(out, s);
    s = s2;
    const cand = POOL.filter((id) => !out.includes(id));
    if (cand.length) {
      const [add, s3] = pick(cand, s);
      s = s3;
      out = out.filter((id) => id !== gone).concat(add);
    }
  } else if (roll < 0.85) {
    const cand = POOL.filter((id) => !out.includes(id));
    if (cand.length) {
      const [add, s2] = pick(cand, s);
      s = s2;
      out.push(add);
    }
  } else if (out.length > MUSTER_MIN) {
    const [gone, s2] = pick(out, s);
    s = s2;
    out = out.filter((id) => id !== gone);
  }
  return repair(out, s);
}

/** Play one battle to its end and say whether `seat` won. */
function playOut(seed: number, mine: DeckList, theirs: DeckList, first: Seat): 'win' | 'loss' | 'draw' {
  let s: GameState = createMatch(seed, mine, theirs, first);
  for (let i = 0; i < 900 && s.phase !== 'battleEnd'; i++) {
    const next = reduce(s, chooseAction(s, s.activeSeat));
    if (next === s) break;
    s = next;
  }
  if (!s.winner) return 'draw';
  return s.winner === 'player' ? 'win' : 'loss';
}

/**
 * Win rate of this army against the whole curated field, both seat orders.
 *
 * `games` is per opponent per order, so the real count is games * 6. Both orders
 * always, because the seat is worth about 8 points on its own and a candidate
 * measured in one seat is measuring the coin.
 */
function fitness(ids: readonly CardId[], games: number, seed: number): number {
  const mine: DeckList = { id: 'candidate', name: 'candidate', house: HOUSE, cards: [...ids] };
  let wins = 0;
  let played = 0;
  for (const foe of FIELD) {
    for (let g = 0; g < games; g++) {
      for (const first of ['player', 'ai'] as Seat[]) {
        const r = playOut(seed + g * 7919 + (first === 'player' ? 0 : 31), mine, foe, first);
        played++;
        if (r === 'win') wins++;
      }
    }
  }
  return played ? wins / played : 0;
}

/** Race a population down to the best few, spending games only on survivors. */
function race(pop: CardId[][], seed: number): { ids: CardId[]; score: number }[] {
  let field = pop.map((ids) => ({ ids, score: 0 }));
  for (const rung of RUNGS) {
    field = field
      .map((c) => ({ ids: c.ids, score: fitness(c.ids, rung.games, seed) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(rung.keep, field.length));
    process.stdout.write(
      `    rung ${rung.games}g -> kept ${field.length}, best ${(field[0].score * 100).toFixed(1)}%\n`,
    );
  }
  return field;
}

// ---------------------------------------------------------------------------

const CURATED = FIELD.find((d) => d.house === HOUSE)!.cards;
console.log(`\nDECK SEARCH: ${HOUSE}   pool ${POOL.length} cards, ${GENERATIONS} generations\n`);
const baseline = fitness(CURATED, RUNGS[RUNGS.length - 1].games, 1234);
console.log(
  `  curated army: ${CURATED.length} cards, ${spend(CURATED)}/${DECK_BUDGET} provisions, ` +
    `${(baseline * 100).toFixed(1)}% against the field\n`,
);

// Seed the population from the curated army, so generation 1 already knows
// something. A purely random start wastes most of its compute rediscovering
// that ten warriors is better than three.
let seed = 20260808;
let population: CardId[][] = [CURATED.slice()];
while (population.length < POPULATION) {
  const [child, s] = mutate(population[population.length % 1], seed);
  seed = s;
  population.push(child);
}

let best = { ids: CURATED.slice(), score: baseline };
for (let gen = 1; gen <= GENERATIONS; gen++) {
  console.log(`  generation ${gen}`);
  const survivors = race(population, 4242 + gen * 101);
  if (survivors[0].score > best.score) best = survivors[0];

  // Next population: the survivors, plus mutations of them. Elitism keeps the
  // best army alive verbatim so a generation can never go backwards.
  const next: CardId[][] = survivors.map((s) => s.ids);
  while (next.length < POPULATION) {
    const parent = survivors[next.length % survivors.length].ids;
    const [child, s] = mutate(parent, seed);
    seed = s;
    next.push(child);
  }
  population = next;
  console.log(
    `    best so far ${(best.score * 100).toFixed(1)}% (curated ${(baseline * 100).toFixed(1)}%)\n`,
  );
}

console.log(`\nBEST ${HOUSE.toUpperCase()} ARMY FOUND\n`);
console.log(`  ${(best.score * 100).toFixed(1)}% against the field, curated is ${(baseline * 100).toFixed(1)}%`);
console.log(`  ${best.ids.length} cards, ${spend(best.ids)}/${DECK_BUDGET} provisions, ${warriors(best.ids)} warriors\n`);
for (const id of best.ids.slice().sort((a, b) => prov(b) - prov(a))) {
  const c = getCard(id);
  const inCurated = CURATED.includes(id) ? ' ' : '+';
  console.log(`  ${inCurated} ${c.name.padEnd(20)} ${String(c.tier ?? c.type).padEnd(10)} ${prov(id)}`);
}
const dropped = CURATED.filter((id) => !best.ids.includes(id));
if (dropped.length) console.log(`\n  dropped: ${dropped.map((id) => getCard(id).name).join(', ')}`);
console.log(`\n  as a card list:\n  ${JSON.stringify(best.ids)}\n`);
