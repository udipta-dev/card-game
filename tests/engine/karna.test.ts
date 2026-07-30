// Karna's wheel, and the wider point that a drawback the player cannot see is
// a trap rather than a decision.
import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { attemptDestroy } from '@engine/keywords';
import { getCard } from '@content/cards';
import { rulesText } from '@ui/card/cardTheme';
import type { GameState } from '@engine/types';
import { firstOf, makeState } from './helpers';

function fieldKarna(round: number, wins: { player: number; ai: number }): GameState {
  const s = makeState({ playerHand: ['karna'], aiBoard: { ratha: ['arjuna'] } });
  s.round = round;
  s.roundWins = wins;
  s.activeSeat = 'player';
  return reduce(s, { type: 'PLAY_CARD', iid: firstOf(s, 'player', 'karna').iid, row: 'ratha' });
}

describe('the wheel takes his guard, not his strength', () => {
  it('leaves him at full power in the deciding round', () => {
    // He used to arrive as a ZERO here: a 10-power maharathi you must not play
    // in the round that matters, which is a trap and not a choice.
    const s = fieldKarna(2, { player: 1, ai: 0 });
    const karna = firstOf(s, 'player', 'karna');
    expect(karna.currentPower).toBe(getCard('karna').basePower);
    expect(karna.flags.has('wheel-sunk')).toBe(true);
  });

  it('but strips the armour that made him untouchable', () => {
    const s = fieldKarna(2, { player: 1, ai: 0 });
    const karna = firstOf(s, 'player', 'karna');
    expect(karna.counters.armor ?? 0, 'the Kavacha is gone').toBe(0);
    // Helpless, not weak: he can be killed now, and a moment ago he could not.
    expect(attemptDestroy(s, 'ai', karna.iid)).toBe(true);
  });

  it('and in an early round he keeps both, which is the control', () => {
    const s = fieldKarna(1, { player: 0, ai: 0 });
    const karna = firstOf(s, 'player', 'karna');
    expect(karna.currentPower).toBe(getCard('karna').basePower);
    expect(karna.counters.armor ?? 0).toBeGreaterThan(0);
    expect(attemptDestroy(s, 'ai', karna.iid), 'armour eats the first blow').toBe(false);
  });
});

describe('a card now says when its drawback fires', () => {
  it('warns about the deciding round on Karna’s own card', () => {
    const text = rulesText(getCard('karna')).join(' ');
    expect(text).toMatch(/decides the battle/i);
  });

  it('and did not before: no card in the game showed a condition', () => {
    // Bhima's vow is gated on the target being armoured, and read as an
    // unconditional "slays a chosen foe" until conditions became visible.
    expect(rulesText(getCard('bhima')).join(' ')).toMatch(/armoured foe/i);
  });

  it('says nothing extra for a card with no conditions', () => {
    const text = rulesText(getCard('nakula')).join(' ');
    expect(text).not.toMatch(/decides the battle|While /i);
  });
});
