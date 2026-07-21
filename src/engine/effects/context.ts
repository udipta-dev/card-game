import type { CardId, GameEvent, GameState, InstanceId, Row, Seat } from '../types';

// Mutable resolution context threaded through effect handlers. `state` is the
// working draft (already cloned by the reducer). Events are pushed to the log.
export interface EffectCtx {
  state: GameState;
  actorOwner: Seat;
  actorCardId: CardId;
  /** Row the acting card was played into (astras land in a row). */
  playedRow: Row | null;
  actorIid: InstanceId | null;
  /** Player/AI-selected targets for `chosen` selectors. */
  chosen: InstanceId[];
}

export function emit(ctx: EffectCtx, ev: GameEvent): void {
  ctx.state.log.push(ev);
}
