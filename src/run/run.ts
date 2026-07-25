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
import { rollRewards } from './rewards';
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

/** Build the next battle. The player fields the roster minus what is spent. */
export function planBattle(run: RunState): BattlePlan {
  const enc = currentEncounter(run);
  const roster = run.roster.filter((id) => !run.banned.includes(id));
  const [battleSeed] = nextRandom((run.seed ^ (run.index * 0x85ebca6b)) >>> 0);
  return {
    seed: battleSeed,
    playerDeck: { id: 'run-host', name: 'Your host', house: run.house, cards: roster },
    aiDeck: { id: enc.id, name: enc.name, house: enc.house, cards: enc.deckCards },
    init: { banned: run.banned, playerCurses: run.pendingCurses },
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
  if (nextIndex >= run.ladder.length) {
    return { ...run, phase: 'won', banned, roster, pendingCurses, depth, index: nextIndex };
  }

  const staged: RunState = {
    ...run,
    banned,
    roster,
    pendingCurses,
    depth,
    index: nextIndex,
    phase: 'reward',
  };
  return { ...staged, rewardChoices: rollRewards(staged) };
}

/** Take one of the offered rewards and return to the map for the next fight. */
export function chooseReward(run: RunState, choice: RewardOption): RunState {
  const next: RunState = { ...run, phase: 'map', rewardChoices: undefined };
  if (choice.kind === 'recruit' && choice.cardId) {
    next.roster = [...run.roster, choice.cardId];
  } else if (choice.kind === 'cleanse') {
    next.pendingCurses = [];
  }
  return next;
}

function unique<T>(xs: T[]): T[] {
  return [...new Set(xs)];
}
