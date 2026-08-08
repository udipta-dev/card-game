import { getCard } from '@content/cards';
import type { GameEvent, GameState, Row, Seat } from '@engine/types';

const who = (seat: Seat) => (seat === 'player' ? 'You' : 'The enemy');
/** Plain words for a rank, so the feed never makes the player learn a schema. */
const ROW_WORD: Record<Row, string> = {
  ratha: 'chariots',
  gaja: 'elephants',
  padati: 'infantry',
};
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
    case 'roundSwap':
      // Name the card only for the player's own trade. The enemy's goes back
      // unseen, exactly as a hidden hand demands.
      return ev.seat === 'player'
        ? `You traded ${getCard(ev.cardId).name} back to the deck.`
        : 'The enemy traded a card back to the deck.';
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
      // NOT "by Krishna". A weapon can be turned aside by more than one thing
      // and the engine emits the same event for all of them: the Vaishnava is
      // refused both by Krishna guarding the mark AND by Prahlada merely
      // standing in the host it was fired into. Naming Krishna outright told
      // the player a lie whenever it was Prahlada who saved them.
      return `${getCard(ev.source).name} found no mark, and passed harmlessly by.`;
    case 'countered':
      return `${getCard(ev.astra).name} was answered by ${getCard(ev.by).name}.`;
    // WHAT ACTUALLY HAPPENED TO THE MEN. None of these had a line, so the feed
    // could narrate a weapon being fired and then say nothing at all about the
    // result. Firing a wind astra into a rank and reading no consequence is
    // indistinguishable from the weapon doing nothing, which is exactly how it
    // was reported: "I fired it at a row and nothing happened."
    case 'damage':
      return `${nameOf(state, ev.iid)} takes ${ev.amount} (now ${ev.power}).`;
    case 'buff':
      return `${nameOf(state, ev.iid)} is raised ${ev.amount} (now ${ev.power}).`;
    case 'debuffRow': {
      // The action is NAMED debuffRow but carries both signs: plenty of cards
      // use it to raise their own line. Reading the name instead of the number
      // reported a +2 rally as "the enemy chariots wither".
      const whose = ev.seat === 'player' ? 'Your' : 'The enemy';
      return ev.amount >= 0
        ? `${whose} ${ROW_WORD[ev.row]} stand firmer (+${ev.amount}).`
        : `${whose} ${ROW_WORD[ev.row]} wither (${ev.amount}).`;
    }
    case 'drewAstra':
      // Ghatotkacha steps in front of it. Previously silent, so the weapon just
      // vanished and a warrior died with no stated connection between the two.
      return `${getCard(ev.cardId).name} drew ${getCard(ev.astra).name} onto himself.`;
    case 'hazardLifted':
      return 'The weapon hanging over the field is lifted.';
    case 'granted':
      return ev.seat === 'player'
        ? `${getCard(ev.by).name} carries ${getCard(ev.cardId).name} into your deck.`
        : null;
    case 'discard':
      return ev.seat === 'player' ? `You lost ${getCard(ev.cardId).name} from your hand.` : null;
    case 'dismount':
      return `${getCard(ev.cardId).name} is unhorsed.`;
    case 'stripped':
      return `${getCard(ev.cardId).name} stands unprotected.`;
    case 'setPower':
      return null;
    case 'roundEnd': {
      if (ev.winner === 'tie') return `Round ${ev.round} drawn (${ev.scores.player}–${ev.scores.ai}).`;
      return `Round ${ev.round} to ${ev.winner === 'player' ? 'you' : 'the enemy'} (${ev.scores.player}–${ev.scores.ai}).`;
    }
    case 'ban':
      return `${getCard(ev.cardId).name} is spent for the rest of the run.`;

    // ---- Everything below rendered NOTHING ------------------------------
    // Sixteen event types fell through to the default and vanished. The engine
    // was raising them, the log was dropping them, and the player watched
    // curses land, weapons clash and warriors be barred from the field with no
    // line to explain any of it. An ability fired and the feed stayed silent.
    case 'ability':
      return `${getCard(ev.cardId).name} used ${ev.name}.`;
    case 'valour':
      return `${getCard(ev.cardId).name} takes the field: ${ev.name}.`;
    case 'armour':
      return `${getCard(ev.cardId).name} is clothed in armour (${ev.amount}).`;
    case 'afflict':
      return `${who(ev.seat)} ${ev.seat === 'player' ? 'are' : 'is'} cursed: ${ev.name}. ${ev.text}`;
    case 'attach': {
      const boon = nameOf(state, ev.boon);
      return `${boon} goes to ${nameOf(state, ev.to)}.`;
    }
    case 'clash':
      return (
        `${getCard(ev.astra).name} meets ${getCard(ev.against).name}. ` +
        `The blast scours both hosts for ${ev.blast}.`
      );
    case 'cleanse':
      return ev.cleared > 0
        ? `${who(ev.seat)} shed ${ev.cleared} affliction${ev.cleared === 1 ? '' : 's'}.`
        : null;
    case 'denied':
      // Own side only. Naming a card in the enemy's hand would leak it.
      return ev.seat === 'player'
        ? `${getCard(ev.cardId).name} cannot be committed this round.`
        : 'A man in the enemy host cannot be committed this round.';
    case 'draw':
      return ev.seat === 'player' ? `You drew ${getCard(ev.cardId).name}.` : null;
    case 'burn':
      return ev.cardIds.length
        ? `${who(ev.seat)} lost ${ev.cardIds.length} card${ev.cardIds.length === 1 ? '' : 's'} off the deck.`
        : null;
    case 'hazard':
      return `A weapon hangs over ${ev.seat === 'player' ? 'your' : 'the enemy'} host.`;
    case 'mulligan':
      return ev.count > 0
        ? `${who(ev.seat)} threw back ${ev.count} card${ev.count === 1 ? '' : 's'}.`
        : null;
    case 'suspended':
      return `${getCard(ev.cardId).name} was wasted, and may yet be recovered.`;
    case 'unanswered':
      return `${getCard(ev.astra).name} was not answered.`;
    case 'battleEnd':
      return ev.winner === 'player' ? 'You hold the field.' : 'The field is lost.';
    // Deliberately silent: 'roundStart' is drawn as a banner, and 'flag' is the
    // raw mechanism behind lines that are already reported in their own words.
    case 'roundStart':
    case 'flag':
      return null;
    default:
      return null;
  }
}
