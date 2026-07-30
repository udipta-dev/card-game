// The single entry point for advancing a match. `reduce(state, action)` is a
// pure function: it deep-clones the state, applies the action + all triggered
// effects, and returns the new state. The AI simulates via this exact path.
import { getCard } from '@content/cards';
import { ADHARMA_CURSES, resolveClash } from './clash';
import { afflict } from './curses';
import type { EffectCtx } from './effects/context';
import { runCardEffects, runEffect } from './events';
import { applyImmuneDisarm, canPlayAstras, initInstanceRuntime, removeInstance } from './keywords';
import { canInvokeAstra, isFinalRound, opponentOf, unitsOf } from './queries';
import { resolveRound } from './rounds';
import { MULLIGAN_MAX, makeInstance } from './createMatch';
import type { Action, Card, CardInstance, GameState, Row, Seat } from './types';

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
  // Denied by guile: this man cannot be committed this round. Not damage and
  // not removal - a targeting restriction, which is how the epic actually
  // answers strength.
  if (u.flags.has('denied')) return false;
  // Spent for the run. A great astra fires once and the arsenal is empty.
  if (state.bannedThisRun.includes(card.id)) return false;
  if (card.type === 'astra') {
    if (!canPlayAstras(state, seat, isFinalRound(state))) return false;
    if (!canInvokeAstra(state, seat, card.id)) return false; // needs a warrior who knows it
  }
  return true;
}

/**
 * The warrior on `seat`'s side who draws an incoming astra onto himself, if any.
 * Highest power first: with two rods standing, the weapon finds the bigger
 * threat, which is the one that provoked it.
 */
function drawsTheAstra(s: GameState, seat: Seat): CardInstance | undefined {
  return unitsOf(s, seat)
    .filter((u) => getCard(u.cardId).keywords.some((k) => k.kind === 'drawsAstra'))
    .sort((a, b) => b.currentPower - a.currentPower)[0];
}

/**
 * Send a weapon into the man who drew it. It never reaches what it was aimed
 * at, so there are no row effects and no adharma curse: the firer did not hit
 * his target, he hit the rakshasa who made him fire.
 *
 * Marks the weapon WASTED, which suspendIfWasted turns into a recoverable ban.
 */
function drewOntoRod(s: GameState, card: Card, firer: Seat): void {
  const rod = drawsTheAstra(s, opponentOf(firer));
  if (!rod) return;
  removeInstance(s, rod.iid);
  s.wastedAstra = card.id;
  s.log.push({ t: 'drewAstra', astra: card.id, cardId: rod.cardId, seat: rod.owner });
}

/**
 * Turn a wasted weapon into a suspension. Only ever suspends something the ban
 * actually took, so suspendedThisRun stays a strict subset of bannedThisRun and
 * nothing has to consult two lists to decide what is playable.
 */
function suspendIfWasted(s: GameState, card: Card): void {
  if (s.wastedAstra !== card.id) return;
  s.wastedAstra = undefined;
  if (!s.bannedThisRun.includes(card.id)) return;
  if (s.suspendedThisRun.includes(card.id)) return;
  s.suspendedThisRun.push(card.id);
  s.log.push({ t: 'suspended', cardId: card.id });
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
  if (!u || u.owner !== seat) return false;
  // On the field in his own right, OR riding with a warrior who is. A boon has
  // no row of its own, so requiring one silently made every attached card's
  // ability unusable, which is why Krishna could never have had one before.
  const fielded = u.row !== null || (u.attachedTo != null && state.instances[u.attachedTo]?.row != null);
  if (!fielded) return false;
  if (!getCard(u.cardId).ability) return false;
  return (u.counters.charges ?? 0) > 0;
}

function advanceTurn(s: GameState, seat: Seat): void {
  const opp = opponentOf(seat);
  // Keep the turn if the opponent has already passed; otherwise hand over.
  s.activeSeat = s.passed[opp] ? seat : opp;
}


/**
 * Finish an astra that was left in flight while the defender decided.
 *
 * Both outcomes end with the fired astra spent and banned, because it WAS
 * fired either way: the only question was whether anything met it.
 */
function resolvePendingCounter(s: GameState, counter: boolean): void {
  const p = s.pendingCounter;
  if (!p) return;
  const card = getCard(p.astraCardId);
  const inst = s.instances[p.astraIid];
  s.phase = 'playing';
  s.pendingCounter = undefined;

  if (counter) {
    const defender = opponentOf(p.firer);
    const counterCard = getCard(p.counterCardId);
    const at = s.hands[defender].indexOf(p.counterHid);
    if (at >= 0) s.hands[defender].splice(at, 1);
    delete s.instances[p.counterHid];
    s.log.push({ t: 'countered', astra: card.id, by: counterCard.id, seat: defender });
    // Two great weapons meeting is not a clean cancellation.
    resolveClash(s, p.firer, card, counterCard);
    banForRun(s, counterCard);
  } else if (drawsTheAstra(s, opponentOf(p.firer))) {
    // Declined the answer, but somebody stepped in front of it anyway.
    drewOntoRod(s, card, p.firer);
  } else {
    // Let through: it resolves in full on the row it was aimed at.
    const ctx: EffectCtx = {
      state: s,
      actorOwner: p.firer,
      actorCardId: card.id,
      playedRow: p.row,
      actorIid: p.astraIid,
      chosen: [],
    };
    s.log.push({ t: 'unanswered', astra: card.id, seat: opponentOf(p.firer) });
    runCardEffects(ctx, 'onPlay');
    if (card.type === 'astra' && (card.astraTier ?? 1) >= 3) {
      afflict(s, p.firer, ADHARMA_CURSES);
    }
  }

  if (inst) delete s.instances[p.astraIid];
  banForRun(s, card);
  suspendIfWasted(s, card);
  applyImmuneDisarm(s, card.id);
  if (s.forcedWinner) {
    s.phase = 'battleEnd';
    s.winner = s.forcedWinner;
    s.log.push({ t: 'battleEnd', winner: s.forcedWinner, reason: 'astra' });
    return;
  }
  advanceTurn(s, p.firer);
}

