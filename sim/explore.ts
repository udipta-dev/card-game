// EXPLORATION LAB: sample the space the balance lab cannot reach.
//
// `npm run sim` answers one question well ("are the three curated decks even?")
// and is blind to three others:
//
//   1. It EXCLUDES mirror matchups (`if (a !== b)` in balanceLab), so we have
//      never measured a deck against itself. That number is the noise floor:
//      if Pandava-vs-Pandava is not ~50%, something other than deck strength is
//      deciding games and every other number is suspect.
//   2. It reports each deck's win rate AGGREGATED over both opponents, so a
//      rock-paper-scissors triangle is invisible. Three decks at 50% overall
//      can still be A>B>C>A, which plays completely differently.
//   3. It only ever plays the three hand-curated decks. It cannot tell us
//      whether those decks are any good, or whether a far stronger build is
//      sitting unbuilt in the same 170 provisions.
//
// The composition space is far too large to enumerate: ~80 cards choose ~19
// under a budget constraint. So each experiment gets a sampling strategy suited
// to its own shape rather than brute force everywhere.
//
// Usage: npm run explore [scale]     (scale 1 = quick, 4 = thorough)
import { createMatch } from '@engine/createMatch';
import { reduce } from '@engine/reducer';
import { chooseAction } from '@ai/ai';
import { CARD_DB, allCards, getCard, provisionOf } from '@content/cards';
import { DECKS, DECK_BUDGET, deckProvisions } from '@content/decks';
import type { DeckList } from '@content/decks';
import { checkDeckAstras } from '@content/validateContent';
import type { CardId, GameState, House } from '@engine/types';

const MAX_STEPS = 600;
// A specific pair of units lands together in only a fraction of games, so the
// first run at n>=40 filtered out every pair in the game and reported nothing.
const MIN_PAIR_N = 15;

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

/**
 * Wilson score interval. Used rather than the normal approximation because we
 * deliberately evaluate cells at small n, where p +/- 1.96*sqrt(p(1-p)/n) can
 * run past 0 or 1 and gives nonsense for lopsided results.
 */
export function wilson(wins: number, n: number, z = 1.96) {
  if (n === 0) return { p: 0.5, lo: 0, hi: 1, half: 1 };
  const p = wins / n;
  const d = 1 + (z * z) / n;
  const centre = p + (z * z) / (2 * n);
  const spread = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
  return { p, lo: (centre - spread) / d, hi: (centre + spread) / d, half: spread / d };
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
const pad = (s: string, n: number) => s.padEnd(n);

// ---------------------------------------------------------------------------
// A single game
// ---------------------------------------------------------------------------

/** Returns +1 if `first` won, 0 for a draw, -1 if `second` won. */
function play(seed: number, first: DeckList, second: DeckList): { r: number; played: Set<CardId> } {
  let s: GameState = createMatch(seed, first, second);
  s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
  s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });
  let steps = 0;
  while (s.phase !== 'battleEnd' && steps < MAX_STEPS) {
    s = reduce(s, chooseAction(s, s.activeSeat));
    steps++;
  }
  const played = new Set<CardId>();
  for (const ev of s.log) if (ev.t === 'play' && ev.seat === 'player') played.add(ev.cardId);
  return { r: s.winner === 'player' ? 1 : s.winner === 'ai' ? -1 : 0, played };
}

// ---------------------------------------------------------------------------
// EXPERIMENT 1: the full matchup matrix, by adaptive racing allocation
// ---------------------------------------------------------------------------
//
// Uniform allocation is wasteful: a cell already known to be 50.0 +/- 1.5 gains
// almost nothing from another 500 games, while a cell at 47 +/- 6 is still
// undecided. So after a warm-up we repeatedly hand the next batch to whichever
// cell currently has the WIDEST Wilson interval. That is the standard racing /
// sequential-analysis idea: spend the budget where the uncertainty is.
//
// Mirrors are included deliberately. A deck against itself must land at 50%,
// and if it does not, the difference is the seat rather than the cards.

interface Cell {
  a: string;
  b: string;
  n: number;
  wins: number;
  draws: number;
  seed: number;
}

function matchupMatrix(budget: number, batch = 40) {
  const names = Object.keys(DECKS);
  const cells: Cell[] = [];
  for (const a of names) for (const b of names) cells.push({ a, b, n: 0, wins: 0, draws: 0, seed: 1 });

  const runBatch = (c: Cell, count: number) => {
    for (let i = 0; i < count; i++) {
      const { r } = play((c.seed = (c.seed * 1103515245 + 12345) >>> 0), DECKS[c.a], DECKS[c.b]);
      c.n++;
      if (r > 0) c.wins++;
      else if (r === 0) c.draws++;
    }
  };

  // Warm-up so every cell has a defined interval before we start choosing.
  for (const c of cells) runBatch(c, batch);
  let spent = cells.length * batch;
  while (spent < budget) {
    // Widest interval first. Draws count as neither, matching the report.
    const worst = cells.reduce((x, y) =>
      wilson(y.wins, y.n).half > wilson(x.wins, x.n).half ? y : x,
    );
    runBatch(worst, batch);
    spent += batch;
  }
  return { cells, spent };
}

