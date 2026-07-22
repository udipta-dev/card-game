import { getCard } from '@content/cards';
import { newInstanceId, resetInstanceCounter } from '@engine/ids';
import type { CardId, CardInstance, GameState, InstanceId, Row, Seat } from '@engine/types';

export interface StateSpec {
  round?: number;
  activeSeat?: Seat;
  roundWins?: Partial<Record<Seat, number>>;
  passed?: Partial<Record<Seat, boolean>>;
  playerHand?: CardId[];
  aiHand?: CardId[];
  playerBoard?: Partial<Record<Row, CardId[]>>;
  aiBoard?: Partial<Record<Row, CardId[]>>;
  playerDeck?: CardId[];
  aiDeck?: CardId[];
}

function emptyRows(): Record<Row, InstanceId[]> {
  return { ratha: [], gaja: [], padati: [] };
}

function place(
  cardId: CardId,
  owner: Seat,
  row: Row | null,
  instances: Record<InstanceId, CardInstance>,
): InstanceId {
  const card = getCard(cardId);
  const inst: CardInstance = {
    iid: newInstanceId(cardId),
    cardId,
    owner,
    row,
    currentPower: card.basePower,
    flags: new Set<string>(),
    boons: [],
    counters: {},
  };
  // Mirror initInstanceRuntime + relevant onPlay self-flags for placed units.
  for (const kw of card.keywords) if (kw.kind === 'armor') inst.counters.armor = kw.amount;
  if (row !== null) {
    // Duryodhana's diamond-body is applied by his onPlay; replicate for board setup.
    if (card.effects.some((e) => e.actions.some((a) => a.kind === 'addFlag' && a.flag === 'diamond-body')))
      inst.flags.add('diamond-body');
  }
  instances[inst.iid] = inst;
  return inst.iid;
}

/** Build a controlled GameState in the 'playing' phase for unit tests. */
export function makeState(spec: StateSpec = {}): GameState {
  resetInstanceCounter();
  const instances: Record<InstanceId, CardInstance> = {};
  const board: Record<Seat, Record<Row, InstanceId[]>> = {
    player: emptyRows(),
    ai: emptyRows(),
  };

  const fillBoard = (seat: Seat, spc?: Partial<Record<Row, CardId[]>>) => {
    if (!spc) return;
    for (const row of Object.keys(spc) as Row[]) {
      for (const cardId of spc[row]!) board[seat][row].push(place(cardId, seat, row, instances));
    }
  };
  fillBoard('player', spec.playerBoard);
  fillBoard('ai', spec.aiBoard);

  const hand = (seat: Seat, ids?: CardId[]): InstanceId[] =>
    (ids ?? []).map((cardId) => place(cardId, seat, null, instances));

  return {
    seed: 12345,
    phase: 'playing',
    activeSeat: spec.activeSeat ?? 'player',
    firstMover: 'player',
    round: spec.round ?? 1,
    totalRounds: 3,
    roundWins: { player: 0, ai: 0, ...spec.roundWins },
    passed: { player: false, ai: false, ...spec.passed },
    board,
    instances,
    hands: { player: hand('player', spec.playerHand), ai: hand('ai', spec.aiHand) },
    decks: {
      player: hand('player', spec.playerDeck),
      ai: hand('ai', spec.aiDeck),
    },
    rowMods: [],
    bannedThisRun: [],
    forcedWinner: null,
    winner: null,
    mulliganDone: { player: true, ai: true },
    log: [],
  };
}

/** First on-board or in-hand instance of a card for a seat. */
export function firstOf(state: GameState, seat: Seat, cardId: CardId): CardInstance {
  const all = Object.values(state.instances).filter(
    (u) => u.owner === seat && u.cardId === cardId,
  );
  if (all.length === 0) throw new Error(`No ${cardId} for ${seat}`);
  return all[0];
}

/** Attach a boon instance to a host unit (mimics playing the boon). */
export function attachBoon(state: GameState, hostIid: InstanceId, boonCardId: CardId): InstanceId {
  const biid = place(boonCardId, state.instances[hostIid].owner, null, state.instances);
  state.instances[hostIid].boons.push(biid);
  state.instances[biid].attachedTo = hostIid;
  return biid;
}

export function hasEvent(state: GameState, pred: (e: GameState['log'][number]) => boolean): boolean {
  return state.log.some(pred);
}
