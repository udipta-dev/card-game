import { adjacentRows, opponentOf, rowUnits, unitsOf } from '../queries';
import type { CardInstance, InstanceId, Row, Seat, TargetSelector, UnitFilter } from '../types';
import type { EffectCtx } from './context';

/** Resolve a target selector to concrete instance ids. Pure read over state. */
export function resolveTargets(ctx: EffectCtx, sel: TargetSelector): InstanceId[] {
  // A vanished warrior is not there to be struck. Enforced HERE, once, on the
  // way out of every selector, rather than inside each case: the undying floor
  // taught us what happens to an invariant that four of seven code paths
  // remember. A hidden man is unreachable by allEnemyUnits, by a row sweep, by
  // highestEnemyUnit and by a hand-picked target alike, and the same rule
  // cannot be true for some weapons and false for others.
  return selectTargets(ctx, sel).filter((iid) => {
    const u = ctx.state.instances[iid];
    if (!u || !u.flags.has('hidden')) return true;
    // Hidden only hides you from the enemy. Your own boons still find you.
    return u.owner === ctx.actorOwner;
  });
}

/** The first unit of `seat` by `order` that the actor can actually target. */
function pickVisible(
  ctx: EffectCtx,
  seat: Seat,
  order: (a: CardInstance, b: CardInstance) => number,
): CardInstance | undefined {
  return unitsOf(ctx.state, seat)
    .filter((u) => !u.flags.has('hidden') || u.owner === ctx.actorOwner)
    .sort(order)[0];
}

function selectTargets(ctx: EffectCtx, sel: TargetSelector): InstanceId[] {
  const { state, actorOwner, playedRow } = ctx;
  const enemy = opponentOf(actorOwner);
  switch (sel.pick) {
    case 'none':
      return [];
    case 'self':
      return ctx.actorIid ? [ctx.actorIid] : [];
    // "Highest enemy" has to mean the highest enemy you can actually SEE.
    // These used to pick the single biggest and hand it to the hidden filter
    // below, so one unseen warrior did not merely protect himself, he blanked
    // the effect outright and everyone behind him was spared too. Choosing from
    // the visible set instead makes concealment protect the concealed man and
    // pass the blow to the next one down, which is both less swingy and what a
    // player would expect.
    case 'highestEnemyUnit': {
      const u = pickVisible(ctx, enemy, (a, b) => b.currentPower - a.currentPower);
      return u ? [u.iid] : [];
    }
    case 'lowestEnemyUnit': {
      const u = pickVisible(ctx, enemy, (a, b) => a.currentPower - b.currentPower);
      return u ? [u.iid] : [];
    }
    case 'allEnemyUnits':
      return unitsOf(state, enemy).map((u) => u.iid);
    case 'allOwnUnits':
      return unitsOf(state, actorOwner).map((u) => u.iid);
    case 'allUnits':
      return [...unitsOf(state, enemy), ...unitsOf(state, actorOwner)].map((u) => u.iid);
    case 'enemyRow':
      return rowUnits(state, enemy, sel.row).map((u) => u.iid);
    case 'enemyRowSameAsPlayed':
      return playedRow ? rowUnits(state, enemy, playedRow).map((u) => u.iid) : [];
    // Both sides of one line. Enemy first so that if a handler ever stops early
    // the enemy is hit before the firer's own men, which is the order the
    // player will expect from a weapon he aimed.
    case 'lineBothSides':
      return [...rowUnits(state, enemy, sel.row), ...rowUnits(state, actorOwner, sel.row)].map(
        (u) => u.iid,
      );
    case 'lineBothSidesSameAsPlayed':
      return playedRow
        ? [...rowUnits(state, enemy, playedRow), ...rowUnits(state, actorOwner, playedRow)].map(
            (u) => u.iid,
          )
        : [];
    case 'ownRowSameAsPlayed':
      return playedRow ? rowUnits(state, actorOwner, playedRow).map((u) => u.iid) : [];
    case 'ownAdjacentToPlayed':
      if (!playedRow) return [];
      return adjacentRows(playedRow).flatMap((r) =>
        rowUnits(state, actorOwner, r).map((u) => u.iid),
      );
    case 'unitByCard': {
      const side = sel.side === 'own' ? actorOwner : enemy;
      const named = new Set(sel.cards ?? (sel.card ? [sel.card] : []));
      return unitsOf(state, side)
        .filter((u) => named.has(u.cardId))
        .map((u) => u.iid);
    }
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
  if (filter.cards && !filter.cards.includes(u.cardId)) return false;
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