// ---------------------------------------------------------------------------
// EXPERIMENT 2: Monte Carlo over the deck-composition space
// ---------------------------------------------------------------------------
//
// ~80 cards choose ~19 under a provision cap is far past enumeration, so we
// sample uniformly at random from the LEGAL region: within budget, and holding
// no astra the deck cannot invoke (checkDeckAstras, the same rule the content
// tests enforce). Each sampled deck plays the three curated decks.
//
// The question is not "which random deck is best". It is whether the curated
// decks sit near the top of their own distribution or somewhere in the middle,
// because a curated deck that a random build beats is not a designed deck.

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomDeck(house: House, rng: () => number, size: number): DeckList | null {
  const pool = allCards().filter(
    (c) =>
      (c.house === house || c.house === 'neutral' || c.house === 'legend') &&
      c.type !== 'curse' &&
      (c.astraTier ?? 0) < 3, // ultimates are earned at a shrine, never dealt
  );
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const cards: CardId[] = [];
  let cost = 0;
  for (const c of shuffled) {
    if (cards.length >= size) break;
    const p = provisionOf(c);
    if (cost + p > DECK_BUDGET) continue;
    cards.push(c.id);
    cost += p;
  }
  if (cards.length < size) return null;
  const deck: DeckList = { id: `rand-${house}`, name: 'random', house, cards };
  // Same legality rule the content tests enforce: no astra without a wielder.
  return checkDeckAstras(deck).length ? null : deck;
}

