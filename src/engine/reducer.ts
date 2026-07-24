// The single entry point for advancing a match. `reduce(state, action)` is a
// pure function: it deep-clones the state, applies the action + all triggered
// effects, and returns the new state. The AI simulates via this exact path.
import { getCard } from '@content/cards';
import { ADHARMA_CURSES, resolveClash } from './clash';
import { afflict } from './curses';
import type { EffectCtx } from './effects/context';
import { runCardEffects, runEffect } from './events';
import { applyImmuneDisarm, canPlayAstras, initInstanceRuntime } from './keywords';
import { canInvokeAstra, isFinalRound, opponentOf } from './queries';
import { resolveRound } from './rounds';
import { MULLIGAN_MAX } from './createMatch';
import type { Action, Card, GameState, Row, Seat } from './types';

function clone(state: GameState): GameState {
  return structuredClone(state);
}

function beginPlaying(s: GameState): void {
  s.phase = 'playing';
  s.activeSeat = s.firstMover;
}

/** Is this a legal PLAY_CARD for the active seat? Cheap structural check. */
export function isLegalPlay(
  state: GameState,
  seat: Seat,
  iid: string,
  row: Row,
): boolean {
  if (state.phase !== 'playing' || state.activeSeat !== seat) return false;
  if (!state.hands[seat].includes(iid)) return false;
  const u = state.instances[iid];
  if (!u) return false;
  const card = getCard(u.cardId);
  if (!card.rows.includes(row)) return false;
  // Spent for the run. A great astra fires once and the arsenal is empty.
  if (state.bannedThisRun.includes(card.id)) return false;
  if (card.type === 'astra') {
    if (!canPlayAstras(state, seat, isFinalRound(state))) return false;
    if (!canInvokeAstra(state, seat, card.id)) return false; // needs a warrior who knows it
  }
  return true;
}

/**
 * A Brahma-line weapon or greater fires once. Once loosed (or spent answering
 * another), it is gone for the rest of the run: the arsenal empties. Elemental
 * weapons are common enough to carry more than one of.
 */
function banForRun(s: GameState, card: Card): void {
  if (card.type !== 'astra' || (card.astraTier ?? 1) < 2) return;
  if (s.bannedThisRun.includes(card.id)) return;
  s.bannedThisRun.push(card.id);
  s.log.push({ t: 'ban', cardId: card.id });
}

/**
 * May this seat spend a turn on a fielded warrior's skill at arms? Needs the
 * warrior on the board, alive, with a charge left in this battle.
 */
export function isLegalAbility(state: GameState, seat: Seat, iid: string): boolean {
  if (state.phase !== 'playing' || state.activeSeat !== seat) return false;
  const u = state.instances[iid];
  if (!u || u.owner !== seat || u.row === null) return false;
  if (!getCard(u.cardId).ability) return false;
  return (u.counters.charges ?? 0) > 0;
}

function advanceTurn(s: GameState, seat: Seat): void {
  const opp = opponentOf(seat);
  // Keep the turn if the opponent has already passed; otherwise hand over.
  s.activeSeat = s.passed[opp] ? seat : opp;
}

