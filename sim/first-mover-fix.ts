// PAYING THE FIRST MOVER, measured rather than reasoned about.
//
// sim/first-mover.ts established the problem and ruled out the obvious
// explanation: whoever moves first wins 42.7%, and it is NOT "last say", since
// the seat acting last in a round wins only 25.5% of them. The mechanism is the
// opening commitment. Moving first means showing your hand first in round one
// with nothing paid for it, and rounds.ts then hands the next round's opening to
// whoever just won, which rubber-bands rounds 2 and 3 but leaves round 1's
// opener uncompensated.
//
// So the fix has to be a payment, and the only question is which one and how
// much. Four candidates, each a single number, each measured head to head
// against no compensation at all:
//
//   card      the opener draws a seventh card in the opening hand
//   mull      the opener may throw back three cards instead of two
//   swap      the opener gets the round-one card trade, which nobody has today
//   draw2     the opener draws a third card at the top of round two
//
// The target is 50%, and OVERSHOOTING IS AS BAD AS UNDERSHOOTING: a compensation
// that takes the opener to 58% has not fixed the coin flip, it has flipped which
// side of it you want to be on.
//
//   npm run first-mover-fix [games]
import { reduce } from '@engine/reducer';
import { createMatch, MULLIGAN_MAX, OPENING_HAND } from '@engine/createMatch';
import { chooseAction } from '@ai/ai';
import { worstCards } from '@ai/hand';
import { PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK } from '@content/decks';
import type { GameState, Seat } from '@engine/types';

const DECKS = [PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK];
const GAMES = Number(process.argv[2] ?? 1200);

type Payment =
  | 'none' | 'card' | 'mull' | 'swap' | 'draw2' | 'lost1' | 'behind3' | 'lostAny'
  | 'ground1' | 'ground2' | 'ground3' | 'ground4' | 'ground6' | 'ground8'
  | 'peek' | 'sift1' | 'sift2' | 'sift3' | 'sift1ground2' | 'sift1ground4';

/**
 * Apply the compensation to a freshly built match.
 *
 * Done by editing the state rather than by adding a flag to the engine, because
 * three of these four will be thrown away and an engine option per experiment is
 * how a rules engine turns into a settings screen.
 */
function pay(s: GameState, opener: Seat, how: Payment): GameState {
  if (how === 'card') {
    const drawn = s.decks[opener].shift();
    if (drawn) s.hands[opener].push(drawn);
  }
  if (how === 'swap') s.roundSwap[opener] = true;
  if (how === 'peek') {
    const drawn = s.decks[opener].shift();
    if (drawn) s.hands[opener].push(drawn);
  }
  // SIFTING. Draw N extra, put the N worst straight back, so the hand is the
  // same SIZE as everyone else's and merely better chosen. The ground dial
  // flattened at 46% however much power it gave, which says the deficit is not
  // a power problem: it is that the opener commits blind. This pays in exactly
  // the currency the problem is denominated in, and it is tunable one card at
  // a time.
  if (how.startsWith('sift')) {
    const n = Number(how[4]);
    for (let i = 0; i < n; i++) {
      const drawn = s.decks[opener].shift();
      if (drawn) s.hands[opener].push(drawn);
    }
    for (let i = 0; i < n; i++) {
      const [worst] = worstCards(s, opener, 1);
      if (!worst) break;
      s.hands[opener] = s.hands[opener].filter((x) => x !== worst);
      s.decks[opener].push(worst);
    }
  }
  return s;
}

