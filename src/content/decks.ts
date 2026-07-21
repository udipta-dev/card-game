import type { CardId, House } from '@engine/types';

export interface DeckList {
  id: string;
  name: string;
  house: House;
  /** Card ids, with repeats for multiple copies (footmen, shared astras). */
  cards: CardId[];
}

// Starter decks for Quickplay. ~13 cards each; a Gwent-lite deck is small so a
// best-of-3 with modest per-round draw stays tight.
export const PANDAVA_DECK: DeckList = {
  id: 'pandava_starter',
  name: 'Host of the Pandavas',
  house: 'pandava',
  cards: [
    'arjuna',
    'bhima',
    'yudhishthira',
    'abhimanyu',
    'ghatotkacha',
    'dhrishtadyumna',
    'nakula',
    'sahadeva',
    'shikhandi',
    'krishna_charioteer',
    'pandava_infantry',
    'pandava_infantry',
    'brahmastra',
    'nagastra',
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
    'dushasana',
    'shakuni',
    'jayadratha',
    'kaurava_infantry',
    'kaurava_infantry',
    'ashwatthama_elephant',
    'brahmastra',
    'nagastra',
    'vaishnavastra',
  ],
};

export const DECKS: Record<string, DeckList> = {
  [PANDAVA_DECK.id]: PANDAVA_DECK,
  [KAURAVA_DECK.id]: KAURAVA_DECK,
};
