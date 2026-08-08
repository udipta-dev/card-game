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
    // THE DRONA BUG. Drona carries immuneUntilPlayed{ ashwatthama_elephant },
    // and that card was in NO deck and no run path, so it could never be
    // played, so his immunity could never lift. He was an unkillable 9 in the
    // Kaurava deck, and it silently broke a second card too: Dhrishtadyumna's
    // entire text is "born of fire to be the slayer of Drona" and his onPlay
    // destroy was doing nothing at all.
    //
    // The lie is Yudhishthira's, so it belongs to the PANDAVAS: they speak it,
    // the Kaurava Drona lays down his bow, and their Dhrishtadyumna finishes
    // him. Dhrishtaketu (a blank 7) and Sauparna (5) come out, the deception
    // (4) and Sweta (10) go in: 14 for 14, so 19 cards and 170 provisions are
    // both untouched.
    'ashwatthama_elephant',
    'sweta',
    'sahadeva',
    'shikhandi',
    // KRISHNA IS NOT IN THE STARTER DECK ANY MORE, and this is the fix for his
    // rework rather than a separate decision.
    //
    // He used to end the deciding round by executing the greatest man opposite,
    // and this deck was built around that. Taking the kill away (he never lifts
    // a weapon in that war) cost Pandava NINE POINTS in the lab: 51.2% to
    // 42.0%. Measured attempts to buy it back on his own card all failed:
    // +2 to the host instead of +1 recovered two points, and stripping the
    // mightiest foe's protections recovered none, because stripping is setup
    // and the follow-through has to come from somewhere.
    //
    // The answer is not to re-inflate him. He should be RARE: a twelve-
    // provision support card that guards one man and lifts the host is a fine
    // thing to earn at a shrine and a poor thing to be dealt every game. So the
    // twelve provisions go back into the host as a body, and Krishna becomes
    // something you go and get.
    'chekitana',
    'drupada',
    // Virata (7, costs 9) out for Nakula (6, costs 8), paying the provision
    // Krishna's rework costs. Virata measured 41.8%, near the bottom of the
    // whole table, and his matsya bond did nothing because he was the only
    // matsya here. Nakula also closes an oddity: Sahadeva was in this deck and
    // his twin was not, and the two are never apart anywhere in the epic.
    'nakula',
    'brahmastra',
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
    // Srutayudha was tried here in Bahlika's slot (same power, same cost) and
    // measured 38.5%. The loophole fires passively whenever the enemy fields
    // Krishna, which the Pandava deck does about a fifth of the time, so he is
    // a liability in the one matchup that matters rather than a gamble. The
    // canonical act was a CHOICE - he hurled the mace at a man he could see was
    // not fighting - and until the engine can make it a choice he stays out of
    // the starter deck and remains available as a run recruit.
    // Bahlika (6, costs 8) out for Uluka (5, costs 7), paying for Bhishma's
    // rise to provision 13. Bahlika was the weakest warrior in the deck at
    // 42.6%, and Uluka is Shakuni's own son, the envoy whose message made the
    // peace impossible: the right company for his father in a deck of guile.
    'uluka',
    // Somadatta (6) out, Vikarna (5) in, paying for Bhagadatta's rise to 9.
    // An earlier pass cut Vikarna as a power-5 body the Pandava deck would not
    // carry, and by raw power that was correct. But this sweep is about men who
    // changed the war without fighting, and Vikarna is the ONE son of
    // Dhritarashtra who stood up in the dice hall and said the wager was void
    // and Draupadi unwon (Sabha P. LXVIII). Somadatta is in the set because he
    // fathered Bhurishravas. One of those is worth a slot.
    'vikarna',
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
    // POWER-NEUTRAL, PROVISION-NEUTRAL SWAP, so the measurement means something.
    // Out: Shumbha (7, costs 9) and Vritra (7, costs 9). In: Baka (8, costs 10)
    // and Trishira (6, costs 8). Same 14 power, same 18 provisions, and both of
    // the new men actually do something when they arrive.
    //
    // The reason: this host had TWO units in thirteen with any onPlay effect at
    // all, against Pandava's six and Kaurava's seven, and it measured 41.0%
    // against their 46.7% and 57.7%. Their own pool was full of men who act
    // (Baka, Trishira, Hidimbi, Kalanemi, Maricha, Shambara, Maya) and the
    // curated list had taken almost none of them, so the faction's weakness was
    // a deckbuilding accident rather than a card-design one.
    //
    // Shumbha's bond keyed on 'asura-lord', of which the deck held two, so it
    // was nearly a dead keyword. Baka is a Bhima target by name, which is a real
    // cost against Pandava and canonically exactly right.
    'trishira',
    'bakasura',
    'bali',
    'hiranyaksha',
    // Nishumbha (6, costs 8) out for Prahlada (4, costs 6), paying for
    // Indrajit's rise to 10. Nishumbha is "the other brother, never seen apart
    // from Shumbha" and does nothing Shumbha does not; Prahlada is
    // Hiranyakashipu's son, and a host built around a king it promoted today
    // may as well carry his heir.
    'prahlada',
    'raktabija',
    'tarakasura',
    // One horde traded for a king. Two power-2 chaff cards against a Pandava
    // rathi floor of 5 is most of why this deck measured 41.4%.
    'narakasura',
    'brahmastra',
    'nagastra',
    // Sauparna out for Prajna, both 5 provisions so the budget is untouched.
    //
    // Sauparna answers the NAGA weapon, and the Pandava deck does not carry one,
    // so against them it was a card that could never do anything: it measured
    // 36.6%, the worst card in that matchup by a distance. Prajna answers
    // SAMMOHANA, which is Pandava's +11.8pp astra and the second best card they
    // have in this pairing. A live answer replacing a dead one.
    'prajna',
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
