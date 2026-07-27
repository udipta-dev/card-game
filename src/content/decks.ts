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
    'dhrishtaketu',
    'sahadeva',
    'shikhandi',
    'krishna_charioteer',
    'drupada',
    'virata',
    'brahmastra',
    'sauparna',
    'agneyastra',
    'varunastra',
    'aindrastra',
    // Arjuna alone in this host can loose it, and it takes his own army too.
    // Brahmashirsha removed from the opening hand. At 16 provisions it put the
    // deck 4 over budget, and more importantly the ultimates are meant to be
    // EARNED at a shrine, not dealt. Sammohan takes the slot: Indra's weapon,
    // which Indra's son loosed on the Kuru host at Virata, and which was in no
    // deck at all.
    'sammohana',
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
    'somadatta',
    'nagastra',
    'brahmastra',
    'agneyastra',
    'varunastra',
    // Bhargavastra removed: Karna was TAUGHT it by Parashurama, so it belongs
    // in the shrine pool Parashurama presides over rather than an opening hand.
    // Vayavyastra takes the slot; it was in no deck at all and so invisible.
    'vayavyastra',
    // Karna's spear, traded for his armour. One throw, then it is gone.
    'vasavi_shakti',
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
    'sauparna',
    'agneyastra',
    // Indrajit bears it, as he did against Rama's host.
    'vaishnavastra',
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
