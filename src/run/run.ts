// The run reducer. Pure functions that carry a persistent host through a ladder
// of battles: build each battle from the roster, fold each result back in, and
// end the run on the first defeat.
import { getCard } from '@content/cards';
import type { DeckList } from '@content/decks';
import { DECKS } from '@content/decks';
import type { BattleInit } from '@engine/createMatch';
import { nextRandom } from '@engine/ids';
import type { CardId, GameState, House, Seat } from '@engine/types';
import { buildLadder } from './ladder';
import { mixSeed, rollRewards } from './rewards';
import { getDeity, isShrineIndex, rollPenanceOutcome, rollShrine } from './shrine';
import type { ShrineOffer } from './shrine';
import type { RewardOption, RunState } from './types';

const DECK_BY_HOUSE: Record<string, DeckList> = {
  pandava: DECKS['pandava_starter'],
  kaurava: DECKS['kaurava_starter'],
  asura: DECKS['asura_starter'],
};

/** The great weapons are earned through penance later, not carried from the start. */
function startingRoster(house: House): CardId[] {
  const deck = DECK_BY_HOUSE[house];
  if (!deck) return [];
  return deck.cards.filter((id) => (getCard(id).astraTier ?? 0) < 3);
}

/** Begin a fresh run for the chosen host. */
export function createRun(seed: number, house: House): RunState {
  return {
    seed: seed >>> 0,
    house,
    roster: startingRoster(house),
    ladder: buildLadder(seed, house),
    index: 0,
    phase: 'map',
    banned: [],
    pendingCurses: [],
    depth: 0,
    away: [],
    astraGrants: {},
  };
}

export function currentEncounter(run: RunState) {
  return run.ladder[run.index];
}

/** Everything the UI needs to spin up the next battle from the run. */
export interface BattlePlan {
  seed: number;
  playerDeck: DeckList;
  aiDeck: DeckList;
  init: BattleInit;
}

/** The host that actually marches: minus what is spent, minus who is away. */
export function fieldedRoster(run: RunState): CardId[] {
  const away = new Set(run.away.map((p) => p.warrior));
  return run.roster.filter((id) => !run.banned.includes(id) && !away.has(id));
}

/** Build the next battle. The player fields the roster minus what is spent. */
export function planBattle(run: RunState): BattlePlan {
  const enc = currentEncounter(run);
  const [battleSeed] = nextRandom((run.seed ^ (run.index * 0x85ebca6b)) >>> 0);
  return {
    seed: battleSeed,
    playerDeck: { id: 'run-host', name: 'Your host', house: run.house, cards: fieldedRoster(run) },
    aiDeck: { id: enc.id, name: enc.name, house: enc.house, cards: enc.deckCards },
    init: {
      banned: run.banned,
      playerCurses: run.pendingCurses,
      astraGrants: run.astraGrants,
    },
  };
}

/**
 * Fold a finished battle back into the run. A defeat ends the run. A victory
 * makes the spent arsenal permanent, carries a fresh curse forward one battle,
 * and either wins the run or offers the next reward.
 */
export function resolveBattle(run: RunState, finalState: GameState, playerSeat: Seat = 'player'): RunState {
  const won = finalState.winner === playerSeat;
  if (!won) {
    return { ...run, phase: 'lost' };
  }

  // Anything spent for the run (great astras loosed, warriors burnt) leaves the
  // pool for good. Elemental astras and abilities are never banned, so they stay.
  const banned = unique([...run.banned, ...finalState.bannedThisRun]);
  const roster = run.roster.filter((id) => !banned.includes(id));

  // A curse earned this battle clings through the next one, then fades. We only
  // carry what was freshly earned, so curses never pile up into a death spiral.
  const seeded = new Set(run.pendingCurses);
  const pendingCurses = finalState.curses[playerSeat].filter((c) => !seeded.has(c));

  const depth = run.depth + 1;
  const nextIndex = run.index + 1;

  // Warriors whose tapasya is complete rejoin the host, bearing the weapon the
  // god taught them. The astra itself enters the roster, and the warrior is
  // recorded as knowing it so canInvokeAstra will let them loose it.
  const returned = run.away.filter((p) => nextIndex >= p.returnsAt);
  const away = run.away.filter((p) => nextIndex < p.returnsAt);
  const astraGrants = { ...run.astraGrants };
  const withReturned = [...roster];
  for (const p of returned) {
    if (!p.astra) continue; // the god was not satisfied; he returns empty-handed
    astraGrants[p.warrior] = unique([...(astraGrants[p.warrior] ?? []), p.astra]);
    if (!withReturned.includes(p.astra)) withReturned.push(p.astra);
  }

  const base: RunState = {
    ...run,
    banned,
    roster: withReturned,
    pendingCurses,
    depth,
    index: nextIndex,
    away,
    astraGrants,
    returned: returned.length ? returned : undefined,
  };

  if (nextIndex >= run.ladder.length) return { ...base, phase: 'won' };
  return { ...base, phase: 'reward', rewardChoices: rollRewards(base) };
}

/** Take one of the offered rewards, then a shrine if one stands before the next fight. */
export function chooseReward(run: RunState, choice: RewardOption): RunState {
  const next: RunState = { ...run, rewardChoices: undefined };
  if (choice.kind === 'recruit' && choice.cardId) {
    next.roster = [...run.roster, choice.cardId];
  } else if (choice.kind === 'cleanse') {
    next.pendingCurses = [];
  }
  return enterMapOrShrine(next);
}

/** A shrine stands before some rungs; otherwise go straight to the map. */
function enterMapOrShrine(run: RunState): RunState {
  if (!isShrineIndex(run.index)) return { ...run, phase: 'map', shrineOffers: undefined };
  const offers = rollShrine(run);
  if (!offers.length) return { ...run, phase: 'map', shrineOffers: undefined };
  return { ...run, phase: 'shrine', shrineOffers: offers };
}

/**
 * Accept what the shrine offers, or walk on. A vardaan enters the host as a
 * one-shot card and its bound shrap is paid at once; tapasya sends the warrior
 * away, and they are simply not there for the battles that follow.
 */
export function chooseShrineOffer(run: RunState, offer: ShrineOffer | null): RunState {
  const next: RunState = { ...run, phase: 'map', shrineOffers: undefined };
  if (!offer) return next;

  if (offer.kind === 'vardaan') {
    next.roster = [...run.roster, offer.cardId];
    if (offer.shrap?.kind === 'curse') {
      next.pendingCurses = unique([...run.pendingCurses, offer.shrap.curse]);
    } else if (offer.shrap?.kind === 'sacrifice') {
      const lost = offer.shrap.warrior;
      next.roster = next.roster.filter((id) => id !== lost);
      next.banned = unique([...run.banned, lost]);
    }
    return next;
  }

  // The wager is settled now, deterministically, but stays sealed until he
  // returns. Rolling at departure keeps the run replayable from its seed.
  const deity = getDeity(offer.deityId);
  const held = new Set([...run.roster, ...run.banned]);
  const rolled = deity
    ? rollPenanceOutcome(
        deity,
        offer.warrior,
        offer.battles,
        mixSeed(run.seed, run.index + 997),
        held,
        run.astraGrants[offer.warrior] ?? [],
      )
    : { astra: null };

  next.away = [
    ...run.away,
    {
      warrior: offer.warrior,
      deityId: offer.deityId,
      astra: rolled.astra,
      battles: offer.battles,
      returnsAt: run.index + offer.battles,
    },
  ];
  return next;
}

function unique<T>(xs: T[]): T[] {
  return [...new Set(xs)];
}
