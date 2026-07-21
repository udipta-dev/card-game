import type { CardId, House } from '@engine/types';
import { getCard, provisionOf } from './cards';

export interface DeckList {
  id: string;
  name: string;
  house: House;
  /** Card ids, with repeats for multiple copies. */
  cards: CardId[];
}

/** Deck-building budget. A deck's total provisions must not exceed this. */
export const DECK_BUDGET = 120;

// Starter decks for Quickplay. Each deck only runs astras its own warriors can
// invoke, plus counter-astras it can hold in reserve.
export const PANDAVA_DECK: DeckList = {
  id: 'pandava_starter',
  name: 'Host of the Pandavas',
  house: 'pandava',
  cards: [
    'arjuna', // astra-master: knows every Pandava astra
    'bhima',
    'yudhishthira',
    'abhimanyu',
    'ghatotkacha',
    'dhrishtadyumna', // backup astra-knower
    'nakula',
    'shikhandi', // answers Bhishma
    'krishna_charioteer',
    'pandava_infantry',
    'brahmastra',
    'garudastra', // counters Nagastra
    'agneyastra',
    'varunastra', // counters Agneyastra
  ],
};

export const KAURAVA_DECK: DeckList = {
  id: 'kaurava_starter',
  name: 'Host of the Kauravas',
  house: 'kaurava',
  cards: [
    'bhishma',
    'drona',
    'karna',
    'duryodhana',
    'ashwatthama', // knows Narayanastra
    'dushasana',
    'shakuni',
    'jayadratha', // seals Abhimanyu
    'kaurava_infantry',
    'varunastra', // held to quench the enemy Agneyastra (Ashwatthama-elephant is dead vs a Drona-less foe)
    'nagastra',
    'brahmastra',
    'agneyastra',
    'narayanastra',
  ],
};

export const DECKS: Record<string, DeckList> = {
  [PANDAVA_DECK.id]: PANDAVA_DECK,
  [KAURAVA_DECK.id]: KAURAVA_DECK,
};

/** Total provisions a deck spends. */
export function deckProvisions(deck: DeckList): number {
  return deck.cards.reduce((sum, id) => sum + provisionOf(getCard(id)), 0);
}
