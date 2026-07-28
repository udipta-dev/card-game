// SHASTRAS: named weapons put into a warrior's hands.
//
// Distinct from astras, which are invoked by mantra and fly. The research
// surprise was how RARE these are: a sweep of all eighteen books for
// "sword/mace/discus called X" returns exactly three names. Bhima's mace,
// Duryodhana's mace, Bhishma's bow and Drona's bow are never named at all.
import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { getCard } from '@content/cards';
import { SHASTRA_CARDS } from '@content/cards/shastras';
import { makeState, hasEvent } from './helpers';

describe('a named weapon goes into a warrior’s hands', () => {
  it('attaches to the chosen warrior and strengthens him', () => {
    const s = makeState({ playerHand: ['asi'], playerBoard: { ratha: ['nakula'] } });
    const host = s.board.player.ratha[0];
    const before = s.instances[host].currentPower;
    const s1 = reduce(s, {
      type: 'PLAY_CARD',
      iid: s.hands.player[0],
      row: 'ratha',
      targets: [host],
    });
    expect(s1.instances[host].currentPower).toBe(before + 4);
    expect(hasEvent(s1, (e) => e.t === 'attach')).toBe(true);
    // It is HELD, not spent into the void: it hangs off the man.
    expect(s1.instances[host].boons.length).toBe(1);
  });

  it('Gandiva keeps its bearer supplied, which is the inexhaustible quivers', () => {
    const s = makeState({
      playerHand: ['gandiva'],
      playerBoard: { ratha: ['arjuna'] },
      playerDeck: ['bhima', 'nakula'],
    });
    const hand = s.hands.player.length;
    const s1 = reduce(s, {
      type: 'PLAY_CARD',
      iid: s.hands.player[0],
      row: 'ratha',
      targets: [s.board.player.ratha[0]],
    });
    // Gandiva itself left the hand, and a card was drawn: net level.
    expect(s1.hands.player.length).toBe(hand);
  });
});

describe('the shastra set is small and sourced, not padded', () => {
  it('is a handful of weapons, not a sprawl', () => {
    // If this ever balloons, someone has started inventing names. The epic
    // gives very few, and that is the point.
    expect(SHASTRA_CARDS.length).toBeLessThanOrEqual(12);
    expect(SHASTRA_CARDS.length).toBeGreaterThan(0);
  });

  it('every one is typed as a shastra and costs something', () => {
    for (const c of SHASTRA_CARDS) {
      expect(c.type).toBe('shastra');
      expect(getCard(c.id).provision ?? 0).toBeGreaterThan(0);
    }
  });

  it('holds no weapon the research could not source', () => {
    // Kodanda (Rama's bow is never named in Griffith), Vidyudabhi (a wiki
    // artifact), Trishula as a proper name, and Musala as Balarama's weapon
    // were all checked and rejected. None of them may creep back in.
    const refused = ['kodanda', 'vidyudabhi', 'trishula', 'musala'];
    for (const id of refused) {
      expect(SHASTRA_CARDS.some((c) => c.id === id)).toBe(false);
    }
  });
});
