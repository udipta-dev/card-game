// The host you chose last time, remembered per house.
//
// Without this, "pick your cards" is a toll booth: nobody wants to rebuild the
// same nineteen cards before every battle, and a screen you must clear each
// time to play is worse than no screen at all. So the muster is saved, reused
// silently, and only opened when you actually want to change it.
//
// Stored cards are validated on the way back in, because a saved list outlives
// the roster it was chosen from: a card can be renamed or cut between sessions,
// and a run can ban a card for the rest of the run after it was mustered.
import { getCard } from './cards';
import { PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK } from './decks';
import { checkMuster } from './muster';
import type { CardId, House } from '@engine/types';

const KEY = 'kuru_muster_v1';

const STARTER: Record<string, CardId[]> = {
  pandava: PANDAVA_DECK.cards,
  kaurava: KAURAVA_DECK.cards,
  asura: ASURA_DECK.cards,
};

type Saved = Partial<Record<House, CardId[]>>;

function read(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Saved) : {};
  } catch {
    return {};
  }
}

/** The starter list for a house, used as the fallback everywhere. */
export function starterFor(house: House): CardId[] {
  return STARTER[house] ?? PANDAVA_DECK.cards;
}

/**
 * The host to bring for this house: the saved one if it is still legal, the
 * starter deck otherwise.
 *
 * A saved muster is checked, not trusted. It was legal when it was saved, and
 * the content it names can change underneath it.
 */
export function loadMuster(house: House): CardId[] {
  const saved = read()[house];
  if (!saved?.length) return starterFor(house);

  const live = saved.filter((id) => {
    try {
      getCard(id);
      return true;
    } catch {
      return false; // a card that no longer exists
    }
  });
  return checkMuster(live).ok ? live : starterFor(house);
}

export function saveMuster(house: House, ids: readonly CardId[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...read(), [house]: [...ids] }));
  } catch {
    // A full or blocked store is not worth failing a battle over.
  }
}

/** Has this player ever chosen a host of their own for this house? */
export function hasCustomMuster(house: House): boolean {
  return (read()[house]?.length ?? 0) > 0;
}
