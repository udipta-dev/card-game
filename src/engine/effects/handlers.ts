import { afflict } from '../curses';
import { nextRandom } from '../ids';
import { attemptDestroy } from '../keywords';
import { opponentOf } from '../queries';
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
  'burnOwnDeck',
  'afflict',
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
      // Floor at 0 so a negative buff (Shalya sapping Karna) never goes below zero.
      u.currentPower = Math.max(0, u.currentPower + action.amount);
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
    case 'burnOwnDeck': {
      // You win the field and lose part of your host forever. The cards are
      // drawn from the deck at random (seeded) and banned for the run, so the
      // cost is real and unrecoverable rather than a number on a screen.
      const seat = ctx.actorOwner;
      const burned: string[] = [];
      for (let i = 0; i < action.count; i++) {
        const deck = state.decks[seat];
        if (!deck.length) break;
        const [nextSeed, roll] = nextRandom(state.seed);
        state.seed = nextSeed;
        const idx = Math.floor(roll * deck.length);
        const [iid] = deck.splice(idx, 1);
        const inst = state.instances[iid];
        if (!inst) continue;
        burned.push(inst.cardId);
        if (!state.bannedThisRun.includes(inst.cardId)) state.bannedThisRun.push(inst.cardId);
        delete state.instances[iid];
      }
      if (burned.length) emit(ctx, { t: 'burn', seat, cardIds: burned });
      break;
    }
    case 'afflict': {
      const seat = action.side === 'own' ? ctx.actorOwner : opponentOf(ctx.actorOwner);
      afflict(state, seat, action.pool);
      break;
    }
    default:
      break; // target actions handled elsewhere
  }
}
