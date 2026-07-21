// The balance lab: run many seeded AI-vs-AI games and report the numbers that
// tell us whether the game is fair and whether every card and astra pulls its
// weight. Pure and deterministic. Run via `npm run sim`.
import { getCard } from '@content/cards';
import { KAURAVA_DECK, PANDAVA_DECK, deckProvisions } from '@content/decks';
import type { DeckList } from '@content/decks';
import { createMatch } from '@engine/createMatch';
import { reduce } from '@engine/reducer';
import type { GameState, Seat } from '@engine/types';
import { chooseAction } from './ai';

const MAX_STEPS = 800;
const SEATS: Seat[] = ['player', 'ai'];

interface GameResult {
  winner: Seat | null;
  rounds: number;
  steps: number;
  playedBySeat: Record<Seat, Set<string>>;
  astraFires: Record<string, number>;
  astraCountered: Record<string, number>;
}

function playout(seed: number, first: DeckList, second: DeckList): GameResult {
  let s: GameState = createMatch(seed, first, second);
  s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
  s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });

  let steps = 0;
  while (s.phase !== 'battleEnd' && steps < MAX_STEPS) {
    s = reduce(s, chooseAction(s, s.activeSeat));
    steps++;
  }

  const playedBySeat: Record<Seat, Set<string>> = { player: new Set(), ai: new Set() };
  const astraFires: Record<string, number> = {};
  const astraCountered: Record<string, number> = {};
  for (const ev of s.log) {
    if (ev.t === 'play') {
      playedBySeat[ev.seat].add(ev.cardId);
      if (getCard(ev.cardId).type === 'astra') astraFires[ev.cardId] = (astraFires[ev.cardId] ?? 0) + 1;
    } else if (ev.t === 'countered') {
      astraCountered[ev.astra] = (astraCountered[ev.astra] ?? 0) + 1;
    }
  }
  return { winner: s.winner, rounds: s.round, steps, playedBySeat, astraFires, astraCountered };
}

export interface BalanceReport {
  games: number;
  drawRate: number;
  firstPlayerWinRate: number;
  avgRounds: number;
  avgSteps: number;
  decks: Record<string, { asFirst: number; asSecond: number; overall: number; provisions: number }>;
  cards: Array<{ cardId: string; name: string; played: number; playRate: number; winRateWhenPlayed: number }>;
  astras: Array<{ astra: string; name: string; firesPerGame: number; counterRate: number }>;
}

