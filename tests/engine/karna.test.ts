// Karna's wheel, and the wider point that a drawback the player cannot see is
// a trap rather than a decision.
import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { attemptDestroy } from '@engine/keywords';
import { allCards, getCard } from '@content/cards';
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

describe('the wheel takes what he has left', () => {
  // HE HAS NO ARMOUR ANY MORE, and the reason is both canon and the lab.
  //
  // The Kavacha-Kundala was born onto his body and he GAVE IT AWAY, to Indra
  // begging in a brahmana's disguise, in exchange for the Vasavi Shakti. He
  // fights the whole of Kurukshetra without it. The card was handing it back.
  //
  // And it was the single largest thing carrying his house. Ablation, one
  // keyword stripped at a time against the full lab: removing Karna's armour
  // moved Kaurava 58.3% -> 53.8% and the faction spread 16.7 -> 10.3, where
  // Bhishma's icchamrityu was worth 1.2, Drona's immunity 1.4 and Duryodhana's
  // adamant body 0.8. Four was the largest armour in the game, on the highest
  // power in the game, in a game whose removal is almost entirely damage.
  //
  // So the wheel now takes his STRENGTH, which is what it always meant. He
  // stepped down to lift it and asked for the pause the rules allowed him, and
  // Arjuna shot him where he stood.
  it('takes four off him in the round that decides the battle', () => {
    const s = fieldKarna(2, { player: 1, ai: 0 });
    const karna = firstOf(s, 'player', 'karna');
    expect(karna.currentPower).toBe(getCard('karna').basePower - 4);
    expect(karna.flags.has('wheel-sunk')).toBe(true);
  });

  it('and he is killable, because there is no armour left to eat the blow', () => {
    const s = fieldKarna(2, { player: 1, ai: 0 });
    const karna = firstOf(s, 'player', 'karna');
    expect(karna.counters.armor ?? 0).toBe(0);
    expect(attemptDestroy(s, 'ai', karna.iid)).toBe(true);
  });

  it('in an early round he stands at his full ten, which is the control', () => {
    const s = fieldKarna(1, { player: 0, ai: 0 });
    const karna = firstOf(s, 'player', 'karna');
    expect(karna.currentPower).toBe(getCard('karna').basePower);
    expect(karna.flags.has('wheel-sunk')).toBe(false);
  });
});

describe('a card now says when its drawback fires', () => {
  it('warns about the deciding round on Karna’s own card', () => {
    const text = rulesText(getCard('karna')).join(' ');
    expect(text).toMatch(/decides the battle/i);
  });

  it('and EVERY conditional card does, not just Karna', () => {
    // Written as a property rather than by naming a card, because the specific
    // examples keep moving: it was Bhima until his vow stopped being gated, and
    // Krishna until his kill was removed. What must hold is that a drawback the
    // player cannot see is a trap, so no gated effect may render silently.
    const gated = allCards().filter((c) => c.effects.some((e) => e.condition));
    expect(gated.length, 'there must be conditional cards to check').toBeGreaterThan(0);
    for (const c of gated) {
      const text = rulesText(c).join(' ');
      expect(text.length, `${c.id} has a condition and renders nothing`).toBeGreaterThan(0);
      // The condition is joined onto the sentence it governs, so it reads as
      // one clause rather than a dangling fragment.
      expect(text, `${c.id}`).not.toMatch(/:\s*$/);
    }
  });

  it('says nothing extra for a card with no conditions', () => {
    const text = rulesText(getCard('nakula')).join(' ');
    expect(text).not.toMatch(/decides the battle|While /i);
  });
});
