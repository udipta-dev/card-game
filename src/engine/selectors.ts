// Derived, read-only views for the AI and UI. The key one is legalMoves: it
// enumerates every action the active seat may take, including target choices.
import { getCard } from '@content/cards';
import { opponentOf, unitsOf } from './queries';
import { isLegalAbility, isLegalPlay } from './reducer';
import type { Action, Card, GameState, InstanceId, Seat, UnitFilter } from './types';

/** The `chosen` selector filter this card uses, if any. */
function chosenFilter(card: Card): UnitFilter | null {
  for (const eff of card.effects) {
    if (eff.target.pick === 'chosen') return eff.target.filter;
  }
  // Boons attach to a unit even if their effect selector is 'self'-like.
  if (card.type === 'boon') return { side: 'own' };
  return null;
}

type TargetNeed = 'none' | 'optional' | 'required';

function targetNeed(card: Card): TargetNeed {
  const hasChosen = card.effects.some((e) => e.target.pick === 'chosen') || card.type === 'boon';
  if (!hasChosen) return 'none';
  // Boons and targeted astras must have a target; unit abilities are optional.
  if (card.type === 'boon' || card.type === 'astra') return 'required';
  return 'optional';
}

function candidateTargets(state: GameState, seat: Seat, filter: UnitFilter): InstanceId[] {
  const enemy = opponentOf(seat);
  const seats: Seat[] =
    filter.side === 'own' ? [seat] : filter.side === 'enemy' ? [enemy] : ['player', 'ai'];
  const out: InstanceId[] = [];
  for (const s of seats) {
    for (const u of unitsOf(state, s)) {
      if (filter.rows && u.row && !filter.rows.includes(u.row)) continue;
      out.push(u.iid);
    }
  }
  return out;
}

/** Every legal action for the active seat (PASS always included). */
export function legalMoves(state: GameState, seat: Seat): Action[] {
  // An astra is in flight and this seat is the one it is aimed at. Answering
  // or letting it through are the only two things anyone can do right now.
  if (state.phase === 'awaitingCounter' && state.pendingCounter) {
    if (seat !== opponentOf(state.pendingCounter.firer)) return [];
    return [
      { type: 'ANSWER_ASTRA', seat, counter: true },
      { type: 'ANSWER_ASTRA', seat, counter: false },
    ];
  }
  if (state.phase !== 'playing' || state.activeSeat !== seat) return [];
  const moves: Action[] = [{ type: 'PASS', seat }];

  // The once-a-round trade, while it is still a mulligan and not an
  // information play. Listed after PASS and before the plays so a greedy
  // argmax that ties never prefers it by accident.
  if (state.roundSwap[seat] && !state.playedThisRound[seat] && state.decks[seat].length > 0) {
    for (const iid of state.hands[seat]) moves.push({ type: 'ROUND_SWAP', seat, iid });
  }


  for (const iid of state.hands[seat]) {
    const card = getCard(state.instances[iid]!.cardId);

    const need = targetNeed(card);
    const filter = need === 'none' ? null : chosenFilter(card);
    const targets = filter ? candidateTargets(state, seat, filter) : [];

    for (const row of card.rows) {
      // Single source of truth: the reducer decides what is legal. Enumerating
      // with a second copy of the rules is how a "legal" move becomes a no-op.
      if (!isLegalPlay(state, seat, iid, row)) continue;
      if (need === 'none') {
        moves.push({ type: 'PLAY_CARD', iid, row });
      } else {
        if (need === 'optional') moves.push({ type: 'PLAY_CARD', iid, row });
        for (const t of targets) moves.push({ type: 'PLAY_CARD', iid, row, targets: [t] });
      }
    }
  }

  // A fielded warrior may spend the turn on his own skill at arms instead. So
  // may anything RIDING with him: this used to walk board units only, and an
  // attached card is not one, so Krishna's counsel was never offered to any
  // driver at all. It was legal in the reducer and invisible to the AI, which
  // is the worst combination, because the sim then measures a card that can
  // never be used and reports the design as bad rather than unreachable.
  const actors = unitsOf(state, seat).flatMap((u) => [
    u.iid,
    ...u.boons.filter((b) => state.instances[b]?.owner === seat),
  ]);
  for (const iid of actors) {
    if (!isLegalAbility(state, seat, iid)) continue;
    const ability = getCard(state.instances[iid]!.cardId).ability!;
    if (ability.target.pick === 'chosen') {
      for (const t of candidateTargets(state, seat, ability.target.filter)) {
        moves.push({ type: 'USE_ABILITY', iid, targets: [t] });
      }
    } else {
      moves.push({ type: 'USE_ABILITY', iid });
    }
  }
  return moves;
}