function play(seed: number, aDeck: number, bDeck: number, opener: Seat, how: Payment): Seat | null {
  let s: GameState = createMatch(seed, DECKS[aDeck], DECKS[bDeck], opener);
  s = pay(s, opener, how);

  // Mulligans dispatched per seat, so the extra throw-back goes to the opener
  // and only to the opener.
  for (const seat of ['player', 'ai'] as Seat[]) {
    const allowed = how === 'mull' && seat === opener ? MULLIGAN_MAX + 1 : MULLIGAN_MAX;
    s = reduce(s, { type: 'MULLIGAN', seat, iids: worstCards(s, seat, allowed) });
  }

  const ground = how.startsWith('ground') || how.includes('ground') ? Number(how.slice(-1)) : 0;
  let paid = false;
  let round = s.round;
  for (let step = 0; step < 900 && s.phase !== 'battleEnd'; step++) {
    // Anything paid at a ROUND BOUNDARY, handed over the moment the round turns
    // rather than inside rounds.ts, so a rejected experiment leaves no trace.
    if (s.round !== round) {
      round = s.round;
      const behind = s.roundWins[opener] < s.roundWins[opener === 'player' ? 'ai' : 'player'];
      const give =
        (how === 'draw2' && round === 2) ||
        (how === 'lost1' && round === 2 && behind) ||
        (how === 'behind3' && round === 3 && behind) ||
        (how === 'lostAny' && behind);
      if (give) {
        const drawn = s.decks[opener].shift();
        if (drawn) s.hands[opener].push(drawn);
      }
      // BETTER SELECTION, NO LASTING ADVANTAGE. A seventh card at the deal is
      // worth 24 points and the deficit is 7.7, so the card goes back at the
      // top of round two: the opener sees more of his deck before committing
      // and ends the round holding exactly what everyone else holds.
      if (how === 'peek' && round === 2) {
        const [worst] = worstCards(s, opener, 1);
        if (worst) {
          s.hands[opener] = s.hands[opener].filter((i) => i !== worst);
          s.decks[opener].push(worst);
        }
      }
    }
    const next = reduce(s, chooseAction(s, s.activeSeat));
    if (next === s) break;
    s = next;

    // THE GROUND. A finer dial than a card: the first warrior the opener
    // commits stands a little stronger for having shown his hand first. A card
    // is worth about 24 points in this game and the deficit is 7.7, so paying
    // in cards can only miss; power is tunable one point at a time.
    if (ground && !paid) {
      const rows = s.board[opener];
      const first = (['ratha', 'gaja', 'padati'] as const).flatMap((r) => rows[r])[0];
      if (first) {
        const inst = s.instances[first];
        if (inst) {
          inst.currentPower += ground;
          paid = true;
        }
      }
    }
  }
  return s.winner;
}

function measure(how: Payment) {
  let openerWins = 0;
  let decided = 0;
  for (let g = 0; g < GAMES; g++) {
    const a = g % 3;
    const b = (g + 1 + (g % 2)) % 3;
    // Alternate which seat opens, so a seat-specific quirk cannot masquerade as
    // a turn-order effect.
    const opener: Seat = g % 2 === 0 ? 'player' : 'ai';
    const w = play(g * 6151 + 17, a, b, opener, how);
    if (w === null) continue;
    decided++;
    if (w === opener) openerWins++;
  }
  const pct = (openerWins / decided) * 100;
  const ci = 196 * Math.sqrt((pct / 100) * (1 - pct / 100) / decided);
  return { pct, ci, decided };
}

console.log(`${GAMES} games each, opener alternated. Opening hand ${OPENING_HAND}, mulligan ${MULLIGAN_MAX}.\n`);
console.log('compensation                              first mover wins');
const LABEL: Record<Payment, string> = {
  none: 'none, as it ships today',
  card: 'a seventh card in the opening hand',
  mull: 'one more card thrown back at the deal',
  swap: 'the round-one trade, which nobody has',
  draw2: 'a third card at the top of round two',
  lost1: 'a card at round two, only if round one was lost',
  behind3: 'a card at round three, only if a round behind',
  lostAny: 'a card at any round they are behind',
  ground1: 'his first warrior stands +1 stronger',
  ground2: 'his first warrior stands +2 stronger',
  ground3: 'his first warrior stands +3 stronger',
  ground4: 'his first warrior stands +4 stronger',
  ground6: 'his first warrior stands +6 stronger',
  ground8: 'his first warrior stands +8 stronger',
  peek: 'a seventh card, given back at round two',
  sift1: 'sees 1 extra card, puts the worst straight back',
  sift2: 'sees 2 extra cards, puts the 2 worst back',
  sift3: 'sees 3 extra cards, puts the 3 worst back',
  sift1ground2: 'sifts 1, and his first warrior stands +2',
  sift1ground4: 'sifts 1, and his first warrior stands +4',
};
for (const how of ['none', 'sift1', 'sift1ground2', 'sift1ground4'] as Payment[]) {
  const r = measure(how);
  const miss = Math.abs(r.pct - 50);
  const verdict = miss <= r.ci ? 'even' : r.pct > 50 ? 'OVERPAID' : 'still short';
  console.log(`  ${LABEL[how].padEnd(38)} ${r.pct.toFixed(1)}% +-${r.ci.toFixed(1)}  ${verdict}`);
}