export function reduce(state: GameState, action: Action): GameState {
  const s = clone(state);

  switch (action.type) {
    case 'MULLIGAN': {
      if (s.phase !== 'mulligan' || s.mulliganDone[action.seat]) return state;
      const seat = action.seat;
      const swap = action.iids.filter((i) => s.hands[seat].includes(i)).slice(0, MULLIGAN_MAX);
      for (const iid of swap) {
        s.hands[seat].splice(s.hands[seat].indexOf(iid), 1);
        s.decks[seat].push(iid); // to the bottom
      }
      for (let i = 0; i < swap.length; i++) {
        const drawn = s.decks[seat].shift();
        if (drawn) s.hands[seat].push(drawn);
      }
      s.mulliganDone[seat] = true;
      s.log.push({ t: 'mulligan', seat, count: swap.length });
      if (s.mulliganDone.player && s.mulliganDone.ai) beginPlaying(s);
      return s;
    }

    case 'PLAY_CARD': {
      const seat = s.activeSeat;
      if (!isLegalPlay(s, seat, action.iid, action.row)) return state;
      const iid = action.iid;
      const u = s.instances[iid]!;
      const card = getCard(u.cardId);

      // Remove from hand and announce.
      s.hands[seat].splice(s.hands[seat].indexOf(iid), 1);
      s.log.push({ t: 'play', seat, iid, cardId: card.id, row: action.row });

      const ctx: EffectCtx = {
        state: s,
        actorOwner: seat,
        actorCardId: card.id,
        actorIid: iid,
        playedRow: action.row,
        chosen: action.targets ?? [],
      };

      if (card.type === 'unit') {
        u.row = action.row;
        s.board[seat][action.row].push(iid);
        initInstanceRuntime(s, iid);
        runCardEffects(ctx, 'onPlay');
      } else if (card.type === 'boon') {
        const host = action.targets?.[0];
        if (host && s.instances[host]) {
          s.instances[host].boons.push(iid);
          u.attachedTo = host;
          s.log.push({ t: 'attach', boon: iid, to: host });
        }
        runCardEffects(ctx, 'onPlay');
      } else {
        // astra / curse. First, the counter-web: if the defender holds an astra
        // that answers this one, theirs is spent and this fizzles.
        const counterHid =
          card.type === 'astra' && card.counteredBy?.length
            ? s.hands[opponentOf(seat)].find((hid) =>
                card.counteredBy!.includes(getCard(s.instances[hid]!.cardId).id),
              )
            : undefined;
        if (counterHid) {
          const defender = opponentOf(seat);
          const counterCard = getCard(s.instances[counterHid]!.cardId);
          s.hands[defender].splice(s.hands[defender].indexOf(counterHid), 1);
          delete s.instances[counterHid];
          s.log.push({ t: 'countered', astra: card.id, by: counterCard.id, seat: defender });
          // Two great weapons meeting is not a clean cancellation.
          resolveClash(s, seat, card, counterCard);
          // The answering weapon is spent for the run too.
          banForRun(s, counterCard);
        } else {
          runCardEffects(ctx, 'onPlay');
          // The ultimates ALWAYS cost the one who looses them. Making this a
          // rule rather than per-card data means no tier-3 weapon can ever be
          // added as pure upside, however it is written.
          if (card.type === 'astra' && (card.astraTier ?? 1) >= 3) {
            afflict(s, seat, ADHARMA_CURSES);
          }
        }
        delete s.instances[iid]; // the astra is spent either way
        banForRun(s, card);
      }

      // A newly played card may disarm an immune enemy (Drona).
      applyImmuneDisarm(s, card.id);

      // Pashupatastra & friends can end the battle immediately.
      if (s.forcedWinner) {
        s.phase = 'battleEnd';
        s.winner = s.forcedWinner;
        s.log.push({ t: 'battleEnd', winner: s.forcedWinner, reason: 'astra' });
        return s;
      }

      advanceTurn(s, seat);
      return s;
    }

    case 'USE_ABILITY': {
      const seat = s.activeSeat;
      if (!isLegalAbility(s, seat, action.iid)) return state;
      const u = s.instances[action.iid]!;
      const card = getCard(u.cardId);
      const ability = card.ability!;

      // Spending a skill costs your turn, exactly as playing a card does.
      u.counters.charges = (u.counters.charges ?? 0) - 1;
      s.log.push({
        t: 'ability',
        iid: action.iid,
        cardId: card.id,
        name: ability.name,
        left: u.counters.charges,
      });

      runEffect(
        {
          state: s,
          actorOwner: seat,
          actorCardId: card.id,
          actorIid: action.iid,
          playedRow: u.row,
          chosen: action.targets ?? [],
        },
        { on: 'onPlay', target: ability.target, actions: ability.actions },
      );

      advanceTurn(s, seat);
      return s;
    }

    case 'PASS': {
      if (s.phase !== 'playing') return state;
      const seat = action.seat;
      if (s.activeSeat !== seat) return state;
      s.passed[seat] = true;
      s.log.push({ t: 'pass', seat });
      if (s.passed.player && s.passed.ai) {
        resolveRound(s);
      } else {
        s.activeSeat = opponentOf(seat);
      }
      return s;
    }
  }
}
