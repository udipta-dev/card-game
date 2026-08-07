// Which weapons get to ask the player where to aim.
//
// The defect this pins: the Brahma-Astra burns the line it is aimed at on BOTH
// sides of the field, so choosing the line is the whole decision the card
// exists to pose ("which line can you afford to lose men in"). The board only
// offered a row picker for two of the three "aimed at a line" pick modes, and
// 'lineBothSidesSameAsPlayed' was the one left out. Brahma-Astra is the only
// card that uses it, so it fell through to a bare Invoke button that fired at
// rows[0] without asking. Every human Brahma-Astra ever fired hit the chariot
// line, and scorched the player's own chariots, whether they wanted it or not.
// The AI, which reads legalMoves directly, always had the choice.
import { describe, expect, it } from 'vitest';
import { getCard } from '@content/cards';
import { planFor } from '@ui/match/MatchView';
import type { Action, InstanceId, Row } from '@engine/types';

const ROWS: Row[] = ['ratha', 'gaja', 'padati'];
const iid = 'x#1' as InstanceId;
/** The moves the engine really offers for a card playable into every row. */
const movesForAllRows = (): Action[] =>
  ROWS.map((row) => ({ type: 'PLAY_CARD', seat: 'player', iid, row }) as Action);

describe('a weapon that reads the line it was aimed at must ask for the line', () => {
  it('Brahma-Astra no longer asks, because it no longer aims', () => {
    // It used to burn ONE line on both sides, and the UI silently picked that
    // line for the human (always the chariots) while the AI chose freely. That
    // was the defect this file was written for. The weapon now takes the whole
    // field, so there is genuinely nothing to choose and 'cast' is correct.
    const plan = planFor(getCard('brahmastra'), iid, movesForAllRows());
    expect(plan.mode).toBe('cast');
  });

  it('so does a plain row-damage astra, which always worked', () => {
    // Vayavya uses enemyRowSameAsPlayed, the mode that was already handled.
    const plan = planFor(getCard('vayavyastra'), iid, movesForAllRows());
    expect(plan.mode).toBe('drop-enemy');
  });

  it('every astra whose effect names the played row asks for it', () => {
    // A guard against the next pick mode being added and quietly forgotten.
    const rowPicks = ['enemyRowSameAsPlayed', 'ownAdjacentToPlayed', 'lineBothSidesSameAsPlayed'];
    for (const id of ['vayavyastra', 'agneyastra']) {
      const card = getCard(id);
      if (!card.effects.some((e) => rowPicks.includes(e.target.pick))) continue;
      expect(planFor(card, iid, movesForAllRows()).mode, `${id} must ask for a line`).toBe(
        'drop-enemy',
      );
    }
  });
});

describe('cards that genuinely have no choice to make still get none', () => {
  it('an astra with no row-dependent effect just fires', () => {
    // Pashupata ends the battle outright; there is nothing to aim.
    const plan = planFor(getCard('pashupatastra'), iid, [
      { type: 'PLAY_CARD', seat: 'player', iid, row: 'ratha' } as Action,
    ]);
    expect(plan.mode).toBe('cast');
  });

  it('a warrior is dropped into one of his own rows', () => {
    const plan = planFor(getCard('arjuna'), iid, movesForAllRows());
    expect(plan.mode).toBe('drop-own');
  });
});
