// The run reducer. Pure functions that carry a persistent host through a ladder
// of battles: build each battle from the roster, fold each result back in, and
// end the run on the first defeat.
import { getCard } from '@content/cards';
import type { DeckList } from '@content/decks';
import { DECKS } from '@content/decks';
import type { BattleInit } from '@engine/createMatch';
import { checkMuster } from '@content/muster';
import { nextRandom } from '@engine/ids';
import type { CardId, GameState, House, Seat } from '@engine/types';
import { activeCurses, bind, curseBattlesFor, serveOneBattle } from './dharma';
import { buildLadder } from './encounters';
import { MAX_LEVEL } from './ladder';
import { mixSeed, rollRewards } from './rewards';
import { getDeity, isShrineIndex, rollPenanceOutcome, rollShrine } from './shrine';
import type { ShrineOffer } from './shrine';
import type { RewardOption, RunState } from './types';

const DECK_BY_HOUSE: Record<string, DeckList> = {
  pandava: DECKS['pandava_starter'],
  kaurava: DECKS['kaurava_starter'],
  asura: DECKS['asura_starter'],
};

/**
 * The great weapons are earned through penance later, not carried from the start.
 *
 * `chosen` is the host the player actually mustered on the setup screen. It used
 * to be discarded: createRun took only a house and always rebuilt the hardcoded
 * starter list, so the deck you spent time assembling never reached the campaign
 * and the game quietly fielded something else. If nothing was chosen, the
 * starter list is still the fallback.
 */
function startingRoster(house: House, chosen?: readonly CardId[]): CardId[] {
  const from = chosen?.length ? chosen : (DECK_BY_HOUSE[house]?.cards ?? []);
  return from.filter((id) => (getCard(id).astraTier ?? 0) < 3);
}

/** Begin a fresh run for the chosen host. */
export function createRun(
  seed: number,
  house: House,
  chosen?: readonly CardId[],
  level: number = MAX_LEVEL,
): RunState {
  return {
    seed: seed >>> 0,
    house,
    level,
    roster: startingRoster(house, chosen),
    ladder: buildLadder(seed, house, level),
    index: 0,
    phase: 'map',
    banned: [],
    suspended: [],
    pendingCurses: [],
    curseClock: {},
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

/**
 * The cards that actually march.
 *
 * The chosen list if there is one and it is still legal, otherwise everything
 * available. A choice is checked rather than trusted: it was made before the
 * last battle, and a card can be spent, burnt or sent to penance in between,
 * so a stale marching order could name cards that are no longer there.
 */
export function marchingCards(run: RunState): CardId[] {
  const available = fieldedRoster(run);
  if (!run.marching?.length) return available;
  const live = run.marching.filter((id) => available.includes(id));
  // Too small to fight is worse than too big to be reliable.
  return checkMuster(live).ok ? live : available;
}

/** Build the next battle. */
export function planBattle(run: RunState): BattlePlan {
  const enc = currentEncounter(run);
  const [battleSeed] = nextRandom((run.seed ^ (run.index * 0x85ebca6b)) >>> 0);
  return {
    seed: battleSeed,
    playerDeck: { id: 'run-host', name: 'Your army', house: run.house, cards: marchingCards(run) },
    aiDeck: { id: enc.id, name: enc.name, house: enc.house, cards: enc.deckCards },
    init: {
      banned: run.banned,
      suspended: run.suspended ?? [],
      // Everything still serving a sentence, plus any one-battle shrap bound
      // at a shrine. The engine does not know what a battle is, so it is simply
      // handed the curses that are live when this one starts.
      playerCurses: unique([...run.pendingCurses, ...activeCurses(run.curseClock ?? {})]),
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
    // A drawn battle ends the run too (you must WIN to march on), but it is not
    // a defeat and the end screen should not call it one.
    return { ...run, phase: 'lost', endedBy: finalState.winner === null ? 'stalemate' : 'defeat' };
  }

  // Anything spent for the run (great astras loosed, warriors burnt) leaves the
  // pool for good. Elemental astras and abilities are never banned, so they stay.
  const banned = unique([...run.banned, ...finalState.bannedThisRun]);
  // Weapons wasted on a lightning rod rather than spent on a target. Still
  // banned, but recoverable: see the penance return in advance().
  // Both sides defaulted: a run persisted to localStorage before suspensions
  // existed has no `suspended`, and a caller may hand us a partial final state.
  // A returning player must not hit a crash because we added a field.
  const suspended = unique([...(run.suspended ?? []), ...(finalState.suspendedThisRun ?? [])]);
  // A suspended astra stays in the roster. It is unplayable while banned, and
  // dropping it here would mean there was nothing left for penance to restore.
  const roster = run.roster.filter((id) => !banned.includes(id) || suspended.includes(id));

  // A curse earned THIS battle goes on the clock for as long as the weapon that
  // earned it costs. The afflict event carries the weapon, so the price is read
  // off the act rather than guessed at afterwards.
  let curseClock = run.curseClock ?? {};
  // Defaulted for the same reason `suspended` is above: a caller may hand us a
  // partial final state, and a run persisted before this field existed has no
  // clock. Neither should crash the end of a battle.
  for (const ev of finalState.log ?? []) {
    if (ev.t !== 'afflict' || ev.seat !== playerSeat || !ev.by) continue;
    const weapon = getCard(ev.by);
    // The house is passed because an asura serves a battle longer for the same
    // act: ahankar, the part of himself he cannot put down. See dharma.ts.
    curseClock = bind(
      curseClock,
      ev.curse,
      curseBattlesFor(weapon.id, weapon.astraTier ?? 0, run.house),
    );
  }
  // This battle has been fought, so every sentence is one battle shorter.
  curseClock = serveOneBattle(curseClock);

  // Anything earned this battle that was NOT priced by a weapon (a shrine's
  // shrap) keeps the old one-battle carry.
  const seeded = new Set([...run.pendingCurses, ...activeCurses(run.curseClock ?? {})]);
  const pendingCurses = finalState.curses[playerSeat].filter(
    (c) => !seeded.has(c) && !(c in curseClock),
  );

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

  // A warrior coming down off the mountain lifts every suspension, whether or
  // not the god gave him anything. This is penance's SECOND job and the reason
  // Ghatotkacha suspends rather than destroys: a weapon he drew onto himself
  // was wasted, not consumed, and somebody has to go and ask for it back. An
  // empty-handed return is still worth something now.
  // Only what was already suspended when he set out. A weapon wasted in THIS
  // battle was wasted while he was walking home, so it waits for the next one.
  const lifted = returned.length ? (run.suspended ?? []) : [];
  const stillBanned = banned.filter((id) => !lifted.includes(id));
  const stillSuspended = suspended.filter((id) => !lifted.includes(id));

  const base: RunState = {
    ...run,
    banned: stillBanned,
    suspended: stillSuspended,
    roster: withReturned,
    pendingCurses,
    curseClock,
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
        // MUST match what effectiveOdds showed him, or the game advertises one
        // chance and rolls another. That invariant is written down in
        // effectiveOdds' own comment and this is the line that could break it.
        run.house,
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
