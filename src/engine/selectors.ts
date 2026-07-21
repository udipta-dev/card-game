// Derived, read-only views for the AI and UI. The key one is legalMoves: it
// enumerates every action the active seat may take, including target choices.
import { getCard } from '@content/cards';
import { canPlayAstras } from './keywords';
import { isFinalRound, opponentOf, unitsOf } from './queries';
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
  if (state.phase !== 'playing' || state.activeSeat !== seat) return [];
  const moves: Action[] = [{ type: 'PASS', seat }];
  const final = isFinalRound(state);

  for (const iid of state.hands[seat]) {
    const card = getCard(state.instances[iid]!.cardId);
    if (card.type === 'astra' && !canPlayAstras(state, seat, final)) continue;

    const need = targetNeed(card);
    const filter = need === 'none' ? null : chosenFilter(card);
    const targets = filter ? candidateTargets(state, seat, filter) : [];

    for (const row of card.rows) {
      if (need === 'none') {
        moves.push({ type: 'PLAY_CARD', iid, row });
      } else {
        if (need === 'optional') moves.push({ type: 'PLAY_CARD', iid, row });
        for (const t of targets) moves.push({ type: 'PLAY_CARD', iid, row, targets: [t] });
      }
    }
  }
  return moves;
}
