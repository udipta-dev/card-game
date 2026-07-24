// The price of the great weapons. These are the rules that make an astra feel
// like an astra rather than a big damage card: it fires once, it costs you
// something, and the worst of them take your own host with them.
import { describe, expect, it } from 'vitest';
import { reduce, isLegalPlay } from '@engine/reducer';
import { unitsOf } from '@engine/queries';
import { firstOf, hasEvent, makeState } from './helpers';

describe('a great astra fires only once', () => {
  it('bans itself for the run and is then unplayable', () => {
    const s = makeState({
      playerHand: ['brahmastra', 'brahmastra'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { gaja: ['dushasana'] },
    });
    const first = s.hands.player[0];
    const second = s.hands.player[1];
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: first, row: 'gaja' });

    expect(s1.bannedThisRun).toContain('brahmastra');
    // The second copy is now dead in hand: the arsenal is empty.
    expect(isLegalPlay(s1, 'player', second, 'gaja')).toBe(false);
  });

  it('leaves elemental astras alone, they are common enough to carry', () => {
    const s = makeState({
      playerHand: ['agneyastra'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { gaja: ['dushasana'] },
    });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'gaja' });
    expect(s1.bannedThisRun).not.toContain('agneyastra');
  });
});

describe('Brahmastra is an act of adharma', () => {
  it('curses the one who looses it, not the one it strikes', () => {
    const s = makeState({
      playerHand: ['brahmastra'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { gaja: ['dushasana'] },
    });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'gaja' });
    expect(s1.curses.player.length).toBe(1);
    expect(s1.curses.ai.length).toBe(0);
    expect(hasEvent(s1, (e) => e.t === 'afflict' && e.seat === 'player')).toBe(true);
  });
});

describe('Brahmashirsha is utter destruction', () => {
  it('takes both hosts, including the wielder’s own army', () => {
    const s = makeState({
      playerHand: ['brahmashirsha'],
      playerBoard: { ratha: ['arjuna'], gaja: ['bhima'] },
      aiBoard: { ratha: ['dushasana'], gaja: ['jayadratha'] },
    });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });

    // Nobody who can die is left standing on either side.
    expect(unitsOf(s1, 'ai').length).toBe(0);
    expect(unitsOf(s1, 'player').length).toBe(0);
    // And the firer wears the consequence.
    expect(s1.curses.player.length).toBe(1);
  });

  it('the deathless walk out of it, as they did the Sauptika night', () => {
    const s = makeState({
      playerHand: ['brahmashirsha'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { ratha: ['ashwatthama'], gaja: ['dushasana'] },
    });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });

    const survivors = unitsOf(s1, 'ai').map((u) => u.cardId);
    expect(survivors).toContain('ashwatthama'); // chiranjivi
    expect(survivors).not.toContain('dushasana');
  });
});

describe('Pashupatastra wins, but at a price', () => {
  it('ends the battle and tears warriors out of your own deck forever', () => {
    const s = makeState({
      playerHand: ['pashupatastra'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { ratha: ['dushasana'] },
      playerDeck: ['bhima', 'nakula', 'sahadeva', 'satyaki', 'drupada', 'virata'],
    });
    const deckBefore = s.decks.player.length;
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });

    expect(s1.winner).toBe('player');
    expect(s1.phase).toBe('battleEnd');
    // Five warriors are gone from the deck, and gone for the run.
    expect(s1.decks.player.length).toBe(deckBefore - 5);
    expect(hasEvent(s1, (e) => e.t === 'burn' && e.seat === 'player')).toBe(true);
    const burn = s1.log.find((e) => e.t === 'burn');
    expect(burn && burn.t === 'burn' && burn.cardIds.length).toBe(5);
    for (const id of (burn as { cardIds: string[] }).cardIds) {
      expect(s1.bannedThisRun).toContain(id);
    }
  });
});
