// Keyword mechanics. The important one is the destroy-attempt interception:
// icchamrityu, immuneUntilPlayed, armor and the diamond-body flag all express
// "you cannot remove me (yet)" through ONE generic gate, no card-specific
// branch in the engine. Removal always goes through attemptDestroy().
import { getCard } from '@content/cards';
import { cursedAgainstAstras } from './curses';
import { cardOnBoard } from './queries';
import { ROWS } from './types';
import type { CardInstance, GameState, InstanceId, Seat } from './types';

/**
 * The lowest power a warrior may be driven to.
 *
 * Normally 0. But a warrior who CANNOT BE KILLED must not be reducible to
 * nothing either: floored at 0, Bhishma could be ground to zero and left
 * standing on the field contributing nothing, which is unkillable AND useless,
 * the worst of both. At a floor of 1 he can be worn down to a single point and
 * still stands there until Shikhandi walks on.
 *
 * This also gives the effect ladder a clean rung: "reduce to 1" becomes the
 * strongest thing that works on EVERYONE, including the undying, while outright
 * destruction stays the privilege of the ultimates and some warriors are simply
 * immune to it.
 */
export function powerFloor(state: GameState, u: CardInstance): number {
  // Stripped by Krishna's counsel: the undying floor is one of the protections
  // that stops applying, so a man who could never be ground below 1 now can.
  // Without this he would be killable but still unwearable-down, which is a
  // strange half-state and not what "his protections do not apply" means.
  if (u.flags.has('stripped')) return 0;
  const card = getCard(u.cardId);
  // Duryodhana's diamond body. A flag rather than a keyword, which is exactly
  // why it was missed: attemptDestroy checked it and powerFloor did not, so he
  // was the one warrior left in the state the floor exists to prevent, immune
  // to every weapon and grindable all the way to nothing. Bhima's vow is his
  // answer, so he takes the same half floor as the others who have one.
  if (u.flags.has('diamond-body')) return Math.floor(card.basePower / 2);
  for (const kw of card.keywords) {
    // A warrior who HAS an answer floors at half his strength. Grinding him is
    // still worth doing, but it can never finish the job, so the answer card is
    // the only way to take the rest. At a floor of 1 the answer was worth about
    // one point: two damage cards took Bhishma from 10 to 1, the board wiped at
    // round end anyway, and Shikhandi, the most famous answer in the epic, was
    // decoration.
    //
    // A warrior with NO answer keeps the floor of 1. Ashwatthama cannot be
    // killed by anything, so half his strength would be points the opponent is
    // simply never allowed to contest.
    // Every drop that fell stood up as another of him. Damage never moves him;
    // he floors at his full strength. He has no protection from destroy, so the
    // answer is removal, which is exactly how the story goes: Kali did not
    // wound him, she stopped the blood from landing.
    if (kw.kind === 'unwoundable') return card.basePower;
    if (kw.kind === 'deathless') return 1;
    if (kw.kind === 'icchamrityu' && !cardOnBoard(state, u.owner, kw.unlessCardOnBoard, 'any'))
      return Math.floor(card.basePower / 2);
    if (kw.kind === 'immuneUntilPlayed' && !u.flags.has('disarmed'))
      return Math.floor(card.basePower / 2);
  }
  return 0;
}

/**
 * Lower a warrior's power, respecting the undying floor.
 *
 * Every site that reduces power must go through here. Found by audit: the astra
 * clash and three of the five curses each did their own Math.max(0, ...), so a
 * curse could grind Bhishma to nothing when no weapon in the game could. An
 * invariant enforced in four places out of seven is not an invariant.
 */
export function lowerPower(state: GameState, u: CardInstance, by: number): void {
  u.currentPower = Math.max(powerFloor(state, u), u.currentPower - by);
}

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
  // A warrior arrives with his skill at arms ready for this battle.
  if (card.ability) u.counters.charges = card.ability.charges;
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

  // KRISHNA'S COUNSEL. Every protection below is off for this man, so he can be
  // killed by ordinary means. This is not a bigger weapon, it is the removal of
  // the reason a weapon was not enough: Drona laying down his bow because he was
  // told his son was dead, Duryodhana's thighs, Jayadratha's sunset. Krishna
  // calls his own engineered kills "the employment of means" (Drona CLXXXI).
  if (u.flags.has('stripped')) {
    state.log.push({ t: 'stripped', iid, cardId: card.id });
    removeInstance(state, iid);
    state.log.push({ t: 'destroy', iid, cardId: card.id });
    return true;
  }

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
  // A curse earned by your own adharma bars you outright, in any round.
  if (cursedAgainstAstras(state, seat)) return false;
  if (!isFinal) return true;
  // If this seat fields a unit with noAstrasInFinalRound, astras are barred.
  for (const u of boardUnits(state, seat)) {
    const card = getCard(u.cardId);
    if (card.keywords.some((k) => k.kind === 'noAstrasInFinalRound')) return false;
  }
  return true;
}
