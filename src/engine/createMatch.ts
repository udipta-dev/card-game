import { getCard } from '@content/cards';
import type { DeckList } from '@content/decks';
import { newInstanceId, shuffle } from './ids';
import type { CardInstance, GameState, InstanceId, Row, Seat } from './types';
import { ROWS } from './types';

export const OPENING_HAND = 6;
export const ROUND_DRAW = 2;
export const MULLIGAN_MAX = 2;

/**
 * PAYING THE FIRST MOVER: reinforcements before the last day.
 *
 * Moving first loses. Measured over 2400 games with the opener alternated, the
 * seat that opens wins 41.4%, a 17-point swing decided before a card is played.
 * sim/first-mover.ts ruled out the obvious explanation: it is NOT "last say",
 * because the seat acting last in a round wins only 25.5% of them. The mechanism
 * is the opening commitment, and rounds.ts then hands the next round's opening to
 * whoever just won, which rubber-bands rounds two and three and pays round one's
 * opener nothing at all.
 *
 * ELEVEN PAYMENTS WERE MEASURED AND TEN THROWN OUT. Real engine, opener
 * alternated, 2400 games each unless marked, against a 41.4% baseline:
 *
 *   one more card thrown back at the deal        42.3%   nothing at all
 *   the round-one trade, which nobody has        42.9%   nothing at all
 *   dealt seven, puts one back at the mulligan   42.9%
 *   the round's LOSER opens the next             43.3%
 *   dealt eight, puts two back                   44.1%
 *   his first warrior stands +4 stronger         45.5%
 *   his first warrior stands +6 stronger         46.0%
 *   his first warrior stands +8 stronger         46.3%   flattening
 *   a card in the decider whenever it is level   55.5%   overpaid
 *   a card at round two if round one was lost    58.5%   overpaid
 *   a seventh card simply kept                   66.6%   wildly overpaid
 *   THE SAME CARD, only if he also lost day one  48.5%   even
 *
 * Two things fall out of that table, and they are why everything else failed.
 * Raw POWER cannot fix it: the dial flattens around 46% however much of it you
 * give, so the opener is not weaker, he is worse informed. And a whole CARD is
 * worth roughly 20 points against an 8.6-point hole, so every card-shaped
 * payment overshoots and merely flips which side of the coin you want to be on,
 * which is not a fix. Everything cheap enough was worth 1 to 3 points; the only
 * thing big enough was a card. The answer had to live in between, and the only
 * way between them is to pay a whole card RARELY.
 *
 * So: only in a decider, only with the match level, and only to an opener who
 * actually lost the day he opened. That is precisely the case the deficit is
 * made of. It fires often enough to be worth seven points and seldom enough not
 * to be worth fourteen.
 *
 * It is also the only one of the eleven that reads as something rather than as a
 * handicap: the side that opened the war and lost the first day is reinforced
 * before the last. Re-measure with `npm run first-mover`.
 */
export const REINFORCE_OPENER = 1;

function emptyRows(): Record<Row, InstanceId[]> {
  return { ratha: [], gaja: [], padati: [] };
}

export function makeInstance(cardId: string, owner: Seat): CardInstance {
  const card = getCard(cardId);
  return {
    iid: newInstanceId(cardId),
    cardId,
    owner,
    row: null,
    currentPower: card.basePower,
    flags: new Set<string>(),
    boons: [],
    counters: {},
  };
}

/**
 * Carried run state seeded into a battle: the arsenal already spent earlier in
 * the run, and any curse still clinging to the player from a past act of adharma.
 */
export interface BattleInit {
  banned?: string[];
  /** Subset of `banned` that a penance can recover. */
  suspended?: string[];
  playerCurses?: string[];
  /** Astras the player's warriors learned through tapasya (warrior -> astras). */
  astraGrants?: Record<string, string[]>;
}

/** Build a fresh, deterministic match from two deck lists and a seed. */
export function createMatch(
  seed: number,
  playerDeck: DeckList,
  aiDeck: DeckList,
  firstMover: Seat = 'player',
  init?: BattleInit,
): GameState {
  const instances: Record<InstanceId, CardInstance> = {};
  let s = seed >>> 0;

  const buildDeck = (deck: DeckList, owner: Seat): InstanceId[] => {
    const ids = deck.cards.map((cardId) => {
      const instance = makeInstance(cardId, owner);
      instances[instance.iid] = instance;
      return instance.iid;
    });
    const [shuffled, nextSeed] = shuffle(ids, s);
    s = nextSeed;
    return shuffled;
  };

  const playerDeckIds = buildDeck(playerDeck, 'player');
  const aiDeckIds = buildDeck(aiDeck, 'ai');

  const playerHand = playerDeckIds.splice(0, OPENING_HAND);
  const aiHand = aiDeckIds.splice(0, OPENING_HAND);

  return {
    seed: s,
    phase: 'mulligan',
    activeSeat: firstMover,
    firstMover,
    round: 1,
    totalRounds: 3,
    roundWins: { player: 0, ai: 0 },
    passed: { player: false, ai: false },
    // No trade in round 1: the opening mulligan is that round's correction.
    roundSwap: { player: false, ai: false },
    playedThisRound: { player: false, ai: false },
    board: { player: emptyRows(), ai: emptyRows() },
    instances,
    hands: { player: playerHand, ai: aiHand },
    decks: { player: playerDeckIds, ai: aiDeckIds },
    rowMods: [],
    bannedThisRun: init?.banned ? [...init.banned] : [],
    suspendedThisRun: init?.suspended ? [...init.suspended] : [],
    curses: { player: init?.playerCurses ? [...init.playerCurses] : [], ai: [] },
    astraGrants: { player: init?.astraGrants ? { ...init.astraGrants } : {}, ai: {} },
    hazards: [],
    ultimatesFired: { player: 0, ai: 0 },
    forcedWinner: null,
    winner: null,
    mulliganDone: { player: false, ai: false },
    log: [{ t: 'roundStart', round: 1 }],
  };
}

export { ROWS };
