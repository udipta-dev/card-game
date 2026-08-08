// What a host can actually DO with the weapons it is carrying.
//
// A divine weapon is not a card you simply play. It needs a warrior standing on
// the field who is either trained to its rank or bears it by name, and nothing
// anywhere told the player that. So you could spend 14 of your 170 provisions
// on the Vaishnava, cut the only man in your house who can fire it, take it to
// war, and the game would never say a word. It would sit in your hand for three
// rounds and you would conclude the card was broken.
//
// The reverse is just as invisible and more interesting: Bhagadatta walks onto
// the field carrying the Vaishnava, and unless you knew that from the epic there
// was no way to find out, because his card says it and nothing connects the two.
//
// These are pure functions over a list of card ids, so the muster screen, the
// setup screen and the tests all read the same truth.
import { getCard } from './cards';
import type { CardId } from '@engine/types';

/**
 * Everyone in this host who could invoke this weapon.
 *
 * The same rule the engine uses in canInvokeAstra: trained to the rank, or
 * bears it by name. Rank covers the elementals and the Brahma line; the tier-3
 * ultimates are never granted by rank and need the named bearer.
 */
export function wieldersOf(cards: readonly CardId[], astraId: CardId): CardId[] {
  const tier = getCard(astraId).astraTier ?? 1;
  return cards.filter((id) => {
    const c = getCard(id);
    if (c.type !== 'unit') return false;
    return (c.astraMastery ?? 0) >= tier || (c.knownAstras ?? []).includes(astraId);
  });
}

/** Weapons in the host that NOBODY in it can fire. Wasted provisions. */
export function orphanWeapons(cards: readonly CardId[]): CardId[] {
  return cards.filter(
    (id) => getCard(id).type === 'astra' && wieldersOf(cards, id).length === 0,
  );
}

/** A weapon the host has not packed, and everyone in it who could bear it. */
export interface Unpacked {
  astra: CardId;
  /** Every warrior present who bears it. Grouped, because more than one can. */
  bearers: CardId[];
}

/**
 * Weapons your own warriors carry that are not in the host.
 *
 * Not a fault: no host packs every weapon, and these are usually the most
 * expensive cards in the game. It is an opportunity, and it is the single best
 * place to teach what a warrior is actually for.
 */
export function unpackedWeapons(cards: readonly CardId[]): Unpacked[] {
  // GROUPED BY WEAPON, not by warrior. Drona and Ashwatthama both bear the
  // Brahmashirsha, so a per-warrior list printed it twice and read as two
  // different weapons.
  const byAstra = new Map<CardId, CardId[]>();
  for (const id of cards) {
    for (const astra of getCard(id).knownAstras ?? []) {
      if (cards.includes(astra)) continue;
      byAstra.set(astra, [...(byAstra.get(astra) ?? []), id]);
    }
  }
  return [...byAstra.entries()]
    .map(([astra, bearers]) => ({ astra, bearers }))
    .sort((a, b) => (getCard(b.astra).astraTier ?? 1) - (getCard(a.astra).astraTier ?? 1));
}

/** One line of the host's arsenal, ready to render. */
export interface ArsenalEntry {
  astra: CardId;
  tier: number;
  wielders: CardId[];
}

/**
 * The weapons this host carries, mightiest first.
 *
 * Ordered by rank rather than by deck order, because rank is the thing a player
 * needs to learn and the codex is the only other place it is visible.
 */
export function arsenalOf(cards: readonly CardId[]): ArsenalEntry[] {
  return cards
    .filter((id) => getCard(id).type === 'astra')
    .map((astra) => ({
      astra,
      tier: getCard(astra).astraTier ?? 1,
      wielders: wieldersOf(cards, astra),
    }))
    .sort((a, b) => b.tier - a.tier || getCard(a.astra).name.localeCompare(getCard(b.astra).name));
}

/** Plain words for a weapon's rank, for anyone meeting the tiers for the first time. */
export const TIER_WORD: Record<number, string> = {
  3: 'an ultimate',
  2: 'a great weapon',
  1: 'an elemental',
};

/**
 * The cheapest warrior who could fire this weapon, from a pool.
 *
 * Cheapest rather than best on purpose: this is the "fix it for me" suggestion,
 * and it should cost the player as little of their budget as possible. Bearers
 * by name come first, because for an ultimate they are the only option at all.
 */
export function cheapestWielder(pool: readonly CardId[], astraId: CardId): CardId | undefined {
  const tier = getCard(astraId).astraTier ?? 1;
  const named = pool.filter((id) => (getCard(id).knownAstras ?? []).includes(astraId));
  const trained = pool.filter((id) => {
    const c = getCard(id);
    return c.type === 'unit' && (c.astraMastery ?? 0) >= tier;
  });
  const byCost = (a: CardId, b: CardId) =>
    (getCard(a).provision ?? getCard(a).basePower + 2) - (getCard(b).provision ?? getCard(b).basePower + 2);
  return [...named].sort(byCost)[0] ?? [...trained].sort(byCost)[0];
}
