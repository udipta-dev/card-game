import {
  adjacentRows,
  highestUnit,
  lowestUnit,
  opponentOf,
  rowUnits,
  unitsOf,
} from '../queries';
import type { InstanceId, Row, Seat, TargetSelector, UnitFilter } from '../types';
import type { EffectCtx } from './context';

/** Resolve a target selector to concrete instance ids. Pure read over state. */
export function resolveTargets(ctx: EffectCtx, sel: TargetSelector): InstanceId[] {
  const { state, actorOwner, playedRow } = ctx;
  const enemy = opponentOf(actorOwner);
  switch (sel.pick) {
    case 'none':
      return [];
    case 'self':
      return ctx.actorIid ? [ctx.actorIid] : [];
    case 'highestEnemyUnit': {
      const u = highestUnit(state, enemy);
      return u ? [u.iid] : [];
    }
    case 'lowestEnemyUnit': {
      const u = lowestUnit(state, enemy);
      return u ? [u.iid] : [];
    }
    case 'allEnemyUnits':
      return unitsOf(state, enemy).map((u) => u.iid);
    case 'enemyRow':
      return rowUnits(state, enemy, sel.row).map((u) => u.iid);
    case 'enemyRowSameAsPlayed':
      return playedRow ? rowUnits(state, enemy, playedRow).map((u) => u.iid) : [];
    case 'ownAdjacentToPlayed':
      if (!playedRow) return [];
      return adjacentRows(playedRow).flatMap((r) =>
        rowUnits(state, actorOwner, r).map((u) => u.iid),
      );
    case 'chosen':
      return ctx.chosen.filter((iid) => matchesFilter(ctx, iid, sel.filter));
  }
}

function matchesFilter(ctx: EffectCtx, iid: InstanceId, filter: UnitFilter): boolean {
  const u = ctx.state.instances[iid];
  if (!u || u.row === null) return false;
  const enemy = opponentOf(ctx.actorOwner);
  if (filter.side === 'own' && u.owner !== ctx.actorOwner) return false;
  if (filter.side === 'enemy' && u.owner !== enemy) return false;
  if (filter.rows && !filter.rows.includes(u.row)) return false;
  return true;
}

/** Resolve row references (for row modifiers) to concrete seat+row pairs. */
export function resolveRowRefs(
  ctx: EffectCtx,
  refs: import('../types').RowRef[],
): { seat: Seat; row: Row }[] {
  const enemy = opponentOf(ctx.actorOwner);
  const out: { seat: Seat; row: Row }[] = [];
  for (const ref of refs) {
    const seat = ref.side === 'own' ? ctx.actorOwner : enemy;
    if ('row' in ref) {
      out.push({ seat, row: ref.row });
    } else if ('sameAsPlayed' in ref) {
      if (ctx.playedRow) out.push({ seat, row: ctx.playedRow });
    } else if ('adjacentToPlayed' in ref) {
      if (ctx.playedRow) adjacentRows(ctx.playedRow).forEach((row) => out.push({ seat, row }));
    }
  }
  return out;
}
