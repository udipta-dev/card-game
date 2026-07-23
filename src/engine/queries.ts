// Pure, read-only queries over GameState. No mutation, no side effects.
import { getCard } from '@content/cards';
import type { CardId, CardInstance, GameState, Row, Seat } from './types';
import { ROWS } from './types';

export const MAX_ROUNDS = 3;
export const WINS_NEEDED = 2;

export function opponentOf(seat: Seat): Seat {
  return seat === 'player' ? 'ai' : 'player';
}

export function inst(state: GameState, iid: string): CardInstance | undefined {
  return state.instances[iid];
}

/** All unit instances a seat has on the board, in row order. */
export function unitsOf(state: GameState, seat: Seat): CardInstance[] {
  const out: CardInstance[] = [];
  for (const row of ROWS) {
    for (const iid of state.board[seat][row]) {
      const u = state.instances[iid];
      if (u) out.push(u);
    }
  }
  return out;
}

export function rowUnits(state: GameState, seat: Seat, row: Row): CardInstance[] {
  return state.board[seat][row]
    .map((iid) => state.instances[iid])
    .filter((u): u is CardInstance => !!u);
}

/** Sum of row modifiers affecting a given seat+row. */
export function rowModTotal(state: GameState, seat: Seat, row: Row): number {
  return state.rowMods
    .filter((m) => m.seat === seat && m.row === row)
    .reduce((sum, m) => sum + m.amount, 0);
}

/** Row power = unit powers + row mods, floored at 0. */
export function rowPower(state: GameState, seat: Seat, row: Row): number {
  const units = rowUnits(state, seat, row).reduce((s, u) => s + u.currentPower, 0);
  return Math.max(0, units + rowModTotal(state, seat, row));
}

/** Total board power for a seat across all rows. */
export function seatPower(state: GameState, seat: Seat): number {
  return ROWS.reduce((sum, row) => sum + rowPower(state, seat, row), 0);
}

/** Highest-power unit a seat controls, or undefined. Deterministic on ties. */
export function highestUnit(state: GameState, seat: Seat): CardInstance | undefined {
  return unitsOf(state, seat).reduce<CardInstance | undefined>((best, u) => {
    if (!best || u.currentPower > best.currentPower) return u;
    return best;
  }, undefined);
}

export function lowestUnit(state: GameState, seat: Seat): CardInstance | undefined {
  return unitsOf(state, seat).reduce<CardInstance | undefined>((best, u) => {
    if (!best || u.currentPower < best.currentPower) return u;
    return best;
  }, undefined);
}

/** Is card `id` on the board for the given relative side (own/enemy/any)? */
export function cardOnBoard(
  state: GameState,
  actorOwner: Seat,
  id: CardId,
  side: 'own' | 'enemy' | 'any' = 'any',
): boolean {
  const seats: Seat[] =
    side === 'own'
      ? [actorOwner]
      : side === 'enemy'
        ? [opponentOf(actorOwner)]
        : ['player', 'ai'];
  return seats.some((s) => unitsOf(state, s).some((u) => u.cardId === id));
}

/**
 * The final round decides the battle: either the last possible round, or a
 * round where a seat is at match point (one win from victory).
 */
export function isFinalRound(state: GameState): boolean {
  if (state.round >= MAX_ROUNDS) return true;
  return Object.values(state.roundWins).some((w) => w >= WINS_NEEDED - 1);
}

/**
 * Can `seat` invoke this astra? Requires a warrior on board who is either
 * trained to the astra's tier (rank grants the common weapons) or bears it by a
 * named boon (the tier-3 ultimates).
 */
export function canInvokeAstra(state: GameState, seat: Seat, astraId: CardId): boolean {
  const tier = getCard(astraId).astraTier ?? 1;
  return unitsOf(state, seat).some((u) => {
    const w = getCard(u.cardId);
    return (w.astraMastery ?? 0) >= tier || !!w.knownAstras?.includes(astraId);
  });
}

export function boonCardIds(state: GameState, unitIid: string): CardId[] {
  const u = state.instances[unitIid];
  if (!u) return [];
  return u.boons
    .map((biid) => state.instances[biid]?.cardId)
    .filter((c): c is CardId => !!c);
}

/** Rows adjacent by index to a given row. */
export function adjacentRows(row: Row): Row[] {
  const i = ROWS.indexOf(row);
  const out: Row[] = [];
  if (i - 1 >= 0) out.push(ROWS[i - 1]);
  if (i + 1 < ROWS.length) out.push(ROWS[i + 1]);
  return out;
}

/** Convenience: the definition for an instance. */
export function cardOf(instance: CardInstance) {
  return getCard(instance.cardId);
}
