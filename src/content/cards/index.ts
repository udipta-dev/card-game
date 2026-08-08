import type { Card, CardId } from '@engine/types';
import { VALOURS } from '../valours';
import { ATIRATHI_VALOURS, RATHI_VALOURS } from '../valours-rank';
import { PANDAVA_CARDS } from './pandava';
import { KAURAVA_CARDS } from './kaurava';
import { ASURA_CARDS } from './asura';
import { LEGEND_CARDS } from './legends';
import { ASTRA_CARDS } from './astras';
import { SHASTRA_CARDS } from './shastras';
import { VARDAAN_CARDS } from './vardaan';

const ALL: Card[] = [
  ...PANDAVA_CARDS,
  ...KAURAVA_CARDS,
  ...ASURA_CARDS,
  ...LEGEND_CARDS,
  ...ASTRA_CARDS,
  ...SHASTRA_CARDS,
  ...VARDAAN_CARDS,
];

export const CARD_DB: Record<CardId, Card> = Object.freeze(
  ALL.reduce<Record<CardId, Card>>((db, card) => {
    if (db[card.id]) throw new Error(`Duplicate card id: ${card.id}`);
    db[card.id] = card;
    return db;
  }, {}),
);

// VALOURS ARE ATTACHED HERE, not written into each card file.
//
// Eleven men, three each. Keeping them in one place makes the tier readable as
// a tier: you can see at a glance that every maharathi is offered three, that
// no mechanic lands on three of the strongest cards at once, and that the
// numbers sit where they were priced. Scattered across three card files, that
// is a diff nobody can review.
for (const [cardId, valours] of Object.entries({
  ...VALOURS,
  ...ATIRATHI_VALOURS,
  ...RATHI_VALOURS,
})) {
  const card = CARD_DB[cardId];
  if (!card) throw new Error(`VALOURS names an unknown card: ${cardId}`);
  card.valours = valours;
  // The old single ability is superseded by the menu. Arrow Rain lived here on
  // three cards, cost a whole turn, and hit EVERY enemy; it is now one of three
  // choices, rides along with committing the man, and hits one rank.
  delete card.ability;
}

export function getCard(id: CardId): Card {
  const card = CARD_DB[id];
  if (!card) throw new Error(`Unknown card id: ${id}`);
  return card;
}

export function allCards(): Card[] {
  return ALL.slice();
}

// WAS a flat price per rank. That is an exploit, because a rank is a BAND: a
// rathi covers power 2 through 6, so a 6-power rathi and a 2-power footman cost
// the same. The Pandava roster is dense at the top of every band (atirathis of
// 8,8,8,7,7,7,7,7 and rathis of 6,5) while the Asura roster sits at the bottom
// (atirathis all 7, rathis including 2,2) - so for the same budget the Pandavas
// simply bought more power. They measured 59.1% against an Asura 41.4%, with
// seven of the eight hottest cards in the game.
//
// Price now tracks POWER directly. Rank keeps its own job, which is standing:
// it drives the frame, the art and who may invoke which astra.
/**
 * A warrior's cost. basePower + 2, so every point of power is paid for.
 *
 * The +2 is the floor: a body on the field is worth something regardless, and
 * it keeps the three starters within a few provisions of where the flat bands
 * had them, so this is a fairness fix rather than a silent budget change.
 */
function unitProvision(power: number): number {
  return Math.max(1, power + 2);
}

/** A card's deck-budget cost. Explicit `provision` wins; else derived from tier. */
export function provisionOf(card: Card): number {
  if (card.provision != null) return card.provision;
  if (card.type === 'unit') return unitProvision(card.basePower);
  return 5;
}