export function reduce(state: GameState, action: Action): GameState {
  const s = clone(state);

  switch (action.type) {
    case 'ANSWER_ASTRA': {
      if (s.phase !== 'awaitingCounter' || !s.pendingCounter) return state;
      // Only the side being fired AT may answer.
      if (action.seat !== opponentOf(s.pendingCounter.firer)) return state;
      resolvePendingCounter(s, action.counter);
      return s;
    }
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

        // A NAMED ASTRA ARRIVES WITH ITS WARRIOR. Karna's spear is his, traded
        // for the armour off his own body; it has no business in a hand that
        // does not hold him. Listing it in the deck separately meant a weapon
        // could sit there with its wielder cut, which is where "why is this in
        // my deck?" came from in playtesting.
        //
        // It goes on top of the DECK, not into the hand.
        //
        // Into the hand it was free card advantage, and in a game decided by
        // card economy that is the strongest thing a card can do. Arjuna knows
        // TWO ultimates, so committing him drew you two extra cards, and he
        // measured 95.2% win when played against a 36-63% spread across the
        // three factions. On top of the deck you still get his weapon, it is
        // still his, and it costs you a draw instead of being a gift.
        // ONE weapon, not the whole armoury. A warrior who knows several
        // grants only the first, which is his signature: Arjuna the Pashupata
        // he won from Shiva, Ashwatthama the Narayana his father gave him.
        //
        // Granting all of them stacked the top of the deck with ultimates the
        // host often could not fire, so committing the man clogged his own
        // draw. Ashwatthama, who knows two, measured 36.6% win when played and
        // dragged the whole Kaurava deck to a 45.0% average card.
        // Only what he physically CARRIES. Arjuna knows the Pashupata; he
        // does not have it in a bag. Handing him the card put a
        // battle-winning weapon on top of his deck every time he was
        // committed, and he measured 64.1% win when played.
        for (const astraId of (getCard(card.id).knownAstras ?? []).filter(
          (a) => getCard(a).carried,
        )) {
          if (s.bannedThisRun.includes(astraId)) continue; // already spent for the run
          const known = (h: string) => s.instances[h]?.cardId === astraId;
          if (s.hands[seat].some(known) || s.decks[seat].some(known)) continue;
          const inst = makeInstance(astraId, seat);
          s.instances[inst.iid] = inst;
          s.decks[seat].unshift(inst.iid);
          s.log.push({ t: 'granted', seat, cardId: astraId, by: card.id });
        }
      } else if (card.type === 'boon' || card.type === 'shastra') {
        // A shastra is a NAMED WEAPON put into a warrior's hands, so it rides
        // the same attachment the boons use. Gandiva is not a spell, it is a
        // bow, and it belongs to whoever is holding it.
        const host = action.targets?.[0];
        if (host && s.instances[host]) {
          s.instances[host].boons.push(iid);
          u.attachedTo = host;
          s.log.push({ t: 'attach', boon: iid, to: host });
        }
        // Attached cards need their runtime too. This was called in the unit
        // branch ONLY, so an attached card's ability had no charges and could
        // never be spent: Krishna's counsel would have been dead on arrival,
        // and so would any named weapon we give an ability to later.
        initInstanceRuntime(s, iid);
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
          // STOP AND ASK. Answering costs the defender the card, scours BOTH
          // hosts, and may curse him. Spending all of that without consent is
          // indefensible: in playtesting a player's Brahma-Astra was spent, his
          // army scoured and his host cursed, all from a card he never chose
          // to play. The battle now suspends here and the defender decides.
          s.phase = 'awaitingCounter';
          // Hand the turn to the defender while the astra hangs in the air, so
          // every driver (UI, AI, fuzz harness) can keep asking "whose move?"
          // and get the right answer without knowing about this phase at all.
          s.activeSeat = opponentOf(seat);
          s.pendingCounter = {
            astraIid: iid,
            astraCardId: card.id,
            firer: seat,
            counterHid,
            counterCardId: getCard(s.instances[counterHid]!.cardId).id,
            row: action.row,
          };
          // The astra stays in flight: it is neither spent nor resolved until
          // the defender answers. resolvePendingCounter finishes the job.
          return s;
        } else if (card.type === 'astra' && drawsTheAstra(s, opponentOf(seat))) {
          // Unanswered, but somebody stepped in front of it. Same interception
          // as the counter path in resolvePendingCounter, and it has to live in
          // both: MOST astras have no counter in hand, so this is the ordinary
          // case and the other is the rare one.
          drewOntoRod(s, card, seat);
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
        suspendIfWasted(s, card);
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

      // KRISHNA'S ORDER. The Narayanastra is answered only by laying down
      // arms: "if you stand weaponless on the earth, this weapon will not
      // slay you" (Drona Parva CC). Passing costs you the round and lifts it.
      const lifted = s.hazards.filter((h) => h.victim === action.seat);
      if (lifted.length) {
        s.hazards = s.hazards.filter((h) => h.victim !== action.seat);
        for (const h of lifted) {
          s.log.push({ t: 'hazardLifted', kind: h.kind, seat: action.seat, reason: 'submission' });
        }
      }
      return s;
    }
  }
}
