import type { Card, CardId } from '@engine/types';
import { PANDAVA_CARDS } from './pandava';
import { KAURAVA_CARDS } from './kaurava';
import { ASTRA_CARDS } from './astras';

const ALL: Card[] = [...PANDAVA_CARDS, ...KAURAVA_CARDS, ...ASTRA_CARDS];

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

const TIER_PROVISION = { maharathi: 10, atirathi: 7, rathi: 4 } as const;

/** A card's deck-budget cost. Explicit `provision` wins; else derived from tier. */
export function provisionOf(card: Card): number {
  if (card.provision != null) return card.provision;
  if (card.type === 'unit' && card.tier) return TIER_PROVISION[card.tier];
  return 5;
}
