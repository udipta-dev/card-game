// Which cards do NOTHING when they are played?
//
// The balance lab measures win rate when played, which conflates "this card is
// weak" with "this card's text never fires at all". Those need different fixes,
// and the second is a bug rather than a tuning problem.
//
// This plays real matches and, for every card committed, diffs the log to see
// whether that card's own effects produced any observable event. A card that
// resolves silently every single time is either unreachable, gated on something
// that never happens, or broken.
import { reduce } from '@engine/reducer';
import { createMatch } from '@engine/createMatch';
import { chooseAction } from '@ai/ai';
import { allCards, getCard } from '@content/cards';
import { PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK } from '@content/decks';
import type { GameState } from '@engine/types';

const DECKS = [PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK];
const GAMES = Number(process.argv[2] ?? 900);

/** Events that mean the card actually DID something to the world. */
const DID_SOMETHING = new Set([
  'damage', 'buff', 'setPower', 'destroy', 'preventDestroy', 'redirected',
  'debuffRow', 'discard', 'draw', 'denied', 'attach', 'dismount', 'cleanse',
  'stripped', 'drewAstra', 'afflict', 'burn', 'hazard', 'hazardLifted',
  'granted', 'countered', 'clash', 'suspended', 'ban',
]);

interface Row { played: number; didSomething: number }
const seen = new Map<string, Row>();
const bump = (id: string): Row => {
  if (!seen.has(id)) seen.set(id, { played: 0, didSomething: 0 });
  return seen.get(id)!;
};

for (let g = 0; g < GAMES; g++) {
  const a = DECKS[g % 3];
  const b = DECKS[(g + 1 + (g % 2)) % 3];
  let s: GameState = createMatch(g * 7919 + 13, a, b);
  s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
  s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });

  for (let step = 0; step < 800 && s.phase !== 'battleEnd'; step++) {
    const before = s.log.length;
    const action = chooseAction(s, s.activeSeat);
    const next = reduce(s, action);
    if (next === s) break;
    s = next;
    if (action.type !== 'PLAY_CARD') continue;

    // The play event itself, then whatever it caused before the turn passed.
    const fresh = s.log.slice(before);
    const play = fresh.find((e) => e.t === 'play');
    if (!play || play.t !== 'play') continue;
    const row = bump(play.cardId);
    row.played++;
    if (fresh.some((e) => DID_SOMETHING.has(e.t))) row.didSomething++;
  }
}

// ONLY cards with an onPlay effect. A keyword is passive and an ability is a
// separate move, so neither emits anything when the card is committed: including
// them made Arjuna, Bhishma, Drona and Ravana all read as "never fires", which
// is a fault in the probe rather than in the cards.
const cards = allCards().filter((c) => c.effects.some((e) => e.on === 'onPlay'));
const rows = cards
  .map((c) => ({ c, r: seen.get(c.id) }))
  .filter((x) => x.r && x.r.played >= 8)
  .map((x) => ({
    name: x.c.name,
    id: x.c.id,
    played: x.r!.played,
    rate: x.r!.didSomething / x.r!.played,
  }))
  .sort((a, b) => a.rate - b.rate);

console.log(`\nDID THE CARD'S TEXT ACTUALLY FIRE?   ${GAMES} games\n`);
console.log('  fires   played   card');
for (const r of rows.slice(0, 26)) {
  const flag = r.rate === 0 ? '  <-- NEVER' : r.rate < 0.35 ? '  <-- rarely' : '';
  console.log(`  ${(r.rate * 100).toFixed(0).padStart(4)}%  ${String(r.played).padStart(6)}   ${r.name}${flag}`);
}

const never = cards.filter((c) => !seen.has(c.id));
if (never.length) {
  console.log(`\nNEVER COMMITTED AT ALL (not in any starter deck, or unreachable):`);
  console.log('  ' + never.map((c) => c.name).join(', '));
}
console.log();
