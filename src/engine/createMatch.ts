import { getCard } from '@content/cards';
import type { DeckList } from '@content/decks';
import { newInstanceId, shuffle } from './ids';
import type { CardInstance, GameState, InstanceId, Row, Seat } from './types';
import { ROWS } from './types';

export const OPENING_HAND = 6;
export const ROUND_DRAW = 2;
export const MULLIGAN_MAX = 2;

function emptyRows(): Record<Row, InstanceId[]> {
  return { ratha: [], gaja: [], padati: [] };
}

function makeInstance(cardId: string, owner: Seat): CardInstance {
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

/** Build a fresh, deterministic match from two deck lists and a seed. */
export function createMatch(
  seed: number,
  playerDeck: DeckList,
  aiDeck: DeckList,
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
    activeSeat: 'player',
    round: 1,
    totalRounds: 3,
    roundWins: { player: 0, ai: 0 },
    passed: { player: false, ai: false },
    board: { player: emptyRows(), ai: emptyRows() },
    instances,
    hands: { player: playerHand, ai: aiHand },
    decks: { player: playerDeckIds, ai: aiDeckIds },
    rowMods: [],
    bannedThisRun: [],
    forcedWinner: null,
    winner: null,
    mulliganDone: { player: false, ai: false },
    log: [{ t: 'roundStart', round: 1 }],
  };
}

export { ROWS };
