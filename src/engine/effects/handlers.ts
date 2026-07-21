import { attemptDestroy } from '../keywords';
import type { EffectAction, EffectActionKind, InstanceId } from '../types';
import type { EffectCtx } from './context';
import { emit } from './context';
import { resolveRowRefs } from './targeting';

// The complete set of effect action kinds, used by validateContent to guarantee
// every card references a real handler. Keep in sync with the switch below.
export const EFFECT_ACTION_KINDS = new Set<EffectActionKind>([
  'damage',
  'setPower',
  'buff',
  'destroy',
  'debuffRow',
  'banFromRun',
  'winBattle',
  'addFlag',
  'removeFlag',
  'preventDestroy',
]);

/** Actions that operate on a single target instance. */
const TARGET_ACTIONS: ReadonlySet<EffectActionKind> = new Set<EffectActionKind>([
  'damage',
  'setPower',
  'buff',
  'destroy',
  'addFlag',
  'removeFlag',
]);

export function isTargetAction(kind: EffectActionKind): boolean {
  return TARGET_ACTIONS.has(kind);
}

/** Apply a target-scoped action to a single instance. */
export function applyTargetAction(
  ctx: EffectCtx,
  action: EffectAction,
  iid: InstanceId,
): void {
  const state = ctx.state;
  const u = state.instances[iid];
  if (!u) return;

  switch (action.kind) {
    case 'damage': {
      let remaining = action.amount;
      // Karna's armour soaks damage before power.
      const armor = u.counters.armor ?? 0;
      if (armor > 0) {
        const soak = Math.min(armor, remaining);
        u.counters.armor = armor - soak;
        remaining -= soak;
      }
      u.currentPower = Math.max(0, u.currentPower - remaining);
      emit(ctx, { t: 'damage', iid, amount: remaining, power: u.currentPower });
      break;
    }
    case 'setPower': {
      u.currentPower = Math.max(0, action.value);
      emit(ctx, { t: 'setPower', iid, value: u.currentPower });
      break;
    }
    case 'buff': {
      u.currentPower += action.amount;
      emit(ctx, { t: 'buff', iid, amount: action.amount, power: u.currentPower });
      break;
    }
    case 'destroy': {
      attemptDestroy(state, ctx.actorOwner, iid);
      break;
    }
    case 'addFlag': {
      u.flags.add(action.flag);
      emit(ctx, { t: 'flag', iid, flag: action.flag, on: true });
      break;
    }
    case 'removeFlag': {
      u.flags.delete(action.flag);
      emit(ctx, { t: 'flag', iid, flag: action.flag, on: false });
      break;
    }
    default:
      break; // non-target actions handled elsewhere
  }
}

/** Apply a row/global action once (not per target). */
export function applyGlobalAction(ctx: EffectCtx, action: EffectAction): void {
  const state = ctx.state;
  switch (action.kind) {
    case 'debuffRow': {
      const targets = resolveRowRefs(ctx, action.rows);
      for (const { seat, row } of targets) {
        state.rowMods.push({
          seat,
          row,
          amount: action.amount,
          duration: action.duration,
          source: ctx.actorIid ? state.instances[ctx.actorIid]?.cardId ?? '' : '',
        });
        emit(ctx, { t: 'debuffRow', seat, row, amount: action.amount });
      }
      break;
    }
    case 'banFromRun': {
      if (!state.bannedThisRun.includes(action.card)) state.bannedThisRun.push(action.card);
      emit(ctx, { t: 'ban', cardId: action.card });
      break;
    }
    case 'winBattle': {
      state.forcedWinner = ctx.actorOwner;
      break;
    }
    default:
      break; // target actions handled elsewhere
  }
}
