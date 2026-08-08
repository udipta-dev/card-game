// Play the WHOLE card set, not just the three starter decks.
//
// The balance lab only ever fields the starters, which is 57 distinct cards out
// of 128. Everything else, every vardaan, every shastra, the fourteen new
// asuras, Vishwaroop, Krishna since he left the deck, has never been played by
// anything, ever. A card can be broken in a way no test and no lab run would
// find, because nothing has committed it once.
//
// This builds random LEGAL hosts from each house's full muster pool and plays
// them against each other, looking for three things:
//   1. crashes and invalid states
//   2. cards that never do anything when committed
//   3. games that fail to terminate
//
// It is not a balance measurement. Random decks are not good decks, so win
// rates here mean nothing; what means something is a card that throws, or a
// card that silently does nothing every time it is played.
import { reduce } from '@engine/reducer';
import { createMatch } from '@engine/createMatch';
import { legalMoves } from '@engine/selectors';
import { getCard } from '@content/cards';
import { autoMuster, checkMuster, poolFor } from '@content/muster';
import { nextRandom } from '@engine/ids';
import type { GameState, House } from '@engine/types';

const HOUSES: House[] = ['pandava', 'kaurava', 'asura'];
const GAMES = Number(process.argv[2] ?? 400);

/** A legal random host from this house's full pool, built with a seeded shuffle. */
function randomHost(house: House, seed: number): { cards: string[]; seed: number } {
  const pool = poolFor(house).map((c) => c.id);
  // [nextSeed, value]. Getting this backwards is how the round-trade bug
  // happened, so it is spelled out here too.
  let s = seed >>> 0;
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const [next, r] = nextRandom(s);
    s = next;
    const j = Math.floor(r * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // Greedily take what fits, so every host is legal and every card gets turns.
  const host: string[] = [];
  for (const id of shuffled) {
    const trial = [...host, id];
    const c = checkMuster(trial);
    if (c.count <= 19 && c.provisions <= 170) host.push(id);
    if (host.length >= 19) break;
  }
  // If the greedy pass produced something illegal (too few warriors), fall back.
  return { cards: checkMuster(host).ok ? host : autoMuster(pool), seed: s };
}

const played = new Map<string, number>();
const acted = new Map<string, number>();
const crashes: string[] = [];
let unterminated = 0;
let maxSteps = 0;

const DID = new Set([
  'damage','buff','setPower','destroy','preventDestroy','redirected','debuffRow',
  'discard','draw','denied','attach','dismount','cleanse','stripped','drewAstra',
  'afflict','burn','hazard','hazardLifted','granted','countered','clash','suspended','ban',
]);

let seed = 20260808;
for (let g = 0; g < GAMES; g++) {
  const hA = HOUSES[g % 3];
  const hB = HOUSES[(g + 1 + (g % 2)) % 3];
  const a = randomHost(hA, seed + g * 7919);
  const b = randomHost(hB, a.seed + 104729);
  seed = b.seed;

  try {
    let s: GameState = createMatch(
      g * 31337 + 7,
      { id: 'A', name: 'A', house: hA, cards: a.cards },
      { id: 'B', name: 'B', house: hB, cards: b.cards },
    );
    s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
    s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });

    let step = 0;
    for (; step < 1200 && s.phase !== 'battleEnd'; step++) {
      const before = s.log.length;
      // A dumb but exhaustive policy: play a random legal move. This exercises
      // card combinations no heuristic AI would ever choose, which is the point.
      const moves = legalMoves(s, s.activeSeat);
      if (!moves.length) break;
      const [next, r] = nextRandom(seed);
      seed = next;
      const move = moves[Math.floor(r * moves.length)];
      const after = reduce(s, move);
      if (after === s) break;
      s = after;

      const fresh = s.log.slice(before);
      const play = fresh.find((e) => e.t === 'play');
      if (play && play.t === 'play') {
        played.set(play.cardId, (played.get(play.cardId) ?? 0) + 1);
        if (fresh.some((e) => DID.has(e.t))) acted.set(play.cardId, (acted.get(play.cardId) ?? 0) + 1);
      }

      // Invariants that must hold after EVERY move.
      for (const seat of ['player', 'ai'] as const) {
        if (s.hands[seat].some((i) => !s.instances[i])) throw new Error('hand holds a dead instance');
        if (s.decks[seat].some((i) => !s.instances[i])) throw new Error('deck holds a dead instance');
      }
      if (s.round > 3) throw new Error(`round ${s.round} exceeds MAX_ROUNDS`);
      if (s.phase === 'playing' && !s.activeSeat) throw new Error('playing with no active seat');
    }
    maxSteps = Math.max(maxSteps, step);
    if (s.phase !== 'battleEnd') unterminated++;
  } catch (err) {
    crashes.push(`game ${g} [${hA} vs ${hB}]: ${(err as Error).message}`);
  }
}

console.log(`\nFULL-SET FUZZ   ${GAMES} games, random legal hosts from the whole pool\n`);
console.log(`crashes / invalid states : ${crashes.length}`);
for (const c of crashes.slice(0, 10)) console.log('   ' + c);
console.log(`games that did not finish: ${unterminated}`);
console.log(`longest game (steps)     : ${maxSteps}`);
console.log(`distinct cards committed : ${played.size}`);

const silent = [...played.entries()]
  .filter(([, n]) => n >= 6)
  .map(([id, n]) => ({ id, n, rate: (acted.get(id) ?? 0) / n }))
  .filter((x) => x.rate < 0.2)
  .filter((x) => getCard(x.id).effects.some((e) => e.on === 'onPlay'))
  .sort((a, b) => a.rate - b.rate);

console.log(`\nonPlay cards that almost never do anything:`);
if (!silent.length) console.log('  none');
for (const x of silent) {
  console.log(`  ${(x.rate * 100).toFixed(0).padStart(3)}%  of ${String(x.n).padStart(4)}   ${getCard(x.id).name}`);
}

const neverPlayed = HOUSES.flatMap((h) => poolFor(h).map((c) => c.id))
  .filter((id, i, arr) => arr.indexOf(id) === i)
  .filter((id) => !played.has(id));
console.log(`\nstill never committed (${neverPlayed.length}):`);
console.log('  ' + (neverPlayed.map((i) => getCard(i).name).join(', ') || 'none'));
console.log();
