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

/**
 * A NAMED ASTRA FOLLOWS ITS WARRIOR.
 *
 * Karna's Vasavi Shakti used to be hand-listed in the Kaurava deck beside him,
 * as if the two were unrelated. They are not: the spear is his, traded for the
 * armour off his own body, and it has no business in a host that does not
 * include him. Hand-listing also meant the weapon could sit in a deck its
 * wielder had been cut from, which is where "why is this in my deck?" came
 * from in playtesting.
 *
 * The weapon is NOT in the deck. It arrives in hand the moment the warrior
 * takes the field, and only then. So:
 *   - you can never hold an astra whose wielder you do not have
 *   - cutting the man cuts the weapon
 *   - the ultimates are still not DEALT to you, which was the other rule:
 *     you have to draw the man and commit him first
 * See the onPlay grant in the reducer.
 */
export function namedAstrasOf(cardId: CardId): CardId[] {
  return getCard(cardId).knownAstras ?? [];
}

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
    // Vikarna at power 5 was dead weight the Pandava deck does not carry.
    // Bhurishravas is 8, and his severed sword-arm is one of the best images
    // in the set. Kaurava measured 45.9% against a Pandava 59.1%.
    'bhurishravas',
    'shalya',
    'bhagadatta',
    'dushasana',
    'jayadratha',
    'shakuni',
    // The Pandava deck carries NO chaff: twelve warriors, none below power 5.
    // Carrying a power-2 footman against that is a card given away.
    'bahlika',
    'somadatta',
    'nagastra',
    'brahmastra',
    'agneyastra',
    'varunastra',
    // Bhargavastra removed: Karna was TAUGHT it by Parashurama, so it belongs
    // in the shrine pool Parashurama presides over rather than an opening hand.
    // Vayavyastra takes the slot; it was in no deck at all and so invisible.
    'vayavyastra',
    // Vasavi Shakti left this list when named astras began following their
    // wielder, and nothing replaced it: the deck ran 14 provisions under and
    // measured 44.1% against a Pandava 59.9%. Praswapa is Bhishma's own, given
    // to him in a dream by eight Brahmanas (Udyoga CLXXXVI).
    'praswapa',

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
    // One horde traded for a king. Two power-2 chaff cards against a Pandava
    // rathi floor of 5 is most of why this deck measured 41.4%.
    'shumbha',
    'narakasura',
    'brahmastra',
    'nagastra',
    'sauparna',
    'agneyastra',
    // Vaishnava left this list with the same change and took 24 provisions of
    // slack with it. Tvashtra suits a host of illusionists: Indrajit fought
    // Rama's army from behind exactly this kind of trick.
    'tvashtra',
    'antardhana',
    // Indrajit bears it, as he did against Rama's host.
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
