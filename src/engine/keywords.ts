// Keyword mechanics. The important one is the destroy-attempt interception:
// icchamrityu, immuneUntilPlayed, armor and the diamond-body flag all express
// "you cannot remove me (yet)" through ONE generic gate, no card-specific
// branch in the engine. Removal always goes through attemptDestroy().
import { getCard } from '@content/cards';
import { cardOnBoard } from './queries';
import { ROWS } from './types';
import type { CardInstance, GameState, InstanceId, Seat } from './types';

/** Remove an instance from wherever it lives, and detach its boons. Pure-ish. */
export function removeInstance(state: GameState, iid: InstanceId): void {
  const u = state.instances[iid];
  if (!u) return;
  for (const seat of ['player', 'ai'] as Seat[]) {
    for (const row of ROWS) {
      const arr = state.board[seat][row];
      const idx = arr.indexOf(iid);
      if (idx >= 0) arr.splice(idx, 1);
    }
    const h = state.hands[seat].indexOf(iid);
    if (h >= 0) state.hands[seat].splice(h, 1);
  }
  // Detach + drop any boons riding on this unit.
  for (const biid of u.boons) {
    delete state.instances[biid];
  }
  delete state.instances[iid];
}

/** Called when a unit is placed: seed runtime counters from its keywords. */
export function initInstanceRuntime(state: GameState, iid: InstanceId): void {
  const u = state.instances[iid];
  if (!u) return;
  const card = getCard(u.cardId);
  for (const kw of card.keywords) {
    if (kw.kind === 'armor') u.counters.armor = kw.amount;
    if (kw.kind === 'nightGrowth') {
      // Grows stronger as the war deepens (proxy for rakshasa night-strength).
      const bonus = kw.amount * Math.max(0, state.round - 1);
      if (bonus > 0) {
        u.currentPower += bonus;
        state.log.push({ t: 'buff', iid, amount: bonus, power: u.currentPower });
      }
    }
    if (kw.kind === 'bond') {
      // Rallies: +amount for each allied unit already fielded with the tag.
      const allies = boardUnits(state, u.owner).filter(
        (o) => o.iid !== iid && getCard(o.cardId).tags?.includes(kw.tag),
      );
      const bonus = kw.amount * allies.length;
      if (bonus > 0) {
        u.currentPower += bonus;
        state.log.push({ t: 'buff', iid, amount: bonus, power: u.currentPower });
      }
    }
  }
}

/**
 * Attempt to destroy an instance. Returns true if it was actually removed.
 * All protection keywords intercept here and log a preventDestroy event.
 */
export function attemptDestroy(
  state: GameState,
  _actorOwner: Seat,
  iid: InstanceId,
): boolean {
  const u = state.instances[iid];
  if (!u) return false;
  const card = getCard(u.cardId);

  // Duryodhana's diamond body (removed by Bhima's vow before this fires).
  if (u.flags.has('diamond-body')) {
    state.log.push({ t: 'preventDestroy', iid, reason: 'diamond-body' });
    return false;
  }

  for (const kw of card.keywords) {
    if (kw.kind === 'deathless') {
      // Chiranjivi: cannot be destroyed by any means.
      state.log.push({ t: 'preventDestroy', iid, reason: 'deathless' });
      return false;
    }
    if (kw.kind === 'icchamrityu') {
      // Bhishma: unkillable until the counter card is on the board.
      if (!cardOnBoard(state, u.owner, kw.unlessCardOnBoard, 'any')) {
        state.log.push({ t: 'preventDestroy', iid, reason: 'icchamrityu' });
        return false;
      }
    }
    if (kw.kind === 'immuneUntilPlayed') {
      // Drona: immune until the deception card is played (sets 'disarmed').
      if (!u.flags.has('disarmed')) {
        state.log.push({ t: 'preventDestroy', iid, reason: 'immuneUntilPlayed' });
        return false;
      }
    }
  }

  // Karna's Kavacha-Kundala: armour absorbs one attempt, then is spent.
  if ((u.counters.armor ?? 0) > 0) {
    u.counters.armor = 0;
    state.log.push({ t: 'preventDestroy', iid, reason: 'armor' });
    return false;
  }

  removeInstance(state, iid);
  state.log.push({ t: 'destroy', iid, cardId: card.id });
  return true;
}

/**
 * Hook run after any card is played: if the played card is the trigger for a
 * board unit's immuneUntilPlayed keyword, disarm that unit (set its power).
 * This is how "Ashwatthama is dead" fells Drona.
 */
export function applyImmuneDisarm(state: GameState, playedCardId: string): void {
  for (const seat of ['player', 'ai'] as Seat[]) {
    for (const u of boardUnits(state, seat)) {
      const card = getCard(u.cardId);
      for (const kw of card.keywords) {
        if (
          kw.kind === 'immuneUntilPlayed' &&
          kw.card === playedCardId &&
          !u.flags.has('disarmed')
        ) {
          u.currentPower = kw.thenSetPower;
          u.flags.add('disarmed');
          state.log.push({ t: 'setPower', iid: u.iid, value: kw.thenSetPower });
          state.log.push({ t: 'flag', iid: u.iid, flag: 'disarmed', on: true });
        }
      }
    }
  }
}

function boardUnits(state: GameState, seat: Seat): CardInstance[] {
  const out: CardInstance[] = [];
  for (const row of ROWS) {
    for (const iid of state.board[seat][row]) {
      const u = state.instances[iid];
      if (u) out.push(u);
    }
  }
  return out;
}

/** Whether a seat may currently invoke astras (Karna's final-round curse). */
export function canPlayAstras(state: GameState, seat: Seat, isFinal: boolean): boolean {
  if (!isFinal) return true;
  // If this seat fields a unit with noAstrasInFinalRound, astras are barred.
  for (const u of boardUnits(state, seat)) {
    const card = getCard(u.cardId);
    if (card.keywords.some((k) => k.kind === 'noAstrasInFinalRound')) return false;
  }
  return true;
}
