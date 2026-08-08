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
import { cheapestWielder, orphanWeapons, unpackedWeapons, wieldersOf } from './arsenal';
import { DECKS, DECK_BUDGET, type DeckList } from './decks';
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

/**
 * How much an army may spend, and the most any one card in it may cost.
 *
 * Quickplay uses the defaults and always has. The LADDER is why this is a
 * parameter: a level-4 opponent must field an army built the way a level-4
 * player's is, out of cheap men, and that is the whole of the early difficulty
 * curve. No hand-written ladder of decks to keep in step with the card set.
 */
export interface Limits {
  budget?: number;
  /** The most a single card may cost. Undefined means no ceiling. */
  cap?: number;
}

/** Would adding this card break the muster? Returns why, or null if it fits. */
export function whyNotAdd(
  ids: readonly CardId[],
  id: CardId,
  limits: Limits = {},
): string | null {
  const budget = limits.budget ?? DECK_BUDGET;
  if (ids.includes(id)) return 'Already mustered';
  if (ids.length >= MUSTER_MAX) return `A host is ${MUSTER_MAX} cards at most`;
  const cost = provisionOf(getCard(id));
  if (limits.cap != null && cost > limits.cap)
    return `Costs ${cost} provisions, and you may not field above ${limits.cap} yet`;
  const left = budget - musterProvisions(ids);
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
 * illegal deck just because the player did not choose.
 *
 * REWRITTEN, because the old one was a trap. It ranked by power per provision
 * and stopped at MUSTER_MAX cards, which optimises the wrong quantity: card
 * COUNT rather than budget. Nineteen efficient cheap cards spend about 152 of
 * 170, so the button handed the player an army with 18 provisions left on the
 * table. Measured against the curated starters it produced pandava 26.2%,
 * kaurava 52.7%, asura 68.6%, where the curated armies sit at 42.9 / 53.7 /
 * 50.6. A Pandava player pressing the convenience button lost 17 points for it.
 *
 * It also predated valours entirely, so it could not see that a maharathi now
 * carries three choices and a rathi one.
 *
 * The objective is now the thing that actually wins rounds: TOTAL WORTH ON THE
 * FIELD, maximised against the budget rather than against a card count. Greedy
 * fill to the legal floor, then an upgrade pass that spends what is left.
 *
 * AND IT IS STILL ONLY A FALLBACK, which is worth saying plainly. Three
 * heuristics were measured against the curated armies and all three produced
 * roughly the same 42-point spread:
 *
 *   power per provision, 19 cards, 152 spent   pandava 26.2  kaurava 52.7  asura 68.6
 *   worth, 15 cards, budget spent                      38.2          33.8         76.3
 *   worth per provision then upgrade, 19, spent        29.6          45.4         72.1
 *
 * A ranking function cannot see that a weapon needs a wielder standing, that a
 * bond wants five men of the same banner, or that a house whose answer to
 * removal is armour folds to a house that removes by destruction. The published
 * work on this says the same thing: heuristic deckbuilders "don't transfer to
 * real gameplay".
 *
 * So the real answer is sim/deck-search.ts, which plays actual games, and the
 * armies it finds get shipped as data. This function exists for the case that
 * search cannot cover: an arbitrary pool the player has restricted by hand.
 */

/**
 * What a card is worth to an army, in rough board-power points.
 *
 * A warrior is his power plus his valours, because a valour is a real effect he
 * lands the moment he arrives and rank buys how many of them he chooses from.
 * Everything else is priced by what it does when it lands: an astra by its rank,
 * a boon or a named weapon at about a mid warrior, a stratagem below that.
 *
 * Deliberately coarse. This has to rank cards against each other and be the same
 * every time; it is not trying to be the deck search in sim/deck-search.ts,
 * which plays actual games because that is the only way to know.
 */
function worthOf(c: Card): number {
  if (c.type === 'unit') return c.basePower + (c.valours?.length ?? 0);
  if (c.type === 'astra') return 4 + (c.astraTier ?? 1) * 2;
  if (c.type === 'stratagem') return 3;
  return 5;
}

export function autoMuster(
  pool: readonly CardId[],
  target = MUSTER_MAX,
  limits: Limits = {},
): CardId[] {
  const budget = limits.budget ?? DECK_BUDGET;
  const affordable = (id: CardId) =>
    limits.cap == null || provisionOf(getCard(id)) <= limits.cap;
  // A KNOWN-GOOD ARMY BEATS ANY HEURISTIC, so hand one back when the pool can
  // hold it. The curated starters ARE the searched armies: they carry what
  // sim/deck-search.ts reached for, and the Brahma-Astra it threw out of all
  // three. Measured, they sit within four points of each other; the best
  // heuristic below measured a 42-point spread.
  //
  // Only when the whole army fits the pool, so a player who has cut the pool
  // down by hand still gets a legal answer from the greedy pass rather than a
  // list containing cards they excluded.
  //
  // Skipped once a cap or a reduced budget is in force, because a curated army
  // is built for the full 170 and a ladder opponent that quietly ignored its
  // own ceiling would be the difficulty curve defeating itself.
  const held = new Set(pool);
  const capped = limits.cap != null || budget !== DECK_BUDGET;
  if (!capped) {
    for (const deck of Object.values(DECKS)) {
      if (deck.cards.length && deck.cards.every((id) => held.has(id))) return [...deck.cards];
    }
  }

  const byWorth = (a: CardId, b: CardId) => {
    const d = worthOf(getCard(b)) - worthOf(getCard(a));
    return d !== 0 ? d : a.localeCompare(b);
  };
  // EFFICIENCY FILLS, WORTH UPGRADES, and the order matters more than either.
  //
  // Filling by raw worth takes the most expensive warriors first and runs the
  // budget out at fifteen cards. Measured: that army loses harder than the one
  // that left 18 provisions unspent, because this game is decided by card
  // economy and running out of cards in round three loses the round outright.
  // Fill for COUNT, then spend the remainder on quality.
  const byEfficiency = (a: CardId, b: CardId) => {
    const d = worthOf(getCard(b)) / provisionOf(getCard(b)) - worthOf(getCard(a)) / provisionOf(getCard(a));
    return d !== 0 ? d : a.localeCompare(b);
  };

  // WARRIORS FIRST, to the minimum the line needs, then the arsenal.
  //
  // A single ranked pass looks tidier and produces an army that cannot fight.
  // Cheap astras score well, so greedy filled the Asura muster with ten warriors
  // and nine weapons, and an astra with nobody left standing to loose it is a
  // dead card. The floor has to be satisfied before efficiency gets a say.
  const usable = pool.filter(affordable);
  const warriors = usable.filter((id) => getCard(id).type === 'unit').sort(byEfficiency);
  const rest = usable.filter((id) => getCard(id).type !== 'unit').sort(byEfficiency);
  const needWarriors = Math.min(AUTO_WARRIORS, warriors.length);

  const picked: CardId[] = [];
  const take = (ids: readonly CardId[], upTo: number) => {
    for (const id of ids) {
      if (picked.length >= upTo) break;
      if (whyNotAdd(picked, id, limits) === null) picked.push(id);
    }
  };

  take(warriors, Math.min(needWarriors, target));
  take(rest, target);
  take(warriors, target); // any room the arsenal could not use goes back to bodies

  // SPEND WHAT IS LEFT. The pass above fills to a card count and then stops,
  // which is exactly how 18 provisions went unused. Trade the weakest card in
  // hand for the best one the leftover budget can now afford, and keep doing it
  // while that is an improvement.
  for (let guard = 0; guard < 60; guard++) {
    const spent = musterProvisions(picked);
    const weakest = picked.slice().sort((a, b) => worthOf(getCard(a)) - worthOf(getCard(b)))[0];
    if (!weakest) break;
    const freed = budget - spent + provisionOf(getCard(weakest));
    const upgrade = usable
      .filter((id) => !picked.includes(id) && provisionOf(getCard(id)) <= freed)
      .filter((id) => worthOf(getCard(id)) > worthOf(getCard(weakest)))
      .sort(byWorth)[0];
    if (!upgrade) break;
    const trial = picked.filter((id) => id !== weakest).concat(upgrade);
    // Never trade into an illegal army: the warrior floor and the arsenal rules
    // outrank the upgrade.
    if (whyNotAdd(picked.filter((id) => id !== weakest), upgrade, limits) !== null) break;
    if (trial.filter((id) => getCard(id).type === 'unit').length < MIN_WARRIORS) break;
    picked.length = 0;
    picked.push(...trial);
  }
  return picked;
}

// ---------------------------------------------------------------------------
// The loading station: what is wrong with this host, and how to fix it.
// ---------------------------------------------------------------------------

/** One thing worth telling the player about the host they have built. */
export interface Advisory {
  kind: 'orphan-weapon' | 'unpacked-weapon';
  /** The astra this is about. */
  astra: CardId;
  /** For an orphan, the cheapest man who could fire it. For unpacked, the bearer. */
  suggest: CardId | undefined;
  text: string;
}

/**
 * Everything the host is carrying that does not add up.
 *
 * Two kinds, and they are mirror images. An ORPHAN WEAPON is a real fault: you
 * have spent provisions on something nobody present can fire, and it will sit in
 * your hand for the whole battle. An UNPACKED WEAPON is not a fault at all, it
 * is an opportunity: one of your men bears a weapon you have not brought.
 *
 * Neither ever blocks you. In a campaign "I will earn the wielder later" is a
 * real answer, and in quickplay you may be deliberately testing something.
 */
export function advise(chosen: readonly CardId[], pool: readonly CardId[]): Advisory[] {
  const out: Advisory[] = [];

  for (const astra of orphanWeapons(chosen)) {
    const suggest = cheapestWielder(pool, astra);
    out.push({
      kind: 'orphan-weapon',
      astra,
      suggest,
      text: suggest
        ? `Nobody in this host can fire the ${getCard(astra).name}. ${getCard(suggest).name} can.`
        : `Nobody in this host can fire the ${getCard(astra).name}, and nobody available can.`,
    });
  }

  for (const { astra, bearers } of unpackedWeapons(chosen)) {
    if (!pool.includes(astra)) continue; // cannot be added, so not worth saying
    const who = bearers.map((b) => getCard(b).name);
    const named = who.length > 1 ? `${who.slice(0, -1).join(', ')} and ${who[who.length - 1]}` : who[0];
    out.push({
      kind: 'unpacked-weapon',
      astra,
      suggest: astra,
      text: `${named} ${who.length > 1 ? 'bear' : 'bears'} the ${getCard(astra).name}, which is not in your host.`,
    });
  }

  return out;
}

/**
 * Apply an advisory: add the card it suggests, making room if there is none.
 *
 * Room is made by dropping the cheapest card that is NOT load-bearing, which
 * means never dropping a warrior below the legal floor and never dropping the
 * only man who can fire something else you are carrying. Returns the host
 * unchanged if it cannot be done without breaking a different rule, because a
 * "fix" that quietly creates a second fault is worse than no fix.
 */
export function applyAdvisory(
  chosen: readonly CardId[],
  advisory: Advisory,
): { cards: CardId[]; dropped: CardId[] } {
  const add = advisory.suggest;
  if (!add || chosen.includes(add)) return { cards: [...chosen], dropped: [] };

  const cost = provisionOf(getCard(add));
  let cards = [...chosen];
  const dropped: CardId[] = [];

  // Drop the cheapest expendable card until the addition fits on both counts.
  const roomFor = () =>
    cards.length < MUSTER_MAX && musterProvisions(cards) + cost <= DECK_BUDGET;
  let guard = 0;
  while (!roomFor() && guard++ < MUSTER_MAX) {
    const victim = cheapestExpendable(cards, add);
    if (!victim) break;
    cards = cards.filter((c) => c !== victim);
    dropped.push(victim);
  }
  if (!roomFor()) return { cards: [...chosen], dropped: [] };

  cards.push(add);
  return { cards, dropped };
}

/**
 * The cheapest card we may remove without breaking something else: not a
 * warrior if that would drop us under the floor, and never the last man who can
 * fire a weapon we are keeping.
 */
function cheapestExpendable(cards: readonly CardId[], adding: CardId): CardId | undefined {
  const warriors = cards.filter((id) => getCard(id).type === 'unit').length;
  const addingWarrior = getCard(adding).type === 'unit';
  const candidates = cards.filter((id) => {
    const c = getCard(id);
    // Keep enough warriors to be a legal host.
    if (c.type === 'unit' && warriors + (addingWarrior ? 1 : 0) - 1 < MIN_WARRIORS) return false;
    // Never strand a weapon by removing its only wielder.
    if (c.type === 'unit') {
      const without = cards.filter((x) => x !== id);
      const strands = without.some(
        (x) => getCard(x).type === 'astra' && wieldersOf(without, x).length === 0,
      );
      if (strands) return false;
    }
    return true;
  });
  return [...candidates].sort(
    (a, b) => provisionOf(getCard(a)) - provisionOf(getCard(b)),
  )[0];
}
