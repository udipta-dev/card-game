import type { Card, CardId } from '@engine/types';
import { PANDAVA_CARDS } from './pandava';
import { KAURAVA_CARDS } from './kaurava';
import { ASURA_CARDS } from './asura';
import { LEGEND_CARDS } from './legends';
import { ASTRA_CARDS } from './astras';
import { VARDAAN_CARDS } from './vardaan';

const ALL: Card[] = [
  ...PANDAVA_CARDS,
  ...KAURAVA_CARDS,
  ...ASURA_CARDS,
  ...LEGEND_CARDS,
  ...ASTRA_CARDS,
  ...VARDAAN_CARDS,
];

export const CARD_DB: Record<CardId, Card> = Object.freeze(
  ALL.reduce<Record<CardId, Card>>((db, card) => {
    if (db[card.id]) throw new Error(`Duplicate card id: ${card.id}`);
    db[card.id] = card;
    return db;
  }, {}),
);

export function getCard(id: CardId): Card {
  const card = CARD_DB[id];
  if (!card) throw new Error(`Unknown card id: ${id}`);
  return card;
}

export function allCards(): Card[] {
  return ALL.slice();
}

// Rank is now a pyramid (10 maharathi / 28 atirathi / 43 rathi), so the top of
// it should cost like it is rare. Demoting 58 units to their power-derived rank
// dropped every deck 31-45 under the 170 budget, which would have silently let
// each one add five to ten more cards. Repricing keeps the budget meaningful
// and lands the three starters at 167 / 170 / 157.
const TIER_PROVISION = { maharathi: 14, atirathi: 9, rathi: 6 } as const;

/** A card's deck-budget cost. Explicit `provision` wins; else derived from tier. */
export function provisionOf(card: Card): number {
  if (card.provision != null) return card.provision;
  if (card.type === 'unit' && card.tier) return TIER_PROVISION[card.tier];
  return 5;
}
