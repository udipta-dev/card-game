import { getCard } from '@content/cards';
import type { GameEvent, GameState, Seat } from '@engine/types';

const who = (seat: Seat) => (seat === 'player' ? 'You' : 'The enemy');
const nameOf = (state: GameState, iid: string) => {
  const u = state.instances[iid];
  return u ? getCard(u.cardId).name : 'a warrior';
};

/** Human-readable one-liner for an event, or null to hide it from the feed. */
export function eventText(state: GameState, ev: GameEvent): string | null {
  switch (ev.t) {
    case 'play':
      return `${who(ev.seat)} played ${getCard(ev.cardId).name}.`;
    case 'pass':
      return `${who(ev.seat)} passed.`;
    case 'destroy':
      return `${getCard(ev.cardId).name} was slain.`;
    case 'preventDestroy': {
      const reasons: Record<string, string> = {
        icchamrityu: `${nameOf(state, ev.iid)} cannot yet be slain, Icchamrityu.`,
        immuneUntilPlayed: `${nameOf(state, ev.iid)} stands immune.`,
        armor: `${nameOf(state, ev.iid)}'s armour held.`,
        'diamond-body': `${nameOf(state, ev.iid)}'s diamond body turned the blow.`,
      };
      return reasons[ev.reason] ?? null;
    }
    case 'redirected':
      return `${getCard(ev.source).name} was turned aside by Krishna.`;
    case 'countered':
      return `${getCard(ev.astra).name} was answered by ${getCard(ev.by).name}.`;
    case 'setPower':
      return null;
    case 'roundEnd': {
      if (ev.winner === 'tie') return `Round ${ev.round} drawn (${ev.scores.player}–${ev.scores.ai}).`;
      return `Round ${ev.round} to ${ev.winner === 'player' ? 'you' : 'the enemy'} (${ev.scores.player}–${ev.scores.ai}).`;
    }
    case 'ban':
      return `${getCard(ev.cardId).name} is spent for the rest of the run.`;
    default:
      return null;
  }
}