export function runBalance(gamesPerOrientation = 500): BalanceReport {
  const orientations: Array<{ first: DeckList; second: DeckList }> = [
    { first: PANDAVA_DECK, second: KAURAVA_DECK },
    { first: KAURAVA_DECK, second: PANDAVA_DECK },
  ];

  let total = 0;
  let firstWins = 0;
  let draws = 0;
  let roundsSum = 0;
  let stepsSum = 0;

  const deck: Record<string, { first: number; firstN: number; second: number; secondN: number }> = {};
  const ensure = (h: string) => (deck[h] ??= { first: 0, firstN: 0, second: 0, secondN: 0 });

  const cardPlayed: Record<string, number> = {};
  const cardWins: Record<string, number> = {};
  const astraFires: Record<string, number> = {};
  const astraCountered: Record<string, number> = {};

  orientations.forEach((o, oi) => {
    for (let i = 0; i < gamesPerOrientation; i++) {
      const seed = (oi * 1_000_003 + i + 1) >>> 0;
      const r = playout(seed, o.first, o.second);
      total++;
      roundsSum += r.rounds;
      stepsSum += r.steps;

      ensure(o.first.house).firstN++;
      ensure(o.second.house).secondN++;
      if (r.winner === 'player') {
        firstWins++;
        ensure(o.first.house).first++;
      } else if (r.winner === 'ai') {
        ensure(o.second.house).second++;
      } else {
        draws++;
      }

      for (const seat of SEATS) {
        for (const cid of r.playedBySeat[seat]) {
          cardPlayed[cid] = (cardPlayed[cid] ?? 0) + 1;
          if (r.winner === seat) cardWins[cid] = (cardWins[cid] ?? 0) + 1;
        }
      }
      for (const [a, n] of Object.entries(r.astraFires)) astraFires[a] = (astraFires[a] ?? 0) + n;
      for (const [a, n] of Object.entries(r.astraCountered)) astraCountered[a] = (astraCountered[a] ?? 0) + n;
    }
  });

  const decks: BalanceReport['decks'] = {};
  const provisionByHouse: Record<string, number> = {
    pandava: deckProvisions(PANDAVA_DECK),
    kaurava: deckProvisions(KAURAVA_DECK),
  };
  for (const [h, d] of Object.entries(deck)) {
    decks[h] = {
      asFirst: d.firstN ? d.first / d.firstN : NaN,
      asSecond: d.secondN ? d.second / d.secondN : NaN,
      overall: (d.first + d.second) / (d.firstN + d.secondN),
      provisions: provisionByHouse[h] ?? 0,
    };
  }

  const universe = new Set([...PANDAVA_DECK.cards, ...KAURAVA_DECK.cards]);
  const cards = [...universe]
    .map((cid) => {
      const played = cardPlayed[cid] ?? 0;
      return {
        cardId: cid,
        name: getCard(cid).name,
        played,
        playRate: played / total,
        winRateWhenPlayed: played ? (cardWins[cid] ?? 0) / played : NaN,
      };
    })
    .sort((a, b) => (b.winRateWhenPlayed || 0) - (a.winRateWhenPlayed || 0));

  const astras = Object.keys(astraFires)
    .map((a) => ({
      astra: a,
      name: getCard(a).name,
      firesPerGame: astraFires[a] / total,
      counterRate: astraFires[a] ? (astraCountered[a] ?? 0) / astraFires[a] : 0,
    }))
    .sort((x, y) => y.firesPerGame - x.firesPerGame);

  return {
    games: total,
    drawRate: draws / total,
    firstPlayerWinRate: firstWins / total,
    avgRounds: roundsSum / total,
    avgSteps: stepsSum / total,
    decks,
    cards,
    astras,
  };
}

const pct = (x: number) => (Number.isNaN(x) ? '  n/a' : `${(x * 100).toFixed(1)}%`);
const pad = (s: string, n: number) => s.padEnd(n);

export function formatReport(r: BalanceReport): string {
  const L: string[] = [];
  L.push(`\nKURUKSHETRA BALANCE LAB   ${r.games} games (${r.games / 2} per side order)`);
  L.push('='.repeat(58));
  L.push(`First-mover win rate  ${pct(r.firstPlayerWinRate)}   (50% is fair, the coin)`);
  L.push(`Draw rate             ${pct(r.drawRate)}`);
  L.push(`Avg rounds / game     ${r.avgRounds.toFixed(2)}`);
  L.push(`Avg plays / game      ${r.avgSteps.toFixed(1)}`);
  L.push('');
  L.push('DECKS               overall   as 1st   as 2nd   provisions');
  for (const [h, d] of Object.entries(r.decks)) {
    L.push(
      `  ${pad(h, 16)}${pad(pct(d.overall), 10)}${pad(pct(d.asFirst), 9)}${pad(pct(d.asSecond), 9)}${d.provisions}`,
    );
  }
  L.push('');
  L.push('ASTRAS              fires/game   countered');
  for (const a of r.astras) {
    L.push(`  ${pad(a.name, 18)}${pad(a.firesPerGame.toFixed(2), 13)}${pct(a.counterRate)}`);
  }
  L.push('');
  L.push('CARD WIN RATE WHEN PLAYED   (>55% strong, <45% weak, watch for dead cards)');
  for (const c of r.cards) {
    const flag = c.played === 0 ? '  DEAD (never played)' : '';
    L.push(`  ${pad(c.name, 22)}${pad(pct(c.winRateWhenPlayed), 8)}  play ${pct(c.playRate)}${flag}`);
  }
  L.push('');
  return L.join('\n');
}
