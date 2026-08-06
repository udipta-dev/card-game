// Choosing which cards go to war.
//
// The starter decks were a fixed list of 19, so a house was a preset, not a
// choice. That had three consequences the numbers made plain:
//
//   1. Eleven of the thirty Pandava warriors could never be played at all.
//   2. In a run, every card you won was added automatically, so the roster grew
//      while the opening hand stayed at six. Winning made a specific card LESS
//      likely to appear: 53% of a 19-card deck at the start, 40% of a 25-card
//      deck by the sixth battle. Winning made your deck worse.
//   3. Nothing let you bring both halves of a pairing on purpose, so Bhishma
//      and Shikhandi met about one match in four.
//
// A muster is the fix for all three: pick the cards yourself, inside the same
// provisions budget the starter decks already obey, and the deck stops being a
// preset and starts being a decision.
//
// Pure and dependency-free, so the rules can be tested without a screen.
import { allCards, getCard, provisionOf } from './cards';
import { DECK_BUDGET, type DeckList } from './decks';
import type { Card, CardId, House } from '@engine/types';

/**
 * A deck must be playable, not merely legal.
 *
 * The floor is 16 rather than 19 so a tighter deck is a real option: you see
 * ten cards a match whatever you bring, so sixteen cards means you see 63% of
 * them instead of 53%, at the price of fewer bodies to field. But it cannot go
 * much lower. With a 6-card opening hand and 2 drawn per round you take 10
 * cards out of the deck across three rounds, and running dry means dead turns
 * and, more sharply, a round trade that cannot happen because the deck is
 * empty. Sixteen leaves six cards of slack.
 */
export const MUSTER_MIN = 16;
export const MUSTER_MAX = 19;
/**
 * Bodies a host needs before weapons are worth anything.
 *
 * Two numbers, deliberately different. The LEGAL floor is 10, low enough that
 * swapping one warrior for another does not trip an error in the moment
 * between removing and adding: the starter decks field exactly 12, so a floor
 * of 12 made the obvious remove-then-add gesture illegal halfway through and
 * flashed a red warning at someone who was doing nothing wrong.
 *
 * The floor autoMuster aims for is higher, because a host that is legal is not
 * the same as a host that is good, and the automatic pick should be good.
 */
export const MIN_WARRIORS = 10;
const AUTO_WARRIORS = 12;

export interface MusterCheck {
  ok: boolean;
  count: number;
  provisions: number;
  /** Player-facing reasons this muster cannot take the field, if any. */
  problems: string[];
}

/** Every card a house may bring: its own, plus the neutral arsenal. */
export function poolFor(house: House): Card[] {
  return allCards()
    .filter((c) => c.house === house || c.house === 'neutral')
    .sort((a, b) => {
      // Warriors first by power, then the arsenal. Same order the hand uses.
      const rank = (c: Card) => (c.type === 'unit' ? 0 : 1);
      if (rank(a) !== rank(b)) return rank(a) - rank(b);
      if ((b.basePower ?? 0) !== (a.basePower ?? 0)) return (b.basePower ?? 0) - (a.basePower ?? 0);
      return a.name.localeCompare(b.name);
    });
}

export function musterProvisions(ids: readonly CardId[]): number {
  return ids.reduce((n, id) => n + provisionOf(getCard(id)), 0);
}

/** Can this selection take the field? */
export function checkMuster(ids: readonly CardId[]): MusterCheck {
  const problems: string[] = [];
  const count = ids.length;
  const provisions = musterProvisions(ids);

  if (count < MUSTER_MIN) problems.push(`${MUSTER_MIN - count} more card${MUSTER_MIN - count === 1 ? '' : 's'} needed`);
  if (count > MUSTER_MAX) problems.push(`${count - MUSTER_MAX} too many`);
  if (provisions > DECK_BUDGET) problems.push(`${provisions - DECK_BUDGET} provisions over budget`);
  if (new Set(ids).size !== ids.length) problems.push('the same card twice');

  // A host of nothing but weapons cannot fight: astras need a warrior standing
  // to loose them, so a muster with no warriors is legal arithmetic and a lost
  // battle. Caught here rather than discovered on the field.
  const warriors = ids.filter((id) => getCard(id).type === 'unit').length;
  if (count > 0 && warriors < MIN_WARRIORS)
    problems.push(`only ${warriors} warriors: someone has to hold the line`);

  return { ok: problems.length === 0, count, provisions, problems };
}

/** Would adding this card break the muster? Returns why, or null if it fits. */
export function whyNotAdd(ids: readonly CardId[], id: CardId): string | null {
  if (ids.includes(id)) return 'Already mustered';
  if (ids.length >= MUSTER_MAX) return `A host is ${MUSTER_MAX} cards at most`;
  const cost = provisionOf(getCard(id));
  const left = DECK_BUDGET - musterProvisions(ids);
  if (cost > left) return `Costs ${cost} provisions, ${left} left`;
  return null;
}

/** Turn a chosen list into the DeckList the engine expects. */
export function toDeckList(house: House, name: string, ids: readonly CardId[]): DeckList {
  return { id: `${house}_muster`, name, house, cards: [...ids] };
}

/**
 * Fill a muster automatically, best-first inside the budget.
 *
 * Used for the "Auto" button and, more importantly, as the default for anyone
 * who never opens the muster screen: a run must never hand the engine an
 * illegal deck just because the player did not choose. Greedy by power per
 * provision, which is not optimal and does not need to be; it needs to be
 * legal, sensible, and the same every time for a given pool.
 */
export function autoMuster(pool: readonly CardId[], target = MUSTER_MAX): CardId[] {
  const value = (c: Card) => (c.type === 'unit' ? (c.basePower ?? 0) : 6) / provisionOf(c);
  const byValue = (a: CardId, b: CardId) => {
    const d = value(getCard(b)) - value(getCard(a));
    return d !== 0 ? d : a.localeCompare(b);
  };

  // WARRIORS FIRST, to the minimum the line needs, then the arsenal.
  //
  // A single value-ranked pass looks tidier and produces a host that cannot
  // fight. Cheap astras score well per provision, so greedy filled the Asura
  // muster with ten warriors and nine weapons, and an astra with nobody left
  // standing to loose it is a dead card. The floor has to be satisfied before
  // efficiency gets a say.
  const warriors = pool.filter((id) => getCard(id).type === 'unit').sort(byValue);
  const rest = pool.filter((id) => getCard(id).type !== 'unit').sort(byValue);
  const needWarriors = Math.min(AUTO_WARRIORS, warriors.length);

  const picked: CardId[] = [];
  const take = (ids: readonly CardId[], upTo: number) => {
    for (const id of ids) {
      if (picked.length >= upTo) break;
      if (whyNotAdd(picked, id) === null) picked.push(id);
    }
  };

  take(warriors, Math.min(needWarriors, target));
  take(rest, target);
  take(warriors, target); // any room the arsenal could not use goes back to bodies
  return picked;
}
