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
export const DECK_BUDGET = 170;

// Starter decks for Quickplay, drawn from the full roster. Each deck only runs
// astras its own warriors can invoke, plus counter-astras it can hold in reserve.
export const PANDAVA_DECK: DeckList = {
  id: 'pandava_starter',
  name: 'Host of the Pandavas',
  house: 'pandava',
  cards: [
    'arjuna',
    'bhima',
    'yudhishthira',
    'dhrishtadyumna',
    'satyaki',
    'abhimanyu',
    'ghatotkacha',
    'nakula',
    'sahadeva',
    'shikhandi',
    'krishna_charioteer',
    'drupada',
    'pandava_infantry',
    'brahmastra',
    'garudastra',
    'agneyastra',
    'varunastra',
    'aindrastra',
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
    'ashwatthama',
    'vikarna',
    'shalya',
    'bhagadatta',
    'dushasana',
    'jayadratha',
    'shakuni',
    'kaurava_infantry',
    'kaurava_infantry',
    'nagastra',
    'brahmastra',
    'agneyastra',
    'narayanastra',
    'bhargavastra',
  ],
};

export const ASURA_DECK: DeckList = {
  id: 'asura_starter',
  name: 'Host of the Asuras',
  house: 'asura',
  cards: [
    'ravana',
    'indrajit', // astra-master of the host
    'kumbhakarna',
    'hiranyakashipu',
    'mahishasura',
    'vritra',
    'bali',
    'hiranyaksha',
    'nishumbha',
    'raktabija',
    'tarakasura',
    'prahlada',
    'asura_horde',
    'asura_horde',
    'brahmastra',
    'nagastra',
    'garudastra',
    'agneyastra',
  ],
};

export const DECKS: Record<string, DeckList> = {
  [PANDAVA_DECK.id]: PANDAVA_DECK,
  [KAURAVA_DECK.id]: KAURAVA_DECK,
  [ASURA_DECK.id]: ASURA_DECK,
};

/** Total provisions a deck spends. */
export function deckProvisions(deck: DeckList): number {
  return deck.cards.reduce((sum, id) => sum + provisionOf(getCard(id)), 0);
}
