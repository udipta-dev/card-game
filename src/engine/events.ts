// The effect/trigger resolution engine. Runs a card's effect descriptors when
// a trigger fires, evaluating conditions (some global, some target-relative)
// and dispatching each action to the right handler. This is the whole reason
// marquee cards need no bespoke engine branches.
import { getCard } from '@content/cards';
import { EffectCtx } from './effects/context';
import { emit } from './effects/context';
import { applyGlobalAction, applyTargetAction, isTargetAction } from './effects/handlers';
import { resolveTargets } from './effects/targeting';
import { boonCardIds, cardOnBoard, isFinalRound } from './queries';
import { ROWS } from './types';
import type { Condition, EffectDef, GameState, InstanceId, Seat, TriggerEvent } from './types';

function evalCondition(ctx: EffectCtx, cond: Condition, target?: InstanceId): boolean {
  const { state, actorOwner } = ctx;
  switch (cond.q) {
    case 'cardOnBoard':
      return cardOnBoard(state, actorOwner, cond.card, cond.side ?? 'any');
    case 'isFinalRound':
      return isFinalRound(state);
    case 'targetHasBoon':
      return target ? boonCardIds(state, target).includes(cond.boon) : false;
    case 'targetHasFlag':
      return target ? !!state.instances[target]?.flags.has(cond.flag) : false;
    case 'not':
      return !evalCondition(ctx, cond.c, target);
    case 'and':
      return cond.cs.every((c) => evalCondition(ctx, c, target));
    case 'or':
      return cond.cs.some((c) => evalCondition(ctx, c, target));
  }
}

function conditionUsesTarget(cond: Condition): boolean {
  switch (cond.q) {
    case 'targetHasBoon':
    case 'targetHasFlag':
      return true;
    case 'not':
      return conditionUsesTarget(cond.c);
    case 'and':
    case 'or':
      return cond.cs.some(conditionUsesTarget);
    default:
      return false;
  }
}

/** Resolve a single effect against the current context. Mutates state. */
export function runEffect(ctx: EffectCtx, effect: EffectDef): void {
  const targets = resolveTargets(ctx, effect.target);
  const hasTargetActs = effect.actions.some((a) => isTargetAction(a.kind));
  const hasGlobalActs = effect.actions.some((a) => !isTargetAction(a.kind));

  if (hasTargetActs) {
    let acted = false;
    for (const iid of targets) {
      if (!effect.condition || evalCondition(ctx, effect.condition, iid)) {
        for (const a of effect.actions) if (isTargetAction(a.kind)) applyTargetAction(ctx, a, iid);
        acted = true;
      }
    }
    // An astra that resolves onto a protected target (Nagastra vs Krishna) fizzles.
    if (
      targets.length > 0 &&
      !acted &&
      effect.condition &&
      conditionUsesTarget(effect.condition) &&
      getCard(ctx.actorCardId).type === 'astra'
    ) {
      emit(ctx, { t: 'redirected', source: ctx.actorCardId, reason: 'boon' });
    }
  }

  if (hasGlobalActs) {
    const gate = !effect.condition || evalCondition(ctx, effect.condition, undefined);
    if (gate) for (const a of effect.actions) if (!isTargetAction(a.kind)) applyGlobalAction(ctx, a);
  }
}

/** Run all of the acting card's effects that match a trigger. */
export function runCardEffects(ctx: EffectCtx, trigger: TriggerEvent): void {
  const card = getCard(ctx.actorCardId);
  for (const effect of card.effects) {
    if (effect.on === trigger) runEffect(ctx, effect);
  }
}

/**
 * Fire a board-wide trigger (onRoundStart / onRoundEnd): every unit on the
 * board runs its matching effects, acting as its own owner. Snapshots the unit
 * list first so effects that destroy units don't corrupt the iteration.
 */
export function runBoardTrigger(state: GameState, trigger: TriggerEvent): void {
  const snapshot: { iid: InstanceId; owner: Seat; cardId: string; row: string | null }[] = [];
  for (const seat of ['player', 'ai'] as Seat[]) {
    for (const row of ROWS) {
      for (const iid of state.board[seat][row]) {
        const u = state.instances[iid];
        if (u) snapshot.push({ iid, owner: u.owner, cardId: u.cardId, row });
      }
    }
  }
  for (const s of snapshot) {
    if (!state.instances[s.iid]) continue; // already destroyed this pass
    const ctx: EffectCtx = {
      state,
      actorOwner: s.owner,
      actorCardId: s.cardId,
      actorIid: s.iid,
      playedRow: (s.row as import('./types').Row) ?? null,
      chosen: [],
    };
    runCardEffects(ctx, trigger);
  }
}
