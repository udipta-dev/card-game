// Where does a carried astra actually go?
//
// Bhagadatta and Indrajit each walk onto the field holding the Vaishnava. The
// lab says it fires 0.00 times per game. This measures the chain link by link:
// granted by the carrier, then drawn out of the deck, then actually loosed.
import { reduce } from '@engine/reducer';
import { createMatch } from '@engine/createMatch';
import { chooseAction } from '@ai/ai';
import { PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK } from '@content/decks';
import { getCard } from '@content/cards';
import type { GameState } from '@engine/types';

const DECKS = [PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK];
const GAMES = 400;

interface Tally {
  granted: number;
  drawn: number;
  played: number;
  strandedInDeck: number;
  strandedInHand: number;
}
const tally: Record<string, Tally> = {};
const bump = (id: string): Tally =>
  (tally[id] ??= { granted: 0, drawn: 0, played: 0, strandedInDeck: 0, strandedInHand: 0 });

for (let g = 0; g < GAMES; g++) {
  const a = DECKS[g % 3];
  const b = DECKS[(g + 1 + (g % 2)) % 3];
  let s: GameState = createMatch(g * 7919 + 13, a, b);
  s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
  s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });

  // Which granted instances have we already seen leave the deck?
  const seenGrant = new Set<string>();
  const seenDraw = new Set<string>();

  for (let step = 0; step < 800 && s.phase !== 'battleEnd'; step++) {
    const next = reduce(s, chooseAction(s, s.activeSeat));
    if (next === s) break;
    s = next;

    for (const e of s.log) {
      if (e.t !== 'granted') continue;
      const key = `${e.seat}:${e.cardId}`;
      if (seenGrant.has(key)) continue;
      seenGrant.add(key);
      bump(e.cardId).granted++;
    }
    // A granted card counts as drawn the first time it appears in a hand.
    for (const key of seenGrant) {
      if (seenDraw.has(key)) continue;
      const [seat, cardId] = key.split(':');
      const inHand = s.hands[seat as 'player' | 'ai'].some(
        (iid) => s.instances[iid]?.cardId === cardId,
      );
      if (inHand) {
        seenDraw.add(key);
        bump(cardId).drawn++;
      }
    }
  }

  // Final resting place of everything that was granted and never loosed.
  for (const key of seenGrant) {
    const [rawSeat, cardId] = key.split(':');
    const seat = rawSeat as 'player' | 'ai';
    const is = (iid: string) => s.instances[iid]?.cardId === cardId;
    const played = s.log.some((e) => e.t === 'play' && e.seat === seat && e.cardId === cardId);
    if (played) bump(cardId).played++;
    else if (s.decks[seat].some(is)) bump(cardId).strandedInDeck++;
    else if (s.hands[seat].some(is)) bump(cardId).strandedInHand++;
  }
}

console.log(`\nCARRIED ASTRAS   ${GAMES} games\n`);
console.log('                     granted   drawn   loosed   stuck in deck   stuck in hand');
for (const [id, t] of Object.entries(tally).sort((x, y) => y[1].granted - x[1].granted)) {
  const pct = (n: number) => `${((n / Math.max(1, t.granted)) * 100).toFixed(0)}%`.padStart(6);
  console.log(
    `  ${getCard(id).name.padEnd(20)}${String(t.granted).padStart(5)}` +
      `${pct(t.drawn)}  ${pct(t.played)}` +
      `${pct(t.strandedInDeck)}          ${pct(t.strandedInHand)}`,
  );
}
console.log();