function randomDeckSearch(samplesPerHouse: number, gamesPerPairing: number) {
  const rng = mulberry32(0xC0FFEE);
  const houses: House[] = ['pandava', 'kaurava', 'asura'];
  const out: { house: House; wins: number; n: number; cost: number; cards: CardId[] }[] = [];
  const curated = Object.values(DECKS);

  for (const house of houses) {
    let made = 0;
    let guard = 0;
    while (made < samplesPerHouse && guard++ < samplesPerHouse * 40) {
      const deck = randomDeck(house, rng, 19);
      if (!deck) continue;
      made++;
      let wins = 0;
      let n = 0;
      let seed = 7;
      for (const foe of curated) {
        for (let i = 0; i < gamesPerPairing; i++) {
          seed = (seed * 1103515245 + 12345) >>> 0;
          // Both orientations, so side order cannot flatter the sample.
          const x = play(seed, deck, foe);
          if (x.r > 0) wins++;
          n++;
          const y = play(seed ^ 0x5bf03635, foe, deck);
          if (y.r < 0) wins++;
          n++;
        }
      }
      out.push({ house, wins, n, cost: deckProvisions(deck), cards: deck.cards });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// EXPERIMENT 3: pairwise card coverage
// ---------------------------------------------------------------------------
//
// All-pairs is the standard answer to combinatorial explosion: exercising every
// PAIR of cards catches the large majority of interaction faults at a tiny
// fraction of the cost of every combination. We do not need to construct a
// covering array here, because the shuffle already samples pairs for us; we
// just have to WATCH which pairs actually landed together and score them.
//
// Lift = win rate when both cards were committed, minus the deck's base rate.

function pairSynergy(gamesPerPairing: number) {
  const pairWins = new Map<string, { w: number; n: number }>();
  const deckBase = new Map<string, { w: number; n: number }>();
  const names = Object.keys(DECKS);
  let seed = 99;

  for (const a of names) {
    for (const b of names) {
      if (a === b) continue;
      for (let i = 0; i < gamesPerPairing; i++) {
        seed = (seed * 1103515245 + 12345) >>> 0;
        const { r, played } = play(seed, DECKS[a], DECKS[b]);
        const won = r > 0 ? 1 : 0;
        const base = deckBase.get(a) ?? { w: 0, n: 0 };
        base.w += won;
        base.n++;
        deckBase.set(a, base);

        const list = [...played].filter((c) => getCard(c).type === 'unit').sort();
        for (let x = 0; x < list.length; x++) {
          for (let y = x + 1; y < list.length; y++) {
            const k = `${a}|${list[x]}|${list[y]}`;
            const e = pairWins.get(k) ?? { w: 0, n: 0 };
            e.w += won;
            e.n++;
            pairWins.set(k, e);
          }
        }
      }
    }
  }
  const rows = [...pairWins.entries()]
    .map(([k, v]) => {
      const [deck, x, y] = k.split('|');
      const base = deckBase.get(deck)!;
      return { deck, x, y, n: v.n, rate: v.w / v.n, lift: v.w / v.n - base.w / base.n };
    })
    .filter((r) => r.n >= MIN_PAIR_N);
  rows.sort((p, q) => q.lift - p.lift);
  return rows;
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const scale = Number(process.argv[2] ?? 1);
const L: string[] = [];
const t0 = Date.now();

L.push('\nKURUKSHETRA EXPLORATION LAB');
L.push('='.repeat(70));

// --- 1
const { cells, spent } = matchupMatrix(3000 * scale);
L.push(`\n1. MATCHUP MATRIX   ${spent} games, allocated adaptively (widest Wilson interval first)`);
L.push('   Row = deck moving FIRST. Cell = row deck\'s win rate against column deck.\n');
const names = Object.keys(DECKS);
L.push('   ' + pad('first \\ second', 18) + names.map((n) => pad(n.replace('_starter', ''), 20)).join(''));
for (const a of names) {
  const row = names.map((b) => {
    const c = cells.find((x) => x.a === a && x.b === b)!;
    const w = wilson(c.wins, c.n);
    return pad(`${pct(w.p)} +/-${(w.half * 100).toFixed(1)} n=${c.n}`, 20);
  });
  L.push('   ' + pad(a.replace('_starter', ''), 18) + row.join(''));
}
const mirrors = names.map((n) => {
  const c = cells.find((x) => x.a === n && x.b === n)!;
  return { n, w: wilson(c.wins, c.n) };
});
L.push('\n   MIRROR CHECK (a deck against itself must be ~50%; the gap is the seat, not the cards)');
for (const m of mirrors) {
  const off = Math.abs(m.w.p - 0.5) * 100;
  const flag = m.w.lo > 0.5 || m.w.hi < 0.5 ? '   <-- NOT 50%, first-mover effect' : '';
  L.push(`     ${pad(m.n.replace('_starter', ''), 12)} ${pct(m.w.p)}  (${off.toFixed(1)} off even)${flag}`);
}

// --- 2
const samples = randomDeckSearch(10 * scale, 10 * scale);
L.push(`\n\n2. RANDOM DECK SEARCH   ${samples.length} legal random decks, Monte Carlo over composition`);
L.push('   Each plays all three curated decks in both orientations.\n');
for (const house of ['pandava', 'kaurava', 'asura'] as House[]) {
  const mine = samples.filter((s) => s.house === house).map((s) => s.wins / s.n);
  if (!mine.length) continue;
  mine.sort((a, b) => b - a);
  const mean = mine.reduce((x, y) => x + y, 0) / mine.length;
  L.push(
    `   ${pad(house, 10)} best ${pct(mine[0])}   median ${pct(mine[Math.floor(mine.length / 2)])}` +
      `   mean ${pct(mean)}   worst ${pct(mine[mine.length - 1])}   (${mine.length} decks)`,
  );
}
// Interval clear of 50%, not raw rate. A first pass reported "61.1%" for a
// random deck off eleven wins in eighteen games, which is indistinguishable
// from a coin. Only count a deck as beating the field if the Wilson lower
// bound is above even.
const beaters = samples
  .filter((s) => wilson(s.wins, s.n).lo > 0.5)
  .sort((a, b) => b.wins / b.n - a.wins / a.n);
L.push(
  `\n   Random decks that beat the curated field with the interval CLEAR of 50%:` +
    ` ${beaters.length} of ${samples.length}`,
);
for (const b of beaters.slice(0, 5)) {
  const w = wilson(b.wins, b.n);
  L.push(`     ${pct(w.p)} [${pct(w.lo)}-${pct(w.hi)}] n=${b.n}  ${b.house}  ${b.cost}p`);
  L.push(`        ${b.cards.join(', ')}`);
}

// --- 3
const pairs = pairSynergy(60 * scale);
L.push(`\n\n3. PAIRWISE CARD COVERAGE   ${pairs.length} card pairs seen together at least ${MIN_PAIR_N} times`);
L.push('   Lift = win rate with BOTH committed, minus that deck\'s base rate.\n');
L.push('   STRONGEST PAIRS');
for (const r of pairs.slice(0, 6)) {
  L.push(`     ${(r.lift * 100 >= 0 ? '+' : '') + (r.lift * 100).toFixed(1)}pp  ${pad(r.x + ' + ' + r.y, 40)} n=${r.n}  ${r.deck.replace('_starter', '')}`);
}
L.push('   WEAKEST PAIRS');
for (const r of pairs.slice(-6).reverse()) {
  L.push(`     ${(r.lift * 100 >= 0 ? '+' : '') + (r.lift * 100).toFixed(1)}pp  ${pad(r.x + ' + ' + r.y, 40)} n=${r.n}  ${r.deck.replace('_starter', '')}`);
}

L.push(`\n\nElapsed ${((Date.now() - t0) / 1000).toFixed(0)}s`);
process.stdout.write(L.join('\n') + '\n');
