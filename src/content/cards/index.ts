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
