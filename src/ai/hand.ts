// What is a card in my hand actually worth to me?
//
// The AI had no answer to this, and it cost two whole mechanics. It never
// mulliganed, because there was no mulligan policy anywhere. It never traded,
// because AI_USES_ROUND_SWAP was false, and it was false because the only
// heuristic anyone had written asked one narrow question: "is this astra dead?"
//
// That question is not symmetric across the houses. Every Pandava astra keeps a
// possible wielder somewhere, because their masters can fire anything in the
// Brahma line, while Kaurava and Asura carry weapons tied to one named man that
// die when he does. So a dead-astra rule handed free card cycling to two decks
// out of three and blew the deck spread from 3.0 points to 15.7.
//
// The fix is the one the old comment asked for and did not have time to build:
// judge the WHOLE hand rather than one card class. Then Pandava trades its
// weakest footman, Kaurava trades its stranded weapon, and both of them are
// simply discarding their worst card, which is a rule that reads the same from
// every seat.
//
// evaluate() cannot do this. It counts cards and knows nothing about which ones
// are any good, which is exactly the gap named in ai.ts.
import { getCard } from '@content/cards';
import type { CardId, GameState, InstanceId, Seat } from '@engine/types';

/**
 * A card that cannot be played at all is worth this, and it is deliberately
 * negative rather than zero. Holding a brick is worse than holding nothing: it
 * occupies a slot, and every draw that could have replaced it is spent.
 */
const DEAD = -2;

/** Roughly what a tier of astra is worth in board swing when it does land. */
const ASTRA_WORTH: Record<number, number> = { 1: 5, 2: 8, 3: 12 };

/**
 * How far below what you would expect to draw a card must sit before throwing
 * it back is worth the coin flip.
 *
 * A fixed threshold was tried first and did nothing at all: at "throw anything
 * worth less than 3", a six-card opening hand qualified zero cards across 240
 * matches, because a warrior is worth his power and even a footman is a 2.
 * The only cards it ever caught were outright bricks, which are rare in a
 * deck the muster screen has already vetted.
 *
 * The honest comparison is not against a constant, it is against the card you
 * would get back. So a card is thrown when it is worth meaningfully less than
 * the average of what is still in the deck. That is self-scaling: a house of
 * big bodies keeps a higher bar than a house of cheap ones, and no house gets
 * to cycle more freely than another just because its cards read differently.
 */
export const SWAP_MARGIN = 1.5;

/**
 * Can anyone this seat has LEFT ever fire this weapon?
 *
 * Over hand and deck together, not the board. The first version of this asked
 * canInvokeAstra, which reads the board, and the trade is offered at the start
 * of a round when the board has just been wiped to set that round up. Every
 * astra looked unusable, so the AI threw away perfectly good weapons every
 * round 2 and 3, and the lab caught it at once: spread 3.0 to 8.6.
 *
 * Own cards only, so no hidden information is touched.
 */
function anyoneLeftCanFire(state: GameState, seat: Seat, astra: CardId): boolean {
  const granted = Object.values(state.astraGrants?.[seat] ?? {}).flat();
  if (granted.includes(astra)) return true;
  const tier = getCard(astra).astraTier ?? 1;
  return [...state.hands[seat], ...state.decks[seat]].some((iid) => {
    const w = getCard(state.instances[iid]!.cardId);
    if (w.type !== 'unit') return false;
    return (w.astraMastery ?? 0) >= tier || !!w.knownAstras?.includes(astra);
  });
}

/** Does this seat still have a body anywhere to hang a boon or a weapon on? */
function anyHostLeft(state: GameState, seat: Seat): boolean {
  const onField = Object.values(state.instances).some((u) => u.owner === seat && u.row);
  if (onField) return true;
  return [...state.hands[seat], ...state.decks[seat]].some(
    (iid) => getCard(state.instances[iid]!.cardId).type === 'unit',
  );
}

/**
 * What one card in hand is worth, in rough board-power points.
 *
 * A warrior is worth his power, because that is what he puts on the field the
 * moment you commit him and nothing has to go right first. Everything else is
 * conditional and priced below its ceiling: a weapon needs a wielder standing,
 * a boon needs a body to ride.
 */
export function cardValue(state: GameState, seat: Seat, iid: InstanceId): number {
  const inst = state.instances[iid];
  if (!inst) return DEAD;
  const card = getCard(inst.cardId);

  if (card.type === 'unit') {
    // His power, plus a little for having any text on him at all. Not a real
    // reading of the text: this only has to rank cards against each other, and
    // over-modelling here would be a second evaluator to keep in step.
    const hasText = card.effects.length > 0 || card.keywords.length > 0 || !!card.ability;
    return card.basePower + (hasText ? 1 : 0);
  }

  if (card.type === 'astra') {
    if (!anyoneLeftCanFire(state, seat, card.id)) return DEAD;
    // Discounted from its ceiling because it still needs a wielder ON THE FIELD
    // at the moment you want to fire it, and every unit dies at round end.
    return ASTRA_WORTH[card.astraTier ?? 1] ?? 5;
  }

  // Boons and named weapons ride a warrior, so they are dead without one.
  if (!anyHostLeft(state, seat)) return DEAD;
  return 4;
}

/**
 * The cards worth throwing back, worst first.
 *
 * `limit` caps how many, since the mulligan allows two and the round trade one.
 * Only genuinely poor cards are offered: a hand of good cards returns nothing,
 * because cycling a fine card for an unknown one is a coin flip, not a play.
 */
export function worstCards(state: GameState, seat: Seat, limit: number): InstanceId[] {
  const hand = state.hands[seat];
  const deck = state.decks[seat];
  if (!deck.length) return [];
  // What a replacement is worth on average. Throwing a card for something
  // worse than itself is a losing trade however bad the card feels.
  const expected = deck.reduce((n, iid) => n + cardValue(state, seat, iid), 0) / deck.length;
  // DIG FOR MEN WHEN THERE ARE NONE. A hand with nothing to commit cannot act
  // at all, and no weapon or boon in it can be used either, so in that state
  // every non-warrior is a brick whatever it would be worth in a normal hand.
  const warriors = hand.filter((i) => getCard(state.instances[i]!.cardId).type === 'unit').length;
  const starved = warriors < 2;

  return hand
    .map((iid) => {
      const card = getCard(state.instances[iid]!.cardId);
      const base = cardValue(state, seat, iid);
      return { iid, v: starved && card.type !== 'unit' ? Math.min(base, DEAD) : base };
    })
    .filter((c) => c.v < expected - SWAP_MARGIN)
    .sort((a, b) => a.v - b.v)
    .slice(0, limit)
    .map((c) => c.iid);
}
